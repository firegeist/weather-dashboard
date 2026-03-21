"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "weather-recent-cities";
const MAX_CITIES = 5;

export interface RecentCity {
  slug: string;
  name: string;
}

function readFromStorage(): RecentCity[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as RecentCity[];
  } catch {
    return [];
  }
}

function writeToStorage(cities: RecentCity[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cities));
  } catch {
    // localStorage may be blocked; fail silently
  }
}

export function useRecentCities() {
  const [cities, setCities] = useState<RecentCity[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = readFromStorage();
    if (stored.length > 0) setCities(stored);
  }, []);

  const addCity = useCallback((city: RecentCity) => {
    setCities((prev) => {
      // Move to front if already present, otherwise prepend; keep max 5
      const filtered = prev.filter((c) => c.slug !== city.slug);
      const next = [city, ...filtered].slice(0, MAX_CITIES);
      writeToStorage(next);
      return next;
    });
  }, []);

  const removeCity = useCallback((slug: string) => {
    setCities((prev) => {
      const next = prev.filter((c) => c.slug !== slug);
      writeToStorage(next);
      return next;
    });
  }, []);

  return { cities, addCity, removeCity, mounted };
}
