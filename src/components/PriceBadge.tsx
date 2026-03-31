"use client";

import { useState, useRef, useEffect } from "react";

interface PriceBadgeProps {
  prix: number;
  estimatedValue: number | null;
  quartierNom?: string;
  type?: string;
  compact?: boolean;
}

export function PriceBadge({ prix, estimatedValue, quartierNom, type, compact = false }: PriceBadgeProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  if (estimatedValue == null) return null;

  const ratio = prix / estimatedValue;
  const diffPct = Math.round((ratio - 1) * 100);
  const diffAbs = Math.abs(prix - estimatedValue);
  const fmtPrice = (n: number) => n.toLocaleString("fr-CA") + " $";

  let label: string;
  let bg: string;
  let fg: string;
  let explanation: string;

  if (ratio <= 0.9) {
    label = "Bon prix";
    bg = "var(--green-light-bg)";
    fg = "var(--green-text)";
    explanation = `Ce prix est ${Math.abs(diffPct)}% sous la valeur estimée du marché. C'est une opportunité potentielle pour un acheteur.`;
  } else if (ratio <= 1.05) {
    label = "Prix marché";
    bg = "var(--amber-bg)";
    fg = "var(--amber-text)";
    explanation = `Ce prix est dans la fourchette normale du marché (${diffPct > 0 ? "+" : ""}${diffPct}% de l'estimation). Il reflète les conditions actuelles du quartier.`;
  } else {
    label = "Au-dessus du marché";
    bg = "var(--red-bg)";
    fg = "var(--red-text)";
    explanation = `Ce prix est ${diffPct}% au-dessus de la valeur estimée du marché. Le vendeur demande ${fmtPrice(diffAbs)} de plus que le médian du quartier.`;
  }

  const typeName = type === "condo" ? "condos" : type === "plex" || type === "duplex" || type === "triplex" || type === "quadruplex" ? "plex" : "unifamiliales";

  if (compact) {
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 3,
          padding: "2px 6px",
          borderRadius: 6,
          fontSize: 10,
          fontWeight: 600,
          background: bg,
          color: fg,
          lineHeight: 1.3,
          cursor: "default",
        }}
        title={`Estimation marché : ${fmtPrice(estimatedValue)}`}
      >
        {label}
      </span>
    );
  }

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={() => setOpen(!open)}
        onMouseEnter={() => setOpen(true)}
        style={{
          display: "inline-flex",
          flexDirection: "column",
          gap: 2,
          padding: "4px 8px",
          borderRadius: 8,
          background: bg,
          lineHeight: 1.3,
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          fontFamily: "inherit",
        }}
      >
        <span style={{ fontSize: 11, fontWeight: 600, color: fg }}>{label}</span>
        <span style={{ fontSize: 10, color: fg, opacity: 0.8 }}>
          Estimation : {fmtPrice(estimatedValue)}
        </span>
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            left: 0,
            width: 300,
            background: "var(--bg-card)",
            border: "0.5px solid var(--border)",
            borderRadius: 12,
            padding: 16,
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            zIndex: 50,
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                padding: "3px 8px",
                borderRadius: 6,
                background: bg,
                color: fg,
              }}
            >
              {label}
            </span>
            <button
              onClick={() => setOpen(false)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-tertiary)", fontSize: 16 }}
            >
              x
            </button>
          </div>

          {/* Comparison */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
            <div style={{ padding: "8px 10px", borderRadius: 8, background: "var(--bg-secondary)" }}>
              <p style={{ fontSize: 10, color: "var(--text-tertiary)", marginBottom: 2 }}>Prix demandé</p>
              <p style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)" }}>{fmtPrice(prix)}</p>
            </div>
            <div style={{ padding: "8px 10px", borderRadius: 8, background: "var(--bg-secondary)" }}>
              <p style={{ fontSize: 10, color: "var(--text-tertiary)", marginBottom: 2 }}>Valeur estimée</p>
              <p style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)" }}>{fmtPrice(estimatedValue)}</p>
            </div>
          </div>

          {/* Difference bar */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text-tertiary)", marginBottom: 4 }}>
              <span>Écart</span>
              <span style={{ fontWeight: 600, color: fg }}>
                {diffPct > 0 ? "+" : ""}{diffPct}% ({diffPct > 0 ? "+" : "-"}{fmtPrice(diffAbs)})
              </span>
            </div>
            <div style={{ height: 4, borderRadius: 2, background: "var(--border)", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${Math.min(100, Math.max(5, ratio * 50))}%`, borderRadius: 2, background: fg, transition: "width 0.3s" }} />
            </div>
          </div>

          {/* Explanation */}
          <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: 10 }}>
            {explanation}
          </p>

          {/* Source */}
          <p style={{ fontSize: 10, color: "var(--text-tertiary)", lineHeight: 1.4 }}>
            Basé sur le prix médian des {typeName} à {quartierNom ?? "ce quartier"} en 2026.
            Source : APCIQ, Centris.
            <br />
            Cette estimation est à titre indicatif et ne remplace pas une évaluation professionnelle.
          </p>
        </div>
      )}
    </div>
  );
}
