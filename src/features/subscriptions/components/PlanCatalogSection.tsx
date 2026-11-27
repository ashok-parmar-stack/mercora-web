"use client";

import React, { useState } from "react";
import {
  Check,
  Plus,
  Minus,
  X,
  ArrowUpRight,
  RefreshCw,
  ArrowDownRight,
  ShieldCheck,
  ChevronDown,
  Building2,
  Package,
  MessageSquare,
  PhoneCall,
  Sparkles,
  Clock,
  ChevronsUpDown,
} from "lucide-react";
import { Badge, Button, Card } from "@/components/common";
import type {
  PlanFeatureGroup,
  PlanLimits,
  SubscriptionPlan,
  SubscriptionRecord,
} from "../types";
import { formatInrMinor, formatLimitValue } from "../utils/razorpay-checkout";
import { deriveMercoraSystemGroups } from "../utils/system-plan-generator";

export { deriveMercoraSystemGroups };

export interface PlanCatalogSectionProps {
  plans: SubscriptionPlan[];
  currentSubscription?: SubscriptionRecord | null;
  isAuthenticated?: boolean;
  onSelectPlan: (
    plan: SubscriptionPlan,
    mode: "purchase" | "renew" | "upgrade" | "downgrade"
  ) => void;
  busyPlanId?: string | null;
}

function formatDurationLabel(days: number, interval: string): string {
  if (interval === "MONTHLY" || days === 30) return "1 Month (30 Days)";
  if (interval === "QUARTERLY" || days === 90) return "3 Months (90 Days)";
  if (interval === "SIX_MONTHS" || days === 180) return "6 Months (180 Days)";
  if (interval === "YEARLY" || days >= 360) return "12 Months (365 Days)";
  return `${days} Days`;
}

function computeMeterPercent(val: number, maxVal: number): number {
  if (val < 0) return 100;
  if (val === 0) return 0;
  if (maxVal < 0) return Math.min(85, Math.max(24, Math.round((val / 250) * 100)));
  if (maxVal <= 0) return 50;
  return Math.min(100, Math.max(18, Math.round((val / maxVal) * 100)));
}

export function PlanCatalogSection({
  plans,
  currentSubscription,
  isAuthenticated = false,
  onSelectPlan,
  busyPlanId = null,
}: PlanCatalogSectionProps) {
  const [intervalFilter, setIntervalFilter] = useState<string>("ALL");
  const [expandedKeys, setExpandedKeys] = useState<Record<string, boolean>>({});
  const [showCompareMatrix, setShowCompareMatrix] = useState(false);

  const intervals = Array.from(new Set(plans.map((p) => p.billingInterval)));
  const visiblePlans =
    intervalFilter === "ALL"
      ? plans
      : plans.filter((p) => p.billingInterval === intervalFilter);

  const hasActive = currentSubscription?.status === "ACTIVE";
  const currentPlanId = currentSubscription?.planId;
  const currentSubtotalMinor = Number(
    currentSubscription?.planSnapshot?.priceMinor ??
      currentSubscription?.subtotalMinor ??
      0
  );

  // Max references across plans for proportionate quota meters
  const maxListingsCap = Math.max(
    ...plans.map((p) => (p.limits.maxBusinessListings < 0 ? 10 : p.limits.maxBusinessListings)),
    1
  );
  const maxProductsCap = Math.max(
    ...plans.map((p) => (p.limits.maxProducts < 0 ? 500 : p.limits.maxProducts)),
    1
  );
  const maxEnquiriesCap = Math.max(
    ...plans.map((p) => (p.limits.maxEnquiriesPerMonth < 0 ? 1000 : p.limits.maxEnquiriesPerMonth)),
    1
  );
  const maxContactsCap = Math.max(
    ...plans.map((p) => (p.limits.maxContacts < 0 ? 25 : p.limits.maxContacts)),
    1
  );

  const toggleGroup = (planId: string, groupKey: string) => {
    const composite = `${planId}:${groupKey}`;
    setExpandedKeys((prev) => ({
      ...prev,
      [composite]: !prev[composite],
    }));
  };

  const toggleAllGroupsForPlan = (planId: string, groups: PlanFeatureGroup[]) => {
    const includedGroups = groups.filter((g) => g.included);
    const allOpen = includedGroups.every((g) => expandedKeys[`${planId}:${g.key}`]);
    setExpandedKeys((prev) => {
      const next = { ...prev };
      for (const g of includedGroups) {
        next[`${planId}:${g.key}`] = !allOpen;
      }
      return next;
    });
  };

  const getPlanAction = (plan: SubscriptionPlan) => {
    if (!isAuthenticated) {
      return {
        label: "Buy Now",
        mode: "purchase" as const,
        variant: "primary" as const,
        icon: <ArrowUpRight className="w-4 h-4" />,
      };
    }

    if (currentPlanId === plan.id && currentSubscription?.status !== "PENDING") {
      return {
        label: hasActive ? "Renew Current Plan" : "Renew Plan",
        mode: "renew" as const,
        variant: "secondary" as const,
        icon: <RefreshCw className="w-4 h-4" />,
      };
    }

    if (hasActive) {
      if (plan.priceMinor > currentSubtotalMinor) {
        return {
          label: "Upgrade Plan",
          mode: "upgrade" as const,
          variant: "primary" as const,
          icon: <ArrowUpRight className="w-4 h-4" />,
        };
      }
      if (plan.priceMinor < currentSubtotalMinor) {
        return {
          label: "Schedule Downgrade",
          mode: "downgrade" as const,
          variant: "outline" as const,
          icon: <ArrowDownRight className="w-4 h-4" />,
        };
      }
    }

    return {
      label: "Buy Now",
      mode: "purchase" as const,
      variant: "primary" as const,
      icon: <ArrowUpRight className="w-4 h-4" />,
    };
  };

  const gridContainerClass =
    visiblePlans.length === 2
      ? "grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-7 max-w-5xl mx-auto items-stretch"
      : visiblePlans.length === 1
        ? "grid grid-cols-1 max-w-lg mx-auto"
        : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto items-stretch";

  const showIntervalFilters = plans.length > 3 && intervals.length > 1;

  return (
    <div className="space-y-8">
      {showIntervalFilters && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setIntervalFilter("ALL")}
            className={`px-4 py-2 rounded-full text-xs font-bold tracking-wide uppercase border transition-all cursor-pointer ${
              intervalFilter === "ALL"
                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                : "bg-surface text-text-secondary border-border hover:border-primary/40"
            }`}
          >
            All Billing Cycles
          </button>
          {intervals.map((interval) => (
            <button
              key={interval}
              type="button"
              onClick={() => setIntervalFilter(interval)}
              className={`px-4 py-2 rounded-full text-xs font-bold tracking-wide uppercase border transition-all cursor-pointer ${
                intervalFilter === interval
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-surface text-text-secondary border-border hover:border-primary/40"
              }`}
            >
              {interval.replace("_", " ")}
            </button>
          ))}
        </div>
      )}

      {/* Signature Mercora Architectural Plan Cards */}
      <div className={gridContainerClass}>
        {visiblePlans.map((plan, index) => {
          const isCurrent =
            currentPlanId === plan.id &&
            (currentSubscription?.status === "ACTIVE" ||
              currentSubscription?.status === "PAST_DUE");
          const isFlagship = Boolean(plan.isPopular || isCurrent);
          const action = getPlanAction(plan);
          const groups =
            plan.featureGroups && plan.featureGroups.length > 0
              ? plan.featureGroups
              : deriveMercoraSystemGroups(plan.limits, plan.durationDays);
          const hasComparePrice = Boolean(
            plan.originalPriceMinor && plan.originalPriceMinor > plan.priceMinor
          );
          const savingsPercent = hasComparePrice
            ? Math.round(
                ((plan.originalPriceMinor! - plan.priceMinor) /
                  plan.originalPriceMinor!) *
                  100
              )
            : 0;
          const includedCount = groups.filter((g) => g.included).length;
          const allExpanded = groups
            .filter((g) => g.included)
            .every((g) => expandedKeys[`${plan.id}:${g.key}`]);
          const tierIndex = String(index + 1).padStart(2, "0");

          const quotaMetrics = [
            {
              label: "Storefronts",
              value: formatLimitValue(plan.limits.maxBusinessListings),
              pct: computeMeterPercent(plan.limits.maxBusinessListings, maxListingsCap),
              icon: Building2,
            },
            {
              label: "Products",
              value: formatLimitValue(plan.limits.maxProducts),
              pct: computeMeterPercent(plan.limits.maxProducts, maxProductsCap),
              icon: Package,
            },
            {
              label: "RFQ Leads/Mo",
              value: formatLimitValue(plan.limits.maxEnquiriesPerMonth),
              pct: computeMeterPercent(plan.limits.maxEnquiriesPerMonth, maxEnquiriesCap),
              icon: MessageSquare,
            },
            {
              label: "Contacts",
              value: formatLimitValue(plan.limits.maxContacts),
              pct: computeMeterPercent(plan.limits.maxContacts, maxContactsCap),
              icon: PhoneCall,
            },
          ];

          return (
            <div
              key={plan.id}
              className={`group flex flex-col rounded-2xl overflow-hidden bg-surface border transition-all duration-200 ${
                isCurrent
                  ? "border-primary ring-2 ring-primary/20 shadow-lg"
                  : isFlagship
                    ? "border-[#7F1D3F] shadow-xl ring-1 ring-[#7F1D3F]/20"
                    : "border-border shadow-sm hover:border-border-hover hover:shadow-md"
              }`}
            >
              {/* Top Architectural Header Cap — Dark Obsidian-Plum for Flagship / Warm Rose Ivory for Standard */}
              <div
                className={`p-6 sm:p-7 space-y-4 ${
                  isFlagship
                    ? "text-white border-b border-white/10"
                    : "bg-background-secondary/80 border-b border-border text-text-primary"
                }`}
                style={
                  isFlagship
                    ? {
                        background:
                          "linear-gradient(145deg, #2B1220 0%, #4A1730 55%, #7F1D3F 100%)",
                      }
                    : undefined
                }
              >
                {/* Kicker & Badge Row */}
                <div className="flex items-center justify-between gap-2">
                  <div
                    className={`inline-flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase ${
                      isFlagship ? "text-[#E5A8BA]" : "text-primary"
                    }`}
                  >
                    <span
                      className={`w-3 h-[1.5px] ${
                        isFlagship ? "bg-[#E5A8BA]" : "bg-primary"
                      }`}
                    />
                    <span>TIER {tierIndex}</span>
                    <span className="opacity-60">•</span>
                    <span>{plan.billingInterval.replace("_", " ")}</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {isCurrent && (
                      <Badge variant="success" size="sm">
                        Current Plan
                      </Badge>
                    )}
                    {plan.isPopular && !isCurrent && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#E5A8BA] text-[#2B1220]">
                        <Sparkles className="w-3 h-3" />
                        {plan.label || "Recommended"}
                      </span>
                    )}
                    {!plan.isPopular && !isCurrent && plan.label && (
                      <Badge variant="neutral" size="sm">
                        {plan.label}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Title & Description */}
                <div>
                  <h3
                    className={`text-xl sm:text-2xl font-display font-extrabold tracking-tight ${
                      isFlagship ? "text-white" : "text-text-primary"
                    }`}
                  >
                    {plan.name}
                  </h3>
                  {plan.description && (
                    <p
                      className={`text-xs mt-1 leading-relaxed line-clamp-2 ${
                        isFlagship ? "text-white/75" : "text-text-secondary"
                      }`}
                    >
                      {plan.description}
                    </p>
                  )}
                </div>

                {/* Price Lockup with Compare MRP + Excluding GST + Savings Pill */}
                <div className="pt-1 space-y-1">
                  <div className="flex items-baseline flex-wrap gap-2">
                    <span
                      className={`text-3xl font-extrabold font-data tracking-tight ${
                        isFlagship ? "text-white" : "text-primary"
                      }`}
                    >
                      {formatInrMinor(plan.priceMinor)}
                    </span>
                    {hasComparePrice && (
                      <span
                        className={`text-base font-medium line-through font-data ${
                          isFlagship ? "text-white/55" : "text-text-muted"
                        }`}
                      >
                        {formatInrMinor(plan.originalPriceMinor!)}
                      </span>
                    )}
                    <span
                      className={`text-xs font-medium ${
                        isFlagship ? "text-[#E5A8BA]" : "text-text-secondary"
                      }`}
                    >
                      (Excluding GST)
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2 text-[11px] pt-0.5">
                    <span
                      className={isFlagship ? "text-white/75" : "text-text-muted"}
                    >
                      Est. {formatInrMinor(plan.totalPriceMinor)} incl.{" "}
                      {(plan.gstRateBps / 100).toFixed(0)}% GST
                    </span>
                    {savingsPercent > 0 && (
                      <span
                        className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          isFlagship
                            ? "bg-white/15 text-[#FFE0EA]"
                            : "bg-primary/10 text-primary"
                        }`}
                      >
                        Save {savingsPercent}%
                      </span>
                    )}
                  </div>
                </div>

                {/* Primary CTA */}
                <div className="pt-1">
                  {isFlagship ? (
                    <Button
                      type="button"
                      variant={action.mode === "downgrade" ? "outline" : "secondary"}
                      size="md"
                      className={`w-full font-bold shadow-sm ${
                        action.mode === "renew"
                          ? "bg-white text-[#2B1220] hover:bg-[#FFF7F5]"
                          : "bg-white text-[#2B1220] hover:bg-[#FFEBF0] border-0"
                      }`}
                      isLoading={busyPlanId === plan.id}
                      disabled={Boolean(busyPlanId && busyPlanId !== plan.id)}
                      onClick={() => onSelectPlan(plan, action.mode)}
                      rightIcon={action.icon}
                    >
                      {action.label}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant={action.variant}
                      size="md"
                      className="w-full font-bold"
                      isLoading={busyPlanId === plan.id}
                      disabled={Boolean(busyPlanId && busyPlanId !== plan.id)}
                      onClick={() => onSelectPlan(plan, action.mode)}
                      rightIcon={action.icon}
                    >
                      {action.label}
                    </Button>
                  )}
                </div>
              </div>

              {/* Lower Body: Live Mercora Capacity Telemetry + Expandable System Modules */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col gap-5 bg-surface">
                {/* Access Validity Bar */}
                <div className="flex items-center justify-between text-xs px-3 py-2 rounded-xl bg-background-secondary border border-border">
                  <span className="flex items-center gap-1.5 font-semibold text-text-secondary">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    <span>Access Validity</span>
                  </span>
                  <span className="font-bold text-text-primary font-data">
                    {formatDurationLabel(plan.durationDays, plan.billingInterval)}
                  </span>
                </div>

                {/* 2x2 Mercora System Quota Telemetry Grid */}
                <div className="grid grid-cols-2 gap-2.5">
                  {quotaMetrics.map((metric) => {
                    const MetricIcon = metric.icon;
                    return (
                      <div
                        key={metric.label}
                        className="p-2.5 rounded-xl border border-border bg-surface-hover/50 space-y-1.5"
                      >
                        <div className="flex items-center justify-between gap-1 text-[10px] font-bold uppercase tracking-wider text-text-muted">
                          <span className="truncate">{metric.label}</span>
                          <MetricIcon className="w-3 h-3 text-primary shrink-0" />
                        </div>
                        <p className="text-xs sm:text-sm font-extrabold text-text-primary font-data">
                          {metric.value}
                        </p>
                        <div className="h-1 w-full rounded-full bg-border/60 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-primary transition-all"
                            style={{ width: `${metric.pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Highlight Capability Chips */}
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { label: "Featured Boost", enabled: plan.limits.featuredListing },
                    { label: "Priority Verification", enabled: plan.limits.verifiedPriority },
                    { label: "Lead Inbox", enabled: plan.limits.leadInboxAccess },
                  ].map((chip) => (
                    <span
                      key={chip.label}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                        chip.enabled
                          ? "bg-primary/8 text-primary border-primary/20"
                          : "bg-background-secondary/50 text-text-muted border-border/60 line-through decoration-text-muted/60"
                      }`}
                    >
                      {chip.enabled ? (
                        <Check className="w-3 h-3 shrink-0" />
                      ) : (
                        <X className="w-3 h-3 shrink-0" />
                      )}
                      <span>{chip.label}</span>
                    </span>
                  ))}
                </div>

                <hr className="border-border" />

                {/* Interactive System Module Breakdown (+ / - / x) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
                      System Modules ({includedCount}/{groups.length})
                    </span>
                    {includedCount > 0 && (
                      <button
                        type="button"
                        onClick={() => toggleAllGroupsForPlan(plan.id, groups)}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline cursor-pointer"
                      >
                        <ChevronsUpDown className="w-3 h-3" />
                        <span>{allExpanded ? "Collapse all" : "Expand all"}</span>
                      </button>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    {groups.map((group) => {
                      const isExpanded = Boolean(expandedKeys[`${plan.id}:${group.key}`]);

                      if (!group.included) {
                        return (
                          <div
                            key={group.key}
                            className="flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl bg-background-secondary/40 text-xs text-text-muted select-none"
                            title="Available in higher tiers"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="w-5 h-5 rounded-md bg-border/50 flex items-center justify-center shrink-0">
                                <X className="w-3 h-3 text-text-muted" />
                              </span>
                              <span className="truncate">{group.title}</span>
                            </div>
                            <span className="text-[10px] font-semibold uppercase tracking-wide opacity-75 shrink-0">
                              Higher tier
                            </span>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={group.key}
                          className={`rounded-xl border transition-colors ${
                            isExpanded
                              ? "border-primary/30 bg-background-secondary/60"
                              : "border-transparent hover:border-border hover:bg-surface-hover/60"
                          }`}
                        >
                          <button
                            type="button"
                            aria-expanded={isExpanded}
                            onClick={() => toggleGroup(plan.id, group.key)}
                            className="w-full flex items-center justify-between gap-2.5 px-2.5 py-2 text-left text-xs sm:text-sm font-semibold text-text-primary hover:text-primary transition-colors cursor-pointer"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span
                                className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                                  isExpanded
                                    ? "bg-primary text-white"
                                    : "bg-primary/10 text-primary"
                                }`}
                              >
                                {isExpanded ? (
                                  <Minus className="w-3.5 h-3.5" />
                                ) : (
                                  <Plus className="w-3.5 h-3.5" />
                                )}
                              </span>
                              <span className="leading-snug">{group.title}</span>
                            </div>
                          </button>

                          {isExpanded && group.items.length > 0 && (
                            <ul className="pl-10 pr-3 pb-3 pt-0.5 space-y-1.5 text-xs text-text-secondary">
                              {group.items.map((item, idx) => (
                                <li key={idx} className="flex items-start gap-2 leading-relaxed">
                                  <span className="w-1.5 h-1.5 rounded-full bg-primary/70 shrink-0 mt-1.5" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Collapsible Full System Entitlement Matrix */}
      {visiblePlans.length > 1 && (
        <div className="max-w-6xl mx-auto pt-3 space-y-4">
          <div className="flex justify-center">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-full px-5"
              onClick={() => setShowCompareMatrix((prev) => !prev)}
            >
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span>
                {showCompareMatrix
                  ? "Hide System Entitlement Comparison"
                  : "Compare System Entitlements Side-by-Side"}
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform ${
                  showCompareMatrix ? "rotate-180" : ""
                }`}
              />
            </Button>
          </div>

          {showCompareMatrix && (
            <Card className="border border-border overflow-hidden rounded-2xl shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-border bg-background-secondary">
                      <th className="py-3.5 px-4 font-bold text-text-secondary uppercase tracking-wider text-[11px]">
                        Mercora System Entitlement
                      </th>
                      {visiblePlans.map((p) => (
                        <th
                          key={p.id}
                          className="py-3.5 px-4 font-extrabold text-text-primary text-sm"
                        >
                          {p.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border bg-surface">
                    <tr>
                      <td className="py-3 px-4 font-medium text-text-secondary">
                        Price (Excl. 18% GST)
                      </td>
                      {visiblePlans.map((p) => (
                        <td
                          key={p.id}
                          className="py-3 px-4 font-bold text-primary font-data"
                        >
                          {formatInrMinor(p.priceMinor)}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium text-text-secondary">
                        Access Validity
                      </td>
                      {visiblePlans.map((p) => (
                        <td key={p.id} className="py-3 px-4 text-text-primary font-data">
                          {p.durationDays} days
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium text-text-secondary">
                        Business Directory Listings
                      </td>
                      {visiblePlans.map((p) => (
                        <td
                          key={p.id}
                          className="py-3 px-4 font-semibold text-text-primary font-data"
                        >
                          {formatLimitValue(p.limits.maxBusinessListings)}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium text-text-secondary">
                        Products per Business
                      </td>
                      {visiblePlans.map((p) => (
                        <td
                          key={p.id}
                          className="py-3 px-4 font-semibold text-text-primary font-data"
                        >
                          {formatLimitValue(p.limits.maxProducts)}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium text-text-secondary">
                        Monthly RFQ Enquiries
                      </td>
                      {visiblePlans.map((p) => (
                        <td
                          key={p.id}
                          className="py-3 px-4 font-semibold text-text-primary font-data"
                        >
                          {formatLimitValue(p.limits.maxEnquiriesPerMonth)}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium text-text-secondary">
                        Contacts per Listing
                      </td>
                      {visiblePlans.map((p) => (
                        <td
                          key={p.id}
                          className="py-3 px-4 font-semibold text-text-primary font-data"
                        >
                          {formatLimitValue(p.limits.maxContacts)}
                        </td>
                      ))}
                    </tr>
                    {[
                      { label: "Featured Directory Boost", key: "featuredListing" as const },
                      { label: "Verified Priority Queue", key: "verifiedPriority" as const },
                      { label: "Lead Inbox & Export", key: "leadInboxAccess" as const },
                      { label: "Subscription Analytics", key: "analyticsAccess" as const },
                      { label: "Dedicated Priority Support", key: "prioritySupport" as const },
                    ].map((row) => (
                      <tr key={row.key}>
                        <td className="py-3 px-4 font-medium text-text-secondary">
                          {row.label}
                        </td>
                        {visiblePlans.map((p) => (
                          <td key={p.id} className="py-3 px-4">
                            {p.limits[row.key] ? (
                              <span className="inline-flex items-center gap-1 text-status-success font-semibold">
                                <Check className="w-3.5 h-3.5" />
                                Included
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-text-muted">
                                <X className="w-3.5 h-3.5" />
                                Not included
                              </span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
