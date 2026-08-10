const STORAGE_KEY = 'vedaura:kundli';
const NOTICE_KEY = 'vedaura:kundli-notice';

export function saveKundli(kundli) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ kundli, savedAt: new Date().toISOString() }));
}

export function getSavedKundli() {
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY))?.kundli || null;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function requireKundli() {
  if (getSavedKundli()) return true;
  window.sessionStorage.setItem(NOTICE_KEY, 'Please generate your Kundli first.');
  window.location.hash = '#/kundli';
  return false;
}

export function takeKundliNotice() {
  const notice = window.sessionStorage.getItem(NOTICE_KEY);
  window.sessionStorage.removeItem(NOTICE_KEY);
  return notice;
}
