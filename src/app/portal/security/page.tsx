'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Shield,
  ScanLine,
  UserCheck,
  UserX,
  Car,
  AlertTriangle,
  QrCode,
  Clock,
  Search,
  CheckCircle2,
  Phone,
} from 'lucide-react';
import { formatDateTime, formatDate } from '@/lib/utils';
import { QrScannerModal } from '@/components/shared/QrScannerModal';

export default function SecurityGatePage() {
  const [visitors, setVisitors] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'inside' | 'approved' | 'completed' | 'all'>('inside');
  const [showScanner, setShowScanner] = useState(false);
  const [search, setSearch] = useState('');
  const [checkingOutId, setCheckingOutId] = useState<string | null>(null);

  const fetchVisitors = async () => {
    try {
      const res = await fetch('/api/visitors');
      if (res.ok) setVisitors((await res.json()).visitors || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, []);

  const handleQuickCheckOut = async (requestId: string) => {
    try {
      setCheckingOutId(requestId);
      const res = await fetch('/api/visitors/check-out', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, notes: 'Normal exit verified at Gate 1' }),
      });
      if (res.ok) fetchVisitors();
    } catch (e) {
      console.error(e);
    } finally {
      setCheckingOutId(null);
    }
  };

  const insideVisitors = visitors.filter((v) => v.status === 'CHECKED_IN');
  const approvedVisitors = visitors.filter((v) => v.status === 'APPROVED');
  const completedVisitors = visitors.filter((v) => v.status === 'CHECKED_OUT');

  let displayVisitors = visitors;
  if (activeTab === 'inside') displayVisitors = insideVisitors;
  else if (activeTab === 'approved') displayVisitors = approvedVisitors;
  else if (activeTab === 'completed') displayVisitors = completedVisitors;

  if (search) {
    displayVisitors = displayVisitors.filter(
      (v) =>
        v.visitorName.toLowerCase().includes(search.toLowerCase()) ||
        v.flat?.flatNumber.toLowerCase().includes(search.toLowerCase()) ||
        v.visitorPhone?.includes(search)
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Gate Header (White Theme) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-amber-500/20">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold text-amber-700 uppercase tracking-widest">
              Main Gate 1 • Security Post
            </span>
            <h1 className="text-xl font-black text-slate-900">Live Gate Operations</h1>
          </div>
        </div>
        <div className="text-right">
          <span className="text-2xl font-black text-emerald-600">{insideVisitors.length}</span>
          <span className="text-[10px] text-slate-500 block uppercase font-extrabold">Currently Inside</span>
        </div>
      </div>

      {/* Touch-Friendly Action Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setShowScanner(true)}
          className="p-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl shadow-lg shadow-emerald-600/20 font-black text-sm flex flex-col items-center justify-center gap-2 transition-all transform active:scale-95"
        >
          <ScanLine className="w-6 h-6" />
          <span>SCAN QR PASS</span>
        </button>

        <Link
          href="/portal/security/incident"
          className="p-4 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl shadow-lg shadow-rose-600/20 font-black text-sm flex flex-col items-center justify-center gap-2 transition-all transform active:scale-95 text-center"
        >
          <AlertTriangle className="w-6 h-6" />
          <span>REPORT INCIDENT</span>
        </Link>

        <Link
          href="/portal/security/vehicles"
          className="p-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl font-bold text-sm flex flex-col items-center justify-center gap-2 transition-all text-center shadow-sm"
        >
          <Car className="w-6 h-6 text-cyan-600" />
          <span>VEHICLE GATE</span>
        </Link>

        <button
          onClick={() => setShowScanner(true)}
          className="p-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl font-bold text-sm flex flex-col items-center justify-center gap-2 transition-all shadow-sm"
        >
          <UserCheck className="w-6 h-6 text-emerald-600" />
          <span>MANUAL CHECK-IN</span>
        </button>
      </div>

      {/* Tabs & Search */}
      <div className="space-y-3">
        <div className="flex gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
          {[
            { id: 'inside', label: `Currently Inside (${insideVisitors.length})` },
            { id: 'approved', label: `Expected / Approved (${approvedVisitors.length})` },
            { id: 'completed', label: `Checked Out (${completedVisitors.length})` },
            { id: 'all', label: `All Records (${visitors.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-amber-500 text-white font-extrabold shadow-md shadow-amber-500/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by visitor name, phone, or flat number (e.g. A-101)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 shadow-sm"
          />
        </div>
      </div>

      {/* Visitors Stream */}
      <div className="space-y-3">
        {displayVisitors.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center text-slate-500 text-xs border border-slate-200 shadow-sm">
            No visitors found for this category.
          </div>
        ) : (
          displayVisitors.map((v) => (
            <div
              key={v.id}
              className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 transition-all"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-extrabold text-slate-900 text-base">{v.visitorName}</span>
                  <span className="text-xs text-slate-500">({v.relationship})</span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      v.status === 'CHECKED_IN'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300 font-black animate-pulse'
                        : v.status === 'APPROVED'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {v.status}
                  </span>
                </div>

                <div className="text-xs text-slate-600 space-y-0.5">
                  <div>
                    Destination:{' '}
                    <strong className="text-emerald-700 font-mono text-sm">Flat {v.flat?.flatNumber}</strong> • Host:{' '}
                    {v.tenant?.fullName}
                  </div>
                  <div className="text-slate-500 text-[11px]">
                    Purpose: {v.purpose} • Phone: {v.visitorPhone}
                  </div>
                  {v.vehicleNumber && (
                    <div className="font-mono text-cyan-800 text-[11px] font-bold">Vehicle: {v.vehicleNumber}</div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {v.status === 'CHECKED_IN' && (
                  <button
                    onClick={() => handleQuickCheckOut(v.id)}
                    disabled={checkingOutId === v.id}
                    className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-rose-600/20 transition-all"
                  >
                    <UserX className="w-4 h-4" /> {checkingOutId === v.id ? 'Exiting...' : 'Check Out Exit'}
                  </button>
                )}
                {v.status === 'APPROVED' && (
                  <button
                    onClick={() => setShowScanner(true)}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all"
                  >
                    <UserCheck className="w-4 h-4" /> Verify & Check In
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <QrScannerModal
        isOpen={showScanner}
        onClose={() => setShowScanner(false)}
        onSuccess={() => fetchVisitors()}
      />
    </div>
  );
}
