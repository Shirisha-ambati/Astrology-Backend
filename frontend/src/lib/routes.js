export const routes = {
  Home: '#/',
  Horoscope: '#/horoscope',
  Kundli: '#/kundli',
  Numerology: '#/numerology',
  'Astro-Neuro': '#/astro-numerology',
  'Swar Science': '#/swar-science',
  'Kundli Matching': '#/kundli-matching',
  Love: '#/love',
  Marriage: '#/marriage',
  'Pandit Registration': '#/pandit-registration',
  Shop: '#/shop',
  Login: '#/login',
  'Pandit Dashboard': '#/pandit-dashboard',
  Admin: '#/admin',
  'Admin Login': '#/admin-login',
  Account: '#/account'
};

export const hashToPage = Object.entries(routes).reduce((acc, [page, hash]) => {
  acc[hash] = page;
  return acc;
}, {});

export function getPageFromHash() {
  return hashToPage[window.location.hash || '#/'] || 'Home';
}
