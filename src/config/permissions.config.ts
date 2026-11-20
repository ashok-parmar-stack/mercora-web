export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  VENDOR: "VENDOR",
  BUYER: "BUYER",
  GUEST: "GUEST",
} as const;

export const PERMISSIONS = {
  BUSINESS_CREATE: "business:create",
  BUSINESS_UPDATE: "business:update",
  BUSINESS_DELETE: "business:delete",
  BUSINESS_VERIFY: "business:verify",
  CATEGORY_MANAGE: "category:manage",
  LOCATION_MANAGE: "location:manage",
  ENQUIRY_CREATE: "enquiry:create",
  ENQUIRY_READ: "enquiry:read",
} as const;
