// Numerology Calculator Service
// Computes core numerology numbers using Pythagorean system

const LETTER_VALUES = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
  J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
  S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8,
};

const VOWELS = new Set(['A', 'E', 'I', 'O', 'U']);

// Reduce a number to a single digit (keep 11, 22, 33 as master numbers)
function reduce(n, keepMaster = true) {
  if (keepMaster && (n === 11 || n === 22 || n === 33)) return n;
  if (n < 10) return n;
  const next = String(n).split('').reduce((sum, d) => sum + Number(d), 0);
  return reduce(next, keepMaster);
}

// Sum digits of a number string
function digitSum(str) {
  return str.split('').reduce((sum, ch) => sum + Number(ch), 0);
}

export function calculateLifePath(dob) {
  // dob: YYYY-MM-DD
  const [year, month, day] = dob.split('-');
  const dayNum = reduce(digitSum(day));
  const monthNum = reduce(digitSum(month));
  const yearNum = reduce(digitSum(year));
  const raw = dayNum + monthNum + yearNum;
  return reduce(raw);
}

export function calculateDestinyNumber(fullName) {
  const letters = fullName.toUpperCase().replace(/[^A-Z]/g, '');
  const total = letters.split('').reduce((sum, ch) => sum + (LETTER_VALUES[ch] || 0), 0);
  return reduce(total);
}

export function calculateSoulUrgeNumber(fullName) {
  const letters = fullName.toUpperCase().replace(/[^A-Z]/g, '');
  const total = letters.split('').filter(ch => VOWELS.has(ch)).reduce((sum, ch) => sum + (LETTER_VALUES[ch] || 0), 0);
  return reduce(total || 1);
}

export function calculatePersonalityNumber(fullName) {
  const letters = fullName.toUpperCase().replace(/[^A-Z]/g, '');
  const total = letters.split('').filter(ch => !VOWELS.has(ch)).reduce((sum, ch) => sum + (LETTER_VALUES[ch] || 0), 0);
  return reduce(total || 1);
}

export function calculateBirthdayNumber(dob) {
  const day = dob.split('-')[2];
  return reduce(digitSum(day));
}

export function calculatePersonalYear(dob) {
  const currentYear = new Date().getFullYear();
  const [, month, day] = dob.split('-');
  const raw = digitSum(day) + digitSum(month) + digitSum(String(currentYear));
  return reduce(raw);
}

// ──────────────────────────────────────────────
// Interpretations
// ──────────────────────────────────────────────

const NUMBER_MEANINGS = {
  1: {
    title: 'The Leader',
    planet: 'Sun',
    element: 'Fire',
    traits: ['Independent', 'Ambitious', 'Courageous', 'Innovative'],
    strengths: ['Natural leadership', 'Strong willpower', 'Pioneer spirit', 'Self-reliance'],
    challenges: ['Can be overly dominant', 'Impatience with others', 'Risk of ego conflicts'],
    love: 'You seek a partner who respects your independence and matches your ambition. You love passionately but need personal space.',
    career: 'Thrives in roles of leadership, entrepreneurship, and innovation. Best suited for executive or creative leadership positions.',
    lucky: { numbers: '1, 2, 3, 9', colors: 'Gold, Saffron, Orange', gems: 'Ruby, Garnet', days: 'Sunday, Monday', years: '1, 10, 19, 28' },
    mantra: 'Om Suryaya Namah',
    affirmation: 'I lead with purpose and create my own destiny.',
  },
  2: {
    title: 'The Peacemaker',
    planet: 'Moon',
    element: 'Water',
    traits: ['Diplomatic', 'Empathetic', 'Cooperative', 'Intuitive'],
    strengths: ['Natural mediator', 'Deep intuition', 'Emotional intelligence', 'Team harmony'],
    challenges: ['May be overly sensitive', 'Indecisiveness', 'Can absorb others\' emotions'],
    love: 'You are devoted and emotionally attuned. You seek deep, soulful bonds and thrive in nurturing partnerships.',
    career: 'Counselling, diplomacy, teaching, healthcare, and collaborative roles. You excel where empathy is valued.',
    lucky: { numbers: '2, 1, 5', colors: 'White, Silver, Cream', gems: 'Pearl, Moonstone', days: 'Monday, Friday', years: '2, 11, 20, 29' },
    mantra: 'Om Chandraya Namah',
    affirmation: 'I embrace harmony and trust my deep intuition.',
  },
  3: {
    title: 'The Creator',
    planet: 'Jupiter',
    element: 'Fire',
    traits: ['Creative', 'Expressive', 'Joyful', 'Optimistic'],
    strengths: ['Artistic ability', 'Charismatic communication', 'Joyful energy', 'Inspiring others'],
    challenges: ['Scattering energy', 'Avoiding depth', 'Overindulgence'],
    love: 'You bring fun, warmth, and creativity to relationships. You need a partner who appreciates your expressive nature.',
    career: 'Arts, writing, performance, communication, media, and design. Any field that lets your creativity shine.',
    lucky: { numbers: '3, 1, 2, 9', colors: 'Yellow, Gold, Purple', gems: 'Yellow Sapphire, Topaz', days: 'Thursday, Tuesday', years: '3, 12, 21, 30' },
    mantra: 'Om Brihaspataye Namah',
    affirmation: 'I express my authentic self and inspire those around me.',
  },
  4: {
    title: 'The Builder',
    planet: 'Rahu',
    element: 'Earth',
    traits: ['Disciplined', 'Reliable', 'Methodical', 'Practical'],
    strengths: ['Rock-solid dependability', 'Strong work ethic', 'Precision and detail', 'Long-term planning'],
    challenges: ['Rigidity', 'Over-seriousness', 'Resistance to change'],
    love: 'You value loyalty and stability above all. You are a devoted partner who shows love through consistent action.',
    career: 'Engineering, architecture, finance, law enforcement, and management. Any field requiring precision and structure.',
    lucky: { numbers: '4, 5, 6, 8', colors: 'Earth tones, Navy, Dark Green', gems: 'Hessonite, Emerald', days: 'Saturday, Sunday', years: '4, 13, 22, 31' },
    mantra: 'Om Rahave Namah',
    affirmation: 'I build lasting foundations with patience and integrity.',
  },
  5: {
    title: 'The Free Spirit',
    planet: 'Mercury',
    element: 'Air',
    traits: ['Adventurous', 'Versatile', 'Curious', 'Dynamic'],
    strengths: ['Adaptability', 'Quick thinking', 'Magnetic charisma', 'Love of learning'],
    challenges: ['Commitment issues', 'Restlessness', 'Impulsive decisions'],
    love: 'You crave excitement and variety. You need a partner who keeps things fresh, gives you freedom, and matches your energy.',
    career: 'Travel, sales, journalism, marketing, technology, and entrepreneurship. You thrive in dynamic environments.',
    lucky: { numbers: '5, 1, 6', colors: 'Green, Grey, Light Blue', gems: 'Emerald, Green Tourmaline', days: 'Wednesday, Friday', years: '5, 14, 23' },
    mantra: 'Om Budhaya Namah',
    affirmation: 'I embrace change and flow freely toward my highest growth.',
  },
  6: {
    title: 'The Nurturer',
    planet: 'Venus',
    element: 'Earth',
    traits: ['Caring', 'Responsible', 'Loving', 'Harmonious'],
    strengths: ['Natural caregiver', 'Creating beauty', 'Strong sense of justice', 'Family devotion'],
    challenges: ['Over-responsibility for others', 'Perfectionism', 'Self-neglect'],
    love: 'You are the most loving, devoted partner. You pour your heart into relationships and create a beautiful, nurturing home.',
    career: 'Healthcare, teaching, counselling, interior design, social work, and the arts. Roles with heart and healing.',
    lucky: { numbers: '6, 4, 5, 8', colors: 'Pink, Rose, Ivory', gems: 'Diamond, Rose Quartz', days: 'Friday, Wednesday', years: '6, 15, 24' },
    mantra: 'Om Shukraya Namah',
    affirmation: 'I nurture myself and others with unconditional love.',
  },
  7: {
    title: 'The Seeker',
    planet: 'Ketu',
    element: 'Water',
    traits: ['Analytical', 'Spiritual', 'Introspective', 'Wise'],
    strengths: ['Deep intellect', 'Spiritual insight', 'Research ability', 'Inner wisdom'],
    challenges: ['Isolation tendencies', 'Difficulty trusting', 'Over-analysis'],
    love: 'You seek a soulmate, not just a partner. You value deep spiritual and intellectual connection above surface attraction.',
    career: 'Research, philosophy, psychology, spirituality, data science, and writing. Fields that reward deep thinking.',
    lucky: { numbers: '7, 1, 2, 9', colors: 'Violet, Grey, Indigo', gems: 'Cat\'s Eye, Amethyst', days: 'Saturday, Sunday', years: '7, 16, 25' },
    mantra: 'Om Ketave Namah',
    affirmation: 'I trust my inner wisdom and seek truth with an open heart.',
  },
  8: {
    title: 'The Achiever',
    planet: 'Saturn',
    element: 'Earth',
    traits: ['Ambitious', 'Powerful', 'Disciplined', 'Strategic'],
    strengths: ['Business acumen', 'Executive authority', 'Financial mastery', 'Resilience'],
    challenges: ['Workaholism', 'Material obsession', 'Intimidating energy'],
    love: 'You take love seriously. You are fiercely loyal and committed once you invest in a relationship, but need a grounded partner.',
    career: 'Business, finance, law, politics, real estate, and corporate leadership. Anywhere power and results matter.',
    lucky: { numbers: '8, 3, 4, 6', colors: 'Black, Dark Blue, Purple', gems: 'Blue Sapphire, Amethyst', days: 'Saturday', years: '8, 17, 26' },
    mantra: 'Om Shanaischaraya Namah',
    affirmation: 'I channel my power wisely and create lasting abundance.',
  },
  9: {
    title: 'The Humanitarian',
    planet: 'Mars',
    element: 'Fire',
    traits: ['Compassionate', 'Generous', 'Idealistic', 'Universal'],
    strengths: ['Big-picture vision', 'Deep compassion', 'Artistic wisdom', 'Inspiring leadership'],
    challenges: ['Emotional intensity', 'Giving too much', 'Difficulty letting go'],
    love: 'You love deeply and universally. You seek a partner who shares your values and vision for a better world.',
    career: 'Humanitarian work, spirituality, arts, medicine, education, and activism. Anywhere you can make a difference.',
    lucky: { numbers: '9, 1, 2, 3', colors: 'Red, Crimson, Gold', gems: 'Red Coral, Bloodstone', days: 'Tuesday, Sunday', years: '9, 18, 27' },
    mantra: 'Om Mangalaya Namah',
    affirmation: 'I serve with love and complete my soul\'s purpose with grace.',
  },
  11: {
    title: 'The Visionary (Master 11)',
    planet: 'Moon / Sun',
    element: 'Air',
    traits: ['Intuitive', 'Inspirational', 'Spiritual', 'Sensitive'],
    strengths: ['Psychic awareness', 'Visionary ideas', 'Inspiring others', 'Spiritual bridge'],
    challenges: ['Anxiety and nervous tension', 'High sensitivity', 'Living up to inner potential'],
    love: 'You experience love on a soul level. You are deeply empathetic and need a partner who honours your spiritual nature.',
    career: 'Spiritual teaching, intuitive arts, counselling, healing, creative arts, and humanitarian work.',
    lucky: { numbers: '11, 2, 6, 8', colors: 'Silver, White, Lavender', gems: 'Moonstone, Pearl, Amethyst', days: 'Monday, Sunday', years: '2, 11, 20, 29' },
    mantra: 'Om Namah Shivaya',
    affirmation: 'I trust my higher vision and channel divine inspiration with courage.',
  },
  22: {
    title: 'The Master Builder (Master 22)',
    planet: 'Saturn / Uranus',
    element: 'Earth',
    traits: ['Visionary', 'Practical', 'Disciplined', 'Powerful'],
    strengths: ['Turning dreams into reality', 'Organisational mastery', 'Global vision', 'Manifestation power'],
    challenges: ['Enormous pressure', 'Perfectionism', 'Fear of failure at scale'],
    love: 'You seek a deeply committed, stable partner who can stand by your ambitious long-term vision and support your mission.',
    career: 'Architecture, engineering, global organisations, business empires, government, and large-scale leadership.',
    lucky: { numbers: '22, 4, 8, 11', colors: 'Earth tones, Gold, Navy', gems: 'Blue Sapphire, Lapis Lazuli', days: 'Saturday, Thursday', years: '4, 13, 22, 31' },
    mantra: 'Om Shanaischaraya Namah',
    affirmation: 'I build great works that uplift humanity and leave a lasting legacy.',
  },
  33: {
    title: 'The Master Teacher (Master 33)',
    planet: 'Venus / Jupiter',
    element: 'Fire',
    traits: ['Compassionate', 'Creative', 'Inspiring', 'Healing'],
    strengths: ['Unconditional love', 'Teaching and healing', 'Selfless creativity', 'Spiritual wisdom'],
    challenges: ['Taking on others\' burdens', 'Martyrdom tendencies', 'Overwhelming responsibility'],
    love: 'You love unconditionally and profoundly. Your capacity for love is the greatest gift you bring to all relationships.',
    career: 'Spiritual leadership, healing arts, teaching, counselling, creative arts, and humanitarian service at the highest level.',
    lucky: { numbers: '33, 6, 9', colors: 'Gold, White, Rose', gems: 'Diamond, Rose Quartz, Yellow Sapphire', days: 'Friday, Thursday', years: '6, 15, 24, 33' },
    mantra: 'Om Shrim Maha Lakshmiyei Namah',
    affirmation: 'I uplift the world through love, wisdom, and creative service.',
  },
};

const PERSONAL_YEAR_THEMES = {
  1: 'New beginnings, planting seeds, fresh starts. A year for bold action.',
  2: 'Patience, partnerships, and cooperation. A year for connection.',
  3: 'Creativity, self-expression, and joy. A year to shine and create.',
  4: 'Hard work, foundation building, and structure. A year to build.',
  5: 'Change, travel, and freedom. A year of dynamic transformation.',
  6: 'Family, responsibility, and love. A year for nurturing.',
  7: 'Reflection, spirituality, and inner growth. A year for wisdom.',
  8: 'Power, abundance, and career achievement. A year for harvest.',
  9: 'Completion, release, and endings. A year to let go and prepare.',
  11: 'Spiritual awakening, intuition, and high inspiration. A master year.',
  22: 'Large-scale building and manifestation. A powerful master year.',
};

export function getNumerologyReport(fullName, dob) {
  const lifePath = calculateLifePath(dob);
  const destiny = calculateDestinyNumber(fullName);
  const soulUrge = calculateSoulUrgeNumber(fullName);
  const personality = calculatePersonalityNumber(fullName);
  const birthday = calculateBirthdayNumber(dob);
  const personalYear = calculatePersonalYear(dob);

  const lifePathMeaning = NUMBER_MEANINGS[lifePath] || NUMBER_MEANINGS[9];
  const destinyMeaning = NUMBER_MEANINGS[destiny] || NUMBER_MEANINGS[1];
  const soulMeaning = NUMBER_MEANINGS[soulUrge] || NUMBER_MEANINGS[2];
  const personalityMeaning = NUMBER_MEANINGS[personality] || NUMBER_MEANINGS[3];

  return {
    numbers: { lifePath, destiny, soulUrge, personality, birthday, personalYear },
    lifePath: { number: lifePath, ...lifePathMeaning },
    destiny: { number: destiny, title: destinyMeaning.title, planet: destinyMeaning.planet, traits: destinyMeaning.traits, career: destinyMeaning.career },
    soulUrge: { number: soulUrge, title: soulMeaning.title, description: soulMeaning.love, traits: soulMeaning.traits },
    personality: { number: personality, title: personalityMeaning.title, description: personalityMeaning.affirmation, traits: personalityMeaning.traits },
    birthday: { number: birthday, description: `Your birthday number ${birthday} adds a special talent and energy to your life path.` },
    personalYear: { number: personalYear, theme: PERSONAL_YEAR_THEMES[personalYear] || PERSONAL_YEAR_THEMES[9] },
    lucky: lifePathMeaning.lucky,
    mantra: lifePathMeaning.mantra,
    affirmation: lifePathMeaning.affirmation,
    compatibility: getCompatibility(lifePath),
  };
}

function getCompatibility(n) {
  const map = {
    1: [1, 3, 5, 9],
    2: [2, 4, 6, 8],
    3: [1, 3, 5, 9],
    4: [2, 4, 6, 8],
    5: [1, 3, 5, 7],
    6: [2, 4, 6, 9],
    7: [5, 7, 11],
    8: [2, 4, 6, 8],
    9: [1, 3, 6, 9],
    11: [2, 6, 11, 22],
    22: [4, 8, 11, 22],
    33: [6, 9, 33],
  };
  return { best: map[n] || [1, 5, 9], number: n };
}
