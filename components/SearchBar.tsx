"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Search, Loader2 } from "lucide-react";
import { searchCities, getCitySlug } from "@/lib/geocoding";
import { useGeolocation } from "@/hooks/useGeolocation";
import type { GeocodingResult } from "@/types/weather";

interface SearchBarProps {
  onSelect?: (result: GeocodingResult) => void;
}

export default function SearchBar({ onSelect }: SearchBarProps) {
  const router = useRouter();
  const {
    latitude,
    longitude,
    loading: geoLoading,
    error: geoError,
    request: requestGeo,
  } = useGeolocation();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [open, setOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Debounced search ────────────────────────────────────────────────────────
  // Synchronous resets live in onChange (not in effect) to satisfy react-hooks/set-state-in-effect.
  useEffect(() => {
    if (!query.trim()) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      const data = await searchCities(query);
      setResults(data);
      setOpen(data.length > 0);
      setSearching(false);
      setActiveIndex(-1);
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  // ── Navigate after geolocation resolves ────────────────────────────────────
  useEffect(() => {
    if (latitude !== null && longitude !== null) {
      const lat = latitude.toFixed(4);
      const lon = longitude.toFixed(4);
      router.push(`/geo-${lat}-${lon}`);
    }
  }, [latitude, longitude, router]);

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const selectResult = useCallback(
    (result: GeocodingResult) => {
      setOpen(false);
      setQuery("");
      onSelect?.(result);
      router.push(`/${getCitySlug(result)}`);
    },
    [router, onSelect]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, results.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
        break;
      case "Enter":
        e.preventDefault();
        if (activeIndex >= 0 && results[activeIndex]) {
          selectResult(results[activeIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setOpen(false);
        setActiveIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="w-full max-w-xl mx-auto flex flex-col gap-3">

      {/* Search input */}
      <div className="relative">
        <div
          className="flex items-center gap-2 rounded-xl border px-4 py-3 transition-colors focus-within:border-[var(--accent-green)]"
          style={{
            background: "var(--bg-secondary)",
            borderColor: "var(--border)",
          }}
        >
          {searching ? (
            <Loader2
              size={16}
              className="shrink-0 animate-spin"
              style={{ color: "var(--text-secondary)" }}
            />
          ) : (
            <Search
              size={16}
              className="shrink-0"
              style={{ color: "var(--text-secondary)" }}
            />
          )}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              const value = e.target.value;
              setQuery(value);
              if (!value.trim()) {
                if (debounceRef.current) clearTimeout(debounceRef.current);
                setResults([]);
                setOpen(false);
                setSearching(false);
              } else {
                setSearching(true);
              }
            }}
            onKeyDown={handleKeyDown}
            onBlur={() => setTimeout(() => setOpen(false), 150)}
            onFocus={() => results.length > 0 && setOpen(true)}
            placeholder="Buscar ciudad..."
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-[var(--text-secondary)]"
            style={{ color: "var(--text-primary)" }}
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={open}
            aria-controls="search-listbox"
            aria-haspopup="listbox"
            aria-activedescendant={
              activeIndex >= 0 ? `result-${activeIndex}` : undefined
            }
          />
        </div>

        {/* Dropdown */}
        {open && (
          <ul
            id="search-listbox"
            role="listbox"
            className="absolute z-50 w-full mt-1 rounded-xl border overflow-hidden shadow-xl"
            style={{
              background: "var(--bg-tertiary)",
              borderColor: "var(--border)",
            }}
          >
            {results.map((result, i) => (
              <li
                key={result.id}
                id={`result-${i}`}
                role="option"
                aria-selected={i === activeIndex}
                onMouseDown={() => selectResult(result)}
                onMouseEnter={() => setActiveIndex(i)}
                className="flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors"
                style={{
                  background:
                    i === activeIndex ? "var(--bg-secondary)" : undefined,
                }}
              >
                <MapPin
                  size={13}
                  className="shrink-0"
                  style={{ color: "var(--accent-green)" }}
                />
                <div className="flex flex-col min-w-0">
                  <span
                    className="text-sm font-medium truncate"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {result.name}
                  </span>
                  <span
                    className="text-xs truncate"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {[result.admin1, result.country].filter(Boolean).join(", ")}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Geolocation button */}
      <button
        onClick={requestGeo}
        disabled={geoLoading}
        className="flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed hover:border-[var(--accent-green)]"
        style={{
          background: "var(--bg-secondary)",
          borderColor: "var(--border)",
          color: geoLoading ? "var(--text-secondary)" : "var(--accent-green)",
        }}
      >
        {geoLoading ? (
          <Loader2 size={15} className="animate-spin" />
        ) : (
          <MapPin size={15} />
        )}
        {geoLoading ? "Obteniendo ubicación..." : "Usar mi ubicación"}
      </button>

      {/* Geolocation error */}
      {geoError && (
        <p className="text-xs text-center" style={{ color: "#f87171" }}>
          {geoError}
        </p>
      )}
    </div>
  );
}
