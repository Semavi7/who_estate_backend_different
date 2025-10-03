import { Router } from 'express';
import multer from 'multer';
import { UserController } from '../controllers/UserController';
import { authenticateToken, authorizeRoles, publicRoute } from '../middleware/auth';
import { Role } from '../types';

const router = Router();
const userController = new UserController();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

// Public routes
router.get('/', publicRoute, userController.getAllUsers);

// Protected routes (require authentication)
router.post('/', authenticateToken, authorizeRoles(Role.Admin, Role.Member), userController.createUser);
router.get('/:id', authenticateToken, authorizeRoles(Role.Admin, Role.Member), userController.getUserById);
router.put('/:id', authenticateToken, authorizeRoles(Role.Admin, Role.Member), userController.updateUser);
router.delete('/:id', authenticateToken, authorizeRoles(Role.Admin, Role.Member), userController.deleteUser);

// File upload routes
router.patch(
  '/:id/upload-image',
  authenticateToken,
  authorizeRoles(Role.Admin, Role.Member),
  upload.single('image'),
  userController.uploadUserImage
);

// Password update route
router.patch(
  '/:id/password',
  authenticateToken,
  authorizeRoles(Role.Admin, Role.Member),
  userController.updatePassword
);

export { router as userRoutes };