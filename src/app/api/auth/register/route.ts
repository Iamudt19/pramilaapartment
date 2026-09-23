import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import { logAudit } from '@/lib/audit';
import { notifyManagement } from '@/lib/notifications';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const {
      fullName,
      email,
      phone,
      password,
      avatarUrl,
      permanentAddress,
      emergencyContactName,
      emergencyContactPhone,
      occupation,
      companyName,
      governmentIdType,
      governmentIdNumber,
      documentTitle,
      documentUrl,
    } = data;

    if (!fullName || !email || !phone || !password) {
      return NextResponse.json(
        { success: false, error: { code: 'MISSING_FIELDS', message: 'Full name, email, phone, and password are required' } },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: { code: 'EMAIL_EXISTS', message: 'An account with this email already exists' } },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);

    // Create User, Tenant profile and initial verification document
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        name: fullName,
        phone,
        avatarUrl: avatarUrl || undefined,
        role: 'TENANT',
        tenant: {
          create: {
            fullName,
            phone,
            email: email.toLowerCase().trim(),
            permanentAddress,
            emergencyContactName,
            emergencyContactPhone,
            occupation,
            companyName,
            governmentIdType: governmentIdType || 'AADHAAR',
            governmentIdNumber,
            status: 'PENDING',
            documents: documentUrl
              ? {
                  create: [
                    {
                      documentType: governmentIdType || 'AADHAAR',
                      title: documentTitle || 'Government ID Proof',
                      fileUrl: documentUrl,
                      status: 'PENDING',
                    },
                  ],
                }
              : undefined,
          },
        },
      },
      include: {
        tenant: true,
      },
    });

    // Notify Management
    await notifyManagement(
      'New Tenant Registration Application',
      `${fullName} has submitted a tenant registration application for review.`,
      'TENANT_APPLICATION',
      `/portal/admin/tenants`
    );

    // Audit Log
    await logAudit({
      userId: user.id,
      actorName: fullName,
      action: 'TENANT_REGISTRATION_SUBMITTED',
      resource: 'Tenant',
      resourceId: user.tenant?.id,
      newValue: { fullName, email, phone },
    });

    return NextResponse.json({
      success: true,
      message: 'Registration submitted successfully. Estate management will review your application shortly.',
      tenantId: user.tenant?.id,
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: error.message || 'Failed to submit registration' } },
      { status: 500 }
    );
  }
}
