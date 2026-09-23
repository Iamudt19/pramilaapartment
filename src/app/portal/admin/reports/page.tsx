'use client';

import React, { useEffect, useState } from 'react';
import { FileSpreadsheet, Download, Printer, DollarSign, Home, QrCode, Wrench } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function AdminReportsPage() {
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/reports')
      .then((res) => res.json())
      .then((data) => setReportData(data))
      .finally(() => setLoading(false));
  }, []);

  const downloadCSV = () => {
    if (!reportData) return;
    const fin = reportData.financial || {};
    const occ = reportData.occupancy || {};
    const vis = reportData.visitors || {};
    const maint = reportData.maintenance || {};

    const csvRows = [
      ['Metric Category', 'Metric Name', 'Value'],
      ['Financial', 'Total Billed Amount', fin.totalBilled],
      ['Financial', 'Total Collected Amount', fin.totalCollected],
      ['Financial', 'Outstanding Balance', fin.totalOutstanding],
      ['Financial', 'Rent Collections', fin.rentCollection],
      ['Financial', 'Maintenance Collections', fin.maintenanceCollection],
      ['Financial', 'Electricity Collections', fin.electricityCollection],
      ['Financial', 'Penalties Assessed', fin.penaltyCollection],
      ['Occupancy', 'Total Flats', occ.totalFlats],
      ['Occupancy', 'Occupied Flats', occ.occupiedFlats],
      ['Occupancy', 'Vacant Flats', occ.vacantFlats],
      ['Occupancy', 'Occupancy Rate (%)', `${occ.occupancyRate}%`],
      ['Visitors', 'Total Visitor Requests', vis.totalVisitors],
      ['Visitors', 'Approved Passes', vis.approvedVisitors],
      ['Visitors', 'Currently Inside Premises', vis.currentlyInside],
      ['Maintenance', 'Total Work Orders', maint.totalTickets],
      ['Maintenance', 'Open Tickets', maint.openTickets],
      ['Maintenance', 'Resolved Tickets', maint.resolvedTickets],
      ['Maintenance', 'Total Maintenance Cost (INR)', maint.totalMaintenanceCost],
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Pramila_Apartments_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const fin = reportData?.financial || {};
  const occ = reportData?.occupancy || {};
  const vis = reportData?.visitors || {};
  const maint = reportData?.maintenance || {};

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Executive Reports & Analytics</h1>
          <p className="text-xs text-slate-400 mt-1">Financial balance sheets, occupancy metrics, and operational audit reports</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs flex items-center gap-1.5 border border-slate-700"
          >
            <Printer className="w-3.5 h-3.5" /> Print Report
          </button>
          <button
            onClick={downloadCSV}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all"
          >
            <Download className="w-4 h-4" /> Export CSV / Excel
          </button>
        </div>
      </div>

      {/* Grid of Reports */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Financial Summary */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-400" /> Financial Revenue Statement
            </h3>
            <span className="text-xs font-mono font-bold text-emerald-400">
              Total: {formatCurrency(fin.totalBilled || 0)}
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-800/60">
              <span className="text-slate-400">Rent Collections:</span>
              <span className="font-bold text-white">{formatCurrency(fin.rentCollection || 0)}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800/60">
              <span className="text-slate-400">Society Maintenance Charges:</span>
              <span className="font-bold text-white">{formatCurrency(fin.maintenanceCollection || 0)}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800/60">
              <span className="text-slate-400">Electricity Sub-metering:</span>
              <span className="font-bold text-white">{formatCurrency(fin.electricityCollection || 0)}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800/60">
              <span className="text-slate-400">Water Supply Fixed Charges:</span>
              <span className="font-bold text-white">{formatCurrency(fin.waterCollection || 0)}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800/60">
              <span className="text-slate-400">Violations & Penalties:</span>
              <span className="font-bold text-rose-400">{formatCurrency(fin.penaltyCollection || 0)}</span>
            </div>
            <div className="flex justify-between pt-2 text-sm font-black">
              <span className="text-emerald-400">Total Collected:</span>
              <span className="text-emerald-400">{formatCurrency(fin.totalCollected || 0)}</span>
            </div>
          </div>
        </div>

        {/* Occupancy Summary */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Home className="w-5 h-5 text-blue-400" /> Occupancy & Tenancy Report
            </h3>
            <span className="text-xs font-mono font-bold text-cyan-400">
              {occ.occupancyRate || 0}% Occupancy
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-800/60">
              <span className="text-slate-400">Total Flat Units:</span>
              <span className="font-bold text-white">{occ.totalFlats || 0} Flats</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800/60">
              <span className="text-slate-400">Occupied by Active Tenants:</span>
              <span className="font-bold text-emerald-400">{occ.occupiedFlats || 0} Flats</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800/60">
              <span className="text-slate-400">Vacant & Ready for Lease:</span>
              <span className="font-bold text-blue-400">{occ.vacantFlats || 0} Flats</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800/60">
              <span className="text-slate-400">Under Maintenance / Renovation:</span>
              <span className="font-bold text-amber-400">{occ.maintenanceFlats || 0} Flats</span>
            </div>
          </div>
        </div>

        {/* Visitors & Security */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <QrCode className="w-5 h-5 text-amber-400" /> Visitor Traffic & Security
            </h3>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-800/60">
              <span className="text-slate-400">Total Requests Received:</span>
              <span className="font-bold text-white">{vis.totalVisitors || 0}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800/60">
              <span className="text-slate-400">Approved Passes:</span>
              <span className="font-bold text-emerald-400">{vis.approvedVisitors || 0}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800/60">
              <span className="text-slate-400">Currently Inside Premises:</span>
              <span className="font-bold text-amber-400">{vis.currentlyInside || 0} Visitors</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800/60">
              <span className="text-slate-400">Declined Passes:</span>
              <span className="font-bold text-rose-400">{vis.rejectedVisitors || 0}</span>
            </div>
          </div>
        </div>

        {/* Maintenance Analytics */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Wrench className="w-5 h-5 text-purple-400" /> Maintenance & Repairs Cost
            </h3>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-800/60">
              <span className="text-slate-400">Total Tickets Logged:</span>
              <span className="font-bold text-white">{maint.totalTickets || 0} Work Orders</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800/60">
              <span className="text-slate-400">Open / In Progress:</span>
              <span className="font-bold text-amber-400">{maint.openTickets || 0}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800/60">
              <span className="text-slate-400">Resolved & Confirmed:</span>
              <span className="font-bold text-emerald-400">{maint.resolvedTickets || 0}</span>
            </div>
            <div className="flex justify-between pt-2 text-sm font-black">
              <span className="text-purple-400">Total Repair Cost:</span>
              <span className="text-purple-400">{formatCurrency(maint.totalMaintenanceCost || 0)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
