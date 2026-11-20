"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PageHeader } from "../../../../../components/layout/PageHeader";
import { UserForm } from "../../../../../components/users/UserForm";
import { useUsers } from "../../../../../lib/hooks/useUsers";
import { useRoles } from "../../../../../lib/hooks/useRoles";
import { useStatuses } from "../../../../../lib/hooks/useStatuses";
import { adminApi } from "../../../../../lib/admin-api";
import { User } from "../../../../../lib/admin-types";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function EditUserPage() {
  const params = useParams();
  const idOrSlug = params?.id as string;

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { roles } = useRoles();
  const { statuses } = useStatuses({ type: "USER" });
  const { updateUser } = useUsers();

  const fetchUserData = async () => {
    if (!idOrSlug) return;
    setLoading(true);
    setError(null);
    try {
      const res: any = await adminApi.getUser(idOrSlug);
      const userData = res?.data || res;
      if (!userData || !userData.id) {
        throw new Error("User record not found.");
      }
      setUser(userData);
    } catch (err: any) {
      setError(err?.message || "User record not found.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [idOrSlug]);

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader title="Edit User" backHref="/admin/users" />
        <div className="bg-white border border-gray-200 rounded-xl p-8 flex items-center justify-center gap-3 text-gray-500">
          <RefreshCw className="w-5 h-5 animate-spin text-brand-600" />
          <span>Loading user profile...</span>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader title="Edit User" backHref="/admin/users" />
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-start gap-4 text-red-800">
          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-extrabold text-sm">Unable to load user profile</h4>
            <p className="text-xs text-red-700 mt-1">{error || "User record not found."}</p>
            <button
              onClick={fetchUserData}
              className="mt-3 text-xs font-bold text-red-800 underline hover:no-underline"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={`Edit User: ${(user as any).name || [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email}`}
        description={`Update account profile and system role for ${user.email}.`}
        backHref="/admin/users"
      />

      <UserForm
        mode="edit"
        initialUser={user}
        roles={roles}
        statuses={statuses}
        onSubmit={async (data: any) => {
          const fullName = data.name || [data.firstName, data.lastName].filter(Boolean).join(" ");
          await updateUser(user.slug || user.id, {
            name: fullName || undefined,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            slug: data.slug,
            roleId: data.roleId,
            statusId: data.statusId,
          } as any);
        }}
      />
    </div>
  );
}
