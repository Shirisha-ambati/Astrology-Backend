const PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
const SIGNS = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
const VEDIC_SIGNS = { mesha: 'Aries', vrishabha: 'Taurus', mithuna: 'Gemini', karkata: 'Cancer', simha: 'Leo', kanya: 'Virgo', tula: 'Libra', vrishchika: 'Scorpio', dhanu: 'Sagittarius', makara: 'Capricorn', kumbha: 'Aquarius', meena: 'Pisces' };
const SIGN_RULERS = { Aries: 'Mars', Taurus: 'Venus', Gemini: 'Mercury', Cancer: 'Moon', Leo: 'Sun', Virgo: 'Mercury', Libra: 'Venus', Scorpio: 'Mars', Sagittarius: 'Jupiter', Capricorn: 'Saturn', Aquarius: 'Saturn', Pisces: 'Jupiter' };
const BENEFICS = new Set(['Jupiter', 'Venus', 'Mercury', 'Moon']);
const MALEFICS = new Set(['Sun', 'Mars', 'Saturn', 'Rahu', 'Ketu']);

const canonical = (value) => String(value || '').trim().toLowerCase().replace(/[\s_-]+/g, '');
const nameOf = (value) => typeof value === 'string' ? value : value?.name || value?.value || value?.title || '';
const planetName = (value) => PLANETS.find((planet) => canonical(planet) === canonical(nameOf(value))) || null;
const signName = (value) => {
  const normalized = canonical(nameOf(value));
  return SIGNS.find((sign) => canonical(sign) === normalized) || VEDIC_SIGNS[normalized] || null;
};
const numberOf = (value) => { const result = Number(value); return Number.isFinite(result) ? result : null; };
const get = (source, ...keys) => keys.map((key) => source?.[key]).find((value) => value !== undefined && value !== null);

function walk(value, visitor, seen = new WeakSet()) {
  if (!value || typeof value !== 'object') return;
  if (seen.has(value)) return;
  seen.add(value);
  visitor(value);
  Object.values(value).forEach((child) => walk(child, visitor, seen));
}

function collectArrays(chart, matcher) {
  const arrays = [];
  walk(chart, (value) => Object.entries(value).forEach(([key, item]) => {
    if (Array.isArray(item) && matcher(canonical(key), item)) arrays.push(item);
  }));
  return arrays.flat();
}

function normalizePlanet(item) {
  const planet = planetName(get(item, 'planet', 'name', 'planet_name', 'graha'));
  if (!planet) return null;
  const sign = signName(get(item, 'sign', 'zodiac', 'rasi', 'zodiac_sign', 'sign_name'));
  const house = numberOf(get(item, 'house', 'house_number', 'bhava', 'house_no'));
  const state = canonical(get(item, 'status', 'dignity', 'strength', 'state'));
  const text = JSON.stringify(item).toLowerCase();
  return {
    planet, sign, house,
    retrograde: Boolean(get(item, 'retrograde', 'is_retrograde', 'vakri')) || text.includes('retrograde'),
    exalted: state.includes('exalt') || text.includes('exalt'),
    debilitated: state.includes('debil') || text.includes('debil'),
    strong: state.includes('strong') || state.includes('powerful') || text.includes('strong'),
    raw: item,
  };
}

function normalizeHouses(chart, planets) {
  const rawHouses = collectArrays(chart, (key, items) => key.includes('house') || items.some((item) => numberOf(get(item, 'house', 'house_number', 'bhava', 'house_no'))));
  const houses = Array.from({ length: 12 }, (_, index) => ({ number: index + 1, sign: null, lord: null, planets: [] }));
  rawHouses.forEach((item) => {
    const number = numberOf(get(item, 'house', 'number', 'house_number', 'id'));
    if (!number || number < 1 || number > 12) return;
    const house = houses[number - 1];
    house.sign = signName(get(item, 'sign', 'rasi', 'zodiac')) || house.sign;
    house.lord = planetName(get(item, 'lord', 'house_lord', 'ruler')) || house.lord;
    const listed = get(item, 'planets', 'planet_positions', 'occupants') || [];
    if (Array.isArray(listed)) house.planets.push(...listed.map(normalizePlanet).filter(Boolean).map((planet) => planet.planet));
  });
  planets.forEach((planet) => { if (planet.house >= 1 && planet.house <= 12) houses[planet.house - 1].planets.push(planet.planet); });
  houses.forEach((house) => { house.planets = [...new Set(house.planets)]; house.lord ||= SIGN_RULERS[house.sign] || null; });
  return houses;
}

function normalizeDoshas(chart) {
  const result = { mangal: false, kaalSarp: false, all: [] };
  walk(chart, (value) => Object.entries(value).forEach(([key, item]) => {
    const label = `${key} ${typeof item === 'string' ? item : ''}`.toLowerCase();
    const active = item === true || item?.has_dosha === true || item?.hasDosha === true || item?.present === true || item?.status === 'present';
    if (label.includes('mangal') && active) result.mangal = true;
    if ((label.includes('kaal') || label.includes('kalsarp')) && active) result.kaalSarp = true;
    if ((label.includes('dosha') || label.includes('dosh')) && active) result.all.push(key);
  }));
  result.all = [...new Set(result.all)];
  return result;
}

export function interpretKundli(kundli) {
  const source = kundli || {};
  // Kundli summary lives under `data`; enriched Rasi/Bhava data is attached at
  // the response root. Keep both so all prediction modules read one context.
  const chart = { ...(source.data || source), chartData: source.chartData || source.data?.chartData || null };
  const rawPlanets = collectArrays(chart, (key, items) => key.includes('planet') || items.some((item) => planetName(get(item, 'planet', 'name', 'planet_name'))));
  const byPlanet = new Map();
  rawPlanets.map(normalizePlanet).filter(Boolean).forEach((planet) => { if (!byPlanet.has(planet.planet)) byPlanet.set(planet.planet, planet); });
  const planets = [...byPlanet.values()];
  const ascendant = signName(get(chart, 'ascendant', 'lagna', 'ascendant_sign')) || signName(chart?.ascendant_details?.sign);
  const houses = normalizeHouses(chart, planets);
  const moon = planets.find((planet) => planet.planet === 'Moon');
  const sun = planets.find((planet) => planet.planet === 'Sun');
  const nakshatra = nameOf(chart?.nakshatra_details?.nakshatra || chart?.nakshatra?.name || chart?.nakshatra) || null;
  const yogas = collectArrays(chart, (key) => key.includes('yoga')).map(nameOf).filter(Boolean);
  const additionalInfo = chart?.nakshatra_details?.additional_info || {};
  const context = {
    ascendant,
    moonSign: moon?.sign || signName(chart?.nakshatra_details?.chandra_rasi),
    sunSign: sun?.sign || signName(chart?.nakshatra_details?.soorya_rasi),
    zodiacSign: signName(chart?.nakshatra_details?.zodiac),
    nakshatra,
    nakshatraLord: planetName(chart?.nakshatra_details?.nakshatra?.lord),
    gana: nameOf(additionalInfo.ganam) || null,
    nadi: nameOf(additionalInfo.nadi) || null,
    planets, houses, yogas, doshas: normalizeDoshas(chart),
  };
  context.planet = (name) => planets.find((planet) => planet.planet === name) || null;
  context.house = (number) => houses[number - 1] || { number, planets: [], lord: null, sign: null };
  context.isBenefic = (name) => BENEFICS.has(name);
  context.isMalefic = (name) => MALEFICS.has(name);
  context.hasBeneficIn = (number) => context.house(number).planets.some((name) => context.isBenefic(name));
  context.hasMaleficIn = (number) => context.house(number).planets.some((name) => context.isMalefic(name));
  context.conjunct = (first, second) => { const a = context.planet(first); const b = context.planet(second); return Boolean(a?.house && a.house === b?.house); };
  context.aspectsHouse = (planetNameValue, house) => {
    const planet = context.planet(planetNameValue); if (!planet?.house) return false;
    const distance = ((house - planet.house + 12) % 12) + 1;
    const distances = planet.planet === 'Mars' ? [4, 7, 8] : planet.planet === 'Jupiter' ? [5, 7, 9] : planet.planet === 'Saturn' ? [3, 7, 10] : [7];
    return distances.includes(distance);
  };
  return context;
}

export function evaluateRules(context, rules, startingScore = 50) {
  let score = startingScore;
  const factors = [];
  rules.forEach((rule) => {
    if (!rule.condition(context)) return;
    score += rule.score;
    factors.push({ label: rule.label, score: rule.score, explanation: typeof rule.explanation === 'function' ? rule.explanation(context) : rule.explanation, type: rule.score >= 0 ? 'positive' : 'negative' });
  });
  return { score: Math.max(0, Math.min(100, Math.round(score))), factors };
}
