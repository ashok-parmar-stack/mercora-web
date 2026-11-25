import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import { isAbortError } from "@/lib/api-abort";
import { attachSessionRefreshInterceptor } from "@/lib/http/session-refresh";

export class HttpClientError extends Error {
  readonly status?: number;
  readonly code?: string;
  readonly requestId?: string;
  readonly data?: unknown;

  constructor(
    message: string,
    options?: {
      status?: number;
      code?: string;
      requestId?: string;
      data?: unknown;
    }
  ) {
    super(message);
    this.name = "HttpClientError";
    this.status = options?.status;
    this.code = options?.code;
    this.requestId = options?.requestId;
    this.data = options?.data;
  }
}

export function extractErrorMessage(
  error: unknown,
  fallback = "An unexpected request error occurred."
): string {
  if (!error) return fallback;
  if (typeof error === "string") return error;

  if (axios.isAxiosError(error)) {
    const data = error.response?.data as Record<string, any> | undefined;
    const serverMessage = Array.isArray(data?.message)
      ? data.message[0]
      : data?.message || data?.error;
    if (typeof serverMessage === "string" && serverMessage.trim()) {
      return serverMessage;
    }
    if (error.message?.trim()) return error.message;
  }

  if (error instanceof Error && error.message?.trim()) {
    return error.message;
  }

  return fallback;
}

/**
 * Resolves an endpoint path against `/api/...` on the browser (proxied by Next.js
 * rewrites so httpOnly cookies pass automatically) or `INTERNAL_BACKEND_URL` on SSR.
 */
export function resolveApiUrl(endpoint: string): string {
  const clean = endpoint.replace(/^\/+/, "");
  if (typeof window !== "undefined") {
    return `/api/${clean}`;
  }
  const rawBase = process.env.INTERNAL_BACKEND_URL || "http://127.0.0.1:5001";
  const cleanBase = rawBase.replace(/\/api\/?$/, "").replace(/\/+$/, "");
  return `${cleanBase}/api/${clean}`;
}

export function createHttpClient(
  baseURL = "/api",
  timeout = 30000
): AxiosInstance {
  const instance = axios.create({
    baseURL,
    withCredentials: true,
    timeout,
    headers: {
      "Content-Type": "application/json",
    },
  });

  attachSessionRefreshInterceptor(instance);

  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (isAbortError(error)) {
        return Promise.reject(error);
      }

      const data = error.response?.data as Record<string, any> | undefined;
      const status = error.response?.status;
      const requestId =
        (error.response?.headers?.["x-request-id"] as string | undefined) ||
        data?.requestId;

      if (data && typeof data === "object") {
        error.message = extractErrorMessage(error, error.message);
      }

      if (error.response && status && data && typeof data === "object") {
        (error as AxiosError & { requestId?: string }).requestId = requestId;
      }

      return Promise.reject(error);
    }
  );

  return instance;
}

/** Shared client for `/api/*` endpoints (includes SSR URL resolution when called server-side). */
export const apiHttpClient = createHttpClient("/api");

/** Shared client for `/api/v1/*` endpoints. */
export const v1HttpClient = createHttpClient("/api/v1");

/** Shared client for `/api/v1/admin/*` endpoints. */
export const adminV1Client = createHttpClient("/api/v1/admin");

/**
 * Executes a typed request through `apiHttpClient`, resolving `INTERNAL_BACKEND_URL`
 * automatically when invoked inside Next.js Server Components or route handlers.
 */
export async function requestApi<T = unknown>(
  endpoint: string,
  config: AxiosRequestConfig = {}
): Promise<T> {
  const isServer = typeof window === "undefined";
  const target = isServer
    ? resolveApiUrl(endpoint)
    : `/${endpoint.replace(/^\/+/, "")}`;

  try {
    const res = await apiHttpClient.request<T>({
      ...config,
      ...(isServer ? { baseURL: undefined, url: target } : { url: target }),
    });
    return res.data;
  } catch (err) {
    if (isAbortError(err)) throw err;

    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      const data = err.response?.data as Record<string, any> | undefined;
      throw new HttpClientError(
        extractErrorMessage(err, `Request failed (${status || "NETWORK_ERROR"})`),
        {
          status,
          code: err.code,
          requestId: data?.requestId,
          data,
        }
      );
    }
    throw err;
  }
}
