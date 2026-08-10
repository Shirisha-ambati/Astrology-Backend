import express from 'express';
import { getNumerologyReport } from '../services/numerologyCalculator.js';

const router = express.Router();

router.post('/calculate', (req, res) => {
  try {
    const { fullName, dob } = req.body;

    if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
      return res.status(400).json({ error: 'Please provide a valid full name (at least 2 characters).' });
    }

    const dobRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dob || !dobRegex.test(dob)) {
      return res.status(400).json({ error: 'Please provide a valid date of birth in YYYY-MM-DD format.' });
    }

    const [year, month, day] = dob.split('-').map(Number);
    if (month < 1 || month > 12 || day < 1 || day > 31 || year < 1900 || year > new Date().getFullYear()) {
      return res.status(400).json({ error: 'Please provide a valid date of birth.' });
    }

    const report = getNumerologyReport(fullName.trim(), dob);
    return res.json(report);
  } catch (error) {
    console.error('[Numerology] Calculation error:', error.message);
    return res.status(500).json({ error: 'Unable to generate your numerology report right now. Please try again.' });
  }
});

export default router;
