import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CalendarRange,
  CheckCircle2,
  Clock3,
  Mail,
  MapPin,
  Phone,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Users,
} from 'lucide-react';
import { Breadcrumb } from '../components/shared/PageElements';
import { loadPanditRegistrations, loadPanditRegistrationsSync } from '../lib/pandits';

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

const demoProfile = {
  fullName: 'Your Pandit Profile',
  specialization: 'Vedic Astrology',
  city: 'Add your city',
  state: 'Add your state',
  country: 'India',
  mobile: 'Add a contact number',
  email: 'Add an email address',
  languages: 'Hindi, English',
  experience: '5',
  mode: 'Online and Offline',
  price: '0',
  timeSlots: '10:00 AM - 6:00 PM',
  freeConsultation: 'No',
  bio: 'Complete the registration form to activate your personalized workspace.',
  services: ['Horoscope Reading', 'Marriage Matching'],
  availableDays: ['Monday', 'Thursday', 'Sunday'],
};

function getCompletionScore(entry) {
  return scoreFields.reduce((count, field) => count + (String(entry?.[field] || '').trim() ? 1 : 0), 0);
}

function getInitials(name = '') {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  return initials || 'P';
}

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

function buildChecklist(entry, hasProfile) {
  if (!hasProfile) {
    return [
      {
        title: 'Create your profile',
        description: 'Finish the registration form to unlock a working dashboard.',
        done: false,
      },
      {
        title: 'Set availability',
        description: 'Add your preferred working days and consultation hours.',
        done: false,
      },
      {
        title: 'Add contact details',
        description: 'Make it easy for clients to reach you through phone and email.',
        done: false,
      },
    ];
  }

  return [
    {
      title: 'Profile basics',
      description: 'Name, mobile, and email are ready for seeker outreach.',
      done: Boolean(entry.fullName && entry.mobile && entry.email),
    },
    {
      title: 'Practice details',
      description: 'Specialization, experience, and bio describe your services clearly.',
      done: Boolean(entry.specialization && entry.experience && entry.bio),
    },
    {
      title: 'Availability',
      description: 'Working days and time slots help clients book the right session.',
      done: Boolean(entry.timeSlots && entry.availableDays?.length),
    },
    {
      title: 'Payments',
      description: 'UPI or bank details are available for future payout setup.',
      done: Boolean(entry.upiId || entry.bankAccount),
    },
  ];
}

function buildSessions(entry, hasProfile) {
  const specialization = entry.specialization || 'Spiritual guidance';
  const mode = entry.mode || 'Online';
  const timeSlots = entry.timeSlots || '10:00 AM - 6:00 PM';
  const dayLabel = hasProfile ? 'Today' : 'Upcoming';

  return [
    {
      title: `${specialization} consultation`,
      client: 'Priya S.',
      slot: `${dayLabel}, ${timeSlots}`,
      note: `${mode} session`,
    },
    {
      title: 'Compatibility review',
      client: 'Arjun M.',
      slot: `${hasProfile ? 'Tomorrow' : 'Soon'}, 1:30 PM`,
      note: 'Follow-up from a new inquiry',
    },
    {
      title: 'Guided remedy call',
      client: 'Neha K.',
      slot: `${hasProfile ? 'Saturday' : 'Planned'}, 5:00 PM`,
      note: entry.freeConsultation === 'Yes' ? 'Free consultation' : 'Paid session',
    },
  ];
}

export default function PanditDashboardPage({ onNavigate }) {
  const [registrations, setRegistrations] = useState(() => loadPanditRegistrationsSync());
  const [lastSync, setLastSync] = useState(() => new Date());

  // Load from database on mount
  useEffect(() => {
    loadPanditRegistrations()
      .then((data) => {
        setRegistrations(data);
        setLastSync(new Date());
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const refreshDashboard = async () => {
      try {
        const data = await loadPanditRegistrations();
        setRegistrations(data);
        setLastSync(new Date());
      } catch {}
    };

    window.addEventListener('storage', refreshDashboard);
    return () => window.removeEventListener('storage', refreshDashboard);
  }, []);

  const activeProfile = registrations[0] || null;
  const profile = activeProfile || demoProfile;
  const hasProfile = Boolean(activeProfile);
  const completionScore = getCompletionScore(profile);
  const completionPercent = Math.round((completionScore / scoreFields.length) * 100);
  const servicesCount = profile.services?.length || 0;
  const availabilityCount = profile.availableDays?.length || 0;
  const checklist = buildChecklist(profile, hasProfile);
  const sessions = buildSessions(profile, hasProfile);

  const metrics = [
    {
      label: 'Profile completion',
      value: `${completionPercent}%`,
      hint: `${completionScore}/10 fields filled`,
      icon: CheckCircle2,
    },
    {
      label: 'Services listed',
      value: String(servicesCount),
      hint: 'Offerings visible in your public profile',
      icon: Sparkles,
    },
    {
      label: 'Working days',
      value: String(availabilityCount),
      hint: profile.timeSlots || 'Time slots not added yet',
      icon: CalendarRange,
    },
    {
      label: 'Current mode',
      value: profile.mode || 'Not set',
      hint: 'How clients can connect with you',
      icon: Phone,
    },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden pb-20 pt-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,214,140,0.34),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(212,175,55,0.16),transparent_28%),linear-gradient(180deg,#fffaf0_0%,#fffdf9_100%)]" />
      <div className="absolute left-0 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-saffron/10 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-96 w-96 translate-x-1/3 rounded-full bg-gold/10 blur-3xl" />

      <section className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <Breadcrumb currentPage="Pandit Dashboard" homeLabel="Home" />
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={async () => {
                try {
                  const data = await loadPanditRegistrations();
                  setRegistrations(data);
                  setLastSync(new Date());
                } catch {}
              }}
              className="inline-flex items-center rounded-full border border-saffron/20 bg-white px-5 py-3 text-sm font-semibold text-saffron shadow-[0_14px_32px_-26px_rgba(255,153,51,0.65)] transition hover:-translate-y-0.5 hover:border-saffron hover:bg-saffron hover:text-white"
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              Refresh dashboard
            </button>
            <button
              type="button"
              onClick={() => onNavigate('Pandit Registration')}
              className="inline-flex items-center rounded-full border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:-translate-y-0.5 hover:border-gray-300 hover:bg-gray-50"
            >
              Edit registration
            </button>
            <button
              type="button"
              onClick={() => onNavigate('Home')}
              className="inline-flex items-center rounded-full border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:-translate-y-0.5 hover:border-saffron hover:text-saffron"
            >
              Back home
            </button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="relative overflow-hidden rounded-[2.5rem] border border-white/70 bg-[linear-gradient(135deg,rgba(38,29,18,0.96)_0%,rgba(93,58,18,0.92)_56%,rgba(255,255,255,0.08)_100%)] p-8 text-white shadow-[0_30px_90px_-50px_rgba(0,0,0,0.58)] md:p-10">
            <div className="absolute -right-10 top-8 h-32 w-32 rounded-full bg-gold/20 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-saffron/15 blur-3xl" />

            <div className="relative">
              <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-gold-light backdrop-blur">
                <ShieldCheck className="h-4 w-4" />
                Pandit workspace
              </div>

              <div className="max-w-3xl">
                <h1 className="font-spiritual text-4xl font-bold leading-tight md:text-6xl">
                  Your spiritual practice dashboard
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-8 text-white/82 md:text-lg">
                  Track your profile readiness, see service visibility, and keep your consultation setup organized in one calm space.
                </p>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-[1.5rem] border border-white/10 bg-white/8 p-5 backdrop-blur">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                    <BarChart3 className="h-5 w-5 text-gold-light" />
                  </div>
                  <p className="text-3xl font-bold">{completionPercent}%</p>
                  <p className="mt-2 text-sm text-white/70">Profile readiness</p>
                </div>
                <div className="rounded-[1.5rem] border border-white/10 bg-white/8 p-5 backdrop-blur">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                    <Users className="h-5 w-5 text-gold-light" />
                  </div>
                  <p className="text-3xl font-bold">{registrations.length}</p>
                  <p className="mt-2 text-sm text-white/70">Saved registration records</p>
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
            <section className="rounded-[2rem] border border-white/70 bg-white/86 p-6 shadow-[0_24px_65px_-42px_rgba(212,175,55,0.42)] backdrop-blur-md">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-saffron">Profile snapshot</p>
                  <h2 className="mt-2 font-spiritual text-2xl font-bold text-gray-900">{profile.fullName}</h2>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-saffron/10 text-saffron">
                  <UserCheck className="h-5 w-5" />
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-[1.5rem] bg-[#fffaf2] p-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#FF9933_0%,#D4AF37_100%)] text-xl font-bold text-white shadow-[0_14px_30px_-18px_rgba(255,153,51,0.7)]">
                  {getInitials(profile.fullName)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-saffron">
                    {profile.specialization || 'Spiritual consultant'}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    {profile.city || 'City not added'}
                    {profile.state ? `, ${profile.state}` : ''}
                    {profile.country ? `, ${profile.country}` : ''}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-3 text-sm text-gray-700 sm:grid-cols-2">
                <div className="rounded-2xl bg-[#fffaf2] px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">Contact</p>
                  <p className="mt-1 flex items-center gap-2">
                    <Phone className="h-4 w-4 text-saffron" />
                    {profile.mobile || 'Mobile not added'}
                  </p>
                  <p className="mt-1 flex items-center gap-2 text-gray-500">
                    <Mail className="h-4 w-4 text-saffron" />
                    {profile.email || 'Email not added'}
                  </p>
                </div>
                <div className="rounded-2xl bg-[#fffaf2] px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">Consultation</p>
                  <p className="mt-1 flex items-center gap-2 font-semibold text-gray-900">
                    <CalendarRange className="h-4 w-4 text-saffron" />
                    {profile.timeSlots || 'Time not added'}
                  </p>
                  <p className="mt-1 text-gray-500">{profile.mode || 'Mode not added'}</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-semibold text-gray-500">
                <span className="rounded-full bg-white px-3 py-1">Experience: {profile.experience || 'N/A'} years</span>
                <span className="rounded-full bg-white px-3 py-1">Updated: {activeProfile ? formatSubmittedAt(activeProfile.id) : 'Demo profile'}</span>
                {profile.freeConsultation === 'Yes' ? (
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700">Free consultation enabled</span>
                ) : (
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-700">Free consultation off</span>
                )}
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/70 bg-white/86 p-6 shadow-[0_24px_65px_-42px_rgba(212,175,55,0.42)] backdrop-blur-md">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-saffron">Profile note</p>
              <p className="mt-3 text-sm leading-7 text-gray-600">
                {profile.bio || 'No bio is available yet. Add a short introduction so seekers understand your style and strengths.'}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {(profile.services || []).slice(0, 4).map((service) => (
                  <span key={service} className="rounded-full bg-saffron/10 px-3 py-1 text-xs font-semibold text-saffron">
                    {service}
                  </span>
                ))}
                {!profile.services?.length ? (
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-500">
                    Services not added
                  </span>
                ) : null}
              </div>
            </section>
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

        <section className="mt-10 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[2.25rem] border border-white/70 bg-white/86 p-6 shadow-[0_22px_60px_-40px_rgba(212,175,55,0.35)] backdrop-blur-md md:p-8">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-saffron">Action plan</p>
                <h2 className="mt-2 font-spiritual text-2xl font-bold text-gray-900">What to finish next</h2>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/10 text-gold">
                <AlertTriangle className="h-5 w-5" />
              </div>
            </div>

            <div className="space-y-4">
              {checklist.map((item) => (
                <div key={item.title} className="rounded-[1.5rem] border border-gray-100 bg-[#fffaf2] p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-400">{item.title}</p>
                      <p className="mt-2 text-sm leading-6 text-gray-700">{item.description}</p>
                    </div>
                    <div
                      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${
                        item.done
                          ? 'border-emerald-200 bg-emerald-100 text-emerald-700'
                          : 'border-amber-200 bg-amber-100 text-amber-700'
                      }`}
                    >
                      {item.done ? (
                        <>
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Ready
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="mr-2 h-4 w-4" />
                          Needs attention
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <section className="rounded-[2.25rem] border border-white/70 bg-white/86 p-6 shadow-[0_22px_60px_-40px_rgba(212,175,55,0.35)] backdrop-blur-md md:p-8">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-saffron">Schedule</p>
                  <h2 className="mt-2 font-spiritual text-2xl font-bold text-gray-900">Upcoming sessions</h2>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-saffron/10 text-saffron">
                  <Clock3 className="h-5 w-5" />
                </div>
              </div>

              <div className="space-y-3">
                {sessions.map((session) => (
                  <div key={`${session.title}-${session.client}`} className="rounded-[1.5rem] border border-gray-100 bg-[#fffaf2] p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{session.title}</p>
                        <p className="mt-1 text-sm text-gray-600">Client: {session.client}</p>
                      </div>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-saffron">
                        {session.slot}
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-gray-500">{session.note}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[2.25rem] border border-white/70 bg-white/86 p-6 shadow-[0_22px_60px_-40px_rgba(212,175,55,0.35)] backdrop-blur-md md:p-8">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-saffron">Quick actions</p>
                  <h2 className="mt-2 font-spiritual text-2xl font-bold text-gray-900">Navigate faster</h2>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/10 text-gold">
                  <Sparkles className="h-5 w-5" />
                </div>
              </div>

              <div className="space-y-3">
                {[
                  {
                    title: 'Edit registration form',
                    description: 'Update your profile details, availability, and documents.',
                    action: () => onNavigate('Pandit Registration'),
                  },
                  {
                    title: 'View public homepage',
                    description: 'See how your profile appears to visitors.',
                    action: () => onNavigate('Home'),
                  },
                  {
                    title: 'Open user login',
                    description: 'Jump back to the general login journey.',
                    action: () => onNavigate('Login'),
                  },
                ].map((item) => (
                  <button
                    key={item.title}
                    type="button"
                    onClick={item.action}
                    className="flex w-full items-center gap-4 rounded-[1.5rem] border border-gray-100 bg-[#fffaf2] px-4 py-4 text-left transition hover:-translate-y-0.5 hover:border-saffron/20 hover:bg-white"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-saffron shadow-[0_14px_30px_-24px_rgba(255,153,51,0.65)]">
                      <ArrowRight className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-900">{item.title}</p>
                      <p className="mt-1 text-sm leading-6 text-gray-600">{item.description}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-saffron" />
                  </button>
                ))}
              </div>
            </section>
          </div>
        </section>
      </section>
    </main>
  );
}
