"use client";
import { useState } from "react";
import Link from "next/link";

type Term = { slug: string; terme: string; lettre: string; definition: string; lienCalculateur?: string };

export function LexiqueSearch({ terms }: { terms: Term[] }) {
  const [query, setQuery] = useState("");
  const q = query.toLowerCase().trim();

  const filtered = q
    ? terms.filter(t => t.terme.toLowerCase().includes(q) || t.definition.toLowerCase().includes(q))
    : null;

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ position: "relative" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          border: "0.5px solid var(--border)", borderRadius: 24,
          background: "var(--bg-card)", padding: "10px 16px",
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth={2}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            type="text"
            placeholder="Chercher un terme... ex: CELIAPP, amortissement"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ flex: 1, border: "none", background: "transparent", fontSize: 14, color: "var(--text-primary)", outline: "none" }}
          />
          {query && (
            <button onClick={() => setQuery("")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-tertiary)", fontSize: 18 }}>x</button>
          )}
        </div>
      </div>
      {filtered !== null && (
        <div style={{ marginTop: 8 }}>
          <p className="text-[12px]" style={{ color: "var(--text-tertiary)", marginBottom: 8 }}>
            {filtered.length} terme{filtered.length !== 1 ? "s" : ""} trouv{filtered.length !== 1 ? "es" : "e"} pour &quot;{query}&quot;
          </p>
          {filtered.length > 0 ? (
            <div className="space-y-2">
              {filtered.map((t) => (
                <Link key={t.slug} href={`/glossaire/${t.slug}`} className="block rounded-lg p-3 transition-colors hover-bg" style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}>
                  <p className="text-[13px] font-semibold" style={{ color: "var(--text-primary)" }}>{t.terme}</p>
                  <p className="text-[12px] line-clamp-2" style={{ color: "var(--text-secondary)" }}>{t.definition}</p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-[13px]" style={{ color: "var(--text-secondary)" }}>Aucun terme trouve. <Link href="/nouveau-post" style={{ color: "var(--green)" }}>Poser une question a la communaute</Link></p>
          )}
        </div>
      )}
    </div>
  );
}
