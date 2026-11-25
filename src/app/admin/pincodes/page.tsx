"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Mail,
  RefreshCw,
  Plus,
  Trash2,
  CheckCircle2,
  Search,
  Building,
  MapPin,
  Sparkles,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import {
  Button,
  Input,
  Badge,
  EmptyState,
  LoadingState,
} from "@/components/common";
import { PincodeRecord } from "@/app/api/pincodes/route";
import { SyncIndiaPostModal } from "@/features/pincodes/components/SyncIndiaPostModal";
import { AddPincodeModal } from "@/features/pincodes/components/AddPincodeModal";

export default function PincodesAdminPage() {
  const [pincodes, setPincodes] = useState<PincodeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isSyncOpen, setIsSyncOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/pincodes");
      const json = await res.json();
      if (json.success) {
        setPincodes(json.data || []);
      }
    } catch (err) {
      console.error("Failed to load PIN codes:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this PIN code record?")) return;
    try {
      await fetch(`/api/pincodes?id=${id}`, { method: "DELETE" });
      loadData();
    } catch (err) {
      console.error("Failed to delete PIN code:", err);
    }
  };

  const filtered = pincodes.filter((p) => {
    const matchesSearch =
      p.pincode.includes(search) ||
      p.postOfficeName.toLowerCase().includes(search.toLowerCase()) ||
      p.district.toLowerCase().includes(search.toLowerCase()) ||
      p.state.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" || p.deliveryStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const deliveryCount = pincodes.filter((p) => p.deliveryStatus === "Delivery").length;
  const statesCount = new Set(pincodes.map((p) => p.state)).size;

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <PageHeader
        title="Postal PIN Code Master"
        description="Official Indian postal hierarchy synced directly with India Post Ministry of Communications directory."
        extraActions={
          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAddOpen(true)}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Add PIN Code
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsSyncOpen(true)}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
              className="shadow-xs"
            >
              Sync India Post
            </Button>
          </div>
        }
      />

      {/* ── Key Metrics ── */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-surface border border-border shadow-2xs">
          <div className="text-xs font-semibold text-text-muted">Total PIN Codes</div>
          <div className="text-2xl font-extrabold text-text-primary mt-1">{pincodes.length}</div>
        </div>
        <div className="p-4 rounded-2xl bg-surface border border-border shadow-2xs">
          <div className="text-xs font-semibold text-text-muted">Delivery Hubs</div>
          <div className="text-2xl font-extrabold text-primary mt-1">{deliveryCount}</div>
        </div>
        <div className="p-4 rounded-2xl bg-surface border border-border shadow-2xs">
          <div className="text-xs font-semibold text-text-muted">States Synced</div>
          <div className="text-2xl font-extrabold text-text-primary mt-1">{statesCount}</div>
        </div>
        <div className="p-4 rounded-2xl bg-surface border border-border shadow-2xs flex flex-col justify-center">
          <div className="text-xs font-semibold text-text-muted">India Post API</div>
          <div className="flex items-center gap-1.5 mt-1 text-xs font-bold text-emerald-600">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span>Govt Live Sync Online</span>
          </div>
        </div>
      </div>

      {/* ── Search & Filter Toolbar ── */}
      <div className="p-4 rounded-2xl bg-surface border border-border shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="w-full sm:w-80">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by PIN code, post office, or city..."
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter by delivery status"
            className="px-3 py-2 text-xs rounded-xl border border-border bg-surface text-text-primary w-full sm:w-44 font-medium"
          >
            <option value="ALL">All Delivery Statuses</option>
            <option value="Delivery">Delivery Hub</option>
            <option value="Non-Delivery">Non-Delivery Hub</option>
          </select>
        </div>
      </div>

      {/* ── Data Table ── */}
      {loading ? (
        <LoadingState message="Connecting to Postal PIN Code Master..." />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No PIN Codes Found"
          description={search ? "No records match your search filter." : "No postal PIN codes currently registered."}
          actionLabel="Sync from India Post"
          onAction={() => setIsSyncOpen(true)}
        />
      ) : (
        <div className="rounded-2xl border border-border bg-surface overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[var(--background-secondary)] text-text-secondary uppercase font-bold text-[10px] tracking-wider border-b border-border">
                <tr>
                  <th className="px-5 py-3">PIN Code</th>
                  <th className="px-5 py-3">Post Office Name</th>
                  <th className="px-5 py-3">Branch Type</th>
                  <th className="px-5 py-3">District</th>
                  <th className="px-5 py-3">State</th>
                  <th className="px-5 py-3">Delivery Status</th>
                  <th className="px-5 py-3">Source</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-surface-hover/60 transition-colors">
                    <td className="px-5 py-3.5">
                      <span className="font-mono font-bold text-xs px-2.5 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20">
                        {item.pincode}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-bold text-text-primary">
                      {item.postOfficeName}
                    </td>
                    <td className="px-5 py-3.5 text-text-secondary">
                      {item.branchType}
                    </td>
                    <td className="px-5 py-3.5 text-text-secondary font-medium">
                      {item.district}
                    </td>
                    <td className="px-5 py-3.5 text-text-secondary">
                      {item.state}
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge variant={item.deliveryStatus === "Delivery" ? "success" : "warning"} size="sm">
                        {item.deliveryStatus}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Govt Synced</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 rounded-lg text-text-muted hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                        title="Delete record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Dialog Modals ── */}
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
    </div>
  );
}
