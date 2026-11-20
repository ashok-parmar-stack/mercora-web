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
  placeholders: {
    searchKeyword: "Search business, product or service...",
    selectLocation: "Gujarat, India",
    selectState: "Select State",
    selectCity: "Select City",
    selectCategory: "All Categories",
    inquiryMessage: "Describe your inquiry, quantity, or technical specifications...",
  },
} as const;
