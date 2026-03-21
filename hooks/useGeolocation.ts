"use client";

import { useState } from "react";

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
}

export function useGeolocation(): GeolocationState & { request: () => void } {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: false,
  });

  function request() {
    if (!navigator.geolocation) {
      setState((s) => ({
        ...s,
        error: "Tu navegador no soporta geolocalización.",
      }));
      return;
    }

    setState({ latitude: null, longitude: null, error: null, loading: true });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
          loading: false,
        });
      },
      (err) => {
        const message =
          err.code === err.PERMISSION_DENIED
            ? "Permiso de ubicación denegado. Actívalo en la configuración del navegador."
            : err.code === err.POSITION_UNAVAILABLE
            ? "No se pudo determinar tu ubicación. Inténtalo de nuevo."
            : "La solicitud de ubicación tardó demasiado. Inténtalo de nuevo.";

        setState({ latitude: null, longitude: null, error: message, loading: false });
      },
      { timeout: 10_000, maximumAge: 60_000 }
    );
  }

  return { ...state, request };
}
