import { setDocument } from './firestoreService.js';
import { Collections } from '../types/collections.js';

/**
 * Appends a new immutable log entry to the audit collection.
 */
export async function auditLog(
  action: string,
  metadata: Record<string, unknown>,
  source: 'admin' | 'system' | 'github' | 'ai',
  adminId?: string,
): Promise<void> {
  const timestamp = Date.now();
  const docId = `audit-${timestamp}-${Math.random().toString(36).substring(2, 7)}`;
  await setDocument(Collections.AUDIT_LOGS, docId, {
    action,
    metadata,
    source,
    adminId: adminId || 'system',
  });
}
