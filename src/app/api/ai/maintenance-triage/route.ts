import { NextRequest, NextResponse } from 'next/server';
import { triageMaintenanceIssue } from '@/lib/ai/maintenanceTriage';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description } = body;

    if (!title && !description) {
      return NextResponse.json(
        { success: false, error: { message: 'Issue title or description is required' } },
        { status: 400 }
      );
    }

    const result = triageMaintenanceIssue(title || 'Repair Request', description || '');

    return NextResponse.json({ success: true, ...result });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { message: err.message || 'AI triage processing failed' } },
      { status: 500 }
    );
  }
}
