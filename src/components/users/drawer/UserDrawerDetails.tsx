"use client";

import React from "react";
import { User } from "../../../lib/admin-types";
import { User as UserIcon, Fingerprint, Copy, Check } from "lucide-react";

export interface UserDrawerDetailsProps {
  user: User;
  derivedFirst: string;
  derivedLast: string;
  copiedKey: string | null;
  onCopy: (text: string, key: string) => void;
}

export function UserDrawerDetails({
  user,
  derivedFirst,
  derivedLast,
  copiedKey,
  onCopy,
}: UserDrawerDetailsProps) {
  return (
    <div className="bg-surface border border-border rounded-xl p-4 shadow-xs">
      <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
        <UserIcon className="w-3.5 h-3.5 text-primary" />
        Contact &amp; Account Details
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="bg-surface-hover/60 p-2.5 rounded-lg border border-border">
          <span className="text-text-muted block text-[10px] font-bold uppercase">First Name</span>
          <span className="font-semibold text-foreground">{derivedFirst || "—"}</span>
        </div>

        <div className="bg-surface-hover/60 p-2.5 rounded-lg border border-border">
          <span className="text-text-muted block text-[10px] font-bold uppercase">Last Name</span>
          <span className="font-semibold text-foreground">{derivedLast || "—"}</span>
        </div>

        <div className="bg-surface-hover/60 p-2.5 rounded-lg border border-border flex items-center justify-between">
          <div className="min-w-0">
            <span className="text-text-muted block text-[10px] font-bold uppercase">Email Address</span>
            <span className="font-semibold text-foreground truncate block">{user.email}</span>
          </div>
          <button
            type="button"
            onClick={() => onCopy(user.email, "email")}
            className="p-1 rounded hover:bg-surface text-text-muted hover:text-text-primary transition-colors ml-2 flex-shrink-0 cursor-pointer"
            title="Copy email"
          >
            {copiedKey === "email" ? (
              <Check className="w-3.5 h-3.5 text-status-success" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        <div className="bg-surface-hover/60 p-2.5 rounded-lg border border-border flex items-center justify-between">
          <div className="min-w-0">
            <span className="text-text-muted block text-[10px] font-bold uppercase">Phone Number</span>
            <span className="font-semibold text-foreground truncate block">
              {user.phone || <span className="text-text-muted italic font-normal">Not configured</span>}
            </span>
          </div>
          {user.phone && (
            <button
              type="button"
              onClick={() => onCopy(user.phone || "", "phone")}
              className="p-1 rounded hover:bg-surface text-text-muted hover:text-text-primary transition-colors ml-2 flex-shrink-0 cursor-pointer"
              title="Copy phone"
            >
              {copiedKey === "phone" ? (
                <Check className="w-3.5 h-3.5 text-status-success" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          )}
        </div>

        <div className="sm:col-span-2 bg-surface-hover/60 p-2.5 rounded-lg border border-border flex items-center justify-between">
          <div className="min-w-0">
            <span className="text-text-muted block text-[10px] font-bold uppercase flex items-center gap-1">
              <Fingerprint className="w-3 h-3" /> System Identifier (UUID)
            </span>
            <code className="font-mono text-[11px] text-foreground truncate block">{user.id}</code>
          </div>
          <button
            type="button"
            onClick={() => onCopy(user.id, "id")}
            className="p-1 rounded hover:bg-surface text-text-muted hover:text-text-primary transition-colors ml-2 flex-shrink-0 cursor-pointer"
            title="Copy User ID"
          >
            {copiedKey === "id" ? (
              <Check className="w-3.5 h-3.5 text-status-success" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
