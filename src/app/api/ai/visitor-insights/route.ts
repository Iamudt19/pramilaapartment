import { NextRequest, NextResponse } from 'next/server';
import { inspectVisitorSecurity } from '@/lib/ai/visitorInsights';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/rbac';

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req, ['SUPER_ADMIN', 'PROPERTY_MANAGER', 'SECURITY_GUARD']);
    if ('error' in auth) return auth.error;

    const visitors = await prisma.visitor.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
        },
      },
      include: { flat: true },
      orderBy: { createdAt: 'desc' },
    });

    const report = inspectVisitorSecurity(visitors);

    return NextResponse.json({ success: true, ...report });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { message: err.message || 'AI Visitor Insights failed' } },
      { status: 500 }
    );
  }
}
