import crypto from 'node:crypto';
import pool from '../db.js';

const COOKIE_NAME = 'vedaura_kundli_id';
const MAX_AGE_SECONDS = 30 * 24 * 60 * 60;

export async function saveKundliRecord(kundli) {
  const id = crypto.randomUUID();
  await pool.query('INSERT INTO kundli_records (id, kundli_data) VALUES ($1, $2::jsonb)', [id, JSON.stringify(kundli)]);
  return id;
}

export async function getSavedKundli(req) {
  const cookie = String(req.headers.cookie || '').split(';').map((part) => part.trim()).find((part) => part.startsWith(`${COOKIE_NAME}=`));
  const id = cookie?.slice(COOKIE_NAME.length + 1);
  if (!id) return null;
  const result = await pool.query('SELECT kundli_data FROM kundli_records WHERE id = $1 AND expires_at > NOW()', [id]);
  return result.rows[0]?.kundli_data || null;
}

export function attachKundliCookie(res, id) {
  res.append('Set-Cookie', `${COOKIE_NAME}=${encodeURIComponent(id)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${MAX_AGE_SECONDS}`);
}
