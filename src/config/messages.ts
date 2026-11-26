/**
 * ──────────────────────────────────────────────────────────────────────────
 * MERCORA GLOBAL MESSAGES CONFIGURATION (FRONTEND)
 * Single source of truth for all copy, messages, empty states, and errors.
 * ──────────────────────────────────────────────────────────────────────────
 */

export const MESSAGES = {
  common: {
    loading: "Loading...",
    noData: "No data available.",
    somethingWentWrong: "Something went wrong. Please try again.",
    tryAgain: "Please try again.",
    saveSuccess: "Changes saved successfully.",
    deleteSuccess: "Deleted successfully.",
    updateSuccess: "Updated successfully.",
    createSuccess: "Created successfully.",
    cancel: "Cancel",
    confirm: "Confirm",
    back: "Back",
  },

  businesses: {
    notFound: "Business not found or profile has been deactivated.",
    createSuccess: "Business profile created successfully.",
    updateSuccess: "Business profile updated successfully.",
    deleteSuccess: "Business deleted successfully.",
    noBusinessesFound: "No businesses found matching your criteria. Try adjusting your filters.",
    savedSuccess: "Business added to your saved bookmarks.",
    removedSuccess: "Business removed from your saved bookmarks.",
    emptySaved: "You haven't saved any businesses yet.",
  },

  categories: {
    notFound: "Product category not found.",
    emptyCategories: "No categories available.",
  },

  locations: {
    notFound: "Location not found.",
    emptyLocations: "No locations found in this territory.",
  },

  enquiries: {
    submitSuccess: "Your inquiry has been successfully sent to the supplier.",
    submitError: "Unable to submit inquiry. Please try again.",
    emptyEnquiries: "No enquiries submitted yet.",
  },

  auth: {
    loginSuccess: "Signed in successfully.",
    logoutSuccess: "Signed out successfully.",
    invalidCredentials: "The email or password you entered is incorrect.",
    unauthorized: "Please sign in to access this feature.",
    sessionExpired: "Your session has expired. Please sign in again.",
  },

  validation: {
    required: "This field is required.",
    invalidEmail: "Please enter a valid email address.",
    invalidPhone: "Please enter a valid 10-digit phone number.",
    minLength: (field: string, min: number) => `${field} must be at least ${min} characters.`,
  },
} as const;

export const APP_MESSAGES = {
  empty: {
    noBusinessesFound: {
      title: "No businesses found",
      description: MESSAGES.businesses.noBusinessesFound,
      actionLabel: "Clear all filters",
    },
    noSavedBusinesses: {
      title: "No saved businesses yet",
      description: MESSAGES.businesses.emptySaved,
      actionLabel: "Explore Directory",
    },
    noProducts: {
      title: "No products cataloged",
      description: "This business has not published any specific product catalogs yet.",
    },
    noServices: {
      title: "No service listings available",
      description: "Service details have not been specified for this business.",
    },
    noReviews: {
      title: "No reviews yet",
      description: "Be the first verified buyer to leave a rating and review for this business.",
    },
    noEnquiries: {
      title: "No inquiries submitted",
      description: MESSAGES.enquiries.emptyEnquiries,
      actionLabel: "Browse Suppliers",
    },
  },
  errors: {
    general: MESSAGES.common.somethingWentWrong,
    network: "Unable to reach the server. Please check your internet connection.",
    businessNotFound: MESSAGES.businesses.notFound,
    failedToLoadBusinesses: "Failed to load directory businesses. Please reload the page.",
    invalidSearch: "Please enter a valid search term.",
    submissionFailed: MESSAGES.enquiries.submitError,
    unauthorized: MESSAGES.auth.unauthorized,
  },
  success: {
    savedBusiness: MESSAGES.businesses.savedSuccess,
    removedSavedBusiness: MESSAGES.businesses.removedSuccess,
    inquirySubmitted: MESSAGES.enquiries.submitSuccess,
    linkCopied: "Business profile URL copied to clipboard.",
    filtersCleared: "All directory filters have been reset.",
  },
  confirmations: {
    clearFilters: "Are you sure you want to reset all applied filters?",
    removeBookmark: "Remove this business from your saved list?",
  },
  placeholders: {
    searchKeyword: "Search business, product or service...",
    selectLocation: "Gujarat, India",
    selectState: "Select State",
    selectCity: "Select City",
    selectCategory: "All Categories",
    inquiryMessage: "Describe your inquiry, quantity, or technical specifications...",
  },
} as const;

export type AppMessages = typeof APP_MESSAGES;

/**
 * Converts low-level network or HTTP error objects/strings into plain-language messages.
 */
export function formatUserFriendlyError(
  error: unknown,
  fallback: string = MESSAGES.common.somethingWentWrong
): string {
  const raw =
    typeof error === "string"
      ? error
      : error instanceof Error
      ? error.message
      : "";
  const trimmed = raw.trim();
  if (!trimmed) return fallback;

  const lower = trimmed.toLowerCase();
  if (
    lower.includes("network error") ||
    lower.includes("econnrefused") ||
    lower.includes("failed to fetch") ||
    lower.includes("timeout") ||
    lower.includes("network_error")
  ) {
    return "We couldn't connect to the server right now. Please check your connection and try again.";
  }
  if (/request failed \((5\d\d)\)|status code 5\d\d|internal server error/i.test(trimmed)) {
    return "The service is temporarily unavailable. Please try again in a moment.";
  }
  if (/request failed \((404)\)|status code 404/i.test(trimmed)) {
    return "The requested directory information could not be found.";
  }
  if (/request failed \((401|403)\)|status code (401|403)/i.test(trimmed)) {
    return MESSAGES.auth.unauthorized;
  }
  return trimmed;
}

export interface DirectoryEmptyContext {
  query?: string;
  businessType?: string;
  category?: string;
  location?: string;
  city?: string;
  verifiedOnly?: boolean;
  totalAvailable?: number;
}

/**
 * Generates contextual, user-friendly empty directory state copy explaining active filters.
 */
export function getDirectoryEmptyMessage(ctx: DirectoryEmptyContext): {
  title: string;
  description: string;
} {
  const activeLabels: string[] = [];
  if (ctx.query?.trim()) activeLabels.push(`search "${ctx.query.trim()}"`);
  if (ctx.businessType && ctx.businessType !== "all") {
    activeLabels.push(`category "${ctx.businessType}"`);
  }
  if (ctx.category && ctx.category !== "all") {
    activeLabels.push(`sector "${ctx.category}"`);
  }
  const hasCity = Boolean(ctx.city && ctx.city !== "all");
  const hasState = Boolean(ctx.location && ctx.location !== "all");
  if (hasCity || hasState) {
    const locParts = [
      hasCity ? ctx.city : undefined,
      hasState ? ctx.location : undefined,
    ].filter(Boolean);
    activeLabels.push(`location "${locParts.join(", ")}"`);
  }
  if (ctx.verifiedOnly) activeLabels.push("Verified Only");

  const availableNote =
    typeof ctx.totalAvailable === "number" && ctx.totalAvailable > 0
      ? ` There ${ctx.totalAvailable === 1 ? "is" : "are"} ${ctx.totalAvailable} ${
          ctx.totalAvailable === 1 ? "business" : "businesses"
        } available across all categories.`
      : "";

  if (ctx.query?.trim()) {
    return {
      title: `No businesses match "${ctx.query.trim()}"`,
      description: `We couldn't find any matching listings for your ${activeLabels.join(", ")}. Check the spelling, try a broader keyword, or clear your filters.${availableNote}`,
    };
  }

  if (activeLabels.length === 1 && ctx.businessType && ctx.businessType !== "all") {
    return {
      title: `No ${ctx.businessType} listings available yet`,
      description: `Verified businesses under "${ctx.businessType}" are currently onboarding.${availableNote}`,
    };
  }

  if (activeLabels.length > 0) {
    return {
      title: "No businesses match these filters",
      description: `No listings matched ${activeLabels.join(" + ")}. Try removing one filter or clearing all filters to browse the full directory.${availableNote}`,
    };
  }

  return {
    title: "No Businesses Listed Yet",
    description:
      "The directory does not have any active business listings yet. Register a verified business or check back soon.",
  };
}
