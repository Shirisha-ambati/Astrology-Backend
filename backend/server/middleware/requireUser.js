import pool from '../db.js';
import { getSessionContext } from '../lib/session.js';

/**
 * Express middleware — verifies the request has a valid user session.
 * Attaches `req.userSession` and `req.userId` on success.
 */
export async function requireUser(req, res, next) {
  try {
    const sessionContext = await getSessionContext(pool, req);

    if (!sessionContext || sessionContext.session.user_type !== 'user') {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    req.userSession = sessionContext.session;
    req.userId = sessionContext.session.user_id;
    req.userRole = sessionContext.session.role;
    next();
  } catch (error) {
    console.error('User session error:', error);
    res.status(401).json({ error: 'Authentication required.' });
  }
}
