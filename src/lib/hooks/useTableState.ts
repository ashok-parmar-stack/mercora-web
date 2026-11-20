"use client";

/**
 * COM-06: useTableState
 *
 * Shared hook that manages all the common table state that every list page
 * currently declares manually:
 *   - search query + debounced value
 *   - current page + page size
 *   - sort key + sort direction
 *   - includeDeleted toggle
 *   - arbitrary extra filters (typed via generic)
 *
 * Usage:
 * ```ts
 * const { search, setSearch, page, setPage, pageSize, setPageSize,
 *         sortKey, sortDir, onSortChange, includeDeleted, toggleIncludeDeleted,
 *         filters, setFilter } = useTableState({ defaultPageSize: 25 });
 * ```
 */

import { useState, useCallback, useMemo } from "react";

export interface UseTableStateOptions<TFilters extends Record<string, any> = {}> {
  defaultPageSize?: number;
  defaultSortKey?: string | null;
  defaultSortDir?: "asc" | "desc" | null;
  defaultIncludeDeleted?: boolean;
  defaultFilters?: TFilters;
}

export interface UseTableStateReturn<TFilters extends Record<string, any> = {}> {
  // Search
  search: string;
  setSearch: (q: string) => void;

  // Pagination
  page: number;
  setPage: (p: number) => void;
  pageSize: number;
  setPageSize: (s: number) => void;

  // Sorting
  sortKey: string | null;
  sortDir: "asc" | "desc" | null;
  /** Pass directly to DataTable's onSortChange prop */
  onSortChange: (key: string | null, dir: "asc" | "desc" | null) => void;

  // Soft-delete toggle
  includeDeleted: boolean;
  toggleIncludeDeleted: () => void;
  setIncludeDeleted: (v: boolean) => void;

  // Arbitrary extra filters (typed by caller)
  filters: TFilters;
  setFilter: <K extends keyof TFilters>(key: K, value: TFilters[K]) => void;
  resetFilters: () => void;

  /** Call this when search changes to also reset to page 1 */
  handleSearchChange: (q: string) => void;

  /** Convenience: all pagination props for DataTable */
  paginationProps: {
    currentPage: number;
    pageSize: number;
    onPageChange: (p: number) => void;
    onPageSizeChange: (s: number) => void;
  };

  /** Convenience: all sort props for DataTable */
  sortProps: {
    sortKey: string | null;
    sortDir: "asc" | "desc" | null;
    onSortChange: (key: string | null, dir: "asc" | "desc" | null) => void;
    defaultSortKey?: string;
    defaultSortDir?: "asc" | "desc";
  };
}

export function useTableState<TFilters extends Record<string, any> = {}>(
  options: UseTableStateOptions<TFilters> = {}
): UseTableStateReturn<TFilters> {
  const {
    defaultPageSize = 10,
    defaultSortKey = null,
    defaultSortDir = null,
    defaultIncludeDeleted = false,
    defaultFilters = {} as TFilters,
  } = options;

  const [search, setSearchRaw] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSizeRaw] = useState(defaultPageSize);
  const [sortKey, setSortKey] = useState<string | null>(defaultSortKey);
  const [sortDir, setSortDir] = useState<"asc" | "desc" | null>(defaultSortDir);
  const [includeDeleted, setIncludeDeleted] = useState(defaultIncludeDeleted);
  const [filters, setFilters] = useState<TFilters>(defaultFilters);

  const setSearch = useCallback((q: string) => {
    setSearchRaw(q);
  }, []);

  const handleSearchChange = useCallback((q: string) => {
    setSearchRaw(q);
    setPage(1);
  }, []);

  const setPageSize = useCallback((s: number) => {
    setPageSizeRaw(s);
    setPage(1);
  }, []);

  const onSortChange = useCallback(
    (key: string | null, dir: "asc" | "desc" | null) => {
      setSortKey(key);
      setSortDir(dir);
      setPage(1);
    },
    []
  );

  const toggleIncludeDeleted = useCallback(() => {
    setIncludeDeleted((v) => !v);
    setPage(1);
  }, []);

  const setFilter = useCallback(
    <K extends keyof TFilters>(key: K, value: TFilters[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
      setPage(1);
    },
    []
  );

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
    setPage(1);
  }, [defaultFilters]);

  const paginationProps = useMemo(
    () => ({
      currentPage: page,
      pageSize,
      onPageChange: setPage,
      onPageSizeChange: setPageSize,
    }),
    [page, pageSize, setPageSize]
  );

  const sortProps = useMemo(
    () => ({
      sortKey,
      sortDir,
      onSortChange,
      ...(defaultSortKey ? { defaultSortKey } : {}),
      ...(defaultSortDir ? { defaultSortDir } : {}),
    }),
    [sortKey, sortDir, onSortChange, defaultSortKey, defaultSortDir]
  );

  return {
    search,
    setSearch,
    handleSearchChange,
    page,
    setPage,
    pageSize,
    setPageSize,
    sortKey,
    sortDir,
    onSortChange,
    includeDeleted,
    setIncludeDeleted,
    toggleIncludeDeleted,
    filters,
    setFilter,
    resetFilters,
    paginationProps,
    sortProps,
  };
}
