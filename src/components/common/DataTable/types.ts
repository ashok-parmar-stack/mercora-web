import React from "react";

export type SortDir = "asc" | "desc" | null;

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  align?: "left" | "center" | "right";
  className?: string;
  sortable?: boolean;
  /** Accessor for sorting when render is custom */
  sortAccessor?: (item: T) => string | number | Date | null | undefined;
  width?: string;
  minWidth?: string;
  /** If true, column is hidden by default in column picker */
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
