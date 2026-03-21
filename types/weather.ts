// ─── Open-Meteo API response types ──────────────────────────────────────────

export interface CurrentWeather {
  temperature: number;
  windspeed: number;
  winddirection: number;
  weathercode: number;
  is_day: 0 | 1;
  time: string;
}

/** Raw hourly arrays returned by Open-Meteo */
export interface HourlyData {
  time: string[];
  temperature_2m: number[];
  precipitation_probability: number[];
  weathercode: number[];
  windspeed_10m: number[];
  uv_index: number[];
  apparent_temperature: number[];
}

/** Raw daily arrays returned by Open-Meteo */
export interface DailyData {
  time: string[];
  weathercode: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_sum: number[];
  windspeed_10m_max: number[];
  sunrise: string[];
  sunset: string[];
}

/** Top-level response from GET /v1/forecast */
export interface WeatherResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_weather: CurrentWeather;
  hourly_units: HourlyUnits;
  hourly: HourlyData;
  daily_units: DailyUnits;
  daily: DailyData;
}

export interface HourlyUnits {
  time: string;
  temperature_2m: string;
  precipitation_probability: string;
  weathercode: string;
  windspeed_10m: string;
  uv_index: string;
}

export interface DailyUnits {
  time: string;
  weathercode: string;
  temperature_2m_max: string;
  temperature_2m_min: string;
  precipitation_sum: string;
  windspeed_10m_max: string;
  sunrise: string;
  sunset: string;
}

// ─── Geocoding API types ─────────────────────────────────────────────────────

/** Single result from GET geocoding-api.open-meteo.com/v1/search */
export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation: number;
  feature_code: string;
  country_code: string;
  country: string;
  country_id: number;
  population?: number;
  postcodes?: string[];
  admin1?: string;
  admin2?: string;
  admin3?: string;
  admin4?: string;
  admin1_id?: number;
  admin2_id?: number;
  admin3_id?: number;
  admin4_id?: number;
  timezone: string;
}

export interface GeocodingResponse {
  results?: GeocodingResult[];
  generationtime_ms: number;
}

// ─── Processed / component-ready types ──────────────────────────────────────

/** One hourly slot transformed for chart components */
export interface HourlyForecastPoint {
  time: string;           // ISO datetime string
  hour: string;           // formatted label, e.g. "14:00"
  temperature: number;
  precipitationProbability: number;
  weathercode: number;
  windspeed: number;
  uvIndex: number;
}

/** One daily slot transformed for the 7-day grid */
export interface DailyForecastDay {
  date: string;           // ISO date string, e.g. "2024-03-21"
  label: string;          // formatted label, e.g. "Jue"
  weathercode: number;
  tempMax: number;
  tempMin: number;
  precipitationSum: number;
  windspeedMax: number;
  sunrise: string;        // ISO datetime string
  sunset: string;         // ISO datetime string
}

/** Full processed forecast consumed by page/dashboard components */
export interface ProcessedForecast {
  city: string;
  latitude: number;
  longitude: number;
  timezone: string;
  current: {
    temperature: number;
    feelsLike: number | null;   // not in Open-Meteo free tier; null when unavailable
    weathercode: number;
    windspeed: number;
    winddirection: number;
    isDay: boolean;
  };
  today: {
    tempMax: number;
    tempMin: number;
    precipitationSum: number;
    sunrise: string;
    sunset: string;
    uvIndexMax: number;
  };
  hourly: HourlyForecastPoint[];   // next 24 h
  daily: DailyForecastDay[];       // 7 days
}

// ─── Aliases kept for backward compatibility with scaffold ──────────────────

/** @deprecated Use HourlyData */
export type HourlyWeather = HourlyData;
/** @deprecated Use DailyData */
export type DailyWeather = DailyData;
/** @deprecated Use WeatherResponse */
export type WeatherData = WeatherResponse;
