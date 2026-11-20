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
  Sparkles,
} from "lucide-react";
import { useSubDistricts } from "../../../lib/hooks/useSubDistricts";
import { SubDistrict } from "@mercora/shared-types";
import { PageHeader } from "../../../components/layout/PageHeader";
import { DataTable, Column, BulkAction } from "../../../components/data-table/DataTable";
import { StatusBadge } from "../../../components/status/StatusBadge";
import { Tooltip } from "../../../components/ui/Tooltip";
import { syncLgdSubDistricts } from "../../../lib/geography-api";
import {
  DeleteConfirmDialog,
  StatusConfirmDialog,
} from "../../../components/common/ConfirmDialog";
import { Select } from "../../../components/ui/Select";
import { useUIStore } from "../../../lib/store/ui-store";

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
      addToast('success', 'LGD Sub-Districts Sync Complete', res?.message || 'Official sub-districts/talukas synchronized successfully.');
      await refetch();
    } catch (err: any) {
      addToast('error', 'LGD Sub-Districts Sync Failed', err?.message || 'Failed to sync sub-districts.');
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

  // Define Standard Table Columns
  const columns: Column<SubDistrict>[] = [
    {
      key: "name",
      header: "Sub-District / Taluka",
      sortable: true,
      sortAccessor: (subDistrict) => subDistrict.name?.toLowerCase() ?? "",
      render: (subDistrict) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-700 flex items-center justify-center font-bold text-xs flex-shrink-0 border border-cyan-200">
            {subDistrict.code ? subDistrict.code.substring(0, 2) : "SD"}
          </div>
          <div className="min-w-0">
            <div className="font-extrabold text-gray-900 text-xs truncate">{subDistrict.name}</div>
            <div className="text-[11px] text-gray-400 truncate max-w-xs">
              {subDistrict.localName || subDistrict.name}
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
      sortAccessor: (subDistrict) => subDistrict.code ?? "",
      render: (subDistrict) => (
        <span className="inline-block px-2 py-0.5 rounded font-mono font-extrabold text-[11px] bg-cyan-50 text-cyan-700 border border-cyan-200">
          {subDistrict.code}
        </span>
      ),
    },
    {
      key: "district",
      header: "Parent District",
      sortable: true,
      width: "160px",
      sortAccessor: (subDistrict) => subDistrict.district?.name ?? "",
      render: (subDistrict) => (
        <span className="text-xs font-semibold text-gray-800 truncate">
          {subDistrict.district?.name || "—"}
        </span>
      ),
    },
    {
      key: "type",
      header: "Type",
      align: "center",
      sortable: true,
      width: "130px",
      sortAccessor: (subDistrict) => subDistrict.type ?? "",
      render: (subDistrict) => (
        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-gray-100 text-gray-700">
          {subDistrict.type || "SUB_DISTRICT"}
        </span>
      ),
    },
    {
      key: "censusCode",
      header: "Census / LGD",
      align: "center",
      sortable: true,
      width: "130px",
      sortAccessor: (subDistrict) => subDistrict.censusCode ?? "",
      render: (subDistrict) => (
        <span className="font-mono text-gray-600 text-xs">
          {subDistrict.censusCode || "—"}
        </span>
      ),
    },
    {
      key: "source",
      header: "Source",
      align: "center",
      sortable: true,
      width: "110px",
      render: (subDistrict) => (
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-700">
          {subDistrict.source || "MANUAL"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      align: "center",
      sortable: true,
      width: "120px",
      sortAccessor: (subDistrict) => subDistrict.status?.code ?? "ACTIVE",
      render: (subDistrict) => (
        <StatusBadge
          status={subDistrict.status?.code || (subDistrict.statusId ? "ACTIVE" : undefined)}
          isDeleted={Boolean(subDistrict.deletedAt)}
        />
      ),
    },
  ];

  // Action Buttons per Row
  const renderActions = (subDistrict: SubDistrict) => (
    <div className="flex items-center justify-end gap-1">
      <Tooltip content="View Sub-District Details">
        <button
          type="button"
          onClick={() => setViewingSubDistrict(subDistrict)}
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          aria-label="View details"
        >
          <Eye className="w-4 h-4" />
        </button>
      </Tooltip>

      <Tooltip content="Edit Sub-District">
        <Link
          href={`/admin/sub-districts/${subDistrict.id}/edit`}
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          aria-label="Edit sub-district"
        >
          <Pencil className="w-4 h-4" />
        </Link>
      </Tooltip>

      <Tooltip content="Delete Sub-District">
        <button
          type="button"
          onClick={() => setDeleteConfirmSubDistrict(subDistrict)}
          className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
          aria-label="Delete sub-district"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </Tooltip>
    </div>
  );

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
        renderActions={renderActions}
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
      {viewingSubDistrict && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-2">
                <span className="w-7 h-5 rounded bg-cyan-50 border border-cyan-200 text-xs font-bold text-cyan-700 flex items-center justify-center">
                  {viewingSubDistrict.code}
                </span>
                <h3 className="font-extrabold text-gray-900 text-sm">
                  {viewingSubDistrict.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setViewingSubDistrict(null)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-400 font-medium block">Sub-District Code</span>
                  <span className="font-mono font-bold text-gray-900 mt-0.5 block">{viewingSubDistrict.code}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-medium block">Type</span>
                  <span className="font-semibold text-gray-900 mt-0.5 block">{viewingSubDistrict.type || "SUB_DISTRICT"}</span>
                </div>
              </div>

              <div>
                <span className="text-gray-400 font-medium block">Parent District</span>
                <span className="font-bold text-gray-900 mt-0.5 block">{viewingSubDistrict.district?.name || "—"}</span>
              </div>

              {viewingSubDistrict.censusCode && (
                <div>
                  <span className="text-gray-400 font-medium block">Census / LGD Code</span>
                  <span className="font-mono text-gray-900 mt-0.5 block">{viewingSubDistrict.censusCode}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                <div>
                  <span className="text-gray-400 font-medium block">Data Source</span>
                  <span className="font-mono text-gray-900">{viewingSubDistrict.source || "MANUAL"}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-medium block">Status</span>
                  <div className="mt-0.5">
                    <StatusBadge status={viewingSubDistrict.status?.code || "ACTIVE"} />
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-3 bg-gray-50/50 border-t border-gray-100 flex justify-end">
              <button
                type="button"
                onClick={() => setViewingSubDistrict(null)}
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
              addToast("error", "Status Update Failed", err?.message || "Failed to update sub-district status");
            }
          }
        }}
      />
    </div>
  );
}
