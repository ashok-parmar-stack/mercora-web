"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Crown, RefreshCw, Edit3, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import {
  PageHeader,
  Badge,
  Button,
  DataTable,
  Input,
  Select,
  Textarea,
  ErrorState,
  type Column,
} from "@/components/common";
import { Modal } from "@/components/ui/Modal";
import { extractErrorMessage } from "@/lib/http/client";
import { useAuthStore } from "@/lib/store/auth-store";
import { hasPermission } from "@/lib/auth-helpers";
import {
  fetchAdminPlans,
  fetchAdminSubscriptions,
  runAdminSubscriptionMaintenance,
  updateAdminSubscription,
} from "@/features/subscriptions/api/subscription-api";
import type { SubscriptionPlan, SubscriptionRecord } from "@/features/subscriptions/types";

export default function AdminSubscriptionsPage() {
  const user = useAuthStore((s) => s.user);
  const canManageStatus = hasPermission(user, "SUBSCRIPTIONS.MANAGE_STATUS");

  const [rows, setRows] = useState<SubscriptionRecord[]>([]);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [planId, setPlanId] = useState("");
  const [expiringOnly, setExpiringOnly] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [maintenanceMessage, setMaintenanceMessage] = useState<string | null>(null);
  const [runningMaintenance, setRunningMaintenance] = useState(false);

  // Override modal state
  const [editingSub, setEditingSub] = useState<SubscriptionRecord | null>(null);
  const [nextStatus, setNextStatus] = useState("ACTIVE");
  const [extendDays, setExtendDays] = useState("0");
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAdminPlans()
      .then(setPlans)
      .catch(() => {});
  }, []);

  const loadData = useCallback(
    (signal?: AbortSignal) => {
      setLoading(true);
      setError(null);
      fetchAdminSubscriptions(
        {
          page,
          limit,
          search: search.trim() || undefined,
          status: status || undefined,
          planId: planId || undefined,
          expiringWithinDays: expiringOnly ? 7 : undefined,
        },
        signal
      )
        .then((res) => {
          setRows(res.data || []);
          setTotal(res.meta?.total || 0);
        })
        .catch((err) => {
          if (err?.name !== "AbortError") setError(extractErrorMessage(err));
        })
        .finally(() => setLoading(false));
    },
    [page, limit, search, status, planId, expiringOnly]
  );

  useEffect(() => {
    const ctrl = new AbortController();
    loadData(ctrl.signal);
    return () => ctrl.abort();
  }, [loadData]);

  const handleMaintenance = async () => {
    setRunningMaintenance(true);
    setMaintenanceMessage(null);
    setError(null);
    try {
      const res = await runAdminSubscriptionMaintenance();
      setMaintenanceMessage(
        `Maintenance complete: expired ${res.expired ?? 0}, reconciled ${res.reconciled ?? 0}, webhook retries ${res.retriedWebhooks ?? 0}.`
      );
      loadData();
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setRunningMaintenance(false);
    }
  };

  const handleSaveOverride = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSub) return;
    setSaving(true);
    setError(null);
    try {
      await updateAdminSubscription(editingSub.id, {
        status: nextStatus,
        extendDays: Number(extendDays) > 0 ? Number(extendDays) : undefined,
        reason: reason.trim() || undefined,
      });
      setEditingSub(null);
      loadData();
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const columns: Column<SubscriptionRecord>[] = [
    {
      key: "business",
      header: "Business",
      render: (sub) => (
        <div>
          <p className="text-sm font-semibold text-text-primary">
            {sub.businessName || sub.businessId}
          </p>
          <p className="text-xs text-text-muted">
            {sub.userEmail || sub.userName || "—"}
          </p>
        </div>
      ),
    },
    {
      key: "plan",
      header: "Snapshot Plan",
      render: (sub) => (
        <div>
          <p className="text-sm font-medium text-text-primary">
            {sub.planSnapshot?.name || sub.planId}
          </p>
          <p className="text-xs text-text-muted">
            ₹{Number((sub.amountMinor || 0) / 100).toLocaleString("en-IN")} •{" "}
            {sub.planSnapshot?.billingInterval}
          </p>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (sub) => (
        <div className="flex flex-col items-start gap-1">
          <Badge
            variant={
              sub.status === "ACTIVE"
                ? "success"
                : sub.status === "PAST_DUE"
                ? "warning"
                : sub.status === "CANCELLED" || sub.status === "EXPIRED"
                ? "danger"
                : "neutral"
            }
            size="sm"
          >
            {sub.status}
          </Badge>
          {sub.cancelAtPeriodEnd && (
            <span className="text-[10px] text-status-warning font-medium">
              Cancels at period end
            </span>
          )}
        </div>
      ),
    },
    {
      key: "validity",
      header: "Validity",
      render: (sub) => (
        <div className="text-xs text-text-secondary">
          <div>
            Start: {sub.startsAt ? new Date(sub.startsAt).toLocaleDateString("en-IN") : "—"}
          </div>
          <div>
            Expires: {sub.expiresAt ? new Date(sub.expiresAt).toLocaleDateString("en-IN") : "—"}
          </div>
          {typeof sub.remainingDays === "number" && sub.status === "ACTIVE" && (
            <div className="text-[11px] text-primary font-medium">
              {sub.remainingDays} day(s) left
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Subscription Management"
        description="Monitor active, expiring, past-due, cancelled, and expired business subscriptions."
        badge={
          <Badge variant="neutral" size="sm">
            <Crown className="w-3 h-3" /> {total} Records
          </Badge>
        }
        extraActions={
          canManageStatus ? (
            <Button
              size="sm"
              variant="outline"
              disabled={runningMaintenance}
              onClick={handleMaintenance}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${runningMaintenance ? "animate-spin" : ""}`} />
              <span>Run Lifecycle &amp; Reconciliation Sweep</span>
            </Button>
          ) : undefined
        }
      />

      {maintenanceMessage && (
        <div className="p-3 rounded-xl bg-status-success-bg border border-status-success/30 text-status-success text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{maintenanceMessage}</span>
        </div>
      )}

      {error && (
        <ErrorState
          title="Subscription notice"
          message={error}
          onRetry={() => loadData()}
        />
      )}

      <DataTable
        tableKey="admin-subscriptions"
        data={rows}
        columns={columns}
        keyExtractor={(s) => s.id}
        isLoading={loading}
        emptyTitle="No subscriptions found"
        emptyDescription="Subscriptions created by businesses during Razorpay checkout will appear here."
        searchQuery={search}
        onSearchChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
        searchPlaceholder="Search business name, user email, or ID..."
        filterSlot={
          <div className="flex flex-wrap items-center gap-2">
            <div className="w-40">
              <Select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1);
                }}
                options={[
                  { value: "", label: "All Statuses" },
                  { value: "ACTIVE", label: "Active" },
                  { value: "PENDING", label: "Pending" },
                  { value: "PAST_DUE", label: "Past Due" },
                  { value: "EXPIRED", label: "Expired" },
                  { value: "CANCELLED", label: "Cancelled" },
                ]}
              />
            </div>
            <div className="w-44">
              <Select
                value={planId}
                onChange={(e) => {
                  setPlanId(e.target.value);
                  setPage(1);
                }}
                options={[
                  { value: "", label: "All Plans" },
                  ...plans.map((p) => ({ value: p.id, label: p.name })),
                ]}
              />
            </div>
            <Button
              size="sm"
              variant={expiringOnly ? "primary" : "outline"}
              onClick={() => {
                setExpiringOnly((prev) => !prev);
                setPage(1);
              }}
            >
              Expiring ≤ 7d
            </Button>
          </div>
        }
        renderActions={
          canManageStatus
            ? (sub) => (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditingSub(sub);
                    setNextStatus(sub.status);
                    setExtendDays("0");
                    setReason("");
                  }}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Manage</span>
                </Button>
              )
            : undefined
        }
        totalCount={total}
        currentPage={page}
        pageSize={limit}
        onPageChange={setPage}
        onPageSizeChange={(s) => {
          setLimit(s);
          setPage(1);
        }}
      />

      <Modal
        isOpen={Boolean(editingSub)}
        onClose={() => setEditingSub(null)}
        title="Manage Business Subscription"
        description="Privileged SUBSCRIPTIONS.MANAGE_STATUS adjustment (recorded in subscription audit log)."
      >
        <form onSubmit={handleSaveOverride} className="space-y-4 pt-2">
          {error && (
            <div className="p-3 rounded-xl bg-destructive/10 text-destructive text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          <div className="text-xs text-text-muted">
            Business: <strong className="text-text-primary">{editingSub?.businessName}</strong>
          </div>
          <Select
            label="Lifecycle Status"
            value={nextStatus}
            onChange={(e) => setNextStatus(e.target.value)}
            options={[
              { value: "ACTIVE", label: "ACTIVE" },
              { value: "PAST_DUE", label: "PAST_DUE" },
              { value: "EXPIRED", label: "EXPIRED" },
              { value: "CANCELLED", label: "CANCELLED" },
              { value: "PENDING", label: "PENDING" },
            ]}
          />
          <Input
            label="Extend Expiry Validity (Additional Days)"
            type="number"
            min="0"
            value={extendDays}
            onChange={(e) => setExtendDays(e.target.value)}
          />
          <Textarea
            label="Audit Reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Operational justification for subscription override"
            rows={2}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setEditingSub(null)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              <span>Apply Update</span>
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
