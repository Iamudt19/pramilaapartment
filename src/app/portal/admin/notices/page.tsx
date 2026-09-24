'use client';

import React, { useEffect, useState } from 'react';
import { BellRing, AlertTriangle, Plus, Pin, Radio, Sparkles } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { AiNoticeDrafterModal } from '@/components/ai/AiNoticeDrafterModal';

export default function AdminNoticesPage() {
  const [notices, setNotices] = useState<any[]>([]);
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [showAiNoticeDrafter, setShowAiNoticeDrafter] = useState(false);

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
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold mb-2 shadow-sm">
            <BellRing className="w-3.5 h-3.5 text-blue-600" /> Society Circulars & Broadcast
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Notice Board & Emergency Broadcast</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">Publish circulars, maintenance advisories, and trigger global emergency alerts</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowAiNoticeDrafter(true)}
            className="px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Sparkles className="w-4 h-4 text-blue-600" /> AI Notice & WhatsApp Drafter
          </button>
          <button
            onClick={() => setShowEmergencyModal(true)}
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-rose-600/30 transition-all"
          >
            <Radio className="w-4 h-4 animate-pulse" /> Emergency Broadcast
          </button>
          <button
            onClick={() => setShowNoticeModal(true)}
            className="px-4 py-2.5 bg-blue-700 hover:bg-blue-600 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-blue-700/20 transition-all"
          >
            <Plus className="w-4 h-4" /> Post New Notice
          </button>
        </div>
      </div>

      <AiNoticeDrafterModal
        isOpen={showAiNoticeDrafter}
        onClose={() => setShowAiNoticeDrafter(false)}
        onApplyNotice={async (gen) => {
          try {
            await fetch('/api/notices', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(gen),
            });
            fetchNotices();
          } catch (e) {
            console.error(e);
          }
        }}
      />

      {/* Notices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {notices.map((notice) => (
          <div
            key={notice.id}
            className={`bg-white rounded-3xl p-6 border space-y-4 shadow-sm hover:shadow-md transition-all ${
              notice.isPinned ? 'border-amber-400 bg-amber-50/20' : 'border-slate-200'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-blue-50 border border-blue-200 text-blue-800 px-2.5 py-1 rounded-lg">
                  {notice.category}
                </span>
                {notice.isPinned && (
                  <span className="text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-lg flex items-center gap-1">
                    <Pin className="w-3 h-3 text-amber-600" /> Pinned
                  </span>
                )}
              </div>
              <span className="text-[11px] text-slate-500 font-medium">{formatDate(notice.publishDate)}</span>
            </div>

            <div>
              <h3 className="text-base font-extrabold text-slate-900 mb-2">{notice.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100">{notice.content}</p>
            </div>

            <div className="border-t border-slate-100 pt-3 flex justify-between items-center text-[11px] text-slate-500">
              <span>Audience: <strong className="text-slate-700">{notice.targetAudience}</strong></span>
              <span>Published by: <strong className="text-slate-700">{notice.createdBy}</strong></span>
            </div>
          </div>
        ))}
      </div>

      {/* Post Notice Modal */}
      {showNoticeModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative">
            <h3 className="text-lg font-black text-slate-900 mb-1">Publish Society Notice</h3>
            <p className="text-xs text-slate-500 mb-4">Broadcast general announcements or policy circulars to resident dashboards</p>
            <form onSubmit={handleCreateNotice} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Notice Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Quarterly General Body Meeting"
                  value={newNotice.title}
                  onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Category *</label>
                  <select
                    value={newNotice.category}
                    onChange={(e) => setNewNotice({ ...newNotice, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                  >
                    <option value="GENERAL">General Notice</option>
                    <option value="SECURITY">Security Advisory</option>
                    <option value="MAINTENANCE">Maintenance Notice</option>
                    <option value="RENT">Rent & Billing Notice</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Target Audience</label>
                  <select
                    value={newNotice.targetAudience}
                    onChange={(e) => setNewNotice({ ...newNotice, targetAudience: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                  >
                    <option value="ALL">All Residents & Staff</option>
                    <option value="TENANTS">Tenants Only</option>
                    <option value="OWNERS">Owners Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Notice Content *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Detailed circular announcement..."
                  value={newNotice.content}
                  onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="pinCheck"
                  checked={newNotice.isPinned}
                  onChange={(e) => setNewNotice({ ...newNotice, isPinned: e.target.checked })}
                  className="rounded bg-white border-slate-300 text-blue-600 focus:ring-0"
                />
                <label htmlFor="pinCheck" className="text-xs text-slate-700 font-medium">
                  Pin to top of resident dashboard
                </label>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNoticeModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-700 hover:bg-blue-600 text-white py-3 rounded-xl text-xs font-black shadow-lg shadow-blue-700/20 transition-all"
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
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white border-2 border-rose-500 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl relative">
            <div className="flex items-center gap-2.5 text-rose-600 mb-2">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-lg font-black text-slate-900">Broadcast Emergency Alert</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              This will immediately display a high-priority banner to all active portals and send urgent alerts.
            </p>

            <form onSubmit={handleBroadcastEmergency} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Alert Type *</label>
                <select
                  value={newEmergency.alertType}
                  onChange={(e) => setNewEmergency({ ...newEmergency, alertType: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-rose-500 focus:bg-white"
                >
                  <option value="FIRE">Fire Hazard Emergency</option>
                  <option value="SECURITY">Security Breach / Intruder</option>
                  <option value="MEDICAL">Medical Emergency Protocol</option>
                  <option value="WATER_LEAK">Major Water Pipeline Rupture</option>
                  <option value="POWER_OUTAGE">Transformer / Grid Power Outage</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Headline Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Evacuation Drill / Power Outage Warning"
                  value={newEmergency.title}
                  onChange={(e) => setNewEmergency({ ...newEmergency, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-rose-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Emergency Message *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Actionable emergency instructions for residents..."
                  value={newEmergency.message}
                  onChange={(e) => setNewEmergency({ ...newEmergency, message: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-rose-500 focus:bg-white"
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEmergencyModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-rose-600 hover:bg-rose-500 text-white py-3 rounded-xl text-xs font-black shadow-lg shadow-rose-600/30 transition-all"
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
