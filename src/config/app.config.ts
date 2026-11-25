export const APP_CONFIG = {
  appName: process.env.NEXT_PUBLIC_APP_NAME || "Mercora",
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:9000",
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5001/api",
  environment: process.env.NODE_ENV || "development",
  isProduction: process.env.NODE_ENV === "production",
  pagination: {
    defaultPageSize: 12,
    adminDefaultPageSize: 10,
    maxPageSize: 50,
  },
  upload: {
    maxFileSizeMB: 5,
    maxFileSizeBytes: 5 * 1024 * 1024,
    acceptedImageMimeTypes: [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ] as const,
  },
  features: {
    enableAnalytics: false,
    enableRealtimeChat: false,
    enableCsvExport: true,
  },
} as const;
