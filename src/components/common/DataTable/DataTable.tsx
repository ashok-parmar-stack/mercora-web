"use client";

import React from "react";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Column<T> {
  key: string;
  header: React.ReactNode;
  render?: (item: T, index: number) => React.ReactNode;
  sortable?: boolean;
  className?: string;
  width?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T, index: number) => string;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
  onSort?: (key: string) => void;
  isLoading?: boolean;
  emptyMessage?: string;
  className?: string;
  onRowClick?: (item: T) => void;
}

/**
 * Linear-Inspired Dense DataTable
 * High information density, hairline cell dividers, sort indicators, and smooth hover state.
 */
export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  sortBy,
  sortDirection = "asc",
  onSort,
  isLoading = false,
  emptyMessage = "No records found",
  className = "",
  onRowClick,
}: DataTableProps<T>) {
  return (
    <div className={cn("w-full overflow-hidden rounded-xl border border-border bg-surface shadow-xs", className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-border bg-background-secondary/60 select-none">
              {columns.map((col) => {
                const isSorted = sortBy === col.key;
                return (
                  <th
                    key={col.key}
                    style={{ width: col.width }}
                    onClick={() => col.sortable && onSort?.(col.key)}
                    className={cn(
                      "h-9 px-4 text-xs font-semibold text-text-secondary tracking-tight",
                      col.sortable && "cursor-pointer hover:text-text-primary transition-colors",
                      col.className
                    )}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{col.header}</span>
                      {col.sortable && (
                        <span className="text-text-muted">
                          {isSorted ? (
                            sortDirection === "asc" ? (
                              <ArrowUp className="w-3.5 h-3.5 text-primary" />
                            ) : (
                              <ArrowDown className="w-3.5 h-3.5 text-primary" />
                            )
                          ) : (
                            <ArrowUpDown className="w-3 h-3 opacity-40 hover:opacity-100" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center text-text-muted">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                    <span className="text-xs">Loading data...</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center text-text-muted text-xs">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr
                  key={keyExtractor(item, index)}
                  onClick={() => onRowClick?.(item)}
                  className={cn(
                    "transition-colors hover:bg-surface-hover/80",
                    onRowClick && "cursor-pointer"
                  )}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn("py-3 px-4 text-text-primary align-middle leading-normal", col.className)}
                    >
                      {col.render ? col.render(item, index) : (item as any)[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DataTable;
