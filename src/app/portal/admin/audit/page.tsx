'use client';

import React, { useEffect, useState } from 'react';
import { History, Shield, Filter, Search, Clock, ArrowRight, FileText, UserCheck } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';

export default function AdminAuditPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('');

  useEffect(() => {
    fetch('/api/audit')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setLogs(data.logs || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.actorName?.toLowerCase().includes(search.toLowerCase()) ||
      log.action?.toLowerCase().includes(search.toLowerCase()) ||
      log.resource?.toLowerCase().includes(search.toLowerCase()) ||
      (log.newValue && log.newValue.toLowerCase().includes(search.toLowerCase()));

    const matchesAction = !actionFilter || log.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  const uniqueActions = Array.from(new Set(logs.map((l) => l.action).filter(Boolean)));

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold mb-2 shadow-sm">
            <Shield className="w-3.5 h-3.5 text-blue-600" /> Tamper-Proof Audit Vault
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Immutable Audit Trail Logs
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Cryptographically logged records for billing generation, tenant approvals, penalty assessments, and system edits.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-200">
          <History className="w-5 h-5 text-blue-600" />
          <div>
            <span className="text-lg font-black text-slate-900 block leading-tight">{logs.length}</span>
            <span className="text-[10px] text-slate-500 uppercase font-extrabold tracking-wider">Total Events Logged</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by actor, action, resource, or details..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 shadow-sm"
          />
        </div>
        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-blue-600 shadow-sm"
        >
          <option value="">All Action Types ({logs.length})</option>
          {uniqueActions.map((action) => (
            <option key={action} value={action}>
              {action}
            </option>
          ))}
        </select>
      </div>

      {/* Audit Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-200 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 font-extrabold">Timestamp</th>
                <th className="py-3.5 px-4 font-extrabold">Actor</th>
                <th className="py-3.5 px-4 font-extrabold">Action</th>
                <th className="py-3.5 px-4 font-extrabold">Target Resource</th>
                <th className="py-3.5 px-4 font-extrabold">Details / Delta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500 font-semibold">
                    <div className="flex items-center justify-center gap-2">
                      <Clock className="w-4 h-4 animate-spin text-blue-600" /> Loading audit history...
                    </div>
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500 font-semibold">
                    No audit records match your query.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="py-3.5 px-4 text-slate-600 text-[11px] whitespace-nowrap font-medium">
                      {formatDateTime(log.timestamp)}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div className="flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>{log.actorName || 'System'}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-[10px] font-black text-blue-900 bg-blue-100 px-2.5 py-1 rounded-lg border border-blue-200 font-mono inline-block">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      <span className="text-slate-900">{log.resource}</span>{' '}
                      {log.resourceId && (
                        <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                          {log.resourceId.slice(0, 8)}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-700 max-w-md break-all bg-slate-50/50">
                      {log.newValue || log.oldValue || <span className="text-slate-400 italic">—</span>}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
