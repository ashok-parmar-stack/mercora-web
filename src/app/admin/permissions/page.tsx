"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePermissions } from "../../../lib/hooks/usePermissions";
import { Permission } from "../../../lib/admin-types";
import { PageHeader } from "../../../components/layout/PageHeader";
import { DataTable, Column, BulkAction } from "../../../components/data-table/DataTable";
import { StatusBadge } from "../../../components/status/StatusBadge";
import { Tooltip } from "../../../components/ui/Tooltip";
import { Badge } from "../../../components/ui/Badge";
import { DeleteConfirmDialog } from "../../../components/common/ConfirmDialog";
import { useUIStore } from "../../../lib/store/ui-store";
import { Plus, Pencil, Trash2, Key, RefreshCw } from "lucide-react";

export default function PermissionsListPage() {
  const [search, setSearch] = useState("");
  const [deletingPermission, setDeletingPermission] = useState<Permission | null>(null);
  const [bulkDeletingIds, setBulkDeletingIds] = useState<string[] | null>(null);

  const { permissions, isLoading, refetch, deletePermission } = usePermissions();
  const clearSelection = useUIStore((s) => s.clearSelection);

  const filteredPermissions = permissions.filter((p) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchCode = p.code.toLowerCase().includes(q);
      const matchDesc = p.description?.toLowerCase().includes(q);
      if (!matchName && !matchCode && !matchDesc) return false;
    }
    return true;
  });

  const columns: Column<Permission>[] = [
    {
      key: "name",
      header: "Permission Module",
      sortable: true,
      sortAccessor: (p) => p.name?.toLowerCase(),
      render: (p) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-green-50 text-green-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
            <Key className="w-4 h-4" />
          </div>
          <div>
            <div className="font-extrabold text-gray-900 text-xs">{p.name}</div>
            <code className="text-[11px] text-gray-500 font-mono">{p.code}</code>
          </div>
        </div>
      ),
    },
    {
      key: "actions",
      header: "Configured Actions",
      sortable: true,
      sortAccessor: (p) => p.actions?.length || 0,
      render: (p) => (
        <div className="flex items-center gap-1.5 flex-wrap">
          <Badge variant="brand" size="sm">
            {p.actions?.length || 0} actions
          </Badge>
          <span className="text-[11px] text-gray-500 font-mono">
            {p.actions?.map((a) => a.code).slice(0, 4).join(", ")}
            {(p.actions?.length || 0) > 4 ? "..." : ""}
          </span>
        </div>
      ),
    },
    {
      key: "description",
      header: "Description",
      render: (p) => (
        <span className="text-xs text-gray-600 line-clamp-1 max-w-sm">
          {p.description || "-"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (p) => (
        <StatusBadge
          status={p.status?.code || "ACTIVE"}
          isDeleted={Boolean(p.deletedAt)}
        />
      ),
    },
  ];

  const renderActions = (p: Permission) => (
    <div className="flex items-center gap-1">
      <Tooltip content="Edit Permission">
        <Link
          href={`/admin/permissions/${encodeURIComponent(p.code || p.id)}/edit`}
          className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          aria-label="Edit permission"
        >
          <Pencil className="w-4 h-4" />
        </Link>
      </Tooltip>
      <Tooltip content="Delete Permission">
        <button
          onClick={() => setDeletingPermission(p)}
          className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
          aria-label="Delete permission"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </Tooltip>
    </div>
  );

  const bulkActions: BulkAction<Permission>[] = [
    {
      label: "Delete Selected",
      variant: "danger",
      icon: <Trash2 className="w-3.5 h-3.5" />,
      onClick: async (selectedIds) => {
        setBulkDeletingIds(selectedIds);
      },
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Permission Management"
        description="Catalog of domain permission modules and fine-grained action endpoints."
        actionButton={{
          label: "Create Permission",
          href: "/admin/permissions/create",
          icon: <Plus className="w-4 h-4" />,
        }}
        extraActions={
          <button
            onClick={() => refetch()}
            className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 transition-colors shadow-2xs cursor-pointer"
            title="Refresh list"
            aria-label="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>
        }
      />

      <DataTable<Permission>
        tableKey="permissions-table"
        data={filteredPermissions}
        columns={columns}
        keyExtractor={(p) => p.id || p.code}
        isLoading={isLoading}
        searchQuery={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search permissions..."
        emptyTitle="No permissions found"
        emptyDescription="Create your first permission module to attach action endpoints."
        renderActions={renderActions}
        bulkActions={bulkActions}
        defaultSortKey="name"
        defaultSortDir="asc"
      />

      {/* Single Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={Boolean(deletingPermission)}
        onClose={() => setDeletingPermission(null)}
        entityName={deletingPermission?.name}
        entityType="permission module"
        onConfirm={async () => {
          if (deletingPermission) {
            await deletePermission(deletingPermission.code || deletingPermission.id, "soft");
            setDeletingPermission(null);
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
        entityType="permission module"
        onConfirm={async () => {
          if (bulkDeletingIds) {
            for (const id of bulkDeletingIds) {
              await deletePermission(id, "soft").catch(() => {});
            }
            clearSelection("permissions-table");
            setBulkDeletingIds(null);
            refetch();
          }
        }}
      />
    </div>
  );
}
