"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Receipt,
  CreditCard,
  ArrowRight,
  Lock,
  CheckCircle2,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { EmptyState, ErrorState, LoadingState } from "@/components/common";
import { useAuthStore } from "@/lib/store/auth-store";
import { extractErrorMessage } from "@/lib/http/client";
import { useSavedBusinesses } from "@/features/businesses/hooks/useSavedBusinesses";
import {
  fetchActivePlans,
  fetchCurrentSubscription,
} from "@/features/subscriptions/api/subscription-api";
import type {
  BusinessSubscriptionOverview,
  SubscriptionPlan,
} from "@/features/subscriptions/types";
import { PlanCatalogSection } from "@/features/subscriptions/components/PlanCatalogSection";

interface PricingPageClientProps {
  initialPlans: SubscriptionPlan[];
  initialFetchFailed?: boolean;
}

const BILLING_PILLARS = [
  {
    number: "01",
    title: "Checkout Without Friction",
    description:
      "Subscribe immediately using just your billing name and state. GSTIN is completely optional — add it only when claiming B2B input tax credit.",
  },
  {
    number: "02",
    title: "Razorpay Multi-Method Security",
    description:
      "Pay in INR via UPI, Credit & Debit Cards, Net Banking, or Wallets. Payable totals and HMAC signatures are strictly verified on Mercora servers.",
  },
  {
    number: "03",
    title: "Automated GST PDF Invoices (SAC 998314)",
    description:
      "CGST + SGST (intra-state Gujarat) or IGST (inter-state) breakdowns and downloadable PDF tax invoices are issued immediately after capture.",
  },
  {
    number: "04",
    title: "Locked Price Snapshot & Prorated Upgrades",
    description:
      "Your purchased plan price and feature snapshot never change mid-cycle. Mid-term upgrades credit unused remaining days automatically.",
  },
];

export function PricingPageClient({
  initialPlans,
  initialFetchFailed = false,
}: PricingPageClientProps) {
  const router = useRouter();
  const { savedCount } = useSavedBusinesses();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const [plans, setPlans] = useState<SubscriptionPlan[]>(initialPlans);
  const [overview, setOverview] = useState<BusinessSubscriptionOverview | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(initialPlans.length === 0);
  const [error, setError] = useState<string | null>(
    initialFetchFailed && initialPlans.length === 0
      ? "Unable to connect to the subscription service."
      : null
  );
  const [reloadNonce, setReloadNonce] = useState(0);

  useEffect(() => {
    const ctrl = new AbortController();

    async function syncClient() {
      if (plans.length === 0) {
        setIsLoading(true);
      }
      setError(null);
      try {
        const activePlans = await fetchActivePlans(ctrl.signal);
        setPlans(activePlans);
      } catch (err: any) {
        if (err?.name !== "AbortError" && plans.length === 0) {
          setError(extractErrorMessage(err));
        }
      } finally {
        if (!ctrl.signal.aborted) {
          setIsLoading(false);
        }
      }

      if (isAuthenticated) {
        try {
          const subOverview = await fetchCurrentSubscription(undefined, ctrl.signal);
          setOverview(subOverview);
        } catch {
          if (!ctrl.signal.aborted) {
            setOverview(null);
          }
        }
      } else {
        setOverview(null);
      }
    }

    syncClient();
    return () => ctrl.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, reloadNonce]);

  const handleSelectPlan = (
    plan: SubscriptionPlan,
    mode: "purchase" | "renew" | "upgrade" | "downgrade"
  ) => {
    if (!isAuthenticated) {
      router.push(
        `/login?redirect=${encodeURIComponent(`/subscription/checkout?planId=${plan.id}&mode=purchase`)}`
      );
      return;
    }

    if (mode === "downgrade") {
      router.push(`/subscription?downgradePlanId=${encodeURIComponent(plan.id)}`);
      return;
    }

    router.push(`/subscription/checkout?planId=${encodeURIComponent(plan.id)}&mode=${mode}`);
  };

  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col font-sans">
      <Header savedCount={savedCount} />

      {/* Editorial Obsidian-Burgundy Hero Band matching Mercora Design System */}
      <section
        className="relative overflow-hidden pt-12 pb-20 sm:pt-14 sm:pb-24 text-white"
        style={{
          background:
            "radial-gradient(ellipse at 85% 20%, #3D1526 0%, #240C1A 45%, #150610 100%)",
        }}
      >
        <div
          className="pointer-events-none absolute -top-28 right-1/4 w-[520px] h-[340px] rounded-full opacity-25 blur-[110px]"
          style={{
            background: "radial-gradient(circle, #E5A8BA 0%, #7F1D3F 60%, transparent 80%)",
          }}
          aria-hidden="true"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-3xl space-y-4 text-left">
              <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-[#E5A8BA] uppercase">
                <span className="w-4 h-[1.5px] bg-[#E5A8BA]" />
                <span>MERCORA TRADE MEMBERSHIP</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-display font-extrabold tracking-tight text-white leading-[1.1]">
                Membership tiers built for{" "}
                <span className="text-[#E5A8BA]">B2B trade momentum.</span>
              </h1>

              <p className="text-sm sm:text-base text-white/80 leading-relaxed max-w-2xl">
                Compare verified directory storefronts, product catalog quotas, RFQ enquiry
                inbox capacities, and Razorpay GST-compliant billing across every Mercora tier.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              {isAuthenticated ? (
                <Link
                  href="/subscription"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold bg-white text-[#2B1220] hover:bg-[#FFEBF0] transition-colors shadow-sm"
                >
                  <span>
                    {overview?.subscription?.status === "ACTIVE"
                      ? `Active: ${overview.subscription.planSnapshot.name}`
                      : "Manage My Subscription"}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <Link
                  href="/businesses"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-colors"
                >
                  <span>Explore Verified Directory</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          </div>

          {/* Trust & Billing Capability Strip */}
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-white/80">
            <span className="inline-flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-[#E5A8BA]" />
              <span>UPI, Cards, Net Banking &amp; Wallets via Razorpay</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Receipt className="w-3.5 h-3.5 text-[#E5A8BA]" />
              <span>Optional GSTIN — GST Tax Invoice Ready</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#E5A8BA]" />
              <span>Immutable Plan Snapshot Lock</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#E5A8BA]" />
              <span>No Business Directory Setup Needed to Subscribe</span>
            </span>
          </div>
        </div>
      </section>

      {/* Main Plan Catalog overlapping cleanly onto Warm Ivory Canvas */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-12 pb-14 relative z-20">
          {isLoading && plans.length === 0 ? (
            <div className="bg-surface rounded-2xl border border-border p-10 shadow-sm">
              <LoadingState message="Loading subscription plans..." />
            </div>
          ) : error && plans.length === 0 ? (
            <div className="bg-surface rounded-2xl border border-border p-8 shadow-sm">
              <ErrorState
                title="Unable to Load Subscription Plans"
                message={error}
                onRetry={() => setReloadNonce((n) => n + 1)}
              />
            </div>
          ) : plans.length === 0 ? (
            <div className="bg-surface rounded-2xl border border-border p-8 shadow-sm">
              <EmptyState
                title="No Active Plans Available"
                description="Subscription plans are currently being configured. Please check back shortly."
              />
            </div>
          ) : (
            <PlanCatalogSection
              plans={plans}
              currentSubscription={overview?.subscription}
              isAuthenticated={isAuthenticated}
              onSelectPlan={handleSelectPlan}
            />
          )}
        </div>

        {/* Mercora Signature Architecture Section ("A Simpler Path" Numbered Grammar) */}
        <section className="py-14 sm:py-16 bg-background-secondary/75 border-t border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
              <div className="lg:col-span-5 text-left space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-primary uppercase">
                  <span className="w-4 h-[1.5px] bg-primary" />
                  <span>MERCORA BILLING ARCHITECTURE</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-text-primary leading-tight">
                  Transparent Indian B2B billing from checkout to invoice.
                </h2>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Unlike generic subscription checkouts, Mercora ties plan quotas directly to
                  verified storefronts, catalogs, and buyer enquiries—without blocking you behind
                  lengthy onboarding forms when you just want to subscribe.
                </p>
                <div className="pt-2 flex items-center gap-3 text-xs font-semibold text-primary">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>256-bit TLS &amp; Razorpay HMAC-SHA256 Server Verification</span>
                </div>
              </div>

              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {BILLING_PILLARS.map((item) => (
                  <div
                    key={item.number}
                    className="bg-surface rounded-2xl p-5 border border-border shadow-2xs hover:border-border-hover transition-colors text-left space-y-2"
                  >
                    <div className="text-lg font-extrabold text-primary font-data">
                      {item.number}
                    </div>
                    <h3 className="text-sm font-bold text-text-primary">{item.title}</h3>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
