export interface Status {
  id: string;
  code: string;
  name: string;
  type: string;
  color?: string;
  isDefault?: boolean;
}

export interface Role {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  priority: number;
  isSystem: boolean;
  statusId?: string;
  status?: Status;
  rolePermissions?: RolePermission[];
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface PermissionAction {
  id: string;
  permissionId: string;
  code: string;
  name: string;
  description?: string | null;
  statusId?: string;
  status?: Status;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface Permission {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  statusId?: string;
  status?: Status;
  actions?: PermissionAction[];
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface RolePermission {
  id: string;
  roleId: string;
  permissionActionId: string;
  permissionAction?: PermissionAction;
}

export interface UserPermission {
  id: string;
  userId: string;
  permissionActionId: string;
  effect: 'GRANT' | 'REVOKE';
  reason?: string | null;
  expiresAt?: string | null;
  permissionAction?: PermissionAction;
}

export interface User {
  id: string;
  name?: string | null;
  email: string;
  slug: string;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  roleId: string;
  role?: Role;
  statusId?: string;
  status?: Status;
  userPermissions?: UserPermission[];
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
}

export interface CreateUserPayload {
  name?: string;
  email: string;
  slug?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  roleId: string;
  statusId?: string;
  password?: string;
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  slug?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  roleId?: string;
  statusId?: string;
  password?: string;
}

export interface CreateRolePayload {
  code: string;
  name: string;
  description?: string;
  priority?: number;
  isSystem?: boolean;
}

export interface UpdateRolePayload {
  code?: string;
  name?: string;
  description?: string;
  priority?: number;
  statusId?: string;
}

export interface CreatePermissionPayload {
  code: string;
  name: string;
  description?: string;
  statusId?: string;
}

export interface CreateActionPayload {
  code: string;
  name: string;
  description?: string;
  statusId?: string;
}
