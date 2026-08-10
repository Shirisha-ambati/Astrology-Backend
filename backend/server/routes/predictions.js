import express from 'express';
import { createLovePrediction } from '../services/lovePrediction.js';
import { createMarriagePrediction } from '../services/marriagePrediction.js';
import { getSavedKundli } from '../services/kundliStore.js';

const router = express.Router();

async function prediction(handler, req, res) {
  try {
    const kundli = await getSavedKundli(req);
    if (!kundli) return res.status(400).json({ message: 'Please generate your Kundli first.' });
    return res.json(handler(kundli));
  } catch (error) {
    console.error('Prediction generation failed:', error.message);
    return res.status(500).json({ message: 'Unable to generate your prediction right now.' });
  }
}

router.get('/love', (req, res) => prediction(createLovePrediction, req, res));
router.get('/marriage', (req, res) => prediction(createMarriagePrediction, req, res));

export default router;
