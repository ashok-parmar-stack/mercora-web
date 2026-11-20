"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "../../../../../components/layout/PageHeader";
import { PermissionMatrix } from "../../../../../components/permissions/PermissionMatrix";
import { Button } from "../../../../../components/ui/Button";
import { useRoleDetails } from "../../../../../lib/hooks/useRoles";
import { usePermissions } from "../../../../../lib/hooks/usePermissions";

export default function RolePermissionsPage() {
  const params = useParams();
  const router = useRouter();
  const idOrCode = (params?.id as string) || "";

  const { role, assignedPermissions, isLoading, savePermissions } = useRoleDetails(idOrCode);
  const { permissions } = usePermissions();

  const [selectedActionIds, setSelectedActionIds] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (assignedPermissions) {
      setSelectedActionIds(new Set(assignedPermissions.map((a) => a.id)));
    }
  }, [assignedPermissions]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await savePermissions(Array.from(selectedActionIds));
      router.push("/admin/roles");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader title="Loading Permissions..." backHref="/admin/roles" />
        <div className="p-12 text-center text-sm text-gray-500 bg-white border border-gray-200 rounded-xl">
          <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          Loading permissions matrix...
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      <PageHeader
        title={`Permission Matrix: ${role?.name || idOrCode}`}
        description={`Configure active capability endpoints and role-level grants for [${role?.code || idOrCode}].`}
        backHref="/admin/roles"
      />

      <PermissionMatrix
        permissions={permissions}
        selectedActionIds={selectedActionIds}
        onChange={setSelectedActionIds}
      />

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 sticky bottom-4 bg-gray-50/90 backdrop-blur-sm p-3 rounded-xl border">
        <Button
          variant="secondary"
          size="md"
          type="button"
          onClick={() => router.push("/admin/roles")}
          disabled={saving}
        >
          Cancel
        </Button>
        <Button variant="primary" size="md" type="button" onClick={handleSave} isLoading={saving}>
          Save Permissions Matrix
        </Button>
      </div>
    </div>
  );
}
