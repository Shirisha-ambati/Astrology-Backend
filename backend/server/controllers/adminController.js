import pool from '../db.js';
import {
  formatPanditRegistration,
  formatUserListItem,
} from '../lib/formatters.js';

// ─── Controller Actions ─────────────────────────────────────

export async function getOverview(req, res) {
  try {
    const [userCount, registrationCount, statusCount] = await Promise.all([
      pool.query('SELECT COUNT(*)::int AS count FROM users'),
      pool.query('SELECT COUNT(*)::int AS count FROM pandit_registrations'),
      pool.query(
        `SELECT
           COUNT(*) FILTER (WHERE status = 'pending')::int AS pending,
           COUNT(*) FILTER (WHERE status = 'approved')::int AS approved,
           COUNT(*) FILTER (WHERE status = 'rejected')::int AS rejected
         FROM pandit_registrations`
      ),
    ]);

    res.json({
      users: userCount.rows[0].count,
      registrations: registrationCount.rows[0].count,
      pending: statusCount.rows[0].pending,
      approved: statusCount.rows[0].approved,
      rejected: statusCount.rows[0].rejected,
    });
  } catch (error) {
    console.error('Admin overview error:', error);
    res.status(500).json({ error: 'Failed to load overview.' });
  }
}

export async function listUsers(req, res) {
  try {
    const limit = Math.min(Number(req.query.limit || 100), 250);
    const result = await pool.query(
      `SELECT id, email, phone, full_name, created_at
       FROM users
       ORDER BY created_at DESC
       LIMIT $1`,
      [limit]
    );

    res.json(result.rows.map(formatUserListItem));
  } catch (error) {
    console.error('List users error:', error);
    res.status(500).json({ error: 'Failed to load users.' });
  }
}

export async function deleteUser(req, res) {
  try {
    const result = await pool.query(
      'DELETE FROM users WHERE id = $1 RETURNING id',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json({ success: true, deletedId: req.params.id });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user.' });
  }
}

export async function listRegistrations(req, res) {
  try {
    const limit = Math.min(Number(req.query.limit || 100), 250);
    const result = await pool.query(
      'SELECT * FROM pandit_registrations ORDER BY created_at DESC LIMIT $1',
      [limit]
    );

    res.json(result.rows.map(formatPanditRegistration));
  } catch (error) {
    console.error('List registrations error:', error);
    res.status(500).json({ error: 'Failed to load registrations.' });
  }
}

export async function updateRegistrationStatus(req, res) {
  try {
    const { status } = req.body;
    const allowedStatuses = ['pending', 'approved', 'rejected'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status.' });
    }

    const result = await pool.query(
      `UPDATE pandit_registrations
       SET status = $1,
           updated_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [status, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Registration not found.' });
    }

    res.json(formatPanditRegistration(result.rows[0]));
  } catch (error) {
    console.error('Update registration error:', error);
    res.status(500).json({ error: 'Failed to update registration.' });
  }
}

export async function deleteRegistration(req, res) {
  try {
    const result = await pool.query(
      'DELETE FROM pandit_registrations WHERE id = $1 RETURNING id',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Registration not found.' });
    }

    res.json({ success: true, deletedId: req.params.id });
  } catch (error) {
    console.error('Delete registration error:', error);
    res.status(500).json({ error: 'Failed to delete registration.' });
  }
}
