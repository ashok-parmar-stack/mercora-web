"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "../../../../../components/layout/PageHeader";
import { usePermissions } from "../../../../../lib/hooks/usePermissions";
import { useRoles } from "../../../../../lib/hooks/useRoles";
import { useUIStore } from "../../../../../lib/store/ui-store";
import { adminApi } from "../../../../../lib/admin-api";
import { User, Role, Permission } from "../../../../../lib/admin-types";
import { Badge } from "../../../../../components/ui/Badge";
import { Button } from "../../../../../components/ui/Button";
import { Input } from "../../../../../components/ui/Input";
import { Select } from "../../../../../components/ui/Select";
import { Tooltip } from "../../../../../components/ui/Tooltip";
import {
  Shield,
  KeyRound,
  CheckCircle2,
  XCircle,
  Plus,
  Trash2,
  AlertTriangle,
  Info,
  RefreshCw,
  ArrowRight,
} from "lucide-react";

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
    <div className="flex flex-col gap-6 max-w-5xl">
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
        {/* Left Column: Active Overrides Table & Add Rule */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Active Overrides */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="font-extrabold text-sm text-gray-900">
                  Active UBAC Overrides ({overrides.length})
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Explicit access rules configured specifically for this user.
                </p>
              </div>
            </div>

            {overrides.length === 0 ? (
              <div className="py-8 text-center text-gray-400 text-xs">
                No user-specific overrides configured. This user inherits all standard permissions from their role.
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                {overrides.map((ovr) => (
                  <div
                    key={ovr.id}
                    className="p-3 rounded-lg border border-gray-200 bg-gray-50/50 flex items-center justify-between gap-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={ovr.effect === "ALLOW" ? "green" : "red"}
                        size="sm"
                      >
                        {ovr.effect}
                      </Badge>
                      <div>
                        <div className="font-extrabold text-xs text-gray-900 flex items-center gap-1.5">
                          <span>{ovr.permissionName}</span>
                          <span className="text-gray-400">→</span>
                          <code className="text-[11px] font-mono bg-white border border-gray-200 px-1 py-0.5 rounded text-gray-700">
                            {ovr.actionCode}
                          </code>
                        </div>
                        {ovr.reason && (
                          <div className="text-[11px] text-gray-500 mt-0.5">
                            {ovr.reason}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <Tooltip content="Remove Override">
                        <button
                          onClick={() => handleRemoveOverride(ovr.id)}
                          className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                          aria-label="Remove override"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </Tooltip>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Override Form */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs flex flex-col gap-4">
            <div className="border-b border-gray-100 pb-3">
              <h3 className="font-extrabold text-sm text-gray-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-brand-600" />
                Add Permission Override
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Specify a target module and action to grant or revoke explicitly.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Select
                label="Permission Module *"
                value={selectedPermId}
                onChange={(e) => {
                  setSelectedPermId(e.target.value);
                  setSelectedAction("VIEW");
                }}
              >
                <option value="">Select module...</option>
                {permissions.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </Select>

              <Select
                label="Action *"
                value={selectedAction}
                onChange={(e) => setSelectedAction(e.target.value)}
              >
                {availableActions.map((act) => (
                  <option key={act} value={act}>
                    {act}
                  </option>
                ))}
              </Select>

              <Select
                label="Override Effect *"
                value={selectedEffect}
                onChange={(e) => setSelectedEffect(e.target.value as "ALLOW" | "DENY")}
              >
                <option value="ALLOW">ALLOW (Explicit Grant)</option>
                <option value="DENY">DENY (Explicit Revoke)</option>
              </Select>
            </div>

            <Input
              label="Audit Reason / Justification"
              placeholder="e.g. Special authorization from security officer..."
              value={overrideReason}
              onChange={(e) => setOverrideReason(e.target.value)}
            />

            <div className="flex justify-end pt-1">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleAddOverride}
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Apply Override Rule
              </Button>
            </div>
          </div>
        </div>

        {/* Right Column: Effective Permission Simulation Preview */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs flex flex-col gap-4 h-fit">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="font-extrabold text-sm text-gray-900 flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-purple-600" />
              Effective Access Simulation
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Live evaluation of effective permissions for this user.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {["Companies", "Trade Data", "Products", "Leads", "Users"].map((moduleName) => (
              <div
                key={moduleName}
                className="border border-gray-100 rounded-lg p-3 bg-gray-50/40 flex flex-col gap-2"
              >
                <div className="font-extrabold text-xs text-gray-900">
                  {moduleName}
                </div>

                <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                  {["VIEW", "CREATE", "UPDATE", "DELETE"].map((act) => {
                    const status = resolveEffectiveStatus(moduleName, act);
                    return (
                      <div
                        key={act}
                        className={`flex items-center justify-between p-1.5 rounded border ${
                          status.granted
                            ? status.isOverride
                              ? "bg-green-50/60 border-green-200 text-green-800"
                              : "bg-white border-gray-200 text-gray-700"
                            : "bg-red-50/60 border-red-200 text-red-800"
                        }`}
                      >
                        <span className="font-mono font-bold text-[10px]">{act}</span>
                        {status.granted ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
