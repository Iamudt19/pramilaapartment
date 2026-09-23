'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { NotificationBell } from './NotificationBell';
import {
  Building2,
  Shield,
  User,
  LogOut,
  ChevronDown,
  Sparkles,
  ArrowRightLeft,
} from 'lucide-react';

export function Navbar() {
  const { user, logout, login } = useAuth();

  const demoSwitchAccounts = [
    { label: 'Admin', email: 'admin@pramila.com', role: 'SUPER_ADMIN' },
    { label: 'Manager', email: 'manager@pramila.com', role: 'PROPERTY_MANAGER' },
    { label: 'Accountant', email: 'accountant@pramila.com', role: 'ACCOUNTANT' },
    { label: 'Security', email: 'security@pramila.com', role: 'SECURITY_GUARD' },
    { label: 'Technician', email: 'maintenance@pramila.com', role: 'MAINTENANCE_STAFF' },
    { label: 'Tenant (A-101)', email: 'tenant1@pramila.com', role: 'TENANT' },
  ];

  return (
    <header className="glass-header sticky top-0 z-40 px-4 lg:px-8 py-3.5 flex items-center justify-between">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-900/30 group-hover:scale-105 transition-all">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-300">
                Pramila Apartments
              </span>
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-1.5 py-0.5 rounded">
                PROD
              </span>
            </div>
            <p className="text-[11px] text-slate-400 -mt-0.5 font-medium">Residential Property Management</p>
          </div>
        </Link>
      </div>

      {/* Center / Quick Switcher */}
      <div className="hidden md:flex items-center gap-1.5 bg-slate-900/80 p-1.5 rounded-xl border border-slate-700/50">
        <span className="text-[11px] font-semibold text-slate-400 px-2 flex items-center gap-1">
          <ArrowRightLeft className="w-3.5 h-3.5 text-cyan-400" /> Switch Role:
        </span>
        {demoSwitchAccounts.map((acc) => (
          <button
            key={acc.email}
            onClick={() => login(acc.email)}
            className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
              user?.email === acc.email
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            {acc.label}
          </button>
        ))}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {user ? (
          <>
            <NotificationBell />

            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-slate-700 flex items-center justify-center font-bold text-white text-sm shadow-md">
                {user.name?.charAt(0) || 'U'}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-semibold text-slate-200">{user.name}</div>
                <div className="text-[10px] text-emerald-400 font-medium">
                  {user.role.replace('_', ' ')}
                  {user.flatNumber ? ` • ${user.flatNumber}` : ''}
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
              className="px-4 py-2 text-xs font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-all"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl shadow-md shadow-emerald-500/20 transition-all"
            >
              Tenant Register
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
