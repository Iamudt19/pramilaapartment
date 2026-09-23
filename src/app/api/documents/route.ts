import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/rbac';
import { logAudit } from '@/lib/audit';

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req);
    if ('error' in auth) return auth.error;

    const where: any = {};
    if (auth.session.role === 'TENANT') {
      where.tenantId = auth.session.tenantId;
    }

    const documents = await prisma.tenantDocument.findMany({
      where,
      include: {
        tenant: {
          include: {
            user: true,
            tenancies: {
              where: { status: 'ACTIVE' },
              include: { flat: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, documents });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: { message: err.message } }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth(req, ['TENANT', 'SUPER_ADMIN', 'PROPERTY_MANAGER']);
    if ('error' in auth) return auth.error;

    const data = await req.json();
    const { tenantId, documentType, title, fileUrl, expiryDate } = data;

    const targetTenantId = auth.session.role === 'TENANT' ? auth.session.tenantId : tenantId;

    if (!targetTenantId || !documentType || !fileUrl) {
      return NextResponse.json(
        { success: false, error: { message: 'Tenant ID, Document Type, and File are required' } },
        { status: 400 }
      );
    }

    const doc = await prisma.tenantDocument.create({
      data: {
        tenantId: targetTenantId,
        documentType,
        title: title || documentType,
        fileUrl,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        status: 'PENDING',
      },
    });

    await logAudit({
      userId: auth.session.id,
      actorName: auth.session.name,
      action: 'DOCUMENT_UPLOADED',
      resource: 'TenantDocument',
      resourceId: doc.id,
      newValue: { documentType, title },
    });

    return NextResponse.json({ success: true, document: doc });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: { message: err.message } }, { status: 500 });
  }
}
