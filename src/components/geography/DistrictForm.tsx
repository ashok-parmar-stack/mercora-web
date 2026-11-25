"use client";

import React, { useEffect, useState } from "react";
import { CreateDistrictInput, State } from "@mercora/shared-types";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input, MasterFormShell, Select } from "@/components/common";
import { fetchStates } from "@/lib/geography-api";
import { VALIDATION_MESSAGES } from "@/lib/validation/messages";

const districtSchema = z.object({
  name: z.string().min(1, VALIDATION_MESSAGES.REQUIRED("District name")),
  localName: z.string().optional(),
  code: z.string().min(1, VALIDATION_MESSAGES.REQUIRED("District code (e.g. 521, PUNE)")).toUpperCase(),
  stateId: z.string().min(1, VALIDATION_MESSAGES.SELECT_OPTION("state")),
  type: z.string().default("DISTRICT"),
  censusCode: z.string().optional(),
  source: z.string().default("MANUAL"),
  status: z.string().default("ACTIVE"),
});

type DistrictFormValues = z.input<typeof districtSchema>;

export interface DistrictFormProps {
  mode: "create" | "edit";
  initialData?: Partial<CreateDistrictInput & { id?: string }>;
  onSubmit: (formData: CreateDistrictInput) => Promise<void>;
  isSubmitting?: boolean;
  error?: string | null;
  cancelHref?: string;
  onCancel?: () => void;
  title?: string;
  subtitle?: string;
}

export const DistrictForm: React.FC<DistrictFormProps> = ({
  mode,
  initialData,
  onSubmit,
  isSubmitting = false,
  error = null,
  cancelHref = "/admin/districts",
  onCancel,
  title,
  subtitle,
}) => {
  const [states, setStates] = useState<State[]>([]);
  const { register, handleSubmit, setValue, watch, formState: { errors }, reset } =
    useForm<DistrictFormValues>({
      resolver: zodResolver(districtSchema),
      defaultValues: {
        name: "",
        localName: "",
        code: "",
        stateId: "",
        type: "DISTRICT",
        censusCode: "",
        source: "MANUAL",
        status: "ACTIVE",
      },
    });

  useEffect(() => {
    fetchStates({ limit: 1000 })
      .then((res) => {
        setStates(res.items || []);
        if (!watch("stateId") && res.items?.length > 0 && !initialData?.stateId) {
          setValue("stateId", res.items[0].id);
        }
      })
      .catch((err) => console.error("Failed to load states in district form:", err));
  }, []);

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || "",
        localName: initialData.localName || "",
        code: initialData.code || "",
        stateId: initialData.stateId || "",
        type: initialData.type || "DISTRICT",
        censusCode: initialData.censusCode || "",
        source: initialData.source || "MANUAL",
        status: initialData.status || "ACTIVE",
      });
    }
  }, [initialData, reset]);

  const isActive = (watch("status") || "ACTIVE").toUpperCase() !== "INACTIVE";
  const handleValidSubmit: SubmitHandler<DistrictFormValues> = async (data) => {
    await onSubmit(data as CreateDistrictInput);
  };

  return (
    <MasterFormShell
      title={title || (mode === "create" ? "Create District Record" : `Edit District: ${watch("name") || "Record"}`)}
      subtitle={subtitle || (mode === "create"
        ? "Add a new administrative district linked to a parent state or province."
        : "Update administrative details, census code mappings, or operational status for this district.")}
      badgeLabel={mode === "create" ? "New District" : watch("code") || "District"}
      error={error}
      onSubmit={handleSubmit(handleValidSubmit)}
      isSubmitting={isSubmitting}
      submitLabel={mode === "create" ? "Create District" : "Save Changes"}
      cancelHref={cancelHref}
      onCancel={onCancel}
      statusSection={{
        label: "District Operational Status",
        isActive,
        onToggle: () => setValue("status", isActive ? "INACTIVE" : "ACTIVE", { shouldDirty: true }),
        activeDescription: "District is active and available across catalog, address, and logistics workflows.",
        inactiveDescription: "District is inactive and hidden from selection dropdowns.",
      }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="sm:col-span-2">
          <Input
            label="District Name *"
            placeholder="e.g. Pune, Los Angeles, Munich"
            {...register("name")}
            error={errors.name?.message}
          />
        </div>
        <div className="sm:col-span-2">
          <Input
            label="Official / Local Script Name (Optional)"
            placeholder="e.g. पुणे, München"
            {...register("localName")}
            error={errors.localName?.message}
          />
        </div>
        <Select label="Parent State / Province *" {...register("stateId")} error={errors.stateId?.message}>
          <option value="">Select State</option>
          {states.map((state) => (
            <option key={state.id} value={state.id}>
              {state.name} ({state.code})
            </option>
          ))}
        </Select>
        <Select label="Administrative Type *" {...register("type")} error={errors.type?.message}>
          <option value="DISTRICT">District</option>
          <option value="UNION_TERRITORY">Union Territory</option>
          <option value="PROVINCE">Province</option>
          <option value="REGION">Region</option>
          <option value="DEPARTMENT">Department</option>
        </Select>
        <Input
          label="District Code *"
          placeholder="e.g. 521, MH-PU, LA"
          {...register("code", {
            onChange: (e) => setValue("code", e.target.value.toUpperCase()),
          })}
          error={errors.code?.message}
        />
        <Input
          label="Census / LGD Code (Optional)"
          placeholder="e.g. 521"
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
