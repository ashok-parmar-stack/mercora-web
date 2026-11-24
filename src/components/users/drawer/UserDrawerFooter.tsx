"use client";

import React from "react";
import Link from "next/link";
import { User } from "../../../lib/admin-types";
import { Button } from "@/components/common";
import { RotateCcw, Pencil, Trash2, KeyRound } from "lucide-react";

export interface UserDrawerFooterProps {
  user: User;
  isDeleted: boolean;
  canEdit: boolean;
  canDelete: boolean;
  onRestore: () => void;
  onDelete: () => void;
  onClose: () => void;
}

export function UserDrawerFooter({
  user,
  isDeleted,
  canEdit,
  canDelete,
  onRestore,
  onDelete,
  onClose,
}: UserDrawerFooterProps) {
  return (
    <div className="p-4 sm:p-5 border-t border-border bg-surface-raised flex items-center justify-between gap-3 flex-wrap">
      <div className="flex items-center gap-2">
        {isDeleted ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRestore}
            disabled={!canEdit}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Restore User
          </Button>
        ) : (
          <>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!canEdit}
              asChild
            >
              <Link href={`/admin/users/${encodeURIComponent(user.slug || user.id)}/edit`}>
                <Pencil className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </Link>
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              asChild
            >
              <Link href={`/admin/users/${encodeURIComponent(user.slug || user.id)}/permissions`}>
                <KeyRound className="w-3.5 h-3.5" />
                <span>UBAC</span>
              </Link>
            </Button>

            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={onDelete}
              disabled={!canDelete}
              leftIcon={<Trash2 className="w-3.5 h-3.5" />}
            >
              Delete
            </Button>
          </>
        )}
      </div>

      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={onClose}
      >
        Close
      </Button>
    </div>
  );
}
