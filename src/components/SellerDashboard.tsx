"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type StatsData = {
  nbVues: number;
  nbClics: number;
  nbFavoris: number;
  nbCommentaires: number;
  nbConversations: number;
  nbMessagesRecus: number;
  statut: string;
  creeLe: string;
  vuesParJour: { date: string; vues: number }[];
};

type Props = {
  listingId: string;
};

export function SellerDashboard({ listingId }: Props) {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/annonces/${listingId}/stats`)
      .then((r) => r.json())
      .then((data) => {
        if (!data.error) setStats(data);
      })
      .finally(() => setLoading(false));
  }, [listingId]);

  async function handleStatusChange(newStatut: string) {
    setStatusLoading(true);
    try {
      const res = await fetch(`/api/annonces/${listingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statut: newStatut }),
      });
      if (res.ok) {
        window.location.reload();
      }
    } catch { /* ignore */ }
    setStatusLoading(false);
  }

  if (loading) {
    return (
      <div style={{ padding: "20px 16px", borderRadius: 12, marginBottom: 16, background: "var(--bg-card)", border: "0.5px solid var(--border)", textAlign: "center" }}>
        <div style={{ fontSize: 12, color: "var(--text-tertiary)" }}>Chargement du tableau de bord...</div>
      </div>
    );
  }

  if (!stats) return null;

  // Funnel data
  const funnelSteps = [
    { label: "Vues", value: stats.nbVues },
    { label: "Clics", value: stats.nbClics },
    { label: "Favoris", value: stats.nbFavoris },
    { label: "Messages", value: stats.nbMessagesRecus },
  ];
  const maxFunnel = Math.max(1, funnelSteps[0].value);

  // Chart data
  const maxVues = Math.max(1, ...stats.vuesParJour.map((d) => d.vues));

  // Status badge
  const statusLabel = stats.statut === "active" ? "Active" : stats.statut === "vendu" ? "Vendu" : "Retiree";
  const statusBg = stats.statut === "active" ? "var(--green-light-bg)" : stats.statut === "vendu" ? "var(--red-bg)" : "var(--bg-secondary)";
  const statusColor = stats.statut === "active" ? "var(--green-text)" : stats.statut === "vendu" ? "var(--red-text)" : "var(--text-tertiary)";

  return (
    <div style={{ borderRadius: 12, marginBottom: 16, background: "var(--bg-card)", border: "0.5px solid var(--border)", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderBottom: "0.5px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="var(--green)" strokeWidth="1.5">
            <rect x="1" y="8" width="3" height="7" rx="0.5" />
            <rect x="6" y="5" width="3" height="10" rx="0.5" />
            <rect x="11" y="2" width="3" height="13" rx="0.5" />
          </svg>
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>Tableau de bord vendeur</span>
        </div>
        <span
          style={{
            fontSize: 10,
            fontWeight: 500,
            padding: "3px 8px",
            borderRadius: 6,
            background: statusBg,
            color: statusColor,
            textTransform: "uppercase",
            letterSpacing: 0.3,
          }}
        >
          {statusLabel}
        </span>
      </div>

      {/* Stat cards — 2x2 grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, padding: "14px 16px" }}>
        {[
          { label: "Vues totales", value: stats.nbVues, icon: "M1 8a7 7 0 1114 0A7 7 0 011 8zm7-3a3 3 0 100 6 3 3 0 000-6z" },
          { label: "Clics", value: stats.nbClics, icon: "M8 1v4M8 11v4M1 8h4M11 8h4M3.5 3.5l2.8 2.8M9.7 9.7l2.8 2.8M12.5 3.5l-2.8 2.8M6.3 9.7l-2.8 2.8" },
          { label: "Favoris", value: stats.nbFavoris, icon: "M8 13S2 9.5 2 5.5a3.5 3.5 0 016-2.5 3.5 3.5 0 016 2.5C14 9.5 8 13 8 13z" },
          { label: "Messages recus", value: stats.nbMessagesRecus, icon: "M2 4h12v8H2zM2 4l6 5 6-5" },
        ].map((card) => (
          <div
            key={card.label}
            style={{
              background: "var(--bg-secondary)",
              borderRadius: 10,
              padding: "14px 14px 12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="var(--text-tertiary)" strokeWidth="1.3">
                <path d={card.icon} />
              </svg>
              <span style={{ fontSize: 11, color: "var(--text-tertiary)", fontWeight: 500 }}>{card.label}</span>
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "var(--green)", lineHeight: 1 }}>
              {card.value.toLocaleString("fr-CA")}
            </div>
          </div>
        ))}
      </div>

      {/* Views per day chart */}
      <div style={{ padding: "6px 16px 14px" }}>
        <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 10 }}>
          Vues par jour (14 derniers jours)
        </div>
        <div style={{ background: "var(--bg-secondary)", borderRadius: 10, padding: "12px 12px 6px" }}>
          <svg viewBox="0 0 420 100" style={{ width: "100%", height: 80, display: "block" }}>
            {stats.vuesParJour.map((day, i) => {
              const barH = Math.max(2, (day.vues / maxVues) * 75);
              const x = i * 30 + 2;
              return (
                <g key={day.date}>
                  <rect
                    x={x}
                    y={80 - barH}
                    width={22}
                    height={barH}
                    rx={3}
                    fill="var(--green)"
                    opacity={0.8}
                  />
                  <text
                    x={x + 11}
                    y={95}
                    textAnchor="middle"
                    fontSize="7"
                    fill="var(--text-tertiary)"
                    fontFamily="inherit"
                  >
                    {new Date(day.date).toLocaleDateString("fr-CA", { day: "numeric" })}
                  </text>
                  {day.vues > 0 && (
                    <text
                      x={x + 11}
                      y={80 - barH - 3}
                      textAnchor="middle"
                      fontSize="7"
                      fill="var(--text-tertiary)"
                      fontFamily="inherit"
                    >
                      {day.vues}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Conversion funnel */}
      <div style={{ padding: "6px 16px 14px" }}>
        <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 10 }}>
          Entonnoir de conversion
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {funnelSteps.map((step, i) => {
            const pct = maxFunnel > 0 ? (step.value / maxFunnel) * 100 : 0;
            const pctLabel = i === 0 ? "100%" : `${pct.toFixed(1)}%`;
            const barWidth = Math.max(8, pct);
            return (
              <div key={step.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 11, color: "var(--text-tertiary)", width: 60, textAlign: "right", flexShrink: 0 }}>
                  {step.label}
                </span>
                <div style={{ flex: 1, height: 22, background: "var(--bg-secondary)", borderRadius: 6, overflow: "hidden", position: "relative" }}>
                  <div
                    style={{
                      width: `${barWidth}%`,
                      height: "100%",
                      background: `var(--green)`,
                      opacity: 1 - i * 0.15,
                      borderRadius: 6,
                      transition: "width 0.5s ease",
                    }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      left: 8,
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: 11,
                      fontWeight: 600,
                      color: barWidth > 25 ? "white" : "var(--text-secondary)",
                    }}
                  >
                    {step.value.toLocaleString("fr-CA")}
                  </span>
                </div>
                <span style={{ fontSize: 11, fontWeight: 500, color: "var(--text-tertiary)", width: 42, flexShrink: 0 }}>
                  {pctLabel}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions rapides */}
      <div style={{ padding: "6px 16px 16px" }}>
        <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 10 }}>
          Actions rapides
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Link
            href={`/annonces/${listingId}/modifier`}
            style={{
              fontSize: 12,
              padding: "8px 14px",
              borderRadius: 8,
              background: "var(--green)",
              color: "white",
              textDecoration: "none",
              fontWeight: 500,
              fontFamily: "inherit",
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M11.5 1.5l3 3L5 14H2v-3z" />
            </svg>
            Modifier l&apos;annonce
          </Link>
          {stats.statut === "active" && (
            <button
              onClick={() => handleStatusChange("vendu")}
              disabled={statusLoading}
              style={{
                fontSize: 12,
                padding: "8px 14px",
                borderRadius: 8,
                background: "var(--green-light-bg)",
                color: "var(--green-text)",
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
                fontWeight: 500,
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M2 8l4 4 8-8" />
              </svg>
              Marquer vendu / loue
            </button>
          )}
          {stats.statut === "vendu" && (
            <button
              onClick={() => handleStatusChange("active")}
              disabled={statusLoading}
              style={{
                fontSize: 12,
                padding: "8px 14px",
                borderRadius: 8,
                background: "var(--green-light-bg)",
                color: "var(--green-text)",
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
                fontWeight: 500,
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              Remettre active
            </button>
          )}
          {stats.statut !== "retire" && (
            <button
              onClick={() => handleStatusChange("retire")}
              disabled={statusLoading}
              style={{
                fontSize: 12,
                padding: "8px 14px",
                borderRadius: 8,
                background: "var(--bg-secondary)",
                color: "var(--text-tertiary)",
                border: "0.5px solid var(--border)",
                cursor: "pointer",
                fontFamily: "inherit",
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 4l8 8M12 4l-8 8" />
              </svg>
              Retirer l&apos;annonce
            </button>
          )}
          {stats.statut === "retire" && (
            <button
              onClick={() => handleStatusChange("active")}
              disabled={statusLoading}
              style={{
                fontSize: 12,
                padding: "8px 14px",
                borderRadius: 8,
                background: "var(--green-light-bg)",
                color: "var(--green-text)",
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
                fontWeight: 500,
              }}
            >
              Remettre active
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
