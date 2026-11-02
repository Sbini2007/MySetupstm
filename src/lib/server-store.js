import fs from "fs";
import path from "path";
import { neon } from "@neondatabase/serverless";
import { isAdminEmail } from "@/lib/admin-emails";
import { hashPassword, verifyPassword } from "@/lib/passwords";
import { guides as defaultGuides } from "@/lib/data";
import { normalizeGuides } from "@/lib/guides";

const DATA_DIR = path.join(process.cwd(), "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const GUIDES_FILE = path.join(DATA_DIR, "guides.json");
const MAX_NAME_LEN = 80;
const MAX_AVATAR_BYTES = 380_000;

let databaseClient;
let databaseSetup;
let guidesDatabaseSetup;

function getDatabase() {
  if (!process.env.DATABASE_URL) {
    if (process.env.NODE_ENV === "production") {
      const error = new Error("Account storage is not configured. Set DATABASE_URL.");
      error.code = "USER_STORE_NOT_CONFIGURED";
      throw error;
    }
    return null;
  }

  databaseClient ||= neon(process.env.DATABASE_URL);
  return databaseClient;
}

async function ensureDatabase(sql) {
  if (!databaseSetup) {
    databaseSetup = sql`
      CREATE TABLE IF NOT EXISTS mysetups_users (
        email TEXT PRIMARY KEY,
        user_data JSONB NOT NULL
      )
    `;
  }

  try {
    await databaseSetup;
  } catch (error) {
    databaseSetup = null;
    throw error;
  }
}

async function ensureGuidesDatabase(sql) {
  if (!guidesDatabaseSetup) {
    guidesDatabaseSetup = sql`
      CREATE TABLE IF NOT EXISTS mysetups_guides (
        id INTEGER PRIMARY KEY,
        guides JSONB NOT NULL
      )
    `;
  }

  try {
    await guidesDatabaseSetup;
  } catch (error) {
    guidesDatabaseSetup = null;
    throw error;
  }
}

async function withStorage(databaseOperation, fileOperation) {
  const sql = getDatabase();
  if (!sql) return fileOperation();
  await ensureDatabase(sql);
  return databaseOperation(sql);
}

async function withGuidesStorage(databaseOperation, fileOperation) {
  const sql = getDatabase();
  if (!sql) return fileOperation();
  await ensureGuidesDatabase(sql);
  return databaseOperation(sql);
}

function readFileUsers() {
  if (!fs.existsSync(USERS_FILE)) return [];
  const users = JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
  if (!Array.isArray(users)) throw new Error("The local users store must contain a JSON array.");
  return users;
}

function writeFileUsers(users) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf8");
}

function readFileGuides() {
  if (!fs.existsSync(GUIDES_FILE)) return normalizeGuides(defaultGuides);
  const guides = JSON.parse(fs.readFileSync(GUIDES_FILE, "utf8"));
  if (!Array.isArray(guides)) throw new Error("The local guides store must contain a JSON array.");
  return normalizeGuides(guides);
}

function migrateLegacyGuides(guides) {
  const legacyCategories = {
    "bilanciamento-aero": "aerodinamica",
    "pressioni-gomme": "pressione-pneumatici",
    sospensioni: "sospensioni",
    differenziale: "trasmissione",
    "assetto-gara": "geometria-sospensioni",
    "gestione-degrado": "pressione-pneumatici",
  };
  const normalized = normalizeGuides(guides);
  if (!normalized.length || !normalized.every((guide) => Object.hasOwn(legacyCategories, guide.slug))) return null;

  const contentByCategory = new Map();
  for (const guide of normalized) {
    const category = legacyCategories[guide.slug];
    if (!guide.content) continue;
    contentByCategory.set(category, [
      contentByCategory.get(category),
      guide.content,
    ].filter(Boolean).join("\n\n"));
  }

  return normalizeGuides(defaultGuides.map((guide) => ({
    ...guide,
    content: contentByCategory.get(guide.slug) || "",
  })));
}

function writeFileGuides(guides) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(GUIDES_FILE, JSON.stringify(guides, null, 2), "utf8");
}

function sanitizeStoredImage(value) {
  if (typeof value !== "string") return "";
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > 2_000_000) return "";
  if (trimmed.startsWith("data:image/") && Buffer.byteLength(trimmed, "utf8") > MAX_AVATAR_BYTES) {
    return "";
  }
  return trimmed;
}

function normalizeUser(user) {
  return {
    ...user,
    image: sanitizeStoredImage(user?.image),
    oauthImage: sanitizeStoredImage(user?.oauthImage),
  };
}

function findFileUser(email) {
  if (!email) return null;
  const lower = String(email).trim().toLowerCase();
  const user = readFileUsers().find((entry) => String(entry.email || "").trim().toLowerCase() === lower);
  return user ? normalizeUser(user) : null;
}

function writeFileUser(user) {
  const users = readFileUsers();
  const lower = String(user.email || "").trim().toLowerCase();
  const index = users.findIndex((entry) => String(entry.email || "").trim().toLowerCase() === lower);
  if (index === -1) users.unshift(user);
  else users[index] = user;
  writeFileUsers(users);
}

async function findDatabaseUser(sql, email) {
  if (!email) return null;
  const lower = String(email).trim().toLowerCase();
  const rows = await sql`SELECT user_data FROM mysetups_users WHERE email = ${lower} LIMIT 1`;
  return rows[0]?.user_data ? normalizeUser(rows[0].user_data) : null;
}

async function readDatabaseUsers(sql) {
  const rows = await sql`
    SELECT user_data FROM mysetups_users
    ORDER BY user_data->>'createdAt' DESC NULLS LAST
  `;
  return rows.map((row) => normalizeUser(row.user_data));
}

async function writeDatabaseUser(sql, user) {
  const email = String(user.email || "").trim().toLowerCase();
  const normalizedUser = { ...user, email };
  await sql`
    INSERT INTO mysetups_users (email, user_data)
    VALUES (${email}, ${JSON.stringify(normalizedUser)}::jsonb)
    ON CONFLICT (email)
    DO UPDATE SET user_data = EXCLUDED.user_data
  `;
}

async function readUsers() {
  return withStorage(readDatabaseUsers, readFileUsers);
}

async function findUser(email) {
  return withStorage(
    (sql) => findDatabaseUser(sql, email),
    () => findFileUser(email)
  );
}

async function persistUser(user) {
  return withStorage(
    (sql) => writeDatabaseUser(sql, user),
    () => writeFileUser(user)
  );
}

function buildUpsertedUser(partial, previous) {
  const adminFromList = isAdminEmail(partial.email);
  if (previous) {
    const role = partial.role !== undefined
      ? partial.role
      : previous.role || (previous.admin ? "admin" : previous.premium ? "subscriber" : "user");
    return {
      ...previous,
      ...partial,
      email: String(partial.email).trim().toLowerCase(),
      role: adminFromList ? "admin" : role,
      premium: partial.premium !== undefined ? partial.premium : (role !== "user" ? true : previous.premium),
      admin: partial.admin !== undefined ? partial.admin : (adminFromList || role === "admin" || previous.admin),
      createdAt: previous.createdAt || partial.createdAt || new Date().toISOString(),
      password: partial.password || previous.password,
      image: sanitizeStoredImage(partial.image ?? previous.image),
      oauthImage: sanitizeStoredImage(partial.oauthImage ?? previous.oauthImage ?? partial.image ?? previous.image),
    };
  }

  const role = adminFromList ? "admin" : partial.role || (partial.admin ? "admin" : partial.premium ? "subscriber" : "user");
  const email = String(partial.email).trim().toLowerCase();
  return {
    id: Date.now(),
    role,
    premium: partial.premium ?? (role !== "user"),
    admin: partial.admin ?? (adminFromList || role === "admin"),
    name: partial.name || email.split("@")[0],
    email,
    createdAt: partial.createdAt || new Date().toISOString(),
    password: partial.password || null,
    image: sanitizeStoredImage(partial.image),
    oauthName: partial.oauthName ?? partial.name,
    oauthImage: sanitizeStoredImage(partial.oauthImage ?? partial.image),
    provider: partial.provider || "credentials",
  };
}

export async function getServerUsers() {
  return (await readUsers()).map(normalizeUser);
}

export async function getServerGuides() {
  return withGuidesStorage(async (sql) => {
    const rows = await sql`SELECT guides FROM mysetups_guides WHERE id = 1 LIMIT 1`;
    if (rows[0]?.guides) {
      const migrated = migrateLegacyGuides(rows[0].guides);
      if (!migrated) return normalizeGuides(rows[0].guides);
      await sql`
        UPDATE mysetups_guides
        SET guides = ${JSON.stringify(migrated)}::jsonb
        WHERE id = 1
      `;
      return migrated;
    }

    const defaults = normalizeGuides(defaultGuides);
    await sql`
      INSERT INTO mysetups_guides (id, guides)
      VALUES (1, ${JSON.stringify(defaults)}::jsonb)
      ON CONFLICT (id) DO NOTHING
    `;
    const seededRows = await sql`SELECT guides FROM mysetups_guides WHERE id = 1 LIMIT 1`;
    const seededGuides = normalizeGuides(seededRows[0]?.guides || defaults);
    const migrated = migrateLegacyGuides(seededGuides);
    if (!migrated) return seededGuides;
    await sql`
      UPDATE mysetups_guides
      SET guides = ${JSON.stringify(migrated)}::jsonb
      WHERE id = 1
    `;
    return migrated;
  }, () => {
    const guides = readFileGuides();
    const migrated = migrateLegacyGuides(guides);
    if (!migrated) return guides;
    writeFileGuides(migrated);
    return migrated;
  });
}

export async function saveServerGuides(guides) {
  const normalizedGuides = normalizeGuides(guides);
  return withGuidesStorage(async (sql) => {
    await sql`
      INSERT INTO mysetups_guides (id, guides)
      VALUES (1, ${JSON.stringify(normalizedGuides)}::jsonb)
      ON CONFLICT (id)
      DO UPDATE SET guides = EXCLUDED.guides
    `;
    return normalizedGuides;
  }, () => {
    writeFileGuides(normalizedGuides);
    return normalizedGuides;
  });
}

export async function upsertServerUser(partial) {
  if (!partial?.email) return getServerUsers();
  const email = String(partial.email).trim().toLowerCase();
  const previous = await findUser(email);
  await persistUser(buildUpsertedUser({ ...partial, email }, previous));
  return getServerUsers();
}

export async function registerServerUser({ name, email, password }) {
  if (!email) throw new Error("Email richiesta");
  const normalizedEmail = String(email).trim().toLowerCase();
  const adminFromList = isAdminEmail(normalizedEmail);
  const newUser = {
    id: Date.now(),
    name: (name && String(name).trim()) || normalizedEmail.split("@")[0],
    email: normalizedEmail,
    password: password ? await hashPassword(password) : "",
    role: adminFromList ? "admin" : "user",
    premium: adminFromList,
    admin: adminFromList,
    createdAt: new Date().toISOString(),
    provider: "server-credentials",
    image: "",
  };

  return withStorage(async (sql) => {
    const rows = await sql`
      INSERT INTO mysetups_users (email, user_data)
      VALUES (${normalizedEmail}, ${JSON.stringify(newUser)}::jsonb)
      ON CONFLICT (email) DO NOTHING
      RETURNING user_data
    `;
    if (!rows.length) {
      const error = new Error("Un account con questa email esiste già");
      error.code = "USER_EXISTS";
      throw error;
    }
    return normalizeUser(rows[0].user_data);
  }, () => {
    if (findFileUser(normalizedEmail)) {
      const error = new Error("Un account con questa email esiste già");
      error.code = "USER_EXISTS";
      throw error;
    }
    writeFileUser(newUser);
    return newUser;
  });
}

export async function setServerUserPassword(email, password) {
  const user = await findUser(email);
  if (!user) return false;
  await persistUser({ ...user, password: await hashPassword(password) });
  return true;
}

export async function authenticateServerUser(email, password) {
  const user = await findUser(email);
  if (!user?.password) return null;
  const result = await verifyPassword(password, user.password);
  if (!result.valid) return null;
  if (result.needsRehash) {
    await setServerUserPassword(user.email, password);
  }
  return findUser(user.email);
}

export async function deleteServerUser(email) {
  if (!email) return false;
  const lower = String(email).trim().toLowerCase();
  return withStorage(async (sql) => {
    const rows = await sql`DELETE FROM mysetups_users WHERE email = ${lower} RETURNING email`;
    return rows.length > 0;
  }, () => {
    const users = readFileUsers();
    const next = users.filter((user) => String(user.email || "").toLowerCase() !== lower);
    if (next.length === users.length) return false;
    writeFileUsers(next);
    return true;
  });
}

export async function setServerUserRole(email, role) {
  const adminFromList = isAdminEmail(email);
  const targetRole = adminFromList ? "admin" : role;
  const isPrivileged = targetRole === "admin" || targetRole === "editor" || targetRole === "vip" || targetRole === "subscriber";
  const user = await findUser(email);
  if (!user) {
    await upsertServerUser({
      email,
      name: String(email).split("@")[0],
      role: targetRole,
      premium: isPrivileged,
      admin: targetRole === "admin",
    });
    return getServerUsers();
  }

  await persistUser({
    ...user,
    role: targetRole,
    premium: isPrivileged,
    admin: targetRole === "admin" || adminFromList,
  });
  return getServerUsers();
}

export async function setServerUserGuideAccess(email, guideAccess) {
  const user = await findUser(email);
  if (!user) return false;
  await persistUser({ ...user, guideAccess: Boolean(guideAccess) });
  return true;
}

export async function setServerUserPremium(email, premium) {
  const user = await findUser(email);
  if (!user) {
    await upsertServerUser({ email, name: String(email).split("@")[0], premium, role: premium ? "subscriber" : "user" });
    return getServerUsers();
  }
  const role = premium ? (user.role === "admin" ? "admin" : user.role === "vip" ? "vip" : "subscriber") : "user";
  await persistUser({ ...user, premium, role });
  return getServerUsers();
}

export async function setServerUserAdminFlag(email, admin) {
  const user = await findUser(email);
  if (!user) {
    await upsertServerUser({
      email,
      name: String(email).split("@")[0],
      admin,
      role: admin ? "admin" : "user",
      premium: admin,
    });
    return getServerUsers();
  }
  const role = admin ? "admin" : (user.premium ? "subscriber" : "user");
  await persistUser({ ...user, admin, role });
  return getServerUsers();
}

export async function getServerUserByEmail(email) {
  return findUser(email);
}

export async function patchServerUserOAuth(email, { oauthName, oauthImage, provider }) {
  const user = await findUser(email);
  if (!user) return getServerUsers();
  await persistUser({
    ...user,
    oauthName: oauthName ?? user.oauthName ?? user.name,
    oauthImage: sanitizeStoredImage(oauthImage ?? user.oauthImage ?? user.image),
    provider: provider ?? user.provider,
  });
  return getServerUsers();
}

export async function updateServerUserProfile(email, { name, image }) {
  const user = await findUser(email);
  if (!user) return { ok: false, error: "User not found" };

  const next = { ...user };
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
  await persistUser(next);
  return { ok: true };
}
