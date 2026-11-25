import { create } from 'zustand';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role?: { id: string; name: string; code: string } | string;
  companyId?: string;
  isEmailVerified: boolean;
  avatarUrl?: string;
}

export interface ActiveSessionInfo {
  id: string;
  deviceId?: string;
  ipAddress?: string;
  expiresAt: string;
  lastActivityAt: string;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  sessionId: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  evictionNotice: string | null;

  setAuth: (payload: {
    user: AuthUser;
    accessToken: string;
    refreshToken: string;
  }) => void;
  updateTokens: (accessToken: string, refreshToken: string) => void;
  updateUser: (user: Partial<AuthUser>) => void;
  setEvictionNotice: (notice: string | null) => void;
  logout: () => void;
  initialize: () => void;
}

const STORAGE_KEY_AUTH = 'mercora_auth_state';

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  sessionId: null,
  isAuthenticated: false,
  isLoading: true,
  evictionNotice: null,

  setAuth: ({ user, accessToken, refreshToken }) => {
    // Store non-sensitive user display state only; tokens reside in memory & httpOnly cookies
    const stateData = {
      user,
      isAuthenticated: true,
      evictionNotice: null,
    };

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(stateData));
        // Cross-tab notification
        const channel = new BroadcastChannel('mercora_auth_channel');
        channel.postMessage({ type: 'LOGIN', user });
        channel.close();
      } catch (e) {
        console.error('Failed to persist auth state:', e);
      }
    }

    set({
      user,
      accessToken,
      refreshToken,
      isAuthenticated: true,
      isLoading: false,
      evictionNotice: null,
    });
  },

  updateTokens: (accessToken, refreshToken) => {
    set({ accessToken, refreshToken });
  },

  updateUser: (partialUser) => {
    const current = get();
    if (!current.user) {
      return;
    }
    const updated = { ...current.user, ...partialUser };

    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY_AUTH);
        if (stored) {
          const parsed = JSON.parse(stored);
          parsed.user = updated;
          delete parsed.accessToken;
          delete parsed.refreshToken;
          localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(parsed));
        } else {
          localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify({ user: updated, isAuthenticated: true }));
        }
        document.cookie = `mercora_user=${encodeURIComponent(JSON.stringify(updated))}; path=/; max-age=604800; SameSite=Lax`;

        // Broadcast user profile update across tabs
        const channel = new BroadcastChannel('mercora_auth_channel');
        channel.postMessage({ type: 'USER_UPDATED', user: updated });
        channel.close();
      } catch (e) {}
    }

    set({ user: updated, isAuthenticated: true });
  },

  setEvictionNotice: (notice) => set({ evictionNotice: notice }),

  logout: () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_KEY_AUTH);
        document.cookie = 'mercora_user=; path=/; max-age=0; SameSite=Lax';
        const channel = new BroadcastChannel('mercora_auth_channel');
        channel.postMessage({ type: 'LOGOUT' });
        channel.close();
      } catch (e) {}
    }

    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      sessionId: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  initialize: () => {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem(STORAGE_KEY_AUTH);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.user) {
          // Strip legacy plaintext JWT tokens if present from older builds
          if (parsed.accessToken || parsed.refreshToken) {
            localStorage.setItem(
              STORAGE_KEY_AUTH,
              JSON.stringify({ user: parsed.user, isAuthenticated: true }),
            );
          }
          set({
            user: parsed.user,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: true,
            isLoading: false,
          });
          return;
        }
      }
    } catch (e) {
      console.warn('Failed parsing stored auth state:', e);
    }

    // Fallback: Check if mercora_user display cookie is present
    try {
      const match = document.cookie.match(/(?:^|;\s*)mercora_user=([^;]+)/);
      if (match) {
        const decoded = decodeURIComponent(match[1]);
        const cookieUser = JSON.parse(decoded);
        if (cookieUser && (cookieUser.id || cookieUser.email)) {
          set({
            user: cookieUser,
            isAuthenticated: true,
            isLoading: false,
          });
          return;
        }
      }
    } catch (e) {
      console.warn('Failed parsing cookie user:', e);
    }

    set({ isLoading: false });
  },
}));
