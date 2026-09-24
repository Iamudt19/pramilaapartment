'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  Building,
  Home,
  Users,
  UserCheck,
  QrCode,
  ShieldAlert,
  Receipt,
  CreditCard,
  Wrench,
  Car,
  ParkingCircle,
  BellRing,
  FolderLock,
  UserCog,
  FileSpreadsheet,
  Sliders,
  History,
  ScanLine,
  FileCheck,
  KeyRound,
  Shield,
  Sparkles,
  Globe,
} from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  if (!user) return null;

  const isAdmin = user.role === 'SUPER_ADMIN' || user.role === 'PROPERTY_MANAGER' || user.role === 'ACCOUNTANT' || user.role === 'SECURITY_GUARD' || user.role === 'MAINTENANCE_STAFF';

  // Comprehensive Navigation for Admin (Full Estate Control & Vacancies)
  const adminNav = [
    { label: 'Overview Dashboard', href: '/portal/admin', icon: LayoutDashboard },
    { label: 'Flats & Live Vacancies', href: '/portal/admin/flats', icon: Globe },
    { label: 'Tenants & Applications', href: '/portal/admin/tenants', icon: UserCheck },
    { label: 'Visitor Passes & Approvals', href: '/portal/admin/visitors', icon: QrCode },
    { label: 'Gate QR Scanner & Ops', href: '/portal/security', icon: ScanLine },
    { label: 'Billing & Batch Invoices', href: '/portal/admin/bills', icon: Receipt },
    { label: 'Payments & Receipts', href: '/portal/admin/payments', icon: CreditCard },
    { label: 'Maintenance Work Orders', href: '/portal/admin/maintenance', icon: Wrench },
    { label: 'Parking & Vehicles', href: '/portal/admin/parking', icon: Car },
    { label: 'Notices & Circulars', href: '/portal/admin/notices', icon: BellRing },
    { label: 'Tenant Document Vault', href: '/portal/admin/documents', icon: FolderLock },
    { label: 'Property & Tariff Settings', href: '/portal/admin/settings', icon: Sliders },
    { label: 'Audit Trail Logs', href: '/portal/admin/audit', icon: History },
  ];

  // Comprehensive Navigation for Tenant (Resident Self-Service)
  const tenantNav = [
    { label: 'My Flat Dashboard', href: '/portal/tenant', icon: LayoutDashboard },
    { label: 'My Rent & Sub-Meter Bills', href: '/portal/tenant/bills', icon: Receipt },
    { label: 'Digital QR Visitor Passes', href: '/portal/tenant/visitors', icon: QrCode },
    { label: 'Maintenance Requests', href: '/portal/tenant/maintenance', icon: Wrench },
    { label: 'Family & Co-Residents', href: '/portal/tenant/family', icon: Users },
    { label: 'My Vehicles', href: '/portal/tenant/vehicles', icon: Car },
    { label: 'Society Notices', href: '/portal/tenant/notices', icon: BellRing },
    { label: 'Profile & Lease Documents', href: '/portal/tenant/profile', icon: FolderLock },
  ];

  const currentNav = isAdmin ? adminNav : tenantNav;

  return (
    <aside className="w-64 shrink-0 hidden lg:block border-r border-slate-200 bg-white/95 p-4 min-h-[calc(100vh-4rem)] shadow-sm">
      <div className="mb-4 px-3.5 py-2.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between shadow-inner">
        <div>
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Active Role</div>
          <div className="text-xs font-black text-emerald-700">
            {isAdmin ? 'ESTATE ADMINISTRATOR' : 'FLAT RESIDENT (TENANT)'}
          </div>
        </div>
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
      </div>

      <nav className="space-y-1">
        {currentNav.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/20 font-extrabold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
