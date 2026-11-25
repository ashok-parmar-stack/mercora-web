"use client";

import React, { useState, useEffect } from "react";
import { Plus, RefreshCw, Sparkles } from "lucide-react";
import { useDistricts } from "../../../lib/hooks/useDistricts";
import { District } from "@mercora/shared-types";
import { PageHeader } from "../../../components/layout/PageHeader";
import { Button } from "@/components/common";
import { DataTable, BulkAction } from "../../../components/data-table/DataTable";
import { syncLgdDistricts } from "../../../lib/geography-api";
import {
  DeleteConfirmDialog,
  StatusConfirmDialog,
} from "../../../components/common/ConfirmDialog";
import { Select } from "../../../components/ui/Select";
import { useUIStore } from "../../../lib/store/ui-store";
import {
  getDistrictColumns,
  renderDistrictRowActions,
} from "@/components/geography/districts/DistrictTableColumns";
import { DistrictDetailModal } from "@/components/geography/districts/DistrictDetailModal";

export default function DistrictsAdminPage() {
  const addToast = useUIStore((s) => s.addToast);
  const {
    districts: rawDistricts,
    pagination,
    isLoading,
    filters,
    updateFilters,
    update,
    remove,
    refetch,
  } = useDistricts({ initialParams: { page: 1, limit: 10 } });

  const districts = Array.isArray(rawDistricts) ? rawDistricts : [];

  const [searchTerm, setSearchTerm] = useState(filters?.search || "");
  const [statusFilter, setStatusFilter] = useState(filters?.status || "ALL");

  // Modals
  const [viewingDistrict, setViewingDistrict] = useState<District | null>(null);
  const [deleteConfirmDistrict, setDeleteConfirmDistrict] = useState<District | null>(null);
  const [bulkDeletingIds, setBulkDeletingIds] = useState<string[] | null>(null);
  const [bulkStatusConfirm, setBulkStatusConfirm] = useState<{ ids: string[]; targetStatus: string } | null>(null);
  const [isSyncingLgd, setIsSyncingLgd] = useState(false);

  const handleSyncLgd = async () => {
    setIsSyncingLgd(true);
    try {
      const res = await syncLgdDistricts();
      addToast("success", "LGD Districts Sync Complete", res?.message || "Official districts synchronized from Government LGD Directory.");
      await refetch();
    } catch (err: any) {
      addToast("error", "Sync Failed", err?.message || "Failed to synchronize districts from LGD.");
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

  const columns = getDistrictColumns();

  // Bulk Actions
  const bulkActions: BulkAction<District>[] = [
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
        title="District Management"
        description="Master registry for Districts, Provinces, and Administrative units linked to sovereign state hierarchies."
        actionButton={{
          label: "Create District",
          href: "/admin/districts/create",
          icon: <Plus className="w-4 h-4" />,
        }}
        extraActions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="md"
              onClick={handleSyncLgd}
              disabled={isSyncingLgd}
              leftIcon={<Sparkles className={`w-3.5 h-3.5 ${isSyncingLgd ? "animate-spin" : "text-teal-600"}`} />}
              title="Sync official districts from Government LGD Directory"
            >
              <span>{isSyncingLgd ? "Syncing LGD..." : "Sync from LGD"}</span>
            </Button>
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
          </div>
        }
      />

      {/* ── Standard Mercora Unified DataTable ── */}
      <DataTable<District>
        tableKey="districts-table"
        data={districts}
        columns={columns}
        keyExtractor={(d) => d.id}
        isLoading={isLoading}
        searchQuery={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search districts by name, code, census code..."
        emptyTitle="No districts found"
        emptyDescription="There are no districts matching your current filter criteria."
        renderActions={(district) =>
          renderDistrictRowActions(district, {
            onView: setViewingDistrict,
            onDelete: setDeleteConfirmDistrict,
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
      <DistrictDetailModal
        district={viewingDistrict}
        onClose={() => setViewingDistrict(null)}
      />

      {/* ── Single Delete Confirmation Dialog ── */}
      <DeleteConfirmDialog
        isOpen={Boolean(deleteConfirmDistrict)}
        onClose={() => setDeleteConfirmDistrict(null)}
        entityName={deleteConfirmDistrict?.name}
        entityType="district"
        onConfirm={async () => {
          if (!deleteConfirmDistrict) return;
          try {
            await remove(deleteConfirmDistrict.id);
            addToast("success", "District Deleted", `Successfully removed "${deleteConfirmDistrict.name}"`);
            setDeleteConfirmDistrict(null);
            refetch();
          } catch (err: any) {
            addToast("error", "Delete Failed", err?.message || "Failed to delete district");
          }
        }}
      />

      {/* ── Bulk Delete Confirmation Dialog ── */}
      <DeleteConfirmDialog
        isOpen={Boolean(bulkDeletingIds && bulkDeletingIds.length > 0)}
        onClose={() => setBulkDeletingIds(null)}
        isBulk={true}
        count={bulkDeletingIds?.length || 0}
        entityType="district"
        onConfirm={async () => {
          if (bulkDeletingIds) {
            try {
              await Promise.all(bulkDeletingIds.map((id) => remove(id)));
              addToast("success", "Districts Deleted", `Successfully removed ${bulkDeletingIds.length} districts`);
              setBulkDeletingIds(null);
              refetch();
            } catch (err: any) {
              addToast("error", "Bulk Delete Failed", err?.message || "Failed to delete districts");
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
        entityType="district"
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
                `Updated ${bulkStatusConfirm.ids.length} districts to ${bulkStatusConfirm.targetStatus}`
              );
              setBulkStatusConfirm(null);
              refetch();
            } catch (err: any) {
              addToast("error", "Update Failed", err?.message || "Failed to update district status");
            }
          }
        }}
      />
    </div>
  );
}
