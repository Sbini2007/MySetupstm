import { isAdminEmail } from "./admin-emails";

export const USER_ROLES = {
  ADMIN: "admin",
  EDITOR: "editor",
  VIP: "vip",
  SUBSCRIBER: "subscriber",
  USER: "user",
};

export const ROLE_LABELS = {
  admin: "Amministratore (Admin)",
  editor: "Editor Setup",
  vip: "VIP Member",
  subscriber: "Accesso ai setup",
  user: "Senza accesso ai setup",
};

export const ROLE_BADGES = {
  admin: { label: "ADMIN", color: "bg-red-500/10 text-red-300 border-red-500/30" },
  editor: { label: "EDITOR", color: "bg-amber-500/10 text-amber-300 border-amber-500/30" },
  vip: { label: "VIP", color: "bg-violet-500/15 text-violet-300 border-violet-500/30" },
  subscriber: { label: "SETUP", color: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30" },
  user: { label: "VISITATORE", color: "bg-zinc-800 text-zinc-400 border-zinc-700" },
};

/**
 * Checks if a user has permission to view detailed setup numerical values
 * Setup access is assigned through an authorized account role.
 */
export function canAccessSetups(user) {
  if (!user) return false;
  if (user.admin) return true;
  if (isAdminEmail(user.email)) return true;

  const role = String(user.role || "").toLowerCase();
  if (role === "admin" || role === "editor" || role === "vip" || role === "subscriber") {
    return true;
  }

  // legacy premium flag
  if (Boolean(user.premium)) return true;

  return false;
}

/**
 * Checks if a user can create/edit/duplicate/delete setups in admin dashboard.
 */
export function canManageSetups(user) {
  if (!user) return false;
  if (user.admin) return true;
  if (isAdminEmail(user.email)) return true;

  const role = String(user.role || "").toLowerCase();
  return role === "admin" || role === "editor";
}

/**
 * Checks if a user can manage users and RBAC roles.
 */
export function canManageUsers(user) {
  if (!user) return false;
  if (user.admin) return true;
  return isAdminEmail(user.email);
}

/**
 * Normalizes user role.
 */
export function getUserRole(user) {
  if (!user) return "user";
  if (user.admin || isAdminEmail(user.email)) return "admin";
  if (user.role) return String(user.role).toLowerCase();
  if (user.premium) return "subscriber";
  return "user";
}
