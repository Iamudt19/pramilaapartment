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
      {/* Welcome Banner (White Theme with Emerald Gradient Flare) */}
      <div className="bg-white rounded-3xl p-6 lg:p-8 border border-slate-200 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold mb-2 shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Verified Active Tenancy
          </div>
          <h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
            Welcome back, {user?.name || 'Resident'}
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Flat <strong className="text-slate-900">{user?.flatNumber || 'A-101'}</strong> • {user?.buildingName || 'Tower A (Surya)'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/portal/tenant/visitors"
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all"
          >
            <QrCode className="w-4 h-4" /> Request Visitor Pass
          </Link>
          <Link
            href="/portal/tenant/bills"
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs border border-slate-300 transition-all"
          >
            <CreditCard className="w-4 h-4 text-emerald-600" /> Pay Rent & Bills
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
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Receipt className="w-4 h-4 text-emerald-600" /> Recent Invoices & Bills
            </h3>
            <Link href="/portal/tenant/bills" className="text-xs text-emerald-700 font-bold hover:underline">
              View all →
            </Link>
          </div>

          <div className="space-y-3">
            {invoices.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No invoices recorded.</p>
            ) : (
              invoices.slice(0, 4).map((inv) => (
                <div
                  key={inv.id}
                  className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-mono font-bold text-slate-900 block">{inv.invoiceNumber}</span>
                    <span className="text-slate-500 text-[11px]">
                      {inv.billingPeriod} • Due: {formatDate(inv.dueDate)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-slate-900 text-sm block">{formatCurrency(inv.totalAmount)}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        inv.status === 'PAID'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
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
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <QrCode className="w-4 h-4 text-emerald-600" /> My Visitor Passes
            </h3>
            <Link href="/portal/tenant/visitors" className="text-xs text-emerald-700 font-bold hover:underline">
              Manage passes →
            </Link>
          </div>

          <div className="space-y-3">
            {visitors.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No visitor passes created yet.</p>
            ) : (
              visitors.slice(0, 4).map((v) => (
                <div
                  key={v.id}
                  className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-900 block">{v.visitorName}</span>
                    <span className="text-slate-500 text-[11px]">{v.purpose} ({v.relationship})</span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      v.status === 'APPROVED'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : v.status === 'CHECKED_IN'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300 font-bold'
                        : 'bg-slate-100 text-slate-700'
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
