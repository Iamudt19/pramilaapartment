'use client';

import React, { useEffect, useState } from 'react';
import { Wrench, Plus, CheckCircle2, Clock, AlertCircle, Upload, Image as ImageIcon } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { FileUploadZone } from '@/components/shared/FileUploadZone';

export default function TenantMaintenancePage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTicket, setNewTicket] = useState({
    title: '',
    category: 'PLUMBING',
    priority: 'MEDIUM',
    description: '',
    photosUrl: '',
  });

  const fetchTickets = async () => {
    try {
      const res = await fetch('/api/maintenance');
      if (res.ok) setRequests((await res.json()).requests || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTicket),
      });
      if (res.ok) {
        setShowAddModal(false);
        setNewTicket({
          title: '',
          category: 'PLUMBING',
          priority: 'MEDIUM',
          description: '',
          photosUrl: '',
        });
        fetchTickets();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Maintenance & Repair Requests</h1>
          <p className="text-xs text-slate-400 mt-1">Log issues in your flat, attach photos, and track technician progress</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all"
        >
          <Plus className="w-4 h-4" /> Raise Maintenance Ticket
        </button>
      </div>

      {/* Tickets List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {requests.map((ticket) => (
          <div key={ticket.id} className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between pb-3 border-b border-slate-800 mb-3">
                <span className="font-mono font-bold text-xs text-emerald-400">{ticket.ticketNumber}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    ticket.status === 'RESOLVED' || ticket.status === 'CLOSED'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : ticket.status === 'IN_PROGRESS'
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {ticket.status}
                </span>
              </div>

              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] bg-slate-950 px-2 py-0.5 rounded text-slate-400 font-bold uppercase">
                  {ticket.category}
                </span>
                <span className="text-[10px] text-amber-400 font-semibold">Priority: {ticket.priority}</span>
              </div>

              <h3 className="font-bold text-white text-base mt-1">{ticket.title}</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">{ticket.description}</p>

              {ticket.photosUrl && (
                <div className="mt-3">
                  <span className="text-[10px] text-slate-400 font-semibold block mb-1">Attached Photo / Evidence:</span>
                  <div className="w-24 h-24 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
                    <img src={ticket.photosUrl} alt="Maintenance Issue" className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform" />
                  </div>
                </div>
              )}

              {ticket.resolutionNotes && (
                <div className="mt-3 bg-emerald-950/30 border border-emerald-500/20 p-3 rounded-2xl text-xs text-emerald-300">
                  <strong>Technician Update:</strong> {ticket.resolutionNotes}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span>Logged: {formatDate(ticket.createdAt)}</span>
              {ticket.resolvedAt && <span className="text-emerald-400 font-semibold">Resolved on {formatDate(ticket.resolvedAt)}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Raise Ticket Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-150 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 shadow-2xl my-8">
            <h3 className="text-lg font-bold text-white mb-4">Raise Maintenance Complaint</h3>
            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Issue Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Geyser not heating water in master bathroom"
                  value={newTicket.title}
                  onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Category *</label>
                  <select
                    value={newTicket.category}
                    onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="PLUMBING">Plumbing & Water</option>
                    <option value="ELECTRICAL">Electrical & Wiring</option>
                    <option value="CARPENTRY">Carpentry & Doors</option>
                    <option value="CLEANING">Cleaning & Waste</option>
                    <option value="APPLIANCE">Appliance Repair</option>
                    <option value="CIVIL">Civil & Tiles</option>
                    <option value="OTHER">Other Issue</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Priority Level *</label>
                  <select
                    value={newTicket.priority}
                    onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="EMERGENCY">Emergency (Immediate)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Detailed Description *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe the exact problem to help technician prepare..."
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Upload Breakdown Photo */}
              <div>
                <FileUploadZone
                  label="Upload Photo of Issue / Damage (Optional)"
                  category="DOCUMENTS"
                  mode="compact"
                  value={newTicket.photosUrl}
                  helperText="Upload a photo showing the damaged pipe, circuit, or fixture"
                  onUploadSuccess={(fileData) => setNewTicket((prev) => ({ ...prev, photosUrl: fileData.url }))}
                  onRemove={() => setNewTicket((prev) => ({ ...prev, photosUrl: '' }))}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2.5 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

