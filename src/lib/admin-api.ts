import axios, { AxiosInstance, AxiosError } from 'axios';
import { AbortableRequestOptions } from './api-abort';
import {
  ApiResponse,
  User,
  Role,
  Permission,
  PermissionAction,
  Status,
  CreateUserPayload,
  UpdateUserPayload,
  CreateRolePayload,
  UpdateRolePayload,
  CreatePermissionPayload,
} from './admin-types';

// Create a standardized Axios client
export const apiClient: AxiosInstance = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Response interceptor for consistent error extraction
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string | string[] }>) => {
    // Preserve cancellation errors intact without turning them into generic user-facing errors
    if (
      axios.isCancel(error) ||
      error.name === 'CanceledError' ||
      error.name === 'AbortError' ||
      error.code === 'ERR_CANCELED'
    ) {
      return Promise.reject(error);
    }

    let message = 'An unexpected API error occurred';
    if (error.response?.data?.message) {
      message = Array.isArray(error.response.data.message)
        ? error.response.data.message.join(', ')
        : error.response.data.message;
    } else if (error.message) {
      message = error.message;
    }
    return Promise.reject(new Error(message));
  }
);

// Helper for extracting typed data
async function request<T>(promise: Promise<{ data: ApiResponse<T> }>): Promise<ApiResponse<T>> {
  const res = await promise;
  return res.data;
}

// ── Users API ──
export async function fetchUsers(
  params?: {
    roleId?: string;
    statusId?: string;
    includeDeleted?: boolean;
    search?: string;
  },
  options?: AbortableRequestOptions,
): Promise<ApiResponse<User[]>> {
  return request<User[]>(
    apiClient.get('/users', {
      params,
      signal: options?.signal,
    }),
  );
}

export async function fetchUserByIdOrSlug(
  idOrSlug: string,
  options?: AbortableRequestOptions,
): Promise<ApiResponse<User>> {
  return request<User>(
    apiClient.get(`/users/${encodeURIComponent(idOrSlug)}`, {
      signal: options?.signal,
    }),
  );
}

export async function createUser(payload: CreateUserPayload): Promise<ApiResponse<User>> {
  const body: any = { ...payload };
  if (!body.name) {
    const combined = [body.firstName, body.lastName].filter(Boolean).join(' ').trim();
    body.name = combined || (body.email ? body.email.split('@')[0] : 'User');
  }
  return request<User>(apiClient.post('/users', body));
}

export async function updateUser(idOrSlug: string, payload: UpdateUserPayload): Promise<ApiResponse<User>> {
  const body: any = { ...payload };
  if (!body.name && (body.firstName || body.lastName)) {
    const combined = [body.firstName, body.lastName].filter(Boolean).join(' ').trim();
    if (combined) body.name = combined;
  }
  return request<User>(apiClient.patch(`/users/${encodeURIComponent(idOrSlug)}`, body));
}

export async function deleteUser(idOrSlug: string, mode: 'soft' | 'hard' = 'soft'): Promise<ApiResponse<null>> {
  return request<null>(apiClient.delete(`/users/${encodeURIComponent(idOrSlug)}`, { params: { mode } }));
}

export async function restoreUser(idOrSlug: string): Promise<ApiResponse<User>> {
  return request<User>(apiClient.post(`/users/${encodeURIComponent(idOrSlug)}/restore`));
}

export async function updateUserRole(idOrSlug: string, roleId: string): Promise<ApiResponse<User>> {
  return request<User>(apiClient.patch(`/users/${encodeURIComponent(idOrSlug)}/role`, { roleId }));
}

export async function fetchUserPermissions(idOrSlug: string): Promise<ApiResponse<any>> {
  return request<any>(apiClient.get(`/users/${encodeURIComponent(idOrSlug)}/permissions`));
}

export async function setUserPermissionOverrides(
  idOrSlug: string,
  overrides: Array<{
    permissionActionId: string;
    effect: 'GRANT' | 'REVOKE';
    reason?: string;
    expiresAt?: string;
  }>
): Promise<ApiResponse<any>> {
  return request<any>(apiClient.post(`/users/${encodeURIComponent(idOrSlug)}/permissions/set`, { overrides }));
}

export async function removeUserPermissionOverride(
  idOrSlug: string,
  permissionActionId: string
): Promise<ApiResponse<any>> {
  return request<any>(apiClient.delete(`/users/${encodeURIComponent(idOrSlug)}/permissions`, {
    data: { permissionActionId },
  }));
}

// ── Roles API ──
export async function fetchRoles(
  params?: {
    statusId?: string;
    includeDeleted?: boolean;
  },
  options?: AbortableRequestOptions,
): Promise<ApiResponse<Role[]>> {
  return request<Role[]>(apiClient.get('/roles', { params, signal: options?.signal }));
}

export async function fetchRoleByIdOrCode(
  idOrCode: string,
  options?: AbortableRequestOptions,
): Promise<ApiResponse<Role>> {
  return request<Role>(apiClient.get(`/roles/${encodeURIComponent(idOrCode)}`, { signal: options?.signal }));
}

export async function createRole(payload: CreateRolePayload): Promise<ApiResponse<Role>> {
  return request<Role>(apiClient.post('/roles', payload));
}

export async function updateRole(idOrCode: string, payload: UpdateRolePayload): Promise<ApiResponse<Role>> {
  return request<Role>(apiClient.patch(`/roles/${encodeURIComponent(idOrCode)}`, payload));
}

export async function deleteRole(idOrCode: string, mode: 'soft' | 'hard' = 'soft'): Promise<ApiResponse<null>> {
  return request<null>(apiClient.delete(`/roles/${encodeURIComponent(idOrCode)}`, { params: { mode } }));
}

export async function restoreRole(idOrCode: string): Promise<ApiResponse<Role>> {
  return request<Role>(apiClient.post(`/roles/${encodeURIComponent(idOrCode)}/restore`));
}

export async function fetchRolePermissions(
  idOrCode: string,
  options?: AbortableRequestOptions,
): Promise<ApiResponse<PermissionAction[]>> {
  return request<PermissionAction[]>(
    apiClient.get(`/roles/${encodeURIComponent(idOrCode)}/permissions`, { signal: options?.signal }),
  );
}

export async function updateRolePermissions(
  idOrCode: string,
  permissionActionIds: string[]
): Promise<ApiResponse<any>> {
  return request<any>(apiClient.put(`/roles/${encodeURIComponent(idOrCode)}/permissions`, { permissionActionIds }));
}

// ── Permissions API ──
export async function fetchPermissions(
  params?: {
    statusId?: string;
    includeDeleted?: boolean;
  },
  options?: AbortableRequestOptions,
): Promise<ApiResponse<Permission[]>> {
  return request<Permission[]>(apiClient.get('/permissions', { params, signal: options?.signal }));
}

export async function fetchAllPermissionActions(
  options?: AbortableRequestOptions,
): Promise<ApiResponse<PermissionAction[]>> {
  return request<PermissionAction[]>(apiClient.get('/permissions/actions', { signal: options?.signal }));
}

export async function fetchPermissionByIdOrCode(
  idOrCode: string,
  options?: AbortableRequestOptions,
): Promise<ApiResponse<Permission>> {
  return request<Permission>(apiClient.get(`/permissions/${encodeURIComponent(idOrCode)}`, { signal: options?.signal }));
}

export async function createPermission(payload: CreatePermissionPayload): Promise<ApiResponse<Permission>> {
  return request<Permission>(apiClient.post('/permissions', payload));
}

export async function updatePermission(
  idOrCode: string,
  payload: Partial<CreatePermissionPayload>
): Promise<ApiResponse<Permission>> {
  return request<Permission>(apiClient.patch(`/permissions/${encodeURIComponent(idOrCode)}`, payload));
}

export async function deletePermission(idOrCode: string, mode: 'soft' | 'hard' = 'soft'): Promise<ApiResponse<null>> {
  return request<null>(apiClient.delete(`/permissions/${encodeURIComponent(idOrCode)}`, { params: { mode } }));
}

export async function restorePermission(idOrCode: string): Promise<ApiResponse<Permission>> {
  return request<Permission>(apiClient.post(`/permissions/${encodeURIComponent(idOrCode)}/restore`));
}

// ── Statuses API ──
export async function fetchStatuses(
  type?: string,
  options?: AbortableRequestOptions,
): Promise<ApiResponse<Status[]>> {
  return request<Status[]>(
    apiClient.get('/statuses', {
      params: type ? { type } : undefined,
      signal: options?.signal,
    }),
  );
}

// ── Health API ──
export async function fetchHealth(): Promise<any> {
  const res = await apiClient.get('/health');
  return res.data;
}

// Export default bundle
export const adminApi = {
  fetchUsers,
  fetchUserByIdOrSlug,
  getUser: fetchUserByIdOrSlug,
  createUser,
  updateUser,
  deleteUser,
  restoreUser,
  updateUserRole,
  fetchUserPermissions,
  setUserPermissionOverrides,
  removeUserPermissionOverride,

  fetchRoles,
  fetchRoleByIdOrCode,
  getRole: fetchRoleByIdOrCode,
  createRole,
  updateRole,
  deleteRole,
  restoreRole,
  fetchRolePermissions,
  updateRolePermissions,

  fetchPermissions,
  fetchPermissionByIdOrCode,
  getPermission: fetchPermissionByIdOrCode,
  fetchAllPermissionActions,
  createPermission,
  updatePermission,
  deletePermission,
  restorePermission,

  fetchStatuses,
  fetchHealth,
};
