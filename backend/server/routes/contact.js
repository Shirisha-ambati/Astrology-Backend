import { Router } from 'express';
import {
  submitContact,
  listContacts,
} from '../controllers/contactController.js';

const router = Router();

// Submit a contact/inquiry form
router.post('/', submitContact);

// List all submissions (admin use)
router.get('/', listContacts);

export default router;
