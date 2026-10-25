const TIME_UNITS = [
  ["year", 60 * 60 * 24 * 365],
  ["month", 60 * 60 * 24 * 30],
  ["week", 60 * 60 * 24 * 7],
  ["day", 60 * 60 * 24],
  ["hour", 60 * 60],
  ["minute", 60],
  ["second", 1],
];

export function formatRelativeTime(value) {
  if (!value) return null;

  const updatedAt = new Date(value);
  const elapsedSeconds = (updatedAt.getTime() - Date.now()) / 1000;
  if (!Number.isFinite(elapsedSeconds)) return null;

  const [unit, secondsPerUnit] =
    TIME_UNITS.find(([, seconds]) => Math.abs(elapsedSeconds) >= seconds) ||
    TIME_UNITS[TIME_UNITS.length - 1];

  return new Intl.RelativeTimeFormat("it", { numeric: "auto" }).format(
    Math.round(elapsedSeconds / secondsPerUnit),
    unit
  );
}
