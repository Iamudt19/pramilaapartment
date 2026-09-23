'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { StatCard } from '@/components/shared/StatCard';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  Home,
  Receipt,
  QrCode,
  Wrench,
  Users,
  CreditCard,
  Plus,
  ArrowRight,
  ShieldCheck,
  BellRing,
  Calendar,
} from 'lucide-react';

export default function TenantDashboardPage() {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [visitors, setVisitors] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [invRes, visRes, maintRes, notRes] = await Promise.all([
          fetch('/api/invoices'),
          fetch('/api/visitors'),
          fetch('/api/maintenance'),
          fetch('/api/notices'),
        ]);

        if (invRes.ok) setInvoices((await invRes.json()).invoices || []);
        if (visRes.ok) setVisitors((await visRes.json()).visitors || []);
        if (maintRes.ok) setTickets((await maintRes.json()).requests || []);
        if (notRes.ok) setNotices((await notRes.json()).notices || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const pendingInvoices = invoices.filter((i) => i.status === 'PENDING' || i.status === 'PARTIALLY_PAID');
  const outstandingAmount = pendingInvoices.reduce((sum, i) => sum + i.balanceAmount, 0);
  const nextDueInvoice = pendingInvoices[0];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="glass-card rounded-3xl p-6 lg:p-8 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" /> Verified Active Tenancy
          </div>
          <h1 className="text-2xl lg:text-3xl font-black text-white tracking-tight">
            Welcome back, {user?.name || 'Resident'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Flat <strong>{user?.flatNumber || 'A-101'}</strong> • {user?.buildingName || 'Tower A (Surya)'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/portal/tenant/visitors"
            className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all"
          >
            <QrCode className="w-4 h-4" /> Request Visitor Pass
          </Link>
          <Link
            href="/portal/tenant/bills"
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-xs border border-slate-700 transition-all"
          >
            <CreditCard className="w-4 h-4" /> Pay Rent & Bills
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Outstanding"
          value={formatCurrency(outstandingAmount)}
          subtitle={nextDueInvoice ? `Due: ${formatDate(nextDueInvoice.dueDate)}` : 'All bills settled!'}
          icon={Receipt}
          color={outstandingAmount > 0 ? 'amber' : 'emerald'}
        />
        <StatCard
          title="My Flat Details"
          value={`Flat ${user?.flatNumber || 'A-101'}`}
          subtitle="2BHK • 1,150 sq.ft"
          icon={Home}
          color="blue"
        />
        <StatCard
          title="Visitor Passes"
          value={visitors.length}
          subtitle={`${visitors.filter((v) => v.status === 'APPROVED' || v.status === 'CHECKED_IN').length} Active passes`}
          icon={QrCode}
          color="emerald"
        />
        <StatCard
          title="Open Complaints"
          value={tickets.filter((t) => t.status !== 'RESOLVED' && t.status !== 'CLOSED').length}
          subtitle="Maintenance requests"
          icon={Wrench}
          color="purple"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Invoices */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Receipt className="w-4 h-4 text-emerald-400" /> Recent Invoices & Bills
            </h3>
            <Link href="/portal/tenant/bills" className="text-xs text-emerald-400 hover:underline">
              View all →
            </Link>
          </div>

          <div className="space-y-3">
            {invoices.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">No invoices recorded.</p>
            ) : (
              invoices.slice(0, 4).map((inv) => (
                <div
                  key={inv.id}
                  className="p-3.5 bg-slate-950/60 rounded-2xl border border-slate-800/80 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-mono font-bold text-white block">{inv.invoiceNumber}</span>
                    <span className="text-slate-400 text-[11px]">
                      {inv.billingPeriod} • Due: {formatDate(inv.dueDate)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-white text-sm block">{formatCurrency(inv.totalAmount)}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        inv.status === 'PAID'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Visitor Passes */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <QrCode className="w-4 h-4 text-cyan-400" /> My Visitor Passes
            </h3>
            <Link href="/portal/tenant/visitors" className="text-xs text-emerald-400 hover:underline">
              Manage passes →
            </Link>
          </div>

          <div className="space-y-3">
            {visitors.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">No visitor passes created yet.</p>
            ) : (
              visitors.slice(0, 4).map((v) => (
                <div
                  key={v.id}
                  className="p-3.5 bg-slate-950/60 rounded-2xl border border-slate-800/80 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-white block">{v.visitorName}</span>
                    <span className="text-slate-400 text-[11px]">{v.purpose} ({v.relationship})</span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      v.status === 'APPROVED'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : v.status === 'CHECKED_IN'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {v.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
