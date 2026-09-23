import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession, getUserWithDetails } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await getCurrentSession(req);
    if (!session) {
      return NextResponse.json({ success: false, user: null }, { status: 401 });
    }

    const user = await getUserWithDetails(session.id);
    if (!user) {
      return NextResponse.json({ success: false, user: null }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (err) {
    return NextResponse.json({ success: false, user: null }, { status: 500 });
  }
}
