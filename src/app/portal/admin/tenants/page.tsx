'use client';

import React, { useEffect, useState } from 'react';
import { UserCheck, Plus, CheckCircle2, XCircle, Search, Shield, ArrowRight, Eye } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function TenantsPage() {
  const [tenants, setTenants] = useState<any[]>([]);
  const [flats, setFlats] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  // Review Modal state
  const [selectedTenant, setSelectedTenant] = useState<any>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [assignFlatId, setAssignFlatId] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  const [isSubmitting, setIsSubmitting] = useState<'approving' | 'rejecting' | false>(false);
  const [modalFeedback, setModalFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchData = async () => {
    try {
      const [tenRes, flatRes] = await Promise.all([
        fetch(`/api/tenants?search=${search}&status=${statusFilter}`),
        fetch('/api/flats?status=VACANT'),
      ]);
      if (tenRes.ok) setTenants((await tenRes.json()).tenants || []);
      if (flatRes.ok) {
        const fData = (await flatRes.json()).flats || [];
        setFlats(fData);
        if (fData.length > 0 && !assignFlatId) {
          setAssignFlatId(fData[0].id);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search, statusFilter]);

  const handleApprove = async () => {
    if (!selectedTenant) return;
    try {
      setIsSubmitting('approving');
      setModalFeedback(null);
      const res = await fetch(`/api/tenants/${selectedTenant.id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ flatId: assignFlatId }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setShowReviewModal(false);
        await fetchData();
      } else {
        setModalFeedback({ type: 'error', message: data.error?.message || 'Failed to approve tenant application' });
      }
    } catch (e: any) {
      console.error(e);
      setModalFeedback({ type: 'error', message: e.message || 'Error approving application' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!selectedTenant) return;
    try {
      setIsSubmitting('rejecting');
      setModalFeedback(null);
      const res = await fetch(`/api/tenants/${selectedTenant.id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rejectionReason: rejectionReason || 'Application criteria not met' }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setShowReviewModal(false);
        await fetchData();
      } else {
        setModalFeedback({ type: 'error', message: data.error?.message || 'Failed to decline application' });
      }
    } catch (e: any) {
      console.error(e);
      setModalFeedback({ type: 'error', message: e.message || 'Error declining application' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Tenant Applications & Leases</h1>
          <p className="text-xs text-slate-400 mt-1">Review onboarding requests, approve tenancies, and assign flats</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search tenant name, phone, email..."
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
          <option value="">All Applications</option>
          <option value="PENDING">Pending Review</option>
          <option value="ACTIVE">Active Residents</option>
          <option value="APPROVED">Approved (Awaiting Flat)</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {/* Tenants Table */}
      <div className="glass-card rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Applicant / Tenant</th>
              <th className="py-3 px-4">Contact & Email</th>
              <th className="py-3 px-4">Assigned Flat</th>
              <th className="py-3 px-4">ID Proof & Occupation</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Review Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {tenants.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-500">
                  No tenant applications found.
                </td>
              </tr>
            ) : (
              tenants.map((t) => {
                const activeTenancy = t.tenancies?.[0];
                return (
                  <tr key={t.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-white">{t.fullName}</div>
                      <div className="text-[10px] text-slate-500">Joined {formatDate(t.createdAt)}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      <div>{t.phone}</div>
                      <div className="text-[10px] text-slate-500">{t.email}</div>
                    </td>
                    <td className="py-3 px-4">
                      {activeTenancy?.flat ? (
                        <span className="font-mono font-bold text-emerald-400 text-xs">
                          Flat {activeTenancy.flat.flatNumber} ({activeTenancy.flat.building?.name})
                        </span>
                      ) : (
                        <span className="text-amber-400 text-xs font-semibold">Unassigned</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      <div>{t.governmentIdType || 'AADHAAR'}</div>
                      <div className="text-[10px] text-slate-500">{t.occupation || 'Private Service'}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          t.status === 'ACTIVE'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : t.status === 'PENDING'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {t.status === 'PENDING' ? (
                        <button
                          onClick={() => {
                            setSelectedTenant(t);
                            setShowReviewModal(true);
                          }}
                          className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs transition-all shadow-sm"
                        >
                          Review & Assign
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedTenant(t);
                            setShowReviewModal(true);
                          }}
                          className="text-xs text-slate-400 hover:text-white"
                        >
                          View Details →
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Review Modal */}
      {showReviewModal && selectedTenant && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">Tenant Application Review</h3>
            <p className="text-xs text-slate-400 mb-4">
              Review details for <strong>{selectedTenant.fullName}</strong>
            </p>

            <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 text-xs space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-slate-500">Phone:</span>
                <span className="text-slate-200">{selectedTenant.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Email:</span>
                <span className="text-slate-200">{selectedTenant.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Permanent Address:</span>
                <span className="text-slate-200">{selectedTenant.permanentAddress || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Emergency Contact:</span>
                <span className="text-slate-200">
                  {selectedTenant.emergencyContactName} ({selectedTenant.emergencyContactPhone})
                </span>
              </div>
            </div>

            {modalFeedback && (
              <div
                className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 mb-4 border ${
                  modalFeedback.type === 'success'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                }`}
              >
                {modalFeedback.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
                <span>{modalFeedback.message}</span>
              </div>
            )}

            {selectedTenant.status === 'PENDING' && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Select Vacant Flat to Assign *
                  </label>
                  <select
                    value={assignFlatId}
                    onChange={(e) => setAssignFlatId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    {flats.length === 0 ? (
                      <option value="">No vacant flats available</option>
                    ) : (
                      flats.map((f) => (
                        <option key={f.id} value={f.id}>
                          Flat {f.flatNumber} ({f.flatType} • Rent: ₹{f.monthlyRent})
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handleReject}
                    disabled={Boolean(isSubmitting)}
                    className="flex-1 bg-rose-950 hover:bg-rose-900 disabled:opacity-50 text-rose-300 border border-rose-800/80 py-2.5 rounded-xl text-xs font-semibold transition-all"
                  >
                    {isSubmitting === 'rejecting' ? 'Declining...' : 'Decline Application'}
                  </button>
                  <button
                    type="button"
                    onClick={handleApprove}
                    disabled={!assignFlatId || Boolean(isSubmitting)}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 transition-all"
                  >
                    {isSubmitting === 'approving' ? 'Activating...' : 'Approve & Activate Tenancy'}
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={() => setShowReviewModal(false)}
              className="w-full mt-3 bg-slate-800 text-slate-400 py-2 rounded-xl text-xs hover:text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
