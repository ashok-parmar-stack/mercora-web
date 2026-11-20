import { NextRequest, NextResponse } from 'next/server';
import { uploadFileToBucket, getStorageConfig } from '@/lib/storage';

export const dynamic = 'force-dynamic';

/**
 * GET /api/upload
 * Returns current bucket & storage status from environment configuration.
 */
export async function GET() {
  try {
    const config = getStorageConfig();
    return NextResponse.json({
      success: true,
      data: {
        driver: config.driver,
        bucketName: config.bucketName,
        region: config.region,
        isCloudConfigured: config.isCloudConfigured,
        publicUrlPrefix: config.publicUrlPrefix,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to inspect storage config' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/upload
 * Handles multipart/form-data image upload to configured bucket store.
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'avatars';

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file uploaded. Please attach a file under the "file" field.' },
        { status: 400 }
      );
    }

    // Convert Web File stream to Node Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await uploadFileToBucket(
      buffer,
      file.name,
      file.type || 'image/jpeg',
      folder
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
      { status: 400 }
    );
  }
}
