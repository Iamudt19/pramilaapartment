'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { StatCard } from '@/components/shared/StatCard';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  Building,
  Home,
  Users,
  QrCode,
  ShieldAlert,
  Receipt,
  Wrench,
  UserCheck,
  ArrowRight,
  Zap,
  PlusCircle,
  FileSpreadsheet,
  Sliders,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';

export default function AdminDashboardPage() {
  const [reportData, setReportData] = useState<any>(null);
  const [recentVisitors, setRecentVisitors] = useState<any[]>([]);
  const [recentIncidents, setRecentIncidents] = useState<any[]>([]);
  const [pendingTenants, setPendingTenants] = useState<any[]>([]);
  const [recentInquiries, setRecentInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [repRes, visRes, incRes, tenRes, inqRes] = await Promise.all([
          fetch('/api/reports'),
          fetch('/api/visitors'),
          fetch('/api/security/incidents'),
          fetch('/api/tenants?status=PENDING'),
          fetch('/api/inquiries?status=NEW'),
        ]);

        if (repRes.ok) setReportData((await repRes.json()));
        if (visRes.ok) {
          const visData = await visRes.json();
          setRecentVisitors(visData.visitors?.slice(0, 5) || []);
        }
        if (incRes.ok) {
          const incData = await incRes.json();
          setRecentIncidents(incData.incidents?.slice(0, 5) || []);
        }
        if (tenRes.ok) {
          const tenData = await tenRes.json();
          setPendingTenants(tenData.tenants || []);
        }
        if (inqRes.ok) {
          const inqData = await inqRes.json();
          setRecentInquiries(inqData.inquiries?.slice(0, 5) || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fin = reportData?.financial || {};
  const occ = reportData?.occupancy || {};
  const vis = reportData?.visitors || {};
  const maint = reportData?.maintenance || {};

  const revenueChartData = [
    { name: 'Rent', amount: fin.rentCollection || 50000 },
    { name: 'Maintenance', amount: fin.maintenanceCollection || 5500 },
    { name: 'Electricity', amount: fin.electricityCollection || 2300 },
    { name: 'Water', amount: fin.waterCollection || 800 },
    { name: 'Penalties', amount: fin.penaltyCollection || 2000 },
  ];

  const occupancyPieData = [
    { name: 'Occupied', value: occ.occupiedFlats || 2, color: '#10b981' },
    { name: 'Vacant', value: occ.vacantFlats || 2, color: '#3b82f6' },
    { name: 'Maintenance', value: occ.maintenanceFlats || 0, color: '#f59e0b' },
  ];

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl lg:text-3xl font-black text-white tracking-tight">Executive Dashboard</h1>
            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold px-2.5 py-0.5 rounded-full">
              Live Operations
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Pramila Apartments Management & Operations Overview</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/portal/admin/bills"
            className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all"
          >
            <Zap className="w-3.5 h-3.5" /> Generate Billing Cycle
          </Link>
          <Link
            href="/portal/admin/notices"
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-xs border border-slate-700 transition-all"
          >
            Post Notice
          </Link>
          <Link
            href="/portal/admin/settings"
            className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl border border-slate-800 transition-all"
            title="Configuration Center"
          >
            <Sliders className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Attention Board (Priority action reminders) */}
      {(pendingTenants.length > 0 || (vis.pendingVisitors || 0) > 0 || recentInquiries.length > 0) && (
        <div className="glass-card rounded-2xl p-4 border border-amber-500/30 bg-amber-950/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-amber-300 block">Actions Requiring Estate Review Today</span>
              <span className="text-xs text-slate-300">
                {recentInquiries.length > 0 && `${recentInquiries.length} new prospective walkthrough inquiry • `}
                {pendingTenants.length} pending tenant application(s) • {vis.pendingVisitors || 0} pending visitor approval(s)
              </span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {recentInquiries.length > 0 && (
              <Link
                href="/portal/admin/inquiries"
                className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-all"
              >
                Review Leads ({recentInquiries.length})
              </Link>
            )}
            {pendingTenants.length > 0 && (
              <Link
                href="/portal/admin/tenants"
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-all"
              >
                Review Tenants
              </Link>
            )}
            <Link
              href="/portal/admin/visitors"
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg border border-slate-700 transition-all"
            >
              Review Passes
            </Link>
          </div>
        </div>
      )}

      {/* Key Metric KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Flats Occupancy"
          value={`${occ.occupancyRate || 50}%`}
          subtitle={`${occ.occupiedFlats || 2} Occupied / ${occ.totalFlats || 4} Total Units`}
          icon={Home}
          color="emerald"
          trend="+12% vs last quarter"
          trendPositive={true}
        />
        <StatCard
          title="Monthly Collections"
          value={formatCurrency(fin.totalCollected || 24900)}
          subtitle={`Outstanding: ${formatCurrency(fin.totalOutstanding || 31400)}`}
          icon={Receipt}
          color="blue"
          trend="₹24.9k collected"
        />
        <StatCard
          title="Visitors Inside Today"
          value={vis.currentlyInside || 1}
          subtitle={`${vis.approvedVisitors || 2} Approved / ${vis.totalVisitors || 3} Total`}
          icon={QrCode}
          color="amber"
        />
        <StatCard
          title="Open Maintenance"
          value={maint.openTickets || 1}
          subtitle={`${maint.resolvedTickets || 0} Resolved this month`}
          icon={Wrench}
          color="purple"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Breakdown Chart */}
        <div className="lg:col-span-2 glass-card rounded-3xl p-6 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-white text-base">Collections by Category</h3>
              <p className="text-xs text-slate-400">Rent, society maintenance, electricity units & penalties</p>
            </div>
            <span className="text-xs font-bold text-emerald-400 font-mono">
              Total: {formatCurrency(fin.totalBilled || 56300)}
            </span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            {isMounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '0.75rem',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                    formatter={(value: any) => [formatCurrency(Number(value)), 'Amount']}
                  />
                  <Bar dataKey="amount" fill="#2563eb" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full bg-slate-900/40 animate-pulse rounded-2xl" />
            )}
          </div>
        </div>

        {/* Occupancy Breakdown */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-white text-base mb-1">Society Occupancy</h3>
            <p className="text-xs text-slate-400 mb-4">Live distribution of flat statuses</p>
            <div className="h-44 w-full flex items-center justify-center">
              {isMounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={occupancyPieData}
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {occupancyPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderRadius: '0.75rem',
                        color: '#fff',
                        fontSize: '12px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full bg-slate-900/40 animate-pulse rounded-2xl" />
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs border-t border-slate-800 pt-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span className="text-slate-300">Occupied: {occ.occupiedFlats || 2}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-slate-300">Vacant: {occ.vacantFlats || 2}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Activity Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Inquiries */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <h3 className="font-bold text-white text-sm">Walkthrough Leads</h3>
            </div>
            <Link href="/portal/admin/inquiries" className="text-xs text-emerald-400 hover:underline">
              View all →
            </Link>
          </div>

          <div className="space-y-3">
            {recentInquiries.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">No new inquiries.</p>
            ) : (
              recentInquiries.map((inq) => (
                <div key={inq.id} className="p-3 bg-slate-950/60 rounded-2xl border border-slate-800/80 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-200 block">{inq.fullName}</span>
                    <span className="text-slate-400 text-[11px]">
                      {inq.phone} • {inq.flatNumber ? `Flat ${inq.flatNumber}` : inq.suiteName}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {inq.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Visitors */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <div className="flex items-center gap-2">
              <QrCode className="w-4 h-4 text-emerald-400" />
              <h3 className="font-bold text-white text-sm">Visitor Gate Passes</h3>
            </div>
            <Link href="/portal/admin/visitors" className="text-xs text-emerald-400 hover:underline">
              View all →
            </Link>
          </div>

          <div className="space-y-3">
            {recentVisitors.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">No visitor records yet.</p>
            ) : (
              recentVisitors.map((v) => (
                <div key={v.id} className="p-3 bg-slate-950/60 rounded-2xl border border-slate-800/80 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-200 block">{v.visitorName}</span>
                    <span className="text-slate-400 text-[11px]">
                      Flat {v.flat?.flatNumber} • {v.relationship}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      v.status === 'CHECKED_IN'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : v.status === 'APPROVED'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {v.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Security Incidents & Penalties */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <h3 className="font-bold text-white text-sm">Security & Violations</h3>
            </div>
            <Link href="/portal/admin/security" className="text-xs text-emerald-400 hover:underline">
              Manage →
            </Link>
          </div>

          <div className="space-y-3">
            {recentIncidents.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">No security incidents logged.</p>
            ) : (
              recentIncidents.map((inc) => (
                <div key={inc.id} className="p-3 bg-slate-950/60 rounded-2xl border border-rose-900/30 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-rose-300 block">{inc.incidentType.replace('_', ' ')}</span>
                    <span className="text-slate-400 text-[11px] line-clamp-1">{inc.description}</span>
                  </div>
                  <span className="text-[10px] bg-rose-950 text-rose-300 border border-rose-800 px-2 py-0.5 rounded font-bold shrink-0">
                    {inc.severity}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
