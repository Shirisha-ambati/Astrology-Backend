import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Award, Brain, CheckCircle2, ChevronRight, Clock, Heart, Info, Mail, MapPin, MessageCircle, Phone, PhoneCall, Star, UserPlus, X } from 'lucide-react';
import { offerings, products } from '../data/siteContent';
import { loadPanditRegistrations, loadPanditRegistrationsSync } from '../lib/pandits';

export default function HomePage({ onNavigate, t }) {
  const [pandits, setPandits] = useState(() => loadPanditRegistrationsSync());
  const [selectedPandit, setSelectedPandit] = useState(null);
  const [consultingPandit, setConsultingPandit] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchPandits = async () => {
      try {
        const data = await loadPanditRegistrations();
        if (isMounted && Array.isArray(data)) {
          setPandits(data);
        }
      } catch (err) {
        console.error('Failed to fetch pandits:', err);
      }
    };

    fetchPandits();

    const handleRefresh = () => fetchPandits();
    window.addEventListener('storage', handleRefresh);
    window.addEventListener('vedaura-session-changed', handleRefresh);

    return () => {
      isMounted = false;
      window.removeEventListener('storage', handleRefresh);
      window.removeEventListener('vedaura-session-changed', handleRefresh);
    };
  }, []);

  const formatArrayField = (val) => {
    if (Array.isArray(val)) return val;
    if (typeof val === 'string' && val.trim()) return val.split(',').map((s) => s.trim());
    return [];
  };

  const renderInitials = (fullName = '') => {
    const initials = fullName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('');

    return initials || 'P';
  };

  return (
    <>
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden pb-20 pt-28 sm:pt-32 lg:pb-32 lg:pt-48">
        <div className="absolute inset-0 overflow-hidden">
          <video autoPlay muted loop playsInline className="w-full h-full object-cover absolute inset-0">
            <source src="/Video Project 1.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <div className="relative z-10 mx-auto w-full max-w-4xl px-4 text-center sm:px-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.28em] text-saffron drop-shadow-md sm:text-base md:text-lg">{t('home.heroEyebrow')}</p>
            <h1 className="mb-6 text-4xl font-spiritual font-bold leading-tight text-white drop-shadow-lg sm:text-5xl lg:text-7xl">
              {t('home.heroTitle')}
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-base font-medium text-gray-200 sm:text-lg md:text-xl">
              {t('home.heroDescription')}
            </p>
            <div className="flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row sm:gap-6">
              <button type="button" onClick={() => onNavigate('Horoscope')} className="btn-primary w-full px-8 py-4 text-base sm:w-auto sm:text-lg">{t('home.horoscopeCta')}</button>
              <button type="button" onClick={() => onNavigate('Login')} className="btn-secondary flex w-full items-center justify-center gap-2 border-white/30 bg-white/10 px-8 py-4 text-base text-white backdrop-blur-md hover:bg-white/20 sm:w-auto sm:text-lg">
                <MessageCircle className="w-6 h-6" />
                {t('home.loginCta')}
              </button>
              <button type="button" onClick={() => onNavigate('Pandit Registration')} className="btn-secondary flex w-full items-center justify-center gap-2 border-white/30 bg-white/10 px-8 py-4 text-base text-white backdrop-blur-md hover:bg-white/20 sm:w-auto sm:text-lg">
                <UserPlus className="w-6 h-6" />
                Pandit Registration
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-spiritual font-bold text-gray-900 mb-4">{t('home.offeringsTitle')}</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-saffron to-gold mx-auto rounded-full"></div>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 sm:gap-8">
            {offerings.map((item, index) => (
              <motion.button
                key={index}
                type="button"
                onClick={() => onNavigate(item.route)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="glass-card p-8 group text-left w-full cursor-pointer transition-shadow hover:shadow-[0_24px_60px_-30px_rgba(255,153,51,0.35)]"
              >
                <div className="w-14 h-14 bg-saffron/10 rounded-2xl flex items-center justify-center text-saffron mb-6 group-hover:bg-saffron group-hover:text-white transition-colors">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 font-spiritual">{item.title}</h3>
                <p className="text-gray-600 mb-4">{item.desc}</p>
                <div className="flex items-center text-saffron font-medium text-sm group-hover:gap-2 transition-all">
                  {t('home.explore')} <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="mb-4 text-3xl font-spiritual font-bold text-gray-900 lg:text-4xl">Registered Pandits</h2>
              <p className="text-gray-600">Profiles added through the registration form appear here automatically.</p>
            </div>
            <button type="button" onClick={() => onNavigate('Pandit Registration')} className="mt-2 inline-flex items-center rounded-full border border-saffron px-5 py-3 text-sm font-semibold text-saffron transition hover:bg-saffron hover:text-white md:mt-0">
              Register Pandit <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>

          {pandits.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {pandits.map((pandit, index) => (
                <motion.div
                  key={pandit.id || `${pandit.fullName}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.35, delay: index * 0.04 }}
                  className="rounded-[1.75rem] border border-gray-200 bg-white p-5 shadow-[0_20px_55px_-38px_rgba(0,0,0,0.2)]"
                >
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#FF9933_0%,#D4AF37_100%)] text-xl font-bold text-white shadow-[0_16px_30px_-18px_rgba(255,153,51,0.7)]">
                        {renderInitials(pandit.fullName)}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{pandit.fullName || 'Pandit'}</h3>
                        <p className="mt-1 text-sm text-gray-500">{pandit.specialization || 'Spiritual Consultant'}</p>
                      </div>
                    </div>
                    <button type="button" className="rounded-full border border-teal-600 px-4 py-2 text-sm font-semibold text-teal-700">
                      + Follow
                    </button>
                  </div>

                  <div className="space-y-2 text-sm text-gray-700">
                    <div>{pandit.languages || 'Hindi, English'}</div>
                    <div>{pandit.experience ? `${pandit.experience} Years` : 'Experience not added'}</div>
                    <div>{[pandit.city, pandit.state, pandit.country].filter(Boolean).join(', ') || 'Location not added'}</div>
                  </div>

                  <div className="mt-5 border-t border-gray-100 pt-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-saffron">Consultation</p>
                        <p className="mt-1 text-sm font-semibold text-gray-900">
                          {pandit.price ? `Rs ${pandit.price}/Session` : 'Price on request'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setConsultingPandit(pandit)}
                          className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:border-saffron hover:text-saffron transition-colors"
                        >
                          Chat
                        </button>
                        <button
                          type="button"
                          onClick={() => setConsultingPandit(pandit)}
                          className="inline-flex items-center rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:border-saffron hover:text-saffron transition-colors"
                        >
                          <Phone className="mr-2 h-4 w-4" />
                          Call
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-3">
                      <div className="flex flex-wrap gap-2">
                        {pandit.mode ? (
                          <span className="rounded-full bg-saffron/10 px-3 py-1 text-xs font-semibold text-saffron">{pandit.mode}</span>
                        ) : null}
                        {pandit.freeConsultation === 'Yes' ? (
                          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">Free Consultation</span>
                        ) : null}
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedPandit(pandit)}
                        className="inline-flex items-center rounded-full bg-saffron px-4 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-saffron/90"
                      >
                        Know More <Info className="ml-1.5 h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="rounded-[2rem] border border-dashed border-[#f0dfbf] bg-[#fffaf2] px-6 py-14 text-center">
              <h3 className="text-2xl font-spiritual font-bold text-gray-900">No pandits registered yet</h3>
              <p className="mx-auto mt-4 max-w-2xl text-gray-600">
                Once a pandit submits the registration form, their profile will show up here in a card layout.
              </p>
              <button type="button" onClick={() => onNavigate('Pandit Registration')} className="mt-8 inline-flex items-center rounded-full bg-saffron px-6 py-3 font-semibold text-white hover:bg-saffron/90">
                Register the first pandit <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="py-24 bg-cream">
          <div className="max-w-7xl mx-auto grid items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
            <div className="glass-card p-8 border-t-4 border-t-saffron">
              <div className="flex items-center gap-4 mb-8">
                <Brain className="text-saffron w-10 h-10" />
                <div>
                  <h3 className="text-2xl font-spiritual font-bold">{t('home.astroTitle')}</h3>
                  <p className="text-gray-500 text-sm">{t('home.astroDescription')}</p>
                </div>
              </div>
            <div className="space-y-5">
              {['Emotional Balance 85%', 'Focus & Clarity 92%', 'Stress Resilience 78%'].map((item) => (
                <div key={item} className="text-gray-700">{item}</div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-saffron font-bold tracking-widest uppercase text-sm mb-4">{t('home.astroTitle')}</p>
            <h2 className="mb-6 text-3xl font-spiritual font-bold text-gray-900 sm:text-4xl lg:text-5xl">
              {t('home.astroTitle')}
            </h2>
            <p className="mb-8 text-base text-gray-600 sm:text-lg">
              {t('home.astroDescription')}
            </p>
            <button type="button" onClick={() => onNavigate('Astro-Neuro')} className="btn-primary">{t('home.astroCta')}</button>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h2 className="text-3xl lg:text-4xl font-spiritual font-bold text-gray-900 mb-4">{t('home.healingTitle')}</h2>
              <p className="text-gray-600">{t('home.healingDescription')}</p>
            </div>
            <button type="button" onClick={() => onNavigate('Shop')} className="mt-4 flex items-center text-saffron font-medium hover:underline md:mt-0">
              {t('home.viewAllProducts')} <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <div key={product.name} className="group cursor-pointer" onClick={() => onNavigate('Shop')}>
                <div className="relative h-64 bg-cream rounded-2xl mb-4 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="hidden h-full w-full items-center justify-center">
                    <Star className="text-gold/50 w-12 h-12" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <h3 className="font-bold text-gray-900 font-spiritual text-lg">{product.name}</h3>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-saffron font-semibold">{product.price}</span>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onNavigate('Shop'); }}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    aria-label="Add to wishlist"
                  >
                    <Heart className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pandit Full Info Modal */}
      {selectedPandit ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm sm:p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-[2.5rem] border border-[#f0dfbf] bg-white shadow-2xl"
          >
            {/* Close Button — sits above the scroll area */}
            <button
              type="button"
              onClick={() => setSelectedPandit(null)}
              className="absolute right-6 top-6 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100/80 text-gray-500 hover:bg-saffron hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Scrollable body */}
            <div className="custom-scrollbar overflow-y-auto p-6 sm:p-8">

              {/* Header Profile */}
              <div className="mb-6 flex items-start gap-5">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#FF9933_0%,#D4AF37_100%)] text-2xl font-bold text-white shadow-[0_16px_30px_-14px_rgba(255,153,51,0.7)]">
                  {renderInitials(selectedPandit.fullName)}
                </div>
                <div className="min-w-0 flex-1 pr-8">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-spiritual text-2xl font-bold text-gray-900">{selectedPandit.fullName || 'Pandit'}</h3>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-semibold text-emerald-700">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Verified
                    </span>
                  </div>
                  <p className="mt-1 text-base font-medium text-saffron">{selectedPandit.specialization || 'Spiritual Consultant'}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                    {selectedPandit.experience ? (
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-saffron" /> {selectedPandit.experience} Years Experience
                      </span>
                    ) : null}
                    {[selectedPandit.city, selectedPandit.state, selectedPandit.country].filter(Boolean).length > 0 ? (
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-saffron" /> {[selectedPandit.city, selectedPandit.state, selectedPandit.country].filter(Boolean).join(', ')}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="space-y-6 border-t border-gray-100 pt-6">
                {/* Bio */}
                {selectedPandit.bio ? (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-saffron">About / Bio</h4>
                    <p className="mt-2 rounded-2xl bg-[#fffaf2] p-4 text-sm leading-6 text-gray-700 border border-[#f7e8ce]">
                      {selectedPandit.bio}
                    </p>
                  </div>
                ) : null}

                {/* Grid Info */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-400">Languages Known</p>
                    <p className="mt-1 font-semibold text-gray-800">{selectedPandit.languages || 'Not specified'}</p>
                  </div>
                  <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-400">Gender / DOB</p>
                    <p className="mt-1 font-semibold text-gray-800">
                      {[selectedPandit.gender, selectedPandit.dob ? selectedPandit.dob.split('T')[0] : ''].filter(Boolean).join(' • ') || 'Not specified'}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-400">Contact Details</p>
                    {selectedPandit.mobile ? (
                      <p className="mt-1 flex items-center text-sm font-semibold text-gray-800">
                        <Phone className="mr-2 h-4 w-4 text-saffron" /> {selectedPandit.mobile}
                      </p>
                    ) : null}
                    {selectedPandit.email ? (
                      <p className="mt-1 flex items-center text-sm font-semibold text-gray-800">
                        <Mail className="mr-2 h-4 w-4 text-saffron" /> {selectedPandit.email}
                      </p>
                    ) : null}
                    {!selectedPandit.mobile && !selectedPandit.email ? <p className="mt-1 text-sm text-gray-500">Contact on request</p> : null}
                  </div>
                  <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-400">Full Address</p>
                    <p className="mt-1 text-sm font-semibold text-gray-800">
                      {selectedPandit.address || [selectedPandit.city, selectedPandit.state, selectedPandit.country].filter(Boolean).join(', ') || 'Not specified'}
                    </p>
                  </div>
                </div>

                {/* Services */}
                {formatArrayField(selectedPandit.services).length > 0 ? (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-saffron">Services Offered</h4>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {formatArrayField(selectedPandit.services).map((srv, i) => (
                        <span key={i} className="rounded-full border border-saffron/20 bg-saffron/10 px-3.5 py-1.5 text-xs font-semibold text-saffron">
                          {srv}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}

                {/* Availability */}
                <div className="rounded-2xl border border-gray-100 bg-[#fffdfa] p-4">
                  <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-saffron">Availability &amp; Schedule</h4>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2 text-sm">
                    <div>
                      <span className="text-xs text-gray-500 font-medium">Available Days:</span>
                      <p className="font-semibold text-gray-800">
                        {formatArrayField(selectedPandit.availableDays).join(', ') || 'Monday - Sunday'}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 font-medium">Time Slots:</span>
                      <p className="font-semibold text-gray-800">{selectedPandit.timeSlots || '10 AM - 6 PM'}</p>
                    </div>
                  </div>
                </div>

                {/* Pricing */}
                <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#f5e3bf] bg-[#fff8eb] p-5">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-saffron">Consultation Fee</p>
                    <p className="mt-1 text-2xl font-bold text-gray-900">
                      {selectedPandit.price ? `Rs ${selectedPandit.price} / Session` : 'Price on Request'}
                    </p>
                    <p className="mt-1 text-xs text-gray-600">Mode: {selectedPandit.mode || 'Online / Offline'}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {selectedPandit.freeConsultation === 'Yes' ? (
                      <span className="rounded-full bg-emerald-100 px-4 py-2 text-xs font-bold text-emerald-700 shadow-sm">
                        Free First Consultation Available
                      </span>
                    ) : null}
                  </div>
                </div>

                {/* Certifications */}
                {formatArrayField(selectedPandit.certifications).length > 0 ? (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-saffron">Certifications</h4>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {formatArrayField(selectedPandit.certifications).map((cert, i) => (
                        <span key={i} className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-700">
                          <Award className="h-3.5 w-3.5 text-gold" /> {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
                  <button
                    type="button"
                    onClick={() => setSelectedPandit(null)}
                    className="rounded-full border border-gray-200 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={() => setConsultingPandit(selectedPandit)}
                    className="inline-flex items-center gap-2 rounded-full bg-saffron px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-saffron/90 transition-colors"
                  >
                    <MessageCircle className="h-4 w-4" /> Book Consultation
                  </button>
                </div>
              </div>

            </div>{/* end scrollable body */}
          </motion.div>
        </div>
      ) : null}

      {/* Pandit Consultation Modal ("Talk to Pandit") */}
      <AnimatePresence>
        {consultingPandit && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md rounded-[2.5rem] border border-amber-200 bg-white p-6 text-center shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setConsultingPandit(null)}
                className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-saffron hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-saffron">
                <PhoneCall className="h-8 w-8 text-saffron" />
              </div>

              <h3 className="font-spiritual text-2xl font-bold text-gray-900">
                Talk to {consultingPandit.fullName ? `Pandit ${consultingPandit.fullName}` : 'Pandit'}
              </h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                Have questions about astrology, horoscope, remedies, or consultation? Call or message directly.
              </p>

              <div className="mt-6 rounded-2xl bg-amber-50 p-4 border border-amber-200 text-amber-950 font-bold text-lg flex items-center justify-center gap-2">
                <Phone className="h-5 w-5 text-saffron" />
                <span>{consultingPandit.mobile || '+91 98701 17452'}</span>
              </div>

              <div className="mt-6 flex gap-3">
                <a
                  href={`tel:${(consultingPandit.mobile || '+91 98701 17452').replace(/\s+/g, '')}`}
                  className="btn-primary flex-1 py-3 text-sm font-bold text-center flex items-center justify-center gap-2"
                >
                  Call Now
                </a>
                <button
                  type="button"
                  onClick={() => setConsultingPandit(null)}
                  className="rounded-full border border-gray-300 px-5 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
