import { env } from "./env";

export async function serverFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ data: T | null; error: string | null }> {
  try {
    const url = endpoint.startsWith("http")
      ? endpoint
      : `${env.apiUrl}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      next: { revalidate: 60, ...options.next },
    });

    if (!res.ok) {
      return { data: null, error: `Request failed with status ${res.status}` };
    }

    const data = await res.json();
    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err.message || "Failed to fetch from server" };
  }
}
