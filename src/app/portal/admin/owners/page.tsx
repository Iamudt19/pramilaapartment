'use client';

import React, { useEffect, useState } from 'react';
import { Users, Plus, Phone, Mail, Building, CreditCard } from 'lucide-react';

export default function OwnersPage() {
  const [owners, setOwners] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newOwner, setNewOwner] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    idProofType: 'AADHAAR',
    idProofNumber: '',
    bankName: '',
    bankAccount: '',
    ifscCode: '',
  });

  const fetchOwners = async () => {
    try {
      const res = await fetch('/api/owners');
      if (res.ok) setOwners((await res.json()).owners || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchOwners();
  }, []);

  const handleCreateOwner = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/owners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOwner),
      });
      if (res.ok) {
        setShowAddModal(false);
        setNewOwner({
          name: '',
          phone: '',
          email: '',
          address: '',
          idProofType: 'AADHAAR',
          idProofNumber: '',
          bankName: '',
          bankAccount: '',
          ifscCode: '',
        });
        fetchOwners();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold mb-2 shadow-sm">
            <Building className="w-3.5 h-3.5 text-blue-600" /> Landlord Registry
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Flat Owners Directory</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">Manage landlords, ownership records, and bank payout details</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl text-xs flex items-center gap-2 transition-all shadow-md shadow-blue-600/20 active:scale-95"
        >
          <Plus className="w-4 h-4" /> Add Flat Owner
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {owners.length === 0 ? (
          <div className="col-span-full bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-md text-slate-500 font-semibold">
            No flat owners registered yet. Click &quot;Add Flat Owner&quot; to begin.
          </div>
        ) : (
          owners.map((owner) => (
            <div key={owner.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md hover:shadow-lg transition-all space-y-4">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center font-black text-lg shadow-sm">
                  {owner.name.charAt(0)}
                </div>
                <span className="text-[11px] font-extrabold bg-slate-100 border border-slate-200 text-slate-700 px-3 py-1 rounded-full">
                  {owner.flats?.length || 0} Flats Owned
                </span>
              </div>

              <div>
                <h3 className="font-black text-slate-900 text-lg">{owner.name}</h3>
                <div className="text-xs text-slate-600 space-y-1.5 mt-2 font-medium">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-blue-600 shrink-0" /> {owner.phone}
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-blue-600 shrink-0" /> {owner.email}
                  </div>
                </div>
              </div>

              {/* Flats Owned List */}
              <div className="border-t border-slate-100 pt-3">
                <span className="text-[10px] text-slate-500 uppercase font-extrabold tracking-wider block mb-1.5">Properties Owned</span>
                <div className="flex flex-wrap gap-1.5">
                  {owner.flats && owner.flats.length > 0 ? (
                    owner.flats.map((f: any) => (
                      <span
                        key={f.id}
                        className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-lg font-mono font-black"
                      >
                        Flat {f.flatNumber}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400 italic">No flats mapped</span>
                  )}
                </div>
              </div>

              {/* Bank details */}
              {owner.bankAccount && (
                <div className="bg-slate-50 p-3 rounded-2xl text-[11px] text-slate-700 border border-slate-200 font-medium">
                  <span className="font-bold text-slate-900 block mb-0.5">Payout Details:</span>
                  <span>Bank: {owner.bankName || 'SBI'} • A/C: {owner.bankAccount}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add Owner Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-4">
            <h3 className="text-xl font-black text-slate-900">Register New Flat Owner</h3>
            <form onSubmit={handleCreateOwner} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Arvind Srivastava"
                  value={newOwner.name}
                  onChange={(e) => setNewOwner({ ...newOwner, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white shadow-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 00000"
                    value={newOwner.phone}
                    onChange={(e) => setNewOwner({ ...newOwner, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white shadow-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="arvind@gmail.com"
                    value={newOwner.email}
                    onChange={(e) => setNewOwner({ ...newOwner, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white shadow-sm"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Bank Name & A/C (For Rent Payouts)</label>
                <input
                  type="text"
                  placeholder="e.g. HDFC Bank, A/C: 50100291829"
                  value={newOwner.bankAccount}
                  onChange={(e) => setNewOwner({ ...newOwner, bankAccount: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white shadow-sm"
                />
              </div>
              <div className="flex gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl text-xs font-bold border border-slate-300 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl text-xs font-black shadow-md shadow-blue-600/20 transition-all active:scale-95"
                >
                  Register Owner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
