import bcrypt from 'bcryptjs';
import pool from '../db.js';
import { formatPanditRegistration } from '../lib/formatters.js';

// ─── Controller Actions ─────────────────────────────────────

export async function listPandits(req, res) {
  try {
    const result = await pool.query(
      'SELECT * FROM pandit_registrations ORDER BY created_at DESC'
    );
    res.json(result.rows.map(formatPanditRegistration));
  } catch (error) {
    console.error('List pandits error:', error);
    res.status(500).json({ error: 'Failed to load registrations.' });
  }
}

export async function getPanditById(req, res) {
  try {
    const result = await pool.query(
      'SELECT * FROM pandit_registrations WHERE id = $1',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Registration not found.' });
    }

    res.json(formatPanditRegistration(result.rows[0]));
  } catch (error) {
    console.error('Get pandit error:', error);
    res.status(500).json({ error: 'Failed to load registration.' });
  }
}

export async function createPandit(req, res) {
  try {
    const data = req.body;

    // Hash password if provided
    let passwordHash = null;
    if (data.password) {
      passwordHash = await bcrypt.hash(data.password, 12);
    }

    const result = await pool.query(
      `INSERT INTO pandit_registrations (
        full_name, gender, dob, profile_photo, mobile, email,
        city, state, country, address, experience, specialization,
        languages, bio, services, certifications, available_days,
        time_slots, mode, price, free_consultation, username,
        password_hash, id_proof, selfie, upi_id, bank_account, ifsc_code
      ) VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11, $12,
        $13, $14, $15, $16, $17,
        $18, $19, $20, $21, $22,
        $23, $24, $25, $26, $27, $28
      ) RETURNING *`,
      [
        data.fullName || null,
        data.gender || null,
        data.dob || null,
        data.profilePhoto || null,
        data.mobile || null,
        data.email || null,
        data.city || null,
        data.state || null,
        data.country || null,
        data.address || null,
        data.experience || null,
        data.specialization || null,
        data.languages || null,
        data.bio || null,
        data.services || [],
        data.certifications || [],
        data.availableDays || [],
        data.timeSlots || null,
        data.mode || null,
        data.price || null,
        data.freeConsultation || null,
        data.username || null,
        passwordHash,
        data.idProof || null,
        data.selfie || null,
        data.upiId || null,
        data.bankAccount || null,
        data.ifscCode || null,
      ]
    );

    res.status(201).json(formatPanditRegistration(result.rows[0]));
  } catch (error) {
    console.error('Create pandit error:', error);

    if (error.code === '23505') {
      return res.status(409).json({ error: 'A registration with this username or email already exists.' });
    }

    res.status(500).json({ error: 'Failed to save registration.' });
  }
}

export async function updatePandit(req, res) {
  try {
    const data = req.body;

    const result = await pool.query(
      `UPDATE pandit_registrations SET
        full_name = COALESCE($1, full_name),
        gender = COALESCE($2, gender),
        dob = COALESCE($3, dob),
        mobile = COALESCE($4, mobile),
        email = COALESCE($5, email),
        city = COALESCE($6, city),
        state = COALESCE($7, state),
        country = COALESCE($8, country),
        address = COALESCE($9, address),
        experience = COALESCE($10, experience),
        specialization = COALESCE($11, specialization),
        languages = COALESCE($12, languages),
        bio = COALESCE($13, bio),
        services = COALESCE($14, services),
        available_days = COALESCE($15, available_days),
        time_slots = COALESCE($16, time_slots),
        mode = COALESCE($17, mode),
        price = COALESCE($18, price),
        free_consultation = COALESCE($19, free_consultation),
        upi_id = COALESCE($20, upi_id),
        bank_account = COALESCE($21, bank_account),
        ifsc_code = COALESCE($22, ifsc_code),
        status = COALESCE($23, status),
        updated_at = NOW()
      WHERE id = $24
      RETURNING *`,
      [
        data.fullName, data.gender, data.dob, data.mobile, data.email,
        data.city, data.state, data.country, data.address, data.experience,
        data.specialization, data.languages, data.bio, data.services,
        data.availableDays, data.timeSlots, data.mode, data.price,
        data.freeConsultation, data.upiId, data.bankAccount, data.ifscCode,
        data.status, req.params.id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Registration not found.' });
    }

    res.json(formatPanditRegistration(result.rows[0]));
  } catch (error) {
    console.error('Update pandit error:', error);
    res.status(500).json({ error: 'Failed to update registration.' });
  }
}

export async function deletePandit(req, res) {
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
    console.error('Delete pandit error:', error);
    res.status(500).json({ error: 'Failed to delete registration.' });
  }
}
