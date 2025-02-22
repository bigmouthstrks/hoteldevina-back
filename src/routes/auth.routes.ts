import { Router } from 'express';
import authController from '../controllers/auth.controller';

const router = Router();

router.post('/auth/login', authController.login);
router.post('/auth/register', authController.register);
router.post('/auth/reset-password', authController.resetPassword);

export default router;
