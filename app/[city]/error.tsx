"use client";

import { useEffect } from "react";
import Link from "next/link";
import { CloudOff } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function CityError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("[CityPage] Error:", error);
  }, [error]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 gap-6 text-center">
      <div className="flex flex-col items-center gap-4">
        <CloudOff
          size={48}
          strokeWidth={1.25}
          style={{ color: "var(--text-secondary)" }}
        />
        <div className="flex flex-col gap-1">
          <h2
            style={{
              color: "var(--text-primary)",
              fontSize: "1.125rem",
              fontWeight: 600,
            }}
          >
            No se pudo cargar el tiempo
          </h2>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "0.875rem",
              maxWidth: 360,
            }}
          >
            Ha ocurrido un error al obtener los datos meteorológicos. Puede ser
            un problema temporal de la API.
          </p>
          {error.message && (
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "0.75rem",
                fontFamily: "var(--font-dm-mono)",
                opacity: 0.6,
                marginTop: "0.5rem",
              }}
            >
              {error.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <button
          onClick={reset}
          className="px-4 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-80 cursor-pointer"
          style={{
            background: "var(--accent-green)",
            color: "#0c0c0e",
            fontFamily: "var(--font-dm-mono)",
          }}
        >
          Reintentar
        </button>
        <Link
          href="/"
          className="px-4 py-2 rounded-lg text-sm transition-opacity hover:opacity-80"
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border)",
            color: "var(--text-secondary)",
            fontFamily: "var(--font-dm-mono)",
          }}
        >
          ← Volver a inicio
        </Link>
      </div>
    </main>
  );
}
