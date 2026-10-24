"use client";

import {
  signIn as nextAuthSignIn,
  signOut as nextAuthSignOut,
  useSession as useNextAuthSession,
} from "next-auth/react";

export function useSession() {
  return useNextAuthSession();
}

export function useAuth() {
  const { data, status, update } = useNextAuthSession();
  const user = data?.user || null;
  const isAdmin = Boolean(user?.admin || user?.role === "admin");

  return {
    user,
    status,
    isAdmin,
    update,
    loginAsDiego: () => nextAuthSignIn("google", { callbackUrl: "/admin" }),
    logout: () => nextAuthSignOut({ callbackUrl: "/" }),
  };
}

export function signIn(provider, options) {
  return nextAuthSignIn(provider, options);
}

export function signOut(options) {
  return nextAuthSignOut(options);
}
