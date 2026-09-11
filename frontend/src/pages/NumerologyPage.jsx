import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDays, Sparkles, Star, Heart, Briefcase, Sun, Moon, Zap, Hash } from 'lucide-react';
import { Breadcrumb } from '../components/shared/PageElements';
import { numerologyCards, astroNumberPlanetMap } from '../data/siteContent';
import { apiClient } from '../lib/api';

const fade = { hidden: { opacity: 0, y: 18 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.5 } }) };

const NUMBER_COLORS = {
  1: 'from-orange-400 to-red-500',
  2: 'from-blue-300 to-indigo-500',
  3: 'from-yellow-400 to-orange-500',
  4: 'from-green-500 to-teal-600',
  5: 'from-purple-400 to-pink-500',
  6: 'from-pink-400 to-rose-500',
  7: 'from-indigo-500 to-violet-600',
  8: 'from-gray-600 to-gray-900',
  9: 'from-red-500 to-pink-600',
  11: 'from-yellow-300 to-amber-500',
  22: 'from-teal-500 to-cyan-600',
  33: 'from-rose-400 to-purple-600',
};

function NumberBadge({ n, size = 'lg' }) {
  const cls = NUMBER_COLORS[n] || NUMBER_COLORS[9];
  const sz = size === 'lg' ? 'h-20 w-20 text-3xl' : 'h-12 w-12 text-xl';
  return (
    <div className={`${sz} flex items-center justify-center rounded-2xl bg-gradient-to-br ${cls} font-extrabold text-white shadow-lg`}>
      {n}
    </div>
  );
}

function ResultCard({ icon, label, number, title, traits, detail, index }) {
  return (
    <motion.div custom={index} variants={fade} initial="hidden" animate="visible"
      className="rounded-3xl border border-[#f1dfbe] bg-white p-6 shadow-[0_12px_35px_-20px_rgba(212,175,55,0.4)] flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <NumberBadge n={number} />
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-saffron mb-0.5">{label}</p>
          <h3 className="text-xl font-bold text-black">{title}</h3>
        </div>
      </div>
      {traits && (
        <div className="flex flex-wrap gap-2">
          {traits.map(t => (
            <span key={t} className="rounded-full bg-[#fff3df] px-3 py-1 text-sm font-medium text-amber-800">{t}</span>
          ))}
        </div>
      )}
      {detail && <p className="text-gray-600 leading-7 text-sm">{detail}</p>}
    </motion.div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-[#fff8ec] border border-[#f1dfbe] px-5 py-4">
      <span className="mt-0.5 rounded-xl bg-[#ffc400] p-2 text-black"><Icon className="h-4 w-4" /></span>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-saffron">{label}</p>
        <p className="text-base font-semibold text-black mt-0.5">{value}</p>
      </div>
    </div>
  );
}

export default function NumerologyPage({ t }) {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [report, setReport] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedNumber, setSelectedNumber] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setReport(null);
    if (!name.trim() || !dob) { setError('Please enter your full name and date of birth.'); return; }
    try {
      setLoading(true);
      const { data } = await apiClient.post('/numerology/calculate', { fullName: name.trim(), dob });
      setReport(data);
      setActiveTab('overview');
      setTimeout(() => document.getElementById('num-results')?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch (err) {
      setError(err.response?.data?.error || 'Could not generate your report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'love', label: 'Love & Relationships' },
    { key: 'career', label: 'Career' },
    { key: 'lucky', label: 'Lucky Elements' },
  ];

  return (
    <main className="min-h-screen bg-white pb-24 pt-28 sm:pt-32">
      <section className="mx-auto max-w-7xl px-4 sm:px-6">

        {/* ── Hero ── */}
        <motion.div variants={fade} initial="hidden" animate="visible">
          <Breadcrumb currentPage={t('nav.numerology')} homeLabel={t('breadcrumb.home')} />
          <div className="grid overflow-hidden rounded-[2rem] border border-[#f1dfbe] bg-[linear-gradient(135deg,#fff8ec,#fff3df_55%,#fff9f2)] shadow-[0_20px_60px_-35px_rgba(212,175,55,0.3)] lg:grid-cols-[1fr_1.1fr]">
            {/* Visual side */}
            <div className="relative flex min-h-[280px] items-center justify-center overflow-hidden bg-[linear-gradient(135deg,#6b3d16,#c97a1f_45%,#1f2937)] p-8">
              <div className="relative z-10 grid grid-cols-3 gap-3">
                {[1,2,3,4,5,6,7,8,9].map((n, i) => (
                  <motion.div key={n} custom={i} variants={fade} initial="hidden" animate="visible"
                    className={`flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl text-2xl sm:text-3xl font-extrabold text-white shadow-xl border border-white/20 bg-gradient-to-br ${NUMBER_COLORS[n]}`}>
                    {n}
                  </motion.div>
                ))}
              </div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,196,0,0.18),transparent_55%)]" />
            </div>
            {/* Text side */}
            <div className="flex flex-col justify-center p-8 md:p-12">
              <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-saffron">{t('numerology.cosmic')}</p>
              <h1 className="mb-5 text-3xl font-bold text-black sm:text-4xl md:text-5xl">{t('numerology.title')}</h1>
              <p className="mb-6 text-base italic leading-7 text-gray-700 sm:text-lg">&ldquo;{t('numerology.quote')}&rdquo;</p>
              <p className="text-base leading-8 text-gray-600 sm:text-[1.05rem]">{t('numerology.description')}</p>
            </div>
          </div>
        </motion.div>

        {/* ── Calculator Form ── */}
        <motion.section custom={1} variants={fade} initial="hidden" animate="visible" className="mt-10">
          <div className="rounded-[2rem] border border-[#f1dfbe] bg-[linear-gradient(180deg,#fbefd9,#fff7ec)] p-6 sm:p-10 shadow-[0_20px_55px_-30px_rgba(212,175,55,0.25)]">
            <p className="mb-2 text-sm font-bold uppercase tracking-widest text-saffron">{t('numerology.calculator')}</p>
            <h2 className="mb-8 text-3xl font-bold text-black sm:text-4xl">{t('numerology.lifePath')}</h2>
            <form onSubmit={handleSubmit} className="rounded-[1.8rem] bg-white p-6 sm:p-8 shadow-[0_15px_45px_-25px_rgba(0,0,0,0.18)]">
              <div className="grid gap-6 md:grid-cols-2">
                <label className="block">
                  <span className="mb-3 block text-lg font-semibold text-black">Full Name</span>
                  <input
                    value={name} onChange={e => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full rounded-2xl border border-gray-300 px-5 py-4 text-base outline-none focus:border-saffron focus:ring-2 focus:ring-saffron/20 transition-all"
                  />
                </label>
                <label className="block">
                  <span className="mb-3 block text-lg font-semibold text-black">Date of Birth</span>
                  <div className="relative">
                    <input
                      type="date" value={dob} onChange={e => setDob(e.target.value)}
                      className="w-full rounded-2xl border border-gray-300 px-5 py-4 pr-14 text-base outline-none focus:border-saffron focus:ring-2 focus:ring-saffron/20 transition-all"
                    />
                    <CalendarDays className="absolute right-5 top-1/2 h-6 w-6 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </label>
              </div>
              {error && <p role="alert" className="mt-5 rounded-2xl bg-red-50 border border-red-200 px-5 py-4 text-base font-medium text-red-700">{error}</p>}
              <button type="submit" disabled={loading}
                className="mt-7 w-full rounded-2xl bg-[#ffc400] px-8 py-5 text-xl font-bold text-black hover:bg-[#f0b600] active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-3">
                {loading ? (
                  <><span className="h-5 w-5 animate-spin rounded-full border-2 border-black border-t-transparent" />Calculating...</>
                ) : (
                  <><Sparkles className="h-5 w-5" />{t('numerology.calculate')}</>
                )}
              </button>
            </form>
          </div>
        </motion.section>

        {/* ── Results ── */}
        <AnimatePresence>
          {report && (
            <motion.section id="num-results" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-12">

              {/* Core numbers summary */}
              <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                {[
                  { label: 'Life Path', n: report.numbers.lifePath },
                  { label: 'Destiny', n: report.numbers.destiny },
                  { label: 'Soul Urge', n: report.numbers.soulUrge },
                  { label: 'Personality', n: report.numbers.personality },
                  { label: 'Birthday', n: report.numbers.birthday },
                  { label: 'Personal Year', n: report.numbers.personalYear },
                ].map(({ label, n }) => (
                  <motion.div key={label} variants={fade} initial="hidden" animate="visible"
                    className="flex flex-col items-center gap-3 rounded-2xl border border-[#f1dfbe] bg-white p-5 shadow-sm text-center">
                    <NumberBadge n={n} size="sm" />
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-500">{label}</p>
                    <p className="text-2xl font-extrabold text-black">{n}</p>
                  </motion.div>
                ))}
              </div>

              {/* Tabs */}
              <div className="mb-8 flex gap-2 overflow-x-auto pb-1">
                {tabs.map(tab => (
                  <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                    className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${activeTab === tab.key ? 'bg-[#ffc400] text-black shadow-md' : 'border border-[#f1dfbe] bg-white text-gray-700 hover:bg-[#fff8ec]'}`}>
                    {tab.label}
                  </button>
                ))}
              </div>

              {activeTab === 'overview' && (
                <div className="grid gap-5 md:grid-cols-2">
                  <ResultCard index={0} icon={Star} label="Life Path Number" number={report.lifePath.number}
                    title={report.lifePath.title} traits={report.lifePath.traits}
                    detail={`Ruling Planet: ${report.lifePath.planet} · Element: ${report.lifePath.element}`} />
                  <ResultCard index={1} icon={Zap} label="Destiny Number" number={report.destiny.number}
                    title={report.destiny.title} traits={report.destiny.traits} detail={null} />
                  <ResultCard index={2} icon={Heart} label="Soul Urge Number" number={report.soulUrge.number}
                    title={report.soulUrge.title} traits={report.soulUrge.traits} detail={report.soulUrge.description} />
                  <ResultCard index={3} icon={Moon} label="Personality Number" number={report.personality.number}
                    title={report.personality.title} traits={report.personality.traits} detail={report.personality.description} />

                  {/* Personal Year */}
                  <motion.div custom={4} variants={fade} initial="hidden" animate="visible"
                    className="md:col-span-2 rounded-3xl border border-[#f1dfbe] bg-[linear-gradient(135deg,#fff8ec,#fffdf5)] p-6 shadow-sm flex gap-5 items-start">
                    <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${NUMBER_COLORS[report.numbers.personalYear] || 'from-amber-400 to-orange-500'} text-2xl font-extrabold text-white shadow-lg`}>
                      {report.numbers.personalYear}
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-saffron mb-1">Personal Year {new Date().getFullYear()}</p>
                      <h3 className="text-xl font-bold text-black mb-2">Your {new Date().getFullYear()} Theme</h3>
                      <p className="text-gray-600 leading-7">{report.personalYear.theme}</p>
                    </div>
                  </motion.div>

                  {/* Affirmation */}
                  <motion.div custom={5} variants={fade} initial="hidden" animate="visible"
                    className="md:col-span-2 rounded-3xl bg-[linear-gradient(135deg,#FF9933,#D4AF37)] p-8 text-white text-center">
                    <p className="text-sm font-bold uppercase tracking-widest text-white/70 mb-3">Your Daily Mantra</p>
                    <p className="text-2xl font-bold mb-4">{report.mantra}</p>
                    <p className="text-base italic text-white/90">&ldquo;{report.affirmation}&rdquo;</p>
                  </motion.div>
                </div>
              )}

              {activeTab === 'love' && (
                <div className="grid gap-5 md:grid-cols-2">
                  <motion.div variants={fade} initial="hidden" animate="visible"
                    className="rounded-3xl border border-[#f1dfbe] bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-5">
                      <span className="rounded-2xl bg-pink-100 p-3 text-pink-600"><Heart className="h-6 w-6" /></span>
                      <h3 className="text-xl font-bold text-black">Love Style</h3>
                    </div>
                    <p className="text-gray-600 leading-8">{report.lifePath.love}</p>
                  </motion.div>
                  <motion.div custom={1} variants={fade} initial="hidden" animate="visible"
                    className="rounded-3xl border border-[#f1dfbe] bg-white p-6 shadow-sm">
                    <h3 className="text-xl font-bold text-black mb-5">Best Compatible Numbers</h3>
                    <div className="flex flex-wrap gap-3">
                      {(report.compatibility?.best || []).map(n => (
                        <div key={n} className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${NUMBER_COLORS[n] || NUMBER_COLORS[1]} text-xl font-extrabold text-white shadow`}>{n}</div>
                      ))}
                    </div>
                    <p className="mt-4 text-sm text-gray-500">These Life Path numbers are energetically most aligned with your {report.numbers.lifePath}.</p>
                  </motion.div>
                </div>
              )}

              {activeTab === 'career' && (
                <motion.div variants={fade} initial="hidden" animate="visible"
                  className="rounded-3xl border border-[#f1dfbe] bg-white p-8 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="rounded-2xl bg-amber-100 p-3 text-amber-600"><Briefcase className="h-6 w-6" /></span>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-saffron">Life Path {report.numbers.lifePath}</p>
                      <h3 className="text-xl font-bold text-black">{report.lifePath.title} — Career Path</h3>
                    </div>
                  </div>
                  <p className="text-gray-600 leading-8 text-lg">{report.destiny.career}</p>
                </motion.div>
              )}

              {activeTab === 'lucky' && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    { icon: Hash, label: 'Lucky Numbers', value: report.lucky?.numbers },
                    { icon: Sun, label: 'Lucky Colors', value: report.lucky?.colors },
                    { icon: Sparkles, label: 'Lucky Gemstones', value: report.lucky?.gems },
                    { icon: CalendarDays, label: 'Lucky Days', value: report.lucky?.days },
                    { icon: Star, label: 'Lucky Years', value: report.lucky?.years },
                    { icon: Moon, label: 'Ruling Planet', value: report.lifePath.planet },
                  ].map(({ icon, label, value }, i) => (
                    <motion.div key={label} custom={i} variants={fade} initial="hidden" animate="visible">
                      <InfoRow icon={icon} label={label} value={value || '—'} />
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.section>
          )}
        </AnimatePresence>

        {/* ── Numbers 1–9 Reference ── */}
        <motion.section custom={2} variants={fade} initial="hidden" animate="visible" className="mt-16">
          <div className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-2 text-sm font-bold uppercase tracking-widest text-saffron">{t('numerology.numbers')}</p>
              <h2 className="text-3xl font-bold text-black md:text-4xl">{t('numerology.choose')}</h2>
            </div>
            <p className="max-w-xl text-gray-500 text-base">Each number carries a unique cosmic vibration shaping your personality, timing, and life direction.</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {numerologyCards.map((item, i) => (
              <React.Fragment key={item.number}>
                <motion.div custom={i} variants={fade} initial="hidden" animate="visible"
                  onClick={() => setSelectedNumber(selectedNumber === item.number ? null : item.number)}
                  className={`group flex items-start gap-5 rounded-[1.75rem] border border-[#f1dfbe] bg-white p-6 cursor-pointer transition-all ${selectedNumber === item.number ? 'ring-2 ring-saffron shadow-[0_20px_50px_-20px_rgba(212,175,55,0.5)] -translate-y-0.5' : 'shadow-[0_12px_35px_-25px_rgba(212,175,55,0.35)] hover:shadow-[0_20px_50px_-20px_rgba(212,175,55,0.5)] hover:-translate-y-0.5'}`}>
                  <div className={`shrink-0 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${NUMBER_COLORS[item.number]} text-xl font-extrabold text-white shadow-lg`}>
                    {item.number}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-black mb-1">{item.title}</h3>
                    <p className="text-gray-500">{item.desc}</p>
                  </div>
                </motion.div>
                
                <AnimatePresence>
                  {selectedNumber === item.number && (
                    <motion.div initial={{ opacity: 0, height: 0, scale: 0.95 }} animate={{ opacity: 1, height: 'auto', scale: 1 }} exit={{ opacity: 0, height: 0, scale: 0.95 }} transition={{ duration: 0.3 }}
                      className="col-span-1 sm:col-span-2 xl:col-span-3 overflow-hidden">
                      <div className="rounded-3xl bg-[linear-gradient(135deg,#fff8ec,#fffdf5)] border border-saffron/30 p-8 shadow-inner my-2 flex flex-col md:flex-row gap-6 items-start">
                        <div className={`flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br ${NUMBER_COLORS[item.number]} text-4xl font-extrabold text-white shadow-xl`}>
                          {item.number}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-2xl font-bold text-black mb-2">{item.title} Explained</h4>
                          <p className="text-gray-700 leading-7 mb-4">{item.desc}. This number is associated with the planet {astroNumberPlanetMap.find(a => a.number === item.number)?.planet} ({astroNumberPlanetMap.find(a => a.number === item.number)?.symbol}). It represents a cosmic energy of {astroNumberPlanetMap.find(a => a.number === item.number)?.traits.toLowerCase()}.</p>
                          <div className="grid grid-cols-2 gap-4">
                             <div className="bg-white rounded-2xl p-4 border border-saffron/20 shadow-sm">
                                <p className="text-xs font-bold uppercase tracking-wider text-saffron mb-1">Ruling Planet</p>
                                <p className="text-lg font-bold text-gray-800">{astroNumberPlanetMap.find(a => a.number === item.number)?.planet}</p>
                             </div>
                             <div className="bg-white rounded-2xl p-4 border border-saffron/20 shadow-sm">
                                <p className="text-xs font-bold uppercase tracking-wider text-saffron mb-1">Key Traits</p>
                                <p className="text-sm font-semibold text-gray-700">{astroNumberPlanetMap.find(a => a.number === item.number)?.traits}</p>
                             </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </React.Fragment>
            ))}
          </div>
        </motion.section>

      </section>
    </main>
  );
}
