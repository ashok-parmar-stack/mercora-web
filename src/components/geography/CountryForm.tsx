"use client";

import React, { useEffect } from "react";
import { CreateCountryInput } from "@mercora/shared-types";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input, MasterFormShell, Select } from "@/components/common";
import { VALIDATION_MESSAGES } from "@/lib/validation/messages";

const countrySchema = z.object({
  name: z.string().min(1, VALIDATION_MESSAGES.REQUIRED("Common Country Name")),
  officialName: z.string().optional(),
  iso2Code: z.string().length(2, VALIDATION_MESSAGES.REQUIRED("ISO2 code (e.g. IN, AE, US)")).toUpperCase(),
  iso3Code: z.string().length(3, VALIDATION_MESSAGES.REQUIRED("ISO3 code (e.g. IND, ARE, USA)")).toUpperCase(),
  numericCode: z.string().optional(),
  phoneCode: z.string().optional(),
  currencyCode: z.string().optional(),
  source: z.string().default("MANUAL"),
  status: z.string().default("ACTIVE"),
});

type CountryFormValues = z.input<typeof countrySchema>;

export interface CountryFormProps {
  mode: "create" | "edit";
  initialData?: Partial<CreateCountryInput & { id?: string }>;
  onSubmit: (formData: CreateCountryInput) => Promise<void>;
  isSubmitting?: boolean;
  error?: string | null;
  cancelHref?: string;
  onCancel?: () => void;
  title?: string;
  subtitle?: string;
}

export const CountryForm: React.FC<CountryFormProps> = ({
  mode,
  initialData,
  onSubmit,
  isSubmitting = false,
  error = null,
  cancelHref = "/admin/countries",
  onCancel,
  title,
  subtitle,
}) => {
  const { register, handleSubmit, setValue, watch, formState: { errors }, reset } =
    useForm<CountryFormValues>({
      resolver: zodResolver(countrySchema),
      defaultValues: {
        name: "",
        officialName: "",
        iso2Code: "",
        iso3Code: "",
        numericCode: "",
        phoneCode: "",
        currencyCode: "",
        source: "MANUAL",
        status: "ACTIVE",
      },
    });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || "",
        officialName: initialData.officialName || "",
        iso2Code: initialData.iso2Code || "",
        iso3Code: initialData.iso3Code || "",
        numericCode: initialData.numericCode || "",
        phoneCode: initialData.phoneCode || "",
        currencyCode: initialData.currencyCode || "",
        source: initialData.source || "MANUAL",
        status: initialData.status || "ACTIVE",
      });
    }
  }, [initialData, reset]);

  const isActive = (watch("status") || "ACTIVE").toUpperCase() !== "INACTIVE";
  const handleValidSubmit: SubmitHandler<CountryFormValues> = async (data) => {
    await onSubmit(data as CreateCountryInput);
  };

  return (
    <MasterFormShell
      title={title || (mode === "create" ? "Create Country Master Record" : `Edit Country: ${watch("name") || "Master Record"}`)}
      subtitle={subtitle || (mode === "create"
        ? "Define a new ISO-3166 country entity, dialing code, currency, and operational status."
        : "Update ISO codes, currency, authority source, and active status for this country.")}
      badgeLabel={mode === "create" ? "New Country" : watch("iso2Code") || "Country"}
      error={error}
      onSubmit={handleSubmit(handleValidSubmit)}
      isSubmitting={isSubmitting}
      submitLabel={mode === "create" ? "Create Country" : "Save Changes"}
      cancelHref={cancelHref}
      onCancel={onCancel}
      statusSection={{
        label: "Country Operational Status",
        isActive,
        onToggle: () => setValue("status", isActive ? "INACTIVE" : "ACTIVE", { shouldDirty: true }),
        activeDescription: "Country is publicly selectable in company forms, addresses, and shipping",
        inactiveDescription: "Country is disabled from selection while preserving existing address references",
      }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="sm:col-span-2">
          <Input
            label="Common Country Name *"
            placeholder="e.g. India, United States, Germany"
            {...register("name")}
            error={errors.name?.message}
          />
        </div>
        <div className="sm:col-span-2">
          <Input
            label="Official Diplomatic Name (Optional)"
            placeholder="e.g. Republic of India, Federal Republic of Germany"
            {...register("officialName")}
            error={errors.officialName?.message}
          />
        </div>
        <Input
          label="ISO2 Alpha-2 Code *"
          placeholder="e.g. IN, US, DE"
          maxLength={2}
          {...register("iso2Code", {
            onChange: (e) => setValue("iso2Code", e.target.value.toUpperCase()),
          })}
          error={errors.iso2Code?.message}
        />
        <Input
          label="ISO3 Alpha-3 Code *"
          placeholder="e.g. IND, USA, DEU"
          maxLength={3}
          {...register("iso3Code", {
            onChange: (e) => setValue("iso3Code", e.target.value.toUpperCase()),
          })}
          error={errors.iso3Code?.message}
        />
        <Input
          label="Numeric Code (UN M.49)"
          placeholder="e.g. 356, 840, 276"
          {...register("numericCode")}
          error={errors.numericCode?.message}
        />
        <Input
          label="International Dialing Code"
          placeholder="e.g. +91, +1, +49"
          {...register("phoneCode")}
          error={errors.phoneCode?.message}
        />
        <Input
          label="Currency Code (ISO 4217)"
          placeholder="e.g. INR, USD, EUR"
          maxLength={3}
          {...register("currencyCode", {
            onChange: (e) => setValue("currencyCode", e.target.value.toUpperCase()),
          })}
          error={errors.currencyCode?.message}
        />
        <Select label="Data Source Registry" {...register("source")} error={errors.source?.message}>
          <option value="MANUAL">MANUAL (Admin Managed)</option>
          <option value="ISO">ISO Standard</option>
          <option value="UN">United Nations</option>
        </Select>
      </div>
    </MasterFormShell>
  );
};
