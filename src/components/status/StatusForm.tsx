"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Save } from "lucide-react";
import { Status } from "../../lib/admin-types";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Button } from "../ui/Button";
import { useUIStore } from "../../lib/store/ui-store";
import { commonSchemas, VALIDATION_MESSAGES } from "../../lib/validation/messages";

const statusSchema = z.object({
  type: z.string().min(1, VALIDATION_MESSAGES.SELECT_OPTION("status type")),
  code: commonSchemas.code("Status Code", 1),
  name: commonSchemas.name("Status Name", 1),
  description: z.string().optional(),
  sortOrder: commonSchemas.sortOrder(1, 999),
  isActive: z.boolean(),
});

export type StatusFormData = z.infer<typeof statusSchema>;

export interface StatusFormProps {
  mode: "create" | "edit";
  initialStatus?: Status | null;
  onSubmit: (data: {
    type: string;
    code: string;
    name: string;
    description?: string;
    sortOrder?: number;
    isActive?: boolean;
  }) => Promise<void>;
  isLoading?: boolean;
}

export const StatusForm: React.FC<StatusFormProps> = ({
  mode,
  initialStatus,
  onSubmit,
  isLoading = false,
}) => {
  const router = useRouter();
  const addToast = useUIStore((s) => s.addToast);

  const statusTypes = [
    { value: "USER", label: "USER" },
    { value: "ROLE", label: "ROLE" },
    { value: "PERMISSION", label: "PERMISSION" },
    { value: "PERMISSION_ACTION", label: "PERMISSION_ACTION" },
    { value: "EMAIL_TEMPLATE", label: "EMAIL_TEMPLATE" },
    { value: "COMPANY", label: "COMPANY" },
    { value: "LEAD", label: "LEAD" },
  ];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<StatusFormData>({
    resolver: zodResolver(statusSchema),
    defaultValues: {
      type: initialStatus?.type || "USER",
      code: initialStatus?.code || "",
      name: initialStatus?.name || "",
      description: (initialStatus as any)?.description || "",
      sortOrder: (initialStatus as any)?.sortOrder || 1,
      isActive: initialStatus?.isDefault ?? true,
    },
  });

  useEffect(() => {
    if (initialStatus) {
      reset({
        type: initialStatus.type || "USER",
        code: initialStatus.code || "",
        name: initialStatus.name || "",
        description: (initialStatus as any)?.description || "",
        sortOrder: (initialStatus as any)?.sortOrder || 1,
        isActive: initialStatus.isDefault ?? true,
      });
    }
  }, [initialStatus, reset]);

  const onFormSubmit: SubmitHandler<StatusFormData> = async (data) => {
    try {
      await onSubmit({
        type: data.type,
        code: data.code.trim().toUpperCase().replace(/\s+/g, "_"),
        name: data.name.trim(),
        description: data.description?.trim() || undefined,
        sortOrder: Number(data.sortOrder) || 1,
        isActive: data.isActive,
      });
      addToast(
        "success",
        mode === "create" ? "Status Created" : "Status Updated",
        `Status ${data.name} saved successfully.`
      );
      router.push("/admin/statuses");
    } catch (err: any) {
      addToast("error", "Operation Failed", err.message || "Failed to save status.");
    }
  };

  const submitting = isSubmitting || isLoading;

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="w-full flex flex-col gap-6" noValidate>
      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col gap-6">
        <div className="border-b border-gray-100 pb-4 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base text-gray-900">
              {mode === "create" ? "Status Specifications" : `Edit Status: ${initialStatus?.name || "Status"}`}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Define domain status types, identifiers, and sort order configuration.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-700 border border-brand-200">
            {mode === "create" ? "New Status" : watch("type") || "Standard"}
          </span>
        </div>

        <Select
          label="Status Type *"
          {...register("type")}
          error={errors.type?.message}
        >
          {statusTypes.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </Select>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Status Code *"
            placeholder="e.g. ACTIVE"
            {...register("code", {
              onChange: (e) => {
                setValue("code", e.target.value.toUpperCase().replace(/\s+/g, "_"), {
                  shouldValidate: true,
                });
              },
            })}
            error={errors.code?.message}
          />

          <Input
            label="Status Display Name *"
            placeholder="e.g. Active"
            {...register("name")}
            error={errors.name?.message}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Sort Order"
            type="number"
            min={1}
            max={999}
            placeholder="e.g. 1"
            {...register("sortOrder", { valueAsNumber: true })}
            error={errors.sortOrder?.message}
          />

          <Select
            label="Is Active"
            value={watch("isActive") ? "active" : "inactive"}
            onChange={(e) => setValue("isActive", e.target.value === "active")}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </Select>
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1.5">
            Description / Context (Optional)
          </label>
          <textarea
            rows={3}
            className="w-full bg-white border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 rounded-lg text-sm text-gray-900 p-3 outline-none transition-all duration-150"
            placeholder="Explain when this status is assigned..."
            {...register("description")}
          />
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-100 pt-6 flex items-center justify-between gap-3">
          <Link
            href="/admin/statuses"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Cancel &amp; Return</span>
          </Link>

          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={submitting}
            disabled={submitting}
            leftIcon={<Save className="w-4 h-4" />}
          >
            {mode === "create"
              ? submitting
                ? "Creating Status..."
                : "Create Status"
              : submitting
              ? "Saving Changes..."
              : "Save Changes"}
          </Button>
        </div>
      </div>
    </form>
  );
};
