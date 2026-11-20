import * as z from "zod";

/**
 * Centralized Validation Error Messages dictionary
 * Changing a message here updates all forms across the Mercora Admin Console.
 */
export const VALIDATION_MESSAGES = {
  REQUIRED: (field: string) => `${field} is required`,
  MIN_LENGTH: (field: string, min: number) => `${field} must be at least ${min} characters`,
  MAX_LENGTH: (field: string, max: number) => `${field} must be at most ${max} characters`,
  CODE_FORMAT: (field: string = "Code") => `${field} must be uppercase alphanumeric with underscores (e.g. DATA_MANAGER)`,
  INVALID_EMAIL: "Please enter a valid work email address",
  INVALID_SLUG: "Slug must contain only lowercase letters, numbers, and hyphens",
  PASSWORD_MIN: (min: number = 8) => `Password must be at least ${min} characters`,
  SELECT_OPTION: (field: string) => `Please select a valid ${field}`,
  NUMBER_RANGE: (field: string, min: number, max: number) => `${field} must be between ${min} and ${max}`,
};

/**
 * Standard Reusable Zod Field Schemas
 */
export const commonSchemas = {
  name: (fieldName: string = "Name", min: number = 2) =>
    z.string().min(min, VALIDATION_MESSAGES.MIN_LENGTH(fieldName, min)),

  code: (fieldName: string = "Code", min: number = 2) =>
    z
      .string()
      .min(min, VALIDATION_MESSAGES.MIN_LENGTH(fieldName, min))
      .regex(/^[A-Z0-9_]+$/, VALIDATION_MESSAGES.CODE_FORMAT(fieldName)),

  email: z
    .string()
    .min(1, VALIDATION_MESSAGES.REQUIRED("Email"))
    .email(VALIDATION_MESSAGES.INVALID_EMAIL),

  slug: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[a-z0-9-]+$/.test(val),
      VALIDATION_MESSAGES.INVALID_SLUG
    ),

  priority: (min: number = 1, max: number = 999) =>
    z
      .number()
      .min(min, VALIDATION_MESSAGES.NUMBER_RANGE("Priority", min, max))
      .max(max, VALIDATION_MESSAGES.NUMBER_RANGE("Priority", min, max)),

  sortOrder: (min: number = 1, max: number = 999) =>
    z
      .number()
      .min(min, VALIDATION_MESSAGES.NUMBER_RANGE("Sort Order", min, max))
      .max(max, VALIDATION_MESSAGES.NUMBER_RANGE("Sort Order", min, max)),
};
