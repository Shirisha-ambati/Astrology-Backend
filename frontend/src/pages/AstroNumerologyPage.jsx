import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  astroCompatibility,
  astroFaqs,
  astroHeroContainer,
  astroHeroItem,
  astroNumberPlanetMap,
  astroRemedies,
  astroTestimonials
} from '../data/siteContent';
import { Breadcrumb } from '../components/shared/PageElements';

export default function AstroNumerologyPage({ t }) {
  const astroHeroVideo = '/astro-numerology-mandala.mp4?v=202604071454';
  const [form, setForm] = useState({ fullName: '', dob: '', gender: '', timeOfBirth: '', placeOfBirth: '' });
  const [showReport, setShowReport] = useState(false);

  const reduceToSingle = (value) => {
    let current = value;
    while (current > 9) current = current.toString().split('').reduce((sum, digit) => sum + Number(digit), 0);
    return current === 0 ? 1 : current;
  };

  const digits = (form.dob.match(/\d/g) || []).map(Number);
  const birthNumber = reduceToSingle(digits[digits.length - 1] || 1);
  const lifePath = reduceToSingle(digits.reduce((sum, value) => sum + value, 0) || 1);
  const nameNumber = reduceToSingle((form.fullName || 'VEDAURA').replace(/[^a-z]/gi, '').toUpperCase().split('').reduce((sum, char) => sum + (char.charCodeAt(0) - 64), 0) || 1);
  const destinyNumber = reduceToSingle(birthNumber + lifePath + nameNumber);
  const rulingPlanet = astroNumberPlanetMap.find((item) => item.number === destinyNumber) || astroNumberPlanetMap[0];

  const reportCards = [
    { title: 'Birth Number', value: birthNumber, planet: 'Sun', text: 'Your outer vibration and natural self-expression.' },
    { title: 'Life Path Number', value: lifePath, planet: 'Moon', text: 'The central life direction guiding your path.' },
    { title: 'Destiny Number', value: destinyNumber, planet: rulingPlanet.planet, text: 'Your broader karmic blueprint and purpose.' },
    { title: 'Name Number', value: nameNumber, planet: 'Mercury', text: 'The identity vibration reflected by your name.' },
    { title: 'Planetary Influence', value: rulingPlanet.symbol, planet: rulingPlanet.planet, text: `${rulingPlanet.planet} amplifies ${rulingPlanet.traits.toLowerCase()}.` },
    { title: 'Lucky Days', value: 'Sun, Thu', planet: 'Jupiter', text: 'Supportive days for planning, rituals, and action.' },
    { title: 'Lucky Colors', value: 'Gold', planet: 'Venus', text: 'Saffron, gold, and ivory strengthen your flow.' },
    { title: 'Compatible Numbers', value: `${reduceToSingle(destinyNumber + 2)}, ${reduceToSingle(destinyNumber + 5)}`, planet: 'Moon', text: 'Helpful numbers for emotional and practical harmony.' },
    { title: 'Remedies', value: 'Mantra', planet: 'Ketu', text: 'Use mantra, affirmations, and color therapy for balance.' }
  ];

  return (
    <main className="min-h-screen bg-white pb-20 pt-28 sm:pt-32">
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <Breadcrumb currentPage={t('astro.title')} homeLabel={t('breadcrumb.home')} />
          <section className="relative min-h-[420px] overflow-hidden rounded-[2.2rem] border border-[#dcc7a0] bg-[#10131a] shadow-[0_24px_80px_-45px_rgba(212,175,55,0.35)] sm:min-h-[500px] md:min-h-[560px]">
            <video key={astroHeroVideo} autoPlay muted loop playsInline preload="auto" className="absolute inset-0 h-full w-full object-cover opacity-95">
              <source src={astroHeroVideo} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black/28"></div>
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(17,20,29,0.22)_0%,rgba(28,23,17,0.1)_45%,rgba(255,153,51,0.08)_100%)]"></div>
            <div className="absolute left-[8%] top-[18%] h-28 w-28 rounded-full bg-[#ffcc80]/20 blur-3xl animate-glow-drift"></div>
            <div className="absolute right-[10%] top-[24%] h-36 w-36 rounded-full bg-[#d6b5ff]/18 blur-3xl animate-glow-drift-delayed"></div>
            <div className="absolute left-[42%] bottom-[12%] h-32 w-32 rounded-full bg-[#ffe2a6]/18 blur-3xl animate-glow-drift"></div>
            <div className="absolute inset-0 pointer-events-none">
              {['\u2648', '\u2649', '\u264A', '\u264B', '\u264C', '\u264D', '\u264E', '\u264F', '\u2650', '\u2651', '\u2652', '\u2653'].map((symbol, index) => (
                <span key={symbol + index} className={`absolute text-[#e2cef8]/65 text-2xl ${index % 2 === 0 ? 'animate-float' : 'animate-float-delayed'}`} style={{ left: `${8 + index * 7}%`, top: `${10 + (index % 4) * 18}%` }}>{symbol}</span>
              ))}
            </div>
            <motion.div variants={astroHeroContainer} initial="hidden" animate="visible" className="relative flex min-h-[420px] flex-col items-center justify-center px-5 py-12 text-center sm:min-h-[500px] sm:px-8 sm:py-14 md:min-h-[560px] md:px-12 md:py-18">
              <motion.p variants={astroHeroItem} className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-[#ffd08a] drop-shadow-[0_2px_10px_rgba(0,0,0,0.25)] sm:text-sm sm:tracking-[0.32em]">{t('astro.subtitle')}</motion.p>
              <motion.h1 variants={astroHeroItem} className="mb-6 text-3xl font-bold text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.35)] sm:text-5xl md:text-6xl">{t('astro.title')}</motion.h1>
              <motion.p variants={astroHeroItem} className="mx-auto mb-10 max-w-3xl text-base leading-8 text-white/95 drop-shadow-[0_3px_14px_rgba(0,0,0,0.3)] sm:text-xl sm:leading-9 md:text-2xl">{t('astro.description')}</motion.p>
              <motion.button variants={astroHeroItem} type="button" onClick={() => document.getElementById('astro-numerology-form')?.scrollIntoView({ behavior: 'smooth' })} className="w-full rounded-2xl bg-saffron px-8 py-4 text-base font-medium text-white shadow-[0_18px_40px_-20px_rgba(255,153,51,0.7)] hover:bg-saffron-dark animate-soft-pulse sm:w-auto sm:text-lg" whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.98 }}>
                {t('astro.generate')}
              </motion.button>
            </motion.div>
          </section>
        </motion.div>

        <section id="astro-numerology-form" className="mt-12">
          <div className="mx-auto max-w-5xl rounded-[2rem] border border-[#f1dfbe] bg-white/85 p-6 shadow-[0_24px_70px_-40px_rgba(212,175,55,0.35)] backdrop-blur-md sm:p-8 md:p-10">
            <div className="text-center mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-saffron mb-3">{t('astro.generate')}</p>
              <h2 className="text-2xl font-bold text-black sm:text-3xl md:text-4xl">{t('astro.profile')}</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="Full Name" className="rounded-2xl border border-[#f1dfbe] px-4 py-4 text-base outline-none focus:border-saffron sm:px-5 sm:text-lg" />
              <input value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })} placeholder="Date of Birth" className="rounded-2xl border border-[#f1dfbe] px-4 py-4 text-base outline-none focus:border-saffron sm:px-5 sm:text-lg" />
              <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className="rounded-2xl border border-[#f1dfbe] px-4 py-4 text-base outline-none focus:border-saffron sm:px-5 sm:text-lg"><option value="">Gender (Optional)</option><option>Male</option><option>Female</option><option>Other</option></select>
              <input value={form.timeOfBirth} onChange={(e) => setForm({ ...form, timeOfBirth: e.target.value })} placeholder="Time of Birth (Optional)" className="rounded-2xl border border-[#f1dfbe] px-4 py-4 text-base outline-none focus:border-saffron sm:px-5 sm:text-lg" />
              <div className="md:col-span-2"><input value={form.placeOfBirth} onChange={(e) => setForm({ ...form, placeOfBirth: e.target.value })} placeholder="Place of Birth (Optional)" className="w-full rounded-2xl border border-[#f1dfbe] px-4 py-4 text-base outline-none focus:border-saffron sm:px-5 sm:text-lg" /></div>
            </div>
            <div className="mt-8 text-center">
              <button type="button" onClick={() => setShowReport(true)} className="w-full rounded-2xl bg-[linear-gradient(135deg,#FF9933_0%,#D4AF37_100%)] px-8 py-4 text-base font-medium text-white shadow-[0_18px_40px_-20px_rgba(212,175,55,0.7)] hover:brightness-105 sm:w-auto sm:text-lg">
                {t('astro.generate')}
              </button>
            </div>
          </div>
        </section>

        {showReport && (
          <section className="mt-12">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-8">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-saffron mb-3">{t('astro.results')}</p>
                <h2 className="text-3xl md:text-4xl font-bold text-black">{t('astro.sampleReport')}</h2>
              </div>
              <p className="max-w-2xl text-gray-600 text-lg">This sample dashboard uses dummy frontend logic now, but it is structured to connect with a real numerology engine later.</p>
            </div>
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {reportCards.map((card, index) => (
                <motion.div key={card.title} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }} whileHover={{ y: -6, scale: 1.01 }} className="rounded-[1.75rem] border border-[#f1dfbe] bg-white p-6 shadow-[0_18px_45px_-35px_rgba(212,175,55,0.35)] transition-transform">
                  <div className="mb-5 flex items-center justify-between">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#FF9933_0%,#D4AF37_100%)] text-2xl font-bold text-white">{card.value}</div>
                    <span className="rounded-full bg-[#fff4e4] px-4 py-2 text-sm font-medium text-saffron">{card.planet}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-black mb-3">{card.title}</h3>
                  <p className="text-gray-600 text-lg leading-8">{card.text}</p>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        <section className="mt-12">
          <div className="text-center mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-saffron mb-3">{t('astro.mapping')}</p>
            <h2 className="text-3xl md:text-4xl font-bold text-black">{t('astro.connect')}</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {astroNumberPlanetMap.map((item, index) => (
              <motion.div key={item.number} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.04 }} whileHover={{ y: -6 }} className="group rounded-[1.75rem] border border-[#f1dfbe] bg-[linear-gradient(180deg,#fff8ec_0%,#ffffff_100%)] p-6 shadow-[0_18px_45px_-35px_rgba(212,175,55,0.3)] hover:shadow-[0_22px_50px_-30px_rgba(255,153,51,0.45)] transition-all">
                <div className="mb-4 flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#FF9933_0%,#D4AF37_100%)] text-3xl text-white">{item.symbol}</div>
                  <div><p className="text-sm uppercase tracking-[0.22em] text-saffron">Number {item.number}</p><h3 className="text-2xl font-bold text-black">{item.planet}</h3></div>
                </div>
                <p className="text-gray-600 text-lg leading-8">{item.traits}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '\u2460', title: 'Enter your birth details', text: 'Provide your name, birth date, and optional details to begin the calculation flow.' },
              { icon: '\u2461', title: 'Numbers are calculated', text: 'Your name and DOB are converted into core numerology values with sample logic.' },
              { icon: '\u2462', title: 'Planetary energies are matched', text: 'Each number is linked with a ruling planet to reveal themes, compatibility, and remedies.' }
            ].map((step) => (
              <div key={step.title} className="rounded-[1.75rem] border border-[#f1dfbe] bg-white p-6 text-center shadow-[0_18px_45px_-35px_rgba(212,175,55,0.28)]">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#fff2df] text-3xl text-saffron">{step.icon}</div>
                <h3 className="text-2xl font-bold text-black mb-3">{step.title}</h3>
                <p className="text-gray-600 text-lg leading-8">{step.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12 grid md:grid-cols-2 xl:grid-cols-4 gap-6">
          {astroCompatibility.map((item, index) => (
            <motion.div key={item.title} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }} whileHover={{ y: -5 }} className="rounded-[1.75rem] border border-[#f1dfbe] bg-[linear-gradient(180deg,#fff8ec_0%,#ffffff_100%)] p-6 shadow-[0_18px_45px_-35px_rgba(212,175,55,0.28)]">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#FF9933_0%,#D4AF37_100%)] text-2xl text-white">{item.icon}</div>
              <h3 className="text-2xl font-bold text-black mb-3">{item.title}</h3>
              <p className="text-gray-600 text-lg leading-8">{item.desc}</p>
            </motion.div>
          ))}
        </section>

        <section className="mt-12 grid md:grid-cols-2 xl:grid-cols-5 gap-6">
          {astroRemedies.map((item, index) => (
            <motion.div key={item.title} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.04 }} whileHover={{ y: -4 }} className="rounded-[1.75rem] border border-[#f1dfbe] bg-white p-6 shadow-[0_18px_45px_-35px_rgba(212,175,55,0.28)]">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff2df] text-2xl text-saffron">{item.icon}</div>
              <h3 className="text-xl font-bold text-black mb-2">{item.title}</h3>
              <p className="text-gray-600 text-base leading-7">{item.value}</p>
            </motion.div>
          ))}
        </section>

        <section className="mt-12 grid md:grid-cols-3 gap-6">
          {astroTestimonials.map((item) => (
            <div key={item.name} className="rounded-[1.75rem] border border-[#f1dfbe] bg-[linear-gradient(180deg,#fff8ec_0%,#ffffff_100%)] p-6 shadow-[0_18px_45px_-35px_rgba(212,175,55,0.28)]">
              <p className="text-lg leading-8 text-gray-700 mb-5">&ldquo;{item.text}&rdquo;</p>
              <p className="font-semibold text-black">{item.name}</p>
            </div>
          ))}
        </section>

        <section className="mt-12 rounded-[2rem] border border-[#f1dfbe] bg-[linear-gradient(180deg,#fffaf3_0%,#fffefb_100%)] p-8 md:p-10 shadow-[0_20px_60px_-40px_rgba(212,175,55,0.22)]">
          <div className="text-center mb-10">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-saffron mb-3">{t('astro.faq')}</p>
            <h2 className="text-3xl md:text-4xl font-bold text-black">{t('astro.commonQuestions')}</h2>
          </div>
          <div className="space-y-4">
            {astroFaqs.map((item) => (
              <div key={item.q} className="rounded-[1.5rem] border border-[#f1dfbe] bg-white p-6">
                <h3 className="text-xl font-bold text-black mb-2">{item.q}</h3>
                <p className="text-gray-600 text-lg leading-8">{item.a}</p>
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
