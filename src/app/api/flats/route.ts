import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/rbac';
import { logAudit } from '@/lib/audit';

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req);
    if ('error' in auth) return auth.error;

    const { searchParams } = new URL(req.url);
    const buildingId = searchParams.get('buildingId');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const where: any = {};
    if (buildingId) where.buildingId = buildingId;
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { flatNumber: { contains: search } },
        { flatType: { contains: search } },
      ];
    }

    const flats = await prisma.flat.findMany({
      where,
      include: {
        building: true,
        floor: true,
        owner: true,
        tenancies: {
          where: { status: 'ACTIVE' },
          include: {
            tenant: {
              include: { user: true },
            },
          },
          take: 1,
        },
        meters: true,
        parkingSlots: true,
      },
      orderBy: { flatNumber: 'asc' },
    });

    return NextResponse.json({ success: true, flats });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: { message: err.message } }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth(req, ['SUPER_ADMIN', 'PROPERTY_MANAGER']);
    if ('error' in auth) return auth.error;

    const data = await req.json();
    const {
      buildingId,
      floorId,
      flatNumber,
      flatType,
      areaSqFt,
      bedrooms,
      bathrooms,
      status,
      monthlyRent,
      maintenance,
      deposit,
      ownerId,
      notes,
    } = data;

    const existing = await prisma.flat.findUnique({
      where: {
        buildingId_flatNumber: {
          buildingId,
          flatNumber,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: { message: `Flat ${flatNumber} already exists in this building` } },
        { status: 400 }
      );
    }

    const flat = await prisma.flat.create({
      data: {
        buildingId,
        floorId,
        flatNumber,
        flatType: flatType || '2BHK',
        areaSqFt: parseFloat(areaSqFt) || 1150,
        bedrooms: parseInt(bedrooms) || 2,
        bathrooms: parseInt(bathrooms) || 2,
        status: status || 'VACANT',
        monthlyRent: parseFloat(monthlyRent) || 22000,
        maintenance: parseFloat(maintenance) || 2500,
        deposit: parseFloat(deposit) || 44000,
        ownerId: ownerId || null,
        notes,
      },
      include: {
        building: true,
        floor: true,
        owner: true,
      },
    });

    // Auto-create default Electricity Meter
    await prisma.meter.create({
      data: {
        flatId: flat.id,
        meterNumber: `EM-${flat.building.code}-${flat.flatNumber.replace(/[^A-Za-z0-9]/g, '')}`,
        meterType: 'ELECTRICITY',
        currentStatus: 'ACTIVE',
        lastReading: 0,
      },
    });

    await logAudit({
      userId: auth.session.id,
      actorName: auth.session.name,
      action: 'FLAT_CREATED',
      resource: 'Flat',
      resourceId: flat.id,
      newValue: { flatNumber, buildingId, rent: monthlyRent },
    });

    return NextResponse.json({ success: true, flat });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: { message: err.message } }, { status: 500 });
  }
}
