import { create } from "zustand";
import {
  fetchBusinessCategories,
  fetchBusinessCategoriesTree,
} from "@/features/business-categories/business-category-api";
import { BusinessCategoryItem } from "@/features/business-categories/types";

interface TaxonomyStoreState {
  businessCategories: BusinessCategoryItem[];
  businessCategoryTree: BusinessCategoryItem[];
  isLoading: boolean;
  error: string | null;
  lastFetchedAt: number | null;
  fetchTaxonomy: (force?: boolean) => Promise<void>;
  invalidateTaxonomy: () => void;
  reset: () => void;
}

let inFlightTaxonomyFetch: Promise<void> | null = null;
const TAXONOMY_TTL_MS = 60_000;

export const useTaxonomyStore = create<TaxonomyStoreState>((set, get) => ({
  businessCategories: [],
  businessCategoryTree: [],
  isLoading: false,
  error: null,
  lastFetchedAt: null,

  fetchTaxonomy: async (force = false) => {
    const { businessCategories, lastFetchedAt } = get();
    const isFresh =
      !force &&
      businessCategories.length > 0 &&
      lastFetchedAt !== null &&
      Date.now() - lastFetchedAt < TAXONOMY_TTL_MS;

    if (isFresh) return;
    if (inFlightTaxonomyFetch && !force) return inFlightTaxonomyFetch;

    set({ isLoading: businessCategories.length === 0, error: null });

    let run: Promise<void> | null = null;
    run = (async () => {
      try {
        const [flatData, treeData] = await Promise.all([
          fetchBusinessCategories({ status: "ACTIVE" }),
          fetchBusinessCategoriesTree(),
        ]);

        set({
          businessCategories: flatData,
          businessCategoryTree: treeData,
          isLoading: false,
          error: null,
          lastFetchedAt: Date.now(),
        });
      } catch (err: any) {
        set({
          isLoading: false,
          error: err?.message || "Failed to load business categories.",
        });
      } finally {
        if (inFlightTaxonomyFetch === run) {
          inFlightTaxonomyFetch = null;
        }
      }
    })();

    inFlightTaxonomyFetch = run;
    return run;
  },

  invalidateTaxonomy: () => {
    inFlightTaxonomyFetch = null;
    set({ lastFetchedAt: null });
  },

  reset: () => {
    inFlightTaxonomyFetch = null;
    set({
      businessCategories: [],
      businessCategoryTree: [],
      isLoading: false,
      error: null,
      lastFetchedAt: null,
    });
  },
}));
