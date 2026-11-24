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
    <div className="flex items-center p-1 bg-surface rounded-xl border border-border shadow-2xs">
      <button
        type="button"
        onClick={() => onViewModeChange("card")}
        aria-label="Card view"
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
          viewMode === "card"
            ? "bg-primary text-white shadow-xs"
            : "text-text-secondary hover:text-text-primary hover:bg-surface-hover"
        }`}
      >
        <LayoutGrid className="w-3.5 h-3.5" />
        <span>Card</span>
      </button>

      <button
        type="button"
        onClick={() => onViewModeChange("table")}
        aria-label="Table view"
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
          viewMode === "table"
            ? "bg-primary text-white shadow-xs"
            : "text-text-secondary hover:text-text-primary hover:bg-surface-hover"
        }`}
      >
        <TableIcon className="w-3.5 h-3.5" />
        <span>Table</span>
      </button>
    </div>
  );
}
