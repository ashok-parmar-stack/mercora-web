"use client";

import React from "react";
import { useParams } from "next/navigation";
import { PageHeader } from "../../../../../components/layout/PageHeader";
import { RoleForm } from "../../../../../components/roles/RoleForm";
import { useRoleDetails, useRoles } from "../../../../../lib/hooks/useRoles";

export default function EditRolePage() {
  const params = useParams();
  const idOrCode = (params?.id as string) || "";

  const { role, assignedPermissions, isLoading, savePermissions } = useRoleDetails(idOrCode);
  const { updateRole } = useRoles();

  const assignedActionIds = assignedPermissions.map((a) => a.id);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader title="Loading Role..." backHref="/admin/roles" />
        <div className="p-12 text-center text-sm text-gray-500 bg-white border border-gray-200 rounded-xl">
          <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          Loading role configuration and permission matrix...
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={`Edit Role: ${role?.name || idOrCode}`}
        description="Update role metadata, priority hierarchy, and fine-grained permissions."
        backHref="/admin/roles"
      />

      <RoleForm
        mode="edit"
        initialRole={role}
        initialPermissionActionIds={assignedActionIds}
        onSubmit={async (data) => {
          await updateRole(idOrCode, {
            code: data.code,
            name: data.name,
            description: data.description,
            priority: data.priority,
            statusId: data.statusId,
          });

          if (data.permissionActionIds) {
            await savePermissions(data.permissionActionIds);
          }
        }}
      />
    </div>
  );
}
