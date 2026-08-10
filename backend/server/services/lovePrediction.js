import { evaluateRules, interpretKundli } from './kundliInterpreter.js';

const rules = [
  { label: 'Exalted Venus', score: 15, condition: (c) => c.planet('Venus')?.exalted, explanation: 'Venus is exalted, strengthening affection and the ability to create harmony.' },
  { label: 'Debilitated Venus', score: -12, condition: (c) => c.planet('Venus')?.debilitated, explanation: 'Venus is debilitated, so relationship expectations need extra care and communication.' },
  { label: 'Benefic fifth house', score: 12, condition: (c) => c.hasBeneficIn(5), explanation: 'A benefic planet occupies the fifth house of romance, supporting affectionate expression.' },
  { label: 'Rahu in fifth house', score: -10, condition: (c) => c.house(5).planets.includes('Rahu'), explanation: 'Rahu in the fifth house can create intense attractions and mixed signals.' },
  { label: 'Ketu in fifth house', score: -8, condition: (c) => c.house(5).planets.includes('Ketu'), explanation: 'Ketu in the fifth house can make emotional needs harder to articulate.' },
  { label: 'Strong Moon', score: 10, condition: (c) => c.planet('Moon')?.strong || c.planet('Moon')?.exalted, explanation: 'A strong Moon supports emotional steadiness and empathy.' },
  { label: 'Moon under pressure', score: -9, condition: (c) => c.conjunct('Moon', 'Saturn') || c.conjunct('Moon', 'Rahu'), explanation: 'Moon joined with Saturn or Rahu can bring reserve or overthinking in intimacy.' },
  { label: 'Jupiter aspect on romance', score: 9, condition: (c) => c.aspectsHouse('Jupiter', 5), explanation: 'Jupiter aspects the fifth house, adding optimism and wise choices in love.' },
  { label: 'Mercury strength', score: 6, condition: (c) => c.planet('Mercury')?.strong || c.planet('Mercury')?.exalted, explanation: 'Strong Mercury supports direct, considerate relationship communication.' },
  { label: 'Mars-Venus conjunction', score: 5, condition: (c) => c.conjunct('Mars', 'Venus'), explanation: 'Mars and Venus together add attraction and romantic initiative.' },
  { label: 'Mangal Dosha', score: -7, condition: (c) => c.doshas.mangal, explanation: 'Mangal Dosha asks for patience with conflict, impulsiveness, and expectations.' },
  { label: 'Kaal Sarp influence', score: -6, condition: (c) => c.doshas.kaalSarp, explanation: 'Kaal Sarp influence can make relationship concerns feel more intense than they are.' },
  { label: 'Recognised yoga', score: 5, condition: (c) => c.yogas.length > 0, explanation: (c) => `${c.yogas[0]} is present in the Kundli and adds supportive chart momentum.` },
  { label: 'Deva Gana', score: 5, condition: (c) => c.gana === 'Deva', explanation: 'Deva Gana in the Nakshatra details supports a considerate and idealistic approach to relationships.' },
  { label: 'Mercury-ruled Nakshatra', score: 4, condition: (c) => c.nakshatraLord === 'Mercury', explanation: 'A Mercury-ruled Nakshatra supports connection through thoughtful conversation and shared learning.' },
];

export function createLovePrediction(kundli) {
  const chart = interpretKundli(kundli);
  const result = evaluateRules(chart, rules);
  const positives = result.factors.filter((factor) => factor.type === 'positive');
  const negatives = result.factors.filter((factor) => factor.type === 'negative');
  const scoreBand = result.score >= 75 ? 'strong' : result.score >= 55 ? 'balanced' : 'developing';
  return {
    score: result.score,
    overview: `Your love potential is ${scoreBand}. This reading is calculated from the fifth house, Venus, Moon, and the aspects/doshas available in your Kundli.`,
    relationshipNature: result.score >= 70 ? 'Warm, expressive, and relationship-oriented.' : 'Thoughtful and selective; trust grows through consistency.',
    romanticPersonality: chart.planet('Venus')?.strong || chart.planet('Venus')?.exalted ? 'Affectionate and harmony-seeking, with a natural instinct for romance.' : 'Sincere and careful, preferring emotional security over quick attachment.',
    strengths: positives.map((factor) => factor.explanation),
    weaknesses: negatives.map((factor) => factor.explanation),
    challenges: negatives.map((factor) => factor.explanation),
    communicationStyle: chart.planet('Mercury')?.strong ? 'Clear and responsive; honest dialogue is a natural strength.' : 'Communication improves when feelings are stated plainly rather than assumed.',
    emotionalStability: chart.planet('Moon')?.strong || chart.planet('Moon')?.exalted ? 'Emotionally steady and empathetic.' : 'Sensitive emotions need regular reassurance and reflection.',
    commitmentLevel: result.score >= 65 ? 'Strong when mutual trust and values are present.' : 'Commitment develops gradually through reliability and emotional clarity.',
    bestPeriods: positives.length ? positives.slice(0, 3).map((factor) => `Favourable when you consciously use this strength: ${factor.label}.`) : ['Favourable during periods that support honest communication and emotional steadiness.'],
    luckyRelationshipTraits: chart.hasBeneficIn(5) ? ['Kindness', 'shared learning', 'emotional generosity'] : ['Patience', 'clear boundaries', 'mutual respect'],
    advice: negatives.length ? negatives.map((factor) => `Work with ${factor.label.toLowerCase()} through calm, direct conversations.`) : ['Continue building trust through regular, honest communication.'],
    remedies: chart.doshas.mangal ? ['Practice patience before difficult conversations; avoid decisions made in anger.'] : ['Set aside a weekly gratitude and communication ritual with your partner.'],
    analysis: { ascendant: chart.ascendant, moonSign: chart.moonSign, sunSign: chart.sunSign, zodiacSign: chart.zodiacSign, nakshatra: chart.nakshatra, gana: chart.gana, fifthHouse: chart.house(5), venus: chart.planet('Venus'), moon: chart.planet('Moon'), factors: result.factors },
  };
}
