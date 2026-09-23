import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/rbac';
import { logAudit } from '@/lib/audit';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await requireAuth(req, ['SUPER_ADMIN', 'PROPERTY_MANAGER']);
    if ('error' in auth) return auth.error;

    const { waiverReason } = await req.json();

    const penalty = await prisma.penalty.findUnique({
      where: { id: params.id },
    });

    if (!penalty) {
      return NextResponse.json({ success: false, error: { message: 'Penalty not found' } }, { status: 404 });
    }

    const updated = await prisma.penalty.update({
      where: { id: params.id },
      data: {
        status: 'WAIVED',
        waiverReason: waiverReason || 'Waived upon review by management',
        waivedBy: auth.session.name,
      },
    });

    await logAudit({
      userId: auth.session.id,
      actorName: auth.session.name,
      action: 'PENALTY_WAIVED',
      resource: 'Penalty',
      resourceId: penalty.id,
      newValue: { waiverReason, waivedBy: auth.session.name },
    });

    return NextResponse.json({ success: true, penalty: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: { message: err.message } }, { status: 500 });
  }
}
