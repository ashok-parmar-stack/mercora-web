import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

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
    if (!segments || segments.length === 0) {
      return new NextResponse('Bad Request', { status: 400 });
    }

    const subPath = path.join(...segments);

    // Candidates locations for uploaded files
    const candidatePaths = [
      path.join(process.cwd(), 'apps', 'web', 'public', 'uploads', subPath),
      path.join(process.cwd(), 'public', 'uploads', subPath),
      path.join(process.cwd(), '..', 'apps', 'web', 'public', 'uploads', subPath),
    ];

    let foundPath: string | null = null;
    for (const cand of candidatePaths) {
      if (fs.existsSync(cand) && fs.statSync(cand).isFile()) {
        foundPath = cand;
        break;
      }
    }

    if (!foundPath) {
      return new NextResponse('Image not found', { status: 404 });
    }

    const fileBuffer = await fs.promises.readFile(foundPath);
    const ext = path.extname(foundPath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
      },
    });
  } catch (error: any) {
    console.error('[Uploads Route Error]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
