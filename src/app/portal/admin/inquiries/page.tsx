'use client';

import React, { useState, useEffect } from 'react';
import {
  Phone,
  Calendar,
  User,
  Home,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Trash2,
  Edit3,
  MessageSquare,
  Sparkles,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      let url = '/api/inquiries?';
      if (statusFilter !== 'ALL') url += `status=${statusFilter}&`;
      if (searchQuery) url += `q=${encodeURIComponent(searchQuery)}&`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setInquiries(data.inquiries || []);
      }
    } catch (e) {
      console.error('Failed to fetch inquiries:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, [statusFilter]);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchInquiries();
      }
    } catch (e) {
      console.error('Failed to update status:', e);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSaveNotes = async (id: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: noteText }),
      });
      if (res.ok) {
        setSelectedInquiry(null);
        fetchInquiries();
      }
    } catch (e) {
      console.error('Failed to save notes:', e);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this walkthrough inquiry record?')) return;
    try {
      const res = await fetch(`/api/inquiries/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchInquiries();
      }
    } catch (e) {
      console.error('Failed to delete inquiry:', e);
    }
  };

  const statusBadges: Record<string, { label: string; bg: string; text: string; border: string }> = {
    NEW: { label: 'New Lead', bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
    CONTACTED: { label: 'Contacted', bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200' },
    SCHEDULED: { label: 'Walkthrough Booked', bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-200' },
    CONVERTED: { label: 'Lease Converted', bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200' },
    CLOSED: { label: 'Closed / Not Interested', bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200' },
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
              Walkthrough Leads & Inquiries
            </h1>
            <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold px-2.5 py-0.5 rounded-full">
              {inquiries.length} Total Records
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Track prospective resident inquiries, schedule on-site flat walkthroughs, and record follow-up notes.
          </p>
        </div>

        <button
          onClick={fetchInquiries}
          className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1.5 border border-slate-300 shadow-sm transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh Records
        </button>
      </div>

      {/* Filters & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {['ALL', 'NEW', 'CONTACTED', 'SCHEDULED', 'CONVERTED', 'CLOSED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st === 'ALL' ? 'All Inquiries' : statusBadges[st]?.label || st}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchInquiries();
          }}
          className="flex items-center gap-2 w-full md:w-72"
        >
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search name, phone, flat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
            />
          </div>
        </form>
      </div>

      {/* Inquiries Table / Cards */}
      {loading ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-2">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-bold text-slate-600">Loading inquiries from database...</p>
        </div>
      ) : inquiries.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <User className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">No Inquiries Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            When prospective tenants submit the walkthrough schedule form on the public website, their records will appear here immediately.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {inquiries.map((inq) => {
            const badge = statusBadges[inq.status] || statusBadges.NEW;
            return (
              <div
                key={inq.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-slate-900 text-base flex items-center gap-1.5">
                        <User className="w-4 h-4 text-emerald-600" />
                        <span>{inq.fullName}</span>
                      </h3>
                      <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{formatDate(inq.createdAt)}</span>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border ${badge.bg} ${badge.text} ${badge.border}`}
                    >
                      {badge.label}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-semibold">Phone:</span>
                      <a
                        href={`tel:${inq.phone}`}
                        className="font-bold text-emerald-700 hover:underline flex items-center gap-1"
                      >
                        <Phone className="w-3.5 h-3.5" /> {inq.phone}
                      </a>
                    </div>
                    {inq.flatNumber && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-semibold">Flat Requested:</span>
                        <span className="font-bold text-slate-800">Flat {inq.flatNumber}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-semibold">Suite Category:</span>
                      <span className="font-medium text-slate-700">{inq.suiteName}</span>
                    </div>
                  </div>

                  {inq.notes && (
                    <div className="p-2.5 bg-amber-50/70 border border-amber-100 rounded-xl text-xs text-amber-900">
                      <span className="font-bold text-[10px] uppercase tracking-wider text-amber-700 block mb-0.5">
                        Estate Manager Notes:
                      </span>
                      {inq.notes}
                    </div>
                  )}
                </div>

                {/* Status Action Controls */}
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <div className="flex items-center gap-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Status:</label>
                    <select
                      value={inq.status}
                      disabled={updatingId === inq.id}
                      onChange={(e) => handleUpdateStatus(inq.id, e.target.value)}
                      className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 font-bold text-slate-800 focus:outline-none focus:border-emerald-600"
                    >
                      <option value="NEW">New Lead</option>
                      <option value="CONTACTED">Contacted</option>
                      <option value="SCHEDULED">Walkthrough Booked</option>
                      <option value="CONVERTED">Lease Converted</option>
                      <option value="CLOSED">Closed / Disqualified</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <button
                      onClick={() => {
                        setSelectedInquiry(inq);
                        setNoteText(inq.notes || '');
                      }}
                      className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 font-semibold hover:underline"
                    >
                      <Edit3 className="w-3 h-3" /> Add Notes
                    </button>

                    <button
                      onClick={() => handleDelete(inq.id)}
                      className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1 font-semibold"
                    >
                      <Trash2 className="w-3 h-3" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Notes Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <h3 className="font-bold text-slate-900 text-base">
              Add Follow-up Notes for {selectedInquiry.fullName}
            </h3>
            <p className="text-xs text-slate-500">
              Record walkthrough date & time, rent negotiation notes, or applicant preferences.
            </p>

            <textarea
              rows={4}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="e.g. Scheduled physical walkthrough on Saturday 4 PM. Interested in 2nd floor flat 201."
              className="w-full bg-slate-50 border border-slate-300 rounded-2xl p-3 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
            />

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSelectedInquiry(null)}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs border border-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSaveNotes(selectedInquiry.id)}
                className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-600/20"
              >
                Save Notes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
