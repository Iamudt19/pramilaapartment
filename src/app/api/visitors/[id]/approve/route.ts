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

    const updated = await prisma.visitorRequest.update({
      where: { id: params.id },
      data: {
        status: 'APPROVED',
        reviewedBy: auth.session.name,
        reviewedAt: new Date(),
      },
    });

    let pass = request.pass;
    if (!pass) {
      const passCode = generateSecurePassToken();
      const validFrom = new Date(request.expectedArrival.getTime() - 60 * 60 * 1000);
      const validUntil = new Date(request.expectedDeparture.getTime() + 2 * 60 * 60 * 1000);

      pass = await prisma.visitorPass.create({
        data: {
          visitorRequestId: request.id,
          passCode,
          validFrom,
          validUntil,
          isActive: true,
        },
      });
    }

    // Notify Tenant
    await sendNotification({
      userId: request.tenant.userId,
      title: 'Visitor Pass Approved',
      message: `Visitor pass for ${request.visitorName} to Flat ${request.flat.flatNumber} has been approved. Digital QR pass is now active.`,
      eventType: 'VISITOR_APPROVED',
      link: '/portal/tenant/visitors',
      sendEmail: true,
    });

    await logAudit({
      userId: auth.session.id,
      actorName: auth.session.name,
      action: 'VISITOR_APPROVED',
      resource: 'VisitorRequest',
      resourceId: request.id,
      newValue: { visitorName: request.visitorName, passCode: pass.passCode },
    });

    return NextResponse.json({ success: true, visitorRequest: updated, pass });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: { message: err.message } }, { status: 500 });
  }
}
