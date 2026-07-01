import { Router } from 'express';
import {
  getProfileHandler,
  getSkillsHandler,
  getExperienceHandler,
  getEducationHandler,
  getProjectsHandler,
} from '../modules/portfolio/portfolioController.js';
import { publicRateLimiter } from '../middleware/rateLimit.js';
import { optionalAdmin } from '../middleware/optionalAdmin.js';

const router = Router();

router.use(publicRateLimiter);
router.use(optionalAdmin);

router.get('/profile', getProfileHandler);
router.get('/skills', getSkillsHandler);
router.get('/experience', getExperienceHandler);
router.get('/education', getEducationHandler);
router.get('/projects', getProjectsHandler);

import {
  trackPageviewHandler,
  trackEventHandler,
} from '../modules/analytics/analyticsController.js';

router.post('/analytics/pageview', trackPageviewHandler);
router.post('/analytics/event', trackEventHandler);

export default router;
