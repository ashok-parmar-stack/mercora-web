"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Crown,
  Calendar,
  Clock,
  Receipt,
  RefreshCw,
  ArrowUpRight,
  XCircle,
  Building2,
  Plus,
  CheckCircle2,
  AlertTriangle,
  History,
} from "lucide-react";
import { CustomerSubHeader } from "@/components/layout/CustomerSubHeader";
import {
  Badge,
  Button,
  Card,
  CardContent,
  ConfirmationDialog,
  ErrorState,
  LoadingState,
  Select,
} from "@/components/common";
import { useAbortableFetch } from "@/lib/hooks/useAbortableFetch";
import { useUIStore } from "@/lib/store/ui-store";
import { extractErrorMessage } from "@/lib/http/client";
import { AddBusinessModal } from "@/features/businesses/components/AddBusinessModal";
import {
  cancelSubscription,
  downgradeSubscription,
  fetchActivePlans,
  fetchCurrentSubscription,
  fetchSubscriptionHistory,
} from "@/features/subscriptions/api/subscription-api";
import type {
  BusinessSubscriptionOverview,
  SubscriptionPlan,
  SubscriptionRecord,
} from "@/features/subscriptions/types";
import {
  formatInrMinor,
  formatLimitValue,
  formatSubscriptionDate,
  getSubscriptionBadgeVariant,
} from "@/features/subscriptions/utils/razorpay-checkout";
import { PlanCatalogSection } from "@/features/subscriptions/components/PlanCatalogSection";

function BusinessSubscriptionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const addToast = useUIStore((s) => s.addToast);

  const [selectedBusinessId, setSelectedBusinessId] = useState<string>(
    searchParams.get("businessId") || ""
  );
  const [overview, setOverview] = useState<BusinessSubscriptionOverview | null>(null);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [history, setHistory] = useState<SubscriptionRecord[]>([]);
  const [isAddBizOpen, setIsAddBizOpen] = useState(false);

  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [downgradeTarget, setDowngradeTarget] = useState<SubscriptionPlan | null>(null);
  const [isDowngrading, setIsDowngrading] = useState(false);

  const { isLoading, error, load } = useAbortableFetch(async (signal) => {
    const [ov, activePlans, hist] = await Promise.all([
      fetchCurrentSubscription(selectedBusinessId || undefined, signal),
      fetchActivePlans(signal),
      fetchSubscriptionHistory(
        { businessId: selectedBusinessId || undefined, page: 1, limit: 10 },
        signal
      ),
    ]);
    setOverview(ov);
    setPlans(activePlans);
    setHistory(hist?.data || []);
    if (!selectedBusinessId && ov.selectedBusiness?.id) {
      setSelectedBusinessId(ov.selectedBusiness.id);
    }
  }, [selectedBusinessId]);

  useEffect(() => {
    const reqDowngradeId = searchParams.get("downgradePlanId");
    if (reqDowngradeId && plans.length > 0 && !downgradeTarget) {
      const match = plans.find((p) => p.id === reqDowngradeId);
      if (match) setDowngradeTarget(match);
    }
  }, [searchParams, plans, downgradeTarget]);

  const handleSelectPlan = (
    plan: SubscriptionPlan,
    mode: "purchase" | "renew" | "upgrade" | "downgrade"
  ) => {
    if (mode === "downgrade") {
      setDowngradeTarget(plan);
      return;
    }

    const bizQuery = overview?.selectedBusiness?.id
      ? `&businessId=${encodeURIComponent(overview.selectedBusiness.id)}`
      : "";

    router.push(
      `/subscription/checkout?planId=${encodeURIComponent(plan.id)}&mode=${mode}${bizQuery}`
    );
  };

  const handleConfirmDowngrade = async () => {
    if (!downgradeTarget) return;
    setIsDowngrading(true);
    try {
      const res = await downgradeSubscription({
        targetPlanId: downgradeTarget.id,
        businessId: overview?.selectedBusiness?.id || undefined,
      });
      addToast("success", "Downgrade Scheduled", res?.message || "Plan downgrade updated.");
      setDowngradeTarget(null);
      await load();
    } catch (err) {
      addToast("error", "Downgrade Failed", extractErrorMessage(err));
    } finally {
      setIsDowngrading(false);
    }
  };

  const handleConfirmCancel = async () => {
    setIsCancelling(true);
    try {
      const res = await cancelSubscription({
        businessId: overview?.selectedBusiness?.id || undefined,
        cancelAtPeriodEnd: true,
        reason: "Cancelled by user from subscription dashboard",
      });
      addToast("success", "Cancellation Recorded", res?.message || "Subscription cancelled.");
      setCancelModalOpen(false);
      await load();
    } catch (err) {
      addToast("error", "Cancellation Failed", extractErrorMessage(err));
    } finally {
      setIsCancelling(false);
    }
  };

  const sub = overview?.subscription;
  const entitlements = overview?.entitlements;

  return (
    <>
      <CustomerSubHeader
        icon={<Crown className="w-5 h-5 text-primary" />}
        title="Subscription & Billing"
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {isLoading ? (
          <LoadingState message="Loading subscription details..." />
        ) : error ? (
          <ErrorState
            title="Unable to Load Subscription"
            message={error}
            onRetry={load}
          />
        ) : overview ? (
          <>
            {/* Top Controls: Billing Scope / Business Selector & Quick Links */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface p-4 rounded-2xl border border-border shadow-2xs">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
                    Managing Subscription For
                  </p>
                  {overview.businesses.length > 1 ? (
                    <Select
                      selectSize="sm"
                      value={selectedBusinessId}
                      onChange={(e) => setSelectedBusinessId(e.target.value)}
                      aria-label="Select business"
                    >
                      {overview.businesses.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name} ({b.city})
                        </option>
                      ))}
                    </Select>
                  ) : overview.selectedBusiness ? (
                    <h2 className="text-sm font-bold text-text-primary">
                      {overview.selectedBusiness.name} • {overview.selectedBusiness.city}
                    </h2>
                  ) : (
                    <h2 className="text-sm font-bold text-text-primary">
                      {entitlements?.businessName || "Account Subscription"}
                    </h2>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2.5 flex-wrap">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                  onClick={() => setIsAddBizOpen(true)}
                >
                  Add Business
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  leftIcon={<Receipt className="w-3.5 h-3.5" />}
                  asChild
                >
                  <Link href="/subscription/payments">Payment History &amp; Invoices</Link>
                </Button>
              </div>
            </div>

            {/* Current Subscription & Usage Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Current Plan Summary */}
              <Card className="lg:col-span-2 border border-border">
                <CardContent className="p-6 space-y-5">
                  <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border pb-4">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
                        Current Plan
                      </span>
                      <div className="flex items-center gap-2.5 mt-1 flex-wrap">
                        <h2 className="text-xl font-black text-text-primary">
                          {sub ? sub.planSnapshot.name : "Free Tier (No Paid Subscription)"}
                        </h2>
                        <Badge
                          variant={getSubscriptionBadgeVariant(sub?.status || "FREE")}
                          size="sm"
                        >
                          {sub?.status || "FREE"}
                        </Badge>
                      </div>
                      {sub && (
                        <p className="text-xs text-text-secondary mt-1">
                          Locked Price: {formatInrMinor(sub.amountMinor, sub.currency)} ({sub.planSnapshot.billingInterval})
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {sub && sub.status !== "PENDING" && (
                        <Button
                          type="button"
                          variant="primary"
                          size="sm"
                          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
                          onClick={() => {
                            const bizQuery = overview.selectedBusiness?.id
                              ? `&businessId=${encodeURIComponent(overview.selectedBusiness.id)}`
                              : "";
                            router.push(
                              `/subscription/checkout?planId=${encodeURIComponent(
                                sub.scheduledPlanId || sub.planId
                              )}&mode=renew${bizQuery}`
                            );
                          }}
                        >
                          Renew Subscription
                        </Button>
                      )}
                      {overview.actions.canCancel && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          leftIcon={<XCircle className="w-3.5 h-3.5 text-destructive" />}
                          onClick={() => setCancelModalOpen(true)}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>

                  {sub ? (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="p-3.5 rounded-xl bg-background-secondary border border-border">
                          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase text-text-muted">
                            <Calendar className="w-3.5 h-3.5 text-primary" />
                            <span>Start Date</span>
                          </div>
                          <p className="text-sm font-bold text-text-primary mt-1">
                            {formatSubscriptionDate(sub.startsAt)}
                          </p>
                        </div>

                        <div className="p-3.5 rounded-xl bg-background-secondary border border-border">
                          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase text-text-muted">
                            <Calendar className="w-3.5 h-3.5 text-primary" />
                            <span>Expiry Date</span>
                          </div>
                          <p className="text-sm font-bold text-text-primary mt-1">
                            {formatSubscriptionDate(sub.expiresAt)}
                          </p>
                        </div>

                        <div className="p-3.5 rounded-xl bg-background-secondary border border-border">
                          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase text-text-muted">
                            <Clock className="w-3.5 h-3.5 text-primary" />
                            <span>Remaining Validity</span>
                          </div>
                          <p className="text-sm font-bold text-text-primary mt-1">
                            {sub.status === "ACTIVE" || sub.status === "PAST_DUE"
                              ? `${sub.remainingDays ?? 0}d ${sub.remainingHours ?? 0}h`
                              : "0 days"}
                          </p>
                        </div>
                      </div>

                      {sub.cancelAtPeriodEnd && (
                        <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 shrink-0" />
                          <span>
                            Cancellation scheduled at period end ({formatSubscriptionDate(sub.expiresAt)}).
                            You can renew anytime to retain uninterrupted access.
                          </span>
                        </div>
                      )}

                      {sub.scheduledPlanSnapshot && (
                        <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200 text-xs flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                          <span>
                            Scheduled next-period downgrade to{" "}
                            <strong>{sub.scheduledPlanSnapshot.name}</strong> on{" "}
                            {formatSubscriptionDate(sub.scheduledChangeAt)}.
                          </span>
                        </div>
                      )}

                      <div>
                        <p className="text-xs font-bold text-text-secondary mb-2">
                          Included Features (Purchased Snapshot)
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {(sub.planSnapshot?.features || []).map((f, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-2 text-xs text-text-secondary"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-status-success shrink-0" />
                              <span>{f}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="p-4 rounded-xl bg-background-secondary border border-border text-xs text-text-secondary space-y-2">
                      <p>
                        Your business is currently on the default Free tier. Select a subscription
                        plan below to unlock featured listings, expanded product limits, and higher
                        monthly enquiry quotas.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Entitlement Usage Card */}
              <Card className="border border-border">
                <CardContent className="p-6 space-y-4">
                  <div className="border-b border-border pb-3">
                    <h3 className="text-sm font-bold text-text-primary">
                      Plan Usage &amp; Entitlements
                    </h3>
                    <p className="text-xs text-text-muted mt-0.5">
                      Live limits enforced for{" "}
                      {overview.selectedBusiness?.name || entitlements?.businessName || "your account"}
                    </p>
                  </div>

                  {entitlements && (
                    <div className="space-y-3 text-xs">
                      {[
                        {
                          label: "Business Listings",
                          used: entitlements.usage.businessListingsUsed,
                          limit: entitlements.limits.maxBusinessListings,
                        },
                        {
                          label: "Catalog Products",
                          used: entitlements.usage.productsUsed,
                          limit: entitlements.limits.maxProducts,
                        },
                        {
                          label: "Enquiries (30d)",
                          used: entitlements.usage.enquiriesThisMonthUsed,
                          limit: entitlements.limits.maxEnquiriesPerMonth,
                        },
                        {
                          label: "Contact Channels",
                          used: entitlements.usage.contactsUsed,
                          limit: entitlements.limits.maxContacts,
                        },
                      ].map((row) => {
                        const pct =
                          row.limit <= 0
                            ? 20
                            : Math.min(100, Math.round((row.used / row.limit) * 100));
                        return (
                          <div key={row.label} className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-text-secondary">{row.label}</span>
                              <strong className="font-data text-text-primary">
                                {row.used} / {formatLimitValue(row.limit)}
                              </strong>
                            </div>
                            <div className="h-1.5 w-full rounded-full bg-surface-hover overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  row.limit > 0 && row.used >= row.limit
                                    ? "bg-destructive"
                                    : "bg-primary"
                                }`}
                                style={{ width: `${row.limit < 0 ? 100 : pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}

                      <div className="pt-2 border-t border-border flex items-center justify-between">
                        <span className="text-text-secondary">Featured Directory Boost</span>
                        <Badge
                          variant={entitlements.limits.featuredListing ? "success" : "neutral"}
                          size="sm"
                        >
                          {entitlements.limits.featuredListing ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Available Plans */}
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-extrabold text-text-primary">
                  Available Subscription Plans
                </h2>
                <p className="text-xs text-text-muted mt-0.5">
                  Upgrade immediately with automatic unused-period credit, or schedule a downgrade
                  for your next renewal cycle.
                </p>
              </div>
              <PlanCatalogSection
                plans={plans}
                currentSubscription={sub}
                isAuthenticated={true}
                onSelectPlan={handleSelectPlan}
              />
            </div>

            {/* Subscription History */}
            <Card className="border border-border overflow-hidden">
              <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-bold text-text-primary">
                    Subscription History
                  </h3>
                </div>
                <Link
                  href="/subscription/payments"
                  className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
                >
                  <span>View Transactions</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              {history.length === 0 ? (
                <div className="p-6 text-xs text-text-muted text-center">
                  No subscription records yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="border-b border-border bg-background-secondary/60 text-text-secondary">
                        <th className="py-3 px-4">Plan</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Amount</th>
                        <th className="py-3 px-4">Start</th>
                        <th className="py-3 px-4">Expiry</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {history.map((item) => (
                        <tr key={item.id}>
                          <td className="py-3 px-4 font-semibold text-text-primary">
                            {item.planSnapshot?.name || "Plan"}
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant={getSubscriptionBadgeVariant(item.status)} size="sm">
                              {item.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 font-data text-text-primary">
                            {formatInrMinor(item.amountMinor, item.currency)}
                          </td>
                          <td className="py-3 px-4 text-text-secondary">
                            {formatSubscriptionDate(item.startsAt)}
                          </td>
                          <td className="py-3 px-4 text-text-secondary">
                            {formatSubscriptionDate(item.expiresAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </>
        ) : null}
      </main>

      <AddBusinessModal
        isOpen={isAddBizOpen}
        onClose={() => setIsAddBizOpen(false)}
        onBusinessCreated={() => {
          setIsAddBizOpen(false);
          load();
        }}
      />

      <ConfirmationDialog
        open={Boolean(downgradeTarget)}
        onOpenChange={(open) => !open && setDowngradeTarget(null)}
        variant="info"
        title="Schedule Subscription Downgrade"
        description={
          downgradeTarget
            ? `Your subscription will change to "${downgradeTarget.name}" (${formatInrMinor(
                downgradeTarget.priceMinor,
                downgradeTarget.currency
              )} + GST) at the end of your current billing period. You retain all current features until expiry.`
            : ""
        }
        confirmLabel="Schedule Downgrade"
        isLoading={isDowngrading}
        onConfirm={handleConfirmDowngrade}
      />

      <ConfirmationDialog
        open={cancelModalOpen}
        onOpenChange={setCancelModalOpen}
        title="Cancel Subscription at Period End"
        description="Your business will retain paid features until the current subscription expiry date, after which entitlements revert to the Free tier. No automatic charges will occur."
        confirmLabel="Confirm Cancellation"
        variant="danger"
        isLoading={isCancelling}
        onConfirm={handleConfirmCancel}
      />
    </>
  );
}

export default function BusinessSubscriptionPage() {
  return (
    <Suspense fallback={<LoadingState message="Loading subscription..." />}>
      <BusinessSubscriptionContent />
    </Suspense>
  );
}
