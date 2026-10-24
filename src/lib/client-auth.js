"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";

export const DIEGO_DEFAULT_USER = {
  id: "diego-admin",
  email: "diegocruciani40@gmail.com",
  name: "Diego Cruciani",
  admin: true,
  role: "admin",
  premium: true,
};

const AuthContext = createContext({
  user: DIEGO_DEFAULT_USER,
  status: "authenticated",
  isAdmin: true,
  loginAsDiego: () => {},
  logout: () => {},
  setCurrentUser: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(DIEGO_DEFAULT_USER);
  const [status, setStatus] = useState("authenticated");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("mysetups_user");
      if (stored && stored !== "null") {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.email) {
          setUser(parsed);
          setStatus("authenticated");
          return;
        }
      }
      // Default to Diego on first visit so the admin panel and account work out of the box!
      localStorage.setItem("mysetups_user", JSON.stringify(DIEGO_DEFAULT_USER));
      setUser(DIEGO_DEFAULT_USER);
      setStatus("authenticated");
    } catch {
      setUser(DIEGO_DEFAULT_USER);
      setStatus("authenticated");
    }
  }, []);

  const isAdmin = Boolean(
    user?.admin ||
    user?.role === "admin" ||
    user?.email === "diegocruciani40@gmail.com"
  );

  const loginAsDiego = () => {
    setUser(DIEGO_DEFAULT_USER);
    setStatus("authenticated");
    try {
      localStorage.setItem("mysetups_user", JSON.stringify(DIEGO_DEFAULT_USER));
    } catch {}
  };

  const logout = () => {
    setUser(null);
    setStatus("unauthenticated");
    try {
      localStorage.setItem("mysetups_user", "null");
    } catch {}
  };

  const setCurrentUser = (newUser) => {
    setUser(newUser);
    setStatus(newUser?.email ? "authenticated" : "unauthenticated");
    try {
      localStorage.setItem("mysetups_user", JSON.stringify(newUser));
    } catch {}
  };

  const value = useMemo(
    () => ({
      user,
      status,
      isAdmin,
      loginAsDiego,
      logout,
      setCurrentUser,
    }),
    [user, status, isAdmin]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

// Drop-in compatible replacement for next-auth useSession in React 19
export function useSession() {
  const { user, status } = useContext(AuthContext);
  return {
    data: user ? { user } : null,
    status,
    update: async () => {},
  };
}

// Drop-in replacement for signIn
export async function signIn(provider, options = {}) {
  const email = (options?.email || "").toLowerCase().trim();
  if (!email || email === "diegocruciani40@gmail.com") {
    try {
      localStorage.setItem("mysetups_user", JSON.stringify(DIEGO_DEFAULT_USER));
    } catch {}
    if (typeof window !== "undefined") {
      if (options?.callbackUrl) window.location.href = options.callbackUrl;
      else window.location.reload();
    }
    return { ok: true, status: 200 };
  }

  const regularUser = {
    id: email,
    email,
    name: email.split("@")[0],
    admin: false,
    role: "subscriber",
    premium: true,
  };
  try {
    localStorage.setItem("mysetups_user", JSON.stringify(regularUser));
  } catch {}
  if (typeof window !== "undefined") {
    if (options?.callbackUrl) window.location.href = options.callbackUrl;
    else window.location.reload();
  }
  return { ok: true, status: 200 };
}

// Drop-in replacement for signOut
export async function signOut(options = {}) {
  try {
    localStorage.setItem("mysetups_user", "null");
  } catch {}
  if (typeof window !== "undefined") {
    window.location.href = options?.callbackUrl || "/";
  }
}

export function SessionProvider({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}
