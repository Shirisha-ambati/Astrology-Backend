import { Router } from 'express';
import { requireUser } from '../middleware/requireUser.js';
import { getMe, updateMe } from '../controllers/userController.js';

const router = Router();

router.use(requireUser);

router.get('/me', getMe);
router.put('/me', updateMe);

export default router;
