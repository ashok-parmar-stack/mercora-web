"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./Dialog";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  showCloseButton?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth,
  size = "md",
  showCloseButton = true,
}) => {
  const effectiveMaxWidth = maxWidth || size;
  const maxWidthClasses = {
    sm: "sm:max-w-sm",
    md: "sm:max-w-md",
    lg: "sm:max-w-lg",
    xl: "sm:max-w-xl",
    "2xl": "sm:max-w-2xl",
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className={`${maxWidthClasses[effectiveMaxWidth]} p-6 sm:p-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] shadow-2xl max-h-[90vh] overflow-y-auto`}
      >
        {(title || description) && (
          <DialogHeader className={!title ? "sr-only" : "mb-4 text-left"}>
            {title && (
              <DialogTitle className="text-xl font-bold text-[var(--text-primary)] tracking-tight">
                {title}
              </DialogTitle>
            )}
            {description && (
              <DialogDescription className="text-xs text-[var(--text-secondary)] mt-1">
                {description}
              </DialogDescription>
            )}
          </DialogHeader>
        )}
        <div>{children}</div>
      </DialogContent>
    </Dialog>
  );
};
