import sharp from 'sharp';

export interface ProcessedImages {
  main: Buffer;
  thumbnail: Buffer;
}

export function isImage(mimeType: string): boolean {
  return mimeType.startsWith('image/');
}

/**
 * Resizes and converts an image buffer to WebP formats for main image and thumbnail.
 */
export async function processImage(buffer: Buffer): Promise<ProcessedImages> {
  // Resize to max 1600px bounding box and convert to WebP
  const main = await sharp(buffer)
    .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();

  // Crop to 200x200 square and convert to WebP for thumbnail
  const thumbnail = await sharp(buffer)
    .resize({ width: 200, height: 200, fit: 'cover' })
    .webp({ quality: 75 })
    .toBuffer();

  return { main, thumbnail };
}
