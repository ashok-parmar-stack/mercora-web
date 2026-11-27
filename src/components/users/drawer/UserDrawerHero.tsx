"use client";

import React from "react";
import { User } from "../../../lib/admin-types";
import { StatusBadge } from "../../status/StatusBadge";
import { Badge } from "@/components/common";
import { Mail, Copy, Check, AlertTriangle } from "lucide-react";
import { formatLocalDateTime } from "@/lib/date";

export interface UserDrawerHeroProps {
  user: User;
  initials: string;
  fullName: string;
  roleName: string;
  isDeleted: boolean;
  copiedKey: string | null;
  onCopy: (text: string, key: string) => void;
}

export function UserDrawerHero({
  user,
  initials,
  fullName,
  roleName,
  isDeleted,
  copiedKey,
  onCopy,
}: UserDrawerHeroProps) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-5 shadow-xs">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary to-accent text-white flex items-center justify-center font-extrabold text-2xl shadow-md ring-4 ring-surface">
            {initials}
          </div>
          <div className="absolute -bottom-1 -right-1">
            <span
              className={`block w-4 h-4 rounded-full ring-2 ring-surface ${
                isDeleted
                  ? "bg-status-error"
                  : user.status?.code === "INACTIVE"
                  ? "bg-status-warning"
                  : "bg-status-success"
              }`}
              title={isDeleted ? "Deleted" : user.status?.code || "Active"}
            />
          </div>
        </div>

        {/* Title & Badges */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-lg font-bold text-foreground truncate">{fullName}</h2>
            <StatusBadge status={user.status?.code || "ACTIVE"} isDeleted={isDeleted} />
            <Badge variant="purple" size="sm">
              {roleName}
            </Badge>
          </div>

          <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-text-muted" />
            <span className="truncate">{user.email}</span>
          </div>

          {user.slug && (
            <div className="mt-2.5 inline-flex items-center gap-1.5 bg-surface border border-border px-2 py-0.5 rounded-md text-[11px] font-mono text-text-secondary shadow-2xs">
              <span>@{user.slug}</span>
              <button
                type="button"
                onClick={() => onCopy(user.slug || "", "slug")}
                className="text-text-muted hover:text-text-primary cursor-pointer"
                title="Copy slug"
              >
                {copiedKey === "slug" ? (
                  <Check className="w-3 h-3 text-status-success" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {isDeleted && (
        <div className="mt-4 p-3 bg-status-error-bg border border-status-error-border rounded-xl flex items-center gap-2.5 text-xs text-status-error">
          <AlertTriangle className="w-4 h-4 text-status-error flex-shrink-0" />
          <div>
            <strong>User Account in Trash:</strong> This user was soft-deleted on{" "}
            {formatLocalDateTime(user.deletedAt, { fallback: "an unknown date" })}. Login and
            system access are suspended.
          </div>
        </div>
      )}
    </div>
  );
}
