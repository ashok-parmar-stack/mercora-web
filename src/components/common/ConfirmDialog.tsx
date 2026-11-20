"use client";

import React, { useState } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { AlertTriangle, Trash2, CheckCircle2, AlertCircle, Info } from "lucide-react";

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose?: () => void;
  onCancel?: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description?: string;
  message?: string;
  confirmText?: string;
  confirmLabel?: string;
  cancelText?: string;
  cancelLabel?: string;
  variant?: "danger" | "primary" | "warning" | "success";
  isLoading?: boolean;
  error?: string | null;
}

const VARIANT_ICONS = {
  danger: <Trash2 className="w-5 h-5 text-rose-600" />,
  warning: <AlertTriangle className="w-5 h-5 text-amber-600" />,
  success: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
  primary: <Info className="w-5 h-5 text-blue-600" />,
};

const VARIANT_ICON_BG = {
  danger: "bg-rose-100 dark:bg-rose-950/40",
  warning: "bg-amber-100 dark:bg-amber-950/40",
  success: "bg-emerald-100 dark:bg-emerald-950/40",
  primary: "bg-blue-100 dark:bg-blue-950/40",
};

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onCancel,
  onConfirm,
  title,
  description,
  message,
  confirmText,
  confirmLabel,
  cancelText,
  cancelLabel,
  variant = "danger",
  isLoading: externalIsLoading = false,
  error: externalError = null,
}) => {
  const [internalLoading, setInternalLoading] = useState(false);
  const [internalError, setInternalError] = useState<string | null>(null);

  const effectiveDescription = description || message || "";
  const effectiveConfirmText = confirmLabel || confirmText || (variant === "danger" ? "Delete" : "Confirm");
  const effectiveCancelText = cancelLabel || cancelText || "Cancel";
  const handleClose = onCancel || onClose || (() => {});
  const isLoading = externalIsLoading || internalLoading;
  const error = externalError || internalError;

  const handleConfirm = async () => {
    try {
      setInternalLoading(true);
      setInternalError(null);
      await onConfirm();
    } catch (err: any) {
      setInternalError(err?.message || "An unexpected error occurred. Please try again.");
    } finally {
      setInternalLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="" size="sm" showCloseButton={false}>
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${VARIANT_ICON_BG[variant]}`}>
            {VARIANT_ICONS[variant]}
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
            {effectiveDescription && (
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{effectiveDescription}</p>
            )}
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 text-sm text-rose-700 bg-rose-50 dark:bg-rose-950/30 rounded-lg">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex justify-end gap-3 mt-2">
          <Button variant="secondary" onClick={handleClose} disabled={isLoading} size="sm">
            {effectiveCancelText}
          </Button>
          <Button
            variant={variant === "danger" ? "danger" : "primary"}
            onClick={handleConfirm}
            loading={isLoading}
            size="sm"
          >
            {effectiveConfirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onClose?: () => void;
  onCancel?: () => void;
  onConfirm: () => void | Promise<void>;
  title?: string;
  itemName?: string;
  entityName?: string;
  itemType?: string;
  entityType?: string;
  isBulk?: boolean;
  count?: number;
  description?: string;
  isLoading?: boolean;
  error?: string | null;
}

export const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  isOpen,
  onClose,
  onCancel,
  onConfirm,
  title,
  itemName,
  entityName,
  itemType = "item",
  entityType,
  isBulk,
  count,
  description,
  isLoading,
  error,
}) => {
  const effectiveName = entityName || itemName;
  const effectiveType = entityType || itemType;
  const dialogTitle =
    title ||
    (isBulk
      ? `Delete ${count || "selected"} ${effectiveType}s`
      : `Delete ${effectiveName ? `"${effectiveName}"` : effectiveType}`);
  const dialogDesc =
    description ||
    (isBulk
      ? `Are you sure you want to delete ${count || "these"} ${effectiveType}s? This action cannot be undone.`
      : `Are you sure you want to delete this ${effectiveType}? This action cannot be undone.`);

  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onCancel={onCancel}
      onConfirm={onConfirm}
      title={dialogTitle}
      description={dialogDesc}
      variant="danger"
      confirmLabel="Delete"
      isLoading={isLoading}
      error={error}
    />
  );
};

export interface StatusConfirmDialogProps {
  isOpen: boolean;
  onClose?: () => void;
  onCancel?: () => void;
  onConfirm: () => void | Promise<void>;
  title?: string;
  itemName?: string;
  entityName?: string;
  itemType?: string;
  entityType?: string;
  isBulk?: boolean;
  count?: number;
  targetStatus?: string;
  description?: string;
  isLoading?: boolean;
  error?: string | null;
}

export const StatusConfirmDialog: React.FC<StatusConfirmDialogProps> = ({
  isOpen,
  onClose,
  onCancel,
  onConfirm,
  title,
  itemName,
  entityName,
  itemType = "item",
  entityType,
  isBulk,
  count,
  targetStatus = "active",
  description,
  isLoading,
  error,
}) => {
  const effectiveName = entityName || itemName;
  const effectiveType = entityType || itemType;
  const dialogTitle =
    title ||
    (isBulk
      ? `Change ${count || "selected"} ${effectiveType}s to ${targetStatus}`
      : `Change status to ${targetStatus}`);
  const dialogDesc =
    description ||
    (isBulk
      ? `Are you sure you want to change the status of ${count || "these"} ${effectiveType}s to ${targetStatus}?`
      : `Are you sure you want to change the status of ${effectiveName ? `"${effectiveName}"` : effectiveType} to ${targetStatus}?`);

  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onCancel={onCancel}
      onConfirm={onConfirm}
      title={dialogTitle}
      description={dialogDesc}
      variant="warning"
      confirmLabel="Change Status"
      isLoading={isLoading}
      error={error}
    />
  );
};
