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
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold mb-2 shadow-sm">
            <FileSpreadsheet className="w-3.5 h-3.5 text-blue-600" /> Operational & Financial Intelligence
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Executive Reports & Analytics</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">Financial balance sheets, occupancy metrics, and operational audit reports</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1.5 border border-slate-300 shadow-sm transition-all"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" /> Print Report
          </button>
          <button
            onClick={downloadCSV}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl text-xs flex items-center gap-2 shadow-md shadow-emerald-600/20 transition-all active:scale-95"
          >
            <Download className="w-4 h-4" /> Export CSV / Excel
          </button>
        </div>
      </div>

      {/* Grid of Reports */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Financial Summary */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-600" /> Financial Revenue Statement
            </h3>
            <span className="text-xs font-black text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 font-mono">
              Total: {formatCurrency(fin.totalBilled || 0)}
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-600 font-medium">Rent Collections:</span>
              <span className="font-bold text-slate-900">{formatCurrency(fin.rentCollection || 0)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-600 font-medium">Society Maintenance Charges:</span>
              <span className="font-bold text-slate-900">{formatCurrency(fin.maintenanceCollection || 0)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-600 font-medium">Electricity Sub-metering:</span>
              <span className="font-bold text-slate-900">{formatCurrency(fin.electricityCollection || 0)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-600 font-medium">Water Supply Fixed Charges:</span>
              <span className="font-bold text-slate-900">{formatCurrency(fin.waterCollection || 0)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-600 font-medium">Violations & Penalties:</span>
              <span className="font-bold text-rose-700">{formatCurrency(fin.penaltyCollection || 0)}</span>
            </div>
            <div className="flex justify-between pt-2.5 text-sm font-black bg-emerald-50 p-3 rounded-2xl border border-emerald-200">
              <span className="text-emerald-900">Total Collected:</span>
              <span className="text-emerald-800 font-mono">{formatCurrency(fin.totalCollected || 0)}</span>
            </div>
          </div>
        </div>

        {/* Occupancy Summary */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
              <Home className="w-5 h-5 text-blue-600" /> Occupancy & Tenancy Report
            </h3>
            <span className="text-xs font-black text-blue-800 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200 font-mono">
              {occ.occupancyRate || 0}% Occupancy
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-600 font-medium">Total Flat Units:</span>
              <span className="font-bold text-slate-900">{occ.totalFlats || 0} Flats</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-600 font-medium">Occupied by Active Tenants:</span>
              <span className="font-bold text-emerald-700">{occ.occupiedFlats || 0} Flats</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-600 font-medium">Vacant & Ready for Lease:</span>
              <span className="font-bold text-blue-700">{occ.vacantFlats || 0} Flats</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-600 font-medium">Under Maintenance / Renovation:</span>
              <span className="font-bold text-amber-700">{occ.maintenanceFlats || 0} Flats</span>
            </div>
          </div>
        </div>

        {/* Visitors & Security */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
              <QrCode className="w-5 h-5 text-amber-600" /> Visitor Traffic & Security
            </h3>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-600 font-medium">Total Requests Received:</span>
              <span className="font-bold text-slate-900">{vis.totalVisitors || 0}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-600 font-medium">Approved Passes:</span>
              <span className="font-bold text-emerald-700">{vis.approvedVisitors || 0}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-600 font-medium">Currently Inside Premises:</span>
              <span className="font-bold text-amber-700">{vis.currentlyInside || 0} Visitors</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-600 font-medium">Declined Passes:</span>
              <span className="font-bold text-rose-700">{vis.rejectedVisitors || 0}</span>
            </div>
          </div>
        </div>

        {/* Maintenance Analytics */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
              <Wrench className="w-5 h-5 text-purple-600" /> Maintenance & Repairs Cost
            </h3>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-600 font-medium">Total Tickets Logged:</span>
              <span className="font-bold text-slate-900">{maint.totalTickets || 0} Work Orders</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-600 font-medium">Open / In Progress:</span>
              <span className="font-bold text-amber-700">{maint.openTickets || 0}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-600 font-medium">Resolved & Confirmed:</span>
              <span className="font-bold text-emerald-700">{maint.resolvedTickets || 0}</span>
            </div>
            <div className="flex justify-between pt-2.5 text-sm font-black bg-purple-50 p-3 rounded-2xl border border-purple-200">
              <span className="text-purple-900">Total Repair Cost:</span>
              <span className="text-purple-800 font-mono">{formatCurrency(maint.totalMaintenanceCost || 0)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
