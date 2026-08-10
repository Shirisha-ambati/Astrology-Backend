import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Gem, ShoppingBag, ShieldCheck, Sparkles, Star } from 'lucide-react';
import { products, shopCategories } from '../data/siteContent';
import { Breadcrumb } from '../components/shared/PageElements';

const trustPoints = [
  'Energized with ritual care',
  'Curated for healing and harmony',
  'Support for guided selection'
];

export default function ShopPage({ onNavigate, t }) {
  return (
    <main className="relative min-h-screen overflow-hidden pb-20 pt-32">
      <div className="fixed inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover"
        >
          <source src="/Astrology_shop_in_202604081207.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(26,16,8,0.72)_0%,rgba(66,42,18,0.6)_32%,rgba(255,248,235,0.42)_68%,rgba(255,252,247,0.78)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,214,140,0.28),transparent_36%)]" />
      </div>

      <section className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-6">
            <Breadcrumb currentPage={t('nav.shop')} homeLabel={t('breadcrumb.home')} />
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div className="rounded-[2rem] border border-white/15 bg-[linear-gradient(135deg,rgba(42,28,14,0.72)_0%,rgba(109,69,24,0.45)_45%,rgba(255,255,255,0.08)_100%)] p-8 shadow-[0_30px_90px_-44px_rgba(0,0,0,0.5)] backdrop-blur-md md:p-10">
              <div>
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#FF9933_0%,#D4AF37_100%)] text-white">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="mb-2 text-sm font-semibold uppercase tracking-[0.28em] text-gold-light">{t('shop.healingStore')}</p>
                    <h1 className="text-4xl font-bold text-white md:text-5xl">{t('shop.heroTitle')}</h1>
                  </div>
                </div>
                <p className="max-w-3xl text-lg leading-9 text-white/85 md:text-xl">{t('shop.heroDescription')}</p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <button type="button" onClick={() => onNavigate('Login')} className="btn-primary py-4 text-base">{t('shop.loginAccess')}</button>
                  <button type="button" onClick={() => onNavigate('Home')} className="rounded-full border border-white/30 bg-white/10 px-8 py-4 text-base font-medium text-white backdrop-blur-md transition hover:bg-white/20">{t('shop.backHome')}</button>
                </div>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-white/10 bg-[#2d2418]/78 p-6 text-white shadow-[0_26px_55px_-34px_rgba(45,36,24,0.82)] backdrop-blur-md">
              <div className="mb-5 flex items-center gap-3">
                <ShieldCheck className="h-6 w-6 text-gold-light" />
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-gold-light">{t('shop.whyShopHere')}</p>
              </div>
              <div className="space-y-4">
                {[
                  t('shop.reason1'),
                  t('shop.reason2'),
                  t('shop.reason3')
                ].map((point) => (
                  <div key={point} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                    <Sparkles className="mt-1 h-4 w-4 text-saffron" />
                    <p className="text-sm leading-6 text-white/80">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <section className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <div key={product.name} className="rounded-[1.75rem] border border-white/25 bg-white/78 p-6 shadow-[0_18px_45px_-35px_rgba(212,175,55,0.35)] backdrop-blur-md transition-transform duration-300 hover:-translate-y-1">
              <div className="relative mb-4 h-56 overflow-hidden rounded-2xl bg-[#fff8ee]/90">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <div className="flex h-28 w-28 items-center justify-center rounded-full bg-white shadow-soft">
                      <Star className="text-gold/50 w-12 h-12" />
                    </div>
                  </div>
                )}
              </div>
              <h3 className="font-bold text-gray-900 font-spiritual text-xl">{product.name}</h3>
              <p className="mt-2 text-saffron font-semibold">{product.price}</p>
              <button type="button" onClick={() => onNavigate('Login')} className="mt-5 flex items-center text-sm font-semibold text-gray-700 hover:text-saffron">
                {t('shop.loginOrder')} <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          ))}
        </section>

        <section className="mt-16 rounded-[2rem] border border-white/20 bg-[#2d2418]/60 p-8 text-white shadow-[0_22px_65px_-38px_rgba(0,0,0,0.55)] backdrop-blur-md md:p-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-gold-light">{t('shop.moreCategories')}</p>
              <h2 className="mt-3 font-spiritual text-3xl font-bold md:text-4xl">{t('shop.exploreCollection')}</h2>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-white/75 md:text-base">
              {t('shop.exploreCollectionDesc')}
            </p>
          </div>
        </section>

        <section className="mt-10 space-y-10">
          {shopCategories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: index * 0.05 }}
              className="rounded-[2rem] border border-white/25 bg-white/76 p-6 shadow-[0_22px_55px_-38px_rgba(212,175,55,0.34)] backdrop-blur-md md:p-8"
            >
              <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="mb-3 inline-flex items-center gap-3 rounded-full bg-saffron/10 px-4 py-2 text-sm font-semibold text-saffron">
                    <Gem className="h-4 w-4" />
                    {t('shop.category')}
                  </div>
                  <h3 className="font-spiritual text-2xl font-bold text-gray-900 md:text-3xl">{category.title}</h3>
                  <p className="mt-3 max-w-3xl text-gray-600">{category.description}</p>
                </div>
                <button type="button" onClick={() => onNavigate('Login')} className="inline-flex items-center text-sm font-semibold text-gray-700 hover:text-saffron">
                  {t('shop.loginUnlock')} <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                {category.items.map((item) => (
                  <div key={item.name} className="rounded-[1.5rem] border border-[#f3dfbf] bg-[#fff8ef] p-5 shadow-[0_14px_35px_-28px_rgba(212,175,55,0.45)]">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-soft">
                        <Star className="h-5 w-5 text-gold/60" />
                      </div>
                      <span className="rounded-full bg-saffron/10 px-3 py-1 text-xs font-semibold text-saffron">{item.tag}</span>
                    </div>
                    <div className="mb-4 overflow-hidden rounded-2xl bg-white">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="h-44 w-full object-cover" />
                      ) : (
                        <div className="flex h-44 items-center justify-center bg-[#fff3dd]">
                          <Star className="h-10 w-10 text-gold/60" />
                        </div>
                      )}
                    </div>
                    <h4 className="font-spiritual text-xl font-bold text-gray-900">{item.name}</h4>
                    <p className="mt-3 text-base font-semibold text-saffron">{item.price}</p>
                    <button type="button" onClick={() => onNavigate('Login')} className="mt-5 inline-flex items-center text-sm font-semibold text-gray-700 hover:text-saffron">
                      {t('shop.viewDetails')} <ArrowRight className="ml-2 h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </section>
      </section>
    </main>
  );
}
