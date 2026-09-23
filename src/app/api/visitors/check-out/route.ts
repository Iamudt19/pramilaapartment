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
    const { requestId, notes } = data;

    if (!requestId) {
      return NextResponse.json({ success: false, error: { message: 'Visitor Request ID required' } }, { status: 400 });
    }

    const request = await prisma.visitorRequest.findUnique({
      where: { id: requestId },
      include: {
        tenant: { include: { user: true } },
        flat: true,
        entries: { orderBy: { entryTime: 'desc' }, take: 1 },
      },
    });

    if (!request) {
      return NextResponse.json({ success: false, error: { message: 'Visitor request not found' } }, { status: 404 });
    }

    if (request.status !== 'CHECKED_IN') {
      return NextResponse.json(
        { success: false, error: { message: 'Visitor is not currently checked in' } },
        { status: 400 }
      );
    }

    const entryTime = request.entries[0]?.entryTime || request.expectedArrival;
    const now = new Date();
    const durationMinutes = Math.max(1, Math.round((now.getTime() - new Date(entryTime).getTime()) / (1000 * 60)));

    // 1. Record Exit
    const exit = await prisma.visitorExit.create({
      data: {
        visitorRequestId: request.id,
        securityGuardId: auth.session.staffId || auth.session.id,
        securityGuardName: auth.session.name,
        exitTime: now,
        durationMinutes,
        notes,
      },
    });

    // 2. Update Request Status & Deactivate Pass
    const updated = await prisma.visitorRequest.update({
      where: { id: request.id },
      data: { status: 'CHECKED_OUT' },
    });

    await prisma.visitorPass.updateMany({
      where: { visitorRequestId: request.id },
      data: { isActive: false },
    });

    // 3. Notify Tenant
    await sendNotification({
      userId: request.tenant.userId,
      title: 'Visitor Checked Out',
      message: `${request.visitorName} has checked out. Total visit duration: ${Math.floor(durationMinutes / 60)}h ${durationMinutes % 60}m.`,
      eventType: 'VISITOR_CHECKED_OUT',
      link: '/portal/tenant/visitors',
    });

    await logAudit({
      userId: auth.session.id,
      actorName: auth.session.name,
      action: 'VISITOR_CHECK_OUT',
      resource: 'VisitorRequest',
      resourceId: request.id,
      newValue: { visitorName: request.visitorName, durationMinutes },
    });

    return NextResponse.json({ success: true, visitorRequest: updated, exit });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: { message: err.message } }, { status: 500 });
  }
}
