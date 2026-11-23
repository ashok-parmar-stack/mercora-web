"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Save, RefreshCw } from "lucide-react";
import { PageHeader } from "../../../../../components/layout/PageHeader";
import { Input } from "../../../../../components/ui/Input";
import { Button } from "../../../../../components/ui/Button";
import { Textarea } from "../../../../../components/ui/Textarea";
import { usePermissionDetails, usePermissions } from "../../../../../lib/hooks/usePermissions";
import { commonSchemas } from "../../../../../lib/validation/messages";

const editPermissionSchema = z.object({
  name: commonSchemas.name("Display Name", 2),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof editPermissionSchema>;

export default function EditPermissionPage() {
  const params = useParams();
  const router = useRouter();
  const idOrCode = (params?.id as string) || "";

  const { permission, isLoading } = usePermissionDetails(idOrCode);
  const { updatePermission } = usePermissions();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(editPermissionSchema),
    defaultValues: { name: "", description: "" },
  });

  useEffect(() => {
    if (permission) {
      reset({
        name: permission.name,
        description: permission.description || "",
      });
    }
  }, [permission, reset]);

  const onSubmit = async (data: FormValues) => {
    try {
      await updatePermission(idOrCode, {
        name: data.name,
        description: data.description || undefined,
      });
      router.push("/admin/permissions");
    } catch (e) {
      // error handled in hook
    }
  };

  if (isLoading) {
    return (
      <div className="w-full flex flex-col gap-6">
        <PageHeader title="Loading Permission..." backHref="/admin/permissions" />
        <div className="p-12 text-center text-sm text-gray-500 bg-white border border-gray-200 rounded-2xl flex items-center justify-center gap-3">
          <RefreshCw className="w-5 h-5 animate-spin text-brand-600" />
          <span>Loading module details...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6">
      <PageHeader
        title={`Edit Permission: ${permission?.name || idOrCode}`}
        description={`Configure module attributes and metadata for [${permission?.code || idOrCode}].`}
        backHref="/admin/permissions"
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col gap-6"
        noValidate
      >
        <div className="border-b border-gray-100 pb-4 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base text-gray-900">
              Edit Module: {permission?.name || "Permission"}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Update display name and domain scope for this authorization module.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-700 border border-brand-200">
            {permission?.code || "MODULE"}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Permission Code"
            value={permission?.code || ""}
            disabled
            helperText="Module code cannot be changed."
          />

          <Input
            label="Display Name *"
            placeholder="e.g. Companies"
            {...register("name")}
            error={errors.name?.message}
          />
        </div>

        <Textarea
          label="Description (Optional)"
          rows={3}
          placeholder="Scope of this permission module..."
          {...register("description")}
        />

        {/* Footer Actions */}
        <div className="border-t border-gray-100 pt-6 flex items-center justify-between gap-3">
          <Button variant="secondary" size="md" asChild>
            <Link href="/admin/permissions">
              <ArrowLeft className="w-4 h-4" />
              <span>Cancel &amp; Return</span>
            </Link>
          </Button>

          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isSubmitting}
            disabled={isSubmitting}
            leftIcon={<Save className="w-4 h-4" />}
          >
            {isSubmitting ? "Saving Changes..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
