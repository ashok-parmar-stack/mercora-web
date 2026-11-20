export const env = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:6000",
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:9000",
  isProduction: process.env.NODE_ENV === "production",
  isDevelopment: process.env.NODE_ENV === "development",
};
