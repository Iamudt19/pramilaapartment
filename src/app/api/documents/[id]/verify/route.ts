import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/rbac';
import { logAudit } from '@/lib/audit';
import { sendNotification } from '@/lib/notifications';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await requireAuth(req, ['SUPER_ADMIN', 'PROPERTY_MANAGER']);
    if ('error' in auth) return auth.error;

    const { status, rejectionReason } = await req.json();

    const doc = await prisma.tenantDocument.findUnique({
      where: { id: params.id },
      include: { tenant: { include: { user: true } } },
    });

    if (!doc) {
      return NextResponse.json({ success: false, error: { message: 'Document not found' } }, { status: 404 });
    }

    const updated = await prisma.tenantDocument.update({
      where: { id: params.id },
      data: {
        status: status || 'VERIFIED',
        verifiedAt: new Date(),
        verifiedBy: auth.session.name,
        rejectionReason: status === 'REJECTED' ? rejectionReason : null,
      },
    });

    await sendNotification({
      userId: doc.tenant.userId,
      title: `Document ${status === 'VERIFIED' ? 'Verified' : 'Rejected'}`,
      message: `Your uploaded document "${doc.title}" has been ${status.toLowerCase()} by management.`,
      eventType: 'DOCUMENT_VERIFIED',
      link: '/portal/tenant/profile',
    });

    await logAudit({
      userId: auth.session.id,
      actorName: auth.session.name,
      action: `DOCUMENT_${status}`,
      resource: 'TenantDocument',
      resourceId: doc.id,
      newValue: { status, rejectionReason },
    });

    return NextResponse.json({ success: true, document: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: { message: err.message } }, { status: 500 });
  }
}
