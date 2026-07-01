import { Request, Response, NextFunction } from 'express';
import { getDocument, queryDocuments, setDocument } from '../../utils/firestoreService.js';
import { Collections } from '../../types/collections.js';
import { sendSuccess } from '../../utils/response.js';
import { AppError, ErrorCodes } from '../../utils/AppError.js';
import { auditLog } from '../../utils/auditLog.js';

export async function getVersionsHandler(_req: Request, res: Response, next: NextFunction) {
  try {
    const versions = await queryDocuments<any>(
      Collections.VERSIONS,
      [],
      'number',
      'desc',
    );

    const formatted = versions.map((v) => ({
      id: v.id,
      number: v.number,
      label: v.label,
      patch: v.patch,
      createdAt: v.createdAt?.toDate?.() ? v.createdAt.toDate().toISOString() : new Date().toISOString(),
    }));

    sendSuccess(res, formatted);
  } catch (err) {
    next(err);
  }
}

export async function rollbackVersionHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const adminId = (req as any).user?.sub;
    if (!adminId) {
      throw new AppError(401, ErrorCodes.ERR_AUTH_FAILED, 'Unauthorized');
    }

    const id = req.params.id as string;
    const version = await getDocument<any>(Collections.VERSIONS, id);
    if (!version) {
      throw new AppError(404, ErrorCodes.ERR_NOT_FOUND, `Version ${id} not found`);
    }

    // Overwrite the draft with version's full snapshot content
    await setDocument(Collections.PORTFOLIO_DRAFTS, adminId, {
      adminId,
      content: version.snapshot,
      status: 'draft',
    });

    // Write audit log
    await auditLog(
      'VERSION_ROLLED_BACK',
      { versionNumber: version.number, label: version.label },
      'admin',
      adminId,
    );

    sendSuccess(res, null);
  } catch (err) {
    next(err);
  }
}
