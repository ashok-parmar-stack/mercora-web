"use client";

import React from "react";
import Link from "next/link";
import { User, Role } from "@/lib/admin-types";
import { Column } from "@/components/common/DataTable";
import { StatusBadge } from "@/components/status/StatusBadge";
import { Badge, Tooltip } from "@/components/common";
import { Eye, KeyRound, Pencil, Trash2, RotateCcw } from "lucide-react";

export interface UseUserTableColumnsOptions {
  roles: Role[];
  canEdit: boolean;
  canDelete: boolean;
  onViewUser: (u: User) => void;
  onRestoreUser: (u: User) => void;
  onDeleteUser: (u: User) => void;
}

export function useUserTableColumns({
  roles,
  canEdit,
  canDelete,
  onViewUser,
  onRestoreUser,
  onDeleteUser,
}: UseUserTableColumnsOptions) {
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
            onClick={() => onViewUser(u)}
            className="flex items-center gap-3 group/user cursor-pointer select-none"
            title="Click to view user details"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-accent text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-2xs group-hover/user:scale-105 transition-transform">
              {initial}
            </div>
            <div className="min-w-0">
              <div className="font-extrabold text-foreground text-xs truncate group-hover/user:text-primary transition-colors flex items-center gap-1.5">
                <span>{fullName}</span>
                <Eye className="w-3 h-3 text-muted-foreground opacity-0 group-hover/user:opacity-100 transition-opacity" />
              </div>
              <div className="text-[11px] text-muted-foreground truncate">{u.email}</div>
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
        <code className="text-[11px] font-mono text-muted-foreground bg-surface-hover border border-border px-1.5 py-0.5 rounded">
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
        <span className="text-xs text-muted-foreground">
          {u.phone || <span className="text-muted-foreground/40 italic">—</span>}
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
        <span className="text-xs text-muted-foreground">
          {u.createdAt ? new Date(u.createdAt).toLocaleDateString("en-US") : "Not Available"}
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
        <span className="text-xs text-muted-foreground">
          {u.updatedAt ? new Date(u.updatedAt).toLocaleDateString("en-US") : "Not Available"}
        </span>
      ),
    },
  ];

  const renderActions = (u: User) => {
    const isDeleted = Boolean(u.deletedAt);

    if (isDeleted) {
      return (
        <div className="flex items-center gap-1">
          <Tooltip content="View User Details">
            <button
              onClick={() => onViewUser(u)}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-surface-hover transition-colors cursor-pointer"
              aria-label="View user details"
            >
              <Eye className="w-4 h-4" />
            </button>
          </Tooltip>

          <Tooltip content="Restore User">
            <button
              onClick={() => onRestoreUser(u)}
              disabled={!canEdit}
              className="p-1.5 rounded-lg text-status-success hover:bg-status-success/10 transition-colors disabled:opacity-40 cursor-pointer"
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
        <Tooltip content="View User Details">
          <button
            onClick={() => onViewUser(u)}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-hover transition-colors cursor-pointer"
            aria-label="View user details"
          >
            <Eye className="w-4 h-4" />
          </button>
        </Tooltip>

        <Tooltip content="Manage UBAC Permission Overrides">
          <Link
            href={`/admin/users/${encodeURIComponent(u.slug || u.id)}/permissions`}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-hover transition-colors"
            aria-label="User permissions"
          >
            <KeyRound className="w-4 h-4" />
          </Link>
        </Tooltip>

        <Tooltip content="Edit User Profile">
          <Link
            href={`/admin/users/${encodeURIComponent(u.slug || u.id)}/edit`}
            className={`p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-hover transition-colors ${
              !canEdit ? "pointer-events-none opacity-40" : ""
            }`}
            aria-label="Edit user"
          >
            <Pencil className="w-4 h-4" />
          </Link>
        </Tooltip>

        <Tooltip content="Soft-Delete User">
          <button
            onClick={() => onDeleteUser(u)}
            disabled={!canDelete}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-status-error hover:bg-status-error/10 transition-colors disabled:opacity-30 cursor-pointer"
            aria-label="Delete user"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </Tooltip>
      </div>
    );
  };

  return { columns, renderActions };
}
