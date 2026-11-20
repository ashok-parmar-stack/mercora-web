/**
 * @deprecated This file is a compatibility shim.
 * Use `components/data-table/DataTable` directly for the full-featured implementation.
 *
 * BUG-08: The legacy DataTable here used hard-coded Tailwind gray-* classes (broken in dark mode)
 * and lacked sorting, pagination, column picker, bulk actions, and selection.
 * It has been replaced with a re-export of the canonical component.
 */
export {
  DataTable,
  type DataTableProps,
  type Column,
  type BulkAction,
} from "../data-table/DataTable";

// Legacy alias kept for backward compatibility — ColumnDef → Column
export type { Column as ColumnDef } from "../data-table/DataTable";
