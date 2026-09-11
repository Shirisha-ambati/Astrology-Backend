import React, { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { CalendarDays } from 'lucide-react';
import { kundliHeroUrl } from '../data/siteContent';
import { Breadcrumb, HeroAsset } from '../components/shared/PageElements';
import { saveKundli, takeKundliNotice } from '../lib/kundliStore';
import { apiClient } from '../lib/api';

const Motion = motion;

export default function KundliPage({
  t,
  form = {
    fullName: '',
    dob: new Date().toISOString().slice(0, 10),
    hour: '',
    minute: '',
    meridiem: 'AM',
    place: '',
    latitude: '',
    longitude: '',
    gender: 'male',
  },
  setForm = () => {},
  kundli = null,
  setKundli = () => {},
}) {
  const today = useMemo(() => new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }).replace(/ /g, '-'), []);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [placeSuggestions, setPlaceSuggestions] = useState([]);
  const [isPlaceLoading, setIsPlaceLoading] = useState(false);
  const [showPlaceSuggestions, setShowPlaceSuggestions] = useState(false);
  const [highlightedPlaceIndex, setHighlightedPlaceIndex] = useState(-1);
  const placeInputRef = useRef(null);
  const placeDropdownRef = useRef(null);

  useEffect(() => {
    const notice = takeKundliNotice();
    if (notice) setError(notice);
  }, []);

  const hours = useMemo(() => Array.from({ length: 12 }, (_, index) => String(index + 1).padStart(2, '0')), []);
  const minutes = useMemo(() => Array.from({ length: 60 }, (_, index) => String(index).padStart(2, '0')), []);

  const updateForm = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  useEffect(() => {
    const closePlaceSuggestions = (event) => {
      if (!placeInputRef.current?.contains(event.target) && !placeDropdownRef.current?.contains(event.target)) {
        setShowPlaceSuggestions(false);
      }
    };

    document.addEventListener('mousedown', closePlaceSuggestions);
    return () => document.removeEventListener('mousedown', closePlaceSuggestions);
  }, []);

  useEffect(() => {
    const query = form.place.trim();
    if (query.length < 2 || form.latitude || form.longitude) {
      setPlaceSuggestions([]);
      setIsPlaceLoading(false);
      return undefined;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(async () => {
      try {
        setIsPlaceLoading(true);
        const response = await apiClient.get('/astrology/places', {
          params: { q: query },
          signal: controller.signal,
        });
        setPlaceSuggestions(response.data);
        setShowPlaceSuggestions(true);
        setHighlightedPlaceIndex(-1);
      } catch (requestError) {
        if (!axios.isCancel(requestError) && requestError.name !== 'CanceledError') {
          setPlaceSuggestions([]);
          setShowPlaceSuggestions(true);
        }
      } finally {
        if (!controller.signal.aborted) setIsPlaceLoading(false);
      }
    }, 300);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [form.place, form.latitude, form.longitude]);

  const handlePlaceChange = (event) => {
    const { value } = event.target;
    setForm((current) => ({ ...current, place: value, latitude: '', longitude: '' }));
    setShowPlaceSuggestions(value.trim().length >= 2);
    setHighlightedPlaceIndex(-1);
  };

  const selectPlace = (place) => {
    setForm((current) => ({
      ...current,
      place: place.displayName,
      latitude: place.latitude,
      longitude: place.longitude,
    }));
    setPlaceSuggestions([]);
    setShowPlaceSuggestions(false);
    setHighlightedPlaceIndex(-1);
  };

  const handlePlaceKeyDown = (event) => {
    if (!showPlaceSuggestions || !placeSuggestions.length) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setHighlightedPlaceIndex((index) => (index + 1) % placeSuggestions.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setHighlightedPlaceIndex((index) => (index <= 0 ? placeSuggestions.length - 1 : index - 1));
    } else if (event.key === 'Enter' && highlightedPlaceIndex >= 0) {
      event.preventDefault();
      selectPlace(placeSuggestions[highlightedPlaceIndex]);
    } else if (event.key === 'Escape') {
      setShowPlaceSuggestions(false);
    }
  };

  const valueText = (value) => {
    if (value === null || value === undefined || value === '') return 'Not available';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (typeof value === 'string' || typeof value === 'number') return String(value);
    if (Array.isArray(value)) return value.map(valueText).join(', ');
    return value.name || value.description || JSON.stringify(value);
  };

  const getValue = (source, ...paths) => {
    for (const path of paths) {
      const value = path.split('.').reduce((current, key) => current?.[key], source);
      if (value !== undefined && value !== null) return value;
    }
    return null;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setKundli(null);

    if (!form.fullName.trim() || !form.dob || !form.hour || !form.minute || !form.place.trim()) {
      setError('Please complete your name, date of birth, birth time, and birth place.');
      return;
    }

    let hour = Number(form.hour);
    if (form.meridiem === 'PM' && hour !== 12) hour += 12;
    if (form.meridiem === 'AM' && hour === 12) hour = 0;

    try {
      setIsLoading(true);
      const response = await apiClient.get('/astrology/kundli', {
        params: {
          fullName: form.fullName,
          dob: form.dob,
          birthTime: `${String(hour).padStart(2, '0')}:${form.minute}`,
          place: form.place,
          latitude: form.latitude || undefined,
          longitude: form.longitude || undefined,
          gender: form.gender,
        },
      });
      setKundli(response.data);
      saveKundli(response.data);
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'We could not generate your Kundli. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const kundliData = kundli?.data || kundli;
  const nakshatraDetails = getValue(kundliData, 'nakshatraDetails', 'nakshatra_details') || {};
  const yogaDetails = getValue(kundliData, 'yogaDetails', 'yoga_details');

  return (
    <main className="min-h-screen bg-white pb-20 pt-28 sm:pt-32">
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <Motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <Breadcrumb currentPage={t('nav.kundli')} homeLabel={t('breadcrumb.home')} />
          <div className="grid overflow-hidden rounded-[2rem] border border-[#f1dfbe] bg-[#fff3df] shadow-[0_20px_60px_-35px_rgba(212,175,55,0.45)] lg:grid-cols-[1fr_1.1fr]">
            <HeroAsset
              src={kundliHeroUrl}
              alt="Kundli hero"
              className="min-h-[280px] sm:min-h-[320px] lg:min-h-[420px]"
              fallback={
                <div className="relative h-full min-h-[300px] overflow-hidden bg-[radial-gradient(circle_at_70%_30%,rgba(147,197,253,0.95),rgba(29,78,216,0.74)_35%,rgba(13,27,72,0.96)_100%)]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(255,255,255,0.4),transparent_18%),radial-gradient(circle_at_38%_72%,rgba(255,214,153,0.32),transparent_16%),radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.18),transparent_16%)]"></div>
                  <div className="absolute left-10 top-1/2 h-44 w-36 -translate-y-1/2 rounded-[1.8rem] border border-[#f0bb77] bg-[linear-gradient(180deg,#fff1c8_0%,#f8ddb1_100%)]"></div>
                  <div className="absolute left-36 top-1/2 h-48 w-40 -translate-y-1/2 rounded-[1.8rem] border border-[#f0bb77] bg-[linear-gradient(180deg,#fff1c8_0%,#f8ddb1_100%)]"></div>
                </div>
              }
            />
            <div className="flex flex-col justify-center bg-[linear-gradient(180deg,#fff8ec_0%,#fff1d6_100%)] p-6 sm:p-8 md:p-10">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-saffron mb-4">{t('kundli.wisdom')}</p>
              <h1 className="mb-6 text-3xl font-bold text-black sm:text-4xl md:text-5xl">{t('kundli.title')}</h1>
              <p className="mb-6 text-sm italic leading-7 text-gray-900 sm:text-base md:text-lg md:leading-8">&ldquo;{t('kundli.quote')}&rdquo;</p>
              <p className="text-base leading-8 text-gray-800 sm:text-lg md:text-[1.1rem] md:leading-9">{t('kundli.description')}</p>
            </div>
          </div>
        </Motion.div>

        <Motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mt-8 overflow-hidden rounded-[2rem] bg-[radial-gradient(circle_at_50%_20%,rgba(228,190,121,0.28),transparent_16%),linear-gradient(180deg,#fbefd9_0%,#fff7ec_100%)] border border-[#efdfbf]">
          <div className="mx-auto max-w-5xl px-6 py-10 md:px-10 md:py-12">
            <form onSubmit={handleSubmit} className="rounded-[2rem] bg-white p-6 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.22)] sm:p-8 md:p-10">
              <h2 className="mb-8 text-2xl font-bold text-black sm:text-3xl md:text-4xl">{t('kundli.today')}</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <label className="block">
                  <span className="mb-3 block text-lg font-semibold text-black sm:text-xl">{t('kundli.fullName')}</span>
                  <input type="text" name="fullName" value={form.fullName} onChange={updateForm} placeholder={t('kundli.fullName')} className="w-full rounded-2xl border border-gray-300 px-4 py-4 text-base outline-none focus:border-saffron sm:px-5 sm:text-lg" />
                </label>
                <label className="block">
                  <span className="mb-3 block text-lg font-semibold text-black sm:text-xl">{t('kundli.dob')}</span>
                  <div className="relative">
                    <input type="date" name="dob" value={form.dob} onChange={updateForm} aria-label={today} className="w-full rounded-2xl border border-gray-300 px-4 py-4 pr-12 text-base outline-none focus:border-saffron sm:px-5 sm:pr-14 sm:text-lg" />
                    <CalendarDays className="absolute right-5 top-1/2 h-7 w-7 -translate-y-1/2 text-gray-500" />
                  </div>
                </label>
                <div>
                  <span className="mb-3 block text-lg font-semibold text-black sm:text-xl">{t('kundli.time')}</span>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <select name="hour" value={form.hour} onChange={updateForm} className="rounded-2xl border border-gray-300 px-4 py-4 text-base sm:px-5 sm:text-lg"><option value="">HH</option>{hours.map((hour) => <option key={hour} value={hour}>{hour}</option>)}</select>
                    <select name="minute" value={form.minute} onChange={updateForm} className="rounded-2xl border border-gray-300 px-4 py-4 text-base sm:px-5 sm:text-lg"><option value="">MM</option>{minutes.map((minute) => <option key={minute} value={minute}>{minute}</option>)}</select>
                    <select name="meridiem" value={form.meridiem} onChange={updateForm} className="rounded-2xl border border-gray-300 px-4 py-4 text-base sm:px-5 sm:text-lg"><option>AM</option><option>PM</option></select>
                  </div>
                </div>
                <label className="block">
                  <span className="mb-3 block text-lg font-semibold text-black sm:text-xl">{t('kundli.place')}</span>
                  <div className="relative">
                    <input ref={placeInputRef} type="text" name="place" value={form.place} onChange={handlePlaceChange} onKeyDown={handlePlaceKeyDown} onFocus={() => !form.latitude && form.place.trim().length >= 2 && setShowPlaceSuggestions(true)} autoComplete="off" placeholder={t('kundli.place')} className="w-full rounded-2xl border border-gray-300 px-4 py-4 text-base outline-none focus:border-saffron sm:px-5 sm:text-lg" />
                    {showPlaceSuggestions && (
                      <div ref={placeDropdownRef} className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
                        {isPlaceLoading ? (
                          <div className="flex items-center gap-3 px-4 py-4 text-base text-gray-600 sm:px-5 sm:text-lg"><span className="h-4 w-4 animate-spin rounded-full border-2 border-saffron border-t-transparent" />Searching places...</div>
                        ) : placeSuggestions.length ? placeSuggestions.map((place, index) => (
                          <button key={`${place.latitude}-${place.longitude}`} type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => selectPlace(place)} className={`block w-full px-4 py-3 text-left text-base text-black sm:px-5 sm:text-lg ${index === highlightedPlaceIndex ? 'bg-[#fff3df]' : 'hover:bg-[#fff8ec]'}`}>
                            {place.displayName}
                          </button>
                        )) : (
                          <p className="px-4 py-4 text-base text-gray-600 sm:px-5 sm:text-lg">No places found</p>
                        )}
                      </div>
                    )}
                  </div>
                </label>
              </div>
              <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-8">
                <label className="flex items-center gap-3 text-lg text-black sm:text-xl"><input type="radio" name="gender" value="male" checked={form.gender === 'male'} onChange={updateForm} className="h-5 w-5 sm:h-6 sm:w-6 accent-[#ffbf00]" /><span>{t('kundli.male')}</span></label>
                <label className="flex items-center gap-3 text-lg text-black sm:text-xl"><input type="radio" name="gender" value="female" checked={form.gender === 'female'} onChange={updateForm} className="h-5 w-5 sm:h-6 sm:w-6 accent-[#ffbf00]" /><span>{t('kundli.female')}</span></label>
              </div>
              {error && <p role="alert" className="mt-6 text-base font-medium text-red-700">{error}</p>}
              <button type="submit" disabled={isLoading} className="mt-10 w-full rounded-2xl bg-[#ffc400] px-8 py-4 text-xl font-semibold text-black hover:bg-[#f0b600] sm:py-5 sm:text-2xl">{isLoading ? <span className="inline-flex items-center gap-3"><span className="h-5 w-5 animate-spin rounded-full border-2 border-black border-t-transparent" />Generating Kundli...</span> : t('kundli.submit')}</button>
              {kundli && (
                <div className="mt-8 rounded-2xl border border-[#efdfbf] bg-[#fff8ec] p-6 text-gray-800">
                  <h3 className="text-2xl font-bold text-black">Your Kundli</h3>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <p><span className="font-semibold text-black">Nakshatra: </span>{valueText(getValue(nakshatraDetails, 'nakshatra.name', 'nakshatra'))}</p>
                    <p><span className="font-semibold text-black">Zodiac: </span>{valueText(getValue(nakshatraDetails, 'zodiac.name', 'zodiac'))}</p>
                    <p><span className="font-semibold text-black">Moon Sign: </span>{valueText(getValue(nakshatraDetails, 'chandraRasi.name', 'chandra_rasi.name', 'moonSign.name', 'moon_sign.name'))}</p>
                    <p><span className="font-semibold text-black">Mangal Dosha: </span>{valueText(getValue(kundliData, 'mangalDosha.hasDosha', 'mangal_dosha.has_dosha', 'mangalDosha'))}</p>
                    <p className="sm:col-span-2"><span className="font-semibold text-black">Yoga Details: </span>{valueText(yogaDetails)}</p>
                    <p className="sm:col-span-2"><span className="font-semibold text-black">Birth Details: </span>{kundli.birthDetails.fullName}, {kundli.birthDetails.dob} {kundli.birthDetails.birthTime} — {kundli.birthDetails.place}</p>
                  </div>
                </div>
              )}
            </form>
          </div>
        </Motion.section>
      </section>
    </main>
  );
}
