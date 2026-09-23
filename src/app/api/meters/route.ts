import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/rbac';
import { getSetting } from '@/lib/settings';
import { calculateElectricityCharge } from '@/lib/billing';
import { logAudit } from '@/lib/audit';

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req);
    if ('error' in auth) return auth.error;

    const meters = await prisma.meter.findMany({
      include: {
        flat: { include: { building: true } },
        readings: {
          orderBy: { readingDate: 'desc' },
          take: 12,
        },
      },
    });

    return NextResponse.json({ success: true, meters });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: { message: err.message } }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth(req, ['ACCOUNTANT', 'MAINTENANCE_STAFF', 'SUPER_ADMIN', 'PROPERTY_MANAGER']);
    if ('error' in auth) return auth.error;

    const { meterId, currentReading, photoUrl, notes } = await req.json();

    const meter = await prisma.meter.findUnique({
      where: { id: meterId },
    });

    if (!meter) {
      return NextResponse.json({ success: false, error: { message: 'Meter not found' } }, { status: 404 });
    }

    const previousReading = meter.lastReading;
    const curVal = parseFloat(currentReading);

    if (isNaN(curVal) || curVal < previousReading) {
      return NextResponse.json(
        { success: false, error: { message: `Current reading (${curVal}) cannot be less than previous reading (${previousReading})` } },
        { status: 400 }
      );
    }

    const configuredRate = await getSetting('billing.electricity_rate_per_unit');
    const { units, amount } = calculateElectricityCharge(previousReading, curVal, configuredRate);

    const reading = await prisma.meterReading.create({
      data: {
        meterId: meter.id,
        previousReading,
        currentReading: curVal,
        unitsConsumed: units,
        ratePerUnit: configuredRate,
        totalAmount: amount,
        photoUrl,
        recordedBy: auth.session.name,
        isBilled: false,
      },
    });

    // Update meter's last reading
    await prisma.meter.update({
      where: { id: meter.id },
      data: {
        lastReading: curVal,
        lastReadingDate: new Date(),
      },
    });

    await logAudit({
      userId: auth.session.id,
      actorName: auth.session.name,
      action: 'METER_READING_RECORDED',
      resource: 'MeterReading',
      resourceId: reading.id,
      newValue: { meterNumber: meter.meterNumber, units, amount },
    });

    return NextResponse.json({ success: true, reading });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: { message: err.message } }, { status: 500 });
  }
}
