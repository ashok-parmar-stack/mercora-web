import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

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
  mimeType: string;
  fallbackReason?: string;
}

export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
];

export const MAX_IMAGE_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

/**
 * Retrieves the current bucket and storage configuration from environment variables.
 */
export function getStorageConfig(): StorageConfig {
  const driver = (process.env.STORAGE_DRIVER?.toLowerCase() === 's3' ? 's3' : 'local') as 's3' | 'local';
  const bucketName = process.env.STORAGE_BUCKET_NAME || process.env.STORAGE_BUCKET || 'assets';
  const region = process.env.AWS_REGION || process.env.STORAGE_REGION || 'us-east-2';
  const endpoint = process.env.AWS_ENDPOINT_URL_S3 || process.env.STORAGE_ENDPOINT || process.env.AWS_ENDPOINT || '';
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID || process.env.STORAGE_ACCESS_KEY_ID || '';
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || process.env.STORAGE_SECRET_ACCESS_KEY || '';
  const forcePathStyle = process.env.STORAGE_FORCE_PATH_STYLE !== 'false';
  const publicUrlPrefix = process.env.NEXT_PUBLIC_STORAGE_URL || '/uploads';

  const isCloudConfigured = Boolean(driver === 's3' && accessKeyId && secretAccessKey && bucketName);

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

/**
 * Generates an AWS Signature Version 4 Authorization header for an S3 PUT request.
 */
function createS3V4AuthHeader(params: {
  method: string;
  host: string;
  canonicalUri: string;
  payloadHash: string;
  amzDate: string;
  dateStamp: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
}) {
  const { method, host, canonicalUri, payloadHash, amzDate, dateStamp, region, accessKeyId, secretAccessKey } = params;
  const service = 's3';

  // Canonical headers (must be sorted alphabetically by lower-case key)
  const canonicalHeaders = `host:${host}\nx-amz-content-sha256:${payloadHash}\nx-amz-date:${amzDate}\n`;
  const signedHeaders = 'host;x-amz-content-sha256;x-amz-date';

  const canonicalRequest = [
    method,
    canonicalUri,
    '', // query string
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join('\n');

  const algorithm = 'AWS4-HMAC-SHA256';
  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
  const canonicalRequestHash = crypto.createHash('sha256').update(canonicalRequest, 'utf8').digest('hex');

  const stringToSign = [
    algorithm,
    amzDate,
    credentialScope,
    canonicalRequestHash,
  ].join('\n');

  // Key derivation
  const kDate = crypto.createHmac('sha256', `AWS4${secretAccessKey}`).update(dateStamp).digest();
  const kRegion = crypto.createHmac('sha256', kDate).update(region).digest();
  const kService = crypto.createHmac('sha256', kRegion).update(service).digest();
  const kSigning = crypto.createHmac('sha256', kService).update('aws4_request').digest();

  const signature = crypto.createHmac('sha256', kSigning).update(stringToSign, 'utf8').digest('hex');

  return `${algorithm} Credential=${accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;
}

/**
 * Uploads a file buffer directly to an S3-compatible bucket via standard REST PUT.
 */
async function uploadToS3Bucket(
  buffer: Buffer,
  key: string,
  mimeType: string,
  config: StorageConfig
): Promise<UploadResult> {
  const { bucketName, region, endpoint, accessKeyId, secretAccessKey, forcePathStyle } = config;

  let host: string;
  let canonicalUri: string;
  let uploadUrl: string;
  let publicUrl: string;

  if (endpoint) {
    const parsedEndpoint = new URL(endpoint);
    host = parsedEndpoint.host;
    canonicalUri = `/${bucketName}/${key}`;
    uploadUrl = `${endpoint.replace(/\/$/, '')}/${bucketName}/${key}`;
    publicUrl = uploadUrl;
  } else if (forcePathStyle) {
    host = `s3.${region}.amazonaws.com`;
    canonicalUri = `/${bucketName}/${key}`;
    uploadUrl = `https://${host}/${bucketName}/${key}`;
    publicUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;
  } else {
    // Virtual hosted style: bucket.s3.region.amazonaws.com
    host = `${bucketName}.s3.${region}.amazonaws.com`;
    canonicalUri = `/${key}`;
    uploadUrl = `https://${host}/${key}`;
    publicUrl = uploadUrl;
  }

  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
  const dateStamp = amzDate.substring(0, 8);
  const payloadHash = crypto.createHash('sha256').update(buffer).digest('hex');

  const authHeader = createS3V4AuthHeader({
    method: 'PUT',
    host,
    canonicalUri,
    payloadHash,
    amzDate,
    dateStamp,
    region,
    accessKeyId,
    secretAccessKey,
  });

  const response = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      Host: host,
      'Content-Type': mimeType,
      'x-amz-content-sha256': payloadHash,
      'x-amz-date': amzDate,
      Authorization: authHeader,
    },
    body: buffer as unknown as BodyInit,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`S3 Bucket upload rejected with HTTP ${response.status}: ${errorText.slice(0, 300)}`);
  }

  return {
    success: true,
    url: publicUrl,
    bucket: bucketName,
    key,
    driver: 's3',
    size: buffer.length,
    mimeType,
  };
}

/**
 * Stores a file buffer to local public uploads directory.
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
 * Main file upload function honoring the bucket store configured in .env.
 */
export async function uploadFileToBucket(
  fileBuffer: Buffer,
  originalFileName: string,
  mimeType: string,
  folder = 'avatars'
): Promise<UploadResult> {
  const config = getStorageConfig();

  // Validate MIME type
  if (!ALLOWED_IMAGE_TYPES.includes(mimeType)) {
    throw new Error(`Invalid file type '${mimeType}'. Allowed: JPG, PNG, WEBP, GIF, SVG.`);
  }

  // Validate File Size
  if (fileBuffer.length > MAX_IMAGE_FILE_SIZE) {
    throw new Error(`File size (${(fileBuffer.length / (1024 * 1024)).toFixed(2)} MB) exceeds 5 MB limit.`);
  }

  // Generate safe unique filename
  const cleanExt = path.extname(originalFileName).toLowerCase() || (mimeType === 'image/png' ? '.png' : '.jpg');
  const safeBase = path.basename(originalFileName, cleanExt).replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 20);
  const uniqueId = crypto.randomBytes(6).toString('hex');
  const fileName = `${safeBase}-${Date.now()}-${uniqueId}${cleanExt}`;
  const key = `${folder}/${fileName}`;

  // If S3 driver requested and credentials provided, attempt cloud upload
  if (config.driver === 's3' && config.isCloudConfigured) {
    try {
      return await uploadToS3Bucket(fileBuffer, key, mimeType, config);
    } catch (err: any) {
      console.warn(`[Storage] Cloud bucket upload failed, gracefully falling back to local disk:`, err?.message || err);
      return await uploadToLocalDisk(fileBuffer, fileName, mimeType, folder, config.bucketName, err?.message);
    }
  }

  // Otherwise, use local disk storage
  return await uploadToLocalDisk(fileBuffer, fileName, mimeType, folder, config.bucketName);
}
