"use client";

import React from "react";
import { useUIStore } from "../../lib/store/ui-store";
import { useAdminStore } from "../../lib/store/admin-store";
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from "lucide-react";

export const GlobalToasts: React.FC = () => {
  const uiToasts = useUIStore((s) => s.toasts);
  const removeUiToast = useUIStore((s) => s.removeToast);
  const { state, removeToast: removeAdminToast } = useAdminStore();
  const adminToasts = state.toasts;

  const allToasts = [...uiToasts, ...adminToasts];

  if (allToasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {allToasts.map((toast) => {
        const config = {
          success: {
            bg: "bg-emerald-50 border-emerald-200 text-emerald-950",
            icon: <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />,
            title: "text-emerald-900",
          },
          error: {
            bg: "bg-rose-50 border-rose-200 text-rose-950",
            icon: <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />,
            title: "text-rose-900",
          },
          warning: {
            bg: "bg-amber-50 border-amber-200 text-amber-950",
            icon: <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />,
            title: "text-amber-900",
          },
          info: {
            bg: "bg-blue-50 border-blue-200 text-blue-950",
            icon: <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />,
            title: "text-blue-900",
          },
        }[toast.type] || {
          bg: "bg-gray-50 border-gray-200 text-gray-950",
          icon: <Info className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />,
          title: "text-gray-900",
        };

        const handleDismiss = () => {
          removeUiToast(toast.id);
          removeAdminToast(toast.id);
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-xl transition-all animate-in slide-in-from-bottom-2 duration-200 ${config.bg}`}
          >
            {config.icon}
            <div className="flex-1 min-w-0">
              <div className={`text-xs font-extrabold ${config.title}`}>{toast.title}</div>
              {toast.message && (
                <div className="text-xs text-gray-600 mt-0.5 leading-snug">{toast.message}</div>
              )}
            </div>
            <button
              onClick={handleDismiss}
              className="text-gray-400 hover:text-gray-700 p-1 rounded-md hover:bg-black/5 transition-colors cursor-pointer flex-shrink-0"
              aria-label="Close notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

