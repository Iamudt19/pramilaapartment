import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/rbac';
import { logAudit } from '@/lib/audit';

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req, ['SUPER_ADMIN', 'PROPERTY_MANAGER', 'ACCOUNTANT']);
    if ('error' in auth) return auth.error;

    const staffMembers = await prisma.staff.findMany({
      include: {
        user: true,
        attendances: {
          orderBy: { date: 'desc' },
          take: 7,
        },
        assignments: {
          include: {
            maintenanceRequest: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({ success: true, staff: staffMembers });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: { message: err.message } }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth(req, ['SUPER_ADMIN', 'PROPERTY_MANAGER']);
    if ('error' in auth) return auth.error;

    const data = await req.json();
    const { fullName, phone, email, role, designation, shiftSchedule, emergencyContact } = data;

    const staff = await prisma.staff.create({
      data: {
        fullName,
        phone,
        email,
        role: role || 'SECURITY_GUARD',
        designation: designation || 'Staff Member',
        shiftSchedule: shiftSchedule || 'Day Shift (08:00 - 20:00)',
        emergencyContact,
      },
    });

    await logAudit({
      userId: auth.session.id,
      actorName: auth.session.name,
      action: 'STAFF_MEMBER_ADDED',
      resource: 'Staff',
      resourceId: staff.id,
      newValue: { fullName, role, designation },
    });

    return NextResponse.json({ success: true, staff });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: { message: err.message } }, { status: 500 });
  }
}
