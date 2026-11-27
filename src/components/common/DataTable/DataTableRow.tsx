"use client";

import React from "react";
import { TableRow, TableCell } from "../Table";
import { cn } from "@/lib/utils";
import { Column } from "./types";

export interface DataTableRowProps<T> {
  item: T;
  columns: Column<T>[];
  itemKey: string;
  isSelected: boolean;
  isDeleted: boolean;
  isSelectionEnabled: boolean;
  onToggleSelect: (key: string) => void;
  renderActions?: (item: T) => React.ReactNode;
}

export function DataTableRow<T>({
  item,
  columns,
  itemKey,
  isSelected,
  isDeleted,
  isSelectionEnabled,
  onToggleSelect,
  renderActions,
}: DataTableRowProps<T>) {
  const rowBg = isSelected
    ? "bg-primary-soft/50"
    : isDeleted
      ? "bg-destructive/5 opacity-75"
      : "bg-surface";

  return (
    <TableRow
      key={itemKey}
      className={cn(
        "transition-colors duration-150 group/row border-b border-border/80",
        rowBg,
        "hover:bg-surface-hover/70"
      )}
    >
      {isSelectionEnabled && (
        <TableCell className="w-11 min-w-[44px] px-3 py-3 text-center">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggleSelect(itemKey)}
            className="w-4 h-4 rounded border-border accent-primary focus:ring-primary/20 focus:ring-offset-0 cursor-pointer transition-all"
            aria-label={`Select row ${itemKey}`}
          />
        </TableCell>
      )}

      {columns.map((col) => {
        const content = col.render ? col.render(item) : (item as any)[col.key] ?? "—";

        return (
          <TableCell
            key={col.key}
            style={{ width: col.width, minWidth: col.minWidth }}
            className={cn(
              "px-4 py-3 align-middle text-xs text-foreground",
              col.align === "right"
                ? "text-right"
                : col.align === "center"
                  ? "text-center"
                  : "text-left",
              col.className
            )}
          >
            {content}
          </TableCell>
        );
      })}

      {renderActions && (
        <TableCell className="w-24 min-w-[90px] px-4 py-3 text-right sticky right-0 bg-surface group-hover/row:bg-surface-hover/70 z-10">
          <div className="flex items-center justify-end gap-1.5">{renderActions(item)}</div>
        </TableCell>
      )}
    </TableRow>
  );
}

export default DataTableRow;
