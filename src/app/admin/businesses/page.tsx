"use client";

import React, { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { LayoutGrid, List, Plus, RefreshCw } from "lucide-react";
import {
  BulkAction,
  Button,
  Card,
  CardContent,
  DataTable,
  DeleteConfirmDialog,
  EmptyState,
  ErrorState,
  LoadingState,
  PageHeader,
  Pagination,
  Select,
} from "@/components/common";
import { Business, BusinessFacets } from "@/features/businesses/types/business.types";
import { fetchBusinessFacets } from "@/features/businesses/api/business-api";
import {
  deleteAdminBusiness,
  fetchAdminBusinesses,
} from "@/features/businesses/api/admin-business-api";
import { BusinessStatsStrip } from "@/features/businesses/components/admin/BusinessStatsStrip";
import { BusinessStatusBadge } from "@/features/businesses/components/admin/BusinessStatusBadge";
import {
  getAdminBusinessColumns,
  renderAdminBusinessRowActions,
} from "@/features/businesses/components/admin/AdminBusinessTableColumns";
import { BusinessVerificationModal } from "@/features/businesses/components/admin/BusinessVerificationModal";
import { useUIStore } from "@/lib/store/ui-store";

function AdminBusinessesContent() {
  const searchParams = useSearchParams();
  const initialTier = searchParams.get("tier") || "ALL";
  const addToast = useUIStore((s) => s.addToast);

  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [facets, setFacets] = useState<BusinessFacets | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [tierFilter, setTierFilter] = useState(initialTier);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stateFilter, setStateFilter] = useState("all");
  const [sortBy, setSortBy] = useState("relevance");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [verifyTarget, setVerifyTarget] = useState<Business | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Business | null>(null);
  const [bulkDeletingIds, setBulkDeletingIds] = useState<string[] | null>(null);

  useEffect(() => {
    setTierFilter(searchParams.get("tier") || "ALL");
    setPage(1);
  }, [searchParams]);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [search]);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [listRes, facetsRes] = await Promise.all([
        fetchAdminBusinesses({
          query: debouncedSearch || undefined,
          businessType: categoryFilter !== "all" ? categoryFilter : undefined,
          state: stateFilter !== "all" ? stateFilter : undefined,
          verifiedOnly: tierFilter === "Verified" ? true : undefined,
          sortBy,
          page,
          limit,
        }),
        fetchBusinessFacets(),
      ]);

      let items = listRes.data || [];
      if (tierFilter !== "ALL" && tierFilter !== "Verified") {
        items = items.filter((b) => b.tier === tierFilter);
      }

      setBusinesses(items);
      setTotalCount(tierFilter !== "ALL" && tierFilter !== "Verified" ? items.length : listRes.total);
      setFacets(facetsRes);
    } catch (err: any) {
      setError(err?.message || "Failed to load businesses.");
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, categoryFilter, stateFilter, tierFilter, sortBy, page, limit]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const columns = useMemo(() => getAdminBusinessColumns(), []);

  const bulkActions: BulkAction<Business>[] = [
    {
      label: "Delete Selected",
      variant: "danger",
      onClick: (ids) => setBulkDeletingIds(ids),
    },
  ];

  const totalPages = Math.max(1, Math.ceil(totalCount / limit));

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Business Management"
        description="Review, verify, edit, and govern registered B2B suppliers and organizations across Mercora."
        actionButton={{
          label: "Add Business",
          href: "/admin/businesses/create",
          icon: <Plus className="w-4 h-4" />,
        }}
        extraActions={
          <div className="flex items-center gap-2">
            <div className="bg-background-secondary p-1 rounded-xl flex items-center gap-1 border border-border">
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === "table"
                    ? "bg-surface text-text-primary shadow-2xs"
                    : "text-text-muted hover:text-text-primary"
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>Table</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-surface text-text-primary shadow-2xs"
                    : "text-text-muted hover:text-text-primary"
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Grid</span>
              </button>
            </div>
            <Button
              variant="outline"
              size="md"
              onClick={loadData}
              className="w-10 h-10 p-0"
              aria-label="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-primary" : ""}`} />
            </Button>
          </div>
        }
      />

      <BusinessStatsStrip
        totalBusinesses={facets?.totalBusinesses ?? totalCount}
        verifiedCount={facets?.verifiedCount ?? 0}
        unverifiedCount={facets?.unverifiedCount ?? 0}
        categoriesCount={facets?.businessCategories?.length ?? 0}
      />

      {error ? (
        <ErrorState title="Unable to Load Businesses" message={error} onRetry={loadData} />
      ) : viewMode === "table" ? (
        <DataTable<Business>
          tableKey="admin-businesses-table"
          data={businesses}
          columns={columns}
          keyExtractor={(b) => b.id}
          isLoading={isLoading}
          searchQuery={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search by name, email, phone, or ID..."
          emptyTitle="No businesses found"
          emptyDescription="No businesses match the active filters."
          enableSelection={true}
          bulkActions={bulkActions}
          showColumnPicker={true}
          totalCount={totalCount}
          currentPage={page}
          pageSize={limit}
          onPageChange={setPage}
          onPageSizeChange={(nextLimit) => {
            setLimit(nextLimit);
            setPage(1);
          }}
          renderActions={(b) =>
            renderAdminBusinessRowActions(b, {
              onVerify: setVerifyTarget,
              onDelete: setDeleteTarget,
            })
          }
          filterSlot={
            <div className="grid grid-cols-1 sm:flex sm:items-center gap-2 sm:flex-wrap w-full sm:w-auto">
              <div className="w-full sm:w-36">
                <Select
                  value={tierFilter}
                  selectSize="sm"
                  onChange={(e) => {
                    setTierFilter(e.target.value);
                    setPage(1);
                  }}
                  aria-label="Filter by verification status"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="Verified">Verified</option>
                  <option value="Premium">Premium</option>
                  <option value="Standard">Standard</option>
                  <option value="Unverified">Unverified</option>
                </Select>
              </div>
              <div className="w-full sm:w-44">
                <Select
                  value={categoryFilter}
                  selectSize="sm"
                  onChange={(e) => {
                    setCategoryFilter(e.target.value);
                    setPage(1);
                  }}
                  aria-label="Filter by business category"
                >
                  <option value="all">All Categories</option>
                  {(facets?.businessCategories || []).map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="w-full sm:w-36">
                <Select
                  value={stateFilter}
                  selectSize="sm"
                  onChange={(e) => {
                    setStateFilter(e.target.value);
                    setPage(1);
                  }}
                  aria-label="Filter by state"
                >
                  <option value="all">All States</option>
                  {(facets?.locations || []).map((loc) => (
                    <option key={loc.name} value={loc.name}>
                      {loc.name}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="w-full sm:w-36">
                <Select
                  value={sortBy}
                  selectSize="sm"
                  onChange={(e) => setSortBy(e.target.value)}
                  aria-label="Sort businesses"
                >
                  <option value="relevance">Most Relevant</option>
                  <option value="rating">Highest Rated</option>
                  <option value="reviews">Most Reviewed</option>
                  <option value="established">Established Year</option>
                </Select>
              </div>
            </div>
          }
        />
      ) : isLoading ? (
        <LoadingState message="Loading businesses..." />
      ) : businesses.length === 0 ? (
        <EmptyState
          title="No businesses found"
          description="Try adjusting your search or filter criteria."
        />
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {businesses.map((b) => (
              <Card key={b.id} className="border border-border bg-surface">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <Link
                        href={`/admin/businesses/${encodeURIComponent(b.slug || b.id)}`}
                        className="font-bold text-sm text-foreground hover:text-primary truncate block"
                      >
                        {b.name}
                      </Link>
                      <p className="text-xs text-text-secondary truncate">
                        {b.businessType} • {[b.city, b.state].filter(Boolean).join(", ")}
                      </p>
                    </div>
                    <BusinessStatusBadge tier={b.tier} isVerified={b.isVerified} />
                  </div>
                  <p className="text-xs text-text-muted line-clamp-2">{b.description || "—"}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <span className="text-[11px] font-mono text-text-muted">{b.id}</span>
                    {renderAdminBusinessRowActions(b, {
                      onVerify: setVerifyTarget,
                      onDelete: setDeleteTarget,
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center pt-2">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                pageSize={limit}
                onPageChange={setPage}
              />
            </div>
          )}
        </div>
      )}

      <BusinessVerificationModal
        business={verifyTarget}
        onClose={() => setVerifyTarget(null)}
        onUpdated={loadData}
      />

      <DeleteConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        entityName={deleteTarget?.name}
        entityType="business"
        onConfirm={async () => {
          if (!deleteTarget) return;
          try {
            await deleteAdminBusiness(deleteTarget.id);
            addToast("success", "Business Deleted", `${deleteTarget.name} has been removed.`);
            setDeleteTarget(null);
            await loadData();
          } catch (err: any) {
            addToast("error", "Delete Failed", err?.message || "Failed to delete business.");
          }
        }}
      />

      <DeleteConfirmDialog
        isOpen={Boolean(bulkDeletingIds)}
        onClose={() => setBulkDeletingIds(null)}
        entityName={bulkDeletingIds ? `${bulkDeletingIds.length} businesses` : undefined}
        entityType="selected businesses"
        onConfirm={async () => {
          if (!bulkDeletingIds) return;
          try {
            await Promise.all(bulkDeletingIds.map((id) => deleteAdminBusiness(id)));
            addToast("success", "Bulk Delete Complete", `${bulkDeletingIds.length} businesses removed.`);
            setBulkDeletingIds(null);
            await loadData();
          } catch (err: any) {
            addToast("error", "Bulk Delete Failed", err?.message || "Failed to delete selected businesses.");
          }
        }}
      />
    </div>
  );
}

export default function AdminBusinessesPage() {
  return (
    <Suspense fallback={<LoadingState message="Loading Business Management..." />}>
      <AdminBusinessesContent />
    </Suspense>
  );
}
