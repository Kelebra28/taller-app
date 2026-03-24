"use client";

export function Spinner({ size = 16 }: { size?: number }) {
  return (
    <span
      aria-label="Cargando"
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        border: "2px solid rgba(255,255,255,.28)",
        borderTopColor: "rgba(255,255,255,.95)",
        display: "inline-block",
        animation: "spin .75s linear infinite",
      }}
    />
  );
}