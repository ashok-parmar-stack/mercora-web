"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRoles } from "../../../lib/hooks/useRoles";
import { useStatuses } from "../../../lib/hooks/useStatuses";
import { useUIStore } from "../../../lib/store/ui-store";
import { Role } from "../../../lib/admin-types";
import { PageHeader } from "../../../components/layout/PageHeader";
import { DataTable, Column, BulkAction } from "../../../components/data-table/DataTable";
import { StatusBadge } from "../../../components/status/StatusBadge";
import { Tooltip } from "../../../components/ui/Tooltip";
import {
  ConfirmDialog,
  DeleteConfirmDialog,
  StatusConfirmDialog,
} from "../../../components/common/ConfirmDialog";
import { Badge } from "../../../components/ui/Badge";
import { Select } from "../../../components/ui/Select";
import { Button } from "../../../components/ui/Button";
import {
  Shield,
  Plus,
  Pencil,
  Trash2,
  RotateCcw,
  Key,
  Eye,
  RefreshCw,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export default function RolesListPage() {
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [includeDeleted, setIncludeDeleted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Hooks & Store
  const { roles, isLoading, error, refetch, deleteRole, restoreRole, updateRole } = useRoles({
    statusId: statusFilter !== "ALL" ? statusFilter : undefined,
    includeDeleted,
  });
  const { statuses } = useStatuses("ROLE");
  const activePersona = useUIStore((s) => s.activePersona);
  const clearSelection = useUIStore((s) => s.clearSelection);

  // Dialog States
  const [deletingRole, setDeletingRole] = useState<Role | null>(null);
  const [bulkDeletingIds, setBulkDeletingIds] = useState<string[] | null>(null);
  const [bulkStatusConfirm, setBulkStatusConfirm] = useState<{ ids: string[]; targetStatus: string } | null>(null);

  // Filtered Roles
  const filteredRoles = roles.filter((r) => {
    if (!includeDeleted && r.deletedAt) return false;
    if (statusFilter !== "ALL" && r.statusId !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = r.name.toLowerCase().includes(q);
      const matchCode = r.code.toLowerCase().includes(q);
      const matchDesc = r.description?.toLowerCase().includes(q);
      if (!matchName && !matchCode && !matchDesc) return false;
    }
    return true;
  });

  // Table Columns
  const columns: Column<Role>[] = [
    {
      key: "name",
      header: "Role Definition",
      sortable: true,
      sortAccessor: (role) => role.name?.toLowerCase(),
      minWidth: "200px",
      render: (role) => (
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0 ${role.deletedAt
              ? "bg-red-100 text-red-700"
              : role.isSystem
                ? "bg-purple-100 text-purple-700"
                : "bg-brand-50 text-brand-600"
              }`}
          >
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <div className="font-extrabold text-gray-900 flex items-center gap-1.5">
              <span>{role.name}</span>
              {role.isSystem && (
                <Badge variant="purple" size="sm">
                  System
                </Badge>
              )}
            </div>
            <code className="text-[11px] text-gray-500 font-mono">{role.code}</code>
          </div>
        </div>
      ),
    },
    {
      key: "description",
      header: "Description / Scope",
      sortable: true,
      sortAccessor: (role) => role.description?.toLowerCase() ?? "",
      render: (role) => (
        <span className="text-xs text-gray-600 line-clamp-1 max-w-sm">
          {role.description || <span className="text-gray-400 italic">No description</span>}
        </span>
      ),
    },
    {
      key: "priority",
      header: "Priority",
      align: "center",
      sortable: true,
      sortAccessor: (role) => role.priority ?? 10,
      width: "100px",
      render: (role) => (
        <span className="inline-flex font-extrabold text-xs text-gray-800 bg-gray-100 px-2 py-0.5 rounded">
          {role.priority || 10}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      sortAccessor: (role) => role.status?.code ?? (role.deletedAt ? "DELETED" : "ACTIVE"),
      width: "120px",
      render: (role) => (
        <StatusBadge
          status={role.status?.code || (role.statusId ? "ACTIVE" : undefined)}
          isDeleted={Boolean(role.deletedAt)}
        />
      ),
    },
    {
      key: "createdAt",
      header: "Created",
      sortable: true,
      sortAccessor: (role) => role.createdAt ? new Date(role.createdAt).getTime() : 0,
      width: "120px",
      render: (role) => (
        <span className="text-xs text-gray-500">
          {role.createdAt ? new Date(role.createdAt).toLocaleDateString('en-US') : "Not Available"}
        </span>
      ),
    },
  ];

  // Action Icons with Tooltips
  const renderActions = (role: Role) => {
    const isDeleted = Boolean(role.deletedAt);

    if (isDeleted) {
      return (
        <Tooltip content="Restore Role to Active">
          <button
            onClick={() => restoreRole(role.code || role.id)}
            disabled={!activePersona.canEdit}
            className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 disabled:opacity-40 transition-colors"
            aria-label="Restore role"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </Tooltip>
      );
    }

    return (
      <div className="flex items-center gap-1">
        {/* Permission Matrix */}
        <Tooltip content="Configure Permission Matrix">
          <Link
            href={`/admin/roles/${encodeURIComponent(role.code || role.id)}/permissions`}
            className={`p-1.5 rounded-lg text-gray-500 hover:text-brand-600 hover:bg-gray-100 transition-colors ${!activePersona.canManagePermissions ? "pointer-events-none opacity-40" : ""
              }`}
            aria-label="Manage permissions"
          >
            <Key className="w-4 h-4" />
          </Link>
        </Tooltip>

        {/* Edit Role Page */}
        <Tooltip content="Edit Role Details">
          <Link
            href={`/admin/roles/${encodeURIComponent(role.code || role.id)}/edit`}
            className={`p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors ${!activePersona.canEdit ? "pointer-events-none opacity-40" : ""
              }`}
            aria-label="Edit role"
          >
            <Pencil className="w-4 h-4" />
          </Link>
        </Tooltip>

        {/* Delete Role */}
        <Tooltip content={role.isSystem ? "System roles cannot be deleted" : "Soft-Delete Role"}>
          <button
            onClick={() => setDeletingRole(role)}
            disabled={role.isSystem || !activePersona.canDelete}
            className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            aria-label="Delete role"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </Tooltip>
      </div>
    );
  };

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
            size="sm"
            variant="outline"
            onClick={() => refetch()}
            className="h-9 w-9 p-0"
            title="Refresh list"
            aria-label="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        }
      />

      {/* Main Data Table */}
      <DataTable<Role>
        tableKey="roles-table"
        data={filteredRoles}
        columns={columns}
        keyExtractor={(r) => r.id || r.code}
        isLoading={!mounted || isLoading}
        searchQuery={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search roles by name, code, or description..."
        emptyTitle="No roles found"
        emptyDescription="Create your first role to start managing RBAC access policies."
        isItemSoftDeleted={(r) => Boolean(r.deletedAt)}
        renderActions={renderActions}
        bulkActions={bulkActions}
        filterSlot={
          <div className="flex items-center gap-3 flex-wrap">
            {statuses.length > 0 && (
              <div className="w-44">
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
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

            <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer select-none bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
              <input
                type="checkbox"
                checked={includeDeleted}
                onChange={(e) => setIncludeDeleted(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 accent-brand-600 text-brand-600 focus:ring-brand-500 cursor-pointer"
              />
              Show Trash
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

