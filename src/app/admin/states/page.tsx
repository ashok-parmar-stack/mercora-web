"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  RefreshCw,
  Pencil,
  Trash2,
  Eye,
  X,
} from "lucide-react";
import { useStates } from "../../../lib/hooks/useStates";
import { State } from "@mercora/shared-types";
import { PageHeader } from "../../../components/layout/PageHeader";
import { Button } from "@/components/common";
import { DataTable, Column, BulkAction } from "../../../components/data-table/DataTable";
import { StatusBadge } from "../../../components/status/StatusBadge";
import { Tooltip } from "../../../components/ui/Tooltip";
import {
  ConfirmDialog,
  DeleteConfirmDialog,
  StatusConfirmDialog,
} from "../../../components/common/ConfirmDialog";
import { Select } from "../../../components/ui/Select";
import { useUIStore } from "../../../lib/store/ui-store";

export default function StatesAdminPage() {
  const addToast = useUIStore((s) => s.addToast);
  const {
    states: rawStates,
    pagination,
    isLoading,
    filters,
    updateFilters,
    update,
    remove,
    refetch,
  } = useStates({ initialParams: { page: 1, limit: 10 } });

  const states = Array.isArray(rawStates) ? rawStates : [];

  const [searchTerm, setSearchTerm] = useState(filters?.search || "");
  const [statusFilter, setStatusFilter] = useState(filters?.status || "ALL");

  // Modals
  const [viewingState, setViewingState] = useState<State | null>(null);
  const [deleteConfirmState, setDeleteConfirmState] = useState<State | null>(null);
  const [bulkDeletingIds, setBulkDeletingIds] = useState<string[] | null>(null);
  const [bulkStatusConfirm, setBulkStatusConfirm] = useState<{ ids: string[]; targetStatus: string } | null>(null);

  // Real-time search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (filters?.search !== searchTerm) {
        updateFilters({ search: searchTerm });
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm, filters?.search, updateFilters]);

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    updateFilters({ status: status === "ALL" ? undefined : status });
  };

  // Define Standard Table Columns
  const columns: Column<State>[] = [
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

  // Action Buttons per Row
  const renderActions = (state: State) => (
    <div className="flex items-center justify-end gap-1">
      <Tooltip content="View State Details">
        <button
          type="button"
          onClick={() => setViewingState(state)}
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
          onClick={() => setDeleteConfirmState(state)}
          className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
          aria-label="Delete state"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </Tooltip>
    </div>
  );

  // Bulk Actions
  const bulkActions: BulkAction<State>[] = [
    {
      label: "Mark Active",
      variant: "primary",
      onClick: async (selectedIds) => {
        setBulkStatusConfirm({ ids: selectedIds, targetStatus: "ACTIVE" });
      },
    },
    {
      label: "Mark Inactive",
      variant: "secondary",
      onClick: async (selectedIds) => {
        setBulkStatusConfirm({ ids: selectedIds, targetStatus: "INACTIVE" });
      },
    },
    {
      label: "Delete Selected",
      variant: "danger",
      onClick: async (selectedIds) => {
        setBulkDeletingIds(selectedIds);
      },
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* ── Standard Page Header ── */}
      <PageHeader
        title="State & Province Management"
        description="Master registry for States, Provinces, and Union Territories linked to sovereign country hierarchies."
        actionButton={{
          label: "Create State",
          href: "/admin/states/create",
          icon: <Plus className="w-4 h-4" />,
        }}
        extraActions={
          <Button
            variant="outline"
            size="md"
            onClick={() => refetch()}
            className="w-10 h-10 p-0"
            title="Refresh Registry"
            aria-label="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-primary" : ""}`} />
          </Button>
        }
      />

      {/* ── Standard Mercora Unified DataTable ── */}
      <DataTable<State>
        tableKey="states-table"
        data={states}
        columns={columns}
        keyExtractor={(s) => s.id}
        isLoading={isLoading}
        searchQuery={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search states by name, code, census code..."
        emptyTitle="No states found"
        emptyDescription="There are no states matching your current filter criteria."
        renderActions={renderActions}
        bulkActions={bulkActions}
        showColumnPicker={true}
        totalCount={pagination?.total ?? 0}
        currentPage={pagination?.page ?? 1}
        pageSize={pagination?.limit ?? 10}
        onPageChange={(page) => updateFilters({ page })}
        onPageSizeChange={(limit) => updateFilters({ limit, page: 1 })}
        sortKey={filters?.sort_by ?? null}
        sortDir={filters?.sort_order ? (filters.sort_order.toLowerCase() as "asc" | "desc") : null}
        onSortChange={(key, dir) => {
          updateFilters({
            sort_by: key || undefined,
            sort_order: dir ? (dir.toUpperCase() as "ASC" | "DESC") : undefined,
            page: 1,
          });
        }}
        filterSlot={
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="w-36">
              <Select
                value={statusFilter}
                onChange={(e) => handleStatusFilterChange(e.target.value)}
                dropdownPosition="bottom"
                aria-label="Filter by status"
              >
                <option value="ALL">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </Select>
            </div>
          </div>
        }
      />

      {/* ── View Details Modal ── */}
      {viewingState && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-2">
                <span className="w-7 h-5 rounded bg-indigo-50 border border-indigo-200 text-xs font-bold text-indigo-700 flex items-center justify-center">
                  {viewingState.code}
                </span>
                <h3 className="font-extrabold text-gray-900 text-sm">
                  {viewingState.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setViewingState(null)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-400 font-medium block">State Code</span>
                  <span className="font-mono font-bold text-gray-900 mt-0.5 block">{viewingState.code}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-medium block">Type</span>
                  <span className="font-semibold text-gray-900 mt-0.5 block">{viewingState.type || "STATE"}</span>
                </div>
              </div>

              <div>
                <span className="text-gray-400 font-medium block">Parent Country</span>
                <span className="font-bold text-gray-900 mt-0.5 block">{viewingState.country?.name || "—"}</span>
              </div>

              {viewingState.censusCode && (
                <div>
                  <span className="text-gray-400 font-medium block">Census / LGD Code</span>
                  <span className="font-mono text-gray-900 mt-0.5 block">{viewingState.censusCode}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                <div>
                  <span className="text-gray-400 font-medium block">Data Source</span>
                  <span className="font-mono text-gray-900">{viewingState.source || "MANUAL"}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-medium block">Status</span>
                  <div className="mt-0.5">
                    <StatusBadge status={viewingState.status?.code || "ACTIVE"} />
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-3 bg-gray-50/50 border-t border-gray-100 flex justify-end">
              <button
                type="button"
                onClick={() => setViewingState(null)}
                className="px-4 py-1.5 bg-white border border-gray-200 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-50 transition-colors shadow-2xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Single Delete Confirmation Dialog ── */}
      <DeleteConfirmDialog
        isOpen={Boolean(deleteConfirmState)}
        onClose={() => setDeleteConfirmState(null)}
        entityName={deleteConfirmState?.name}
        entityType="state"
        onConfirm={async () => {
          if (!deleteConfirmState) return;
          try {
            await remove(deleteConfirmState.id);
            addToast("success", "State Deleted", `Successfully removed "${deleteConfirmState.name}"`);
            setDeleteConfirmState(null);
            refetch();
          } catch (err: any) {
            addToast("error", "Delete Failed", err?.message || "Failed to delete state");
          }
        }}
      />

      {/* ── Bulk Delete Confirmation Dialog ── */}
      <DeleteConfirmDialog
        isOpen={Boolean(bulkDeletingIds && bulkDeletingIds.length > 0)}
        onClose={() => setBulkDeletingIds(null)}
        isBulk={true}
        count={bulkDeletingIds?.length || 0}
        entityType="state"
        onConfirm={async () => {
          if (bulkDeletingIds) {
            try {
              await Promise.all(bulkDeletingIds.map((id) => remove(id)));
              addToast("success", "States Deleted", `Successfully removed ${bulkDeletingIds.length} states`);
              setBulkDeletingIds(null);
              refetch();
            } catch (err: any) {
              addToast("error", "Bulk Delete Failed", err?.message || "Failed to delete states");
            }
          }
        }}
      />

      {/* ── Bulk Status Confirmation Dialog ── */}
      <StatusConfirmDialog
        isOpen={Boolean(bulkStatusConfirm)}
        onClose={() => setBulkStatusConfirm(null)}
        isBulk={true}
        count={bulkStatusConfirm?.ids.length || 0}
        entityType="state"
        targetStatus={bulkStatusConfirm?.targetStatus || "ACTIVE"}
        onConfirm={async () => {
          if (bulkStatusConfirm) {
            try {
              await Promise.all(
                bulkStatusConfirm.ids.map((id) =>
                  update(id, { status: bulkStatusConfirm.targetStatus })
                )
              );
              addToast(
                "success",
                "Status Updated",
                `Updated status to ${bulkStatusConfirm.targetStatus} for ${bulkStatusConfirm.ids.length} states`,
              );
              setBulkStatusConfirm(null);
              refetch();
            } catch (err: any) {
              addToast("error", "Status Update Failed", err?.message || "Failed to update state status");
            }
          }
        }}
      />
    </div>
  );
}
