'use client';

import React, { useEffect, useState } from 'react';
import {
  UserCheck,
  Plus,
  CheckCircle2,
  XCircle,
  Search,
  Shield,
  ArrowRight,
  Eye,
  FileText,
  FolderLock,
  ExternalLink,
  ShieldAlert,
  User,
  Phone,
  Mail,
  MapPin,
  Building,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { DocumentViewerModal } from '@/components/shared/DocumentViewerModal';

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

  // Document Viewer Modal state
  const [selectedDocForView, setSelectedDocForView] = useState<any | null>(null);
  const [verifyingDocId, setVerifyingDocId] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState<'approving' | 'rejecting' | false>(false);
  const [modalFeedback, setModalFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchData = async () => {
    try {
      const [tenRes, flatRes] = await Promise.all([
        fetch(`/api/tenants?search=${encodeURIComponent(search)}&status=${statusFilter}`),
        fetch('/api/flats?status=VACANT'),
      ]);
      if (tenRes.ok) {
        const data = await tenRes.json();
        setTenants(data.tenants || []);
        // Update selectedTenant if modal is open
        if (selectedTenant) {
          const updated = (data.tenants || []).find((t: any) => t.id === selectedTenant.id);
          if (updated) setSelectedTenant(updated);
        }
      }
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

  const handleVerifyDocument = async (docId: string, status: 'VERIFIED' | 'REJECTED') => {
    try {
      setVerifyingDocId(docId);
      const res = await fetch(`/api/documents/${docId}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        await fetchData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setVerifyingDocId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold mb-2 shadow-sm">
            <UserCheck className="w-3.5 h-3.5 text-blue-600" /> Resident Onboarding & Verification Vault
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Tenant Applications & Leases</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">Review onboarding requests, inspect tenant identity documents, and assign flats</p>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-200">
          <Shield className="w-5 h-5 text-blue-600" />
          <div>
            <span className="text-lg font-black text-slate-900 block leading-tight">{tenants.length}</span>
            <span className="text-[10px] text-slate-500 uppercase font-extrabold tracking-wider">Total Residents</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search tenant name, phone, email, occupation..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 shadow-sm"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800 font-bold focus:outline-none focus:border-blue-600 shadow-sm"
        >
          <option value="">All Applications ({tenants.length})</option>
          <option value="PENDING">Pending Review</option>
          <option value="ACTIVE">Active Residents</option>
          <option value="APPROVED">Approved (Awaiting Flat)</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {/* Tenants Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-200 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 font-extrabold">Resident / Photo</th>
                <th className="py-3.5 px-4 font-extrabold">Contact & Email</th>
                <th className="py-3.5 px-4 font-extrabold">Assigned Flat</th>
                <th className="py-3.5 px-4 font-extrabold">Uploaded Documents</th>
                <th className="py-3.5 px-4 font-extrabold">Status</th>
                <th className="py-3.5 px-4 text-right font-extrabold">Review Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500 font-semibold">
                    Loading tenant directory...
                  </td>
                </tr>
              ) : tenants.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500 font-semibold">
                    No tenant applications found matching your filters.
                  </td>
                </tr>
              ) : (
                tenants.map((t) => {
                  const activeTenancy = t.tenancies?.[0];
                  const avatarUrl = t.user?.avatarUrl;
                  const docs = t.documents || [];
                  const verifiedDocs = docs.filter((d: any) => d.status === 'VERIFIED');

                  return (
                    <tr key={t.id} className="hover:bg-blue-50/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-700 flex items-center justify-center font-black text-white text-base shadow-sm overflow-hidden shrink-0 border border-slate-200">
                            {avatarUrl ? (
                              <img src={avatarUrl} alt={t.fullName} className="w-full h-full object-cover" />
                            ) : (
                              t.fullName?.charAt(0) || 'R'
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-sm">{t.fullName}</div>
                            <div className="text-[11px] text-slate-500 font-medium">
                              {t.occupation || 'Resident'} • Joined {formatDate(t.createdAt)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700">
                        <div className="font-semibold text-slate-900">{t.phone}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{t.email}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        {activeTenancy?.flat ? (
                          <span className="font-mono font-bold text-blue-900 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200 text-xs inline-block">
                            Flat {activeTenancy.flat.flatNumber} ({activeTenancy.flat.building?.name})
                          </span>
                        ) : (
                          <span className="text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 text-xs font-bold">Unassigned</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        {docs.length > 0 ? (
                          <button
                            onClick={() => {
                              setSelectedTenant(t);
                              setShowReviewModal(true);
                            }}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 transition text-xs font-semibold"
                          >
                            <FolderLock className="w-3.5 h-3.5 text-blue-600" />
                            <span>
                              {docs.length} Doc{docs.length > 1 ? 's' : ''} ({verifiedDocs.length} Verified)
                            </span>
                          </button>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">No docs uploaded</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full inline-block border ${
                            t.status === 'ACTIVE'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : t.status === 'PENDING'
                              ? 'bg-amber-50 text-amber-800 border-amber-200 animate-pulse font-black'
                              : 'bg-rose-50 text-rose-800 border-rose-200'
                          }`}
                        >
                          {t.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {t.status === 'PENDING' ? (
                          <button
                            onClick={() => {
                              setSelectedTenant(t);
                              setShowReviewModal(true);
                            }}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-emerald-600/20 active:scale-95"
                          >
                            Review & Assign
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedTenant(t);
                              setShowReviewModal(true);
                            }}
                            className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-blue-700 font-bold rounded-xl text-xs transition border border-slate-200 inline-flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" /> View Profile & Docs
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
      </div>

      {/* Review & Details Modal */}
      {showReviewModal && selectedTenant && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 z-50 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-5">
            {/* Modal Header with Profile Picture */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-700 flex items-center justify-center font-black text-white text-2xl shadow-md overflow-hidden shrink-0 border-2 border-slate-200">
                  {selectedTenant.user?.avatarUrl ? (
                    <img
                      src={selectedTenant.user.avatarUrl}
                      alt={selectedTenant.fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    selectedTenant.fullName?.charAt(0) || 'R'
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-black text-slate-900">{selectedTenant.fullName}</h3>
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                        selectedTenant.status === 'ACTIVE'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : selectedTenant.status === 'PENDING'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-rose-50 text-rose-800 border-rose-200'
                      }`}
                    >
                      {selectedTenant.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    {selectedTenant.occupation || 'Resident'} • Applied on {formatDate(selectedTenant.createdAt)}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowReviewModal(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition"
              >
                ✕
              </button>
            </div>

            {/* Tenant Bio & Contact Information */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-slate-700">
                  <Phone className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>
                    <strong>Phone:</strong> {selectedTenant.phone}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>
                    <strong>Email:</strong> {selectedTenant.email}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Shield className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>
                    <strong>Gov ID:</strong> {selectedTenant.governmentIdType || 'AADHAAR'} ({selectedTenant.governmentIdNumber || 'N/A'})
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Building className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>
                    <strong>Company:</strong> {selectedTenant.companyName || 'N/A'}
                  </span>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-200 flex items-start gap-2 text-slate-700">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Permanent Address:</strong> {selectedTenant.permanentAddress || 'Not provided'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <User className="w-4 h-4 text-blue-600 shrink-0" />
                <span>
                  <strong>Emergency Contact:</strong> {selectedTenant.emergencyContactName || 'N/A'} (
                  {selectedTenant.emergencyContactPhone || 'N/A'})
                </span>
              </div>
            </div>

            {/* Uploaded Verification Documents Vault */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <FolderLock className="w-4 h-4 text-blue-600" />
                  <h4 className="text-sm font-black text-slate-900">Uploaded Verification Documents & ID Proofs</h4>
                </div>
                <span className="text-xs font-bold text-slate-500">
                  {selectedTenant.documents?.length || 0} File(s)
                </span>
              </div>

              {!selectedTenant.documents || selectedTenant.documents.length === 0 ? (
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-1">
                  <FileText className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="text-xs font-bold text-slate-700">No verification documents attached yet.</p>
                  <p className="text-[11px] text-slate-500">
                    The resident can upload their Aadhaar card, Rental Agreement, or Police verification from their portal.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {selectedTenant.documents.map((doc: any) => (
                    <div
                      key={doc.id}
                      className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Thumbnail / Icon */}
                        <div
                          onClick={() => setSelectedDocForView(doc)}
                          className="w-12 h-12 rounded-xl bg-white border border-slate-300 flex items-center justify-center shrink-0 overflow-hidden cursor-pointer hover:opacity-90 shadow-sm"
                          title="Click to zoom preview"
                        >
                          {doc.fileUrl?.match(/\.(jpg|jpeg|png|webp|gif)/i) || doc.fileUrl?.includes('unsplash') || doc.fileUrl?.includes('/uploads/') ? (
                            <img src={doc.fileUrl} alt={doc.title} className="w-full h-full object-cover" />
                          ) : (
                            <FileText className="w-6 h-6 text-blue-600" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <button
                            onClick={() => setSelectedDocForView(doc)}
                            className="font-bold text-slate-900 hover:text-blue-600 text-xs text-left truncate block transition"
                          >
                            {doc.title}
                          </button>
                          <div className="text-[11px] text-slate-500 font-medium">
                            <span className="uppercase font-bold text-blue-800">{doc.documentType}</span> • Uploaded{' '}
                            {formatDate(doc.createdAt)}
                          </div>
                          {doc.verifiedBy && (
                            <div className="text-[10px] text-emerald-700 font-medium mt-0.5">
                              ✓ Verified by {doc.verifiedBy}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border ${
                            doc.status === 'VERIFIED'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : doc.status === 'PENDING'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-rose-50 text-rose-800 border-rose-200'
                          }`}
                        >
                          {doc.status}
                        </span>

                        <button
                          type="button"
                          onClick={() => setSelectedDocForView(doc)}
                          className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 font-bold rounded-xl text-xs border border-slate-300 shadow-sm flex items-center gap-1 transition"
                        >
                          <Eye className="w-3.5 h-3.5 text-blue-600" /> Inspect
                        </button>

                        {doc.status === 'PENDING' && (
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              disabled={verifyingDocId === doc.id}
                              onClick={() => handleVerifyDocument(doc.id, 'VERIFIED')}
                              className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-sm transition"
                            >
                              Verify
                            </button>
                            <button
                              type="button"
                              disabled={verifyingDocId === doc.id}
                              onClick={() => handleVerifyDocument(doc.id, 'REJECTED')}
                              className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl text-xs border border-rose-200 transition"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {modalFeedback && (
              <div
                className={`p-3 rounded-2xl text-xs font-bold flex items-center gap-2 border ${
                  modalFeedback.type === 'success'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-rose-50 border-rose-200 text-rose-800'
                }`}
              >
                {modalFeedback.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span>{modalFeedback.message}</span>
              </div>
            )}

            {/* Action Buttons for Pending Tenants */}
            {selectedTenant.status === 'PENDING' && (
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Select Vacant Flat to Assign *
                  </label>
                  <select
                    value={assignFlatId}
                    onChange={(e) => setAssignFlatId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-bold focus:outline-none focus:border-blue-600 focus:bg-white shadow-sm"
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

                <div className="flex gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={handleReject}
                    disabled={Boolean(isSubmitting)}
                    className="flex-1 bg-rose-50 hover:bg-rose-100 disabled:opacity-50 text-rose-700 border border-rose-300 py-3 rounded-xl text-xs font-bold transition-all"
                  >
                    {isSubmitting === 'rejecting' ? 'Declining...' : 'Decline Application'}
                  </button>
                  <button
                    type="button"
                    onClick={handleApprove}
                    disabled={!assignFlatId || Boolean(isSubmitting)}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white py-3 rounded-xl text-xs font-black shadow-lg shadow-emerald-600/20 transition-all active:scale-95"
                  >
                    {isSubmitting === 'approving' ? 'Activating...' : 'Approve & Activate Tenancy'}
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={() => setShowReviewModal(false)}
              className="w-full bg-slate-100 text-slate-700 py-3 rounded-xl text-xs font-bold hover:bg-slate-200 transition-colors"
            >
              Close Window
            </button>
          </div>
        </div>
      )}

      {/* Document Full View Modal */}
      {selectedDocForView && (
        <DocumentViewerModal
          isOpen={Boolean(selectedDocForView)}
          onClose={() => setSelectedDocForView(null)}
          documentTitle={selectedDocForView.title}
          documentType={selectedDocForView.documentType}
          fileUrl={selectedDocForView.fileUrl}
          tenantName={selectedTenant?.fullName}
          status={selectedDocForView.status}
        />
      )}
    </div>
  );
}

