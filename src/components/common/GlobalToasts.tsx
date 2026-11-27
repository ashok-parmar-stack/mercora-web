"use client";

import React from "react";
import { useUIStore } from "../../lib/store/ui-store";
import { Toast, ToastItem } from "./Toast";

export const GlobalToasts: React.FC = () => {
  const toasts = useUIStore((s) => s.toasts);
  const removeToast = useUIStore((s) => s.removeToast);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast toast={toast as ToastItem} onDismiss={removeToast} />
        </div>
      ))}
    </div>
  );
};
