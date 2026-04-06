"use client";

import { useState } from "react";
import { quartiersDeVille } from "@/lib/data";
import { MARKET } from "@/lib/donneesMarche";
import { PriceHistoryChart, getPriceHistory } from "../PriceHistoryChart";
import "../donnees-marche.css";

type CityStats = {
  uniMedian: string;
  condoMedian: string;
  plexMedian: string;
  delaiMoyen: string;
  tendanceMoyenne: string;
  marche: string;
  nbQuartiers: number;
} | null;

interface Props {
  villeSlug: string;
  villeNom: string;
  stats: CityStats;
}

function trendClass(t: string) {
  const val = parseFloat(t);
  return val >= 10 ? "dm-trend-hot" : val >= 5 ? "dm-trend-up" : "dm-trend-stable";
}
function badgeClass(m: string) {
  return m === "vendeur" ? "dm-badge-vendeur" : m === "acheteur" ? "dm-badge-acheteur" : "dm-badge-equilibre";
}
function badgeLabel(m: string) {
  return m === "vendeur" ? "Marché vendeur" : m === "acheteur" ? "Marché acheteur" : "Marché équilibré";
}

export function DonneesVille({ villeSlug, villeNom, stats }: Props) {
  const [search, setSearch] = useState("");
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);
  const q = search.toLowerCase().trim();

  // Build quartier cards from MARKET data
  const quartiers = quartiersDeVille(villeSlug)
    .filter((qr) => MARKET[qr.slug])
    .filter((qr) => !q || qr.nom.toLowerCase().includes(q))
    .map((qr) => ({ slug: qr.slug, nom: qr.nom, couleur: qr.couleur, ...MARKET[qr.slug] }));

  // Standalone city (no quartier subdivision) — show the city itself as a single card
  const isStandalone = quartiersDeVille(villeSlug).length <= 1;

  return (
    <div>
      {/* City stats header */}
      {stats && (
        <div className="dm-province-stats">
          <div className="dm-pstat">
            <div className="dm-pstat-val">{stats.uniMedian}</div>
            <div className="dm-pstat-lbl">Unifamiliale médiane</div>
            <div className="dm-pstat-sub">{stats.tendanceMoyenne} vs 2025</div>
          </div>
          <div className="dm-pstat">
            <div className="dm-pstat-val">{stats.condoMedian}</div>
            <div className="dm-pstat-lbl">Condo médian</div>
            <div className="dm-pstat-sub">{stats.tendanceMoyenne} vs 2025</div>
          </div>
          {stats.plexMedian !== "—" && (
            <div className="dm-pstat">
              <div className="dm-pstat-val">{stats.plexMedian}</div>
              <div className="dm-pstat-lbl">Plex médian</div>
              <div className="dm-pstat-sub">{stats.tendanceMoyenne} vs 2025</div>
            </div>
          )}
          <div className="dm-pstat">
            <div className="dm-pstat-val">{stats.delaiMoyen}</div>
            <div className="dm-pstat-lbl">Délai moyen de vente</div>
            <div className="dm-pstat-sub">{badgeLabel(stats.marche)}</div>
          </div>
        </div>
      )}

      {/* Search bar — only show when there are multiple quartiers */}
      {!isStandalone && (
        <div className="dm-search-wrap">
          <svg viewBox="0 0 16 16"><circle cx="6.5" cy="6.5" r="4.5" /><line x1="10" y1="10" x2="14" y2="14" /></svg>
          <input
            className="dm-search-input"
            type="text"
            placeholder={`Rechercher un quartier à ${villeNom}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      )}

      {/* Quartier cards grid */}
      {quartiers.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 20px", color: "var(--text-tertiary)", fontSize: 14 }}>
          {q ? "Aucun quartier trouvé pour cette recherche." : "Aucune donnée disponible pour cette ville."}
        </div>
      ) : (
        <div className="dm-cards-grid">
          {quartiers.map((c) => {
            const hasHistory = !!getPriceHistory(c.slug);
            const isExpanded = expandedSlug === c.slug;
            return (
              <div
                key={c.slug}
                className="dm-market-card"
                onClick={() => hasHistory && setExpandedSlug(isExpanded ? null : c.slug)}
                style={{ cursor: hasHistory ? "pointer" : "default" }}
              >
                <div className="dm-card-header">
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span className={`w-2 h-2 rounded-full shrink-0 ${c.couleur}`} />
                    <span className="dm-card-name">{c.nom}</span>
                  </div>
                  <span className={`dm-card-trend ${trendClass(c.tendance)}`}>{c.tendance}</span>
                </div>
                <div className="dm-card-stats">
                  <div className="dm-stat"><div className="dm-stat-val">{c.uni}</div><div className="dm-stat-lbl">Unifamiliale</div></div>
                  <div className="dm-stat"><div className="dm-stat-val">{c.condo}</div><div className="dm-stat-lbl">Condo</div></div>
                  <div className="dm-stat"><div className="dm-stat-val">{c.plex}</div><div className="dm-stat-lbl">Plex</div></div>
                </div>
                <div className="dm-card-footer">
                  <span>Délai moyen : {c.delai}</span>
                  <span className={`dm-market-badge ${badgeClass(c.marche)}`}>{badgeLabel(c.marche)}</span>
                </div>
                {hasHistory && (
                  <div className="dm-card-expand-hint">
                    <svg className={`dm-card-expand-icon${isExpanded ? " open" : ""}`} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 6l4 4 4-4" />
                    </svg>
                    {isExpanded ? "Masquer l’historique" : "Voir l’historique des prix"}
                  </div>
                )}
                <div className={`dm-chart-wrapper${isExpanded ? " open" : ""}`} onClick={(e) => e.stopPropagation()}>
                  {isExpanded && <PriceHistoryChart slug={c.slug} nom={c.nom} />}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
