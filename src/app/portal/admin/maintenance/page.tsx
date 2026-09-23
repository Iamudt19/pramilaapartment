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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Maintenance Work Orders & Dispatch</h1>
          <p className="text-xs text-slate-400 mt-1">Assign technicians, track repairs, log material/labor expenses, and resolve tickets</p>
        </div>
      </div>

      {/* Requests Table */}
      <div className="glass-card rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Ticket No</th>
              <th className="py-3 px-4">Flat & Resident</th>
              <th className="py-3 px-4">Category & Title</th>
              <th className="py-3 px-4">Assigned Technician</th>
              <th className="py-3 px-4">Expenses (Labor / Material)</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {requests.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-500">
                  No maintenance tickets in queue.
                </td>
              </tr>
            ) : (
              requests.map((req) => {
                const technician = req.assignments?.[0]?.staff;
                return (
                  <tr key={req.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                      {req.ticketNumber}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-white">Flat {req.flat?.flatNumber}</span>
                      <span className="text-[10px] text-slate-400 block">{req.tenant?.fullName}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-white block">{req.title}</span>
                      <span className="text-[10px] text-slate-400 uppercase font-bold text-emerald-400">
                        {req.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      {technician ? (
                        <div>
                          <span className="font-semibold text-white">{technician.fullName}</span>
                          <span className="text-[10px] text-slate-400 block">{technician.phone}</span>
                        </div>
                      ) : (
                        <span className="text-amber-400 italic">— Unassigned —</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-300">
                      <div>Total: <strong className="text-emerald-400">{formatCurrency(req.totalCost)}</strong></div>
                      <div className="text-[10px] text-slate-500">L: ₹{req.laborCost} • M: ₹{req.materialCost}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          req.status === 'RESOLVED' || req.status === 'CLOSED'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : req.status === 'IN_PROGRESS'
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {req.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
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
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg text-xs border border-slate-700 transition-all"
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

      {/* Assign & Update Modal */}
      {showAssignModal && selectedTicket && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-1">Manage Work Order #{selectedTicket.ticketNumber}</h3>
            <p className="text-xs text-slate-400 mb-4">"{selectedTicket.title}" — Flat {selectedTicket.flat?.flatNumber}</p>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Assign Technician / Staff</label>
                <select
                  value={assignStaffId}
                  onChange={(e) => setAssignStaffId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
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
                <label className="text-xs font-semibold text-slate-300 block mb-1">Work Order Status</label>
                <select
                  value={statusVal}
                  onChange={(e) => setStatusVal(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
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
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Labor Cost (₹)</label>
                  <input
                    type="number"
                    value={laborCost}
                    onChange={(e) => setLaborCost(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Material Cost (₹)</label>
                  <input
                    type="number"
                    value={materialCost}
                    onChange={(e) => setMaterialCost(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Technician Resolution Notes</label>
                <textarea
                  rows={2}
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  placeholder="Details of repair or parts replaced..."
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2.5 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleUpdateTicket}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20"
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
