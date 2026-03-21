# Weather Dashboard — Visual Identity & Mobile-First Redesign

**Date:** 2026-03-21
**Status:** Approved

## Goal

Give the weather-dashboard its own visual identity, distinct from the portfolio (joseherranz.dev). The portfolio uses a fixed green accent (`#7ef2c0`) with DM Mono throughout and a dark dev-tool aesthetic. The dashboard should feel like a weather app — atmospheric, dynamic, and mobile-first.

## Chosen Approach

**Dynamic atmospheric themes** — each weather state (clear day, rain, storm, night, etc.) applies a distinct CSS class to `<main>` that sets a background gradient and a unique `--accent` color. Cards get a subtle tint from the atmosphere. No JS animations — pure CSS.

---

## Design Decisions

### 1. Dynamic `--accent` token

The current `--accent-green: #7ef2c0` is hardcoded across all components and is the same as the portfolio. Replace usages of `var(--accent-green)` across components with `var(--accent)`. Each atmospheric class redefines `--accent` to its own color.

### 2. Typography: Inter for UI text

Add **Inter** alongside DM Mono in `layout.tsx`. Usage split:
- **Inter** — labels, descriptions, navigation text, headings (breaks the "dev terminal" look)
- **DM Mono** — all numeric values (temperature, wind speed, UV index, times)

Home page title `weather` changes to Inter Bold, white — removes the green portfolio marker.

### 3. Seven atmospheric states

Computed server-side in `[city]/page.tsx` using `current.weathercode` and `current.is_day`. Applied as a CSS class on `<main>`.

| Class | Condition | Background gradient | `--accent` |
|-------|-----------|---------------------|------------|
| `atm-clear-day` | Code 0–1 + day | Warm azure → deep sky blue, golden top | `#f5a623` |
| `atm-cloudy-day` | Codes 2–3 + day | Flat cool gray-blue | `#90b4ce` |
| `atm-fog` | Codes 45–48 | Muted gray-lavender | `#a0a8b8` |
| `atm-rain` | Codes 51–65 | Dark slate-blue, gradient downward | `#5b9bd5` |
| `atm-snow` | Codes 71–77 | Blue-white, near monochromatic | `#c8e6f5` |
| `atm-storm` | Codes 80–99 | Deep violet-gray, dramatic | `#9b7fe8` |
| `atm-night` | Any code + night | Deep indigo with subtle CSS star dots | `#7eb8f7` |

Home page (`HomeContent.tsx`) always renders with `atm-night` class — gives the search screen its own character without weather data.

### 4. Card tinting

Each atmospheric class sets `--card-tint` (a very low-opacity rgba of the accent). The `.w-card` rule in `globals.css` gains `background: var(--card-tint)` in addition to the dark base. This lets the atmosphere "bleed through" the cards without hurting legibility.

### 5. Night starfield

The `atm-night` class adds 5 small dot pseudo-elements (CSS only, no JS) that pulse subtly via `@keyframes`. Applied on the `<main>` element's `::before`, layered below content.

---

## Files Modified

| File | Change |
|------|--------|
| `app/layout.tsx` | Add Inter from Google Fonts |
| `app/globals.css` | Add 7 `.atm-*` classes; add `--accent` and `--card-tint` tokens; update `.w-card` to use `--card-tint`; Inter as default body font; DM Mono retained for data |
| `lib/utils.ts` | Add `getAtmosphericState(weathercode: number, is_day: number): string` |
| `app/[city]/page.tsx` | Call `getAtmosphericState`, apply class to `<main>`; change Row 2 grid to `grid-cols-2 sm:grid-cols-3` with `PrecipitationChart` spanning `col-span-2 sm:col-span-1` |
| `components/HomeContent.tsx` | Wrap in `<main className="atm-night ...">`, title to Inter Bold white, subtitle Inter |
| `components/WeatherCard.tsx` | Temperature color → `var(--accent)` (removes fixed green/blue logic) |
| `components/ForecastGrid.tsx` | "Hoy" highlight: `rgba(var(--accent-rgb), 0.08)` border and background; day label → `var(--accent)` |
| `components/SearchBar.tsx` | `focus-within:border-[var(--accent)]`, MapPin and geo button → `var(--accent)` |
| `components/WindCard.tsx` | Compass arrow → `var(--accent)` |

---

## Mobile Layout

### Row 2 (Wind + UV + Precipitation) — current vs new

**Current:** `grid-cols-1 sm:grid-cols-3` — all three stack on mobile.

**New:** `grid-cols-2` on mobile, Wind and UV side-by-side; PrecipitationChart takes `col-span-2` below. On `sm+` reverts to `grid-cols-3`.

### WeatherCard temperature

Current: fixed `4rem`. New: `clamp(2.5rem, 10vw, 4rem)` — prevents overflow on very small screens.

### SearchBar

Input and geolocation button already have `py-3` (≈48px tap target). No changes needed.

---

## What Does NOT Change

- Color palette base (`--bg-primary`, `--bg-secondary`, `--bg-tertiary`, `--border`)
- UVIndex segment colors (they have semantic meaning — low/moderate/high/extreme)
- HourlyChart and PrecipitationChart internals (Recharts theme stays)
- ForecastGrid horizontal scroll on mobile (already works correctly)
- SSR architecture — atmospheric class is computed server-side, no client hydration required

---

## Out of Scope

- Animated weather particles (rain, snow falling) — YAGNI, gradients give sufficient character
- Dark/light mode toggle
- Changes to any other project (portfolio, AmigoTours)
