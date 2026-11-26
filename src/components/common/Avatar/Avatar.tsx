"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  status?: "online" | "offline" | "busy" | "away";
}

/**
 * Linear-Inspired Avatar Component
 * Displays user image with graceful fallback to initials, border styling, and optional status indicator.
 */
export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = "User avatar",
  name,
  size = "md",
  status,
  className = "",
  ...props
}) => {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    xs: "w-5 h-5 text-[9px]",
    sm: "w-7 h-7 text-[11px]",
    md: "w-9 h-9 text-xs",
    lg: "w-11 h-11 text-sm",
    xl: "w-14 h-14 text-base",
  };

  const statusSizeClasses = {
    xs: "w-1.5 h-1.5 border-[1px]",
    sm: "w-2 h-2 border-[1.5px]",
    md: "w-2.5 h-2.5 border-2",
    lg: "w-3 h-3 border-2",
    xl: "w-3.5 h-3.5 border-2",
  };

  const statusColors = {
    online: "bg-status-success",
    offline: "bg-text-muted",
    busy: "bg-status-error",
    away: "bg-status-warning",
  };

  const getInitials = (str?: string) => {
    if (!str) return "?";
    const parts = str.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return str.substring(0, 2).toUpperCase();
  };

  const showImage = src && !imageError;

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center shrink-0 rounded-full font-semibold select-none",
        "bg-surface-raised border border-border text-text-secondary overflow-visible",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center">
        {showImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="tracking-tight">{getInitials(name || alt)}</span>
        )}
      </div>

      {status && (
        <span
          className={cn(
            "absolute bottom-0 right-0 rounded-full border-background ring-0",
            statusSizeClasses[size],
            statusColors[status]
          )}
          aria-label={`Status: ${status}`}
        />
      )}
    </div>
  );
};

export default Avatar;
