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
      <div className="glass-card rounded-3xl p-8 border border-slate-700/80 shadow-2xl">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center mx-auto text-white shadow-lg shadow-emerald-900/30 mb-3">
            <Building2 className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Pramila Apartments</h2>
          <p className="text-xs text-slate-400 mt-1">Sign in to your authenticated portal</p>
        </div>

        {error && (
          <div className="bg-rose-950/40 border border-rose-500/40 text-rose-300 p-3 rounded-xl text-xs flex items-center gap-2 mb-4">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="you@pramila.com"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="••••••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-extrabold py-3 rounded-xl text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all"
          >
            {loading ? 'Authenticating...' : 'Sign In to Portal'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Credentials */}
        <div className="mt-6 pt-5 border-t border-slate-800">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> 1-Click Role Accounts (Demo)
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
                className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between border transition-all ${
                  email === r.email
                    ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div>
                  <span className="font-semibold block">{r.label}</span>
                  <span className="text-[10px] text-slate-500">{r.email}</span>
                </div>
                <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
                  {r.badge}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-slate-400">
          New resident?{' '}
          <Link href="/register" className="text-emerald-400 hover:underline font-semibold">
            Submit Tenant Registration Application
          </Link>
        </div>
      </div>
    </div>
  );
}
