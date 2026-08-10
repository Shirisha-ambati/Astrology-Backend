import React, { useEffect, useState } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import HoroscopePage from './pages/HoroscopePage';
import KundliPage from './pages/KundliPage';
import MatchingPage from './pages/MatchingPage';
import NumerologyPage from './pages/NumerologyPage';
import AstroNumerologyPage from './pages/AstroNumerologyPage';
import SwarSciencePage from './pages/SwarSciencePage';
import ArticlePage from './pages/ArticlePage';
import PredictionPage from './pages/PredictionPage';
import ShopPage from './pages/ShopPage';
import LoginPage from './pages/LoginPage';
import PanditDashboardPage from './pages/PanditDashboardPage';
import PanditRegistrationPage from './pages/PanditRegistrationPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminPage from './pages/AdminPage';
import { getPageFromHash, routes } from './lib/routes';
import { articles } from './data/siteContent';
import { createTranslator } from './data/i18n';
import { authApi } from './lib/api';

// Clear saved Kundli from localStorage on initial page load / refresh
if (typeof window !== 'undefined') {
  window.localStorage.removeItem('vedaura:kundli');
}

function App() {
  const [page, setPage] = useState(() => getPageFromHash());
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const t = createTranslator('en');

  const [kundliForm, setKundliForm] = useState({
    fullName: '',
    dob: new Date().toISOString().slice(0, 10),
    hour: '',
    minute: '',
    meridiem: 'AM',
    place: '',
    latitude: '',
    longitude: '',
    gender: 'male',
  });
  const [kundliResult, setKundliResult] = useState(null);

  useEffect(() => {
    const refreshSession = async () => {
      try {
        const data = await authApi.session();
        setSession(data.authenticated ? data.session : null);
      } catch {
        setSession(null);
      } finally {
        setAuthLoading(false);
      }
    };

    refreshSession();

    const handleSessionChange = () => {
      refreshSession();
    };

    window.addEventListener('vedaura-session-changed', handleSessionChange);
    return () => window.removeEventListener('vedaura-session-changed', handleSessionChange);
  }, []);

  useEffect(() => {
    const handleHashChange = () => setPage(getPageFromHash());
    window.addEventListener('hashchange', handleHashChange);
    if (!window.location.hash) window.location.hash = routes.Home;
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  const navigate = (nextPage) => {
    const targetPage = routes[nextPage] ? nextPage : 'Home';
    setPage(targetPage);
    window.location.hash = routes[targetPage] || routes.Home;
  };

  let content = <HomePage onNavigate={navigate} t={t} />;

  if (page === 'Horoscope') content = <HoroscopePage t={t} />;
  if (page === 'Kundli') {
    content = (
      <KundliPage
        t={t}
        form={kundliForm}
        setForm={setKundliForm}
        kundli={kundliResult}
        setKundli={setKundliResult}
      />
    );
  }
  if (page === 'Kundli Matching') content = <MatchingPage t={t} />;
  if (page === 'Love') content = <PredictionPage type="Love" t={t} />;
  if (page === 'Marriage') content = <PredictionPage type="Marriage" t={t} />;
  if (page === 'Numerology') content = <NumerologyPage t={t} />;
  if (page === 'Astro-Neuro') content = <AstroNumerologyPage t={t} />;
  if (page === 'Swar Science') content = <SwarSciencePage t={t} />;
  if (page === 'Shop') content = <ShopPage onNavigate={navigate} t={t} />;
  if (page === 'Login') content = <LoginPage onNavigate={navigate} t={t} />;
  if (page === 'Pandit Dashboard') content = <PanditDashboardPage onNavigate={navigate} />;
  if (page === 'Pandit Registration') content = <PanditRegistrationPage onNavigate={navigate} />;
  if (page === 'Admin Login') content = <AdminLoginPage onNavigate={navigate} />;
  if (page === 'Admin' && authLoading) {
    content = (
      <main className="min-h-screen bg-cream pt-32">
        <div className="mx-auto flex max-w-7xl items-center justify-center px-6 py-24 text-gray-600">
          Loading secure session...
        </div>
      </main>
    );
  }
  if (page === 'Admin' && !authLoading && session?.userType === 'admin') content = <AdminPage onNavigate={navigate} />;
  if (page === 'Admin' && !authLoading && session?.userType !== 'admin') content = <AdminLoginPage onNavigate={navigate} />;
  if (articles[page] && !['Kundli Matching', 'Love', 'Marriage'].includes(page)) content = <ArticlePage page={page} t={t} />;

  return (
    <div className="min-h-screen bg-cream font-sans text-gray-800">
      <Navbar
        page={page}
        onNavigate={navigate}
        t={t}
        session={session}
      />
      {content}
      <Footer t={t} />
    </div>
  );
}

export default App;
