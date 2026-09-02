import fs from "fs";
import path from "path";
import { isAdminEmail } from "@/lib/admin-emails";

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
    users[idx] = {
      ...prev,
      ...partial,
      email: partial.email,
      premium: partial.premium !== undefined ? partial.premium : prev.premium,
      admin: partial.admin !== undefined ? partial.admin : prev.admin || adminFromList,
      image: sanitizeStoredImage(partial.image ?? prev.image),
      oauthImage: sanitizeStoredImage(partial.oauthImage ?? prev.oauthImage ?? partial.image ?? prev.image),
    };
  } else {
    users.unshift({
      id: Date.now(),
      premium: partial.premium ?? false,
      admin: partial.admin ?? adminFromList,
      name: partial.name || partial.email.split("@")[0],
      email: partial.email,
      image: sanitizeStoredImage(partial.image),
      oauthName: partial.oauthName ?? partial.name,
      oauthImage: sanitizeStoredImage(partial.oauthImage ?? partial.image),
      provider: partial.provider,
    });
  }
  saveServerUsers(users);
  return users;
}

export function setServerUserPremium(email, premium) {
  const users = getServerUsers();
  const lower = String(email || "").toLowerCase();
  const idx = users.findIndex((u) => String(u.email || "").toLowerCase() === lower);
  if (idx === -1) {
    upsertServerUser({ email, name: String(email).split("@")[0], premium });
    return getServerUsers();
  }
  const next = users.map((u) => (String(u.email || "").toLowerCase() === lower ? { ...u, premium } : u));
  saveServerUsers(next);
  return next;
}

export function setServerUserAdminFlag(email, admin) {
  const users = getServerUsers();
  const lower = String(email || "").toLowerCase();
  const idx = users.findIndex((u) => String(u.email || "").toLowerCase() === lower);
  if (idx === -1) {
    upsertServerUser({ email, name: String(email).split("@")[0], admin });
    return getServerUsers();
  }
  const next = users.map((u) => (String(u.email || "").toLowerCase() === lower ? { ...u, admin } : u));
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
