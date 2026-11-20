"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Save } from "lucide-react";
import { PageHeader } from "../../../../components/layout/PageHeader";
import { Input } from "../../../../components/ui/Input";
import { Button } from "../../../../components/ui/Button";
import { usePermissions } from "../../../../lib/hooks/usePermissions";
import { commonSchemas } from "../../../../lib/validation/messages";

const createPermissionSchema = z.object({
  name: commonSchemas.name("Display Name", 2),
  code: commonSchemas.code("Permission Code", 2),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof createPermissionSchema>;

export default function CreatePermissionPage() {
  const router = useRouter();
  const { createPermission } = usePermissions();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(createPermissionSchema),
    defaultValues: { code: "", name: "", description: "" },
  });

  const watchCode = watch("code");

  const onSubmit = async (data: FormValues) => {
    try {
      await createPermission({
        code: data.code.toUpperCase().replace(/\s+/g, "_"),
        name: data.name,
        description: data.description || undefined,
      });
      router.push("/admin/permissions");
    } catch (e) {
      // errors handled inside hook
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <PageHeader
        title="Create Permission Module"
        description="Register a new domain permission module to group action endpoints."
        backHref="/admin/permissions"
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col gap-6"
        noValidate
      >
        <div className="border-b border-gray-100 pb-4 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base text-gray-900">Permission Specifications</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Define the module name, uppercase unique code, and access scope.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-700 border border-brand-200">
            New Module
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Display Name *"
            placeholder="e.g. Audit Logs"
            {...register("name", {
              onChange: (e) => {
                const name = e.target.value;
                if (!watchCode) {
                  const code = name.toUpperCase().replace(/[^A-Z0-9]/g, "_");
                  setValue("code", code, { shouldValidate: true });
                }
              },
            })}
            error={errors.name?.message}
          />

          <Input
            label="Permission Code *"
            placeholder="e.g. AUDIT_LOGS"
            {...register("code", {
              onChange: (e) =>
                setValue("code", e.target.value.toUpperCase().replace(/\s+/g, "_"), {
                  shouldValidate: true,
                }),
            })}
            error={errors.code?.message}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block">
            Description (Optional)
          </label>
          <textarea
            rows={3}
            className="w-full bg-white border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 rounded-lg text-sm text-gray-900 p-3 outline-none transition-all duration-150"
            placeholder="Scope of this permission module..."
            {...register("description")}
          />
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-100 pt-6 flex items-center justify-between gap-3">
          <Link
            href="/admin/permissions"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Cancel &amp; Return</span>
          </Link>

          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isSubmitting}
            disabled={isSubmitting}
            leftIcon={<Save className="w-4 h-4" />}
          >
            {isSubmitting ? "Creating Permission..." : "Create Permission"}
          </Button>
        </div>
      </form>
    </div>
  );
}
