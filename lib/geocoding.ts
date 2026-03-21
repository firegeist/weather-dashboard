import type { GeocodingResult, GeocodingResponse } from "@/types/weather";

const GEOCODING_BASE =
  "https://geocoding-api.open-meteo.com/v1/search";

// ─── City search ─────────────────────────────────────────────────────────────

export async function searchCities(
  query: string
): Promise<GeocodingResult[]> {
  if (!query.trim()) return [];

  const url = new URL(GEOCODING_BASE);
  url.searchParams.set("name", query.trim());
  url.searchParams.set("count", "5");
  url.searchParams.set("language", "es");
  url.searchParams.set("format", "json");

  try {
    const res = await fetch(url.toString());
    if (!res.ok) return [];

    const data = (await res.json()) as GeocodingResponse;
    return data.results ?? [];
  } catch {
    return [];
  }
}

// ─── Slug generation ─────────────────────────────────────────────────────────

/**
 * Generates a URL-safe slug from a GeocodingResult.
 * e.g. "Madrid" + "ES" → "madrid-es"
 *      "New York" + "US" → "new-york-us"
 */
export function getCitySlug(city: GeocodingResult): string {
  const normalize = (str: string) =>
    str
      .normalize("NFD")                    // decompose accented chars
      .replace(/[\u0300-\u036f]/g, "")     // strip combining diacritics
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")       // remove non-alphanumeric
      .replace(/\s+/g, "-")               // spaces → hyphens
      .replace(/-+/g, "-");               // collapse repeated hyphens

  const namePart = normalize(city.name);
  const countryPart = city.country_code.toLowerCase();

  return `${namePart}-${countryPart}`;
}
