"use client";

import { useRouter } from "next/navigation";
import { X, Clock } from "lucide-react";
import SearchBar from "@/components/SearchBar";
import { useRecentCities } from "@/hooks/useRecentCities";
import { getCitySlug } from "@/lib/geocoding";
import type { GeocodingResult } from "@/types/weather";

export default function HomeContent() {
  const router = useRouter();
  const { cities, addCity, removeCity, mounted } = useRecentCities();

  function handleSelect(result: GeocodingResult) {
    addCity({ slug: getCitySlug(result), name: result.name });
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl flex flex-col items-center gap-8">

        {/* Logo */}
        <div className="flex flex-col items-center gap-2 text-center">
          <h1
            className="text-5xl sm:text-6xl font-medium tracking-tight"
            style={{
              fontFamily: "var(--font-dm-mono)",
              color: "var(--accent-green)",
            }}
          >
            weather
          </h1>
          <p
            className="text-sm sm:text-base"
            style={{ color: "var(--text-secondary)" }}
          >
            Previsión detallada para cualquier ciudad del mundo
          </p>
        </div>

        {/* Search */}
        <div className="w-full">
          <SearchBar onSelect={handleSelect} />
        </div>

        {/* Recent cities */}
        {mounted && cities.length > 0 && (
          <section className="w-full flex flex-col gap-3">
            <div
              className="flex items-center gap-1.5 text-xs font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
              <Clock size={12} />
              <span>Últimas búsquedas</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {cities.map((city) => (
                <div
                  key={city.slug}
                  className="flex items-center gap-1 rounded-lg border pl-3 pr-1 py-1.5 text-sm transition-colors"
                  style={{
                    background: "var(--bg-secondary)",
                    borderColor: "var(--border)",
                  }}
                >
                  <button
                    onClick={() => router.push(`/${city.slug}`)}
                    className="hover:underline cursor-pointer"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {city.name}
                  </button>
                  <button
                    onClick={() => removeCity(city.slug)}
                    className="ml-1 rounded p-0.5 transition-colors cursor-pointer"
                    style={{ color: "var(--text-secondary)" }}
                    aria-label={`Eliminar ${city.name}`}
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </main>
  );
}
