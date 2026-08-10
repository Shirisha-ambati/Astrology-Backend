import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Brain, ChevronRight, Heart, MessageCircle, Phone, Star, UserPlus } from 'lucide-react';
import { offerings, products } from '../data/siteContent';
import { loadPanditRegistrations } from '../lib/pandits';

export default function HomePage({ onNavigate, t }) {
  const [pandits, setPandits] = useState(() => loadPanditRegistrations());

  useEffect(() => {
    const refreshPandits = () => setPandits(loadPanditRegistrations());
    window.addEventListener('storage', refreshPandits);
    return () => window.removeEventListener('storage', refreshPandits);
  }, []);

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
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-card p-8 group">
                <div className="w-14 h-14 bg-saffron/10 rounded-2xl flex items-center justify-center text-saffron mb-6 group-hover:bg-saffron group-hover:text-white transition-colors">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 font-spiritual">{item.title}</h3>
                <p className="text-gray-600 mb-4">{item.desc}</p>
                <div className="flex items-center text-saffron font-medium text-sm">
                  {t('home.explore')} <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </motion.div>
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
                        <button type="button" className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:border-saffron hover:text-saffron">
                          Chat
                        </button>
                        <button type="button" className="inline-flex items-center rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:border-saffron hover:text-saffron">
                          <Phone className="mr-2 h-4 w-4" />
                          Call
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {pandit.mode ? (
                        <span className="rounded-full bg-saffron/10 px-3 py-1 text-xs font-semibold text-saffron">{pandit.mode}</span>
                      ) : null}
                      {pandit.freeConsultation === 'Yes' ? (
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">Free Consultation</span>
                      ) : null}
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
              <div key={product.name} className="group">
                <div className="relative h-64 bg-cream rounded-2xl mb-4 overflow-hidden flex items-center justify-center">
                  <div className="w-32 h-32 bg-white rounded-full shadow-soft flex items-center justify-center">
                    <Star className="text-gold/50 w-12 h-12" />
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 font-spiritual text-lg">{product.name}</h3>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-saffron font-semibold">{product.price}</span>
                  <button type="button" onClick={() => onNavigate('Shop')} className="text-gray-400 hover:text-red-500">
                    <Heart className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
