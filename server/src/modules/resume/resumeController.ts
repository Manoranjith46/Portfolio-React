import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import {
  setDocument,
  getDocument,
  getAllDocuments,
} from '../../utils/firestoreService.js';
import { Collections } from '../../types/collections.js';
import { uploadToStorage } from '../../utils/storageService.js';
import { performOcr } from '../../utils/ocrService.js';
import { structureResume } from '../ai/aiService.js';
import { diffResume, DiffEntry } from './diffEngine.js';
import { getOrCreateDraft } from '../draft/draftService.js';
import { sendSuccess } from '../../utils/response.js';
import { AppError, ErrorCodes } from '../../utils/AppError.js';

// Setup multer memory storage with 10MB limit for PDFs
export const resumeUploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(new AppError(400, ErrorCodes.ERR_VALIDATION, 'Only PDF files are allowed'));
    }
    cb(null, true);
  },
});

export async function uploadResumeHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.file) {
      throw new AppError(400, ErrorCodes.ERR_VALIDATION, 'No resume PDF file uploaded');
    }

    const timestamp = Date.now();
    const storagePath = `resumes/${timestamp}.pdf`;

    // 1. Upload to storage
    const pdfUrl = await uploadToStorage(req.file.buffer, storagePath, 'application/pdf');

    // 2. Run OCR (Google Doc AI)
    const rawText = await performOcr(req.file.buffer);

    // 3. AI Structuring (Claude)
    const structured = await structureResume(rawText);

    // 4. Retrieve current published database state
    const profile = (await getDocument(Collections.PORTFOLIO_PUBLISHED, 'main')) || {};
    const skills = (await getAllDocuments(Collections.SKILLS)) || [];
    const experience = (await getAllDocuments(Collections.EXPERIENCE)) || [];
    const education = (await getAllDocuments(Collections.EDUCATION)) || [];

    // 5. Diff comparison
    const diff = diffResume(structured, { profile, skills, experience, education });

    // 6. Save diff and extracted structured JSON to a "latest" diff document
    const jobId = `job-${timestamp}`;
    await setDocument(Collections.RESUME_DIFFS, 'latest', {
      jobId,
      extracted: structured,
      diff,
      pdfUrl,
    });

    await setDocument(Collections.RESUME_JOBS, jobId, {
      id: jobId,
      status: 'ready',
      pdfUrl,
      createdAt: new Date(),
    });

    sendSuccess(res, { jobId });
  } catch (err) {
    next(err);
  }
}

export async function getDiffHandler(_req: Request, res: Response, next: NextFunction) {
  try {
    const diffDoc = await getDocument<any>(Collections.RESUME_DIFFS, 'latest');
    if (!diffDoc) {
      return sendSuccess(res, {
        added: [],
        changed: [],
        removed: [],
      });
    }
    sendSuccess(res, diffDoc.diff);
  } catch (err) {
    next(err);
  }
}

export async function getJobStatusHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { jobId } = req.params;
    const job = await getDocument<any>(Collections.RESUME_JOBS, jobId as string);
    if (!job) {
      throw new AppError(404, ErrorCodes.ERR_NOT_FOUND, 'Job not found');
    }
    sendSuccess(res, { status: job.status });
  } catch (err) {
    next(err);
  }
}

export async function approveResumeHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const adminId = (req as any).user?.sub;
    if (!adminId) {
      throw new AppError(401, ErrorCodes.ERR_AUTH_FAILED, 'Unauthorized');
    }

    const { fields } = req.body;
    if (!Array.isArray(fields)) {
      throw new AppError(400, ErrorCodes.ERR_VALIDATION, 'Fields parameter must be an array of string labels');
    }

    const diffDoc = await getDocument<any>(Collections.RESUME_DIFFS, 'latest');
    if (!diffDoc) {
      throw new AppError(404, ErrorCodes.ERR_NOT_FOUND, 'No pending resume diff found to approve');
    }

    const draftContent = await getOrCreateDraft(adminId);
    const approvedLabels = new Set(fields);

    // Merge changes
    const allChanges: DiffEntry[] = [
      ...diffDoc.diff.added,
      ...diffDoc.diff.changed,
      ...diffDoc.diff.removed,
    ];

    const removalsByCollection: Record<string, number[]> = {};

    allChanges.forEach((change) => {
      if (approvedLabels.has(change.field)) {
        const parts = change.path.split('.');

        if (change.changeType === 'added') {
          if (parts.length === 1 || (parts.length === 2 && parts[0] === 'profile')) {
            let current = draftContent;
            for (let i = 0; i < parts.length - 1; i++) {
              if (!current[parts[i]]) current[parts[i]] = {};
              current = current[parts[i]];
            }
            current[parts[parts.length - 1]] = change.newValue;
          } else {
            const collection = parts[0];
            if (!Array.isArray(draftContent[collection])) {
              draftContent[collection] = [];
            }
            draftContent[collection].push(change.newValue);
          }
        } else if (change.changeType === 'changed') {
          let current = draftContent;
          for (let i = 0; i < parts.length - 1; i++) {
            const part = parts[i];
            const key = isNaN(Number(part)) ? part : Number(part);
            if (!current[key]) current[key] = {};
            current = current[key];
          }
          const lastPart = parts[parts.length - 1];
          const lastKey = isNaN(Number(lastPart)) ? lastPart : Number(lastPart);
          current[lastKey] = change.newValue;
        } else if (change.changeType === 'removed') {
          if (parts.length === 2 && !isNaN(Number(parts[1]))) {
            const collection = parts[0];
            const idx = Number(parts[1]);
            if (!removalsByCollection[collection]) {
              removalsByCollection[collection] = [];
            }
            removalsByCollection[collection].push(idx);
          }
        }
      }
    });

    // Execute removals in descending order to avoid index shifting
    Object.entries(removalsByCollection).forEach(([collection, indices]) => {
      if (Array.isArray(draftContent[collection])) {
        indices.sort((a, b) => b - a);
        indices.forEach((idx) => {
          draftContent[collection].splice(idx, 1);
        });
      }
    });

    // Update the draft in Firestore
    await setDocument(Collections.PORTFOLIO_DRAFTS, adminId, {
      adminId,
      content: draftContent,
      status: 'draft',
    });

    // Clear the pending diff
    await setDocument(Collections.RESUME_DIFFS, 'latest', {
      ...diffDoc,
      diff: { added: [], changed: [], removed: [] },
    });

    sendSuccess(res, null);
  } catch (err) {
    next(err);
  }
}
