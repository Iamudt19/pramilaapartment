import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/rbac';
import { logAudit } from '@/lib/audit';
import { sendNotification } from '@/lib/notifications';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await requireAuth(req, ['SUPER_ADMIN', 'PROPERTY_MANAGER', 'MAINTENANCE_STAFF', 'TENANT']);
    if ('error' in auth) return auth.error;

    const data = await req.json();
    const { status, staffId, laborCost, materialCost, vendorName, resolutionNotes, isTenantChargeable, tenantConfirmed } = data;

    const request = await prisma.maintenanceRequest.findUnique({
      where: { id: params.id },
      include: { tenant: { include: { user: true } }, flat: true },
    });

    if (!request) {
      return NextResponse.json({ success: false, error: { message: 'Maintenance request not found' } }, { status: 404 });
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (laborCost !== undefined) updateData.laborCost = parseFloat(laborCost);
    if (materialCost !== undefined) updateData.materialCost = parseFloat(materialCost);
    if (laborCost !== undefined || materialCost !== undefined) {
      const l = laborCost !== undefined ? parseFloat(laborCost) : request.laborCost;
      const m = materialCost !== undefined ? parseFloat(materialCost) : request.materialCost;
      updateData.totalCost = l + m;
    }
    if (vendorName !== undefined) updateData.vendorName = vendorName;
    if (resolutionNotes !== undefined) updateData.resolutionNotes = resolutionNotes;
    if (isTenantChargeable !== undefined) updateData.isTenantChargeable = Boolean(isTenantChargeable);
    if (status === 'RESOLVED') updateData.resolvedAt = new Date();
    if (tenantConfirmed) updateData.tenantConfirmedAt = new Date();

    // Assign staff if provided
    if (staffId) {
      await prisma.maintenanceAssignment.deleteMany({
        where: { maintenanceRequestId: request.id },
      });
      await prisma.maintenanceAssignment.create({
        data: {
          maintenanceRequestId: request.id,
          staffId,
          status: 'ASSIGNED',
        },
      });
      if (!status) updateData.status = 'ASSIGNED';
    }

    const updated = await prisma.maintenanceRequest.update({
      where: { id: params.id },
      data: updateData,
      include: {
        flat: true,
        tenant: true,
        assignments: { include: { staff: true } },
      },
    });

    // Notify tenant of progress
    if (status && status !== request.status) {
      await sendNotification({
        userId: request.tenant.userId,
        title: `Maintenance Update: ${request.ticketNumber}`,
        message: `Your maintenance request status changed to "${status}". Notes: ${resolutionNotes || 'In progress'}`,
        eventType: 'MAINTENANCE_UPDATED',
        link: '/portal/tenant/maintenance',
      });
    }

    await logAudit({
      userId: auth.session.id,
      actorName: auth.session.name,
      action: 'MAINTENANCE_REQUEST_UPDATED',
      resource: 'MaintenanceRequest',
      resourceId: request.id,
      newValue: { status, totalCost: updateData.totalCost },
    });

    return NextResponse.json({ success: true, request: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: { message: err.message } }, { status: 500 });
  }
}
