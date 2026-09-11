import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';
import { AssetImage, Breadcrumb } from '../components/shared/PageElements';
import { requireKundli } from '../lib/kundliStore';
import { articles } from '../data/siteContent';
import { apiClient } from '../lib/api';

const Motion = motion;

const pageCopy = {
  Love: {
    title: 'Love Predictions',
    intro: 'Personalised relationship guidance from your completed Kundli.',
    endpoint: '/love',
  },
  Marriage: {
    title: 'Marriage Predictions',
    intro: 'Personalised marriage guidance from your completed Kundli.',
    endpoint: '/marriage',
  },
};

const listText = (items) => items?.length ? items.join(' ') : 'No strong factor was available in the returned Kundli data.';

function predictionCards(type, prediction) {
  if (type === 'Love') return [
    ['Love Score', `${prediction.score}/100`], ['Love Life Overview', prediction.overview], ['Relationship Nature', prediction.relationshipNature], ['Romantic Personality', prediction.romanticPersonality], ['Strengths', listText(prediction.strengths)], ['Weaknesses', listText(prediction.weaknesses)], ['Relationship Challenges', listText(prediction.challenges)], ['Communication Style', prediction.communicationStyle], ['Emotional Stability', prediction.emotionalStability], ['Commitment Level', prediction.commitmentLevel], ['Best Love Period', listText(prediction.bestPeriods)], ['Lucky Relationship Traits', listText(prediction.luckyRelationshipTraits)], ['Relationship Advice', listText(prediction.advice)], ['Recommended Remedies', listText(prediction.remedies)],
  ].map(([label, text]) => ({ label, text }));
  return [
    ['Marriage Score', `${prediction.score}/100`], ['Marriage Probability', prediction.probability], ['Expected Marriage Age', prediction.expectedMarriageAge], ['Delay in Marriage', prediction.delayInMarriage], ['Marriage Stability', prediction.marriageStability], ['Spouse Nature', prediction.spouse?.nature], ['Spouse Personality', prediction.spouse?.personality], ['Spouse Career Tendency', prediction.spouse?.career], ['Family Life', prediction.familyLife], ['Children Prospects', prediction.children], ['Challenges', listText(prediction.challenges)], ['Positive Influences', listText(prediction.positiveFactors)], ['Negative Influences', listText(prediction.negativeFactors)], ['Remedies', listText(prediction.remedies)], ['Overall Recommendation', prediction.overallRecommendation],
  ].map(([label, text]) => ({ label, text }));
}

export default function PredictionPage({ type, t }) {
  const copy = pageCopy[type];
  const article = articles[type];
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!requireKundli()) return undefined;
    const controller = new AbortController();
    (async () => {
      try {
        const { data } = await apiClient.get(copy.endpoint, { signal: controller.signal });
        setPrediction(data);
      } catch (requestError) {
        if (!axios.isCancel(requestError) && requestError.name !== 'CanceledError') {
          if (requestError.response?.status === 400) {
            window.sessionStorage.setItem('vedaura:kundli-notice', 'Please generate your Kundli first.');
            window.location.hash = '#/kundli';
            return;
          }
          setError(requestError.response?.data?.error || 'We could not create your prediction right now. Please try again.');
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    })();
    return () => controller.abort();
  }, [copy.endpoint]);

  return (
    <main className="min-h-screen bg-white pb-20 pt-28 sm:pt-32">
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <Motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <Breadcrumb currentPage={type} homeLabel={t('breadcrumb.home')} />
          <div className="grid overflow-hidden rounded-[2rem] border border-[#efdfbf] bg-[#fff7ec] shadow-[0_20px_60px_-35px_rgba(212,175,55,0.45)] lg:grid-cols-[1fr_1.08fr]">
            <div className="h-[220px] overflow-hidden md:h-[300px]"><AssetImage src={article.image} alt={article.title} className="h-full w-full object-cover" fallback={<div className="h-full w-full bg-[linear-gradient(90deg,rgba(245,158,11,0.92),rgba(251,191,36,0.82),rgba(99,102,241,0.7))]" />} /></div>
            <div className="flex flex-col justify-center bg-[linear-gradient(180deg,#fff8ec_0%,#fff1d6_100%)] p-7 sm:p-10">
            <div className="flex items-start gap-4">
              <span className="rounded-2xl bg-[#ffc400] p-3 text-black"><Heart className="h-7 w-7 fill-current" /></span>
              <div><p className="text-sm font-semibold uppercase tracking-[0.22em] text-saffron">Your Kundli insight</p><h1 className="mt-2 text-3xl font-bold text-black sm:text-4xl">{copy.title}</h1><p className="mt-3 max-w-2xl text-gray-700">{copy.intro}</p></div>
            </div>
            </div>
          </div>
          {loading && <div className="mt-8 flex items-center justify-center gap-3 rounded-3xl bg-[#fff8ec] p-12 text-lg text-gray-700"><span className="h-6 w-6 animate-spin rounded-full border-2 border-saffron border-t-transparent" />Reading your Kundli...</div>}
          {error && <p role="alert" className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5 font-medium text-red-700">{error}</p>}
          {prediction && <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {predictionCards(type, prediction).map((card, index) => <Motion.article key={card.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }} className="rounded-3xl border border-[#efdfbf] bg-white p-6 shadow-[0_12px_35px_-25px_rgba(125,87,14,0.5)]"><Sparkles className="h-5 w-5 text-saffron" /><h2 className="mt-4 text-xl font-bold text-black">{card.label}</h2><p className="mt-3 leading-7 text-gray-700">{card.text}</p></Motion.article>)}
          </Motion.div>}
        </Motion.div>
      </section>
    </main>
  );
}
