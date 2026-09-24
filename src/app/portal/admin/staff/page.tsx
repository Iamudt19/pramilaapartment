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
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold mb-2 shadow-sm">
            <UserCog className="w-3.5 h-3.5 text-blue-600" /> Estate Workforce & Security
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Staff & Security Personnel</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">Manage security guards, maintenance technicians, accountants, and estate managers</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-blue-700 hover:bg-blue-600 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-blue-700/20 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Staff Member
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staffList.map((staff) => (
          <div key={staff.id} className="bg-white rounded-3xl p-6 border border-slate-200 space-y-4 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-start justify-between">
              <div className="w-11 h-11 rounded-2xl bg-blue-700 text-white flex items-center justify-center font-black text-base shadow-md shadow-blue-700/20">
                {staff.fullName.charAt(0)}
              </div>
              <span className="text-[10px] font-black bg-blue-50 border border-blue-200 text-blue-800 px-2.5 py-1 rounded-lg">
                {staff.role.replace('_', ' ')}
              </span>
            </div>

            <div>
              <h3 className="font-extrabold text-slate-900 text-base">{staff.fullName}</h3>
              <p className="text-xs text-blue-700 font-bold">{staff.designation}</p>
              <div className="text-xs text-slate-600 space-y-1 mt-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" /> {staff.phone}
                </div>
                {staff.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" /> {staff.email}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400" /> {staff.shiftSchedule}
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3 flex justify-between text-[11px] text-slate-500">
              <span>Joined: <strong className="text-slate-700">{formatDate(staff.joiningDate)}</strong></span>
              <span className="text-emerald-700 font-bold">Active Staff</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl relative">
            <h3 className="text-lg font-black text-slate-900 mb-1">Add Staff Member</h3>
            <p className="text-xs text-slate-500 mb-4">Enroll a new security guard, technician, or estate administrator</p>
            <form onSubmit={handleCreateStaff} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Suresh Kumar"
                  value={newStaff.fullName}
                  onChange={(e) => setNewStaff({ ...newStaff, fullName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Role *</label>
                  <select
                    value={newStaff.role}
                    onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                  >
                    <option value="SECURITY_GUARD">Security Guard</option>
                    <option value="MAINTENANCE_STAFF">Maintenance Staff</option>
                    <option value="ACCOUNTANT">Accountant</option>
                    <option value="PROPERTY_MANAGER">Property Manager</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Designation</label>
                  <input
                    type="text"
                    placeholder="e.g. Gate Guard"
                    value={newStaff.designation}
                    onChange={(e) => setNewStaff({ ...newStaff, designation: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 00000"
                    value={newStaff.phone}
                    onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="staff@pramila.com"
                    value={newStaff.email}
                    onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Shift Schedule</label>
                <input
                  type="text"
                  placeholder="e.g. Day Shift (06:00 - 18:00)"
                  value={newStaff.shiftSchedule}
                  onChange={(e) => setNewStaff({ ...newStaff, shiftSchedule: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-700 hover:bg-blue-600 text-white py-3 rounded-xl text-xs font-black shadow-lg shadow-blue-700/20 transition-all"
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
