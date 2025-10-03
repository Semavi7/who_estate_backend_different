import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { publicRoute } from '../middleware/auth';

const router = Router();
const authController = new AuthController();

// Public routes
router.post('/login', publicRoute, authController.login);
router.post('/forgot-password', publicRoute, authController.forgotPassword);
router.post('/reset-password', publicRoute, authController.resetPassword);
router.post('/logout', publicRoute, authController.logout);

export { router as authRoutes };