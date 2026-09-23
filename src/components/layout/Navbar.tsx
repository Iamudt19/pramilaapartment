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
  const { user, logout, login } = useAuth();

  const handleOpenTenant = () => {
    if (user?.role === 'TENANT') {
      router.push('/portal/tenant');
    } else {
      login('tenant1@pramila.com');
      router.push('/portal/tenant');
    }
  };

  return (
    <header className="glass-header sticky top-0 z-40 px-4 lg:px-8 py-2.5 flex items-center justify-between border-b border-slate-800/90 bg-slate-950/80 backdrop-blur-xl">
      {/* Brand with Official Logo */}
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="h-10 px-2 rounded-xl bg-slate-900 border border-slate-700/80 flex items-center justify-center shadow-lg group-hover:border-slate-500 transition-all">
            <img
              src="/images/logo.png"
              alt="Pramila Apartment Logo"
              className="h-7 w-auto object-contain brightness-110 contrast-125"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-white group-hover:text-amber-100 transition-colors">
                Pramila Apartments
              </span>
              <span className="bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                DMCH Road
              </span>
            </div>
            <p className="text-[10px] text-slate-400 -mt-0.5 font-medium flex items-center gap-1">
              <MapPin className="w-2.5 h-2.5 text-rose-400" /> Premium 2BHK Residences
            </p>
          </div>
        </Link>
      </div>

      {/* Center: Navigation Links */}
      <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
        <Link href="/" className={`hover:text-white transition-colors ${pathname === '/' ? 'text-amber-300 font-bold' : ''}`}>
          Home & Amenities
        </Link>
        <a href="/#location-features" className="hover:text-white transition-colors">
          Location & Nearby
        </a>
        <a href="/#flat-features" className="hover:text-white transition-colors">
          2BHK Comforts
        </a>
        <Link
          href="/portal/tenant"
          onClick={(e) => {
            if (!user || user.role !== 'TENANT') {
              e.preventDefault();
              handleOpenTenant();
            }
          }}
          className={`hover:text-white flex items-center gap-1 transition-colors ${
            pathname.startsWith('/portal/tenant') ? 'text-emerald-400 font-bold' : ''
          }`}
        >
          <Users className="w-3.5 h-3.5 text-emerald-400" /> Resident Portal
        </Link>
      </nav>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {user ? (
          <>
            <NotificationBell />

            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-600 to-slate-800 flex items-center justify-center font-bold text-white text-xs shadow-md border border-amber-500/30">
                {user.name?.charAt(0) || 'U'}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-slate-200">{user.name}</div>
                <div className="text-[10px] text-amber-400 font-medium">
                  {user.role === 'SUPER_ADMIN' ? 'Administrator' : `Flat ${user.flatNumber || 'Resident'}`}
                </div>
              </div>
              <button
                onClick={logout}
                className="p-1.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-all"
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
              className="px-3 py-1.5 text-xs font-bold text-slate-200 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-700 transition-all"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-3.5 py-1.5 text-xs font-extrabold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 rounded-xl shadow-md shadow-amber-500/20 transition-all flex items-center gap-1"
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

