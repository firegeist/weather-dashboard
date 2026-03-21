import type { ProcessedForecast } from "@/types/weather";
import { getWMODescription } from "@/lib/weather";
import { formatTemperature } from "@/lib/utils";
import WeatherIcon from "@/components/WeatherIcon";

interface WeatherCardProps {
  current: ProcessedForecast["current"];
  today: ProcessedForecast["today"];
}

export default function WeatherCard({ current, today }: WeatherCardProps) {
  const { label } = getWMODescription(current.weathercode);
  const tempColor =
    current.temperature > 20 ? "var(--accent-green)" : "var(--accent-blue)";

  return (
    <div
      style={{
        background: "var(--bg-secondary)",
        border: "1px solid var(--border)",
        borderRadius: "16px",
        padding: "1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
      }}
    >
      {/* Icon + temperature */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <WeatherIcon code={current.weathercode} size="lg" />
        <span
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "4rem",
            fontWeight: 500,
            lineHeight: 1,
            color: tempColor,
          }}
        >
          {formatTemperature(current.temperature)}
        </span>
      </div>

      {/* Description */}
      <p
        style={{
          color: "var(--text-primary)",
          fontSize: "1.125rem",
          margin: 0,
        }}
      >
        {label}
      </p>

      {/* Feels like — hidden when null */}
      {current.feelsLike !== null && (
        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: "0.875rem",
            margin: 0,
          }}
        >
          Sensación térmica: {formatTemperature(current.feelsLike)}
        </p>
      )}

      {/* Max / Min */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginTop: "0.25rem",
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.9rem",
        }}
      >
        <span style={{ color: "var(--accent-green)" }}>
          ↑ {formatTemperature(today.tempMax)}
        </span>
        <span style={{ color: "var(--accent-blue)" }}>
          ↓ {formatTemperature(today.tempMin)}
        </span>
      </div>
    </div>
  );
}
