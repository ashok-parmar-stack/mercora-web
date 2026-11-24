"use client";

import React, { useState } from "react";
import { useUsers } from "../../../lib/hooks/useUsers";
import { useRoles } from "../../../lib/hooks/useRoles";
import { useStatuses } from "../../../lib/hooks/useStatuses";
import { useUIStore } from "../../../lib/store/ui-store";
import { User } from "../../../lib/admin-types";
import { PageHeader } from "../../../components/layout/PageHeader";
import { DataTable, BulkAction } from "../../../components/data-table/DataTable";
import { Button } from "@/components/common";
import { UserDetailDrawer } from "../../../components/users/UserDetailDrawer";
import { UsersFilterToolbar } from "@/features/users/components/UsersFilterToolbar";
import { UsersModals } from "@/features/users/components/UsersModals";
import { useUserTableColumns } from "@/features/users/components/useUserTableColumns";
import { Plus, RefreshCw, CheckCircle2, XCircle, Trash2 } from "lucide-react";

export default function UsersListPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [includeDeleted, setIncludeDeleted] = useState(false);

  // Modals & Confirmation States
  const [selectedViewUser, setSelectedViewUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [bulkDeletingIds, setBulkDeletingIds] = useState<string[] | null>(null);
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

  // Client-side filtering
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

  const { columns, renderActions } = useUserTableColumns({
    roles,
    canEdit: activePersona.canEdit,
    canDelete: activePersona.canDelete,
    onViewUser: (u) => setSelectedViewUser(u),
    onRestoreUser: async (u) => {
      await restoreUser(u.slug || u.id);
      refetch();
    },
    onDeleteUser: (u) => setDeletingUser(u),
  });

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
            size="md"
            variant="outline"
            onClick={() => refetch()}
            className="w-10 h-10 p-0"
            title="Refresh user directory"
            aria-label="Refresh user directory"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-primary" : ""}`} />
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
            : 'No user accounts have been created yet. Click "Add User" above to create your first user account.'
        }
        isItemSoftDeleted={(u) => Boolean(u.deletedAt)}
        renderActions={renderActions}
        bulkActions={bulkActions}
        filterSlot={
          <UsersFilterToolbar
            roles={roles}
            statuses={statuses}
            roleFilter={roleFilter}
            statusFilter={statusFilter}
            includeDeleted={includeDeleted}
            hasActiveFilters={hasActiveFilters}
            onRoleFilterChange={setRoleFilter}
            onStatusFilterChange={setStatusFilter}
            onIncludeDeletedChange={setIncludeDeleted}
            onResetFilters={resetFilters}
          />
        }
      />

      {/* Slide-Over Drawer */}
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

      {/* Modals & Dialogs */}
      <UsersModals
        deletingUser={deletingUser}
        bulkDeletingIds={bulkDeletingIds}
        bulkStatusConfirm={bulkStatusConfirm}
        statuses={statuses}
        onCloseDeleteUser={() => setDeletingUser(null)}
        onCloseBulkDelete={() => setBulkDeletingIds(null)}
        onCloseBulkStatus={() => setBulkStatusConfirm(null)}
        onConfirmDeleteUser={async () => {
          if (deletingUser) {
            await deleteUser(deletingUser.slug || deletingUser.id, "soft");
            if (selectedViewUser && (selectedViewUser.id === deletingUser.id || selectedViewUser.slug === deletingUser.slug)) {
              setSelectedViewUser(null);
            }
            setDeletingUser(null);
            refetch();
          }
        }}
        onConfirmBulkDelete={async () => {
          if (bulkDeletingIds) {
            for (const id of bulkDeletingIds) {
              await deleteUser(id, "soft").catch(() => {});
            }
            clearSelection("users-table");
            setBulkDeletingIds(null);
            refetch();
          }
        }}
        onConfirmBulkStatus={async () => {
          if (bulkStatusConfirm) {
            const activeStatus = statuses.find((s) => s.code === bulkStatusConfirm.targetStatus);
            if (activeStatus) {
              for (const id of bulkStatusConfirm.ids) {
                await updateUser(id, { statusId: activeStatus.id }).catch(() => {});
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
