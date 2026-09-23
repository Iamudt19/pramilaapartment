'use client';

import React from 'react';
import { X, Printer, CheckCircle2, Building2 } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: any;
}

export function ReceiptModal({ isOpen, onClose, payment }: ReceiptModalProps) {
  if (!isOpen || !payment) return null;

  const handlePrint = () => {
    window.print();
  };

  const invoice = payment.invoice || {};
  const flat = invoice.flat || {};
  const tenant = payment.tenant || {};

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Official Receipt</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 border border-slate-700 transition-all"
            >
              <Printer className="w-3.5 h-3.5" /> Print Receipt
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Canvas */}
        <div className="bg-white text-slate-900 rounded-2xl p-6 shadow-lg border border-slate-200">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-slate-200 pb-4 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-600" />
                <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">Pramila Apartments</h2>
              </div>
              <p className="text-[11px] text-slate-600 max-w-xs mt-0.5">
                42, Temple Road, Civil Lines, Prayagraj, UP - 211001
              </p>
              <p className="text-[10px] text-slate-500">Contact: +91 98765 43210 • office.pramilaapartment@gmail.com</p>
            </div>
            <div className="text-right">
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mb-1">
                PAID & VERIFIED
              </span>
              <div className="text-xs font-mono font-bold text-slate-800">
                {payment.receiptNumber || 'REC-2026-0001'}
              </div>
              <div className="text-[11px] text-slate-500">Date: {formatDate(payment.paymentDate || new Date())}</div>
            </div>
          </div>

          {/* Tenant & Bill Meta */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200 mb-4">
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-bold block">Received From</span>
              <span className="font-bold text-slate-900">{tenant.fullName || tenant.name || 'Resident'}</span>
              <span className="text-[11px] text-slate-600 block">Flat {flat.flatNumber || 'N/A'}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-bold block">Invoice Reference</span>
              <span className="font-bold text-slate-900">{invoice.invoiceNumber || 'INV-REF'}</span>
              <span className="text-[11px] text-slate-600 block">Period: {invoice.billingPeriod || 'Current'}</span>
            </div>
          </div>

          {/* Breakdown Table */}
          <table className="w-full text-xs mb-4">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 text-[10px] uppercase">
                <th className="text-left py-1.5">Description</th>
                <th className="text-right py-1.5">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoice.items?.map((item: any, idx: number) => (
                <tr key={idx}>
                  <td className="py-2 text-slate-700">{item.description}</td>
                  <td className="py-2 text-right font-semibold text-slate-900">
                    {formatCurrency(item.totalPrice)}
                  </td>
                </tr>
              )) || (
                <tr>
                  <td className="py-2 text-slate-700">Payment for Invoice {invoice.invoiceNumber}</td>
                  <td className="py-2 text-right font-semibold text-slate-900">
                    {formatCurrency(payment.amount)}
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Summary Box */}
          <div className="border-t-2 border-slate-900 pt-3 flex items-center justify-between text-sm font-bold text-slate-900 mb-4">
            <span>Total Amount Paid</span>
            <span className="text-base text-emerald-700">{formatCurrency(payment.amount)}</span>
          </div>

          {/* Footer details */}
          <div className="text-[10px] text-slate-500 flex justify-between items-center border-t border-slate-200 pt-3">
            <div>
              Payment Method: <strong>{payment.paymentMethod?.replace('_', ' ') || 'ONLINE'}</strong> • Ref:{' '}
              {payment.transactionRef || 'N/A'}
            </div>
            <div className="text-right font-semibold text-emerald-700">Digitally Generated Receipt</div>
          </div>
        </div>
      </div>
    </div>
  );
}
