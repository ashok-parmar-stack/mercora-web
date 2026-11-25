"use client";

import React from "react";
import { Sparkles } from "lucide-react";
import { Input } from "@/components/common";
import { BusinessCategoryItem } from "@/features/business-categories/types";

interface FieldSpec {
  key: string;
  label: string;
  placeholder: string;
  uppercase?: boolean;
}

const CATEGORY_FIELD_SCHEMAS: Array<{ match: RegExp; fields: FieldSpec[] }> = [
  {
    match: /export/i,
    fields: [
      { key: "iecCode", label: "IEC (Import Export Code)", placeholder: "10-digit IEC code", uppercase: true },
      { key: "exportCountries", label: "Export Destination Countries", placeholder: "e.g. USA, UAE, Germany" },
      { key: "exportExperience", label: "Export Experience (Years)", placeholder: "e.g. 12" },
    ],
  },
  {
    match: /import/i,
    fields: [
      { key: "importCountries", label: "Import Sourcing Origins", placeholder: "e.g. China, Japan, Taiwan" },
      { key: "targetProducts", label: "Primary Target Products", placeholder: "e.g. Electronic components" },
      { key: "importExperience", label: "Import Experience (Years)", placeholder: "e.g. 8" },
    ],
  },
  {
    match: /logistics/i,
    fields: [
      { key: "transportModes", label: "Fleet & Transportation Modes", placeholder: "e.g. Heavy Trailers, Reefer Trucks" },
      { key: "warehouseArea", label: "Warehousing Capacity", placeholder: "e.g. 50,000 sq.ft." },
      { key: "coverageArea", label: "Service Coverage", placeholder: "e.g. Pan-India, Western Corridor" },
    ],
  },
  {
    match: /freight/i,
    fields: [
      { key: "freightModes", label: "Freight Capabilities", placeholder: "e.g. Air Cargo, Ocean FCL/LCL" },
      { key: "mtoLicense", label: "IATA / MTO License", placeholder: "Registration code" },
      { key: "tradeLanes", label: "Trade Lanes Managed", placeholder: "e.g. India-Middle East-EU" },
    ],
  },
  {
    match: /manufactur/i,
    fields: [
      { key: "monthlyCapacity", label: "Production Capacity / Month", placeholder: "e.g. 100,000 Units / Month" },
      { key: "certifications", label: "Factory Certifications", placeholder: "e.g. ISO 9001, CE, GMP" },
      { key: "oemCapability", label: "OEM / ODM Capabilities", placeholder: "Yes (Private Labeling Supported)" },
    ],
  },
];

const FALLBACK_FIELDS: FieldSpec[] = [
  { key: "specialization", label: "Specialized Capabilities", placeholder: "Key services, product lines or agency rights" },
  { key: "licenseDetails", label: "Key Trade Licences / Registrations", placeholder: "e.g. Trade license, ISO, CHA" },
];

export function CategoryOperationalFields({
  selectedRoot,
  categoryData,
  onFieldChange,
}: {
  selectedRoot: BusinessCategoryItem;
  categoryData: Record<string, string>;
  onFieldChange: (key: string, value: string) => void;
}) {
  const token = `${selectedRoot.slug} ${selectedRoot.code || ""}`;
  const matched = CATEGORY_FIELD_SCHEMAS.find((s) => s.match.test(token));
  const fields = matched ? matched.fields : FALLBACK_FIELDS;
  const colsClass = fields.length >= 3 ? "sm:grid-cols-3" : "sm:grid-cols-2";

  return (
    <div className="p-4 rounded-2xl bg-surface border border-primary/20 bg-gradient-to-br from-primary-soft/30 via-surface to-surface space-y-3">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-primary" />
        <span className="text-xs font-extrabold text-primary uppercase tracking-wider">
          {selectedRoot.name} Operational Details
        </span>
      </div>

      <div className={`grid grid-cols-1 ${colsClass} gap-3`}>
        {fields.map((field) => (
          <Input
            key={field.key}
            label={field.label}
            value={categoryData[field.key] || ""}
            onChange={(e) =>
              onFieldChange(
                field.key,
                field.uppercase ? e.target.value.toUpperCase() : e.target.value
              )
            }
            placeholder={field.placeholder}
          />
        ))}
      </div>
    </div>
  );
}
