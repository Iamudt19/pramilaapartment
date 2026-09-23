import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/rbac';
import { logAudit } from '@/lib/audit';

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req);
    if ('error' in auth) return auth.error;

    const property = await prisma.property.findFirst({
      include: {
        buildings: {
          include: {
            floors: true,
            flats: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, property });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: { message: err.message } }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const auth = await requireAuth(req, ['SUPER_ADMIN', 'PROPERTY_MANAGER']);
    if ('error' in auth) return auth.error;

    const data = await req.json();
    const property = await prisma.property.findFirst();

    if (!property) {
      return NextResponse.json({ success: false, error: { message: 'Property not found' } }, { status: 404 });
    }

    const updated = await prisma.property.update({
      where: { id: property.id },
      data: {
        name: data.name ?? property.name,
        address: data.address ?? property.address,
        contactNumber: data.contactNumber ?? property.contactNumber,
        managementEmail: data.managementEmail ?? property.managementEmail,
        timezone: data.timezone ?? property.timezone,
        currency: data.currency ?? property.currency,
        emergencyContact: data.emergencyContact ?? property.emergencyContact,
      },
    });

    await logAudit({
      userId: auth.session.id,
      actorName: auth.session.name,
      action: 'PROPERTY_CONFIG_UPDATED',
      resource: 'Property',
      resourceId: property.id,
      oldValue: property,
      newValue: updated,
    });

    return NextResponse.json({ success: true, property: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: { message: err.message } }, { status: 500 });
  }
}
