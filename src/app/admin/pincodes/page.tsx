"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  RefreshCw,
  Plus,
  Trash2,
  CheckCircle2,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable, Column, BulkAction } from "@/components/data-table/DataTable";
import {
  DeleteConfirmDialog,
  StatusConfirmDialog,
} from "@/components/common/ConfirmDialog";
import { Button, Badge, Select, Tooltip, ErrorState } from "@/components/common";
import { useUIStore } from "@/lib/store/ui-store";
import { PincodeRecord } from "@/app/api/pincodes/route";
import { SyncIndiaPostModal } from "@/features/pincodes/components/SyncIndiaPostModal";
import { AddPincodeModal } from "@/features/pincodes/components/AddPincodeModal";

export default function PincodesAdminPage() {
  const addToast = useUIStore((s) => s.addToast);
  const clearSelection = useUIStore((s) => s.clearSelection);

  const [pincodes, setPincodes] = useState<PincodeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [stateFilter, setStateFilter] = useState("ALL");
  const [isSyncOpen, setIsSyncOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Confirm Dialog states
  const [deleteTarget, setDeleteTarget] = useState<PincodeRecord | null>(null);
  const [bulkDeletingIds, setBulkDeletingIds] = useState<string[] | null>(null);
  const [bulkStatusConfirm, setBulkStatusConfirm] = useState<{
    ids: string[];
    targetStatus: "Delivery" | "Non-Delivery";
  } | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/pincodes", { cache: "no-store" });
      const json = await res.json();
      if (json.success) {
        setPincodes(json.data || []);
      } else {
        throw new Error(json.message || "Failed to load PIN codes");
      }
    } catch (err: any) {
      console.error("Failed to load PIN codes:", err);
      setError(err?.message || "Failed to connect to PIN code directory.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const uniqueStates = useMemo(
    () => Array.from(new Set(pincodes.map((p) => p.state).filter(Boolean))).sort(),
    [pincodes]
  );

  const filtered = useMemo(() => {
    return pincodes.filter((p) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesSearch =
          p.pincode.includes(q) ||
          p.postOfficeName.toLowerCase().includes(q) ||
          p.district.toLowerCase().includes(q) ||
          p.state.toLowerCase().includes(q);
        if (!matchesSearch) return false;
      }

      if (statusFilter !== "ALL" && p.deliveryStatus !== statusFilter) return false;
      if (stateFilter !== "ALL" && p.state !== stateFilter) return false;
      return true;
    });
  }, [pincodes, search, statusFilter, stateFilter]);

  const deliveryCount = pincodes.filter((p) => p.deliveryStatus === "Delivery").length;

  const handleDeleteSingle = async () => {
    if (!deleteTarget) return;
    const res = await fetch(`/api/pincodes?id=${encodeURIComponent(deleteTarget.id)}`, {
      method: "DELETE",
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message || "Delete failed");
    addToast("success", "PIN Code Removed", `Removed PIN ${deleteTarget.pincode} (${deleteTarget.postOfficeName}).`);
    setDeleteTarget(null);
    await loadData();
  };

  const handleBulkDelete = async () => {
    if (!bulkDeletingIds || bulkDeletingIds.length === 0) return;
    const res = await fetch(
      `/api/pincodes?ids=${encodeURIComponent(bulkDeletingIds.join(","))}`,
      { method: "DELETE" }
    );
    const json = await res.json();
    if (!json.success) throw new Error(json.message || "Bulk delete failed");
    clearSelection("pincodes-table");
    addToast("success", "PIN Codes Removed", `${bulkDeletingIds.length} PIN code(s) deleted.`);
    setBulkDeletingIds(null);
    await loadData();
  };

  const handleBulkStatus = async () => {
    if (!bulkStatusConfirm) return;
    const res = await fetch("/api/pincodes", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ids: bulkStatusConfirm.ids,
        deliveryStatus: bulkStatusConfirm.targetStatus,
      }),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message || "Status update failed");
    clearSelection("pincodes-table");
    addToast(
      "success",
      "Delivery Status Updated",
      `${bulkStatusConfirm.ids.length} PIN code(s) set to ${bulkStatusConfirm.targetStatus}.`
    );
    setBulkStatusConfirm(null);
    await loadData();
  };

  const columns: Column<PincodeRecord>[] = [
    {
      key: "pincode",
      header: "PIN Code",
      sortable: true,
      sortAccessor: (p) => p.pincode,
      render: (item) => (
        <span className="font-mono font-bold text-xs px-2.5 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20">
          {item.pincode}
        </span>
      ),
    },
    {
      key: "postOfficeName",
      header: "Post Office Name",
      sortable: true,
      sortAccessor: (p) => p.postOfficeName.toLowerCase(),
      render: (item) => (
        <span className="font-bold text-xs text-text-primary">{item.postOfficeName}</span>
      ),
    },
    {
      key: "branchType",
      header: "Branch Type",
      sortable: true,
      render: (item) => <span className="text-xs text-text-secondary">{item.branchType}</span>,
    },
    {
      key: "district",
      header: "District",
      sortable: true,
      render: (item) => (
        <span className="text-xs text-text-secondary font-medium">{item.district}</span>
      ),
    },
    {
      key: "state",
      header: "State",
      sortable: true,
      render: (item) => <span className="text-xs text-text-secondary">{item.state}</span>,
    },
    {
      key: "deliveryStatus",
      header: "Delivery Status",
      sortable: true,
      render: (item) => (
        <Badge variant={item.deliveryStatus === "Delivery" ? "success" : "warning"} size="sm">
          {item.deliveryStatus}
        </Badge>
      ),
    },
    {
      key: "source",
      header: "Source",
      sortable: true,
      render: (item) => (
        <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{item.source === "MANUAL_ENTRY" ? "Manual" : "Govt Synced"}</span>
        </div>
      ),
    },
  ];

  const bulkActions: BulkAction<PincodeRecord>[] = [
    {
      label: "Set Delivery Hub",
      variant: "primary",
      onClick: (ids) => setBulkStatusConfirm({ ids, targetStatus: "Delivery" }),
    },
    {
      label: "Set Non-Delivery",
      variant: "secondary",
      onClick: (ids) => setBulkStatusConfirm({ ids, targetStatus: "Non-Delivery" }),
    },
    {
      label: "Delete Selected",
      variant: "danger",
      onClick: (ids) => setBulkDeletingIds(ids),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* ── Page Header ── */}
      <PageHeader
        title="Postal PIN Code Master"
        description="Official Indian postal hierarchy synced directly with India Post Ministry of Communications directory."
        actionButton={{
          label: "Sync India Post",
          onClick: () => setIsSyncOpen(true),
          icon: <RefreshCw className="w-4 h-4" />,
        }}
        extraActions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="md"
              onClick={() => setIsAddOpen(true)}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add PIN Code
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={loadData}
              className="w-10 h-10 p-0"
              title="Refresh PIN Codes"
              aria-label="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-primary" : ""}`} />
            </Button>
          </div>
        }
      />

      {/* ── Key Metrics ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-surface border border-border shadow-2xs">
          <div className="text-xs font-semibold text-text-muted">Total PIN Codes</div>
          <div className="text-2xl font-extrabold text-text-primary mt-1">{pincodes.length}</div>
        </div>
        <div className="p-4 rounded-xl bg-surface border border-border shadow-2xs">
          <div className="text-xs font-semibold text-text-muted">Delivery Hubs</div>
          <div className="text-2xl font-extrabold text-primary mt-1">{deliveryCount}</div>
        </div>
        <div className="p-4 rounded-xl bg-surface border border-border shadow-2xs">
          <div className="text-xs font-semibold text-text-muted">States Synced</div>
          <div className="text-2xl font-extrabold text-text-primary mt-1">{uniqueStates.length}</div>
        </div>
        <div className="p-4 rounded-xl bg-surface border border-border shadow-2xs flex flex-col justify-center">
          <div className="text-xs font-semibold text-text-muted">India Post API</div>
          <div className="flex items-center gap-1.5 mt-1 text-xs font-bold text-emerald-600">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span>Govt Live Sync Online</span>
          </div>
        </div>
      </div>

      {/* ── Global DataTable with Multi-Select & Filters ── */}
      {error ? (
        <ErrorState
          title="Unable to Load PIN Codes"
          message={error}
          onRetry={loadData}
        />
      ) : (
        <DataTable<PincodeRecord>
          tableKey="pincodes-table"
          data={filtered}
          columns={columns}
          keyExtractor={(p) => p.id}
          isLoading={loading}
          searchQuery={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search by PIN code, post office, district, or state..."
          emptyTitle="No PIN Codes Found"
          emptyDescription="No postal PIN codes match your active filters. Sync directly from India Post."
          enableSelection={true}
          bulkActions={bulkActions}
          showColumnPicker={true}
          defaultPageSize={10}
          defaultSortKey="pincode"
          defaultSortDir="asc"
          renderActions={(item) => (
            <Tooltip content="Delete Record">
              <button
                type="button"
                onClick={() => setDeleteTarget(item)}
                className="p-1.5 rounded-lg text-text-muted hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                aria-label={`Delete PIN ${item.pincode}`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </Tooltip>
          )}
          filterSlot={
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="w-44">
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  selectSize="sm"
                  aria-label="Filter by delivery status"
                >
                  <option value="ALL">All Delivery Statuses</option>
                  <option value="Delivery">Delivery Hub</option>
                  <option value="Non-Delivery">Non-Delivery Hub</option>
                </Select>
              </div>
              <div className="w-40">
                <Select
                  value={stateFilter}
                  onChange={(e) => setStateFilter(e.target.value)}
                  selectSize="sm"
                  aria-label="Filter by state"
                >
                  <option value="ALL">All States</option>
                  {uniqueStates.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          }
        />
      )}

      {/* ── Modals ── */}
      <SyncIndiaPostModal
        isOpen={isSyncOpen}
        onClose={() => setIsSyncOpen(false)}
        onSuccess={loadData}
      />

      <AddPincodeModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSuccess={loadData}
      />

      {/* ── Confirm Dialogs ── */}
      <DeleteConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        entityName={deleteTarget ? `${deleteTarget.pincode} (${deleteTarget.postOfficeName})` : undefined}
        entityType="PIN code record"
        onConfirm={handleDeleteSingle}
      />

      <DeleteConfirmDialog
        isOpen={Boolean(bulkDeletingIds && bulkDeletingIds.length > 0)}
        onClose={() => setBulkDeletingIds(null)}
        isBulk={true}
        count={bulkDeletingIds?.length || 0}
        entityType="PIN code record"
        onConfirm={handleBulkDelete}
      />

      <StatusConfirmDialog
        isOpen={Boolean(bulkStatusConfirm)}
        onClose={() => setBulkStatusConfirm(null)}
        isBulk={true}
        count={bulkStatusConfirm?.ids.length || 0}
        entityType="PIN code record"
        targetStatus={bulkStatusConfirm?.targetStatus || "Delivery"}
        onConfirm={handleBulkStatus}
      />
    </div>
  );
}
