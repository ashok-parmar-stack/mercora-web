"use client";

import React from "react";
import { User } from "../../../lib/admin-types";
import { ChevronLeft, ChevronRight, X, User as UserIcon } from "lucide-react";
import { Tooltip } from "@/components/common";

export interface UserDrawerHeaderProps {
  currentIndex: number;
  totalUsers: number;
  hasUsersList: boolean;
  onPrevUser: () => void;
  onNextUser: () => void;
  onClose: () => void;
}

export function UserDrawerHeader({
  currentIndex,
  totalUsers,
  hasUsersList,
  onPrevUser,
  onNextUser,
  onClose,
}: UserDrawerHeaderProps) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface-raised">
      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
            <UserIcon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-foreground leading-tight">
              User Profile Inspector
            </h3>
            <p className="text-[11px] text-muted-foreground leading-tight">
              Deterministic UBAC &amp; Identity Record
            </p>
          </div>
        </div>

        {hasUsersList && (
          <div className="flex items-center gap-1 ml-2 pl-2 border-l border-border">
            <Tooltip content="Previous user (Arrow Left)">
              <button
                type="button"
                onClick={onPrevUser}
                disabled={currentIndex <= 0}
                className="p-1 rounded-md text-text-muted hover:text-text-primary hover:bg-surface-hover disabled:opacity-30 transition-colors cursor-pointer"
                aria-label="Previous user"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </Tooltip>

            <span className="text-[11px] font-mono text-muted-foreground px-1 select-none">
              {currentIndex + 1} of {totalUsers}
            </span>

            <Tooltip content="Next user (Arrow Right)">
              <button
                type="button"
                onClick={onNextUser}
                disabled={currentIndex >= totalUsers - 1}
                className="p-1 rounded-md text-text-muted hover:text-text-primary hover:bg-surface-hover disabled:opacity-30 transition-colors cursor-pointer"
                aria-label="Next user"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </Tooltip>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={onClose}
        className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors cursor-pointer"
        aria-label="Close drawer"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}
