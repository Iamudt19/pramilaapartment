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
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold mb-2 shadow-sm">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" /> Security Operations & Enforcement
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Security Incidents & Penalties</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">Review gate violations, apply society penalties, and maintain safety records</p>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-200">
          <AlertTriangle className="w-5 h-5 text-rose-600" />
          <div>
            <span className="text-lg font-black text-slate-900 block leading-tight">{incidents.length}</span>
            <span className="text-[10px] text-slate-500 uppercase font-extrabold tracking-wider">Total Incidents</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('incidents')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'incidents'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          Gate Incidents ({incidents.length})
        </button>
        <button
          onClick={() => setActiveTab('penalties')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'penalties'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          Confirmed Penalties ({penalties.length})
        </button>
      </div>

      {/* Tab: Incidents */}
      {activeTab === 'incidents' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-200 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4 font-extrabold">Date & Time</th>
                  <th className="py-3.5 px-4 font-extrabold">Incident Type</th>
                  <th className="py-3.5 px-4 font-extrabold">Target Flat / Resident</th>
                  <th className="py-3.5 px-4 font-extrabold">Reported By</th>
                  <th className="py-3.5 px-4 font-extrabold">Description</th>
                  <th className="py-3.5 px-4 font-extrabold">Status</th>
                  <th className="py-3.5 px-4 font-extrabold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {incidents.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500 font-semibold">
                      No security incidents recorded.
                    </td>
                  </tr>
                ) : (
                  incidents.map((inc) => (
                    <tr key={inc.id} className="hover:bg-blue-50/40 transition-colors">
                      <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px] whitespace-nowrap">
                        {formatDateTime(inc.createdAt)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-rose-900 block">{inc.incidentType.replace('_', ' ')}</span>
                        <span className="text-[10px] text-slate-500 uppercase font-extrabold">Severity: {inc.severity}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        {inc.flat ? (
                          <div>
                            <span className="font-mono font-bold text-blue-800">Flat {inc.flat.flatNumber}</span>
                            <span className="text-[11px] text-slate-500 block">{inc.tenant?.fullName || 'Resident'}</span>
                          </div>
                        ) : (
                          <span className="text-slate-500 font-medium">Common Area / Gate</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 font-medium">
                        {inc.reporterName}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 max-w-xs font-medium">
                        <p className="line-clamp-2">{inc.description}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border ${
                            inc.isConfirmedByAdmin
                              ? 'bg-rose-50 text-rose-800 border-rose-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}
                        >
                          {inc.isConfirmedByAdmin ? 'Penalty Applied' : 'Pending Review'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {!inc.isConfirmedByAdmin ? (
                          <button
                            onClick={() => {
                              setSelectedIncident(inc);
                              setShowApplyModal(true);
                            }}
                            className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs transition-all shadow-sm active:scale-95"
                          >
                            Assess Penalty
                          </button>
                        ) : (
                          <span className="text-slate-500 text-xs font-bold">Confirmed</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Penalties */}
      {activeTab === 'penalties' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-200 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4 font-extrabold">Applied Date</th>
                  <th className="py-3.5 px-4 font-extrabold">Flat & Tenant</th>
                  <th className="py-3.5 px-4 font-extrabold">Violation Reason</th>
                  <th className="py-3.5 px-4 font-extrabold">Penalty Amount</th>
                  <th className="py-3.5 px-4 font-extrabold">Status</th>
                  <th className="py-3.5 px-4 font-extrabold text-right">Management Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {penalties.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500 font-semibold">
                      No active penalties in record.
                    </td>
                  </tr>
                ) : (
                  penalties.map((pen) => (
                    <tr key={pen.id} className="hover:bg-blue-50/40 transition-colors">
                      <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px] whitespace-nowrap">
                        {formatDate(pen.appliedDate)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-blue-800">Flat {pen.flat?.flatNumber}</span>
                        <span className="text-[11px] text-slate-500 block">{pen.tenant?.fullName || 'Resident'}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-800 font-medium">
                        {pen.reason}
                      </td>
                      <td className="py-3.5 px-4 font-black text-rose-700 text-sm">
                        {formatCurrency(pen.amount)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border ${
                            pen.status === 'PAID'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : pen.status === 'CONFIRMED'
                              ? 'bg-rose-50 text-rose-800 border-rose-200'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {pen.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {pen.status === 'CONFIRMED' ? (
                          <button
                            onClick={() => handleWaivePenalty(pen.id)}
                            className="text-xs text-amber-700 hover:text-amber-900 underline font-bold"
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
        </div>
      )}

      {/* Apply Penalty Modal */}
      {showApplyModal && selectedIncident && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-4">
            <h3 className="text-xl font-black text-slate-900">Assess Security Penalty</h3>
            <p className="text-xs text-slate-600">
              Violating incident: <strong className="text-slate-900">{selectedIncident.incidentType}</strong> (Flat {selectedIncident.flat?.flatNumber || 'N/A'})
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Violation Reason *</label>
                <input
                  type="text"
                  value={penaltyReason}
                  onChange={(e) => setPenaltyReason(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white shadow-sm"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Penalty Amount (₹) *</label>
                <input
                  type="number"
                  value={penaltyAmount}
                  onChange={(e) => setPenaltyAmount(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-bold focus:outline-none focus:border-blue-600 focus:bg-white shadow-sm"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Default configured society penalty: ₹2,000/day</span>
              </div>

              <div className="flex gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl text-xs font-bold border border-slate-300 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmPenalty}
                  className="flex-1 bg-rose-600 hover:bg-rose-500 text-white py-3 rounded-xl text-xs font-black shadow-md shadow-rose-600/20 transition-all active:scale-95"
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
