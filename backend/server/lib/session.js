import crypto from 'crypto';

const COOKIE_NAME = 'vedaura_session';
const SESSION_DAYS = Number(process.env.SESSION_TTL_DAYS || 14);
const SESSION_SECRET = process.env.SESSION_SECRET || 'vedaura-dev-session-secret';
const SESSION_MAX_AGE_SECONDS = SESSION_DAYS * 24 * 60 * 60;

function parseCookies(cookieHeader = '') {
  return cookieHeader.split(';').reduce((cookies, part) => {
    const [rawName, ...rest] = part.split('=');
    const name = rawName?.trim();
    if (!name) return cookies;
    cookies[name] = decodeURIComponent(rest.join('=').trim());
    return cookies;
  }, {});
}

export function getSessionTokenFromRequest(req) {
  const cookies = parseCookies(req.headers.cookie || '');
  return cookies[COOKIE_NAME] || null;
}

export function createSessionToken() {
  return crypto.randomBytes(32).toString('hex');
}

export function hashSessionToken(token) {
  return crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(token)
    .digest('hex');
}

export function buildSessionCookie(token) {
  const parts = [
    `${COOKIE_NAME}=${encodeURIComponent(token)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${SESSION_MAX_AGE_SECONDS}`,
  ];

  if (process.env.NODE_ENV === 'production') {
    parts.push('Secure');
  }

  return parts.join('; ');
}

export function buildClearedSessionCookie() {
  return [
    `${COOKIE_NAME}=`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    'Max-Age=0',
  ].join('; ');
}

export async function issueSession(pool, { userType, role, userId }) {
  const token = createSessionToken();
  const tokenHash = hashSessionToken(token);
  const result = await pool.query(
    `INSERT INTO auth_sessions (token_hash, user_type, role, user_id, expires_at)
     VALUES ($1, $2, $3, $4, NOW() + ($5 * INTERVAL '1 day'))
     RETURNING id, expires_at`,
    [tokenHash, userType, role || null, userId, SESSION_DAYS]
  );

  return {
    token,
    tokenHash,
    expiresAt: result.rows[0].expires_at,
  };
}

export async function getSessionContext(pool, req) {
  const token = getSessionTokenFromRequest(req);
  if (!token) return null;

  const tokenHash = hashSessionToken(token);
  const sessionResult = await pool.query(
    `SELECT id, user_type, role, user_id, expires_at
     FROM auth_sessions
     WHERE token_hash = $1
       AND revoked_at IS NULL
       AND expires_at > NOW()
     LIMIT 1`,
    [tokenHash]
  );

  if (sessionResult.rows.length === 0) return null;

  const session = sessionResult.rows[0];
  let principal = null;

  if (session.user_type === 'admin') {
    const adminResult = await pool.query(
      'SELECT id, username, created_at FROM admin_users WHERE id = $1',
      [session.user_id]
    );
    principal = adminResult.rows[0] || null;
  } else if (session.role === 'pandit') {
    const panditResult = await pool.query(
      `SELECT id, full_name, email, mobile, specialization, created_at
       FROM pandit_registrations
       WHERE id = $1`,
      [session.user_id]
    );
    principal = panditResult.rows[0] || null;
  } else {
    const userResult = await pool.query(
      `SELECT id, email, phone, full_name, created_at
       FROM users
       WHERE id = $1`,
      [session.user_id]
    );
    principal = userResult.rows[0] || null;
  }

  if (!principal) {
    return null;
  }

  return {
    token,
    session,
    principal,
  };
}

export async function revokeSession(pool, req) {
  const token = getSessionTokenFromRequest(req);
  if (!token) return false;

  const tokenHash = hashSessionToken(token);
  const result = await pool.query(
    `UPDATE auth_sessions
     SET revoked_at = NOW()
     WHERE token_hash = $1
       AND revoked_at IS NULL
     RETURNING id`,
    [tokenHash]
  );

  return result.rows.length > 0;
}
