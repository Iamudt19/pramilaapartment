import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/rbac';
import { logAudit } from '@/lib/audit';

// PATCH /api/inquiries/[id] - Update inquiry status or notes
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth(req, ['SUPER_ADMIN', 'PROPERTY_MANAGER', 'ACCOUNTANT']);
    if ('error' in auth) return auth.error;

    const { id } = await params;
    const body = await req.json();
    const { status, notes } = body;

    const existing = await prisma.leadInquiry.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ success: false, error: { message: 'Inquiry not found' } }, { status: 404 });
    }

    const updated = await prisma.leadInquiry.update({
      where: { id },
      data: {
        ...(status ? { status } : {}),
        ...(notes !== undefined ? { notes } : {}),
      },
    });

    await logAudit({
      actorName: auth.session.name,
      action: 'LEAD_INQUIRY_UPDATED',
      resource: 'LeadInquiry',
      resourceId: id,
      oldValue: JSON.stringify({ status: existing.status, notes: existing.notes }),
      newValue: JSON.stringify({ status: updated.status, notes: updated.notes }),
    });

    return NextResponse.json({ success: true, inquiry: updated });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { message: err.message || 'Failed to update inquiry' } },
      { status: 500 }
    );
  }
}

// DELETE /api/inquiries/[id] - Delete inquiry
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth(req, ['SUPER_ADMIN', 'PROPERTY_MANAGER']);
    if ('error' in auth) return auth.error;

    const { id } = await params;
    await prisma.leadInquiry.delete({ where: { id } });

    await logAudit({
      actorName: auth.session.name,
      action: 'LEAD_INQUIRY_DELETED',
      resource: 'LeadInquiry',
      resourceId: id,
    });

    return NextResponse.json({ success: true, message: 'Inquiry deleted' });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { message: err.message || 'Failed to delete inquiry' } },
      { status: 500 }
    );
  }
}
