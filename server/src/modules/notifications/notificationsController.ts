import { Request, Response, NextFunction } from 'express';
import {
  queryDocuments,
  setDocument,
  getDocument,
  createBatch,
  commitBatch,
  docRef,
} from '../../utils/firestoreService.js';
import { Collections } from '../../types/collections.js';
import { sendSuccess } from '../../utils/response.js';
import { AppError, ErrorCodes } from '../../utils/AppError.js';

export async function getNotificationsHandler(_req: Request, res: Response, next: NextFunction) {
  try {
    const notifications = await queryDocuments<any>(
      Collections.NOTIFICATIONS,
      [],
      'createdAt',
      'desc',
    );

    const formatted = notifications.map((n) => ({
      id: n.id,
      type: n.type,
      message: n.message,
      read: n.read,
      createdAt: n.createdAt?.toDate?.() ? n.createdAt.toDate().toISOString() : new Date().toISOString(),
    }));

    sendSuccess(res, formatted);
  } catch (err) {
    next(err);
  }
}

export async function markReadHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    const notification = await getDocument<any>(Collections.NOTIFICATIONS, id);
    if (!notification) {
      throw new AppError(404, ErrorCodes.ERR_NOT_FOUND, 'Notification not found');
    }

    await setDocument(Collections.NOTIFICATIONS, id, {
      ...notification,
      read: true,
    }, true);

    sendSuccess(res, null);
  } catch (err) {
    next(err);
  }
}

export async function markAllReadHandler(_req: Request, res: Response, next: NextFunction) {
  try {
    const unread = await queryDocuments<any>(
      Collections.NOTIFICATIONS,
      [{ field: 'read', op: '==', value: false }],
    );

    if (unread.length > 0) {
      const batch = createBatch();
      unread.forEach((n) => {
        batch.update(docRef(Collections.NOTIFICATIONS, n.id), { read: true });
      });
      await commitBatch(batch);
    }

    sendSuccess(res, null);
  } catch (err) {
    next(err);
  }
}
