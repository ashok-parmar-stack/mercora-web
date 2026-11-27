"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Table, TableBody, TableRow, TableCell } from "../Table";
import { useUIStore } from "@/lib/store/ui-store";
import { Column, DataTableProps, SortDir } from "./types";
import { DataTableToolbar } from "./DataTableToolbar";
import { DataTableHeader } from "./DataTableHeader";
import { DataTableRow } from "./DataTableRow";
import { DataTablePagination } from "./DataTablePagination";
import { DataTableEmptyState } from "./DataTableEmptyState";

function getSortValue<T>(item: T, col: Column<T>): string | number | Date | null | undefined {
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

  const [internalCurrentPage, setInternalCurrentPage] = useState(1);
  const [internalPageSize, setInternalPageSize] = useState(defaultPageSize);

  const isServerSide = typeof totalCount === "number";
  const pageSize = isServerSide && propPageSize !== undefined ? propPageSize : internalPageSize;
  const currentPage = isServerSide && propCurrentPage !== undefined ? propCurrentPage : internalCurrentPage;

  const [internalSortKey, setInternalSortKey] = useState<string | null>(defaultSortKey ?? null);
  const [internalSortDir, setInternalSortDir] = useState<SortDir>(defaultSortDir ?? null);

  const sortKey = propSortKey !== undefined ? propSortKey : internalSortKey;
  const sortDir = propSortDir !== undefined ? propSortDir : internalSortDir;

  const [hiddenCols, setHiddenCols] = useState<Set<string>>(() => {
    const s = new Set<string>();
    columns.forEach((c) => {
      if (c.hiddenByDefault) s.add(c.key);
    });
    return s;
  });

  const visibleColumns = useMemo(
    () => columns.filter((c) => !hiddenCols.has(c.key)),
    [columns, hiddenCols]
  );

  useEffect(() => {
    return () => {
      clearSelection(tableKey);
    };
  }, [tableKey, clearSelection]);

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
      }
      setInternalSortKey(nextKey);
      setInternalSortDir(nextDir);
      onSortChange?.(nextKey, nextDir);
      if (onPageChange) onPageChange(1);
      else setInternalCurrentPage(1);
    },
    [sortKey, sortDir, onSortChange, onPageChange]
  );

  const sortedData = useMemo(() => {
    if (isServerSide || !sortKey || !sortDir) return data;
    const col = columns.find((c) => c.key === sortKey);
    if (!col) return data;
    return [...data].sort((a, b) => {
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
      return sortDir === "asc" ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
    });
  }, [data, sortKey, sortDir, columns, isServerSide]);

  const totalItems = isServerSide ? totalCount! : sortedData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const paginatedData = isServerSide ? data : sortedData.slice(startIndex, startIndex + pageSize);

  const allVisibleIds = paginatedData.map(keyExtractor);
  const isAllSelected = allVisibleIds.length > 0 && allVisibleIds.every((id) => selectedRowIds.includes(id));
  const isSomeSelected = allVisibleIds.some((id) => selectedRowIds.includes(id)) && !isAllSelected;
  const selectedItems = data.filter((item) => selectedRowIds.includes(keyExtractor(item)));

  const colSpan = visibleColumns.length + (isSelectionEnabled ? 1 : 0) + (renderActions ? 1 : 0);

  return (
    <div className="flex flex-col gap-3.5 w-full">
      <DataTableToolbar
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        searchPlaceholder={searchPlaceholder}
        filterSlot={filterSlot}
        showColumnPicker={showColumnPicker}
        columns={columns}
        hiddenCols={hiddenCols}
        onToggleColumn={(key) =>
          setHiddenCols((prev) => {
            const next = new Set(prev);
            if (next.has(key)) next.delete(key);
            else next.add(key);
            return next;
          })
        }
        selectedRowIds={selectedRowIds}
        selectedItems={selectedItems}
        bulkActions={bulkActions}
        onClearSelection={() => clearSelection(tableKey)}
      />

      <div className="w-full overflow-hidden border border-border rounded-xl bg-surface shadow-xs">
        <Table className="min-w-full">
          <DataTableHeader
            columns={visibleColumns}
            isSelectionEnabled={isSelectionEnabled}
            isAllSelected={isAllSelected}
            isSomeSelected={isSomeSelected}
            onSelectAll={() => selectAllRows(tableKey, allVisibleIds)}
            isLoading={isLoading}
            hasVisibleRows={allVisibleIds.length > 0}
            sortKey={sortKey}
            sortDir={sortDir}
            onSort={handleSort}
            renderActions={Boolean(renderActions)}
            actionsHeader={actionsHeader}
          />

          <TableBody>
            {isLoading ? (
              Array.from({ length: 6 }).map((_, idx) => (
                <TableRow key={idx}>
                  {isSelectionEnabled && (
                    <TableCell className="w-11 min-w-[44px] px-3 py-3.5 text-center">
                      <div className="w-4 h-4 bg-surface-hover rounded mx-auto animate-pulse" />
                    </TableCell>
                  )}
                  {visibleColumns.map((col, cIdx) => (
                    <TableCell key={col.key} className="px-4 py-3.5 align-middle">
                      <div
                        className="h-3.5 bg-surface-hover rounded-md animate-pulse"
                        style={{ width: cIdx === 0 ? "65%" : cIdx === 1 ? "40%" : "55%" }}
                      />
                    </TableCell>
                  ))}
                  {renderActions && (
                    <TableCell className="w-24 min-w-[90px] px-4 py-3.5 text-right sticky right-0 bg-surface z-10">
                      <div className="h-7 w-7 rounded-lg bg-surface-hover ml-auto animate-pulse" />
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={colSpan} className="p-0 text-center">
                  <DataTableEmptyState title={emptyTitle} description={emptyDescription} />
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((item) => {
                const key = keyExtractor(item);
                return (
                  <DataTableRow
                    key={key}
                    item={item}
                    columns={visibleColumns}
                    itemKey={key}
                    isSelected={selectedRowIds.includes(key)}
                    isDeleted={Boolean(isItemSoftDeleted?.(item))}
                    isSelectionEnabled={isSelectionEnabled}
                    onToggleSelect={(k) => toggleRowSelection(tableKey, k)}
                    renderActions={renderActions}
                  />
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination
        currentPage={safeCurrentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        startIndex={startIndex}
        pageSize={pageSize}
        onPageChange={(p) => (onPageChange ? onPageChange(p) : setInternalCurrentPage(p))}
        onPageSizeChange={onPageSizeChange || setInternalPageSize}
      />
    </div>
  );
}

export default DataTable;
