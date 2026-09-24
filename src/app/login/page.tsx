'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Building2, Lock, Mail, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('admin@pramila.com');
  const [password, setPassword] = useState('Password@123');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const success = await login(email, password);
    if (!success) {
      setError('Invalid email or password. Please check your credentials.');
    }
  };

  const quickRoles = [
    { label: 'Super Admin', email: 'admin@pramila.com', badge: 'Full Access' },
    { label: 'Property Manager', email: 'manager@pramila.com', badge: 'Operations' },
    { label: 'Accountant', email: 'accountant@pramila.com', badge: 'Finance' },
    { label: 'Security Guard', email: 'security@pramila.com', badge: 'Gate Ops' },
    { label: 'Maintenance Staff', email: 'maintenance@pramila.com', badge: 'Technician' },
    { label: 'Tenant (Flat A-101)', email: 'tenant1@pramila.com', badge: 'Resident' },
    { label: 'Tenant (Flat A-201)', email: 'tenant2@pramila.com', badge: 'Resident' },
  ];

  return (
    <div className="max-w-md mx-auto py-8">
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center mx-auto shadow-sm mb-3">
            <Building2 className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Pramila Apartments</h2>
          <p className="text-xs text-slate-500 mt-1">Sign in to your authenticated portal</p>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3.5 rounded-2xl text-xs flex items-center gap-2 mb-4">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition-colors"
                placeholder="you@pramila.com"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition-colors"
                placeholder="••••••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3 rounded-xl text-sm shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all"
          >
            {loading ? 'Authenticating...' : 'Sign In to Portal'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Credentials */}
        <div className="mt-6 pt-5 border-t border-slate-200">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> 1-Click Role Accounts (Demo)
          </div>

          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {quickRoles.map((r) => (
              <button
                key={r.email}
                type="button"
                onClick={() => {
                  setEmail(r.email);
                  setPassword('Password@123');
                }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs flex items-center justify-between border transition-all ${
                  email === r.email
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div>
                  <span className="font-bold block">{r.label}</span>
                  <span className="text-[10px] text-slate-500">{r.email}</span>
                </div>
                <span className="text-[10px] bg-white text-slate-600 border border-slate-200 px-2 py-0.5 rounded font-mono font-medium">
                  {r.badge}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-slate-500">
          New resident?{' '}
          <Link href="/register" className="text-emerald-700 hover:underline font-bold">
            Submit Tenant Registration Application
          </Link>
        </div>
      </div>
    </div>
  );
}
