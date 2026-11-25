"use client";

import React, { useState, useEffect } from "react";
import { Plus, RefreshCw } from "lucide-react";
import { useStates } from "../../../lib/hooks/useStates";
import { State } from "@mercora/shared-types";
import { PageHeader } from "../../../components/layout/PageHeader";
import { Button } from "@/components/common";
import { DataTable, BulkAction } from "../../../components/data-table/DataTable";
import {
  DeleteConfirmDialog,
  StatusConfirmDialog,
} from "../../../components/common/ConfirmDialog";
import { Select } from "../../../components/ui/Select";
import { useUIStore } from "../../../lib/store/ui-store";
import {
  getStateColumns,
  renderStateRowActions,
} from "@/components/geography/states/StateTableColumns";
import { StateDetailModal } from "@/components/geography/states/StateDetailModal";

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

  const columns = getStateColumns();

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
        renderActions={(state) =>
          renderStateRowActions(state, {
            onView: setViewingState,
            onDelete: setDeleteConfirmState,
          })
        }
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
      <StateDetailModal
        state={viewingState}
        onClose={() => setViewingState(null)}
      />

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
                `Updated ${bulkStatusConfirm.ids.length} states to ${bulkStatusConfirm.targetStatus}`
              );
              setBulkStatusConfirm(null);
              refetch();
            } catch (err: any) {
              addToast("error", "Update Failed", err?.message || "Failed to update state status");
            }
          }
        }}
      />
    </div>
  );
}
