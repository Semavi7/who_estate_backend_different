import { Router } from 'express';
import multer from 'multer';
import { PropertyController } from '../controllers/PropertyController';
import { authenticateToken, authorizeRoles, publicRoute } from '../middleware/auth';
import { Role } from '../types';
import { categoryStructure } from '../config/category-structure.config';

const router = Router();
const propertyController = new PropertyController();

// Configure multer for multiple file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB per file
    files: 20 // Maximum 20 files
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
router.get('/', publicRoute, propertyController.getAllProperties);
router.get('/count', publicRoute, propertyController.getPropertyCount);
router.get('/yearlistings', publicRoute, propertyController.getCurrentYearListingStats);
router.get('/query', publicRoute, propertyController.queryProperties);
router.get('/categories', publicRoute, (req, res) => {
  const response = {
    success: true,
    data: categoryStructure,
    message: 'Category structure retrieved successfully'
  };
  res.status(200).json(response);
});
router.get('/near', publicRoute, propertyController.findNearProperties);
router.get('/adress', publicRoute, propertyController.getCities);
router.get('/lastsix', publicRoute, propertyController.getLastSixProperties);
router.get('/piechart', publicRoute, propertyController.getSubtypeAndTypePercentages);
router.get('/adress/:id', publicRoute, propertyController.getDistrictsAndNeighbourhoods);
router.get('/:id', publicRoute, propertyController.getPropertyById);

// Protected routes (require authentication)
router.post(
  '/',
  authenticateToken,
  authorizeRoles(Role.Admin, Role.Member),
  upload.array('images', 20),
  propertyController.createProperty
);

router.put(
  '/:id',
  authenticateToken,
  authorizeRoles(Role.Admin, Role.Member),
  upload.array('newImages', 20),
  propertyController.updateProperty
);

router.delete(
  '/:id',
  authenticateToken,
  authorizeRoles(Role.Admin, Role.Member),
  propertyController.deleteProperty
);

router.patch(
  '/:id',
  authenticateToken,
  authorizeRoles(Role.Admin),
  propertyController.updatePropertyUserId
);

export { router as propertiesRoutes };