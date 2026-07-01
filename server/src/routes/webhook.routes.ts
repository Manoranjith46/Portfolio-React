import { Router } from 'express';
import { githubWebhookHandler } from '../modules/github/githubController.js';

const router = Router();

router.post('/github/webhook', githubWebhookHandler);

export default router;
