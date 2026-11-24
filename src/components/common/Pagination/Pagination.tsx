"use client";

import React from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
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
  onPageChange,
  showFirstLast = true,
  className = "",
}) => {
  if (totalPages <= 1) return null;

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
    <nav
      role="navigation"
      aria-label="Pagination Navigation"
      className={cn("flex items-center gap-1", className)}
    >
      {showFirstLast && (
        <button
          type="button"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          aria-label="First page"
          className={cn(buttonBase, "border-border bg-surface hover:bg-surface-hover text-text-secondary")}
        >
          <ChevronsLeft className="w-3.5 h-3.5" />
        </button>
      )}

      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
        className={cn(buttonBase, "border-border bg-surface hover:bg-surface-hover text-text-secondary")}
      >
        <ChevronLeft className="w-3.5 h-3.5" />
      </button>

      {getPageNumbers().map((item, idx) =>
        item === "ellipsis" ? (
          <span key={`ellipsis-${idx}`} className="px-2 text-xs text-text-muted select-none">
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
                : "border-border bg-surface hover:bg-surface-hover text-text-secondary hover:text-text-primary"
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
        className={cn(buttonBase, "border-border bg-surface hover:bg-surface-hover text-text-secondary")}
      >
        <ChevronRight className="w-3.5 h-3.5" />
      </button>

      {showFirstLast && (
        <button
          type="button"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          aria-label="Last page"
          className={cn(buttonBase, "border-border bg-surface hover:bg-surface-hover text-text-secondary")}
        >
          <ChevronsRight className="w-3.5 h-3.5" />
        </button>
      )}
    </nav>
  );
};

export default Pagination;
