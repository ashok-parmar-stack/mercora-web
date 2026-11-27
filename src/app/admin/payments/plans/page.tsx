"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Plus,
  Edit2,
  Users,
  Power,
  CheckCircle2,
  Sparkles,
  Loader2,
  Layers,
} from "lucide-react";
import {
  PageHeader,
  Badge,
  Button,
  Skeleton,
  ErrorState,
  EmptyState,
  Checkbox,
  Switch,
} from "@/components/common";
import { Modal } from "@/components/ui/Modal";
import { extractErrorMessage } from "@/lib/http/client";
import {
  fetchAdminPlans,
  fetchAdminSystemPlanTemplates,
  generateAdminSystemPlans,
  updateAdminPlan,
} from "@/features/subscriptions/api/subscription-api";
import { AdminPlanModal } from "@/features/subscriptions/components/admin/AdminPlanModal";
import { AdminPlanSubscribersModal } from "@/features/subscriptions/components/admin/AdminPlanSubscribersModal";
import type { SubscriptionPlan, SystemPlanTemplate } from "@/features/subscriptions/types";
import { DEFAULT_SYSTEM_PLAN_PRESETS } from "@/features/subscriptions/utils/system-plan-generator";

export default function AdminSubscriptionPlansPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [subscribersPlan, setSubscribersPlan] = useState<SubscriptionPlan | null>(null);

  const [generatorOpen, setGeneratorOpen] = useState(false);
  const [templates, setTemplates] = useState<SystemPlanTemplate[]>(DEFAULT_SYSTEM_PLAN_PRESETS);
  const [selectedCodes, setSelectedCodes] = useState<string[]>(() =>
    DEFAULT_SYSTEM_PLAN_PRESETS.map((p) => p.code)
  );
  const [syncExistingGroups, setSyncExistingGroups] = useState(true);
  const [generating, setGenerating] = useState(false);

  const loadPlans = useCallback((signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    fetchAdminPlans(signal)
      .then(setPlans)
      .catch((err) => {
        if (err?.name !== "AbortError") setError(extractErrorMessage(err));
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const ctrl = new AbortController();
    loadPlans(ctrl.signal);
    return () => ctrl.abort();
  }, [loadPlans]);

  const openGeneratorModal = () => {
    setNotice(null);
    setError(null);
    setGeneratorOpen(true);
    fetchAdminSystemPlanTemplates()
      .then((list) => {
        if (Array.isArray(list) && list.length > 0) {
          setTemplates(list);
          setSelectedCodes(list.map((t) => t.code));
        }
      })
      .catch(() => {
        // Fallback to built-in DEFAULT_SYSTEM_PLAN_PRESETS
      });
  };

  const handleGenerateSystemPlans = async () => {
    if (selectedCodes.length === 0) return;
    setGenerating(true);
    setError(null);
    try {
      const res = await generateAdminSystemPlans({
        codes: selectedCodes,
        syncFeatureGroups: syncExistingGroups,
      });
      setPlans(res.plans || []);
      setGeneratorOpen(false);
      setNotice(
        `Mercora system plan sync finished: ${res.createdCount} plan(s) generated, ${res.updatedCount} synced, ${res.skippedCount} skipped.`
      );
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setGenerating(false);
    }
  };

  const handleToggleActive = async (plan: SubscriptionPlan) => {
    setTogglingId(plan.id);
    setError(null);
    try {
      await updateAdminPlan(plan.id, { isActive: !plan.isActive });
      loadPlans();
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setTogglingId(null);
    }
  };

  const existingCodeSet = new Set(plans.map((p) => p.code.toUpperCase()));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Subscription Plans"
        description="Configure pricing tiers, GST rate, entitlements, billing intervals, and auto-generate Mercora system plans."
        extraActions={
          <Button
            type="button"
            variant="outline"
            size="md"
            leftIcon={<Sparkles className="w-4 h-4 text-primary" />}
            onClick={openGeneratorModal}
          >
            Generate System Plans
          </Button>
        }
        actionButton={{
          label: "Create Plan",
          icon: <Plus className="w-4 h-4" />,
          onClick: () => {
            setEditingPlan(null);
            setModalOpen(true);
          },
        }}
      />

      {notice && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center justify-between gap-2">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{notice}</span>
          </span>
          <button
            type="button"
            onClick={() => setNotice(null)}
            className="text-xs underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {error && (
        <ErrorState title="Plan Operation Notice" message={error} onRetry={() => loadPlans()} />
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-80 rounded-2xl" />
          ))}
        </div>
      ) : plans.length === 0 ? (
        <EmptyState
          title="No subscription plans defined"
          description="Generate Mercora's curated system plans in one click or create a custom plan."
          actionLabel="Generate System Plans"
          onAction={openGeneratorModal}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const groups = plan.featureGroups || [];
            const enabledModules = groups.filter((g) => g.included).length;

            return (
              <div
                key={plan.id}
                className="rounded-2xl bg-surface border border-border p-6 shadow-xs flex flex-col justify-between gap-5"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-lg font-bold text-text-primary">{plan.name}</h2>
                        {plan.isPopular && (
                          <Badge variant="brand" size="sm">
                            Popular
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-text-muted font-mono mt-0.5">{plan.code}</p>
                    </div>
                    <Badge variant={plan.isActive ? "success" : "neutral"} size="sm">
                      {plan.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>

                  <div>
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="text-2xl font-extrabold text-text-primary font-data">
                        ₹{Number(plan.price).toLocaleString("en-IN")}
                      </span>
                      {plan.originalPrice && plan.originalPrice > plan.price && (
                        <span className="text-sm text-text-muted line-through font-data">
                          ₹{Number(plan.originalPrice).toLocaleString("en-IN")}
                        </span>
                      )}
                      <span className="text-xs text-text-muted">
                        / {plan.durationDays} days ({plan.billingInterval})
                      </span>
                    </div>
                    <p className="text-xs text-text-muted mt-0.5">
                      Total incl. {(plan.gstRateBps / 100).toFixed(0)}% GST: ₹
                      {Number(plan.totalPrice).toLocaleString("en-IN")}
                    </p>
                  </div>

                  {plan.description && (
                    <p className="text-xs text-text-secondary leading-relaxed">{plan.description}</p>
                  )}

                  <div className="rounded-xl bg-surface-hover/50 p-3 text-xs space-y-1 text-text-secondary">
                    <div className="flex justify-between">
                      <span>Business Listings</span>
                      <span className="font-semibold text-text-primary font-data">
                        {plan.limits.maxBusinessListings < 0
                          ? "Unlimited"
                          : plan.limits.maxBusinessListings}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Products / Listing</span>
                      <span className="font-semibold text-text-primary font-data">
                        {plan.limits.maxProducts < 0 ? "Unlimited" : plan.limits.maxProducts}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Enquiries / Month</span>
                      <span className="font-semibold text-text-primary font-data">
                        {plan.limits.maxEnquiriesPerMonth < 0
                          ? "Unlimited"
                          : plan.limits.maxEnquiriesPerMonth}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>System Modules (/pricing)</span>
                      <span className="font-semibold text-primary font-data">
                        {groups.length > 0 ? `${enabledModules}/${groups.length} Enabled` : "Auto"}
                      </span>
                    </div>
                  </div>

                  <ul className="space-y-1.5 text-xs text-text-secondary">
                    {(plan.features || []).slice(0, 5).map((feat, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-border space-y-3">
                  <div className="flex items-center justify-between text-xs text-text-muted">
                    <span>
                      Active subscribers:{" "}
                      <strong className="text-text-primary">
                        {plan.activeSubscribersCount ?? 0}
                      </strong>
                    </span>
                    <span>Order #{plan.displayOrder}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingPlan(plan);
                        setModalOpen(true);
                      }}
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSubscribersPlan(plan)}
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>Subscribers</span>
                    </Button>
                    <Button
                      size="sm"
                      variant={plan.isActive ? "ghost" : "primary"}
                      disabled={togglingId === plan.id}
                      onClick={() => handleToggleActive(plan)}
                    >
                      <Power className="w-3.5 h-3.5" />
                      <span>{plan.isActive ? "Deactivate" : "Activate"}</span>
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <AdminPlanModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        plan={editingPlan}
        existingCodes={plans.map((p) => p.code)}
        onSaved={() => loadPlans()}
      />

      <AdminPlanSubscribersModal
        plan={subscribersPlan}
        onClose={() => setSubscribersPlan(null)}
      />

      {/* System Plan Generator Modal */}
      <Modal
        isOpen={generatorOpen}
        onClose={() => !generating && setGeneratorOpen(false)}
        title="Generate Mercora System Plans"
        description="Auto-generate standardized Mercora directory, catalog, RFQ inbox, and GST subscription plans without altering existing pricing or active subscriber snapshots."
        maxWidth="xl"
      >
        <div className="space-y-4 pt-2">
          <div className="space-y-2.5 max-h-[50vh] overflow-y-auto pr-1">
            {templates.map((tpl) => {
              const checked = selectedCodes.includes(tpl.code);
              const exists = existingCodeSet.has(tpl.code.toUpperCase());
              return (
                <div
                  key={tpl.code}
                  className="p-3.5 rounded-xl border border-border bg-surface-hover/30 flex items-start justify-between gap-3"
                >
                  <Checkbox
                    checked={checked}
                    onChange={(e) => {
                      const nextChecked = e.target.checked;
                      setSelectedCodes((prev) =>
                        nextChecked
                          ? Array.from(new Set([...prev, tpl.code]))
                          : prev.filter((c) => c !== tpl.code)
                      );
                    }}
                    label={
                      <span className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-text-primary">{tpl.name}</span>
                        <span className="font-mono text-[11px] text-text-muted">{tpl.code}</span>
                        <Badge variant={exists ? "neutral" : "brand"} size="sm">
                          {exists ? "Already Exists" : "New System Tier"}
                        </Badge>
                      </span>
                    }
                    description={`₹${Number(tpl.price).toLocaleString("en-IN")} + GST (${
                      tpl.durationDays
                    } days) • ${tpl.limits.maxBusinessListings < 0 ? "Unlimited" : tpl.limits.maxBusinessListings} Listings • ${
                      tpl.limits.maxProducts < 0 ? "Unlimited" : tpl.limits.maxProducts
                    } Products • ${
                      tpl.limits.maxEnquiriesPerMonth < 0
                        ? "Unlimited"
                        : tpl.limits.maxEnquiriesPerMonth
                    } RFQs/Mo`}
                  />
                </div>
              );
            })}
          </div>

          <label className="flex items-center justify-between gap-3 p-3 rounded-xl border border-border bg-background-secondary/60 cursor-pointer">
            <div className="text-xs">
              <p className="font-bold text-text-primary flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-primary" />
                <span>Sync /pricing System Modules on Existing Plans</span>
              </p>
              <p className="text-[11px] text-text-muted mt-0.5">
                Updates interactive module groups from plan limits cleanly without altering prices.
              </p>
            </div>
            <Switch
              checked={syncExistingGroups}
              onChange={(e) => setSyncExistingGroups(e.target.checked)}
            />
          </label>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
            <Button
              type="button"
              variant="outline"
              disabled={generating}
              onClick={() => setGeneratorOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              disabled={generating || selectedCodes.length === 0}
              onClick={handleGenerateSystemPlans}
            >
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Selected Plans ({selectedCodes.length})</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
