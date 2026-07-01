import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import {
  setDocument,
  queryDocuments,
  getDocument,
  deleteDocument,
} from '../../utils/firestoreService.js';
import { Collections } from '../../types/collections.js';
import { uploadToStorage, deleteFromStorage } from '../../utils/storageService.js';
import { isImage, processImage } from '../../utils/imageProcessor.js';
import { sendSuccess } from '../../utils/response.js';
import { AppError, ErrorCodes } from '../../utils/AppError.js';

// Setup multer memory storage with 10MB limit
export const uploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

export async function uploadMediaHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.file) {
      throw new AppError(400, ErrorCodes.ERR_VALIDATION, 'No file uploaded');
    }

    const folder = req.body.folder || 'media-library';
    const originalName = req.file.originalname;
    const sanitizedName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const timestamp = Date.now();
    const extension = isImage(req.file.mimetype) ? '.webp' : sanitizedName.slice(sanitizedName.lastIndexOf('.'));

    const baseName = sanitizedName.substring(0, sanitizedName.lastIndexOf('.'));
    const uniqueBase = `portfolio-os/${folder}/${timestamp}-${baseName}`;
    const mainPath = `${uniqueBase}${extension}`;

    let mainUrl = '';
    let thumbnailUrl: string | undefined = undefined;
    let size = req.file.size;
    let mimeType = req.file.mimetype;

    if (isImage(req.file.mimetype)) {
      const processed = await processImage(req.file.buffer);
      mimeType = 'image/webp';
      size = processed.main.length;

      mainUrl = await uploadToStorage(processed.main, mainPath, 'image/webp');
      const thumbPath = `${uniqueBase}-thumb.webp`;
      thumbnailUrl = await uploadToStorage(processed.thumbnail, thumbPath, 'image/webp');
    } else {
      mainUrl = await uploadToStorage(req.file.buffer, mainPath, req.file.mimetype);
    }

    const docId = `media-${timestamp}`;
    const mediaItem = {
      url: mainUrl,
      thumbnailUrl,
      folder,
      filename: `${timestamp}-${baseName}${extension}`,
      mimeType,
      size,
      storagePath: mainPath,
      thumbnailStoragePath: thumbnailUrl ? `${uniqueBase}-thumb.webp` : undefined,
    };

    await setDocument(Collections.MEDIA, docId, mediaItem);

    // Return media item formatted with creation date
    sendSuccess(res, {
      id: docId,
      ...mediaItem,
      createdAt: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
}

export async function listMediaHandler(_req: Request, res: Response, next: NextFunction) {
  try {
    const items = await queryDocuments<any>(
      Collections.MEDIA,
      [],
      'createdAt',
      'desc',
    );

    const formatted = items.map((item) => ({
      id: item.id,
      url: item.url,
      thumbnailUrl: item.thumbnailUrl,
      folder: item.folder,
      filename: item.filename,
      mimeType: item.mimeType,
      size: item.size,
      createdAt: item.createdAt?.toDate?.() ? item.createdAt.toDate().toISOString() : new Date().toISOString(),
    }));

    sendSuccess(res, formatted);
  } catch (err) {
    next(err);
  }
}

export async function deleteMediaHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    const mediaItem = await getDocument<any>(Collections.MEDIA, id);
    if (!mediaItem) {
      throw new AppError(404, ErrorCodes.ERR_NOT_FOUND, 'Media item not found');
    }

    if (mediaItem.storagePath) {
      await deleteFromStorage(mediaItem.storagePath);
    }
    if (mediaItem.thumbnailStoragePath) {
      await deleteFromStorage(mediaItem.thumbnailStoragePath);
    }

    await deleteDocument(Collections.MEDIA, id);

    sendSuccess(res, null);
  } catch (err) {
    next(err);
  }
}
