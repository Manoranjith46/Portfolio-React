import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { env } from '../../config/env.js';
import { syncAllRepos } from './githubService.js';
import {
  getDocument,
  setDocument,
  queryDocuments,
} from '../../utils/firestoreService.js';
import { Collections } from '../../types/collections.js';
import { getOrCreateDraft } from '../draft/draftService.js';
import { sendSuccess } from '../../utils/response.js';
import { AppError, ErrorCodes } from '../../utils/AppError.js';

export async function syncGitHubHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const adminId = (req as any).user?.sub;
    if (!adminId) {
      throw new AppError(401, ErrorCodes.ERR_AUTH_FAILED, 'Unauthorized');
    }

    // Trigger sync synchronously to align with frontend expectation
    await syncAllRepos();

    sendSuccess(res, { jobId: 'latest' });
  } catch (err) {
    next(err);
  }
}

export async function getReposHandler(_req: Request, res: Response, next: NextFunction) {
  try {
    const repos = await queryDocuments<any>(
      Collections.GITHUB_REPOS,
      [],
      'lastUpdated',
      'desc',
    );
    sendSuccess(res, repos);
  } catch (err) {
    next(err);
  }
}

export async function updateRepoSettingsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const adminId = (req as any).user?.sub;
    if (!adminId) {
      throw new AppError(401, ErrorCodes.ERR_AUTH_FAILED, 'Unauthorized');
    }

    const repoName = req.params.repoName as string;
    const { published, hidden, pinned, featured } = req.body;

    const repo = await getDocument<any>(Collections.GITHUB_REPOS, repoName);
    if (!repo) {
      throw new AppError(404, ErrorCodes.ERR_NOT_FOUND, 'Repository not found in database');
    }

    // Update settings in GITHUB_REPOS
    const updatedRepo = {
      ...repo,
      published: published !== undefined ? published : repo.published,
      hidden: hidden !== undefined ? hidden : repo.hidden,
      pinned: pinned !== undefined ? pinned : repo.pinned,
      featured: featured !== undefined ? featured : repo.featured,
    };
    await setDocument(Collections.GITHUB_REPOS, repoName, updatedRepo);

    // Update Draft portfolio projects
    const draftContent = await getOrCreateDraft(adminId);
    if (!draftContent.projects) {
      draftContent.projects = [];
    }

    if (published === true) {
      const alreadyPublished = draftContent.projects.some(
        (p: any) => p.repoUrl === repo.repoUrl || p.title === repoName,
      );
      if (!alreadyPublished) {
        draftContent.projects.push({
          id: `proj-git-${Date.now()}`,
          title: repo.repoName,
          description: repo.description,
          image: '/assets/project1.jpg',
          link: repo.liveUrl || repo.repoUrl,
          repoUrl: repo.repoUrl,
          liveUrl: repo.liveUrl || '',
          topics: repo.topics || [],
          languages: repo.languages || [],
          stars: repo.stars || 0,
          pinned: pinned || false,
          hidden: hidden || false,
          featured: featured || false,
          displayOrder: draftContent.projects.length + 1,
        });
      }
    } else if (published === false) {
      draftContent.projects = draftContent.projects.filter(
        (p: any) => p.repoUrl !== repo.repoUrl && p.title !== repoName,
      );
    }

    // Save updated draft
    await setDocument(Collections.PORTFOLIO_DRAFTS, adminId, {
      adminId,
      content: draftContent,
      status: 'draft',
    });

    sendSuccess(res, null);
  } catch (err) {
    next(err);
  }
}

export async function githubWebhookHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const signature = req.headers['x-hub-signature-256'] as string;
    if (env.GITHUB_WEBHOOK_SECRET && signature) {
      const hmac = crypto.createHmac('sha256', env.GITHUB_WEBHOOK_SECRET);
      const payload = JSON.stringify(req.body);
      const digest = 'sha256=' + hmac.update(payload).digest('hex');
      if (signature !== digest) {
        throw new AppError(401, ErrorCodes.ERR_AUTH_FAILED, 'Invalid webhook signature');
      }
    }

    // Run sync in the background
    void syncAllRepos();

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}
