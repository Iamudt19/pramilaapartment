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

    const vehicles = await prisma.vehicle.findMany({
      where,
      include: {
        flat: { include: { building: true } },
        tenant: { include: { user: true } },
        parkingSlots: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, vehicles });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: { message: err.message } }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth(req, ['TENANT', 'SUPER_ADMIN', 'PROPERTY_MANAGER', 'SECURITY_GUARD']);
    if ('error' in auth) return auth.error;

    const data = await req.json();
    const { vehicleNumber, vehicleType, brandModel, rfidTagNumber, flatId, tenantId } = data;

    const targetFlatId = auth.session.flatId || flatId;
    const targetTenantId = auth.session.tenantId || tenantId;

    if (!vehicleNumber || !targetFlatId || !targetTenantId) {
      return NextResponse.json(
        { success: false, error: { message: 'Vehicle number, flat, and tenant are required' } },
        { status: 400 }
      );
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        flatId: targetFlatId,
        tenantId: targetTenantId,
        vehicleNumber: vehicleNumber.toUpperCase().trim(),
        vehicleType: vehicleType || 'CAR',
        brandModel,
        rfidTagNumber,
        status: 'APPROVED',
      },
      include: { flat: true, tenant: true },
    });

    await logAudit({
      userId: auth.session.id,
      actorName: auth.session.name,
      action: 'VEHICLE_REGISTERED',
      resource: 'Vehicle',
      resourceId: vehicle.id,
      newValue: { vehicleNumber },
    });

    return NextResponse.json({ success: true, vehicle });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: { message: err.message } }, { status: 500 });
  }
}
