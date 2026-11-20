export const businessKeys = {
  all: ["businesses"] as const,
  lists: () => [...businessKeys.all, "list"] as const,
  list: (filters: Record<string, any>) => [...businessKeys.lists(), filters] as const,
  details: () => [...businessKeys.all, "detail"] as const,
  detail: (slugOrId: string) => [...businessKeys.details(), slugOrId] as const,
  featured: () => [...businessKeys.all, "featured"] as const,
  categories: () => [...businessKeys.all, "categories"] as const,
  locations: () => [...businessKeys.all, "locations"] as const,
};
