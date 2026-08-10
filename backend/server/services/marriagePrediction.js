import { evaluateRules, interpretKundli } from './kundliInterpreter.js';

const rules = [
  { label: 'Benefic seventh house', score: 14, condition: (c) => c.hasBeneficIn(7), explanation: 'A benefic planet in the seventh house supports cooperation and marital goodwill.' },
  { label: 'Jupiter aspect on seventh house', score: 12, condition: (c) => c.aspectsHouse('Jupiter', 7), explanation: 'Jupiter aspects the seventh house, supporting wisdom and stability in partnership.' },
  { label: 'Strong Venus', score: 10, condition: (c) => c.planet('Venus')?.strong || c.planet('Venus')?.exalted, explanation: 'A strong Venus supports affection, compromise, and appreciation in marriage.' },
  { label: 'Strong seventh lord', score: 10, condition: (c) => { const lord = c.house(7).lord; const planet = lord && c.planet(lord); return Boolean(planet?.strong || planet?.exalted); }, explanation: (c) => `The seventh lord (${c.house(7).lord}) is strong, supporting committed partnership.` },
  { label: 'Saturn in seventh house', score: -10, condition: (c) => c.house(7).planets.includes('Saturn'), explanation: 'Saturn in the seventh house can delay commitment or make partnership feel duty-heavy before it matures.' },
  { label: 'Rahu or Ketu in seventh house', score: -12, condition: (c) => c.house(7).planets.some((planet) => ['Rahu', 'Ketu'].includes(planet)), explanation: 'Rahu or Ketu in the seventh house can bring unconventional expectations or uncertainty into partnership choices.' },
  { label: 'Mars affecting seventh house', score: -8, condition: (c) => c.house(7).planets.includes('Mars') || c.aspectsHouse('Mars', 7), explanation: 'Mars affects the seventh house, so managing impatience and conflict is important for stability.' },
  { label: 'Mangal Dosha', score: -10, condition: (c) => c.doshas.mangal, explanation: 'Mangal Dosha is present; compatibility, patience, and conflict-management deserve special attention.' },
  { label: 'Moon-Saturn conjunction', score: -7, condition: (c) => c.conjunct('Moon', 'Saturn'), explanation: 'Moon with Saturn can make emotional expression more reserved in married life.' },
  { label: 'Kaal Sarp influence', score: -6, condition: (c) => c.doshas.kaalSarp, explanation: 'Kaal Sarp influence can intensify worry around marriage decisions.' },
  { label: 'Benefic yoga', score: 5, condition: (c) => c.yogas.length > 0, explanation: (c) => `${c.yogas[0]} adds a supportive yoga influence to the marriage reading.` },
  { label: 'Deva Gana', score: 5, condition: (c) => c.gana === 'Deva', explanation: 'Deva Gana supports goodwill, cooperation, and a respectful partnership approach.' },
];

export function createMarriagePrediction(kundli) {
  const chart = interpretKundli(kundli);
  const result = evaluateRules(chart, rules);
  const positiveFactors = result.factors.filter((factor) => factor.type === 'positive');
  const negativeFactors = result.factors.filter((factor) => factor.type === 'negative');
  const delayed = negativeFactors.some((factor) => ['Saturn in seventh house', 'Rahu or Ketu in seventh house', 'Mangal Dosha'].includes(factor.label));
  const age = delayed ? (result.score >= 60 ? '27-31' : '29-33') : (result.score >= 70 ? '25-28' : '26-30');
  return {
    score: result.score,
    probability: result.score >= 75 ? 'High' : result.score >= 55 ? 'Moderate to High' : 'Moderate',
    expectedMarriageAge: age,
    delayInMarriage: delayed ? 'Some delay or a more deliberate decision process is indicated by the active Saturn, node, or Mars factors.' : 'No major delay factor is active in the available Kundli data.',
    marriageStability: result.score >= 70 ? 'Strong potential for a stable partnership with shared values.' : 'Stability improves through conscious communication and compatible expectations.',
    spouse: {
      nature: chart.hasBeneficIn(7) ? 'Cooperative, supportive, and inclined toward fair partnership.' : 'Independent, practical, and best suited to a relationship built on mutual respect.',
      career: chart.house(7).lord === 'Mercury' ? 'Communication, business, analysis, or trade-oriented work is favoured.' : chart.house(7).lord === 'Saturn' ? 'Structured, technical, administration, or long-term professional work is favoured.' : 'A stable career with responsibility and steady growth is favoured.',
      personality: chart.planet('Venus')?.strong ? 'Warm, diplomatic, and relationship-focused.' : 'Reliable, sincere, and more expressive when trust is established.',
    },
    familyLife: chart.hasBeneficIn(7) ? 'Family life is supported by cooperation and thoughtful decision-making.' : 'Family harmony grows when responsibilities and boundaries are discussed early.',
    children: chart.hasBeneficIn(5) ? 'The fifth house has benefic support, which is a positive family and children factor.' : 'Children prospects are best approached with patience and practical planning; the available fifth-house data is neutral.',
    challenges: negativeFactors.map((factor) => factor.explanation),
    positiveFactors: positiveFactors.map((factor) => factor.explanation),
    negativeFactors: negativeFactors.map((factor) => factor.explanation),
    remedies: chart.doshas.mangal ? ['Choose compatibility carefully, practise calm conflict resolution, and avoid decisions made in anger.'] : ['Keep a regular couple check-in and make important family decisions after calm discussion.'],
    overallRecommendation: result.score >= 70 ? 'The chart supports marriage when emotional maturity and compatible values guide the choice.' : 'Take time to assess compatibility, communicate expectations clearly, and do not let pressure rush a commitment.',
    analysis: { ascendant: chart.ascendant, moonSign: chart.moonSign, sunSign: chart.sunSign, zodiacSign: chart.zodiacSign, nakshatra: chart.nakshatra, gana: chart.gana, seventhHouse: chart.house(7), seventhLord: chart.house(7).lord, venus: chart.planet('Venus'), jupiter: chart.planet('Jupiter'), doshas: chart.doshas, factors: result.factors },
  };
}
