import pool from '../db.js';
import { formatContactSubmission } from '../lib/formatters.js';

// ─── Controller Actions ─────────────────────────────────────

export async function submitContact(req, res) {
  try {
    const { name, email, phone, message } = req.body;

    if (!name && !email && !message) {
      return res.status(400).json({ error: 'Please fill in at least name, email, and message.' });
    }

    const result = await pool.query(
      'INSERT INTO contact_submissions (name, email, phone, message) VALUES ($1, $2, $3, $4) RETURNING id, created_at',
      [name || null, email || null, phone || null, message || null]
    );

    res.status(201).json({
      success: true,
      id: result.rows[0].id,
      createdAt: result.rows[0].created_at,
    });
  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(500).json({ error: 'Failed to submit. Please try again.' });
  }
}

export async function listContacts(req, res) {
  try {
    const result = await pool.query(
      'SELECT * FROM contact_submissions ORDER BY created_at DESC'
    );
    res.json(result.rows.map(formatContactSubmission));
  } catch (error) {
    console.error('List contacts error:', error);
    res.status(500).json({ error: 'Failed to load submissions.' });
  }
}
