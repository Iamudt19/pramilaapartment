import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/rbac';
import { parseQrPayload } from '@/lib/qr';

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth(req, ['SECURITY_GUARD', 'SUPER_ADMIN', 'PROPERTY_MANAGER']);
    if ('error' in auth) return auth.error;

    const { passCode, rawQrData } = await req.json();

    let targetCode = passCode;
    if (rawQrData) {
      const parsed = parseQrPayload(rawQrData);
      if (parsed) {
        targetCode = parsed;
      } else {
        targetCode = rawQrData.trim();
      }
    }

    if (!targetCode) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_INPUT', message: 'Pass code or QR payload required' } },
        { status: 400 }
      );
    }

    const pass = await prisma.visitorPass.findFirst({
      where: { passCode: targetCode },
      include: {
        visitorRequest: {
          include: {
            tenant: {
              select: {
                fullName: true,
                phone: true,
              },
            },
            flat: {
              select: {
                flatNumber: true,
                building: { select: { name: true } },
              },
            },
            entries: true,
            exits: true,
            documents: true,
          },
        },
      },
    });

    if (!pass) {
      return NextResponse.json(
        { success: false, error: { code: 'PASS_NOT_FOUND', message: 'No visitor pass found matching this code' } },
        { status: 404 }
      );
    }

    const now = new Date();
    const reqData = pass.visitorRequest;

    // Check validity window
    const isExpired = now > pass.validUntil;
    const isEarly = now < pass.validFrom;
    const isApproved = reqData.status === 'APPROVED' || reqData.status === 'CHECKED_IN';
    const isCheckedIn = reqData.status === 'CHECKED_IN';
    const isCheckedOut = reqData.status === 'CHECKED_OUT';

    let statusValidity = 'VALID';
    let statusMessage = 'Pass is valid for entry verification.';

    if (isCheckedOut) {
      statusValidity = 'COMPLETED';
      statusMessage = 'Visitor has already checked out.';
    } else if (isExpired) {
      statusValidity = 'EXPIRED';
      statusMessage = `Pass expired on ${pass.validUntil.toLocaleTimeString('en-IN')}.`;
    } else if (reqData.status === 'REJECTED') {
      statusValidity = 'REJECTED';
      statusMessage = 'This visitor request was rejected by management.';
    } else if (reqData.status === 'CANCELLED') {
      statusValidity = 'CANCELLED';
      statusMessage = 'This visitor pass was cancelled.';
    } else if (!pass.isActive) {
      statusValidity = 'INACTIVE';
      statusMessage = 'This pass has been deactivated.';
    }

    return NextResponse.json({
      success: true,
      data: {
        passId: pass.id,
        passCode: pass.passCode,
        requestId: reqData.id,
        visitorName: reqData.visitorName,
        visitorPhone: reqData.visitorPhone,
        relationship: reqData.relationship,
        purpose: reqData.purpose,
        vehicleNumber: reqData.vehicleNumber,
        flatNumber: reqData.flat?.flatNumber || 'N/A',
        buildingName: reqData.flat?.building?.name || 'Main Tower',
        tenantName: reqData.tenant?.fullName || 'Resident',
        tenantPhone: reqData.tenant?.phone || '',
        status: reqData.status,
        statusValidity,
        statusMessage,
        validFrom: pass.validFrom,
        validUntil: pass.validUntil,
        isCheckedIn,
        isCheckedOut,
        entries: reqData.entries,
        exits: reqData.exits,
        documents: reqData.documents,
      },
    });
  } catch (err: any) {
    console.error('Verify pass error:', err);
    return NextResponse.json({ success: false, error: { message: err.message } }, { status: 500 });
  }
}
