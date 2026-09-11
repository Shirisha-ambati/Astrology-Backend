import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, X, ShieldCheck, FileText, Lock, Scale, CheckCircle2 } from 'lucide-react';

export default function Footer({ t }) {
  const [activeModal, setActiveModal] = useState(null); // 'privacy' | 'terms' | null

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
            <button
              type="button"
              onClick={() => setActiveModal('privacy')}
              className="text-gray-400 hover:text-saffron transition-colors cursor-pointer underline-offset-4 hover:underline"
            >
              {t('footer.privacy')}
            </button>
            <button
              type="button"
              onClick={() => setActiveModal('terms')}
              className="text-gray-400 hover:text-saffron transition-colors cursor-pointer underline-offset-4 hover:underline"
            >
              {t('footer.terms')}
            </button>
          </div>
        </div>
      </div>

      {/* Privacy & Terms Modals */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-[2.5rem] border border-[#f0dfbf] bg-white text-gray-800 shadow-2xl"
            >
              {/* Modal Top Bar */}
              <div className="flex items-center justify-between border-b border-gray-100 bg-[#fffcf5] px-6 py-5 sm:px-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-saffron/15 text-saffron">
                    {activeModal === 'privacy' ? <ShieldCheck className="h-6 w-6" /> : <Scale className="h-6 w-6" />}
                  </div>
                  <div>
                    <h3 className="font-spiritual text-2xl font-bold text-gray-900">
                      {activeModal === 'privacy' ? 'Privacy Policy' : 'Terms & Conditions'}
                    </h3>
                    <p className="text-xs font-semibold uppercase tracking-wider text-saffron">
                      VedAura Spiritual Guidance Platform • Effective Sept 2026
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-saffron hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Body Content */}
              <div className="custom-scrollbar overflow-y-auto p-6 sm:p-8 space-y-6 text-sm leading-relaxed text-gray-700">
                {activeModal === 'privacy' ? (
                  <>
                    <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 text-xs font-medium text-amber-900 flex items-start gap-2.5">
                      <Lock className="h-4 w-4 text-saffron shrink-0 mt-0.5" />
                      <span>
                        Your privacy is sacred to us. VedAura ensures end-to-end encryption for all personal birth details, consultation logs, and private guidance records.
                      </span>
                    </div>

                    <section className="space-y-2">
                      <h4 className="font-spiritual text-lg font-bold text-gray-900 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-saffron" /> 1. Information We Collect
                      </h4>
                      <p>
                        To provide accurate horoscope, Kundli, numerology, and Astro-Neuro calculations, we collect user-provided details including:
                      </p>
                      <ul className="list-disc list-inside space-y-1 pl-2 text-gray-600">
                        <li>Personal Identification: Name, Gender, Date of Birth, Exact Time of Birth, and City/Place of Birth.</li>
                        <li>Contact Information: Mobile phone number, email address, and delivery address for spiritual remedy shipments.</li>
                        <li>Consultation Preferences: Specific concerns shared with our verified pandits and spiritual consultants.</li>
                      </ul>
                    </section>

                    <section className="space-y-2">
                      <h4 className="font-spiritual text-lg font-bold text-gray-900 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-saffron" /> 2. How We Use Your Data
                      </h4>
                      <p>
                        Your information is strictly utilized to generate individual birth charts, deliver personalized daily horoscopes, connect you with verified pandits via call or chat, and process orders for certified gemstones and healing tools.
                      </p>
                    </section>

                    <section className="space-y-2">
                      <h4 className="font-spiritual text-lg font-bold text-gray-900 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-saffron" /> 3. Data Protection & Confidentiality
                      </h4>
                      <p>
                        VedAura does <strong>NOT</strong> sell, trade, or rent your personal information to third-party advertisers. All birth chart data and chat transcripts are stored in encrypted databases protected by modern industry security standards.
                      </p>
                    </section>

                    <section className="space-y-2">
                      <h4 className="font-spiritual text-lg font-bold text-gray-900 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-saffron" /> 4. Payment Security & Cookies
                      </h4>
                      <p>
                        Payment details (UPI, Netbanking, Cards) are processed directly by certified payment gateways. We use essential session cookies only to maintain user logins and language preferences.
                      </p>
                    </section>

                    <section className="space-y-2">
                      <h4 className="font-spiritual text-lg font-bold text-gray-900 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-saffron" /> 5. Your Data Rights
                      </h4>
                      <p>
                        You maintain full control over your profile. You may edit your personal details or request total deletion of your saved Kundli records and consultation history at any time by contacting support at <strong>privacy@vedaura.com</strong>.
                      </p>
                    </section>
                  </>
                ) : (
                  <>
                    <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 text-xs font-medium text-amber-900 flex items-start gap-2.5">
                      <FileText className="h-4 w-4 text-saffron shrink-0 mt-0.5" />
                      <span>
                        Please read these Terms and Conditions carefully before utilizing VedAura’s digital astrological tools, pandit consultation services, or spiritual remedies.
                      </span>
                    </div>

                    <section className="space-y-2">
                      <h4 className="font-spiritual text-lg font-bold text-gray-900 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-saffron" /> 1. Acceptance of Terms
                      </h4>
                      <p>
                        By accessing VedAura through desktop or mobile devices, you acknowledge and agree to comply with all terms, policies, and guidelines stated herein.
                      </p>
                    </section>

                    <section className="space-y-2">
                      <h4 className="font-spiritual text-lg font-bold text-gray-900 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-saffron" /> 2. Nature of Guidance (Disclaimer)
                      </h4>
                      <p>
                        VedAura provides horoscope calculations, birth charts, numerology insights, and pandit consultations for <strong>spiritual, wellness, and educational guidance only</strong>. Astrological insights do not replace professional medical, legal, psychological, or financial counsel.
                      </p>
                    </section>

                    <section className="space-y-2">
                      <h4 className="font-spiritual text-lg font-bold text-gray-900 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-saffron" /> 3. Pandit & Consultant Services
                      </h4>
                      <p>
                        Independent astrologers and pandits registered on VedAura provide guidance based on traditional Vedic calculations. Users are expected to maintain respectful communication during consultation calls and chats.
                      </p>
                    </section>

                    <section className="space-y-2">
                      <h4 className="font-spiritual text-lg font-bold text-gray-900 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-saffron" /> 4. Authentic Products & Lab Certification
                      </h4>
                      <p>
                        All gemstones, Rudraksha, and Yantras sold on the VedAura store are guaranteed 100% natural and accompanied by government-recognized laboratory certificates (IGI/IEGL). Shipping and return terms apply to physical remedies.
                      </p>
                    </section>

                    <section className="space-y-2">
                      <h4 className="font-spiritual text-lg font-bold text-gray-900 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-saffron" /> 5. Intellectual Property & Governing Law
                      </h4>
                      <p>
                        All proprietary branding, software logic, Astro-Neuro algorithms, and content on VedAura are intellectual property. These terms are governed by the laws of India, subject to exclusive court jurisdiction.
                      </p>
                    </section>
                  </>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end border-t border-gray-100 bg-[#fffcf5] px-6 py-4">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="rounded-full bg-saffron px-8 py-2.5 text-sm font-bold text-white shadow-md hover:bg-saffron/90 transition-colors"
                >
                  I Understand
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </footer>
  );
}
