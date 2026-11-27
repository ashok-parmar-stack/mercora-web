"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Loader2,
  AlertCircle,
  Sparkles,
  Wand2,
  Check,
  X,
  ChevronDown,
} from "lucide-react";
import { Badge, Button, Input, Modal, Select, Switch, Textarea } from "@/components/common";
import { extractErrorMessage } from "@/lib/http/client";
import {
  createAdminPlan,
  fetchAdminSystemPlanTemplates,
  updateAdminPlan,
} from "../../api/subscription-api";
import type {
  PlanFeatureGroup,
  PlanLimits,
  SubscriptionPlan,
  SystemPlanTemplate,
} from "../../types";
import {
  DEFAULT_SYSTEM_PLAN_PRESETS,
  buildUniquePresetCode,
  deriveMercoraSystemBullets,
  deriveMercoraSystemGroups,
} from "../../utils/system-plan-generator";

interface AdminPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan?: SubscriptionPlan | null;
  existingCodes?: string[];
  onSaved: () => void;
}

const DEFAULT_LIMITS: PlanLimits = {
  maxBusinessListings: 1,
  maxProducts: 10,
  maxEnquiriesPerMonth: 25,
  maxContacts: 2,
  featuredListing: false,
  verifiedPriority: false,
  leadInboxAccess: true,
  analyticsAccess: false,
  prioritySupport: false,
};

export function AdminPlanModal({
  isOpen,
  onClose,
  plan,
  existingCodes = [],
  onSaved,
}: AdminPlanModalProps) {
  const isEditing = Boolean(plan);

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [label, setLabel] = useState("");
  const [isPopular, setIsPopular] = useState(false);
  const [originalPrice, setOriginalPrice] = useState("");
  const [price, setPrice] = useState("999");
  const [gstRatePercent, setGstRatePercent] = useState("18");
  const [billingInterval, setBillingInterval] = useState("MONTHLY");
  const [durationDays, setDurationDays] = useState("30");
  const [displayOrder, setDisplayOrder] = useState("1");
  const [isActive, setIsActive] = useState(true);
  const [featuresText, setFeaturesText] = useState("");
  const [limits, setLimits] = useState<PlanLimits>(DEFAULT_LIMITS);
  const [featureGroups, setFeatureGroups] = useState<PlanFeatureGroup[]>(() =>
    deriveMercoraSystemGroups(DEFAULT_LIMITS, 30)
  );
  const [systemPresets, setSystemPresets] = useState<SystemPlanTemplate[]>(
    DEFAULT_SYSTEM_PLAN_PRESETS
  );
  const [appliedPresetCode, setAppliedPresetCode] = useState<string | null>(null);
  const [showModulesPreview, setShowModulesPreview] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setError(null);
    setAppliedPresetCode(null);

    const ctrl = new AbortController();
    fetchAdminSystemPlanTemplates(ctrl.signal)
      .then((list) => {
        if (Array.isArray(list) && list.length > 0) {
          setSystemPresets(list);
        }
      })
      .catch(() => {
        // Fallback smoothly to built-in DEFAULT_SYSTEM_PLAN_PRESETS
      });

    if (plan) {
      const mergedLimits = { ...DEFAULT_LIMITS, ...(plan.limits || {}) };
      const days = Number(plan.durationDays ?? 30);
      setCode(plan.code);
      setName(plan.name);
      setDescription(plan.description || "");
      setLabel(plan.label || "");
      setIsPopular(Boolean(plan.isPopular));
      setOriginalPrice(
        plan.originalPrice !== null && plan.originalPrice !== undefined
          ? String(plan.originalPrice)
          : plan.originalPriceMinor
            ? String(plan.originalPriceMinor / 100)
            : ""
      );
      setPrice(String(plan.price ?? (plan.priceMinor || 0) / 100));
      setGstRatePercent(String(((plan.gstRateBps ?? 1800) / 100).toFixed(0)));
      setBillingInterval(String(plan.billingInterval || "MONTHLY"));
      setDurationDays(String(days));
      setDisplayOrder(String(plan.displayOrder ?? 1));
      setIsActive(Boolean(plan.isActive));
      setFeaturesText((plan.features || []).join("\n"));
      setLimits(mergedLimits);
      setFeatureGroups(
        plan.featureGroups && plan.featureGroups.length > 0
          ? plan.featureGroups
          : deriveMercoraSystemGroups(mergedLimits, days)
      );
    } else {
      setCode("");
      setName("");
      setDescription("");
      setLabel("");
      setIsPopular(false);
      setOriginalPrice("");
      setPrice("999");
      setGstRatePercent("18");
      setBillingInterval("MONTHLY");
      setDurationDays("30");
      setDisplayOrder("10");
      setIsActive(true);
      setLimits({ ...DEFAULT_LIMITS });
      setFeaturesText(deriveMercoraSystemBullets(DEFAULT_LIMITS, 30).join("\n"));
      setFeatureGroups(deriveMercoraSystemGroups(DEFAULT_LIMITS, 30));
    }

    return () => ctrl.abort();
  }, [isOpen, plan]);

  const applySystemPreset = (preset: SystemPlanTemplate) => {
    setError(null);
    setAppliedPresetCode(preset.code);
    if (!isEditing) {
      setCode(buildUniquePresetCode(preset.code, existingCodes));
      setName(
        existingCodes.some((c) => c.toUpperCase() === preset.code.toUpperCase())
          ? `${preset.name} (Custom)`
          : preset.name
      );
    } else {
      setName(preset.name);
    }
    setDescription(preset.description || "");
    setLabel(preset.label || "");
    setIsPopular(Boolean(preset.isPopular));
    setOriginalPrice(
      preset.originalPrice !== null && preset.originalPrice !== undefined
        ? String(preset.originalPrice)
        : preset.originalPriceMinor
          ? String(preset.originalPriceMinor / 100)
          : ""
    );
    setPrice(String(preset.price ?? preset.priceMinor / 100));
    setGstRatePercent(String((preset.gstRateBps / 100).toFixed(0)));
    setBillingInterval(String(preset.billingInterval));
    setDurationDays(String(preset.durationDays));
    setDisplayOrder(String(preset.displayOrder));
    setLimits({ ...DEFAULT_LIMITS, ...preset.limits });
    setFeaturesText(
      (preset.features && preset.features.length > 0
        ? preset.features
        : deriveMercoraSystemBullets(preset.limits, preset.durationDays)
      ).join("\n")
    );
    setFeatureGroups(
      preset.featureGroups && preset.featureGroups.length > 0
        ? preset.featureGroups
        : deriveMercoraSystemGroups(preset.limits, preset.durationDays)
    );
  };

  const handleGenerateFromLimits = () => {
    const days = Math.max(1, Number(durationDays) || 30);
    setFeaturesText(deriveMercoraSystemBullets(limits, days).join("\n"));
    setFeatureGroups(deriveMercoraSystemGroups(limits, days));
    setShowModulesPreview(true);
  };

  const toggleGroupIncluded = (groupKey: string, included: boolean) => {
    setFeatureGroups((prev) =>
      prev.map((g) => (g.key === groupKey ? { ...g, included } : g))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Plan name is required.");
      return;
    }
    if (!isEditing && !code.trim()) {
      setError("Plan code is required (e.g. GROWTH_MONTHLY).");
      return;
    }

    const numericPrice = Number(price);
    const numericDuration = Number(durationDays);
    const numericGst = Number(gstRatePercent);

    if (Number.isNaN(numericPrice) || numericPrice <= 0) {
      setError("Price (INR) must be greater than 0.");
      return;
    }
    if (Number.isNaN(numericDuration) || numericDuration < 1) {
      setError("Duration days must be at least 1.");
      return;
    }

    const features = featuresText
      .split(/\r?\n/)
      .map((f) => f.trim())
      .filter(Boolean);

    const parsedOriginalPrice = originalPrice.trim() ? Number(originalPrice) : undefined;
    if (
      parsedOriginalPrice !== undefined &&
      (Number.isNaN(parsedOriginalPrice) || parsedOriginalPrice < 0)
    ) {
      setError("Compare-at MRP price must be non-negative.");
      return;
    }

    setSubmitting(true);
    try {
      const commonPayload = {
        name: name.trim(),
        description: description.trim() || undefined,
        label: label.trim() || undefined,
        isPopular,
        ...(parsedOriginalPrice !== undefined ? { originalPrice: parsedOriginalPrice } : {}),
        price: numericPrice,
        gstRateBps: Math.max(0, Math.round((Number.isNaN(numericGst) ? 18 : numericGst) * 100)),
        billingInterval,
        durationDays: Math.round(numericDuration),
        displayOrder: Number(displayOrder) || 0,
        isActive,
        features,
        featureGroups,
        limits,
      };

      if (isEditing && plan) {
        await updateAdminPlan(plan.id, commonPayload);
      } else {
        await createAdminPlan({
          ...commonPayload,
          code: code.trim().toUpperCase(),
          currency: "INR",
        });
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Edit Plan: ${plan?.name}` : "Create Subscription Plan"}
      description="Configure Mercora system tiers, limits, pricing, and GST rules. Existing subscriber snapshots remain intact."
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5 pt-2 max-h-[75vh] overflow-y-auto pr-1">
        {error && (
          <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Quick Mercora System Preset Generator Bar */}
        <div className="rounded-xl border border-primary/25 bg-primary/5 p-3.5 space-y-2.5">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Mercora System Plan Generator Presets</span>
            </div>
            <span className="text-[11px] text-text-muted">
              Click a preset to auto-fill pricing, quotas &amp; system modules
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {systemPresets.map((preset) => {
              const selected = appliedPresetCode === preset.code;
              return (
                <button
                  key={preset.code}
                  type="button"
                  onClick={() => applySystemPreset(preset)}
                  className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                    selected
                      ? "bg-primary text-white border-primary shadow-xs"
                      : "bg-surface text-text-primary border-border hover:border-primary/40"
                  }`}
                >
                  <p className="text-xs font-bold truncate">{preset.name}</p>
                  <p
                    className={`text-[10px] font-data mt-0.5 ${
                      selected ? "text-white/85" : "text-text-muted"
                    }`}
                  >
                    ₹{Number(preset.price).toLocaleString("en-IN")} •{" "}
                    {preset.billingInterval.replace("_", " ")}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Plan Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="STARTER_MONTHLY"
            disabled={isEditing}
            required={!isEditing}
          />
          <Input
            label="Plan Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Starter Business Plan"
            required
          />
        </div>

        <Textarea
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Concise summary of who this plan is best for"
          rows={2}
        />

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
          <Input
            label="Compare MRP (₹, optional)"
            type="number"
            min="0"
            step="0.01"
            value={originalPrice}
            onChange={(e) => setOriginalPrice(e.target.value)}
            placeholder="1499"
          />
          <Input
            label="Offer Price (₹)"
            type="number"
            min="1"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
          <Input
            label="GST (%)"
            type="number"
            min="0"
            max="28"
            value={gstRatePercent}
            onChange={(e) => setGstRatePercent(e.target.value)}
          />
          <Select
            label="Billing Interval"
            value={billingInterval}
            onChange={(e) => setBillingInterval(e.target.value)}
            options={[
              { value: "MONTHLY", label: "Monthly" },
              { value: "QUARTERLY", label: "Quarterly" },
              { value: "SIX_MONTHS", label: "6 Months" },
              { value: "YEARLY", label: "Yearly" },
              { value: "CUSTOM", label: "Custom" },
            ]}
          />
          <Input
            label="Duration (Days)"
            type="number"
            min="1"
            value={durationDays}
            onChange={(e) => setDurationDays(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
          <Input
            label="Badge Label (optional)"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Most Popular"
          />
          <Input
            label="Display Order"
            type="number"
            min="0"
            value={displayOrder}
            onChange={(e) => setDisplayOrder(e.target.value)}
          />
          <div className="flex items-center gap-6 pt-5">
            <label className="inline-flex items-center gap-2 text-xs font-medium text-text-primary cursor-pointer">
              <Switch
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
              />
              Active
            </label>
            <label className="inline-flex items-center gap-2 text-xs font-medium text-text-primary cursor-pointer">
              <Switch
                checked={isPopular}
                onChange={(e) => setIsPopular(e.target.checked)}
              />
              Popular
            </label>
          </div>
        </div>

        <div className="rounded-xl border border-border p-4 space-y-3 bg-surface-hover/25">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted">
              Entitlement Limits (-1 = Unlimited)
            </h4>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleGenerateFromLimits}
              leftIcon={<Wand2 className="w-3.5 h-3.5 text-primary" />}
            >
              Generate Features &amp; Modules from Limits
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Input
              label="Max Listings"
              type="number"
              value={String(limits.maxBusinessListings)}
              onChange={(e) =>
                setLimits((prev) => ({
                  ...prev,
                  maxBusinessListings: Number(e.target.value) || 0,
                }))
              }
            />
            <Input
              label="Max Products"
              type="number"
              value={String(limits.maxProducts)}
              onChange={(e) =>
                setLimits((prev) => ({
                  ...prev,
                  maxProducts: Number(e.target.value) || 0,
                }))
              }
            />
            <Input
              label="Enquiries / Mo"
              type="number"
              value={String(limits.maxEnquiriesPerMonth)}
              onChange={(e) =>
                setLimits((prev) => ({
                  ...prev,
                  maxEnquiriesPerMonth: Number(e.target.value) || 0,
                }))
              }
            />
            <Input
              label="Max Contacts"
              type="number"
              value={String(limits.maxContacts)}
              onChange={(e) =>
                setLimits((prev) => ({
                  ...prev,
                  maxContacts: Number(e.target.value) || 0,
                }))
              }
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            {(
              [
                ["featuredListing", "Featured Listing"],
                ["verifiedPriority", "Verification Priority"],
                ["leadInboxAccess", "Lead Inbox Access"],
                ["analyticsAccess", "Analytics Access"],
                ["prioritySupport", "Priority Support"],
              ] as const
            ).map(([key, title]) => (
              <label
                key={key}
                className="inline-flex items-center gap-2 text-xs text-text-secondary cursor-pointer"
              >
                <Switch
                  checked={Boolean(limits[key])}
                  onChange={(e) =>
                    setLimits((prev) => ({ ...prev, [key]: e.target.checked }))
                  }
                />
                {title}
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <label className="text-[13px] font-medium text-foreground">
              Displayed Features (one per line)
            </label>
            <button
              type="button"
              onClick={handleGenerateFromLimits}
              className="text-xs font-semibold text-primary hover:underline cursor-pointer"
            >
              Regenerate from limits
            </button>
          </div>
          <Textarea
            value={featuresText}
            onChange={(e) => setFeaturesText(e.target.value)}
            rows={4}
          />
        </div>

        {/* Mercora /pricing System Feature Groups Preview */}
        <div className="rounded-xl border border-border overflow-hidden">
          <button
            type="button"
            onClick={() => setShowModulesPreview((v) => !v)}
            className="w-full px-4 py-2.5 bg-background-secondary/70 flex items-center justify-between text-xs font-bold text-text-primary cursor-pointer"
          >
            <span>
              /pricing System Modules Preview ({featureGroups.filter((g) => g.included).length}/
              {featureGroups.length} Enabled)
            </span>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${showModulesPreview ? "rotate-180" : ""}`}
            />
          </button>

          {showModulesPreview && (
            <div className="p-3 space-y-2 bg-surface">
              {featureGroups.map((group) => (
                <div
                  key={group.key}
                  className="p-2.5 rounded-lg border border-border/80 bg-surface-hover/30 flex items-start justify-between gap-3"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      {group.included ? (
                        <Badge variant="success" size="sm">
                          <Check className="w-3 h-3 mr-0.5" />
                          Included
                        </Badge>
                      ) : (
                        <Badge variant="neutral" size="sm">
                          <X className="w-3 h-3 mr-0.5" />
                          Locked
                        </Badge>
                      )}
                      <span className="text-xs font-bold text-text-primary">{group.title}</span>
                    </div>
                    <p className="text-[11px] text-text-muted leading-snug">
                      {group.items.join(" • ")}
                    </p>
                  </div>
                  <Switch
                    checked={group.included}
                    onChange={(e) => toggleGroupIncluded(group.key, e.target.checked)}
                    aria-label={`Toggle ${group.title}`}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
          <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : isEditing ? (
              "Save Changes"
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Create Plan</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
