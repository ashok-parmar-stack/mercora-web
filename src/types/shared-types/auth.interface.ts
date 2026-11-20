export type PermissionActionType =
  | 'VIEW'
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'VERIFY'
  | 'IMPORT'
  | 'EXPORT'
  | 'PREVIEW'
  | 'SEND_TEST'
  | 'MANAGE_PERMISSION'
  | 'SEARCH'
  | 'DOWNLOAD';

export type PermissionModuleName =
  | 'USERS'
  | 'ROLES'
  | 'PERMISSIONS'
  | 'COMPANIES'
  | 'PRODUCTS'
  | 'TRADE_DATA'
  | 'LEADS'
  | 'EMAIL_TEMPLATES'
  | 'AUDIT_LOGS'
  | 'SETTINGS';

export interface UserPermissionOverride {
  actionCode: string; // e.g., 'COMPANIES.EXPORT'
  effect: 'ALLOW' | 'DENY';
}

export interface AuthUserContext {
  id: string;
  name: string;
  email: string;
  roleCode: string;
  companyId?: string;
  isSuperAdmin: boolean;
  rolePermissions: string[]; // e.g. ['COMPANIES.VIEW', 'COMPANIES.CREATE']
  userOverrides: UserPermissionOverride[];
}
