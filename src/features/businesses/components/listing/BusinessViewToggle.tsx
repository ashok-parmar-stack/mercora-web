"use client";

import React from "react";
import { LayoutGrid, List } from "lucide-react";
import { ViewMode } from "../../types/business.types";

export interface BusinessViewToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export function BusinessViewToggle({ viewMode, onViewModeChange }: BusinessViewToggleProps) {
  return (
    <div className="flex items-center p-0.5 bg-background-secondary rounded-xl border border-border">
      <button
        type="button"
        onClick={() => onViewModeChange("card")}
        aria-label="Grid view"
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
          viewMode === "card"
            ? "bg-[#7F1D3F] text-white shadow-xs"
            : "text-text-secondary hover:text-text-primary"
        }`}
      >
        <LayoutGrid className="w-3.5 h-3.5" />
        <span>Grid</span>
      </button>

      <button
        type="button"
        onClick={() => onViewModeChange("table")}
        aria-label="List view"
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
          viewMode === "table"
            ? "bg-[#7F1D3F] text-white shadow-xs"
            : "text-text-secondary hover:text-text-primary"
        }`}
      >
        <List className="w-3.5 h-3.5" />
        <span>List</span>
      </button>
    </div>
  );
}
