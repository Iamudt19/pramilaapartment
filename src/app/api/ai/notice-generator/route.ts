import { NextRequest, NextResponse } from 'next/server';
import { generateSocietyNotice } from '@/lib/ai/noticeGenerator';
import { requireAuth } from '@/lib/rbac';

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth(req, ['SUPER_ADMIN', 'PROPERTY_MANAGER', 'ACCOUNTANT']);
    if ('error' in auth) return auth.error;

    const body = await req.json();
    const { prompt } = body;

    if (!prompt) {
      return NextResponse.json(
        { success: false, error: { message: 'Prompt or outline is required' } },
        { status: 400 }
      );
    }

    const result = generateSocietyNotice(prompt);

    return NextResponse.json({ success: true, ...result });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { message: err.message || 'AI Notice generation failed' } },
      { status: 500 }
    );
  }
}
