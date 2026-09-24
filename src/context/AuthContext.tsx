'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  phone?: string;
  tenantId?: string;
  flatId?: string;
  flatNumber?: string;
  buildingName?: string;
  staffId?: string;
}

interface AuthResult {
  success: boolean;
  error?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password?: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => ({ success: false }),
  logout: async () => {},
  refreshUser: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const fetchCurrentUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, [pathname]);

  const login = async (email: string, password?: string): Promise<AuthResult> => {
    try {
      setLoading(true);
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password: (password || 'Password@123').trim() }),
      });

      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        // Route according to role
        if (data.user.role === 'SUPER_ADMIN' || data.user.role === 'PROPERTY_MANAGER') {
          router.push('/portal/admin');
        } else if (data.user.role === 'TENANT') {
          router.push('/portal/tenant');
        } else if (data.user.role === 'SECURITY_GUARD') {
          router.push('/portal/security');
        } else if (data.user.role === 'ACCOUNTANT') {
          router.push('/portal/accountant');
        } else if (data.user.role === 'MAINTENANCE_STAFF') {
          router.push('/portal/maintenance');
        } else {
          router.push('/portal/admin');
        }
        return { success: true };
      }
      return { success: false, error: data.error?.message || 'Login failed. Please check credentials.' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network connection error' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      router.push('/login');
    } catch (err) {
      console.error(err);
    }
  };

  const refreshUser = async () => {
    await fetchCurrentUser();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
