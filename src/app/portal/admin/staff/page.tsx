'use client';

import React, { useEffect, useState } from 'react';
import { UserCog, Plus, Phone, Mail, ShieldCheck, Clock } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function AdminStaffPage() {
  const [staffList, setStaffList] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStaff, setNewStaff] = useState({
    fullName: '',
    phone: '',
    email: '',
    role: 'SECURITY_GUARD',
    designation: 'Gate Security Guard',
    shiftSchedule: 'Day Shift (06:00 - 18:00)',
    emergencyContact: '',
  });

  const fetchStaff = async () => {
    try {
      const res = await fetch('/api/staff');
      if (res.ok) setStaffList((await res.json()).staff || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStaff),
      });
      if (res.ok) {
        setShowAddModal(false);
        setNewStaff({
          fullName: '',
          phone: '',
          email: '',
          role: 'SECURITY_GUARD',
          designation: 'Gate Security Guard',
          shiftSchedule: 'Day Shift (06:00 - 18:00)',
          emergencyContact: '',
        });
        fetchStaff();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Staff & Security Personnel</h1>
          <p className="text-xs text-slate-400 mt-1">Manage security guards, maintenance technicians, accountants, and estate managers</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Staff Member
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staffList.map((staff) => (
          <div key={staff.id} className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-700 flex items-center justify-center font-bold text-white text-sm">
                {staff.fullName.charAt(0)}
              </div>
              <span className="text-[10px] font-bold bg-slate-900 border border-slate-700 text-emerald-400 px-2 py-0.5 rounded">
                {staff.role.replace('_', ' ')}
              </span>
            </div>

            <div>
              <h3 className="font-bold text-white text-base">{staff.fullName}</h3>
              <p className="text-xs text-emerald-400 font-medium">{staff.designation}</p>
              <div className="text-xs text-slate-400 space-y-1 mt-3">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-500" /> {staff.phone}
                </div>
                {staff.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-500" /> {staff.email}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-500" /> {staff.shiftSchedule}
                </div>
              </div>
            </div>

            <div className="border-t border-slate-800/80 pt-3 flex justify-between text-[11px] text-slate-400">
              <span>Joined: <strong>{formatDate(staff.joiningDate)}</strong></span>
              <span className="text-emerald-400 font-semibold">Active Staff</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Add Staff Member</h3>
            <form onSubmit={handleCreateStaff} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Suresh Kumar"
                  value={newStaff.fullName}
                  onChange={(e) => setNewStaff({ ...newStaff, fullName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Role *</label>
                  <select
                    value={newStaff.role}
                    onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="SECURITY_GUARD">Security Guard</option>
                    <option value="MAINTENANCE_STAFF">Maintenance Staff</option>
                    <option value="ACCOUNTANT">Accountant</option>
                    <option value="PROPERTY_MANAGER">Property Manager</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Designation</label>
                  <input
                    type="text"
                    placeholder="e.g. Gate Guard"
                    value={newStaff.designation}
                    onChange={(e) => setNewStaff({ ...newStaff, designation: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 00000"
                    value={newStaff.phone}
                    onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="staff@pramila.com"
                    value={newStaff.email}
                    onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Shift Schedule</label>
                <input
                  type="text"
                  placeholder="e.g. Day Shift (06:00 - 18:00)"
                  value={newStaff.shiftSchedule}
                  onChange={(e) => setNewStaff({ ...newStaff, shiftSchedule: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2.5 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20"
                >
                  Add Staff Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
