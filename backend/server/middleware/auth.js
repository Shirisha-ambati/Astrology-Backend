import pool from '../db.js';
import { getSessionContext } from '../lib/session.js';

/**
 * Express middleware — verifies the request has a valid admin session.
 * Attaches `req.adminSession` and `req.admin` on success.
 */
export async function requireAdmin(req, res, next) {
  try {
    const sessionContext = await getSessionContext(pool, req);

    if (!sessionContext || sessionContext.session.user_type !== 'admin') {
      return res.status(401).json({ error: 'Admin authentication required.' });
    }

    req.adminSession = sessionContext.session;
    req.admin = sessionContext.principal;
    next();
  } catch (error) {
    console.error('Admin session error:', error);
    res.status(401).json({ error: 'Admin authentication required.' });
  }
}
