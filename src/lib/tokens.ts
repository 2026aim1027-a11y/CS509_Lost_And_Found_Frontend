import type { AuthTokens } from "@/types/auth";

/**
 * JWT storage. Same keys as the reference frontend (`access_token` /
 * `refresh_token` in localStorage). When the user opts out of "Remember me"
 * the tokens go to sessionStorage instead, so they vanish with the tab.
 */
const ACCESS_KEY = "access_token";
const REFRESH_KEY = "refresh_token";

function stores(): Storage[] {
  if (typeof window === "undefined") return [];
  return [window.localStorage, window.sessionStorage];
}

function read(key: string): string | null {
  for (const store of stores()) {
    const value = store.getItem(key);
    if (value) return value;
  }
  return null;
}

export function getAccessToken(): string | null {
  return read(ACCESS_KEY);
}

export function getRefreshToken(): string | null {
  return read(REFRESH_KEY);
}

export function hasSession(): boolean {
  return Boolean(getAccessToken() || getRefreshToken());
}

/** True when the current session lives in localStorage (i.e. "Remember me" was on). */
function isPersistent(): boolean {
  if (typeof window === "undefined") return true;
  return !window.sessionStorage.getItem(REFRESH_KEY);
}

export function clearTokens(): void {
  for (const store of stores()) {
    store.removeItem(ACCESS_KEY);
    store.removeItem(REFRESH_KEY);
  }
}

export function setTokens(tokens: AuthTokens, remember: boolean = isPersistent()): void {
  if (typeof window === "undefined") return;
  const { localStorage, sessionStorage } = window;
  const [target, other] = remember ? [localStorage, sessionStorage] : [sessionStorage, localStorage];
  target.setItem(ACCESS_KEY, tokens.access);
  target.setItem(REFRESH_KEY, tokens.refresh);
  other.removeItem(ACCESS_KEY);
  other.removeItem(REFRESH_KEY);
}
