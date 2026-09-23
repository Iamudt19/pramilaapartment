import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/rbac';
import { logAudit } from '@/lib/audit';

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req);
    if ('error' in auth) return auth.error;

    const notices = await prisma.notice.findMany({
      orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json({ success: true, notices });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: { message: err.message } }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth(req, ['SUPER_ADMIN', 'PROPERTY_MANAGER']);
    if ('error' in auth) return auth.error;

    const data = await req.json();
    const { title, content, category, targetAudience, isPinned, attachmentUrl, expiryDate } = data;

    const property = await prisma.property.findFirst();
    if (!property) {
      return NextResponse.json({ success: false, error: { message: 'Property not configured' } }, { status: 404 });
    }

    const notice = await prisma.notice.create({
      data: {
        propertyId: property.id,
        title,
        content,
        category: category || 'GENERAL',
        targetAudience: targetAudience || 'ALL',
        isPinned: Boolean(isPinned),
        attachmentUrl,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        createdBy: auth.session.name,
      },
    });

    await logAudit({
      userId: auth.session.id,
      actorName: auth.session.name,
      action: 'NOTICE_PUBLISHED',
      resource: 'Notice',
      resourceId: notice.id,
      newValue: { title, category },
    });

    return NextResponse.json({ success: true, notice });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: { message: err.message } }, { status: 500 });
  }
}
