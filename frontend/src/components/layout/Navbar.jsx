import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Menu, Sun, X, User } from 'lucide-react';
import { kundliNav, topNav } from '../../data/siteContent';

function sectionFor(page) {
  if (page === 'Horoscope') return 'Horoscope';
  if (kundliNav.some((item) => item.key === page)) return 'Kundli';
  return page;
}

const navKeyMap = {
  Home: 'home',
  Horoscope: 'horoscope',
  Kundli: 'kundli',
  Numerology: 'numerology',
  'Astro-Neuro': 'astro',
  'Swar Science': 'swar',
  Shop: 'shop'
};

const kundliKeyMap = {
  Kundli: 'freeKundli',
  'Kundli Matching': 'kundliMatching',
  Love: 'love',
  Marriage: 'marriage'
};

export default function Navbar({ page, onNavigate, t, session }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [kundliOpen, setKundliOpen] = useState(false);
  const active = sectionFor(page);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setKundliOpen(false);
  }, [page]);

  const light = scrolled || page !== 'Home';
  const tone = light ? 'text-gray-800' : 'text-gray-50';

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${light ? 'bg-white/95 backdrop-blur-md shadow-md py-3 sm:py-4' : 'bg-transparent py-4 sm:py-6'}`}>
      <div className="mx-auto flex w-full max-w-[1480px] items-center justify-between px-6 sm:px-8 lg:px-10">
        <button type="button" onClick={() => onNavigate('Home')} className="flex items-center gap-3">
          <Sun className="h-8 w-8 text-saffron animate-[spin_10s_linear_infinite] sm:h-10 sm:w-10" />
          <span className="font-spiritual text-2xl font-bold bg-gradient-to-r from-saffron to-gold bg-clip-text text-transparent sm:text-3xl lg:text-4xl">
            VedAura
          </span>
        </button>

        <div className={`hidden lg:flex items-center space-x-6 text-sm xl:text-base font-spiritual tracking-wide ${tone}`}>
          {topNav.map((item) => item === 'Kundli' ? (
            <div key={item} className="relative" onMouseEnter={() => setKundliOpen(true)} onMouseLeave={() => setKundliOpen(false)}>
              <button type="button" onClick={() => { setKundliOpen((value) => !value); onNavigate('Kundli'); }} className={`flex items-center gap-1 whitespace-nowrap ${active === 'Kundli' ? 'text-saffron' : 'hover:text-saffron'}`}>
                {t('nav.kundli')}
                <ChevronDown className={`w-4 h-4 transition-transform ${kundliOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {kundliOpen && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="absolute left-0 top-full mt-4 w-72 rounded-3xl border border-gray-100 bg-white p-3 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.35)]">
                    {kundliNav.map((item, index) => (
                      <button key={item.key} type="button" onClick={() => onNavigate(item.key)} className={`w-full px-4 py-4 text-left text-[1.1rem] ${item.key === page ? 'text-saffron font-semibold' : 'text-gray-800 hover:text-saffron'} ${index < kundliNav.length - 1 ? 'border-b border-dashed border-gray-200' : ''}`}>
                        {t(`nav.${kundliKeyMap[item.key]}`)}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button key={item} type="button" onClick={() => onNavigate(item)} className={`whitespace-nowrap ${active === item ? 'text-saffron' : 'hover:text-saffron'}`}>
              {t(`nav.${navKeyMap[item]}`)}
            </button>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-3 xl:gap-5">
          {session ? (
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/20 bg-white/10 ${light ? 'text-gray-700 border-gray-200 bg-gray-50' : 'text-white'}`} title="Logged In">
              <User className="h-4 w-4" />
              <span className="text-sm font-spiritual font-medium">{session.user?.full_name || 'Member'}</span>
            </div>
          ) : (
            <button type="button" onClick={() => onNavigate('Login')} className={`whitespace-nowrap text-sm xl:text-base font-spiritual font-medium hover:text-saffron ${page === 'Login' ? 'text-saffron' : light ? 'text-gray-700' : 'text-white'}`}>{t('nav.login')}</button>
          )}
        </div>

        <button className={`${light ? 'text-gray-800' : 'text-white'} lg:hidden`} onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle navigation">
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="lg:hidden border-t border-gray-100 bg-white">
            <div className="flex max-h-[calc(100vh-5rem)] flex-col overflow-y-auto p-4 sm:p-6 space-y-4">
              {topNav.map((item) => item === 'Kundli' ? (
                <div key={item} className="rounded-2xl border border-gray-100">
                  <button type="button" onClick={() => setKundliOpen((value) => !value)} className={`w-full flex items-center justify-between px-4 py-4 text-left font-medium ${active === 'Kundli' ? 'text-saffron' : 'text-gray-800'}`}>
                    {t('nav.kundli')}
                    <ChevronDown className={`w-4 h-4 transition-transform ${kundliOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {kundliOpen && (
                    <div className="border-t border-gray-100 bg-gray-50/70">
                      {kundliNav.map((item) => (
                        <button key={item.key} type="button" onClick={() => onNavigate(item.key)} className={`w-full px-4 py-3 text-left ${item.key === page ? 'text-saffron font-semibold' : 'text-gray-700'}`}>
                          {t(`nav.${kundliKeyMap[item.key]}`)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <button key={item} type="button" onClick={() => onNavigate(item)} className={`text-left font-medium ${active === item ? 'text-saffron' : 'text-gray-800'}`}>
                  {t(`nav.${navKeyMap[item]}`)}
                </button>
              ))}
              <div className="flex flex-col gap-3 pt-2">
                {session ? (
                  <div className="flex items-center gap-2 text-gray-700 font-medium px-4 py-2 bg-gray-50 rounded-xl border border-gray-100">
                    <User className="h-5 w-5" />
                    <span>{session.user?.full_name || 'Member'}</span>
                  </div>
                ) : (
                  <button type="button" onClick={() => { setMobileOpen(false); onNavigate('Login'); }} className="text-left font-medium text-gray-700">{t('nav.login')}</button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
