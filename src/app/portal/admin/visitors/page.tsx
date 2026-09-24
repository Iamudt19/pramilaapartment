'use client';

import React, { useEffect, useState } from 'react';
import { QrCode, CheckCircle2, XCircle, Search, Clock, ArrowRight, User, Home, Download, Sparkles } from 'lucide-react';
import { formatDateTime, formatDate } from '@/lib/utils';
import { QrPassCard } from '@/components/shared/QrPassCard';
import { AiVisitorSecurityWidget } from '@/components/ai/AiVisitorSecurityWidget';

export default function AdminVisitorsPage() {
  const [visitors, setVisitors] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedPass, setSelectedPass] = useState<any>(null);

  const [actionLoading, setActionLoading] = useState<Record<string, 'approving' | 'rejecting'>>({});
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchVisitors = async () => {
    try {
      const res = await fetch(`/api/visitors?search=${search}&status=${statusFilter}`);
      if (res.ok) {
        const data = await res.json();
        setVisitors(data.visitors || []);
      }
    } catch (e: any) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, [search, statusFilter]);

  const handleApprove = async (id: string) => {
    try {
      setActionLoading((prev) => ({ ...prev, [id]: 'approving' }));
      setFeedback(null);
      const res = await fetch(`/api/visitors/${id}/approve`, { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.success) {
        setFeedback({ type: 'success', message: `Visitor pass approved! Pass code generated and sent to resident.` });
        await fetchVisitors();
      } else {
        setFeedback({ type: 'error', message: data.error?.message || 'Failed to approve visitor pass' });
      }
    } catch (e: any) {
      console.error(e);
      setFeedback({ type: 'error', message: e.message || 'Error approving pass' });
    } finally {
      setActionLoading((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  };

  const handleReject = async (id: string) => {
    const reason = prompt('Reason for declining visitor pass:', 'Declined by Estate Manager / Security Protocol');
    if (reason === null) return; // User cancelled prompt

    try {
      setActionLoading((prev) => ({ ...prev, [id]: 'rejecting' }));
      setFeedback(null);
      const res = await fetch(`/api/visitors/${id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rejectionReason: reason || 'Declined by Estate Manager' }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setFeedback({ type: 'success', message: 'Visitor pass declined.' });
        await fetchVisitors();
      } else {
        setFeedback({ type: 'error', message: data.error?.message || 'Failed to decline visitor pass' });
      }
    } catch (e: any) {
      console.error(e);
      setFeedback({ type: 'error', message: e.message || 'Error declining pass' });
    } finally {
      setActionLoading((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold mb-2 shadow-sm">
            <QrCode className="w-3.5 h-3.5 text-blue-600" /> Gate Clearance & Pass Registry
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Visitor Management & Passes</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">Review requests, generate cryptographic QR passes, and audit gate entries</p>
        </div>
      </div>

      {/* AI Gate Security & Anomaly Inspector */}
      <AiVisitorSecurityWidget />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search visitor name, phone, flat..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 shadow-sm"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-blue-600 shadow-sm"
        >
          <option value="">All Pass Statuses</option>
          <option value="PENDING">Pending Review</option>
          <option value="APPROVED">Approved (Pass Active)</option>
          <option value="CHECKED_IN">Currently Inside</option>
          <option value="CHECKED_OUT">Checked Out</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-2xl text-xs font-semibold flex items-center justify-between border ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-slate-400 hover:text-slate-700 text-xs">
            ✕
          </button>
        </div>
      )}

      {/* Visitors List */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-200 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 font-extrabold">Visitor</th>
                <th className="py-3.5 px-4 font-extrabold">Destination</th>
                <th className="py-3.5 px-4 font-extrabold">Purpose & Relationship</th>
                <th className="py-3.5 px-4 font-extrabold">Expected Window</th>
                <th className="py-3.5 px-4 font-extrabold">Pass Code</th>
                <th className="py-3.5 px-4 font-extrabold">Status</th>
                <th className="py-3.5 px-4 text-right font-extrabold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visitors.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 font-semibold">
                    No visitor requests found.
                  </td>
                </tr>
              ) : (
                visitors.map((v) => (
                  <tr key={v.id} className="hover:bg-blue-50/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{v.visitorName}</div>
                      <div className="text-[11px] text-slate-500">{v.visitorPhone}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 text-xs">
                        Flat {v.flat?.flatNumber}
                      </span>
                      <span className="text-[11px] text-slate-600 block mt-0.5 font-medium">Host: {v.tenant?.fullName}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">
                      <span className="font-semibold text-slate-900">{v.purpose}</span>
                      <span className="text-[11px] text-slate-500 block">{v.relationship}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 text-[11px]">
                      <div className="font-medium text-slate-900">{formatDateTime(v.expectedArrival)}</div>
                      <div className="text-[10px] text-slate-500">Duration: {v.durationHours} hrs</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold">
                      {v.pass?.passCode ? (
                        <button
                          onClick={() => setSelectedPass(v)}
                          className="text-blue-800 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-lg border border-blue-200 flex items-center gap-1 transition-all"
                        >
                          <QrCode className="w-3.5 h-3.5 text-blue-700" /> {v.pass.passCode}
                        </button>
                      ) : (
                        <span className="text-slate-400 italic">— Pending —</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full inline-block ${
                          v.status === 'APPROVED'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : v.status === 'CHECKED_IN'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300 animate-pulse font-black'
                            : v.status === 'PENDING'
                            ? 'bg-blue-100 text-blue-800 border border-blue-300'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {v.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {v.status === 'PENDING' ? (
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => handleApprove(v.id)}
                            disabled={Boolean(actionLoading[v.id])}
                            className="px-3 py-1.5 bg-emerald-600 disabled:opacity-50 text-white font-bold rounded-xl text-xs hover:bg-emerald-500 shadow-md shadow-emerald-600/20 transition-all"
                          >
                            {actionLoading[v.id] === 'approving' ? 'Approving...' : 'Approve Pass'}
                          </button>
                          <button
                            onClick={() => handleReject(v.id)}
                            disabled={Boolean(actionLoading[v.id])}
                            className="px-3 py-1.5 bg-rose-50 disabled:opacity-50 text-rose-700 border border-rose-300 rounded-xl text-xs hover:bg-rose-100 transition-all font-semibold"
                          >
                            {actionLoading[v.id] === 'rejecting' ? 'Declining...' : 'Decline'}
                          </button>
                        </div>
                      ) : v.pass ? (
                        <button
                          onClick={() => setSelectedPass(v)}
                          className="text-xs text-blue-700 font-bold hover:underline"
                        >
                          View Pass Card →
                        </button>
                      ) : (
                        <span className="text-slate-400 text-xs">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
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
