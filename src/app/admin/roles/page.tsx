"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRoles } from "../../../lib/hooks/useRoles";
import { useStatuses } from "../../../lib/hooks/useStatuses";
import { useUIStore } from "../../../lib/store/ui-store";
import { Role } from "../../../lib/admin-types";
import { PageHeader } from "../../../components/layout/PageHeader";
import { DataTable, BulkAction } from "../../../components/data-table/DataTable";
import {
  DeleteConfirmDialog,
  StatusConfirmDialog,
} from "../../../components/common/ConfirmDialog";
import { Select, Button } from "@/components/common";
import {
  Plus,
  Trash2,
  RefreshCw,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { getRoleTableColumns, renderRoleActions } from "./components/role-table-columns";

export default function RolesListPage() {
  const [mounted, setMounted] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [includeDeleted, setIncludeDeleted] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState<string | undefined>("name");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("ASC");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Debounce search input by 300ms before sending to server
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Server-driven Hooks & Store
  const {
    roles,
    total,
    isLoading,
    refetch,
    deleteRole,
    restoreRole,
    updateRole,
  } = useRoles({
    statusId: statusFilter !== "ALL" ? statusFilter : undefined,
    includeDeleted,
    search: debouncedSearch.trim() || undefined,
    sortBy,
    sortOrder,
    page,
    limit,
  });

  const { statuses } = useStatuses("ROLE");
  const activePersona = useUIStore((s) => s.activePersona);
  const clearSelection = useUIStore((s) => s.clearSelection);

  // Dialog States
  const [deletingRole, setDeletingRole] = useState<Role | null>(null);
  const [bulkDeletingIds, setBulkDeletingIds] = useState<string[] | null>(null);
  const [bulkStatusConfirm, setBulkStatusConfirm] = useState<{ ids: string[]; targetStatus: string } | null>(null);

  const columns = useMemo(() => getRoleTableColumns(), []);

  const handleRenderActions = (role: Role) =>
    renderRoleActions(role, { activePersona, restoreRole, setDeletingRole });

  // Bulk Actions
  const bulkActions: BulkAction<Role>[] = [
    {
      label: "Activate Selected",
      variant: "primary",
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
      disabled: !activePersona.canEdit,
      onClick: async (selectedIds) => {
        setBulkStatusConfirm({ ids: selectedIds, targetStatus: "ACTIVE" });
      },
    },
    {
      label: "Deactivate Selected",
      variant: "secondary",
      icon: <XCircle className="w-3.5 h-3.5" />,
      disabled: !activePersona.canEdit,
      onClick: async (selectedIds) => {
        setBulkStatusConfirm({ ids: selectedIds, targetStatus: "INACTIVE" });
      },
    },
    {
      label: "Delete Selected",
      variant: "danger",
      icon: <Trash2 className="w-3.5 h-3.5" />,
      disabled: !activePersona.canDelete,
      onClick: async (selectedIds) => {
        setBulkDeletingIds(selectedIds);
      },
    },
  ];
  {
    label: "Activate Selected",
      variant: "primary",
        icon: <CheckCircle2 className="w-3.5 h-3.5" />,
          disabled: !activePersona.canEdit,
            onClick: async (selectedIds) => {
              setBulkStatusConfirm({ ids: selectedIds, targetStatus: "ACTIVE" });
            },
    },
  {
    label: "Deactivate Selected",
      variant: "secondary",
        icon: <XCircle className="w-3.5 h-3.5" />,
          disabled: !activePersona.canEdit,
            onClick: async (selectedIds) => {
              setBulkStatusConfirm({ ids: selectedIds, targetStatus: "INACTIVE" });
            },
    },
  {
    label: "Delete Selected",
      variant: "danger",
        icon: <Trash2 className="w-3.5 h-3.5" />,
          disabled: !activePersona.canDelete,
            onClick: async (selectedIds) => {
              setBulkDeletingIds(selectedIds);
            },
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <PageHeader
        title="Role Management"
        description="Define organizational access roles, hierarchy priorities, and granular permission matrices."
        actionButton={{
          label: "Create Role",
          href: "/admin/roles/create",
          icon: <Plus className="w-4 h-4" />,
          disabled: !activePersona.canCreate,
        }}
        extraActions={
          <Button
            size="md"
            variant="outline"
            onClick={() => refetch()}
            className="w-10 h-10 p-0"
            title="Refresh list"
            aria-label="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-primary" : ""}`} />
          </Button>
        }
      />

      {/* Main Data Table */}
      <DataTable<Role>
        tableKey="roles-table"
        data={roles}
        columns={columns}
        keyExtractor={(r) => String(r.id || r.code)}
        isLoading={!mounted || isLoading}
        searchQuery={searchInput}
        onSearchChange={setSearchInput}
        searchPlaceholder="Search roles by name, code, or description.."
        emptyTitle="No roles found"
        emptyDescription="Create your first role to start managing RBAC access policies."
        isItemSoftDeleted={(r) => Boolean(r.deletedAt)}
        renderActions={handleRenderActions}
        bulkActions={bulkActions}
        showColumnPicker={false}
        totalCount={total}
        currentPage={page}
        pageSize={limit}
        onPageChange={(p) => setPage(p)}
        onPageSizeChange={(newLimit) => {
          setLimit(newLimit);
          setPage(1);
        }}
        sortKey={sortBy}
        sortDir={sortOrder?.toLowerCase() as "asc" | "desc"}
        onSortChange={(colKey, dir) => {
          setSortBy(colKey || undefined);
          setSortOrder(dir ? (dir.toUpperCase() as "ASC" | "DESC") : "ASC");
          setPage(1);
        }}
        filterSlot={
          <div className="flex items-center gap-2.5 flex-wrap">
            {statuses.length > 0 && (
              <div className="w-44">
                <Select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPage(1);
                  }}
                  selectSize="md"
                >
                  <option value="ALL">All Statuses</option>
                  {statuses.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </Select>
              </div>
            )}

            <label className="flex items-center gap-2 text-xs font-semibold text-foreground cursor-pointer select-none bg-surface h-10 px-3 rounded-lg border border-border hover:bg-surface-hover hover:border-border-hover transition-colors shadow-2xs">
              <input
                type="checkbox"
                checked={includeDeleted}
                onChange={(e) => {
                  setIncludeDeleted(e.target.checked);
                  setPage(1);
                }}
                className="w-4 h-4 rounded border-border-strong text-primary accent-primary cursor-pointer focus:ring-1 focus:ring-ring"
              />
              <span>Show Trash</span>
            </label>
          </div>
        }
      />

      {/* Single Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={Boolean(deletingRole)}
        onClose={() => setDeletingRole(null)}
        entityName={deletingRole?.name}
        entityType="role"
        onConfirm={async () => {
          if (deletingRole) {
            await deleteRole(deletingRole.code || deletingRole.id, "soft");
            setDeletingRole(null);
            refetch();
          }
        }}
      />

      {/* Bulk Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={Boolean(bulkDeletingIds && bulkDeletingIds.length > 0)}
        onClose={() => setBulkDeletingIds(null)}
        isBulk={true}
        count={bulkDeletingIds?.length || 0}
        entityType="role"
        onConfirm={async () => {
          if (bulkDeletingIds) {
            for (const id of bulkDeletingIds) {
              await deleteRole(id, "soft").catch(() => { });
            }
            clearSelection("roles-table");
            setBulkDeletingIds(null);
            refetch();
          }
        }}
      />

      {/* Bulk Status Confirmation Dialog */}
      <StatusConfirmDialog
        isOpen={Boolean(bulkStatusConfirm)}
        onClose={() => setBulkStatusConfirm(null)}
        isBulk={true}
        count={bulkStatusConfirm?.ids.length || 0}
        entityType="role"
        targetStatus={bulkStatusConfirm?.targetStatus || "ACTIVE"}
        onConfirm={async () => {
          if (bulkStatusConfirm) {
            const activeStatus = statuses.find((s) => s.code === bulkStatusConfirm.targetStatus);
            if (activeStatus) {
              for (const id of bulkStatusConfirm.ids) {
                await updateRole(id, { statusId: activeStatus.id }).catch(() => { });
              }
            }
            clearSelection("roles-table");
            setBulkStatusConfirm(null);
            refetch();
          }
        }}
      />
    </div>
  );
}

