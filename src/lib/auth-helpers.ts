export const STAFF_ADMIN_ROLES = [
  'SUPER_ADMIN',
  'ADMIN',
  'DATA_MANAGER',
  'SALES',
] as const;

export type StaffAdminRole = (typeof STAFF_ADMIN_ROLES)[number];

export interface MinimalUserLike {
  name?: string | null;
  email?: string | null;
  role?: { id?: string; name?: string; code?: string } | string | null;
  effectivePermissions?: string[] | null;
}

export function getUserRoleCode(user?: MinimalUserLike | null): string {
  if (!user?.role) return '';
  if (typeof user.role === 'string') return user.role.trim().toUpperCase();
  return String(user.role.code || user.role.name || '')
    .trim()
    .toUpperCase();
}

export function getUserDisplayRole(user?: MinimalUserLike | null): string {
  if (!user?.role) return 'Member';
  if (typeof user.role === 'string') return user.role;
  return user.role.name || user.role.code || 'Member';
}

export function isAdminRole(user?: MinimalUserLike | null): boolean {
  const code = getUserRoleCode(user);
  return (STAFF_ADMIN_ROLES as readonly string[]).includes(code);
}

export function hasPermission(
  user?: MinimalUserLike | null,
  permission?: string,
  options?: { allowAdminFallback?: boolean },
): boolean {
  if (!permission) return true;
  const roleCode = getUserRoleCode(user);
  if (roleCode === 'SUPER_ADMIN') return true;
  if (Array.isArray(user?.effectivePermissions)) {
    return (
      user.effectivePermissions.includes('*') ||
      user.effectivePermissions.includes(permission)
    );
  }
  if (options?.allowAdminFallback) {
    return isAdminRole(user);
  }
  return false;
}

export function getUserInitials(name?: string | null, fallback = 'U'): string {
  const cleaned = String(name || '').trim();
  if (!cleaned) return fallback;
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return cleaned.slice(0, 2).toUpperCase();
}
