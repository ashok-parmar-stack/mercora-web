const CURRENCY_LOCALE_MAP: Record<string, string> = {
  INR: "en-IN",
  USD: "en-US",
  EUR: "en-IE",
  GBP: "en-GB",
  AED: "en-AE",
  SGD: "en-SG",
  AUD: "en-AU",
  CAD: "en-CA",
  JPY: "ja-JP",
};

export function normalizeCurrencyCode(
  currency?: string | null,
  fallback = "INR"
): string {
  const cleaned = String(currency || "").trim().toUpperCase();
  return /^[A-Z]{3}$/.test(cleaned) ? cleaned : fallback;
}

export function resolveCurrencyLocale(currency?: string | null): string {
  const code = normalizeCurrencyCode(currency);
  return CURRENCY_LOCALE_MAP[code] ?? "en-US";
}

export function getCurrencySymbol(currency?: string | null): string {
  const code = normalizeCurrencyCode(currency);
  try {
    const parts = new Intl.NumberFormat(resolveCurrencyLocale(code), {
      style: "currency",
      currency: code,
      currencyDisplay: "narrowSymbol",
    }).formatToParts(0);
    return parts.find((p) => p.type === "currency")?.value || code;
  } catch {
    return code;
  }
}

export function formatCurrencyAmount(
  amount: number | null | undefined,
  currency?: string | null,
  options?: { locale?: string; alwaysShowDecimals?: boolean }
): string {
  const value = Number(amount || 0);
  const code = normalizeCurrencyCode(currency);
  const locale = options?.locale || resolveCurrencyLocale(code);
  const minFraction = options?.alwaysShowDecimals
    ? 2
    : value % 1 === 0
      ? 0
      : 2;

  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: code,
      minimumFractionDigits: minFraction,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${code} ${value.toFixed(minFraction)}`;
  }
}

export function formatCurrencyMinor(
  amountMinor: number | null | undefined,
  currency?: string | null,
  options?: { locale?: string; alwaysShowDecimals?: boolean }
): string {
  return formatCurrencyAmount(Number(amountMinor || 0) / 100, currency, options);
}

export function formatCurrencyCompact(
  amount: number | null | undefined,
  currency?: string | null
): string {
  const value = Number(amount || 0);
  const code = normalizeCurrencyCode(currency);
  if (code === "INR") {
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    if (value >= 1000) return `₹${(value / 1000).toFixed(1)}k`;
    return `₹${Math.round(value).toLocaleString("en-IN")}`;
  }
  try {
    return new Intl.NumberFormat(resolveCurrencyLocale(code), {
      style: "currency",
      currency: code,
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);
  } catch {
    return formatCurrencyAmount(value, code);
  }
}

export function formatInrMinor(
  amountMinor: number | null | undefined,
  currency?: string | null
): string {
  return formatCurrencyMinor(amountMinor, currency ?? "INR");
}

export function formatInrAmount(
  amount: number | null | undefined,
  options?: { alwaysShowDecimals?: boolean; currency?: string | null }
): string {
  return formatCurrencyAmount(amount, options?.currency ?? "INR", options);
}

export function formatShortDate(dateStr?: string | null): string {
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
