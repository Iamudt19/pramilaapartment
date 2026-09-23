'use client';

import React, { useEffect, useState } from 'react';
import { QrCode, CheckCircle2, XCircle, Search, Clock, ArrowRight, User, Home, Download } from 'lucide-react';
import { formatDateTime, formatDate } from '@/lib/utils';
import { QrPassCard } from '@/components/shared/QrPassCard';

export default function AdminVisitorsPage() {
  const [visitors, setVisitors] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedPass, setSelectedPass] = useState<any>(null);

  const fetchVisitors = async () => {
    try {
      const res = await fetch(`/api/visitors?search=${search}&status=${statusFilter}`);
      if (res.ok) setVisitors((await res.json()).visitors || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, [search, statusFilter]);

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch(`/api/visitors/${id}/approve`, { method: 'POST' });
      if (res.ok) fetchVisitors();
    } catch (e) {
      console.error(e);
    }
  };

  const handleReject = async (id: string) => {
    try {
      const res = await fetch(`/api/visitors/${id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rejectionReason: 'Declined by Estate Manager' }),
      });
      if (res.ok) fetchVisitors();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Visitor Management & Passes</h1>
          <p className="text-xs text-slate-400 mt-1">Review requests, generate cryptographic QR passes, and audit gate entries</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search visitor name, phone, flat..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
        >
          <option value="">All Pass Statuses</option>
          <option value="PENDING">Pending Review</option>
          <option value="APPROVED">Approved (Pass Active)</option>
          <option value="CHECKED_IN">Currently Inside</option>
          <option value="CHECKED_OUT">Checked Out</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {/* Visitors List */}
      <div className="glass-card rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Visitor</th>
              <th className="py-3 px-4">Destination</th>
              <th className="py-3 px-4">Purpose & Relationship</th>
              <th className="py-3 px-4">Expected Window</th>
              <th className="py-3 px-4">Pass Code</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {visitors.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-500">
                  No visitor requests found.
                </td>
              </tr>
            ) : (
              visitors.map((v) => (
                <tr key={v.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-white">{v.visitorName}</div>
                    <div className="text-[10px] text-slate-400">{v.visitorPhone}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-emerald-400 text-xs">
                      Flat {v.flat?.flatNumber}
                    </span>
                    <span className="text-[10px] text-slate-500 block">Host: {v.tenant?.fullName}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    <span className="font-medium text-white">{v.purpose}</span>
                    <span className="text-[10px] text-slate-400 block">{v.relationship}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-300 text-[11px]">
                    <div>{formatDateTime(v.expectedArrival)}</div>
                    <div className="text-[10px] text-slate-500">Duration: {v.durationHours} hrs</div>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                    {v.pass?.passCode ? (
                      <button
                        onClick={() => setSelectedPass(v)}
                        className="underline hover:text-emerald-300 flex items-center gap-1"
                      >
                        <QrCode className="w-3.5 h-3.5" /> {v.pass.passCode}
                      </button>
                    ) : (
                      <span className="text-slate-500 italic">— Pending —</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        v.status === 'APPROVED'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : v.status === 'CHECKED_IN'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold'
                          : v.status === 'PENDING'
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {v.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {v.status === 'PENDING' ? (
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => handleApprove(v.id)}
                          className="px-2.5 py-1 bg-emerald-500 text-slate-950 font-bold rounded-lg text-[11px] hover:bg-emerald-400 shadow-sm"
                        >
                          Approve Pass
                        </button>
                        <button
                          onClick={() => handleReject(v.id)}
                          className="px-2.5 py-1 bg-rose-950 text-rose-300 border border-rose-800 rounded-lg text-[11px] hover:bg-rose-900"
                        >
                          Decline
                        </button>
                      </div>
                    ) : v.pass ? (
                      <button
                        onClick={() => setSelectedPass(v)}
                        className="text-xs text-emerald-400 hover:underline"
                      >
                        View Pass Card →
                      </button>
                    ) : (
                      <span className="text-slate-500 text-xs">—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* QR Pass Card Preview Modal */}
      {selectedPass && selectedPass.pass && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="relative">
            <button
              onClick={() => setSelectedPass(null)}
              className="absolute -top-3 -right-3 z-10 p-2 bg-slate-800 text-white rounded-full hover:bg-slate-700 shadow-lg border border-slate-600"
            >
              ✕
            </button>
            <QrPassCard
              passCode={selectedPass.pass.passCode}
              visitorName={selectedPass.visitorName}
              relationship={selectedPass.relationship}
              purpose={selectedPass.purpose}
              flatNumber={selectedPass.flat?.flatNumber}
              tenantName={selectedPass.tenant?.fullName}
              validFrom={selectedPass.pass.validFrom}
              validUntil={selectedPass.pass.validUntil}
              vehicleNumber={selectedPass.vehicleNumber}
              status={selectedPass.status}
            />
          </div>
        </div>
      )}
    </div>
  );
}
