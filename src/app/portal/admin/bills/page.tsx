'use client';

import React, { useEffect, useState } from 'react';
import { Receipt, Zap, Plus, Search, Filter, CheckCircle2, AlertCircle, FileText, ArrowRight } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function AdminBillsPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [batchMsg, setBatchMsg] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchInvoices = async () => {
    try {
      const res = await fetch(`/api/invoices?status=${statusFilter}`);
      if (res.ok) setInvoices((await res.json()).invoices || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [statusFilter]);

  const handleGenerateMonthlyBatch = async () => {
    try {
      setGenerating(true);
      setBatchMsg(null);
      const res = await fetch('/api/invoices/generate-monthly', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          billingPeriod: new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' }),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setBatchMsg(data.message);
        fetchInvoices();
      }
    } catch (e: any) {
      setBatchMsg(e.message || 'Batch generation failed');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Billing & Invoices Engine</h1>
          <p className="text-xs text-slate-400 mt-1">Generate recurring monthly rent, electricity unit charges, and track arrears</p>
        </div>
        <button
          onClick={handleGenerateMonthlyBatch}
          disabled={generating}
          className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:opacity-50 text-slate-950 font-extrabold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
        >
          <Zap className="w-4 h-4" /> {generating ? 'Processing Invoices...' : 'Run Scheduled Monthly Billing Cycle'}
        </button>
      </div>

      {batchMsg && (
        <div className="bg-emerald-950/40 border border-emerald-500/40 p-3.5 rounded-2xl text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{batchMsg}</span>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
        >
          <option value="">All Invoice Statuses</option>
          <option value="PENDING">Pending (Unpaid)</option>
          <option value="PAID">Paid</option>
          <option value="PARTIALLY_PAID">Partially Paid</option>
          <option value="OVERDUE">Overdue</option>
        </select>
      </div>

      {/* Invoices Table */}
      <div className="glass-card rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Invoice No</th>
              <th className="py-3 px-4">Flat & Resident</th>
              <th className="py-3 px-4">Billing Period</th>
              <th className="py-3 px-4">Due Date</th>
              <th className="py-3 px-4">Total Amount</th>
              <th className="py-3 px-4">Paid Amount</th>
              <th className="py-3 px-4">Balance</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {invoices.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-500">
                  No invoices recorded yet. Run a monthly billing cycle above.
                </td>
              </tr>
            ) : (
              invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                    {inv.invoiceNumber}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-white">Flat {inv.flat?.flatNumber}</span>
                    <span className="text-[10px] text-slate-400 block">{inv.tenant?.fullName}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-300 font-medium">
                    {inv.billingPeriod}
                  </td>
                  <td className="py-3 px-4 text-slate-300 font-mono text-[11px]">
                    {formatDate(inv.dueDate)}
                  </td>
                  <td className="py-3 px-4 font-extrabold text-white">
                    {formatCurrency(inv.totalAmount)}
                  </td>
                  <td className="py-3 px-4 font-semibold text-emerald-400">
                    {formatCurrency(inv.paidAmount)}
                  </td>
                  <td className="py-3 px-4 font-black text-rose-400">
                    {formatCurrency(inv.balanceAmount)}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        inv.status === 'PAID'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : inv.status === 'PARTIALLY_PAID'
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
