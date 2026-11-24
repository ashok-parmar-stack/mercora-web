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
import { useDistricts } from "../../../lib/hooks/useDistricts";
import { District } from "@mercora/shared-types";
import { PageHeader } from "../../../components/layout/PageHeader";
import { Button } from "@/components/common";
import { DataTable, Column, BulkAction } from "../../../components/data-table/DataTable";
import { StatusBadge } from "../../../components/status/StatusBadge";
import { Tooltip } from "../../../components/ui/Tooltip";
import { syncLgdDistricts } from "../../../lib/geography-api";
import {
  ConfirmDialog,
  DeleteConfirmDialog,
  StatusConfirmDialog,
} from "../../../components/common/ConfirmDialog";
import { Select } from "../../../components/ui/Select";
import { useUIStore } from "../../../lib/store/ui-store";

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
      addToast('success', 'LGD Districts Sync Complete', res?.message || 'Official districts synchronized from Government LGD Directory.');
      await refetch();
    } catch (err: any) {
      addToast('error', 'Sync Failed', err?.message || 'Failed to synchronize districts from LGD.');
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
  const columns: Column<District>[] = [
    {
      key: "name",
      header: "District / Province",
      sortable: true,
      sortAccessor: (district) => district.name?.toLowerCase() ?? "",
      render: (district) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-xs flex-shrink-0 border border-teal-200">
            {district.code ? district.code.substring(0, 2) : "DT"}
          </div>
          <div className="min-w-0">
            <div className="font-extrabold text-gray-900 text-xs truncate">{district.name}</div>
            <div className="text-[11px] text-gray-400 truncate max-w-xs">
              {district.localName || district.name}
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
      sortAccessor: (district) => district.code ?? "",
      render: (district) => (
        <span className="inline-block px-2 py-0.5 rounded font-mono font-extrabold text-[11px] bg-teal-50 text-teal-700 border border-teal-200">
          {district.code}
        </span>
      ),
    },
    {
      key: "state",
      header: "Parent State",
      sortable: true,
      width: "160px",
      sortAccessor: (district) => district.state?.name ?? "",
      render: (district) => (
        <span className="text-xs font-semibold text-gray-800 truncate">
          {district.state?.name || "—"}
        </span>
      ),
    },
    {
      key: "type",
      header: "Type",
      align: "center",
      sortable: true,
      width: "130px",
      sortAccessor: (district) => district.type ?? "",
      render: (district) => (
        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-gray-100 text-gray-700">
          {district.type || "DISTRICT"}
        </span>
      ),
    },
    {
      key: "censusCode",
      header: "Census / LGD",
      align: "center",
      sortable: true,
      width: "130px",
      sortAccessor: (district) => district.censusCode ?? "",
      render: (district) => (
        <span className="font-mono text-gray-600 text-xs">
          {district.censusCode || "—"}
        </span>
      ),
    },
    {
      key: "source",
      header: "Source",
      align: "center",
      sortable: true,
      width: "110px",
      render: (district) => (
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-700">
          {district.source || "MANUAL"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      align: "center",
      sortable: true,
      width: "120px",
      sortAccessor: (district) => district.status?.code ?? "ACTIVE",
      render: (district) => (
        <StatusBadge
          status={district.status?.code || (district.statusId ? "ACTIVE" : undefined)}
          isDeleted={Boolean(district.deletedAt)}
        />
      ),
    },
  ];

  // Action Buttons per Row
  const renderActions = (district: District) => (
    <div className="flex items-center justify-end gap-1">
      <Tooltip content="View District Details">
        <button
          type="button"
          onClick={() => setViewingDistrict(district)}
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          aria-label="View details"
        >
          <Eye className="w-4 h-4" />
        </button>
      </Tooltip>

      <Tooltip content="Edit District">
        <Link
          href={`/admin/districts/${district.id}/edit`}
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          aria-label="Edit district"
        >
          <Pencil className="w-4 h-4" />
        </Link>
      </Tooltip>

      <Tooltip content="Delete District">
        <button
          type="button"
          onClick={() => setDeleteConfirmDistrict(district)}
          className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
          aria-label="Delete district"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </Tooltip>
    </div>
  );

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
      {viewingDistrict && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-2">
                <span className="w-7 h-5 rounded bg-teal-50 border border-teal-200 text-xs font-bold text-teal-700 flex items-center justify-center">
                  {viewingDistrict.code}
                </span>
                <h3 className="font-extrabold text-gray-900 text-sm">
                  {viewingDistrict.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setViewingDistrict(null)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-400 font-medium block">District Code</span>
                  <span className="font-mono font-bold text-gray-900 mt-0.5 block">{viewingDistrict.code}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-medium block">Type</span>
                  <span className="font-semibold text-gray-900 mt-0.5 block">{viewingDistrict.type || "DISTRICT"}</span>
                </div>
              </div>

              <div>
                <span className="text-gray-400 font-medium block">Parent State</span>
                <span className="font-bold text-gray-900 mt-0.5 block">{viewingDistrict.state?.name || "—"}</span>
              </div>

              {viewingDistrict.censusCode && (
                <div>
                  <span className="text-gray-400 font-medium block">Census / LGD Code</span>
                  <span className="font-mono text-gray-900 mt-0.5 block">{viewingDistrict.censusCode}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                <div>
                  <span className="text-gray-400 font-medium block">Data Source</span>
                  <span className="font-mono text-gray-900">{viewingDistrict.source || "MANUAL"}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-medium block">Status</span>
                  <div className="mt-0.5">
                    <StatusBadge status={viewingDistrict.status?.code || "ACTIVE"} />
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-3 bg-gray-50/50 border-t border-gray-100 flex justify-end">
              <button
                type="button"
                onClick={() => setViewingDistrict(null)}
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
                `Updated status to ${bulkStatusConfirm.targetStatus} for ${bulkStatusConfirm.ids.length} districts`,
              );
              setBulkStatusConfirm(null);
              refetch();
            } catch (err: any) {
              addToast("error", "Status Update Failed", err?.message || "Failed to update district status");
            }
          }
        }}
      />
    </div>
  );
}
