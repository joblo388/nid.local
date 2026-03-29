"use client";

import { useState } from "react";
import { villes, quartiersDeVille } from "@/lib/data";
import { PriceHistoryChart, getPriceHistory } from "./PriceHistoryChart";
import "./donnees-marche.css";

type MarketData = { uni: string; condo: string; plex: string; delai: string; tendance: string; marche: string };

// Données indexées par slug de quartier ou ville
const MARKET: Record<string, MarketData> = {
  // Montréal
  "plateau-mont-royal": { uni:"985 000 $", condo:"495 000 $", plex:"1 425 000 $", delai:"55 j", tendance:"+4,2%", marche:"equilibre" },
  "rosemont": { uni:"825 000 $", condo:"425 000 $", plex:"1 185 000 $", delai:"52 j", tendance:"+5,9%", marche:"vendeur" },
  "villeray": { uni:"645 000 $", condo:"345 000 $", plex:"925 000 $", delai:"48 j", tendance:"+7,3%", marche:"vendeur" },
  "griffintown": { uni:"695 000 $", condo:"395 000 $", plex:"985 000 $", delai:"44 j", tendance:"+8,5%", marche:"vendeur" },
  "saint-henri": { uni:"695 000 $", condo:"395 000 $", plex:"985 000 $", delai:"44 j", tendance:"+8,5%", marche:"vendeur" },
  "hochelaga": { uni:"565 000 $", condo:"325 000 $", plex:"825 000 $", delai:"50 j", tendance:"+9,2%", marche:"vendeur" },
  "cote-des-neiges": { uni:"795 000 $", condo:"425 000 $", plex:"1 125 000 $", delai:"57 j", tendance:"+5,5%", marche:"equilibre" },
  "notre-dame-de-grace": { uni:"795 000 $", condo:"425 000 $", plex:"1 125 000 $", delai:"57 j", tendance:"+5,5%", marche:"equilibre" },
  "outremont": { uni:"1 485 000 $", condo:"625 000 $", plex:"2 125 000 $", delai:"72 j", tendance:"+2,1%", marche:"equilibre" },
  "vieux-montreal": { uni:"—", condo:"525 000 $", plex:"—", delai:"76 j", tendance:"+4,5%", marche:"acheteur" },
  "verdun": { uni:"625 000 $", condo:"365 000 $", plex:"895 000 $", delai:"46 j", tendance:"+7,8%", marche:"vendeur" },
  "mile-end": { uni:"925 000 $", condo:"475 000 $", plex:"1 350 000 $", delai:"54 j", tendance:"+5,1%", marche:"equilibre" },
  "petite-bourgogne": { uni:"675 000 $", condo:"385 000 $", plex:"965 000 $", delai:"45 j", tendance:"+7,9%", marche:"vendeur" },
  "pointe-saint-charles": { uni:"595 000 $", condo:"345 000 $", plex:"855 000 $", delai:"46 j", tendance:"+8,2%", marche:"vendeur" },
  "saint-laurent": { uni:"685 000 $", condo:"365 000 $", plex:"925 000 $", delai:"51 j", tendance:"+6,5%", marche:"vendeur" },
  "montreal-nord": { uni:"425 000 $", condo:"265 000 $", plex:"625 000 $", delai:"43 j", tendance:"+8,9%", marche:"vendeur" },
  "anjou": { uni:"485 000 $", condo:"295 000 $", plex:"695 000 $", delai:"47 j", tendance:"+4,8%", marche:"equilibre" },
  "saint-leonard": { uni:"525 000 $", condo:"315 000 $", plex:"745 000 $", delai:"50 j", tendance:"+5,2%", marche:"equilibre" },
  "lasalle": { uni:"545 000 $", condo:"325 000 $", plex:"795 000 $", delai:"48 j", tendance:"+6,8%", marche:"vendeur" },
  "lachine": { uni:"525 000 $", condo:"315 000 $", plex:"765 000 $", delai:"46 j", tendance:"+7,1%", marche:"vendeur" },
  "riviere-des-prairies": { uni:"465 000 $", condo:"285 000 $", plex:"685 000 $", delai:"52 j", tendance:"+6,4%", marche:"vendeur" },
  "dollard-des-ormeaux": { uni:"595 000 $", condo:"335 000 $", plex:"—", delai:"54 j", tendance:"+5,7%", marche:"equilibre" },
  "mont-royal": { uni:"1 250 000 $", condo:"545 000 $", plex:"—", delai:"65 j", tendance:"+3,2%", marche:"equilibre" },
  "westmount": { uni:"1 650 000 $", condo:"685 000 $", plex:"—", delai:"70 j", tendance:"+2,8%", marche:"equilibre" },
  // Québec
  "saint-sauveur-qc": { uni:"425 000 $", condo:"195 000 $", plex:"—", delai:"32 j", tendance:"+14%", marche:"vendeur" },
  "limoilou": { uni:"455 000 $", condo:"205 000 $", plex:"—", delai:"30 j", tendance:"+15%", marche:"vendeur" },
  "vieux-port-qc": { uni:"—", condo:"265 000 $", plex:"—", delai:"38 j", tendance:"+10%", marche:"vendeur" },
  "saint-roch": { uni:"475 000 $", condo:"225 000 $", plex:"—", delai:"31 j", tendance:"+13%", marche:"vendeur" },
  "haute-ville": { uni:"525 000 $", condo:"245 000 $", plex:"—", delai:"34 j", tendance:"+12%", marche:"vendeur" },
  "sainte-foy": { uni:"575 000 $", condo:"255 000 $", plex:"—", delai:"31 j", tendance:"+13%", marche:"vendeur" },
  "charlesbourg": { uni:"485 000 $", condo:"215 000 $", plex:"—", delai:"32 j", tendance:"+13%", marche:"vendeur" },
  "beauport": { uni:"495 000 $", condo:"220 000 $", plex:"—", delai:"33 j", tendance:"+14%", marche:"vendeur" },
  // Laval
  "chomedey": { uni:"575 000 $", condo:"360 000 $", plex:"835 000 $", delai:"44 j", tendance:"+6,8%", marche:"vendeur" },
  "sainte-rose": { uni:"620 000 $", condo:"390 000 $", plex:"—", delai:"47 j", tendance:"+6,9%", marche:"vendeur" },
  "vimont": { uni:"565 000 $", condo:"370 000 $", plex:"—", delai:"43 j", tendance:"+7,5%", marche:"vendeur" },
  "auteuil": { uni:"555 000 $", condo:"365 000 $", plex:"—", delai:"44 j", tendance:"+7,1%", marche:"vendeur" },
  "duvernay": { uni:"545 000 $", condo:"355 000 $", plex:"—", delai:"43 j", tendance:"+7,3%", marche:"vendeur" },
  "fabreville": { uni:"560 000 $", condo:"360 000 $", plex:"—", delai:"45 j", tendance:"+6,9%", marche:"vendeur" },
  // Longueuil
  "vieux-longueuil": { uni:"525 000 $", condo:"335 000 $", plex:"775 000 $", delai:"44 j", tendance:"+7,1%", marche:"vendeur" },
  "saint-hubert": { uni:"565 000 $", condo:"355 000 $", plex:"—", delai:"43 j", tendance:"+7,8%", marche:"vendeur" },
  "greenfield-park": { uni:"535 000 $", condo:"340 000 $", plex:"—", delai:"45 j", tendance:"+6,9%", marche:"vendeur" },
  "brossard": { uni:"625 000 $", condo:"395 000 $", plex:"895 000 $", delai:"41 j", tendance:"+7,4%", marche:"vendeur" },
  // Sherbrooke
  "fleurimont": { uni:"455 000 $", condo:"290 000 $", plex:"—", delai:"45 j", tendance:"+7,5%", marche:"vendeur" },
  "jacques-cartier-shbk": { uni:"465 000 $", condo:"300 000 $", plex:"—", delai:"46 j", tendance:"+7%", marche:"vendeur" },
  "mont-bellevue": { uni:"475 000 $", condo:"305 000 $", plex:"—", delai:"47 j", tendance:"+6,8%", marche:"vendeur" },
  "rock-forest": { uni:"485 000 $", condo:"310 000 $", plex:"—", delai:"46 j", tendance:"+6,8%", marche:"vendeur" },
  // Gatineau
  "hull": { uni:"545 000 $", condo:"295 000 $", plex:"—", delai:"44 j", tendance:"+1,8%", marche:"equilibre" },
  "aylmer": { uni:"575 000 $", condo:"305 000 $", plex:"—", delai:"43 j", tendance:"+2,5%", marche:"equilibre" },
  "gatineau-secteur": { uni:"565 000 $", condo:"300 000 $", plex:"—", delai:"42 j", tendance:"+2%", marche:"equilibre" },
  "buckingham": { uni:"465 000 $", condo:"265 000 $", plex:"—", delai:"52 j", tendance:"+2,2%", marche:"equilibre" },
  // Villes sans sous-quartiers
  "trois-rivieres": { uni:"460 000 $", condo:"270 000 $", plex:"—", delai:"48 j", tendance:"+10%", marche:"vendeur" },
  "saguenay": { uni:"285 000 $", condo:"165 000 $", plex:"195 000 $", delai:"52 j", tendance:"+12%", marche:"vendeur" },
  "levis": { uni:"495 000 $", condo:"225 000 $", plex:"—", delai:"35 j", tendance:"+12%", marche:"vendeur" },
  "terrebonne": { uni:"495 000 $", condo:"325 000 $", plex:"—", delai:"46 j", tendance:"+8,1%", marche:"vendeur" },
  "rimouski": { uni:"295 000 $", condo:"185 000 $", plex:"—", delai:"55 j", tendance:"+9,5%", marche:"vendeur" },
  "drummondville": { uni:"365 000 $", condo:"240 000 $", plex:"—", delai:"50 j", tendance:"+10,2%", marche:"vendeur" },
};

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

export function DonneesMarche() {
  const [villeSlug, setVilleSlug] = useState("montreal");
  const [search, setSearch] = useState("");
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);
  const q = search.toLowerCase().trim();

  const isAll = villeSlug === "tous";
  const ville = villes.find((v) => v.slug === villeSlug);

  // Build grouped data
  const groups = (isAll ? villes : [ville!].filter(Boolean)).map((v) => {
    const qrs = quartiersDeVille(v.slug)
      .filter((qr) => MARKET[qr.slug])
      .filter((qr) => !q || qr.nom.toLowerCase().includes(q) || v.nom.toLowerCase().includes(q))
      .map((qr) => ({ slug: qr.slug, nom: qr.nom, couleur: qr.couleur, ...MARKET[qr.slug] }));
    return { ville: v, cards: qrs };
  }).filter((g) => g.cards.length > 0);

  return (
    <div>
      {/* Stats provinciales */}
      <div className="dm-province-stats">
        <div className="dm-pstat"><div className="dm-pstat-val">485 000 $</div><div className="dm-pstat-lbl">Prix médian provincial</div><div className="dm-pstat-sub">+7% vs 2025</div></div>
        <div className="dm-pstat"><div className="dm-pstat-val">536 000 $</div><div className="dm-pstat-lbl">Unifamiliale médiane QC</div><div className="dm-pstat-sub">+8% vs 2025</div></div>
        <div className="dm-pstat"><div className="dm-pstat-val">404 000 $</div><div className="dm-pstat-lbl">Condo médian QC</div><div className="dm-pstat-sub">+3% vs 2025</div></div>
        <div className="dm-pstat"><div className="dm-pstat-val">42%</div><div className="dm-pstat-lbl">Ratio ventes/inscriptions</div><div className="dm-pstat-sub">Marché équilibré</div></div>
      </div>

      {/* Ville selector */}
      <div style={{ marginBottom: 16 }}>
        <select
          value={villeSlug}
          onChange={(e) => { setVilleSlug(e.target.value); setSearch(""); }}
          className="px-4 py-2.5 rounded-xl text-[14px] font-medium w-full"
          style={{ background: "var(--bg-card)", color: "var(--text-primary)", border: "0.5px solid var(--border)", cursor: "pointer" }}
        >
          <option value="tous">Toutes les villes du Québec</option>
          {(() => {
            const regions = [...new Set(villes.map((v) => v.region))];
            return regions.map((region) => (
              <optgroup key={region} label={region}>
                {villes.filter((v) => v.region === region).map((v) => (
                  <option key={v.slug} value={v.slug}>{v.nom}</option>
                ))}
              </optgroup>
            ));
          })()}
        </select>
      </div>

      {/* Search */}
      <div className="dm-search-wrap">
        <svg viewBox="0 0 16 16"><circle cx="6.5" cy="6.5" r="4.5" /><line x1="10" y1="10" x2="14" y2="14" /></svg>
        <input className="dm-search-input" type="text" placeholder={isAll ? "Rechercher une ville ou un quartier..." : `Rechercher un quartier à ${ville?.nom ?? ""}...`} value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {/* Cards grouped by ville */}
      {groups.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 20px", color: "var(--text-tertiary)", fontSize: 14 }}>
          {q ? "Aucun quartier trouvé pour cette recherche." : "Aucune donnée disponible pour cette ville."}
        </div>
      ) : (
        groups.map((g) => (
          <div key={g.ville.slug} className="dm-region-section">
            <div className="dm-region-header">
              <span className="dm-region-title">{g.ville.nom} — {g.ville.region}</span>
              <span className="dm-region-count">{g.cards.length} quartier{g.cards.length > 1 ? "s" : ""}</span>
            </div>
            <div className="dm-cards-grid">
              {g.cards.map((c) => {
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
                        {isExpanded ? "Masquer l\u2019historique" : "Voir l\u2019historique des prix"}
                      </div>
                    )}
                    <div className={`dm-chart-wrapper${isExpanded ? " open" : ""}`} onClick={(e) => e.stopPropagation()}>
                      {isExpanded && <PriceHistoryChart slug={c.slug} nom={c.nom} />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
