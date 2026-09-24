'use client';

import React, { useEffect, useState } from 'react';
import {
  QrCode,
  Plus,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  Download,
  Share2,
  Camera,
  FileText,
  Search,
  User,
  Car,
  Calendar,
  X,
  Sparkles,
  Phone,
  Trash2,
} from 'lucide-react';
import { formatDateTime, formatDate } from '@/lib/utils';
import { QrPassCard } from '@/components/shared/QrPassCard';
import { FileUploadZone } from '@/components/shared/FileUploadZone';

export default function TenantVisitorsPage() {
  const [visitors, setVisitors] = useState<any[]>([]);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedPass, setSelectedPass] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'PENDING' | 'CHECKED_IN' | 'COMPLETED'>('ALL');
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    visitorName: '',
    visitorPhone: '',
    relationship: 'Family',
    purpose: '',
    vehicleNumber: '',
    durationHours: 4,
    expectedArrival: '',
    isOvernight: false,
    visitorPhotoUrl: '',
    documentUrl: '',
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
    setSubmitting(true);
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
          visitorPhotoUrl: '',
          documentUrl: '',
          documentType: 'AADHAAR',
        });
        await fetchVisitors();
        if (data.visitorRequest) {
          const req = data.visitorRequest;
          req.pass = data.pass;
          setSelectedPass(req);
        }
      } else {
        setErrorMsg(data.error?.message || 'Failed to create visitor request');
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'Request failed');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredVisitors = visitors.filter((v) => {
    const matchesSearch =
      v.visitorName?.toLowerCase().includes(search.toLowerCase()) ||
      v.visitorPhone?.includes(search) ||
      v.vehicleNumber?.toLowerCase().includes(search.toLowerCase()) ||
      v.purpose?.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === 'ACTIVE') return v.status === 'APPROVED';
    if (statusFilter === 'PENDING') return v.status === 'PENDING';
    if (statusFilter === 'CHECKED_IN') return v.status === 'CHECKED_IN';
    if (statusFilter === 'COMPLETED') return v.status === 'CHECKED_OUT';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-1 z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold mb-1 shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Secure QR Gate Clearance
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Visitor Gate Passes & Requests
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
            Create instant, cryptographically verified QR gate passes for family, guests, delivery couriers, and home services.
          </p>
        </div>

        <button
          onClick={() => setShowRequestModal(true)}
          className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all transform active:scale-95 whitespace-nowrap z-10"
        >
          <Plus className="w-4 h-4" /> Request New Visitor Pass
        </button>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex gap-1.5 p-1 bg-white rounded-2xl border border-slate-200 shadow-sm w-full sm:w-auto overflow-x-auto">
          {[
            { id: 'ALL', label: `All (${visitors.length})` },
            { id: 'ACTIVE', label: `Approved (${visitors.filter((v) => v.status === 'APPROVED').length})` },
            { id: 'CHECKED_IN', label: `Inside (${visitors.filter((v) => v.status === 'CHECKED_IN').length})` },
            { id: 'PENDING', label: `Pending (${visitors.filter((v) => v.status === 'PENDING').length})` },
            { id: 'COMPLETED', label: `Checked Out (${visitors.filter((v) => v.status === 'CHECKED_OUT').length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                statusFilter === tab.id
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            placeholder="Search visitor name, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 shadow-sm"
          />
        </div>
      </div>

      {/* Passes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVisitors.length === 0 ? (
          <div className="col-span-full bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
            <div className="w-14 h-14 rounded-3xl bg-slate-100 border border-slate-200 text-slate-400 flex items-center justify-center mx-auto">
              <QrCode className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">No Visitor Passes Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You haven't requested any visitor passes yet or no records match your filter.
            </p>
            <button
              onClick={() => setShowRequestModal(true)}
              className="mt-2 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 font-bold rounded-xl text-xs inline-flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" /> Request First Visitor Pass
            </button>
          </div>
        ) : (
          filteredVisitors.map((v) => (
            <div
              key={v.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 space-y-4 flex flex-col justify-between hover:border-emerald-400/80 transition-all shadow-md hover:shadow-lg group"
            >
              <div>
                <div className="flex items-start justify-between pb-3 border-b border-slate-100 mb-3.5">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider block mb-0.5">
                      Pass Status
                    </span>
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 ${
                        v.status === 'APPROVED'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : v.status === 'CHECKED_IN'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300 animate-pulse font-black'
                          : v.status === 'PENDING'
                          ? 'bg-cyan-100 text-cyan-800 border border-cyan-300'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {v.status === 'APPROVED' ? 'Approved' : v.status === 'CHECKED_IN' ? 'Inside Campus' : v.status}
                    </span>
                  </div>

                  {v.pass?.passCode && (
                    <span className="font-mono text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      {v.pass.passCode}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3.5 mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 text-emerald-700 font-extrabold text-base shadow-sm">
                    {v.visitorPhotoUrl ? (
                      <img src={v.visitorPhotoUrl} alt={v.visitorName} className="w-full h-full object-cover" />
                    ) : (
                      v.visitorName.charAt(0)
                    )}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base tracking-tight">{v.visitorName}</h3>
                    <p className="text-xs text-slate-500">{v.relationship} • {v.visitorPhone}</p>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-700 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Purpose:</span>
                    <span className="font-semibold text-slate-900">{v.purpose}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Expected:</span>
                    <span className="font-medium text-slate-800">{formatDateTime(v.expectedArrival)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Duration:</span>
                    <span className="font-bold text-emerald-700">{v.durationHours} Hours</span>
                  </div>
                  {v.vehicleNumber && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Vehicle:</span>
                      <span className="font-mono font-bold text-cyan-800">{v.vehicleNumber}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                {v.pass ? (
                  <button
                    onClick={() => setSelectedPass(v)}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-black py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all"
                  >
                    <QrCode className="w-4 h-4" /> View Digital QR Pass
                  </button>
                ) : (
                  <div className="text-xs text-cyan-700 font-bold italic py-2 text-center w-full">
                    Awaiting Management Approval
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Request Visitor Pass Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-150 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl my-8 relative">
            <button
              onClick={() => setShowRequestModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-900 rounded-xl hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center border border-emerald-200">
                <QrCode className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-black text-slate-900">Generate Visitor Gate Pass</h3>
            </div>
            <p className="text-xs text-slate-500 mb-5">
              Enter guest details to generate an official digital QR gate clearance pass.
            </p>

            {errorMsg && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3.5 rounded-2xl text-xs flex items-center gap-2 mb-4">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleCreateRequest} className="space-y-4">
              <FileUploadZone
                label="Visitor Photo (Optional)"
                category="VISITORS"
                mode="avatar"
                value={formData.visitorPhotoUrl}
                helperText="Upload guest photo or selfie for instant gate recognition"
                onUploadSuccess={(fileData) => setFormData((prev) => ({ ...prev, visitorPhotoUrl: fileData.url }))}
                onRemove={() => setFormData((prev) => ({ ...prev, visitorPhotoUrl: '' }))}
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Visitor Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={formData.visitorName}
                    onChange={(e) => setFormData({ ...formData, visitorName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.visitorPhone}
                    onChange={(e) => setFormData({ ...formData, visitorPhone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Relationship *</label>
                  <select
                    value={formData.relationship}
                    onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                  >
                    <option value="Family">Family / Relative</option>
                    <option value="Friend">Friend</option>
                    <option value="Delivery">Delivery / Courier</option>
                    <option value="Home Service">Home Service / Technician</option>
                    <option value="Official Guest">Official Guest</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Duration (Hours) *</label>
                  <input
                    type="number"
                    min="1"
                    max="24"
                    required
                    value={formData.durationHours}
                    onChange={(e) => setFormData({ ...formData, durationHours: parseInt(e.target.value) || 4 })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Purpose of Visit *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Family dinner, courier drop-off, repair work..."
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Vehicle Plate Number (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. BR-07-AB-1234"
                  value={formData.vehicleNumber}
                  onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value.toUpperCase() })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white font-mono"
                />
              </div>

              <div className="flex gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl text-xs font-bold border border-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl text-xs font-black shadow-lg shadow-emerald-600/20"
                >
                  {submitting ? 'Generating...' : 'Issue Digital Pass'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Pass Preview Card Modal */}
      {selectedPass && selectedPass.pass && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-150 overflow-y-auto">
          <div className="relative my-8">
            <button
              onClick={() => setSelectedPass(null)}
              className="absolute -top-3 -right-3 z-20 p-2 bg-white text-slate-700 rounded-full hover:bg-slate-100 shadow-xl border border-slate-200"
            >
              <X className="w-4 h-4" />
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
              visitorPhotoUrl={selectedPass.visitorPhotoUrl}
            />
          </div>
        </div>
      )}
    </div>
  );
}
