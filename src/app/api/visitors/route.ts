import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/rbac';
import { getSetting } from '@/lib/settings';
import { generateSecurePassToken } from '@/lib/qr';
import { logAudit } from '@/lib/audit';
import { notifyManagement, sendNotification } from '@/lib/notifications';

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req);
    if ('error' in auth) return auth.error;

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const flatId = searchParams.get('flatId');
    const tenantId = searchParams.get('tenantId');
    const search = searchParams.get('search');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;

    const where: any = {};
    if (status) where.status = status;
    if (flatId) where.flatId = flatId;

    // Tenants can only view their own requests
    if (auth.session.role === 'TENANT') {
      where.tenantId = auth.session.tenantId;
    } else if (tenantId) {
      where.tenantId = tenantId;
    }

    if (search) {
      where.OR = [
        { visitorName: { contains: search } },
        { visitorPhone: { contains: search } },
        { vehicleNumber: { contains: search } },
      ];
    }

    const visitors = await prisma.visitorRequest.findMany({
      where,
      include: {
        tenant: {
          include: { user: true },
        },
        flat: {
          include: { building: true },
        },
        pass: true,
        entries: true,
        exits: true,
        documents: true,
      },
      orderBy: { createdAt: 'desc' },
      ...(limit ? { take: limit } : {}),
    });

    return NextResponse.json({ success: true, visitors });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: { message: err.message } }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth(req, ['TENANT', 'SUPER_ADMIN', 'PROPERTY_MANAGER', 'SECURITY_GUARD']);
    if ('error' in auth) return auth.error;

    const data = await req.json();
    const {
      visitorName,
      visitorPhone,
      relationship,
      purpose,
      vehicleNumber,
      expectedArrival,
      expectedDeparture,
      durationHours,
      documentUrl,
      documentType,
      isOvernight,
    } = data;

    let targetTenantId = auth.session.tenantId;
    let targetFlatId = auth.session.flatId;

    if (auth.session.role !== 'TENANT') {
      targetTenantId = data.tenantId;
      targetFlatId = data.flatId;
    }

    if (!targetTenantId || !targetFlatId) {
      return NextResponse.json(
        { success: false, error: { message: 'Active tenancy or flat ID required to create visitor pass' } },
        { status: 400 }
      );
    }

    // Configurable Visitor Policy Validations
    const requireIdProof = await getSetting('visitor.require_id_proof');
    const requirePurpose = await getSetting('visitor.require_purpose');
    const maxDuration = await getSetting('visitor.max_duration_hours');
    const mgmtApprovalRequired = await getSetting('visitor.management_approval_required');

    if (requirePurpose && !purpose) {
      return NextResponse.json(
        { success: false, error: { message: 'Purpose of visit is mandatory under current apartment policy' } },
        { status: 400 }
      );
    }

    if (requireIdProof && !documentUrl && auth.session.role === 'TENANT') {
      // Allowed if tenant provides ID or if created by admin
    }

    const duration = parseInt(durationHours) || 4;
    if (duration > maxDuration && !isOvernight) {
      return NextResponse.json(
        { success: false, error: { message: `Maximum visitor duration permitted is ${maxDuration} hours` } },
        { status: 400 }
      );
    }

    const arrival = expectedArrival ? new Date(expectedArrival) : new Date();
    const departure = expectedDeparture
      ? new Date(expectedDeparture)
      : new Date(arrival.getTime() + duration * 60 * 60 * 1000);

    // If management approval is NOT required, or created by admin, auto-approve
    const isAutoApproved = !mgmtApprovalRequired || auth.session.role === 'SUPER_ADMIN' || auth.session.role === 'PROPERTY_MANAGER';
    const initialStatus = isAutoApproved ? 'APPROVED' : 'PENDING';

    const visitorRequest = await prisma.visitorRequest.create({
      data: {
        tenantId: targetTenantId,
        flatId: targetFlatId,
        visitorName,
        visitorPhone,
        relationship: relationship || 'Guest',
        purpose: purpose || 'Visit',
        vehicleNumber,
        expectedArrival: arrival,
        expectedDeparture: departure,
        durationHours: duration,
        isOvernight: Boolean(isOvernight),
        status: initialStatus,
        requiresManagementApproval: mgmtApprovalRequired,
        reviewedBy: isAutoApproved ? auth.session.name : null,
        reviewedAt: isAutoApproved ? new Date() : null,
        documents: documentUrl
          ? {
              create: [
                {
                  documentType: documentType || 'AADHAAR',
                  fileUrl: documentUrl,
                },
              ],
            }
          : undefined,
      },
      include: {
        flat: true,
        tenant: true,
      },
    });

    const passCode = generateSecurePassToken();
    const validFrom = new Date(arrival.getTime() - 60 * 60 * 1000); // 1 hr grace before
    const validUntil = new Date(departure.getTime() + 2 * 60 * 60 * 1000); // 2 hrs grace after

    const pass = await prisma.visitorPass.create({
      data: {
        visitorRequestId: visitorRequest.id,
        passCode,
        validFrom,
        validUntil,
        isActive: isAutoApproved,
      },
    });

    // Notify Management if pending approval
    if (!isAutoApproved) {
      await notifyManagement(
        'New Visitor Pass Request',
        `${visitorName} (${relationship}) requesting visit to Flat ${visitorRequest.flat.flatNumber} on ${arrival.toLocaleDateString('en-IN')}`,
        'VISITOR_REQUEST',
        '/portal/admin/visitors'
      );
    }

    await logAudit({
      userId: auth.session.id,
      actorName: auth.session.name,
      action: 'VISITOR_REQUEST_CREATED',
      resource: 'VisitorRequest',
      resourceId: visitorRequest.id,
      newValue: { visitorName, status: initialStatus },
    });

    return NextResponse.json({
      success: true,
      visitorRequest,
      pass,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: { message: err.message } }, { status: 500 });
  }
}
