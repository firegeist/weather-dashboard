// Skeleton shown by Next.js while the CityPage Server Component is loading.
// Mirrors the exact grid/flex structure of app/[city]/page.tsx.

const SkeletonBlock = ({
  className = "",
  style = {},
}: {
  className?: string;
  style?: React.CSSProperties;
}) => (
  <div
    className={`animate-pulse rounded-xl ${className}`}
    style={{ background: "var(--bg-tertiary)", ...style }}
  />
);

export default function CityLoading() {
  return (
    <main className="min-h-screen px-4 py-8 max-w-5xl mx-auto flex flex-col gap-6">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-4">
          <SkeletonBlock style={{ width: 64, height: 16 }} />
          <SkeletonBlock style={{ width: 160, height: 24 }} />
        </div>
        <SkeletonBlock style={{ width: 96, height: 12 }} />
      </div>

      {/* ── Row 1: WeatherCard + Charts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: current conditions card */}
        <SkeletonBlock style={{ minHeight: 280 }} />

        {/* Right: two charts stacked */}
        <div className="flex flex-col gap-4">
          <SkeletonBlock style={{ height: 160 }} />
          <SkeletonBlock style={{ height: 160 }} />
        </div>
      </div>

      {/* ── Row 2: 7-day forecast ── */}
      <div
        className="rounded-2xl p-6"
        style={{
          background: "var(--bg-secondary)",
          border: "1px solid var(--border)",
        }}
      >
        <SkeletonBlock style={{ width: 120, height: 14, marginBottom: "1rem" }} />
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <SkeletonBlock key={i} style={{ height: 80 }} />
          ))}
        </div>
      </div>

      {/* ── Row 3: Wind + UV ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <SkeletonBlock style={{ height: 140 }} />
        <SkeletonBlock style={{ height: 140 }} />
      </div>

    </main>
  );
}
