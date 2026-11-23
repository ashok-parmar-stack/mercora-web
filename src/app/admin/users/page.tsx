"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useUsers } from "../../../lib/hooks/useUsers";
import { useRoles } from "../../../lib/hooks/useRoles";
import { useStatuses } from "../../../lib/hooks/useStatuses";
import { useUIStore } from "../../../lib/store/ui-store";
import { User } from "../../../lib/admin-types";
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
import { UserDetailDrawer } from "../../../components/users/UserDetailDrawer";
import {
  Users,
  Plus,
  Pencil,
  Trash2,
  RotateCcw,
  KeyRound,
  RefreshCw,
  Eye,
  FilterX,
  Phone,
  Calendar,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export default function UsersListPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [includeDeleted, setIncludeDeleted] = useState(false);

  // Modals & Confirmation States
  const [selectedViewUser, setSelectedViewUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [bulkDeletingIds, setBulkDeletingIds] = useState<string[] | null>(null);
  const [statusConfirmUser, setStatusConfirmUser] = useState<{ user: User; targetStatus: string } | null>(null);
  const [bulkStatusConfirm, setBulkStatusConfirm] = useState<{ ids: string[]; targetStatus: string } | null>(null);

  const { users, isLoading, refetch, deleteUser, restoreUser, updateUser } = useUsers({
    roleId: roleFilter !== "ALL" ? roleFilter : undefined,
    statusId: statusFilter !== "ALL" ? statusFilter : undefined,
    includeDeleted,
    search: search.trim() || undefined,
  });
  const { roles } = useRoles();
  const { statuses } = useStatuses("USER");
  const activePersona = useUIStore((s) => s.activePersona);
  const clearSelection = useUIStore((s) => s.clearSelection);

  // Client-side filtering across fields
  const filteredUsers = users.filter((u) => {
    if (!includeDeleted && u.deletedAt) return false;
    if (roleFilter !== "ALL" && u.roleId !== roleFilter) return false;
    if (statusFilter !== "ALL" && u.statusId !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchEmail = u.email.toLowerCase().includes(q);
      const matchSlug = u.slug?.toLowerCase().includes(q);
      const matchName = (u.name || `${u.firstName || ""} ${u.lastName || ""}`).toLowerCase().includes(q);
      const roleName = (u.role?.name || roles.find((r) => r.id === u.roleId)?.name || "").toLowerCase();
      const matchRole = roleName.includes(q);
      if (!matchEmail && !matchSlug && !matchName && !matchRole) return false;
    }
    return true;
  });

  const hasActiveFilters =
    search.trim() !== "" || roleFilter !== "ALL" || statusFilter !== "ALL" || includeDeleted;

  const resetFilters = () => {
    setSearch("");
    setRoleFilter("ALL");
    setStatusFilter("ALL");
    setIncludeDeleted(false);
  };

  // Full table column definitions with proper sorting accessors on every column
  const columns: Column<User>[] = [
    {
      key: "name",
      header: "User Identity",
      sortable: true,
      sortAccessor: (u) =>
        (u.name || `${u.firstName || ""} ${u.lastName || ""}`.trim() || u.email).toLowerCase(),
      minWidth: "240px",
      className: "w-[30%]",
      render: (u) => {
        const fullName =
          u.name || `${u.firstName || ""} ${u.lastName || ""}`.trim() || u.email.split("@")[0] || "Unnamed User";
        const initial = (u.name?.[0] || u.firstName?.[0] || u.email[0] || "U").toUpperCase();
        return (
          <div
            onClick={() => setSelectedViewUser(u)}
            className="flex items-center gap-3 group/user cursor-pointer select-none"
            title="Click to view user details"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-600 to-brand-400 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-2xs group-hover/user:scale-105 transition-transform">
              {initial}
            </div>
            <div className="min-w-0">
              <div className="font-extrabold text-gray-900 text-xs truncate group-hover/user:text-brand-600 transition-colors flex items-center gap-1.5">
                <span>{fullName}</span>
                <Eye className="w-3 h-3 text-gray-300 opacity-0 group-hover/user:opacity-100 transition-opacity" />
              </div>
              <div className="text-[11px] text-gray-500 truncate">{u.email}</div>
            </div>
          </div>
        );
      },
    },
    {
      key: "slug",
      header: "URL Slug",
      sortable: true,
      sortAccessor: (u) => u.slug?.toLowerCase() || "",
      minWidth: "150px",
      className: "w-[18%]",
      render: (u) => (
        <code className="text-[11px] font-mono text-gray-600 bg-gray-50 border border-gray-200 px-1.5 py-0.5 rounded">
          @{u.slug || "-"}
        </code>
      ),
    },
    {
      key: "role",
      header: "Assigned Role",
      sortable: true,
      sortAccessor: (u) =>
        (u.role?.name || roles.find((r) => r.id === u.roleId)?.name || "User").toLowerCase(),
      minWidth: "160px",
      className: "w-[18%]",
      render: (u) => {
        const roleName = u.role?.name || roles.find((r) => r.id === u.roleId)?.name || "User";
        return (
          <Badge variant="purple" size="sm">
            {roleName}
          </Badge>
        );
      },
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      sortAccessor: (u) => (u.deletedAt ? "DELETED" : u.status?.code || "ACTIVE").toLowerCase(),
      minWidth: "130px",
      className: "w-[16%]",
      render: (u) => (
        <StatusBadge
          status={u.status?.code || "ACTIVE"}
          isDeleted={Boolean(u.deletedAt)}
        />
      ),
    },
    {
      key: "phone",
      header: "Phone Number",
      sortable: true,
      sortAccessor: (u) => u.phone || "",
      minWidth: "140px",
      className: "w-[15%]",
      hiddenByDefault: true,
      render: (u) => (
        <span className="text-xs text-gray-500">
          {u.phone || <span className="text-gray-300 italic">—</span>}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Registered",
      sortable: true,
      sortAccessor: (u) => (u.createdAt ? new Date(u.createdAt).getTime() : 0),
      minWidth: "140px",
      className: "w-[18%]",
      render: (u) => (
        <span className="text-xs text-gray-500">
          {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-US') : "Not Available"}
        </span>
      ),
    },
    {
      key: "updatedAt",
      header: "Last Modified",
      sortable: true,
      sortAccessor: (u) => (u.updatedAt ? new Date(u.updatedAt).getTime() : 0),
      minWidth: "140px",
      className: "w-[15%]",
      hiddenByDefault: true,
      render: (u) => (
        <span className="text-xs text-gray-500">
          {u.updatedAt ? new Date(u.updatedAt).toLocaleDateString('en-US') : "Not Available"}
        </span>
      ),
    },
  ];

  const renderActions = (u: User) => {
    const isDeleted = Boolean(u.deletedAt);

    if (isDeleted) {
      return (
        <div className="flex items-center gap-1">
          {/* Quick View */}
          <Tooltip content="View User Details">
            <button
              onClick={() => setSelectedViewUser(u)}
              className="p-1.5 rounded-lg text-gray-500 hover:text-brand-600 hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="View user details"
            >
              <Eye className="w-4 h-4" />
            </button>
          </Tooltip>

          {/* Restore */}
          <Tooltip content="Restore User">
            <button
              onClick={() => restoreUser(u.slug || u.id)}
              disabled={!activePersona.canEdit}
              className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 transition-colors disabled:opacity-40 cursor-pointer"
              aria-label="Restore user"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </Tooltip>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-1">
        {/* Quick View One User at a Time */}
        <Tooltip content="View User Details">
          <button
            onClick={() => setSelectedViewUser(u)}
            className="p-1.5 rounded-lg text-gray-500 hover:text-brand-600 hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="View user details"
          >
            <Eye className="w-4 h-4" />
          </button>
        </Tooltip>

        {/* User UBAC Overrides Page */}
        <Tooltip content="Manage UBAC Permission Overrides">
          <Link
            href={`/admin/users/${encodeURIComponent(u.slug || u.id)}/permissions`}
            className="p-1.5 rounded-lg text-gray-500 hover:text-brand-600 hover:bg-gray-100 transition-colors"
            aria-label="User permissions"
          >
            <KeyRound className="w-4 h-4" />
          </Link>
        </Tooltip>

        {/* Edit User Page */}
        <Tooltip content="Edit User Profile">
          <Link
            href={`/admin/users/${encodeURIComponent(u.slug || u.id)}/edit`}
            className={`p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors ${!activePersona.canEdit ? "pointer-events-none opacity-40" : ""
              }`}
            aria-label="Edit user"
          >
            <Pencil className="w-4 h-4" />
          </Link>
        </Tooltip>

        {/* Delete User */}
        <Tooltip content="Soft-Delete User">
          <button
            onClick={() => setDeletingUser(u)}
            disabled={!activePersona.canDelete}
            className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors disabled:opacity-30 cursor-pointer"
            aria-label="Delete user"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </Tooltip>
      </div>
    );
  };

  const bulkActions: BulkAction<User>[] = [
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
      <PageHeader
        title="User Management"
        description="Manage organizational accounts, assign RBAC access roles, and inspect granular individual UBAC policies."
        actionButton={{
          label: "Add User",
          href: "/admin/users/create",
          icon: <Plus className="w-4 h-4" />,
          disabled: !activePersona.canCreate,
        }}
        extraActions={
          <Button
            size="sm"
            variant="outline"
            onClick={() => refetch()}
            className="h-9 w-9 p-0"
            title="Refresh user directory"
            aria-label="Refresh user directory"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-brand-600" : ""}`} />
          </Button>
        }
      />

      <DataTable<User>
        tableKey="users-table"
        data={filteredUsers}
        columns={columns}
        keyExtractor={(u) => u.slug || u.id}
        isLoading={isLoading}
        searchQuery={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search users by name, email, slug, or role..."
        emptyTitle="No users found"
        emptyDescription={
          hasActiveFilters
            ? "No records matched your active filter criteria. Try adjusting or resetting filters."
            : "No user accounts have been created yet. Click \"Add User\" above to create your first user account."
        }
        isItemSoftDeleted={(u) => Boolean(u.deletedAt)}
        renderActions={renderActions}
        bulkActions={bulkActions}
        filterSlot={
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Role Filter */}
            <div className="w-40">
              <Select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                aria-label="Filter by role"
              >
                <option value="ALL">All Roles</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </Select>
            </div>

            {/* Status Filter */}
            {statuses.length > 0 && (
              <div className="w-40">
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  aria-label="Filter by status"
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

            {/* Show Trash Toggle */}
            <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer select-none bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors shadow-2xs">
              <input
                type="checkbox"
                checked={includeDeleted}
                onChange={(e) => setIncludeDeleted(e.target.checked)}
                className="rounded border-gray-300 accent-brand-600 text-brand-600 focus:ring-brand-500 cursor-pointer w-4 h-4"
              />
              Show Trash
            </label>

            {/* Reset Filters Button */}
            {hasActiveFilters && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={resetFilters}
                className="h-9 px-2.5"
                leftIcon={<FilterX className="w-3.5 h-3.5" />}
                title="Clear all filters"
              >
                Reset
              </Button>
            )}
          </div>
        }
      />

      {/* ── Slide-Over One User View Drawer ── */}
      <UserDetailDrawer
        user={selectedViewUser}
        usersList={filteredUsers}
        isOpen={Boolean(selectedViewUser)}
        onClose={() => setSelectedViewUser(null)}
        onSelectUser={(u) => setSelectedViewUser(u)}
        onDeleteUser={(u) => setDeletingUser(u)}
        onRestoreUser={async (u) => {
          await restoreUser(u.slug || u.id);
          refetch();
          if (selectedViewUser) {
            setSelectedViewUser({ ...selectedViewUser, deletedAt: null });
          }
        }}
        canEdit={activePersona.canEdit}
        canDelete={activePersona.canDelete}
      />

      {/* Single Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={Boolean(deletingUser)}
        onClose={() => setDeletingUser(null)}
        entityName={
          deletingUser
            ? `${deletingUser.name || `${deletingUser.firstName || ""} ${deletingUser.lastName || ""}`.trim() || deletingUser.email.split("@")[0]} (${deletingUser.email})`
            : undefined
        }
        entityType="user"
        onConfirm={async () => {
          if (deletingUser) {
            await deleteUser(deletingUser.slug || deletingUser.id, "soft");
            if (selectedViewUser && (selectedViewUser.id === deletingUser.id || selectedViewUser.slug === deletingUser.slug)) {
              setSelectedViewUser(null);
            }
            setDeletingUser(null);
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
        entityType="user"
        onConfirm={async () => {
          if (bulkDeletingIds) {
            for (const id of bulkDeletingIds) {
              await deleteUser(id, "soft").catch(() => { });
            }
            clearSelection("users-table");
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
        entityType="user"
        targetStatus={bulkStatusConfirm?.targetStatus || "ACTIVE"}
        onConfirm={async () => {
          if (bulkStatusConfirm) {
            const activeStatus = statuses.find((s) => s.code === bulkStatusConfirm.targetStatus);
            if (activeStatus) {
              for (const id of bulkStatusConfirm.ids) {
                await updateUser(id, { statusId: activeStatus.id }).catch(() => { });
              }
            }
            clearSelection("users-table");
            setBulkStatusConfirm(null);
            refetch();
          }
        }}
      />
    </div>
  );
}

