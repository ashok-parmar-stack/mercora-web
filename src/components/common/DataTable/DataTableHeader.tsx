"use client";

import React from "react";
import { TableHeader, TableRow, TableHead } from "@/components/ui/Table";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Column, SortDir } from "./types";

export interface DataTableHeaderProps<T> {
  columns: Column<T>[];
  isSelectionEnabled: boolean;
  isAllSelected: boolean;
  isSomeSelected: boolean;
  onSelectAll: () => void;
  isLoading: boolean;
  hasVisibleRows: boolean;
  sortKey?: string | null;
  sortDir?: SortDir;
  onSort: (key: string) => void;
  renderActions?: boolean;
  actionsHeader?: string;
}

export function DataTableHeader<T>({
  columns,
  isSelectionEnabled,
  isAllSelected,
  isSomeSelected,
  onSelectAll,
  isLoading,
  hasVisibleRows,
  sortKey,
  sortDir,
  onSort,
  renderActions,
  actionsHeader = "Actions",
}: DataTableHeaderProps<T>) {
  return (
    <TableHeader>
      <TableRow className="hover:bg-transparent bg-surface">
        {isSelectionEnabled && (
          <TableHead className="w-11 min-w-[44px] px-3 py-0 text-center border-b border-border bg-surface">
            <div className="flex items-center justify-center h-10">
              <input
                type="checkbox"
                checked={isAllSelected}
                ref={(el) => {
                  if (el) el.indeterminate = isSomeSelected;
                }}
                disabled={isLoading || !hasVisibleRows}
                onChange={onSelectAll}
                className="w-4 h-4 rounded border-border accent-primary focus:ring-primary/20 focus:ring-offset-0 cursor-pointer disabled:opacity-40 transition-all"
                aria-label="Select all visible rows"
              />
            </div>
          </TableHead>
        )}

        {columns.map((col) => {
          const isSortable = col.sortable !== false;
          const isActiveSortCol = sortKey === col.key && Boolean(sortDir);

          return (
            <TableHead
              key={col.key}
              style={{ width: col.width, minWidth: col.minWidth }}
              className={cn(
                "px-0 py-0 select-none whitespace-nowrap text-xs tracking-normal border-b border-border bg-surface",
                col.className
              )}
            >
              <div
                className={cn(
                  "flex items-center justify-between h-10 px-4 transition-colors",
                  isSortable && "cursor-pointer hover:bg-surface-hover/70",
                  isActiveSortCol && "bg-surface-hover/50"
                )}
                onClick={isSortable ? () => onSort(col.key) : undefined}
              >
                <div
                  className={cn(
                    "inline-flex items-center gap-1.5 flex-1 min-w-0",
                    col.align === "right"
                      ? "flex-row-reverse justify-end"
                      : col.align === "center"
                        ? "justify-center"
                        : "justify-start",
                    isSortable && "group/sort"
                  )}
                >
                  <span
                    className={cn(
                      "truncate transition-colors text-xs",
                      isActiveSortCol
                        ? "font-bold text-foreground"
                        : "font-semibold text-muted-foreground group-hover/sort:text-foreground"
                    )}
                  >
                    {col.header}
                  </span>

                  {isSortable && (
                    <span className="flex-shrink-0 inline-flex items-center">
                      {isActiveSortCol ? (
                        sortDir === "asc" ? (
                          <ArrowUp className="w-3.5 h-3.5 text-primary stroke-[2.5]" />
                        ) : (
                          <ArrowDown className="w-3.5 h-3.5 text-primary stroke-[2.5]" />
                        )
                      ) : (
                        <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground/40 group-hover/sort:text-muted-foreground transition-colors" />
                      )}
                    </span>
                  )}
                </div>
              </div>
            </TableHead>
          );
        })}

        {renderActions && (
          <TableHead className="w-24 min-w-[90px] px-0 py-0 text-right sticky right-0 bg-surface border-b border-border z-10">
            <div className="flex items-center justify-end h-10 px-4">
              <span className="font-semibold text-muted-foreground text-xs tracking-normal">
                {actionsHeader}
              </span>
            </div>
          </TableHead>
        )}
      </TableRow>
    </TableHeader>
  );
}

export default DataTableHeader;
