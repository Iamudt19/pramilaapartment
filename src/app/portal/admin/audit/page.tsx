'use client';

import React, { useEffect, useState } from 'react';
import { History, Shield, Filter, ArrowRight } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';

export default function AdminAuditPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/audit')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setLogs(data.logs || []);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Immutable Audit Trail Logs</h1>
          <p className="text-xs text-slate-400 mt-1">Audit log records for billing generation, tenant approvals, penalty assessments, and setting edits</p>
        </div>
      </div>

      <div className="glass-card rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-4">Actor</th>
              <th className="py-3 px-4">Action</th>
              <th className="py-3 px-4">Target Resource</th>
              <th className="py-3 px-4">Details / Delta</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {logs.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-500 font-sans">
                  No audit logs recorded yet.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3 px-4 text-slate-400 text-[11px]">
                    {formatDateTime(log.timestamp)}
                  </td>
                  <td className="py-3 px-4 font-sans font-semibold text-white">
                    {log.actorName}
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-sans text-slate-300">
                    {log.resource} {log.resourceId ? `(${log.resourceId.slice(0, 8)})` : ''}
                  </td>
                  <td className="py-3 px-4 text-[11px] text-slate-400 max-w-sm truncate">
                    {log.newValue || log.oldValue || '—'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
