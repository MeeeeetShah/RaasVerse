'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Lock, Mail, ShieldAlert, ArrowRight } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed. Invalid credentials.');
      }

      // Successful login
      router.push('/admin/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#06070a] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute w-96 h-96 bg-rose-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none top-10 right-10" />

      <div className="w-full max-w-md relative z-10">
        {/* Card */}
        <div className="rounded-3xl glass-panel border border-rose-900/40 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)] space-y-6">
          {/* Logo & Header */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-full overflow-hidden p-[2px] bg-gradient-to-tr from-rose-600 to-amber-500 mx-auto shadow-lg">
              <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                <Image
                  src="/assets/logo.png"
                  alt="RaasVerse Logo"
                  width={64}
                  height={64}
                  priority
                  className="rounded-full object-cover scale-105"
                />
              </div>
            </div>

            <div className="pt-2">
              <h1 className="text-2xl font-black text-white tracking-wide">
                SUPER ADMIN <span className="text-rose-500">PORTAL</span>
              </h1>
              <p className="text-xs text-amber-400/90 uppercase tracking-widest font-medium">
                RaasVerse Event Management
              </p>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1 text-left">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-300">
                Super Admin Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@yourdomain.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 text-sm"
                />
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1 text-left">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-300">
                Secret Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 text-sm"
                />
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5 pointer-events-none" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white btn-primary-glow flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'Access Admin Hub'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Security notice */}
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-[11px] text-gray-400 text-center flex items-center justify-center gap-2">
            <Lock className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span>Restricted portal for authorized Super Administrators only.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
