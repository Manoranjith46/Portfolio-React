import { Router } from 'express';
import {
  getDraftHandler,
  patchDraftHandler,
  publishDraftHandler,
} from '../modules/draft/draftController.js';
import {
  uploadMiddleware,
  uploadMediaHandler,
  listMediaHandler,
  deleteMediaHandler,
} from '../modules/media/mediaController.js';
import { requireAdmin } from '../middleware/requireAdmin.js';

const router = Router();

router.use(requireAdmin);

router.get('/admin/draft', getDraftHandler);
router.patch('/admin/draft', patchDraftHandler);
router.post('/admin/draft/publish', publishDraftHandler);

router.post('/admin/media/upload', uploadMiddleware.single('file'), uploadMediaHandler);
router.get('/admin/media', listMediaHandler);
router.delete('/admin/media/:id', deleteMediaHandler);

import {
  resumeUploadMiddleware,
  uploadResumeHandler,
  getJobStatusHandler,
  getDiffHandler,
  approveResumeHandler,
} from '../modules/resume/resumeController.js';

router.post('/admin/resume/upload', resumeUploadMiddleware.single('resume'), uploadResumeHandler);
router.get('/admin/resume/status/:jobId', getJobStatusHandler);
router.get('/admin/resume/diff', getDiffHandler);
router.post('/admin/resume/approve', approveResumeHandler);

import {
  syncGitHubHandler,
  getReposHandler,
  updateRepoSettingsHandler,
} from '../modules/github/githubController.js';

router.post('/admin/github/sync', syncGitHubHandler);
router.get('/admin/github/repos', getReposHandler);
router.patch('/admin/github/repos/:repoName', updateRepoSettingsHandler);

import {
  getVersionsHandler,
  rollbackVersionHandler,
} from '../modules/versions/versionsController.js';
import { getAuditLogsHandler } from '../modules/audit/auditController.js';
import {
  getNotificationsHandler,
  markReadHandler,
  markAllReadHandler,
} from '../modules/notifications/notificationsController.js';

router.get('/admin/versions', getVersionsHandler);
router.post('/admin/versions/:id/rollback', rollbackVersionHandler);
router.get('/admin/audit', getAuditLogsHandler);
router.get('/admin/notifications', getNotificationsHandler);
router.patch('/admin/notifications/:id/read', markReadHandler);
router.post('/admin/notifications/read-all', markAllReadHandler);

import {
  getSettingsHandler,
  updateSettingsHandler,
  updateThemeHandler,
} from '../modules/settings/settingsController.js';
import { getAnalyticsHandler } from '../modules/analytics/analyticsController.js';
import { getHealthHandler } from '../modules/health/healthController.js';

router.get('/admin/settings', getSettingsHandler);
router.patch('/admin/settings', updateSettingsHandler);
router.patch('/admin/settings/theme', updateThemeHandler);
router.get('/admin/analytics', getAnalyticsHandler);
router.get('/admin/health', getHealthHandler);

export default router;
