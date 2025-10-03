import { Router } from 'express';
import { MessageController } from '../controllers/MessageController';
import { authenticateToken, authorizeRoles, publicRoute } from '../middleware/auth';
import { Role } from '../types';

const router = Router();
const messageController = new MessageController();

// Public routes
router.post('/', publicRoute, messageController.createMessage);

// Protected routes (require authentication)
router.get('/', authenticateToken, authorizeRoles(Role.Admin, Role.Member), messageController.getAllMessages);
router.get('/:id', authenticateToken, authorizeRoles(Role.Admin, Role.Member), messageController.getMessageById);
router.delete('/:id', authenticateToken, authorizeRoles(Role.Admin), messageController.deleteMessage);
router.patch('/:id', authenticateToken, authorizeRoles(Role.Admin, Role.Member), messageController.markAsRead);

export { router as messagesRoutes };