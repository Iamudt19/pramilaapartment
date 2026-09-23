'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { NotificationBell } from './NotificationBell';
import {
  Building2,
  Shield,
  User,
  LogOut,
  ChevronDown,
  Sparkles,
  Lock,
  Users,
  ShieldCheck,
  KeyRound,
  ArrowRight,
  AlertCircle,
  X,
} from 'lucide-react';

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, login } = useAuth();
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState<string | null>(null);
  const [adminLoading, setAdminLoading] = useState(false);

  const handleAdminUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError(null);
    setAdminLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@pramila.com', password: adminPassword }),
      });
      const data = await res.json();
      if (data.success) {
        setShowAdminModal(false);
        setAdminPassword('');
        // Re-authenticate context
        await login('admin@pramila.com');
        router.push('/portal/admin');
      } else {
        setAdminError(data.error?.message || 'Invalid Admin Password. Please try again.');
      }
    } catch (err: any) {
      setAdminError(err.message || 'Authentication error');
    } finally {
      setAdminLoading(false);
    }
  };

  const handleOpenAdmin = () => {
    if (user?.role === 'SUPER_ADMIN' || user?.role === 'PROPERTY_MANAGER') {
      router.push('/portal/admin');
    } else {
      setShowAdminModal(true);
    }
  };

  const handleOpenTenant = () => {
    if (user?.role === 'TENANT') {
      router.push('/portal/tenant');
    } else {
      login('tenant1@pramila.com');
      router.push('/portal/tenant');
    }
  };

  return (
    <>
      <header className="glass-header sticky top-0 z-40 px-4 lg:px-8 py-3.5 flex items-center justify-between border-b border-slate-800">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-all">
              <Building2 className="w-5 h-5 text-slate-950 font-black" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-300">
                  Pramila Apartments
                </span>
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  RESIDENTIAL
                </span>
              </div>
              <p className="text-[11px] text-slate-400 -mt-0.5 font-medium">Rental & Estate Management Platform</p>
            </div>
          </Link>
        </div>

        {/* Center: Streamlined Portals (Tenant & Admin) */}
        <div className="hidden sm:flex items-center gap-2 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={handleOpenTenant}
            className={`px-3.5 py-1.5 text-xs rounded-xl font-bold flex items-center gap-1.5 transition-all ${
              pathname.startsWith('/portal/tenant')
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Tenant Portal</span>
          </button>

          <button
            onClick={handleOpenAdmin}
            className={`px-3.5 py-1.5 text-xs rounded-xl font-bold flex items-center gap-1.5 transition-all ${
              pathname.startsWith('/portal/admin')
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>Admin Portal</span>
            {user?.role !== 'SUPER_ADMIN' && user?.role !== 'PROPERTY_MANAGER' && (
              <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded font-mono">Password</span>
            )}
          </button>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <NotificationBell />

              <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center font-bold text-slate-950 text-sm shadow-md">
                  {user.name?.charAt(0) || 'U'}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-bold text-slate-200">{user.name}</div>
                  <div className="text-[10px] text-emerald-400 font-semibold">
                    {user.role === 'SUPER_ADMIN' ? 'Estate Administrator' : 'Resident Tenant'}
                    {user.flatNumber ? ` • Flat ${user.flatNumber}` : ''}
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-all border border-transparent hover:border-rose-900/50"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-3.5 py-2 text-xs font-bold text-slate-200 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-700 transition-all"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="px-3.5 py-2 text-xs font-extrabold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl shadow-md shadow-emerald-500/20 transition-all"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Admin Password Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl p-6 shadow-2xl space-y-4">
            <button
              onClick={() => setShowAdminModal(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center pt-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center mx-auto text-white shadow-lg mb-3">
                <Lock className="w-6 h-6 text-amber-300" />
              </div>
              <h3 className="text-lg font-black text-white">Admin Master Access</h3>
              <p className="text-xs text-slate-400 mt-1">Enter estate administrator credentials or password to open portal</p>
            </div>

            {adminError && (
              <div className="bg-rose-950/40 border border-rose-500/40 text-rose-300 p-3 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{adminError}</span>
              </div>
            )}

            <form onSubmit={handleAdminUnlock} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Admin Password</label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    autoFocus
                    placeholder="Enter admin password (e.g. Password@123)"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-1">Default Password: <code className="text-emerald-400">Password@123</code></p>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAdminModal(false)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2.5 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={adminLoading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-blue-500/20 flex items-center justify-center gap-1.5"
                >
                  {adminLoading ? 'Verifying...' : 'Unlock Admin Portal'} <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

