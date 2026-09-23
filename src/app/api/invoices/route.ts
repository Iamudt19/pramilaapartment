import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/rbac';
import { generateInvoiceNumber } from '@/lib/billing';
import { logAudit } from '@/lib/audit';

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req);
    if ('error' in auth) return auth.error;

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const flatId = searchParams.get('flatId');
    const billingPeriod = searchParams.get('billingPeriod');

    const where: any = {};
    if (status) where.status = status;
    if (flatId) where.flatId = flatId;
    if (billingPeriod) where.billingPeriod = billingPeriod;

    if (auth.session.role === 'TENANT') {
      where.tenantId = auth.session.tenantId;
    }

    const invoices = await prisma.invoice.findMany({
      where,
      include: {
        tenant: { include: { user: true } },
        flat: { include: { building: true } },
        items: true,
        payments: {
          include: { transactions: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, invoices });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: { message: err.message } }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth(req, ['ACCOUNTANT', 'SUPER_ADMIN', 'PROPERTY_MANAGER']);
    if ('error' in auth) return auth.error;

    const data = await req.json();
    const { tenantId, flatId, billingPeriod, dueDate, items, notes } = data;

    if (!tenantId || !flatId || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: { message: 'Tenant, Flat, and at least 1 invoice item are required' } },
        { status: 400 }
      );
    }

    const flat = await prisma.flat.findUnique({ where: { id: flatId } });
    if (!flat) {
      return NextResponse.json({ success: false, error: { message: 'Flat not found' } }, { status: 404 });
    }

    const invoiceNumber = generateInvoiceNumber(flat.flatNumber);
    const subtotal = items.reduce((acc: number, item: any) => acc + (parseFloat(item.totalPrice) || 0), 0);
    const totalAmount = subtotal;

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        tenantId,
        flatId,
        billingPeriod: billingPeriod || 'Current Period',
        dueDate: dueDate ? new Date(dueDate) : new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        subtotal,
        totalAmount,
        paidAmount: 0,
        balanceAmount: totalAmount,
        status: 'PENDING',
        notes,
        items: {
          create: items.map((i: any) => ({
            itemType: i.itemType || 'OTHER',
            description: i.description,
            quantity: parseFloat(i.quantity) || 1,
            unitPrice: parseFloat(i.unitPrice) || 0,
            totalPrice: parseFloat(i.totalPrice) || 0,
          })),
        },
      },
      include: {
        items: true,
        flat: true,
        tenant: true,
      },
    });

    await logAudit({
      userId: auth.session.id,
      actorName: auth.session.name,
      action: 'INVOICE_CREATED_MANUALLY',
      resource: 'Invoice',
      resourceId: invoice.id,
      newValue: { invoiceNumber, totalAmount },
    });

    return NextResponse.json({ success: true, invoice });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: { message: err.message } }, { status: 500 });
  }
}
