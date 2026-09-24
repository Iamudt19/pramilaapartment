'use client';

import React, { useEffect, useState } from 'react';
import { Receipt, Zap, Plus, Search, Filter, CheckCircle2, AlertCircle, FileText, ArrowRight, Camera, Sparkles } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { AiMeterScannerModal } from '@/components/ai/AiMeterScannerModal';

export default function AdminBillsPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [batchMsg, setBatchMsg] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showAiMeterScanner, setShowAiMeterScanner] = useState(false);

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
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold mb-2 shadow-sm">
            <Receipt className="w-3.5 h-3.5 text-blue-600" /> Automated Utility & Rent Billing
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Billing & Invoices Engine</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">Generate recurring monthly rent, electricity unit charges, and track arrears</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowAiMeterScanner(true)}
            className="px-4 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 font-extrabold rounded-xl text-xs flex items-center gap-2 border border-amber-300 shadow-sm transition-all"
          >
            <Sparkles className="w-4 h-4 text-amber-600" /> Scan Sub-Meter with AI
          </button>
          <button
            onClick={handleGenerateMonthlyBatch}
            disabled={generating}
            className="px-4 py-2.5 bg-blue-700 hover:bg-blue-600 disabled:opacity-50 text-white font-extrabold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-blue-700/20 transition-all"
          >
            <Zap className="w-4 h-4" /> {generating ? 'Processing Invoices...' : 'Run Scheduled Monthly Billing Cycle'}
          </button>
        </div>
      </div>

      <AiMeterScannerModal
        isOpen={showAiMeterScanner}
        onClose={() => setShowAiMeterScanner(false)}
        onApplyReading={(res) => {
          setBatchMsg(`AI Reading applied for Flat ${res.flatNumber}: ${res.units} units (${formatCurrency(res.amount)})`);
          fetchInvoices();
        }}
      />

      {batchMsg && (
        <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-2xl text-xs text-emerald-800 font-bold flex items-center gap-2 shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{batchMsg}</span>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-blue-600 shadow-sm w-full sm:w-64"
        >
          <option value="">All Invoice Statuses</option>
          <option value="PENDING">Pending (Unpaid)</option>
          <option value="PAID">Paid</option>
          <option value="PARTIALLY_PAID">Partially Paid</option>
          <option value="OVERDUE">Overdue</option>
        </select>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-200 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 font-extrabold">Invoice No</th>
                <th className="py-3.5 px-4 font-extrabold">Flat & Resident</th>
                <th className="py-3.5 px-4 font-extrabold">Billing Period</th>
                <th className="py-3.5 px-4 font-extrabold">Due Date</th>
                <th className="py-3.5 px-4 font-extrabold">Total Amount</th>
                <th className="py-3.5 px-4 font-extrabold">Paid Amount</th>
                <th className="py-3.5 px-4 font-extrabold">Balance</th>
                <th className="py-3.5 px-4 font-extrabold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500 font-semibold">
                    Loading billing invoices...
                  </td>
                </tr>
              ) : invoices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500 font-semibold">
                    No invoices recorded yet. Run a monthly billing cycle above.
                  </td>
                </tr>
              ) : (
                invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-blue-50/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-800">
                      {inv.invoiceNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-slate-900">Flat {inv.flat?.flatNumber}</span>
                      <span className="text-[11px] text-slate-500 block font-medium">{inv.tenant?.fullName}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">
                      {inv.billingPeriod}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                      {formatDate(inv.dueDate)}
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-slate-900">
                      {formatCurrency(inv.totalAmount)}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-emerald-700">
                      {formatCurrency(inv.paidAmount)}
                    </td>
                    <td className="py-3.5 px-4 font-black text-rose-700">
                      {formatCurrency(inv.balanceAmount)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full inline-block ${
                          inv.status === 'PAID'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : inv.status === 'PARTIALLY_PAID'
                            ? 'bg-blue-100 text-blue-800 border border-blue-300'
                            : 'bg-amber-100 text-amber-800 border border-amber-300 font-black'
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
    </div>
  );
}
