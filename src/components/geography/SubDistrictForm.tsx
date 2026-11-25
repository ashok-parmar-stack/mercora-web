"use client";

import React, { useEffect, useState } from "react";
import { CreateSubDistrictInput, District } from "@mercora/shared-types";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input, MasterFormShell, Select } from "@/components/common";
import { fetchDistricts } from "@/lib/geography-api";
import { VALIDATION_MESSAGES } from "@/lib/validation/messages";

const subDistrictSchema = z.object({
  name: z.string().min(1, VALIDATION_MESSAGES.REQUIRED("SubDistrict name")),
  localName: z.string().optional(),
  code: z.string().min(1, VALIDATION_MESSAGES.REQUIRED("SubDistrict code (e.g. HAV, HAVELI)")).toUpperCase(),
  districtId: z.string().min(1, VALIDATION_MESSAGES.SELECT_OPTION("district")),
  type: z.string().default("SUB_DISTRICT"),
  censusCode: z.string().optional(),
  source: z.string().default("MANUAL"),
  status: z.string().default("ACTIVE"),
});

type SubDistrictFormValues = z.input<typeof subDistrictSchema>;

export interface SubDistrictFormProps {
  mode: "create" | "edit";
  initialData?: Partial<CreateSubDistrictInput & { id?: string }>;
  onSubmit: (formData: CreateSubDistrictInput) => Promise<void>;
  isSubmitting?: boolean;
  error?: string | null;
  cancelHref?: string;
  onCancel?: () => void;
  title?: string;
  subtitle?: string;
}

export const SubDistrictForm: React.FC<SubDistrictFormProps> = ({
  mode,
  initialData,
  onSubmit,
  isSubmitting = false,
  error = null,
  cancelHref = "/admin/sub-districts",
  onCancel,
  title,
  subtitle,
}) => {
  const [districts, setDistricts] = useState<District[]>([]);
  const { register, handleSubmit, setValue, watch, formState: { errors }, reset } =
    useForm<SubDistrictFormValues>({
      resolver: zodResolver(subDistrictSchema),
      defaultValues: {
        name: "",
        localName: "",
        code: "",
        districtId: "",
        type: "SUB_DISTRICT",
        censusCode: "",
        source: "MANUAL",
        status: "ACTIVE",
      },
    });

  useEffect(() => {
    fetchDistricts({ limit: 1000 })
      .then((res) => {
        setDistricts(res.items || []);
        if (!watch("districtId") && res.items?.length > 0 && !initialData?.districtId) {
          setValue("districtId", res.items[0].id);
        }
      })
      .catch((err) => console.error("Failed to load districts in subDistrict form:", err));
  }, []);

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || "",
        localName: initialData.localName || "",
        code: initialData.code || "",
        districtId: initialData.districtId || "",
        type: initialData.type || "SUB_DISTRICT",
        censusCode: initialData.censusCode || "",
        source: initialData.source || "MANUAL",
        status: initialData.status || "ACTIVE",
      });
    }
  }, [initialData, reset]);

  const isActive = (watch("status") || "ACTIVE").toUpperCase() !== "INACTIVE";
  const handleValidSubmit: SubmitHandler<SubDistrictFormValues> = async (data) => {
    await onSubmit(data as CreateSubDistrictInput);
  };

  return (
    <MasterFormShell
      title={title || (mode === "create" ? "Create SubDistrict / Taluka Record" : `Edit SubDistrict: ${watch("name") || "Record"}`)}
      subtitle={subtitle || (mode === "create"
        ? "Add a new administrative sub-district, taluka, tehsil, or mandal linked to a parent district."
        : "Update administrative details, code mappings, or operational status for this sub-district.")}
      badgeLabel={mode === "create" ? "New SubDistrict" : watch("code") || "SubDistrict"}
      error={error}
      onSubmit={handleSubmit(handleValidSubmit)}
      isSubmitting={isSubmitting}
      submitLabel={mode === "create" ? "Create SubDistrict" : "Save Changes"}
      cancelHref={cancelHref}
      onCancel={onCancel}
      statusSection={{
        label: "SubDistrict Operational Status",
        isActive,
        onToggle: () => setValue("status", isActive ? "INACTIVE" : "ACTIVE", { shouldDirty: true }),
        activeDescription: "SubDistrict is active and available across catalog, address, and logistics workflows.",
        inactiveDescription: "SubDistrict is inactive and hidden from selection dropdowns.",
      }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="sm:col-span-2">
          <Input
            label="SubDistrict / Taluka Name *"
            placeholder="e.g. Haveli, Andheri, Shinjuku"
            {...register("name")}
            error={errors.name?.message}
          />
        </div>
        <div className="sm:col-span-2">
          <Input
            label="Official / Local Script Name (Optional)"
            placeholder="e.g. हवेली"
            {...register("localName")}
            error={errors.localName?.message}
          />
        </div>
        <Select label="Parent District *" {...register("districtId")} error={errors.districtId?.message}>
          <option value="">Select District</option>
          {districts.map((district) => (
            <option key={district.id} value={district.id}>
              {district.name} ({district.code})
            </option>
          ))}
        </Select>
        <Select label="Administrative Type *" {...register("type")} error={errors.type?.message}>
          <option value="SUB_DISTRICT">SubDistrict</option>
          <option value="TALUKA">Taluka / Tehsil</option>
          <option value="MANDAL">Mandal</option>
          <option value="BOROUGH">Borough</option>
          <option value="COUNTY">County Division</option>
        </Select>
        <Input
          label="SubDistrict Code *"
          placeholder="e.g. HAV, 04185"
          {...register("code", {
            onChange: (e) => setValue("code", e.target.value.toUpperCase()),
          })}
          error={errors.code?.message}
        />
        <Input
          label="Census / LGD Code (Optional)"
          placeholder="e.g. 04185"
          {...register("censusCode")}
          error={errors.censusCode?.message}
        />
        <Select label="Data Source Registry" {...register("source")} error={errors.source?.message}>
          <option value="MANUAL">MANUAL (Admin Managed)</option>
          <option value="LGD">LGD (Government of India)</option>
          <option value="ISO">ISO Standard</option>
        </Select>
      </div>
    </MasterFormShell>
  );
};
