import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/rbac';
import { logAudit } from '@/lib/audit';

export async function GET(req: NextRequest) {
  try {
    const alerts = await prisma.emergencyAlert.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      take: 3,
    });
    return NextResponse.json({ success: true, alerts });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: { message: err.message } }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth(req, ['SUPER_ADMIN', 'PROPERTY_MANAGER', 'SECURITY_GUARD']);
    if ('error' in auth) return auth.error;

    const data = await req.json();
    const { title, message, alertType, severity } = data;

    const property = await prisma.property.findFirst();
    if (!property) {
      return NextResponse.json({ success: false, error: { message: 'Property not configured' } }, { status: 404 });
    }

    const alert = await prisma.emergencyAlert.create({
      data: {
        propertyId: property.id,
        senderId: auth.session.id,
        senderName: auth.session.name,
        title,
        message,
        alertType: alertType || 'SECURITY',
        severity: severity || 'CRITICAL',
        isActive: true,
      },
    });

    await logAudit({
      userId: auth.session.id,
      actorName: auth.session.name,
      action: 'EMERGENCY_BROADCAST_TRIGGERED',
      resource: 'EmergencyAlert',
      resourceId: alert.id,
      newValue: { title, alertType },
    });

    return NextResponse.json({ success: true, alert });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: { message: err.message } }, { status: 500 });
  }
}
