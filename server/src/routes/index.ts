import { Router } from 'express';
import healthRoutes from './health.routes.js';
import authRoutes from './auth.routes.js';
import publicRoutes from './public.routes.js';
import adminRoutes from './admin.routes.js';
import webhookRoutes from './webhook.routes.js';

const router = Router();

router.use(healthRoutes);
router.use(authRoutes);
router.use(publicRoutes);
router.use(adminRoutes);
router.use(webhookRoutes);

export default router;
