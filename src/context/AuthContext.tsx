"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { LoginResponse, ProfileResponse, User } from "@/types/auth";
import { ApiError, apiClient, refreshSession } from "@/lib/api";
import { clearTokens, getRefreshToken, hasSession, setTokens } from "@/lib/tokens";

interface AuthContextType {
  user: User | null;
  /** True until the stored session has been checked against the backend. */
  loading: boolean;
  login: (email: string, pass: string, remember?: boolean) => Promise<User>;
  logout: () => Promise<void>;
  setUser: (u: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/** `/users/me/` has no `role`; derive it the way the login endpoint does. */
export function toUser(data: ProfileResponse["data"]): User {
  return { ...data, role: data.role ?? (data.is_staff ? "admin" : "user") };
}

async function fetchProfile(): Promise<User> {
  const res = await apiClient<ProfileResponse>("/users/me/");
  return toUser(res.data);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadUser() {
      let restored: User | null = null;
      if (hasSession()) {
        try {
          restored = await fetchProfile();
        } catch (err) {
          // Drop tokens the backend no longer accepts; keep them if it was only unreachable.
          if (err instanceof ApiError && (err.status === 401 || err.status === 403)) clearTokens();
        }
      }
      if (cancelled) return;
      setUser(restored);
      setLoading(false);
    }

    loadUser();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email: string, pass: string, remember = true) => {
    const res = await apiClient<LoginResponse>("/auth/login/", {
      method: "POST",
      data: { email, password: pass },
      auth: false,
    });
    setTokens({ access: res.access, refresh: res.refresh }, remember);

    // The login payload only carries identity fields, so load the full profile.
    let profile = res.user;
    try {
      profile = await fetchProfile();
    } catch {
      // Fall back to the identity fields from the login response.
    }
    setUser(profile);
    return profile;
  }, []);

  const logout = useCallback(async () => {
    const revoke = () =>
      apiClient("/auth/logout/", {
        method: "POST",
        data: { refresh: getRefreshToken() },
        retryOnUnauthorized: false,
      });

    try {
      await revoke();
    } catch (err) {
      // Access token expired: renew it so the current refresh token still gets blacklisted.
      if (err instanceof ApiError && err.status === 401 && (await refreshSession())) {
        await revoke().catch(() => undefined);
      }
    } finally {
      clearTokens();
      setUser(null);
    }
  }, []);

  const value = useMemo(() => ({ user, loading, login, logout, setUser }), [user, loading, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
