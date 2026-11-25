"use client";

import React from "react";
import Link from "next/link";
import { Shield, RotateCcw, Key, Pencil, Trash2 } from "lucide-react";
import { Column } from "@/components/data-table/DataTable";
import { StatusBadge } from "@/components/status/StatusBadge";
import { Badge, Tooltip } from "@/components/common";
import { Role } from "@/lib/admin-types";

interface UseRoleTableColumnsProps {
  activePersona: {
    canEdit: boolean;
    canDelete: boolean;
    canManagePermissions?: boolean;
  };
  restoreRole: (id: string) => Promise<any>;
  setDeletingRole: (role: Role) => void;
}

export function getRoleTableColumns(): Column<Role>[] {
  return [
    {
      key: "name",
      header: "Role Definition",
      sortable: true,
      sortAccessor: (role) => role.name?.toLowerCase(),
      minWidth: "200px",
      render: (role) => (
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0 ${
              role.deletedAt
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
  ];
}

export function renderRoleActions(
  role: Role,
  { activePersona, restoreRole, setDeletingRole }: UseRoleTableColumnsProps
) {
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
      <Tooltip content="Configure Permission Matrix">
        <Link
          href={`/admin/roles/${encodeURIComponent(role.code || role.id)}/permissions`}
          className={`p-1.5 rounded-lg text-gray-500 hover:text-brand-600 hover:bg-gray-100 transition-colors ${
            !activePersona.canManagePermissions ? "pointer-events-none opacity-40" : ""
          }`}
          aria-label="Manage permissions"
        >
          <Key className="w-4 h-4" />
        </Link>
      </Tooltip>

      <Tooltip content="Edit Role Details">
        <Link
          href={`/admin/roles/${encodeURIComponent(role.code || role.id)}/edit`}
          className={`p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors ${
            !activePersona.canEdit ? "pointer-events-none opacity-40" : ""
          }`}
          aria-label="Edit role"
        >
          <Pencil className="w-4 h-4" />
        </Link>
      </Tooltip>

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
}
