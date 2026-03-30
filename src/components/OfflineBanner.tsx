"use client";

import { useState, useEffect } from "react";

export function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const goOffline = () => setIsOffline(true);
    const goOnline = () => setIsOffline(false);

    // Etat initial
    if (!navigator.onLine) setIsOffline(true);

    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);
    return () => {
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 72,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        background: "var(--bg-card)",
        border: "0.5px solid var(--border)",
        borderRadius: 8,
        padding: "8px 16px",
        fontSize: 13,
        color: "var(--text-secondary)",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        display: "flex",
        alignItems: "center",
        gap: 8,
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "#EF9F27",
          flexShrink: 0,
        }}
      />
      Mode hors-ligne : les calculatrices restent disponibles
    </div>
  );
}
