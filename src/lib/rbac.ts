import { Role } from '@/types';
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession, UserSession } from './auth';

export const ROLE_PERMISSIONS: Record<Role, string[]> = {
  SUPER_ADMIN: ['*'],
  PROPERTY_MANAGER: [
    'properties:read',
    'properties:write',
    'flats:read',
    'flats:write',
    'tenants:read',
    'tenants:write',
    'tenants:approve',
    'visitors:read',
    'visitors:approve',
    'visitors:write',
    'security:read',
    'security:write',
    'bills:read',
    'bills:write',
    'payments:read',
    'payments:write',
    'maintenance:read',
    'maintenance:write',
    'maintenance:assign',
    'notices:read',
    'notices:write',
    'documents:read',
    'documents:verify',
    'staff:read',
    'staff:write',
    'reports:read',
    'settings:read',
    'settings:write',
    'audit:read',
  ],
  ACCOUNTANT: [
    'bills:read',
    'bills:write',
    'payments:read',
    'payments:write',
    'payments:reconcile',
    'reports:read',
    'tenants:read',
    'flats:read',
    'notices:read',
  ],
  SECURITY_GUARD: [
    'visitors:read',
    'visitors:verify',
    'visitors:checkin',
    'visitors:checkout',
    'security:incidents:write',
    'vehicles:read',
    'vehicles:write',
    'flats:read',
    'notices:read',
  ],
  MAINTENANCE_STAFF: [
    'maintenance:read',
    'maintenance:update',
    'flats:read',
    'notices:read',
  ],
  TENANT: [
    'tenant:profile:read',
    'tenant:profile:write',
    'tenant:bills:read',
    'tenant:bills:pay',
    'tenant:visitors:read',
    'tenant:visitors:write',
    'tenant:maintenance:read',
    'tenant:maintenance:write',
    'tenant:family:read',
    'tenant:family:write',
    'tenant:vehicles:read',
    'tenant:vehicles:write',
    'tenant:documents:read',
    'tenant:documents:write',
    'notices:read',
  ],
};

export function hasRole(session: UserSession | null, allowedRoles: Role[]): boolean {
  if (!session) return false;
  if (session.role === 'SUPER_ADMIN') return true;
  return allowedRoles.includes(session.role);
}

export async function requireAuth(
  req: NextRequest,
  allowedRoles?: Role[]
): Promise<{ session: UserSession } | { error: NextResponse }> {
  const session = await getCurrentSession(req);
  if (!session) {
    return {
      error: NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      ),
    };
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const isAllowed = hasRole(session, allowedRoles);
    if (!isAllowed) {
      return {
        error: NextResponse.json(
          { success: false, error: { code: 'FORBIDDEN', message: 'You do not have permission to access this resource' } },
          { status: 403 }
        ),
      };
    }
  }

  return { session };
}
