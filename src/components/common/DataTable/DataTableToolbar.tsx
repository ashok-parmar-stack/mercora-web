"use client";

import React, { useState, useRef, useEffect } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { SearchInput } from "@/components/common/Input/SearchInput";
import { Button } from "@/components/common/Button";
import { cn } from "@/lib/utils";
import { Column, BulkAction } from "./types";

export interface DataTableToolbarProps<T> {
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
  searchPlaceholder?: string;
  filterSlot?: React.ReactNode;
  showColumnPicker?: boolean;
  columns: Column<T>[];
  hiddenCols: Set<string>;
  onToggleColumn: (key: string) => void;
  selectedRowIds: string[];
  selectedItems: T[];
  bulkActions?: BulkAction<T>[];
  onClearSelection: () => void;
}

export function DataTableToolbar<T>({
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Search records...",
  filterSlot,
  showColumnPicker = true,
  columns,
  hiddenCols,
  onToggleColumn,
  selectedRowIds,
  selectedItems,
  bulkActions,
  onClearSelection,
}: DataTableToolbarProps<T>) {
  const [isColPickerOpen, setIsColPickerOpen] = useState(false);
  const colPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (colPickerRef.current && !colPickerRef.current.contains(e.target as Node)) {
        setIsColPickerOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const hasSearchOrFilters = Boolean(onSearchChange || filterSlot || showColumnPicker);

  return (
    <div className="flex flex-col gap-3">
      {hasSearchOrFilters && (
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 flex-1 min-w-0">
            {onSearchChange && (
              <div className="w-full sm:w-64 lg:max-w-xs">
                <SearchInput
                  value={searchQuery ?? ""}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder={searchPlaceholder}
                  inputSize="sm"
                />
              </div>
            )}
            {filterSlot}
          </div>

          {showColumnPicker && columns.length > 0 && (
            <div className="relative self-end lg:self-auto shrink-0" ref={colPickerRef}>
              <button
                type="button"
                onClick={() => setIsColPickerOpen((prev) => !prev)}
                className="flex items-center gap-1.5 h-9 px-3 rounded-lg border border-border bg-surface hover:bg-surface-hover text-foreground text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
                title="Customize table columns"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
                <span>Columns</span>
                {hiddenCols.size > 0 && (
                  <span className="w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                    {hiddenCols.size}
                  </span>
                )}
              </button>

              {isColPickerOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-52 rounded-xl border border-border bg-surface-raised p-1.5 shadow-xl z-50 animate-in fade-in-50 zoom-in-95 duration-100">
                  <div className="px-2 py-1 text-[11px] font-bold text-muted-foreground uppercase tracking-wider border-b border-border mb-1">
                    Toggle Columns
                  </div>
                  {columns.map((col) => {
                    const isHidden = hiddenCols.has(col.key);
                    return (
                      <button
                        key={col.key}
                        type="button"
                        onClick={() => onToggleColumn(col.key)}
                        className="flex items-center justify-between w-full px-2 py-1.5 rounded-lg text-xs text-foreground hover:bg-surface-hover cursor-pointer transition-colors"
                      >
                        <span className="truncate">{col.header}</span>
                        <div
                          className={cn(
                            "w-7 h-4 rounded-full transition-colors p-0.5",
                            !isHidden ? "bg-primary" : "bg-border"
                          )}
                        >
                          <div
                            className={cn(
                              "h-3 w-3 rounded-full bg-white transition-transform",
                              !isHidden ? "translate-x-3" : "translate-x-0"
                            )}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {selectedRowIds.length > 0 && bulkActions && bulkActions.length > 0 && (
        <div className="bg-surface border border-border rounded-xl px-4 py-2 shadow-xs flex items-center justify-between gap-3 animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-md text-xs font-semibold bg-primary-soft text-primary border border-primary/20">
              {selectedRowIds.length}
            </span>
            <span className="text-xs font-medium text-foreground">
              {selectedRowIds.length === 1 ? "record selected" : "records selected"}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {bulkActions.map((act, idx) => (
              <Button
                key={idx}
                size="sm"
                variant={act.variant || "secondary"}
                onClick={() => act.onClick(selectedRowIds, selectedItems)}
                disabled={act.disabled}
                isLoading={act.isLoading}
                leftIcon={act.icon}
              >
                {act.label}
              </Button>
            ))}
            <button
              type="button"
              onClick={onClearSelection}
              className="flex items-center gap-1 text-xs font-medium text-text-secondary hover:text-foreground px-2 py-1.5 rounded-lg border border-border bg-surface hover:bg-surface-hover transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Clear</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataTableToolbar;
