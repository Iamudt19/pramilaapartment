'use client';

import React, { useEffect, useState } from 'react';
import { CreditCard, Printer, CheckCircle2, Search, ArrowRight } from 'lucide-react';
import { formatCurrency, formatDate, formatDateTime } from '@/lib/utils';
import { ReceiptModal } from '@/components/shared/ReceiptModal';

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);

  const fetchPayments = async () => {
    try {
      const res = await fetch('/api/payments');
      if (res.ok) setPayments((await res.json()).payments || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Payments & Receipts Ledger</h1>
          <p className="text-xs text-slate-400 mt-1">Audit reconciled payments, transaction IDs, and generate society receipts</p>
        </div>
      </div>

      {/* Payments Table */}
      <div className="glass-card rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Receipt No</th>
              <th className="py-3 px-4">Payment Date</th>
              <th className="py-3 px-4">Flat & Resident</th>
              <th className="py-3 px-4">Invoice Ref</th>
              <th className="py-3 px-4">Amount Paid</th>
              <th className="py-3 px-4">Method & Transaction Ref</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Receipt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {payments.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-500">
                  No payment records found.
                </td>
              </tr>
            ) : (
              payments.map((pay) => (
                <tr key={pay.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                    {pay.receiptNumber}
                  </td>
                  <td className="py-3 px-4 text-slate-300 font-mono text-[11px]">
                    {formatDate(pay.paymentDate)}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-white">Flat {pay.invoice?.flat?.flatNumber}</span>
                    <span className="text-[10px] text-slate-400 block">{pay.tenant?.fullName}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-300 font-mono text-[11px]">
                    {pay.invoice?.invoiceNumber}
                  </td>
                  <td className="py-3 px-4 font-black text-emerald-400 text-sm">
                    {formatCurrency(pay.amount)}
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    <div>{pay.paymentMethod?.replace('_', ' ')}</div>
                    <div className="text-[10px] font-mono text-slate-500">{pay.transactionRef || 'N/A'}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {pay.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedPayment(pay)}
                      className="inline-flex items-center gap-1 text-xs text-emerald-400 hover:underline font-semibold"
                    >
                      <Printer className="w-3.5 h-3.5" /> View Receipt
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ReceiptModal
        isOpen={Boolean(selectedPayment)}
        onClose={() => setSelectedPayment(null)}
        payment={selectedPayment}
      />
    </div>
  );
}
