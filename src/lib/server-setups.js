import fs from "fs";
import path from "path";
import { setups as legacySetups, tracks } from "@/lib/data";
import { emptyFlatSetupForSlug, mergeLegacySetup } from "@/lib/setup-keys";

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
    const base = emptyFlatSetupForSlug();
    const leg = legacySetups[t.slug];
    Object.assign(base, mergeLegacySetup(leg));
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
      data[t.slug] = attachUpdatedAt({ ...emptyFlatSetupForSlug(), ...mergeLegacySetup(legacySetups[t.slug]) });
    } else {
      data[t.slug] = attachUpdatedAt(data[t.slug]);
    }
  }

  writeFile(data);
  return data;
}

export function getTrackSetupFlat(slug) {
  const all = getAllTrackSetups();
  const base = all[slug] || { ...emptyFlatSetupForSlug(), ...mergeLegacySetup(legacySetups[slug]) };
  return attachUpdatedAt(base);
}

export function saveTrackSetupFlat(slug, flat) {
  const all = getAllTrackSetups();
  const prev = all[slug] || emptyFlatSetupForSlug();
  all[slug] = attachUpdatedAt({ ...prev, ...flat });
  writeFile(all);
  return all[slug];
}

export function getLatestTrackUpdate() {
  const all = getAllTrackSetups();
  let latest = null;

  for (const [slug, setup] of Object.entries(all || {})) {
    const updatedAt = setup?.updatedAt;
    if (!updatedAt) continue;
    const date = new Date(updatedAt);
    if (Number.isNaN(date.getTime())) continue;
    if (!latest || date.getTime() > new Date(latest.updatedAt).getTime()) {
      latest = { slug, updatedAt: date.toISOString() };
    }
  }

  if (!latest) {
    const fallbackSlug = tracks[0]?.slug || "australia";
    return {
      slug: fallbackSlug,
      circuit: tracks.find((item) => item.slug === fallbackSlug)?.circuit || "MySetups",
      updatedAt: new Date().toISOString(),
    };
  }

  const track = tracks.find((item) => item.slug === latest.slug) || { circuit: "MySetups", country: "World" };
  return {
    slug: latest.slug,
    circuit: track.circuit || track.country || "MySetups",
    country: track.country || "World",
    updatedAt: latest.updatedAt,
  };
}

export function saveAllTrackSetups(all) {
  const next = Object.fromEntries(
    Object.entries(all || {}).map(([slug, setup]) => [slug, attachUpdatedAt(setup)])
  );
  writeFile(next);
}
