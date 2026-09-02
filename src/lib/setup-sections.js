/**
 * UI + admin editor: field suffixes (combined with race_|quali_|wet_ prefix).
 */
export const SETUP_SECTIONS = [
  {
    title: "AERODYNAMICS",
    fields: [
      { suffix: "front_wing", label: "Front Wing", unit: "", min: 0, max: 50, step: 1 },
      { suffix: "rear_wing", label: "Rear Wing", unit: "", min: 0, max: 50, step: 1 },
    ],
  },
  {
    title: "TRANSMISSION",
    fields: [
      { suffix: "diff_on", label: "Differential (On Throttle)", unit: "%", min: 10, max: 100, step: 1 },
      { suffix: "diff_off", label: "Differential (Off Throttle)", unit: "%", min: 10, max: 100, step: 1 },
    ],
  },
  {
    title: "SUSPENSION GEOMETRY",
    fields: [
      { suffix: "front_camber", label: "Front Camber", unit: "°", min: -3.5, max: -2.5, step: 0.1 },
      { suffix: "rear_camber", label: "Rear Camber", unit: "°", min: -3.5, max: -2.5, step: 0.1 },
      { suffix: "front_toe", label: "Front Toe", unit: "°", min: 0.0, max: 0.2, step: 0.01 },
      { suffix: "rear_toe", label: "Rear Toe", unit: "°", min: 0.1, max: 0.25, step: 0.01 },
    ],
  },
  {
    title: "SUSPENSION",
    fields: [
      { suffix: "front_suspension", label: "Front Suspension", unit: "", min: 0, max: 41, step: 1 },
      { suffix: "rear_suspension", label: "Rear Suspension", unit: "", min: 0, max: 41, step: 1 },
      { suffix: "front_antiroll", label: "Front Anti-Roll Bar", unit: "", min: 0, max: 21, step: 1 },
      { suffix: "rear_antiroll", label: "Rear Anti-Roll Bar", unit: "", min: 0, max: 21, step: 1 },
      { suffix: "front_ride_height", label: "Front Ride Height", unit: "", min: 0, max: 35, step: 1 },
      { suffix: "rear_ride_height", label: "Rear Ride Height", unit: "", min: 0, max: 60, step: 1 },
    ],
  },
  {
    title: "TYRES",
    fields: [
      { suffix: "front_tyre_pressure", label: "Front Tyre Pressure", unit: " PSI", min: 22.95, max: 29.5, step: 0.05 },
      { suffix: "rear_tyre_pressure", label: "Rear Tyre Pressure", unit: " PSI", min: 20.5, max: 26.5, step: 0.05 },
    ],
  },
  {
    title: "BRAKES",
    fields: [
      { suffix: "brake_bias", label: "Brake Bias", unit: "%", min: 50, max: 70, step: 1 },
      { suffix: "brake_pressure", label: "Brake Pressure", unit: "%", min: 80, max: 100, step: 1 },
    ],
  },
];

export const SETUP_TABS = [
  { key: "race", label: "Gara", labelEn: "Race Setup" },
  { key: "quali", label: "Qualifica", labelEn: "Qualifying" },
  { key: "wet", label: "Bagnato", labelEn: "Wet Setup" },
];

export function tabToPrefix(tab) {
  if (tab === "race") return "race_";
  if (tab === "quali") return "quali_";
  return "wet_";
}

export function drivingNotesKeyForTab(tab) {
  if (tab === "race") return "race_driving_notes";
  if (tab === "quali") return "quali_driving_notes";
  return "wet_driving_notes";
}
