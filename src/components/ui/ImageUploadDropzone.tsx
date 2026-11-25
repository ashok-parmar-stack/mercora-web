"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useDropzone, Accept, FileRejection } from "react-dropzone";
import { AvatarDropzone } from "./dropzone/AvatarDropzone";
import { StandardDropzone } from "./dropzone/StandardDropzone";

export interface UploadMetaInfo {
  size?: number;
  originalSize?: number;
  savedPercentage?: number;
  width?: number;
  height?: number;
  format?: string;
  bucket?: string;
  driver?: string;
}

export interface ImageUploadDropzoneProps {
  value?: string;
  onChange?: (url: string, uploadMeta?: any) => void;
  onRemove?: () => void;
  folder?: string;
  maxSizeMB?: number;
  accept?: Accept;
  label?: string;
  description?: string;
  variant?: "standard" | "compact-avatar" | "banner";
  className?: string;
  disabled?: boolean;
  showBucketBadge?: boolean;
}

const DEFAULT_ACCEPTED_IMAGES: Accept = {
  "image/jpeg": [".jpeg", ".jpg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
  "image/gif": [".gif"],
};

export const ImageUploadDropzone: React.FC<ImageUploadDropzoneProps> = ({
  value = "",
  onChange,
  onRemove,
  folder = "avatars",
  maxSizeMB = 5,
  accept = DEFAULT_ACCEPTED_IMAGES,
  label,
  description,
  variant = "standard",
  className = "",
  disabled = false,
  showBucketBadge = true,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>(value);
  const [uploadMeta, setUploadMeta] = useState<UploadMetaInfo | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [storageInfo, setStorageInfo] = useState<{
    driver: string;
    bucketName: string;
    region?: string;
  } | null>(null);

  useEffect(() => {
    setPreviewUrl(value || "");
  }, [value]);

  useEffect(() => {
    let isMounted = true;
    fetch("/api/upload")
      .then((res) => res.json())
      .then((json) => {
        if (isMounted && json?.data) {
          setStorageInfo(json.data);
        }
      })
      .catch(() => { });

    return () => {
      isMounted = false;
    };
  }, []);

  const uploadFile = async (file: File) => {
    setErrorMessage(null);
    const localPreview = URL.createObjectURL(file);
    const oldUrl = previewUrl;
    setPreviewUrl(localPreview);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to upload file to bucket.");
      }

      const uploadedUrl = result.data?.url || localPreview;
      setPreviewUrl(uploadedUrl);
      if (result.data) {
        setUploadMeta(result.data);
      }
      onChange?.(uploadedUrl, result.data);
    } catch (err: any) {
      console.error("[Dropzone Upload Error]", err);
      setPreviewUrl(oldUrl);
      setErrorMessage(err?.message || "Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (fileRejections.length > 0) {
        const rejection = fileRejections[0];
        const error = rejection.errors[0];
        if (error?.code === "file-too-large") {
          setErrorMessage(`File exceeds ${maxSizeMB}MB limit.`);
        } else if (error?.code === "file-invalid-type") {
          setErrorMessage("Invalid file format. Please upload JPG, PNG, WEBP, or SVG.");
        } else {
          setErrorMessage(error?.message || "Invalid file selection.");
        }
        return;
      }

      if (acceptedFiles.length > 0) {
        uploadFile(acceptedFiles[0]);
      }
    },
    [maxSizeMB, folder, previewUrl]
  );

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    open: openFileDialog,
  } = useDropzone({
    onDrop,
    accept,
    maxSize: maxSizeMB * 1024 * 1024,
    multiple: false,
    maxFiles: 1,
    disabled: disabled || isUploading,
  });

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewUrl("");
    setUploadMeta(null);
    setErrorMessage(null);
    onRemove?.();
  };

  const commonProps = {
    label,
    description,
    className,
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
    onRemove: handleRemove,
  };

  if (variant === "compact-avatar") {
    return <AvatarDropzone {...commonProps} />;
  }

  return <StandardDropzone {...commonProps} variant={variant} />;
};
