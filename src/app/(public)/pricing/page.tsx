import React from "react";
import { PricingPageClient } from "./PricingPageClient";
import type { SubscriptionPlan } from "@/features/subscriptions/types";

export const dynamic = "force-dynamic";

async function loadInitialPlans(): Promise<{
  plans: SubscriptionPlan[];
  failed: boolean;
}> {
  const rawBase =
    process.env.INTERNAL_BACKEND_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://127.0.0.1:5001";
  const origin = rawBase.replace(/\/api\/?$/, "").replace(/\/+$/, "");

  if (!origin.startsWith("http")) {
    return { plans: [], failed: false };
  }

  try {
    const res = await fetch(`${origin}/api/v1/subscription-plans`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    if (!res.ok) {
      return { plans: [], failed: true };
    }
    const body = await res.json();
    const list = Array.isArray(body?.data) ? (body.data as SubscriptionPlan[]) : [];
    return { plans: list, failed: false };
  } catch {
    return { plans: [], failed: true };
  }
}

export default async function PricingPlansPage() {
  const { plans, failed } = await loadInitialPlans();
  return <PricingPageClient initialPlans={plans} initialFetchFailed={failed} />;
}
