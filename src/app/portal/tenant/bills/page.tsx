'use client';

import React, { useEffect, useState } from 'react';
import { Receipt, CreditCard, Printer, CheckCircle2, ShieldCheck, Zap, ArrowRight } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { ReceiptModal } from '@/components/shared/ReceiptModal';

export default function TenantBillsPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'invoices' | 'payments'>('invoices');
  const [selectedInvoiceForPay, setSelectedInvoiceForPay] = useState<any>(null);
  const [selectedPaymentForReceipt, setSelectedPaymentForReceipt] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState('ONLINE_GATEWAY');
  const [isPaying, setIsPaying] = useState(false);
  const [paySuccessMsg, setPaySuccessMsg] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const [invRes, payRes] = await Promise.all([
        fetch('/api/invoices'),
        fetch('/api/payments'),
      ]);
      if (invRes.ok) setInvoices((await invRes.json()).invoices || []);
      if (payRes.ok) setPayments((await payRes.json()).payments || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleProcessPayment = async () => {
    if (!selectedInvoiceForPay) return;
    try {
      setIsPaying(true);
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoiceId: selectedInvoiceForPay.id,
          amount: selectedInvoiceForPay.balanceAmount,
          paymentMethod,
          transactionRef: `RZP_TXN_${Date.now()}`,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setPaySuccessMsg(`Payment of ${formatCurrency(selectedInvoiceForPay.balanceAmount)} successful! Receipt No: ${data.receiptNumber}`);
        setSelectedInvoiceForPay(null);
        fetchData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Rent, Society Bills & Receipts</h1>
          <p className="text-xs text-slate-400 mt-1">Settle monthly rent, electricity sub-metering, maintenance dues, and download official receipts</p>
        </div>
      </div>

      {paySuccessMsg && (
        <div className="bg-emerald-950/40 border border-emerald-500/40 p-4 rounded-2xl text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in duration-150">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{paySuccessMsg}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('invoices')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'invoices'
              ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          My Invoices ({invoices.length})
        </button>
        <button
          onClick={() => setActiveTab('payments')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'payments'
              ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          Payment Receipts ({payments.length})
        </button>
      </div>

      {/* Tab: Invoices */}
      {activeTab === 'invoices' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {invoices.map((inv) => (
              <div key={inv.id} className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                    <span className="font-mono font-bold text-xs text-emerald-400">{inv.invoiceNumber}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        inv.status === 'PAID'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-white text-base">{inv.billingPeriod}</h3>
                  <p className="text-xs text-slate-400">Due Date: <strong>{formatDate(inv.dueDate)}</strong></p>

                  {/* Line Items */}
                  <div className="mt-3 space-y-1.5 bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80 text-xs">
                    {inv.items?.map((item: any) => (
                      <div key={item.id} className="flex justify-between text-slate-300">
                        <span className="text-slate-400">{item.description}</span>
                        <span className="font-semibold text-white">{formatCurrency(item.totalPrice)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Balance Due</span>
                    <span className="text-lg font-black text-white">{formatCurrency(inv.balanceAmount)}</span>
                  </div>

                  {inv.balanceAmount > 0 ? (
                    <button
                      onClick={() => setSelectedInvoiceForPay(inv)}
                      className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-extrabold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all"
                    >
                      <CreditCard className="w-3.5 h-3.5" /> Pay Now
                    </button>
                  ) : (
                    <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Settled
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Payments History */}
      {activeTab === 'payments' && (
        <div className="glass-card rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Receipt No</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Invoice Reference</th>
                <th className="py-3 px-4">Amount Paid</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-emerald-400">{p.receiptNumber}</td>
                  <td className="py-3 px-4 text-slate-300">{formatDate(p.paymentDate)}</td>
                  <td className="py-3 px-4 font-mono text-slate-300">{p.invoice?.invoiceNumber}</td>
                  <td className="py-3 px-4 font-black text-emerald-400 text-sm">{formatCurrency(p.amount)}</td>
                  <td className="py-3 px-4 text-slate-400">{p.paymentMethod?.replace('_', ' ')}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedPaymentForReceipt(p)}
                      className="inline-flex items-center gap-1 text-xs text-emerald-400 hover:underline font-semibold"
                    >
                      <Printer className="w-3.5 h-3.5" /> View Receipt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pay Bill Modal */}
      {selectedInvoiceForPay && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-1">Pay Society Invoice</h3>
            <p className="text-xs text-slate-400 mb-4">{selectedInvoiceForPay.billingPeriod} • {selectedInvoiceForPay.invoiceNumber}</p>

            <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 mb-4 flex justify-between items-center">
              <span className="text-xs text-slate-400">Total Due Amount:</span>
              <span className="text-xl font-black text-emerald-400">
                {formatCurrency(selectedInvoiceForPay.balanceAmount)}
              </span>
            </div>

            <div className="space-y-3 mb-6">
              <label className="text-xs font-semibold text-slate-300 block">Select Payment Mode</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'ONLINE_GATEWAY', label: 'Razorpay / Cards' },
                  { id: 'UPI', label: 'Instant UPI / QR' },
                  { id: 'BANK_TRANSFER', label: 'Net Banking NEFT' },
                  { id: 'CASH', label: 'Office Cash Payment' },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id)}
                    className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all ${
                      paymentMethod === m.id
                        ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSelectedInvoiceForPay(null)}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2.5 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isPaying}
                onClick={handleProcessPayment}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold py-2.5 rounded-xl text-xs shadow-md shadow-emerald-500/20"
              >
                {isPaying ? 'Processing...' : 'Confirm & Pay'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Printable Receipt Modal */}
      <ReceiptModal
        isOpen={Boolean(selectedPaymentForReceipt)}
        onClose={() => setSelectedPaymentForReceipt(null)}
        payment={selectedPaymentForReceipt}
      />
    </div>
  );
}
