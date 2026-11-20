"use client";

import React from "react";
import { LayoutGrid, Table as TableIcon } from "lucide-react";
import { ViewMode } from "../../types/business.types";

export interface BusinessViewToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export function BusinessViewToggle({ viewMode, onViewModeChange }: BusinessViewToggleProps) {
  return (
    <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700">
      <button
        type="button"
        onClick={() => onViewModeChange("card")}
        aria-label="Card view"
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
          viewMode === "card"
            ? "bg-red-600 text-white shadow-sm"
            : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
        }`}
      >
        <LayoutGrid className="w-3.5 h-3.5" />
        <span>Card</span>
      </button>

      <button
        type="button"
        onClick={() => onViewModeChange("table")}
        aria-label="Table view"
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
          viewMode === "table"
            ? "bg-red-600 text-white shadow-sm"
            : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
        }`}
      >
        <TableIcon className="w-3.5 h-3.5" />
        <span>Table</span>
      </button>
    </div>
  );
}
