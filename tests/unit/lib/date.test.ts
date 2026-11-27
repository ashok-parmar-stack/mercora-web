import { describe, it, expect } from "vitest";
import {
  formatLocalDate,
  formatLocalDateTime,
  formatLocalTime,
  getUserTimezone,
  isUTCDate,
  isValidDate,
  localDateRangeToUTC,
  toLocal,
  toUTC,
} from "@/lib/date";

describe("Centralized UTC <-> Local Timezone Utilities (@/lib/date)", () => {
  it("1-4. converts local datetime to UTC across Asia/Kolkata, UTC, America/New_York, and Europe/London", () => {
    // 2026-11-27T10:30 in IST (+05:30) -> 05:00:00.000Z
    expect(toUTC("2026-11-27T10:30", "Asia/Kolkata")).toBe("2026-11-27T05:00:00.000Z");
    // 2026-11-27T10:30 in UTC -> 10:30:00.000Z
    expect(toUTC("2026-11-27T10:30", "UTC")).toBe("2026-11-27T10:30:00.000Z");
    // 2026-11-27T10:30 in America/New_York (EST, -05:00) -> 15:30:00.000Z
    expect(toUTC("2026-11-27T10:30", "America/New_York")).toBe("2026-11-27T15:30:00.000Z");
    // 2026-11-27T10:30 in Europe/London (GMT, +00:00) -> 10:30:00.000Z
    expect(toUTC("2026-11-27T10:30", "Europe/London")).toBe("2026-11-27T10:30:00.000Z");
  });

  it("5-6. converts UTC timestamps to local wall-clock parts and formatted strings", () => {
    const utcIso = "2026-11-27T05:00:00.000Z";
    const ist = toLocal(utcIso, "Asia/Kolkata");
    expect(ist).not.toBeNull();
    expect(ist?.year).toBe(2026);
    expect(ist?.month).toBe(11);
    expect(ist?.day).toBe(27);
    expect(ist?.hour).toBe(10);
    expect(ist?.minute).toBe(30);

    expect(formatLocalDate(utcIso, { timeZone: "Asia/Kolkata" })).toBe("27 Nov 2026");
    expect(formatLocalTime(utcIso, { timeZone: "Asia/Kolkata" }).toLowerCase()).toContain("10:30");
    expect(formatLocalDateTime(utcIso, { timeZone: "UTC" })).toContain("27 Nov 2026");
  });

  it("7. preserves date-only YYYY-MM-DD strings without shifting day across timezones", () => {
    expect(formatLocalDate("2026-11-27", { timeZone: "America/New_York" })).toBe("27 Nov 2026");
    expect(formatLocalDate("2026-11-27", { timeZone: "Asia/Kolkata" })).toBe("27 Nov 2026");
  });

  it("8-9. computes UTC date-range boundaries and handles midnight boundaries cleanly", () => {
    // India: 2026-11-27 00:00:00 IST = 2026-11-26T18:30:00.000Z
    // Next day 00:00:00 IST = 2026-11-27T18:30:00.000Z
    const istRange = localDateRangeToUTC("2026-11-27", "2026-11-27", "Asia/Kolkata");
    expect(istRange.fromUtc).toBe("2026-11-26T18:30:00.000Z");
    expect(istRange.toUtcExclusive).toBe("2026-11-27T18:30:00.000Z");
    expect(istRange.toUtcInclusive).toBe("2026-11-27T18:29:59.999Z");

    // 2026-11-26T18:30:00.000Z in IST is Nov 27 00:00 AM
    const midnightIst = toLocal("2026-11-26T18:30:00.000Z", "Asia/Kolkata");
    expect(midnightIst?.day).toBe(27);
    expect(midnightIst?.hour).toBe(0);

    // 2026-11-26T18:29:59.000Z in IST is still Nov 26 23:59
    const beforeMidnightIst = toLocal("2026-11-26T18:29:59.000Z", "Asia/Kolkata");
    expect(beforeMidnightIst?.day).toBe(26);
    expect(beforeMidnightIst?.hour).toBe(23);
  });

  it("10. handles daylight saving transitions (America/New_York & Europe/London)", () => {
    // US EDT (UTC-4) on July 15 vs EST (UTC-5) on Nov 27
    expect(toUTC("2026-07-15T10:00", "America/New_York")).toBe("2026-07-15T14:00:00.000Z");
    expect(toUTC("2026-11-27T10:00", "America/New_York")).toBe("2026-11-27T15:00:00.000Z");

    // Spring forward day in New York (2026-03-08): 23-hour local day
    const dstDayRange = localDateRangeToUTC("2026-03-08", "2026-03-08", "America/New_York");
    expect(dstDayRange.fromUtc).toBe("2026-03-08T05:00:00.000Z");
    expect(dstDayRange.toUtcExclusive).toBe("2026-03-09T04:00:00.000Z");

    // UK BST (UTC+1) on July 15 vs GMT (UTC+0) on Nov 27
    expect(toUTC("2026-07-15T10:00", "Europe/London")).toBe("2026-07-15T09:00:00.000Z");
    expect(toUTC("2026-11-27T10:00", "Europe/London")).toBe("2026-11-27T10:00:00.000Z");
  });

  it("11-12. handles invalid, null, and undefined date values safely", () => {
    expect(isValidDate(null)).toBe(false);
    expect(isValidDate(undefined)).toBe(false);
    expect(isValidDate("")).toBe(false);
    expect(isValidDate("not-a-date")).toBe(false);
    expect(isValidDate(new Date("invalid"))).toBe(false);

    expect(toUTC(null)).toBeNull();
    expect(toUTC(undefined)).toBeNull();
    expect(toUTC("2026-02-30T10:00", "Asia/Kolkata")).toBeNull();
    expect(toLocal("invalid")).toBeNull();
    expect(formatLocalDate(null)).toBe("—");
    expect(formatLocalDateTime(undefined, { fallback: "N/A" })).toBe("N/A");
    expect(formatLocalTime("bad-input")).toBe("—");
  });

  it("13-15. validates UTC payloads, user timezone detection, and ISO-8601 format", () => {
    const detected = getUserTimezone();
    expect(typeof detected).toBe("string");
    expect(detected.length).toBeGreaterThan(0);

    const payloadTs = toUTC("2026-11-27T10:30", "Asia/Kolkata");
    expect(payloadTs).toBe("2026-11-27T05:00:00.000Z");
    expect(isUTCDate(payloadTs)).toBe(true);
    expect(isUTCDate("2026-11-27T10:30")).toBe(false);
    expect(isUTCDate("2026-11-27T10:30:00+05:30")).toBe(false);
  });
});
