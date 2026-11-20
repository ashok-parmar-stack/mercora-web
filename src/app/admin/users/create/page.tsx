"use client";

import React from "react";
import { PageHeader } from "../../../../components/layout/PageHeader";
import { UserForm } from "../../../../components/users/UserForm";
import { useRoles } from "../../../../lib/hooks/useRoles";
import { useStatuses } from "../../../../lib/hooks/useStatuses";
import { useUsers } from "../../../../lib/hooks/useUsers";

export default function CreateUserPage() {
  const { roles, isLoading: rolesLoading } = useRoles();
  const { statuses, isLoading: statusesLoading } = useStatuses({ type: "USER" });
  const { createUser } = useUsers();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Create User Account"
        description="Provision a new enterprise user account and assign role-based authorization."
        backHref="/admin/users"
      />

      <UserForm
        mode="create"
        roles={roles}
        statuses={statuses}
        isLoading={rolesLoading || statusesLoading}
        onSubmit={async (data) => {
          const fullName = [data.firstName, data.lastName].filter(Boolean).join(" ").trim() || (data as any).name || data.email.split("@")[0];
          await createUser({
            name: fullName,
            email: data.email,
            password: data.password!,
            firstName: data.firstName,
            lastName: data.lastName,
            slug: data.slug,
            roleId: data.roleId!,
            statusId: data.statusId,
          });
        }}
      />
    </div>
  );
}
