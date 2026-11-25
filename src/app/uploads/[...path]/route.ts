import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getStorageConfig, getS3Client } from '@/lib/storage';
import { GetObjectCommand } from '@aws-sdk/client-s3';

export const dynamic = 'force-dynamic';

const MIME_TYPES: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: segments } = await params;
    if (
      !segments ||
      segments.length === 0 ||
      segments.some((seg) => !seg || seg === '.' || seg === '..' || seg.includes('..') || seg.includes('\\'))
    ) {
      return new NextResponse('Bad Request', { status: 400 });
    }

    const subPath = path.join(...segments);

    // Candidate root directories for uploaded files
    const candidateRoots = [
      path.resolve(process.cwd(), 'public', 'uploads'),
      path.resolve(process.cwd(), 'apps', 'web', 'public', 'uploads'),
    ];

    let foundPath: string | null = null;
    for (const rootDir of candidateRoots) {
      const resolved = path.resolve(rootDir, subPath);
      if (!resolved.startsWith(rootDir + path.sep)) {
        return new NextResponse('Forbidden', { status: 403 });
      }
      if (fs.existsSync(resolved) && fs.statSync(resolved).isFile()) {
        foundPath = resolved;
        break;
      }
    }

    if (foundPath) {
      const fileBuffer = await fs.promises.readFile(foundPath);
      const ext = path.extname(foundPath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';

      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'X-Content-Type-Options': 'nosniff',
          ...(ext === '.svg' ? { 'Content-Security-Policy': 'sandbox' } : {}),
          'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
        },
      });
    }

    // Fallback: Check Neon / S3 Object Storage bucket
    const config = getStorageConfig();
    if (config.isCloudConfigured) {
      try {
        const s3 = getS3Client();
        const s3Key = segments.join('/');
        const candidateKeys = [s3Key, `uploads/${s3Key}`, `avatars/${s3Key}`];

        for (const key of candidateKeys) {
          try {
            const s3Obj = await s3.send(
              new GetObjectCommand({
                Bucket: config.bucketName,
                Key: key,
              })
            );

            if (s3Obj.Body) {
              const bytes = await s3Obj.Body.transformToByteArray();
              const ext = path.extname(s3Key).toLowerCase();
              const contentType = s3Obj.ContentType || MIME_TYPES[ext] || 'application/octet-stream';

              return new NextResponse(Buffer.from(bytes), {
                status: 200,
                headers: {
                  'Content-Type': contentType,
                  'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
                },
              });
            }
          } catch {
            // Key not found in bucket, continue to next candidate
          }
        }
      } catch (s3Err) {
        console.warn('[Uploads Route S3 fallback failed]:', s3Err);
      }
    }

    return new NextResponse('Image not found', { status: 404 });
  } catch (error: any) {
    console.error('[Uploads Route Error]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
