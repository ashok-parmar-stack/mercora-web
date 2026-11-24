"use client";

import React, { useState, useEffect } from "react";
import { Hash, RefreshCw, Layers } from "lucide-react";
import { useHsnCodes } from "../../../lib/hooks/useHsnCodes";
import { HsnCode, HsnCodeCategoryMapping, ProductCategory } from "@mercora/shared-types";
import { PageHeader } from "../../../components/layout/PageHeader";
import { DataTable, BulkAction } from "../../../components/data-table/DataTable";
import { DeleteConfirmDialog } from "../../../components/common/ConfirmDialog";
import { Select } from "../../../components/ui/Select";
import { useUIStore } from "../../../lib/store/ui-store";
import {
  fetchCategoriesForHsn,
  mapCategoryToHsn,
  unmapCategoryFromHsn,
  fetchProductCategories,
} from "../../../lib/catalog-api";
import {
  hsnColumns,
  renderHsnLevelBadge,
  renderHsnRowActions,
} from "../../../components/hsn/HsnTableColumns";
import { HsnDetailsModal } from "../../../components/hsn/HsnDetailsModal";
import { HsnMappingModal } from "../../../components/hsn/HsnMappingModal";

export default function HsnCodesAdminPage() {
  const addToast = useUIStore((s) => s.addToast);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string>("ALL");
  const [selectedSource, setSelectedSource] = useState<string>("ALL");
  const [isSyncing, setIsSyncing] = useState(false);

  // Modals
  const [viewingHsn, setViewingHsn] = useState<HsnCode | null>(null);
  const [mappingHsn, setMappingHsn] = useState<HsnCode | null>(null);
  const [mappedCategories, setMappedCategories] = useState<HsnCodeCategoryMapping[]>([]);
  const [allCategories, setAllCategories] = useState<ProductCategory[]>([]);
  const [selectedCatToMap, setSelectedCatToMap] = useState<string>("");
  const [isPrimaryCat, setIsPrimaryCat] = useState<boolean>(false);
  const [isLoadingMappings, setIsLoadingMappings] = useState<boolean>(false);
  const [deleteConfirmHsn, setDeleteConfirmHsn] = useState<HsnCode | null>(null);
  const [bulkDeletingIds, setBulkDeletingIds] = useState<string[] | null>(null);

  // Data Fetching Hook
  const { hsnCodes, isLoading, pagination, refetch, sync, remove } = useHsnCodes({
    page: 1,
    limit: 1000,
    search: searchTerm || undefined,
    level: selectedLevel !== "ALL" ? (selectedLevel as any) : undefined,
    source: selectedSource !== "ALL" ? selectedSource : undefined,
  });
  const total = pagination?.total ?? hsnCodes.length;

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      refetch();
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm, selectedLevel, selectedSource, refetch]);

  // Handle Sync
  const handleTriggerSync = async () => {
    setIsSyncing(true);
    try {
      const res = await sync("ICEGATE");
      addToast(
        "success",
        "HSN Sync Completed",
        `ICEGATE sync done: ${res.insertedRecords} inserted, ${res.updatedRecords} updated, ${res.unchangedRecords} unchanged`
      );
      refetch();
    } catch (err: any) {
      addToast("error", "Sync Failed", err?.message || "Sync execution failed");
    } finally {
      setIsSyncing(false);
    }
  };

  // Open Mapping Modal
  const handleOpenMapping = async (hsn: HsnCode) => {
    setMappingHsn(hsn);
    setIsLoadingMappings(true);
    setSelectedCatToMap("");
    setIsPrimaryCat(false);
    try {
      const [mapsRes, catsRes] = await Promise.all([
        fetchCategoriesForHsn(hsn.id),
        fetchProductCategories({ limit: 1000 }),
      ]);
      setMappedCategories(mapsRes);
      setAllCategories(catsRes.items || []);
    } catch (err: any) {
      addToast("error", "Failed to Load Mappings", err?.message || "Could not retrieve category mappings");
    } finally {
      setIsLoadingMappings(false);
    }
  };

  const handleAddCatMapping = async () => {
    if (!mappingHsn || !selectedCatToMap) return;
    try {
      await mapCategoryToHsn(mappingHsn.id, {
        productCategoryId: selectedCatToMap,
        isPrimary: isPrimaryCat,
      });
      const updated = await fetchCategoriesForHsn(mappingHsn.id);
      setMappedCategories(updated);
      setSelectedCatToMap("");
      setIsPrimaryCat(false);
      addToast("success", "Category Mapped", "Category successfully mapped to HSN code");
      refetch();
    } catch (err: any) {
      addToast("error", "Failed to Map Category", err?.message || "Could not complete mapping");
    }
  };

  const handleRemoveCatMapping = async (catId: string) => {
    if (!mappingHsn) return;
    try {
      await unmapCategoryFromHsn(mappingHsn.id, catId);
      const updated = await fetchCategoriesForHsn(mappingHsn.id);
      setMappedCategories(updated);
      addToast("info", "Category Unmapped", "Category mapping removed");
      refetch();
    } catch (err: any) {
      addToast("error", "Failed to Unmap", err?.message || "Could not remove category mapping");
    }
  };

  // Bulk Actions
  const bulkActions: BulkAction<HsnCode>[] = [
    {
      label: "Delete Selected",
      variant: "danger",
      onClick: async (selectedIds) => {
        setBulkDeletingIds(selectedIds);
      },
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* ── Page Header ── */}
      <PageHeader
        title="HSN & Tariff Codes"
        description="Official Government ICEGATE Tariff Schedule and GST Commodity master taxonomy with category associations."
        actionButton={{
          label: "Sync from ICEGATE",
          onClick: handleTriggerSync,
          icon: <RefreshCw className={`w-4 h-4 ${isSyncing ? "animate-spin" : ""}`} />,
          disabled: isSyncing,
        }}
        extraActions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => refetch()}
              className="p-2 rounded-lg border border-border bg-surface hover:bg-surface-hover text-muted-foreground transition-colors shadow-2xs cursor-pointer"
              title="Refresh Data"
              aria-label="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-primary" : ""}`} />
            </button>
          </div>
        }
      />

      {/* ── KPI Metric Summary Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-500 font-medium">Total HSN Codes</div>
            <div className="text-xl font-black text-gray-900 mt-1">{total}</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Hash className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-500 font-medium">Chapters (2-Digit)</div>
            <div className="text-xl font-black text-indigo-600 mt-1">
              {hsnCodes.filter((h) => h.level === "CHAPTER_2").length}
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-500 font-medium">Headings (4-Digit)</div>
            <div className="text-xl font-black text-purple-600 mt-1">
              {hsnCodes.filter((h) => h.level === "HEADING_4").length}
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-500 font-medium">Tariff Items (8-Digit)</div>
            <div className="text-xl font-black text-emerald-600 mt-1">
              {hsnCodes.filter((h) => h.level === "TARIFF_8").length}
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Hash className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* ── Main Data Table ── */}
      <DataTable<HsnCode>
        tableKey="hsn-codes-table"
        data={hsnCodes}
        columns={hsnColumns}
        keyExtractor={(h) => h.id}
        isLoading={isLoading}
        searchQuery={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search by HSN code or commodity description..."
        emptyTitle="No HSN codes found"
        emptyDescription="Sync with ICEGATE to download official GST Tariff Schedule."
        renderActions={(hsn) =>
          renderHsnRowActions(hsn, {
            onOpenMapping: handleOpenMapping,
            onViewHsn: setViewingHsn,
            onDeleteHsn: setDeleteConfirmHsn,
          })
        }
        bulkActions={bulkActions}
        showColumnPicker={true}
        defaultPageSize={10}
        filterSlot={
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="w-40">
              <Select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                dropdownPosition="bottom"
                aria-label="Filter by level"
              >
                <option value="ALL">All Levels</option>
                <option value="CHAPTER_2">2-Digit Chapter</option>
                <option value="HEADING_4">4-Digit Heading</option>
                <option value="SUBHEADING_6">6-Digit Subheading</option>
                <option value="TARIFF_ITEM_8">8-Digit Tariff Item</option>
              </Select>
            </div>

            <div className="w-36">
              <Select
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value)}
                dropdownPosition="bottom"
                aria-label="Filter by source"
              >
                <option value="ALL">All Sources</option>
                <option value="ICEGATE">ICEGATE</option>
                <option value="MANUAL">Manual</option>
              </Select>
            </div>
          </div>
        }
      />

      {/* ── VIEW TARIFF DETAILS MODAL ── */}
      <HsnDetailsModal
        hsn={viewingHsn}
        onClose={() => setViewingHsn(null)}
        renderLevelBadge={renderHsnLevelBadge}
      />

      {/* ── MAP CATEGORIES MODAL ── */}
      <HsnMappingModal
        mappingHsn={mappingHsn}
        onClose={() => setMappingHsn(null)}
        allCategories={allCategories}
        mappedCategories={mappedCategories}
        selectedCatToMap={selectedCatToMap}
        setSelectedCatToMap={setSelectedCatToMap}
        isPrimaryCat={isPrimaryCat}
        setIsPrimaryCat={setIsPrimaryCat}
        isLoadingMappings={isLoadingMappings}
        onAddCatMapping={handleAddCatMapping}
        onRemoveCatMapping={handleRemoveCatMapping}
      />

      {/* ── Single Delete Confirmation Dialog ── */}
      <DeleteConfirmDialog
        isOpen={Boolean(deleteConfirmHsn)}
        onClose={() => setDeleteConfirmHsn(null)}
        entityName={deleteConfirmHsn?.code}
        entityType="HSN tariff code"
        onConfirm={async () => {
          if (!deleteConfirmHsn) return;
          try {
            await remove(deleteConfirmHsn.id);
            addToast("success", "HSN Code Deleted", `Successfully removed tariff code "${deleteConfirmHsn.code}"`);
            setDeleteConfirmHsn(null);
            refetch();
          } catch (err: any) {
            addToast("error", "Failed to Delete", err?.message || "Failed to delete HSN code");
          }
        }}
      />

      {/* ── Bulk Delete Confirmation Dialog ── */}
      <DeleteConfirmDialog
        isOpen={Boolean(bulkDeletingIds && bulkDeletingIds.length > 0)}
        onClose={() => setBulkDeletingIds(null)}
        isBulk={true}
        count={bulkDeletingIds?.length || 0}
        entityType="HSN tariff code"
        onConfirm={async () => {
          if (bulkDeletingIds) {
            try {
              await Promise.all(bulkDeletingIds.map((id) => remove(id)));
              addToast("success", "HSN Codes Deleted", `Successfully removed ${bulkDeletingIds.length} tariff codes`);
              setBulkDeletingIds(null);
              refetch();
            } catch (err: any) {
              addToast("error", "Bulk Delete Failed", err?.message || "Failed to delete selected HSN codes");
            }
          }
        }}
      />
    </div>
  );
}
