'use client';

import React, { useEffect, useState } from 'react';
import { BellRing, Pin, Calendar } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function TenantNoticesPage() {
  const [notices, setNotices] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/notices')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setNotices(data.notices || []);
      });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Society Notices & Circulars</h1>
        <p className="text-xs text-slate-400 mt-1">Official announcements and maintenance advisories from Pramila Apartments Management</p>
      </div>

      <div className="space-y-4">
        {notices.map((n) => (
          <div
            key={n.id}
            className={`glass-card rounded-3xl p-6 border space-y-3 ${
              n.isPinned ? 'border-emerald-500/40 bg-emerald-950/10' : 'border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-900 border border-slate-700 text-emerald-400 px-2 py-0.5 rounded">
                  {n.category}
                </span>
                {n.isPinned && (
                  <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded flex items-center gap-1">
                    <Pin className="w-3 h-3 text-emerald-400" /> Pinned Announcement
                  </span>
                )}
              </div>
              <span className="text-[11px] text-slate-400">{formatDate(n.publishDate)}</span>
            </div>

            <h3 className="text-base font-bold text-white">{n.title}</h3>
            <p className="text-xs text-slate-300 leading-relaxed">{n.content}</p>

            <div className="border-t border-slate-800/80 pt-3 flex justify-between text-[11px] text-slate-500">
              <span>Audience: {n.targetAudience}</span>
              <span>By: {n.createdBy}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
