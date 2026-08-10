import React from 'react';
import { Sun } from 'lucide-react';

export default function Footer({ t }) {
  return (
    <footer className="bg-gray-900 pb-10 pt-16 text-white sm:pt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-16 grid gap-10 sm:gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-6 flex items-center gap-2">
              <Sun className="h-8 w-8 text-saffron" />
              <span className="font-spiritual text-2xl font-bold">VedAura</span>
            </div>
            <p className="mb-6 text-sm leading-relaxed text-gray-400">
              Elevating human consciousness through the sacred amalgamation of ancient astrological wisdom and modern AI intelligence.
            </p>
          </div>
          <div>
            <h4 className="mb-6 font-spiritual text-lg font-bold">{t('footer.divinations')}</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>{t('nav.horoscope')}</li>
              <li>{t('nav.kundli')}</li>
              <li>{t('nav.numerology')}</li>
              <li>{t('nav.swar')}</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-6 font-spiritual text-lg font-bold">{t('footer.healing')}</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>Rudraksha</li>
              <li>Gemstones</li>
              <li>Yantras</li>
              <li>{t('login.exploreShop')}</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-6 font-spiritual text-lg font-bold">{t('footer.stayConnected')}</h4>
            <p className="mb-4 text-sm text-gray-400">{t('footer.receiveInsights')}</p>
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-0">
              <input
                type="email"
                placeholder={t('footer.emailPlaceholder')}
                className="w-full rounded-lg bg-gray-800 px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-saffron sm:rounded-r-none"
              />
              <button className="rounded-lg bg-saffron px-4 py-3 hover:bg-saffron-dark sm:rounded-l-none">{t('footer.subscribe')}</button>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-800 pt-8 text-center text-xs text-gray-500 md:flex-row md:text-left">
          <p>© 2026 VedAura. All rights reserved.</p>
          <p className="text-center md:text-right">{t('footer.disclaimer')}</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white">{t('footer.privacy')}</a>
            <a href="#" className="hover:text-white">{t('footer.terms')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
