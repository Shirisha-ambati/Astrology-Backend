import { Router } from 'express';
import {
  adminLogin,
  adminVerify,
  getSession,
  logout,
  userLogin,
  userRegister,
} from '../controllers/authController.js';

const router = Router();

// Admin auth
router.post('/admin/login', adminLogin);
router.post('/admin/verify', adminVerify);

// Session
router.get('/session', getSession);
router.post('/logout', logout);

// User auth
router.post('/user/login', userLogin);
router.post('/user/register', userRegister);

export default router;
