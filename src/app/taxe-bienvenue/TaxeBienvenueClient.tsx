"use client";

import { useEffect, useState, useCallback } from "react";
import { villes } from "@/lib/data";
import { ShareCalculation } from "@/components/ShareCalculation";

/* ─── Types ────────────────────────────────────────────────────────────────── */

interface TierRow {
  label: string;
  rate: string;
  amount: number;
}

interface Result {
  tiers: TierRow[];
  baseTax: number;
  montrealSupp: number;
  montrealTiers: TierRow[];
  total: number;
  premierAchat: boolean;
  isMontreal: boolean;
}

/* ─── Rates ────────────────────────────────────────────────────────────────── */

const BRACKETS = [
  { from: 0,        to: 58900,   rate: 0.005 },
  { from: 58900,    to: 294600,  rate: 0.01  },
  { from: 294600,   to: 500000,  rate: 0.015 },
  { from: 500000,   to: 1000000, rate: 0.02  },   // Mtl only above 500k at 2%
  { from: 1000000,  to: Infinity, rate: 0.025 },   // Mtl only above 1M at 2.5%
];

const MTL_SUPP = [
  { from: 500000,   to: 1000000,  rate: 0.005 },
  { from: 1000000,  to: 2000000,  rate: 0.01  },
  { from: 2000000,  to: Infinity, rate: 0.015 },
];

/* ─── Helpers ──────────────────────────────────────────────────────────────── */

function rawNum(s: string): number {
  return parseFloat(s.replace(/\s/g, "").replace(",", ".")) || 0;
}

function fmtCAD(n: number): string {
  return Math.round(n).toLocaleString("fr-CA") + " $";
}

function fmtInput(el: HTMLInputElement) {
  const v = el.value.replace(/\D/g, "");
  if (v) el.value = parseInt(v).toLocaleString("fr-CA");
}

function bracketLabel(from: number, to: number): string {
  if (to === Infinity) return `Plus de ${fmtCAD(from)}`;
  if (from === 0) return `Premiers ${fmtCAD(to)}`;
  return `${fmtCAD(from)} - ${fmtCAD(to)}`;
}

function pctLabel(rate: number): string {
  return (rate * 100).toFixed(1) + " %";
}

/* ─── Sorted villes for dropdown ──────────────────────────────────────────── */

const sortedVilles = [...villes].sort((a, b) => a.nom.localeCompare(b.nom, "fr-CA"));

/* ─── Component ────────────────────────────────────────────────────────────── */

export function TaxeBienvenueClient() {
  const [result, setResult] = useState<Result | null>(null);

  const calculate = useCallback(() => {
    const priceEl = document.getElementById("tb-price") as HTMLInputElement | null;
    const villeEl = document.getElementById("tb-ville") as HTMLSelectElement | null;
    const premierEl = document.getElementById("tb-premier") as HTMLInputElement | null;
    if (!priceEl || !villeEl) return;

    const price = rawNum(priceEl.value);
    const villeSlug = villeEl.value;
    const premierAchat = premierEl?.checked ?? false;
    const isMontreal = villeSlug === "montreal";

    if (price <= 0) { setResult(null); return; }

    // Base tax (all of Quebec)
    const tiers: TierRow[] = [];
    let baseTax = 0;

    // For non-Montreal, the standard brackets only go up to $500k at 1.5%
    // Above that, the rate is still 1.5% for non-Montreal cities.
    // For Montreal, the higher brackets (2.0% and 2.5%) apply.
    const effectiveBrackets = isMontreal ? BRACKETS : [
      { from: 0,        to: 58900,    rate: 0.005 },
      { from: 58900,    to: 294600,   rate: 0.01  },
      { from: 294600,   to: 500000,   rate: 0.015 },
      { from: 500000,   to: Infinity, rate: 0.015 },
    ];

    for (const b of effectiveBrackets) {
      if (price <= b.from) break;
      const taxable = Math.min(price, b.to) - b.from;
      const amount = taxable * b.rate;
      tiers.push({ label: bracketLabel(b.from, b.to), rate: pctLabel(b.rate), amount });
      baseTax += amount;
    }

    // Montreal supplementary tax
    let montrealSupp = 0;
    const montrealTiers: TierRow[] = [];
    if (isMontreal) {
      for (const b of MTL_SUPP) {
        if (price <= b.from) break;
        const taxable = Math.min(price, b.to) - b.from;
        const amount = taxable * b.rate;
        montrealTiers.push({ label: bracketLabel(b.from, b.to), rate: pctLabel(b.rate), amount });
        montrealSupp += amount;
      }
    }

    setResult({
      tiers,
      baseTax,
      montrealSupp,
      montrealTiers,
      total: baseTax + montrealSupp,
      premierAchat,
      isMontreal,
    });
  }, []);

  /* Restore from URL params on mount */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const map: Record<string, string> = { prix: "tb-price", ville: "tb-ville", premier: "tb-premier" };
    for (const [paramKey, elId] of Object.entries(map)) {
      const v = params.get(paramKey);
      if (v !== null) {
        const el = document.getElementById(elId) as HTMLInputElement | HTMLSelectElement | null;
        if (el) {
          if (el instanceof HTMLInputElement && el.type === "checkbox") {
            el.checked = v === "1" || v === "true";
          } else {
            el.value = v;
          }
        }
      }
    }
    if (params.has("prix")) calculate();
  }, [calculate]);

  return (
    <>
      <style>{css}</style>
      <div className="tb-calc">
        <div className="tb-sub">
          Calculez les droits de mutation immobiliere (taxe de bienvenue) pour votre achat au Quebec.
        </div>

        <div className="tb-grid">
          <div className="tb-field full">
            <label>Prix d&apos;achat de la propriete</label>
            <div className="tb-field-input">
              <input
                type="text"
                id="tb-price"
                defaultValue="450 000"
                placeholder="Ex: 450 000"
                onInput={(e) => { fmtInput(e.currentTarget as HTMLInputElement); }}
              />
              <span className="tb-unit">$</span>
            </div>
          </div>

          <div className="tb-field full">
            <label>Ville</label>
            <div className="tb-field-input">
              <select id="tb-ville" defaultValue="montreal">
                {sortedVilles.map((v) => (
                  <option key={v.slug} value={v.slug}>{v.nom}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="tb-field full">
            <div className="tb-checkbox-row">
              <input type="checkbox" id="tb-premier" />
              <label htmlFor="tb-premier">Premier achat? (exemption possible selon la municipalite)</label>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="tb-btn"
          onClick={calculate}
        >
          Calculer la taxe de bienvenue
        </button>

        {/* ─── Results ────────────────────────────────────────────────────── */}
        {result && (
          <div className="tb-results">
            <div className="tb-result-main">
              <div className="tb-result-label">Taxe de bienvenue totale</div>
              <div className="tb-result-amount">{fmtCAD(result.total)}</div>
            </div>

            {/* Base tier breakdown */}
            <div className="tb-table-wrap">
              <table className="tb-table">
                <thead>
                  <tr>
                    <th>Tranche</th>
                    <th>Taux</th>
                    <th>Montant</th>
                  </tr>
                </thead>
                <tbody>
                  {result.tiers.map((t, i) => (
                    <tr key={i}>
                      <td>{t.label}</td>
                      <td>{t.rate}</td>
                      <td>{fmtCAD(t.amount)}</td>
                    </tr>
                  ))}
                  <tr className="tb-total-row">
                    <td colSpan={2}>Droits de mutation de base</td>
                    <td>{fmtCAD(result.baseTax)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Montreal supplementary */}
            {result.isMontreal && result.montrealSupp > 0 && (
              <div className="tb-table-wrap">
                <div className="tb-section-title">Taxe supplementaire de Montreal</div>
                <table className="tb-table">
                  <thead>
                    <tr>
                      <th>Tranche</th>
                      <th>Taux</th>
                      <th>Montant</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.montrealTiers.map((t, i) => (
                      <tr key={i}>
                        <td>{t.label}</td>
                        <td>{t.rate}</td>
                        <td>{fmtCAD(t.amount)}</td>
                      </tr>
                    ))}
                    <tr className="tb-total-row">
                      <td colSpan={2}>Supplementaire Montreal</td>
                      <td>{fmtCAD(result.montrealSupp)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* Montreal notice */}
            {result.isMontreal && result.montrealSupp === 0 && (
              <div className="tb-info-box blue">
                <strong>Montreal :</strong> La taxe supplementaire de Montreal s&apos;applique uniquement sur les proprietes de plus de 500 000 $.
              </div>
            )}

            {/* Premier achat notice */}
            {result.premierAchat && (
              <div className="tb-info-box green">
                <strong>Premier achat :</strong> Certaines municipalites offrent un remboursement partiel ou total de la taxe de bienvenue pour les premiers acheteurs. Verifiez aupres de votre municipalite si un programme d&apos;exemption s&apos;applique a votre situation.
              </div>
            )}

            {/* Payment deadline */}
            <div className="tb-info-box amber">
              <strong>Quand payer?</strong> La taxe de bienvenue doit etre payee dans les 90 jours suivant la reception du compte de la municipalite, qui est envoye apres l&apos;enregistrement de l&apos;acte de vente. Des interets de penalite s&apos;appliquent en cas de retard.
            </div>

            {/* Share */}
            <div style={{ marginTop: 16 }}>
              <ShareCalculation
                label="Taxe de bienvenue — nid.local"
                getData={() => ({
                  prix: (document.getElementById("tb-price") as HTMLInputElement)?.value ?? "",
                  ville: (document.getElementById("tb-ville") as HTMLSelectElement)?.value ?? "",
                  premier: (document.getElementById("tb-premier") as HTMLInputElement)?.checked ? "1" : "0",
                })}
              />
            </div>
          </div>
        )}

        <div className="tb-footer">
          Les calculs sont a titre indicatif seulement. Les taux sont bases sur les baremes du Quebec en vigueur en 2026.<br />
          Consultez votre notaire pour le montant exact applicable a votre transaction.
        </div>
      </div>
    </>
  );
}

/* ─── CSS ──────────────────────────────────────────────────────────────────── */

const css = `
.tb-calc { max-width: 700px; }
.tb-sub { font-size: 13px; color: var(--text-tertiary); margin-bottom: 20px; }
.tb-grid { display: grid; gap: 14px; margin-bottom: 20px; }
.tb-field { display: flex; flex-direction: column; gap: 6px; }
.tb-field.full { grid-column: 1 / -1; }
.tb-field > label { font-size: 12px; font-weight: 500; color: var(--text-tertiary); }
.tb-field-input { display: flex; align-items: center; border: 0.5px solid var(--border-secondary); border-radius: 8px; background: var(--bg-card); overflow: hidden; transition: border-color 0.15s; }
.tb-field-input:focus-within { border-color: var(--green); }
.tb-field-input input, .tb-field-input select { flex: 1; font-size: 14px; padding: 10px 12px; border: none; background: transparent; color: var(--text-primary); font-family: inherit; outline: none; min-width: 0; }
.tb-field-input .tb-unit { font-size: 12px; padding: 0 10px; color: var(--text-tertiary); border-left: 0.5px solid var(--border); height: 100%; display: flex; align-items: center; background: var(--bg-secondary); white-space: nowrap; flex-shrink: 0; }
.tb-checkbox-row { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 8px; background: var(--bg-secondary); border: 0.5px solid var(--border); }
.tb-checkbox-row input[type=checkbox] { width: 16px; height: 16px; accent-color: var(--green); cursor: pointer; flex-shrink: 0; }
.tb-checkbox-row label { font-size: 13px; color: var(--text-primary); cursor: pointer; margin: 0; }
.tb-btn { width: 100%; padding: 12px 20px; border-radius: 10px; border: none; background: var(--green); color: #fff; font-size: 14px; font-weight: 600; font-family: inherit; cursor: pointer; transition: opacity 0.15s; }
.tb-btn:hover { opacity: 0.9; }
.tb-results { margin-top: 20px; }
.tb-result-main { background: var(--bg-secondary); border-radius: 12px; padding: 20px; margin-bottom: 16px; text-align: center; }
.tb-result-label { font-size: 13px; color: var(--text-tertiary); margin-bottom: 4px; }
.tb-result-amount { font-size: 36px; font-weight: 500; letter-spacing: -1px; color: var(--green-text); }
.tb-table-wrap { margin-bottom: 16px; }
.tb-section-title { font-size: 13px; font-weight: 600; color: var(--text-primary); margin-bottom: 8px; }
.tb-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.tb-table th { text-align: left; padding: 8px 10px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-tertiary); border-bottom: 0.5px solid var(--border); }
.tb-table th:last-child { text-align: right; }
.tb-table td { padding: 8px 10px; color: var(--text-secondary); border-bottom: 0.5px solid var(--border); }
.tb-table td:last-child { text-align: right; font-weight: 500; color: var(--text-primary); }
.tb-total-row td { font-weight: 600; color: var(--text-primary) !important; background: var(--bg-secondary); }
.tb-info-box { padding: 12px 14px; border-radius: 8px; font-size: 12px; line-height: 1.55; margin-bottom: 10px; }
.tb-info-box.green { background: var(--green-light-bg); color: var(--green-text); }
.tb-info-box.amber { background: var(--amber-bg); color: var(--amber-text); }
.tb-info-box.blue { background: var(--blue-bg); color: var(--blue-text); }
.tb-footer { font-size: 11px; color: var(--text-tertiary); line-height: 1.6; text-align: center; margin-top: 16px; opacity: 0.8; }
@media (max-width: 640px) {
  .tb-result-amount { font-size: 28px; }
  .tb-table { font-size: 12px; }
  .tb-table th, .tb-table td { padding: 6px 8px; }
}
`;
