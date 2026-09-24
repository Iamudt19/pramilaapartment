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
  Users,
  ShieldCheck,
  ArrowRight,
  Phone,
  MapPin,
  Home,
  Menu,
  X,
  CreditCard,
  QrCode,
  Wrench,
  Globe,
} from 'lucide-react';

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleOpenTenant = () => {
    setMobileMenuOpen(false);
    if (user?.role === 'TENANT') {
      router.push('/portal/tenant');
    } else {
      router.push('/login');
    }
  };

  return (
    <>
      <header className="glass-header sticky top-0 z-40 px-3.5 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between border-b border-slate-200 bg-white/95 backdrop-blur-xl shadow-sm">
        {/* Brand with Official Logo */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group">
            <div className="h-9 sm:h-10 px-2 sm:px-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shadow-sm group-hover:border-blue-500 transition-all">
              <img
                src="/images/logo.png"
                alt="Pramila Apartment Logo"
                className="h-6 sm:h-7 w-auto object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-serif-luxury font-extrabold text-sm sm:text-base tracking-tight text-slate-900 group-hover:text-blue-900 transition-colors">
                  Pramila Apartments
                </span>
                <span className="bg-amber-50 text-amber-800 border border-amber-200 text-[8px] sm:text-[9px] font-bold tracking-wider uppercase px-1.5 sm:px-2 py-0.5 rounded-full">
                  DMCH Road
                </span>
              </div>
              <p className="text-[9px] sm:text-[10px] text-slate-500 font-medium flex items-center gap-1">
                <MapPin className="w-2.5 h-2.5 text-blue-600 shrink-0" /> Premium 2BHK Residences
              </p>
            </div>
          </Link>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-slate-600">
          <Link
            href="/"
            className={`hover:text-blue-700 transition-colors ${
              pathname === '/' ? 'text-blue-800 font-extrabold' : ''
            }`}
          >
            Home & Amenities
          </Link>
          <a href="/#suites" className="hover:text-blue-700 transition-colors">
            2BHK Suites
          </a>
          <a href="/#features" className="hover:text-blue-700 transition-colors">
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
            className={`hover:text-blue-700 flex items-center gap-1.5 transition-colors ${
              pathname.startsWith('/portal/tenant') ? 'text-blue-800 font-extrabold' : ''
            }`}
          >
            <Users className="w-3.5 h-3.5 text-blue-600" /> Resident Portal
          </Link>
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <>
              <NotificationBell />

              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="w-8 h-8 rounded-xl bg-blue-800 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-blue-800/20">
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
                  className="p-1.5 sm:p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-slate-100 transition-all"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                href="/login"
                className="px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-300 transition-all"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="px-3.5 py-2 text-xs font-black text-white bg-blue-800 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-900/20 transition-all flex items-center gap-1 uppercase tracking-wider border border-blue-900"
              >
                Apply Flat <ArrowRight className="w-3 h-3 text-amber-300" />
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[57px] z-40 bg-white/98 backdrop-blur-2xl border-b border-slate-200 shadow-2xl p-5 space-y-4 animate-fadeIn">
          <div className="space-y-1">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 p-3 rounded-2xl font-bold text-sm text-slate-800 hover:bg-slate-100"
            >
              <Home className="w-4 h-4 text-blue-600" /> Home & Amenities
            </Link>
            <a
              href="/#suites"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 p-3 rounded-2xl font-bold text-sm text-slate-800 hover:bg-slate-100"
            >
              <Building2 className="w-4 h-4 text-blue-600" /> 2BHK Floor Plans & Suites
            </a>
            <a
              href="/#features"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 p-3 rounded-2xl font-bold text-sm text-slate-800 hover:bg-slate-100"
            >
              <Sparkles className="w-4 h-4 text-amber-500" /> Living Benefits
            </a>
            <Link
              href="/portal/tenant"
              onClick={() => {
                setMobileMenuOpen(false);
                handleOpenTenant();
              }}
              className="flex items-center gap-3 p-3 rounded-2xl font-bold text-sm text-blue-900 bg-blue-50 border border-blue-200"
            >
              <Users className="w-4 h-4 text-blue-800" /> Resident Portal
            </Link>
          </div>

          {!user && (
            <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="py-3 text-center text-xs font-bold text-slate-800 bg-slate-100 rounded-xl border border-slate-200"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="py-3 text-center text-xs font-black text-white bg-blue-900 rounded-xl shadow-md border border-blue-950 uppercase tracking-wider"
              >
                Apply Flat
              </Link>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default Navbar;

