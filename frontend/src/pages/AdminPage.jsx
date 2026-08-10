import React, { useCallback, useEffect, useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ClipboardList,
  Clock3,
  LayoutDashboard,
  Package,
  RefreshCcw,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Store,
  Users,
  AlertTriangle,
  Trash2,
} from 'lucide-react';
import { Breadcrumb } from '../components/shared/PageElements';
import { signOutAdmin } from '../lib/adminAuth';
import { adminApi } from '../lib/api';
import { products, shopCategories } from '../data/siteContent';

const scoreFields = [
  'fullName',
  'mobile',
  'email',
  'city',
  'specialization',
  'experience',
  'languages',
  'timeSlots',
  'price',
  'bio',
];

function formatSubmittedAt(id) {
  const timestamp = Number(id);
  if (!Number.isFinite(timestamp)) return 'Recently';

  const date = new Date(timestamp);
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

function getCompletionScore(entry) {
  return scoreFields.reduce((count, field) => count + (String(entry?.[field] || '').trim() ? 1 : 0), 0);
}

function getStatus(entry) {
  const score = getCompletionScore(entry);

  if (score >= 8) {
    return {
      label: 'Ready for review',
      tone: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    };
  }

  if (score >= 5) {
    return {
      label: 'Needs follow-up',
      tone: 'bg-amber-100 text-amber-700 border-amber-200',
    };
  }

  return {
    label: 'Incomplete',
    tone: 'bg-rose-100 text-rose-700 border-rose-200',
  };
}

function getInitials(name = '') {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  return initials || 'VA';
}

export default function AdminPage({ onNavigate }) {
  const [registrations, setRegistrations] = useState([]);
  const [users, setUsers] = useState([]);
  const [overview, setOverview] = useState({ users: 0, registrations: 0, pending: 0, approved: 0, rejected: 0 });
  const [lastSync, setLastSync] = useState(() => new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const syncDashboard = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const [overviewData, registrationData, userData] = await Promise.all([
        adminApi.overview(),
        adminApi.registrations(),
        adminApi.users(),
      ]);

      setOverview(overviewData);
      setRegistrations(registrationData);
      setUsers(userData);
      setLastSync(new Date());
    } catch (err) {
      setError(err.message || 'Failed to load admin data.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load from database on mount
  useEffect(() => {
    syncDashboard();
  }, [syncDashboard]);

  useEffect(() => {
    const handleSessionChange = () => syncDashboard();
    window.addEventListener('vedaura-session-changed', handleSessionChange);
    return () => window.removeEventListener('vedaura-session-changed', handleSessionChange);
  }, [syncDashboard]);

  const totalRegistrations = overview.registrations || registrations.length;
  const readyProfiles = registrations.filter((entry) => getCompletionScore(entry) >= 8).length;
  const followUps = registrations.filter((entry) => getCompletionScore(entry) >= 5 && getCompletionScore(entry) < 8).length;
  const incompleteProfiles = registrations.filter((entry) => getCompletionScore(entry) < 5).length;
  const freeConsultations = registrations.filter((entry) => entry.freeConsultation === 'Yes').length;
  const catalogItems = shopCategories.reduce((sum, category) => sum + category.items.length, 0);
  const featuredProducts = products.length;
  const latestRegistration = registrations[0];

  const metrics = [
    {
      label: 'Pandit registrations',
      value: String(totalRegistrations),
      hint: 'Live records from the database',
      icon: Users,
    },
    {
      label: 'Ready profiles',
      value: String(readyProfiles),
      hint: 'Complete enough for review',
      icon: CheckCircle2,
    },
    {
      label: 'Follow-ups',
      value: String(followUps),
      hint: 'Profiles that need a quick call',
      icon: AlertTriangle,
    },
    {
      label: 'Store catalog',
      value: String(catalogItems + featuredProducts),
      hint: `${shopCategories.length} categories and ${featuredProducts} featured products`,
      icon: Package,
    },
  ];

  const recentItems = registrations.slice(0, 4);

  const quickActions = [
    {
      title: 'Review registrations',
      description: 'Open the pandit application flow and check new submissions.',
      icon: ClipboardList,
      action: () => onNavigate('Pandit Registration'),
    },
    {
      title: 'Check the shop',
      description: 'Inspect healing products and category merchandising.',
      icon: ShoppingBag,
      action: () => onNavigate('Shop'),
    },
    {
      title: 'Return to home',
      description: 'See how the public homepage presents current content.',
      icon: Store,
      action: () => onNavigate('Home'),
    },
    {
      title: 'Open member login',
      description: 'Jump back to the login area and confirm the user journey.',
      icon: ShieldCheck,
      action: () => onNavigate('Login'),
    },
  ];

  const systemChecks = [
    {
      label: 'Onboarding queue',
      value: `${overview.pending || 0} pending`,
      note: totalRegistrations > 0 ? 'New providers are waiting for review.' : 'No provider submissions yet.',
    },
    {
      label: 'Consultation offers',
      value: `${freeConsultations} free offers`,
      note: freeConsultations > 0 ? 'At least one pandit has free consultation enabled.' : 'No free consultation offers are marked yet.',
    },
    {
      label: 'Profile completeness',
      value: `${incompleteProfiles} incomplete`,
      note: incompleteProfiles > 0 ? 'Ask for missing contact or service details.' : 'All current profiles look complete.',
    },
  ];

  const handleLogout = async () => {
    await signOutAdmin();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('vedaura-session-changed'));
    }
    onNavigate('Admin Login');
  };

  const updateRegistrationStatus = async (id, status) => {
    try {
      await adminApi.updateRegistrationStatus(id, status);
      await syncDashboard();
    } catch (err) {
      setError(err.message || 'Failed to update registration.');
    }
  };

  const deleteRegistration = async (id) => {
    if (typeof window !== 'undefined' && !window.confirm('Delete this registration?')) return;

    try {
      await adminApi.deleteRegistration(id);
      await syncDashboard();
    } catch (err) {
      setError(err.message || 'Failed to delete registration.');
    }
  };

  const deleteUser = async (id) => {
    if (typeof window !== 'undefined' && !window.confirm('Delete this user?')) return;

    try {
      await adminApi.deleteUser(id);
      await syncDashboard();
    } catch (err) {
      setError(err.message || 'Failed to delete user.');
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden pb-20 pt-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,214,140,0.36),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(255,153,51,0.14),transparent_28%),linear-gradient(180deg,#fffaf0_0%,#fffdf9_100%)]" />
      <div className="absolute left-0 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-saffron/10 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-96 w-96 translate-x-1/3 rounded-full bg-gold/10 blur-3xl" />

      <section className="relative z-10 mx-auto max-w-7xl px-6">
        <div>
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <Breadcrumb currentPage="Admin Console" homeLabel="Home" />
          <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={syncDashboard}
                className="inline-flex items-center rounded-full border border-saffron/20 bg-white px-5 py-3 text-sm font-semibold text-saffron shadow-[0_14px_32px_-26px_rgba(255,153,51,0.65)] transition hover:-translate-y-0.5 hover:border-saffron hover:bg-saffron hover:text-white"
              >
                <RefreshCcw className="mr-2 h-4 w-4" />
                Refresh data
              </button>
              <button
                type="button"
                onClick={() => onNavigate('Home')}
                className="inline-flex items-center rounded-full border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:-translate-y-0.5 hover:border-gray-300 hover:bg-gray-50"
              >
                View home
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center rounded-full border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:-translate-y-0.5 hover:border-saffron hover:text-saffron"
              >
                Logout
              </button>
            </div>
          </div>

          {error ? (
            <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          ) : null}

          {loading ? (
            <div className="mb-6 rounded-2xl border border-saffron/20 bg-white px-4 py-3 text-sm text-gray-600">
              Syncing admin data from the server...
            </div>
          ) : null}

          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <section className="relative overflow-hidden rounded-[2.5rem] border border-white/70 bg-[linear-gradient(135deg,rgba(38,29,18,0.96)_0%,rgba(93,58,18,0.92)_56%,rgba(255,255,255,0.08)_100%)] p-8 text-white shadow-[0_30px_90px_-50px_rgba(0,0,0,0.58)] md:p-10">
              <div className="absolute -right-10 top-8 h-32 w-32 rounded-full bg-gold/20 blur-3xl" />
              <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-saffron/15 blur-3xl" />

              <div className="relative">
                <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-gold-light backdrop-blur">
                  <LayoutDashboard className="h-4 w-4" />
                  Operations hub
                </div>

                <div className="max-w-3xl">
                  <h1 className="font-spiritual text-4xl font-bold leading-tight md:text-6xl">
                    Admin Console for VedAura
                  </h1>
                  <p className="mt-5 max-w-2xl text-base leading-8 text-white/82 md:text-lg">
                    Track pandit onboarding, monitor the healing shop catalog, and keep the public journey moving with a single command center.
                  </p>
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-[1.5rem] border border-white/10 bg-white/8 p-5 backdrop-blur">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                      <BarChart3 className="h-5 w-5 text-gold-light" />
                    </div>
                    <p className="text-3xl font-bold">{catalogItems + featuredProducts}</p>
                    <p className="mt-2 text-sm text-white/70">Total catalog items</p>
                  </div>
                  <div className="rounded-[1.5rem] border border-white/10 bg-white/8 p-5 backdrop-blur">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                      <Sparkles className="h-5 w-5 text-gold-light" />
                    </div>
                    <p className="text-3xl font-bold">{freeConsultations}</p>
                    <p className="mt-2 text-sm text-white/70">Free consultation offers</p>
                  </div>
                  <div className="rounded-[1.5rem] border border-white/10 bg-white/8 p-5 backdrop-blur">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                      <Clock3 className="h-5 w-5 text-gold-light" />
                    </div>
                    <p className="text-3xl font-bold">{lastSync.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</p>
                    <p className="mt-2 text-sm text-white/70">Last dashboard sync</p>
                  </div>
                </div>
              </div>
            </section>

            <div className="space-y-6">
              <section className="rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-[0_24px_65px_-42px_rgba(212,175,55,0.42)] backdrop-blur-md">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-saffron">Live summary</p>
                    <h2 className="mt-2 font-spiritual text-2xl font-bold text-gray-900">Platform health</h2>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-saffron/10 text-saffron">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                </div>

                <div className="space-y-3">
                  {systemChecks.map((item) => (
                    <div key={item.label} className="rounded-[1.5rem] border border-gray-100 bg-[#fffaf2] p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-gray-500">{item.label}</p>
                          <p className="mt-1 text-lg font-bold text-gray-900">{item.value}</p>
                        </div>
                        <CheckCircle2 className="mt-1 h-5 w-5 text-emerald-500" />
                      </div>
                      <p className="mt-3 text-sm leading-6 text-gray-600">{item.note}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-[0_24px_65px_-42px_rgba(212,175,55,0.42)] backdrop-blur-md">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-saffron">Review queue</p>
                <div className="mt-4 rounded-[1.5rem] border border-dashed border-saffron/20 bg-saffron/5 p-5">
                  <p className="text-sm leading-7 text-gray-700">
                    {latestRegistration
                      ? `Latest submission: ${latestRegistration.fullName || 'Unnamed profile'} from ${latestRegistration.city || 'an undisclosed location'}`
                      : 'No registrations have been submitted yet.'}
                  </p>
                  <p className="mt-2 text-sm text-gray-500">
                    {latestRegistration ? `Submitted ${formatSubmittedAt(latestRegistration.id)}.` : 'Ask providers to complete the pandit registration form to populate this queue.'}
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>

        <section className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => {
            const Icon = metric.icon;

            return (
              <div
                key={metric.label}
                className="rounded-[1.75rem] border border-white/70 bg-white/85 p-6 shadow-[0_22px_50px_-34px_rgba(0,0,0,0.18)] backdrop-blur-md"
              >
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-saffron/10 text-saffron">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="rounded-full border border-saffron/15 bg-saffron/8 px-3 py-1 text-xs font-semibold text-saffron">
                    Live
                  </span>
                </div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">{metric.label}</p>
                <p className="mt-3 text-4xl font-bold text-gray-900">{metric.value}</p>
                <p className="mt-3 text-sm leading-6 text-gray-600">{metric.hint}</p>
              </div>
            );
          })}
        </section>

        <section className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2.25rem] border border-white/70 bg-white/86 p-6 shadow-[0_22px_60px_-40px_rgba(212,175,55,0.35)] backdrop-blur-md md:p-8">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-saffron">Recent activity</p>
                <h2 className="mt-2 font-spiritual text-2xl font-bold text-gray-900">Pandit registrations</h2>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/10 text-gold">
                <Users className="h-5 w-5" />
              </div>
            </div>

            {recentItems.length > 0 ? (
              <div className="space-y-4">
                {recentItems.map((entry, index) => {
                  const status = getStatus(entry);

                  return (
                    <div key={entry.id || `${entry.fullName}-${index}`} className="rounded-[1.5rem] border border-gray-100 bg-[#fffaf2] p-5">
                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#FF9933_0%,#D4AF37_100%)] text-lg font-bold text-white shadow-[0_14px_30px_-18px_rgba(255,153,51,0.7)]">
                            {getInitials(entry.fullName)}
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">{entry.fullName || 'Unnamed provider'}</h3>
                            <p className="mt-1 text-sm text-gray-500">
                              {entry.specialization || 'Specialization not added'}
                              {entry.city ? ` - ${entry.city}` : ''}
                            </p>
                          </div>
                        </div>

                        <div className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${status.tone}`}>
                          {status.label}
                        </div>
                      </div>

                      <div className="mt-4 grid gap-3 text-sm text-gray-700 sm:grid-cols-2">
                        <div className="rounded-2xl bg-white px-4 py-3">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">Contact</p>
                          <p className="mt-1">{entry.mobile || 'Mobile not added'}</p>
                          <p className="mt-1 text-gray-500">{entry.email || 'Email not added'}</p>
                        </div>
                        <div className="rounded-2xl bg-white px-4 py-3">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">Consultation</p>
                          <p className="mt-1 font-semibold text-gray-900">{entry.price ? `Rs ${entry.price}` : 'Price not added'}</p>
                          <p className="mt-1 text-gray-500">{entry.mode || 'Mode not added'}</p>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => updateRegistrationStatus(entry.id, 'approved')}
                          className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => updateRegistrationStatus(entry.id, 'rejected')}
                          className="rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-semibold text-amber-700 transition hover:bg-amber-100"
                        >
                          Reject
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteRegistration(entry.id)}
                          className="inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
                        >
                          <Trash2 className="mr-2 h-3.5 w-3.5" />
                          Delete
                        </button>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-semibold text-gray-500">
                        <span className="rounded-full bg-white px-3 py-1">Experience: {entry.experience || 'N/A'}</span>
                        <span className="rounded-full bg-white px-3 py-1">Submitted: {formatSubmittedAt(entry.id)}</span>
                        {entry.freeConsultation === 'Yes' ? (
                          <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700">Free consultation</span>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-[1.75rem] border border-dashed border-saffron/25 bg-[#fffaf2] px-6 py-12 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-saffron/10 text-saffron">
                  <ClipboardList className="h-7 w-7" />
                </div>
                <h3 className="mt-5 text-2xl font-spiritual font-bold text-gray-900">No registrations yet</h3>
                <p className="mx-auto mt-3 max-w-xl text-gray-600">
                  The admin dashboard will automatically populate once a pandit submits the registration form.
                </p>
                <button
                  type="button"
                  onClick={() => onNavigate('Pandit Registration')}
                  className="mt-8 inline-flex items-center rounded-full bg-saffron px-6 py-3 font-semibold text-white transition hover:bg-saffron/90"
                >
                  Open registration form
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <section className="rounded-[2.25rem] border border-white/70 bg-white/86 p-6 shadow-[0_22px_60px_-40px_rgba(212,175,55,0.35)] backdrop-blur-md md:p-8">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-saffron">System controls</p>
                  <h2 className="mt-2 font-spiritual text-2xl font-bold text-gray-900">Quick actions</h2>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-saffron/10 text-saffron">
                  <Store className="h-5 w-5" />
                </div>
              </div>

              <div className="space-y-3">
                {quickActions.map((item) => {
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.title}
                      type="button"
                      onClick={item.action}
                      className="flex w-full items-center gap-4 rounded-[1.5rem] border border-gray-100 bg-[#fffaf2] px-4 py-4 text-left transition hover:-translate-y-0.5 hover:border-saffron/20 hover:bg-white"
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-saffron shadow-[0_14px_30px_-24px_rgba(255,153,51,0.65)]">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-gray-900">{item.title}</p>
                        <p className="mt-1 text-sm leading-6 text-gray-600">{item.description}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 shrink-0 text-saffron" />
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="rounded-[2.25rem] border border-white/70 bg-white/86 p-6 shadow-[0_22px_60px_-40px_rgba(212,175,55,0.35)] backdrop-blur-md md:p-8">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-saffron">Snapshot</p>
                  <h2 className="mt-2 font-spiritual text-2xl font-bold text-gray-900">Inventory overview</h2>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/10 text-gold">
                  <ShoppingBag className="h-5 w-5" />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.5rem] border border-gray-100 bg-[#fffaf2] p-4">
                  <p className="text-sm font-semibold text-gray-500">Featured products</p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">{featuredProducts}</p>
                  <p className="mt-2 text-sm text-gray-600">Best sellers and curated showcase items.</p>
                </div>
                <div className="rounded-[1.5rem] border border-gray-100 bg-[#fffaf2] p-4">
                  <p className="text-sm font-semibold text-gray-500">Catalog categories</p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">{shopCategories.length}</p>
                  <p className="mt-2 text-sm text-gray-600">Rudraksha, crystals, ritual tools, and more.</p>
                </div>
              </div>
            </section>

            <section className="rounded-[2.25rem] border border-white/70 bg-white/86 p-6 shadow-[0_22px_60px_-40px_rgba(212,175,55,0.35)] backdrop-blur-md md:p-8">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-saffron">Users</p>
                  <h2 className="mt-2 font-spiritual text-2xl font-bold text-gray-900">Registered members</h2>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-saffron/10 text-saffron">
                  <Users className="h-5 w-5" />
                </div>
              </div>

              {users.length > 0 ? (
                <div className="space-y-3">
                  {users.slice(0, 4).map((user) => (
                    <div key={user.id} className="rounded-[1.5rem] border border-gray-100 bg-[#fffaf2] p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{user.fullName || 'Unnamed user'}</p>
                          <p className="mt-1 text-sm text-gray-500">{user.email}</p>
                          <p className="mt-1 text-sm text-gray-500">{user.phone || 'No phone added'}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => deleteUser(user.id)}
                          className="inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
                        >
                          <Trash2 className="mr-2 h-3.5 w-3.5" />
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-[1.5rem] border border-dashed border-saffron/20 bg-saffron/5 px-4 py-6 text-sm text-gray-600">
                  No registered users found yet.
                </div>
              )}
            </section>
          </div>
        </section>
      </section>
    </main>
  );
}
