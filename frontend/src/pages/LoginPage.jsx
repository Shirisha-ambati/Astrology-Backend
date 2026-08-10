import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LockKeyhole, Mail, Phone, Sparkles, Sun, User } from 'lucide-react';
import { Breadcrumb } from '../components/shared/PageElements';
import { routes } from '../lib/routes';
import { authApi } from '../lib/api';

const benefits = ['benefit1', 'benefit2', 'benefit3'];

export default function LoginPage({ onNavigate, t }) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const identifier = email.trim() || phone.trim();
    
    if (isLogin) {
      if (!identifier || !password) {
        setError('Please enter an email or phone number, plus your password.');
        return;
      }
    } else {
      if (!email.trim() || !password) {
        setError('Please enter your email and password to register.');
        return;
      }
    }

    setLoading(true);

    try {
      if (isLogin) {
        const data = await authApi.userLogin(identifier, password);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('vedaura-session-changed'));
        }

        if (data.role === 'pandit') {
          onNavigate('Pandit Dashboard');
        } else {
          onNavigate('Home');
        }
      } else {
        await authApi.userRegister({ email: email.trim(), phone: phone.trim(), password, fullName: fullName.trim() });
        // Auto login after successful registration
        await authApi.userLogin(email.trim(), password);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('vedaura-session-changed'));
        }
        onNavigate('Home');
      }
    } catch (err) {
      setError(err.message || (isLogin ? 'Login failed. Please try again.' : 'Registration failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#fff4df_0%,#fffaf2_38%,#fff_100%)] pb-20 pt-32">
      <section className="mx-auto max-w-7xl px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <Breadcrumb currentPage={t('nav.login')} homeLabel={t('breadcrumb.home')} />
        </motion.div>

        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative overflow-hidden rounded-[2.5rem] border border-[#f3d7a7] bg-[linear-gradient(140deg,rgba(255,248,233,0.96)_0%,rgba(255,241,214,0.95)_50%,rgba(255,255,255,0.92)_100%)] p-8 shadow-[0_28px_90px_-42px_rgba(212,175,55,0.45)] md:p-10"
          >
            <div className="absolute -left-14 top-10 h-36 w-36 rounded-full bg-saffron/10 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-44 w-44 rounded-full bg-gold/15 blur-3xl" />

            <div className="relative">
              <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/70 bg-white/70 px-4 py-2 text-sm font-semibold uppercase tracking-[0.24em] text-saffron">
                <Sun className="h-4 w-4" />
                {t('login.sacredAccess')}
              </div>
              <h1 className="max-w-xl font-spiritual text-4xl font-bold leading-tight text-gray-900 md:text-6xl">
                {t('login.heroTitle')}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">
                {t('login.heroDescription')}
              </p>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {benefits.map((benefitKey) => (
                  <div key={benefitKey} className="rounded-[1.75rem] border border-white/80 bg-white/70 p-5 shadow-[0_18px_45px_-34px_rgba(255,153,51,0.35)]">
                    <Sparkles className="mb-3 h-6 w-6 text-saffron" />
                    <p className="text-sm font-medium leading-6 text-gray-700">{t(`login.${benefitKey}`)}</p>
                  </div>
                ))}
              </div>

              <div className="mt-10 rounded-[2rem] border border-[#ecd2a1] bg-[#2f2518] px-6 py-6 text-white shadow-[0_24px_60px_-36px_rgba(47,37,24,0.72)]">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-light">{t('login.benefitsTitle')}</p>
                <div className="mt-4 flex flex-col gap-3 text-sm text-white/80 sm:flex-row sm:items-center sm:justify-between">
                  <span>{t('login.benefit1')}</span>
                  <span>{t('login.benefit2')}</span>
                </div>
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
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-saffron">{isLogin ? t('login.welcomeBack') : 'Join VedAura'}</p>
                <h2 className="font-spiritual text-3xl font-bold text-gray-900">{isLogin ? t('login.formTitle') : 'Create Account'}</h2>
              </div>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {!isLogin && (
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-gray-700">{t('login.fullName') || 'Full Name'}</span>
                  <div className="flex items-center gap-3 rounded-2xl border border-[#edd9b6] bg-[#fffaf2] px-4 py-4 focus-within:border-saffron focus-within:ring-2 focus-within:ring-saffron/20">
                    <User className="h-5 w-5 text-saffron" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(event) => setFullName(event.target.value)}
                      placeholder="Enter your full name"
                      className="w-full bg-transparent text-gray-800 outline-none placeholder:text-gray-400"
                      autoComplete="name"
                    />
                  </div>
                </label>
              )}

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-700">{t('login.email')}</span>
                <div className="flex items-center gap-3 rounded-2xl border border-[#edd9b6] bg-[#fffaf2] px-4 py-4 focus-within:border-saffron focus-within:ring-2 focus-within:ring-saffron/20">
                  <Mail className="h-5 w-5 text-saffron" />
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-transparent text-gray-800 outline-none placeholder:text-gray-400"
                    autoComplete="email"
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-700">{t('login.phone')}</span>
                <div className="flex items-center gap-3 rounded-2xl border border-[#edd9b6] bg-[#fffaf2] px-4 py-4 focus-within:border-saffron focus-within:ring-2 focus-within:ring-saffron/20">
                  <Phone className="h-5 w-5 text-saffron" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-transparent text-gray-800 outline-none placeholder:text-gray-400"
                    autoComplete="tel"
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-700">{t('login.password')}</span>
                <div className="flex items-center gap-3 rounded-2xl border border-[#edd9b6] bg-[#fffaf2] px-4 py-4 focus-within:border-saffron focus-within:ring-2 focus-within:ring-saffron/20">
                  <LockKeyhole className="h-5 w-5 text-saffron" />
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    className="w-full bg-transparent text-gray-800 outline-none placeholder:text-gray-400"
                    autoComplete="current-password"
                  />
                </div>
              </label>

              {error ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {error}
                </div>
              ) : null}

              <div className="flex flex-col gap-3 pt-3 sm:flex-row">
                <button type="submit" className="btn-primary flex-1 py-4 text-base" disabled={loading}>
                  {loading ? (isLogin ? 'Signing in...' : 'Registering...') : (isLogin ? 'Sign In' : 'Register')}
                </button>
                <button type="button" onClick={() => onNavigate('Shop')} className="btn-secondary flex-1 py-4 text-base">
                  {t('login.exploreShop')}
                </button>
              </div>

              <div className="mt-4 text-center">
                <button 
                  type="button" 
                  onClick={() => setIsLogin(!isLogin)} 
                  className="text-sm font-medium text-saffron hover:text-gold"
                >
                  {isLogin ? "Don't have an account? Register here" : "Already have an account? Sign In"}
                </button>
              </div>
            </form>

            <div className="mt-8 rounded-[1.75rem] bg-cream p-5 text-sm leading-7 text-gray-600">
              {t('login.newTo')}
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <button type="button" onClick={() => onNavigate('Home')} className="btn-secondary py-3 text-sm">
                  {t('login.returnHome')}
                </button>
                <a href={routes['Admin Login']} className="inline-flex items-center justify-center rounded-full border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition hover:border-saffron hover:text-saffron">
                  Admin Login
                </a>
              </div>
            </div>
          </motion.section>
        </div>
      </section>
    </main>
  );
}
