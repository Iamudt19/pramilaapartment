import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/rbac';
import { logAudit } from '@/lib/audit';
import { sendNotification } from '@/lib/notifications';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await requireAuth(req, ['SUPER_ADMIN', 'PROPERTY_MANAGER']);
    if ('error' in auth) return auth.error;

    const data = await req.json();
    const { flatId, monthlyRent, depositAmount, maintenanceAmount, startDate, endDate } = data;

    const tenant = await prisma.tenant.findUnique({
      where: { id: params.id },
      include: { user: true },
    });

    if (!tenant) {
      return NextResponse.json({ success: false, error: { message: 'Tenant not found' } }, { status: 404 });
    }

    if (!flatId) {
      // Just approve profile without assigning flat yet
      const updated = await prisma.tenant.update({
        where: { id: params.id },
        data: { status: 'APPROVED' },
      });

      await sendNotification({
        userId: tenant.userId,
        title: 'Tenant Application Approved',
        message: 'Your tenant profile application has been approved by estate management.',
        eventType: 'TENANT_APPROVED',
        sendEmail: true,
      });

      return NextResponse.json({ success: true, tenant: updated });
    }

    const flat = await prisma.flat.findUnique({ where: { id: flatId } });
    if (!flat) {
      return NextResponse.json({ success: false, error: { message: 'Selected flat does not exist' } }, { status: 400 });
    }

    // 1. Create Tenancy
    const tenancy = await prisma.tenancy.create({
      data: {
        tenantId: tenant.id,
        flatId: flat.id,
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : null,
        monthlyRent: monthlyRent ? parseFloat(monthlyRent) : (flat.monthlyRent || 22000),
        depositAmount: depositAmount ? parseFloat(depositAmount) : (flat.deposit || 44000),
        maintenanceAmount: maintenanceAmount ? parseFloat(maintenanceAmount) : (flat.maintenance || 2500),
        status: 'ACTIVE',
      },
    });

    // 2. Mark flat occupied
    await prisma.flat.update({
      where: { id: flat.id },
      data: { status: 'OCCUPIED' },
    });

    // 3. Mark tenant active
    const updatedTenant = await prisma.tenant.update({
      where: { id: params.id },
      data: { status: 'ACTIVE' },
    });

    if (tenant.userId) {
      await prisma.user.update({
        where: { id: tenant.userId },
        data: { isActive: true },
      }).catch(() => {});
    }

    // 4. Send notification safely
    if (tenant.userId) {
      await sendNotification({
        userId: tenant.userId,
        title: 'Welcome to Pramila Apartments!',
        message: `Your tenancy for Flat ${flat.flatNumber} has been activated. You can now log in to view bills, request visitor passes, and access resident services.`,
        eventType: 'TENANT_APPROVED',
        link: '/portal/tenant',
        sendEmail: true,
      });
    }

    // 5. Audit Log
    await logAudit({
      userId: auth.session?.id,
      actorName: auth.session?.name || 'Administrator',
      action: 'TENANT_APPROVED_AND_ASSIGNED',
      resource: 'Tenant',
      resourceId: tenant.id,
      newValue: { flatNumber: flat.flatNumber, rent: tenancy.monthlyRent },
    });

    return NextResponse.json({ success: true, tenant: updatedTenant, tenancy });
  } catch (err: any) {
    console.error('Tenant approval error:', err);
    return NextResponse.json({ success: false, error: { message: err.message } }, { status: 500 });
  }
}
