'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  Receipt,
  QrCode,
  Wrench,
  Menu,
  X,
  UserCheck,
  ScanLine,
  CreditCard,
  BellRing,
  FolderLock,
  Sliders,
  History,
  Users,
  Car,
  Globe,
  Sparkles,
  LogOut,
  Building2,
} from 'lucide-react';

export function MobileBottomNav() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [showMoreDrawer, setShowMoreDrawer] = useState(false);

  if (!user) return null;

  const isAdmin =
    user.role === 'SUPER_ADMIN' ||
    user.role === 'PROPERTY_MANAGER' ||
    user.role === 'ACCOUNTANT' ||
    user.role === 'SECURITY_GUARD' ||
    user.role === 'MAINTENANCE_STAFF';

  // Core 4 quick links + 1 "More" drawer for Tenants
  const tenantPrimary = [
    { label: 'Home', href: '/portal/tenant', icon: LayoutDashboard },
    { label: 'Bills', href: '/portal/tenant/bills', icon: Receipt },
    { label: 'Passes', href: '/portal/tenant/visitors', icon: QrCode },
    { label: 'Repairs', href: '/portal/tenant/maintenance', icon: Wrench },
  ];

  const tenantMore = [
    { label: 'Family & Co-Residents', href: '/portal/tenant/family', icon: Users },
    { label: 'My Vehicles', href: '/portal/tenant/vehicles', icon: Car },
    { label: 'Society Notices', href: '/portal/tenant/notices', icon: BellRing },
    { label: 'Profile & Documents', href: '/portal/tenant/profile', icon: FolderLock },
  ];

  // Core 4 quick links + 1 "More" drawer for Admins
  const adminPrimary = [
    { label: 'Overview', href: '/portal/admin', icon: LayoutDashboard },
    { label: 'Flats', href: '/portal/admin/flats', icon: Globe },
    { label: 'Tenants', href: '/portal/admin/tenants', icon: UserCheck },
    { label: 'Gate Scan', href: '/portal/security', icon: ScanLine },
  ];

  const adminMore = [
    { label: 'Walkthrough Leads', href: '/portal/admin/inquiries', icon: Sparkles },
    { label: 'Visitor Approvals', href: '/portal/admin/visitors', icon: QrCode },
    { label: 'Billing & Invoices', href: '/portal/admin/bills', icon: Receipt },
    { label: 'Payments & Receipts', href: '/portal/admin/payments', icon: CreditCard },
    { label: 'Maintenance Orders', href: '/portal/admin/maintenance', icon: Wrench },
    { label: 'Parking & Vehicles', href: '/portal/admin/parking', icon: Car },
    { label: 'Notices & Circulars', href: '/portal/admin/notices', icon: BellRing },
    { label: 'Document Vault', href: '/portal/admin/documents', icon: FolderLock },
    { label: 'System Settings', href: '/portal/admin/settings', icon: Sliders },
    { label: 'Audit Trail', href: '/portal/admin/audit', icon: History },
  ];

  const primaryLinks = isAdmin ? adminPrimary : tenantPrimary;
  const moreLinks = isAdmin ? adminMore : tenantMore;

  return (
    <>
      {/* Fixed Bottom App Navigation Bar (Mobile Only) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-2 py-1.5 flex items-center justify-around">
        {primaryLinks.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
                isActive
                  ? 'text-blue-900 font-extrabold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-all ${
                  isActive ? 'bg-blue-100 text-blue-900 shadow-sm' : 'text-slate-500'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] tracking-tight mt-0.5">{item.label}</span>
            </Link>
          );
        })}

        {/* More Menu Trigger */}
        <button
          onClick={() => setShowMoreDrawer(true)}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
            showMoreDrawer ? 'text-blue-900 font-extrabold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="p-1.5 rounded-xl bg-slate-100 text-slate-700">
            <Menu className="w-5 h-5" />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">More</span>
        </button>
      </nav>

      {/* Slide-Up "More" Sheet Modal for Mobile */}
      {showMoreDrawer && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex flex-col justify-end animate-fadeIn">
          <div
            className="w-full bg-white rounded-t-3xl border-t border-slate-200 shadow-2xl max-h-[80vh] overflow-y-auto p-5 pb-8 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sheet Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-900 text-white flex items-center justify-center font-bold text-xs">
                  {user.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">{user.name}</div>
                  <div className="text-[10px] text-amber-700 font-bold uppercase tracking-wider">
                    {isAdmin ? 'Estate Administrator' : `Flat ${user.flatNumber || 'Resident'}`}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowMoreDrawer(false)}
                className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Links Grid */}
            <div>
              <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">
                All Modules & Actions
              </div>
              <div className="grid grid-cols-2 gap-2">
                {moreLinks.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setShowMoreDrawer(false)}
                      className={`flex items-center gap-2.5 p-3 rounded-2xl border text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-blue-50 border-blue-300 text-blue-950 font-black shadow-sm'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div
                        className={`p-2 rounded-xl ${
                          isActive ? 'bg-blue-900 text-white' : 'bg-white text-slate-600 shadow-xs'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="leading-tight text-[11px]">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Sign Out Button */}
            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={async () => {
                  setShowMoreDrawer(false);
                  await logout();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition-all"
              >
                <LogOut className="w-4 h-4" /> Sign Out from Account
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default MobileBottomNav;
