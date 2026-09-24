import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/rbac';

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req, ['SUPER_ADMIN', 'PROPERTY_MANAGER', 'ACCOUNTANT']);
    if ('error' in auth) return auth.error;

    // Run ALL queries in parallel with proper aggregations (no full table scans)
    const [
      financialAgg,
      itemTypeAgg,
      flatCounts,
      visitorCounts,
      maintenanceCounts,
      maintenanceCost,
      tenantCounts,
    ] = await Promise.all([
      // 1. Financial aggregation via groupBy — single DB query
      prisma.invoice.aggregate({
        _sum: { totalAmount: true, paidAmount: true, balanceAmount: true },
      }),

      // 2. Invoice item breakdown by type — single DB query
      prisma.invoiceItem.groupBy({
        by: ['itemType'],
        _sum: { totalPrice: true },
      }),

      // 3. Flat status counts — use groupBy instead of findMany
      prisma.flat.groupBy({
        by: ['status'],
        _count: { _all: true },
      }),

      // 4. Visitor status counts
      prisma.visitorRequest.groupBy({
        by: ['status'],
        _count: { _all: true },
      }),

      // 5. Maintenance status counts
      prisma.maintenanceRequest.groupBy({
        by: ['status'],
        _count: { _all: true },
      }),

      // 6. Maintenance cost sum
      prisma.maintenanceRequest.aggregate({
        _sum: { totalCost: true },
      }),

      // 7. Tenant status counts
      prisma.tenant.groupBy({
        by: ['status'],
        _count: { _all: true },
      }),
    ]);

    // Process financial
    const totalBilled = financialAgg._sum.totalAmount || 0;
    const totalCollected = financialAgg._sum.paidAmount || 0;
    const totalOutstanding = financialAgg._sum.balanceAmount || 0;

    const itemMap: Record<string, number> = {};
    for (const row of itemTypeAgg) {
      itemMap[row.itemType] = row._sum.totalPrice || 0;
    }

    // Process flat counts
    const flatMap: Record<string, number> = {};
    let totalFlats = 0;
    for (const row of flatCounts) {
      flatMap[row.status] = row._count._all;
      totalFlats += row._count._all;
    }
    const occupiedFlats = flatMap['OCCUPIED'] || 0;
    const vacantFlats = flatMap['VACANT'] || 0;
    const reservedFlats = flatMap['RESERVED'] || 0;
    const maintenanceFlats = flatMap['MAINTENANCE'] || 0;
    const occupancyRate = totalFlats > 0 ? Math.round((occupiedFlats / totalFlats) * 100) : 0;

    // Process visitor counts
    const visMap: Record<string, number> = {};
    let totalVisitors = 0;
    for (const row of visitorCounts) {
      visMap[row.status] = row._count._all;
      totalVisitors += row._count._all;
    }
    const approvedVisitors = (visMap['APPROVED'] || 0) + (visMap['CHECKED_IN'] || 0) + (visMap['CHECKED_OUT'] || 0);
    const pendingVisitors = visMap['PENDING'] || 0;
    const currentlyInside = visMap['CHECKED_IN'] || 0;
    const rejectedVisitors = visMap['REJECTED'] || 0;

    // Process maintenance counts
    const mntMap: Record<string, number> = {};
    let totalTickets = 0;
    for (const row of maintenanceCounts) {
      mntMap[row.status] = row._count._all;
      totalTickets += row._count._all;
    }
    const openTickets = (mntMap['NEW'] || 0) + (mntMap['ASSIGNED'] || 0) + (mntMap['IN_PROGRESS'] || 0);
    const resolvedTickets = (mntMap['RESOLVED'] || 0) + (mntMap['CLOSED'] || 0);
    const totalMaintenanceCost = maintenanceCost._sum.totalCost || 0;

    // Process tenant counts
    const tenMap: Record<string, number> = {};
    let totalTenants = 0;
    for (const row of tenantCounts) {
      tenMap[row.status] = row._count._all;
      totalTenants += row._count._all;
    }
    const activeTenants = tenMap['ACTIVE'] || 0;
    const pendingTenants = (tenMap['PENDING'] || 0) + (tenMap['UNDER_REVIEW'] || 0);

    return NextResponse.json({
      success: true,
      financial: {
        totalBilled,
        totalCollected,
        totalOutstanding,
        rentCollection: itemMap['RENT'] || 0,
        maintenanceCollection: itemMap['MAINTENANCE'] || 0,
        electricityCollection: itemMap['ELECTRICITY'] || 0,
        waterCollection: itemMap['WATER'] || 0,
        penaltyCollection: itemMap['PENALTY'] || 0,
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
        totalTenants,
        activeTenants,
        pendingTenants,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: { message: err.message } }, { status: 500 });
  }
}
