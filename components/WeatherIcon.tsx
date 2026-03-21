import { getWMODescription } from "@/lib/weather";

const SIZE_MAP = {
  sm: "1.5rem",
  md: "3rem",
  lg: "5rem",
} as const;

interface WeatherIconProps {
  code: number;
  size?: "sm" | "md" | "lg";
}

export default function WeatherIcon({ code, size = "md" }: WeatherIconProps) {
  const { emoji } = getWMODescription(code);
  return (
    <span style={{ fontSize: SIZE_MAP[size], lineHeight: 1 }} role="img" aria-label={getWMODescription(code).label}>
      {emoji}
    </span>
  );
}
