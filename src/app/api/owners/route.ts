import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/rbac';
import { logAudit } from '@/lib/audit';

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req, ['SUPER_ADMIN', 'PROPERTY_MANAGER', 'ACCOUNTANT']);
    if ('error' in auth) return auth.error;

    const owners = await prisma.owner.findMany({
      include: {
        flats: {
          include: {
            building: true,
            tenancies: {
              where: { status: 'ACTIVE' },
              include: { tenant: true },
            },
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ success: true, owners });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: { message: err.message } }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth(req, ['SUPER_ADMIN', 'PROPERTY_MANAGER']);
    if ('error' in auth) return auth.error;

    const data = await req.json();
    const { name, phone, email, address, idProofType, idProofNumber, bankName, bankAccount, ifscCode, notes } = data;

    if (!name || !phone || !email) {
      return NextResponse.json(
        { success: false, error: { message: 'Name, phone, and email are required' } },
        { status: 400 }
      );
    }

    const owner = await prisma.owner.create({
      data: {
        name,
        phone,
        email,
        address,
        idProofType,
        idProofNumber,
        bankName,
        bankAccount,
        ifscCode,
        notes,
      },
    });

    await logAudit({
      userId: auth.session.id,
      actorName: auth.session.name,
      action: 'OWNER_CREATED',
      resource: 'Owner',
      resourceId: owner.id,
      newValue: { name, phone, email },
    });

    return NextResponse.json({ success: true, owner });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: { message: err.message } }, { status: 500 });
  }
}
