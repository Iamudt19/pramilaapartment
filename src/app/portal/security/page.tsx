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
      {/* Gate Header */}
      <div className="glass-card rounded-3xl p-6 border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 text-slate-950 flex items-center justify-center font-bold shadow-lg">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">
              Main Gate 1 • Security Post
            </span>
            <h1 className="text-xl font-black text-white">Live Gate Operations</h1>
          </div>
        </div>
        <div className="text-right">
          <span className="text-2xl font-black text-emerald-400">{insideVisitors.length}</span>
          <span className="text-[10px] text-slate-400 block uppercase font-bold">Currently Inside</span>
        </div>
      </div>

      {/* Big Touch-Friendly Action Buttons (Mobile-First) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setShowScanner(true)}
          className="p-4 bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 rounded-2xl shadow-lg shadow-emerald-500/20 font-black text-sm flex flex-col items-center justify-center gap-2 transition-all transform active:scale-95"
        >
          <ScanLine className="w-6 h-6" />
          <span>SCAN QR PASS</span>
        </button>

        <Link
          href="/portal/security/incident"
          className="p-4 bg-gradient-to-br from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 text-white rounded-2xl shadow-lg shadow-rose-600/20 font-black text-sm flex flex-col items-center justify-center gap-2 transition-all transform active:scale-95 text-center"
        >
          <AlertTriangle className="w-6 h-6" />
          <span>REPORT INCIDENT</span>
        </Link>

        <Link
          href="/portal/security/vehicles"
          className="p-4 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white rounded-2xl font-bold text-sm flex flex-col items-center justify-center gap-2 transition-all text-center"
        >
          <Car className="w-6 h-6 text-cyan-400" />
          <span>VEHICLE GATE</span>
        </Link>

        <button
          onClick={() => setShowScanner(true)}
          className="p-4 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white rounded-2xl font-bold text-sm flex flex-col items-center justify-center gap-2 transition-all"
        >
          <UserCheck className="w-6 h-6 text-emerald-400" />
          <span>MANUAL CHECK-IN</span>
        </button>
      </div>

      {/* Tabs & Search */}
      <div className="space-y-3">
        <div className="flex gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
          {[
            { id: 'inside', label: `Currently Inside (${insideVisitors.length})` },
            { id: 'approved', label: `Expected / Approved (${approvedVisitors.length})` },
            { id: 'completed', label: `Checked Out (${completedVisitors.length})` },
            { id: 'all', label: `All Records (${visitors.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by visitor name, phone, or flat number (e.g. A-101)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Visitors Stream */}
      <div className="space-y-3">
        {displayVisitors.length === 0 ? (
          <div className="glass-card rounded-3xl p-8 text-center text-slate-500 text-xs">
            No visitors found for this category.
          </div>
        ) : (
          displayVisitors.map((v) => (
            <div
              key={v.id}
              className="glass-card rounded-3xl p-5 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-white text-base">{v.visitorName}</span>
                  <span className="text-xs text-slate-400">({v.relationship})</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      v.status === 'CHECKED_IN'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold animate-pulse'
                        : v.status === 'APPROVED'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {v.status}
                  </span>
                </div>

                <div className="text-xs text-slate-300 space-y-0.5">
                  <div>
                    Destination:{' '}
                    <strong className="text-emerald-400 font-mono text-sm">Flat {v.flat?.flatNumber}</strong> • Host:{' '}
                    {v.tenant?.fullName}
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    Purpose: {v.purpose} • Phone: {v.visitorPhone}
                  </div>
                  {v.vehicleNumber && (
                    <div className="font-mono text-cyan-400 text-[11px]">Vehicle: {v.vehicleNumber}</div>
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
                    className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all"
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
