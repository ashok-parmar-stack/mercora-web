import { NextRequest, NextResponse } from 'next/server';
import { uploadFileToBucket, getStorageConfig } from '@/lib/storage';
import { getServerMe } from '@/lib/server-auth';

export const dynamic = 'force-dynamic';

/**
 * GET /api/upload
 * Returns sanitized storage status for authenticated users only.
 */
export async function GET() {
  try {
    const authCheck = await getServerMe();
    if (!authCheck.data?.user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required.' },
        { status: 401 },
      );
    }

    const config = getStorageConfig();
    return NextResponse.json({
      success: true,
      data: {
        driver: config.driver,
        isCloudConfigured: config.isCloudConfigured,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to inspect storage config' },
      { status: 500 },
    );
  }
}

/**
 * POST /api/upload
 * Handles authenticated multipart/form-data image upload to configured bucket store.
 */
export async function POST(req: NextRequest) {
  try {
    const authCheck = await getServerMe();
    if (!authCheck.data?.user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required to upload files.' },
        { status: 401 },
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'avatars';

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file uploaded. Please attach a file under the "file" field.' },
        { status: 400 },
      );
    }

    // Convert Web File stream to Node Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await uploadFileToBucket(
      buffer,
      file.name,
      file.type,
      folder,
    );

    return NextResponse.json({
      success: true,
      message: 'Image uploaded successfully',
      data: result,
    });
  } catch (error: any) {
    console.error('[API /api/upload] Upload failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'An error occurred during file upload.',
      },
      { status: 400 },
    );
  }
}
