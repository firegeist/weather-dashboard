import type { Metadata } from "next";
import Link from "next/link";
import { searchCities } from "@/lib/geocoding";
import { getWeatherData } from "@/lib/weather";
import WeatherCard from "@/components/WeatherCard";
import HourlyChart from "@/components/HourlyChart";
import PrecipitationChart from "@/components/PrecipitationChart";
import ForecastGrid from "@/components/ForecastGrid";
import WindCard from "@/components/WindCard";
import UVIndex from "@/components/UVIndex";

interface CityPageProps {
  params: Promise<{ city: string }>;
}

// ─── Slug resolver ────────────────────────────────────────────────────────────
// "geo-40.41-(-3.70)" → lat/lon directo, name="Mi ubicación"
// "madrid-es"         → name="madrid",   countryCode="ES"
// "new-york-us"       → name="new york", countryCode="US"

interface ResolvedCity {
  latitude: number;
  longitude: number;
  name: string;
  country?: string;
}

async function resolveSlug(slug: string): Promise<ResolvedCity | null> {
  const geoMatch = /^geo-(-?[\d.]+)-(-?[\d.]+)$/.exec(slug);
  if (geoMatch) {
    return {
      latitude: parseFloat(geoMatch[1]),
      longitude: parseFloat(geoMatch[2]),
      name: "Mi ubicación",
    };
  }

  const lastHyphen = slug.lastIndexOf("-");
  if (lastHyphen === -1) return null;

  const namePart = slug.slice(0, lastHyphen).replace(/-/g, " ");
  const countryCode = slug.slice(lastHyphen + 1).toUpperCase();

  const results = await searchCities(namePart);
  return results.find((r) => r.country_code === countryCode) ?? null;
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  const { city } = await params;
  const result = await resolveSlug(city);
  const name = result ? result.name : city;
  return { title: `${name} · Weather Dashboard` };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function CityPage({ params }: CityPageProps) {
  const { city } = await params;
  const result = await resolveSlug(city);

  if (!result) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4 gap-4 text-center">
        <p style={{ color: "var(--text-secondary)" }}>
          No se encontró la ciudad{" "}
          <strong style={{ color: "var(--text-primary)" }}>{city}</strong>.
        </p>
        <Link
          href="/"
          style={{
            color: "var(--accent-green)",
            fontFamily: "var(--font-dm-mono)",
            fontSize: "0.875rem",
          }}
        >
          ← Volver a la búsqueda
        </Link>
      </main>
    );
  }

  const forecast = await getWeatherData(result.latitude, result.longitude, result.name);
  const { current, today, hourly, daily } = forecast;

  const cityLabel = result.country
    ? `${result.name}, ${result.country}`
    : result.name;

  const now = new Date();
  const updatedAt = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  return (
    <main className="min-h-screen px-4 py-8 max-w-5xl mx-auto flex flex-col gap-6">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            style={{
              color: "var(--text-secondary)",
              fontSize: "0.875rem",
              fontFamily: "var(--font-dm-mono)",
            }}
            className="hover:underline"
          >
            ← Volver
          </Link>
          <h1
            style={{
              color: "var(--text-primary)",
              fontSize: "1.25rem",
              fontWeight: 600,
              margin: 0,
            }}
          >
            {cityLabel}
          </h1>
        </div>
        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: "0.75rem",
            fontFamily: "var(--font-dm-mono)",
            margin: 0,
          }}
        >
          Actualizado: {updatedAt}
        </p>
      </div>

      {/* ── Row 1: WeatherCard + Charts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-4">
        {/* Left: current conditions */}
        <WeatherCard current={current} today={today} />

        {/* Right: hourly charts stacked */}
        <div className="flex flex-col gap-4">
          <div
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border)",
              borderRadius: "16px",
              padding: "1.5rem",
            }}
          >
            <HourlyChart data={hourly} />
          </div>
          <div
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border)",
              borderRadius: "16px",
              padding: "1.5rem",
            }}
          >
            <PrecipitationChart data={hourly} />
          </div>
        </div>
      </div>

      {/* ── Row 2: 7-day forecast ── */}
      <div
        style={{
          background: "var(--bg-secondary)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          padding: "1.5rem",
        }}
      >
        <ForecastGrid days={daily} />
      </div>

      {/* ── Row 3: Wind + UV ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <WindCard
          windspeed={current.windspeed}
          winddirection={current.winddirection}
          windspeedMax={daily[0].windspeedMax}
        />
        <UVIndex
          uvIndexMax={today.uvIndexMax}
          sunrise={today.sunrise}
          sunset={today.sunset}
        />
      </div>

    </main>
  );
}
