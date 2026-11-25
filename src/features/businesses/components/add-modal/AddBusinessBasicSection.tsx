"use client";

import React, { useMemo } from "react";
import {
  Building2,
  MapPin,
  Sparkles,
  Layers,
  LucideIcon,
  HelpCircle,
} from "lucide-react";
import { Input } from "@/components/common";
import { useBusinessCategories } from "@/features/business-categories/hooks/use-business-categories";
import { CATEGORY_ICON_LOOKUP, COMMON_CATEGORIES } from "./add-business.types";

interface AddBusinessBasicSectionProps {
  businessType: string;
  setBusinessType: (val: string) => void;
  selectedCategoryId: string;
  setSelectedCategoryId: (val: string) => void;
  subcategoryId: string;
  setSubcategoryId: (val: string) => void;
  categoryData: Record<string, any>;
  setCategoryData: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  name: string;
  setName: (val: string) => void;
  category: string;
  setCategory: (val: string) => void;
  city: string;
  setCity: (val: string) => void;
  state: string;
  setState: (val: string) => void;
  pincode: string;
  setPincode: (val: string) => void;
  address: string;
  setAddress: (val: string) => void;
}

export function AddBusinessBasicSection({
  businessType,
  setBusinessType,
  selectedCategoryId,
  setSelectedCategoryId,
  subcategoryId,
  setSubcategoryId,
  categoryData,
  setCategoryData,
  name,
  setName,
  category,
  setCategory,
  city,
  setCity,
  state,
  setState,
  pincode,
  setPincode,
  address,
  setAddress,
}: AddBusinessBasicSectionProps) {
  const { categories } = useBusinessCategories();

  // Root categories (Active only)
  const rootCategories = useMemo(() => {
    return categories.filter((c) => !c.parentId && c.isActive !== false);
  }, [categories]);

  // Current selected root category
  const selectedRoot = useMemo(() => {
    return (
      rootCategories.find(
        (c) =>
          c.id === selectedCategoryId ||
          c.name.toLowerCase() === businessType.toLowerCase() ||
          c.slug.toLowerCase() === businessType.toLowerCase()
      ) || rootCategories[0]
    );
  }, [rootCategories, selectedCategoryId, businessType]);

  // Subcategories available under selected root
  const subcategories = useMemo(() => {
    if (!selectedRoot) return [];
    return categories.filter((c) => c.parentId === selectedRoot.id && c.isActive !== false);
  }, [categories, selectedRoot]);

  const handleSelectRoot = (cat: typeof rootCategories[0]) => {
    setSelectedCategoryId(cat.id);
    setBusinessType(cat.name);
    setSubcategoryId("");
  };

  const handleFieldChange = (key: string, value: any) => {
    setCategoryData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="space-y-5">
      {/* Dynamic Business Type Selector */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-text-secondary uppercase tracking-wider block">
            Select Core Business Classification
          </label>
          <span className="text-[11px] font-semibold text-primary">
            {rootCategories.length} Verified Classifications Available
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {rootCategories.map((item) => {
            const IconComponent =
              CATEGORY_ICON_LOOKUP[item.slug] ||
              CATEGORY_ICON_LOOKUP[item.icon || ""] ||
              Layers;

            const isSelected =
              selectedRoot?.id === item.id ||
              businessType.toLowerCase() === item.name.toLowerCase() ||
              businessType.toLowerCase() === item.slug.toLowerCase();

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectRoot(item)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-sm border-primary ring-2 ring-primary/20 scale-[1.02]"
                    : "bg-surface text-text-secondary hover:text-primary hover:bg-surface-hover border-border"
                }`}
              >
                <IconComponent
                  className={`w-3.5 h-3.5 ${
                    isSelected ? "text-primary-foreground" : "text-text-muted"
                  }`}
                />
                <span>{item.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Subcategory Selector (if available) */}
      {subcategories.length > 0 && (
        <div className="p-3.5 rounded-xl bg-background-secondary/50 border border-border space-y-2">
          <label className="text-xs font-bold text-text-secondary uppercase tracking-wider block">
            Specialized Subcategory / Domain
          </label>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setSubcategoryId("")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                !subcategoryId
                  ? "bg-text-primary text-background border-text-primary"
                  : "bg-surface text-text-muted border-border hover:text-text-primary"
              }`}
            >
              General / All {selectedRoot?.name}
            </button>
            {subcategories.map((sub) => {
              const isSubSelected = subcategoryId === sub.id || subcategoryId === sub.name;
              return (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => setSubcategoryId(sub.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                    isSubSelected
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-surface text-text-secondary border-border hover:text-primary"
                  }`}
                >
                  {sub.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Dynamic Category-Specific Information Section */}
      {selectedRoot && (
        <div className="p-4 rounded-2xl bg-surface border border-primary/20 bg-gradient-to-br from-primary-soft/30 via-surface to-surface space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs font-extrabold text-primary uppercase tracking-wider">
              {selectedRoot.name} Operational Details
            </span>
          </div>

          {/* Exporter Specific Fields */}
          {(selectedRoot.slug.includes("export") || selectedRoot.code?.includes("EXPORT")) && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input
                label="IEC (Import Export Code)"
                value={categoryData.iecCode || ""}
                onChange={(e) => handleFieldChange("iecCode", e.target.value.toUpperCase())}
                placeholder="10-digit IEC code"
              />
              <Input
                label="Export Destination Countries"
                value={categoryData.exportCountries || ""}
                onChange={(e) => handleFieldChange("exportCountries", e.target.value)}
                placeholder="e.g. USA, UAE, Germany"
              />
              <Input
                label="Export Experience (Years)"
                value={categoryData.exportExperience || ""}
                onChange={(e) => handleFieldChange("exportExperience", e.target.value)}
                placeholder="e.g. 12"
              />
            </div>
          )}

          {/* Importer Specific Fields */}
          {(selectedRoot.slug.includes("importer") || selectedRoot.code?.includes("IMPORT")) && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input
                label="Import Sourcing Origins"
                value={categoryData.importCountries || ""}
                onChange={(e) => handleFieldChange("importCountries", e.target.value)}
                placeholder="e.g. China, Japan, Taiwan"
              />
              <Input
                label="Primary Target Products"
                value={categoryData.targetProducts || ""}
                onChange={(e) => handleFieldChange("targetProducts", e.target.value)}
                placeholder="e.g. Electronic components"
              />
              <Input
                label="Import Experience (Years)"
                value={categoryData.importExperience || ""}
                onChange={(e) => handleFieldChange("importExperience", e.target.value)}
                placeholder="e.g. 8"
              />
            </div>
          )}

          {/* Logistics Provider Specific Fields */}
          {(selectedRoot.slug.includes("logistics") || selectedRoot.code?.includes("LOGISTICS")) && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input
                label="Fleet & Transportation Modes"
                value={categoryData.transportModes || ""}
                onChange={(e) => handleFieldChange("transportModes", e.target.value)}
                placeholder="e.g. Heavy Trailers, Reefer Trucks"
              />
              <Input
                label="Warehousing Capacity"
                value={categoryData.warehouseArea || ""}
                onChange={(e) => handleFieldChange("warehouseArea", e.target.value)}
                placeholder="e.g. 50,000 sq.ft."
              />
              <Input
                label="Service Coverage"
                value={categoryData.coverageArea || ""}
                onChange={(e) => handleFieldChange("coverageArea", e.target.value)}
                placeholder="e.g. Pan-India, Western Corridor"
              />
            </div>
          )}

          {/* Freight Forwarder Specific Fields */}
          {(selectedRoot.slug.includes("freight") || selectedRoot.code?.includes("FREIGHT")) && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input
                label="Freight Capabilities"
                value={categoryData.freightModes || ""}
                onChange={(e) => handleFieldChange("freightModes", e.target.value)}
                placeholder="e.g. Air Cargo, Ocean FCL/LCL"
              />
              <Input
                label="IATA / MTO License"
                value={categoryData.mtoLicense || ""}
                onChange={(e) => handleFieldChange("mtoLicense", e.target.value)}
                placeholder="Registration code"
              />
              <Input
                label="Trade Lanes Managed"
                value={categoryData.tradeLanes || ""}
                onChange={(e) => handleFieldChange("tradeLanes", e.target.value)}
                placeholder="e.g. India-Middle East-EU"
              />
            </div>
          )}

          {/* Manufacturer Specific Fields */}
          {(selectedRoot.slug.includes("manufactur") || selectedRoot.code?.includes("MANUFACTUR")) && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input
                label="Production Capacity / Month"
                value={categoryData.monthlyCapacity || ""}
                onChange={(e) => handleFieldChange("monthlyCapacity", e.target.value)}
                placeholder="e.g. 100,000 Units / Month"
              />
              <Input
                label="Factory Certifications"
                value={categoryData.certifications || ""}
                onChange={(e) => handleFieldChange("certifications", e.target.value)}
                placeholder="e.g. ISO 9001, CE, GMP"
              />
              <Input
                label="OEM / ODM Capabilities"
                value={categoryData.oemCapability || ""}
                onChange={(e) => handleFieldChange("oemCapability", e.target.value)}
                placeholder="Yes (Private Labeling Supported)"
              />
            </div>
          )}

          {/* Other Categories Generic Operational Spec */}
          {!selectedRoot.slug.match(/export|importer|logistics|freight|manufactur/) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Specialized Capabilities"
                value={categoryData.specialization || ""}
                onChange={(e) => handleFieldChange("specialization", e.target.value)}
                placeholder="Key services, product lines or agency rights"
              />
              <Input
                label="Key Trade Licences / Registrations"
                value={categoryData.licenseDetails || ""}
                onChange={(e) => handleFieldChange("licenseDetails", e.target.value)}
                placeholder="e.g. Trade license, ISO, CHA"
              />
            </div>
          )}
        </div>
      )}

      {/* Name and Industry */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Company / Business Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Shree Industries Pvt Ltd"
          required
          leftIcon={<Building2 className="w-4 h-4" />}
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-text-secondary">
            Master Industry Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-xl border border-border bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            {COMMON_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Location */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          label="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="e.g. Ahmedabad"
          required
          leftIcon={<MapPin className="w-4 h-4" />}
        />
        <Input
          label="State"
          value={state}
          onChange={(e) => setState(e.target.value)}
          placeholder="e.g. Gujarat"
          required
        />
        <Input
          label="Pincode"
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
          placeholder="e.g. 380001"
        />
      </div>

      <Input
        label="Full Operational Address / Industrial Area"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="e.g. Phase-IV, Vatva GIDC, Ahmedabad, Gujarat"
        leftIcon={<MapPin className="w-4 h-4" />}
      />
    </div>
  );
}
