"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Save, User as UserIcon, Mail, Lock, Globe, Key } from "lucide-react";
import { User, Role, Status } from "../../lib/admin-types";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { useUIStore } from "../../lib/store/ui-store";
import { commonSchemas, VALIDATION_MESSAGES } from "../../lib/validation/messages";

const userSchema = z.object({
  email: commonSchemas.email,
  password: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  slug: commonSchemas.slug,
  roleId: z.string().min(1, VALIDATION_MESSAGES.SELECT_OPTION("role")),
  statusId: z.string().optional(),
});

type UserFormData = z.infer<typeof userSchema>;

export interface UserFormProps {
  mode: "create" | "edit";
  initialUser?: User | null;
  roles: Role[];
  statuses: Status[];
  onSubmit: (data: {
    email: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    slug?: string;
    roleId?: string;
    statusId?: string;
  }) => Promise<void>;
  isLoading?: boolean;
}

export const UserForm: React.FC<UserFormProps> = ({
  mode,
  initialUser,
  roles,
  statuses,
  onSubmit,
  isLoading = false,
}) => {
  const router = useRouter();
  const addToast = useUIStore((s) => s.addToast);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: initialUser?.email || "",
      password: "",
      firstName: initialUser?.firstName || (initialUser as any)?.name?.split(/\s+/)[0] || "",
      lastName: initialUser?.lastName || ((initialUser as any)?.name?.split(/\s+/).slice(1).join(" ")) || "",
      slug: initialUser?.slug || "",
      roleId: initialUser?.roleId || initialUser?.role?.id || (roles[0]?.id || ""),
      statusId: initialUser?.statusId || initialUser?.status?.id || (statuses[0]?.id || ""),
    },
  });

  useEffect(() => {
    if (initialUser) {
      const parts = (initialUser as any).name ? String((initialUser as any).name).trim().split(/\s+/) : [];
      const derivedFirst = initialUser.firstName || parts[0] || "";
      const derivedLast = initialUser.lastName || (parts.length > 1 ? parts.slice(1).join(" ") : "");
      const matchedRoleId = initialUser.roleId || initialUser.role?.id || (roles.length > 0 ? roles[0].id : "");
      const matchedStatusId = initialUser.statusId || initialUser.status?.id || (statuses.length > 0 ? statuses[0].id : "");

      setValue("email", initialUser.email || "");
      setValue("firstName", derivedFirst);
      setValue("lastName", derivedLast);
      setValue("slug", initialUser.slug || "");
      if (matchedRoleId) setValue("roleId", matchedRoleId);
      if (matchedStatusId) setValue("statusId", matchedStatusId);
    }
  }, [initialUser, roles, statuses, setValue]);

  const onFormSubmit = async (data: UserFormData) => {
    if (mode === "create" && !data.password) {
      addToast("error", "Password Required", "Initial password is required for new accounts.");
      return;
    }

    try {
      const fullName = [data.firstName, data.lastName].filter(Boolean).join(" ").trim() || data.email.split("@")[0];
      await onSubmit({
        name: fullName,
        email: data.email.trim(),
        password: data.password?.trim() || undefined,
        firstName: data.firstName?.trim() || undefined,
        lastName: data.lastName?.trim() || undefined,
        slug: data.slug?.trim() || undefined,
        roleId: data.roleId || undefined,
        statusId: data.statusId || undefined,
      } as any);
      addToast(
        "success",
        mode === "create" ? "User Created" : "User Profile Updated",
        `Account ${data.email} has been saved.`
      );
      router.push("/admin/users");
    } catch (err: any) {
      addToast("error", "Operation Failed", err.message || "Failed to save user record.");
    }
  };

  const submitting = isSubmitting || isLoading;

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="w-full flex flex-col gap-6" noValidate>
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col gap-6">
        <div className="border-b border-[var(--border)] pb-4 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base text-[var(--text-primary)] font-jakarta">
              {mode === "create" ? "Account Credentials & Profile" : `Edit Profile: ${initialUser?.name || initialUser?.email || "User"}`}
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5 font-work">
              Configure user identity, access credentials, and assigned organizational role.
            </p>
          </div>
            <Badge variant="brand" size="sm">
              {mode === "create" ? "New Account" : initialUser?.role?.name || "Active Member"}
        </Badge>
      </div>

      {/* Section 1: Name Information */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="First Name"
          placeholder="e.g. John"
          leftIcon={<UserIcon className="w-4 h-4" />}
          {...register("firstName")}
          error={errors.firstName?.message}
        />

        <Input
          label="Last Name"
          placeholder="e.g. Smith"
          leftIcon={<UserIcon className="w-4 h-4" />}
          {...register("lastName")}
          error={errors.lastName?.message}
        />
      </div>

      {/* Section 2: Contact & Slug */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Work Email *"
          type="email"
          placeholder="john.smith@mercora.com"
          leftIcon={<Mail className="w-4 h-4" />}
          {...register("email", {
            onChange: (e) => {
              if (mode === "create" && !watch("slug")) {
                const username = e.target.value.split("@")[0] || "";
                setValue("slug", username.toLowerCase().replace(/[^a-z0-9_-]/g, "-"));
              }
            },
          })}
          error={errors.email?.message}
        />

        <Input
          label="URL Slug (Permanent)"
          placeholder="john-smith"
          leftIcon={<Globe className="w-4 h-4" />}
          {...register("slug")}
          error={errors.slug?.message}
          helperText="Used for clean permalinks & API path access."
        />
      </div>

      {/* Section 3: Credentials & Role */}
      <div className="border-t border-[var(--border)] pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label={mode === "create" ? "Initial Password *" : "Reset Password (Optional)"}
          type="password"
          placeholder={mode === "create" ? "••••••••" : "Leave blank to keep existing"}
          leftIcon={<Lock className="w-4 h-4" />}
          {...register("password")}
          error={errors.password?.message}
        />

        <Select
          label="Assigned Role *"
          value={watch("roleId") || ""}
          onChange={(e) => setValue("roleId", e.target.value, { shouldValidate: true })}
          error={errors.roleId?.message}
        >
          <option value="" disabled>
            Select a role...
          </option>
          {roles.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name} ({r.code})
            </option>
          ))}
        </Select>
      </div>

      {/* Section 4: Lifecycle Status */}
      {statuses.length > 0 && (
        <div className="border-t border-[var(--border)] pt-4 max-w-sm">
          <Select
            label="Account Status"
            value={watch("statusId") || ""}
            onChange={(e) => setValue("statusId", e.target.value, { shouldValidate: true })}
            error={errors.statusId?.message}
          >
            {statuses.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.code})
              </option>
            ))}
          </Select>
        </div>
      )}

      {/* Footer Actions */}
      <div className="border-t border-[var(--border)] pt-6 flex items-center justify-between gap-3">
        <Button variant="secondary" size="md" asChild>
          <Link href="/admin/users">
            <ArrowLeft className="w-4 h-4" />
            <span>Cancel &amp; Return</span>
          </Link>
        </Button>

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
              ? "Creating Account..."
              : "Create User Account"
            : submitting
              ? "Saving Changes..."
              : "Save User Changes"}
        </Button>
      </div>
    </div>
    </form >
  );
};
