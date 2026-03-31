"use client";

import { useState } from "react";

export function MobileCalcFab() {
  const [open, setOpen] = useState(false);
  const [revenu, setRevenu] = useState("75 000");
  const [mise, setMise] = useState("50 000");

  const raw = (s: string) => parseInt(s.replace(/\s/g, ""), 10) || 0;
  const fmt = (n: number) => n.toLocaleString("fr-CA");
  const cap = raw(revenu) * 5 + raw(mise);

  return (
    <>
      {/* Bouton flottant */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Calculateur rapide"
        className="md:hidden fixed z-50 flex items-center justify-center w-11 h-11 rounded-full"
        style={{
          bottom: 80,
          left: 16,
          background: "var(--bg-card)",
          border: "0.5px solid var(--border)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
          color: "var(--text-secondary)",
        }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <rect x="2" y="2" width="14" height="14" rx="3" />
          <line x1="6" y1="9" x2="12" y2="9" />
          <line x1="9" y1="6" x2="9" y2="12" />
        </svg>
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="md:hidden fixed inset-0 z-[99]"
          style={{ background: "rgba(0,0,0,0.3)" }}
          onClick={() => setOpen(false)}
        />
      )}

      {/* Bottom drawer */}
      <div
        className="md:hidden fixed left-0 right-0 bottom-0 z-[100]"
        style={{
          background: "var(--bg-card)",
          borderRadius: "16px 16px 0 0",
          borderTop: "0.5px solid var(--border)",
          padding: "16px 20px 32px",
          transform: open ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.25s ease",
        }}
      >
        {/* Handle */}
        <div
          style={{
            width: 36,
            height: 4,
            borderRadius: 2,
            background: "var(--border)",
            margin: "0 auto 16px",
          }}
        />

        <h3
          className="text-[15px] font-bold mb-4"
          style={{ color: "var(--text-primary)" }}
        >
          Calculateur rapide
        </h3>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <p className="text-[11px] mb-1" style={{ color: "var(--text-tertiary)" }}>
              Revenu annuel ($)
            </p>
            <input
              type="text"
              value={revenu}
              onChange={(e) => setRevenu(e.target.value)}
              className="w-full text-[14px] px-3 py-2 rounded-lg"
              style={{
                background: "var(--bg-secondary)",
                border: "0.5px solid var(--border)",
                color: "var(--text-primary)",
                outline: "none",
              }}
            />
          </div>
          <div>
            <p className="text-[11px] mb-1" style={{ color: "var(--text-tertiary)" }}>
              Mise de fonds ($)
            </p>
            <input
              type="text"
              value={mise}
              onChange={(e) => setMise(e.target.value)}
              className="w-full text-[14px] px-3 py-2 rounded-lg"
              style={{
                background: "var(--bg-secondary)",
                border: "0.5px solid var(--border)",
                color: "var(--text-primary)",
                outline: "none",
              }}
            />
          </div>
        </div>

        <div
          className="rounded-lg px-4 py-3 flex items-center justify-between mb-3"
          style={{
            background: "var(--amber-bg)",
            border: "0.5px solid var(--amber-text)",
          }}
        >
          <span className="text-[11px]" style={{ color: "var(--amber-text)" }}>
            Capacité estimée
          </span>
          <span className="text-[17px] font-bold" style={{ color: "var(--amber-text)" }}>
            ~{fmt(cap)} $
          </span>
        </div>

        <a
          href="/capacite-emprunt"
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-[13px] font-medium"
          style={{
            background: "var(--bg-secondary)",
            border: "0.5px solid var(--border)",
            color: "var(--text-secondary)",
            textDecoration: "none",
          }}
        >
          Calcul détaillé
        </a>
      </div>
    </>
  );
}
