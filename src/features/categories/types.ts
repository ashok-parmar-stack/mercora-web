export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  count: number;
  icon?: string;
}

/**
 * Static mock categories removed.
 * Categories are dynamically fetched from the NestJS backend API.
 */
export const POPULAR_CATEGORIES: CategoryItem[] = [];
