import { z } from "zod";

export const businessFilterSchema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  businessType: z.string().optional(),
  verifiedOnly: z.boolean().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(12),
  sortBy: z.enum(["relevance", "rating", "reviews", "established"]).default("relevance"),
});

export const enquirySchema = z.object({
  businessId: z.string().min(1, "Business is required"),
  businessName: z.string().min(1, "Business name is required"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Please enter a valid 10-digit phone number"),
  email: z.string().email("Please enter a valid email").optional().or(z.literal("")),
  company: z.string().optional(),
  city: z.string().optional(),
  requirement: z.string().min(10, "Requirement must be at least 10 characters"),
  productName: z.string().optional(),
});

export type BusinessFilterParams = z.infer<typeof businessFilterSchema>;
export type EnquiryFormData = z.infer<typeof enquirySchema>;
