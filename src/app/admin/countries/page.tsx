"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  RefreshCw,
  Pencil,
  Trash2,
  Eye,
  X,
  Sparkles,
} from "lucide-react";
import { useCountries } from "../../../lib/hooks/useCountries";
import { Country } from "@mercora/shared-types";
import { PageHeader } from "../../../components/layout/PageHeader";
import { Button } from "@/components/common";
import { DataTable, Column, BulkAction } from "../../../components/data-table/DataTable";
import { StatusBadge } from "../../../components/status/StatusBadge";
import { Tooltip } from "../../../components/ui/Tooltip";
import {
  ConfirmDialog,
  DeleteConfirmDialog,
  StatusConfirmDialog,
} from "../../../components/common/ConfirmDialog";
import { Select } from "../../../components/ui/Select";
import { useUIStore } from "../../../lib/store/ui-store";

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

  // Define Standard Table Columns
  const columns: Column<Country>[] = [
    {
      key: "name",
      header: "Country / Territory",
      sortable: true,
      sortAccessor: (country) => country.name?.toLowerCase() ?? "",
      render: (country) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
            {country.iso2Code}
          </div>
          <div className="min-w-0">
            <div className="font-extrabold text-gray-900 text-xs truncate">{country.name}</div>
            <div className="text-[11px] text-gray-400 truncate max-w-xs">
              {country.officialName || country.name}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "iso2Code",
      header: "ISO Alpha-2",
      align: "center",
      sortable: true,
      width: "95px",
      minWidth: "95px",
      sortAccessor: (country) => country.iso2Code ?? "",
      render: (country) => (
        <span className="inline-block px-2 py-0.5 rounded font-mono font-extrabold text-[11px] bg-blue-50 text-blue-700 border border-blue-200">
          {country.iso2Code}
        </span>
      ),
    },
    {
      key: "iso3Code",
      header: "ISO Alpha-3",
      align: "center",
      sortable: true,
      width: "95px",
      minWidth: "95px",
      sortAccessor: (country) => country.iso3Code ?? "",
      render: (country) => (
        <span className="inline-block px-2 py-0.5 rounded font-mono font-bold text-[11px] bg-gray-100 text-gray-800">
          {country.iso3Code}
        </span>
      ),
    },
    {
      key: "phoneCode",
      header: "Calling Code",
      align: "center",
      sortable: true,
      width: "105px",
      minWidth: "105px",
      sortAccessor: (country) => country.phoneCode ?? "",
      render: (country) => (
        <span className="font-mono text-gray-600 text-[11px] font-medium">
          {country.phoneCode ? `+${country.phoneCode.replace('+', '')}` : "—"}
        </span>
      ),
    },
    {
      key: "currencyCode",
      header: "Currency",
      align: "center",
      sortable: true,
      width: "95px",
      minWidth: "95px",
      sortAccessor: (country) => country.currencyCode ?? "",
      render: (country) => (
        <span className="font-mono text-gray-700 font-bold text-[11px]">
          {country.currencyCode || "—"}
        </span>
      ),
    },
    {
      key: "source",
      header: "Source",
      align: "center",
      sortable: true,
      width: "95px",
      minWidth: "95px",
      render: (country) => (
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-700">
          {country.source || "MANUAL"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      align: "center",
      sortable: true,
      width: "110px",
      minWidth: "110px",
      sortAccessor: (country) => country.status?.code ?? "ACTIVE",
      render: (country) => (
        <StatusBadge
          status={country.status?.code || (country.statusId ? "ACTIVE" : undefined)}
          isDeleted={Boolean(country.deletedAt)}
        />
      ),
    },
  ];

  // Action Buttons per Row
  const renderActions = (country: Country) => (
    <div className="flex items-center justify-end gap-1">
      <Tooltip content="View Country Details">
        <button
          type="button"
          onClick={() => setViewingCountry(country)}
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          aria-label="View details"
        >
          <Eye className="w-4 h-4" />
        </button>
      </Tooltip>

      <Tooltip content="Edit Country">
        <Link
          href={`/admin/countries/${country.id}/edit`}
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          aria-label="Edit country"
        >
          <Pencil className="w-4 h-4" />
        </Link>
      </Tooltip>

      <Tooltip content="Delete Country">
        <button
          type="button"
          onClick={() => setDeleteConfirmCountry(country)}
          className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
          aria-label="Delete country"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </Tooltip>
    </div>
  );

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
        renderActions={renderActions}
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
      {viewingCountry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-2">
                <span className="w-7 h-5 rounded bg-gray-100 border text-xs font-bold flex items-center justify-center">
                  {viewingCountry.iso2Code}
                </span>
                <h3 className="font-extrabold text-gray-900 text-sm">
                  {viewingCountry.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setViewingCountry(null)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-4 text-xs">
              <div className="flex flex-col gap-1 pb-3 border-b border-gray-100">
                <span className="text-[10px] font-bold text-gray-400 uppercase">
                  Official Name
                </span>
                <span className="font-semibold text-gray-800 text-sm">
                  {viewingCountry.officialName || viewingCountry.name}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pb-3 border-b border-gray-100">
                <div>
                  <span className="text-gray-400 block">ISO Alpha-2:</span>
                  <b className="font-mono text-gray-800">{viewingCountry.iso2Code}</b>
                </div>
                <div>
                  <span className="text-gray-400 block">ISO Alpha-3:</span>
                  <b className="font-mono text-gray-800">{viewingCountry.iso3Code}</b>
                </div>
                <div>
                  <span className="text-gray-400 block">Numeric Code:</span>
                  <b className="font-mono text-gray-800">{viewingCountry.numericCode || "—"}</b>
                </div>
                <div>
                  <span className="text-gray-400 block">Phone Code:</span>
                  <b className="font-mono text-gray-800">
                    {viewingCountry.phoneCode ? `+${viewingCountry.phoneCode.replace('+', '')}` : "—"}
                  </b>
                </div>
                <div>
                  <span className="text-gray-400 block">Currency:</span>
                  <b className="font-mono text-gray-800">{viewingCountry.currencyCode || "—"}</b>
                </div>
                <div>
                  <span className="text-gray-400 block">Source:</span>
                  <b className="text-gray-800">{viewingCountry.source || "MANUAL"}</b>
                </div>
              </div>

              <div className="flex flex-col gap-1 text-[11px] text-gray-500">
                <div>Internal UUID: <span className="font-mono text-[10px]">{viewingCountry.id}</span></div>
                <div>Created: <span>{new Date(viewingCountry.createdAt).toLocaleString()}</span></div>
              </div>
            </div>

            <div className="p-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
              <Link
                href={`/admin/countries/${viewingCountry.id}/edit`}
                className="text-xs font-bold text-brand-600 hover:text-brand-700 hover:underline flex items-center gap-1"
              >
                <Pencil className="w-3.5 h-3.5" />
                Open in Edit Page →
              </Link>
              <button
                type="button"
                onClick={() => setViewingCountry(null)}
                className="px-4 py-1.5 rounded-xl bg-gray-200 hover:bg-gray-300 font-bold text-gray-700 text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

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
