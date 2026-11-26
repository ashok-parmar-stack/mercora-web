"use client";

import React, { useState, useEffect } from "react";
import { Plus, RefreshCw, Sparkles } from "lucide-react";
import { useCountries } from "../../../lib/hooks/useCountries";
import { Country } from "@mercora/shared-types";
import { PageHeader } from "../../../components/layout/PageHeader";
import { Button } from "@/components/common";
import { DataTable, BulkAction } from "../../../components/data-table/DataTable";
import {
  DeleteConfirmDialog,
  StatusConfirmDialog,
} from "../../../components/common/ConfirmDialog";
import { Select } from "../../../components/ui/Select";
import { useUIStore } from "../../../lib/store/ui-store";
import {
  getCountryColumns,
  renderCountryRowActions,
} from "@/components/geography/countries/CountryTableColumns";
import { CountryDetailModal } from "@/components/geography/countries/CountryDetailModal";

export default function CountriesAdminPage() {
  const {
    countries: rawCountries,
    pagination,
    isLoading,
    filters,
    updateFilters,
    update,
    remove,
    seedBaseline,
    refetch,
  } = useCountries({ initialParams: { page: 1, limit: 10 } });

  const countries = Array.isArray(rawCountries) ? rawCountries : [];

  const [searchTerm, setSearchTerm] = useState(filters?.search || "");
  const [statusFilter, setStatusFilter] = useState(filters?.status || "ALL");
  const [isSeeding, setIsSeeding] = useState(false);

  // Modals
  const [viewingCountry, setViewingCountry] = useState<Country | null>(null);
  const [deleteConfirmCountry, setDeleteConfirmCountry] = useState<Country | null>(null);
  const [bulkDeletingIds, setBulkDeletingIds] = useState<string[] | null>(null);
  const [bulkStatusConfirm, setBulkStatusConfirm] = useState<{ ids: string[]; targetStatus: string } | null>(null);

  // Real-time search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (filters?.search !== searchTerm) {
        updateFilters({ search: searchTerm });
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm, filters?.search, updateFilters]);

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    updateFilters({ status: status === "ALL" ? undefined : status });
  };

  const addToast = useUIStore((s) => s.addToast);

  const handleSeedBaseline = async () => {
    setIsSeeding(true);
    try {
      const res = await seedBaseline();
      addToast(
        "success",
        "Baseline Countries Seeded",
        `${res.seeded} seeded, ${res.skipped} already existed.`
      );
      refetch();
    } catch (err: any) {
      addToast(
        "error",
        "Seeding Failed",
        err?.message || "Failed to seed baseline countries"
      );
    } finally {
      setIsSeeding(false);
    }
  };

  const columns = getCountryColumns();

  // Bulk Actions
  const bulkActions: BulkAction<Country>[] = [
    {
      label: "Mark Active",
      variant: "primary",
      onClick: async (selectedIds) => {
        setBulkStatusConfirm({ ids: selectedIds, targetStatus: "ACTIVE" });
      },
    },
    {
      label: "Mark Inactive",
      variant: "secondary",
      onClick: async (selectedIds) => {
        setBulkStatusConfirm({ ids: selectedIds, targetStatus: "INACTIVE" });
      },
    },
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
      {/* ── Standard Page Header ── */}
      <PageHeader
        title="Country Management"
        description="Master directory of ISO 3166-1 sovereign nations, dependencies, and international dialing configurations."
        actionButton={{
          label: "Create Country",
          href: "/admin/countries/create",
          icon: <Plus className="w-4 h-4" />,
        }}
        extraActions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="md"
              onClick={handleSeedBaseline}
              disabled={isSeeding}
              leftIcon={<Sparkles className={`w-3.5 h-3.5 text-amber-500 ${isSeeding ? "animate-spin" : ""}`} />}
              title="Populate baseline ISO standard countries"
            >
              <span>{isSeeding ? "Seeding..." : "Seed Baseline"}</span>
            </Button>

            <Button
              variant="outline"
              size="md"
              onClick={() => refetch()}
              className="w-10 h-10 p-0"
              title="Refresh Registry"
              aria-label="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-primary" : ""}`} />
            </Button>
          </div>
        }
      />

      {/* ── Standard Mercora Unified DataTable ── */}
      <DataTable<Country>
        tableKey="countries-table"
        data={countries}
        columns={columns}
        keyExtractor={(c) => c.id}
        isLoading={isLoading}
        searchQuery={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search countries by name, ISO2, ISO3, phone code..."
        emptyTitle="No countries found"
        emptyDescription="There are no countries matching your current filter criteria."
        renderActions={(country) =>
          renderCountryRowActions(country, {
            onView: setViewingCountry,
            onDelete: setDeleteConfirmCountry,
          })
        }
        bulkActions={bulkActions}
        showColumnPicker={true}
        totalCount={pagination?.total ?? 0}
        currentPage={pagination?.page ?? 1}
        pageSize={pagination?.limit ?? 10}
        onPageChange={(page) => updateFilters({ page })}
        onPageSizeChange={(limit) => updateFilters({ limit, page: 1 })}
        filterSlot={
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="w-36">
              <Select
                value={statusFilter}
                selectSize="sm"
                onChange={(e) => handleStatusFilterChange(e.target.value)}
                dropdownPosition="bottom"
                aria-label="Filter by status"
              >
                <option value="ALL">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </Select>
            </div>
          </div>
        }
      />

      {/* ── View Details Modal ── */}
      <CountryDetailModal
        country={viewingCountry}
        onClose={() => setViewingCountry(null)}
      />

      {/* ── Single Delete Confirmation Dialog ── */}
      <DeleteConfirmDialog
        isOpen={Boolean(deleteConfirmCountry)}
        onClose={() => setDeleteConfirmCountry(null)}
        entityName={deleteConfirmCountry?.name}
        entityType="country"
        onConfirm={async () => {
          if (deleteConfirmCountry) {
            await remove(deleteConfirmCountry.id);
            setDeleteConfirmCountry(null);
            refetch();
          }
        }}
      />

      {/* ── Bulk Delete Confirmation Dialog ── */}
      <DeleteConfirmDialog
        isOpen={Boolean(bulkDeletingIds && bulkDeletingIds.length > 0)}
        onClose={() => setBulkDeletingIds(null)}
        isBulk={true}
        count={bulkDeletingIds?.length || 0}
        entityType="country"
        onConfirm={async () => {
          if (bulkDeletingIds) {
            await Promise.all(bulkDeletingIds.map((id) => remove(id)));
            setBulkDeletingIds(null);
            refetch();
          }
        }}
      />

      {/* ── Bulk Status Confirmation Dialog ── */}
      <StatusConfirmDialog
        isOpen={Boolean(bulkStatusConfirm)}
        onClose={() => setBulkStatusConfirm(null)}
        isBulk={true}
        count={bulkStatusConfirm?.ids.length || 0}
        entityType="country"
        targetStatus={bulkStatusConfirm?.targetStatus || "ACTIVE"}
        onConfirm={async () => {
          if (bulkStatusConfirm) {
            await Promise.all(
              bulkStatusConfirm.ids.map((id) =>
                update(id, { status: bulkStatusConfirm.targetStatus })
              )
            );
            setBulkStatusConfirm(null);
            refetch();
          }
        }}
      />
    </div>
  );
}
