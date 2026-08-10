import bcrypt from 'bcryptjs';
import pool from '../db.js';
import {
  buildClearedSessionCookie,
  buildSessionCookie,
  getSessionContext,
  issueSession,
  revokeSession,
} from '../lib/session.js';
import {
  formatAdmin,
  formatUser,
  formatPanditBrief,
} from '../lib/formatters.js';

// ─── Helpers ────────────────────────────────────────────────

function normalizeIdentifier(value) {
  return String(value || '').trim();
}

function normalizePhone(value) {
  return String(value || '').replace(/[^0-9]+/g, '');
}

function isPhoneIdentifier(value) {
  const text = normalizeIdentifier(value);
  return text.length > 0 && !text.includes('@') && /\d/.test(text);
}

function attachSessionCookie(res, token) {
  res.append('Set-Cookie', buildSessionCookie(token));
}

function clearSessionCookie(res) {
  res.append('Set-Cookie', buildClearedSessionCookie());
}

async function loadUserByIdentifier(identifier) {
  if (isPhoneIdentifier(identifier)) {
    const normalizedPhone = normalizePhone(identifier);
    if (!normalizedPhone) return null;

    const panditResult = await pool.query(
      `SELECT id, full_name, email, mobile, password_hash, specialization
       FROM pandit_registrations
       WHERE regexp_replace(COALESCE(mobile, ''), '[^0-9]+', '', 'g') = $1
       LIMIT 1`,
      [normalizedPhone]
    );

    if (panditResult.rows.length > 0) {
      return { type: 'pandit', row: panditResult.rows[0] };
    }

    const userResult = await pool.query(
      `SELECT id, email, phone, full_name, password_hash
       FROM users
       WHERE regexp_replace(COALESCE(phone, ''), '[^0-9]+', '', 'g') = $1
       LIMIT 1`,
      [normalizedPhone]
    );

    if (userResult.rows.length > 0) {
      return { type: 'user', row: userResult.rows[0] };
    }

    return null;
  }

  const normalizedEmail = normalizeIdentifier(identifier);
  if (!normalizedEmail) return null;

  const panditResult = await pool.query(
    `SELECT id, full_name, email, mobile, password_hash, specialization
     FROM pandit_registrations
     WHERE LOWER(email) = LOWER($1)
     LIMIT 1`,
    [normalizedEmail]
  );

  if (panditResult.rows.length > 0) {
    return { type: 'pandit', row: panditResult.rows[0] };
  }

  const userResult = await pool.query(
    `SELECT id, email, phone, full_name, password_hash
     FROM users
     WHERE LOWER(email) = LOWER($1)
     LIMIT 1`,
    [normalizedEmail]
  );

  if (userResult.rows.length > 0) {
    return { type: 'user', row: userResult.rows[0] };
  }

  return null;
}

// ─── Controller Actions ─────────────────────────────────────

export async function adminLogin(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required.' });
    }

    const result = await pool.query(
      'SELECT id, username, password FROM admin_users WHERE username = $1',
      [username.trim()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid admin credentials.' });
    }

    const admin = result.rows[0];
    const isValid = await bcrypt.compare(password, admin.password);

    if (!isValid) {
      return res.status(401).json({ success: false, message: 'Invalid admin credentials.' });
    }

    const session = await issueSession(pool, {
      userType: 'admin',
      role: 'admin',
      userId: admin.id,
    });
    attachSessionCookie(res, session.token);

    res.json({
      success: true,
      admin: formatAdmin(admin),
      session: {
        userType: 'admin',
        role: 'admin',
        user: formatAdmin(admin),
        expiresAt: session.expiresAt,
      },
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
}

export async function adminVerify(req, res) {
  try {
    const sessionContext = await getSessionContext(pool, req);
    res.json({ authenticated: Boolean(sessionContext?.session?.user_type === 'admin') });
  } catch (error) {
    console.error('Admin verify error:', error);
    res.json({ authenticated: false });
  }
}

export async function getSession(req, res) {
  try {
    const sessionContext = await getSessionContext(pool, req);

    if (!sessionContext) {
      return res.json({ authenticated: false });
    }

    const { session, principal } = sessionContext;
    const payload =
      session.user_type === 'admin'
        ? formatAdmin(principal)
        : session.role === 'pandit'
          ? formatPanditBrief(principal)
          : formatUser(principal);

    res.json({
      authenticated: true,
      session: {
        userType: session.user_type,
        role: session.role,
        user: payload,
        expiresAt: session.expires_at,
      },
    });
  } catch (error) {
    console.error('Session lookup error:', error);
    res.status(500).json({ authenticated: false });
  }
}

export async function logout(req, res) {
  try {
    await revokeSession(pool, req);
    clearSessionCookie(res);
    res.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    clearSessionCookie(res);
    res.json({ success: true });
  }
}

export async function userLogin(req, res) {
  try {
    const { email, phone, identifier, password } = req.body;
    const loginIdentifier = normalizeIdentifier(identifier || email || phone);

    if (!loginIdentifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email or phone and password are required.',
      });
    }

    const found = await loadUserByIdentifier(loginIdentifier);

    if (found?.type === 'pandit') {
      const isValid = await bcrypt.compare(password, found.row.password_hash);
      if (isValid) {
        const session = await issueSession(pool, {
          userType: 'user',
          role: 'pandit',
          userId: found.row.id,
        });
        attachSessionCookie(res, session.token);

        return res.json({
          success: true,
          role: 'pandit',
          user: formatPanditBrief(found.row),
          session: {
            userType: 'user',
            role: 'pandit',
            user: formatPanditBrief(found.row),
            expiresAt: session.expiresAt,
          },
        });
      }
    }

    if (found?.type === 'user') {
      const isValid = await bcrypt.compare(password, found.row.password_hash);

      if (isValid) {
        const session = await issueSession(pool, {
          userType: 'user',
          role: 'user',
          userId: found.row.id,
        });
        attachSessionCookie(res, session.token);

        return res.json({
          success: true,
          role: 'user',
          user: formatUser(found.row),
          session: {
            userType: 'user',
            role: 'user',
            user: formatUser(found.row),
            expiresAt: session.expiresAt,
          },
        });
      }
    }

    res.status(401).json({ success: false, message: 'Invalid email or password.' });
  } catch (error) {
    console.error('User login error:', error);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
}

export async function userRegister(req, res) {
  try {
    const { email, phone, password, fullName } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const registrationChecks = ['LOWER(email) = LOWER($1)'];
    const registrationParams = [email.trim()];

    if (String(phone || '').trim()) {
      registrationChecks.push(`regexp_replace(COALESCE(phone, ''), '[^0-9]+', '', 'g') = regexp_replace($2, '[^0-9]+', '', 'g')`);
      registrationParams.push(phone);
    }

    const existing = await pool.query(
      `SELECT id FROM users WHERE ${registrationChecks.join(' OR ')}`,
      registrationParams
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({ success: false, message: 'An account with this email or phone already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const result = await pool.query(
      'INSERT INTO users (email, phone, password_hash, full_name) VALUES ($1, $2, $3, $4) RETURNING id, email, phone, full_name',
      [email.trim(), phone || null, hashedPassword, fullName || null]
    );

    const user = result.rows[0];
    res.status(201).json({
      success: true,
      user: formatUser(user),
    });
  } catch (error) {
    console.error('User register error:', error);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
}
