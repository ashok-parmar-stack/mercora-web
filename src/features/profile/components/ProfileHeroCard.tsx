"use client";

import React, { useRef } from "react";
import { Badge } from "@/components/common";
import { Camera, Loader2, UploadCloud, Trash2, HardDrive } from "lucide-react";

export interface ProfileHeroCardProps {
  name: string;
  email: string;
  company: string;
  roleName: string;
  avatarUrl: string;
  avatarError: boolean;
  isUploadingAvatar: boolean;
  storageInfo: { driver: string; bucketName: string; region?: string } | null;
  onOpenAvatarModal: () => void;
  onAvatarFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveAvatar: () => void;
  onAvatarError: () => void;
}

export function ProfileHeroCard({
  name,
  email,
  company,
  roleName,
  avatarUrl,
  avatarError,
  isUploadingAvatar,
  storageInfo,
  onOpenAvatarModal,
  onAvatarFileChange,
  onRemoveAvatar,
  onAvatarError,
}: ProfileHeroCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getInitials = (n: string) => {
    return n
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6">
      <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-5 min-w-0">
        <input
          type="file"
          ref={fileInputRef}
          onChange={onAvatarFileChange}
          accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
          className="hidden"
        />

        {/* Avatar with Initials or Uploaded Photo */}
        <div
          className="relative group/avatar cursor-pointer flex-shrink-0"
          onClick={onOpenAvatarModal}
          title="Click to open image upload dropzone"
        >
          {avatarUrl && !avatarError ? (
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-22 md:h-22 rounded-2xl overflow-hidden shadow-xs border border-slate-700/30 bg-slate-900">
              <img
                src={avatarUrl}
                alt={name}
                className="w-full h-full object-cover"
                onError={onAvatarError}
              />
            </div>
          ) : (
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-22 md:h-22 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white font-extrabold flex items-center justify-center text-xl sm:text-2xl md:text-3xl shadow-xs border border-slate-700/20 font-sans">
              {getInitials(name)}
            </div>
          )}

          <div
            className={`absolute inset-0 rounded-2xl bg-black/60 flex flex-col items-center justify-center text-white transition-opacity duration-200 ${
              isUploadingAvatar ? "opacity-100" : "opacity-0 group-hover/avatar:opacity-100"
            }`}
          >
            {isUploadingAvatar ? (
              <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin text-primary" />
            ) : (
              <>
                <Camera className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="text-[9px] sm:text-[10px] font-bold mt-1 tracking-tight">Upload</span>
              </>
            )}
          </div>
        </div>

        {/* User Meta */}
        <div className="flex flex-col min-w-0 items-center sm:items-start">
          <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
            <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold text-[var(--text-primary)] tracking-tight">
              {name}
            </h2>
            <Badge variant="success" size="sm">
              Active
            </Badge>
            <Badge variant="neutral" size="sm">
              {roleName}
            </Badge>
          </div>

          <p className="text-xs text-[var(--text-muted)] mt-1 flex items-center justify-center sm:justify-start gap-2 sm:gap-3 flex-wrap">
            <span className="truncate max-w-[220px] sm:max-w-none">{email}</span>
            <span>•</span>
            <span>{company}</span>
          </p>

          {/* Bucket Storage & Avatar Controls Row */}
          <div className="flex items-center gap-2 mt-2.5 flex-wrap justify-center sm:justify-start">
            <button
              type="button"
              onClick={onOpenAvatarModal}
              disabled={isUploadingAvatar}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[var(--surface-hover)] hover:bg-[var(--border)] text-[var(--text-primary)] border border-[var(--border)] transition-colors cursor-pointer disabled:opacity-50"
              title="Open drag-and-drop upload zone for storage bucket"
            >
              {isUploadingAvatar ? (
                <Loader2 className="w-3 h-3 animate-spin text-primary" />
              ) : (
                <UploadCloud className="w-3 h-3 text-primary" />
              )}
              <span>{isUploadingAvatar ? "Uploading..." : avatarUrl ? "Change Photo" : "Upload Photo"}</span>
            </button>

            {avatarUrl && (
              <button
                type="button"
                onClick={onRemoveAvatar}
                disabled={isUploadingAvatar}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-bold text-status-error hover:bg-status-error/10 border border-status-error/20 transition-colors cursor-pointer"
                title="Remove avatar image"
              >
                <Trash2 className="w-3 h-3" />
                <span>Remove</span>
              </button>
            )}

            <div
              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-mono text-[var(--text-muted)] bg-[var(--surface-hover)] border border-[var(--border)]"
              title="Storage bucket configured via .env parameters"
            >
              <HardDrive className="w-2.5 h-2.5 text-primary" />
              <span>
                Bucket:{" "}
                <strong className="text-[var(--text-primary)] font-semibold">
                  {storageInfo?.bucketName || "mercora-media-bucket"}
                </strong>{" "}
                ({storageInfo?.driver?.toUpperCase() || "ENV"})
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-2 sm:flex items-center gap-2.5 sm:gap-4 pt-3 sm:pt-4 md:pt-0 border-t md:border-t-0 border-[var(--border)]">
        <div className="bg-[var(--surface-hover)] border border-[var(--border)] p-2.5 sm:p-3 rounded-xl text-center">
          <span className="text-[9px] sm:text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-0.5">
            Role Authority
          </span>
          <span className="text-xs font-extrabold text-[var(--text-primary)]">
            Super Admin
          </span>
        </div>

        <div className="bg-[var(--surface-hover)] border border-[var(--border)] p-2.5 sm:p-3 rounded-xl text-center">
          <span className="text-[9px] sm:text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block mb-0.5">
            Session Guard
          </span>
          <span className="text-xs font-extrabold text-status-success">
            Single Active
          </span>
        </div>
      </div>
    </div>
  );
}
