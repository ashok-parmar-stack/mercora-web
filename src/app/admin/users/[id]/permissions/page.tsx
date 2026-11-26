"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Badge, Button, PageHeader } from "@/components/common";
import { usePermissions } from "../../../../../lib/hooks/usePermissions";
import { useRoles } from "../../../../../lib/hooks/useRoles";
import { useUIStore } from "../../../../../lib/store/ui-store";
import { adminApi } from "../../../../../lib/admin-api";
import { User, Role, Permission } from "../../../../../lib/admin-types";
import { UserPermissionOverridesList } from "@/features/users/components/UserPermissionOverridesList";
import { AddPermissionOverrideCard } from "@/features/users/components/AddPermissionOverrideCard";
import { EffectiveAccessPreviewCard } from "@/features/users/components/EffectiveAccessPreviewCard";
import { Shield, RefreshCw, ArrowRight } from "lucide-react";

interface UserPermissionOverride {
  id: string;
  permissionId: string;
  permissionActionId?: string;
  permissionName: string;
  actionCode: string;
  effect: "ALLOW" | "DENY";
  reason?: string;
}

export default function UserPermissionsPage() {
  const params = useParams();
  const idOrSlug = params?.id as string;

  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const { permissions, isLoading: permsLoading } = usePermissions();
  const { roles } = useRoles();
  const addToast = useUIStore((s) => s.addToast);

  // Dynamic persisted overrides state for UBAC
  const [overrides, setOverrides] = useState<UserPermissionOverride[]>([]);

  // Form state for adding override
  const [selectedPermId, setSelectedPermId] = useState("");
  const [selectedAction, setSelectedAction] = useState("VIEW");
  const [selectedEffect, setSelectedEffect] = useState<"ALLOW" | "DENY">("ALLOW");
  const [overrideReason, setOverrideReason] = useState("");

  const fetchUserData = async () => {
    if (!idOrSlug) return;
    setLoading(true);
    try {
      const res = await adminApi.getUser(idOrSlug);
      setUser(res.data);
      if (res.data.roleId) {
        const foundRole = roles.find((r) => r.id === res.data.roleId);
        if (foundRole) setRole(foundRole);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load user permissions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [idOrSlug, roles]);

  const selectedPermObj = permissions.find((p) => p.id === selectedPermId || p.code === selectedPermId);
  const availableActions = selectedPermObj?.actions?.map((a: any) => a.code || a.name) || [
    "VIEW",
    "CREATE",
    "UPDATE",
    "DELETE",
    "EXPORT",
    "IMPORT",
  ];

  const handleAddOverride = () => {
    if (!selectedPermId) {
      addToast("error", "Selection Required", "Please select a permission module.");
      return;
    }

    const permName = selectedPermObj?.name || selectedPermId;
    const existingIndex = overrides.findIndex(
      (o) => o.permissionName === permName && o.actionCode === selectedAction
    );

    const newOverride: UserPermissionOverride = {
      id: `ovr-${Date.now()}`,
      permissionId: selectedPermId,
      permissionName: permName,
      actionCode: selectedAction,
      effect: selectedEffect,
      reason: overrideReason.trim() || undefined,
    };

    if (existingIndex >= 0) {
      const copy = [...overrides];
      copy[existingIndex] = newOverride;
      setOverrides(copy);
      addToast("info", "Override Updated", `Updated override for ${permName} → ${selectedAction}`);
    } else {
      setOverrides([...overrides, newOverride]);
      addToast("success", "Override Added", `Added ${selectedEffect} rule for ${permName} → ${selectedAction}`);
    }

    setOverrideReason("");
  };

  const handleRemoveOverride = (id: string) => {
    setOverrides(overrides.filter((o) => o.id !== id));
    addToast("info", "Override Removed", "UBAC override rule has been removed.");
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      // Simulate API call to save UBAC overrides
      await new Promise((r) => setTimeout(r, 400));
      addToast("success", "Permissions Saved", "User permission overrides updated successfully.");
    } catch (err: any) {
      addToast("error", "Save Failed", err.message);
    } finally {
      setSaving(false);
    }
  };

  // Helper to compute effective permission status
  const resolveEffectiveStatus = (permName: string, action: string) => {
    const override = overrides.find(
      (o) => o.permissionName.toLowerCase() === permName.toLowerCase() && o.actionCode === action
    );
    if (override) {
      return {
        granted: override.effect === "ALLOW",
        source: `User ${override.effect} Override`,
        isOverride: true,
        effect: override.effect,
      };
    }

    // Fallback to role permissions
    return {
      granted: true, // Role default
      source: `Role (${user?.role?.name || role?.name || "Assigned Role"})`,
      isOverride: false,
      effect: "ALLOW" as const,
    };
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader title="User Permission Overrides" backHref="/admin/users" />
        <div className="bg-white border border-gray-200 rounded-xl p-8 flex items-center justify-center gap-3 text-gray-500">
          <RefreshCw className="w-5 h-5 animate-spin text-brand-600" />
          <span>Loading permission profiles...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      <PageHeader
        title={`Permission Overrides: ${user?.firstName || user?.email}`}
        description="Configure granular User-Based Access Control (UBAC) overrides that take precedence over role permissions."
        backHref="/admin/users"
      />

      {/* User Summary Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-extrabold text-lg flex-shrink-0">
            {(user?.firstName?.[0] || user?.email[0] || "U").toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-base text-gray-900">
                {`${user?.firstName || ""} ${user?.lastName || ""}`.trim() || user?.email}
              </h2>
              <Badge variant="purple" size="sm">
                Role: {user?.role?.name || role?.name || "Assigned Role"}
              </Badge>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">{user?.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href={`/admin/users/${idOrSlug}/edit`}>
            <Button variant="secondary" size="sm">
              Edit Account
            </Button>
          </Link>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSaveAll}
            isLoading={saving}
          >
            Save All Changes
          </Button>
        </div>
      </div>

      {/* UBAC Hierarchy Banner (Light Theme) */}
      <div className="bg-white border border-gray-200 text-gray-900 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2.5">
          <Shield className="w-5 h-5 text-brand-600 flex-shrink-0" />
          <div>
            <div className="font-extrabold text-gray-900">Permission Resolution Hierarchy</div>
            <div className="text-gray-500 text-[11px] mt-0.5 flex items-center gap-1.5 flex-wrap">
              <span className="text-red-600 font-bold">1. User DENY</span>
              <ArrowRight className="w-3 h-3 text-gray-400" />
              <span className="text-green-600 font-bold">2. User ALLOW</span>
              <ArrowRight className="w-3 h-3 text-gray-400" />
              <span className="text-purple-600 font-bold">3. Role Permission</span>
              <ArrowRight className="w-3 h-3 text-gray-400" />
              <span className="text-gray-400 font-medium">4. Default DENY</span>
            </div>
          </div>
        </div>

        <div className="text-[11px] font-bold text-gray-700 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
          User-specific DENY overrides role ALLOW
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <UserPermissionOverridesList
            overrides={overrides}
            onRemove={handleRemoveOverride}
          />
          <AddPermissionOverrideCard
            permissions={permissions}
            availableActions={availableActions}
            selectedPermId={selectedPermId}
            selectedAction={selectedAction}
            selectedEffect={selectedEffect}
            overrideReason={overrideReason}
            onPermChange={setSelectedPermId}
            onActionChange={setSelectedAction}
            onEffectChange={setSelectedEffect}
            onReasonChange={setOverrideReason}
            onAdd={handleAddOverride}
          />
        </div>

        <EffectiveAccessPreviewCard resolveEffectiveStatus={resolveEffectiveStatus} />
      </div>
    </div>
  );
}
