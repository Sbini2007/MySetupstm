import fs from "fs";
import path from "path";
import { setups as legacySetups, tracks } from "@/lib/data";
import { emptyFlatSetupForSlug, mergeLegacySetup } from "@/lib/setup-keys";
import { generateFlatSetup } from "@/lib/default-setups";
import { clampValue } from "@/lib/setup-sections";

const FILE = path.join(process.cwd(), "data", "track-setups.json");

function readFile() {
  try {
    if (!fs.existsSync(FILE)) return {};
    return JSON.parse(fs.readFileSync(FILE, "utf8"));
  } catch {
    return {};
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

function seedFromLegacy() {
  const out = {};
  for (const t of tracks) {
    const base = generateFlatSetup(t.slug);
    const leg = legacySetups[t.slug];
    if (leg) {
      Object.assign(base, mergeLegacySetup(leg));
    }
    out[t.slug] = attachUpdatedAt(base, new Date().toISOString());
  }
  return out;
}

export function getAllTrackSetups() {
  let data = readFile();
  if (!data || typeof data !== "object" || Object.keys(data).length === 0) {
    data = seedFromLegacy();
    writeFile(data);
  }

  for (const t of tracks) {
    if (!data[t.slug]) {
      const generated = generateFlatSetup(t.slug);
      if (legacySetups[t.slug]) {
        Object.assign(generated, mergeLegacySetup(legacySetups[t.slug]));
      }
      data[t.slug] = attachUpdatedAt(generated);
    } else {
      data[t.slug] = attachUpdatedAt(data[t.slug]);
    }
  }

  writeFile(data);
  return data;
}

export function getTrackSetupFlat(slug) {
  const all = getAllTrackSetups();
  const base = all[slug] || generateFlatSetup(slug);
  return attachUpdatedAt(base);
}

export function saveTrackSetupFlat(slug, flat) {
  const all = getAllTrackSetups();
  const prev = all[slug] || emptyFlatSetupForSlug();
  const nextData = { ...prev, ...flat };

  // Enforce parameter boundaries across all variations (race, quali, parc_ferme)
  for (const [key, value] of Object.entries(nextData)) {
    for (const prefix of ["race_", "quali_", "parc_ferme_"]) {
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
  all[slug] = attachUpdatedAt({ ...nextData, updatedAt: new Date().toISOString() });
  writeFile(all);
  return all[slug];
}

export function duplicateTrackSetup(sourceSlug, targetSlug, variantFrom = null, variantTo = null) {
  const all = getAllTrackSetups();
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

  all[targetSlug] = attachUpdatedAt(target);
  writeFile(all);
  return all[targetSlug];
}

export function deleteTrackSetup(slug) {
  const all = getAllTrackSetups();
  if (all[slug]) {
    // Reset to clean default
    all[slug] = attachUpdatedAt(generateFlatSetup(slug));
    writeFile(all);
    return true;
  }
  return false;
}

export function createTrackSetup(slug, customData = {}) {
  const all = getAllTrackSetups();
  const base = generateFlatSetup(slug);
  all[slug] = attachUpdatedAt({ ...base, ...customData });
  writeFile(all);
  return all[slug];
}

export function getLatestTrackUpdate() {
  const all = readFile();
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

export function saveAllTrackSetups(all) {
  const next = Object.fromEntries(
    Object.entries(all || {}).map(([slug, setup]) => [slug, attachUpdatedAt(setup)])
  );
  writeFile(next);
}
