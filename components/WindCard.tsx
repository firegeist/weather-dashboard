import { formatWind } from "@/lib/utils";

interface WindCardProps {
  windspeed: number;
  winddirection: number;
  windspeedMax: number;
}

const CARDINAL_LABELS = ["N", "NE", "E", "SE", "S", "SO", "O", "NO"] as const;

function toCardinal(degrees: number): string {
  const index = Math.round(((degrees % 360) + 360) % 360 / 45) % 8;
  return CARDINAL_LABELS[index];
}

export default function WindCard({ windspeed, winddirection, windspeedMax }: WindCardProps) {
  const cardinal = toCardinal(winddirection);

  // Arrow points in the direction the wind is blowing TO.
  // SVG default: arrow points up (north = 0°). Rotate clockwise by winddirection.
  const arrowRotation = winddirection;

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
        Viento
      </p>

      <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
        {/* Compass */}
        <svg
          width="80"
          height="80"
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label={`Dirección del viento: ${cardinal}`}
        >
          {/* Outer ring */}
          <circle
            cx="40"
            cy="40"
            r="36"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth="1.5"
          />
          {/* Inner ring */}
          <circle
            cx="40"
            cy="40"
            r="28"
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="1"
          />
          {/* Cardinal tick marks */}
          {[0, 90, 180, 270].map((angle) => {
            const rad = ((angle - 90) * Math.PI) / 180;
            const x1 = 40 + 28 * Math.cos(rad);
            const y1 = 40 + 28 * Math.sin(rad);
            const x2 = 40 + 36 * Math.cos(rad);
            const y2 = 40 + 36 * Math.sin(rad);
            return (
              <line
                key={angle}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="rgba(255,255,255,0.25)"
                strokeWidth="1.5"
              />
            );
          })}
          {/* Directional arrow — rotates to wind direction */}
          <g transform={`rotate(${arrowRotation}, 40, 40)`}>
            {/* Arrow shaft */}
            <line
              x1="40"
              y1="52"
              x2="40"
              y2="22"
              stroke="var(--accent-blue)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* Arrowhead */}
            <polygon
              points="40,14 35,24 45,24"
              fill="var(--accent-blue)"
            />
            {/* Tail dot */}
            <circle cx="40" cy="54" r="2.5" fill="rgba(255,255,255,0.3)" />
          </g>
        </svg>

        {/* Speed + direction text */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <span
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "2rem",
              fontWeight: 500,
              color: "var(--text-primary)",
              lineHeight: 1,
            }}
          >
            {formatWind(windspeed)}
          </span>
          <span
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "1rem",
              color: "var(--text-secondary)",
            }}
          >
            {cardinal}
          </span>
          <span
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.75rem",
              color: "var(--text-secondary)",
              marginTop: "0.25rem",
            }}
          >
            Máx. hoy: {formatWind(windspeedMax)}
          </span>
        </div>
      </div>
    </div>
  );
}
