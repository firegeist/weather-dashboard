# CLAUDE.md — weather-dashboard

## Contexto del proyecto

Dashboard del tiempo construido con Next.js. Muestra previsión meteorológica detallada con gráficos y diseño oscuro cuidado.
Usa la API de Open-Meteo, que es gratuita y no requiere API key.
Es el proyecto más visual del portfolio — el objetivo es que quede impecable a primera vista.

## Stack técnico

- **Framework:** Next.js 14+ con App Router
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS
- **Gráficos:** Recharts
- **API meteorológica:** Open-Meteo (gratuita, sin API key)
- **Geocodificación:** Open-Meteo Geocoding API (también gratuita)
- **Iconos:** Lucide React
- **Deploy:** Vercel

## Estructura del proyecto

```
weather-dashboard/
├── app/
│   ├── page.tsx                  # Página principal con búsqueda
│   ├── [city]/page.tsx           # Dashboard de una ciudad (SSR)
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── SearchBar.tsx             # Búsqueda con autocompletado
│   ├── WeatherCard.tsx           # Card de temperatura actual
│   ├── ForecastGrid.tsx          # Grid de 7 días
│   ├── HourlyChart.tsx           # Gráfico de temperatura horaria (Recharts)
│   ├── PrecipitationChart.tsx    # Gráfico de precipitación
│   ├── WindCard.tsx              # Viento y dirección
│   ├── UVIndex.tsx               # Índice UV con indicador visual
│   └── WeatherIcon.tsx           # Mapeo código WMO → icono
├── lib/
│   ├── weather.ts                # Fetch a Open-Meteo + tipos
│   ├── geocoding.ts              # Búsqueda de ciudades
│   └── utils.ts                  # Formateo de fechas, unidades, etc.
├── types/
│   └── weather.ts                # Tipos TypeScript para la API
└── hooks/
    └── useGeolocation.ts         # Hook para ubicación del navegador
```

## API de Open-Meteo

### Geocodificación (búsqueda de ciudades)
```
GET https://geocoding-api.open-meteo.com/v1/search?name={ciudad}&count=5&language=es&format=json
```

### Previsión meteorológica
```
GET https://api.open-meteo.com/v1/forecast
  ?latitude={lat}
  &longitude={lon}
  &hourly=temperature_2m,precipitation_probability,weathercode,windspeed_10m,uv_index
  &daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max,sunrise,sunset
  &current_weather=true
  &timezone=auto
  &forecast_days=7
```

### Códigos WMO (weathercode) → descripción e icono
```typescript
// Los más comunes a mapear:
// 0 → Despejado ☀️
// 1,2,3 → Parcialmente nublado ⛅
// 45,48 → Niebla 🌫️
// 51,53,55 → Llovizna 🌦️
// 61,63,65 → Lluvia 🌧️
// 71,73,75 → Nieve ❄️
// 95 → Tormenta ⛈️
```

## Diseño y estética

El dashboard debe tener diseño oscuro consistente con el portfolio principal:
- Fondo: `#0c0c0e` con variantes `#111114`, `#16161a`
- Acento: verde `#7ef2c0` para datos positivos / temperatura alta
- Azul frío: `#3b8bd4` para lluvia y temperaturas bajas
- Tipografía: DM Mono para números y datos, sistema sans para etiquetas
- Tarjetas con fondo sutil, bordes finos `rgba(255,255,255,0.07)`
- Gráficos con Recharts, tema oscuro personalizado

## Datos a mostrar

### Pantalla principal (búsqueda)
- Barra de búsqueda con autocompletado de ciudades
- Botón "Usar mi ubicación" (Geolocation API)
- Últimas ciudades buscadas (localStorage)

### Dashboard de ciudad
- Temperatura actual + sensación térmica
- Descripción del tiempo (texto + icono)
- Temperatura máx/mín del día
- Gráfico de temperatura horaria (próximas 24h)
- Grid de previsión 7 días (icono, max, min, precipitación)
- Gráfico de probabilidad de precipitación
- Viento (velocidad + dirección)
- Índice UV
- Hora de amanecer y atardecer

## Convenciones de código

- Todos los fetches a Open-Meteo en `lib/weather.ts` — nunca fetch directo desde componentes
- Los datos se obtienen en Server Components — no usar useEffect para fetch de datos
- `useGeolocation` es el único client-side hook de datos
- Tipos estrictos para toda la respuesta de Open-Meteo — no usar `any`
- Formateo de unidades en `lib/utils.ts`: temperatura en °C, viento en km/h
- Manejar estado de carga y error en todos los componentes que muestran datos

## Comandos del proyecto

```bash
npm run dev     # Servidor de desarrollo
npm run build   # Build de producción
npm run lint    # ESLint
```

## Notas importantes

- Open-Meteo no requiere API key ni registro — peticiones directas desde el servidor
- La página `/[city]` usa SSR: los datos se obtienen en el servidor para SEO y velocidad inicial
- El autocompletado de búsqueda usa debounce de 300ms para no saturar la API de geocodificación
- En Vercel, el deploy es automático al hacer push a `main` — no hay variables de entorno necesarias
- Los gráficos de Recharts deben ser `"use client"` — Recharts no es compatible con SSR