import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, LockKeyhole, Mail, ShieldCheck, Sparkles } from 'lucide-react';
import { Breadcrumb } from '../components/shared/PageElements';
import { signInAdmin, adminCredentials } from '../lib/adminAuth';

export default function AdminLoginPage({ onNavigate }) {
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showCredentials, setShowCredentials] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const result = await signInAdmin(account.trim(), password);
      if (!result.success) {
        setError(result.message);
        return;
      }
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('vedaura-session-changed'));
      }
      onNavigate('Admin');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#fff4df_0%,#fffaf2_38%,#fff_100%)] pb-20 pt-32">
      <section className="mx-auto max-w-7xl px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <Breadcrumb currentPage="Admin Login" homeLabel="Home" />
        </motion.div>

        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative overflow-hidden rounded-[2.5rem] border border-[#f3d7a7] bg-[linear-gradient(140deg,rgba(38,29,18,0.96)_0%,rgba(93,58,18,0.9)_52%,rgba(255,255,255,0.9)_100%)] p-8 text-white shadow-[0_28px_90px_-42px_rgba(212,175,55,0.45)] md:p-10"
          >
            <div className="absolute -left-14 top-10 h-36 w-36 rounded-full bg-saffron/15 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-44 w-44 rounded-full bg-gold/20 blur-3xl" />

            <div className="relative">
              <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.24em] text-gold-light backdrop-blur">
                <ShieldCheck className="h-4 w-4" />
                Protected access
              </div>
              <h1 className="max-w-xl font-spiritual text-4xl font-bold leading-tight md:text-6xl">
                Admin access for the VedAura dashboard
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/80">
                Sign in to review registrations, monitor the store catalog, and manage the internal console.
              </p>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {[
                  'Review new pandit applications',
                  'Track store and catalog updates',
                  'Secure access to operations',
                ].map((item) => (
                  <div key={item} className="rounded-[1.75rem] border border-white/15 bg-white/10 p-5 backdrop-blur">
                    <Sparkles className="mb-3 h-6 w-6 text-gold-light" />
                    <p className="text-sm font-medium leading-6 text-white/85">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-[2.5rem] border border-[#f0dfbf] bg-white p-8 shadow-[0_26px_80px_-46px_rgba(212,175,55,0.48)] md:p-10"
          >
            <div className="mb-8 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#FF9933_0%,#D4AF37_100%)] text-white shadow-[0_20px_35px_-20px_rgba(255,153,51,0.65)]">
                <LockKeyhole className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-saffron">Admin login</p>
                <h2 className="font-spiritual text-3xl font-bold text-gray-900">Enter your credentials</h2>
              </div>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-700">Account</span>
                <div className="flex items-center gap-3 rounded-2xl border border-[#edd9b6] bg-[#fffaf2] px-4 py-4 focus-within:border-saffron focus-within:ring-2 focus-within:ring-saffron/20">
                  <Mail className="h-5 w-5 text-saffron" />
                  <input
                    type="email"
                    value={account}
                    onChange={(event) => setAccount(event.target.value)}
                    placeholder="admin@vedaura.com"
                    className="w-full bg-transparent text-gray-800 outline-none placeholder:text-gray-400"
                    autoComplete="username"
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-700">Admin Password</span>
                <div className="flex items-center gap-3 rounded-2xl border border-[#edd9b6] bg-[#fffaf2] px-4 py-4 focus-within:border-saffron focus-within:ring-2 focus-within:ring-saffron/20">
                  <LockKeyhole className="h-5 w-5 text-saffron" />
                  <input
                    type={showCredentials ? 'text' : 'password'}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter admin password"
                    className="w-full bg-transparent text-gray-800 outline-none placeholder:text-gray-400"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCredentials((value) => !value)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-500 transition hover:text-saffron"
                    aria-label="Toggle password visibility"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </label>

              {error ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {error}
                </div>
              ) : null}

              <div className="flex flex-col gap-3 pt-3 sm:flex-row">
                <button type="submit" className="btn-primary flex-1 py-4 text-base">
                  Login to Admin
                </button>
                <button type="button" onClick={() => onNavigate('Login')} className="btn-secondary flex-1 py-4 text-base">
                  User Login
                </button>
              </div>
            </form>

            <div className="mt-8 rounded-[1.75rem] bg-cream p-5 text-sm leading-7 text-gray-600">
              Demo credentials:
              <div className="mt-2 font-semibold text-gray-900">{adminCredentials.username}</div>
              <div className="text-gray-700">{adminCredentials.password}</div>
              <p className="mt-3 text-gray-500">
                This login is backed by the API and a server-issued session cookie.
              </p>
            </div>
          </motion.section>
        </div>
      </section>
    </main>
  );
}
