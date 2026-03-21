"use client";

import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import type { HourlyForecastPoint } from "@/types/weather";

interface PrecipitationChartProps {
  data: HourlyForecastPoint[];
}

interface TooltipPayloadEntry {
  value: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
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
      <div style={{ color: "var(--text-secondary)" }}>{label}</div>
      <div style={{ color: "var(--accent-blue)", fontWeight: 500 }}>
        {payload[0].value}% de lluvia
      </div>
    </div>
  );
}

export default function PrecipitationChart({ data }: PrecipitationChartProps) {
  const chartData = data.map((p) => ({
    label: p.hour.replace(":00", "h").replace(":30", "h"),
    probability: p.precipitationProbability,
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
        Probabilidad de lluvia · hoy
      </p>

      <ResponsiveContainer width="100%" height={140}>
        <BarChart data={chartData} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
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

          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "rgba(255,255,255,0.04)" }}
          />

          <Bar dataKey="probability" radius={[3, 3, 0, 0]} maxBarSize={16}>
            {chartData.map((_, i) => (
              <Cell key={i} fill="#3b8bd4" />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </section>
  );
}
