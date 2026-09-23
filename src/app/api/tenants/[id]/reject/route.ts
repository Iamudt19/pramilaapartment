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

    const tenant = await prisma.tenant.findUnique({
      where: { id: params.id },
      include: { user: true },
    });

    if (!tenant) {
      return NextResponse.json({ success: false, error: { message: 'Tenant not found' } }, { status: 404 });
    }

    const updated = await prisma.tenant.update({
      where: { id: params.id },
      data: {
        status: 'REJECTED',
        rejectionReason: rejectionReason || 'Application criteria not met',
      },
    });

    await sendNotification({
      userId: tenant.userId,
      title: 'Tenant Application Update',
      message: `Your tenant application was not approved. Reason: ${rejectionReason || 'Application criteria not met'}`,
      eventType: 'TENANT_REJECTED',
      sendEmail: true,
    });

    await logAudit({
      userId: auth.session.id,
      actorName: auth.session.name,
      action: 'TENANT_APPLICATION_REJECTED',
      resource: 'Tenant',
      resourceId: tenant.id,
      newValue: { rejectionReason },
    });

    return NextResponse.json({ success: true, tenant: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: { message: err.message } }, { status: 500 });
  }
}
