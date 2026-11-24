"use client";

import React from "react";
import { UploadCloud, RefreshCw, Trash2, Loader2, AlertCircle, HardDrive, Zap } from "lucide-react";
import { DropzoneRootProps, DropzoneInputProps } from "react-dropzone";

export interface StandardDropzoneProps {
  label?: string;
  description?: string;
  variant?: "standard" | "compact-avatar" | "banner";
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

export function StandardDropzone({
  label,
  description,
  variant = "standard",
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
}: StandardDropzoneProps) {
  const [hasImgError, setHasImgError] = React.useState(false);

  React.useEffect(() => {
    setHasImgError(false);
  }, [previewUrl]);
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {(label || description) && (
        <div className="flex flex-col gap-0.5">
          {label && (
            <label className="text-xs font-bold text-[var(--text-primary)] tracking-tight font-jakarta">
              {label}
            </label>
          )}
          {description && (
            <p className="text-[11px] text-[var(--text-muted)] font-work">{description}</p>
          )}
        </div>
      )}

      <div
        {...getRootProps()}
        className={`relative group rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer overflow-hidden p-6 flex flex-col items-center justify-center text-center select-none ${
          isDragActive
            ? isDragReject
              ? "border-red-500 bg-red-500/10 shadow-lg scale-[1.01]"
              : "border-brand-500 bg-brand-500/10 shadow-lg scale-[1.01] ring-2 ring-brand-500/20"
            : "border-[var(--border)] hover:border-brand-500/50 bg-[var(--surface-hover)]/40 hover:bg-[var(--surface-hover)]"
        } ${variant === "banner" ? "min-h-[180px]" : "min-h-[140px]"} ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <input {...getInputProps()} />

        {previewUrl ? (
          <div className="relative w-full flex flex-col items-center justify-center gap-3">
            <div className="relative max-h-48 max-w-full rounded-xl overflow-hidden border border-[var(--border)] shadow-xs bg-black/10 flex items-center justify-center">
              {!hasImgError ? (
                <img
                  src={previewUrl}
                  alt="Uploaded media preview"
                  className="max-h-48 w-auto object-contain rounded-xl"
                  onError={() => setHasImgError(true)}
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-6 text-center">
                  <HardDrive className="w-8 h-8 text-brand-500 mb-2" />
                  <p className="text-xs font-semibold text-[var(--text-primary)]">Image in Bucket</p>
                  <p className="text-[11px] text-[var(--text-muted)] mt-0.5">Stored successfully in storage</p>
                </div>
              )}
            </div>

            {uploadMeta?.savedPercentage && uploadMeta.savedPercentage > 0 ? (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold font-mono animate-in fade-in duration-300">
                <Zap className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                <span>
                  ⚡ Optimized: {formatBytes(uploadMeta.originalSize)} → {formatBytes(uploadMeta.size)} ({uploadMeta.savedPercentage}% saved, {uploadMeta.format?.toUpperCase() || 'WEBP'})
                  {uploadMeta.width && uploadMeta.height ? ` • ${uploadMeta.width}×${uploadMeta.height}px` : ''}
                </span>
              </div>
            ) : null}

            <div className="flex items-center gap-2 z-10" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={openFileDialog}
                disabled={isUploading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)] hover:bg-[var(--surface-hover)] shadow-xs transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-brand-500" />
                <span>Replace Image</span>
              </button>

              <button
                type="button"
                onClick={onRemove}
                disabled={isUploading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-red-500 hover:text-red-400 bg-[var(--surface)] hover:bg-red-500/10 border border-red-500/20 shadow-xs transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2.5">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-200 group-hover:scale-105 shadow-2xs ${
                isDragActive
                  ? isDragReject
                    ? "bg-red-500 text-white animate-bounce"
                    : "bg-brand-500 text-white animate-bounce"
                  : "bg-brand-500/10 text-brand-500 border border-brand-500/20"
              }`}
            >
              {isUploading ? (
                <Loader2 className="w-6 h-6 animate-spin text-brand-500" />
              ) : (
                <UploadCloud className="w-6 h-6" />
              )}
            </div>

            <div className="flex flex-col items-center">
              <p className="text-xs sm:text-sm font-bold text-[var(--text-primary)] tracking-tight">
                {isDragActive ? (
                  isDragReject ? (
                    <span className="text-red-500 font-extrabold">File type not supported</span>
                  ) : (
                    <span className="text-brand-500 font-extrabold">Drop your image right here</span>
                  )
                ) : (
                  <>
                    <span className="text-brand-500 hover:underline">Click to browse</span> or drag and drop
                  </>
                )}
              </p>
              <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                PNG, JPG, WEBP, GIF, SVG up to {maxSizeMB}MB
              </p>
            </div>
          </div>
        )}

        {isUploading && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center text-white z-20">
            <Loader2 className="w-8 h-8 animate-spin text-brand-400 mb-2" />
            <span className="text-xs font-extrabold tracking-wide font-jakarta">
              Uploading to Bucket Store...
            </span>
            <span className="text-[10px] text-white/70 font-mono mt-0.5">
              {storageInfo?.bucketName || "mercora-media-bucket"}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-2 flex-wrap text-[11px] px-1">
        {errorMessage ? (
          <div className="flex items-center gap-1.5 text-red-500 font-medium">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        ) : (
          <div className="text-[10px] text-[var(--text-muted)]">
            Uploaded images are saved directly to the configured storage bucket.
          </div>
        )}

        {showBucketBadge && (
          <div
            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[10px] font-mono text-[var(--text-muted)] bg-[var(--surface-hover)] border border-[var(--border)] ml-auto"
            title="Bucket configured via .env parameters"
          >
            <HardDrive className="w-3 h-3 text-brand-500" />
            <span>
              Bucket:{" "}
              <strong className="text-[var(--text-primary)] font-semibold">
                {storageInfo?.bucketName || "mercora-media-bucket"}
              </strong>{" "}
              ({storageInfo?.driver?.toUpperCase() || "ENV"})
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
