import type { AuthTokens } from "@/types/auth";
import { clearTokens, getAccessToken, getRefreshToken, setTokens } from "@/lib/tokens";

export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

/** Backend error envelope: `{ success: false, code, message, errors }`. */
interface ErrorEnvelope {
  success?: boolean;
  code?: string;
  message?: string;
  detail?: string;
  errors?: Record<string, string[] | string>;
}

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  /** Field-level validation errors keyed by field name. */
  readonly fieldErrors: Record<string, string[]>;

  constructor(message: string, status: number, code = "error", fieldErrors: Record<string, string[]> = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.fieldErrors = fieldErrors;
  }

  /** First error for a field, if the backend reported one. */
  field(name: string): string | undefined {
    return this.fieldErrors[name]?.[0];
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  /** JSON-serialisable body, or a FormData for file uploads. */
  data?: unknown;
  /**
   * Send the stored access token. Turn off for public endpoints: the backend
   * rejects any request carrying an expired token, even on AllowAny routes.
   */
  auth?: boolean;
  /** Retry once with a refreshed access token after a 401. */
  retryOnUnauthorized?: boolean;
}

const NETWORK_ERROR = "Can't reach the server. Check your connection and that the backend is running.";

function normaliseFieldErrors(errors: ErrorEnvelope["errors"]): Record<string, string[]> {
  const result: Record<string, string[]> = {};
  if (!errors) return result;
  for (const [field, value] of Object.entries(errors)) {
    result[field] = Array.isArray(value) ? value.map(String) : [String(value)];
  }
  return result;
}

function toApiError(status: number, body: ErrorEnvelope | null): ApiError {
  const fieldErrors = normaliseFieldErrors(body?.errors);

  // SimpleJWT's invalid-token response reaches us with its details folded into `errors`.
  if (status === 401 && fieldErrors.code?.includes("token_not_valid")) {
    return new ApiError("Your session has expired. Please log in again.", status, "token_not_valid");
  }

  const firstFieldError = Object.values(fieldErrors)[0]?.[0];
  // The envelope's message for validation failures is generic, so prefer the
  // first concrete field error when there is one.
  const message = firstFieldError || body?.message || body?.detail || `Request failed (${status})`;
  return new ApiError(message, status, body?.code, fieldErrors);
}

async function send(endpoint: string, options: Omit<RequestOptions, "retryOnUnauthorized">): Promise<Response> {
  const { data, headers, auth = true, ...config } = options;

  const token = auth ? getAccessToken() : null;
  const isFormData = typeof FormData !== "undefined" && data instanceof FormData;

  const requestHeaders = new Headers(headers);
  if (!isFormData && data !== undefined) requestHeaders.set("Content-Type", "application/json");
  if (token) requestHeaders.set("Authorization", `Bearer ${token}`);

  let body: BodyInit | undefined;
  if (isFormData) body = data;
  else if (data !== undefined) body = JSON.stringify(data);

  try {
    return await fetch(`${API_BASE}${endpoint}`, { ...config, headers: requestHeaders, body });
  } catch {
    throw new ApiError(NETWORK_ERROR, 0, "network_error");
  }
}

// Refresh tokens rotate and the old one is blacklisted, so concurrent 401s
// must share a single refresh call.
let refreshInFlight: Promise<boolean> | null = null;

/** Exchange the refresh token for a new pair. Resolves false when the session is gone. */
export function refreshSession(): Promise<boolean> {
  if (refreshInFlight) return refreshInFlight;

  refreshInFlight = (async () => {
    const refresh = getRefreshToken();
    if (!refresh) return false;
    try {
      const response = await send("/auth/refresh/", { method: "POST", data: { refresh }, auth: false });
      if (!response.ok) {
        // Another tab may have rotated the token while this request was in flight.
        if (getRefreshToken() !== refresh) return true;
        clearTokens();
        return false;
      }
      const tokens = (await response.json()) as Partial<AuthTokens>;
      if (!tokens.access) return false;
      setTokens({ access: tokens.access, refresh: tokens.refresh ?? refresh });
      return true;
    } catch {
      return false;
    }
  })().finally(() => {
    refreshInFlight = null;
  });

  return refreshInFlight;
}

export async function apiClient<T = unknown>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { retryOnUnauthorized = true, ...request } = options;
  const auth = request.auth ?? true;

  let response = await send(endpoint, request);

  if (response.status === 401 && auth && retryOnUnauthorized && getRefreshToken()) {
    if (await refreshSession()) response = await send(endpoint, request);
  }

  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    if (!response.ok) {
      throw new ApiError(
        `The server returned an unexpected error (${response.status}). Please try again.`,
        response.status,
        "server_error",
      );
    }
    return (await response.text()) as T;
  }

  const result = (await response.json()) as T & ErrorEnvelope;
  if (!response.ok) throw toApiError(response.status, result);
  return result;
}

/** Readable message for anything thrown by `apiClient`. */
export function errorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError) return error.message || fallback;
  return fallback;
}

/** Resolve a media path returned by the API (e.g. `/media/profiles/a.jpg`) to an absolute URL. */
export function mediaUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  try {
    return new URL(path, API_BASE).toString();
  } catch {
    return null;
  }
}
