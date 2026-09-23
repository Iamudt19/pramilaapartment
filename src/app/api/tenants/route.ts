import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/rbac';
import { hashPassword } from '@/lib/auth';
import { logAudit } from '@/lib/audit';

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req, ['SUPER_ADMIN', 'PROPERTY_MANAGER', 'ACCOUNTANT']);
    if ('error' in auth) return auth.error;

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const where: any = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { fullName: { contains: search } },
        { email: { contains: search } },
        { phone: { contains: search } },
      ];
    }

    const tenants = await prisma.tenant.findMany({
      where,
      include: {
        user: true,
        tenancies: {
          include: {
            flat: {
              include: { building: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        documents: true,
        familyMembers: true,
        vehicles: true,
        invoices: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, tenants });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: { message: err.message } }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth(req, ['SUPER_ADMIN', 'PROPERTY_MANAGER']);
    if ('error' in auth) return auth.error;

    const data = await req.json();
    const {
      fullName,
      email,
      phone,
      password,
      flatId,
      monthlyRent,
      depositAmount,
      maintenanceAmount,
      startDate,
      endDate,
      permanentAddress,
      emergencyContactName,
      emergencyContactPhone,
      occupation,
      companyName,
      governmentIdType,
      governmentIdNumber,
    } = data;

    if (!fullName || !email || !phone) {
      return NextResponse.json({ success: false, error: { message: 'Missing required tenant details' } }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existing) {
      return NextResponse.json({ success: false, error: { message: 'Email already registered' } }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password || 'Password@123');

    // Create user and tenant
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        name: fullName,
        phone,
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
            status: flatId ? 'ACTIVE' : 'APPROVED',
          },
        },
      },
      include: {
        tenant: true,
      },
    });

    // If flatId provided, create Tenancy and mark Flat occupied
    if (flatId && user.tenant) {
      const flat = await prisma.flat.findUnique({ where: { id: flatId } });
      if (flat) {
        await prisma.tenancy.create({
          data: {
            tenantId: user.tenant.id,
            flatId: flat.id,
            startDate: startDate ? new Date(startDate) : new Date(),
            endDate: endDate ? new Date(endDate) : null,
            monthlyRent: monthlyRent ? parseFloat(monthlyRent) : flat.monthlyRent,
            depositAmount: depositAmount ? parseFloat(depositAmount) : flat.deposit,
            maintenanceAmount: maintenanceAmount ? parseFloat(maintenanceAmount) : flat.maintenance,
            status: 'ACTIVE',
          },
        });

        await prisma.flat.update({
          where: { id: flat.id },
          data: { status: 'OCCUPIED' },
        });
      }
    }

    await logAudit({
      userId: auth.session.id,
      actorName: auth.session.name,
      action: 'TENANT_CREATED_BY_ADMIN',
      resource: 'Tenant',
      resourceId: user.tenant?.id,
      newValue: { fullName, email, flatId },
    });

    return NextResponse.json({ success: true, tenant: user.tenant });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: { message: err.message } }, { status: 500 });
  }
}
