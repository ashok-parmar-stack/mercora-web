import type { PlanFeatureGroup, PlanLimits, SystemPlanTemplate } from "../types";

function formatCap(value: number, singular: string, plural: string): string {
  if (value < 0) return `Unlimited ${plural}`;
  return `Up to ${value} ${value === 1 ? singular : plural}`;
}

export function deriveMercoraSystemBullets(
  limits: PlanLimits,
  durationDays = 30
): string[] {
  const days = Math.max(1, Math.round(Number(durationDays || 30)));
  const bullets = [
    formatCap(
      limits.maxBusinessListings,
      "business directory listing",
      "business directory listings"
    ),
    `${formatCap(limits.maxProducts, "product catalog entry", "product catalog entries")} per business`,
    `${formatCap(limits.maxEnquiriesPerMonth, "buyer RFQ enquiry", "buyer RFQ enquiries")} per month`,
    formatCap(
      limits.maxContacts,
      "department contact channel",
      "department contact channels"
    ),
  ];

  if (limits.featuredListing) {
    bullets.push("Featured placement in directory highlights");
  }
  if (limits.verifiedPriority) {
    bullets.push("Priority business verification review queue");
  }
  if (limits.analyticsAccess) {
    bullets.push("Real-time quota & subscription analytics");
  }
  if (limits.prioritySupport) {
    bullets.push("Dedicated onboarding & priority support");
  }
  bullets.push(`GST-compliant digital tax invoices (${days} days access)`);

  return bullets;
}

export function deriveMercoraSystemGroups(
  limits: PlanLimits,
  durationDays: number
): PlanFeatureGroup[] {
  const days = Math.max(1, Math.round(Number(durationDays || 30)));
  const accessLabel =
    days >= 360
      ? `${days} Days Annual Access`
      : days >= 85 && days <= 95
        ? `${days} Days Quarterly Access`
        : `${days} Days Access`;

  return [
    {
      key: "directory_storefront",
      title: "Directory Listing & Storefront",
      included: limits.maxBusinessListings !== 0,
      items: [
        formatCap(
          limits.maxBusinessListings,
          "Verified Business Listing",
          "Verified Business Listings"
        ),
        "State, City, District & Pincode Geographic Discovery",
        `GSTIN, CIN & Verification Profile Visibility (${accessLabel})`,
      ],
    },
    {
      key: "product_catalog",
      title: "Product Catalog & Classification",
      included: limits.maxProducts !== 0,
      items: [
        `${formatCap(limits.maxProducts, "Product Entry", "Product Entries")} per Business`,
        "Industrial Category & Subcategory Mapping",
        "HSN Code & Technical Specification Showcase",
      ],
    },
    {
      key: "leads_enquiries",
      title: "Buyer Leads & Contact Channels",
      included: Boolean(limits.leadInboxAccess),
      items: [
        `${formatCap(limits.maxEnquiriesPerMonth, "Buyer RFQ Lead", "Buyer RFQ Leads")} / Month`,
        `${formatCap(limits.maxContacts, "Department Contact", "Department Contacts")} per Listing`,
        "Buyer Enquiry Inbox & Contact Reveal",
      ],
    },
    {
      key: "analytics_billing",
      title: "Subscription Analytics & GST Invoicing",
      included: Boolean(limits.analyticsAccess),
      items: [
        "Entitlement & Usage Quota Tracker",
        "GST-Compliant Tax Invoice PDF Downloads",
        "Razorpay Transaction & Renewal Ledger",
      ],
    },
    {
      key: "featured_priority",
      title: "Featured Placement & Verification Priority",
      included: Boolean(limits.featuredListing || limits.verifiedPriority),
      items: [
        limits.featuredListing
          ? "Featured B2B Directory Highlight Placement"
          : "Standard Directory Placement",
        limits.verifiedPriority
          ? "Priority Verification Review Queue"
          : "Standard Verification Review",
      ],
    },
    {
      key: "priority_support",
      title: "Dedicated Priority Support",
      included: Boolean(limits.prioritySupport),
      items: [
        "Dedicated Account & Catalog Onboarding Support",
        "Priority Billing & Renewal Assistance",
      ],
    },
  ];
}

export function buildUniquePresetCode(
  baseCode: string,
  existingCodes: string[] = []
): string {
  const normalizedBase = baseCode.trim().toUpperCase().replace(/[^A-Z0-9_]/g, "_");
  const used = new Set(existingCodes.map((c) => c.trim().toUpperCase()));
  if (!used.has(normalizedBase)) return normalizedBase;
  for (let i = 2; i < 100; i++) {
    const candidate = `${normalizedBase}_V${i}`;
    if (!used.has(candidate)) return candidate;
  }
  return `${normalizedBase}_${Date.now().toString().slice(-4)}`;
}

function makePreset(
  spec: Omit<
    SystemPlanTemplate,
    "taxMinor" | "totalPriceMinor" | "totalPrice" | "features" | "featureGroups" | "price" | "originalPrice"
  > & { originalPriceMinor: number; priceMinor: number }
): SystemPlanTemplate {
  const taxMinor = Math.round((spec.priceMinor * spec.gstRateBps) / 10000);
  const totalPriceMinor = spec.priceMinor + taxMinor;
  return {
    ...spec,
    originalPrice: spec.originalPriceMinor / 100,
    price: spec.priceMinor / 100,
    taxMinor,
    totalPriceMinor,
    totalPrice: Number((totalPriceMinor / 100).toFixed(2)),
    features: deriveMercoraSystemBullets(spec.limits, spec.durationDays),
    featureGroups: deriveMercoraSystemGroups(spec.limits, spec.durationDays),
  };
}

export const DEFAULT_SYSTEM_PLAN_PRESETS: SystemPlanTemplate[] = [
  makePreset({
    code: "STARTER_MONTHLY",
    name: "Starter Plan",
    description:
      "Essential B2B directory presence, product showcase, and RFQ lead capture for growing suppliers.",
    label: "Starter",
    isPopular: false,
    originalPriceMinor: 149900,
    priceMinor: 99900,
    currency: "INR",
    billingInterval: "MONTHLY",
    durationDays: 30,
    gstRateBps: 1800,
    displayOrder: 1,
    limits: {
      maxBusinessListings: 2,
      maxProducts: 20,
      maxEnquiriesPerMonth: 50,
      maxContacts: 4,
      featuredListing: false,
      verifiedPriority: false,
      leadInboxAccess: true,
      analyticsAccess: true,
      prioritySupport: false,
    },
  }),
  makePreset({
    code: "PRO_QUARTERLY",
    name: "Business Plan",
    description:
      "Accelerated lead capture, featured directory placement, and priority verification for active suppliers.",
    label: "Most Popular",
    isPopular: true,
    originalPriceMinor: 349900,
    priceMinor: 249900,
    currency: "INR",
    billingInterval: "QUARTERLY",
    durationDays: 90,
    gstRateBps: 1800,
    displayOrder: 2,
    limits: {
      maxBusinessListings: 5,
      maxProducts: 75,
      maxEnquiriesPerMonth: 300,
      maxContacts: 8,
      featuredListing: true,
      verifiedPriority: true,
      leadInboxAccess: true,
      analyticsAccess: true,
      prioritySupport: false,
    },
  }),
  makePreset({
    code: "GROWTH_SIX_MONTHS",
    name: "Growth Plan",
    description:
      "High-volume multi-branch storefront presence, expanded product catalog, and accelerated buyer RFQ pipeline.",
    label: "High Growth",
    isPopular: false,
    originalPriceMinor: 599900,
    priceMinor: 449900,
    currency: "INR",
    billingInterval: "SIX_MONTHS",
    durationDays: 180,
    gstRateBps: 1800,
    displayOrder: 3,
    limits: {
      maxBusinessListings: 10,
      maxProducts: 150,
      maxEnquiriesPerMonth: 750,
      maxContacts: 12,
      featuredListing: true,
      verifiedPriority: true,
      leadInboxAccess: true,
      analyticsAccess: true,
      prioritySupport: false,
    },
  }),
  makePreset({
    code: "ENTERPRISE_YEARLY",
    name: "Enterprise Plan",
    description:
      "Full-scale B2B directory suite with unlimited product catalogs, top featured visibility, and dedicated support.",
    label: "Best Value",
    isPopular: false,
    originalPriceMinor: 1199900,
    priceMinor: 899900,
    currency: "INR",
    billingInterval: "YEARLY",
    durationDays: 365,
    gstRateBps: 1800,
    displayOrder: 4,
    limits: {
      maxBusinessListings: 25,
      maxProducts: -1,
      maxEnquiriesPerMonth: -1,
      maxContacts: -1,
      featuredListing: true,
      verifiedPriority: true,
      leadInboxAccess: true,
      analyticsAccess: true,
      prioritySupport: true,
    },
  }),
];
