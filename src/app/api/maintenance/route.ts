import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/rbac';
import { logAudit } from '@/lib/audit';
import { notifyManagement } from '@/lib/notifications';

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req);
    if ('error' in auth) return auth.error;

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');

    const where: any = {};
    if (status) where.status = status;
    if (category) where.category = category;

    if (auth.session.role === 'TENANT') {
      where.tenantId = auth.session.tenantId;
    } else if (auth.session.role === 'MAINTENANCE_STAFF') {
      where.assignments = {
        some: {
          staffId: auth.session.staffId,
        },
      };
    }

    const requests = await prisma.maintenanceRequest.findMany({
      where,
      include: {
        flat: { include: { building: true } },
        tenant: { include: { user: true } },
        assignments: {
          include: { staff: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, requests });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: { message: err.message } }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth(req, ['TENANT', 'SUPER_ADMIN', 'PROPERTY_MANAGER']);
    if ('error' in auth) return auth.error;

    const data = await req.json();
    const { category, title, description, priority, photosUrl } = data;

    let targetFlatId = auth.session.flatId || data.flatId;
    let targetTenantId = auth.session.tenantId || data.tenantId;

    if (!targetFlatId || !targetTenantId) {
      return NextResponse.json(
        { success: false, error: { message: 'Flat and Tenant are required' } },
        { status: 400 }
      );
    }

    const count = await prisma.maintenanceRequest.count();
    const ticketNumber = `TKT-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    const request = await prisma.maintenanceRequest.create({
      data: {
        ticketNumber,
        flatId: targetFlatId,
        tenantId: targetTenantId,
        category: category || 'PLUMBING',
        title,
        description,
        priority: priority || 'MEDIUM',
        status: 'NEW',
        photosUrl,
      },
      include: {
        flat: true,
        tenant: true,
      },
    });

    await notifyManagement(
      `New Maintenance Ticket: ${ticketNumber}`,
      `Flat ${request.flat.flatNumber} logged a ${category} issue: "${title}" (Priority: ${priority || 'MEDIUM'})`,
      'MAINTENANCE_TICKET',
      '/portal/admin/maintenance'
    );

    await logAudit({
      userId: auth.session.id,
      actorName: auth.session.name,
      action: 'MAINTENANCE_REQUEST_CREATED',
      resource: 'MaintenanceRequest',
      resourceId: request.id,
      newValue: { ticketNumber, title, category },
    });

    return NextResponse.json({ success: true, request });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: { message: err.message } }, { status: 500 });
  }
}
