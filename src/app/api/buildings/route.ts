import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/rbac';
import { logAudit } from '@/lib/audit';

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req);
    if ('error' in auth) return auth.error;

    const buildings = await prisma.building.findMany({
      include: {
        floors: {
          orderBy: { floorNumber: 'asc' },
        },
        flats: {
          include: {
            owner: true,
            tenancies: {
              where: { status: 'ACTIVE' },
              include: { tenant: true },
            },
          },
        },
        parkingSlots: true,
      },
    });

    return NextResponse.json({ success: true, buildings });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: { message: err.message } }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth(req, ['SUPER_ADMIN', 'PROPERTY_MANAGER']);
    if ('error' in auth) return auth.error;

    const { name, code, totalFloors, address, notes } = await req.json();

    const property = await prisma.property.findFirst();
    if (!property) {
      return NextResponse.json({ success: false, error: { message: 'Property not found' } }, { status: 404 });
    }

    const building = await prisma.building.create({
      data: {
        propertyId: property.id,
        name,
        code,
        totalFloors: parseInt(totalFloors) || 4,
        address,
        notes,
      },
    });

    // Auto-create floors
    for (let i = 1; i <= building.totalFloors; i++) {
      await prisma.floor.create({
        data: {
          buildingId: building.id,
          floorNumber: i,
          name: i === 1 ? '1st Floor' : i === 2 ? '2nd Floor' : i === 3 ? '3rd Floor' : `${i}th Floor`,
        },
      });
    }

    await logAudit({
      userId: auth.session.id,
      actorName: auth.session.name,
      action: 'BUILDING_CREATED',
      resource: 'Building',
      resourceId: building.id,
      newValue: { name, code, totalFloors },
    });

    return NextResponse.json({ success: true, building });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: { message: err.message } }, { status: 500 });
  }
}
