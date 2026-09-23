import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/rbac';
import { generateReceiptNumber } from '@/lib/billing';
import { logAudit } from '@/lib/audit';
import { sendNotification } from '@/lib/notifications';

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req);
    if ('error' in auth) return auth.error;

    const { searchParams } = new URL(req.url);
    const invoiceId = searchParams.get('invoiceId');

    const where: any = {};
    if (invoiceId) where.invoiceId = invoiceId;

    if (auth.session.role === 'TENANT') {
      where.tenantId = auth.session.tenantId;
    }

    const payments = await prisma.payment.findMany({
      where,
      include: {
        invoice: {
          include: {
            flat: { include: { building: true } },
            items: true,
          },
        },
        tenant: { include: { user: true } },
        transactions: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, payments });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: { message: err.message } }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth(req, ['TENANT', 'ACCOUNTANT', 'SUPER_ADMIN', 'PROPERTY_MANAGER']);
    if ('error' in auth) return auth.error;

    const data = await req.json();
    const { invoiceId, amount, paymentMethod, transactionRef, notes } = data;

    if (!invoiceId || !amount) {
      return NextResponse.json(
        { success: false, error: { message: 'Invoice ID and payment amount are required' } },
        { status: 400 }
      );
    }

    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: { tenant: { include: { user: true } }, flat: true },
    });

    if (!invoice) {
      return NextResponse.json({ success: false, error: { message: 'Invoice not found' } }, { status: 404 });
    }

    const payAmount = parseFloat(amount);
    const newPaidAmount = invoice.paidAmount + payAmount;
    const newBalanceAmount = Math.max(0, invoice.totalAmount - newPaidAmount);
    const newStatus = newBalanceAmount === 0 ? 'PAID' : 'PARTIALLY_PAID';

    const receiptNumber = generateReceiptNumber();

    // 1. Create Payment record & transaction
    const payment = await prisma.payment.create({
      data: {
        receiptNumber,
        invoiceId: invoice.id,
        tenantId: invoice.tenantId,
        amount: payAmount,
        paymentMethod: paymentMethod || 'ONLINE_GATEWAY',
        status: 'SUCCESS',
        transactionRef: transactionRef || `TXN_${Date.now()}`,
        recordedBy: auth.session.name,
        notes,
        transactions: {
          create: [
            {
              gatewayName: paymentMethod === 'ONLINE_GATEWAY' ? 'RAZORPAY' : 'MANUAL',
              gatewayPaymentId: transactionRef || `pay_${Date.now()}`,
              amount: payAmount,
              currency: 'INR',
              status: 'SUCCESS',
            },
          ],
        },
      },
      include: {
        transactions: true,
        invoice: true,
        tenant: true,
      },
    });

    // 2. Update Invoice status & balance
    await prisma.invoice.update({
      where: { id: invoice.id },
      data: {
        paidAmount: newPaidAmount,
        balanceAmount: newBalanceAmount,
        status: newStatus,
      },
    });

    // 3. Send Notification to Tenant
    await sendNotification({
      userId: invoice.tenant.userId,
      title: 'Payment Received — Receipt Generated',
      message: `Payment of ₹${payAmount.toLocaleString('en-IN')} for Invoice ${invoice.invoiceNumber} recorded successfully. Receipt No: ${receiptNumber}.`,
      eventType: 'PAYMENT_CONFIRMED',
      link: '/portal/tenant/bills',
      sendEmail: true,
    });

    // 4. Audit Log
    await logAudit({
      userId: auth.session.id,
      actorName: auth.session.name,
      action: 'PAYMENT_RECORDED',
      resource: 'Payment',
      resourceId: payment.id,
      newValue: { receiptNumber, amount: payAmount, invoiceNumber: invoice.invoiceNumber },
    });

    return NextResponse.json({ success: true, payment, receiptNumber });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: { message: err.message } }, { status: 500 });
  }
}
