# weather-dashboard

> Dashboard meteorológico con previsión de 7 días, gráficos y diseño oscuro.

**Demo:** [weather.jherranz.dev](https://weather-dashboard.vercel.app) · **Estado:** En desarrollo activo

---

## ¿Qué es esto?

Aplicación web para consultar el tiempo con más detalle que las apps habituales. Busca cualquier ciudad del mundo y obtén temperatura horaria, probabilidad de lluvia, índice UV, viento y previsión completa de la semana.

No requiere API key ni registro — usa la API gratuita de [Open-Meteo](https://open-meteo.com).

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 14 (App Router) |
| Lenguaje | TypeScript |
| Estilos | Tailwind CSS |
| Gráficos | Recharts |
| API del tiempo | Open-Meteo (gratuita) |
| Geocodificación | Open-Meteo Geocoding API |
| Deploy | Vercel |

---

## Funcionalidades

### MVP (v1.0)
- [x] Búsqueda de ciudades con autocompletado
- [x] Detección de ubicación automática (Geolocation API)
- [x] Temperatura actual, máx/mín y descripción del tiempo
- [x] Gráfico de temperatura para las próximas 24 horas
- [x] Previsión de 7 días con icono, temperatura y precipitación
- [x] Gráfico de probabilidad de precipitación
- [x] Viento: velocidad y dirección
- [x] Índice UV con indicador de riesgo
- [x] Hora de amanecer y atardecer
- [x] Historial de ciudades buscadas (guardado local)
- [x] Diseño totalmente responsive

---

## Instalación local

No se necesita ninguna API key.

```bash
# 1. Clonar el repositorio
git clone https://github.com/firegeist/weather-dashboard.git
cd weather-dashboard

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

---

## Datos que se muestran

### Vista principal
- Temperatura actual y sensación térmica
- Descripción del tiempo con icono
- Temperatura máxima y mínima del día

### Gráficos
- **Temperatura horaria:** evolución de las próximas 24 horas
- **Precipitación:** probabilidad hora a hora del día actual

### Cards de detalle
| Card | Datos |
|------|-------|
| Previsión 7 días | Icono, max/min, precipitación por día |
| Viento | Velocidad (km/h) y dirección |
| Índice UV | Valor numérico + nivel de riesgo (bajo, moderado, alto, muy alto) |
| Amanecer/Atardecer | Horas locales del día |

---

## Arquitectura

Los datos meteorológicos se obtienen en el **servidor** (Server Components) para mejorar la velocidad de carga inicial y el SEO. Los gráficos de Recharts se renderizan en el **cliente** por compatibilidad con la librería.

```
app/[city]/page.tsx     → Server Component: obtiene datos, pasa a componentes
components/HourlyChart  → Client Component: renderiza con Recharts
lib/weather.ts          → Toda la lógica de fetch y transformación de datos
```

---

## API utilizada

[Open-Meteo](https://open-meteo.com) es una API meteorológica open-source con datos de alta resolución. Es completamente gratuita para uso no comercial y no requiere registro ni API key.

Los datos provienen de modelos numéricos de organismos meteorológicos europeos (ECMWF, DWD, MeteoFrance).

---

## Licencia

MIT