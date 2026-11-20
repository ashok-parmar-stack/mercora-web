"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Role, Status } from "../../lib/admin-types";
import { commonSchemas } from "../../lib/validation/messages";

const roleSchema = z.object({
  code: commonSchemas.code("Role Code", 2),
  name: commonSchemas.name("Role Name", 2),
  description: z.string().optional(),
  priority: commonSchemas.priority(1, 999),
  statusId: z.string().optional(),
});

type RoleFormData = z.infer<typeof roleSchema>;

export interface RoleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  roleToEdit?: Role | null;
  statuses: Status[];
  onSubmit: (payload: {
    code: string;
    name: string;
    description?: string;
    priority?: number;
    statusId?: string;
  }) => Promise<void> | void;
}

export const RoleFormModal: React.FC<RoleFormModalProps> = ({
  isOpen,
  onClose,
  roleToEdit,
  statuses,
  onSubmit,
}) => {
  const isEditing = Boolean(roleToEdit);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      code: "",
      name: "",
      description: "",
      priority: 10,
      statusId: statuses[0]?.id || "",
    },
  });

  useEffect(() => {
    if (roleToEdit) {
      reset({
        code: roleToEdit.code,
        name: roleToEdit.name,
        description: roleToEdit.description || "",
        priority: roleToEdit.priority || 10,
        statusId: roleToEdit.statusId || (statuses[0]?.id || ""),
      });
    } else {
      reset({
        code: "",
        name: "",
        description: "",
        priority: 10,
        statusId: statuses[0]?.id || "",
      });
    }
  }, [roleToEdit, isOpen, statuses, reset]);

  const onFormSubmit = async (data: RoleFormData) => {
    try {
      await onSubmit({
        code: data.code.trim().toUpperCase().replace(/\s+/g, "_"),
        name: data.name.trim(),
        description: data.description?.trim() || undefined,
        priority: Number(data.priority) || 10,
        statusId: data.statusId || undefined,
      });
      onClose();
    } catch (e) {
      // Error handled by parent
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Edit Role: ${roleToEdit?.name}` : "Create New IAM Role"}
      description={
        isEditing
          ? "Update role attributes, priority weight, or lifecycle status."
          : "Define a new access role with semantic code and priority hierarchy."
      }
      maxWidth="md"
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col gap-4 mt-2" noValidate>
        <Input
          label="Role Code *"
          placeholder="e.g. SALES_MANAGER"
          disabled={isEditing && roleToEdit?.isSystem}
          {...register("code", {
            onChange: (e) => setValue("code", e.target.value.toUpperCase().replace(/\s+/g, "_"), { shouldValidate: true })
          })}
          error={errors.code?.message}
          helperText={
            isEditing && roleToEdit?.isSystem
              ? "System role codes are protected from renaming."
              : "Semantic identifier used in RBAC guards (uppercase, underscores)."
          }
        />

        <Input
          label="Role Display Name *"
          placeholder="e.g. Sales Manager"
          {...register("name")}
          error={errors.name?.message}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Priority Level (Order)"
            type="number"
            min="1"
            max="999"
            {...register("priority", { valueAsNumber: true })}
            error={errors.priority?.message}
            helperText="Higher values take precedence in multi-role conflict resolution."
          />

          {statuses.length > 0 && (
            <Select
              label="Status"
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

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
            Description
          </label>
          <textarea
            rows={2}
            className={`w-full bg-white border ${errors.description ? 'border-red-500 focus:ring-red-100' : 'border-gray-200 focus:border-brand-500 focus:ring-brand-100'} rounded-lg text-sm text-gray-900 p-3 outline-none transition-all duration-150 focus:ring-2`}
            placeholder="Briefly describe this role..."
            {...register("description")}
          />
          {errors.description && <span className="text-xs text-red-500 font-medium">{errors.description.message}</span>}
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 mt-2">
          <Button variant="secondary" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {isEditing ? "Save Changes" : "Create Role"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
