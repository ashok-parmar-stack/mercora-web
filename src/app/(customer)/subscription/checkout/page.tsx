"use client";

import React, { useState, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CreditCard,
  ShieldCheck,
  Lock,
  Building2,
  ArrowRight,
  AlertCircle,
  Loader2,
  Receipt,
  CheckCircle2,
  Package,
  MessageSquare,
  PhoneCall,
  Sparkles,
  FileText,
  Smartphone,
  Landmark,
  Wallet,
} from "lucide-react";
import { CustomerSubHeader } from "@/components/layout/CustomerSubHeader";
import {
  Badge,
  Button,
  ErrorState,
  Input,
  LoadingState,
  Select,
} from "@/components/common";
import { useAbortableFetch } from "@/lib/hooks/useAbortableFetch";
import { useAuthStore } from "@/lib/store/auth-store";
import { useUIStore } from "@/lib/store/ui-store";
import { extractErrorMessage } from "@/lib/http/client";
import {
  checkoutSubscription,
  createPaymentOrder,
  fetchCurrentSubscription,
  fetchPlanById,
  renewSubscription,
  upgradeSubscription,
  verifyRazorpayPayment,
} from "@/features/subscriptions/api/subscription-api";
import type {
  BillingDetails,
  BusinessSubscriptionOverview,
  CheckoutOrderPayload,
  SubscriptionPlan,
} from "@/features/subscriptions/types";
import {
  formatInrMinor,
  formatLimitValue,
  loadRazorpayCheckoutScript,
} from "@/features/subscriptions/utils/razorpay-checkout";

const INDIAN_STATES = [
  "Gujarat",
  "Maharashtra",
  "Delhi",
  "Karnataka",
  "Tamil Nadu",
  "Rajasthan",
  "Uttar Pradesh",
  "Telangana",
  "West Bengal",
  "Andhra Pradesh",
  "Madhya Pradesh",
  "Haryana",
  "Punjab",
  "Kerala",
  "Bihar",
  "Odisha",
  "Assam",
  "Jharkhand",
  "Chhattisgarh",
  "Uttarakhand",
  "Himachal Pradesh",
  "Goa",
  "Chandigarh",
  "Other",
];

const SELLER_STATE = "Gujarat";
const GSTIN_PATTERN = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

const PAYMENT_METHODS = [
  { label: "UPI (GPay, PhonePe, Paytm)", icon: Smartphone },
  { label: "Credit & Debit Cards", icon: CreditCard },
  { label: "Net Banking (50+ Banks)", icon: Landmark },
  { label: "Wallets & Pay Later", icon: Wallet },
];

function SubscriptionCheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const addToast = useUIStore((s) => s.addToast);
  const authUser = useAuthStore((s) => s.user);

  const planId = searchParams.get("planId") || "";
  const mode = (searchParams.get("mode") || "purchase") as
    | "purchase"
    | "renew"
    | "upgrade"
    | "retry";
  const subscriptionIdParam = searchParams.get("subscriptionId") || "";
  const initialBizId = searchParams.get("businessId") || "";

  const [plan, setPlan] = useState<SubscriptionPlan | null>(null);
  const [overview, setOverview] = useState<BusinessSubscriptionOverview | null>(null);
  const [selectedBusinessId, setSelectedBusinessId] = useState(initialBizId);
  const [billingName, setBillingName] = useState("");
  const [gstin, setGstin] = useState("");
  const [billingState, setBillingState] = useState(SELLER_STATE);
  const [gstinError, setGstinError] = useState<string | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const idempotencyKeyRef = useRef<string>(
    `chk_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
  );

  const { isLoading, error, load } = useAbortableFetch(async (signal) => {
    const [planData, ov] = await Promise.all([
      planId ? fetchPlanById(planId, signal) : Promise.resolve(null),
      fetchCurrentSubscription(initialBizId || undefined, signal),
    ]);
    setPlan(planData);
    setOverview(ov);
    if (!selectedBusinessId && ov?.selectedBusiness?.id) {
      setSelectedBusinessId(ov.selectedBusiness.id);
    }
    if (!billingName) {
      setBillingName(
        ov?.selectedBusiness?.name ||
          ov?.subscription?.billingDetails?.billingName ||
          authUser?.name ||
          ""
      );
    }
    if (!gstin && (ov?.selectedBusiness?.gstin || ov?.subscription?.billingDetails?.gstin)) {
      setGstin(
        ov.selectedBusiness?.gstin || ov.subscription?.billingDetails?.gstin || ""
      );
    }
    if (ov?.selectedBusiness?.state || ov?.subscription?.billingDetails?.state) {
      setBillingState(
        ov.selectedBusiness?.state || ov.subscription?.billingDetails?.state || SELLER_STATE
      );
    }
  }, [planId, initialBizId]);

  const handleProceedToPayment = async () => {
    if (isProcessing) return;
    setCheckoutError(null);
    setGstinError(null);

    if (!plan && !subscriptionIdParam) {
      setCheckoutError("No subscription plan selected.");
      return;
    }

    const cleanGstin = gstin.trim().toUpperCase();
    if (cleanGstin && !GSTIN_PATTERN.test(cleanGstin)) {
      setGstinError(
        "Enter a valid 15-character GSTIN (e.g. 24ABCDE1234F1Z5) or leave blank."
      );
      return;
    }

    const billingDetails: BillingDetails = {};
    if (billingName.trim()) billingDetails.billingName = billingName.trim();
    if (cleanGstin) billingDetails.gstin = cleanGstin;
    if (billingState.trim()) billingDetails.state = billingState.trim();
    const billingPayload =
      Object.keys(billingDetails).length > 0 ? billingDetails : undefined;

    setIsProcessing(true);
    setStatusMessage("Creating secure Razorpay payment order...");

    let createdOrder: CheckoutOrderPayload | null = null;
    try {
      const targetBizId = selectedBusinessId || undefined;
      if (subscriptionIdParam && mode === "retry") {
        createdOrder = await createPaymentOrder({
          subscriptionId: subscriptionIdParam,
          businessId: targetBizId,
          billingDetails: billingPayload,
          idempotencyKey: idempotencyKeyRef.current,
        });
      } else if (mode === "renew") {
        createdOrder = await renewSubscription({
          planId: plan?.id,
          businessId: targetBizId,
          billingDetails: billingPayload,
          idempotencyKey: idempotencyKeyRef.current,
        });
      } else if (mode === "upgrade" && plan) {
        createdOrder = await upgradeSubscription({
          targetPlanId: plan.id,
          businessId: targetBizId,
          billingDetails: billingPayload,
          idempotencyKey: idempotencyKeyRef.current,
        });
      } else if (plan) {
        createdOrder = await checkoutSubscription({
          planId: plan.id,
          businessId: targetBizId,
          billingDetails: billingPayload,
          idempotencyKey: idempotencyKeyRef.current,
        });
      }

      if (!createdOrder || !createdOrder.orderId || !createdOrder.keyId) {
        throw new Error("Gateway did not return a valid Razorpay checkout order.");
      }

      setStatusMessage("Loading Razorpay Checkout...");
      const loaded = await loadRazorpayCheckoutScript();
      if (!loaded || !window.Razorpay) {
        throw new Error(
          "Unable to load Razorpay Checkout script. Please check your internet connection or ad blocker."
        );
      }

      setStatusMessage("Awaiting payment completion in Razorpay window...");
      const orderRef = createdOrder;

      const rzp = new window.Razorpay({
        key: orderRef.keyId,
        amount: orderRef.amountMinor,
        currency: orderRef.currency,
        name: "Mercora B2B",
        description: `${orderRef.plan.name} (${orderRef.plan.billingInterval})`,
        order_id: orderRef.orderId,
        prefill: orderRef.prefill,
        notes: {
          ...(orderRef.business?.id ? { businessId: orderRef.business.id } : {}),
          subscriptionId: orderRef.subscriptionId,
          paymentId: orderRef.paymentId,
        },
        theme: { color: "#7F1D3F" },
        handler: async (response) => {
          try {
            setStatusMessage("Verifying payment signature with server...");
            const verified = await verifyRazorpayPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            addToast("success", "Payment Verified", "Your subscription has been activated.");
            router.replace(
              `/subscription/result?paymentId=${encodeURIComponent(orderRef.paymentId)}${
                verified.alreadyCompleted ? "&alreadyCompleted=1" : ""
              }`
            );
          } catch (verifyErr) {
            setCheckoutError(extractErrorMessage(verifyErr));
            setIsProcessing(false);
            setStatusMessage(null);
            router.replace(
              `/subscription/result?paymentId=${encodeURIComponent(orderRef.paymentId)}`
            );
          }
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            setStatusMessage(null);
            router.replace(
              `/subscription/result?paymentId=${encodeURIComponent(orderRef.paymentId)}&outcome=cancelled`
            );
          },
        },
      });

      rzp.on("payment.failed", (failureEvent: any) => {
        const desc =
          failureEvent?.error?.description || "Payment was declined by the bank or gateway.";
        setIsProcessing(false);
        setStatusMessage(null);
        router.replace(
          `/subscription/result?paymentId=${encodeURIComponent(
            orderRef.paymentId
          )}&outcome=failed&reason=${encodeURIComponent(desc)}`
        );
      });

      rzp.open();
    } catch (err) {
      const msg = extractErrorMessage(err, "Unable to initiate payment checkout.");
      setCheckoutError(msg);
      setIsProcessing(false);
      setStatusMessage(null);
      addToast("error", "Checkout Error", msg);
    }
  };

  if (isLoading) {
    return (
      <>
        <CustomerSubHeader
          icon={<CreditCard className="w-5 h-5 text-primary" />}
          title="Subscription Checkout"
          backHref="/pricing"
          backLabel="Plans"
        />
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-12">
          <LoadingState message="Preparing secure subscription checkout..." />
        </main>
      </>
    );
  }

  if (error || (!plan && !subscriptionIdParam)) {
    return (
      <>
        <CustomerSubHeader
          icon={<CreditCard className="w-5 h-5 text-primary" />}
          title="Subscription Checkout"
          backHref="/pricing"
          backLabel="Plans"
        />
        <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-12">
          <ErrorState
            title="Checkout Unavailable"
            message={error || "Please select a valid subscription plan to continue."}
            onRetry={load}
          />
        </main>
      </>
    );
  }

  const fallbackSnap = overview?.subscription?.planSnapshot;
  const planTitle = plan?.name || fallbackSnap?.name || "Subscription Plan";
  const billingInterval = plan?.billingInterval || fallbackSnap?.billingInterval || "MONTHLY";
  const durationDays = plan?.durationDays ?? fallbackSnap?.durationDays ?? 30;
  const gstRateBps = plan?.gstRateBps ?? fallbackSnap?.gstRateBps ?? 1800;

  const baseMinor = plan?.priceMinor ?? overview?.subscription?.subtotalMinor ?? 0;
  const compareMinor =
    plan?.originalPriceMinor && plan.originalPriceMinor > baseMinor
      ? plan.originalPriceMinor
      : null;
  const savingsMinor = compareMinor ? compareMinor - baseMinor : 0;
  const savingsPercent = compareMinor
    ? Math.round((savingsMinor / compareMinor) * 100)
    : 0;

  const gstMinor = plan?.taxMinor ?? overview?.subscription?.taxMinor ?? 0;
  const totalMinor = plan?.totalPriceMinor ?? overview?.subscription?.amountMinor ?? 0;

  const isIntraState =
    billingState.trim().toLowerCase() === SELLER_STATE.toLowerCase();
  const cgstMinor = isIntraState ? Math.floor(gstMinor / 2) : 0;
  const sgstMinor = isIntraState ? gstMinor - cgstMinor : 0;
  const igstMinor = isIntraState ? 0 : gstMinor;

  const gstPercent = gstRateBps / 100;
  const halfGstPercent = gstPercent / 2;
  const cleanGstin = gstin.trim().toUpperCase();
  const isValidGstinEntered = Boolean(cleanGstin && GSTIN_PATTERN.test(cleanGstin));

  const limits = plan?.limits || fallbackSnap?.limits;

  return (
    <>
      <CustomerSubHeader
        icon={<CreditCard className="w-5 h-5 text-primary" />}
        title="Subscription Checkout"
        backHref="/pricing"
        backLabel="Back to Plans"
      />

      {/* Compact Obsidian-Plum Hero Strip matching Mercora /pricing */}
      <section
        className="relative overflow-hidden pt-7 pb-14 text-white"
        style={{
          background:
            "radial-gradient(ellipse at 90% 20%, #3D1526 0%, #240C1A 55%, #150610 100%)",
        }}
      >
        <div
          className="pointer-events-none absolute -top-24 right-1/4 w-[420px] h-[260px] rounded-full opacity-20 blur-[100px]"
          style={{
            background: "radial-gradient(circle, #E5A8BA 0%, #7F1D3F 60%, transparent 80%)",
          }}
          aria-hidden="true"
        />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-[11px] font-bold tracking-widest text-[#E5A8BA] uppercase">
              <span className="w-4 h-[1.5px] bg-[#E5A8BA]" />
              <span>MERCORA {mode.toUpperCase()} CHECKOUT</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight text-white">
              Activate <span className="text-[#E5A8BA]">{planTitle}</span>
            </h2>

            {/* 3-Step Checkout Progress Trail */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-1 text-xs">
              <span className="inline-flex items-center gap-1.5 text-white/80 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#E5A8BA]" />
                <span>01 Plan Selected</span>
              </span>
              <span className="text-white/30">→</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 border border-white/20 text-white font-bold">
                <span>02 Billing &amp; Tax Details</span>
              </span>
              <span className="text-white/30">→</span>
              <span className="text-white/60 font-medium">
                03 Razorpay Payment &amp; Invoice
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-colors"
            >
              <span>Change Plan</span>
            </Link>
          </div>
        </div>
      </section>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-14 relative z-20 space-y-5">
        {checkoutError && (
          <div className="p-4 rounded-2xl bg-surface border border-destructive/30 shadow-sm text-destructive text-xs font-semibold flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{checkoutError}</span>
          </div>
        )}

        {statusMessage && (
          <div className="p-4 rounded-2xl bg-surface border border-primary/30 shadow-sm text-primary text-xs font-semibold flex items-center gap-2.5">
            <Loader2 className="w-4 h-4 animate-spin shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left 7 Cols: Plan Entitlement Snapshot + Billing Details Form + Methods */}
          <div className="lg:col-span-7 space-y-5">
            {/* 1. Selected Plan Capabilities Snapshot */}
            <div className="bg-surface rounded-2xl border border-border p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                    Selected Membership Tier
                  </span>
                  <h3 className="text-lg font-display font-extrabold text-text-primary mt-0.5">
                    {planTitle}
                  </h3>
                  {plan?.description && (
                    <p className="text-xs text-text-secondary mt-1 max-w-xl">
                      {plan.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant="brand" size="sm">
                    {billingInterval.replace("_", " ")} • {durationDays} Days
                  </Badge>
                  {plan?.isPopular && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-primary/10 text-primary">
                      <Sparkles className="w-3 h-3" />
                      Recommended
                    </span>
                  )}
                </div>
              </div>

              {limits && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                  {[
                    {
                      label: "Storefronts",
                      value: formatLimitValue(limits.maxBusinessListings),
                      icon: Building2,
                    },
                    {
                      label: "Products",
                      value: formatLimitValue(limits.maxProducts),
                      icon: Package,
                    },
                    {
                      label: "RFQ Leads/Mo",
                      value: formatLimitValue(limits.maxEnquiriesPerMonth),
                      icon: MessageSquare,
                    },
                    {
                      label: "Contacts",
                      value: formatLimitValue(limits.maxContacts),
                      icon: PhoneCall,
                    },
                  ].map((q) => {
                    const QIcon = q.icon;
                    return (
                      <div
                        key={q.label}
                        className="p-2.5 rounded-xl bg-background-secondary/70 border border-border"
                      >
                        <div className="flex items-center justify-between text-[10px] font-bold uppercase text-text-muted">
                          <span>{q.label}</span>
                          <QIcon className="w-3 h-3 text-primary" />
                        </div>
                        <p className="text-xs sm:text-sm font-extrabold text-text-primary font-data mt-1">
                          {q.value}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 2. Billing & Tax Invoice Details Card */}
            <div className="bg-surface rounded-2xl border border-border p-5 sm:p-6 shadow-sm space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Receipt className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-text-primary">
                      Billing &amp; Tax Invoice Details
                    </h3>
                    <p className="text-[11px] text-text-muted">
                      No directory profile required — enter GSTIN only if claiming GST credit.
                    </p>
                  </div>
                </div>
                <Badge variant="neutral" size="sm">
                  GSTIN Optional
                </Badge>
              </div>

              {overview?.hasBusiness && overview.businesses.length > 0 && (
                overview.businesses.length > 1 ? (
                  <Select
                    id="linked-business"
                    label="Link to Directory Business (Optional)"
                    value={selectedBusinessId}
                    helperText="Choose a directory profile or switch to account-level billing."
                    onChange={(e) => {
                      const nextId = e.target.value;
                      setSelectedBusinessId(nextId);
                      const match = overview.businesses.find((b) => b.id === nextId);
                      if (match) {
                        setBillingName(match.name);
                        if (match.state) setBillingState(match.state);
                      }
                    }}
                  >
                    <option value="">Account-level Subscription (No directory profile)</option>
                    {overview.businesses.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name} — {b.city}, {b.state}
                      </option>
                    ))}
                  </Select>
                ) : (
                  <div className="p-3.5 rounded-xl border border-border bg-background-secondary/70 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Building2 className="w-4 h-4 text-primary shrink-0" />
                      <div className="min-w-0">
                        <p className="font-bold text-text-primary truncate">
                          Linked Business: {overview.selectedBusiness?.name}
                        </p>
                        <p className="text-text-muted text-[11px]">
                          {overview.selectedBusiness?.city}, {overview.selectedBusiness?.state}
                        </p>
                      </div>
                    </div>
                    <Badge variant="success" size="sm">
                      Directory Linked
                    </Badge>
                  </div>
                )
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                <div className="sm:col-span-2">
                  <Input
                    id="billing-name"
                    label="Billing Name / Company Name"
                    placeholder="e.g. Apex Exports Pvt Ltd or Your Full Name"
                    value={billingName}
                    onChange={(e) => setBillingName(e.target.value)}
                    helperText="Shown as the Billed To party on your downloadable PDF tax invoice."
                  />
                </div>

                <Input
                  id="billing-gstin"
                  label="GSTIN (Optional)"
                  placeholder="24ABCDE1234F1Z5"
                  maxLength={15}
                  value={gstin}
                  rightIcon={
                    isValidGstinEntered ? (
                      <CheckCircle2 className="w-4 h-4 text-status-success" />
                    ) : undefined
                  }
                  onChange={(e) => {
                    setGstin(e.target.value.toUpperCase());
                    if (gstinError) setGstinError(null);
                  }}
                  error={gstinError || undefined}
                  helperText={
                    gstinError
                      ? undefined
                      : "Optional — enter only to claim B2B GST input tax credit."
                  }
                />

                <Select
                  id="billing-state"
                  label="Billing State (Place of Supply)"
                  value={billingState}
                  onChange={(e) => setBillingState(e.target.value)}
                  helperText={
                    isIntraState
                      ? `Intra-state (${SELLER_STATE}): ${halfGstPercent}% CGST + ${halfGstPercent}% SGST.`
                      : `Inter-state supply: ${gstPercent}% IGST.`
                  }
                >
                  {INDIAN_STATES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </Select>
              </div>

              {/* Live Tax Invoice Preview Pill */}
              <div className="p-3.5 rounded-xl bg-background-secondary/80 border border-border flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 text-text-secondary">
                  <FileText className="w-4 h-4 text-primary shrink-0" />
                  <span>
                    Invoice For:{" "}
                    <strong className="text-text-primary">
                      {billingName.trim() || authUser?.name || "Mercora Member"}
                    </strong>
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-text-muted">
                  {cleanGstin ? `B2B Invoice • GSTIN ${cleanGstin}` : "Standard Tax Invoice (No GSTIN)"}
                </span>
              </div>
            </div>

            {/* 3. Accepted Razorpay Payment Methods */}
            <div className="bg-surface rounded-2xl border border-border p-5 sm:p-6 shadow-sm space-y-3.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-text-primary flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-status-success" />
                  <span>Razorpay Verified Payment Gateway</span>
                </span>
                <Badge variant="info" size="sm">
                  INR (₹)
                </Badge>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {PAYMENT_METHODS.map((pm) => {
                  const PmIcon = pm.icon;
                  return (
                    <div
                      key={pm.label}
                      className="p-2.5 rounded-xl border border-border bg-surface-hover/50 flex flex-col gap-1.5"
                    >
                      <PmIcon className="w-4 h-4 text-primary" />
                      <span className="text-[11px] font-semibold text-text-secondary leading-snug">
                        {pm.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              <p className="text-[11px] text-text-muted leading-relaxed">
                Payable totals are computed strictly on the Mercora server from database plan rates.
                Subscriptions activate only after cryptographic HMAC-SHA256 verification.
              </p>
            </div>
          </div>

          {/* Right 5 Cols: Sticky Obsidian-Plum Order Summary Rail */}
          <div className="lg:col-span-5 lg:sticky lg:top-20">
            <div className="rounded-2xl overflow-hidden border border-[#7F1D3F]/30 shadow-lg bg-surface">
              {/* Signature Obsidian-Plum Header */}
              <div
                className="p-6 text-white space-y-2 border-b border-white/10"
                style={{
                  background:
                    "linear-gradient(145deg, #2B1220 0%, #4A1730 55%, #7F1D3F 100%)",
                }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#E5A8BA]">
                    PAYMENT SUMMARY
                  </span>
                  {savingsPercent > 0 && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E5A8BA] text-[#2B1220]">
                      Save {savingsPercent}%
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-display font-extrabold tracking-tight text-white">
                  {planTitle}
                </h3>

                <div className="flex items-center justify-between text-xs text-white/75 pt-0.5">
                  <span>{billingInterval.replace("_", " ")} Billing</span>
                  <span>{durationDays} Days Access</span>
                </div>
              </div>

              {/* Breakdown & CTA Body */}
              <div className="p-6 space-y-5">
                <div className="space-y-2.5 text-xs">
                  {compareMinor && (
                    <div className="flex justify-between text-text-muted">
                      <span>Compare MRP</span>
                      <span className="line-through font-data">
                        {formatInrMinor(compareMinor)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-text-secondary">
                      Plan Price (Excl. GST)
                    </span>
                    <span className="font-semibold text-text-primary font-data">
                      {formatInrMinor(baseMinor)}
                    </span>
                  </div>

                  {savingsMinor > 0 && (
                    <div className="flex justify-between text-status-success font-medium">
                      <span>Membership Savings</span>
                      <span className="font-data">-{formatInrMinor(savingsMinor)}</span>
                    </div>
                  )}

                  {isIntraState ? (
                    <>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">
                          CGST ({halfGstPercent}%) — {billingState}
                        </span>
                        <span className="font-semibold text-text-primary font-data">
                          {formatInrMinor(cgstMinor)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">
                          SGST ({halfGstPercent}%) — {billingState}
                        </span>
                        <span className="font-semibold text-text-primary font-data">
                          {formatInrMinor(sgstMinor)}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between">
                      <span className="text-text-secondary">
                        IGST ({gstPercent}%) — {billingState}
                      </span>
                      <span className="font-semibold text-text-primary font-data">
                        {formatInrMinor(igstMinor)}
                      </span>
                    </div>
                  )}

                  {mode === "upgrade" && (
                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-700 dark:text-emerald-300">
                      Unused validity credit from your active plan will be deducted automatically by
                      the server when generating your Razorpay order.
                    </div>
                  )}
                </div>

                {/* Highlighted Total Payable Box */}
                <div className="p-4 rounded-xl bg-background-secondary border border-border flex items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-text-primary block">
                      Total Payable
                    </span>
                    <span className="text-[11px] text-text-muted">
                      Inclusive of {gstPercent}% GST ({isIntraState ? "CGST + SGST" : "IGST"})
                    </span>
                  </div>
                  <span className="text-2xl font-black text-primary font-data">
                    {formatInrMinor(totalMinor)}
                  </span>
                </div>

                <Button
                  type="button"
                  variant="primary"
                  size="lg"
                  className="w-full font-bold shadow-sm"
                  isLoading={isProcessing}
                  disabled={isProcessing || (!plan && !subscriptionIdParam)}
                  onClick={handleProceedToPayment}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  {isProcessing ? "Processing..." : "Proceed to Payment"}
                </Button>

                <ul className="space-y-1.5 pt-1 text-[11px] text-text-muted">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-status-success shrink-0" />
                    <span>Instant access &amp; quota activation upon payment capture</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span>GST PDF Tax Invoice available immediately after verification</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-text-muted shrink-0" />
                    <span>256-bit TLS encrypted &amp; HMAC-SHA256 verified</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default function SubscriptionCheckoutPage() {
  return (
    <Suspense fallback={<LoadingState message="Loading checkout..." />}>
      <SubscriptionCheckoutContent />
    </Suspense>
  );
}
