import fs from "fs";
import path from "path";
import { isAdminEmail } from "@/lib/admin-emails";
import { hashPassword, verifyPassword } from "@/lib/passwords";

const DATA_DIR = path.join(process.cwd(), "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

function readJson(file, fallback) {
  try {
    if (!fs.existsSync(file)) return fallback;
    const raw = fs.readFileSync(file, "utf8");
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeJson(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf8");
}

export function saveServerUsers(users) {
  writeJson(USERS_FILE, users);
}

const MAX_NAME_LEN = 80;
const MAX_AVATAR_BYTES = 380_000;

function sanitizeStoredImage(value) {
  if (typeof value !== "string") return "";
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (trimmed.length > 2_000_000) return "";
  if (trimmed.startsWith("data:image/") && Buffer.byteLength(trimmed, "utf8") > MAX_AVATAR_BYTES) {
    return "";
  }
  return trimmed;
}

export function getServerUsers() {
  const users = readJson(USERS_FILE, []);
  if (!Array.isArray(users)) return [];
  return users.map((user) => ({
    ...user,
    image: sanitizeStoredImage(user?.image),
    oauthImage: sanitizeStoredImage(user?.oauthImage),
  }));
}

/**
 * Merge OAuth profile into the user list without downgrading premium/admin unless explicitly set.
 */
export function upsertServerUser(partial) {
  if (!partial?.email) return getServerUsers();
  const users = getServerUsers();
  const email = String(partial.email).toLowerCase();
  const idx = users.findIndex((u) => String(u.email || "").toLowerCase() === email);
  const adminFromList = isAdminEmail(partial.email);

  if (idx >= 0) {
    const prev = users[idx];
    const role = partial.role !== undefined ? partial.role : prev.role || (prev.admin ? "admin" : prev.premium ? "subscriber" : "user");
    users[idx] = {
      ...prev,
      ...partial,
      email: partial.email,
      role: adminFromList ? "admin" : role,
      premium: partial.premium !== undefined ? partial.premium : (role !== "user" ? true : prev.premium),
      admin: partial.admin !== undefined ? partial.admin : (adminFromList || role === "admin" || prev.admin),
      createdAt: prev.createdAt || partial.createdAt || new Date().toISOString(),
      password: partial.password || prev.password,
      image: sanitizeStoredImage(partial.image ?? prev.image),
      oauthImage: sanitizeStoredImage(partial.oauthImage ?? prev.oauthImage ?? partial.image ?? prev.image),
    };
  } else {
    const role = adminFromList ? "admin" : partial.role || (partial.admin ? "admin" : partial.premium ? "subscriber" : "user");
    users.unshift({
      id: Date.now(),
      role,
      premium: partial.premium ?? (role !== "user"),
      admin: partial.admin ?? (adminFromList || role === "admin"),
      name: partial.name || partial.email.split("@")[0],
      email: partial.email,
      createdAt: partial.createdAt || new Date().toISOString(),
      password: partial.password || null,
      image: sanitizeStoredImage(partial.image),
      oauthName: partial.oauthName ?? partial.name,
      oauthImage: sanitizeStoredImage(partial.oauthImage ?? partial.image),
      provider: partial.provider || "credentials",
    });
  }
  saveServerUsers(users);
  return users;
}

export async function registerServerUser({ name, email, password }) {
  if (!email) throw new Error("Email richiesta");
  const normalizedEmail = String(email).trim().toLowerCase();
  const existing = getServerUserByEmail(normalizedEmail);
  if (existing) {
    throw new Error("Un account con questa email esiste già");
  }

  const adminFromList = isAdminEmail(normalizedEmail);
  const role = adminFromList ? "admin" : "user";
  const newUser = {
    id: Date.now(),
    name: (name && String(name).trim()) || normalizedEmail.split("@")[0],
    email: normalizedEmail,
    password: password ? await hashPassword(password) : "",
    role,
    premium: adminFromList,
    admin: adminFromList,
    createdAt: new Date().toISOString(),
    provider: "server-credentials",
    image: "",
  };

  const users = getServerUsers();
  users.unshift(newUser);
  saveServerUsers(users);
  return newUser;
}

export async function setServerUserPassword(email, password) {
  const users = getServerUsers();
  const lower = String(email || "").trim().toLowerCase();
  const index = users.findIndex((user) => String(user.email || "").toLowerCase() === lower);
  if (index === -1) return false;
  users[index] = { ...users[index], password: await hashPassword(password) };
  saveServerUsers(users);
  return true;
}

export async function authenticateServerUser(email, password) {
  const user = getServerUserByEmail(email);
  if (!user?.password) return null;
  const result = await verifyPassword(password, user.password);
  if (!result.valid) return null;
  if (result.needsRehash) {
    await setServerUserPassword(user.email, password);
  }
  return getServerUserByEmail(user.email);
}

export function deleteServerUser(email) {
  if (!email) return false;
  const lower = String(email).trim().toLowerCase();
  const users = getServerUsers();
  const next = users.filter((u) => String(u.email || "").toLowerCase() !== lower);
  if (next.length !== users.length) {
    saveServerUsers(next);
    return true;
  }
  return false;
}

export function setServerUserRole(email, role) {
  const users = getServerUsers();
  const lower = String(email || "").toLowerCase();
  const adminFromList = isAdminEmail(email);
  const targetRole = adminFromList ? "admin" : role;
  const isPrivileged = targetRole === "admin" || targetRole === "editor" || targetRole === "vip" || targetRole === "subscriber";

  const idx = users.findIndex((u) => String(u.email || "").toLowerCase() === lower);
  if (idx === -1) {
    upsertServerUser({
      email,
      name: String(email).split("@")[0],
      role: targetRole,
      premium: isPrivileged,
      admin: targetRole === "admin",
    });
    return getServerUsers();
  }

  const next = users.map((u) => {
    if (String(u.email || "").toLowerCase() !== lower) return u;
    return {
      ...u,
      role: targetRole,
      premium: isPrivileged,
      admin: targetRole === "admin" || adminFromList,
    };
  });
  saveServerUsers(next);
  return next;
}

export function setServerUserPremium(email, premium) {
  const users = getServerUsers();
  const lower = String(email || "").toLowerCase();
  const idx = users.findIndex((u) => String(u.email || "").toLowerCase() === lower);
  if (idx === -1) {
    upsertServerUser({ email, name: String(email).split("@")[0], premium, role: premium ? "subscriber" : "user" });
    return getServerUsers();
  }
  const next = users.map((u) => {
    if (String(u.email || "").toLowerCase() !== lower) return u;
    const role = premium ? (u.role === "admin" ? "admin" : u.role === "vip" ? "vip" : "subscriber") : "user";
    return { ...u, premium, role };
  });
  saveServerUsers(next);
  return next;
}

export function setServerUserAdminFlag(email, admin) {
  const users = getServerUsers();
  const lower = String(email || "").toLowerCase();
  const idx = users.findIndex((u) => String(u.email || "").toLowerCase() === lower);
  if (idx === -1) {
    upsertServerUser({ email, name: String(email).split("@")[0], admin, role: admin ? "admin" : "user", premium: admin });
    return getServerUsers();
  }
  const next = users.map((u) => {
    if (String(u.email || "").toLowerCase() !== lower) return u;
    const role = admin ? "admin" : (u.premium ? "subscriber" : "user");
    return { ...u, admin, role };
  });
  saveServerUsers(next);
  return next;
}

export function getServerUserByEmail(email) {
  if (!email) return null;
  const lower = String(email).toLowerCase();
  return getServerUsers().find((u) => String(u.email || "").toLowerCase() === lower) || null;
}

/** After first login: refresh OAuth snapshot without overwriting custom name/image. */
export function patchServerUserOAuth(email, { oauthName, oauthImage, provider }) {
  const users = getServerUsers();
  const lower = String(email || "").toLowerCase();
  const idx = users.findIndex((u) => String(u.email || "").toLowerCase() === lower);
  if (idx === -1) return getServerUsers();
  const prev = users[idx];
  users[idx] = {
    ...prev,
    oauthName: oauthName ?? prev.oauthName ?? prev.name,
    oauthImage: sanitizeStoredImage(oauthImage ?? prev.oauthImage ?? prev.image),
    provider: provider ?? prev.provider,
  };
  saveServerUsers(users);
  return users;
}

/**
 * Public display name + avatar (URL or data:image/...;base64,...).
 * Empty image string → clear custom avatar (fallback to OAuth in JWT).
 */
export function updateServerUserProfile(email, { name, image }) {
  const users = getServerUsers();
  const lower = String(email || "").toLowerCase();
  const idx = users.findIndex((u) => String(u.email || "").toLowerCase() === lower);
  if (idx === -1) return { ok: false, error: "User not found" };

  const next = { ...users[idx] };
  if (typeof name === "string") {
    const trimmed = name.trim().slice(0, MAX_NAME_LEN);
    next.name = trimmed || next.email?.split("@")[0] || "User";
  }
  if (image !== undefined) {
    const trimmed = typeof image === "string" ? image.trim() : "";
    const sanitized = sanitizeStoredImage(trimmed);
    if (trimmed && sanitized === "") {
      return { ok: false, error: "Image too large (max ~350KB)" };
    }
    next.image = sanitized;
  }
  users[idx] = next;
  saveServerUsers(users);
  return { ok: true };
}
