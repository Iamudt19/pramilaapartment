import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/rbac';
import { getSetting } from '@/lib/settings';
import { logAudit } from '@/lib/audit';
import { sendNotification } from '@/lib/notifications';

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req, ['SUPER_ADMIN', 'PROPERTY_MANAGER', 'ACCOUNTANT', 'TENANT']);
    if ('error' in auth) return auth.error;

    const where: any = {};
    if (auth.session.role === 'TENANT') {
      where.tenantId = auth.session.tenantId;
    }

    const penalties = await prisma.penalty.findMany({
      where,
      include: {
        tenant: { include: { user: true } },
        flat: { include: { building: true } },
        incident: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, penalties });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: { message: err.message } }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth(req, ['SUPER_ADMIN', 'PROPERTY_MANAGER']);
    if ('error' in auth) return auth.error;

    const data = await req.json();
    const { incidentId, tenantId, flatId, reason, customAmount } = data;

    const defaultPenaltyAmount = await getSetting('visitor.unauthorized_penalty_amount');
    const amount = customAmount !== undefined ? parseFloat(customAmount) : defaultPenaltyAmount;

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);

    const penalty = await prisma.penalty.create({
      data: {
        incidentId: incidentId || null,
        tenantId,
        flatId,
        reason: reason || 'Violation of society visitor policy',
        amount,
        status: 'CONFIRMED',
        dueDate,
      },
      include: {
        tenant: { include: { user: true } },
        flat: true,
      },
    });

    if (incidentId) {
      await prisma.securityIncident.update({
        where: { id: incidentId },
        data: {
          isConfirmedByAdmin: true,
          confirmedAt: new Date(),
          actionTaken: `Confirmed violation. Penalty of ₹${amount} applied.`,
        },
      });
    }

    // Notify Tenant
    await sendNotification({
      userId: penalty.tenant.userId,
      title: 'Society Penalty Assessed',
      message: `A penalty of ₹${amount.toLocaleString('en-IN')} has been applied for Flat ${penalty.flat.flatNumber}: ${penalty.reason}.`,
      eventType: 'PENALTY_APPLIED',
      link: '/portal/tenant/bills',
      sendEmail: true,
    });

    await logAudit({
      userId: auth.session.id,
      actorName: auth.session.name,
      action: 'PENALTY_CONFIRMED_AND_APPLIED',
      resource: 'Penalty',
      resourceId: penalty.id,
      newValue: { amount, reason: penalty.reason },
    });

    return NextResponse.json({ success: true, penalty });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: { message: err.message } }, { status: 500 });
  }
}
