import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { getOrCreateDraft, updateDraft, publishDraft } from './draftService.js';
import { sendSuccess } from '../../utils/response.js';
import { AppError } from '../../utils/AppError.js';
import { ErrorCodes } from '../../utils/AppError.js';

const patchDraftSchema = z.object({
  changes: z.record(z.any()),
});

export async function getDraftHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const adminId = (req as any).user?.sub;
    if (!adminId) {
      throw new AppError(401, ErrorCodes.ERR_AUTH_FAILED, 'Unauthorized');
    }
    const draftContent = await getOrCreateDraft(adminId);
    sendSuccess(res, { content: draftContent, status: 'draft' });
  } catch (err) {
    next(err);
  }
}

export async function patchDraftHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const adminId = (req as any).user?.sub;
    if (!adminId) {
      throw new AppError(401, ErrorCodes.ERR_AUTH_FAILED, 'Unauthorized');
    }

    const parsed = patchDraftSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(400, ErrorCodes.ERR_VALIDATION, 'Invalid changes payload', parsed.error.flatten().fieldErrors);
    }

    const updatedContent = await updateDraft(adminId, parsed.data.changes);
    sendSuccess(res, { content: updatedContent, status: 'draft' });
  } catch (err) {
    next(err);
  }
}

export async function publishDraftHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const adminId = (req as any).user?.sub;
    if (!adminId) {
      throw new AppError(401, ErrorCodes.ERR_AUTH_FAILED, 'Unauthorized');
    }

    await publishDraft(adminId);
    sendSuccess(res, null);
  } catch (err) {
    next(err);
  }
}
