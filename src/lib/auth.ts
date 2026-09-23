import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { Role } from '@/types';
import prisma from './prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'pramila-super-secret-jwt-key-change-in-production-2026-secure-token';
const key = new TextEncoder().encode(JWT_SECRET);
const COOKIE_NAME = 'pramila_auth_token';

export interface UserSession {
  id: string;
  email: string;
  name: string;
  role: Role;
  tenantId?: string;
  flatId?: string;
  flatNumber?: string;
  staffId?: string;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function signToken(payload: UserSession): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(key);
}

export async function verifyToken(token: string): Promise<UserSession | null> {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ['HS256'],
    });
    return payload as unknown as UserSession;
  } catch (error) {
    return null;
  }
}

export async function setAuthCookie(session: UserSession, response?: NextResponse) {
  const token = await signToken(session);
  const cookieOptions = {
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  };

  if (response) {
    response.cookies.set(cookieOptions);
  } else {
    cookies().set(cookieOptions);
  }
  return token;
}

export async function removeAuthCookie(response?: NextResponse) {
  if (response) {
    response.cookies.delete(COOKIE_NAME);
  } else {
    cookies().delete(COOKIE_NAME);
  }
}

export async function getCurrentSession(req?: NextRequest): Promise<UserSession | null> {
  try {
    let token: string | undefined;
    if (req) {
      token = req.cookies.get(COOKIE_NAME)?.value;
      if (!token) {
        const authHeader = req.headers.get('Authorization');
        if (authHeader && authHeader.startsWith('Bearer ')) {
          token = authHeader.substring(7);
        }
      }
    } else {
      token = cookies().get(COOKIE_NAME)?.value;
    }

    if (!token) return null;
    return await verifyToken(token);
  } catch (err) {
    return null;
  }
}

export async function getUserWithDetails(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      tenant: {
        include: {
          tenancies: {
            where: { status: 'ACTIVE' },
            include: {
              flat: {
                include: {
                  building: true,
                },
              },
            },
            take: 1,
          },
        },
      },
      staff: true,
    },
  });

  if (!user) return null;

  const activeTenancy = user.tenant?.tenancies?.[0];

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    phone: user.phone,
    role: user.role,
    tenantId: user.tenant?.id,
    flatId: activeTenancy?.flatId,
    flatNumber: activeTenancy?.flat?.flatNumber,
    buildingName: activeTenancy?.flat?.building?.name,
    staffId: user.staff?.id,
  };
}
