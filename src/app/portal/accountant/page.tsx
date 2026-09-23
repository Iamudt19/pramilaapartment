'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { StatCard } from '@/components/shared/StatCard';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Receipt, Zap, CreditCard, FileSpreadsheet, Plus, ArrowRight, DollarSign, Clock } from 'lucide-react';

export default function AccountantDashboardPage() {
  const [reportData, setReportData] = useState<any>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([fetch('/api/reports'), fetch('/api/invoices'), fetch('/api/payments')])
      .then(async ([repRes, invRes, payRes]) => {
        if (repRes.ok) setReportData((await repRes.json()));
        if (invRes.ok) setInvoices((await invRes.json()).invoices || []);
        if (payRes.ok) setPayments((await payRes.json()).payments || []);
      });
  }, []);

  const fin = reportData?.financial || {};

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-white tracking-tight">Financial & Accounts Portal</h1>
          <p className="text-xs text-slate-400 mt-1">Manage billing schedules, track resident payments, and generate ledger statements</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/portal/accountant/invoices"
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
          >
            <Zap className="w-4 h-4" /> Batch Invoice Engine
          </Link>
          <Link
            href="/portal/admin/reports"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs border border-slate-700"
          >
            <FileSpreadsheet className="w-4 h-4" /> Financial Reports
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Billed (Period)"
          value={formatCurrency(fin.totalBilled || 56300)}
          subtitle="All flat units"
          icon={Receipt}
          color="blue"
        />
        <StatCard
          title="Total Reconciled"
          value={formatCurrency(fin.totalCollected || 24900)}
          subtitle="Cleared bank / gateway"
          icon={CreditCard}
          color="emerald"
        />
        <StatCard
          title="Outstanding Arrears"
          value={formatCurrency(fin.totalOutstanding || 31400)}
          subtitle="Pending collection"
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="Society Penalties"
          value={formatCurrency(fin.penaltyCollection || 2000)}
          subtitle="Violations billed"
          icon={DollarSign}
          color="rose"
        />
      </div>

      {/* Invoices and Payments Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Invoices */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-bold text-white text-base">Latest Generated Invoices</h3>
            <Link href="/portal/accountant/invoices" className="text-xs text-emerald-400 hover:underline">
              View all →
            </Link>
          </div>

          <div className="space-y-3">
            {invoices.slice(0, 5).map((inv) => (
              <div key={inv.id} className="p-3 bg-slate-950/60 rounded-2xl border border-slate-800 flex justify-between items-center text-xs">
                <div>
                  <span className="font-mono font-bold text-white block">{inv.invoiceNumber}</span>
                  <span className="text-slate-400">Flat {inv.flat?.flatNumber} • {inv.tenant?.fullName}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-white block">{formatCurrency(inv.totalAmount)}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${inv.status === 'PAID' ? 'text-emerald-400 bg-emerald-950/40' : 'text-amber-400 bg-amber-950/40'}`}>
                    {inv.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Payments */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-bold text-white text-base">Recent Collections & Receipts</h3>
            <Link href="/portal/admin/payments" className="text-xs text-emerald-400 hover:underline">
              View ledger →
            </Link>
          </div>

          <div className="space-y-3">
            {payments.slice(0, 5).map((pay) => (
              <div key={pay.id} className="p-3 bg-slate-950/60 rounded-2xl border border-slate-800 flex justify-between items-center text-xs">
                <div>
                  <span className="font-mono font-bold text-emerald-400 block">{pay.receiptNumber}</span>
                  <span className="text-slate-400">{formatDate(pay.paymentDate)} • Flat {pay.invoice?.flat?.flatNumber}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-white block">{formatCurrency(pay.amount)}</span>
                  <span className="text-[10px] text-slate-400">{pay.paymentMethod?.replace('_', ' ')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
