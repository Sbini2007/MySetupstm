import fs from "fs";
import path from "path";
import { neon } from "@neondatabase/serverless";
import { setups as legacySetups, tracks } from "@/lib/data";
import { emptyFlatSetupForSlug, mergeLegacySetup } from "@/lib/setup-keys";
import { generateFlatSetup } from "@/lib/default-setups";
import { clampValue, SETUP_SECTIONS } from "@/lib/setup-sections";

const FILE = path.join(process.cwd(), "data", "track-setups.json");
const SETUP_PREFIXES = ["race", "quali", "parc_ferme"];
let databaseClient;
let databaseSetup;
const NUMERIC_SETUP_FIELDS = SETUP_SECTIONS.flatMap((section) =>
  section.fields.map((field) => field.suffix)
);

function readFile() {
  try {
    return JSON.parse(fs.readFileSync(FILE, "utf8"));
  } catch (error) {
    if (error?.code === "ENOENT") return {};
    throw error;
  }
}

function writeFile(data) {
  fs.mkdirSync(path.dirname(FILE), { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2), "utf8");
}

function normaliseUpdatedAt(value) {
  if (!value || Number.isNaN(Date.parse(value))) {
    return new Date().toISOString();
  }
  return new Date(value).toISOString();
}

function attachUpdatedAt(setup, fallbackDate = new Date().toISOString()) {
  const next = { ...(setup || {}) };
  next.updatedAt = normaliseUpdatedAt(next.updatedAt || fallbackDate);
  return next;
}

function mergeSetupWithDefaults(slug, setup) {
  const defaults = generateFlatSetup(slug);
  const merged = { ...defaults, ...(setup || {}) };

  for (const prefix of SETUP_PREFIXES) {
    for (const suffix of NUMERIC_SETUP_FIELDS) {
      const key = `${prefix}_${suffix}`;
      const value = merged[key];
      const numericValue =
        typeof value === "number"
          ? value
          : typeof value === "string" && value.trim()
            ? Number(value)
            : Number.NaN;

      merged[key] = Number.isFinite(numericValue)
        ? clampValue(suffix, numericValue)
        : defaults[key];
    }
  }

  return attachUpdatedAt(merged);
}

function getDatabase() {
  if (!process.env.DATABASE_URL) {
    if (process.env.NODE_ENV === "production") {
      const error = new Error("Setup storage is not configured. Set DATABASE_URL.");
      error.code = "SETUP_STORE_NOT_CONFIGURED";
      throw error;
    }
    return null;
  }

  databaseClient ||= neon(process.env.DATABASE_URL);
  return databaseClient;
}

function seedFromLegacy() {
  const out = {};
  for (const track of tracks) {
    const base = generateFlatSetup(track.slug);
    const legacy = legacySetups[track.slug];
    if (legacy) Object.assign(base, mergeLegacySetup(legacy));
    out[track.slug] = attachUpdatedAt(base, new Date().toISOString());
  }
  return out;
}

async function ensureDatabase(sql) {
  if (!databaseSetup) {
    databaseSetup = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS mysetups_track_setups (
          slug TEXT PRIMARY KEY,
          setup JSONB NOT NULL
        )
      `;
      const rows = await sql`SELECT COUNT(*)::int AS count FROM mysetups_track_setups`;
      if (Number(rows[0]?.count || 0) === 0) {
        let initialData = readFile();
        if (!initialData || typeof initialData !== "object" || Object.keys(initialData).length === 0) {
          initialData = seedFromLegacy();
        }
        const inserts = Object.entries(initialData).map(
          ([slug, setup]) => sql`
            INSERT INTO mysetups_track_setups (slug, setup)
            VALUES (${slug}, ${JSON.stringify(setup)}::jsonb)
            ON CONFLICT (slug) DO NOTHING
          `
        );
        if (inserts.length) await sql.transaction(inserts);
      }
    })();
  }

  try {
    await databaseSetup;
  } catch (error) {
    databaseSetup = null;
    throw error;
  }
}

async function readStoredSetups() {
  const sql = getDatabase();
  if (!sql) {
    const data = readFile();
    if (!data || typeof data !== "object" || Object.keys(data).length === 0) {
      return seedFromLegacy();
    }
    return data;
  }

  await ensureDatabase(sql);
  const rows = await sql`SELECT slug, setup FROM mysetups_track_setups`;
  return Object.fromEntries(rows.map((row) => [row.slug, row.setup]));
}

async function writeStoredSetup(slug, setup) {
  const sql = getDatabase();
  if (!sql) {
    const all = await readStoredSetups();
    all[slug] = setup;
    writeFile(all);
    return;
  }

  await ensureDatabase(sql);
  await sql`
    INSERT INTO mysetups_track_setups (slug, setup)
    VALUES (${slug}, ${JSON.stringify(setup)}::jsonb)
    ON CONFLICT (slug)
    DO UPDATE SET setup = EXCLUDED.setup
  `;
}

async function writeStoredSetups(setups) {
  const sql = getDatabase();
  if (!sql) {
    writeFile(setups);
    return;
  }

  await ensureDatabase(sql);
  const queries = Object.entries(setups).map(
    ([slug, setup]) => sql`
      INSERT INTO mysetups_track_setups (slug, setup)
      VALUES (${slug}, ${JSON.stringify(setup)}::jsonb)
      ON CONFLICT (slug)
      DO UPDATE SET setup = EXCLUDED.setup
    `
  );
  if (queries.length) await sql.transaction(queries);
}

function getAllWithDefaults(data) {
  const all = { ...data };
  for (const track of tracks) {
    if (!all[track.slug]) {
      const generated = generateFlatSetup(track.slug);
      if (legacySetups[track.slug]) {
        Object.assign(generated, mergeLegacySetup(legacySetups[track.slug]));
      }
      all[track.slug] = mergeSetupWithDefaults(track.slug, generated);
    } else {
      all[track.slug] = mergeSetupWithDefaults(track.slug, all[track.slug]);
    }
  }
  return all;
}

function getLatestTrackUpdateFromSetups(all) {
  let latest = null;

  for (const [slug, setup] of Object.entries(all || {})) {
    const updatedAt = setup?.updatedAt;
    if (!updatedAt) continue;
    const date = new Date(updatedAt);
    if (Number.isNaN(date.getTime())) continue;
    if (!latest || date.getTime() > new Date(latest.updatedAt).getTime()) {
      latest = { slug, updatedAt: date.toISOString(), setup };
    }
  }

  const fallbackSlug = tracks[0]?.slug || "bahrain";
  const slug = latest?.slug || fallbackSlug;
  const track = tracks.find((item) => item.slug === slug) || { circuit: "Bahrain International Circuit", country: "Bahrain", flagCode: "bh" };
  const trackIndex = tracks.findIndex((item) => item.slug === slug) + 1;
  const setup = latest?.setup || all[slug] || generateFlatSetup(slug);

  const notes =
    setup.update_notes ||
    setup.race_driving_notes ||
    setup.driving_notes ||
    "Aggiornato bilanciamento alare e pressione pneumatici per le ultime specifiche di F1 26.";

  const variation = setup.latest_variation || "Assetto Gara & Qualifica F1 26";

  return {
    slug,
    circuit: track.circuit || track.country || "MySetups",
    country: track.country || "World",
    flagCode: track.flagCode || "it",
    round: `R${String(trackIndex > 0 ? trackIndex : 1).padStart(2, "0")}`,
    updatedAt: latest?.updatedAt || setup.updatedAt || new Date().toISOString(),
    notes,
    variation,
  };
}

export async function getAllTrackSetups() {
  return getAllWithDefaults(await readStoredSetups());
}

export async function getTrackSetupFlat(slug) {
  const all = await getAllTrackSetups();
  const base = all[slug] || generateFlatSetup(slug);
  return attachUpdatedAt(base);
}

export async function saveTrackSetupFlat(slug, flat) {
  const all = await getAllTrackSetups();
  const prev = all[slug] || emptyFlatSetupForSlug();
  const nextData = { ...prev, ...flat };

  for (const [key, value] of Object.entries(nextData)) {
    for (const prefix of SETUP_PREFIXES.map((variation) => `${variation}_`)) {
      if (key.startsWith(prefix)) {
        const suffix = key.slice(prefix.length);
        if (typeof value === "number") {
          nextData[key] = clampValue(suffix, value);
        }
      }
    }
  }

  if (flat.latest_variation) {
    nextData.latest_variation = flat.latest_variation;
  }
  all[slug] = mergeSetupWithDefaults(slug, {
    ...nextData,
    updatedAt: new Date().toISOString(),
  });
  await writeStoredSetup(slug, all[slug]);
  return all[slug];
}

export async function duplicateTrackSetup(sourceSlug, targetSlug, variantFrom = null, variantTo = null) {
  const all = await getAllTrackSetups();
  const source = all[sourceSlug] || generateFlatSetup(sourceSlug);
  const target = all[targetSlug] || generateFlatSetup(targetSlug);

  if (variantFrom && variantTo) {
    const fromPrefix = `${variantFrom}_`;
    const toPrefix = `${variantTo}_`;
    for (const [key, value] of Object.entries(source)) {
      if (key.startsWith(fromPrefix)) {
        const suffix = key.slice(fromPrefix.length);
        target[`${toPrefix}${suffix}`] = value;
      }
    }
    target.latest_variation = `Duplicato da ${variantFrom.toUpperCase()} a ${variantTo.toUpperCase()}`;
  } else {
    Object.assign(target, { ...source });
    target.latest_variation = `Duplicato interamente da ${sourceSlug}`;
  }

  all[targetSlug] = mergeSetupWithDefaults(targetSlug, target);
  await writeStoredSetup(targetSlug, all[targetSlug]);
  return all[targetSlug];
}

export async function deleteTrackSetup(slug) {
  const all = await getAllTrackSetups();
  if (!all[slug]) return false;
  all[slug] = attachUpdatedAt(generateFlatSetup(slug));
  await writeStoredSetup(slug, all[slug]);
  return true;
}

export async function createTrackSetup(slug, customData = {}) {
  const base = generateFlatSetup(slug);
  const setup = mergeSetupWithDefaults(slug, { ...base, ...customData });
  await writeStoredSetup(slug, setup);
  return setup;
}

export async function getLatestTrackUpdate() {
  return getLatestTrackUpdateFromSetups(await readStoredSetups());
}

export async function saveAllTrackSetups(all) {
  const next = Object.fromEntries(
    Object.entries(all || {}).map(([slug, setup]) => [slug, attachUpdatedAt(setup)])
  );
  await writeStoredSetups(next);
}
