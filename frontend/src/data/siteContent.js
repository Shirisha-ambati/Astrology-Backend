import React from 'react';
import { Activity, Brain, Map, ShoppingBag, Star, Wind } from 'lucide-react';

export const topNav = ['Home', 'Horoscope', 'Kundli', 'Numerology', 'Astro-Neuro', 'Swar Science', 'Shop'];

export const kundliNav = [
  { key: 'Kundli', label: 'Free Kundli' },
  { key: 'Kundli Matching', label: 'Kundli Matching' },
  { key: 'Love', label: 'Love' },
  { key: 'Marriage', label: 'Marriage' }
];

export const offerings = [
  { icon: React.createElement(Star), title: 'Daily Horoscope', desc: 'Personalized daily cosmic guidance.' },
  { icon: React.createElement(Map), title: 'Kundli Chart', desc: 'Deep astrological birth analysis.' },
  { icon: React.createElement(Activity), title: 'Numerology', desc: 'Discover your life path numbers.' },
  { icon: React.createElement(Brain), title: 'Astro-Neuro', desc: 'Where energy meets mind intelligence.' },
  { icon: React.createElement(Wind), title: 'Swar Vigyan', desc: 'Master your breath and timing.' },
  { icon: React.createElement(ShoppingBag), title: 'Healing Shop', desc: 'Genuine rudraksha & gemstones.' }
];

export const products = [
  { name: 'Nepalese 5 Mukhi Rudraksha', price: 'Rs 2,100', image: 'https://source.unsplash.com/800x800/?rudraksha,beads' },
  { name: 'Amethyst Healing Bracelet', price: 'Rs 1,450', image: 'https://source.unsplash.com/800x800/?amethyst,bracelet' },
  { name: 'Sri Yantra Gold Plated', price: 'Rs 3,500', image: 'https://source.unsplash.com/800x800/?yantra,spiritual' },
  { name: 'Clear Quartz Crystal Point', price: 'Rs 950', image: 'https://source.unsplash.com/800x800/?clear,quartz,crystal' }
];

export const shopCategories = [
  {
    title: 'Rudraksha Collection',
    description: 'Sacred beads for protection, grounding, and spiritual discipline.',
    items: [
      { name: 'Nepalese 5 Mukhi Rudraksha', price: 'Rs 2,100', tag: 'Best Seller', image: 'https://source.unsplash.com/800x800/?rudraksha,beads' },
      { name: '7 Mukhi Prosperity Rudraksha', price: 'Rs 2,850', tag: 'Abundance', image: 'https://source.unsplash.com/800x800/?prayer,beads' },
      { name: '9 Mukhi Shakti Rudraksha', price: 'Rs 3,900', tag: 'Protection', image: 'https://source.unsplash.com/800x800/?spiritual,beads' },
      { name: '11 Mukhi Hanuman Rudraksha', price: 'Rs 4,250', tag: 'Strength', image: 'https://source.unsplash.com/800x800/?meditation,beads' }
    ]
  },
  {
    title: 'Healing Crystals',
    description: 'Charged stones and crystal tools for calm, clarity, and energy balance.',
    items: [
      { name: 'Clear Quartz Crystal Point', price: 'Rs 950', tag: 'Clarity', image: 'https://source.unsplash.com/800x800/?clear,quartz,crystal' },
      { name: 'Rose Quartz Heart Stone', price: 'Rs 780', tag: 'Love', image: 'https://source.unsplash.com/800x800/?rose,quartz' },
      { name: 'Black Tourmaline Shield Set', price: 'Rs 1,650', tag: 'Grounding', image: 'https://source.unsplash.com/800x800/?black,tourmaline,crystal' },
      { name: 'Selenite Charging Wand', price: 'Rs 1,100', tag: 'Purify', image: 'https://source.unsplash.com/800x800/?selenite,crystal' }
    ]
  },
  {
    title: 'Bracelets & Wearables',
    description: 'Daily spiritual wear designed for beauty, energy support, and intention.',
    items: [
      { name: 'Amethyst Healing Bracelet', price: 'Rs 1,450', tag: 'Peace', image: 'https://source.unsplash.com/800x800/?amethyst,bracelet' },
      { name: 'Citrine Wealth Bracelet', price: 'Rs 1,250', tag: 'Success', image: 'https://source.unsplash.com/800x800/?citrine,bracelet' },
      { name: '7 Chakra Balance Bracelet', price: 'Rs 1,550', tag: 'Alignment', image: 'https://source.unsplash.com/800x800/?chakra,bracelet' },
      { name: 'Tiger Eye Confidence Band', price: 'Rs 1,150', tag: 'Courage', image: 'https://source.unsplash.com/800x800/?tiger-eye,bracelet' }
    ]
  },
  {
    title: 'Yantras & Ritual Tools',
    description: 'Blessed yantras and puja essentials for sacred space and focused intention.',
    items: [
      { name: 'Sri Yantra Gold Plated', price: 'Rs 3,500', tag: 'Sacred Geometry', image: 'https://source.unsplash.com/800x800/?yantra,mandala' },
      { name: 'Lakshmi Kuber Yantra', price: 'Rs 2,400', tag: 'Prosperity', image: 'https://source.unsplash.com/800x800/?hindu,altar' },
      { name: 'Copper Puja Thali Set', price: 'Rs 1,850', tag: 'Ritual', image: 'https://source.unsplash.com/800x800/?puja,plate' },
      { name: 'Camphor Diffuser Lamp', price: 'Rs 1,200', tag: 'Purification', image: 'https://source.unsplash.com/800x800/?oil,lamp,ritual' }
    ]
  },
  {
    title: 'Gemstone Remedies',
    description: 'Traditional gemstone suggestions inspired by planetary support and harmony.',
    items: [
      { name: 'Natural Ruby Pendant', price: 'Rs 4,800', tag: 'Sun Energy', image: 'https://source.unsplash.com/800x800/?ruby,pendant' },
      { name: 'Yellow Sapphire Ring', price: 'Rs 6,500', tag: 'Jupiter', image: 'https://source.unsplash.com/800x800/?yellow,sapphire,ring' },
      { name: 'Emerald Mercury Pendant', price: 'Rs 3,950', tag: 'Communication', image: 'https://source.unsplash.com/800x800/?emerald,pendant' },
      { name: 'Moonstone Calm Pendant', price: 'Rs 2,250', tag: 'Moon', image: 'https://source.unsplash.com/800x800/?moonstone,pendant' }
    ]
  },
  {
    title: 'Incense & Aura Care',
    description: 'Fragrant cleansing and aura-support tools for everyday spiritual routines.',
    items: [
      { name: 'Temple Sandalwood Incense', price: 'Rs 420', tag: 'Daily Ritual', image: 'https://source.unsplash.com/800x800/?incense,sticks' },
      { name: 'Aura Cleansing Mist', price: 'Rs 890', tag: 'Refresh', image: 'https://source.unsplash.com/800x800/?essential-oil,spray' },
      { name: 'White Sage Smudge Bundle', price: 'Rs 760', tag: 'Cleanse', image: 'https://source.unsplash.com/800x800/?sage,smudge' },
      { name: 'Rose Attar Meditation Oil', price: 'Rs 980', tag: 'Heart Energy', image: 'https://source.unsplash.com/800x800/?attar,perfume,oil' }
    ]
  }
];

export const zodiac = [
  { name: 'Aries', symbol: '\u2648', dates: '21/3-19/4', image: '/images/zodiac/aries.png' },
  { name: 'Taurus', symbol: '\u2649', dates: '20/4-20/5', image: '/images/zodiac/taurus.png' },
  { name: 'Gemini', symbol: '\u264A', dates: '21/5-20/6', image: '/images/zodiac/gemini.png' },
  { name: 'Cancer', symbol: '\u264B', dates: '21/6-22/7', image: '/images/zodiac/cancer.png' },
  { name: 'Leo', symbol: '\u264C', dates: '23/7-22/8', image: '/images/zodiac/leo.png' },
  { name: 'Virgo', symbol: '\u264D', dates: '23/8-22/9', image: '/images/zodiac/virgo.png' },
  { name: 'Libra', symbol: '\u264E', dates: '23/9-22/10', image: '/images/zodiac/libra.png' },
  { name: 'Scorpio', symbol: '\u264F', dates: '23/10-21/11', image: '/images/zodiac/scorpio.png' },
  { name: 'Sagittarius', symbol: '\u2650', dates: '22/11-21/12', image: '/images/zodiac/sagittarius.png' },
  { name: 'Capricorn', symbol: '\u2651', dates: '22/12-19/1', image: '/images/zodiac/capricorn.png' },
  { name: 'Aquarius', symbol: '\u2652', dates: '20/1-18/2', image: '/images/zodiac/aquarius.png' },
  { name: 'Pisces', symbol: '\u2653', dates: '19/2-20/3', image: '/images/zodiac/pisces.png' }
];

export const horoscopeHeroUrl = 'https://prakashastrologer-19e87.kxcdn.com/wp-content/uploads/2023/12/2022-horoscope-circle.png';
export const kundliHeroUrl = 'https://play-lh.googleusercontent.com/Sv3s6sPCsyO1UKZaxxHPXU7SPZ3bA0a8Tjwijse_bW0Jbqtz_gHxq5w7fAG3cheVlO2L';

export const articles = {
  'Kundli Matching': {
    crumb: 'Kundli Matching',
    title: 'Kundli Matching for Marriage Compatibility',
    image: 'https://swatisurbhiastro.com/wp-content/uploads/2024/05/kundli-matching.jpg',
    quote: 'When two energies align with trust and timing, marriage becomes a path of harmony rather than uncertainty.',
    body: [
      'Kundli matching compares the birth charts of two people to understand harmony in marriage, emotional compatibility, health, and long-term stability.',
      'Using traditional ashtakoota principles, astrologers assess how energies from both charts interact. This includes compatibility of temperament, family outlook, attraction, prosperity, and mutual support.',
      'A strong match does not guarantee a perfect relationship, but it offers a useful spiritual framework for understanding strengths, sensitive areas, and how two people may grow together after marriage.'
    ]
  },
  Love: {
    crumb: 'Love',
    title: 'Love and Astrology',
    image: 'https://www.astrosage.com/astrology/images/kundali-heart.jpg',
    quote: 'Love grows deeper when hearts understand each other beyond words, patterns, and passing moods.',
    body: [
      'Zodiac signs have predestined love matches that are indicated to form highly compatible matches as per astrology.',
      'When it comes to matters of love, every zodiac sign has a different approach towards relationships. Some are romantic, whereas others may not express their love explicitly. Understanding your partner through astrology can help build a stronger bond.',
      'By getting a love analysis on the basis of astrology, you can find the exact qualities you seek in a partner. With the help of astrology, you can also better understand emotions, likes, dislikes, and expectations in relationships.',
      'Love astrology readings can help you take your relationship to another level with more clarity, compatibility, and happiness.'
    ]
  },
  Marriage: {
    crumb: 'Wedding',
    title: 'Indian Weddings: A Guide to Ceremonies and Traditions',
    image: 'https://images.astroyogi.com/strapicmsprod/assets/matchmaking_de8305574f.webp',
    quote: 'A lasting marriage is built when tradition, compatibility, and commitment walk together.',
    body: [
      'Weddings in India are a league of their own. They make for deeply joyful occasions filled with ceremonies, rituals, and celebrations.',
      'When it comes to marriage, traditions vary across regions and communities, but kundli and horoscope matching remain important for many families before choosing a prospective match.',
      'Marriage astrology can offer guidance about compatibility, family harmony, and the planetary influences that shape married life.'
    ]
  }
};

export const numerologyCards = [
  { number: 1, title: 'Life Path 1', desc: 'Leadership, courage, originality' },
  { number: 2, title: 'Life Path 2', desc: 'Balance, empathy, intuition' },
  { number: 3, title: 'Life Path 3', desc: 'Creativity, joy, expression' },
  { number: 4, title: 'Life Path 4', desc: 'Discipline, order, trust' },
  { number: 5, title: 'Life Path 5', desc: 'Freedom, movement, curiosity' },
  { number: 6, title: 'Life Path 6', desc: 'Care, love, responsibility' },
  { number: 7, title: 'Life Path 7', desc: 'Wisdom, analysis, spirit' },
  { number: 8, title: 'Life Path 8', desc: 'Power, success, ambition' },
  { number: 9, title: 'Life Path 9', desc: 'Compassion, service, completion' }
];

export const numerologyReads = [
  'Daily Numerology',
  'Lucky Number Reading',
  'Name Numerology',
  'Mobile Number Insight',
  'Business Numerology',
  'Compatibility Reading'
];

export const astroNumberPlanetMap = [
  { number: 1, planet: 'Sun', symbol: '\u2609', traits: 'Leadership, confidence, vitality' },
  { number: 2, planet: 'Moon', symbol: '\u263D', traits: 'Emotion, intuition, peace' },
  { number: 3, planet: 'Jupiter', symbol: '\u2643', traits: 'Wisdom, growth, guidance' },
  { number: 4, planet: 'Rahu', symbol: '\u260A', traits: 'Innovation, intensity, ambition' },
  { number: 5, planet: 'Mercury', symbol: '\u263F', traits: 'Communication, intellect, adaptability' },
  { number: 6, planet: 'Venus', symbol: '\u2640', traits: 'Love, beauty, harmony' },
  { number: 7, planet: 'Ketu', symbol: '\u260B', traits: 'Spirituality, detachment, insight' },
  { number: 8, planet: 'Saturn', symbol: '\u2644', traits: 'Discipline, karma, endurance' },
  { number: 9, planet: 'Mars', symbol: '\u2642', traits: 'Action, courage, determination' }
];

export const astroCompatibility = [
  { title: 'Love', icon: '\u2665', desc: 'Romantic chemistry improves when your emotional numbers align with Venus and Moon energies.' },
  { title: 'Marriage', icon: '\u221E', desc: 'Long-term harmony grows stronger when destiny and life path numbers support stability and trust.' },
  { title: 'Friendship', icon: '\u2726', desc: 'Supportive friendships often form where communication numbers and social vibrations complement each other.' },
  { title: 'Career Partnership', icon: '\u25C6', desc: 'Professional success rises when ambition, discipline, and timing numbers work together.' }
];

export const astroRemedies = [
  { title: 'Lucky Colors', value: 'Saffron, ivory, gold, soft green', icon: '\u25D0' },
  { title: 'Lucky Days', value: 'Sunday, Thursday, Friday', icon: '\u25D1' },
  { title: 'Gemstone Suggestions', value: 'Ruby, yellow sapphire, emerald', icon: '\u25C7' },
  { title: 'Mantra Suggestions', value: 'Om Suryaya Namah, Om Gurave Namah', icon: '\u0950' },
  { title: 'Positive Affirmations', value: 'I align my numbers, energy, and actions with divine timing.', icon: '\u2727' }
];

export const astroTestimonials = [
  { name: 'Ritika S.', text: 'This astro numerology report felt so accurate!' },
  { name: 'Arjun M.', text: 'Beautiful design and powerful insights.' },
  { name: 'Neha K.', text: 'It felt like a premium spiritual consultation experience.' }
];

export const astroFaqs = [
  { q: 'What is Astro Numerology?', a: 'Astro Numerology combines number vibrations with planetary influences to interpret your personality, timing, and life patterns.' },
  { q: 'How is it different from Numerology?', a: 'Traditional numerology focuses on numbers alone, while Astro Numerology connects those numbers with astrology and ruling planets.' },
  { q: 'Is my time of birth necessary?', a: 'It is optional for this sample frontend version, but exact time can refine the planetary interpretation later.' },
  { q: 'How accurate is the report?', a: 'This UI uses sample calculation logic for now, but it is designed to connect to real calculation APIs later.' }
];

export const swarCards = [
  { key: 'ida', icon: '\ud83c\udf19', title: 'Ida (Left Nostril)', mood: 'Calm, cooling, mental energy', goodFor: ['Studying', 'Meditation', 'Planning'], accent: 'from-[#b7d8f8] to-[#dbeafe]' },
  { key: 'pingala', icon: '\u2600\ufe0f', title: 'Pingala (Right Nostril)', mood: 'Active, heating, physical energy', goodFor: ['Work', 'Decision making', 'Business'], accent: 'from-[#ffd48c] to-[#ffedd5]' },
  { key: 'sushumna', icon: '\ud83d\udd31', title: 'Sushumna (Both)', mood: 'Spiritual balance and stillness', goodFor: ['Meditation', 'Prayer', 'Inner growth'], accent: 'from-[#f3d7a6] to-[#fef3c7]' }
];

export const swarGuidance = {
  ida: {
    doNow: 'Best time for calm work, study, journaling, reflection, and peaceful planning.',
    avoid: 'Avoid impulsive decisions, heated arguments, or overexertion.',
    best: ['Reading', 'Creative thinking', 'Prayer', 'Study']
  },
  pingala: {
    doNow: 'Best time for action, business, physical tasks, bold communication, and execution.',
    avoid: 'Avoid overthinking, emotional reactions, and prolonged inactivity.',
    best: ['Meetings', 'Work sessions', 'Negotiation', 'Exercise']
  },
  sushumna: {
    doNow: 'Best time for meditation, mantra, silence, spiritual practice, and inner alignment.',
    avoid: 'Avoid mundane distractions and scattered multitasking.',
    best: ['Meditation', 'Breath awareness', 'Prayer', 'Spiritual practice']
  }
};

export const swarBenefits = [
  'Better decision making',
  'Increased productivity',
  'Mental peace',
  'Spiritual growth'
];

export const swarFaqs = [
  { q: 'What is Swar Science?', a: 'Swar Science, or Swara Yoga, is the ancient Indian study of breath flow through the nostrils and how it influences actions, mood, and timing.' },
  { q: 'Is it scientifically proven?', a: 'Modern science studies nasal cycles and their link with the nervous system, while Swar Science adds a traditional spiritual framework of interpretation.' },
  { q: 'How often does swar change?', a: 'Traditionally, swar is observed to shift roughly every 60 to 90 minutes, though this can vary with health, posture, and environment.' },
  { q: 'Can I control my swar?', a: 'Some yogic practices, posture adjustments, and breath techniques may influence the active swar for a period of time.' }
];

export const astroHeroContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
};

export const astroHeroItem = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: 'easeOut' } }
};

export const pageLabels = {
  Home: 'Home',
  Horoscope: 'Horoscopes',
  Kundli: 'Kundli',
  Numerology: 'Numerology',
  'Astro-Neuro': 'Astro Numerology',
  'Swar Science': 'Swar Science',
  'Kundli Matching': 'Kundli Matching',
  Love: 'Love',
  Marriage: 'Wedding',
  Shop: 'Shop',
  Login: 'Login',
  Admin: 'Admin'
};
