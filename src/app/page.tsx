'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  Building2,
  ShieldCheck,
  QrCode,
  Receipt,
  Wrench,
  Users,
  Sliders,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock,
  Layers,
  Activity,
  Zap,
} from 'lucide-react';

export default function LandingPage() {
  const { user, login } = useAuth();

  const portals = [
    {
      title: 'Admin & Estate Portal',
      role: 'SUPER_ADMIN',
      email: 'admin@pramila.com',
      desc: 'Complete property oversight, flat hierarchy, tenant approvals, billing engine, and dynamic settings.',
      icon: Building2,
      color: 'from-blue-600 to-indigo-700',
      href: '/portal/admin',
    },
    {
      title: 'Tenant Portal',
      role: 'TENANT',
      email: 'tenant1@pramila.com',
      desc: 'View active tenancy, pay monthly rent & bills, generate digital QR visitor passes, and track repairs.',
      icon: Users,
      color: 'from-emerald-600 to-teal-700',
      href: '/portal/tenant',
    },
    {
      title: 'Security Gate Portal',
      role: 'SECURITY_GUARD',
      email: 'security@pramila.com',
      desc: 'Mobile-first gate operations: live QR scanning, entry/exit logging, and unauthorized incident reporting.',
      icon: ShieldCheck,
      color: 'from-amber-600 to-orange-700',
      href: '/portal/security',
    },
    {
      title: 'Accountant Portal',
      role: 'ACCOUNTANT',
      email: 'accountant@pramila.com',
      desc: 'Batch recurring billing generation, electricity meter calculators, receipts, and financial statements.',
      icon: Receipt,
      color: 'from-purple-600 to-pink-700',
      href: '/portal/accountant',
    },
    {
      title: 'Maintenance Staff',
      role: 'MAINTENANCE_STAFF',
      email: 'maintenance@pramila.com',
      desc: 'Facility technician work orders queue, status updates, and material & labor cost tracking.',
      icon: Wrench,
      color: 'from-cyan-600 to-blue-700',
      href: '/portal/maintenance',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-12 py-4">
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden glass-card p-8 lg:p-14 border border-slate-700/60 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> Full-Stack Production Residential Management System
          </div>

          <h1 className="text-4xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            Next-Generation Living at{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              Pramila Apartments
            </span>
          </h1>

          <p className="text-slate-300 text-base lg:text-lg leading-relaxed">
            A comprehensive, database-backed property & rental platform engineered with strict role-based access control, automated billing engines, cryptographic QR visitor gate passes, and a real-time configuration center.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/portal/admin"
              className="px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-extrabold rounded-2xl shadow-xl shadow-emerald-500/20 flex items-center gap-2 text-sm transition-all transform hover:-translate-y-0.5"
            >
              Launch Admin Portal <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/register"
              className="px-6 py-3.5 bg-slate-900/80 hover:bg-slate-800 text-white font-bold rounded-2xl border border-slate-700 flex items-center gap-2 text-sm transition-all"
            >
              New Tenant Registration
            </Link>
          </div>
        </div>
      </div>

      {/* Role-Based Portal Launchers */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">Dedicated Role Portals</h2>
            <p className="text-xs text-slate-400 mt-1">Select any role to instantly log in and experience the specialized workflow.</p>
          </div>
          <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            5 Active Portals
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portals.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.role}
                className="glass-card glass-card-hover rounded-3xl p-6 border border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${p.color} flex items-center justify-center text-white shadow-lg mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{p.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">{p.desc}</p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800/80">
                  <button
                    onClick={() => login(p.email)}
                    className="w-full bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-semibold py-2.5 px-4 rounded-xl text-xs flex items-center justify-between transition-all"
                  >
                    <span>1-Click Switch: {p.email}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                  </button>
                  <Link
                    href={p.href}
                    className="w-full block text-center text-[11px] text-slate-400 hover:text-white py-1 transition-colors"
                  >
                    Open direct URL →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Feature Highlights Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card rounded-3xl p-6 border border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3">
            <Sliders className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-white text-base mb-1">Zero Hard-Coding</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            All apartment settings (rates, penalty fees, rent due date, quiet hours, emails) are database-driven and editable via Admin UI.
          </p>
        </div>

        <div className="glass-card rounded-3xl p-6 border border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
            <QrCode className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-white text-base mb-1">Cryptographic QR Passes</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Non-guessable tokens with dynamic validity windows, security scan validation, duration calculation, and unauthorized entry penalty engines.
          </p>
        </div>

        <div className="glass-card rounded-3xl p-6 border border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3">
            <Zap className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-white text-base mb-1">Idempotent Billing Engine</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Scheduled recurring rent, electricity unit calculator ((current - previous) × rate), water charges, receipts, and Razorpay payment integration.
          </p>
        </div>
      </div>
    </div>
  );
}
