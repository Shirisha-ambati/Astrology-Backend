import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wind } from 'lucide-react';
import { astroHeroContainer, astroHeroItem, swarBenefits, swarCards, swarFaqs, swarGuidance } from '../data/siteContent';
import { Breadcrumb } from '../components/shared/PageElements';

export default function SwarSciencePage({ t }) {
  const [activeSwar, setActiveSwar] = useState('ida');
  const [breathing, setBreathing] = useState(false);
  const currentSwar = swarCards.find((item) => item.key === activeSwar) || swarCards[0];
  const currentGuidance = swarGuidance[activeSwar];

  return (
    <main className="min-h-screen bg-white pb-20 pt-28 sm:pt-32">
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <Breadcrumb currentPage={t('nav.swar')} homeLabel={t('breadcrumb.home')} />
          <section className="relative min-h-[420px] overflow-hidden rounded-[2.2rem] border border-[#d8e7e8] bg-[#dfeef3] shadow-[0_24px_80px_-45px_rgba(77,145,163,0.28)] sm:min-h-[500px] md:min-h-[560px]">
            <video autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover opacity-95">
              <source src="/Meditating_figure_forming_202604071413.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(198,226,234,0.18)_0%,rgba(214,235,240,0.08)_40%,rgba(247,222,184,0.16)_100%)]"></div>
            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.12)_25%,transparent_50%,rgba(255,255,255,0.08)_75%,transparent_100%)]"></div>
            <div className="absolute left-[6%] top-[28%] h-28 w-28 rounded-full bg-[#8fd1de]/30 blur-3xl animate-glow-drift"></div>
            <div className="absolute right-[10%] top-[22%] h-32 w-32 rounded-full bg-[#f0c688]/24 blur-3xl animate-glow-drift-delayed"></div>
            <div className="absolute inset-0 pointer-events-none">
              {['\u0F04', '\u2726', '\u274B', '\u0F36', '\u2727', '\u2742'].map((symbol, index) => (
                <span
                  key={symbol + index}
                  className={`absolute text-[#9dc6d2]/28 text-3xl ${index % 2 === 0 ? 'animate-float' : 'animate-float-delayed'}`}
                  style={{ left: `${10 + index * 13}%`, top: `${14 + (index % 3) * 22}%` }}
                >
                  {symbol}
                </span>
              ))}
            </div>
            <motion.div variants={astroHeroContainer} initial="hidden" animate="visible" className="relative flex min-h-[420px] flex-col items-center justify-center px-5 py-12 text-center sm:min-h-[500px] sm:px-8 sm:py-14 md:min-h-[560px] md:px-12 md:py-18">
              <motion.p variants={astroHeroItem} className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-[#ffd08a] drop-shadow-[0_2px_10px_rgba(0,0,0,0.25)] sm:text-sm sm:tracking-[0.32em]">
                {t('swar.subtitle')}
              </motion.p>
              <motion.h1 variants={astroHeroItem} className="mb-6 text-3xl font-bold text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.35)] sm:text-5xl md:text-6xl">
                {t('swar.title')}
              </motion.h1>
              <motion.p variants={astroHeroItem} className="mx-auto mb-10 max-w-3xl text-base leading-8 text-white/95 drop-shadow-[0_3px_14px_rgba(0,0,0,0.3)] sm:text-xl sm:leading-9 md:text-2xl">
                {t('swar.description')}
              </motion.p>
              <motion.button
                variants={astroHeroItem}
                type="button"
                onClick={() => document.getElementById('swar-detection')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full rounded-2xl bg-saffron px-8 py-4 text-base font-medium text-white shadow-[0_18px_40px_-20px_rgba(255,153,51,0.7)] hover:bg-saffron-dark animate-soft-pulse sm:w-auto sm:text-lg"
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                {t('swar.check')}
              </motion.button>
            </motion.div>
          </section>
        </motion.div>

        <section id="swar-detection" className="mt-12">
          <div className="mx-auto max-w-5xl rounded-[2rem] border border-[#d8e7e8] bg-white/90 p-6 shadow-[0_24px_70px_-40px_rgba(77,145,163,0.22)] backdrop-blur-md sm:p-8 md:p-10">
            <div className="text-center mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-saffron mb-3">{t('swar.detection')}</p>
              <h2 className="text-2xl font-bold text-black sm:text-3xl md:text-4xl">{t('swar.activeFlow')}</h2>
            </div>
            <div className="grid items-center gap-8 md:grid-cols-[1fr_auto]">
              <div className="grid gap-4 sm:grid-cols-3">
                {swarCards.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setActiveSwar(item.key)}
                    className={`rounded-[1.5rem] border px-4 py-5 text-left transition-all sm:px-5 ${
                      activeSwar === item.key ? 'border-saffron bg-[#fff5e7] shadow-[0_18px_40px_-28px_rgba(255,153,51,0.55)]' : 'border-[#d8e7e8] bg-[#fbfefd]'
                    }`}
                  >
                    <div className="text-3xl mb-3">{item.icon}</div>
                    <h3 className="text-xl font-bold text-black mb-2">{item.title}</h3>
                    <p className="text-gray-600 leading-7">{item.mood}</p>
                  </button>
                ))}
              </div>
              <div className="flex flex-col items-center justify-center">
                <div className={`relative flex h-36 w-36 items-center justify-center rounded-full bg-[radial-gradient(circle,#ffffff_0%,#e7f6f8_55%,#cce8ec_100%)] shadow-[0_18px_45px_-30px_rgba(77,145,163,0.35)] ${breathing ? 'animate-breathe' : ''}`}>
                  <div className="absolute inset-4 rounded-full border border-[#9dc6d2]/50"></div>
                  <Wind className="w-12 h-12 text-[#6793a0]" />
                </div>
                <button type="button" onClick={() => setBreathing((value) => !value)} className="mt-5 rounded-2xl bg-[#6793a0] px-7 py-3 text-base font-medium text-white hover:bg-[#4f7f8d]">
                  {breathing ? t('swar.pauseBreath') : t('swar.checkNow')}
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-12 grid md:grid-cols-3 gap-6">
          {swarCards.map((item, index) => (
            <motion.div key={item.key} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }} whileHover={{ y: -5 }} className="rounded-[1.75rem] border border-[#d8e7e8] bg-white p-6 shadow-[0_18px_45px_-35px_rgba(77,145,163,0.22)]">
              <div className={`mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${item.accent} text-3xl shadow-inner`}>{item.icon}</div>
              <h3 className="text-2xl font-bold text-black mb-2">{item.title}</h3>
              <p className="text-gray-700 text-lg leading-8 mb-4">{item.mood}</p>
              <div className="space-y-2">{item.goodFor.map((point) => <p key={point} className="text-gray-600">• {point}</p>)}</div>
            </motion.div>
          ))}
        </section>

        <section className="mt-12 rounded-[2rem] border border-[#d8e7e8] bg-[linear-gradient(180deg,#f8fffd_0%,#ffffff_100%)] p-8 md:p-10 shadow-[0_20px_60px_-40px_rgba(77,145,163,0.22)]">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-saffron mb-3">{t('swar.dailySuggestions')}</p>
              <h2 className="text-3xl md:text-4xl font-bold text-black mb-5">
                {t('swar.current')} {currentSwar.title}
              </h2>
              <p className="text-lg text-gray-700 leading-8 mb-5">{currentGuidance.doNow}</p>
              <p className="text-lg text-gray-600 leading-8">
                <span className="font-semibold text-black">{t('swar.avoid')}</span> {currentGuidance.avoid}
              </p>
            </div>
            <div className="min-w-0 rounded-[1.6rem] border border-[#d8e7e8] bg-white p-6 lg:min-w-[280px]">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-saffron mb-4">{t('swar.bestActivities')}</p>
              <div className="space-y-3">{currentGuidance.best.map((item) => <div key={item} className="rounded-2xl bg-[#f4fbfc] px-4 py-3 text-gray-700">{item}</div>)}</div>
            </div>
          </div>
        </section>

        <section className="mt-12 rounded-[2rem] border border-[#d8e7e8] bg-[linear-gradient(180deg,#fffefb_0%,#f6fbfc_100%)] p-8 md:p-10 shadow-[0_20px_60px_-40px_rgba(77,145,163,0.18)]">
          <div className="text-center mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-saffron mb-3">{t('swar.timing')}</p>
            <h2 className="text-3xl md:text-4xl font-bold text-black">{t('swar.cycles')}</h2>
          </div>
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
            <div>
              <p className="text-lg text-gray-600 leading-8 mb-6">
                Ancient Swar Science teaches that the active nostril often shifts naturally through the day. Observing this rhythm can help you choose the most supportive timing for work, rest, learning, and spiritual practice.
              </p>
              <div className="relative h-4 rounded-full bg-[#e6f1f2] overflow-hidden">
                <div className="absolute inset-y-0 left-0 w-1/3 rounded-full bg-[linear-gradient(90deg,#9dc6d2_0%,#6793a0_100%)] animate-swar-flow"></div>
              </div>
              <div className="mt-4 flex justify-between text-sm text-gray-500">
                <span>Ida</span>
                <span>Pingala</span>
                <span>Sushumna</span>
              </div>
            </div>
            <div className="mx-auto flex h-56 w-56 items-center justify-center rounded-full border border-[#d8e7e8] bg-[radial-gradient(circle,#ffffff_0%,#edf8fa_55%,#d9eef1_100%)] shadow-[0_18px_45px_-30px_rgba(77,145,163,0.3)]">
              <div className="flex h-40 w-40 items-center justify-center rounded-full border border-[#9dc6d2]/40 animate-soft-pulse">
                <span className="text-3xl text-[#6793a0]">⏳</span>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-12 rounded-[2rem] border border-[#d8e7e8] bg-white p-8 md:p-10 shadow-[0_20px_60px_-40px_rgba(77,145,163,0.18)]">
          <div className="text-center mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-saffron mb-3">{t('swar.guided')}</p>
            <h2 className="text-3xl md:text-4xl font-bold text-black">{t('swar.breathe')}</h2>
          </div>
          <div className="flex flex-col items-center">
            <div className={`flex h-44 w-44 items-center justify-center rounded-full bg-[radial-gradient(circle,#ffffff_0%,#e4f3f6_58%,#cfe8ec_100%)] shadow-[0_20px_45px_-28px_rgba(77,145,163,0.35)] ${breathing ? 'animate-breathe' : ''}`}>
              <span className="text-[#6793a0] text-xl font-medium">{breathing ? t('swar.inhaleExhale') : t('swar.calmBreath')}</span>
            </div>
            <p className="mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600">
              Sit comfortably, observe which nostril feels more open, inhale gently through the nose, and exhale slowly with full awareness.
            </p>
            <button type="button" onClick={() => setBreathing((value) => !value)} className="mt-6 rounded-2xl bg-saffron px-8 py-4 text-lg font-medium text-white hover:bg-saffron-dark">
              {breathing ? t('swar.pauseBreathing') : t('swar.checkNow')}
            </button>
          </div>
        </section>

        <section className="mt-12 grid md:grid-cols-3 gap-6">
          {[
            { icon: '👃', title: 'Observe your breath flow', text: 'Notice which nostril feels more open in this moment.' },
            { icon: '🔍', title: 'Identify active nostril', text: 'Recognize whether Ida, Pingala, or Sushumna is dominant.' },
            { icon: '🕊', title: 'Align actions accordingly', text: 'Choose tasks that harmonize with the natural energy of your current swar.' }
          ].map((step, index) => (
            <motion.div key={step.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.06 }} className="rounded-[1.75rem] border border-[#d8e7e8] bg-[linear-gradient(180deg,#f9ffff_0%,#ffffff_100%)] p-6 text-center shadow-[0_18px_45px_-35px_rgba(77,145,163,0.18)]">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#edf8fa] text-3xl">{step.icon}</div>
              <h3 className="text-2xl font-bold text-black mb-3">{step.title}</h3>
              <p className="text-gray-600 text-lg leading-8">{step.text}</p>
            </motion.div>
          ))}
        </section>

        <section className="mt-12 grid sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {swarBenefits.map((item, index) => (
            <motion.div key={item} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }} whileHover={{ y: -4 }} className="rounded-[1.75rem] border border-[#d8e7e8] bg-white p-6 shadow-[0_18px_45px_-35px_rgba(77,145,163,0.18)]">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#edf8fa] text-2xl text-[#6793a0]">✦</div>
              <h3 className="text-xl font-bold text-black">{item}</h3>
            </motion.div>
          ))}
        </section>

        <section className="mt-12 rounded-[2rem] border border-[#d8e7e8] bg-[linear-gradient(180deg,#f9ffff_0%,#ffffff_100%)] p-8 md:p-10 shadow-[0_20px_60px_-40px_rgba(77,145,163,0.18)]">
          <div className="text-center mb-10">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-saffron mb-3">{t('swar.faq')}</p>
            <h2 className="text-3xl md:text-4xl font-bold text-black">{t('swar.commonQuestions')}</h2>
          </div>
          <div className="space-y-4">
            {swarFaqs.map((item) => (
              <div key={item.q} className="rounded-[1.5rem] border border-[#d8e7e8] bg-white p-6">
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
