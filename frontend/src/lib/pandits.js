import { panditsApi } from './api';

const STORAGE_KEY = 'vedaura_pandit_registrations';

// ─── Local Storage Helpers (fallback / cache) ───────────────

function readStorage() {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeStorage(data) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
}

// ─── Database-backed functions ──────────────────────────────

/**
 * Load all pandit registrations from the database.
 * Falls back to localStorage if the API is unreachable.
 */
export async function loadPanditRegistrations() {
  try {
    const data = await panditsApi.list();
    // Cache in localStorage for offline access
    writeStorage(data);
    return data;
  } catch (error) {
    console.warn('Failed to load from API, using local cache:', error.message);
    return readStorage();
  }
}

/**
 * Save a new pandit registration to the database.
 * The backend is the source of truth for new registrations.
 */
export async function savePanditRegistration(entry) {
  const saved = await panditsApi.create(entry);
  const current = readStorage();
  const next = [saved, ...current];
  writeStorage(next);
  return saved;
}

/**
 * Load registrations synchronously from local cache.
 * Use this for initial render before async data loads.
 */
export function loadPanditRegistrationsSync() {
  return readStorage();
}
