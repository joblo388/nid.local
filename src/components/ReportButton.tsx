"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

const RAISONS = [
  "Contenu inapproprié",
  "Spam ou publicité",
  "Information fausse ou trompeuse",
  "Harcèlement ou abus",
  "Autre",
];

export function ReportButton({ type, targetId }: { type: "post" | "comment"; targetId: string }) {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  if (!session || done) {
    return done ? (
      <span className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>Signalement envoyé</span>
    ) : null;
  }

  async function handleSubmit() {
    if (!reason) return;
    setLoading(true);
    await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, targetId, reason }),
    });
    setLoading(false);
    setDone(true);
    setOpen(false);
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="text-[11px] transition-opacity hover:opacity-70"
        style={{ color: "var(--text-tertiary)" }}
      >
        Signaler
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-1 w-[220px] rounded-xl p-3 z-50 space-y-2"
          style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)", boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}
        >
          <p className="text-[12px] font-semibold" style={{ color: "var(--text-primary)" }}>
            Raison du signalement
          </p>
          <div className="space-y-1">
            {RAISONS.map((r) => (
              <button
                key={r}
                onClick={() => setReason(r)}
                className="w-full text-left px-2.5 py-1.5 rounded-lg text-[12px] transition-colors"
                style={{
                  background: reason === r ? "var(--green-light-bg)" : "transparent",
                  color: reason === r ? "var(--green-text)" : "var(--text-secondary)",
                }}
              >
                {r}
              </button>
            ))}
          </div>
          <div className="flex gap-2 pt-1">
            <button
              onClick={handleSubmit}
              disabled={!reason || loading}
              className="flex-1 py-1.5 rounded-lg text-[12px] font-semibold text-white disabled:opacity-40"
              style={{ background: "var(--green)" }}
            >
              {loading ? "…" : "Envoyer"}
            </button>
            <button
              onClick={() => setOpen(false)}
              className="px-3 py-1.5 rounded-lg text-[12px] transition-opacity hover:opacity-70"
              style={{ color: "var(--text-tertiary)" }}
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
