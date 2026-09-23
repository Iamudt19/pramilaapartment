'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

export default function ReportIncidentPage() {
  const [flats, setFlats] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    flatId: '',
    incidentType: 'UNAUTHORIZED_ENTRY',
    severity: 'MEDIUM',
    visitorName: '',
    vehicleNumber: '',
    description: '',
    evidencePhotoUrl: 'https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?auto=format&fit=crop&w=600&q=80',
  });
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/flats')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setFlats(data.flats || []);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch('/api/security/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setIsSuccess(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <Link
        href="/portal/security"
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Gate Operations
      </Link>

      <div className="glass-card rounded-3xl p-6 lg:p-8 border border-slate-700 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-rose-600/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white">Report Gate Incident / Violation</h1>
            <p className="text-xs text-slate-400">Log unauthorized entry attempt, tailgating, or security threat</p>
          </div>
        </div>

        {isSuccess ? (
          <div className="bg-emerald-950/40 border border-emerald-500/40 p-6 rounded-2xl text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="text-base font-bold text-white">Incident Reported to Estate Management</h3>
            <p className="text-xs text-slate-300">
              The incident has been logged. Property managers will review evidence and assess configured society penalty.
            </p>
            <div className="pt-2">
              <Link
                href="/portal/security"
                className="inline-flex items-center gap-2 bg-emerald-500 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs hover:bg-emerald-400"
              >
                Return to Gate Dashboard
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Incident Type *</label>
                <select
                  value={formData.incidentType}
                  onChange={(e) => setFormData({ ...formData, incidentType: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                >
                  <option value="UNAUTHORIZED_ENTRY">Unauthorized Entry Attempt</option>
                  <option value="NOISE_COMPLAINT">Quiet Hours Disturbance</option>
                  <option value="PARKING_VIOLATION">Illegal / Blocking Parking</option>
                  <option value="SECURITY_THREAT">Security Threat / Altercation</option>
                  <option value="PROPERTY_DAMAGE">Property Damage</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Severity Level *</label>
                <select
                  value={formData.severity}
                  onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Associated Flat / Unit</label>
              <select
                value={formData.flatId}
                onChange={(e) => setFormData({ ...formData, flatId: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
              >
                <option value="">Common Area / Outside Gate</option>
                {flats.map((f) => (
                  <option key={f.id} value={f.id}>
                    Flat {f.flatNumber} ({f.building?.name})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Visitor / Offender Name</label>
                <input
                  type="text"
                  placeholder="e.g. Unknown Individual"
                  value={formData.visitorName}
                  onChange={(e) => setFormData({ ...formData, visitorName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Vehicle Registration No</label>
                <input
                  type="text"
                  placeholder="e.g. UP 70 XX 9999"
                  value={formData.vehicleNumber}
                  onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Incident Description & Evidence *</label>
              <textarea
                rows={3}
                required
                placeholder="Describe exact details of the incident..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-rose-600 hover:bg-rose-500 text-white font-extrabold py-3 rounded-xl text-xs shadow-lg shadow-rose-600/20 flex items-center justify-center gap-2 transition-all"
            >
              {loading ? 'Submitting Report...' : 'Log Security Incident Report'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
