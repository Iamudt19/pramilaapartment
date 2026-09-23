import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/rbac';
import { getSetting } from '@/lib/settings';
import { logAudit } from '@/lib/audit';
import { notifyManagement } from '@/lib/notifications';

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req, ['SECURITY_GUARD', 'SUPER_ADMIN', 'PROPERTY_MANAGER']);
    if ('error' in auth) return auth.error;

    const incidents = await prisma.securityIncident.findMany({
      include: {
        flat: { include: { building: true } },
        tenant: true,
        penalty: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, incidents });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: { message: err.message } }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth(req, ['SECURITY_GUARD', 'SUPER_ADMIN', 'PROPERTY_MANAGER']);
    if ('error' in auth) return auth.error;

    const data = await req.json();
    const { flatId, tenantId, incidentType, severity, description, visitorName, vehicleNumber, evidencePhotoUrl } = data;

    let targetFlatId = flatId;
    let targetTenantId = tenantId;

    if (flatId && !tenantId) {
      const activeTenancy = await prisma.tenancy.findFirst({
        where: { flatId, status: 'ACTIVE' },
      });
      if (activeTenancy) {
        targetTenantId = activeTenancy.tenantId;
      }
    }

    const incident = await prisma.securityIncident.create({
      data: {
        flatId: targetFlatId,
        tenantId: targetTenantId,
        reporterGuardId: auth.session.staffId || auth.session.id,
        reporterName: auth.session.name,
        incidentType: incidentType || 'UNAUTHORIZED_ENTRY',
        severity: severity || 'MEDIUM',
        description,
        visitorName,
        vehicleNumber,
        evidencePhotoUrl,
        isConfirmedByAdmin: false,
      },
      include: {
        flat: true,
        tenant: true,
      },
    });

    // Notify Management to review security incident & assess penalty
    await notifyManagement(
      `Security Incident Reported: ${incidentType}`,
      `Security Guard ${auth.session.name} reported: ${description} (Flat: ${incident.flat?.flatNumber || 'Common Area'})`,
      'SECURITY_INCIDENT',
      '/portal/admin/security'
    );

    await logAudit({
      userId: auth.session.id,
      actorName: auth.session.name,
      action: 'SECURITY_INCIDENT_REPORTED',
      resource: 'SecurityIncident',
      resourceId: incident.id,
      newValue: { incidentType, description },
    });

    return NextResponse.json({ success: true, incident });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: { message: err.message } }, { status: 500 });
  }
}
