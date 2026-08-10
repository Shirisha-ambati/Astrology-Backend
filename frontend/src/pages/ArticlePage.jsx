import React from 'react';
import { motion } from 'framer-motion';
import { articles } from '../data/siteContent';
import { AssetImage, Breadcrumb } from '../components/shared/PageElements';

export default function ArticlePage({ page, t }) {
  const article = articles[page];

  return (
    <main className="min-h-screen bg-white pb-20 pt-28 sm:pt-32">
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <Breadcrumb currentPage={article.crumb} homeLabel={t('breadcrumb.home')} />
          <div className="grid overflow-hidden rounded-[2rem] border border-[#efdfbf] bg-[#fff7ec] shadow-[0_20px_60px_-35px_rgba(212,175,55,0.45)] lg:grid-cols-[1fr_1.08fr]">
            <div className="h-[260px] overflow-hidden md:h-[360px]">
              <AssetImage src={article.image} alt={article.title} className="h-full w-full object-cover" fallback={<div className="h-full w-full bg-[linear-gradient(90deg,rgba(245,158,11,0.92),rgba(251,191,36,0.82),rgba(99,102,241,0.7))]"></div>} />
            </div>
            <div className="flex flex-col justify-center bg-[linear-gradient(180deg,#fff8ec_0%,#fff1d6_100%)] p-6 sm:p-7 md:p-8">
              <p className="text-xs md:text-sm font-semibold uppercase tracking-[0.28em] text-saffron mb-3">{t('shared.sacredInsight')}</p>
              <h1 className="mb-5 text-2xl font-bold leading-[1.12] text-black sm:text-3xl md:text-[2.6rem] lg:text-[3.15rem]">{article.title}</h1>
              <p className="text-sm md:text-[1.02rem] leading-7 text-gray-900 italic mb-5">&ldquo;{article.quote}&rdquo;</p>
              <p className="text-base md:text-[1.02rem] leading-8 text-gray-800">{article.body[0]}</p>
            </div>
          </div>
          <div className="mt-8 space-y-6 text-base leading-8 text-black sm:space-y-8 sm:text-[1.1rem] md:text-[1.25rem] md:leading-10">
            {article.body.slice(1).map((text, index) => <p key={index}>{text}</p>)}
          </div>
        </motion.div>
      </section>
    </main>
  );
}
