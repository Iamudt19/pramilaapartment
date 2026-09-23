'use client';

import React, { useEffect, useState } from 'react';
import { Wrench, CheckCircle2, Clock, DollarSign, Upload, ArrowRight } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function MaintenanceStaffPortalPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [status, setStatus] = useState('IN_PROGRESS');
  const [laborCost, setLaborCost] = useState(0);
  const [materialCost, setMaterialCost] = useState(0);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/maintenance');
      if (res.ok) setTasks((await res.json()).requests || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleUpdateWorkOrder = async () => {
    if (!selectedTask) return;
    try {
      setIsUpdating(true);
      const res = await fetch(`/api/maintenance/${selectedTask.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          laborCost,
          materialCost,
          resolutionNotes,
        }),
      });
      if (res.ok) {
        setSelectedTask(null);
        fetchTasks();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Facility Maintenance & Work Orders</h1>
        <p className="text-xs text-slate-400 mt-1">Technician queue: resolve assigned repairs, track spare parts cost, and submit completion reports</p>
      </div>

      <div className="space-y-4">
        {tasks.map((task) => (
          <div key={task.id} className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono font-bold text-xs text-emerald-400">{task.ticketNumber}</span>
                <h3 className="text-base font-bold text-white mt-1">{task.title}</h3>
                <p className="text-xs text-slate-400">
                  Flat <strong className="text-emerald-400">{task.flat?.flatNumber}</strong> • Resident: {task.tenant?.fullName} ({task.tenant?.phone})
                </p>
              </div>
              <span
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  task.status === 'RESOLVED'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}
              >
                {task.status}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/80">
              {task.description}
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-800/80 text-xs">
              <div className="text-slate-400">
                Expenses Logged: <strong className="text-white">{formatCurrency(task.totalCost)}</strong> (L: ₹{task.laborCost} • M: ₹{task.materialCost})
              </div>
              <button
                onClick={() => {
                  setSelectedTask(task);
                  setStatus(task.status);
                  setLaborCost(task.laborCost || 0);
                  setMaterialCost(task.materialCost || 0);
                  setResolutionNotes(task.resolutionNotes || '');
                }}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all"
              >
                <Wrench className="w-3.5 h-3.5" /> Update Work & Log Costs
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Technician Update Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-1">Update Task #{selectedTask.ticketNumber}</h3>
            <p className="text-xs text-slate-400 mb-4">{selectedTask.title} • Flat {selectedTask.flat?.flatNumber}</p>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Status Progression</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="IN_PROGRESS">IN PROGRESS (Working on site)</option>
                  <option value="WAITING">WAITING FOR SPARE PARTS</option>
                  <option value="RESOLVED">WORK COMPLETED & RESOLVED</option>
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
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Material / Spares (₹)</label>
                  <input
                    type="number"
                    value={materialCost}
                    onChange={(e) => setMaterialCost(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Work Done Notes / Spares Used</label>
                <textarea
                  rows={3}
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="e.g. Replaced leaking valve and sealed joint pipe..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedTask(null)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2.5 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={handleUpdateWorkOrder}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20"
                >
                  {isUpdating ? 'Saving...' : 'Submit Resolution'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
