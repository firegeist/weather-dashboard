import { getUVLabel, formatTime } from "@/lib/utils";

interface UVIndexProps {
  uvIndexMax: number;
  sunrise: string;
  sunset: string;
}

const UV_SEGMENTS = [
  { label: "Bajo",     max: 3,  color: "#7ef2c0" },
  { label: "Moderado", max: 6,  color: "#facc15" },
  { label: "Alto",     max: 8,  color: "#fb923c" },
  { label: "Muy alto", max: 11, color: "#f87171" },
  { label: "Extremo",  max: Infinity, color: "#c084fc" },
] as const;

function barColor(uvi: number): string {
  return UV_SEGMENTS.find((s) => uvi < s.max)?.color ?? "#c084fc";
}

export default function UVIndex({ uvIndexMax, sunrise, sunset }: UVIndexProps) {
  const { label } = getUVLabel(uvIndexMax);
  const fillPercent = Math.min((uvIndexMax / 11) * 100, 100);
  const color = barColor(uvIndexMax);

  return (
    <div
      style={{
        background: "var(--bg-secondary)",
        border: "1px solid var(--border)",
        borderRadius: "16px",
        padding: "1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <p
        style={{
          margin: 0,
          color: "var(--text-secondary)",
          fontSize: "0.75rem",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        Índice UV
      </p>

      {/* Value + label */}
      <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem" }}>
        <span
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "3rem",
            fontWeight: 500,
            lineHeight: 1,
            color,
          }}
        >
          {Math.round(uvIndexMax)}
        </span>
        <span
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "1rem",
            color,
          }}
        >
          {label}
        </span>
      </div>

      {/* Progress bar */}
      <div>
        <div
          style={{
            height: "6px",
            borderRadius: "3px",
            background: "rgba(255,255,255,0.07)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${fillPercent}%`,
              borderRadius: "3px",
              background: color,
              transition: "width 0.3s ease",
            }}
          />
        </div>

        {/* Scale labels */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "0.35rem",
          }}
        >
          {UV_SEGMENTS.slice(0, 4).map((s) => (
            <span
              key={s.label}
              style={{
                fontSize: "0.6rem",
                color: "var(--text-secondary)",
                fontFamily: "'DM Mono', monospace",
              }}
            >
              {s.label}
            </span>
          ))}
        </div>
      </div>

      {/* Sunrise / Sunset */}
      <div
        style={{
          display: "flex",
          gap: "1.25rem",
          borderTop: "1px solid var(--border)",
          paddingTop: "0.75rem",
        }}
      >
        <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
          🌅{" "}
          <span style={{ fontFamily: "'DM Mono', monospace", color: "var(--text-primary)" }}>
            {formatTime(sunrise)}
          </span>
        </span>
        <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
          🌇{" "}
          <span style={{ fontFamily: "'DM Mono', monospace", color: "var(--text-primary)" }}>
            {formatTime(sunset)}
          </span>
        </span>
      </div>
    </div>
  );
}
