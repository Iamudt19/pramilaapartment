import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/rbac';
import { generateMonthlyRecurringInvoices } from '@/lib/billing';
import { logAudit } from '@/lib/audit';

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth(req, ['ACCOUNTANT', 'SUPER_ADMIN', 'PROPERTY_MANAGER']);
    if ('error' in auth) return auth.error;

    const { billingPeriod } = await req.json();

    const period = billingPeriod || new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' });

    const result = await generateMonthlyRecurringInvoices(period);

    await logAudit({
      userId: auth.session.id,
      actorName: auth.session.name,
      action: 'BATCH_BILLING_CYCLE_EXECUTED',
      resource: 'Invoice',
      newValue: { period, ...result },
    });

    return NextResponse.json({
      success: true,
      message: `Batch billing processed for ${period}: ${result.created} created, ${result.skipped} skipped (already billed).`,
      result,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: { message: err.message } }, { status: 500 });
  }
}
