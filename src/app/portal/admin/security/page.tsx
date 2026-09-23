'use client';

import React, { useEffect, useState } from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, DollarSign, XCircle, Plus, Filter } from 'lucide-react';
import { formatCurrency, formatDate, formatDateTime } from '@/lib/utils';

export default function SecurityManagementPage() {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [penalties, setPenalties] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'incidents' | 'penalties'>('incidents');
  const [selectedIncident, setSelectedIncident] = useState<any>(null);
  const [penaltyAmount, setPenaltyAmount] = useState(2000);
  const [penaltyReason, setPenaltyReason] = useState('Unauthorized visitor violation past quiet hours');
  const [showApplyModal, setShowApplyModal] = useState(false);

  const fetchData = async () => {
    try {
      const [incRes, penRes] = await Promise.all([
        fetch('/api/security/incidents'),
        fetch('/api/security/penalties'),
      ]);
      if (incRes.ok) setIncidents((await incRes.json()).incidents || []);
      if (penRes.ok) setPenalties((await penRes.json()).penalties || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleConfirmPenalty = async () => {
    if (!selectedIncident) return;
    try {
      const res = await fetch('/api/security/penalties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          incidentId: selectedIncident.id,
          flatId: selectedIncident.flatId,
          tenantId: selectedIncident.tenantId,
          reason: penaltyReason,
          customAmount: penaltyAmount,
        }),
      });
      if (res.ok) {
        setShowApplyModal(false);
        setSelectedIncident(null);
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleWaivePenalty = async (penaltyId: string) => {
    try {
      const res = await fetch(`/api/security/penalties/${penaltyId}/waive`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ waiverReason: 'Waived upon formal tenant review' }),
      });
      if (res.ok) fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Security Incidents & Penalties</h1>
          <p className="text-xs text-slate-400 mt-1">Review gate violations, apply society penalties, and maintain safety records</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('incidents')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'incidents'
              ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          Gate Incidents ({incidents.length})
        </button>
        <button
          onClick={() => setActiveTab('penalties')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'penalties'
              ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          Confirmed Penalties ({penalties.length})
        </button>
      </div>

      {/* Tab: Incidents */}
      {activeTab === 'incidents' && (
        <div className="glass-card rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Incident Type</th>
                <th className="py-3 px-4">Target Flat / Resident</th>
                <th className="py-3 px-4">Reported By</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {incidents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No security incidents recorded.
                  </td>
                </tr>
              ) : (
                incidents.map((inc) => (
                  <tr key={inc.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3 px-4 text-slate-300 font-mono text-[11px]">
                      {formatDateTime(inc.createdAt)}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-rose-300 block">{inc.incidentType.replace('_', ' ')}</span>
                      <span className="text-[10px] text-slate-500 uppercase font-bold">Severity: {inc.severity}</span>
                    </td>
                    <td className="py-3 px-4">
                      {inc.flat ? (
                        <div>
                          <span className="font-mono font-bold text-emerald-400">Flat {inc.flat.flatNumber}</span>
                          <span className="text-[10px] text-slate-400 block">{inc.tenant?.fullName || 'Resident'}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400">Common Area / Gate</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      <span className="font-semibold">{inc.reporterName}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-300 max-w-xs">
                      <p className="line-clamp-2">{inc.description}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          inc.isConfirmedByAdmin
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {inc.isConfirmedByAdmin ? 'Penalty Applied' : 'Pending Review'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {!inc.isConfirmedByAdmin ? (
                        <button
                          onClick={() => {
                            setSelectedIncident(inc);
                            setShowApplyModal(true);
                          }}
                          className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg text-xs transition-all shadow-sm"
                        >
                          Assess Penalty
                        </button>
                      ) : (
                        <span className="text-slate-500 text-xs font-semibold">Confirmed</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab: Penalties */}
      {activeTab === 'penalties' && (
        <div className="glass-card rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Applied Date</th>
                <th className="py-3 px-4">Flat & Tenant</th>
                <th className="py-3 px-4">Violation Reason</th>
                <th className="py-3 px-4">Penalty Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Management Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {penalties.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No active penalties in record.
                  </td>
                </tr>
              ) : (
                penalties.map((pen) => (
                  <tr key={pen.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3 px-4 text-slate-300 font-mono text-[11px]">
                      {formatDate(pen.appliedDate)}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-emerald-400">Flat {pen.flat?.flatNumber}</span>
                      <span className="text-[10px] text-slate-400 block">{pen.tenant?.fullName}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-200 font-medium">
                      {pen.reason}
                    </td>
                    <td className="py-3 px-4 font-black text-rose-400 text-sm">
                      {formatCurrency(pen.amount)}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          pen.status === 'PAID'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : pen.status === 'CONFIRMED'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {pen.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {pen.status === 'CONFIRMED' ? (
                        <button
                          onClick={() => handleWaivePenalty(pen.id)}
                          className="text-xs text-amber-400 hover:text-amber-300 underline font-semibold"
                        >
                          Waive Penalty
                        </button>
                      ) : (
                        <span className="text-slate-500 text-xs">{pen.waiverReason || '—'}</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Apply Penalty Modal */}
      {showApplyModal && selectedIncident && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">Assess Security Penalty</h3>
            <p className="text-xs text-slate-400 mb-4">
              Violating incident: <strong>{selectedIncident.incidentType}</strong> (Flat {selectedIncident.flat?.flatNumber || 'N/A'})
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Violation Reason *</label>
                <input
                  type="text"
                  value={penaltyReason}
                  onChange={(e) => setPenaltyReason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Penalty Amount (₹) *</label>
                <input
                  type="number"
                  value={penaltyAmount}
                  onChange={(e) => setPenaltyAmount(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-bold"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Default configured society penalty: ₹2,000/day</span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2.5 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmPenalty}
                  className="flex-1 bg-rose-600 hover:bg-rose-500 text-white py-2.5 rounded-xl text-xs font-bold shadow-md shadow-rose-600/20"
                >
                  Confirm & Apply Penalty
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
