export const APP_CONFIG = {
  appName: process.env.NEXT_PUBLIC_APP_NAME || "Mercora",
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:9000",
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5001/api",
  environment: process.env.NODE_ENV || "development",
  isProduction: process.env.NODE_ENV === "production",
  pagination: {
    defaultPageSize: 12,
    maxPageSize: 50,
  },
  features: {
    enableAnalytics: false,
    enableRealtimeChat: false,
    enableCsvExport: true,
  },
} as const;
