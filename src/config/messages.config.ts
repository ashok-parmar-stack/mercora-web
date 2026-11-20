/**
 * ──────────────────────────────────────────────────────────────────────────
 * MERCORA GLOBAL MESSAGES & LOCALIZATION CONFIGURATION
 * Single source of truth for all UI copy, empty states, error strings,
 * confirmations, and user feedback across the entire platform.
 * ──────────────────────────────────────────────────────────────────────────
 */

export const APP_MESSAGES = {
  // Empty states
  empty: {
    noBusinessesFound: {
      title: "No businesses found",
      description: "We couldn't find any businesses matching your search criteria. Try adjusting your filters or search keywords.",
      actionLabel: "Clear all filters",
    },
    noSavedBusinesses: {
      title: "No saved businesses yet",
      description: "Bookmark verified businesses to easily access their profiles, catalogs, and contact details later.",
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
      description: "You haven't sent any business inquiries or RFQs yet.",
      actionLabel: "Browse Suppliers",
    },
  },

  // Error states
  errors: {
    general: "An unexpected error occurred. Please try again later.",
    network: "Unable to reach the server. Please check your internet connection.",
    businessNotFound: "The requested business profile could not be found or has been deactivated.",
    failedToLoadBusinesses: "Failed to load directory businesses. Please reload the page.",
    invalidSearch: "Please enter a valid search term.",
    submissionFailed: "Unable to submit your inquiry. Please try again.",
    unauthorized: "Please sign in to access this feature.",
  },

  // Success notifications
  success: {
    savedBusiness: "Business saved to your bookmarks.",
    removedSavedBusiness: "Business removed from your bookmarks.",
    inquirySubmitted: "Your inquiry has been successfully sent to the business.",
    linkCopied: "Business profile URL copied to clipboard.",
    filtersCleared: "All directory filters have been reset.",
  },

  // Feedback and confirmations
  confirmations: {
    clearFilters: "Are you sure you want to reset all applied filters?",
    removeBookmark: "Remove this business from your saved list?",
  },

  // Form placeholders & tooltips
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
