import type {
  WeatherResponse,
  ProcessedForecast,
  HourlyForecastPoint,
  DailyForecastDay,
} from "@/types/weather";

// ─── Open-Meteo endpoints ────────────────────────────────────────────────────

const FORECAST_BASE = "https://api.open-meteo.com/v1/forecast";

const HOURLY_PARAMS =
  "temperature_2m,precipitation_probability,weathercode,windspeed_10m,uv_index";
const DAILY_PARAMS =
  "weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max,sunrise,sunset";

// ─── WMO weather code map ────────────────────────────────────────────────────

interface WMOEntry {
  label: string;
  emoji: string;
}

const WMO_MAP: Record<number, WMOEntry> = {
  0:  { label: "Despejado",            emoji: "☀️"  },
  1:  { label: "Mayormente despejado", emoji: "🌤️" },
  2:  { label: "Parcialmente nublado", emoji: "⛅"  },
  3:  { label: "Nublado",              emoji: "☁️"  },
  45: { label: "Niebla",               emoji: "🌫️" },
  48: { label: "Niebla con escarcha",  emoji: "🌫️" },
  51: { label: "Llovizna ligera",      emoji: "🌦️" },
  53: { label: "Llovizna moderada",    emoji: "🌦️" },
  55: { label: "Llovizna densa",       emoji: "🌦️" },
  61: { label: "Lluvia ligera",        emoji: "🌧️" },
  63: { label: "Lluvia moderada",      emoji: "🌧️" },
  65: { label: "Lluvia intensa",       emoji: "🌧️" },
  71: { label: "Nieve ligera",         emoji: "❄️"  },
  73: { label: "Nieve moderada",       emoji: "❄️"  },
  75: { label: "Nieve intensa",        emoji: "❄️"  },
  80: { label: "Chubascos ligeros",    emoji: "🌦️" },
  81: { label: "Chubascos moderados",  emoji: "🌧️" },
  82: { label: "Chubascos violentos",  emoji: "🌧️" },
  95: { label: "Tormenta",             emoji: "⛈️"  },
  96: { label: "Tormenta con granizo", emoji: "⛈️"  },
  99: { label: "Tormenta con granizo intenso", emoji: "⛈️" },
};

const WMO_FALLBACK: WMOEntry = { label: "Desconocido", emoji: "🌡️" };

export function getWMODescription(code: number): WMOEntry {
  return WMO_MAP[code] ?? WMO_FALLBACK;
}

// ─── Data fetching ───────────────────────────────────────────────────────────

export async function getWeatherData(
  lat: number,
  lon: number,
  city = "Unknown"
): Promise<ProcessedForecast> {
  const url = new URL(FORECAST_BASE);
  url.searchParams.set("latitude", String(lat));
  url.searchParams.set("longitude", String(lon));
  url.searchParams.set("hourly", HOURLY_PARAMS);
  url.searchParams.set("daily", DAILY_PARAMS);
  url.searchParams.set("current_weather", "true");
  url.searchParams.set("timezone", "auto");
  url.searchParams.set("forecast_days", "7");

  let raw: WeatherResponse;

  try {
    const res = await fetch(url.toString(), { next: { revalidate: 1800 } });

    if (!res.ok) {
      throw new Error(
        `Open-Meteo respondió con estado ${res.status} (${res.statusText}) para lat=${lat}, lon=${lon}`
      );
    }

    raw = (await res.json()) as WeatherResponse;
  } catch (err) {
    if (err instanceof Error) throw err;
    throw new Error(
      `Error de red al obtener datos meteorológicos para lat=${lat}, lon=${lon}`
    );
  }

  return transformForecast(raw, city);
}

// ─── Transformation ──────────────────────────────────────────────────────────

function transformForecast(raw: WeatherResponse, city: string): ProcessedForecast {
  const { current_weather, hourly, daily } = raw;

  // ── Today's index (first element of daily arrays) ──
  const todayIndex = 0;

  // ── UV index max for today from hourly data ──
  const todayDatePrefix = daily.time[todayIndex]; // "2024-03-21"
  const todayUVValues = hourly.uv_index.filter((_, i) =>
    hourly.time[i].startsWith(todayDatePrefix)
  );
  const uvIndexMax =
    todayUVValues.length > 0 ? Math.max(...todayUVValues) : 0;

  // ── Next 24 hourly slots starting from current hour ──
  const nowPrefix = current_weather.time.slice(0, 13); // "2024-03-21T14"
  const startIdx = hourly.time.findIndex((t) => t.slice(0, 13) >= nowPrefix);
  const sliceStart = startIdx === -1 ? 0 : startIdx;
  const sliceEnd = Math.min(sliceStart + 24, hourly.time.length);

  const hourlyPoints: HourlyForecastPoint[] = [];
  for (let i = sliceStart; i < sliceEnd; i++) {
    hourlyPoints.push({
      time: hourly.time[i],
      hour: hourly.time[i].slice(11, 16), // "HH:MM"
      temperature: hourly.temperature_2m[i],
      precipitationProbability: hourly.precipitation_probability[i],
      weathercode: hourly.weathercode[i],
      windspeed: hourly.windspeed_10m[i],
      uvIndex: hourly.uv_index[i],
    });
  }

  // ── 7-day daily forecast ──
  const dailyDays: DailyForecastDay[] = daily.time.map((dateStr, i) => {
    const label = new Intl.DateTimeFormat("es-ES", {
      weekday: "short",
      day: "numeric",
      timeZone: raw.timezone,
    }).format(new Date(`${dateStr}T12:00:00`));

    return {
      date: dateStr,
      label,
      weathercode: daily.weathercode[i],
      tempMax: daily.temperature_2m_max[i],
      tempMin: daily.temperature_2m_min[i],
      precipitationSum: daily.precipitation_sum[i],
      windspeedMax: daily.windspeed_10m_max[i],
      sunrise: daily.sunrise[i],
      sunset: daily.sunset[i],
    };
  });

  return {
    city,
    latitude: raw.latitude,
    longitude: raw.longitude,
    timezone: raw.timezone,
    current: {
      temperature: current_weather.temperature,
      feelsLike: null,
      weathercode: current_weather.weathercode,
      windspeed: current_weather.windspeed,
      winddirection: current_weather.winddirection,
      isDay: current_weather.is_day === 1,
    },
    today: {
      tempMax: daily.temperature_2m_max[todayIndex],
      tempMin: daily.temperature_2m_min[todayIndex],
      precipitationSum: daily.precipitation_sum[todayIndex],
      sunrise: daily.sunrise[todayIndex],
      sunset: daily.sunset[todayIndex],
      uvIndexMax,
    },
    hourly: hourlyPoints,
    daily: dailyDays,
  };
}
