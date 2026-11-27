import React from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PlanCatalogSection } from "@/features/subscriptions/components/PlanCatalogSection";
import { AdminPlanModal } from "@/features/subscriptions/components/admin/AdminPlanModal";
import {
  buildUniquePresetCode,
  deriveMercoraSystemBullets,
} from "@/features/subscriptions/utils/system-plan-generator";
import {
  ADMIN_NAV_SECTIONS,
  isGroupItem,
} from "@/components/layout/sidebar/sidebar-navigation.data";
import { SidebarUserFooter } from "@/components/layout/sidebar/SidebarUserFooter";
import type { SubscriptionPlan, SubscriptionRecord } from "@/features/subscriptions/types";

const samplePlans: SubscriptionPlan[] = [
  {
    id: "plan-starter",
    code: "STARTER_MONTHLY",
    name: "Starter Plan",
    description: "Entry B2B plan",
    label: null,
    isPopular: false,
    originalPrice: 1499,
    originalPriceMinor: 149900,
    price: 999,
    priceMinor: 99900,
    currency: "INR",
    billingInterval: "MONTHLY",
    durationDays: 30,
    gstRateBps: 1800,
    taxMinor: 17982,
    totalPriceMinor: 117882,
    totalPrice: 1178.82,
    features: ["Verified Listing", "25 Monthly Enquiries"],
    limits: {
      maxBusinessListings: 1,
      maxProducts: 15,
      maxEnquiriesPerMonth: 25,
      maxContacts: 2,
      featuredListing: false,
      verifiedPriority: false,
      leadInboxAccess: true,
      analyticsAccess: true,
      prioritySupport: false,
    },
    isActive: true,
    displayOrder: 1,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "plan-pro",
    code: "PRO_QUARTERLY",
    name: "Business Plan",
    description: "Growth plan with featured visibility",
    label: "Most Popular",
    isPopular: true,
    originalPrice: 3499,
    originalPriceMinor: 349900,
    price: 2499,
    priceMinor: 249900,
    currency: "INR",
    billingInterval: "QUARTERLY",
    durationDays: 90,
    gstRateBps: 1800,
    taxMinor: 44982,
    totalPriceMinor: 294882,
    totalPrice: 2948.82,
    features: ["Featured Placement", "150 Monthly Enquiries"],
    limits: {
      maxBusinessListings: 3,
      maxProducts: 50,
      maxEnquiriesPerMonth: 150,
      maxContacts: 5,
      featuredListing: true,
      verifiedPriority: true,
      leadInboxAccess: true,
      analyticsAccess: true,
      prioritySupport: true,
    },
    isActive: true,
    displayOrder: 2,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  },
];

describe("PlanCatalogSection (Unit - Section 14G)", () => {
  it("renders INR plan pricing, compare MRP, Excluding GST, expandable + / - / x system groups, and Buy Now action", () => {
    const onSelectPlan = vi.fn();
    render(
      <PlanCatalogSection
        plans={samplePlans}
        isAuthenticated={false}
        onSelectPlan={onSelectPlan}
      />
    );

    expect(screen.getAllByText("Starter Plan").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Business Plan").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/₹999/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/₹1,499/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("(Excluding GST)").length).toBe(2);

    // Click expandable system group on Starter Plan (+ -> - reveals Mercora system items)
    const productCatalogBtns = screen.getAllByRole("button", {
      name: /Product Catalog & Classification/i,
    });
    expect(screen.queryByText(/Up to 15 Product Entries per Business/i)).not.toBeInTheDocument();
    fireEvent.click(productCatalogBtns[0]);
    expect(screen.getByText(/Up to 15 Product Entries per Business/i)).toBeInTheDocument();

    // Unavailable tier feature shows non-expandable label without button role (only Business Plan has button)
    expect(
      screen.queryAllByRole("button", { name: /Dedicated Priority Support/i })
    ).toHaveLength(1);

    const buttons = screen.getAllByRole("button", { name: /Buy Now/i });
    fireEvent.click(buttons[0]);
    expect(onSelectPlan).toHaveBeenCalledWith(samplePlans[0], "purchase");
  });

  it("shows Renew for current active plan and Upgrade for higher-priced plan", () => {
    const onSelectPlan = vi.fn();
    const activeStarter: SubscriptionRecord = {
      id: "sub-1",
      businessId: "biz-1",
      planId: "plan-starter",
      planSnapshot: {
        ...samplePlans[0].limits,
        planId: "plan-starter",
        code: "STARTER_MONTHLY",
        name: "Starter Monthly",
        priceMinor: 99900,
        currency: "INR",
        billingInterval: "MONTHLY",
        durationDays: 30,
        gstRateBps: 1800,
        features: samplePlans[0].features,
        limits: samplePlans[0].limits,
        capturedAt: "2026-01-01T00:00:00.000Z",
      },
      status: "ACTIVE",
      subtotalMinor: 99900,
      taxMinor: 17982,
      amountMinor: 117882,
      currency: "INR",
      startsAt: "2026-01-01T00:00:00.000Z",
      expiresAt: "2026-02-01T00:00:00.000Z",
      cancelAtPeriodEnd: false,
      cancelledAt: null,
      createdAt: "2026-01-01T00:00:00.000Z",
    };

    render(
      <PlanCatalogSection
        plans={samplePlans}
        currentSubscription={activeStarter}
        isAuthenticated={true}
        onSelectPlan={onSelectPlan}
      />
    );

    const renewBtn = screen.getByRole("button", { name: /Renew Current Plan/i });
    fireEvent.click(renewBtn);
    expect(onSelectPlan).toHaveBeenCalledWith(samplePlans[0], "renew");

    const upgradeBtn = screen.getByRole("button", { name: /Upgrade Plan/i });
    fireEvent.click(upgradeBtn);
    expect(onSelectPlan).toHaveBeenCalledWith(samplePlans[1], "upgrade");
  });

  it("generates system plan features cleanly and applies Mercora system presets inside AdminPlanModal", async () => {
    expect(buildUniquePresetCode("PRO_QUARTERLY", ["STARTER_MONTHLY", "PRO_QUARTERLY"])).toBe(
      "PRO_QUARTERLY_V2"
    );
    const derivedBullets = deriveMercoraSystemBullets(
      { ...samplePlans[1].limits, prioritySupport: true },
      180
    );
    expect(derivedBullets.some((b) => /50 product catalog entries/i.test(b))).toBe(true);
    expect(derivedBullets.some((b) => /Dedicated onboarding/i.test(b))).toBe(true);

    render(
      <AdminPlanModal
        isOpen={true}
        onClose={vi.fn()}
        existingCodes={["STARTER_MONTHLY", "PRO_QUARTERLY"]}
        onSaved={vi.fn()}
      />
    );

    const enterprisePresetBtn = await screen.findByRole("button", {
      name: /Enterprise Plan/i,
    });
    fireEvent.click(enterprisePresetBtn);

    expect(screen.getByDisplayValue("ENTERPRISE_YEARLY")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Enterprise Plan")).toBeInTheDocument();
    expect(screen.getByDisplayValue("8999")).toBeInTheDocument();
    expect(
      screen.getByText(/\/pricing System Modules Preview \(6\/6 Enabled\)/i)
    ).toBeInTheDocument();
  });

  it("keeps admin sidebar payment menus free of duplicates and omits duplicate Live Directory footer link", () => {
    const allHrefs: string[] = [];
    for (const section of ADMIN_NAV_SECTIONS) {
      for (const item of section.items) {
        if (isGroupItem(item)) {
          allHrefs.push(...item.children.map((c) => c.href));
        } else {
          allHrefs.push(item.href);
        }
      }
    }

    expect(new Set(allHrefs).size).toBe(allHrefs.length);
    const paymentsSection = ADMIN_NAV_SECTIONS.find((s) => s.label === "Billing & Payments");
    const paymentsGroup = paymentsSection?.items[0];
    expect(paymentsGroup && isGroupItem(paymentsGroup) ? paymentsGroup.children : []).toHaveLength(7);
    expect(allHrefs).not.toContain("/admin/payments/successful");
    expect(allHrefs).not.toContain("/admin/payments/pending");
    expect(allHrefs).not.toContain("/admin/payments/failed");

    render(<SidebarUserFooter isCollapsed={false} />);
    expect(screen.queryByRole("link", { name: /Live Directory/i })).not.toBeInTheDocument();
  });
});
