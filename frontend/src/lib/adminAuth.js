import { authApi } from './api';

export const adminCredentials = {
  username: 'admin@vedaura.com',
  password: 'admin123',
};

/**
 * Sign in admin against the backend and let the server set the session cookie.
 */
export async function signInAdmin(username, password) {
  const data = await authApi.adminLogin(username, password);

  if (!data.success) {
    return { success: false, message: data.message || 'Invalid admin credentials.' };
  }

  return {
    success: true,
    session: data.session,
    admin: data.admin,
  };
}

export async function signOutAdmin() {
  try {
    await authApi.logout();
  } catch {
    // If the server is unavailable, the cookie will still expire naturally.
  }
}
