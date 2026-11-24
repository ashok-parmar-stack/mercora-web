"use client";

import React from "react";
import { useUIStore } from "../../lib/store/ui-store";
import { useAdminStore } from "../../lib/store/admin-store";
import { Toast, ToastItem } from "./Toast";

export const GlobalToasts: React.FC = () => {
  const uiToasts = useUIStore((s) => s.toasts);
  const removeUiToast = useUIStore((s) => s.removeToast);
  const { state, removeToast: removeAdminToast } = useAdminStore();
  const adminToasts = state.toasts;

  const allToasts = [...uiToasts, ...adminToasts];

  if (allToasts.length === 0) return null;

  const handleDismiss = (id: string) => {
    removeUiToast(id);
    removeAdminToast(id);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {allToasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast toast={toast as ToastItem} onDismiss={handleDismiss} />
        </div>
      ))}
    </div>
  );
};
