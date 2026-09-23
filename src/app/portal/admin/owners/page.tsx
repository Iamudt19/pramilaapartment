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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Flat Owners Directory</h1>
          <p className="text-xs text-slate-400 mt-1">Manage landlords, ownership records, and bank payout details</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4" /> Add Flat Owner
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {owners.map((owner) => (
          <div key={owner.id} className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm">
                {owner.name.charAt(0)}
              </div>
              <span className="text-[10px] font-bold bg-slate-900 border border-slate-700 text-slate-300 px-2 py-0.5 rounded-full">
                {owner.flats?.length || 0} Flats Owned
              </span>
            </div>

            <div>
              <h3 className="font-bold text-white text-base">{owner.name}</h3>
              <div className="text-xs text-slate-400 space-y-1 mt-2">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-500" /> {owner.phone}
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-500" /> {owner.email}
                </div>
              </div>
            </div>

            {/* Flats Owned List */}
            <div className="border-t border-slate-800/80 pt-3">
              <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1.5">Properties Owned</span>
              <div className="flex flex-wrap gap-1.5">
                {owner.flats?.map((f: any) => (
                  <span
                    key={f.id}
                    className="text-xs bg-slate-950 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono font-bold"
                  >
                    {f.flatNumber}
                  </span>
                ))}
              </div>
            </div>

            {/* Bank details */}
            {owner.bankAccount && (
              <div className="bg-slate-950/60 p-2.5 rounded-xl text-[11px] text-slate-400 border border-slate-800/80">
                <span>Bank: {owner.bankName || 'SBI'} • A/C: {owner.bankAccount}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Owner Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Register New Flat Owner</h3>
            <form onSubmit={handleCreateOwner} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Arvind Srivastava"
                  value={newOwner.name}
                  onChange={(e) => setNewOwner({ ...newOwner, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 00000"
                    value={newOwner.phone}
                    onChange={(e) => setNewOwner({ ...newOwner, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="arvind@gmail.com"
                    value={newOwner.email}
                    onChange={(e) => setNewOwner({ ...newOwner, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Bank Name & A/C (For Rent Payouts)</label>
                <input
                  type="text"
                  placeholder="e.g. HDFC Bank, A/C: 50100291829"
                  value={newOwner.bankAccount}
                  onChange={(e) => setNewOwner({ ...newOwner, bankAccount: e.target.value })}
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
