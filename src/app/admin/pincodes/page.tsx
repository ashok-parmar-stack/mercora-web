"use client";

import React, { useMemo, useState } from "react";
import { Plus, RefreshCw, Trash2 } from "lucide-react";
import {
  BulkAction,
  Button,
  DataTable,
  DeleteConfirmDialog,
  ErrorState,
  PageHeader,
  Select,
  StatusConfirmDialog,
  Tooltip,
} from "@/components/common";
import { useAbortableFetch } from "@/lib/hooks/useAbortableFetch";
import { useTableState } from "@/lib/hooks/useTableState";
import { useUIStore } from "@/lib/store/ui-store";
import {
  bulkDeletePincodes,
  bulkUpdatePincodeDeliveryStatus,
  deletePincode,
  fetchPincodes,
  PincodeRecord,
} from "@/features/pincodes/api/pincode-api";
import { getPincodeColumns } from "@/features/pincodes/components/pincode-columns";
import { PincodeKpiStrip } from "@/features/pincodes/components/PincodeKpiStrip";
import { SyncIndiaPostModal } from "@/features/pincodes/components/SyncIndiaPostModal";
import { AddPincodeModal } from "@/features/pincodes/components/AddPincodeModal";

export default function AdminPincodesPage() {
  const addToast = useUIStore((s) => s.addToast);
  const clearSelection = useUIStore((s) => s.clearSelection);

  const { search, setSearch } = useTableState({ defaultPageSize: 10 });
  const [pincodes, setPincodes] = useState<PincodeRecord[]>([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [stateFilter, setStateFilter] = useState("ALL");
  const [isSyncOpen, setIsSyncOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<PincodeRecord | null>(null);
  const [bulkDeletingIds, setBulkDeletingIds] = useState<string[] | null>(null);
  const [bulkStatusConfirm, setBulkStatusConfirm] = useState<{
    ids: string[];
    targetStatus: "Delivery" | "Non-Delivery";
  } | null>(null);

  const { isLoading: loading, error, load: loadData } = useAbortableFetch(async (signal) => {
    setPincodes(await fetchPincodes(signal));
  }, []);

  const uniqueStates = useMemo(
    () => Array.from(new Set(pincodes.map((p) => p.state).filter(Boolean))).sort(),
    [pincodes]
  );

  const filtered = useMemo(() => {
    return pincodes.filter((p) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        if (
          !p.pincode.includes(q) &&
          !p.postOfficeName.toLowerCase().includes(q) &&
          !p.district.toLowerCase().includes(q) &&
          !p.state.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      if (statusFilter !== "ALL" && p.deliveryStatus !== statusFilter) return false;
      if (stateFilter !== "ALL" && p.state !== stateFilter) return false;
      return true;
    });
  }, [pincodes, search, statusFilter, stateFilter]);

  const deliveryCount = useMemo(
    () => pincodes.filter((p) => p.deliveryStatus === "Delivery").length,
    [pincodes]
  );
  const columns = useMemo(() => getPincodeColumns(), []);

  const bulkActions: BulkAction<PincodeRecord>[] = [
    { label: "Set Delivery Hub", variant: "primary", onClick: (ids) => setBulkStatusConfirm({ ids, targetStatus: "Delivery" }) },
    { label: "Set Non-Delivery", variant: "secondary", onClick: (ids) => setBulkStatusConfirm({ ids, targetStatus: "Non-Delivery" }) },
    { label: "Delete Selected", variant: "danger", onClick: (ids) => setBulkDeletingIds(ids) },
  ];

  return (
    <div className="flex flex-col gap-6">
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
            <Button variant="outline" size="md" onClick={() => setIsAddOpen(true)} leftIcon={<Plus className="w-4 h-4" />}>
              Add PIN Code
            </Button>
            <Button variant="outline" size="md" onClick={loadData} className="w-10 h-10 p-0" aria-label="Refresh">
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-primary" : ""}`} />
            </Button>
          </div>
        }
      />

      <PincodeKpiStrip total={pincodes.length} deliveryCount={deliveryCount} stateCount={uniqueStates.length} />

      {error ? (
        <ErrorState title="Unable to Load PIN Codes" message={error} onRetry={loadData} />
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
                <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} selectSize="sm" aria-label="Filter by delivery status">
                  <option value="ALL">All Delivery Statuses</option>
                  <option value="Delivery">Delivery Hub</option>
                  <option value="Non-Delivery">Non-Delivery Hub</option>
                </Select>
              </div>
              <div className="w-40">
                <Select value={stateFilter} onChange={(e) => setStateFilter(e.target.value)} selectSize="sm" aria-label="Filter by state">
                  <option value="ALL">All States</option>
                  {uniqueStates.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </Select>
              </div>
            </div>
          }
        />
      )}

      <SyncIndiaPostModal isOpen={isSyncOpen} onClose={() => setIsSyncOpen(false)} onSuccess={loadData} />
      <AddPincodeModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} onSuccess={loadData} />

      <DeleteConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        entityName={deleteTarget ? `${deleteTarget.pincode} (${deleteTarget.postOfficeName})` : undefined}
        entityType="PIN code record"
        onConfirm={async () => {
          if (!deleteTarget) return;
          await deletePincode(deleteTarget.id);
          addToast("success", "PIN Code Removed", `Removed PIN ${deleteTarget.pincode} (${deleteTarget.postOfficeName}).`);
          setDeleteTarget(null);
          await loadData();
        }}
      />

      <DeleteConfirmDialog
        isOpen={Boolean(bulkDeletingIds?.length)}
        onClose={() => setBulkDeletingIds(null)}
        isBulk={true}
        count={bulkDeletingIds?.length || 0}
        entityType="PIN code record"
        onConfirm={async () => {
          if (!bulkDeletingIds?.length) return;
          await bulkDeletePincodes(bulkDeletingIds);
          clearSelection("pincodes-table");
          addToast("success", "PIN Codes Removed", `${bulkDeletingIds.length} PIN code(s) deleted.`);
          setBulkDeletingIds(null);
          await loadData();
        }}
      />

      <StatusConfirmDialog
        isOpen={Boolean(bulkStatusConfirm)}
        onClose={() => setBulkStatusConfirm(null)}
        isBulk={true}
        count={bulkStatusConfirm?.ids.length || 0}
        entityType="PIN code record"
        targetStatus={bulkStatusConfirm?.targetStatus || "Delivery"}
        onConfirm={async () => {
          if (!bulkStatusConfirm) return;
          await bulkUpdatePincodeDeliveryStatus(bulkStatusConfirm.ids, bulkStatusConfirm.targetStatus);
          clearSelection("pincodes-table");
          addToast("success", "Delivery Status Updated", `${bulkStatusConfirm.ids.length} PIN code(s) set to ${bulkStatusConfirm.targetStatus}.`);
          setBulkStatusConfirm(null);
          await loadData();
        }}
      />
    </div>
  );
}
