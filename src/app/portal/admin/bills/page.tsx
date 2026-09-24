'use client';

import React, { useEffect, useState } from 'react';
import {
  Receipt,
  Zap,
  Plus,
  Search,
  CheckCircle2,
  Eye,
  CreditCard,
  Banknote,
  QrCode,
  Building,
  X,
  Trash2,
  Sparkles,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { AiMeterScannerModal } from '@/components/ai/AiMeterScannerModal';

interface ChargeItem {
  itemType: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export default function AdminBillsPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [flats, setFlats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [batchMsg, setBatchMsg] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showAiMeterScanner, setShowAiMeterScanner] = useState(false);

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedInvoiceForPayment, setSelectedInvoiceForPayment] = useState<any | null>(null);
  const [selectedInvoiceForDetail, setSelectedInvoiceForDetail] = useState<any | null>(null);

  // Create Invoice Form State
  const [selectedFlatId, setSelectedFlatId] = useState('');
  const [billingPeriod, setBillingPeriod] = useState(
    new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' })
  );
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [items, setItems] = useState<ChargeItem[]>([
    { itemType: 'RENT', description: 'Monthly Rent', quantity: 1, unitPrice: 20000, totalPrice: 20000 },
    { itemType: 'MAINTENANCE', description: 'Society Maintenance Charge', quantity: 1, unitPrice: 2500, totalPrice: 2500 },
    { itemType: 'ELECTRICITY', description: 'Sub-meter Electricity Reading', quantity: 1, unitPrice: 1500, totalPrice: 1500 },
  ]);
  const [createNotes, setCreateNotes] = useState('');
  const [isSubmittingBill, setIsSubmittingBill] = useState(false);

  // Record Payment Form State
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CASH' | 'BANK_TRANSFER' | 'ONLINE_GATEWAY'>('UPI');
  const [payAmount, setPayAmount] = useState<number>(0);
  const [transactionRef, setTransactionRef] = useState('');
  const [paymentNotes, setPaymentNotes] = useState('');
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/invoices?status=${statusFilter}`);
      if (res.ok) {
        const data = await res.json();
        setInvoices(data.invoices || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchFlats = async () => {
    try {
      const res = await fetch('/api/flats');
      if (res.ok) {
        const data = await res.json();
        setFlats(data.flats || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchInvoices();
    fetchFlats();
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
      } else {
        setBatchMsg(data.error?.message || 'Batch generation failed');
      }
    } catch (e: any) {
      setBatchMsg(e.message || 'Batch generation failed');
    } finally {
      setGenerating(false);
    }
  };

  const handleItemChange = (index: number, field: keyof ChargeItem, value: any) => {
    const newItems = [...items];
    const item = { ...newItems[index], [field]: value };
    if (field === 'quantity' || field === 'unitPrice') {
      item.totalPrice = (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);
    }
    newItems[index] = item;
    setItems(newItems);
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      { itemType: 'OTHER', description: 'Additional Charge', quantity: 1, unitPrice: 0, totalPrice: 0 },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const calculatedSubtotal = items.reduce((sum, item) => sum + (item.totalPrice || 0), 0);

  const handleCreateBill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFlatId) {
      alert('Please select a flat');
      return;
    }

    const flatObj = flats.find((f) => f.id === selectedFlatId);
    const activeTenancy = flatObj?.tenancies?.[0];
    const tenantId = activeTenancy?.tenant?.id || flatObj?.owner?.id;

    if (!tenantId) {
      alert('Selected flat does not have an active tenant or assigned owner to bill.');
      return;
    }

    try {
      setIsSubmittingBill(true);
      const res = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          flatId: selectedFlatId,
          tenantId,
          billingPeriod,
          dueDate,
          items,
          notes: createNotes,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setBatchMsg(`Invoice ${data.invoice.invoiceNumber} created successfully!`);
        setShowCreateModal(false);
        fetchInvoices();
        setSelectedFlatId('');
        setCreateNotes('');
      } else {
        alert(data.error?.message || 'Failed to create bill');
      }
    } catch (err: any) {
      alert(err.message || 'Server error creating bill');
    } finally {
      setIsSubmittingBill(false);
    }
  };

  const handleOpenPaymentModal = (invoice: any) => {
    setSelectedInvoiceForPayment(invoice);
    setPayAmount(invoice.balanceAmount);
    setPaymentMethod('UPI');
    setTransactionRef('');
    setPaymentNotes('');
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoiceForPayment) return;

    if (payAmount <= 0) {
      alert('Payment amount must be greater than 0');
      return;
    }

    try {
      setIsSubmittingPayment(true);
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoiceId: selectedInvoiceForPayment.id,
          amount: payAmount,
          paymentMethod,
          transactionRef: transactionRef || (paymentMethod === 'UPI' ? `UPI_UTR_${Date.now()}` : `CASH_REC_${Date.now()}`),
          notes: paymentNotes,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setBatchMsg(
          `Payment of ${formatCurrency(payAmount)} via ${paymentMethod} recorded! Receipt: ${data.receiptNumber}`
        );
        setSelectedInvoiceForPayment(null);
        fetchInvoices();
      } else {
        alert(data.error?.message || 'Failed to record payment');
      }
    } catch (err: any) {
      alert(err.message || 'Server error recording payment');
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  const filteredInvoices = invoices.filter((inv) => {
    if (!search) return true;
    const term = search.toLowerCase();
    return (
      inv.invoiceNumber?.toLowerCase().includes(term) ||
      inv.flat?.flatNumber?.toLowerCase().includes(term) ||
      inv.tenant?.fullName?.toLowerCase().includes(term) ||
      inv.billingPeriod?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold mb-2 shadow-sm">
            <Receipt className="w-3.5 h-3.5 text-blue-600" /> Automated Utility & Rent Billing
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Billing & Invoices Engine</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">Generate recurring monthly rent, electricity charges, and mark payments via UPI or Cash</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
          >
            <Plus className="w-4 h-4" /> Create Custom Bill
          </button>
          <button
            onClick={() => setShowAiMeterScanner(true)}
            className="px-4 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 font-extrabold rounded-xl text-xs flex items-center gap-2 border border-amber-300 shadow-sm transition-all"
          >
            <Sparkles className="w-4 h-4 text-amber-600" /> Scan Sub-Meter
          </button>
          <button
            onClick={handleGenerateMonthlyBatch}
            disabled={generating}
            className="px-4 py-2.5 bg-blue-700 hover:bg-blue-600 disabled:opacity-50 text-white font-extrabold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-blue-700/20 transition-all"
          >
            <Zap className="w-4 h-4" /> {generating ? 'Processing...' : 'Run Monthly Batch'}
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
        <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-2xl text-xs text-emerald-800 font-bold flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{batchMsg}</span>
          </div>
          <button onClick={() => setBatchMsg(null)} className="text-emerald-700 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search invoice #, flat, resident..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:border-blue-600 shadow-sm"
          />
        </div>
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
                <th className="py-3.5 px-4 font-extrabold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500 font-semibold">
                    Loading billing invoices...
                  </td>
                </tr>
              ) : filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500 font-semibold">
                    No matching invoices found.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-blue-50/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-800">
                      <button
                        onClick={() => setSelectedInvoiceForDetail(inv)}
                        className="hover:underline flex items-center gap-1"
                      >
                        {inv.invoiceNumber}
                      </button>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-slate-900">Flat {inv.flat?.flatNumber}</span>
                      <span className="text-[11px] text-slate-500 block font-medium">
                        {inv.tenant?.fullName || 'Resident'}
                      </span>
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
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedInvoiceForDetail(inv)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                          title="View Details & Charges"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-600" /> View
                        </button>
                        {inv.balanceAmount > 0 && (
                          <button
                            onClick={() => handleOpenPaymentModal(inv)}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all flex items-center gap-1"
                          >
                            <Banknote className="w-3.5 h-3.5" /> Mark Paid
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE BILL MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 my-8 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">Generate Custom Bill</h2>
                <p className="text-xs text-slate-500">Add itemized charges for rent, maintenance, water, or electricity</p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBill} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Select Flat & Resident *</label>
                  <select
                    value={selectedFlatId}
                    onChange={(e) => setSelectedFlatId(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-blue-600"
                  >
                    <option value="">-- Choose Flat --</option>
                    {flats.map((f) => {
                      const t = f.tenancies?.[0]?.tenant?.fullName || f.owner?.fullName || 'No Resident';
                      return (
                        <option key={f.id} value={f.id}>
                          Flat {f.flatNumber} ({t})
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Billing Period *</label>
                  <input
                    type="text"
                    value={billingPeriod}
                    onChange={(e) => setBillingPeriod(e.target.value)}
                    required
                    placeholder="e.g. September 2026"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Due Date *</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Invoice Subtotal</label>
                  <div className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-black">
                    {formatCurrency(calculatedSubtotal)}
                  </div>
                </div>
              </div>

              {/* Itemized Charges Section */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                    Bill Charge Line Items
                  </h3>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Charge Item
                  </button>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {items.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
                    >
                      <select
                        value={item.itemType}
                        onChange={(e) => handleItemChange(idx, 'itemType', e.target.value)}
                        className="bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-800 w-full sm:w-36"
                      >
                        <option value="RENT">Rent</option>
                        <option value="MAINTENANCE">Maintenance</option>
                        <option value="ELECTRICITY">Electricity</option>
                        <option value="WATER">Water</option>
                        <option value="PARKING">Parking</option>
                        <option value="PENALTY">Penalty</option>
                        <option value="REPAIR">Repair</option>
                        <option value="OTHER">Other</option>
                      </select>

                      <input
                        type="text"
                        placeholder="Description"
                        value={item.description}
                        onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                        required
                        className="bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs font-medium text-slate-800 flex-1"
                      />

                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          placeholder="Qty"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(idx, 'quantity', parseFloat(e.target.value) || 0)}
                          className="bg-white border border-slate-300 rounded-xl px-2 py-1.5 text-xs font-medium text-slate-800 w-16 text-center"
                        />
                        <span className="text-xs text-slate-400">×</span>
                        <input
                          type="number"
                          placeholder="Rate"
                          value={item.unitPrice}
                          onChange={(e) => handleItemChange(idx, 'unitPrice', parseFloat(e.target.value) || 0)}
                          className="bg-white border border-slate-300 rounded-xl px-2 py-1.5 text-xs font-medium text-slate-800 w-24 text-right"
                        />
                        <span className="text-xs font-bold text-slate-900 w-20 text-right">
                          {formatCurrency(item.totalPrice)}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          disabled={items.length <= 1}
                          className="p-1 text-slate-400 hover:text-rose-600 disabled:opacity-30"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Notes / Instructions (Optional)</label>
                <textarea
                  rows={2}
                  value={createNotes}
                  onChange={(e) => setCreateNotes(e.target.value)}
                  placeholder="e.g. Electricity bill included from meter reading #4092"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingBill}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20"
                >
                  <Receipt className="w-4 h-4" />
                  {isSubmittingBill ? 'Generating Bill...' : `Generate Bill (${formatCurrency(calculatedSubtotal)})`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MARK AS PAID MODAL (UPI & CASH) */}
      {selectedInvoiceForPayment && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 mb-1">
                  <Banknote className="w-3 h-3 text-emerald-600" /> Record Official Payment
                </div>
                <h2 className="text-xl font-black text-slate-900">Mark Invoice as Paid</h2>
              </div>
              <button
                onClick={() => setSelectedInvoiceForPayment(null)}
                className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Summary Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Invoice Number:</span>
                <span className="font-mono font-bold text-blue-800">{selectedInvoiceForPayment.invoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Flat & Resident:</span>
                <span className="font-bold text-slate-900">
                  Flat {selectedInvoiceForPayment.flat?.flatNumber} — {selectedInvoiceForPayment.tenant?.fullName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Total Amount:</span>
                <span className="font-bold text-slate-900">{formatCurrency(selectedInvoiceForPayment.totalAmount)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2">
                <span className="text-slate-700 font-bold">Remaining Balance Due:</span>
                <span className="font-black text-rose-700 text-sm">
                  {formatCurrency(selectedInvoiceForPayment.balanceAmount)}
                </span>
              </div>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Select Payment Method *</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('UPI')}
                    className={`p-3 rounded-2xl border text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
                      paymentMethod === 'UPI'
                        ? 'bg-purple-50 border-purple-600 text-purple-900 shadow-sm ring-2 ring-purple-600/20'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <QrCode className="w-4 h-4 text-purple-600" /> UPI / QR Code
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('CASH')}
                    className={`p-3 rounded-2xl border text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
                      paymentMethod === 'CASH'
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-900 shadow-sm ring-2 ring-emerald-600/20'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Banknote className="w-4 h-4 text-emerald-600" /> Cash Received
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('BANK_TRANSFER')}
                    className={`p-3 rounded-2xl border text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
                      paymentMethod === 'BANK_TRANSFER'
                        ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-sm ring-2 ring-blue-600/20'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Building className="w-4 h-4 text-blue-600" /> Bank (NEFT/IMPS)
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('ONLINE_GATEWAY')}
                    className={`p-3 rounded-2xl border text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
                      paymentMethod === 'ONLINE_GATEWAY'
                        ? 'bg-amber-50 border-amber-600 text-amber-900 shadow-sm ring-2 ring-amber-600/20'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-amber-600" /> Online Gateway
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Amount Paid (₹) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={payAmount}
                  onChange={(e) => setPayAmount(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-sm font-black text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {paymentMethod === 'UPI'
                    ? 'UPI Transaction Ref / UTR Number'
                    : paymentMethod === 'CASH'
                    ? 'Cash Voucher / Handover Receipt Ref'
                    : 'Transaction Reference / Cheque No'}
                </label>
                <input
                  type="text"
                  value={transactionRef}
                  onChange={(e) => setTransactionRef(e.target.value)}
                  placeholder={
                    paymentMethod === 'UPI'
                      ? 'e.g. 426890123456 (Google Pay / PhonePe UTR)'
                      : paymentMethod === 'CASH'
                      ? 'e.g. Cash collected by Security Admin'
                      : 'e.g. TXN_987654321'
                  }
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Payment Notes (Optional)</label>
                <input
                  type="text"
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  placeholder="e.g. Received in cash at estate office"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedInvoiceForPayment(null)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingPayment}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {isSubmittingPayment ? 'Recording...' : `Confirm Payment of ${formatCurrency(payAmount)}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW INVOICE DETAIL & BREAKDOWN MODAL */}
      {selectedInvoiceForDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 my-8 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="font-mono text-xs font-extrabold text-blue-800 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                  {selectedInvoiceForDetail.invoiceNumber}
                </span>
                <h2 className="text-xl font-black text-slate-900 mt-2">
                  Invoice Breakdown — Flat {selectedInvoiceForDetail.flat?.flatNumber}
                </h2>
                <p className="text-xs text-slate-500">
                  Resident: {selectedInvoiceForDetail.tenant?.fullName} | Period: {selectedInvoiceForDetail.billingPeriod}
                </p>
              </div>
              <button
                onClick={() => setSelectedInvoiceForDetail(null)}
                className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Line Items Table */}
            <div className="space-y-2">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">Itemized Charges</h3>
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Type</th>
                      <th className="p-3">Description</th>
                      <th className="p-3 text-center">Qty</th>
                      <th className="p-3 text-right">Unit Price</th>
                      <th className="p-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedInvoiceForDetail.items?.length > 0 ? (
                      selectedInvoiceForDetail.items.map((item: any) => (
                        <tr key={item.id} className="hover:bg-slate-50">
                          <td className="p-3 font-bold text-slate-800">
                            <span className="px-2 py-0.5 bg-slate-200 rounded text-[10px] font-mono">
                              {item.itemType}
                            </span>
                          </td>
                          <td className="p-3 text-slate-700">{item.description}</td>
                          <td className="p-3 text-center text-slate-600">{item.quantity}</td>
                          <td className="p-3 text-right text-slate-600">{formatCurrency(item.unitPrice)}</td>
                          <td className="p-3 text-right font-bold text-slate-900">{formatCurrency(item.totalPrice)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="p-4 text-center text-slate-400">
                          No line items recorded
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Summary Box */}
            <div className="bg-slate-50 p-4 rounded-2xl space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-600 font-medium">Subtotal:</span>
                <span className="font-bold text-slate-900">{formatCurrency(selectedInvoiceForDetail.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 font-medium">Amount Paid:</span>
                <span className="font-bold text-emerald-700">{formatCurrency(selectedInvoiceForDetail.paidAmount)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2">
                <span className="text-slate-800 font-black">Balance Due:</span>
                <span className="font-black text-rose-700 text-sm">
                  {formatCurrency(selectedInvoiceForDetail.balanceAmount)}
                </span>
              </div>
            </div>

            {/* Recorded Payments */}
            {selectedInvoiceForDetail.payments?.length > 0 && (
              <div className="space-y-2 border-t border-slate-100 pt-4">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">Payment Receipts</h3>
                <div className="space-y-2">
                  {selectedInvoiceForDetail.payments.map((p: any) => (
                    <div key={p.id} className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl text-xs flex justify-between items-center">
                      <div>
                        <span className="font-mono font-bold text-emerald-900">{p.receiptNumber}</span>
                        <span className="text-[11px] text-slate-500 block">
                          Method: <strong>{p.paymentMethod}</strong> | Ref: {p.transactionRef || 'N/A'}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-black text-emerald-800">{formatCurrency(p.amount)}</span>
                        <span className="text-[10px] text-slate-400 block">{formatDate(p.paymentDate)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              {selectedInvoiceForDetail.balanceAmount > 0 ? (
                <button
                  onClick={() => {
                    const inv = selectedInvoiceForDetail;
                    setSelectedInvoiceForDetail(null);
                    handleOpenPaymentModal(inv);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
                >
                  <Banknote className="w-4 h-4" /> Mark Paid Now
                </button>
              ) : (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                  Fully Paid
                </span>
              )}
              <button
                onClick={() => setSelectedInvoiceForDetail(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
