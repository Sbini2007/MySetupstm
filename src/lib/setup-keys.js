/**
 * Flat keys per tab prefix (race_|quali_|wet_) compatible with SetupDisplay.
 */
export const SETUP_TAB_PREFIXES = ["race", "quali", "wet"];

const SUFFIXES = [
  "front_wing",
  "rear_wing",
  "diff_on",
  "diff_off",
  "front_camber",
  "rear_camber",
  "front_toe",
  "rear_toe",
  "front_suspension",
  "rear_suspension",
  "front_antiroll",
  "rear_antiroll",
  "front_ride_height",
  "rear_ride_height",
  "front_tyre_pressure",
  "rear_tyre_pressure",
  "brake_bias",
  "brake_pressure",
];

export function allFlatSetupKeys() {
  const keys = [];
  const noteByTab = { race: "race_driving_notes", quali: "quali_driving_notes", wet: "wet_driving_notes" };
  for (const tab of SETUP_TAB_PREFIXES) {
    const p = tab === "race" ? "race_" : tab === "quali" ? "quali_" : "wet_";
    for (const s of SUFFIXES) {
      keys.push(`${p}${s}`);
    }
    keys.push(noteByTab[tab]);
  }
  keys.push("driving_notes");
  return keys;
}

export function emptyFlatSetupForSlug() {
  const o = {};
  const noteByTab = { race: "race_driving_notes", quali: "quali_driving_notes", wet: "wet_driving_notes" };
  for (const tab of SETUP_TAB_PREFIXES) {
    const p = tab === "race" ? "race_" : tab === "quali" ? "quali_" : "wet_";
    for (const s of SUFFIXES) {
      o[`${p}${s}`] = "—";
    }
    o[noteByTab[tab]] = "";
  }
  o.driving_notes = "";
  return o;
}

/** Merge legacy setups from data.js into flat race_* keys where possible */
export function mergeLegacySetup(legacy) {
  if (!legacy || typeof legacy !== "object") return {};
  const m = {};
  if (legacy.frontWing != null) m.race_front_wing = String(legacy.frontWing);
  if (legacy.rearWing != null) m.race_rear_wing = String(legacy.rearWing);
  if (legacy.differential != null) {
    m.race_diff_on = String(legacy.differential);
    m.race_diff_off = String(legacy.differential);
  }
  if (legacy.suspension != null) {
    m.race_front_suspension = String(legacy.suspension);
    m.race_rear_suspension = String(legacy.suspension);
  }
  if (legacy.tyrePressure != null) {
    const parts = String(legacy.tyrePressure).split("/").map((x) => x.trim());
    if (parts[0]) m.race_front_tyre_pressure = parts[0];
    if (parts[1]) m.race_rear_tyre_pressure = parts[1];
  }
  if (legacy.brakeBias != null) m.race_brake_bias = String(legacy.brakeBias);
  if (legacy.notes != null) {
    m.race_driving_notes = String(legacy.notes);
    m.driving_notes = String(legacy.notes);
  }
  return m;
}
