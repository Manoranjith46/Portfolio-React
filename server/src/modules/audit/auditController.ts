import { Request, Response, NextFunction } from 'express';
import { queryDocuments } from '../../utils/firestoreService.js';
import { Collections } from '../../types/collections.js';
import { sendSuccess } from '../../utils/response.js';

export async function getAuditLogsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const limitParam = req.query.limit ? parseInt(req.query.limit as string, 10) : 200;
    const logs = await queryDocuments<any>(
      Collections.AUDIT_LOGS,
      [],
      'createdAt',
      'desc',
      limitParam,
    );

    const formatted = logs.map((log) => ({
      id: log.id,
      adminId: log.adminId,
      action: log.action,
      metadata: log.metadata || {},
      source: log.source,
      timestamp: log.createdAt?.toDate?.() ? log.createdAt.toDate().toISOString() : new Date().toISOString(),
    }));

    sendSuccess(res, formatted);
  } catch (err) {
    next(err);
  }
}
