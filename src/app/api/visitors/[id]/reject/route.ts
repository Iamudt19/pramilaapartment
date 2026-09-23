import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/rbac';
import { logAudit } from '@/lib/audit';
import { sendNotification } from '@/lib/notifications';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await requireAuth(req, ['SUPER_ADMIN', 'PROPERTY_MANAGER']);
    if ('error' in auth) return auth.error;

    const { rejectionReason } = await req.json();

    const request = await prisma.visitorRequest.findUnique({
      where: { id: params.id },
      include: { tenant: { include: { user: true } }, flat: true },
    });

    if (!request) {
      return NextResponse.json({ success: false, error: { message: 'Visitor request not found' } }, { status: 404 });
    }

    const updated = await prisma.visitorRequest.update({
      where: { id: params.id },
      data: {
        status: 'REJECTED',
        rejectionReason: rejectionReason || 'Visitor entry not permitted by management',
        reviewedBy: auth.session.name,
        reviewedAt: new Date(),
      },
    });

    await sendNotification({
      userId: request.tenant.userId,
      title: 'Visitor Request Declined',
      message: `Visitor request for ${request.visitorName} was declined by management. Reason: ${rejectionReason || 'Policy check'}`,
      eventType: 'VISITOR_REJECTED',
      sendEmail: true,
    });

    await logAudit({
      userId: auth.session.id,
      actorName: auth.session.name,
      action: 'VISITOR_REJECTED',
      resource: 'VisitorRequest',
      resourceId: request.id,
      newValue: { rejectionReason },
    });

    return NextResponse.json({ success: true, visitorRequest: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: { message: err.message } }, { status: 500 });
  }
}
