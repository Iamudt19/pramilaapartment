import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/rbac';
import { logAudit } from '@/lib/audit';
import { sendNotification } from '@/lib/notifications';

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth(req, ['SECURITY_GUARD', 'SUPER_ADMIN', 'PROPERTY_MANAGER']);
    if ('error' in auth) return auth.error;

    const data = await req.json();
    const { requestId, vehicleNumber, photoUrl, gateNumber, notes } = data;

    if (!requestId) {
      return NextResponse.json({ success: false, error: { message: 'Visitor Request ID required' } }, { status: 400 });
    }

    const request = await prisma.visitorRequest.findUnique({
      where: { id: requestId },
      include: {
        tenant: { include: { user: true } },
        flat: true,
        pass: true,
      },
    });

    if (!request) {
      return NextResponse.json({ success: false, error: { message: 'Visitor request not found' } }, { status: 404 });
    }

    if (request.status === 'CHECKED_IN') {
      return NextResponse.json({ success: false, error: { message: 'Visitor is already checked in' } }, { status: 400 });
    }

    if (request.status !== 'APPROVED') {
      return NextResponse.json(
        { success: false, error: { message: `Cannot check in visitor with status: ${request.status}` } },
        { status: 400 }
      );
    }

    // 1. Record Entry
    const entry = await prisma.visitorEntry.create({
      data: {
        visitorRequestId: request.id,
        securityGuardId: auth.session?.staffId || auth.session?.id || 'GATE_GUARD_1',
        securityGuardName: auth.session?.name || 'Security Officer',
        vehicleNumber: vehicleNumber || request.vehicleNumber,
        photoUrl,
        gateNumber: gateNumber || 'Main Gate 1',
        notes,
      },
    });

    // 2. Update Request Status
    const updated = await prisma.visitorRequest.update({
      where: { id: request.id },
      data: { status: 'CHECKED_IN' },
    });

    // 3. Notify Tenant that their visitor has arrived and checked in
    if (request.tenant?.userId) {
      await sendNotification({
        userId: request.tenant.userId,
        title: 'Visitor Arrived at Gate',
        message: `${request.visitorName} has been verified and entered via ${gateNumber || 'Main Gate 1'}.`,
        eventType: 'VISITOR_CHECKED_IN',
        link: '/portal/tenant/visitors',
      });
    }

    await logAudit({
      userId: auth.session?.id,
      actorName: auth.session?.name || 'Security Guard',
      action: 'VISITOR_CHECK_IN',
      resource: 'VisitorRequest',
      resourceId: request.id,
      newValue: { visitorName: request.visitorName, gateNumber: gateNumber || 'Main Gate 1' },
    });

    return NextResponse.json({ success: true, visitorRequest: updated, entry });
  } catch (err: any) {
    console.error('Check-in error:', err);
    return NextResponse.json({ success: false, error: { message: err.message } }, { status: 500 });
  }
}
