import {
  Business,
  BusinessFacetOption,
  BusinessFiltersState,
} from "../types/business.types";

/**
 * Applies cascading State <-> City business rules:
 * - Selecting a State clears incompatible City unless the selected City already belongs to that State.
 * - Selecting a City when State is "all" automatically aligns State from known facet metadata.
 */
export function resolveLocationFilterUpdate(
  current: Pick<BusinessFiltersState, "location" | "city">,
  update: { location?: string; city?: string },
  cities: BusinessFacetOption[] = []
): Pick<BusinessFiltersState, "location" | "city"> {
  if (update.location !== undefined) {
    const nextLocation = update.location;
    if (nextLocation === "all") {
      return { location: "all", city: update.city ?? "all" };
    }
    const existingCity = update.city ?? current.city;
    const cityMeta = cities.find(
      (c) => c.name.toLowerCase() === existingCity.toLowerCase()
    );
    const keepCity =
      existingCity !== "all" &&
      cityMeta?.state &&
      cityMeta.state.toLowerCase() === nextLocation.toLowerCase();
    return {
      location: nextLocation,
      city: keepCity ? existingCity : "all",
    };
  }

  if (update.city !== undefined) {
    const nextCity = update.city;
    if (nextCity === "all") {
      return { location: current.location, city: "all" };
    }
    const cityMeta = cities.find(
      (c) => c.name.toLowerCase() === nextCity.toLowerCase()
    );
    const inferredState =
      current.location === "all" && cityMeta?.state ? cityMeta.state : current.location;
    return {
      location: inferredState,
      city: nextCity,
    };
  }

  return { location: current.location, city: current.city };
}

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

    if (filters.location && filters.location !== "all") {
      if (b.state.toLowerCase() !== filters.location.toLowerCase()) {
        return false;
      }
    }

    if (filters.city && filters.city !== "all") {
      if (b.city.toLowerCase() !== filters.city.toLowerCase()) {
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
