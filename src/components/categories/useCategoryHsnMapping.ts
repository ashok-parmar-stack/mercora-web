"use client";

import { useState } from "react";
import { HsnCode, HsnCodeCategoryMapping, ProductCategory } from "@mercora/shared-types";
import {
  fetchHsnCodes,
  fetchHsnsForCategory,
  mapCategoryToHsn,
  unmapCategoryFromHsn,
} from "@/lib/catalog-api";
import { useUIStore } from "@/lib/store/ui-store";

export function useCategoryHsnMapping(
  selectedCategory: ProductCategory | null,
  setSelectedCategory: (cat: ProductCategory | null) => void,
  onMutated: () => void
) {
  const addToast = useUIStore((s) => s.addToast);
  const [isMapHsnModalOpen, setIsMapHsnModalOpen] = useState(false);
  const [mappedHsns, setMappedHsns] = useState<HsnCodeCategoryMapping[]>([]);
  const [availableHsns, setAvailableHsns] = useState<HsnCode[]>([]);
  const [selectedHsnToMap, setSelectedHsnToMap] = useState("");
  const [isPrimaryMapping, setIsPrimaryMapping] = useState(false);
  const [isLoadingMappings, setIsLoadingMappings] = useState(false);

  const handleOpenMapHsn = async (cat: ProductCategory) => {
    setSelectedCategory(cat);
    setSelectedHsnToMap("");
    setIsPrimaryMapping(false);
    setIsLoadingMappings(true);
    setIsMapHsnModalOpen(true);
    try {
      const [maps, allHsns] = await Promise.all([
        fetchHsnsForCategory(cat.id),
        fetchHsnCodes({ limit: 1000 }),
      ]);
      setMappedHsns(maps);
      setAvailableHsns(allHsns.items || []);
    } catch (err: any) {
      addToast("error", "Failed to load mappings", err?.message || "Could not retrieve mappings");
    } finally {
      setIsLoadingMappings(false);
    }
  };

  const handleAddHsnMapping = async () => {
    if (!selectedCategory || !selectedHsnToMap) return;
    try {
      await mapCategoryToHsn(selectedHsnToMap, {
        productCategoryId: selectedCategory.id,
        isPrimary: isPrimaryMapping,
      });
      setMappedHsns(await fetchHsnsForCategory(selectedCategory.id));
      setSelectedHsnToMap("");
      setIsPrimaryMapping(false);
      addToast("success", "HSN Code Mapped", "Successfully associated HSN code with category");
      onMutated();
    } catch (err: any) {
      addToast("error", "Failed to Map HSN", err?.message || "Could not complete mapping");
    }
  };

  const handleRemoveHsnMapping = async (hsnCodeId: string) => {
    if (!selectedCategory) return;
    try {
      await unmapCategoryFromHsn(hsnCodeId, selectedCategory.id);
      setMappedHsns(await fetchHsnsForCategory(selectedCategory.id));
      addToast("info", "HSN Mapping Removed", "Successfully unmapped HSN code");
      onMutated();
    } catch (err: any) {
      addToast("error", "Failed to Unmap HSN", err?.message || "Could not remove mapping");
    }
  };

  return {
    isMapHsnModalOpen,
    setIsMapHsnModalOpen,
    mappedHsns,
    availableHsns,
    selectedHsnToMap,
    setSelectedHsnToMap,
    isPrimaryMapping,
    setIsPrimaryMapping,
    isLoadingMappings,
    handleOpenMapHsn,
    handleAddHsnMapping,
    handleRemoveHsnMapping,
  };
}
