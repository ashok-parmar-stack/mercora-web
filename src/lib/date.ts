export type DateInput = Date | string | number | null | undefined;

const DATE_ONLY_REGEX = /^(\d{4})-(\d{2})-(\d{2})$/;
const LOCAL_DATETIME_REGEX =
  /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?$/;
const HAS_EXPLICIT_TZ_REGEX = /(?:Z|[+-]\d{2}:?\d{2})$/i;

function isValidTimeZone(timeZone: string): boolean {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone });
    return true;
  } catch {
    return false;
  }
}

export function getUserTimezone(fallback = "UTC"): string {
  try {
    const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (detected && isValidTimeZone(detected)) {
      return detected;
    }
  } catch {
    // Ignore Intl errors in restricted runtimes
  }
  return isValidTimeZone(fallback) ? fallback : "UTC";
}

export function isValidDate(input: DateInput): boolean {
  if (input === null || input === undefined || input === "") return false;
  if (input instanceof Date) return !Number.isNaN(input.getTime());
  if (typeof input === "number") {
    return Number.isFinite(input) && !Number.isNaN(new Date(input).getTime());
  }
  if (typeof input === "string") {
    const trimmed = input.trim();
    if (!trimmed) return false;
    const d = new Date(trimmed);
    return !Number.isNaN(d.getTime());
  }
  return false;
}

export function isUTCDate(input: DateInput): boolean {
  if (typeof input !== "string") return false;
  const trimmed = input.trim();
  if (!HAS_EXPLICIT_TZ_REGEX.test(trimmed)) return false;
  return /(?:Z|[+-]00:?00)$/i.test(trimmed) && isValidDate(trimmed);
}

function getTimeZoneOffsetMs(utcMs: number, timeZone: string): number {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(new Date(utcMs));
  const map: Record<string, number> = {};
  for (const part of parts) {
    if (part.type !== "literal") {
      map[part.type] = Number(part.value);
    }
  }
  const hour = map.hour === 24 ? 0 : map.hour;
  const asUtcMs = Date.UTC(
    map.year,
    (map.month || 1) - 1,
    map.day || 1,
    hour || 0,
    map.minute || 0,
    map.second || 0,
    0
  );
  // Strip sub-second from utcMs for exact minute/second offset comparison
  const utcWholeSecMs = Math.floor(utcMs / 1000) * 1000;
  return asUtcMs - utcWholeSecMs;
}

function wallClockToUtcDate(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  second: number,
  ms: number,
  timeZone: string
): Date | null {
  if (
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31 ||
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59 ||
    second < 0 ||
    second > 59
  ) {
    return null;
  }

  // Validate calendar overflow (e.g. Feb 30)
  const check = new Date(Date.UTC(year, month - 1, day));
  if (
    check.getUTCFullYear() !== year ||
    check.getUTCMonth() !== month - 1 ||
    check.getUTCDate() !== day
  ) {
    return null;
  }

  const targetUtcApprox = Date.UTC(year, month - 1, day, hour, minute, second, 0);
  // Two-pass offset resolution handles DST transitions accurately
  const offset1 = getTimeZoneOffsetMs(targetUtcApprox, timeZone);
  const candidate1 = targetUtcApprox - offset1;
  const offset2 = getTimeZoneOffsetMs(candidate1, timeZone);
  return new Date(targetUtcApprox - offset2 + ms);
}

export function toUTC(
  input: DateInput,
  timeZone?: string
): string | null {
  if (input === null || input === undefined || input === "") return null;

  if (input instanceof Date) {
    return Number.isNaN(input.getTime()) ? null : input.toISOString();
  }

  if (typeof input === "number") {
    if (!Number.isFinite(input)) return null;
    const d = new Date(input);
    return Number.isNaN(d.getTime()) ? null : d.toISOString();
  }

  const trimmed = String(input).trim();
  if (!trimmed) return null;

  if (HAS_EXPLICIT_TZ_REGEX.test(trimmed)) {
    const parsed = new Date(trimmed);
    return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
  }

  const tz = timeZone && isValidTimeZone(timeZone) ? timeZone : getUserTimezone();

  const dateOnlyMatch = DATE_ONLY_REGEX.exec(trimmed);
  if (dateOnlyMatch) {
    const [, y, m, d] = dateOnlyMatch;
    const utcDate = wallClockToUtcDate(
      Number(y),
      Number(m),
      Number(d),
      0,
      0,
      0,
      0,
      tz
    );
    return utcDate ? utcDate.toISOString() : null;
  }

  const localDtMatch = LOCAL_DATETIME_REGEX.exec(trimmed);
  if (localDtMatch) {
    const [, y, m, d, hh, mm, ss = "0", ms = "0"] = localDtMatch;
    const paddedMs = Number(ms.padEnd(3, "0"));
    const utcDate = wallClockToUtcDate(
      Number(y),
      Number(m),
      Number(d),
      Number(hh),
      Number(mm),
      Number(ss),
      paddedMs,
      tz
    );
    return utcDate ? utcDate.toISOString() : null;
  }

  const fallbackParsed = new Date(trimmed);
  return Number.isNaN(fallbackParsed.getTime())
    ? null
    : fallbackParsed.toISOString();
}

export interface LocalDateParts {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  timeZone: string;
  date: Date;
}

export function toLocal(
  input: DateInput,
  timeZone?: string
): LocalDateParts | null {
  const iso = toUTC(input, timeZone);
  if (!iso) return null;
  const date = new Date(iso);
  const tz = timeZone && isValidTimeZone(timeZone) ? timeZone : getUserTimezone();

  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  const map: Record<string, number> = {};
  for (const part of parts) {
    if (part.type !== "literal") {
      map[part.type] = Number(part.value);
    }
  }

  return {
    year: map.year,
    month: map.month,
    day: map.day,
    hour: map.hour === 24 ? 0 : map.hour,
    minute: map.minute,
    second: map.second,
    timeZone: tz,
    date,
  };
}

export interface FormatDateOptions {
  timeZone?: string;
  locale?: string;
  fallback?: string;
  includeTimeZone?: boolean;
}

function parseDisplayDate(input: DateInput): Date | null {
  if (input === null || input === undefined || input === "") return null;
  if (input instanceof Date) return Number.isNaN(input.getTime()) ? null : input;
  if (typeof input === "number") {
    if (!Number.isFinite(input)) return null;
    const d = new Date(input);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  const trimmed = String(input).trim();
  if (!trimmed) return null;
  const d = new Date(trimmed);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function formatLocalDate(
  input: DateInput,
  options?: FormatDateOptions
): string {
  const fallback = options?.fallback ?? "—";
  if (typeof input === "string" && DATE_ONLY_REGEX.test(input.trim())) {
    const [, y, m, d] = DATE_ONLY_REGEX.exec(input.trim())!;
    const dateOnlyUtc = new Date(Date.UTC(Number(y), Number(m) - 1, Number(d)));
    if (Number.isNaN(dateOnlyUtc.getTime())) return fallback;
    return new Intl.DateTimeFormat(options?.locale || "en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    }).format(dateOnlyUtc);
  }

  const date = parseDisplayDate(input);
  if (!date) return fallback;
  const tz =
    options?.timeZone && isValidTimeZone(options.timeZone)
      ? options.timeZone
      : getUserTimezone();

  return new Intl.DateTimeFormat(options?.locale || "en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: tz,
  }).format(date);
}

export function formatLocalDateTime(
  input: DateInput,
  options?: FormatDateOptions
): string {
  const fallback = options?.fallback ?? "—";
  const date = parseDisplayDate(input);
  if (!date) return fallback;
  const tz =
    options?.timeZone && isValidTimeZone(options.timeZone)
      ? options.timeZone
      : getUserTimezone();

  return new Intl.DateTimeFormat(options?.locale || "en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: tz,
    ...(options?.includeTimeZone ? { timeZoneName: "short" } : {}),
  }).format(date);
}

export function formatLocalTime(
  input: DateInput,
  options?: FormatDateOptions
): string {
  const fallback = options?.fallback ?? "—";
  const date = parseDisplayDate(input);
  if (!date) return fallback;
  const tz =
    options?.timeZone && isValidTimeZone(options.timeZone)
      ? options.timeZone
      : getUserTimezone();

  return new Intl.DateTimeFormat(options?.locale || "en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: tz,
    ...(options?.includeTimeZone ? { timeZoneName: "short" } : {}),
  }).format(date);
}

export interface UTCRangeResult {
  fromUtc?: string;
  toUtcExclusive?: string;
  toUtcInclusive?: string;
}

function addDaysToDateOnly(dateOnly: string, days: number): string | null {
  const match = DATE_ONLY_REGEX.exec(dateOnly.trim());
  if (!match) return null;
  const [, y, m, d] = match;
  const dt = new Date(Date.UTC(Number(y), Number(m) - 1, Number(d) + days));
  if (Number.isNaN(dt.getTime())) return null;
  const yy = dt.getUTCFullYear();
  const mm = String(dt.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(dt.getUTCDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
}

export function localDateRangeToUTC(
  fromDate?: string | null,
  toDate?: string | null,
  timeZone?: string
): UTCRangeResult {
  const tz = timeZone && isValidTimeZone(timeZone) ? timeZone : getUserTimezone();
  const result: UTCRangeResult = {};

  if (fromDate && fromDate.trim()) {
    const startUtc = toUTC(fromDate.trim(), tz);
    if (startUtc) result.fromUtc = startUtc;
  }

  if (toDate && toDate.trim()) {
    const trimmedTo = toDate.trim();
    if (DATE_ONLY_REGEX.test(trimmedTo)) {
      const nextDay = addDaysToDateOnly(trimmedTo, 1);
      const nextDayUtc = nextDay ? toUTC(nextDay, tz) : null;
      if (nextDayUtc) {
        result.toUtcExclusive = nextDayUtc;
        result.toUtcInclusive = new Date(
          new Date(nextDayUtc).getTime() - 1
        ).toISOString();
      }
    } else {
      const endUtc = toUTC(trimmedTo, tz);
      if (endUtc) {
        result.toUtcInclusive = endUtc;
        result.toUtcExclusive = new Date(
          new Date(endUtc).getTime() + 1
        ).toISOString();
      }
    }
  }

  return result;
}
