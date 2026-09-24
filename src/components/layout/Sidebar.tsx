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
} from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  if (!user) return null;

  // Navigation Items for Admin / Property Manager
  const adminNav = [
    { label: 'Dashboard', href: '/portal/admin', icon: LayoutDashboard },
    { label: 'Property', href: '/portal/admin/property', icon: Building },
    { label: 'Flats & Units', href: '/portal/admin/flats', icon: Home },
    { label: 'Owners', href: '/portal/admin/owners', icon: Users },
    { label: 'Tenants & Leases', href: '/portal/admin/tenants', icon: UserCheck },
    { label: 'Visitors & Passes', href: '/portal/admin/visitors', icon: QrCode },
    { label: 'Security & Penalties', href: '/portal/admin/security', icon: ShieldAlert },
    { label: 'Bills & Invoices', href: '/portal/admin/bills', icon: Receipt },
    { label: 'Payments & Receipts', href: '/portal/admin/payments', icon: CreditCard },
    { label: 'Maintenance Work', href: '/portal/admin/maintenance', icon: Wrench },
    { label: 'Parking & Vehicles', href: '/portal/admin/parking', icon: ParkingCircle },
    { label: 'Notices & Alerts', href: '/portal/admin/notices', icon: BellRing },
    { label: 'Documents Vault', href: '/portal/admin/documents', icon: FolderLock },
    { label: 'Staff Directory', href: '/portal/admin/staff', icon: UserCog },
    { label: 'Reports & Analytics', href: '/portal/admin/reports', icon: FileSpreadsheet },
    { label: 'Configuration Center', href: '/portal/admin/settings', icon: Sliders },
    { label: 'Audit Trail Logs', href: '/portal/admin/audit', icon: History },
  ];

  // Navigation Items for Tenant
  const tenantNav = [
    { label: 'My Flat Dashboard', href: '/portal/tenant', icon: LayoutDashboard },
    { label: 'My Bills & Rent', href: '/portal/tenant/bills', icon: Receipt },
    { label: 'Visitor QR Passes', href: '/portal/tenant/visitors', icon: QrCode },
    { label: 'Maintenance Requests', href: '/portal/tenant/maintenance', icon: Wrench },
    { label: 'Family Members', href: '/portal/tenant/family', icon: Users },
    { label: 'My Vehicles', href: '/portal/tenant/vehicles', icon: Car },
    { label: 'Notices & Circulars', href: '/portal/tenant/notices', icon: BellRing },
    { label: 'Profile & Documents', href: '/portal/tenant/profile', icon: FolderLock },
  ];

  // Navigation Items for Security Guard
  const securityNav = [
    { label: 'Gate Operations', href: '/portal/security', icon: Shield },
    { label: 'Scan QR Pass', href: '/portal/security/scan', icon: ScanLine },
    { label: 'Today Visitors', href: '/portal/security/visitors', icon: QrCode },
    { label: 'Vehicle Gate Log', href: '/portal/security/vehicles', icon: Car },
    { label: 'Report Incident', href: '/portal/security/incident', icon: ShieldAlert },
  ];

  // Navigation Items for Accountant
  const accountantNav = [
    { label: 'Financial Summary', href: '/portal/accountant', icon: LayoutDashboard },
    { label: 'Invoices & Billing', href: '/portal/accountant/invoices', icon: Receipt },
    { label: 'Payments & Ledger', href: '/portal/admin/payments', icon: CreditCard },
    { label: 'Financial Reports', href: '/portal/admin/reports', icon: FileSpreadsheet },
  ];

  // Navigation Items for Maintenance
  const maintenanceNav = [
    { label: 'Work Orders Queue', href: '/portal/maintenance', icon: Wrench },
    { label: 'Society Notices', href: '/portal/tenant/notices', icon: BellRing },
  ];

  let currentNav = adminNav;
  if (user.role === 'TENANT') currentNav = tenantNav;
  else if (user.role === 'SECURITY_GUARD') currentNav = securityNav;
  else if (user.role === 'ACCOUNTANT') currentNav = accountantNav;
  else if (user.role === 'MAINTENANCE_STAFF') currentNav = maintenanceNav;

  return (
    <aside className="w-64 shrink-0 hidden lg:block border-r border-slate-200 bg-white/95 p-4 min-h-[calc(100vh-4rem)] shadow-sm">
      <div className="mb-4 px-3.5 py-2.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between shadow-inner">
        <div>
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Portal Mode</div>
          <div className="text-xs font-black text-emerald-700">{user.role.replace('_', ' ')}</div>
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
