export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: string;
  companyId?: string;
}

export function getClientAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
}

export function setClientAuthToken(token: string, remember: boolean = true): void {
  if (typeof window === 'undefined') return;
  if (remember) {
    localStorage.setItem('access_token', token);
  } else {
    sessionStorage.setItem('access_token', token);
  }
}

export function removeClientAuthToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('access_token');
  sessionStorage.removeItem('access_token');
}

export function isUserAuthenticated(): boolean {
  return Boolean(getClientAuthToken());
}
