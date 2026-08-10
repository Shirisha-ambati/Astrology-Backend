import { Router } from 'express';
import {
  listPandits,
  getPanditById,
  createPandit,
  updatePandit,
  deletePandit,
} from '../controllers/panditController.js';

const router = Router();

// Public
router.get('/', listPandits);
router.get('/:id', getPanditById);

// Registration
router.post('/', createPandit);
router.put('/:id', updatePandit);
router.delete('/:id', deletePandit);

export default router;
