import type { Metadata } from "next";

export const PAGE_METADATA = {
  home: {
    title: "Mercora — Discover Verified Manufacturers & Suppliers",
    description: "Explore verified Indian manufacturers, suppliers, exporters and service providers across all major industrial clusters.",
  },
  businesses: {
    title: "Explore Verified Businesses — B2B Directory",
    description: "Search 8,000+ verified Indian manufacturers, suppliers, wholesalers, and exporters with direct contact details and catalog specifications.",
  },
  savedBusinesses: {
    title: "Saved Businesses — Bookmarks",
    description: "Manage your bookmarked manufacturers, suppliers, and verified corporate vendor profiles.",
  },
  categories: {
    title: "Product Categories & Industrial Sectors",
    description: "Browse verified suppliers classified by industrial machinery, textiles, chemicals, ceramics, and healthcare sectors.",
  },
  locations: {
    title: "Industrial Clusters & Locations across India",
    description: "Discover verified manufacturers by industrial hubs including Ahmedabad, Surat, Morbi, Vadodara, and Rajkot.",
  },
  enquiries: {
    title: "My Inquiries & RFQs",
    description: "Track the status of your commercial quotes, requests for proposals, and vendor responses.",
  },
  customerDashboard: {
    title: "Customer Dashboard — Mercora",
    description: "Manage your supplier interactions, bookmarked businesses, and active procurement requirements.",
  },
  login: {
    title: "Sign In — Mercora Account",
    description: "Access your verified buyer or seller account on the Mercora B2B platform.",
  },
  register: {
    title: "Register Your Business — Mercora",
    description: "Join India's premier B2B marketplace to publish your catalogs and connect with industrial buyers.",
  },
  profile: {
    title: "Account Profile & Settings",
    description: "Manage your user profile, security credentials, and company preferences.",
  },
  pricing: {
    title: "Subscription Plans & Pricing — Mercora",
    description: "Compare Starter, Pro, and Enterprise business subscription plans with transparent INR pricing and GST invoicing.",
  },
  subscription: {
    title: "Subscription & Billing — Mercora",
    description: "Manage your active business subscription plan, renewals, upgrades, entitlements, and billing history.",
  },
  checkout: {
    title: "Subscription Checkout — Mercora",
    description: "Review your selected business plan, GST breakdown, and complete secure payment via Razorpay.",
  },
  paymentHistory: {
    title: "Payment History & Invoices — Mercora",
    description: "View payment transactions, download GST tax invoices, and track subscription billing status.",
  },
  paymentResult: {
    title: "Payment Verification & Status — Mercora",
    description: "Verify Razorpay payment confirmation and view your updated business subscription activation status.",
  },
} as const;

export function buildPageMetadata(key: keyof typeof PAGE_METADATA, customTitle?: string): Metadata {
  const item = PAGE_METADATA[key];
  return {
    title: customTitle ? `${customTitle} | Mercora` : item.title,
    description: item.description,
    openGraph: {
      title: customTitle || item.title,
      description: item.description,
      siteName: "Mercora",
    },
  };
}
