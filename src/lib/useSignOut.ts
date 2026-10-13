"use client";

import { useCallback, useState } from "react";
import { useAuth } from "@/context/AuthContext";

/**
 * Logs out, then loads the home page from scratch.
 *
 * With Cache Components, routes stay mounted (hidden) after client-side navigation, so their
 * state would outlive the session. A full page load is the dependable way to drop every trace
 * of the previous account, which is what the Next.js docs recommend for logout flows.
 */
export function useSignOut() {
  const { logout } = useAuth();
  const [signingOut, setSigningOut] = useState(false);

  const signOut = useCallback(async () => {
    setSigningOut(true);
    await logout();
    // A soft router.push() would keep the hidden routes (and their state) alive; see above.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.href = "/";
  }, [logout]);

  return { signOut, signingOut };
}
