"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Save, Shield } from "lucide-react";
import { Role, Status, Permission } from "../../lib/admin-types";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { Textarea } from "../ui/Textarea";
import { PermissionMatrix } from "../permissions/PermissionMatrix";
import { usePermissions } from "../../lib/hooks/usePermissions";
import { useStatuses } from "../../lib/hooks/useStatuses";
import { useUIStore } from "../../lib/store/ui-store";
import { commonSchemas } from "../../lib/validation/messages";

const roleSchema = z.object({
  name: commonSchemas.name("Role Name", 2),
  code: commonSchemas.code("Role Code", 2),
  description: z.string().optional(),
  priority: commonSchemas.priority(1, 999),
  statusId: z.string().optional(),
});

export type RoleFormData = z.infer<typeof roleSchema>;

export interface RoleFormProps {
  mode: "create" | "edit";
  initialRole?: Role | null;
  initialPermissionActionIds?: string[];
  onSubmit: (data: {
    code: string;
    name: string;
    description?: string;
    priority?: number;
    statusId?: string;
    permissionActionIds: string[];
  }) => Promise<void>;
  isLoading?: boolean;
}

export const RoleForm: React.FC<RoleFormProps> = ({
  mode,
  initialRole,
  initialPermissionActionIds = [],
  onSubmit,
  isLoading = false,
}) => {
  const router = useRouter();
  const addToast = useUIStore((s) => s.addToast);
  const { permissions } = usePermissions();
  const { statuses } = useStatuses();

  const [selectedActionIds, setSelectedActionIds] = useState<Set<string>>(
    new Set(initialPermissionActionIds)
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: initialRole?.name || "",
      code: initialRole?.code || "",
      description: initialRole?.description || "",
      priority: initialRole?.priority || 10,
      statusId: initialRole?.statusId || "",
    },
  });

  const isSystemRole = initialRole?.isSystem;

  useEffect(() => {
    if (initialRole) {
      reset({
        name: initialRole.name,
        code: initialRole.code,
        description: initialRole.description || "",
        priority: initialRole.priority || 10,
        statusId: initialRole.statusId || (statuses[0]?.id || ""),
      });
    }
  }, [initialRole, statuses, reset]);

  useEffect(() => {
    if (initialPermissionActionIds.length > 0) {
      setSelectedActionIds(new Set(initialPermissionActionIds));
    }
  }, [initialPermissionActionIds]);

  const onFormSubmit: SubmitHandler<RoleFormData> = async (data) => {
    try {
      await onSubmit({
        code: data.code.trim().toUpperCase().replace(/\s+/g, "_"),
        name: data.name.trim(),
        description: data.description?.trim() || undefined,
        priority: Number(data.priority) || 10,
        statusId: data.statusId || undefined,
        permissionActionIds: Array.from(selectedActionIds),
      });
      addToast(
        "success",
        mode === "create" ? "Role Created" : "Role Updated",
        `Role ${data.name} saved successfully with ${selectedActionIds.size} permissions.`
      );
      router.push("/admin/roles");
    } catch (err: any) {
      addToast("error", "Failed to Save Role", err.message || "An error occurred.");
    }
  };

  const submitting = isSubmitting || isLoading;

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col gap-6 max-w-5xl" noValidate>
      {/* 1. Basic Information Section */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col gap-6">
        <div className="border-b border-gray-100 pb-4 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base text-gray-900">
              {mode === "create" ? "Role Specifications" : `Edit Role: ${initialRole?.name || "Role"}`}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Configure primary role credentials, hierarchy priority weight, and lifecycle status.
            </p>
          </div>
          <Badge variant="brand" size="sm">
            {mode === "create" ? "New Role" : isSystemRole ? "System Protected" : "Custom Role"}
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Input
            label="Role Display Name *"
            placeholder="e.g. Data Manager"
            {...register("name", {
              onChange: (e) => {
                if (mode === "create") {
                  const autoCode = e.target.value
                    .toUpperCase()
                    .replace(/[^A-Z0-9]/g, "_");
                  setValue("code", autoCode, { shouldValidate: true });
                }
              },
            })}
            error={errors.name?.message}
          />

          <Input
            label="Role Code *"
            placeholder="e.g. DATA_MANAGER"
            disabled={isSystemRole}
            {...register("code", {
              onChange: (e) => {
                setValue("code", e.target.value.toUpperCase().replace(/\s+/g, "_"), {
                  shouldValidate: true,
                });
              },
            })}
            error={errors.code?.message}
            helperText={
              isSystemRole
                ? "System role codes are protected."
                : "Unique uppercase identifier used in RBAC guards."
            }
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Input
            label="Priority Order (Hierarchy)"
            type="number"
            min={1}
            max={999}
            placeholder="e.g. 10"
            {...register("priority", { valueAsNumber: true })}
            error={errors.priority?.message}
            helperText="Higher values take precedence in multi-role conflict resolution."
          />

          {statuses.length > 0 && (
            <Select
              label="Status Lifecycle"
              {...register("statusId")}
              error={errors.statusId?.message}
            >
              {statuses.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.code})
                </option>
              ))}
            </Select>
          )}
        </div>

        <Textarea
          label="Role Description / Scope (Optional)"
          rows={3}
          placeholder="Describe what access privileges this role encompasses..."
          {...register("description")}
        />
      </div>

      {/* 2. Granular Permissions Matrix Section */}
      <PermissionMatrix
        permissions={permissions}
        selectedActionIds={selectedActionIds}
        onChange={setSelectedActionIds}
      />

      {/* 3. Form Action Buttons */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 shadow-xs flex items-center justify-between gap-3">
        <Button variant="secondary" size="md" asChild>
          <Link href="/admin/roles">
            <ArrowLeft className="w-4 h-4" />
            <span>Cancel &amp; Return</span>
          </Link>
        </Button>
        <Button
          variant="primary"
          size="md"
          type="submit"
          isLoading={submitting}
          disabled={submitting}
          leftIcon={<Save className="w-4 h-4" />}
        >
          {mode === "create" ? "Create Role & Permissions" : "Save Changes"}
        </Button>
      </div>
    </form >
  );
};
