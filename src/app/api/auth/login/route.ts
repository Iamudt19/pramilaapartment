import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { comparePassword, setAuthCookie, getUserWithDetails } from '@/lib/auth';
import { logAudit } from '@/lib/audit';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_INPUT', message: 'Email and password are required' } },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user || !user.isActive) {
      return NextResponse.json(
        { success: false, error: { code: 'AUTH_FAILED', message: 'Invalid credentials or inactive account' } },
        { status: 401 }
      );
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: { code: 'AUTH_FAILED', message: 'Invalid credentials' } },
        { status: 401 }
      );
    }

    const userDetails = await getUserWithDetails(user.id);
    if (!userDetails) {
      return NextResponse.json(
        { success: false, error: { code: 'USER_NOT_FOUND', message: 'User profile error' } },
        { status: 404 }
      );
    }

    const sessionPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as any,
      tenantId: userDetails.tenantId,
      flatId: userDetails.flatId,
      flatNumber: userDetails.flatNumber,
      staffId: userDetails.staffId,
    };

    const response = NextResponse.json({
      success: true,
      user: userDetails,
    });

    await setAuthCookie(sessionPayload, response);

    // Audit log
    await logAudit({
      userId: user.id,
      actorName: user.name,
      action: 'LOGIN_SUCCESS',
      resource: 'User',
      resourceId: user.id,
      ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
    });

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Internal server error during login' } },
      { status: 500 }
    );
  }
}
