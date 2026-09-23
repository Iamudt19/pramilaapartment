import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/rbac';

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req, ['SUPER_ADMIN', 'PROPERTY_MANAGER', 'ACCOUNTANT']);
    if ('error' in auth) return auth.error;

    // 1. Financial Metrics
    const invoices = await prisma.invoice.findMany({
      include: { items: true, payments: true },
    });

    const totalBilled = invoices.reduce((acc, inv) => acc + inv.totalAmount, 0);
    const totalCollected = invoices.reduce((acc, inv) => acc + inv.paidAmount, 0);
    const totalOutstanding = invoices.reduce((acc, inv) => acc + inv.balanceAmount, 0);

    let rentCollection = 0;
    let maintenanceCollection = 0;
    let electricityCollection = 0;
    let waterCollection = 0;
    let penaltyCollection = 0;

    for (const inv of invoices) {
      for (const item of inv.items) {
        if (item.itemType === 'RENT') rentCollection += item.totalPrice;
        else if (item.itemType === 'MAINTENANCE') maintenanceCollection += item.totalPrice;
        else if (item.itemType === 'ELECTRICITY') electricityCollection += item.totalPrice;
        else if (item.itemType === 'WATER') waterCollection += item.totalPrice;
        else if (item.itemType === 'PENALTY') penaltyCollection += item.totalPrice;
      }
    }

    // 2. Occupancy Metrics
    const flats = await prisma.flat.findMany();
    const totalFlats = flats.length;
    const occupiedFlats = flats.filter((f) => f.status === 'OCCUPIED').length;
    const vacantFlats = flats.filter((f) => f.status === 'VACANT').length;
    const reservedFlats = flats.filter((f) => f.status === 'RESERVED').length;
    const maintenanceFlats = flats.filter((f) => f.status === 'MAINTENANCE').length;
    const occupancyRate = totalFlats > 0 ? Math.round((occupiedFlats / totalFlats) * 100) : 0;

    // 3. Visitor Metrics
    const visitorRequests = await prisma.visitorRequest.findMany();
    const totalVisitors = visitorRequests.length;
    const approvedVisitors = visitorRequests.filter((v) => v.status === 'APPROVED' || v.status === 'CHECKED_IN' || v.status === 'CHECKED_OUT').length;
    const pendingVisitors = visitorRequests.filter((v) => v.status === 'PENDING').length;
    const currentlyInside = visitorRequests.filter((v) => v.status === 'CHECKED_IN').length;
    const rejectedVisitors = visitorRequests.filter((v) => v.status === 'REJECTED').length;

    // 4. Maintenance Metrics
    const maintenanceTickets = await prisma.maintenanceRequest.findMany();
    const totalTickets = maintenanceTickets.length;
    const openTickets = maintenanceTickets.filter((t) => t.status === 'NEW' || t.status === 'ASSIGNED' || t.status === 'IN_PROGRESS').length;
    const resolvedTickets = maintenanceTickets.filter((t) => t.status === 'RESOLVED' || t.status === 'CLOSED').length;
    const totalMaintenanceCost = maintenanceTickets.reduce((acc, t) => acc + t.totalCost, 0);

    // 5. Tenant Metrics
    const tenants = await prisma.tenant.findMany();
    const activeTenants = tenants.filter((t) => t.status === 'ACTIVE').length;
    const pendingTenants = tenants.filter((t) => t.status === 'PENDING' || t.status === 'UNDER_REVIEW').length;

    return NextResponse.json({
      success: true,
      financial: {
        totalBilled,
        totalCollected,
        totalOutstanding,
        rentCollection,
        maintenanceCollection,
        electricityCollection,
        waterCollection,
        penaltyCollection,
      },
      occupancy: {
        totalFlats,
        occupiedFlats,
        vacantFlats,
        reservedFlats,
        maintenanceFlats,
        occupancyRate,
      },
      visitors: {
        totalVisitors,
        approvedVisitors,
        pendingVisitors,
        currentlyInside,
        rejectedVisitors,
      },
      maintenance: {
        totalTickets,
        openTickets,
        resolvedTickets,
        totalMaintenanceCost,
      },
      tenants: {
        totalTenants: tenants.length,
        activeTenants,
        pendingTenants,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: { message: err.message } }, { status: 500 });
  }
}
