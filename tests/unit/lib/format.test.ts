import { describe, it, expect } from "vitest";
import {
  formatCurrencyAmount,
  formatCurrencyCompact,
  formatCurrencyMinor,
  formatInrMinor,
  getCurrencySymbol,
  normalizeCurrencyCode,
} from "@/lib/format";

describe("Dynamic Currency Formatting (@/lib/format)", () => {
  it("normalizes ISO currency codes and falls back safely to INR", () => {
    expect(normalizeCurrencyCode("usd")).toBe("USD");
    expect(normalizeCurrencyCode(" eur ")).toBe("EUR");
    expect(normalizeCurrencyCode(null)).toBe("INR");
    expect(normalizeCurrencyCode("INVALID")).toBe("INR");
  });

  it("resolves currency symbols dynamically", () => {
    expect(getCurrencySymbol("INR")).toBe("₹");
    expect(getCurrencySymbol("USD")).toBe("$");
    expect(getCurrencySymbol("GBP")).toBe("£");
  });

  it("formats minor and major amounts dynamically per currency", () => {
    expect(formatCurrencyMinor(99900, "INR")).toBe("₹999");
    expect(formatCurrencyMinor(2999, "USD")).toBe("$29.99");
    expect(formatCurrencyAmount(1500, "GBP")).toBe("£1,500");
    expect(formatCurrencyAmount(49.5, "USD", { alwaysShowDecimals: true })).toBe("$49.50");
    expect(formatInrMinor(149900)).toBe("₹1,499");
    expect(formatInrMinor(149900, "USD")).toBe("$1,499");
  });

  it("formats compact chart values per currency", () => {
    expect(formatCurrencyCompact(150000, "INR")).toBe("₹1.5L");
    expect(formatCurrencyCompact(2500, "INR")).toBe("₹2.5k");
    expect(formatCurrencyCompact(2500, "USD")).toContain("$2.5");
  });
});
