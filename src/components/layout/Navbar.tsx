'use client';

import React from 'react';
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
  Users,
  ShieldCheck,
  ArrowRight,
  Phone,
  MapPin,
  Home,
} from 'lucide-react';

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const handleOpenTenant = () => {
    if (user?.role === 'TENANT') {
      router.push('/portal/tenant');
    } else {
      router.push('/login');
    }
  };

  return (
    <header className="glass-header sticky top-0 z-40 px-4 lg:px-8 py-3 flex items-center justify-between border-b border-slate-200 bg-white/95 backdrop-blur-xl shadow-sm">
      {/* Brand with Official Logo */}
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="h-10 px-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shadow-sm group-hover:border-emerald-500 transition-all">
            <img
              src="/images/logo.png"
              alt="Pramila Apartment Logo"
              className="h-7 w-auto object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif-luxury font-extrabold text-base tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
                Pramila Apartments
              </span>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full">
                DMCH Road
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
              <MapPin className="w-2.5 h-2.5 text-emerald-600" /> Premium 2BHK Residences
            </p>
          </div>
        </Link>
      </div>

      {/* Center: Navigation Links */}
      <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-slate-600">
        <Link
          href="/"
          className={`hover:text-emerald-600 transition-colors ${
            pathname === '/' ? 'text-emerald-700 font-extrabold' : ''
          }`}
        >
          Home & Amenities
        </Link>
        <a href="/#suites" className="hover:text-emerald-600 transition-colors">
          2BHK Suites
        </a>
        <a href="/#features" className="hover:text-emerald-600 transition-colors">
          Living Benefits
        </a>
        <Link
          href="/portal/tenant"
          onClick={(e) => {
            if (!user || user.role !== 'TENANT') {
              e.preventDefault();
              handleOpenTenant();
            }
          }}
          className={`hover:text-emerald-600 flex items-center gap-1.5 transition-colors ${
            pathname.startsWith('/portal/tenant') ? 'text-emerald-700 font-extrabold' : ''
          }`}
        >
          <Users className="w-3.5 h-3.5 text-emerald-600" /> Resident Portal
        </Link>
      </nav>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {user ? (
          <>
            <NotificationBell />

            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-emerald-600/20">
                {user.name?.charAt(0) || 'U'}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-slate-900">{user.name}</div>
                <div className="text-[10px] text-slate-500 font-medium">
                  {user.role === 'SUPER_ADMIN' ? 'Administrator' : `Flat ${user.flatNumber || 'Resident'}`}
                </div>
              </div>
              <button
                onClick={logout}
                className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-slate-100 transition-all"
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
              className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-300 transition-all"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 text-xs font-black text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1 uppercase tracking-wider"
            >
              Apply Flat <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;
