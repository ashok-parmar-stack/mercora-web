import sharp from 'sharp';

export interface ImageOptimizationConfig {
  maxWidth?: number;
  maxHeight?: number;
  fit?: 'inside' | 'cover' | 'contain' | 'fill';
  quality?: number; // 1-100, default 82
  format?: 'webp' | 'jpeg' | 'png' | 'original';
}

export interface OptimizationResult {
  buffer: Buffer;
  mimeType: string;
  extension: string;
  width?: number;
  height?: number;
  originalSize: number;
  optimizedSize: number;
  savedPercentage: number;
  isOptimized: boolean;
}

const FOLDER_PROFILES: Record<string, ImageOptimizationConfig> = {
  avatars: {
    maxWidth: 512,
    maxHeight: 512,
    fit: 'cover',
    quality: 82,
    format: 'webp',
  },
  businesses: {
    maxWidth: 1600,
    maxHeight: 1200,
    fit: 'inside',
    quality: 84,
    format: 'webp',
  },
  products: {
    maxWidth: 1400,
    maxHeight: 1400,
    fit: 'inside',
    quality: 84,
    format: 'webp',
  },
  banners: {
    maxWidth: 1920,
    maxHeight: 800,
    fit: 'inside',
    quality: 85,
    format: 'webp',
  },
  default: {
    maxWidth: 1600,
    maxHeight: 1600,
    fit: 'inside',
    quality: 82,
    format: 'webp',
  },
};

/**
 * Optimizes an image buffer using sharp:
 * - Auto-orients mobile captures according to EXIF rotation tags
 * - Resizes oversized images cleanly based on target folder profile
 * - Converts raster formats to high-efficiency WebP (70-90% size reduction)
 * - Preserves vector SVGs without alteration
 * - Strips unnecessary privacy-sensitive camera EXIF metadata
 */
export async function optimizeImage(
  inputBuffer: Buffer,
  mimeType: string,
  folder = 'uploads',
  customConfig?: ImageOptimizationConfig
): Promise<OptimizationResult> {
  const originalSize = inputBuffer.length;

  // Preserve vector graphics (SVG) untouched
  if (mimeType === 'image/svg+xml') {
    return {
      buffer: inputBuffer,
      mimeType: 'image/svg+xml',
      extension: '.svg',
      originalSize,
      optimizedSize: originalSize,
      savedPercentage: 0,
      isOptimized: false,
    };
  }

  // Select profile
  const profile = customConfig || FOLDER_PROFILES[folder] || FOLDER_PROFILES.default;

  try {
    const pipeline = sharp(inputBuffer, { failOnError: false } as any);

    // Auto-orient based on EXIF orientation tag
    pipeline.rotate();

    // Resize if dimensions exceed threshold
    if (profile.maxWidth || profile.maxHeight) {
      pipeline.resize({
        width: profile.maxWidth,
        height: profile.maxHeight,
        fit: profile.fit || 'inside',
        withoutEnlargement: true,
      });
    }

    // Convert to target format (default: WebP)
    const targetFormat = profile.format || 'webp';
    if (targetFormat === 'webp') {
      pipeline.webp({
        quality: profile.quality || 82,
        effort: 4,
        smartSubsample: true,
      });
    } else if (targetFormat === 'jpeg') {
      pipeline.jpeg({
        quality: profile.quality || 80,
        mozjpeg: true,
      });
    } else if (targetFormat === 'png') {
      pipeline.png({
        compressionLevel: 8,
        palette: true,
      });
    }

    const optimizedBuffer = await pipeline.toBuffer();
    const finalMeta = await sharp(optimizedBuffer).metadata();
    const optimizedSize = optimizedBuffer.length;
    const savedPercentage =
      originalSize > 0
        ? Math.max(0, Math.round((1 - optimizedSize / originalSize) * 100))
        : 0;

    return {
      buffer: optimizedBuffer,
      mimeType:
        targetFormat === 'webp'
          ? 'image/webp'
          : targetFormat === 'jpeg'
          ? 'image/jpeg'
          : 'image/png',
      extension: `.${targetFormat}`,
      width: finalMeta.width,
      height: finalMeta.height,
      originalSize,
      optimizedSize,
      savedPercentage,
      isOptimized: true,
    };
  } catch (err) {
    console.warn('[Image Optimizer] Processing error, falling back to original buffer:', err);
    const ext =
      mimeType === 'image/png'
        ? '.png'
        : mimeType === 'image/webp'
        ? '.webp'
        : mimeType === 'image/gif'
        ? '.gif'
        : '.jpg';

    return {
      buffer: inputBuffer,
      mimeType,
      extension: ext,
      originalSize,
      optimizedSize: originalSize,
      savedPercentage: 0,
      isOptimized: false,
    };
  }
}
