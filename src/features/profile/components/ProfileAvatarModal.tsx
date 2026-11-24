"use client";

import React from "react";
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/common";
import { ImageUploadDropzone } from "@/components/ui/ImageUploadDropzone";

export interface ProfileAvatarModalProps {
  isOpen: boolean;
  avatarUrl: string;
  onClose: () => void;
  onAvatarChange: (newUrl: string, meta?: any) => void;
  onRemoveAvatar: () => void;
}

export function ProfileAvatarModal({
  isOpen,
  avatarUrl,
  onClose,
  onAvatarChange,
  onRemoveAvatar,
}: ProfileAvatarModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent size="md">
        <DialogHeader>
          <DialogTitle>Upload Profile Picture</DialogTitle>
          <DialogDescription>
            Drag and drop or select an image file. It will be uploaded to your storage bucket configured in .env.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          <ImageUploadDropzone
            value={avatarUrl}
            onChange={onAvatarChange}
            onRemove={onRemoveAvatar}
            folder="avatars"
            maxSizeMB={5}
            variant="standard"
            label="Avatar Image Dropzone"
            description="Drag and drop your picture here, or click to browse. Max 5MB."
            showBucketBadge={true}
          />
        </div>

        <DialogFooter>
          <Button variant="primary" size="sm" onClick={onClose}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
