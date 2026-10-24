/**
 * F1 26 Technical Setup Sections & Categories.
 * Provides exact parameter bounds, steps, units, and tab prefixes for all variations.
 */

export const SETUP_SECTIONS = [
  {
    title: "AERODINAMICA",
    titleEn: "AERODYNAMICS",
    fields: [
      { suffix: "front_wing", label: "Ala Anteriore", unit: "", min: 0, max: 50, step: 1, default: 26 },
      { suffix: "rear_wing", label: "Ala Posteriore", unit: "", min: 0, max: 50, step: 1, default: 22 },
    ],
  },
  {
    title: "TRASMISSIONE",
    titleEn: "TRANSMISSION",
    fields: [
      { suffix: "diff_on", label: "Differenziale In Trazione (On-Throttle)", unit: "%", min: 0, max: 100, step: 1, default: 55 },
      { suffix: "diff_off", label: "Differenziale In Rilascio (Off-Throttle)", unit: "%", min: 0, max: 100, step: 1, default: 50 },
    ],
  },
  {
    title: "GEOMETRIA SOSPENSIONI",
    titleEn: "SUSPENSION GEOMETRY",
    fields: [
      { suffix: "front_camber", label: "Campanatura Anteriore (Front Camber)", unit: "°", min: -3.5, max: -2.5, step: 0.1, default: -2.8 },
      { suffix: "rear_camber", label: "Campanatura Posteriore (Rear Camber)", unit: "°", min: -2.2, max: -1.0, step: 0.1, default: -1.8 },
      { suffix: "front_toe", label: "Convergenza Anteriore (Front Toe)", unit: "°", min: 0.0, max: 0.2, step: 0.01, default: 0.05 },
      { suffix: "rear_toe", label: "Convergenza Posteriore (Rear Toe)", unit: "°", min: 0.1, max: 0.4, step: 0.01, default: 0.15 },
    ],
  },
  {
    title: "SOSPENSIONI",
    titleEn: "SUSPENSION",
    fields: [
      { suffix: "front_suspension", label: "Sospensione Anteriore", unit: "", min: 1, max: 41, step: 1, default: 28 },
      { suffix: "rear_suspension", label: "Sospensione Posteriore", unit: "", min: 1, max: 41, step: 1, default: 14 },
      { suffix: "front_antiroll", label: "Barra Antirollio Anteriore (ARB)", unit: "", min: 1, max: 21, step: 1, default: 15 },
      { suffix: "rear_antiroll", label: "Barra Antirollio Posteriore (ARB)", unit: "", min: 1, max: 21, step: 1, default: 8 },
      { suffix: "front_ride_height", label: "Altezza da Terra Anteriore", unit: "", min: 15, max: 60, step: 1, default: 33 },
      { suffix: "rear_ride_height", label: "Altezza da Terra Posteriore", unit: "", min: 15, max: 60, step: 1, default: 44 },
    ],
  },
  {
    title: "FRENI",
    titleEn: "BRAKES",
    fields: [
      { suffix: "brake_pressure", label: "Pressione Freni", unit: "%", min: 0, max: 100, step: 1, default: 100 },
      { suffix: "brake_bias", label: "Ripartizione Frenata Anteriore", unit: "%", min: 0, max: 100, step: 0.5, default: 54 },
    ],
  },
  {
    title: "PRESSIONI PNEUMATICI",
    titleEn: "TYRE PRESSURES",
    fields: [
      { suffix: "front_left_psi", label: "Anteriore Sinistra", unit: " PSI", min: 23.5, max: 29.5, step: 0.1, default: 23.5 },
      { suffix: "front_right_psi", label: "Anteriore Destra", unit: " PSI", min: 23.5, max: 29.5, step: 0.1, default: 23.5 },
      { suffix: "rear_left_psi", label: "Posteriore Sinistra", unit: " PSI", min: 20.5, max: 26.5, step: 0.1, default: 20.5 },
      { suffix: "rear_right_psi", label: "Posteriore Destra", unit: " PSI", min: 20.5, max: 26.5, step: 0.1, default: 20.5 },
    ],
  },
];

export const PARAM_LIMITS = {
  front_wing: { min: 0, max: 50, step: 1 },
  rear_wing: { min: 0, max: 50, step: 1 },
  diff_on: { min: 0, max: 100, step: 1 },
  diff_off: { min: 0, max: 100, step: 1 },
  engine_braking: { min: 0, max: 100, step: 1 },
  front_camber: { min: -3.5, max: -2.5, step: 0.1 },
  rear_camber: { min: -2.2, max: -1.0, step: 0.1 },
  front_toe: { min: 0.0, max: 0.2, step: 0.01 },
  rear_toe: { min: 0.1, max: 0.4, step: 0.01 },
  front_suspension: { min: 1, max: 41, step: 1 },
  rear_suspension: { min: 1, max: 41, step: 1 },
  front_antiroll: { min: 1, max: 21, step: 1 },
  rear_antiroll: { min: 1, max: 21, step: 1 },
  front_ride_height: { min: 15, max: 60, step: 1 },
  rear_ride_height: { min: 15, max: 60, step: 1 },
  brake_pressure: { min: 0, max: 100, step: 1 },
  brake_bias: { min: 0, max: 100, step: 0.5 },
  front_left_psi: { min: 23.5, max: 29.5, step: 0.1 },
  front_right_psi: { min: 23.5, max: 29.5, step: 0.1 },
  rear_left_psi: { min: 20.5, max: 26.5, step: 0.1 },
  rear_right_psi: { min: 20.5, max: 26.5, step: 0.1 },
};

export function clampValue(suffix, val) {
  const bounds = PARAM_LIMITS[suffix];
  if (!bounds || typeof val !== "number" || Number.isNaN(val)) return val;
  const clamped = Math.max(bounds.min, Math.min(bounds.max, val));
  return bounds.step < 1 ? Number(clamped.toFixed(2)) : Math.round(clamped);
}

export const SETUP_TABS = [
  { key: "quali", label: "Qualifica", shortLabel: "Qualifica", desc: "Assetto giro secco: massima rotazione, aerodinamica affilata e reattività assoluta" },
  { key: "race", label: "Gara", shortLabel: "Gara", desc: "Assetto passo gara: usura pneumatici lineare, trazione stabile e consistenza sul ritmo" },
  { key: "parc_ferme", label: "Parco Chiuso", shortLabel: "Parco Chiuso", desc: "Assetto Parco Chiuso FIA: configurazione sigillata bilanciata tra qualifica e gara" },
];

export function tabToPrefix(tab) {
  if (!tab) return "race_";
  return `${tab}_`;
}

export function drivingNotesKeyForTab(tab) {
  return `${tabToPrefix(tab)}driving_notes`;
}
