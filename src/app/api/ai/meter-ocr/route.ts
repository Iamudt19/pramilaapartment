import { NextRequest, NextResponse } from 'next/server';
import { parseMeterImageOcr } from '@/lib/ai/meterOcr';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { flatNumber, previousReading, imageBase64, imageText } = body;

    let prev = previousReading;

    if (!prev && flatNumber) {
      // Look up previous meter record in database if exists
      const meter = await prisma.meter.findFirst({
        where: { flat: { flatNumber: String(flatNumber) } },
        include: { readings: { orderBy: { readingDate: 'desc' }, take: 1 } },
      });

      if (meter && meter.readings.length > 0) {
        prev = meter.readings[0].currentReading;
      }
    }

    const result = parseMeterImageOcr({
      imageTextOrRaw: imageText || '',
      previousReading: prev || 1250,
      flatNumber: flatNumber ? String(flatNumber) : '101',
      ratePerUnit: 10.0,
    });

    return NextResponse.json({ success: true, ...result });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { message: err.message || 'AI meter OCR processing failed' } },
      { status: 500 }
    );
  }
}
