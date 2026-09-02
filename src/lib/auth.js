import { ADMIN_EMAILS, isAdminEmail } from "@/lib/admin-emails";

const STORAGE_KEY = "mysetups_user";

/** @deprecated Prefer next-auth session; kept for legacy reads */
export function getAuthUser() {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "null");
  } catch {
    return null;
  }
}

export function saveAuthUser(user) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

export function clearAuthUser() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}

export function isAuthenticated() {
  return Boolean(getAuthUser()?.email);
}

export function isAdmin() {
  const user = getAuthUser();
  return Boolean(user?.admin || isAdminEmail(user?.email));
}

export { ADMIN_EMAILS, isAdminEmail };
