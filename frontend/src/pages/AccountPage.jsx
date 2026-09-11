import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Edit3,
  LogOut,
  Mail,
  Phone,
  Save,
  Sun,
  User,
  X,
} from 'lucide-react';
import { userApi, authApi } from '../lib/api';

function Avatar({ name }) {
  const initials = name
    ? name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((w) => w[0].toUpperCase())
        .join('')
    : '?';
  return (
    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-saffron to-gold text-3xl font-bold text-white shadow-[0_12px_40px_-16px_rgba(255,153,51,0.6)] sm:h-28 sm:w-28 sm:text-4xl">
      {initials}
    </div>
  );
}

export default function AccountPage({ onNavigate }) {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ fullName: '', phone: '' });
  const [original, setOriginal] = useState({ fullName: '', phone: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);

  const isDirty =
    form.fullName.trim() !== original.fullName ||
    form.phone.trim() !== original.phone;

  useEffect(() => {
    const load = async () => {
      try {
        const data = await userApi.getMe();
        setProfile(data);
        const initial = { fullName: data.fullName || '', phone: data.phone || '' };
        setForm(initial);
        setOriginal(initial);
      } catch (err) {
        setError(err.message || 'Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const updated = await userApi.updateMe({
        fullName: form.fullName.trim() || null,
        phone: form.phone.trim() || null,
      });
      const next = { fullName: updated.user?.fullName || '', phone: updated.user?.phone || '' };
      setOriginal(next);
      setForm(next);
      setProfile((prev) => ({ ...prev, ...next }));
      setSaved(true);
      setEditing(false);
      // Refresh session so Navbar name updates
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('vedaura-session-changed'));
      }
    } catch (err) {
      setError(err.message || 'Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  const handleDiscard = () => {
    setForm(original);
    setEditing(false);
    setSaved(false);
    setError('');
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } finally {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('vedaura-session-changed'));
      }
      onNavigate('Home');
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#fff4df_0%,#fffaf2_38%,#fff_100%)] pb-24 pt-32">
      <section className="mx-auto max-w-3xl px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center gap-3"
        >
          <Sun className="h-5 w-5 animate-[spin_10s_linear_infinite] text-saffron" />
          <span className="text-sm font-semibold uppercase tracking-[0.24em] text-saffron">
            My Account
          </span>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-saffron/20 border-t-saffron" />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="overflow-hidden rounded-[2.5rem] border border-[#f0dfbf] bg-white shadow-[0_28px_90px_-42px_rgba(212,175,55,0.4)]"
          >
            {/* Profile Hero */}
            <div className="relative overflow-hidden bg-[linear-gradient(135deg,#fff8e9_0%,#fff1d6_50%,#fffaf0_100%)] px-8 py-10 sm:px-12">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-saffron/10 blur-3xl" />
              <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-gold/10 blur-3xl" />
              <div className="relative flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-5">
                  <Avatar name={profile?.fullName || 'User'} />
                  <div>
                    <h1 className="font-spiritual text-2xl font-bold text-gray-900 sm:text-3xl">
                      {profile?.fullName || 'Member'}
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">{profile?.email}</p>
                    <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-saffron/15 px-3 py-1 text-xs font-semibold text-saffron">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Verified Member
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {!editing && (
                    <button
                      type="button"
                      id="edit-profile-btn"
                      onClick={() => setEditing(true)}
                      className="flex items-center gap-2 rounded-2xl border border-[#edd9b6] bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-saffron hover:text-saffron"
                    >
                      <Edit3 className="h-4 w-4" /> Edit Profile
                    </button>
                  )}
                  <button
                    type="button"
                    id="logout-btn"
                    onClick={handleLogout}
                    className="flex items-center gap-2 rounded-2xl border border-rose-200 bg-white px-4 py-2.5 text-sm font-semibold text-rose-600 shadow-sm transition hover:bg-rose-50"
                  >
                    <LogOut className="h-4 w-4" /> Sign Out
                  </button>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="px-8 py-10 sm:px-12">
              {error && (
                <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {error}
                </div>
              )}
              {saved && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700"
                >
                  <CheckCircle2 className="h-4 w-4" /> Profile updated successfully!
                </motion.div>
              )}

              <div className="grid gap-6 sm:grid-cols-2">
                {/* Full Name */}
                <div className="sm:col-span-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-gray-600">
                      Full Name
                    </span>
                    <div
                      className={`flex items-center gap-3 rounded-2xl border px-4 py-4 transition ${
                        editing
                          ? 'border-saffron bg-[#fffaf2] ring-2 ring-saffron/15'
                          : 'border-[#edd9b6] bg-[#fffdf7]'
                      }`}
                    >
                      <User className="h-5 w-5 flex-shrink-0 text-saffron" />
                      <input
                        id="account-full-name"
                        type="text"
                        value={form.fullName}
                        onChange={handleChange('fullName')}
                        readOnly={!editing}
                        placeholder="Your full name"
                        className="w-full bg-transparent text-gray-800 outline-none placeholder:text-gray-400"
                      />
                    </div>
                  </label>
                </div>

                {/* Email (read-only always) */}
                <div>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-gray-600">
                      Email Address
                    </span>
                    <div className="flex items-center gap-3 rounded-2xl border border-[#edd9b6] bg-gray-50 px-4 py-4">
                      <Mail className="h-5 w-5 flex-shrink-0 text-gray-400" />
                      <input
                        id="account-email"
                        type="email"
                        value={profile?.email || ''}
                        readOnly
                        className="w-full bg-transparent text-gray-500 outline-none"
                      />
                    </div>
                    <p className="mt-1.5 text-xs text-gray-400">Email cannot be changed</p>
                  </label>
                </div>

                {/* Phone */}
                <div>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-gray-600">
                      Phone Number
                    </span>
                    <div
                      className={`flex items-center gap-3 rounded-2xl border px-4 py-4 transition ${
                        editing
                          ? 'border-saffron bg-[#fffaf2] ring-2 ring-saffron/15'
                          : 'border-[#edd9b6] bg-[#fffdf7]'
                      }`}
                    >
                      <Phone className="h-5 w-5 flex-shrink-0 text-saffron" />
                      <input
                        id="account-phone"
                        type="tel"
                        value={form.phone}
                        onChange={handleChange('phone')}
                        readOnly={!editing}
                        placeholder="+91 98765 43210"
                        className="w-full bg-transparent text-gray-800 outline-none placeholder:text-gray-400"
                      />
                    </div>
                  </label>
                </div>
              </div>

              {/* Action Buttons — only visible when editing and dirty */}
              {editing && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 flex flex-col gap-3 sm:flex-row"
                >
                  {isDirty && (
                    <button
                      id="save-changes-btn"
                      type="button"
                      onClick={handleSave}
                      disabled={saving}
                      className="btn-primary flex flex-1 items-center justify-center gap-2 py-4 text-base"
                    >
                      {saving ? (
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      {saving ? 'Saving…' : 'Save Changes'}
                    </button>
                  )}
                  <button
                    id="discard-changes-btn"
                    type="button"
                    onClick={handleDiscard}
                    className="flex flex-1 items-center justify-center gap-2 rounded-full border border-gray-200 bg-white py-4 text-sm font-semibold text-gray-600 transition hover:border-gray-300 hover:text-gray-800"
                  >
                    <X className="h-4 w-4" /> Discard
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </section>
    </main>
  );
}
