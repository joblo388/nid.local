"use client";

import { useState } from "react";
import { villes, quartiers, quartiersDeVille } from "@/lib/data";

// ─── Market data (mirrors DonneesMarche.tsx MARKET) ─────────────────────────
type MarketEntry = { uni: number | null; condo: number | null; plex: number | null };

function parsePrice(s: string): number | null {
  if (s === "—") return null;
  return parseInt(s.replace(/[^0-9]/g, ""), 10) || null;
}

const RAW: Record<string, { uni: string; condo: string; plex: string }> = {
  "plateau-mont-royal": { uni: "985000", condo: "495000", plex: "1425000" },
  "rosemont": { uni: "825000", condo: "425000", plex: "1185000" },
  "villeray": { uni: "645000", condo: "345000", plex: "925000" },
  "griffintown": { uni: "695000", condo: "395000", plex: "985000" },
  "saint-henri": { uni: "695000", condo: "395000", plex: "985000" },
  "hochelaga": { uni: "565000", condo: "325000", plex: "825000" },
  "cote-des-neiges": { uni: "795000", condo: "425000", plex: "1125000" },
  "notre-dame-de-grace": { uni: "795000", condo: "425000", plex: "1125000" },
  "outremont": { uni: "1485000", condo: "625000", plex: "2125000" },
  "vieux-montreal": { uni: "—", condo: "525000", plex: "—" },
  "verdun": { uni: "625000", condo: "365000", plex: "895000" },
  "mile-end": { uni: "925000", condo: "475000", plex: "1350000" },
  "petite-bourgogne": { uni: "675000", condo: "385000", plex: "965000" },
  "pointe-saint-charles": { uni: "595000", condo: "345000", plex: "855000" },
  "saint-laurent": { uni: "685000", condo: "365000", plex: "925000" },
  "montreal-nord": { uni: "425000", condo: "265000", plex: "625000" },
  "anjou": { uni: "485000", condo: "295000", plex: "695000" },
  "saint-leonard": { uni: "525000", condo: "315000", plex: "745000" },
  "lasalle": { uni: "545000", condo: "325000", plex: "795000" },
  "lachine": { uni: "525000", condo: "315000", plex: "765000" },
  "riviere-des-prairies": { uni: "465000", condo: "285000", plex: "685000" },
  "dollard-des-ormeaux": { uni: "595000", condo: "335000", plex: "—" },
  "mont-royal": { uni: "1250000", condo: "545000", plex: "—" },
  "westmount": { uni: "1650000", condo: "685000", plex: "—" },
  "saint-sauveur-qc": { uni: "425000", condo: "195000", plex: "—" },
  "limoilou": { uni: "455000", condo: "205000", plex: "—" },
  "vieux-port-qc": { uni: "—", condo: "265000", plex: "—" },
  "saint-roch": { uni: "475000", condo: "225000", plex: "—" },
  "haute-ville": { uni: "525000", condo: "245000", plex: "—" },
  "sainte-foy": { uni: "575000", condo: "255000", plex: "—" },
  "charlesbourg": { uni: "485000", condo: "215000", plex: "—" },
  "beauport": { uni: "495000", condo: "220000", plex: "—" },
  "chomedey": { uni: "575000", condo: "360000", plex: "835000" },
  "sainte-rose": { uni: "620000", condo: "390000", plex: "—" },
  "vimont": { uni: "565000", condo: "370000", plex: "—" },
  "auteuil": { uni: "555000", condo: "365000", plex: "—" },
  "duvernay": { uni: "545000", condo: "355000", plex: "—" },
  "fabreville": { uni: "560000", condo: "360000", plex: "—" },
  "vieux-longueuil": { uni: "525000", condo: "335000", plex: "775000" },
  "saint-hubert": { uni: "565000", condo: "355000", plex: "—" },
  "greenfield-park": { uni: "535000", condo: "340000", plex: "—" },
  "brossard": { uni: "625000", condo: "395000", plex: "895000" },
  "fleurimont": { uni: "455000", condo: "290000", plex: "—" },
  "jacques-cartier-shbk": { uni: "465000", condo: "300000", plex: "—" },
  "mont-bellevue": { uni: "475000", condo: "305000", plex: "—" },
  "rock-forest": { uni: "485000", condo: "310000", plex: "—" },
  "hull": { uni: "545000", condo: "295000", plex: "—" },
  "aylmer": { uni: "575000", condo: "305000", plex: "—" },
  "gatineau-secteur": { uni: "565000", condo: "300000", plex: "—" },
  "buckingham": { uni: "465000", condo: "265000", plex: "—" },
  "trois-rivieres": { uni: "460000", condo: "270000", plex: "—" },
  "saguenay": { uni: "285000", condo: "165000", plex: "195000" },
  "levis": { uni: "495000", condo: "225000", plex: "—" },
  "terrebonne": { uni: "495000", condo: "325000", plex: "—" },
  "rimouski": { uni: "295000", condo: "185000", plex: "—" },
  "drummondville": { uni: "365000", condo: "240000", plex: "—" },
};

const MARKET: Record<string, MarketEntry> = {};
for (const [slug, d] of Object.entries(RAW)) {
  MARKET[slug] = { uni: parsePrice(d.uni), condo: parsePrice(d.condo), plex: parsePrice(d.plex) };
}

// Compute city-wide average for fallback
function computeCityAverage(): MarketEntry {
  let uniSum = 0, uniCount = 0, condoSum = 0, condoCount = 0, plexSum = 0, plexCount = 0;
  for (const entry of Object.values(MARKET)) {
    if (entry.uni) { uniSum += entry.uni; uniCount++; }
    if (entry.condo) { condoSum += entry.condo; condoCount++; }
    if (entry.plex) { plexSum += entry.plex; plexCount++; }
  }
  return {
    uni: uniCount ? Math.round(uniSum / uniCount) : 500000,
    condo: condoCount ? Math.round(condoSum / condoCount) : 350000,
    plex: plexCount ? Math.round(plexSum / plexCount) : 900000,
  };
}
const CITY_AVG = computeCityAverage();

// ─── Types ────────────────────────────────────────────────────────────────────
type PropType = "unifamiliale" | "condo" | "duplex" | "triplex" | "quadruplex";
type Etat = "excellent" | "bon" | "moyen" | "a-renover";

type Adjustment = { label: string; pct: number; montant: number };
type EstimationResult = {
  basePrice: number;
  adjustments: Adjustment[];
  estimatedValue: number;
  rangeLow: number;
  rangeHigh: number;
  quartierNom: string;
  typeLabel: string;
};

const TYPE_LABELS: Record<PropType, string> = {
  unifamiliale: "Unifamiliale",
  condo: "Condo",
  duplex: "Duplex",
  triplex: "Triplex",
  quadruplex: "Quadruplex",
};

const ETAT_LABELS: Record<Etat, string> = {
  excellent: "Excellent",
  bon: "Bon",
  moyen: "Moyen",
  "a-renover": "A renover",
};

const AVG_SQFT: Record<PropType, number> = {
  unifamiliale: 1200,
  condo: 800,
  duplex: 2400,
  triplex: 2400,
  quadruplex: 2400,
};

const ETAT_ADJ: Record<Etat, number> = {
  excellent: 0.05,
  bon: 0,
  moyen: -0.05,
  "a-renover": -0.15,
};

function getBasePrice(quartierSlug: string, type: PropType): number {
  const entry = MARKET[quartierSlug] || CITY_AVG;
  if (type === "unifamiliale") return entry.uni || CITY_AVG.uni!;
  if (type === "condo") return entry.condo || CITY_AVG.condo!;
  // plex types
  const plexBase = entry.plex || CITY_AVG.plex!;
  if (type === "duplex") return Math.round(plexBase * 0.65);
  if (type === "triplex") return plexBase;
  // quadruplex
  return Math.round(plexBase * 1.25);
}

function estimate(
  quartierSlug: string,
  type: PropType,
  sqft: number,
  chambres: number,
  sdb: number,
  anneeConstruction: number,
  etat: Etat,
): EstimationResult {
  const basePrice = getBasePrice(quartierSlug, type);
  const adjustments: Adjustment[] = [];

  // 1. Superficie adjustment
  const avgSqft = AVG_SQFT[type];
  const sqftRatio = sqft / avgSqft;
  const sqftAdj = sqftRatio - 1; // proportional
  if (Math.abs(sqftAdj) > 0.001) {
    const montant = Math.round(basePrice * sqftAdj);
    adjustments.push({
      label: `Superficie (${sqft.toLocaleString("fr-CA")} pi² vs ${avgSqft.toLocaleString("fr-CA")} pi² moy.)`,
      pct: Math.round(sqftAdj * 1000) / 10,
      montant,
    });
  }

  // 2. Chambres bonus: +3% per extra above 2
  const extraChambres = chambres - 2;
  if (extraChambres !== 0) {
    const chambresPct = extraChambres * 0.03;
    const montant = Math.round(basePrice * chambresPct);
    adjustments.push({
      label: `Chambres (${chambres} ${extraChambres > 0 ? "+" : ""}${extraChambres} vs 2)`,
      pct: Math.round(chambresPct * 1000) / 10,
      montant,
    });
  }

  // 3. Salles de bain bonus: +2% per extra above 1
  const extraSdb = sdb - 1;
  if (extraSdb !== 0) {
    const sdbPct = extraSdb * 0.02;
    const montant = Math.round(basePrice * sdbPct);
    adjustments.push({
      label: `Salles de bain (${sdb} ${extraSdb > 0 ? "+" : ""}${extraSdb} vs 1)`,
      pct: Math.round(sdbPct * 1000) / 10,
      montant,
    });
  }

  // 4. Construction year
  const currentYear = 2026;
  const age = currentYear - anneeConstruction;
  let agePct = 0;
  if (age <= 5) agePct = 0.05;
  else if (age <= 15) agePct = 0.02;
  else if (age <= 30) agePct = 0;
  else if (age <= 60) agePct = -0.03;
  else agePct = -0.06;
  if (agePct !== 0) {
    const montant = Math.round(basePrice * agePct);
    adjustments.push({
      label: `Annee de construction (${anneeConstruction}, ${age} ans)`,
      pct: Math.round(agePct * 1000) / 10,
      montant,
    });
  }

  // 5. Etat
  const etatPct = ETAT_ADJ[etat];
  if (etatPct !== 0) {
    const montant = Math.round(basePrice * etatPct);
    adjustments.push({
      label: `Etat : ${ETAT_LABELS[etat]}`,
      pct: Math.round(etatPct * 1000) / 10,
      montant,
    });
  }

  const totalAdj = adjustments.reduce((sum, a) => sum + a.montant, 0);
  const estimatedValue = Math.round((basePrice + totalAdj) / 1000) * 1000; // round to nearest 1000
  const rangeLow = Math.round(estimatedValue * 0.9 / 1000) * 1000;
  const rangeHigh = Math.round(estimatedValue * 1.1 / 1000) * 1000;

  const q = quartiers.find((qr) => qr.slug === quartierSlug);
  const quartierNom = q?.nom || quartierSlug;

  return {
    basePrice,
    adjustments,
    estimatedValue,
    rangeLow,
    rangeHigh,
    quartierNom,
    typeLabel: TYPE_LABELS[type],
  };
}

function formatCAD(n: number): string {
  return n.toLocaleString("fr-CA", { style: "currency", currency: "CAD", minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

// ─── Component ────────────────────────────────────────────────────────────────

export function EstimationClient() {
  const [villeSlug, setVilleSlug] = useState("montreal");
  const [quartierSlug, setQuartierSlug] = useState("plateau-mont-royal");
  const [type, setType] = useState<PropType>("unifamiliale");
  const [sqft, setSqft] = useState("1200");
  const [chambres, setChambres] = useState("3");
  const [sdb, setSdb] = useState("1");
  const [annee, setAnnee] = useState("1990");
  const [etat, setEtat] = useState<Etat>("bon");
  const [result, setResult] = useState<EstimationResult | null>(null);

  const quartiersForVille = quartiersDeVille(villeSlug).filter((q) => MARKET[q.slug]);
  // Also include ville-level entries (villes without sub-quartiers)
  const villeEntry = villes.find((v) => v.slug === villeSlug);
  const hasVilleMarket = MARKET[villeSlug] && !quartiersForVille.some((q) => q.slug === villeSlug);

  function handleVilleChange(newVille: string) {
    setVilleSlug(newVille);
    const qrs = quartiersDeVille(newVille).filter((q) => MARKET[q.slug]);
    if (MARKET[newVille] && !qrs.some((q) => q.slug === newVille)) {
      setQuartierSlug(newVille);
    } else if (qrs.length > 0) {
      setQuartierSlug(qrs[0].slug);
    } else {
      setQuartierSlug(newVille);
    }
    setResult(null);
  }

  function handleEstimate() {
    const s = parseInt(sqft.replace(/\s/g, ""), 10) || 1200;
    const c = parseInt(chambres, 10) || 3;
    const b = parseInt(sdb, 10) || 1;
    const a = parseInt(annee, 10) || 1990;
    setResult(estimate(quartierSlug, type, s, c, b, a, etat));
  }

  return (
    <div>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        {/* Form */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[14px]">
          {/* Ville */}
          <div className="col-span-1 sm:col-span-2">
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 4, color: "var(--text-secondary)" }}>
              Ville
            </label>
            <select
              value={villeSlug}
              onChange={(e) => handleVilleChange(e.target.value)}
              style={{
                width: "100%", padding: "8px 10px", fontSize: 13, borderRadius: 8,
                border: "0.5px solid var(--border)", background: "var(--bg-secondary)", color: "var(--text-primary)",

              }}
            >
              {villes.map((v) => (
                <option key={v.slug} value={v.slug}>{v.nom}</option>
              ))}
            </select>
          </div>

          {/* Quartier */}
          <div className="col-span-1 sm:col-span-2">
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 4, color: "var(--text-secondary)" }}>
              Quartier
            </label>
            <select
              value={quartierSlug}
              onChange={(e) => { setQuartierSlug(e.target.value); setResult(null); }}
              style={{
                width: "100%", padding: "8px 10px", fontSize: 13, borderRadius: 8,
                border: "0.5px solid var(--border)", background: "var(--bg-secondary)", color: "var(--text-primary)",

              }}
            >
              {hasVilleMarket && villeEntry && (
                <option value={villeSlug}>{villeEntry.nom} (ensemble)</option>
              )}
              {quartiersForVille.map((q) => (
                <option key={q.slug} value={q.slug}>{q.nom}</option>
              ))}
            </select>
          </div>

          {/* Type de propriete */}
          <div className="col-span-1 sm:col-span-2">
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 4, color: "var(--text-secondary)" }}>
              Type de propriete
            </label>
            <select
              value={type}
              onChange={(e) => { setType(e.target.value as PropType); setResult(null); }}
              style={{
                width: "100%", padding: "8px 10px", fontSize: 13, borderRadius: 8,
                border: "0.5px solid var(--border)", background: "var(--bg-secondary)", color: "var(--text-primary)",

              }}
            >
              <option value="unifamiliale">Unifamiliale</option>
              <option value="condo">Condo</option>
              <option value="duplex">Duplex</option>
              <option value="triplex">Triplex</option>
              <option value="quadruplex">Quadruplex</option>
            </select>
          </div>

          {/* Superficie */}
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 4, color: "var(--text-secondary)" }}>
              Superficie (pi²)
            </label>
            <input
              type="text"
              value={sqft}
              onChange={(e) => { setSqft(e.target.value); setResult(null); }}
              placeholder="1200"
              style={{
                width: "100%", padding: "8px 10px", fontSize: 13, borderRadius: 8,
                border: "0.5px solid var(--border)", background: "var(--bg-secondary)", color: "var(--text-primary)",

              }}
            />
          </div>

          {/* Chambres */}
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 4, color: "var(--text-secondary)" }}>
              Nombre de chambres
            </label>
            <select
              value={chambres}
              onChange={(e) => { setChambres(e.target.value); setResult(null); }}
              style={{
                width: "100%", padding: "8px 10px", fontSize: 13, borderRadius: 8,
                border: "0.5px solid var(--border)", background: "var(--bg-secondary)", color: "var(--text-primary)",

              }}
            >
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          {/* Salles de bain */}
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 4, color: "var(--text-secondary)" }}>
              Salles de bain
            </label>
            <select
              value={sdb}
              onChange={(e) => { setSdb(e.target.value); setResult(null); }}
              style={{
                width: "100%", padding: "8px 10px", fontSize: 13, borderRadius: 8,
                border: "0.5px solid var(--border)", background: "var(--bg-secondary)", color: "var(--text-primary)",

              }}
            >
              {[1, 2, 3, 4].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          {/* Annee de construction */}
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 4, color: "var(--text-secondary)" }}>
              Annee de construction
            </label>
            <input
              type="text"
              value={annee}
              onChange={(e) => { setAnnee(e.target.value); setResult(null); }}
              placeholder="1990"
              style={{
                width: "100%", padding: "8px 10px", fontSize: 13, borderRadius: 8,
                border: "0.5px solid var(--border)", background: "var(--bg-secondary)", color: "var(--text-primary)",

              }}
            />
          </div>

          {/* Etat */}
          <div className="col-span-1 sm:col-span-2">
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 4, color: "var(--text-secondary)" }}>
              Etat de la propriete
            </label>
            <select
              value={etat}
              onChange={(e) => { setEtat(e.target.value as Etat); setResult(null); }}
              style={{
                width: "100%", padding: "8px 10px", fontSize: 13, borderRadius: 8,
                border: "0.5px solid var(--border)", background: "var(--bg-secondary)", color: "var(--text-primary)",

              }}
            >
              <option value="excellent">Excellent</option>
              <option value="bon">Bon</option>
              <option value="moyen">Moyen</option>
              <option value="a-renover">A renover</option>
            </select>
          </div>
        </div>

        {/* Submit button */}
        <button
          onClick={handleEstimate}
          style={{
            width: "100%", marginTop: 18, padding: "11px 0", borderRadius: 12,
            background: "var(--green)", color: "#fff", fontSize: 14, fontWeight: 600,
            border: "none", cursor: "pointer", transition: "opacity 0.15s",
          }}
          onMouseEnter={(e) => { (e.target as HTMLElement).style.opacity = "0.9"; }}
          onMouseLeave={(e) => { (e.target as HTMLElement).style.opacity = "1"; }}
        >
          Estimer la valeur
        </button>
      </div>

      {/* Result */}
      {result && (
        <div style={{ maxWidth: 700, margin: "24px auto 0" }}>
          <div
            style={{
              background: "var(--bg-card)", border: "0.5px solid var(--border)", borderRadius: 12,
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div style={{ background: "var(--green-light-bg)", padding: "20px 16px", textAlign: "center" }}>
              <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--green-text)", marginBottom: 6 }}>
                Valeur estimee
              </div>
              <div style={{ fontSize: 32, fontWeight: 800, color: "var(--green-text)", lineHeight: 1.1 }}>
                {formatCAD(result.estimatedValue)}
              </div>
              <div style={{ fontSize: 12, color: "var(--green-text)", opacity: 0.8, marginTop: 6 }}>
                Fourchette : {formatCAD(result.rangeLow)} — {formatCAD(result.rangeHigh)}
              </div>
            </div>

            {/* Details */}
            <div style={{ padding: "16px 16px" }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 10 }}>
                Detail de l&apos;estimation
              </div>

              {/* Property info */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "0.5px solid var(--border)", flexWrap: "wrap", gap: "4px", wordBreak: "break-word" as const }}>
                <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                  {result.typeLabel} — {result.quartierNom}
                </span>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>
                  {formatCAD(result.basePrice)}
                </span>
              </div>

              {/* Adjustments */}
              {result.adjustments.map((adj, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "0.5px solid var(--border)", flexWrap: "wrap", gap: "4px", wordBreak: "break-word" as const }}>
                  <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>{adj.label}</span>
                  <span style={{
                    fontSize: 12, fontWeight: 600,
                    color: adj.montant > 0 ? "var(--green-text)" : adj.montant < 0 ? "var(--red-text)" : "var(--text-tertiary)",
                  }}>
                    {adj.montant >= 0 ? "+" : ""}{formatCAD(adj.montant)} ({adj.pct >= 0 ? "+" : ""}{adj.pct}%)
                  </span>
                </div>
              ))}

              {/* Total */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0 0" }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>Valeur estimee</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: "var(--green-text)" }}>
                  {formatCAD(result.estimatedValue)}
                </span>
              </div>
            </div>

            {/* Disclaimer */}
            <div style={{ padding: "12px 16px 16px", borderTop: "0.5px solid var(--border)" }}>
              <p style={{ fontSize: 11, color: "var(--text-tertiary)", lineHeight: 1.5 }}>
                Cette estimation est fournie a titre indicatif seulement. Elle est basee sur les donnees medianes du marche immobilier
                quebecois et des facteurs d&apos;ajustement simplifies. Pour une evaluation precise, consultez un evaluateur agree ou un courtier
                immobilier de votre region. La valeur reelle peut varier significativement selon l&apos;emplacement exact, les renovations
                effectuees, le terrain et les conditions du marche au moment de la vente.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
