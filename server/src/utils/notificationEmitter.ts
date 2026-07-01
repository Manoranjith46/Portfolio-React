import { setDocument } from './firestoreService.js';
import { Collections } from '../types/collections.js';

/**
 * Creates and stores an unread notification alert for the admin dashboard.
 */
export async function createNotification(
  type: 'resume_download' | 'contact_submit' | 'github_click' | 'github_sync' | 'resume_ready' | 'system',
  message: string,
  adminId?: string,
): Promise<void> {
  const timestamp = Date.now();
  const docId = `notify-${timestamp}-${Math.random().toString(36).substring(2, 7)}`;
  await setDocument(Collections.NOTIFICATIONS, docId, {
    type,
    message,
    read: false,
    adminId: adminId || 'admin',
  });
}
