import type { DailyForecastDay } from "@/types/weather";
import WeatherIcon from "@/components/WeatherIcon";
import { formatTemperature } from "@/lib/utils";

interface ForecastGridProps {
  days: DailyForecastDay[];
}

export default function ForecastGrid({ days }: ForecastGridProps) {
  return (
    <section>
      <p
        style={{
          margin: "0 0 0.75rem",
          color: "var(--text-secondary)",
          fontSize: "0.75rem",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        Previsión 7 días
      </p>

      {/* Outer wrapper enables horizontal scroll on mobile */}
      <div style={{ overflowX: "auto", paddingBottom: "4px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, minmax(80px, 1fr))",
            gap: "0.5rem",
            minWidth: "560px",
          }}
        >
          {days.map((day, index) => (
            <div
              key={day.date}
              style={{
                background: index === 0
                  ? "color-mix(in srgb, var(--bg-tertiary) 90%, var(--card-tint))"
                  : "var(--bg-tertiary)",
                border:
                  index === 0
                    ? "1px solid var(--accent)"
                    : "1px solid var(--border)",
                borderRadius: "12px",
                padding: "0.75rem 0.5rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.4rem",
                textAlign: "center",
              }}
            >
              {/* Day label */}
              <span
                style={{
                  color: index === 0 ? "var(--accent)" : "var(--text-secondary)",
                  fontSize: "0.7rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  fontWeight: index === 0 ? 600 : 400,
                }}
              >
                {index === 0 ? "Hoy" : day.label}
              </span>

              <WeatherIcon code={day.weathercode} size="sm" />

              {/* Max temp */}
              <span
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.9rem",
                  color: "var(--text-primary)",
                  lineHeight: 1,
                }}
              >
                {formatTemperature(day.tempMax)}
              </span>

              {/* Min temp */}
              <span
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.8rem",
                  color: "var(--text-secondary)",
                  lineHeight: 1,
                }}
              >
                {formatTemperature(day.tempMin)}
              </span>

              {/* Precipitation */}
              {day.precipitationSum > 0 && (
                <span
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.7rem",
                    color: "var(--accent-blue)",
                  }}
                >
                  {day.precipitationSum.toFixed(1)} mm
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
