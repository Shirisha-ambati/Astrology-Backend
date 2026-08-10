import { Router } from 'express';
import { requireAdmin } from '../middleware/auth.js';
import {
  getOverview,
  listUsers,
  deleteUser,
  listRegistrations,
  updateRegistrationStatus,
  deleteRegistration,
} from '../controllers/adminController.js';

const router = Router();

// All admin routes require admin authentication
router.use(requireAdmin);

// Dashboard overview
router.get('/overview', getOverview);

// User management
router.get('/users', listUsers);
router.delete('/users/:id', deleteUser);

// Pandit registration management
router.get('/registrations', listRegistrations);
router.patch('/registrations/:id', updateRegistrationStatus);
router.delete('/registrations/:id', deleteRegistration);

export default router;
