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
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-2 shadow-sm">
            <Receipt className="w-3.5 h-3.5 text-emerald-600" /> Digital Ledger & Receipts
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Rent, Society Bills & Receipts</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">Settle monthly rent, electricity sub-metering, maintenance dues, and download official receipts</p>
        </div>
      </div>

      {paySuccessMsg && (
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-xs text-emerald-800 font-bold flex items-center gap-2 shadow-sm animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{paySuccessMsg}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('invoices')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'invoices'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          My Invoices ({invoices.length})
        </button>
        <button
          onClick={() => setActiveTab('payments')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'payments'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          Payment Receipts ({payments.length})
        </button>
      </div>

      {/* Tab: Invoices */}
      {activeTab === 'invoices' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {invoices.length === 0 ? (
              <div className="col-span-full bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-md text-slate-500 font-semibold">
                No invoices found.
              </div>
            ) : (
              invoices.map((inv) => (
                <div key={inv.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md hover:shadow-lg transition-all space-y-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                      <span className="font-mono font-bold text-xs text-blue-800 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">{inv.invoiceNumber}</span>
                      <span
                        className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border ${
                          inv.status === 'PAID'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        {inv.status}
                      </span>
                    </div>

                    <h3 className="font-black text-slate-900 text-lg">{inv.billingPeriod}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Due Date: <strong className="text-slate-900">{formatDate(inv.dueDate)}</strong></p>

                    {/* Line Items */}
                    <div className="mt-3 space-y-1.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs font-medium">
                      {inv.items?.map((item: any) => (
                        <div key={item.id} className="flex justify-between text-slate-700">
                          <span className="text-slate-600">{item.description}</span>
                          <span className="font-bold text-slate-900">{formatCurrency(item.totalPrice)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-extrabold tracking-wider block">Balance Due</span>
                      <span className="text-xl font-black text-slate-900">{formatCurrency(inv.balanceAmount)}</span>
                    </div>

                    {inv.balanceAmount > 0 ? (
                      <button
                        onClick={() => setSelectedInvoiceForPay(inv)}
                        className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all active:scale-95"
                      >
                        <CreditCard className="w-4 h-4" /> Pay Now
                      </button>
                    ) : (
                      <span className="text-xs text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Settled
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab: Payments History */}
      {activeTab === 'payments' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-200 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4 font-extrabold">Receipt No</th>
                  <th className="py-3.5 px-4 font-extrabold">Date</th>
                  <th className="py-3.5 px-4 font-extrabold">Invoice Reference</th>
                  <th className="py-3.5 px-4 font-extrabold">Amount Paid</th>
                  <th className="py-3.5 px-4 font-extrabold">Payment Method</th>
                  <th className="py-3.5 px-4 font-extrabold text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500 font-semibold">
                      No payment receipts found.
                    </td>
                  </tr>
                ) : (
                  payments.map((p) => (
                    <tr key={p.id} className="hover:bg-blue-50/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-800">{p.receiptNumber}</td>
                      <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px] whitespace-nowrap">{formatDate(p.paymentDate)}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-700">{p.invoice?.invoiceNumber}</td>
                      <td className="py-3.5 px-4 font-black text-emerald-700 text-sm">{formatCurrency(p.amount)}</td>
                      <td className="py-3.5 px-4 text-slate-600 font-medium">{p.paymentMethod?.replace('_', ' ')}</td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedPaymentForReceipt(p)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 text-slate-800 hover:bg-slate-200 rounded-xl font-bold border border-slate-200 transition-all text-xs"
                        >
                          <Printer className="w-3.5 h-3.5 text-blue-600" /> View Receipt
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pay Bill Modal */}
      {selectedInvoiceForPay && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-4">
            <h3 className="text-xl font-black text-slate-900">Pay Society Invoice</h3>
            <p className="text-xs text-slate-500">{selectedInvoiceForPay.billingPeriod} • {selectedInvoiceForPay.invoiceNumber}</p>

            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 flex justify-between items-center">
              <span className="text-xs font-bold text-emerald-900">Total Due Amount:</span>
              <span className="text-xl font-black text-emerald-800 font-mono">
                {formatCurrency(selectedInvoiceForPay.balanceAmount)}
              </span>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 block">Select Payment Mode</label>
              <div className="grid grid-cols-2 gap-2.5">
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
                    className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                      paymentMethod === m.id
                        ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2.5 pt-3">
              <button
                type="button"
                onClick={() => setSelectedInvoiceForPay(null)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl text-xs font-bold border border-slate-300 transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isPaying}
                onClick={handleProcessPayment}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3 rounded-xl text-xs shadow-md shadow-emerald-600/20 transition-all active:scale-95"
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
