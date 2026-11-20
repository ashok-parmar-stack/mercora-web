"use client";

import React from "react";
import { PageHeader } from "../../../../components/layout/PageHeader";
import { RoleForm } from "../../../../components/roles/RoleForm";
import { useRoles } from "../../../../lib/hooks/useRoles";

export default function CreateRolePage() {
  const { createRole } = useRoles();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Create Role"
        description="Define a new organizational role and configure initial permission matrices."
        backHref="/admin/roles"
      />

      <RoleForm
        mode="create"
        onSubmit={async (data) => {
          await createRole({
            code: data.code,
            name: data.name,
            description: data.description,
            priority: data.priority,
          });
        }}
      />
    </div>
  );
}
