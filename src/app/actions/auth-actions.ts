'use server';

import axios from 'axios';
import {
  setAuthCookies,
  clearAuthCookies,
  getServerAuth,
} from '@/lib/server-auth';
import {
  getInternalBackendUrl,
  formatActionError,
  ActionResult,
} from './action-helpers';

export type { ActionResult };

export async function loginServerAction(payload: {
  email: string;
  password: string;
  deviceId?: string;
}): Promise<ActionResult> {
  const backendUrl = getInternalBackendUrl();
  try {
    const res = await axios.post(
      `${backendUrl}/api/v1/auth/login`,
      payload,
      {
        headers: { 'Content-Type': 'application/json' },
        validateStatus: () => true,
      },
    );

    if (res.status >= 400) {
      return {
        success: false,
        error: res.data?.message || 'Invalid credentials or login failed.',
      };
    }

    await setAuthCookies(res.data.accessToken, res.data.refreshToken, res.data.user);

    return {
      success: true,
      data: res.data,
    };
  } catch (err: any) {
    return {
      success: false,
      error: formatActionError(err),
    };
  }
}

export async function registerServerAction(payload: {
  name: string;
  email: string;
  password: string;
}): Promise<ActionResult> {
  const backendUrl = getInternalBackendUrl();
  try {
    const res = await axios.post(
      `${backendUrl}/api/v1/auth/register`,
      payload,
      {
        headers: { 'Content-Type': 'application/json' },
        validateStatus: () => true,
      },
    );

    if (res.status >= 400) {
      return {
        success: false,
        error: res.data?.message || 'Registration failed.',
      };
    }

    return {
      success: true,
      data: res.data,
    };
  } catch (err: any) {
    return {
      success: false,
      error: formatActionError(err),
    };
  }
}

export async function logoutServerAction(): Promise<ActionResult> {
  const backendUrl = getInternalBackendUrl();
  try {
    const { accessToken } = await getServerAuth();
    if (accessToken) {
      await axios.post(
        `${backendUrl}/api/v1/auth/logout`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          validateStatus: () => true,
        },
      ).catch(() => {});
    }
  } finally {
    await clearAuthCookies();
  }

  return { success: true };
}

export async function verifyEmailServerAction(
  token: string,
): Promise<ActionResult> {
  const backendUrl = getInternalBackendUrl();
  try {
    const res = await axios.post(
      `${backendUrl}/api/v1/auth/verify-email`,
      { token },
      {
        headers: { 'Content-Type': 'application/json' },
        validateStatus: () => true,
      },
    );

    if (res.status >= 400) {
      return {
        success: false,
        error: res.data?.message || 'Verification failed.',
      };
    }

    return {
      success: true,
      data: res.data,
    };
  } catch (err: any) {
    return {
      success: false,
      error: formatActionError(err),
    };
  }
}

export async function resendVerificationServerAction(
  email: string,
): Promise<ActionResult> {
  const backendUrl = getInternalBackendUrl();
  try {
    const res = await axios.post(
      `${backendUrl}/api/v1/auth/resend-verification`,
      { email },
      {
        headers: { 'Content-Type': 'application/json' },
        validateStatus: () => true,
      },
    );

    if (res.status >= 400) {
      return {
        success: false,
        error: res.data?.message || 'Failed to resend verification link.',
      };
    }

    return {
      success: true,
      data: res.data,
    };
  } catch (err: any) {
    return {
      success: false,
      error: formatActionError(err),
    };
  }
}

export async function forgotPasswordServerAction(
  email: string,
): Promise<ActionResult> {
  const backendUrl = getInternalBackendUrl();
  try {
    const res = await axios.post(
      `${backendUrl}/api/v1/auth/forgot-password`,
      { email },
      {
        headers: { 'Content-Type': 'application/json' },
        validateStatus: () => true,
      },
    );

    if (res.status >= 400) {
      return {
        success: false,
        error: res.data?.message || 'Failed to request password reset.',
      };
    }

    return {
      success: true,
      data: res.data,
    };
  } catch (err: any) {
    return {
      success: false,
      error: formatActionError(err),
    };
  }
}

export async function resetPasswordServerAction(
  token: string,
  password: string,
): Promise<ActionResult> {
  const backendUrl = getInternalBackendUrl();
  try {
    const res = await axios.post(
      `${backendUrl}/api/v1/auth/reset-password`,
      { token, password },
      {
        headers: { 'Content-Type': 'application/json' },
        validateStatus: () => true,
      },
    );

    if (res.status >= 400) {
      return {
        success: false,
        error: res.data?.message || 'Password reset failed.',
      };
    }

    await clearAuthCookies();

    return {
      success: true,
      data: res.data,
    };
  } catch (err: any) {
    return {
      success: false,
      error: formatActionError(err),
    };
  }
}
