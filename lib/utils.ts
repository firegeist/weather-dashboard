// ─── Temperature & wind ──────────────────────────────────────────────────────

export function formatTemperature(temp: number): string {
  return `${Math.round(temp)}°C`;
}

export function formatWind(speed: number): string {
  return `${Math.round(speed)} km/h`;
}

/** @deprecated Use formatWind */
export const formatWindSpeed = formatWind;

// ─── Date & time ─────────────────────────────────────────────────────────────

/**
 * Formats an ISO datetime string to "HH:MM".
 * Reads directly from the string to avoid timezone conversion issues.
 * Works with both "2024-03-21T07:42" and "2024-03-21T07:42:00" formats.
 */
export function formatTime(isoString: string): string {
  const tIndex = isoString.indexOf("T");
  if (tIndex === -1) return isoString;
  return isoString.slice(tIndex + 1, tIndex + 6); // "HH:MM"
}

/**
 * Formats an ISO date string to a short Spanish label, e.g. "lun. 21".
 * Renders the date at noon UTC to avoid day-boundary shifts in any timezone.
 */
export function formatDate(isoString: string): string {
  // Accepts both "2024-03-21" and "2024-03-21T..."
  const datePart = isoString.slice(0, 10);
  const date = new Date(`${datePart}T12:00:00Z`);

  return new Intl.DateTimeFormat("es-ES", {
    weekday: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}

// ─── UV index ────────────────────────────────────────────────────────────────

interface UVLabel {
  label: string;
  color: string; // Tailwind text color class
}

export function getUVLabel(uvi: number): UVLabel {
  if (uvi < 3)  return { label: "Bajo",      color: "text-emerald-400" };
  if (uvi < 6)  return { label: "Moderado",  color: "text-yellow-400"  };
  if (uvi < 8)  return { label: "Alto",      color: "text-orange-400"  };
  if (uvi < 11) return { label: "Muy alto",  color: "text-red-400"     };
  return               { label: "Extremo",   color: "text-purple-400"  };
}
