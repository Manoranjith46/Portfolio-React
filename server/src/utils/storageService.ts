import { getBucket } from '../config/firebase.js';

/**
 * Upload buffer to Firebase GCS storage and return the public URL.
 */
export async function uploadToStorage(
  buffer: Buffer,
  destPath: string,
  contentType: string,
): Promise<string> {
  const bucket = getBucket();
  const file = bucket.file(destPath);
  await file.save(buffer, {
    metadata: { contentType },
  });
  try {
    await file.makePublic();
  } catch (err) {
    console.warn('[Storage] makePublic failed. Public access depends on bucket permissions:', err);
  }
  return `https://storage.googleapis.com/${bucket.name}/${destPath}`;
}

/**
 * Delete file from Firebase GCS storage.
 */
export async function deleteFromStorage(destPath: string): Promise<void> {
  const bucket = getBucket();
  const file = bucket.file(destPath);
  await file.delete({ ignoreNotFound: true });
}
