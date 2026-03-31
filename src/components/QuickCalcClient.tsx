"use client";

import { useState } from "react";
import Link from "next/link";

export function QuickCalcClient() {
  const [revenu, setRevenu] = useState("");
  const [mise, setMise] = useState("");

  const revenuNum = Number(revenu.replace(/\s/g, "")) || 0;
  const miseNum = Number(mise.replace(/\s/g, "")) || 0;
  const capacite = revenuNum * 5 + miseNum;

  const fmt = (n: number) =>
    n.toLocaleString("fr-CA", { maximumFractionDigits: 0 });

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
    >
      <div className="px-4 py-3" style={{ borderBottom: "0.5px solid var(--border)" }}>
        <h3
          className="text-[10px] font-semibold uppercase tracking-wider"
          style={{ color: "var(--text-tertiary)" }}
        >
          Calculateur rapide
        </h3>
      </div>
      <div className="p-4 space-y-3">
        <div>
          <label
            className="text-[11px] font-medium block mb-1"
            style={{ color: "var(--text-secondary)" }}
          >
            Revenu annuel ($)
          </label>
          <input
            type="text"
            inputMode="numeric"
            value={revenu}
            onChange={(e) => setRevenu(e.target.value.replace(/[^0-9\s]/g, ""))}
            placeholder="75 000"
            className="w-full rounded-lg px-3 py-2 text-[12px] outline-none"
            style={{
              background: "var(--bg-secondary)",
              border: "0.5px solid var(--border)",
              color: "var(--text-primary)",
            }}
          />
        </div>
        <div>
          <label
            className="text-[11px] font-medium block mb-1"
            style={{ color: "var(--text-secondary)" }}
          >
            Mise de fonds ($)
          </label>
          <input
            type="text"
            inputMode="numeric"
            value={mise}
            onChange={(e) => setMise(e.target.value.replace(/[^0-9\s]/g, ""))}
            placeholder="50 000"
            className="w-full rounded-lg px-3 py-2 text-[12px] outline-none"
            style={{
              background: "var(--bg-secondary)",
              border: "0.5px solid var(--border)",
              color: "var(--text-primary)",
            }}
          />
        </div>

        {capacite > 0 && (
          <div
            className="rounded-lg px-3 py-2.5 text-center"
            style={{ background: "var(--amber-bg)" }}
          >
            <p
              className="text-[10px] font-semibold uppercase tracking-wider mb-0.5"
              style={{ color: "var(--amber-text)" }}
            >
              Capacité estimée
            </p>
            <p
              className="text-[16px] font-bold"
              style={{ color: "var(--amber-text)" }}
            >
              ~{fmt(capacite)} $
            </p>
          </div>
        )}

        <Link
          href="/capacite-emprunt"
          className="block w-full text-center rounded-lg px-3 py-2 text-[12px] font-medium transition-opacity hover:opacity-80"
          style={{
            background: "var(--bg-secondary)",
            color: "var(--text-secondary)",
            border: "0.5px solid var(--border)",
          }}
        >
          Calcul détaillé
        </Link>
      </div>
    </div>
  );
}
