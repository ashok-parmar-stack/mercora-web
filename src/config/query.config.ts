export const QUERY_CONFIG = {
  defaultStaleTime: 60 * 1000, // 1 minute
  directoryStaleTime: 5 * 60 * 1000, // 5 minutes
  detailStaleTime: 10 * 60 * 1000, // 10 minutes
  refetchOnWindowFocus: false,
  retryCount: 1,
} as const;
