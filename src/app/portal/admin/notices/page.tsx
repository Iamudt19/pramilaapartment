'use client';

import React, { useEffect, useState } from 'react';
import { BellRing, AlertTriangle, Plus, Pin, Radio } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function AdminNoticesPage() {
  const [notices, setNotices] = useState<any[]>([]);
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);

  const [newNotice, setNewNotice] = useState({
    title: '',
    content: '',
    category: 'GENERAL',
    targetAudience: 'ALL',
    isPinned: false,
  });

  const [newEmergency, setNewEmergency] = useState({
    title: '',
    message: '',
    alertType: 'SECURITY',
    severity: 'CRITICAL',
  });

  const fetchNotices = async () => {
    try {
      const res = await fetch('/api/notices');
      if (res.ok) setNotices((await res.json()).notices || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleCreateNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/notices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newNotice),
      });
      if (res.ok) {
        setShowNoticeModal(false);
        setNewNotice({ title: '', content: '', category: 'GENERAL', targetAudience: 'ALL', isPinned: false });
        fetchNotices();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleBroadcastEmergency = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/emergency-alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEmergency),
      });
      if (res.ok) {
        setShowEmergencyModal(false);
        setNewEmergency({ title: '', message: '', alertType: 'SECURITY', severity: 'CRITICAL' });
        window.location.reload();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Notice Board & Emergency Broadcast</h1>
          <p className="text-xs text-slate-400 mt-1">Publish circulars, maintenance advisories, and trigger global emergency alerts</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowEmergencyModal(true)}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-rose-600/30 transition-all"
          >
            <Radio className="w-4 h-4 animate-pulse" /> Emergency Broadcast
          </button>
          <button
            onClick={() => setShowNoticeModal(true)}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all"
          >
            <Plus className="w-4 h-4" /> Post New Notice
          </button>
        </div>
      </div>

      {/* Notices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {notices.map((notice) => (
          <div
            key={notice.id}
            className={`glass-card rounded-3xl p-6 border space-y-4 ${
              notice.isPinned ? 'border-emerald-500/40 bg-emerald-950/10' : 'border-slate-800'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-900 border border-slate-700 text-emerald-400 px-2 py-0.5 rounded">
                  {notice.category}
                </span>
                {notice.isPinned && (
                  <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded flex items-center gap-1">
                    <Pin className="w-3 h-3 text-emerald-400" /> Pinned
                  </span>
                )}
              </div>
              <span className="text-[11px] text-slate-400">{formatDate(notice.publishDate)}</span>
            </div>

            <div>
              <h3 className="text-base font-bold text-white mb-2">{notice.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{notice.content}</p>
            </div>

            <div className="border-t border-slate-800/80 pt-3 flex justify-between items-center text-[11px] text-slate-400">
              <span>Audience: <strong>{notice.targetAudience}</strong></span>
              <span>Published by: <strong>{notice.createdBy}</strong></span>
            </div>
          </div>
        ))}
      </div>

      {/* Post Notice Modal */}
      {showNoticeModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Publish Society Notice</h3>
            <form onSubmit={handleCreateNotice} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Notice Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Quarterly General Body Meeting"
                  value={newNotice.title}
                  onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Category *</label>
                  <select
                    value={newNotice.category}
                    onChange={(e) => setNewNotice({ ...newNotice, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="GENERAL">General Notice</option>
                    <option value="SECURITY">Security Advisory</option>
                    <option value="MAINTENANCE">Maintenance Notice</option>
                    <option value="RENT">Rent & Billing Notice</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Target Audience</label>
                  <select
                    value={newNotice.targetAudience}
                    onChange={(e) => setNewNotice({ ...newNotice, targetAudience: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="ALL">All Residents & Staff</option>
                    <option value="TENANTS">Tenants Only</option>
                    <option value="OWNERS">Owners Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Notice Content *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Detailed circular announcement..."
                  value={newNotice.content}
                  onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="pinCheck"
                  checked={newNotice.isPinned}
                  onChange={(e) => setNewNotice({ ...newNotice, isPinned: e.target.checked })}
                  className="rounded bg-slate-950 border-slate-700 text-emerald-500 focus:ring-0"
                />
                <label htmlFor="pinCheck" className="text-xs text-slate-300 font-medium">
                  Pin to top of resident dashboard
                </label>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNoticeModal(false)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2.5 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20"
                >
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Emergency Broadcast Modal */}
      {showEmergencyModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-rose-500/50 rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center gap-2.5 text-rose-400 mb-2">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-lg font-bold text-white">Broadcast Emergency Alert</h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              This will immediately display a high-priority banner to all active portals.
            </p>

            <form onSubmit={handleBroadcastEmergency} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Alert Type *</label>
                <select
                  value={newEmergency.alertType}
                  onChange={(e) => setNewEmergency({ ...newEmergency, alertType: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                >
                  <option value="FIRE">Fire Hazard Emergency</option>
                  <option value="SECURITY">Security Breach / Intruder</option>
                  <option value="MEDICAL">Medical Emergency Protocol</option>
                  <option value="WATER_LEAK">Major Water Pipeline Rupture</option>
                  <option value="POWER_OUTAGE">Transformer / Grid Power Outage</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Headline Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Evacuation Drill / Power Outage Warning"
                  value={newEmergency.title}
                  onChange={(e) => setNewEmergency({ ...newEmergency, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Emergency Message *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Actionable emergency instructions for residents..."
                  value={newEmergency.message}
                  onChange={(e) => setNewEmergency({ ...newEmergency, message: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEmergencyModal(false)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2.5 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-rose-600 hover:bg-rose-500 text-white py-2.5 rounded-xl text-xs font-bold shadow-md shadow-rose-600/30"
                >
                  Broadcast Alert Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
