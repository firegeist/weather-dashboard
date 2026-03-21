# Weather Dashboard Visual Identity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give the weather-dashboard a distinct visual identity with dynamic atmospheric themes that change based on the current weather state, while improving mobile layout.

**Architecture:** A `getAtmosphericState()` utility maps `weathercode + is_day` to one of 7 CSS class names (`atm-clear-day`, `atm-rain`, etc.). The class is applied to `<main>` server-side. Each class redefines `--accent` and `--card-tint` CSS custom properties, and sets a full-viewport background gradient. Components that previously hardcoded `var(--accent-green)` are updated to use `var(--accent)`.

**Tech Stack:** Next.js 14 App Router, TypeScript, Tailwind CSS v4, DM Mono + Inter (Google Fonts via `next/font`)

> **Note on testing:** This project has no test framework configured (`package.json` has no jest/vitest). All verification steps use `npm run lint` + visual inspection in the dev server. The `getAtmosphericState` function is pure and deterministic — its correctness can be verified by reading it.

---

## File Map

| File | Role in this plan |
|------|-------------------|
| `lib/utils.ts` | Add `getAtmosphericState(weathercode, is_day)` |
| `app/globals.css` | Foundation: `:root` defaults, 7 `.atm-*` classes, night starfield, `.w-card` tinting, Inter as body font, remove old `body::before` gradient |
| `app/layout.tsx` | Load Inter via `next/font/google` alongside DM Mono |
| `app/[city]/page.tsx` | Call `getAtmosphericState`, apply class to `<main>`, fix Row 2 mobile grid, fix back-link hover accent |
| `components/HomeContent.tsx` | Apply `atm-night` class, update title to Inter Bold white |
| `components/WeatherCard.tsx` | Temperature color → `var(--accent)`, font size → `clamp()` |
| `components/ForecastGrid.tsx` | "Hoy" highlight → `var(--card-tint)` + `var(--accent)` border |
| `components/SearchBar.tsx` | Replace `accent-green` references with `accent` |
| `components/WindCard.tsx` | Compass arrow → `var(--accent)` |

---

## Task 1: Add `getAtmosphericState` to `lib/utils.ts`

**Files:**
- Modify: `lib/utils.ts`

This is a pure function. No side effects. WMO code ranges: 0–1 clear, 2–3 cloudy, 45–48 fog, 51–67 drizzle/rain, 71–77 snow, 80–99 showers/storm (codes 80–82 are rain showers, 95–99 are thunderstorms — both map to `atm-storm` at night and `atm-rain` during day, except 95–99 always storm).

- [ ] **Step 1: Add the function at the end of `lib/utils.ts`**

```typescript
// ─── Atmospheric state ────────────────────────────────────────────────────────

/**
 * Maps Open-Meteo weathercode + is_day flag to an atmospheric CSS class name.
 * The class is applied to <main> to drive dynamic theming.
 *
 * WMO weathercode reference:
 *   0–1   → clear
 *   2–3   → cloudy
 *   45,48 → fog
 *   51–67 → drizzle / rain
 *   71–77 → snow
 *   80–82 → rain showers
 *   85–86 → snow showers
 *   95–99 → thunderstorm
 */
export function getAtmosphericState(weathercode: number, is_day: number): string {
  if (is_day === 0) return "atm-night";
  if (weathercode <= 1) return "atm-clear-day";
  if (weathercode <= 3) return "atm-cloudy-day";
  if (weathercode <= 48) return "atm-fog";
  if (weathercode <= 67) return "atm-rain";
  if (weathercode <= 77) return "atm-snow";
  if (weathercode <= 86) return "atm-rain";
  return "atm-storm"; // 95–99
}
```

- [ ] **Step 2: Verify lint passes**

```bash
cd weather-dashboard && npm run lint
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add lib/utils.ts
git commit -m "feat: add getAtmosphericState utility for dynamic weather theming"
```

---

## Task 2: CSS foundation — atmospheric themes in `globals.css`

**Files:**
- Modify: `app/globals.css`

This task establishes the entire CSS theming system. The existing `body::before` blue gradient is removed — each `.atm-*` class replaces it by setting a `background` directly on `<main>`. The `.w-card` base gets `--card-tint` support.

Key design notes:
- `background` on `.atm-*` includes a full gradient + `var(--bg-primary)` fallback so the dark base always shows
- Night starfield: `atm-night::before` uses multiple `radial-gradient` layers (CSS-only dots) with a `@keyframes star-pulse` animation
- `<main>` already has `position: relative; z-index: 1` in globals.css — `::before` with `z-index: 0` sits behind content naturally

- [ ] **Step 1: Replace the full contents of `app/globals.css`**

```css
@import "tailwindcss";

:root {
  --bg-primary: #0c0c0e;
  --bg-secondary: #111114;
  --bg-tertiary: #16161a;
  --accent-blue: #3b8bd4;
  --text-primary: #f0f0f0;
  --text-secondary: #8a8a8a;
  --border: rgba(255, 255, 255, 0.07);
  --border-strong: rgba(255, 255, 255, 0.12);
  --radius-card: 16px;

  /* Dynamic tokens — overridden by .atm-* classes */
  --accent: #7eb8f7;
  --card-tint: rgba(0, 0, 0, 0);
}

html, body {
  height: 100%;
}

body {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-family: var(--font-inter), ui-sans-serif, system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
}

/* Data values stay in monospace */
.mono {
  font-family: var(--font-dm-mono), ui-monospace, monospace;
}

/* Guarantees content appears above atmospheric overlays */
main {
  position: relative;
  z-index: 1;
}

/* ── Card base ── */
.w-card {
  background: color-mix(in srgb, var(--bg-secondary) 96%, var(--card-tint));
  border: 1px solid var(--border);
  border-radius: var(--radius-card);
  padding: 1.5rem;
}

/* ── Section label ── */
.w-label {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-secondary);
  margin-bottom: 0.75rem;
}

/* ── Mobile: padding reducido en pantallas pequeñas ── */
@media (max-width: 480px) {
  .w-card {
    padding: 1rem;
  }
}

/* ══════════════════════════════════════════════════════
   ATMOSPHERIC THEMES
   Each class is applied to <main> server-side.
   Sets --accent, --card-tint, and a background gradient.
   ══════════════════════════════════════════════════════ */

.atm-clear-day {
  --accent: #f5a623;
  --card-tint: rgba(245, 166, 35, 0.04);
  background:
    radial-gradient(ellipse 140% 55% at 50% -5%,
      rgba(245, 166, 35, 0.14) 0%,
      rgba(59, 139, 212, 0.10) 35%,
      transparent 65%),
    var(--bg-primary);
}

.atm-cloudy-day {
  --accent: #90b4ce;
  --card-tint: rgba(144, 180, 206, 0.04);
  background:
    radial-gradient(ellipse 130% 50% at 50% 0%,
      rgba(100, 130, 160, 0.12) 0%,
      transparent 60%),
    var(--bg-primary);
}

.atm-fog {
  --accent: #a0a8b8;
  --card-tint: rgba(160, 168, 184, 0.04);
  background:
    radial-gradient(ellipse 160% 60% at 50% 0%,
      rgba(140, 148, 170, 0.10) 0%,
      transparent 55%),
    var(--bg-primary);
}

.atm-rain {
  --accent: #5b9bd5;
  --card-tint: rgba(91, 155, 213, 0.04);
  background:
    radial-gradient(ellipse 100% 70% at 50% 100%,
      rgba(20, 50, 90, 0.25) 0%,
      transparent 60%),
    radial-gradient(ellipse 120% 40% at 50% 0%,
      rgba(40, 70, 110, 0.15) 0%,
      transparent 55%),
    var(--bg-primary);
}

.atm-snow {
  --accent: #89c4e1;
  --card-tint: rgba(137, 196, 225, 0.04);
  background:
    radial-gradient(ellipse 150% 55% at 50% -10%,
      rgba(180, 210, 230, 0.10) 0%,
      rgba(100, 150, 180, 0.07) 40%,
      transparent 65%),
    var(--bg-primary);
}

.atm-storm {
  --accent: #9b7fe8;
  --card-tint: rgba(155, 127, 232, 0.04);
  background:
    radial-gradient(ellipse 120% 65% at 50% 100%,
      rgba(40, 20, 80, 0.30) 0%,
      transparent 55%),
    radial-gradient(ellipse 100% 40% at 50% 0%,
      rgba(70, 40, 120, 0.18) 0%,
      transparent 50%),
    var(--bg-primary);
}

.atm-night {
  --accent: #7eb8f7;
  --card-tint: rgba(126, 184, 247, 0.04);
  background:
    radial-gradient(ellipse 140% 60% at 50% -5%,
      rgba(20, 30, 70, 0.60) 0%,
      rgba(10, 15, 40, 0.40) 40%,
      transparent 70%),
    var(--bg-primary);
}

/* Night starfield — 5 CSS-only star dots */
@keyframes star-pulse {
  from { opacity: 0.4; }
  to   { opacity: 0.9; }
}

.atm-night::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(1px 1px at 18% 10%, rgba(255,255,255,0.75) 0%, transparent 100%),
    radial-gradient(1px 1px at 72% 7%,  rgba(255,255,255,0.55) 0%, transparent 100%),
    radial-gradient(1px 1px at 48% 20%, rgba(255,255,255,0.45) 0%, transparent 100%),
    radial-gradient(1px 1px at 33% 4%,  rgba(255,255,255,0.65) 0%, transparent 100%),
    radial-gradient(1px 1px at 87% 16%, rgba(255,255,255,0.50) 0%, transparent 100%);
  pointer-events: none;
  z-index: 0;
  animation: star-pulse 4s ease-in-out infinite alternate;
}
```

> **Note on `.w-card` tinting:** `color-mix(in srgb, var(--bg-secondary) 96%, var(--card-tint))` is the cleanest way to blend the tint. Tailwind v4 + modern browsers support this. If you see browser compat issues, replace with: `background: var(--bg-secondary); box-shadow: inset 0 0 0 1000px var(--card-tint);` as fallback.

- [ ] **Step 2: Verify lint passes**

```bash
npm run lint
```

Expected: no errors.

- [ ] **Step 3: Start dev server and visually verify**

```bash
npm run dev
```

Open `http://localhost:3000`. The home page should now have a dark indigo atmospheric gradient (night theme). Cards should appear with the DM Mono data font intact.

- [ ] **Step 4: Commit**

```bash
git add app/globals.css
git commit -m "feat: add atmospheric theme system with 7 weather states"
```

---

## Task 3: Add Inter font to `layout.tsx`

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Update `layout.tsx` to load Inter alongside DM Mono**

```typescript
import type { Metadata } from "next";
import { DM_Mono, Inter } from "next/font/google";
import "./globals.css";

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Weather Dashboard",
  description: "Previsión meteorológica detallada",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${dmMono.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
```

- [ ] **Step 2: Verify lint and dev server**

```bash
npm run lint
```

Open `http://localhost:3000` — body text should now render in Inter (check browser dev tools: font for body should be Inter, not DM Mono).

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: add Inter font for UI text alongside DM Mono for data"
```

---

## Task 4: Apply atmospheric class in `[city]/page.tsx`

**Files:**
- Modify: `app/[city]/page.tsx`

Three changes: (1) import and call `getAtmosphericState`, (2) apply class to `<main>`, (3) fix Row 2 mobile grid + back link hover.

- [ ] **Step 1: Add import for `getAtmosphericState`**

In the imports section at the top, add:
```typescript
import { getAtmosphericState } from "@/lib/utils";
```

- [ ] **Step 2: Compute atmospheric class after weather data is fetched**

After the `const { current, today, hourly, daily } = forecast;` line, add:
```typescript
const atmClass = getAtmosphericState(current.weathercode, current.is_day);
```

> **Note:** Check that `current` has an `is_day` field. If it's missing from the `ProcessedForecast` type, read `types/weather.ts` and `lib/weather.ts` to verify the field name — it may be `isDay` (camelCase) instead of `is_day`. The Open-Meteo API returns `is_day` in the current weather object. Adjust accordingly.

- [ ] **Step 3: Apply atmospheric class to `<main>` and fix back link hover**

Change the opening `<main>` tag from:
```tsx
<main className="min-h-screen px-4 sm:px-6 py-6 sm:py-8 max-w-5xl mx-auto flex flex-col gap-4 sm:gap-6">
```
to:
```tsx
<main className={`${atmClass} min-h-screen px-4 sm:px-6 py-6 sm:py-8 max-w-5xl mx-auto flex flex-col gap-4 sm:gap-6`}>
```

Change the back link hover class from:
```tsx
className="hover:[color:var(--accent-green)]"
```
to:
```tsx
className="hover:[color:var(--accent)]"
```

- [ ] **Step 4: Fix Row 2 mobile grid**

Change the Row 2 grid div from:
```tsx
<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
```
to:
```tsx
<div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
```

Change the `PrecipitationChart` wrapper from:
```tsx
<div className="w-card">
  <PrecipitationChart data={hourly} />
</div>
```
to:
```tsx
<div className="w-card col-span-2 sm:col-span-1">
  <PrecipitationChart data={hourly} />
</div>
```

- [ ] **Step 5: Verify lint and visual check**

```bash
npm run lint
```

Open `http://localhost:3000/madrid-es` (or any valid city). The page should show a weather-appropriate atmospheric gradient. On a narrow viewport (375px), Wind and UV should be side-by-side with Precipitation full-width below.

- [ ] **Step 6: Commit**

```bash
git add "app/[city]/page.tsx"
git commit -m "feat: apply dynamic atmospheric class to city page, fix mobile grid"
```

---

## Task 5: Update `HomeContent.tsx` — night theme, Inter title

**Files:**
- Modify: `components/HomeContent.tsx`

- [ ] **Step 1: Apply `atm-night` class and update typography**

Change the outer `<main>` from:
```tsx
<main className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
```
to:
```tsx
<main className="atm-night min-h-screen flex flex-col items-center justify-center px-4 py-12">
```

Change the `<h1>` title from:
```tsx
<h1
  className="text-5xl sm:text-6xl font-medium tracking-tight"
  style={{
    fontFamily: "var(--font-dm-mono)",
    color: "var(--accent-green)",
  }}
>
  weather
</h1>
```
to:
```tsx
<h1
  className="text-5xl sm:text-6xl font-bold tracking-tight"
  style={{
    fontFamily: "var(--font-inter)",
    color: "var(--text-primary)",
  }}
>
  weather
</h1>
```

Change the subtitle `<p>` from:
```tsx
<p
  className="text-sm sm:text-base"
  style={{ color: "var(--text-secondary)" }}
>
```
to:
```tsx
<p
  className="text-sm sm:text-base"
  style={{ fontFamily: "var(--font-inter)", color: "var(--text-secondary)" }}
>
```

- [ ] **Step 2: Verify lint and visual**

```bash
npm run lint
```

Home page should show indigo night gradient, white Inter title "weather", no green accent.

- [ ] **Step 3: Commit**

```bash
git add components/HomeContent.tsx
git commit -m "feat: apply atm-night to home page, Inter title in white"
```

---

## Task 6: Update `WeatherCard.tsx` — dynamic accent, clamp temperature

**Files:**
- Modify: `components/WeatherCard.tsx`

- [ ] **Step 1: Replace fixed temperature color with `var(--accent)` and add clamp**

Remove the `tempColor` logic at the top of the component:
```typescript
// DELETE these lines:
const tempColor =
  current.temperature > 20 ? "var(--accent-green)" : "var(--accent-blue)";
```

Change the temperature `<span>` from:
```tsx
<span
  style={{
    fontFamily: "'DM Mono', monospace",
    fontSize: "4rem",
    fontWeight: 500,
    lineHeight: 1,
    color: tempColor,
  }}
>
```
to:
```tsx
<span
  style={{
    fontFamily: "var(--font-dm-mono)",
    fontSize: "clamp(2.5rem, 10vw, 4rem)",
    fontWeight: 500,
    lineHeight: 1,
    color: "var(--accent)",
  }}
>
```

Change the Max temp span from `color: "var(--accent-green)"` to `color: "var(--accent)"`.
Change the Min temp span from `color: "var(--accent-blue)"` to `color: "var(--text-secondary)"`.

- [ ] **Step 2: Verify lint**

```bash
npm run lint
```

- [ ] **Step 3: Commit**

```bash
git add components/WeatherCard.tsx
git commit -m "feat: WeatherCard temperature uses dynamic --accent and clamp() font size"
```

---

## Task 7: Update `ForecastGrid.tsx` — dynamic highlight

**Files:**
- Modify: `components/ForecastGrid.tsx`

- [ ] **Step 1: Replace hardcoded green in "Hoy" highlight and day label**

Find the day card style block for `index === 0`. Change:
```tsx
style={{
  background:
    index === 0
      ? "rgba(126,242,192,0.08)"
      : "var(--bg-tertiary)",
  border:
    index === 0
      ? "1px solid rgba(126,242,192,0.2)"
      : "1px solid var(--border)",
  ...
}}
```
to:
```tsx
style={{
  background: index === 0 ? "var(--card-tint)" : "var(--bg-tertiary)",
  border: index === 0
    ? "1px solid var(--accent)"
    : "1px solid var(--border)",
  ...
}}
```

Change the day label color:
```tsx
color: index === 0 ? "var(--accent-green)" : "var(--text-secondary)",
```
to:
```tsx
color: index === 0 ? "var(--accent)" : "var(--text-secondary)",
```

- [ ] **Step 2: Verify lint**

```bash
npm run lint
```

- [ ] **Step 3: Commit**

```bash
git add components/ForecastGrid.tsx
git commit -m "feat: ForecastGrid Hoy highlight uses dynamic --accent and --card-tint"
```

---

## Task 8: Update `SearchBar.tsx` — dynamic accent

**Files:**
- Modify: `components/SearchBar.tsx`

- [ ] **Step 1: Replace three `accent-green` references**

1. Search input wrapper — change Tailwind class:
   ```tsx
   // FROM:
   className="flex items-center gap-2 rounded-xl border px-4 py-3 transition-colors focus-within:border-[var(--accent-green)]"
   // TO:
   className="flex items-center gap-2 rounded-xl border px-4 py-3 transition-colors focus-within:border-[var(--accent)]"
   ```

2. MapPin icon in dropdown results — change:
   ```tsx
   // FROM: style={{ color: "var(--accent-green)" }}
   // TO:
   style={{ color: "var(--accent)" }}
   ```

3. Geolocation button — change both `color` references:
   ```tsx
   // FROM: color: geoLoading ? "var(--text-secondary)" : "var(--accent-green)",
   // TO:
   color: geoLoading ? "var(--text-secondary)" : "var(--accent)",
   ```

   And the button hover class:
   ```tsx
   // FROM: hover:border-[var(--accent-green)]
   // TO: hover:border-[var(--accent)]
   ```

- [ ] **Step 2: Verify lint**

```bash
npm run lint
```

- [ ] **Step 3: Commit**

```bash
git add components/SearchBar.tsx
git commit -m "feat: SearchBar uses dynamic --accent instead of hardcoded green"
```

---

## Task 9: Update `WindCard.tsx` — dynamic compass arrow

**Files:**
- Modify: `components/WindCard.tsx`

- [ ] **Step 1: Replace compass arrow color**

In the SVG, change the arrow shaft and arrowhead from `var(--accent-blue)` to `var(--accent)`:

```tsx
// Arrow shaft — change stroke:
stroke="var(--accent)"

// Arrowhead — change fill:
fill="var(--accent)"
```

- [ ] **Step 2: Verify lint**

```bash
npm run lint
```

- [ ] **Step 3: Visual check — open a city page and inspect the WindCard**

The compass arrow color should now match the atmospheric accent of the current weather state.

- [ ] **Step 4: Commit**

```bash
git add components/WindCard.tsx
git commit -m "feat: WindCard compass arrow uses dynamic --accent"
```

---

## Task 10: Final verification

- [ ] **Step 1: Full lint run**

```bash
npm run lint
```

Expected: zero errors.

- [ ] **Step 2: Production build check**

```bash
npm run build
```

Expected: successful build, no TypeScript errors.

- [ ] **Step 3: Visual spot-check across weather states**

Test these URLs in the dev server to verify each atmospheric theme renders correctly:
- Home page → night gradient, white Inter title
- A city page → weather-appropriate gradient applied
- Resize to 375px width → Row 2 shows Wind+UV side by side, Precipitation full width below

- [ ] **Step 4: Verify `--accent-green` is fully removed from all modified components**

```bash
grep -r "accent-green" app/ components/
```

Expected: no results (only `globals.css` may retain the variable declaration if kept for backwards compat — but it should not appear in component files).

- [ ] **Step 5: Commit if any minor fixups were made, then tag**

```bash
git add -A
git commit -m "chore: final polish and verification for weather identity redesign"
```
