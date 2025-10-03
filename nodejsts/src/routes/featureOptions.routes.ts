import { Router } from 'express';
import { FeatureOptionController } from '../controllers/FeatureOptionController';
import { authenticateToken, authorizeRoles, publicRoute } from '../middleware/auth';
import { Role } from '../types';

const router = Router();
const featureOptionController = new FeatureOptionController();

// Public routes
router.get('/', publicRoute, featureOptionController.getAllFeatureOptionsGrouped);

// Protected routes (require authentication)
router.post('/', authenticateToken, authorizeRoles(Role.Admin, Role.Member), featureOptionController.createFeatureOption);
router.get('/findall', authenticateToken, authorizeRoles(Role.Admin, Role.Member), featureOptionController.getAllFeatureOptions);
router.get('/:id', authenticateToken, authorizeRoles(Role.Admin, Role.Member), featureOptionController.getFeatureOptionById);
router.put('/:id', authenticateToken, authorizeRoles(Role.Admin, Role.Member), featureOptionController.updateFeatureOption);
router.delete('/:id', authenticateToken, authorizeRoles(Role.Admin, Role.Member), featureOptionController.deleteFeatureOption);

export { router as featureOptionsRoutes };