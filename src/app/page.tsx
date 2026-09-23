'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  KeyRound,
  Shield,
  Zap,
  ChevronRight,
  Eye,
  FileText,
  BadgePercent,
  CalendarCheck,
  AlertCircle,
  X,
} from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const { user, login } = useAuth();
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

  const openAdminPortal = () => {
    if (user?.role === 'SUPER_ADMIN' || user?.role === 'PROPERTY_MANAGER') {
      router.push('/portal/admin');
    } else {
      setShowAdminModal(true);
    }
  };

  const openTenantPortal = async () => {
    if (user?.role === 'TENANT') {
      router.push('/portal/tenant');
    } else {
      await login('tenant1@pramila.com');
      router.push('/portal/tenant');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-16 py-6 animate-fadeIn">
      {/* 🌟 Modern Hero Section */}
      <div className="relative rounded-[2.5rem] overflow-hidden glass-card p-8 lg:p-16 border border-slate-700/70 shadow-2xl bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-950/90">
        {/* Glow Effects */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Pramila Apartments • Smart Living Ecosystem</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
              Intelligent Living &{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                Property Management
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl">
              Experience seamless residential management with dynamic tariff engines, instant QR visitor gate passes, online bill payments, photo-verified maintenance work orders, and zero hardcoded rules.
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={openTenantPortal}
                className="px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold rounded-2xl shadow-xl shadow-emerald-500/20 flex items-center gap-2 text-sm transition-all transform hover:-translate-y-0.5"
              >
                <Users className="w-4 h-4" /> Enter Tenant Portal <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={openAdminPortal}
                className="px-6 py-3.5 bg-slate-900/90 hover:bg-slate-800 text-white font-bold rounded-2xl border border-slate-700 flex items-center gap-2 text-sm transition-all shadow-lg"
              >
                <Lock className="w-4 h-4 text-amber-400" /> Admin Portal (Password Secured)
              </button>
            </div>

            {/* Micro Stats Bar */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800/80 max-w-lg">
              <div>
                <div className="text-xl lg:text-2xl font-black text-emerald-400">32+</div>
                <div className="text-[11px] text-slate-400 font-medium">Flats Across 2 Towers</div>
              </div>
              <div>
                <div className="text-xl lg:text-2xl font-black text-cyan-400">100%</div>
                <div className="text-[11px] text-slate-400 font-medium">Digital QR Gate Passes</div>
              </div>
              <div>
                <div className="text-xl lg:text-2xl font-black text-amber-400">₹0</div>
                <div className="text-[11px] text-slate-400 font-medium">Zero Hardcoded Tariff</div>
              </div>
            </div>
          </div>

          {/* Right Hero Visual Card */}
          <div className="lg:col-span-5 space-y-4">
            <div className="glass-card rounded-3xl p-6 border border-slate-700/80 shadow-2xl relative overflow-hidden bg-slate-950/80">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Tower A (Surya)</h3>
                    <p className="text-[10px] text-slate-400">Flat A-101 • Active Lease</p>
                  </div>
                </div>
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Live System
                </span>
              </div>

              <div className="py-4 space-y-3">
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Monthly Rent + Electricity</span>
                  <span className="font-extrabold text-white">₹14,500 <span className="text-[10px] text-emerald-400 font-normal">(Paid)</span></span>
                </div>

                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Visitor Gate Pass</span>
                  <span className="font-mono text-emerald-400 font-bold">PR-PASS-78B2</span>
                </div>

                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Maintenance Request</span>
                  <span className="text-blue-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Resolved
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/register"
                  className="w-full py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                >
                  Register New Resident Onboarding <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🚀 Dual Streamlined Experience: Tenant vs Admin */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-3xl font-black text-white tracking-tight">Select Your Experience</h2>
          <p className="text-xs text-slate-400">Choose between the resident tenant portal or unlock the estate administrative suite.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Tenant Experience */}
          <div className="glass-card glass-card-hover rounded-3xl p-8 border border-emerald-500/30 flex flex-col justify-between space-y-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl"></div>

            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20">
                <Users className="w-7 h-7" />
              </div>

              <div>
                <h3 className="text-2xl font-black text-white">Resident Tenant Portal</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Dedicated portal for residents: view flat details, pay rent & electricity invoices online, generate guest QR gate passes, raise maintenance requests with photos, and manage vehicles.
                </p>
              </div>

              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Flat Tenancy & Lease Agreement</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Instant Rent Payment & Printable Receipts</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Visitor Pass QR Generation & ID Upload</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Maintenance Complaint Desk with Photos</li>
              </ul>
            </div>

            <button
              onClick={openTenantPortal}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
            >
              <span>Launch Tenant Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Admin Experience */}
          <div className="glass-card glass-card-hover rounded-3xl p-8 border border-blue-500/30 flex flex-col justify-between space-y-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>

            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black shadow-lg shadow-blue-500/20">
                <Lock className="w-7 h-7 text-amber-300" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-black text-white">Admin Master Suite</h3>
                  <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Password Protected
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Full-scope estate management: tower & flat inventory, tenant onboarding & approvals, gate security review, billing engine with electricity formulas, task dispatch, and dynamic configuration center.
                </p>
              </div>

              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-400" /> Full Flat & Building Inventory Management</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-400" /> Tenant Approvals & Documents Verification</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-400" /> Monthly Billing Cycle & Meter Reading Engine</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-400" /> Configuration Center (Customizable Rates & Policies)</li>
              </ul>
            </div>

            <button
              onClick={openAdminPortal}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all"
            >
              <KeyRound className="w-4 h-4 text-amber-300" />
              <span>Unlock Admin Portal with Password</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ⚙️ Core Capabilities */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <Sliders className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-white text-base">Zero Hardcoding Engine</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            All tariffs, electricity rates (₹/unit), water fees, penalty rates, and quiet hours are completely editable via the Admin Settings screen.
          </p>
        </div>

        <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
            <QrCode className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-white text-base">Cryptographic QR Visitor Passes</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Secure, non-guessable tokens with duration calculations, visitor photo verification, and gate check-in/out logging.
          </p>
        </div>

        <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-white text-base">Automated Billing & Receipts</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Automatic monthly billing with `(current - previous) × rate` electricity charges, late fee enforcement, and printable PDF receipts.
          </p>
        </div>
      </div>

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
    </div>
  );
}

