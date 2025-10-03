import { Router } from 'express';
import { ClientIntakeController } from '../controllers/ClientIntakeController';
import { authenticateToken, authorizeRoles } from '../middleware/auth';
import { Role } from '../types';

const router = Router();
const clientIntakeController = new ClientIntakeController();

// Protected routes (require authentication)
router.post('/', authenticateToken, authorizeRoles(Role.Admin, Role.Member), clientIntakeController.createClientIntake);
router.get('/', authenticateToken, authorizeRoles(Role.Admin, Role.Member), clientIntakeController.getAllClientIntakes);
router.get('/:id', authenticateToken, authorizeRoles(Role.Admin, Role.Member), clientIntakeController.getClientIntakeById);
router.patch('/:id', authenticateToken, authorizeRoles(Role.Admin, Role.Member), clientIntakeController.updateClientIntake);
router.delete('/:id', authenticateToken, authorizeRoles(Role.Admin, Role.Member), clientIntakeController.deleteClientIntake);

export { router as clientIntakeRoutes };