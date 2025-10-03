import { Router } from 'express';
import { TrackViewController } from '../controllers/TrackViewController';
import { publicRoute } from '../middleware/auth';

const router = Router();
const trackViewController = new TrackViewController();

// Public routes
router.post('/', publicRoute, trackViewController.trackView);
router.get('/', publicRoute, trackViewController.getCurrentYearStats);
router.get('/month', publicRoute, trackViewController.getCurrentMonthTotalViews);

export { router as trackViewRoutes };