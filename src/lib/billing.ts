import prisma from './prisma';
import { getSetting } from './settings';
import { BillType } from '@/types';

export interface InvoiceItemInput {
  itemType: BillType;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export function calculateElectricityCharge(
  previousReading: number,
  currentReading: number,
  ratePerUnit: number
): { units: number; amount: number } {
  const units = Math.max(0, currentReading - previousReading);
  const amount = Math.round(units * ratePerUnit * 100) / 100;
  return { units, amount };
}

export function generateInvoiceNumber(flatNumber: string, date: Date = new Date()): string {
  const yearMonth = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}`;
  const cleanFlat = flatNumber.replace(/[^A-Za-z0-9]/g, '');
  const randomSuffix = Math.floor(100 + Math.random() * 900);
  return `INV-${yearMonth}-${cleanFlat}-${randomSuffix}`;
}

export function generateReceiptNumber(date: Date = new Date()): string {
  const year = date.getFullYear();
  const random = Math.floor(100000 + Math.random() * 900000);
  return `REC-${year}-${random}`;
}

export async function generateMonthlyRecurringInvoices(billingPeriod: string): Promise<{
  created: number;
  skipped: number;
  errors: string[];
}> {
  const activeTenancies = await prisma.tenancy.findMany({
    where: {
      status: 'ACTIVE',
    },
    include: {
      tenant: true,
      flat: {
        include: {
          building: true,
          meters: {
            where: { meterType: 'ELECTRICITY', currentStatus: 'ACTIVE' },
            include: {
              readings: {
                orderBy: { readingDate: 'desc' },
                take: 1,
              },
            },
          },
        },
      },
    },
  });

  const rentDueDay = await getSetting('billing.rent_due_day');
  const electricityRate = await getSetting('billing.electricity_rate_per_unit');
  const waterFixed = await getSetting('billing.water_charge_fixed');

  let createdCount = 0;
  let skippedCount = 0;
  const errorLogs: string[] = [];

  const now = new Date();
  const dueDate = new Date(now.getFullYear(), now.getMonth(), rentDueDay);
  if (dueDate < now) {
    dueDate.setMonth(dueDate.getMonth() + 1);
  }

  for (const tenancy of activeTenancies) {
    try {
      // Check if invoice already exists for this tenancy/flat & billing period (Idempotent)
      const existing = await prisma.invoice.findFirst({
        where: {
          tenantId: tenancy.tenantId,
          flatId: tenancy.flatId,
          billingPeriod: billingPeriod,
        },
      });

      if (existing) {
        skippedCount++;
        continue;
      }

      const items: InvoiceItemInput[] = [
        {
          itemType: 'RENT',
          description: `Monthly Rent for Flat ${tenancy.flat.flatNumber} (${billingPeriod})`,
          quantity: 1,
          unitPrice: tenancy.monthlyRent,
          totalPrice: tenancy.monthlyRent,
        },
        {
          itemType: 'MAINTENANCE',
          description: `Society Maintenance Charges (${billingPeriod})`,
          quantity: 1,
          unitPrice: tenancy.maintenanceAmount || tenancy.flat.maintenance || 2500,
          totalPrice: tenancy.maintenanceAmount || tenancy.flat.maintenance || 2500,
        },
      ];

      // Add fixed water charge
      if (waterFixed > 0) {
        items.push({
          itemType: 'WATER',
          description: `Water Supply Charges (${billingPeriod})`,
          quantity: 1,
          unitPrice: waterFixed,
          totalPrice: waterFixed,
        });
      }

      // Check for unbilled meter readings
      const meter = tenancy.flat.meters?.[0];
      const latestReading = meter?.readings?.[0];
      if (latestReading && !latestReading.isBilled) {
        items.push({
          itemType: 'ELECTRICITY',
          description: `Electricity Meter #${meter.meterNumber} (${latestReading.unitsConsumed} units @ ₹${latestReading.ratePerUnit}/unit)`,
          quantity: latestReading.unitsConsumed,
          unitPrice: latestReading.ratePerUnit,
          totalPrice: latestReading.totalAmount,
        });
      }

      // Check for unbilled penalties
      const pendingPenalties = await prisma.penalty.findMany({
        where: {
          tenantId: tenancy.tenantId,
          status: 'CONFIRMED',
          invoiceId: null,
        },
      });

      for (const penalty of pendingPenalties) {
        items.push({
          itemType: 'PENALTY',
          description: `Penalty: ${penalty.reason}`,
          quantity: 1,
          unitPrice: penalty.amount,
          totalPrice: penalty.amount,
        });
      }

      const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
      const totalAmount = subtotal;
      const invoiceNumber = generateInvoiceNumber(tenancy.flat.flatNumber);

      const invoice = await prisma.invoice.create({
        data: {
          invoiceNumber,
          tenantId: tenancy.tenantId,
          flatId: tenancy.flatId,
          billingPeriod,
          issueDate: now,
          dueDate,
          subtotal,
          taxAmount: 0,
          discountAmount: 0,
          lateFee: 0,
          totalAmount,
          paidAmount: 0,
          balanceAmount: totalAmount,
          status: 'PENDING',
          items: {
            create: items.map((i) => ({
              itemType: i.itemType,
              description: i.description,
              quantity: i.quantity,
              unitPrice: i.unitPrice,
              totalPrice: i.totalPrice,
            })),
          },
        },
      });

      // Link confirmed penalties to this invoice and mark as APPLIED
      if (pendingPenalties.length > 0) {
        await prisma.penalty.updateMany({
          where: { id: { in: pendingPenalties.map((p) => p.id) } },
          data: { invoiceId: invoice.id, status: 'APPLIED' },
        });
      }

      // Mark meter reading as billed
      if (latestReading && !latestReading.isBilled) {
        await prisma.meterReading.update({
          where: { id: latestReading.id },
          data: { isBilled: true },
        });
      }

      // Create notification for tenant
      await prisma.notification.create({
        data: {
          userId: tenancy.tenant.userId,
          title: `New Invoice Generated: ${invoiceNumber}`,
          message: `Your invoice for ${billingPeriod} of amount ₹${totalAmount.toLocaleString('en-IN')} has been generated. Due date: ${dueDate.toLocaleDateString('en-IN')}.`,
          eventType: 'BILL_GENERATED',
          link: `/portal/tenant/bills`,
        },
      });

      createdCount++;
    } catch (err: any) {
      errorLogs.push(`Error for flat ${tenancy.flat?.flatNumber}: ${err.message}`);
    }
  }

  return { created: createdCount, skipped: skippedCount, errors: errorLogs };
}
