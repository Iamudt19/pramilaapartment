import { NextRequest, NextResponse } from 'next/server';
import { processConciergeQuery } from '@/lib/ai/concierge';
import { getAuthSession } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const session = await getAuthSession(req);
    const body = await req.json();
    const { query } = body;

    if (!query) {
      return NextResponse.json({ success: false, error: { message: 'Query string is required' } }, { status: 400 });
    }

    let outstandingBalance = 0;
    let flatNumber: string | undefined;

    if (session?.role === 'TENANT' && session.tenantId) {
      const tenant = await prisma.tenant.findUnique({
        where: { id: session.tenantId },
        include: {
          tenancies: {
            where: { status: 'ACTIVE' },
            include: { flat: true },
            take: 1,
          },
          invoices: { where: { status: { in: ['PENDING', 'OVERDUE', 'PARTIALLY_PAID'] } } },
        },
      });

      if (tenant) {
        flatNumber = tenant.tenancies?.[0]?.flat?.flatNumber;
        outstandingBalance = tenant.invoices.reduce((sum, inv) => sum + (inv.totalAmount - inv.paidAmount), 0);
      }
    }

    const result = processConciergeQuery(query, {
      userRole: session?.role || 'GUEST',
      userName: session?.name || 'Resident',
      flatNumber,
      outstandingBalance,
    });

    return NextResponse.json({ success: true, ...result });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: { message: err.message || 'AI processing failed' } }, { status: 500 });
  }
}
