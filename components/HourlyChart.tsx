"use client";

import {
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { HourlyForecastPoint } from "@/types/weather";
import { getWMODescription } from "@/lib/weather";

interface HourlyChartProps {
  data: HourlyForecastPoint[];
}

interface TooltipPayloadEntry {
  value: number;
  payload: HourlyForecastPoint;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  const { emoji } = getWMODescription(point.weathercode);

  return (
    <div
      style={{
        background: "#16161a",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "8px",
        padding: "0.5rem 0.75rem",
        fontFamily: "'DM Mono', monospace",
        fontSize: "0.8rem",
        color: "var(--text-primary)",
        lineHeight: 1.6,
      }}
    >
      <div style={{ color: "var(--text-secondary)" }}>{point.hour}</div>
      <div style={{ color: "var(--accent-green)", fontWeight: 500 }}>
        {Math.round(point.temperature)}°C
      </div>
      <div>{emoji}</div>
    </div>
  );
}

export default function HourlyChart({ data }: HourlyChartProps) {
  const chartData = data.map((p) => ({
    ...p,
    label: p.hour.replace(":00", "h").replace(":30", "h"),
  }));

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
        Temperatura · próximas 24h
      </p>

      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={chartData} margin={{ top: 8, right: 4, left: 4, bottom: 0 }}>
          <defs>
            <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7ef2c0" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#7ef2c0" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            vertical={false}
            stroke="rgba(255,255,255,0.1)"
            strokeDasharray="0"
          />

          <XAxis
            dataKey="label"
            tick={{
              fill: "var(--text-secondary)",
              fontSize: 11,
              fontFamily: "'DM Mono', monospace",
            }}
            axisLine={false}
            tickLine={false}
            interval={3}
          />

          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(255,255,255,0.1)", strokeWidth: 1 }} />

          <Area
            type="monotone"
            dataKey="temperature"
            stroke="#7ef2c0"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: "#7ef2c0", strokeWidth: 0 }}
            fill="url(#tempGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </section>
  );
}
