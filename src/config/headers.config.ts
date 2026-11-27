/**
 * ──────────────────────────────────────────────────────────────────────────
 * MERCORA GLOBAL HEADERS & DESCRIPTIONS CONFIGURATION
 * Single source of truth for page titles, hero headers, meta tags,
 * breadcrumbs, and section descriptions across the platform.
 * ──────────────────────────────────────────────────────────────────────────
 */

export const APP_HEADERS = {
  directory: {
    hero: {
      badge: "Trusted Business Directory For Your Growth",
      title: "Find Verified Businesses",
      subtitle: "Discover trusted manufacturers, suppliers, wholesalers and service providers across India.",
    },
    meta: {
      title: "Mercora Business Directory — Discover Verified Manufacturers & Suppliers",
      description: "Search 8,000+ verified Indian manufacturers, suppliers, exporters and wholesalers with direct contact info and company specs.",
    },
    resultsHeading: "Businesses Found",
    filtersHeading: "Filter Results",
  },

  businessDetails: {
    tabs: {
      overview: "Overview",
      products: "Products & Services",
      contact: "Contact Info",
      location: "Location",
      reviews: "Reviews",
    },
    sections: {
      overview: "Business Overview",
      productsAndServices: "Products & Services",
      contactInfo: "Contact Information",
      businessDetails: "Business Details",
      verificationSource: "Business Source & Verification",
      reviews: "Ratings & Customer Reviews",
    },
    actions: {
      contactBusiness: "Contact Business",
      saveBusiness: "Save Business",
      saved: "Saved",
      share: "Share",
      getDirections: "Get Directions",
      viewAllProducts: "View All Products",
    },
  },

  navigation: {
    brandName: "Mercora",
    brandTagline: "Deterministic Master Data & B2B Intelligence",
    links: [
      { label: "Platform", href: "/#platform" },
      { label: "How it works", href: "/#how-it-works" },
      { label: "Businesses", href: "/businesses" },
      { label: "Pricing", href: "/pricing" },
    ],
    customerLinks: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Subscription", href: "/subscription" },
      { label: "Saved Businesses", href: "/saved-businesses" },
      { label: "My Enquiries", href: "/enquiries" },
      { label: "Profile", href: "/profile" },
    ],
    auth: {
      login: "Login",
      register: "Register",
      logout: "Sign Out",
    },
  },

  footer: {
    aboutText: "India's premier verified B2B marketplace and business intelligence platform connecting industrial buyers with authentic manufacturers and suppliers.",
    copyright: `© ${new Date().getFullYear()} Mercora. All rights reserved.`,
  },
} as const;

export type AppHeaders = typeof APP_HEADERS;
