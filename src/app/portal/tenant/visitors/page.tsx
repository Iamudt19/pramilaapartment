'use client';

import React, { useEffect, useState } from 'react';
import { QrCode, Plus, CheckCircle2, AlertCircle, Clock, ShieldCheck, Download, Share2 } from 'lucide-react';
import { formatDateTime, formatDate } from '@/lib/utils';
import { QrPassCard } from '@/components/shared/QrPassCard';

export default function TenantVisitorsPage() {
  const [visitors, setVisitors] = useState<any[]>([]);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedPass, setSelectedPass] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    visitorName: '',
    visitorPhone: '',
    relationship: 'Family',
    purpose: '',
    vehicleNumber: '',
    durationHours: 4,
    expectedArrival: '',
    isOvernight: false,
    documentUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
    documentType: 'AADHAAR',
  });

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

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    try {
      const res = await fetch('/api/visitors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setShowRequestModal(false);
        setFormData({
          visitorName: '',
          visitorPhone: '',
          relationship: 'Family',
          purpose: '',
          vehicleNumber: '',
          durationHours: 4,
          expectedArrival: '',
          isOvernight: false,
          documentUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
          documentType: 'AADHAAR',
        });
        fetchVisitors();
      } else {
        setErrorMsg(data.error?.message || 'Failed to create visitor request');
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'Request failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Visitor Gate Passes & Requests</h1>
          <p className="text-xs text-slate-400 mt-1">Generate digital QR visitor passes for guests, deliveries, and family members</p>
        </div>
        <button
          onClick={() => setShowRequestModal(true)}
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all"
        >
          <Plus className="w-4 h-4" /> Request New Visitor Pass
        </button>
      </div>

      {/* Passes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visitors.map((v) => (
          <div key={v.id} className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between pb-3 border-b border-slate-800 mb-3">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Pass Status</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full block mt-0.5 ${
                      v.status === 'APPROVED'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : v.status === 'CHECKED_IN'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {v.status}
                  </span>
                </div>
                {v.pass?.passCode && (
                  <span className="font-mono text-xs font-bold text-emerald-400 bg-slate-950 px-2 py-1 rounded border border-emerald-500/20">
                    {v.pass.passCode}
                  </span>
                )}
              </div>

              <h3 className="font-bold text-white text-base">{v.visitorName}</h3>
              <p className="text-xs text-slate-400">{v.relationship} • {v.visitorPhone}</p>
              <p className="text-xs text-slate-300 mt-2">Purpose: <strong>{v.purpose}</strong></p>

              <div className="mt-3 bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80 text-xs text-slate-400 space-y-1">
                <div>Expected: <strong>{formatDateTime(v.expectedArrival)}</strong></div>
                <div>Duration: <strong>{v.durationHours} Hours</strong></div>
                {v.vehicleNumber && <div>Vehicle: <strong>{v.vehicleNumber}</strong></div>}
              </div>
            </div>

            {v.pass && (
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => setSelectedPass(v)}
                  className="w-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  <QrCode className="w-3.5 h-3.5" /> View Digital QR Pass
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Request Visitor Pass Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-1">Request Visitor Gate Pass</h3>
            <p className="text-xs text-slate-400 mb-4">Provide guest details in compliance with society visitor policy.</p>

            {errorMsg && (
              <div className="bg-rose-950/40 border border-rose-500/40 text-rose-300 p-3 rounded-xl text-xs flex items-center gap-2 mb-4">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleCreateRequest} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Visitor Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Deepak Saxena"
                    value={formData.visitorName}
                    onChange={(e) => setFormData({ ...formData, visitorName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 00000"
                    value={formData.visitorPhone}
                    onChange={(e) => setFormData({ ...formData, visitorPhone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Relationship *</label>
                  <select
                    value={formData.relationship}
                    onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Family">Family / Relative</option>
                    <option value="Friend">Friend</option>
                    <option value="Delivery">Delivery / Courier</option>
                    <option value="Service">Home Service / Repair</option>
                    <option value="Official">Official Guest</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Duration (Hours) *</label>
                  <input
                    type="number"
                    min="1"
                    max="24"
                    required
                    value={formData.durationHours}
                    onChange={(e) => setFormData({ ...formData, durationHours: parseInt(e.target.value) || 4 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Purpose of Visit *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Social family visit & dinner"
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Vehicle Registration Number (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. UP 70 AB 1234"
                  value={formData.vehicleNumber}
                  onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2.5 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20"
                >
                  Generate Pass
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Pass Modal Card */}
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
              flatNumber={selectedPass.flat?.flatNumber || 'A-101'}
              tenantName={selectedPass.tenant?.fullName || 'Resident'}
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
