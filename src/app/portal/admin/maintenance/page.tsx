'use client';

import React, { useEffect, useState } from 'react';
import { Wrench, CheckCircle2, UserCheck, Plus, Filter, Clock } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function AdminMaintenancePage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignStaffId, setAssignStaffId] = useState('');
  const [laborCost, setLaborCost] = useState(0);
  const [materialCost, setMaterialCost] = useState(0);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [statusVal, setStatusVal] = useState('IN_PROGRESS');

  const fetchData = async () => {
    try {
      const [reqRes, staffRes] = await Promise.all([
        fetch('/api/maintenance'),
        fetch('/api/staff'),
      ]);
      if (reqRes.ok) setRequests((await reqRes.json()).requests || []);
      if (staffRes.ok) {
        const sData = (await staffRes.json()).staff || [];
        setStaffList(sData.filter((s: any) => s.role === 'MAINTENANCE_STAFF'));
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateTicket = async () => {
    if (!selectedTicket) return;
    try {
      const res = await fetch(`/api/maintenance/${selectedTicket.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          staffId: assignStaffId || undefined,
          status: statusVal,
          laborCost,
          materialCost,
          resolutionNotes,
        }),
      });
      if (res.ok) {
        setShowAssignModal(false);
        setSelectedTicket(null);
        fetchData();
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
            <Wrench className="w-3.5 h-3.5 text-blue-600" /> Facilities & Ticket Resolution
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Maintenance Work Orders & Dispatch</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">Assign technicians, track repairs, log material/labor expenses, and resolve tickets</p>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-200 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 font-extrabold">Ticket No</th>
                <th className="py-3.5 px-4 font-extrabold">Flat & Resident</th>
                <th className="py-3.5 px-4 font-extrabold">Category & Title</th>
                <th className="py-3.5 px-4 font-extrabold">Assigned Technician</th>
                <th className="py-3.5 px-4 font-extrabold">Expenses (Labor / Material)</th>
                <th className="py-3.5 px-4 font-extrabold">Status</th>
                <th className="py-3.5 px-4 text-right font-extrabold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 font-semibold">
                    No maintenance tickets in queue.
                  </td>
                </tr>
              ) : (
                requests.map((req) => {
                  const technician = req.assignments?.[0]?.staff;
                  return (
                    <tr key={req.id} className="hover:bg-blue-50/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-800">
                        {req.ticketNumber}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900">Flat {req.flat?.flatNumber}</span>
                        <span className="text-[11px] text-slate-500 block font-medium">{req.tenant?.fullName}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-900 block">{req.title}</span>
                        <span className="text-[10px] uppercase font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 inline-block mt-0.5">
                          {req.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700">
                        {technician ? (
                          <div>
                            <span className="font-bold text-slate-900">{technician.fullName}</span>
                            <span className="text-[11px] text-slate-500 block font-medium">{technician.phone}</span>
                          </div>
                        ) : (
                          <span className="text-amber-700 italic font-semibold">— Unassigned —</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-700">
                        <div>Total: <strong className="text-emerald-700">{formatCurrency(req.totalCost)}</strong></div>
                        <div className="text-[10px] text-slate-500">L: ₹{req.laborCost} • M: ₹{req.materialCost}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full inline-block ${
                            req.status === 'RESOLVED' || req.status === 'CLOSED'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : req.status === 'IN_PROGRESS'
                              ? 'bg-blue-100 text-blue-800 border border-blue-300'
                              : 'bg-amber-100 text-amber-800 border border-amber-300 font-black'
                          }`}
                        >
                          {req.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedTicket(req);
                            setAssignStaffId(technician?.id || '');
                            setStatusVal(req.status);
                            setLaborCost(req.laborCost || 0);
                            setMaterialCost(req.materialCost || 0);
                            setResolutionNotes(req.resolutionNotes || '');
                            setShowAssignModal(true);
                          }}
                          className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold rounded-xl text-xs border border-blue-200 transition-all"
                        >
                          Manage & Costs →
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign & Update Modal */}
      {showAssignModal && selectedTicket && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative">
            <h3 className="text-lg font-black text-slate-900 mb-1">Manage Work Order #{selectedTicket.ticketNumber}</h3>
            <p className="text-xs text-slate-500 mb-4">"{selectedTicket.title}" — Flat {selectedTicket.flat?.flatNumber}</p>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Assign Technician / Staff</label>
                <select
                  value={assignStaffId}
                  onChange={(e) => setAssignStaffId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                >
                  <option value="">Unassigned</option>
                  {staffList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.fullName} ({s.designation})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Work Order Status</label>
                <select
                  value={statusVal}
                  onChange={(e) => setStatusVal(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                >
                  <option value="ASSIGNED">ASSIGNED</option>
                  <option value="IN_PROGRESS">IN PROGRESS</option>
                  <option value="WAITING">WAITING FOR SPARES</option>
                  <option value="RESOLVED">RESOLVED</option>
                  <option value="CLOSED">CLOSED</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Labor Cost (₹)</label>
                  <input
                    type="number"
                    value={laborCost}
                    onChange={(e) => setLaborCost(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Material Cost (₹)</label>
                  <input
                    type="number"
                    value={materialCost}
                    onChange={(e) => setMaterialCost(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Technician Resolution Notes</label>
                <textarea
                  rows={2}
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                  placeholder="Details of repair or parts replaced..."
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleUpdateTicket}
                  className="flex-1 bg-blue-700 hover:bg-blue-600 text-white py-3 rounded-xl text-xs font-black shadow-lg shadow-blue-700/20 transition-all"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
