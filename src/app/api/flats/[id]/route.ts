import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/rbac';
import { logAudit } from '@/lib/audit';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await requireAuth(req);
    if ('error' in auth) return auth.error;

    const flat = await prisma.flat.findUnique({
      where: { id: params.id },
      include: {
        building: true,
        floor: true,
        owner: true,
        tenancies: {
          include: {
            tenant: {
              include: { user: true, familyMembers: true, documents: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        meters: {
          include: {
            readings: {
              orderBy: { readingDate: 'desc' },
              take: 5,
            },
          },
        },
        invoices: {
          include: { items: true, payments: true },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        visitorRequests: {
          include: { visitor: true, pass: true, entries: true, exits: true },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        maintenanceRequests: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        vehicles: true,
        parkingSlots: true,
      },
    });

    if (!flat) {
      return NextResponse.json({ success: false, error: { message: 'Flat not found' } }, { status: 404 });
    }

    return NextResponse.json({ success: true, flat });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: { message: err.message } }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await requireAuth(req, ['SUPER_ADMIN', 'PROPERTY_MANAGER']);
    if ('error' in auth) return auth.error;

    const data = await req.json();
    const existing = await prisma.flat.findUnique({ where: { id: params.id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: { message: 'Flat not found' } }, { status: 404 });
    }

    const updated = await prisma.flat.update({
      where: { id: params.id },
      data: {
        flatType: data.flatType ?? existing.flatType,
        areaSqFt: data.areaSqFt !== undefined ? parseFloat(data.areaSqFt) : existing.areaSqFt,
        bedrooms: data.bedrooms !== undefined ? parseInt(data.bedrooms) : existing.bedrooms,
        bathrooms: data.bathrooms !== undefined ? parseInt(data.bathrooms) : existing.bathrooms,
        status: data.status ?? existing.status,
        monthlyRent: data.monthlyRent !== undefined ? parseFloat(data.monthlyRent) : existing.monthlyRent,
        maintenance: data.maintenance !== undefined ? parseFloat(data.maintenance) : existing.maintenance,
        deposit: data.deposit !== undefined ? parseFloat(data.deposit) : existing.deposit,
        ownerId: data.ownerId !== undefined ? data.ownerId : existing.ownerId,
        notes: data.notes ?? existing.notes,
      },
      include: {
        building: true,
        owner: true,
      },
    });

    await logAudit({
      userId: auth.session.id,
      actorName: auth.session.name,
      action: 'FLAT_UPDATED',
      resource: 'Flat',
      resourceId: params.id,
      oldValue: existing,
      newValue: updated,
    });

    return NextResponse.json({ success: true, flat: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: { message: err.message } }, { status: 500 });
  }
}
