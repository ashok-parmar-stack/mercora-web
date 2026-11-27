export function formatInrMinor(amountMinor: number | null | undefined): string {
  const rupees = Number(amountMinor || 0) / 100;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: rupees % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(rupees);
}

export function formatInrAmount(amount: number | null | undefined): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: Number(amount || 0) % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(Number(amount || 0));
}

export function formatSubscriptionDate(dateStr?: string | null): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(dateStr?: string | null): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatLimitValue(value: number | null | undefined): string {
  if (value === null || value === undefined) return "—";
  if (value < 0) return "Unlimited";
  return String(value);
}

export function getSubscriptionBadgeVariant(
  status?: string | null
): "success" | "warning" | "danger" | "info" | "neutral" | "brand" {
  switch (String(status || "").toUpperCase()) {
    case "ACTIVE":
      return "success";
    case "PENDING":
      return "info";
    case "PAST_DUE":
      return "warning";
    case "EXPIRED":
    case "CANCELLED":
      return "danger";
    default:
      return "neutral";
  }
}

export function getPaymentBadgeVariant(
  status?: string | null
): "success" | "warning" | "danger" | "info" | "neutral" | "purple" {
  switch (String(status || "").toUpperCase()) {
    case "CAPTURED":
      return "success";
    case "CREATED":
    case "AUTHORIZED":
      return "warning";
    case "FAILED":
      return "danger";
    case "REFUNDED":
    case "PARTIALLY_REFUNDED":
      return "purple";
    default:
      return "neutral";
  }
}

export interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface RazorpayCheckoutOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: { color?: string };
  handler: (response: RazorpaySuccessResponse) => void;
  modal?: {
    ondismiss?: () => void;
    escape?: boolean;
    backdropclose?: boolean;
  };
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayCheckoutOptions) => {
      open: () => void;
      on: (event: string, cb: (res: any) => void) => void;
    };
  }
}

let scriptLoadingPromise: Promise<boolean> | null = null;

export function loadRazorpayCheckoutScript(): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);
  if (window.Razorpay) return Promise.resolve(true);
  if (scriptLoadingPromise) return scriptLoadingPromise;

  scriptLoadingPromise = new Promise<boolean>((resolve) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );
    if (existing) {
      existing.addEventListener("load", () => resolve(Boolean(window.Razorpay)));
      existing.addEventListener("error", () => {
        scriptLoadingPromise = null;
        resolve(false);
      });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(Boolean(window.Razorpay));
    script.onerror = () => {
      scriptLoadingPromise = null;
      resolve(false);
    };
    document.body.appendChild(script);
  });

  return scriptLoadingPromise;
}
