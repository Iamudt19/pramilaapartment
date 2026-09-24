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
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold mb-2 shadow-sm">
            <CreditCard className="w-3.5 h-3.5 text-blue-600" /> Reconciled Transactions & Receipts
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Payments & Receipts Ledger</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">Audit reconciled payments, transaction IDs, and generate society receipts</p>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-200 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 font-extrabold">Receipt No</th>
                <th className="py-3.5 px-4 font-extrabold">Payment Date</th>
                <th className="py-3.5 px-4 font-extrabold">Flat & Resident</th>
                <th className="py-3.5 px-4 font-extrabold">Invoice Ref</th>
                <th className="py-3.5 px-4 font-extrabold">Amount Paid</th>
                <th className="py-3.5 px-4 font-extrabold">Method & Transaction Ref</th>
                <th className="py-3.5 px-4 font-extrabold">Status</th>
                <th className="py-3.5 px-4 text-right font-extrabold">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500 font-semibold">
                    No payment records found.
                  </td>
                </tr>
              ) : (
                payments.map((pay) => (
                  <tr key={pay.id} className="hover:bg-blue-50/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-800">
                      {pay.receiptNumber}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                      {formatDate(pay.paymentDate)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900">Flat {pay.invoice?.flat?.flatNumber}</span>
                      <span className="text-[11px] text-slate-500 block font-medium">{pay.tenant?.fullName}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-mono text-[11px]">
                      {pay.invoice?.invoiceNumber}
                    </td>
                    <td className="py-3.5 px-4 font-black text-emerald-700 text-sm">
                      {formatCurrency(pay.amount)}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      <div className="font-semibold text-slate-900">{pay.paymentMethod?.replace('_', ' ')}</div>
                      <div className="text-[10px] font-mono text-slate-500">{pay.transactionRef || 'N/A'}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                        {pay.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedPayment(pay)}
                        className="inline-flex items-center gap-1 text-xs text-blue-700 hover:underline font-bold"
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
      </div>

      <ReceiptModal
        isOpen={Boolean(selectedPayment)}
        onClose={() => setSelectedPayment(null)}
        payment={selectedPayment}
      />
    </div>
  );
}
