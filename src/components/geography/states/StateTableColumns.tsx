import React from "react";
import Link from "next/link";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { State } from "@mercora/shared-types";
import { Column } from "@/components/data-table/DataTable";
import { StatusBadge } from "@/components/status/StatusBadge";
import { Tooltip } from "@/components/common";

export function getStateColumns(): Column<State>[] {
  return [
    {
      key: "name",
      header: "State / Province",
      sortable: true,
      sortAccessor: (state) => state.name?.toLowerCase() ?? "",
      render: (state) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800/40 flex items-center justify-center font-bold text-xs flex-shrink-0 border border-indigo-200">
            {state.code ? state.code.substring(0, 2) : "ST"}
          </div>
          <div className="min-w-0">
            <div className="font-extrabold text-[var(--text-primary)] text-xs truncate">{state.name}</div>
            <div className="text-[11px] text-[var(--text-muted)] truncate max-w-xs">
              {state.localName || state.name}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "code",
      header: "Code",
      align: "center",
      sortable: true,
      width: "100px",
      sortAccessor: (state) => state.code ?? "",
      render: (state) => (
        <span className="inline-block px-2 py-0.5 rounded font-mono font-extrabold text-[11px] bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800/40">
          {state.code}
        </span>
      ),
    },
    {
      key: "country",
      header: "Country",
      sortable: true,
      width: "160px",
      sortAccessor: (state) => state.country?.name ?? "",
      render: (state) => (
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-xs font-semibold text-[var(--text-primary)] truncate">
            {state.country?.name || "—"}
          </span>
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      align: "center",
      sortable: true,
      width: "130px",
      sortAccessor: (state) => state.type ?? "",
      render: (state) => (
        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border border-transparent dark:border-gray-700">
          {state.type || "STATE"}
        </span>
      ),
    },
    {
      key: "censusCode",
      header: "Census / LGD",
      align: "center",
      sortable: true,
      width: "130px",
      sortAccessor: (state) => state.censusCode ?? "",
      render: (state) => (
        <span className="font-mono text-[var(--text-secondary)] text-xs">
          {state.censusCode || "—"}
        </span>
      ),
    },
    {
      key: "source",
      header: "Source",
      align: "center",
      sortable: true,
      width: "110px",
      render: (state) => (
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border border-transparent dark:border-gray-700">
          {state.source || "MANUAL"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      align: "center",
      sortable: true,
      width: "120px",
      sortAccessor: (state) => state.status?.code ?? "ACTIVE",
      render: (state) => (
        <StatusBadge
          status={state.status?.code || (state.statusId ? "ACTIVE" : undefined)}
          isDeleted={Boolean(state.deletedAt)}
        />
      ),
    },
  ];
}

export function renderStateRowActions(
  state: State,
  {
    onView,
    onDelete,
  }: {
    onView: (s: State) => void;
    onDelete: (s: State) => void;
  }
) {
  return (
    <div className="flex items-center justify-end gap-1">
      <Tooltip content="View State Details">
        <button
          type="button"
          onClick={() => onView(state)}
          className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
          aria-label="View details"
        >
          <Eye className="w-4 h-4" />
        </button>
      </Tooltip>

      <Tooltip content="Edit State">
        <Link
          href={`/admin/states/${state.id}/edit`}
          className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
          aria-label="Edit state"
        >
          <Pencil className="w-4 h-4" />
        </Link>
      </Tooltip>

      <Tooltip content="Delete State">
        <button
          type="button"
          onClick={() => onDelete(state)}
          className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
          aria-label="Delete state"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </Tooltip>
    </div>
  );
}
