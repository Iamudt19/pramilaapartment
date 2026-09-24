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
      router.push('/login');
    }
  };

  return (
    <header className="glass-header sticky top-0 z-40 px-4 lg:px-8 py-3 flex items-center justify-between border-b border-neutral-800/90 bg-black/90 backdrop-blur-xl">
      {/* Brand with Official Logo */}
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="h-10 px-2 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-center shadow-lg group-hover:border-neutral-500 transition-all">
            <img
              src="/images/logo.png"
              alt="Pramila Apartment Logo"
              className="h-7 w-auto object-contain brightness-125 contrast-125"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif-luxury font-extrabold text-base tracking-tight text-white group-hover:text-neutral-200 transition-colors">
                Pramila Apartments
              </span>
              <span className="bg-neutral-900 text-neutral-300 border border-neutral-700 text-[9px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full">
                DMCH Road
              </span>
            </div>
            <p className="text-[10px] text-neutral-400 font-medium flex items-center gap-1">
              <MapPin className="w-2.5 h-2.5 text-neutral-400" /> Premium 2BHK Residences
            </p>
          </div>
        </Link>
      </div>

      {/* Center: Navigation Links */}
      <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-neutral-400">
        <Link href="/" className={`hover:text-white transition-colors ${pathname === '/' ? 'text-white font-bold' : ''}`}>
          Home & Amenities
        </Link>
        <a href="/#suites" className="hover:text-white transition-colors">
          2BHK Suites
        </a>
        <a href="/#features" className="hover:text-white transition-colors">
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
          className={`hover:text-white flex items-center gap-1.5 transition-colors ${
            pathname.startsWith('/portal/tenant') ? 'text-white font-bold' : ''
          }`}
        >
          <Users className="w-3.5 h-3.5 text-white" /> Resident Portal
        </Link>
      </nav>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {user ? (
          <>
            <NotificationBell />

            <div className="flex items-center gap-2.5 pl-2 border-l border-neutral-800">
              <div className="w-8 h-8 rounded-xl bg-neutral-900 border border-neutral-700 flex items-center justify-center font-bold text-white text-xs shadow-md">
                {user.name?.charAt(0) || 'U'}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-neutral-200">{user.name}</div>
                <div className="text-[10px] text-neutral-400 font-medium">
                  {user.role === 'SUPER_ADMIN' ? 'Administrator' : `Flat ${user.flatNumber || 'Resident'}`}
                </div>
              </div>
              <button
                onClick={logout}
                className="p-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all"
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
              className="px-3.5 py-1.5 text-xs font-bold text-neutral-300 hover:text-white bg-neutral-900 hover:bg-neutral-800 rounded-xl border border-neutral-700 transition-all"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-4 py-1.5 text-xs font-black text-black bg-white hover:bg-neutral-200 rounded-xl shadow-md transition-all flex items-center gap-1 uppercase tracking-wider"
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

