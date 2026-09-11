import pool from '../db.js';
import { formatUser } from '../lib/formatters.js';

/**
 * GET /api/users/me — Get current user's profile
 */
export async function getMe(req, res) {
  try {
    const result = await pool.query(
      'SELECT id, email, phone, full_name, created_at FROM users WHERE id = $1',
      [req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json(formatUser(result.rows[0]));
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ error: 'Failed to load profile.' });
  }
}

/**
 * PUT /api/users/me — Update current user's profile
 */
export async function updateMe(req, res) {
  try {
    const { fullName, phone } = req.body;

    const result = await pool.query(
      `UPDATE users
       SET full_name = COALESCE($1, full_name),
           phone     = COALESCE($2, phone)
       WHERE id = $3
       RETURNING id, email, phone, full_name, created_at`,
      [fullName || null, phone || null, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Fire session-changed signal so navbar refreshes name
    res.json({ success: true, user: formatUser(result.rows[0]) });
  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({ error: 'Failed to update profile.' });
  }
}
