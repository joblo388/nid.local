"use client";

import { useState, useEffect, useCallback } from "react";
import { quartiers, villes } from "@/lib/data";

// ─── Market data (same source as DonneesMarche.tsx) ─────────────────────────

type MarketData = { uni: string; condo: string; plex: string; delai: string; tendance: string; marche: string };

const MARKET: Record<string, MarketData> = {
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
  "saint-sauveur-qc": { uni:"425 000 $", condo:"195 000 $", plex:"—", delai:"32 j", tendance:"+14%", marche:"vendeur" },
  "limoilou": { uni:"455 000 $", condo:"205 000 $", plex:"—", delai:"30 j", tendance:"+15%", marche:"vendeur" },
  "vieux-port-qc": { uni:"—", condo:"265 000 $", plex:"—", delai:"38 j", tendance:"+10%", marche:"vendeur" },
  "saint-roch": { uni:"475 000 $", condo:"225 000 $", plex:"—", delai:"31 j", tendance:"+13%", marche:"vendeur" },
  "haute-ville": { uni:"525 000 $", condo:"245 000 $", plex:"—", delai:"34 j", tendance:"+12%", marche:"vendeur" },
  "sainte-foy": { uni:"575 000 $", condo:"255 000 $", plex:"—", delai:"31 j", tendance:"+13%", marche:"vendeur" },
  "charlesbourg": { uni:"485 000 $", condo:"215 000 $", plex:"—", delai:"32 j", tendance:"+13%", marche:"vendeur" },
  "beauport": { uni:"495 000 $", condo:"220 000 $", plex:"—", delai:"33 j", tendance:"+14%", marche:"vendeur" },
  "chomedey": { uni:"575 000 $", condo:"360 000 $", plex:"835 000 $", delai:"44 j", tendance:"+6,8%", marche:"vendeur" },
  "sainte-rose": { uni:"620 000 $", condo:"390 000 $", plex:"—", delai:"47 j", tendance:"+6,9%", marche:"vendeur" },
  "vimont": { uni:"565 000 $", condo:"370 000 $", plex:"—", delai:"43 j", tendance:"+7,5%", marche:"vendeur" },
  "auteuil": { uni:"555 000 $", condo:"365 000 $", plex:"—", delai:"44 j", tendance:"+7,1%", marche:"vendeur" },
  "duvernay": { uni:"545 000 $", condo:"355 000 $", plex:"—", delai:"43 j", tendance:"+7,3%", marche:"vendeur" },
  "fabreville": { uni:"560 000 $", condo:"360 000 $", plex:"—", delai:"45 j", tendance:"+6,9%", marche:"vendeur" },
  "vieux-longueuil": { uni:"525 000 $", condo:"335 000 $", plex:"775 000 $", delai:"44 j", tendance:"+7,1%", marche:"vendeur" },
  "saint-hubert": { uni:"565 000 $", condo:"355 000 $", plex:"—", delai:"43 j", tendance:"+7,8%", marche:"vendeur" },
  "greenfield-park": { uni:"535 000 $", condo:"340 000 $", plex:"—", delai:"45 j", tendance:"+6,9%", marche:"vendeur" },
  "brossard": { uni:"625 000 $", condo:"395 000 $", plex:"895 000 $", delai:"41 j", tendance:"+7,4%", marche:"vendeur" },
  "fleurimont": { uni:"455 000 $", condo:"290 000 $", plex:"—", delai:"45 j", tendance:"+7,5%", marche:"vendeur" },
  "jacques-cartier-shbk": { uni:"465 000 $", condo:"300 000 $", plex:"—", delai:"46 j", tendance:"+7%", marche:"vendeur" },
  "mont-bellevue": { uni:"475 000 $", condo:"305 000 $", plex:"—", delai:"47 j", tendance:"+6,8%", marche:"vendeur" },
  "rock-forest": { uni:"485 000 $", condo:"310 000 $", plex:"—", delai:"46 j", tendance:"+6,8%", marche:"vendeur" },
  "hull": { uni:"545 000 $", condo:"295 000 $", plex:"—", delai:"44 j", tendance:"+1,8%", marche:"equilibre" },
  "aylmer": { uni:"575 000 $", condo:"305 000 $", plex:"—", delai:"43 j", tendance:"+2,5%", marche:"equilibre" },
  "gatineau-secteur": { uni:"565 000 $", condo:"300 000 $", plex:"—", delai:"42 j", tendance:"+2%", marche:"equilibre" },
  "buckingham": { uni:"465 000 $", condo:"265 000 $", plex:"—", delai:"52 j", tendance:"+2,2%", marche:"equilibre" },
  "trois-rivieres": { uni:"460 000 $", condo:"270 000 $", plex:"—", delai:"48 j", tendance:"+10%", marche:"vendeur" },
  "saguenay": { uni:"285 000 $", condo:"165 000 $", plex:"195 000 $", delai:"52 j", tendance:"+12%", marche:"vendeur" },
  "levis": { uni:"495 000 $", condo:"225 000 $", plex:"—", delai:"35 j", tendance:"+12%", marche:"vendeur" },
  "terrebonne": { uni:"495 000 $", condo:"325 000 $", plex:"—", delai:"46 j", tendance:"+8,1%", marche:"vendeur" },
  "rimouski": { uni:"295 000 $", condo:"185 000 $", plex:"—", delai:"55 j", tendance:"+9,5%", marche:"vendeur" },
  "drummondville": { uni:"365 000 $", condo:"240 000 $", plex:"—", delai:"50 j", tendance:"+10,2%", marche:"vendeur" },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function parsePrice(s: string): number | null {
  if (!s || s === "—") return null;
  return parseInt(s.replace(/[^0-9]/g, ""), 10) || null;
}

function parseTrend(s: string): number {
  return parseFloat(s.replace(",", ".").replace("+", "")) || 0;
}

const villeBySlug = Object.fromEntries(villes.map((v) => [v.slug, v]));

type QuartierStats = {
  slug: string;
  nom: string;
  villeNom: string;
  market: MarketData | null;
  reviewAvg: number | null;
  reviewCount: number;
  postCount: number;
  listingCount: number;
};

// ─── Component ───────────────────────────────────────────────────────────────

export function ComparerQuartiers() {
  const [selected, setSelected] = useState<string[]>(["", "", ""]);
  const [stats, setStats] = useState<Record<string, QuartierStats>>({});
  const [loading, setLoading] = useState(false);

  // Quartiers with market data available — sorted by ville then name
  const available = quartiers
    .filter((q) => MARKET[q.slug])
    .sort((a, b) => {
      const va = villeBySlug[a.villeSlug]?.nom ?? "";
      const vb = villeBySlug[b.villeSlug]?.nom ?? "";
      if (va !== vb) return va.localeCompare(vb);
      return a.nom.localeCompare(b.nom);
    });

  const activeSelection = selected.filter((s) => s !== "");

  const fetchStats = useCallback(async (slugs: string[]) => {
    if (slugs.length === 0) return;
    setLoading(true);
    try {
      const results: Record<string, QuartierStats> = {};

      await Promise.all(
        slugs.map(async (slug) => {
          const q = quartiers.find((qr) => qr.slug === slug);
          if (!q) return;

          // Fetch reviews + post count + listing count in parallel
          const [reviewRes, postRes, listingRes] = await Promise.all([
            fetch(`/api/quartiers/${slug}/reviews`).then((r) => r.ok ? r.json() : null).catch(() => null),
            fetch(`/api/comparer-quartiers/stats?quartierSlug=${slug}&type=posts`).then((r) => r.ok ? r.json() : null).catch(() => null),
            fetch(`/api/comparer-quartiers/stats?quartierSlug=${slug}&type=listings`).then((r) => r.ok ? r.json() : null).catch(() => null),
          ]);

          // Compute overall review average from the criteria averages
          let reviewAvg: number | null = null;
          let reviewCount = 0;
          if (reviewRes && reviewRes.averages) {
            const vals = Object.values(reviewRes.averages as Record<string, number>);
            if (vals.length > 0) {
              reviewAvg = Math.round((vals.reduce((a: number, b: number) => a + b, 0) / vals.length) * 10) / 10;
            }
            reviewCount = reviewRes.total ?? 0;
          }

          results[slug] = {
            slug,
            nom: q.nom,
            villeNom: villeBySlug[q.villeSlug]?.nom ?? q.villeSlug,
            market: MARKET[slug] ?? null,
            reviewAvg,
            reviewCount,
            postCount: postRes?.count ?? 0,
            listingCount: listingRes?.count ?? 0,
          };
        })
      );

      setStats((prev) => ({ ...prev, ...results }));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const slugs = activeSelection.filter((s) => !stats[s]);
    if (slugs.length > 0) fetchStats(slugs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  function handleSelect(index: number, slug: string) {
    const next = [...selected];
    next[index] = slug;
    setSelected(next);
  }

  function highlightClass(values: (number | null)[], idx: number, mode: "lowest" | "highest"): string {
    const valid = values.map((v, i) => ({ v, i })).filter((x) => x.v !== null);
    if (valid.length < 2) return "";
    const best = mode === "lowest"
      ? valid.reduce((a, b) => (a.v! < b.v! ? a : b))
      : valid.reduce((a, b) => (a.v! > b.v! ? a : b));
    return best.i === idx ? "comparer-highlight" : "";
  }

  const data = activeSelection.map((slug) => stats[slug]).filter(Boolean) as QuartierStats[];
  const showTable = data.length >= 2;

  return (
    <div className="space-y-5">
      {/* Selectors */}
      <div
        className="rounded-xl p-5 space-y-4"
        style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
      >
        <p className="text-[12px] font-semibold" style={{ color: "var(--text-secondary)" }}>
          Sélectionnez 2 ou 3 quartiers à comparer
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[0, 1, 2].map((idx) => (
            <div key={idx}>
              <label className="block text-[11px] font-medium mb-1" style={{ color: "var(--text-tertiary)" }}>
                Quartier {idx + 1}{idx < 2 ? " *" : " (optionnel)"}
              </label>
              <select
                value={selected[idx]}
                onChange={(e) => handleSelect(idx, e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl text-[13px] outline-none"
                style={{ background: "var(--bg-secondary)", border: "1.5px solid var(--border)", color: "var(--text-primary)" }}
              >
                <option value="">— Choisir —</option>
                {available.map((q) => {
                  const ville = villeBySlug[q.villeSlug];
                  const disabled = selected.includes(q.slug) && selected[idx] !== q.slug;
                  return (
                    <option key={q.slug} value={q.slug} disabled={disabled}>
                      {q.nom} ({ville?.nom ?? q.villeSlug})
                    </option>
                  );
                })}
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="text-center py-6 text-[13px]" style={{ color: "var(--text-tertiary)" }}>
          Chargement des donnees...
        </div>
      )}

      {/* Comparison table */}
      {showTable && (
        <div
          className="rounded-xl overflow-hidden"
          style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]" style={{ color: "var(--text-primary)" }}>
              <thead>
                <tr style={{ background: "var(--bg-secondary)" }}>
                  <th className="text-left px-4 py-3 text-[12px] font-semibold" style={{ color: "var(--text-secondary)", minWidth: "140px" }}>
                    Critere
                  </th>
                  {data.map((d) => (
                    <th key={d.slug} className="text-center px-4 py-3 text-[12px] font-semibold" style={{ color: "var(--text-primary)", minWidth: "150px" }}>
                      <div>{d.nom}</div>
                      <div className="text-[11px] font-normal" style={{ color: "var(--text-tertiary)" }}>{d.villeNom}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Unifamiliale */}
                <tr style={{ borderTop: "0.5px solid var(--border)" }}>
                  <td className="px-4 py-3 font-medium" style={{ color: "var(--text-secondary)" }}>Unifamiliale</td>
                  {data.map((d, i) => {
                    const prices = data.map((x) => parsePrice(x.market?.uni ?? ""));
                    return (
                      <td key={d.slug} className={`px-4 py-3 text-center ${highlightClass(prices, i, "lowest")}`}>
                        {d.market?.uni ?? "—"}
                      </td>
                    );
                  })}
                </tr>

                {/* Condo */}
                <tr style={{ borderTop: "0.5px solid var(--border)" }}>
                  <td className="px-4 py-3 font-medium" style={{ color: "var(--text-secondary)" }}>Condo</td>
                  {data.map((d, i) => {
                    const prices = data.map((x) => parsePrice(x.market?.condo ?? ""));
                    return (
                      <td key={d.slug} className={`px-4 py-3 text-center ${highlightClass(prices, i, "lowest")}`}>
                        {d.market?.condo ?? "—"}
                      </td>
                    );
                  })}
                </tr>

                {/* Plex */}
                <tr style={{ borderTop: "0.5px solid var(--border)" }}>
                  <td className="px-4 py-3 font-medium" style={{ color: "var(--text-secondary)" }}>Plex</td>
                  {data.map((d, i) => {
                    const prices = data.map((x) => parsePrice(x.market?.plex ?? ""));
                    return (
                      <td key={d.slug} className={`px-4 py-3 text-center ${highlightClass(prices, i, "lowest")}`}>
                        {d.market?.plex ?? "—"}
                      </td>
                    );
                  })}
                </tr>

                {/* Tendance */}
                <tr style={{ borderTop: "0.5px solid var(--border)" }}>
                  <td className="px-4 py-3 font-medium" style={{ color: "var(--text-secondary)" }}>Tendance</td>
                  {data.map((d, i) => {
                    const trends = data.map((x) => parseTrend(x.market?.tendance ?? "0"));
                    return (
                      <td key={d.slug} className={`px-4 py-3 text-center ${highlightClass(trends, i, "highest")}`}>
                        {d.market?.tendance ?? "—"}
                      </td>
                    );
                  })}
                </tr>

                {/* Delai */}
                <tr style={{ borderTop: "0.5px solid var(--border)" }}>
                  <td className="px-4 py-3 font-medium" style={{ color: "var(--text-secondary)" }}>Delai de vente</td>
                  {data.map((d, i) => {
                    const delais = data.map((x) => {
                      const m = x.market?.delai?.match(/(\d+)/);
                      return m ? parseInt(m[1], 10) : null;
                    });
                    return (
                      <td key={d.slug} className={`px-4 py-3 text-center ${highlightClass(delais, i, "lowest")}`}>
                        {d.market?.delai ?? "—"}
                      </td>
                    );
                  })}
                </tr>

                {/* Marche */}
                <tr style={{ borderTop: "0.5px solid var(--border)" }}>
                  <td className="px-4 py-3 font-medium" style={{ color: "var(--text-secondary)" }}>Condition du marche</td>
                  {data.map((d) => {
                    const m = d.market?.marche ?? "";
                    const label = m === "vendeur" ? "Vendeur" : m === "acheteur" ? "Acheteur" : "Equilibre";
                    const style = m === "vendeur"
                      ? { background: "var(--green-light-bg)", color: "var(--green-text)" }
                      : m === "acheteur"
                      ? { background: "var(--blue-bg)", color: "var(--blue-text)" }
                      : { background: "var(--amber-bg)", color: "var(--amber-text)" };
                    return (
                      <td key={d.slug} className="px-4 py-3 text-center">
                        <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-medium" style={style}>
                          {label}
                        </span>
                      </td>
                    );
                  })}
                </tr>

                {/* Note moyenne */}
                <tr style={{ borderTop: "0.5px solid var(--border)" }}>
                  <td className="px-4 py-3 font-medium" style={{ color: "var(--text-secondary)" }}>Note moyenne</td>
                  {data.map((d, i) => {
                    const ratings = data.map((x) => x.reviewAvg);
                    return (
                      <td key={d.slug} className={`px-4 py-3 text-center ${highlightClass(ratings, i, "highest")}`}>
                        {d.reviewAvg !== null ? (
                          <span>
                            {d.reviewAvg.toFixed(1)}/5
                            <span className="text-[11px] ml-1" style={{ color: "var(--text-tertiary)" }}>
                              ({d.reviewCount} avis)
                            </span>
                          </span>
                        ) : (
                          <span style={{ color: "var(--text-tertiary)" }}>Aucun avis</span>
                        )}
                      </td>
                    );
                  })}
                </tr>

                {/* Discussions */}
                <tr style={{ borderTop: "0.5px solid var(--border)" }}>
                  <td className="px-4 py-3 font-medium" style={{ color: "var(--text-secondary)" }}>Discussions</td>
                  {data.map((d, i) => {
                    const counts = data.map((x) => x.postCount);
                    return (
                      <td key={d.slug} className={`px-4 py-3 text-center ${highlightClass(counts, i, "highest")}`}>
                        {d.postCount} posts
                      </td>
                    );
                  })}
                </tr>

                {/* Annonces actives */}
                <tr style={{ borderTop: "0.5px solid var(--border)" }}>
                  <td className="px-4 py-3 font-medium" style={{ color: "var(--text-secondary)" }}>Annonces actives</td>
                  {data.map((d, i) => {
                    const counts = data.map((x) => x.listingCount);
                    return (
                      <td key={d.slug} className={`px-4 py-3 text-center ${highlightClass(counts, i, "highest")}`}>
                        {d.listingCount} annonces
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div className="px-4 py-3 flex items-center gap-2 text-[11px]" style={{ borderTop: "0.5px solid var(--border)", color: "var(--text-tertiary)" }}>
            <span
              className="inline-block w-3 h-3 rounded-sm"
              style={{ background: "var(--green-light-bg)", border: "0.5px solid var(--green)" }}
            />
            <span>= Meilleur resultat dans cette categorie</span>
          </div>
        </div>
      )}

      {!showTable && activeSelection.length > 0 && !loading && (
        <div
          className="rounded-xl p-8 text-center"
          style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
        >
          <p className="text-[13px]" style={{ color: "var(--text-tertiary)" }}>
            Selectionnez au moins 2 quartiers pour voir la comparaison.
          </p>
        </div>
      )}

      {activeSelection.length === 0 && (
        <div
          className="rounded-xl p-8 text-center"
          style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
        >
          <p className="text-[14px] font-medium mb-2" style={{ color: "var(--text-secondary)" }}>
            Commencez par selectionner des quartiers ci-dessus
          </p>
          <p className="text-[13px]" style={{ color: "var(--text-tertiary)" }}>
            Comparez les prix, avis et activite de 2 a 3 quartiers cote a cote.
          </p>
        </div>
      )}

      <style jsx>{`
        .comparer-highlight {
          background: var(--green-light-bg);
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
