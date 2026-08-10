/**
 * VedAura API Client
 * 
 * Centralized HTTP client for communicating with the backend API.
 * All API calls go through this module for consistency.
 */

const API_BASE = '/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include',
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.message || data.error || 'Request failed');
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    if (error.status) throw error;

    // Network error — API might not be running
    console.warn(`API request failed for ${endpoint}:`, error.message);
    throw new Error('Unable to connect to the server. Please try again.');
  }
}

// ─── Auth API ───────────────────────────────────────────────

export const authApi = {
  adminLogin: (username, password) =>
    request('/auth/admin/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  adminVerify: (username) =>
    request('/auth/admin/verify', {
      method: 'POST',
      body: JSON.stringify({ username }),
    }),

  session: () =>
    request('/auth/session'),

  logout: () =>
    request('/auth/logout', {
      method: 'POST',
    }),

  userLogin: (identifier, password) =>
    request('/auth/user/login', {
      method: 'POST',
      body: JSON.stringify({ identifier, password }),
    }),

  userRegister: (data) =>
    request('/auth/user/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// ─── Pandits API ────────────────────────────────────────────

export const panditsApi = {
  list: () =>
    request('/pandits'),

  getById: (id) =>
    request(`/pandits/${id}`),

  create: (data) =>
    request('/pandits', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id, data) =>
    request(`/pandits/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id) =>
    request(`/pandits/${id}`, {
      method: 'DELETE',
    }),
};

// ─── Contact API ────────────────────────────────────────────

export const contactApi = {
  submit: (data) =>
    request('/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  list: () =>
    request('/contact'),
};

// â”€â”€â”€ Admin API â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const adminApi = {
  overview: () =>
    request('/admin/overview'),

  users: () =>
    request('/admin/users'),

  deleteUser: (id) =>
    request(`/admin/users/${id}`, {
      method: 'DELETE',
    }),

  registrations: () =>
    request('/admin/registrations'),

  updateRegistrationStatus: (id, status) =>
    request(`/admin/registrations/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  deleteRegistration: (id) =>
    request(`/admin/registrations/${id}`, {
      method: 'DELETE',
    }),
};

// ─── Health Check ───────────────────────────────────────────

export const healthCheck = () => request('/health');
