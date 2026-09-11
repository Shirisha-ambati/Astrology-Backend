import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Award,
  Check,
  CheckCircle2,
  Calculator,
  Compass,
  FileCheck2,
  Flame,
  Gem,
  Heart,
  HelpCircle,
  Info,
  PhoneCall,
  RotateCcw,
  Search,
  Shield,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Star,
  Truck,
  UserCheck,
  X
} from 'lucide-react';
import { products as sampleProducts, shopCategories, zodiac } from '../data/siteContent';
import { Breadcrumb } from '../components/shared/PageElements';

const categoryTabs = [
  { key: 'All', label: 'All Products', icon: Sparkles },
  { key: 'Ruby', label: 'Ruby Gemstone', icon: Flame },
  { key: 'Emerald', label: 'Emerald Gemstone', icon: Gem },
  { key: 'Yellow Sapphire', label: 'Yellow Sapphire', icon: Star },
  { key: 'Rudraksha', label: 'Sacred Beads', icon: Compass },
  { key: 'Crystal Bracelets', label: 'Bracelets', icon: Heart },
  { key: 'Yantras', label: 'Blessed Geometry', icon: Shield }
];

export default function ShopPage({ onNavigate, t }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Modal states
  const [showGemCalculator, setShowGemCalculator] = useState(false);
  const [showConverter, setShowConverter] = useState(false);
  const [showGemologistModal, setShowGemologistModal] = useState(false);
  const [checkoutProduct, setCheckoutProduct] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Gemstone Calculator State
  const [userZodiac, setUserZodiac] = useState('Leo');
  const [userGoal, setUserGoal] = useState('Leadership & Career');

  // Carat to Ratti Calculator State
  const [caratInput, setCaratInput] = useState('5.5');
  const [rattiResult, setRattiResult] = useState((5.5 * 1.11).toFixed(2));

  // Flatten all products from categories for quick filtering
  const allItems = shopCategories.flatMap((cat) => cat.items);

  // Filter products by search and category
  let filteredItems = allItems.filter((item) => {
    const matchesCategory =
      activeCategory === 'All' ||
      item.category === activeCategory ||
      (activeCategory === 'Ruby' && item.name.includes('Ruby')) ||
      (activeCategory === 'Emerald' && item.name.includes('Emerald')) ||
      (activeCategory === 'Yellow Sapphire' && item.name.includes('Sapphire'));

    const matchesSearch =
      !searchQuery ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.origin && item.origin.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.carat && item.carat.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  // Sort items
  if (sortBy === 'price-low') {
    filteredItems.sort((a, b) => {
      const pA = parseInt(a.price.replace(/[^\d]/g, ''), 10) || 0;
      const pB = parseInt(b.price.replace(/[^\d]/g, ''), 10) || 0;
      return pA - pB;
    });
  } else if (sortBy === 'price-high') {
    filteredItems.sort((a, b) => {
      const pA = parseInt(a.price.replace(/[^\d]/g, ''), 10) || 0;
      const pB = parseInt(b.price.replace(/[^\d]/g, ''), 10) || 0;
      return pB - pA;
    });
  }

  const handleCaratChange = (val) => {
    setCaratInput(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setRattiResult((num * 1.11).toFixed(2));
    } else {
      setRattiResult('0.00');
    }
  };

  const handleRattiChange = (val) => {
    setRattiResult(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setCaratInput((num * 0.90).toFixed(2));
    } else {
      setCaratInput('0.00');
    }
  };

  const handleOrderSubmit = (e) => {
    e.preventDefault();
    setOrderSuccess(true);
    setTimeout(() => {
      setOrderSuccess(false);
      setCheckoutProduct(null);
      setSelectedProduct(null);
    }, 2800);
  };

  return (
    <main className="relative min-h-screen bg-[#fffdf9] pb-24 pt-28 text-gray-800 font-sans">
      {/* Top Announcement Bar */}
      <div className="bg-[linear-gradient(90deg,#1a1008_0%,#422a12_50%,#1a1008_100%)] py-2.5 px-4 text-center text-xs font-medium text-amber-200 shadow-sm border-b border-amber-500/20">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-6">
          <span className="flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5 text-saffron" /> <strong>VedAura Store</strong> — Certified Natural Gemstones & Spiritual Remedies</span>
          <span className="hidden sm:inline-block">•</span>
          <span className="flex items-center gap-1.5"><FileCheck2 className="h-3.5 w-3.5 text-emerald-400" /> 100% Govt. Lab Certified (IGI/IEGL)</span>
          <span className="hidden md:inline-block">•</span>
          <span className="flex items-center gap-1.5"><Flame className="h-3.5 w-3.5 text-amber-400" /> Free Ritual Energy Blessing Included</span>
          <span className="hidden lg:inline-block">•</span>
          <span className="flex items-center gap-1.5"><Truck className="h-3.5 w-3.5 text-sky-400" /> Free Nationwide Insured Shipping (2-4 Days)</span>
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 mt-6">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <Breadcrumb currentPage="Shop & Gemstones" homeLabel="Home" />
        </motion.div>

        {/* Collection Hero Banner - Pure English Text */}
        <div className="relative overflow-hidden rounded-[2.5rem] border border-[#f0dfbf] bg-[linear-gradient(135deg,#fffbf2_0%,#fff4e0_40%,#ffeecf_100%)] p-6 sm:p-10 shadow-[0_24px_70px_-38px_rgba(212,175,55,0.45)]">
          <div className="absolute right-0 top-0 -mr-16 -mt-16 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(255,153,51,0.25)_0%,transparent_70%)] pointer-events-none" />
          
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-saffron/15 border border-saffron/30 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-saffron">
                <Flame className="h-4 w-4" /> Certified Natural Gemstone Collection
              </div>

              <h1 className="font-spiritual text-3xl font-bold text-gray-900 sm:text-4xl md:text-5xl">
                Buy Natural Ruby Gemstones Online at Best Price
              </h1>

              <p className="mt-4 text-base leading-relaxed text-gray-700 sm:text-lg">
                Ruby is admired worldwide for its rich red color, brilliance, and rarity. Traditionally associated with the <strong>Sun</strong>, it holds a paramount place in astrology for confidence, leadership, vitality, and career success.
              </p>

              {/* Benefits Tag Pills */}
              <div className="mt-5 flex flex-wrap items-center gap-2 text-xs font-semibold text-amber-900">
                <span className="rounded-full bg-amber-100/90 px-3.5 py-1.5 border border-amber-300/60 flex items-center gap-1"><Check className="h-3.5 w-3.5 text-amber-700" /> Confidence & Leadership</span>
                <span className="rounded-full bg-amber-100/90 px-3.5 py-1.5 border border-amber-300/60 flex items-center gap-1"><Check className="h-3.5 w-3.5 text-amber-700" /> Vitality & Power</span>
                <span className="rounded-full bg-amber-100/90 px-3.5 py-1.5 border border-amber-300/60 flex items-center gap-1"><Check className="h-3.5 w-3.5 text-amber-700" /> Recognition & Fame</span>
                <span className="rounded-full bg-amber-100/90 px-3.5 py-1.5 border border-amber-300/60 flex items-center gap-1"><Check className="h-3.5 w-3.5 text-amber-700" /> Career Success</span>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => setShowGemologistModal(true)}
                  className="btn-primary flex items-center gap-2.5 py-3.5 px-6 text-sm font-bold shadow-lg"
                >
                  <PhoneCall className="h-4 w-4" /> Consult Certified Gemologist
                </button>
                <button
                  type="button"
                  onClick={() => setShowGemCalculator(true)}
                  className="flex items-center gap-2 rounded-full border border-amber-400 bg-white/90 px-5 py-3.5 text-sm font-bold text-amber-900 shadow-sm transition hover:bg-amber-50"
                >
                  <Calculator className="h-4 w-4 text-saffron" /> Gemstone Calculator
                </button>
                <button
                  type="button"
                  onClick={() => setShowConverter(true)}
                  className="flex items-center gap-2 rounded-full border border-amber-300 bg-amber-100/70 px-5 py-3.5 text-sm font-bold text-amber-900 shadow-sm transition hover:bg-amber-200/80"
                >
                  <Info className="h-4 w-4 text-amber-700" /> Weight Unit Converter
                </button>
              </div>
            </div>

            {/* 4 Trust Pillars Grid */}
            <div className="grid gap-3.5 sm:grid-cols-2">
              <div className="rounded-2xl border border-amber-200/80 bg-white/95 p-4 shadow-sm backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-saffron">
                    <FileCheck2 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Govt. Lab Certified</p>
                    <p className="text-sm font-bold text-gray-900">IGI / IEGL Certificate</p>
                  </div>
                </div>
                <p className="mt-2 text-xs text-gray-600">100% natural, unheated & authentic gemstone guarantee.</p>
              </div>

              <div className="rounded-2xl border border-amber-200/80 bg-white/95 p-4 shadow-sm backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-saffron">
                    <Flame className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Energy Energised</p>
                    <p className="text-sm font-bold text-gray-900">Free Ritual Blessing</p>
                  </div>
                </div>
                <p className="mt-2 text-xs text-gray-600">Purified & activated by energy specialists before shipping.</p>
              </div>

              <div className="rounded-2xl border border-amber-200/80 bg-white/95 p-4 shadow-sm backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-saffron">
                    <RotateCcw className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-500">100% Money-Back</p>
                    <p className="text-sm font-bold text-gray-900">Double Refund Guarantee</p>
                  </div>
                </div>
                <p className="mt-2 text-xs text-gray-600">If found treated or synthetic, instant double refund.</p>
              </div>

              <div className="rounded-2xl border border-amber-200/80 bg-white/95 p-4 shadow-sm backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-saffron">
                    <Truck className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Insured Shipping</p>
                    <p className="text-sm font-bold text-gray-900">Free 2-4 Days Delivery</p>
                  </div>
                </div>
                <p className="mt-2 text-xs text-gray-600">Tamper-proof insured packaging directly to your doorstep.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Category Tabs Nav Bar */}
        <div className="mt-10 flex items-center justify-between gap-4 border-b border-amber-200/80 pb-4 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2.5">
            {categoryTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeCategory === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveCategory(tab.key)}
                  className={`flex shrink-0 items-center gap-2 rounded-full px-5 py-3 text-xs sm:text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-saffron text-white shadow-md shadow-saffron/25'
                      : 'bg-white border border-amber-200 text-gray-700 hover:bg-amber-50 hover:border-amber-300'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-saffron'}`} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Search, Filter & Count Bar */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-amber-200/70 bg-white p-4 shadow-sm">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-3.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Ruby Carat, Emerald, 5-Face, Burma, etc..."
              className="w-full rounded-xl border border-amber-200 bg-[#fffaf5] py-2.5 pl-10 pr-4 text-sm outline-none focus:border-saffron focus:ring-2 focus:ring-saffron/20"
            />
          </div>

          <div className="flex items-center gap-4">
            <p className="text-xs sm:text-sm text-gray-600 font-medium">
              Showing <strong className="text-saffron">{filteredItems.length}</strong> Certified Remedies
            </p>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-xl border border-amber-200 bg-[#fffaf5] px-3.5 py-2 text-xs sm:text-sm font-semibold text-gray-700 outline-none focus:border-saffron"
            >
              <option value="featured">Featured / Best Seller</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredItems.map((item, idx) => (
            <motion.div
              key={item.id || item.name + idx}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              className="group flex flex-col justify-between overflow-hidden rounded-[2rem] border border-[#f3dfbf] bg-white p-5 shadow-[0_16px_40px_-28px_rgba(212,175,55,0.3)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div>
                {/* Product Image & Badges */}
                <div className="relative mb-4 overflow-hidden rounded-2xl bg-[radial-gradient(circle_at_center,#fff9ef_0%,#fff4e2_100%)] p-4 text-center">
                  <span className="absolute left-3 top-3 z-10 flex items-center gap-1 rounded-full bg-saffron px-3 py-1 text-[11px] font-bold text-white shadow-sm">
                    <ShieldCheck className="h-3 w-3" /> {item.tag || 'Govt Certified'}
                  </span>

                  {item.certified && (
                    <span className="absolute right-3 top-3 z-10 flex items-center gap-1 rounded-full bg-emerald-600 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm">
                      <Award className="h-3 w-3" /> Lab Verified
                    </span>
                  )}

                  <div className="relative mx-auto h-48 w-full overflow-hidden rounded-xl">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="hidden h-full w-full items-center justify-center bg-amber-50">
                      <Gem className="h-16 w-16 text-saffron/60" />
                    </div>
                  </div>
                </div>

                {/* Product Attributes Header */}
                <div className="mb-2 flex flex-wrap items-center gap-2 text-[11px] font-bold text-amber-800">
                  {item.carat && <span className="rounded-md bg-amber-100 px-2 py-0.5">{item.carat}</span>}
                  {item.ratti && <span className="rounded-md bg-amber-100 px-2 py-0.5">{item.ratti}</span>}
                  {item.origin && <span className="rounded-md bg-amber-100 px-2 py-0.5">Origin: {item.origin}</span>}
                </div>

                <h3 className="font-spiritual text-lg font-bold text-gray-900 group-hover:text-saffron transition-colors line-clamp-1">
                  {item.name}
                </h3>

                {/* Pricing Block */}
                <div className="mt-3 rounded-xl bg-[#fffbf2] p-3 border border-[#f7e6c4]">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-extrabold text-saffron">{item.price}</span>
                    {item.originalPrice && (
                      <span className="text-xs text-gray-400 line-through font-semibold">{item.originalPrice}</span>
                    )}
                  </div>
                  {item.savings && (
                    <p className="mt-1 text-xs font-bold text-emerald-700">{item.savings}</p>
                  )}
                </div>
              </div>

              {/* Card Action Buttons */}
              <div className="mt-5 space-y-2">
                <button
                  type="button"
                  onClick={() => setCheckoutProduct(item)}
                  className="btn-primary flex w-full items-center justify-center gap-2 py-3 text-xs sm:text-sm font-bold shadow-md"
                >
                  <ShoppingCart className="h-4 w-4" /> Buy Now
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedProduct(item)}
                  className="flex w-full items-center justify-center gap-1.5 rounded-full border border-amber-300 bg-white py-2.5 text-xs font-bold text-gray-700 transition hover:bg-amber-50"
                >
                  View Details & Guide <ArrowRight className="h-3.5 w-3.5 text-saffron" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Buyers Guide Section - All English */}
        <section className="mt-16 rounded-[2.5rem] border border-[#f0dfbf] bg-white p-6 sm:p-10 shadow-[0_22px_60px_-35px_rgba(212,175,55,0.35)]">
          <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-end md:justify-between border-b border-amber-200/80 pb-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-saffron">Astrological Guide</p>
              <h2 className="font-spiritual text-2xl font-bold text-gray-900 sm:text-3xl">
                About Ruby Gemstone — Comprehensive Buyer's Manual
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 max-w-md">
              Everything you need to know about gemstone suitability, ritual wearing methods, pricing factors, and care.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Column 1 */}
            <div className="space-y-6">
              <div className="rounded-2xl border border-amber-200/80 bg-[#fffdf8] p-6">
                <div className="flex items-center gap-3">
                  <Flame className="h-6 w-6 text-saffron" />
                  <h3 className="font-spiritual text-xl font-bold text-gray-900">Why Choose Ruby?</h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  For centuries, Ruby has been revered as the <strong>'King of Gems'</strong>, symbolizing passion, authority, protection, and leadership. Governed by the Sun, wearing a natural untreated Ruby gemstone cleanses stagnant energies and elevates social standing.
                </p>
              </div>

              <div className="rounded-2xl border border-amber-200/80 bg-[#fffdf8] p-6">
                <div className="flex items-center gap-3">
                  <Star className="h-6 w-6 text-saffron" />
                  <h3 className="font-spiritual text-xl font-bold text-gray-900">Zodiac & Astrology Suitability</h3>
                </div>
                <ul className="mt-3 space-y-2 text-sm text-gray-600 list-disc list-inside">
                  <li><strong>Leo:</strong> Primary gemstone for Leo sun/ascendant.</li>
                  <li><strong>Aries & Sagittarius:</strong> Highly beneficial ascendant matches.</li>
                  <li><strong>Professions:</strong> Government officials, executives, business leaders, and managers.</li>
                </ul>
              </div>

              <div className="rounded-2xl border border-amber-200/80 bg-[#fffdf8] p-6">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-6 w-6 text-saffron" />
                  <h3 className="font-spiritual text-xl font-bold text-gray-900">What Determines Ruby Price?</h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  Pricing depends on the <strong>4 Cs</strong>: Color (vivid Pigeon Blood Red), Clarity (eye-clean transparency), Carat Weight, and Origin (Burma vs Mozambique vs India). Completely unheated rubies carry high astrological potency and collector value.
                </p>
              </div>
            </div>

            {/* Column 2 */}
            <div className="space-y-6">
              <div className="rounded-2xl border border-amber-200/80 bg-[#fffdf8] p-6">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-6 w-6 text-saffron" />
                  <h3 className="font-spiritual text-xl font-bold text-gray-900">How to Wear Your Ruby (Step-by-Step)</h3>
                </div>
                <ol className="mt-3 space-y-2 text-sm text-gray-600 list-decimal list-inside leading-relaxed">
                  <li><strong>Metal:</strong> Set in Gold or Copper ring / pendant.</li>
                  <li><strong>Day & Time:</strong> Sunday morning during Waxing Moon phase within 1 hour after sunrise.</li>
                  <li><strong>Purification:</strong> Dip in sacred water and pure unpasteurized milk.</li>
                  <li><strong>Mantra Activation:</strong> Recite the sacred Sun activation chant 108 times before wearing on the right hand's ring finger.</li>
                </ol>
              </div>

              <div className="rounded-2xl border border-amber-200/80 bg-[#fffdf8] p-6">
                <div className="flex items-center gap-3">
                  <RotateCcw className="h-6 w-6 text-saffron" />
                  <h3 className="font-spiritual text-xl font-bold text-gray-900">Cleaning & Maintenance</h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  Clean periodically using lukewarm water, mild soap, and a soft toothbrush. Avoid harsh household chemicals or chlorine pools. Store separately in a soft velvet pouch to prevent scratching softer gemstones.
                </p>
              </div>
            </div>
          </div>
        </section>
      </section>

      {/* Gemstone Calculator Modal */}
      <AnimatePresence>
        {showGemCalculator && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg overflow-hidden rounded-[2.5rem] border border-[#f0dfbf] bg-white p-6 sm:p-8 shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setShowGemCalculator(false)}
                className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-saffron hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-saffron text-white shadow-md">
                  <Calculator className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-saffron">Astrological Recommendation</p>
                  <h3 className="font-spiritual text-2xl font-bold text-gray-900">Gemstone Calculator</h3>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Select Your Zodiac Sign</label>
                  <select
                    value={userZodiac}
                    onChange={(e) => setUserZodiac(e.target.value)}
                    className="w-full rounded-2xl border border-amber-200 bg-[#fffaf2] p-3.5 text-sm font-semibold outline-none focus:border-saffron"
                  >
                    {zodiac.map((z) => (
                      <option key={z.name} value={z.name}>{z.name} ({z.symbol})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">Primary Goal</label>
                  <select
                    value={userGoal}
                    onChange={(e) => setUserGoal(e.target.value)}
                    className="w-full rounded-2xl border border-amber-200 bg-[#fffaf2] p-3.5 text-sm font-semibold outline-none focus:border-saffron"
                  >
                    <option value="Leadership & Career">Leadership, Authority & Career Fame</option>
                    <option value="Intelligence & Speech">Business, Intelligence & Speech</option>
                    <option value="Wealth & Growth">Wealth, Marriage & Higher Wisdom</option>
                    <option value="Inner Calm & Peace">Emotional Balance & Peace</option>
                  </select>
                </div>

                {/* Calculation Result Preview Box */}
                <div className="rounded-2xl border border-amber-300 bg-[linear-gradient(135deg,#fff8ea_0%,#fff0d4_100%)] p-5 text-gray-900">
                  <p className="text-xs font-bold uppercase tracking-wider text-saffron">Calculated Recommendation</p>
                  <h4 className="mt-1 font-spiritual text-2xl font-bold text-amber-950">
                    {userZodiac === 'Leo' || userZodiac === 'Aries' ? 'Natural Ruby Gemstone' : userZodiac === 'Gemini' || userZodiac === 'Virgo' ? 'Zambian Emerald Gemstone' : 'Yellow Sapphire Gemstone'}
                  </h4>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-semibold text-gray-700">
                    <div>Planet: <strong className="text-saffron">{userZodiac === 'Leo' ? 'Sun' : 'Mercury / Jupiter'}</strong></div>
                    <div>Recommended Weight: <strong>5.25 - 7.50 Ratti</strong></div>
                    <div>Suitable Metal: <strong>Gold / Copper</strong></div>
                    <div>Wearing Finger: <strong>Ring Finger</strong></div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowGemCalculator(false)}
                  className="btn-primary w-full py-3.5 text-sm font-bold shadow-md"
                >
                  Explore Recommended Gemstones
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Weight Converter Modal */}
      <AnimatePresence>
        {showConverter && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg overflow-hidden rounded-[2.5rem] border border-[#f0dfbf] bg-white p-6 sm:p-8 shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setShowConverter(false)}
                className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-saffron hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-md">
                  <Info className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-saffron">Weight Converter</p>
                  <h3 className="font-spiritual text-2xl font-bold text-gray-900">Carat to Ratti Calculator</h3>
                </div>
              </div>

              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-2">Carats (International)</label>
                    <input
                      type="number"
                      step="0.05"
                      value={caratInput}
                      onChange={(e) => handleCaratChange(e.target.value)}
                      className="w-full rounded-2xl border border-amber-200 bg-[#fffaf2] p-3 text-base font-bold text-gray-800 outline-none focus:border-saffron"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-2">Ratti (Astrological Unit)</label>
                    <input
                      type="number"
                      step="0.05"
                      value={rattiResult}
                      onChange={(e) => handleRattiChange(e.target.value)}
                      className="w-full rounded-2xl border border-saffron bg-amber-50 p-3 text-base font-bold text-saffron outline-none"
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-amber-200 bg-[#fffbf4] p-4 text-xs text-gray-600 leading-relaxed">
                  <strong>Conversion Rule:</strong> 1 Carat = 1.11 Ratti (or 1 Ratti = 0.90 Carats). In astrology, gemstones are traditionally weighed in Rattis, whereas international laboratories issue certificates in Carats.
                </div>

                <button
                  type="button"
                  onClick={() => setShowConverter(false)}
                  className="btn-primary w-full py-3.5 text-sm font-bold shadow-md"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Gemologist Consultation Modal */}
      <AnimatePresence>
        {showGemologistModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md rounded-[2.5rem] border border-amber-200 bg-white p-6 text-center shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setShowGemologistModal(false)}
                className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-saffron hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-saffron">
                <PhoneCall className="h-8 w-8" />
              </div>

              <h3 className="font-spiritual text-2xl font-bold text-gray-900">Talk to Certified Gemologist</h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                Have questions about stone origin, clarity, carats, or custom silver/gold ring making? Call or message our experts directly.
              </p>

              <div className="mt-6 rounded-2xl bg-amber-50 p-4 border border-amber-200 text-amber-950 font-bold text-lg">
                📞 +91 98701 17452
              </div>

              <div className="mt-6 flex gap-3">
                <a
                  href="tel:+919870117452"
                  className="btn-primary flex-1 py-3 text-sm font-bold text-center"
                >
                  Call Now
                </a>
                <button
                  type="button"
                  onClick={() => setShowGemologistModal(false)}
                  className="rounded-full border border-gray-300 px-5 py-3 text-sm font-bold text-gray-700"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Product View Details Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-[2.5rem] border border-[#f0dfbf] bg-white shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                className="absolute right-6 top-6 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-gray-600 shadow-md transition hover:bg-saffron hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="overflow-y-auto p-6 sm:p-8">
                <div className="relative mb-6 h-64 w-full overflow-hidden rounded-2xl bg-amber-50">
                  <img src={selectedProduct.image} alt={selectedProduct.name} className="h-full w-full object-cover" />
                  <span className="absolute left-4 top-4 rounded-full bg-saffron px-4 py-1.5 text-xs font-bold text-white shadow-md">
                    {selectedProduct.tag || 'Govt Certified'}
                  </span>
                </div>

                <div className="mb-4">
                  <h2 className="font-spiritual text-3xl font-bold text-gray-900">{selectedProduct.name}</h2>
                  <div className="mt-2 flex items-baseline gap-3">
                    <span className="text-3xl font-extrabold text-saffron">{selectedProduct.price}</span>
                    {selectedProduct.originalPrice && (
                      <span className="text-base text-gray-400 line-through font-semibold">{selectedProduct.originalPrice}</span>
                    )}
                    {selectedProduct.savings && (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">{selectedProduct.savings}</span>
                    )}
                  </div>
                </div>

                <p className="text-sm leading-relaxed text-gray-600">{selectedProduct.description}</p>

                <div className="mt-6 grid grid-cols-2 gap-3 rounded-2xl bg-amber-50/70 p-4 text-xs font-semibold text-gray-700 border border-amber-200">
                  <div>Carat Weight: <strong>{selectedProduct.carat || 'Natural Weight'}</strong></div>
                  <div>Ratti Weight: <strong>{selectedProduct.ratti || 'Astrological Weight'}</strong></div>
                  <div>Origin: <strong>{selectedProduct.origin || 'Lab Certified'}</strong></div>
                  <div>Ruling Planet: <strong>{selectedProduct.planet || 'Sun'}</strong></div>
                </div>

                <div className="mt-6 flex gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setCheckoutProduct(selectedProduct);
                    }}
                    className="btn-primary flex-1 py-4 text-base font-bold shadow-lg"
                  >
                    Proceed to Order
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Direct Order Modal */}
      <AnimatePresence>
        {checkoutProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg rounded-[2.5rem] border border-amber-200 bg-white p-6 sm:p-8 shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setCheckoutProduct(null)}
                className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-saffron hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

              <h3 className="font-spiritual text-2xl font-bold text-gray-900">Direct Order & Checkout</h3>
              <p className="mt-1 text-xs text-gray-500">Free Insured Delivery + Energy Blessing Included</p>

              {orderSuccess ? (
                <div className="my-8 rounded-2xl bg-emerald-500 p-6 text-center text-white shadow-lg">
                  <CheckCircle2 className="mx-auto h-12 w-12 mb-2" />
                  <h4 className="text-xl font-bold">Order Placed Successfully!</h4>
                  <p className="mt-1 text-xs text-emerald-100">Our team will call you to confirm your address and shipping timeline.</p>
                </div>
              ) : (
                <form onSubmit={handleOrderSubmit} className="mt-6 space-y-4">
                  <div className="rounded-xl bg-amber-50 p-3 border border-amber-200 flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-900">{checkoutProduct.name}</span>
                    <span className="text-base font-extrabold text-saffron">{checkoutProduct.price}</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
                    <input type="text" required placeholder="Enter full name" className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-saffron" />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Mobile Number</label>
                    <input type="tel" required placeholder="+91 98765 43210" className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-saffron" />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Shipping Address</label>
                    <textarea rows="2" required placeholder="House number, street, city, pin code" className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-saffron" />
                  </div>

                  <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-3 text-xs text-amber-900">
                    <strong>Payment Mode:</strong> Cash on Delivery (COD) / Online Payment Available on Confirmation Call.
                  </div>

                  <button type="submit" className="btn-primary w-full py-4 text-base font-bold shadow-lg">
                    Confirm & Place Order
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Bottom Gemologist Callout Bar */}
      <div className="fixed bottom-4 left-4 right-4 z-40 mx-auto max-w-4xl rounded-full border border-amber-300/80 bg-gray-900/90 py-3 px-6 text-white shadow-2xl backdrop-blur-md">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 text-xs sm:text-sm">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span><strong>Gemologist Available:</strong> Get instant advice on gemstone weight & astrological compatibility.</span>
          </div>
          <button
            type="button"
            onClick={() => setShowGemologistModal(true)}
            className="rounded-full bg-saffron px-4 py-1.5 text-xs font-bold text-white transition hover:bg-amber-600 shadow-md text-center"
          >
            Talk to Gemologist
          </button>
        </div>
      </div>
    </main>
  );
}
