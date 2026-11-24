"use client";

import React from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  className?: string;
}

/**
 * Linear-Inspired Pagination Component
 * Clean number pills, previous/next controls, and active state highlights.
 */
export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize = 10,
  onPageChange,
  showFirstLast = true,
  className = "",
}) => {
  if (totalPages <= 1 && !totalItems) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems ?? currentPage * pageSize);

  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("ellipsis");

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }

      if (currentPage < totalPages - 2) pages.push("ellipsis");
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }
    return pages;
  };

  const buttonBase =
    "inline-flex items-center justify-center h-8 min-w-[2rem] px-2 text-xs font-medium rounded-lg transition-colors border select-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <div className={cn("flex flex-col sm:flex-row items-center justify-between gap-3 py-2 select-none", className)}>
      {totalItems !== undefined && (
        <p className="text-xs text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{startItem}</span> to{" "}
          <span className="font-semibold text-foreground">{endItem}</span> of{" "}
          <span className="font-semibold text-foreground">{totalItems}</span> results
        </p>
      )}

      {totalPages > 1 && (
        <nav
          role="navigation"
          aria-label="Pagination Navigation"
          className="flex items-center gap-1"
        >
          {showFirstLast && (
            <button
              type="button"
              onClick={() => onPageChange(1)}
              disabled={currentPage === 1}
              aria-label="First page"
              className={cn(buttonBase, "border-border bg-surface hover:bg-surface-hover text-muted-foreground hover:text-foreground")}
            >
              <ChevronsLeft className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous page"
            className={cn(buttonBase, "border-border bg-surface hover:bg-surface-hover text-muted-foreground hover:text-foreground")}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          {getPageNumbers().map((item, idx) =>
            item === "ellipsis" ? (
              <span key={`ellipsis-${idx}`} className="px-2 text-xs text-muted-foreground select-none">
                …
              </span>
            ) : (
              <button
                key={`page-${item}`}
                type="button"
                onClick={() => onPageChange(item)}
                aria-current={item === currentPage ? "page" : undefined}
                className={cn(
                  buttonBase,
                  item === currentPage
                    ? "bg-primary text-primary-foreground border-transparent font-semibold shadow-xs"
                    : "border-border bg-surface hover:bg-surface-hover text-muted-foreground hover:text-foreground"
                )}
              >
                {item}
              </button>
            )
          )}

          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Next page"
            className={cn(buttonBase, "border-border bg-surface hover:bg-surface-hover text-muted-foreground hover:text-foreground")}
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          {showFirstLast && (
            <button
              type="button"
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage === totalPages}
              aria-label="Last page"
              className={cn(buttonBase, "border-border bg-surface hover:bg-surface-hover text-muted-foreground hover:text-foreground")}
            >
              <ChevronsRight className="w-3.5 h-3.5" />
            </button>
          )}
        </nav>
      )}
    </div>
  );
};

export default Pagination;
