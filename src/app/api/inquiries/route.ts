import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/rbac';
import { logAudit } from '@/lib/audit';
import { sendNotification } from '@/lib/notifications';

// GET /api/inquiries - Admin retrieves all walkthrough & flat booking inquiries
export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req, ['SUPER_ADMIN', 'PROPERTY_MANAGER', 'ACCOUNTANT']);
    if ('error' in auth) return auth.error;

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const query = searchParams.get('q');

    const where: any = {};
    if (status && status !== 'ALL') {
      where.status = status;
    }
    if (query) {
      where.OR = [
        { fullName: { contains: query, mode: 'insensitive' } },
        { phone: { contains: query, mode: 'insensitive' } },
        { flatNumber: { contains: query, mode: 'insensitive' } },
        { suiteName: { contains: query, mode: 'insensitive' } },
      ];
    }

    const inquiries = await prisma.leadInquiry.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, inquiries });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { message: err.message || 'Failed to fetch inquiries' } },
      { status: 500 }
    );
  }
}

// POST /api/inquiries - Public or Walkthrough lead inquiry submission
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { fullName, phone, email, flatNumber, suiteName, message } = data;

    if (!fullName || !phone) {
      return NextResponse.json(
        { success: false, error: { message: 'Full name and contact phone number are required' } },
        { status: 400 }
      );
    }

    const inquiry = await prisma.leadInquiry.create({
      data: {
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email ? email.trim() : null,
        flatNumber: flatNumber ? String(flatNumber).trim() : null,
        suiteName: suiteName ? suiteName.trim() : 'Surya 2BHK Deluxe',
        message: message ? message.trim() : null,
        status: 'NEW',
      },
    });

    // Notify admins & log audit
    await logAudit({
      actorName: fullName.trim(),
      action: 'LEAD_INQUIRY_SUBMITTED',
      resource: 'LeadInquiry',
      resourceId: inquiry.id,
      newValue: JSON.stringify({
        name: inquiry.fullName,
        phone: inquiry.phone,
        flat: inquiry.flatNumber,
        suite: inquiry.suiteName,
      }),
    });

    const admins = await prisma.user.findMany({
      where: { role: { in: ['SUPER_ADMIN', 'PROPERTY_MANAGER'] } },
    });

    for (const admin of admins) {
      await sendNotification({
        userId: admin.id,
        title: 'New Walkthrough / Flat Inquiry',
        message: `${fullName.trim()} (${phone.trim()}) requested a walkthrough for ${inquiry.suiteName}${inquiry.flatNumber ? ` (Flat ${inquiry.flatNumber})` : ''}.`,
        eventType: 'SYSTEM',
      });
    }

    return NextResponse.json({ success: true, inquiry }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { message: err.message || 'Failed to save walkthrough inquiry' } },
      { status: 500 }
    );
  }
}
