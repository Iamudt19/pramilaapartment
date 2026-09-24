import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/rbac';
import { generateSecurePassToken } from '@/lib/qr';
import { logAudit } from '@/lib/audit';
import { sendNotification } from '@/lib/notifications';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await requireAuth(req, ['SUPER_ADMIN', 'PROPERTY_MANAGER']);
    if ('error' in auth) return auth.error;

    const request = await prisma.visitorRequest.findUnique({
      where: { id: params.id },
      include: {
        tenant: { include: { user: true } },
        flat: true,
        pass: true,
      },
    });

    if (!request) {
      return NextResponse.json({ success: false, error: { message: 'Visitor request not found' } }, { status: 404 });
    }

    const arrivalDate = request.expectedArrival ? new Date(request.expectedArrival) : new Date();
    const departureDate = request.expectedDeparture
      ? new Date(request.expectedDeparture)
      : new Date(arrivalDate.getTime() + (request.durationHours || 4) * 60 * 60 * 1000);

    const updated = await prisma.visitorRequest.update({
      where: { id: params.id },
      data: {
        status: 'APPROVED',
        reviewedBy: auth.session?.name || 'Administrator',
        reviewedAt: new Date(),
      },
    });

    let pass = request.pass;
    if (!pass) {
      const passCode = generateSecurePassToken();
      const validFrom = new Date(arrivalDate.getTime() - 60 * 60 * 1000);
      const validUntil = new Date(departureDate.getTime() + 2 * 60 * 60 * 1000);

      pass = await prisma.visitorPass.create({
        data: {
          visitorRequestId: request.id,
          passCode,
          validFrom,
          validUntil,
          isActive: true,
        },
      });
    } else {
      pass = await prisma.visitorPass.update({
        where: { id: pass.id },
        data: { isActive: true },
      });
    }

    // Notify Tenant safely
    if (request.tenant?.userId) {
      await sendNotification({
        userId: request.tenant.userId,
        title: 'Visitor Pass Approved',
        message: `Visitor pass for ${request.visitorName} to Flat ${request.flat?.flatNumber || ''} has been approved. Digital QR pass is now active.`,
        eventType: 'VISITOR_APPROVED',
        link: '/portal/tenant/visitors',
        sendEmail: true,
      });
    }

    await logAudit({
      userId: auth.session?.id,
      actorName: auth.session?.name || 'Administrator',
      action: 'VISITOR_APPROVED',
      resource: 'VisitorRequest',
      resourceId: request.id,
      newValue: { visitorName: request.visitorName, passCode: pass?.passCode },
    });

    return NextResponse.json({ success: true, visitorRequest: updated, pass });
  } catch (err: any) {
    console.error('Approve visitor error:', err);
    return NextResponse.json({ success: false, error: { message: err.message } }, { status: 500 });
  }
}
