import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { optimizeImage } from './image-optimizer';

export interface StorageConfig {
  driver: 's3' | 'local';
  bucketName: string;
  region: string;
  endpoint: string;
  accessKeyId: string;
  secretAccessKey: string;
  forcePathStyle: boolean;
  publicUrlPrefix: string;
  isCloudConfigured: boolean;
}

export interface UploadResult {
  success: boolean;
  url: string;
  bucket: string;
  key: string;
  driver: 's3' | 'local';
  size: number;
  originalSize?: number;
  savedPercentage?: number;
  width?: number;
  height?: number;
  format?: string;
  mimeType: string;
  fallbackReason?: string;
}

export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
];

const EXTENSION_BY_MIME: Record<string, string[]> = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
  'image/gif': ['.gif'],
};

const SAFE_FOLDER_REGEX = /^[a-zA-Z0-9_-]{1,40}(?:\/[a-zA-Z0-9_-]{1,40})?$/;

function sanitizeUploadFolder(folder: string): string {
  const cleaned = folder.trim().replace(/^\/+|\/+$/g, '');
  if (!cleaned || cleaned.includes('..') || !SAFE_FOLDER_REGEX.test(cleaned)) {
    throw new Error('Invalid upload folder path.');
  }
  return cleaned;
}

function hasValidImageMagicBytes(buffer: Buffer, mimeType: string): boolean {
  if (!buffer || buffer.length < 4) return false;
  switch (mimeType) {
    case 'image/jpeg':
      return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
    case 'image/png':
      return (
        buffer[0] === 0x89 &&
        buffer[1] === 0x50 &&
        buffer[2] === 0x4e &&
        buffer[3] === 0x47
      );
    case 'image/gif':
      return (
        buffer[0] === 0x47 &&
        buffer[1] === 0x49 &&
        buffer[2] === 0x46 &&
        buffer[3] === 0x38
      );
    case 'image/webp':
      return (
        buffer.length >= 12 &&
        buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
        buffer.subarray(8, 12).toString('ascii') === 'WEBP'
      );
    default:
      return false;
  }
}

export const MAX_IMAGE_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

/**
 * Retrieves storage configuration from environment variables.
 */
export function getStorageConfig(): StorageConfig {
  const driver = (process.env.STORAGE_DRIVER?.toLowerCase() === 'local' ? 'local' : 's3') as 's3' | 'local';
  const bucketName = process.env.STORAGE_BUCKET_NAME || process.env.STORAGE_BUCKET || 'assets';
  const region = process.env.AWS_REGION || 'us-east-1';
  const endpoint = process.env.AWS_ENDPOINT_URL_S3 || process.env.STORAGE_ENDPOINT || process.env.AWS_ENDPOINT || '';
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID || process.env.STORAGE_ACCESS_KEY_ID || '';
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || process.env.STORAGE_SECRET_ACCESS_KEY || '';
  const forcePathStyle = process.env.STORAGE_FORCE_PATH_STYLE !== 'false';
  const publicUrlPrefix = process.env.NEXT_PUBLIC_STORAGE_URL || '/uploads';

  const isCloudConfigured = Boolean(
    driver === 's3' && (accessKeyId || endpoint || process.env.AWS_ACCESS_KEY_ID)
  );

  return {
    driver,
    bucketName,
    region,
    endpoint,
    accessKeyId,
    secretAccessKey,
    forcePathStyle,
    publicUrlPrefix,
    isCloudConfigured,
  };
}

let s3ClientInstance: S3Client | null = null;

export function getS3Client(): S3Client {
  if (!s3ClientInstance) {
    const config = getStorageConfig();
    s3ClientInstance = new S3Client({
      region: config.region,
      forcePathStyle: config.forcePathStyle,
      ...(config.endpoint ? { endpoint: config.endpoint } : {}),
      ...(config.accessKeyId && config.secretAccessKey
        ? {
            credentials: {
              accessKeyId: config.accessKeyId,
              secretAccessKey: config.secretAccessKey,
            },
          }
        : {}),
    });
  }
  return s3ClientInstance;
}

/**
 * Uploads directly to S3-compatible bucket (Neon Object Storage / AWS S3)
 * using the official @aws-sdk/client-s3 and returns the presigned view URL.
 */
export async function uploadToS3Bucket(
  buffer: Buffer,
  key: string,
  mimeType: string,
  config: StorageConfig
): Promise<UploadResult> {
  const s3 = getS3Client();
  const bucket = config.bucketName;

  // 1. Send PutObjectCommand to upload the image buffer with CDN immutable cache control
  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: mimeType,
      CacheControl: 'public, max-age=31536000, immutable',
    })
  );

  // 2. Generate view URL using GetObjectCommand & getSignedUrl (7 days expiry)
  let viewUrl: string;
  try {
    viewUrl = await getSignedUrl(
      s3,
      new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      }),
      { expiresIn: 3600 * 24 * 7 }
    );
  } catch {
    // Direct public URL fallback if presigning is bypassed
    viewUrl = config.endpoint
      ? `${config.endpoint.replace(/\/$/, '')}/${bucket}/${key}`
      : `https://${bucket}.s3.${config.region}.amazonaws.com/${key}`;
  }

  return {
    success: true,
    url: viewUrl,
    bucket,
    key,
    driver: 's3',
    size: buffer.length,
    mimeType,
  };
}

/**
 * Local fallback when cloud credentials are not active
 */
async function uploadToLocalDisk(
  buffer: Buffer,
  fileName: string,
  mimeType: string,
  folder: string,
  bucketName: string,
  fallbackReason?: string
): Promise<UploadResult> {
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads', folder);
  await fs.promises.mkdir(uploadsDir, { recursive: true });

  const filePath = path.join(uploadsDir, fileName);
  await fs.promises.writeFile(filePath, buffer);

  const publicUrl = `/uploads/${folder}/${fileName}`;

  return {
    success: true,
    url: publicUrl,
    bucket: fallbackReason ? `${bucketName} (fallback-local)` : `${bucketName} (local-store)`,
    key: `${folder}/${fileName}`,
    driver: 'local',
    size: buffer.length,
    mimeType,
    fallbackReason,
  };
}

/**
 * Main file upload function directing image uploads into the Neon/S3 bucket.
 */
export async function uploadFileToBucket(
  fileBuffer: Buffer,
  originalFileName: string,
  mimeType: string,
  folder = 'uploads'
): Promise<UploadResult> {
  const config = getStorageConfig();
  const safeFolder = sanitizeUploadFolder(folder);
  const normalizedMime = (mimeType || '').toLowerCase();

  // Validate MIME type (SVG blocked to prevent stored XSS)
  if (!ALLOWED_IMAGE_TYPES.includes(normalizedMime)) {
    throw new Error(`Invalid file type '${mimeType}'. Allowed: JPG, PNG, WEBP, GIF.`);
  }

  // Validate Extension matches declared MIME type
  const cleanExt = path.extname(originalFileName || '').toLowerCase();
  const allowedExts = EXTENSION_BY_MIME[normalizedMime] || [];
  if (!allowedExts.includes(cleanExt)) {
    throw new Error(`File extension '${cleanExt || 'none'}' does not match MIME type '${normalizedMime}'.`);
  }

  // Validate File Size (10 MB limit)
  if (fileBuffer.length > MAX_IMAGE_FILE_SIZE) {
    throw new Error(`File size exceeds 10 MB limit.`);
  }

  // Validate magic bytes
  if (!hasValidImageMagicBytes(fileBuffer, normalizedMime)) {
    throw new Error('Uploaded file signature does not match declared image type.');
  }

  // Optimize image buffer (WebP conversion, resizing, EXIF auto-rotation, metadata stripping)
  const opt = await optimizeImage(fileBuffer, normalizedMime, safeFolder);
  const targetBuffer = opt.buffer;
  const targetMime = opt.mimeType;
  const targetExt = opt.extension;

  // Generate safe unique filename using optimized extension (e.g. .webp)
  const safeBase = path.basename(originalFileName, cleanExt).replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 24) || 'upload';
  const uniqueId = crypto.randomBytes(6).toString('hex');
  const fileName = `${safeBase}-${Date.now()}-${uniqueId}${targetExt}`;
  const key = `${safeFolder}/${fileName}`;

  let result: UploadResult;

  // Attempt direct cloud upload to Neon S3 bucket
  if (config.driver === 's3' && config.isCloudConfigured) {
    try {
      result = await uploadToS3Bucket(targetBuffer, key, targetMime, config);
    } catch (err: any) {
      console.warn(`[Storage] Cloud bucket upload failed, falling back to local storage:`, err?.message || err);
      result = await uploadToLocalDisk(targetBuffer, fileName, targetMime, safeFolder, config.bucketName, err?.message);
    }
  } else {
    // Fallback to local storage if S3 credentials not present
    result = await uploadToLocalDisk(targetBuffer, fileName, targetMime, safeFolder, config.bucketName);
  }

  // Attach optimization metrics to response
  result.originalSize = opt.originalSize;
  result.savedPercentage = opt.savedPercentage;
  result.width = opt.width;
  result.height = opt.height;
  result.format = targetExt.replace('.', '');

  return result;
}
