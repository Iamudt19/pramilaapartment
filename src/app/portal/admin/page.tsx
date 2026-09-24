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
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Executive Dashboard</h1>
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-2.5 py-0.5 rounded-full shadow-sm">
              Live Operations
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600">Pramila Apartments Management & Operations Overview</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/portal/admin/bills"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all active:scale-95"
          >
            <Zap className="w-3.5 h-3.5" /> Generate Billing Cycle
          </Link>
          <Link
            href="/portal/admin/notices"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-xs shadow-md shadow-blue-600/20 transition-all active:scale-95"
          >
            Post Notice
          </Link>
          <Link
            href="/portal/admin/settings"
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 rounded-xl border border-slate-300 transition-all shadow-sm"
            title="Configuration Center"
          >
            <Sliders className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Attention Board (Priority action reminders) */}
      {(pendingTenants.length > 0 || (vis.pendingVisitors || 0) > 0 || recentInquiries.length > 0) && (
        <div className="bg-amber-50 rounded-3xl p-5 border border-amber-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-amber-950 block">Actions Requiring Estate Review Today</span>
              <span className="text-xs text-amber-800 font-medium">
                {recentInquiries.length > 0 && `${recentInquiries.length} new prospective walkthrough inquiry • `}
                {pendingTenants.length} pending tenant application(s) • {vis.pendingVisitors || 0} pending visitor approval(s)
              </span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {recentInquiries.length > 0 && (
              <Link
                href="/portal/admin/inquiries"
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
              >
                Review Leads ({recentInquiries.length})
              </Link>
            )}
            {pendingTenants.length > 0 && (
              <Link
                href="/portal/admin/tenants"
                className="px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
              >
                Review Tenants
              </Link>
            )}
            <Link
              href="/portal/admin/visitors"
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
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
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-black text-slate-900 text-base">Collections by Category</h3>
              <p className="text-xs text-slate-500">Rent, society maintenance, electricity units & penalties</p>
            </div>
            <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 font-mono">
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
              <div className="w-full h-full bg-slate-100 animate-pulse rounded-2xl" />
            )}
          </div>
        </div>

        {/* Occupancy Breakdown */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md flex flex-col justify-between">
          <div>
            <h3 className="font-black text-slate-900 text-base mb-1">Society Occupancy</h3>
            <p className="text-xs text-slate-500 mb-4">Live distribution of flat statuses</p>
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
                <div className="w-full h-full bg-slate-100 animate-pulse rounded-2xl" />
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs border-t border-slate-100 pt-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span className="text-slate-700 font-semibold">Occupied: {occ.occupiedFlats || 2}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-slate-700 font-semibold">Vacant: {occ.vacantFlats || 2}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Activity Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Inquiries */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <h3 className="font-black text-slate-900 text-sm">Walkthrough Leads</h3>
            </div>
            <Link href="/portal/admin/inquiries" className="text-xs font-bold text-blue-600 hover:text-blue-800">
              View all →
            </Link>
          </div>

          <div className="space-y-3">
            {recentInquiries.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No new inquiries.</p>
            ) : (
              recentInquiries.map((inq) => (
                <div key={inq.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900 block">{inq.fullName}</span>
                    <span className="text-slate-500 text-[11px]">
                      {inq.phone} • {inq.flatNumber ? `Flat ${inq.flatNumber}` : inq.suiteName}
                    </span>
                  </div>
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                    {inq.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Visitors */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <QrCode className="w-4 h-4 text-blue-600" />
              <h3 className="font-black text-slate-900 text-sm">Visitor Gate Passes</h3>
            </div>
            <Link href="/portal/admin/visitors" className="text-xs font-bold text-blue-600 hover:text-blue-800">
              View all →
            </Link>
          </div>

          <div className="space-y-3">
            {recentVisitors.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No visitor records yet.</p>
            ) : (
              recentVisitors.map((v) => (
                <div key={v.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900 block">{v.visitorName}</span>
                    <span className="text-slate-500 text-[11px]">
                      Flat {v.flat?.flatNumber} • {v.relationship}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                      v.status === 'CHECKED_IN'
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : v.status === 'APPROVED'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
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
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <h3 className="font-black text-slate-900 text-sm">Security & Violations</h3>
            </div>
            <Link href="/portal/admin/security" className="text-xs font-bold text-blue-600 hover:text-blue-800">
              Manage →
            </Link>
          </div>

          <div className="space-y-3">
            {recentIncidents.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No security incidents logged.</p>
            ) : (
              recentIncidents.map((inc) => (
                <div key={inc.id} className="p-3 bg-rose-50/60 rounded-2xl border border-rose-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-rose-950 block">{inc.incidentType.replace('_', ' ')}</span>
                    <span className="text-slate-600 text-[11px] line-clamp-1">{inc.description}</span>
                  </div>
                  <span className="text-[10px] bg-rose-100 text-rose-800 border border-rose-300 px-2 py-0.5 rounded font-extrabold shrink-0">
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
