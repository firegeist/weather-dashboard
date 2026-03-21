import type { WeatherData } from "@/types/weather";

export async function getWeather(
  latitude: number,
  longitude: number
): Promise<WeatherData> {
  throw new Error("Not implemented");
}
