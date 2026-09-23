import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/rbac';
import { logAudit } from '@/lib/audit';

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req);
    if ('error' in auth) return auth.error;

    const parkingSlots = await prisma.parkingSlot.findMany({
      include: {
        building: true,
        flat: true,
        vehicle: true,
      },
      orderBy: { slotNumber: 'asc' },
    });

    return NextResponse.json({ success: true, parkingSlots });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: { message: err.message } }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth(req, ['SUPER_ADMIN', 'PROPERTY_MANAGER']);
    if ('error' in auth) return auth.error;

    const data = await req.json();
    const { buildingId, slotNumber, areaLocation, slotType, status, flatId, vehicleId } = data;

    const slot = await prisma.parkingSlot.create({
      data: {
        buildingId,
        slotNumber,
        areaLocation: areaLocation || 'Basement 1',
        slotType: slotType || 'CAR',
        status: status || (flatId ? 'ASSIGNED' : 'AVAILABLE'),
        flatId: flatId || null,
        vehicleId: vehicleId || null,
      },
    });

    await logAudit({
      userId: auth.session.id,
      actorName: auth.session.name,
      action: 'PARKING_SLOT_CREATED',
      resource: 'ParkingSlot',
      resourceId: slot.id,
      newValue: { slotNumber, areaLocation },
    });

    return NextResponse.json({ success: true, slot });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: { message: err.message } }, { status: 500 });
  }
}
