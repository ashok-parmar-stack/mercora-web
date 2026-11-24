"use client";

import React from "react";
import { UploadCloud, RefreshCw, Loader2, AlertCircle, HardDrive, Zap } from "lucide-react";
import { DropzoneRootProps, DropzoneInputProps } from "react-dropzone";

export interface AvatarDropzoneProps {
  label?: string;
  description?: string;
  className?: string;
  disabled?: boolean;
  isUploading: boolean;
  previewUrl: string;
  uploadMeta?: {
    size?: number;
    originalSize?: number;
    savedPercentage?: number;
    width?: number;
    height?: number;
    format?: string;
    bucket?: string;
    driver?: string;
  } | null;
  errorMessage: string | null;
  maxSizeMB: number;
  showBucketBadge?: boolean;
  storageInfo: { driver: string; bucketName: string } | null;
  getRootProps: <T extends DropzoneRootProps>(props?: T) => T;
  getInputProps: <T extends DropzoneInputProps>(props?: T) => T;
  isDragActive: boolean;
  isDragReject: boolean;
  openFileDialog: () => void;
  onRemove: (e: React.MouseEvent) => void;
}

function formatBytes(bytes?: number): string {
  if (!bytes) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function AvatarDropzone({
  label,
  description,
  className = "",
  disabled,
  isUploading,
  previewUrl,
  uploadMeta,
  errorMessage,
  maxSizeMB,
  showBucketBadge,
  storageInfo,
  getRootProps,
  getInputProps,
  isDragActive,
  isDragReject,
  openFileDialog,
  onRemove,
}: AvatarDropzoneProps) {
  const [imgError, setImgError] = React.useState(false);

  React.useEffect(() => {
    setImgError(false);
  }, [previewUrl]);
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && <label className="text-xs font-bold text-[var(--text-primary)]">{label}</label>}

      <div className="flex items-center gap-4">
        <div
          {...getRootProps()}
          className={`relative w-20 h-20 rounded-2xl cursor-pointer overflow-hidden border-2 transition-all flex items-center justify-center select-none ${
            isDragActive
              ? isDragReject
                ? "border-red-500 bg-red-500/10 scale-105"
                : "border-brand-500 bg-brand-500/10 scale-105 shadow-md ring-2 ring-brand-500/20"
              : "border-dashed border-[var(--border)] hover:border-brand-500/60 bg-[var(--surface-hover)]"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          title="Click or drag image here"
        >
          <input {...getInputProps()} />

          {previewUrl && !imgError ? (
            <img
              src={previewUrl}
              alt="Uploaded Avatar"
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-2 text-center">
              <UploadCloud className="w-6 h-6 text-[var(--text-muted)] mb-1" />
              <span className="text-[9px] font-semibold text-[var(--text-muted)]">Drop image</span>
            </div>
          )}

          <div
            className={`absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white transition-opacity duration-200 ${
              isUploading ? "opacity-100" : "opacity-0 hover:opacity-100"
            }`}
          >
            {isUploading ? (
              <Loader2 className="w-6 h-6 animate-spin text-brand-400" />
            ) : (
              <>
                <RefreshCw className="w-4 h-4 text-white mb-0.5" />
                <span className="text-[9px] font-bold">Change</span>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openFileDialog}
              disabled={disabled || isUploading}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-[var(--surface-hover)] hover:bg-[var(--border)] text-[var(--text-primary)] border border-[var(--border)] transition-colors cursor-pointer disabled:opacity-50"
            >
              {previewUrl ? "Replace Photo" : "Select Photo"}
            </button>
            {previewUrl && (
              <button
                type="button"
                onClick={onRemove}
                disabled={disabled || isUploading}
                className="px-2 py-1 text-xs font-semibold rounded-lg text-red-500 hover:text-red-400 hover:bg-red-500/10 border border-red-500/20 transition-colors cursor-pointer"
              >
                Remove
              </button>
            )}
          </div>

          <p className="text-[11px] text-[var(--text-muted)] truncate">
            {description || `Max ${maxSizeMB}MB • JPG, PNG, WEBP, SVG`}
          </p>

          {showBucketBadge && (
            <div className="flex items-center gap-1 text-[10px] font-mono text-[var(--text-muted)]">
              <HardDrive className="w-2.5 h-2.5 text-brand-500" />
              <span>
                Bucket: <strong className="text-[var(--text-primary)]">{storageInfo?.bucketName || "mercora-media-bucket"}</strong> ({storageInfo?.driver?.toUpperCase() || "ENV"})
              </span>
            </div>
          )}

          {uploadMeta?.savedPercentage && uploadMeta.savedPercentage > 0 ? (
            <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold animate-in fade-in duration-300">
              <Zap className="w-2.5 h-2.5 text-emerald-500" />
              <span>
                ⚡ Saved {uploadMeta.savedPercentage}% ({formatBytes(uploadMeta.size)}, {uploadMeta.format?.toUpperCase() || 'WEBP'})
              </span>
            </div>
          ) : null}
        </div>
      </div>

      {errorMessage && (
        <div className="flex items-center gap-1.5 text-xs text-red-500 font-medium">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
