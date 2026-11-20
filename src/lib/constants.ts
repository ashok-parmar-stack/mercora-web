export const DEFAULT_PAGE_SIZE = 12;
export const MAX_PAGE_SIZE = 50;

export const BUSINESS_TYPES = [
  "Manufacturer",
  "Supplier",
  "Wholesaler",
  "Distributor",
  "Exporter",
  "Service Provider",
] as const;

export const SORT_OPTIONS = [
  { value: "relevance", label: "Relevance" },
  { value: "rating", label: "Highest Rated" },
  { value: "name_asc", label: "Name (A-Z)" },
  { value: "name_desc", label: "Name (Z-A)" },
  { value: "established_desc", label: "Newly Established" },
  { value: "established_asc", label: "Oldest Established" },
] as const;
