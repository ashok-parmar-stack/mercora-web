"use client";

import React, { useCallback, useEffect, useState } from "react";
import { ShieldCheck, Save, Loader2, CheckCircle2, AlertCircle, RefreshCw, Database } from "lucide-react";
import {
  PageHeader,
  Badge,
  Button,
  Input,
  Select,
  Switch,
  Textarea,
  Skeleton,
  ErrorState,
} from "@/components/common";
import { extractErrorMessage } from "@/lib/http/client";
import {
  fetchAdminPaymentSettings,
  runAdminSubscriptionMaintenance,
  updateAdminPaymentSettings,
} from "@/features/subscriptions/api/subscription-api";
import type { PaymentSettingsData } from "@/features/subscriptions/types";

export default function AdminPaymentSettingsPage() {
  const [data, setData] = useState<PaymentSettingsData | null>(null);
  const [form, setForm] = useState<PaymentSettingsData["settings"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [runningMaintenance, setRunningMaintenance] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  const loadSettings = useCallback((signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    fetchAdminPaymentSettings(signal)
      .then((res) => {
        setData(res);
        setForm(res.settings);
      })
      .catch((err) => {
        if (err?.name !== "AbortError") setError(extractErrorMessage(err));
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const ctrl = new AbortController();
    loadSettings(ctrl.signal);
    return () => ctrl.abort();
  }, [loadSettings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    setError(null);
    setSavedNotice(null);
    try {
      const updated = await updateAdminPaymentSettings(form);
      setData(updated);
      setForm(updated.settings);
      setSavedNotice(
        "Database settings updated — GST, scheduler & invoice policies are now active live."
      );
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleRunMaintenance = async () => {
    setRunningMaintenance(true);
    setError(null);
    setSavedNotice(null);
    try {
      const res = await runAdminSubscriptionMaintenance();
      setSavedNotice(
        res?.skipped
          ? "Maintenance sweep skipped (already running)."
          : "Background maintenance sweep executed cleanly (expiry sweep, reconciliation & webhook retries)."
      );
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setRunningMaintenance(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payment Settings"
        description="Database-backed GST rates, subscription grace/upgrade policies, automated scheduler intervals, and tax invoice legal identity."
        badge={
          <Badge variant="brand" size="sm">
            <Database className="w-3 h-3 mr-1" />
            PostgreSQL Live Config
          </Badge>
        }
        extraActions={
          <Button
            type="button"
            variant="outline"
            size="sm"
            isLoading={runningMaintenance}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            onClick={handleRunMaintenance}
          >
            Run Maintenance Now
          </Button>
        }
      />

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-36 rounded-2xl" />
          <Skeleton className="h-96 rounded-2xl" />
        </div>
      ) : error && !form ? (
        <ErrorState
          title="Unable to load payment settings"
          message={error}
          onRetry={() => loadSettings()}
        />
      ) : data && form ? (
        <div className="space-y-6">
          {/* Gateway status banner (no private secrets exposed) */}
          <div className="p-5 rounded-2xl bg-surface border border-border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-text-primary">
                  Gateway Credentials &amp; Environment
                </h2>
                <p className="text-xs text-text-muted mt-0.5">
                  Secrets remain strictly server-side in backend environment variables. Only masked public key metadata is displayed here.
                </p>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-text-secondary">
                  {data.gateways.map((gw) => (
                    <span key={gw.gateway} className="inline-flex items-center gap-2">
                      <strong className="uppercase">{gw.gateway}</strong>
                      <Badge
                        variant={
                          gw.mode === "live"
                            ? "success"
                            : gw.mode === "test"
                            ? "warning"
                            : "danger"
                        }
                        size="sm"
                      >
                        {gw.mode.toUpperCase()}
                      </Badge>
                      {gw.maskedKeyId && (
                        <code className="text-[11px] bg-surface-hover px-1.5 py-0.5 rounded">
                          {gw.maskedKeyId}
                        </code>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSave}
            className="p-6 rounded-2xl bg-surface border border-border shadow-xs space-y-6"
          >
            {error && (
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            {savedNotice && (
              <div className="p-3 rounded-xl bg-status-success-bg border border-status-success/30 text-status-success text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{savedNotice}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="pt-2">
                <Switch
                  label="Enable Razorpay Checkout"
                  description="Allow businesses to purchase & renew via Razorpay"
                  checked={form.razorpayEnabled}
                  onChange={(e) =>
                    setForm({ ...form, razorpayEnabled: e.target.checked })
                  }
                />
              </div>
              <Input
                label="Default Currency"
                value={form.defaultCurrency}
                disabled
              />
              <Input
                label="Default GST Rate (bps, 1800 = 18%)"
                type="number"
                value={String(form.defaultGstRateBps)}
                onChange={(e) =>
                  setForm({
                    ...form,
                    defaultGstRateBps: Math.max(0, Number(e.target.value) || 0),
                  })
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                label="Grace Period (Days)"
                type="number"
                min="0"
                value={String(form.gracePeriodDays)}
                onChange={(e) =>
                  setForm({
                    ...form,
                    gracePeriodDays: Math.max(0, Number(e.target.value) || 0),
                  })
                }
              />
              <Input
                label="Expiring Reminder (Days Before)"
                type="number"
                min="1"
                value={String(form.expiringReminderDays)}
                onChange={(e) =>
                  setForm({
                    ...form,
                    expiringReminderDays: Math.max(1, Number(e.target.value) || 1),
                  })
                }
              />
              <Select
                label="Upgrade Policy"
                value={form.upgradePolicy}
                onChange={(e) =>
                  setForm({
                    ...form,
                    upgradePolicy: e.target.value as "IMMEDIATE" | "END_OF_PERIOD",
                  })
                }
                options={[
                  { value: "IMMEDIATE", label: "Immediate (Prorated)" },
                  { value: "END_OF_PERIOD", label: "End of Period" },
                ]}
              />
              <Select
                label="Downgrade Policy"
                value={form.downgradePolicy}
                onChange={(e) =>
                  setForm({
                    ...form,
                    downgradePolicy: e.target.value as "END_OF_PERIOD" | "IMMEDIATE",
                  })
                }
                options={[
                  { value: "END_OF_PERIOD", label: "End of Current Period" },
                  { value: "IMMEDIATE", label: "Immediate" },
                ]}
              />
            </div>

            <div>
              <Switch
                label="Revoke Subscription Access on Full Refund"
                description="Automatically cancel subscription entitlements when a full refund is processed."
                checked={form.refundRevokesAccess}
                onChange={(e) =>
                  setForm({ ...form, refundRevokesAccess: e.target.checked })
                }
              />
            </div>

            <hr className="border-border" />

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-text-primary">
                  Background Scheduler &amp; Pending Reconciliation
                </h3>
                <p className="text-xs text-text-muted mt-0.5">
                  Persisted in PostgreSQL (`payment_settings`) and hot-reloaded without restarting the backend server.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                <div className="pt-2">
                  <Switch
                    label="Enable Maintenance Scheduler"
                    description="Run periodic expiry sweeps, pending Razorpay checks, and webhook retries"
                    checked={Boolean(form.schedulerEnabled ?? true)}
                    onChange={(e) =>
                      setForm({ ...form, schedulerEnabled: e.target.checked })
                    }
                  />
                </div>
                <Input
                  label="Scheduler Run Interval (Minutes)"
                  type="number"
                  min="1"
                  max="1440"
                  helperText={`Equals ${(form.schedulerIntervalMs ?? 300000).toLocaleString("en-IN")} ms`}
                  value={String(
                    Math.max(1, Math.round((form.schedulerIntervalMs ?? 300000) / 60000))
                  )}
                  onChange={(e) => {
                    const mins = Math.max(1, Math.min(1440, Number(e.target.value) || 1));
                    setForm({ ...form, schedulerIntervalMs: mins * 60000 });
                  }}
                />
                <Input
                  label="Reconcile Pending Orders After (Minutes)"
                  type="number"
                  min="1"
                  max="1440"
                  helperText="Age threshold before querying Razorpay API for stuck orders"
                  value={String(form.reconcilePendingMinutes ?? 2)}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      reconcilePendingMinutes: Math.max(
                        1,
                        Math.min(1440, Number(e.target.value) || 1)
                      ),
                    })
                  }
                />
              </div>
            </div>

            <hr className="border-border" />

            <h3 className="text-sm font-bold text-text-primary">
              Tax Invoice &amp; Legal Billing Identity
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                label="Invoice Prefix"
                value={form.invoicePrefix}
                onChange={(e) => setForm({ ...form, invoicePrefix: e.target.value })}
              />
              <Input
                label="Company Legal Name"
                value={form.companyLegalName}
                onChange={(e) => setForm({ ...form, companyLegalName: e.target.value })}
              />
              <Input
                label="Company GSTIN"
                value={form.companyGstin}
                onChange={(e) => setForm({ ...form, companyGstin: e.target.value })}
              />
              <Input
                label="SAC Code"
                value={form.sacCode}
                onChange={(e) => setForm({ ...form, sacCode: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Company State (for CGST/SGST vs IGST determination)"
                value={form.companyState}
                onChange={(e) => setForm({ ...form, companyState: e.target.value })}
              />
              <Textarea
                label="Registered Billing Address"
                value={form.companyAddress}
                onChange={(e) => setForm({ ...form, companyAddress: e.target.value })}
                rows={2}
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" variant="primary" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving Settings...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Settings</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}
