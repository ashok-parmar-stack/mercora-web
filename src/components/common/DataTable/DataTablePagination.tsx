"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DataTablePaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  startIndex: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
}

export const DataTablePagination: React.FC<DataTablePaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  startIndex,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const endItem = Math.min(startIndex + pageSize, totalItems);
  const startItem = totalItems === 0 ? 0 : startIndex + 1;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-text-secondary select-none pt-2">
      <div className="text-xs">
        Showing <span className="font-semibold text-foreground">{startItem}</span> to{" "}
        <span className="font-semibold text-foreground">{endItem}</span> of{" "}
        <span className="font-semibold text-foreground">{totalItems}</span> entries
      </div>

      <div className="flex items-center gap-3">
        {onPageSizeChange && (
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              className="flex items-center gap-1.5 h-8 px-2.5 rounded-lg border border-border bg-surface hover:bg-surface-hover text-foreground font-medium transition-colors shadow-2xs cursor-pointer"
            >
              <span>{pageSize} / page</span>
              <ChevronsUpDown className="w-3.5 h-3.5 text-muted-foreground" />
            </button>

            {isOpen && (
              <div className="absolute right-0 bottom-full mb-1 w-32 rounded-xl border border-border bg-surface-raised p-1 shadow-xl z-50 animate-in fade-in-50 zoom-in-95 duration-100">
                {pageSizeOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      onPageSizeChange(opt);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "flex items-center justify-between w-full px-2.5 py-1.5 rounded-md text-xs font-medium text-left cursor-pointer transition-colors",
                      opt === pageSize
                        ? "bg-primary-soft text-primary font-semibold"
                        : "text-foreground hover:bg-surface-hover"
                    )}
                  >
                    <span>{opt} / page</span>
                    {opt === pageSize && <Check className="w-3.5 h-3.5 text-primary" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="flex items-center justify-center w-8 h-8 rounded-lg border border-border bg-surface text-foreground hover:bg-surface-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-2xs cursor-pointer"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="px-2.5 text-xs font-semibold text-foreground">
            {currentPage} of {totalPages}
          </span>

          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="flex items-center justify-center w-8 h-8 rounded-lg border border-border bg-surface text-foreground hover:bg-surface-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-2xs cursor-pointer"
            aria-label="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTablePagination;
