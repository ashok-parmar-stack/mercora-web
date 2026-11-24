"use client";

import React from "react";
import { User, Status } from "@/lib/admin-types";
import { DeleteConfirmDialog, StatusConfirmDialog } from "@/components/common/ConfirmDialog";

export interface UsersModalsProps {
  deletingUser: User | null;
  bulkDeletingIds: string[] | null;
  bulkStatusConfirm: { ids: string[]; targetStatus: string } | null;
  statuses: Status[];
  onCloseDeleteUser: () => void;
  onCloseBulkDelete: () => void;
  onCloseBulkStatus: () => void;
  onConfirmDeleteUser: () => Promise<void>;
  onConfirmBulkDelete: () => Promise<void>;
  onConfirmBulkStatus: () => Promise<void>;
}

export function UsersModals({
  deletingUser,
  bulkDeletingIds,
  bulkStatusConfirm,
  statuses,
  onCloseDeleteUser,
  onCloseBulkDelete,
  onCloseBulkStatus,
  onConfirmDeleteUser,
  onConfirmBulkDelete,
  onConfirmBulkStatus,
}: UsersModalsProps) {
  return (
    <>
      {/* Single Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={Boolean(deletingUser)}
        onClose={onCloseDeleteUser}
        entityName={
          deletingUser
            ? `${deletingUser.name || `${deletingUser.firstName || ""} ${deletingUser.lastName || ""}`.trim() || deletingUser.email.split("@")[0]} (${deletingUser.email})`
            : undefined
        }
        entityType="user"
        onConfirm={onConfirmDeleteUser}
      />

      {/* Bulk Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={Boolean(bulkDeletingIds && bulkDeletingIds.length > 0)}
        onClose={onCloseBulkDelete}
        isBulk={true}
        count={bulkDeletingIds?.length || 0}
        entityType="user"
        onConfirm={onConfirmBulkDelete}
      />

      {/* Bulk Status Confirmation Dialog */}
      <StatusConfirmDialog
        isOpen={Boolean(bulkStatusConfirm)}
        onClose={onCloseBulkStatus}
        isBulk={true}
        count={bulkStatusConfirm?.ids.length || 0}
        entityType="user"
        targetStatus={bulkStatusConfirm?.targetStatus || "ACTIVE"}
        onConfirm={onConfirmBulkStatus}
      />
    </>
  );
}
