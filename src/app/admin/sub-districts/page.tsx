"use client";

import React, { useState, useEffect } from "react";
import { Plus, RefreshCw, Sparkles } from "lucide-react";
import { useSubDistricts } from "../../../lib/hooks/useSubDistricts";
import { SubDistrict } from "@mercora/shared-types";
import { PageHeader } from "../../../components/layout/PageHeader";
import { DataTable, BulkAction } from "../../../components/data-table/DataTable";
import { syncLgdSubDistricts } from "../../../lib/geography-api";
import {
  DeleteConfirmDialog,
  StatusConfirmDialog,
} from "../../../components/common/ConfirmDialog";
import { Select } from "../../../components/ui/Select";
import { useUIStore } from "../../../lib/store/ui-store";
import {
  getSubDistrictColumns,
  renderSubDistrictRowActions,
} from "@/components/geography/sub-districts/SubDistrictTableColumns";
import { SubDistrictDetailModal } from "@/components/geography/sub-districts/SubDistrictDetailModal";

export default function SubDistrictsAdminPage() {
  const addToast = useUIStore((s) => s.addToast);
  const {
    subDistricts: rawSubDistricts,
    pagination,
    isLoading,
    filters,
    updateFilters,
    update,
    remove,
    refetch,
  } = useSubDistricts({ initialParams: { page: 1, limit: 10 } });

  const subDistricts = Array.isArray(rawSubDistricts) ? rawSubDistricts : [];

  const [searchTerm, setSearchTerm] = useState(filters?.search || "");
  const [statusFilter, setStatusFilter] = useState(filters?.status || "ALL");

  // Modals
  const [viewingSubDistrict, setViewingSubDistrict] = useState<SubDistrict | null>(null);
  const [deleteConfirmSubDistrict, setDeleteConfirmSubDistrict] = useState<SubDistrict | null>(null);
  const [bulkDeletingIds, setBulkDeletingIds] = useState<string[] | null>(null);
  const [bulkStatusConfirm, setBulkStatusConfirm] = useState<{ ids: string[]; targetStatus: string } | null>(null);
  const [isSyncingLgd, setIsSyncingLgd] = useState(false);

  const handleSyncLgd = async () => {
    setIsSyncingLgd(true);
    try {
      const res = await syncLgdSubDistricts();
      addToast("success", "LGD Sub-Districts Sync Complete", res?.message || "Official sub-districts/talukas synchronized successfully.");
      await refetch();
    } catch (err: any) {
      addToast("error", "LGD Sub-Districts Sync Failed", err?.message || "Failed to sync sub-districts.");
    } finally {
      setIsSyncingLgd(false);
    }
  };

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

  const columns = getSubDistrictColumns();

  // Bulk Actions
  const bulkActions: BulkAction<SubDistrict>[] = [
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
        title="Sub-District Management"
        description="Master registry for Sub-Districts, Talukas, Mandals, and Tehsils linked to district hierarchies."
        actionButton={{
          label: "Create Sub-District",
          href: "/admin/sub-districts/create",
          icon: <Plus className="w-4 h-4" />,
        }}
        extraActions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSyncLgd}
              disabled={isSyncingLgd}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg border border-cyan-200 bg-cyan-50 text-cyan-700 hover:bg-cyan-100 transition-colors shadow-2xs disabled:opacity-50 cursor-pointer"
              title="Sync official sub-districts/talukas from Government LGD Directory"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isSyncingLgd ? "animate-spin" : "text-cyan-600"}`} />
              <span>{isSyncingLgd ? "Syncing LGD..." : "Sync from LGD"}</span>
            </button>
            <button
              type="button"
              onClick={() => refetch()}
              className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 transition-colors shadow-2xs cursor-pointer"
              title="Refresh Registry"
              aria-label="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-brand-600" : ""}`} />
            </button>
          </div>
        }
      />

      {/* ── Standard Mercora Unified DataTable ── */}
      <DataTable<SubDistrict>
        tableKey="sub-districts-table"
        data={subDistricts}
        columns={columns}
        keyExtractor={(sd) => sd.id}
        isLoading={isLoading}
        searchQuery={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search sub-districts by name, code, census code..."
        emptyTitle="No sub-districts found"
        emptyDescription="There are no sub-districts matching your current filter criteria."
        renderActions={(subDistrict) =>
          renderSubDistrictRowActions(subDistrict, {
            onView: setViewingSubDistrict,
            onDelete: setDeleteConfirmSubDistrict,
          })
        }
        bulkActions={bulkActions}
        showColumnPicker={true}
        totalCount={pagination?.total ?? 0}
        currentPage={pagination?.page ?? 1}
        pageSize={pagination?.limit ?? 10}
        onPageChange={(page) => updateFilters({ page })}
        onPageSizeChange={(limit) => updateFilters({ limit, page: 1 })}
        filterSlot={
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="w-36">
              <Select
                value={statusFilter}
                selectSize="sm"
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
      <SubDistrictDetailModal
        subDistrict={viewingSubDistrict}
        onClose={() => setViewingSubDistrict(null)}
      />

      {/* ── Single Delete Confirmation Dialog ── */}
      <DeleteConfirmDialog
        isOpen={Boolean(deleteConfirmSubDistrict)}
        onClose={() => setDeleteConfirmSubDistrict(null)}
        entityName={deleteConfirmSubDistrict?.name}
        entityType="sub-district"
        onConfirm={async () => {
          if (!deleteConfirmSubDistrict) return;
          try {
            await remove(deleteConfirmSubDistrict.id);
            addToast("success", "Sub-District Deleted", `Successfully removed "${deleteConfirmSubDistrict.name}"`);
            setDeleteConfirmSubDistrict(null);
            refetch();
          } catch (err: any) {
            addToast("error", "Delete Failed", err?.message || "Failed to delete sub-district");
          }
        }}
      />

      {/* ── Bulk Delete Confirmation Dialog ── */}
      <DeleteConfirmDialog
        isOpen={Boolean(bulkDeletingIds && bulkDeletingIds.length > 0)}
        onClose={() => setBulkDeletingIds(null)}
        isBulk={true}
        count={bulkDeletingIds?.length || 0}
        entityType="sub-district"
        onConfirm={async () => {
          if (bulkDeletingIds) {
            try {
              await Promise.all(bulkDeletingIds.map((id) => remove(id)));
              addToast("success", "Sub-Districts Deleted", `Successfully removed ${bulkDeletingIds.length} sub-districts`);
              setBulkDeletingIds(null);
              refetch();
            } catch (err: any) {
              addToast("error", "Bulk Delete Failed", err?.message || "Failed to delete sub-districts");
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
        entityType="sub-district"
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
                `Updated status to ${bulkStatusConfirm.targetStatus} for ${bulkStatusConfirm.ids.length} sub-districts`,
              );
              setBulkStatusConfirm(null);
              refetch();
            } catch (err: any) {
              addToast("error", "Update Failed", err?.message || "Failed to update sub-district status");
            }
          }
        }}
      />
    </div>
  );
}
