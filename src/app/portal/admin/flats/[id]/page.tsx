'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { formatCurrency, formatDate, formatDateTime } from '@/lib/utils';
import {
  Home,
  User,
  Users,
  Receipt,
  CreditCard,
  QrCode,
  Wrench,
  Car,
  Zap,
  ShieldCheck,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';

export default function FlatDetailPage() {
  const params = useParams();
  const flatId = params?.id as string;
  const [flat, setFlat] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'tenant' | 'bills' | 'visitors' | 'maintenance' | 'meters'>('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (flatId) {
      fetch(`/api/flats/${flatId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) setFlat(data.flat);
        })
        .finally(() => setLoading(false));
    }
  }, [flatId]);

  if (loading) return <div className="text-center py-12 text-slate-400">Loading flat records...</div>;
  if (!flat) return <div className="text-center py-12 text-rose-400">Flat not found.</div>;

  const currentTenancy = flat.tenancies?.[0];
  const tenant = currentTenancy?.tenant;

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Status */}
      <div className="flex items-center justify-between">
        <Link
          href="/portal/admin/flats"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Flats Directory
        </Link>
        <span
          className={`text-xs font-bold px-3 py-1 rounded-full ${
            flat.status === 'OCCUPIED'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
          }`}
        >
          Status: {flat.status}
        </span>
      </div>

      {/* Flat Banner */}
      <div className="glass-card rounded-3xl p-6 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-700 flex items-center justify-center text-white text-xl font-mono font-black shadow-lg">
            {flat.flatNumber}
          </div>
          <div>
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
              {flat.building?.name} • {flat.floor?.name}
            </span>
            <h1 className="text-2xl font-black text-white">{flat.flatType} Apartment Unit</h1>
            <p className="text-xs text-slate-400">
              {flat.areaSqFt} sq.ft • {flat.bedrooms} Bedrooms • {flat.bathrooms} Bathrooms
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-slate-950/80 p-3 rounded-2xl border border-slate-800 text-xs">
          <div>
            <span className="text-slate-500 text-[10px] uppercase font-bold block">Monthly Rent</span>
            <span className="font-extrabold text-emerald-400 text-sm">{formatCurrency(flat.monthlyRent)}</span>
          </div>
          <div className="border-l border-slate-800 pl-4">
            <span className="text-slate-500 text-[10px] uppercase font-bold block">Maintenance</span>
            <span className="font-bold text-slate-200">{formatCurrency(flat.maintenance)}</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        {[
          { key: 'overview', label: 'Overview' },
          { key: 'tenant', label: 'Tenant & Family' },
          { key: 'bills', label: 'Bills & Invoices' },
          { key: 'visitors', label: 'Visitor Logs' },
          { key: 'maintenance', label: 'Maintenance' },
          { key: 'meters', label: 'Electricity Meter' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === tab.key
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Owner Box */}
          <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-3">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-400" /> Property Owner
            </h3>
            {flat.owner ? (
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 text-xs space-y-1.5">
                <span className="font-bold text-white text-sm block">{flat.owner.name}</span>
                <p className="text-slate-400">Phone: {flat.owner.phone}</p>
                <p className="text-slate-400">Email: {flat.owner.email}</p>
                <p className="text-slate-400">Bank: {flat.owner.bankName || 'SBI'} • A/C: {flat.owner.bankAccount || 'N/A'}</p>
              </div>
            ) : (
              <p className="text-xs text-slate-500">Flat owned directly by society / Pramila Apartments</p>
            )}
          </div>

          {/* Current Lease */}
          <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-3">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" /> Active Tenancy Lease
            </h3>
            {currentTenancy ? (
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Tenant Name:</span>
                  <span className="font-bold text-white">{tenant?.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Lease Period:</span>
                  <span className="text-slate-200">
                    {formatDate(currentTenancy.startDate)} to {formatDate(currentTenancy.endDate)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Security Deposit:</span>
                  <span className="font-semibold text-cyan-400">{formatCurrency(currentTenancy.depositAmount)}</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500">No active tenancy recorded. Flat is vacant.</p>
            )}
          </div>
        </div>
      )}

      {activeTab === 'bills' && (
        <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
          <h3 className="font-bold text-white text-sm">Invoices Generated for Flat {flat.flatNumber}</h3>
          <div className="divide-y divide-slate-800/80">
            {flat.invoices?.map((inv: any) => (
              <div key={inv.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <span className="font-mono font-bold text-slate-200 block">{inv.invoiceNumber}</span>
                  <span className="text-slate-400">{inv.billingPeriod} • Due: {formatDate(inv.dueDate)}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-white block">{formatCurrency(inv.totalAmount)}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      inv.status === 'PAID' ? 'text-emerald-400 bg-emerald-950/40' : 'text-amber-400 bg-amber-950/40'
                    }`}
                  >
                    {inv.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'visitors' && (
        <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
          <h3 className="font-bold text-white text-sm">Visitor History for Flat {flat.flatNumber}</h3>
          <div className="divide-y divide-slate-800/80">
            {flat.visitorRequests?.map((v: any) => (
              <div key={v.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-white block">{v.visitorName} ({v.relationship})</span>
                  <span className="text-slate-400 text-[11px]">{v.purpose} • {formatDateTime(v.expectedArrival)}</span>
                </div>
                <span className="text-[10px] font-bold bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full">
                  {v.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'meters' && (
        <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" /> Electricity Meter Readings
          </h3>
          {flat.meters?.map((meter: any) => (
            <div key={meter.id} className="space-y-3">
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 flex justify-between items-center text-xs">
                <div>
                  <span className="font-mono font-bold text-emerald-400 block">{meter.meterNumber}</span>
                  <span className="text-slate-400">Current Cumulative Reading: {meter.lastReading} Units</span>
                </div>
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded">
                  {meter.currentStatus}
                </span>
              </div>

              <table className="w-full text-left text-xs">
                <thead className="text-slate-400 uppercase text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="py-2">Date</th>
                    <th className="py-2">Prev</th>
                    <th className="py-2">Current</th>
                    <th className="py-2">Units Consumed</th>
                    <th className="py-2">Total Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {meter.readings?.map((r: any) => (
                    <tr key={r.id}>
                      <td className="py-2">{formatDate(r.readingDate)}</td>
                      <td className="py-2">{r.previousReading}</td>
                      <td className="py-2 font-bold text-white">{r.currentReading}</td>
                      <td className="py-2 text-emerald-400 font-bold">{r.unitsConsumed} Units</td>
                      <td className="py-2 font-bold">{formatCurrency(r.totalAmount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
