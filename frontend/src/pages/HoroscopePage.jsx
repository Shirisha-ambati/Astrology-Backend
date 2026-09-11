import React from 'react';
import { motion } from 'framer-motion';
import { Moon, Sparkles, Stars, Sun } from 'lucide-react';
import { horoscopeHeroUrl, zodiac } from '../data/siteContent';
import { AssetImage, Breadcrumb, HeroAsset } from '../components/shared/PageElements';

export default function HoroscopePage({ onNavigate, t }) {
  return (
    <main className="min-h-screen bg-white pb-20 pt-28 sm:pt-32">
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <Breadcrumb currentPage={t('nav.horoscope')} homeLabel={t('breadcrumb.home')} />
          <div className="grid overflow-hidden rounded-[2rem] border border-[#f5e3bf] bg-[#fff3df] shadow-[0_20px_60px_-35px_rgba(212,175,55,0.45)] lg:grid-cols-[1.08fr_1.1fr]">
            <HeroAsset
              src={horoscopeHeroUrl}
              alt="Horoscope hero"
              className="min-h-[300px] sm:min-h-[380px] lg:min-h-[620px]"
              fallback={
                <div className="relative h-full min-h-[300px] overflow-hidden bg-[radial-gradient(circle_at_50%_48%,rgba(255,198,92,0.96),rgba(160,61,13,0.92)_24%,rgba(15,33,74,0.96)_58%,rgba(2,6,23,1)_100%)] sm:min-h-[380px] lg:min-h-[620px]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_28%,rgba(255,255,255,0.35),transparent_18%),radial-gradient(circle_at_84%_18%,rgba(255,189,89,0.48),transparent_14%),radial-gradient(circle_at_76%_72%,rgba(255,189,89,0.55),transparent_11%),radial-gradient(circle_at_14%_76%,rgba(96,165,250,0.34),transparent_15%)]"></div>
                  <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#f7d59b]/70 shadow-[0_0_0_12px_rgba(170,103,37,0.25),0_0_0_24px_rgba(247,213,155,0.16)]"></div>
                  <div className="absolute left-1/2 top-1/2 h-58 w-58 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#f4b359]/75"></div>
                  <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,#ffe7a7_0%,#ffc554_44%,#db741f_74%,#762d12_100%)] shadow-[0_0_60px_rgba(255,197,84,0.6)]"></div>
                  <Sparkles className="absolute left-10 top-10 w-8 h-8 text-[#ffd89b]" />
                  <Moon className="absolute right-14 top-10 w-10 h-10 text-[#ffd89b]" />
                  <Sun className="absolute right-14 bottom-14 w-16 h-16 text-[#f8af45]" />
                  <Stars className="absolute left-10 bottom-12 w-12 h-12 text-[#dbeafe]" />
                </div>
              }
            />
            <div className="flex min-h-[300px] flex-col justify-center bg-[linear-gradient(180deg,#fff8ec_0%,#fff1d6_100%)] p-6 sm:min-h-[380px] sm:p-8 md:p-10 lg:min-h-[620px]">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-saffron mb-4">{t('horoscope.cosmicGuidance')}</p>
              <h1 className="mb-6 text-3xl font-bold text-black sm:text-4xl md:text-5xl">{t('horoscope.title')}</h1>
              <p className="mb-6 text-sm italic leading-7 text-gray-900 sm:text-base md:text-lg md:leading-8">&ldquo;{t('horoscope.quote')}&rdquo;</p>
              <p className="mb-8 text-base leading-8 text-gray-800 sm:text-lg md:text-[1.1rem] md:leading-9">{t('horoscope.description')}</p>
              <button
                type="button"
                onClick={() => onNavigate?.('Pandit Registration')}
                className="w-full rounded-2xl bg-[#ffbf00] px-6 py-4 text-lg font-medium text-black hover:bg-[#f0b300] transition-colors sm:w-fit sm:px-8 sm:text-xl"
              >
                {t('horoscope.consultation')}
              </button>
            </div>
          </div>
        </motion.div>
        <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mt-14">
          <h2 className="mb-8 text-2xl font-bold text-black sm:text-3xl md:text-4xl">{t('horoscope.dailyBySign')}</h2>
          <div className="rounded-[2rem] border border-[#ece5d6] bg-white p-6 md:p-8 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.2)]">
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-6">
              {zodiac.map((sign) => (
                <button key={sign.name} type="button" className="group flex min-h-[200px] flex-col items-center justify-center rounded-3xl border border-[#ede7db] bg-[#fbfaf8] px-4 py-6 text-center transition-all hover:-translate-y-1 sm:min-h-[220px] sm:px-6 sm:py-7">
                  <AssetImage src={sign.image} alt={sign.name} className="mb-4 h-28 w-28 rounded-[1.75rem] object-cover shadow-[0_12px_30px_-18px_rgba(0,0,0,0.35)]" fallback={<div className="mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#d8be95] to-[#b1864d] shadow-[inset_0_2px_12px_rgba(255,255,255,0.35),0_10px_25px_-16px_rgba(0,0,0,0.35)]"><span className="text-[3.2rem] leading-none text-[#fff8ea]">{sign.symbol}</span></div>} />
                  <h3 className="text-2xl leading-none font-bold text-[#b99a63] group-hover:text-saffron sm:text-[1.75rem]">{sign.name}</h3>
                  <p className="mt-2 text-base text-[#b99a63] sm:text-lg">{sign.dates}</p>
                </button>
              ))}
            </div>
          </div>
        </motion.section>
      </section>
    </main>
  );
}
