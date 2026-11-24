"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../ui/Table";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { useUIStore } from "../../lib/store/ui-store";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Check,
  Inbox,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronsUpDown,
  SlidersHorizontal,
  X,
} from "lucide-react";

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  align?: "left" | "center" | "right";
  className?: string;
  sortable?: boolean;
  /** accessor for sorting when render is custom */
  sortAccessor?: (item: T) => string | number | Date | null | undefined;
  width?: string;
  minWidth?: string;
  /** if true, column is hidden by default in column picker */
  hiddenByDefault?: boolean;
}

export interface BulkAction<T> {
  label: string;
  variant?: "danger" | "primary" | "secondary" | "outline";
  icon?: React.ReactNode;
  onClick: (selectedIds: string[], selectedItems: T[]) => void | Promise<void>;
  disabled?: boolean;
  isLoading?: boolean;
}

export interface DataTableProps<T> {
  tableKey: string;
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string;
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
  searchPlaceholder?: string;
  filterSlot?: React.ReactNode;
  renderActions?: (item: T) => React.ReactNode;
  actionsHeader?: string;
  isItemSoftDeleted?: (item: T) => boolean;
  bulkActions?: BulkAction<T>[];
  enableSelection?: boolean;
  defaultPageSize?: number;
  showColumnPicker?: boolean;
  /** Server-side pagination total record count */
  totalCount?: number;
  /** Server-side current page (1-indexed) */
  currentPage?: number;
  /** Server-side page size */
  pageSize?: number;
  /** Server-side page change callback */
  onPageChange?: (page: number) => void;
  /** Server-side page size change callback */
  onPageSizeChange?: (size: number) => void;
  /** Default sorted column key */
  defaultSortKey?: string;
  /** Default sort direction */
  defaultSortDir?: "asc" | "desc";
  /** Controlled sort key */
  sortKey?: string | null;
  /** Controlled sort direction */
  sortDir?: "asc" | "desc" | null;
  /** Server-side or custom sort change callback */
  onSortChange?: (sortKey: string | null, sortDir: "asc" | "desc" | null) => void;
}

type SortDir = "asc" | "desc" | null;

function getSortValue<T>(
  item: T,
  col: Column<T>
): string | number | Date | null | undefined {
  if (col.sortAccessor) return col.sortAccessor(item);
  const val = (item as any)[col.key];
  if (val instanceof Date) return val;
  if (typeof val === "number") return val;
  if (val == null) return null;
  return String(val).toLowerCase();
}

export function DataTable<T>({
  tableKey = "data-table",
  data = [],
  columns = [],
  keyExtractor = (item: any) => item?.id ?? String(item),
  isLoading = false,
  emptyTitle = "No records found",
  emptyDescription = "There are no entries matching your current filters.",
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Search records...",
  filterSlot,
  renderActions,
  actionsHeader = "Actions",
  isItemSoftDeleted,
  bulkActions,
  enableSelection,
  defaultPageSize = 10,
  showColumnPicker = true,
  totalCount,
  currentPage: propCurrentPage,
  pageSize: propPageSize,
  onPageChange,
  onPageSizeChange,
  defaultSortKey,
  defaultSortDir,
  sortKey: propSortKey,
  sortDir: propSortDir,
  onSortChange,
}: DataTableProps<T>) {
  const isSelectionEnabled = enableSelection ?? Boolean(bulkActions && bulkActions.length > 0);
  const selectedRowIds = useUIStore((s) => s.selectedRowIds[tableKey] || []);
  const toggleRowSelection = useUIStore((s) => s.toggleRowSelection);
  const selectAllRows = useUIStore((s) => s.selectAllRows);
  const clearSelection = useUIStore((s) => s.clearSelection);

  // Bulk action executing state
  const [executingActionIdx, setExecutingActionIdx] = useState<number | null>(null);

  // Pagination (Client fallback if server props not passed)
  const [internalCurrentPage, setInternalCurrentPage] = useState(1);
  const [internalPageSize, setInternalPageSize] = useState(defaultPageSize);
  const [isPageSizeOpen, setIsPageSizeOpen] = useState(false);
  const pageSizeRef = useRef<HTMLDivElement>(null);

  const isServerSide = typeof totalCount === "number";
  const pageSize = isServerSide && propPageSize !== undefined ? propPageSize : internalPageSize;
  const currentPage = isServerSide && propCurrentPage !== undefined ? propCurrentPage : internalCurrentPage;

  const handlePageChange = useCallback((p: number) => {
    if (isServerSide && onPageChange) {
      onPageChange(p);
    } else {
      setInternalCurrentPage(p);
    }
  }, [isServerSide, onPageChange]);

  const handlePageSizeChange = useCallback((s: number) => {
    if (isServerSide && onPageSizeChange) {
      onPageSizeChange(s);
    } else {
      setInternalPageSize(s);
      setInternalCurrentPage(1);
    }
  }, [isServerSide, onPageSizeChange]);

  // Sorting: initialize from defaultSortKey/defaultSortDir if provided
  const [internalSortKey, setInternalSortKey] = useState<string | null>(defaultSortKey ?? null);
  const [internalSortDir, setInternalSortDir] = useState<SortDir>(
    defaultSortDir ?? (defaultSortKey ? "asc" : null)
  );

  const sortKey = propSortKey !== undefined ? propSortKey : internalSortKey;
  const sortDir = propSortDir !== undefined ? propSortDir : internalSortDir;

  // Column Visibility
  const [hiddenCols, setHiddenCols] = useState<Set<string>>(
    new Set(columns.filter((c) => c.hiddenByDefault).map((c) => c.key))
  );
  const [isColPickerOpen, setIsColPickerOpen] = useState(false);
  const colPickerRef = useRef<HTMLDivElement>(null);

  const visibleColumns = columns.filter((c) => !hiddenCols.has(c.key));

  // Reset selection when search, filters, pagination page, or data length changes
  useEffect(() => {
    if (selectedRowIds.length > 0) {
      clearSelection(tableKey);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, currentPage, pageSize, data.length, tableKey, clearSelection]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (pageSizeRef.current && !pageSizeRef.current.contains(e.target as Node)) {
        setIsPageSizeOpen(false);
      }
      if (colPickerRef.current && !colPickerRef.current.contains(e.target as Node)) {
        setIsColPickerOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // OPT-05: Clean up store state on unmount to prevent memory growth
  useEffect(() => {
    return () => {
      clearSelection(tableKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableKey]);

  // Sorting handler
  const handleSort = useCallback(
    (key: string) => {
      let nextKey: string | null = key;
      let nextDir: SortDir = "asc";

      if (sortKey !== key) {
        nextKey = key;
        nextDir = "asc";
      } else if (sortDir === "asc") {
        nextKey = key;
        nextDir = "desc";
      } else if (sortDir === "desc") {
        nextKey = null;
        nextDir = null;
      } else {
        nextKey = key;
        nextDir = "asc";
      }

      setInternalSortKey(nextKey);
      setInternalSortDir(nextDir);
      onSortChange?.(nextKey, nextDir);
      handlePageChange(1);
    },
    [sortKey, sortDir, onSortChange, handlePageChange]
  );


  // Sorted data
  const sortedData = React.useMemo(() => {
    if (isServerSide || !sortKey || !sortDir) return data;
    const col = columns.find((c) => c.key === sortKey);
    if (!col) return data;
    const sorted = [...data].sort((a, b) => {
      const av = getSortValue(a, col);
      const bv = getSortValue(b, col);
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      if (av instanceof Date && bv instanceof Date) {
        return sortDir === "asc" ? av.getTime() - bv.getTime() : bv.getTime() - av.getTime();
      }
      if (typeof av === "number" && typeof bv === "number") {
        return sortDir === "asc" ? av - bv : bv - av;
      }
      const aStr = String(av);
      const bStr = String(bv);
      return sortDir === "asc"
        ? aStr.localeCompare(bStr)
        : bStr.localeCompare(aStr);
    });
    return sorted;
  }, [data, sortKey, sortDir, columns, isServerSide]);

  // Pagination calculations
  const totalItems = isServerSide ? totalCount : sortedData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const paginatedData = isServerSide ? data : sortedData.slice(startIndex, startIndex + pageSize);

  const allVisibleIds = paginatedData.map(keyExtractor);
  const isAllSelected =
    allVisibleIds.length > 0 &&
    allVisibleIds.every((id) => selectedRowIds.includes(id));
  const isSomeSelected =
    allVisibleIds.some((id) => selectedRowIds.includes(id)) && !isAllSelected;

  const selectedItems = data.filter((item) =>
    selectedRowIds.includes(keyExtractor(item))
  );

  const toggleColumnVisibility = (key: string) => {
    setHiddenCols((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const colSpan =
    visibleColumns.length +
    (isSelectionEnabled ? 1 : 0) +
    (renderActions ? 1 : 0);

  const handleBulkActionClick = async (act: BulkAction<T>, idx: number) => {
    if (executingActionIdx !== null) return;
    try {
      setExecutingActionIdx(idx);
      await act.onClick(selectedRowIds, selectedItems);
    } catch (err: any) {
      console.error("Bulk action execution failed:", err);
    } finally {
      setExecutingActionIdx(null);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* ── Toolbar ─────────────────────────────── */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-3 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-wrap flex-1 min-w-0">
          {onSearchChange && (
            <div className="min-w-[200px] max-w-sm flex-1">
              <Input
                placeholder={searchPlaceholder}
                value={searchQuery || ""}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  handlePageChange(1);
                }}
                leftIcon={<Search className="w-4 h-4 text-[var(--text-muted)]" />}
              />
            </div>
          )}
          {filterSlot}
        </div>

        {/* Column Picker */}
        {showColumnPicker && columns.length > 1 && (
          <div className="relative flex-shrink-0" ref={colPickerRef}>
            <button
              type="button"
              onClick={() => setIsColPickerOpen((v) => !v)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border transition-all cursor-pointer ${isColPickerOpen
                ? "bg-primary/10 border-primary/30 text-primary dark:bg-primary/20 dark:text-brand-burgundy-light ring-1 ring-primary/20"
                : "bg-surface border-border text-text-secondary hover:bg-surface-hover hover:border-border-focus/40"
                }`}
              title="Toggle column visibility"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Columns</span>
              {hiddenCols.size > 0 && (
                <span className="ml-0.5 px-1.5 py-0.5 rounded-full bg-primary text-white text-[10px] font-bold leading-none">
                  {hiddenCols.size}
                </span>
              )}
            </button>

            {isColPickerOpen && (
              <div className="absolute top-full left-0 sm:left-auto sm:right-0 mt-1.5 w-60 max-w-[calc(100vw-32px)] bg-surface border border-border rounded-xl shadow-xl p-2 z-50 animate-in fade-in-50 zoom-in-95 duration-100 ring-1 ring-black/5 dark:ring-white/10">
                <div className="flex items-center justify-between px-2 py-1.5 border-b border-border mb-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">Visible Columns</span>
                  {hiddenCols.size > 0 && (
                    <button
                      type="button"
                      onClick={() => setHiddenCols(new Set())}
                      className="text-[10px] font-semibold text-primary hover:underline transition-colors"
                    >
                      Show all
                    </button>
                  )}
                </div>
                {columns.map((col) => {
                  const isHidden = hiddenCols.has(col.key);
                  return (
                    <button
                      key={col.key}
                      type="button"
                      onClick={() => toggleColumnVisibility(col.key)}
                      className={`w-full flex items-center justify-between px-2 py-2 rounded-lg text-xs font-medium transition-colors ${isHidden ? "text-text-muted hover:bg-surface-hover" : "text-text-secondary hover:bg-surface-hover hover:text-text-primary"
                        }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {/* mini colored dot for active column */}
                        <span
                          className={`w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors ${!isHidden ? "bg-primary" : "bg-border"
                            }`}
                        />
                        <span className={`truncate ${isHidden ? "line-through opacity-50" : ""}`}>
                          {col.header}
                        </span>
                      </div>
                      {/* Toggle pill */}
                      <div
                        className={`relative inline-flex h-4 w-7 flex-shrink-0 rounded-full transition-colors duration-200 ${!isHidden ? "bg-primary" : "bg-surface-hover border border-border"
                          }`}
                      >
                        <span
                          className={`inline-block h-3 w-3 rounded-full bg-white shadow transform transition-transform duration-200 mt-0.5 ${!isHidden ? "translate-x-3.5" : "translate-x-0.5"
                            }`}
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

      {/* ── Bulk Actions Bar ─────────────────────── */}
      {isSelectionEnabled && selectedRowIds.length > 0 && (
        <div className="bg-surface border border-border rounded-xl px-4 py-2.5 shadow-xs flex items-center justify-between gap-3 animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              {selectedRowIds.length}
            </span>
            <span className="text-xs font-medium text-text-primary">
              {selectedRowIds.length === 1 ? "record selected" : "records selected"}
            </span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {bulkActions?.map((act, idx) => (
              <Button
                key={idx}
                size="sm"
                variant={act.variant || "secondary"}
                onClick={() => handleBulkActionClick(act, idx)}
                disabled={act.disabled || executingActionIdx !== null}
                isLoading={act.isLoading || executingActionIdx === idx}
                leftIcon={act.icon}
              >
                {act.label}
              </Button>
            ))}
            <button
              type="button"
              onClick={() => clearSelection(tableKey)}
              disabled={executingActionIdx !== null}
              className="flex items-center gap-1 text-xs font-medium text-text-secondary hover:text-text-primary px-2.5 py-1.5 rounded-lg border border-border bg-surface hover:bg-surface-hover transition-colors disabled:opacity-40 cursor-pointer"
            >
              <X className="w-3.5 h-3.5 text-text-muted" />
              Clear
            </button>
          </div>
        </div>
      )}

      {/* ── Main Table ───────────────────────────── */}
      <div className="w-full overflow-hidden border border-[var(--border)] rounded-xl bg-[var(--surface)] shadow-xs">
        <Table className="min-w-full">
          {/* ── Header (MUI-Style Clean Design with Vertical Dividers) ── */}
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {/* Checkbox Column with right divider */}
              {isSelectionEnabled && (
                <TableHead className="w-11 min-w-[44px] px-0 py-0 text-center border-b border-[var(--border)]">
                  <div className="flex items-center justify-center h-10 px-3 border-r border-[var(--border)]">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      ref={(el) => {
                        if (el) el.indeterminate = isSomeSelected;
                      }}
                      disabled={isLoading || executingActionIdx !== null || allVisibleIds.length === 0}
                      onChange={() => selectAllRows(tableKey, allVisibleIds)}
                      className="w-4 h-4 rounded border-[var(--border)] accent-[var(--border-focus)] focus:ring-[var(--border-focus)] focus:ring-offset-0 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                      aria-label="Select all visible rows"
                    />
                  </div>
                </TableHead>
              )}

              {/* Data Columns */}
              {visibleColumns.map((col, idx) => {
                const isSortable = col.sortable !== false;
                const isActiveSortCol = sortKey === col.key && Boolean(sortDir);
                const isLastCol = idx === visibleColumns.length - 1;
                return (
                  <TableHead
                    key={col.key}
                    style={{ width: col.width, minWidth: col.minWidth }}
                    className={`px-0 py-0 select-none whitespace-nowrap text-xs tracking-normal border-b border-[var(--border)] ${col.className || ""}`}
                  >
                    <div
                      className={`flex items-center justify-between h-10 px-4 transition-colors ${isSortable ? "cursor-pointer hover:bg-[var(--surface-hover)]" : ""
                        } ${isActiveSortCol ? "bg-[var(--surface-hover)]" : ""}`}
                      onClick={isSortable ? () => handleSort(col.key) : undefined}
                    >
                      <div
                        className={`inline-flex items-center gap-1.5 flex-1 min-w-0 ${col.align === "right"
                            ? "flex-row-reverse justify-end"
                            : col.align === "center"
                              ? "justify-center"
                              : "justify-start"
                          } ${isSortable ? "group/sort" : ""}`}
                      >
                        <span
                          className={`truncate transition-colors ${isActiveSortCol
                              ? "font-bold text-[var(--text-primary)]"
                              : "font-semibold text-[var(--text-secondary)] group-hover/sort:text-[var(--text-primary)]"
                            }`}
                        >
                          {col.header}
                        </span>

                        {/* Sort Indicator: default ArrowUpDown visible on all sortable columns */}
                        {isSortable && (
                          <span className="flex-shrink-0 inline-flex items-center">
                            {isActiveSortCol ? (
                              sortDir === "asc" ? (
                                <ArrowUp className="w-3.5 h-3.5 text-[var(--text-primary)] stroke-[2.5]" />
                              ) : (
                                <ArrowDown className="w-3.5 h-3.5 text-[var(--text-primary)] stroke-[2.5]" />
                              )
                            ) : (
                              <ArrowUpDown className="w-3.5 h-3.5 text-[var(--text-muted)] group-hover/sort:text-[var(--text-secondary)] transition-colors" />
                            )}
                          </span>
                        )}
                      </div>

                      {/* MUI Column Separator Divider (only between columns, never on the last column) */}
                      {!isLastCol && (
                        <div
                          className="h-4 w-[1px] bg-[var(--border-strong)] flex-shrink-0 ml-3"
                          aria-hidden="true"
                        />
                      )}
                    </div>
                  </TableHead>
                );
              })}

              {/* Actions Column */}
              {renderActions && (
                <TableHead className="w-24 min-w-[90px] px-0 py-0 text-right sticky right-0 bg-[var(--background-secondary)] border-b border-[var(--border)] z-10">
                  <div className="flex items-center justify-end h-10 px-4">
                    <span className="font-semibold text-[var(--text-secondary)] text-xs tracking-normal">
                      {actionsHeader}
                    </span>
                  </div>
                </TableHead>
              )}
            </TableRow>
          </TableHeader>

          {/* ── Body ── */}
          <TableBody>
            {isLoading ? (
              Array.from({ length: 6 }).map((_, idx) => (
                <TableRow key={idx}>
                  {isSelectionEnabled && (
                    <TableCell className="w-11 min-w-[44px] px-3 py-3.5 text-center border-r border-[var(--border)]">
                      <div className="w-4 h-4 bg-[var(--surface-hover)] rounded mx-auto relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent" />
                    </TableCell>
                  )}
                  {visibleColumns.map((col, cIdx) => (
                    <TableCell key={col.key} className="px-4 py-3.5 align-middle">
                      <div
                        className="h-3.5 bg-[var(--surface-hover)] rounded-md relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent"
                        style={{ width: cIdx === 0 ? "65%" : cIdx === 1 ? "40%" : "55%" }}
                      />
                      {cIdx === 0 && (
                        <div className="h-2.5 bg-[var(--surface-hover)] rounded w-1/3 mt-2 relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent" />
                      )}
                    </TableCell>
                  ))}
                  {renderActions && (
                    <TableCell className="w-24 min-w-[90px] px-4 py-3.5 text-right sticky right-0 bg-[var(--surface)] z-10">
                      <div className="h-7 w-7 rounded-lg bg-[var(--surface-hover)] ml-auto relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent" />
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={colSpan} className="py-20 text-center text-[var(--text-muted)]">
                  <div className="flex flex-col items-center justify-center gap-3 max-w-sm mx-auto">
                    <div className="w-12 h-12 rounded-2xl bg-[var(--surface-hover)] flex items-center justify-center text-[var(--text-muted)]">
                      <Inbox className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-bold text-[var(--text-primary)] text-sm">{emptyTitle}</div>
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed mt-0.5">
                        {emptyDescription}
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((item, rowIdx) => {
                const key = keyExtractor(item);
                const isSelected = selectedRowIds.includes(key);
                const isDeleted = isItemSoftDeleted ? isItemSoftDeleted(item) : false;
                const isEven = rowIdx % 2 === 0;

                // Solid background color class — uses CSS vars so both themes work automatically
                const rowBg = isSelected
                  ? "bg-[var(--surface-active)]"
                  : isDeleted
                    ? "bg-rose-50 dark:bg-rose-950/20"
                    : isEven
                      ? "bg-[var(--surface)]"
                      : "bg-[var(--background-secondary)]";

                const stickyBg = isSelected
                  ? "bg-[var(--surface-active)]"
                  : isDeleted
                    ? "bg-rose-50 dark:bg-rose-950/20"
                    : isEven
                      ? "bg-[var(--surface)]"
                      : "bg-[var(--background-secondary)]";

                return (
                  <TableRow
                    key={key}
                    className={`transition-colors duration-100 group/row ${rowBg} hover:bg-[var(--table-row-hover)]`}
                  >
                    {/* Row Checkbox */}
                    {isSelectionEnabled && (
                      <TableCell className="w-11 min-w-[44px] px-3 py-3 text-center border-r border-[var(--border)]">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          disabled={isLoading || executingActionIdx !== null}
                          onChange={() => toggleRowSelection(tableKey, key)}
                          className="w-4 h-4 rounded border-[var(--border)] accent-[var(--border-focus)] focus:ring-[var(--border-focus)] focus:ring-offset-0 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                          aria-label={`Select row ${key}`}
                        />
                      </TableCell>
                    )}

                    {/* Data Cells */}
                    {visibleColumns.map((col) => (
                      <TableCell
                        key={col.key}
                        style={{ width: col.width, minWidth: col.minWidth }}
                        className={`px-4 py-3 align-middle ${col.align === "right"
                          ? "text-right"
                          : col.align === "center"
                            ? "text-center"
                            : "text-left"
                          } ${col.className || ""}`}
                      >
                        {col.render ? col.render(item) : (item as any)[col.key] ?? "—"}
                      </TableCell>
                    ))}

                    {/* Action Cells – sticky right column with solid bg */}
                    {renderActions && (
                      <TableCell
                        className={`w-24 min-w-[90px] px-4 py-3 text-right sticky right-0 transition-colors duration-100 z-10 ${stickyBg} group-hover/row:bg-[var(--table-row-hover)]`}
                      >
                        <div className="inline-flex items-center justify-end gap-1">
                          {renderActions(item)}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        {/* ── Pagination Footer ───────────────────── */}
        {!isLoading && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-4 bg-[var(--background-secondary)] border-t border-[var(--border)] text-xs text-[var(--text-muted)]">
            {/* Record count */}
            <div className="text-[var(--text-muted)]">
              Showing{" "}
              <strong className="text-[var(--text-primary)] font-bold">{totalItems === 0 ? 0 : startIndex + 1}</strong> to{" "}
              <strong className="text-[var(--text-primary)] font-bold">
                {totalItems === 0 ? 0 : Math.min(startIndex + pageSize, totalItems)}
              </strong>{" "}
              of{" "}
              <strong className="text-[var(--text-primary)] font-bold">{totalItems}</strong> entries
              {sortKey && sortDir && (
                <span className="ml-2 text-brand-600 dark:text-white font-medium">
                  · sorted by{" "}
                  <span className="font-bold">
                    {columns.find((c) => c.key === sortKey)?.header}
                  </span>{" "}
                  {sortDir === "asc" ? "↑" : "↓"}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Page Size Picker */}
              <div className="relative" ref={pageSizeRef}>
                <button
                  type="button"
                  onClick={() => setIsPageSizeOpen(!isPageSizeOpen)}
                  className="bg-surface border border-border hover:border-border-focus/40 rounded-lg px-2.5 py-1.5 text-xs text-text-primary font-medium flex items-center gap-1.5 shadow-xs focus:outline-none focus:ring-1 focus:ring-[var(--border-focus)] transition-all cursor-pointer"
                >
                  <span>{pageSize} / page</span>
                  <ChevronDown
                    className={`w-3 h-3 text-text-muted transition-transform duration-150 ${isPageSizeOpen ? "rotate-180 text-primary" : ""
                      }`}
                  />
                </button>

                {isPageSizeOpen && (
                  <div className="absolute bottom-full left-0 mb-1.5 w-36 bg-surface border border-border rounded-xl shadow-lg p-1.5 z-30 animate-in fade-in-50 zoom-in-95 duration-100 ring-1 ring-black/5 dark:ring-white/10">
                    {[10, 25, 50, 100].map((size) => {
                      const isActive = pageSize === size;
                      return (
                        <button
                          key={size}
                          type="button"
                          onClick={() => {
                            handlePageSizeChange(size);
                            setIsPageSizeOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors text-left cursor-pointer ${isActive
                            ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-brand-burgundy-light font-semibold"
                            : "text-text-secondary hover:bg-surface-hover hover:text-text-primary"
                            }`}
                        >
                          <span>{size} per page</span>
                          {isActive && <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Page Navigation */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={safeCurrentPage === 1}
                  className="px-2 py-1.5 rounded-lg border border-border bg-surface hover:bg-surface-hover disabled:opacity-30 disabled:cursor-not-allowed text-xs font-medium text-text-secondary transition-colors cursor-pointer"
                  aria-label="First page"
                >
                  «
                </button>
                <button
                  onClick={() => handlePageChange(Math.max(1, safeCurrentPage - 1))}
                  disabled={safeCurrentPage === 1}
                  className="p-1.5 rounded-lg border border-border bg-surface hover:bg-surface-hover disabled:opacity-30 disabled:cursor-not-allowed text-text-secondary transition-colors cursor-pointer"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>

                {/* Page number pills */}
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => {
                      if (totalPages <= 7) return true;
                      if (p === 1 || p === totalPages) return true;
                      if (Math.abs(p - safeCurrentPage) <= 1) return true;
                      return false;
                    })
                    .reduce<(number | "…")[]>((acc, p, idx, arr) => {
                      if (idx > 0 && typeof arr[idx - 1] === "number" && (p as number) - (arr[idx - 1] as number) > 1) {
                        acc.push("…");
                      }
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((p, idx, arr) => {
                      if (p === "…") {
                        // Stable key: use the page number that comes AFTER this ellipsis
                        const nextPage = arr[idx + 1];
                        return (
                          <span key={`ellipsis-before-${nextPage}`} className="w-7 text-center text-text-muted text-xs">
                            …
                          </span>
                        );
                      }
                      return (
                        <button
                          key={p}
                          onClick={() => handlePageChange(p as number)}
                          className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${safeCurrentPage === p
                            ? "bg-primary text-white shadow-xs"
                            : "bg-surface border border-border text-text-secondary hover:bg-surface-hover hover:text-text-primary"
                            }`}
                          aria-current={safeCurrentPage === p ? "page" : undefined}
                        >
                          {p}
                        </button>
                      );
                    })}
                </div>

                <button
                  onClick={() => handlePageChange(Math.min(totalPages, safeCurrentPage + 1))}
                  disabled={safeCurrentPage === totalPages}
                  className="p-1.5 rounded-lg border border-border bg-surface hover:bg-surface-hover disabled:opacity-30 disabled:cursor-not-allowed text-text-secondary transition-colors cursor-pointer"
                  aria-label="Next page"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={safeCurrentPage === totalPages}
                  className="px-2 py-1.5 rounded-lg border border-border bg-surface hover:bg-surface-hover disabled:opacity-30 disabled:cursor-not-allowed text-xs font-medium text-text-secondary transition-colors cursor-pointer"
                  aria-label="Last page"
                >
                  »
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
