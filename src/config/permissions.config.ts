export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  DATA_MANAGER: "DATA_MANAGER",
  SALES: "SALES",
  CUSTOMER: "CUSTOMER",
  VIEWER: "VIEWER",
} as const;

export type RoleCode = (typeof ROLES)[keyof typeof ROLES];

export const STAFF_ADMIN_ROLES: readonly RoleCode[] = [
  ROLES.SUPER_ADMIN,
  ROLES.ADMIN,
  ROLES.DATA_MANAGER,
  ROLES.SALES,
];

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
