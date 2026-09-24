import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { comparePassword, setAuthCookie, getUserWithDetails } from '@/lib/auth';
import { logAudit } from '@/lib/audit';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const cleanEmail = (email || '').toLowerCase().trim();
    const cleanPassword = (password || '').trim();

    if (!cleanEmail || !cleanPassword) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_INPUT', message: 'Email and password are required' } },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (!user || !user.isActive) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'AUTH_FAILED',
            message: `No active account found for ${cleanEmail}. Please check spelling or use demo accounts (e.g. admin@pramila.com or tenant1@pramila.com).`,
          },
        },
        { status: 401 }
      );
    }

    // Compare original, trimmed, and common mobile case variants
    let isMatch = await comparePassword(cleanPassword, user.password);
    if (!isMatch) {
      isMatch = await comparePassword(password, user.password);
    }
    if (!isMatch && cleanPassword.toLowerCase() === 'password@123') {
      isMatch = await comparePassword('Password@123', user.password);
    }

    if (!isMatch) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'AUTH_FAILED',
            message: 'Incorrect password. Default demo password is "Password@123" (case-sensitive).',
          },
        },
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
