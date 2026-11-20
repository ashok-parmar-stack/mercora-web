import { Business, BusinessFiltersState } from "../types/business.types";

export function filterBusinesses(businesses: Business[], filters: Partial<BusinessFiltersState>): Business[] {
  return businesses.filter((b) => {
    if (filters.query) {
      const q = filters.query.toLowerCase();
      const matchName = b.name.toLowerCase().includes(q);
      const matchDesc = b.description.toLowerCase().includes(q);
      const matchCat = b.category.toLowerCase().includes(q);
      const matchProd = b.products?.some((p) => p.name.toLowerCase().includes(q));
      if (!matchName && !matchDesc && !matchCat && !matchProd) return false;
    }

    if (filters.category && filters.category !== "all" && filters.category !== "All") {
      if (b.category.toLowerCase() !== filters.category.toLowerCase() && b.industry.toLowerCase() !== filters.category.toLowerCase()) {
        return false;
      }
    }

    if (filters.businessType && filters.businessType !== "all" && filters.businessType !== "All") {
      if (b.businessType.toLowerCase() !== filters.businessType.toLowerCase()) {
        return false;
      }
    }

    if (filters.verifiedOnly && !b.isVerified) {
      return false;
    }

    return true;
  });
}

export function sortBusinesses(businesses: Business[], sortBy: string = "relevance"): Business[] {
  const cloned = [...businesses];
  switch (sortBy) {
    case "rating":
      return cloned.sort((a, b) => b.rating - a.rating);
    case "reviews":
      return cloned.sort((a, b) => b.reviewCount - a.reviewCount);
    case "established":
    case "established_desc":
      return cloned.sort((a, b) => b.establishedYear - a.establishedYear);
    case "established_asc":
      return cloned.sort((a, b) => a.establishedYear - b.establishedYear);
    case "name_asc":
      return cloned.sort((a, b) => a.name.localeCompare(b.name));
    case "name_desc":
      return cloned.sort((a, b) => b.name.localeCompare(a.name));
    default:
      return cloned;
  }
}
