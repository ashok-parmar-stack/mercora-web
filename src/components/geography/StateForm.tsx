"use client";

import React, { useEffect, useState } from "react";
import { CreateStateInput, Country } from "@mercora/shared-types";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input, MasterFormShell, Select } from "@/components/common";
import { fetchCountries } from "@/lib/geography-api";
import { VALIDATION_MESSAGES } from "@/lib/validation/messages";

const stateSchema = z.object({
  name: z.string().min(1, VALIDATION_MESSAGES.REQUIRED("State name")),
  localName: z.string().optional(),
  code: z.string().min(1, VALIDATION_MESSAGES.REQUIRED("State code (e.g. IN-MH, US-CA)")).toUpperCase(),
  countryId: z.string().min(1, VALIDATION_MESSAGES.SELECT_OPTION("country")),
  type: z.string().default("STATE"),
  censusCode: z.string().optional(),
  source: z.string().default("MANUAL"),
  status: z.string().default("ACTIVE"),
});

type StateFormValues = z.input<typeof stateSchema>;

export interface StateFormProps {
  mode: "create" | "edit";
  initialData?: Partial<CreateStateInput & { id?: string }>;
  onSubmit: (formData: CreateStateInput) => Promise<void>;
  isSubmitting?: boolean;
  error?: string | null;
  cancelHref?: string;
  onCancel?: () => void;
  title?: string;
  subtitle?: string;
}

export const StateForm: React.FC<StateFormProps> = ({
  mode,
  initialData,
  onSubmit,
  isSubmitting = false,
  error = null,
  cancelHref = "/admin/states",
  onCancel,
  title,
  subtitle,
}) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const { register, handleSubmit, setValue, watch, formState: { errors }, reset } =
    useForm<StateFormValues>({
      resolver: zodResolver(stateSchema),
      defaultValues: {
        name: "",
        localName: "",
        code: "",
        countryId: "",
        type: "STATE",
        censusCode: "",
        source: "MANUAL",
        status: "ACTIVE",
      },
    });

  useEffect(() => {
    fetchCountries({ limit: 1000 })
      .then((res) => {
        setCountries(res.items || []);
        if (!watch("countryId") && res.items?.length > 0 && !initialData?.countryId) {
          setValue("countryId", res.items[0].id);
        }
      })
      .catch((err) => console.error("Failed to load countries in state form:", err));
  }, []);

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || "",
        localName: initialData.localName || "",
        code: initialData.code || "",
        countryId: initialData.countryId || "",
        type: initialData.type || "STATE",
        censusCode: initialData.censusCode || "",
        source: initialData.source || "MANUAL",
        status: initialData.status || "ACTIVE",
      });
    }
  }, [initialData, reset]);

  const isActive = (watch("status") || "ACTIVE").toUpperCase() !== "INACTIVE";
  const handleValidSubmit: SubmitHandler<StateFormValues> = async (data) => {
    await onSubmit(data as CreateStateInput);
  };

  return (
    <MasterFormShell
      title={title || (mode === "create" ? "Create State / Province Record" : `Edit State: ${watch("name") || "Record"}`)}
      subtitle={subtitle || (mode === "create"
        ? "Add a new administrative state, province, or union territory linked to a sovereign country."
        : "Update administrative details, code mappings, or operational status for this state.")}
      badgeLabel={mode === "create" ? "New State" : watch("code") || "State"}
      error={error}
      onSubmit={handleSubmit(handleValidSubmit)}
      isSubmitting={isSubmitting}
      submitLabel={mode === "create" ? "Create State" : "Save Changes"}
      cancelHref={cancelHref}
      onCancel={onCancel}
      statusSection={{
        label: "State Operational Status",
        isActive,
        onToggle: () => setValue("status", isActive ? "INACTIVE" : "ACTIVE", { shouldDirty: true }),
        activeDescription: "State is active and available across catalog, address, and shipping workflows.",
        inactiveDescription: "State is inactive and hidden from selection dropdowns.",
      }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="sm:col-span-2">
          <Input
            label="State / Province Name *"
            placeholder="e.g. Maharashtra, California, Bavaria"
            {...register("name")}
            error={errors.name?.message}
          />
        </div>
        <div className="sm:col-span-2">
          <Input
            label="Official / Local Script Name (Optional)"
            placeholder="e.g. महाराष्ट्र, Bayern"
            {...register("localName")}
            error={errors.localName?.message}
          />
        </div>
        <Select label="Parent Country *" {...register("countryId")} error={errors.countryId?.message}>
          <option value="">Select Country</option>
          {countries.map((country) => (
            <option key={country.id} value={country.id}>
              {country.name} ({country.iso2Code})
            </option>
          ))}
        </Select>
        <Select label="Administrative Type *" {...register("type")} error={errors.type?.message}>
          <option value="STATE">State</option>
          <option value="UNION_TERRITORY">Union Territory</option>
          <option value="PROVINCE">Province</option>
          <option value="REGION">Region</option>
          <option value="DEPARTMENT">Department</option>
        </Select>
        <Input
          label="State Code / ISO Subcode *"
          placeholder="e.g. IN-MH, US-CA, DE-BY"
          {...register("code", {
            onChange: (e) => setValue("code", e.target.value.toUpperCase()),
          })}
          error={errors.code?.message}
        />
        <Input
          label="Census / LGD Code (Optional)"
          placeholder="e.g. 27"
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
