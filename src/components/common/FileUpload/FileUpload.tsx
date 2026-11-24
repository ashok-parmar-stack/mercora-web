"use client";

import React, { useRef, useState } from "react";
import { UploadCloud, File, X, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FileUploadProps {
  accept?: string;
  maxSizeMB?: number;
  multiple?: boolean;
  files?: File[];
  onFilesChange?: (files: File[]) => void;
  disabled?: boolean;
  label?: string;
  helperText?: string;
  error?: string;
  className?: string;
}

export function FileUpload({
  accept,
  maxSizeMB = 5,
  multiple = false,
  files = [],
  onFilesChange,
  disabled = false,
  label,
  helperText,
  error: externalError,
  className = "",
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [internalError, setInternalError] = useState<string | null>(null);

  const displayError = externalError || internalError;

  const validateFiles = (newFiles: File[]): File[] => {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    const valid: File[] = [];

    for (const f of newFiles) {
      if (f.size > maxSizeBytes) {
        setInternalError(`"${f.name}" exceeds the maximum size of ${maxSizeMB}MB.`);
        return valid;
      }
      valid.push(f);
    }
    setInternalError(null);
    return valid;
  };

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles || selectedFiles.length === 0 || disabled) return;
    const filesArray = Array.from(selectedFiles);
    const valid = validateFiles(filesArray);
    if (valid.length === 0) return;

    if (multiple) {
      onFilesChange?.([...files, ...valid]);
    } else {
      onFilesChange?.([valid[0]]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (disabled) return;
    handleFileSelect(e.dataTransfer.files);
  };

  const handleRemoveFile = (index: number) => {
    if (disabled) return;
    const updated = files.filter((_, i) => i !== index);
    onFilesChange?.(updated);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <div className={cn("w-full flex flex-col gap-1.5", className)}>
      {label && (
        <label className="text-[13px] font-medium text-foreground leading-tight select-none">
          {label}
        </label>
      )}

      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
        className={cn(
          "relative flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed border-border bg-surface text-center cursor-pointer transition-all duration-150",
          "hover:border-primary/50 hover:bg-secondary/20",
          isDragOver && "border-primary bg-primary/5 ring-2 ring-primary/20",
          disabled && "cursor-not-allowed opacity-50 hover:border-border hover:bg-surface",
          displayError && "border-destructive/60 bg-destructive/5"
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="sr-only"
        />

        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-primary mb-3">
          <UploadCloud className="w-5 h-5" />
        </div>

        <p className="text-xs font-semibold text-foreground">
          <span className="text-primary hover:underline">Click to upload</span> or drag and drop
        </p>
        <p className="text-[11px] text-muted-foreground mt-1">
          {accept ? accept : "Any file format"} up to {maxSizeMB}MB
        </p>
      </div>

      {displayError && (
        <div className="flex items-center gap-1.5 text-xs text-destructive font-medium leading-none">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{displayError}</span>
        </div>
      )}

      {!displayError && helperText && (
        <span className="text-xs text-muted-foreground leading-none">
          {helperText}
        </span>
      )}

      {files.length > 0 && (
        <div className="flex flex-col gap-1.5 mt-2">
          {files.map((file, idx) => (
            <div
              key={`${file.name}-${idx}`}
              className="flex items-center justify-between p-2 rounded-lg border border-border bg-surface-raised text-xs"
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <File className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="truncate font-medium text-foreground">{file.name}</span>
                <span className="text-muted-foreground text-[10px]">({formatFileSize(file.size)})</span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFile(idx);
                }}
                disabled={disabled}
                className="p-1 text-muted-foreground hover:text-destructive rounded-md hover:bg-surface-hover transition-colors"
                aria-label="Remove file"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FileUpload;
