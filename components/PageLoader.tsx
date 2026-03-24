"use client";

import { Spinner } from "./Loader";

export function PageLoader({ label = "Cargando..." }: { label?: string }) {
  return (
    <div
      style={{
        padding: 22,
        borderRadius: 18,
        border: "1px solid rgba(255,255,255,.12)",
        background: "rgba(0,0,0,.22)",
        display: "flex",
        alignItems: "center",
        gap: 12,
        justifyContent: "center",
      }}
    >
      <Spinner size={20} />
      <span style={{ color: "rgba(255,255,255,.75)", fontSize: 13, fontWeight: 800, letterSpacing: ".2px" }}>
        {label}
      </span>
    </div>
  );
}