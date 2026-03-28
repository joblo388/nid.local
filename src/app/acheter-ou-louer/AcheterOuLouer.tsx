"use client";

import { useState, useCallback, useEffect } from "react";
import { SaveReportButton } from "@/components/SaveReportButton";
import { ShareCalculation } from "@/components/ShareCalculation";
import "./acheter-ou-louer.css";

function raw(s: string): number {
  return parseFloat(s.replace(/\s/g, "").replace(",", ".")) || 0;
}
function fmtCAD(n: number): string {
  return Math.round(Math.abs(n)).toLocaleString("fr-CA") + " $";
}
function fmtInput(value: string): string {
  const v = value.replace(/\D/g, "");
  return v ? parseInt(v).toLocaleString("fr-CA") : "";
}

export function AcheterOuLouer() {
  const [vals, setVals] = useState({
    prix: "500 000", mise: "100 000", taux: "4.64", taxes: "4 500", entret: "4 000", appre: "3", revLoc: "0",
    loyer: "2 200", hausse: "3", assurLoc: "300", rendEp: "4",
  });
  const [horizon, setHorizon] = useState(5);

  const set = useCallback((key: string, value: string, format = false) => {
    setVals((v) => ({ ...v, [key]: format ? fmtInput(value) : value }));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.toString()) {
      const patch: Record<string, string> = {};
      for (const key of Object.keys(vals)) {
        const v = params.get(key);
        if (v !== null) patch[key] = v;
      }
      if (Object.keys(patch).length > 0) setVals((prev) => ({ ...prev, ...patch }));
      const h = params.get("horizon");
      if (h !== null) setHorizon(parseInt(h) || 5);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const prix = raw(vals.prix), mise = raw(vals.mise), taux = raw(vals.taux) / 100;
  const taxes = raw(vals.taxes), entret = raw(vals.entret), appre = raw(vals.appre) / 100;
  const revLoc = raw(vals.revLoc);
  const loyer = raw(vals.loyer), hausse = raw(vals.hausse) / 100;
  const assurLoc = raw(vals.assurLoc), rendEp = raw(vals.rendEp) / 100;

  const cap = prix - mise;
  const eff = Math.pow(1 + taux / 2, 2) - 1;
  const r = Math.pow(1 + eff, 1 / 12) - 1;
  const n = 25 * 12;
  const hypoM = r > 0 && cap > 0 ? cap * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1) : 0;
  const achatM = hypoM + (taxes + entret) / 12 - revLoc;
  const loyerM = loyer + assurLoc / 12;
  const diffM = achatM - loyerM;

  const nhm = horizon * 12;
  const rm = Math.pow(1 + rendEp, 1 / 12) - 1;

  let sol = cap, totalInteret = 0;
  for (let m = 0; m < nhm; m++) { const im = sol * r; totalInteret += im; sol -= hypoM - im; }
  const gainValeur = prix * Math.pow(1 + appre, horizon) - prix;
  const coutTaxes = taxes * horizon;
  const coutEntret = entret * horizon;
  const coutOpportunite = mise * (Math.pow(1 + rendEp, horizon) - 1);
  const revLocTotal = revLoc * 12 * horizon;
  const netAchat = totalInteret + coutTaxes + coutEntret + coutOpportunite - gainValeur - revLocTotal;

  let totalLoyer = 0, lc = loyer;
  for (let i = 0; i < horizon; i++) { totalLoyer += lc * 12; lc *= (1 + hausse); }
  const totalAssurLoc = assurLoc * horizon;
  const fvAnnuity = (pmt: number, rr: number, nn: number) => rr <= 0 ? pmt * nn : pmt * (Math.pow(1 + rr, nn) - 1) / rr;
  const epargneLoc = diffM > 50 ? fvAnnuity(diffM, rm, nhm) : 0;
  const netLouer = totalLoyer + totalAssurLoc - epargneLoc;

  const diff = netLouer - netAchat;
  const achatGagne = diff > 0;
  const verdictClass = Math.abs(diff) < 3000 ? "neutre" : achatGagne ? "acheter" : "louer";

  // Bars per year
  function calcYear(yr: number) {
    let s = cap, intI = 0;
    for (let m = 0; m < yr * 12; m++) { const im = s * r; intI += im; s -= hypoM - im; }
    const gv = prix * Math.pow(1 + appre, yr) - prix;
    const opp = mise * (Math.pow(1 + rendEp, yr) - 1);
    const rl = revLoc * 12 * yr;
    const cA = intI + taxes * yr + entret * yr + opp - gv - rl;
    let ly = 0, lt = loyer;
    for (let j = 0; j < yr; j++) { ly += lt * 12; lt *= (1 + hausse); }
    const ep = diffM > 50 ? fvAnnuity(diffM, rm, yr * 12) : 0;
    return { achat: cA, louer: ly + assurLoc * yr - ep };
  }
  const bars = Array.from({ length: horizon }, (_, i) => {
    const c = calcYear(i + 1);
    return { yr: i + 1, economie: c.louer - c.achat };
  });
  const maxEco = Math.max(...bars.map((d) => Math.abs(d.economie)), 1);

  const tableRows = [
    { label: "Intérêts hypothécaires", a: totalInteret, l: null },
    { label: "Taxes municipales", a: coutTaxes, l: null },
    { label: "Entretien + assurances", a: coutEntret, l: null },
    { label: "Coût d'opportunité mise de fonds", a: coutOpportunite, l: null },
    ...(revLocTotal > 0 ? [{ label: "Revenu locatif", a: -revLocTotal, l: null }] : []),
    { label: "Gain en valeur propriété", a: -gainValeur, l: null },
    { label: "Loyers cumulés", a: null, l: totalLoyer },
    { label: "Assurances locataire", a: null, l: totalAssurLoc },
    ...(epargneLoc > 0 ? [{ label: "Épargne mensuelle placée", a: null, l: -epargneLoc }] : []),
    { label: `Coût net sur ${horizon} an${horizon > 1 ? "s" : ""}`, a: netAchat, l: netLouer, total: true },
  ];

  function renderField(id: string, label: string, unit: string) {
    return (
      <div className="aol-field" key={id}>
        <label>{label}</label>
        <div className="aol-field-input">
          <input
            type="text"
            value={vals[id as keyof typeof vals]}
            onChange={(e) => set(id, e.target.value, false)}
            onBlur={(e) => { if (!["taux", "appre", "hausse", "rendEp"].includes(id)) set(id, e.target.value, true); }}
            placeholder="0"
          />
          <span className="aol-unit">{unit}</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Horizon slider */}
      <div className="aol-horizon-row">
        <span className="aol-horizon-label">Horizon</span>
        <input type="range" min={1} max={15} value={horizon} onChange={(e) => setHorizon(parseInt(e.target.value))} />
        <span className="aol-horizon-val">{horizon} an{horizon > 1 ? "s" : ""}</span>
      </div>

      <div className="aol-cols">
        {/* Acheter */}
        <div>
          <div className="aol-col-header"><div className="aol-col-dot" style={{ background: "var(--green)" }} /><div className="aol-col-title">Acheter</div></div>
          {renderField("prix", "Prix de la propriété", "$")}
          {renderField("mise", "Mise de fonds", "$")}
          {renderField("taux", "Taux hypothécaire", "%")}
          {renderField("taxes", "Taxes municipales", "$ / an")}
          {renderField("entret", "Entretien + assurances", "$ / an")}
          {renderField("appre", "Appréciation annuelle", "%")}
          {renderField("revLoc", "Revenu locatif", "$ / mois")}
          <div className="aol-info-box">Loyer reçu d&apos;un locataire si duplex/plex ou chambre louée. Réduit le coût mensuel d&apos;achat.</div>
        </div>
        {/* Louer */}
        <div>
          <div className="aol-col-header"><div className="aol-col-dot" style={{ background: "var(--blue-text)" }} /><div className="aol-col-title">Louer</div></div>
          {renderField("loyer", "Loyer mensuel", "$ / mois")}
          {renderField("hausse", "Hausse annuelle du loyer", "%")}
          {renderField("assurLoc", "Assurances locataire", "$ / an")}
          {renderField("rendEp", "Rendement épargne", "%")}
          <div className="aol-info-box">Taux auquel le locataire place la mise de fonds et l&apos;écart mensuel favorable.</div>
        </div>
      </div>

      <div className="aol-divider" />
      <div className="aol-section-title">Paiements mensuels</div>
      <div className="aol-monthly-strip">
        <div className="aol-monthly-box buy"><div className="aol-mb-label">Achat / mois</div><div className="aol-mb-val">{Math.round(achatM).toLocaleString("fr-CA")} $</div><div className="aol-mb-sub">Hypo + taxes + entretien</div></div>
        <div className="aol-monthly-box rent"><div className="aol-mb-label">Location / mois</div><div className="aol-mb-val">{Math.round(loyerM).toLocaleString("fr-CA")} $</div><div className="aol-mb-sub">Loyer + assurances</div></div>
        <div className={`aol-monthly-box ${diffM > 50 ? "diff-neg" : diffM < -50 ? "diff-pos" : "diff-zero"}`}>
          <div className="aol-mb-label">{diffM > 50 ? "Achat coûte plus" : diffM < -50 ? "Achat coûte moins" : "Identique"}</div>
          <div className="aol-mb-val">{Math.abs(diffM) < 1 ? "0 $" : `${diffM > 0 ? "+ " : "- "}${fmtCAD(diffM)}`}</div>
          <div className="aol-mb-sub">{diffM > 50 ? "Le locataire place l'écart" : diffM < -50 ? "Achat moins cher ce mois" : "Coût mensuel équivalent"}</div>
        </div>
      </div>

      {/* Verdict */}
      <div className={`aol-verdict ${verdictClass}`}>
        <div className="aol-verdict-title">
          {Math.abs(diff) < 3000 ? "Résultat similaire" : achatGagne ? `Acheter est plus avantageux sur ${horizon} ans` : `Louer est plus avantageux sur ${horizon} ans`}
        </div>
        <div className="aol-verdict-amount">{fmtCAD(Math.abs(diff))} d&apos;écart</div>
        <div className="aol-verdict-sub">Économie estimée en {achatGagne ? "achetant" : "louant"} sur {horizon} an{horizon > 1 ? "s" : ""}</div>
      </div>

      {/* Bars */}
      <div className="aol-section-title">Économies cumulées</div>
      <div style={{ marginBottom: 20 }}>
        {bars.map((d) => {
          const eco = Math.abs(d.economie);
          const isAchat = d.economie > 0;
          const color = isAchat ? "var(--green)" : "var(--blue-text)";
          const pct = (eco / maxEco * 100).toFixed(1);
          return (
            <div key={d.yr} className="aol-bar-group">
              <span className="aol-bar-yr">An {d.yr}</span>
              <div className="aol-bar-track">
                <div className="aol-bar-fill" style={{ width: `${pct}%`, background: color }}>
                  {eco > 8000 && <span className="aol-bar-fill-label">{isAchat ? "Acheter" : "Louer"}</span>}
                </div>
              </div>
              <span className="aol-bar-amt" style={{ color }}>{fmtCAD(eco)}</span>
            </div>
          );
        })}
      </div>

      <div className="aol-divider" />
      <div className="aol-section-title">Détail sur {horizon} an{horizon > 1 ? "s" : ""}</div>
      <table className="aol-table">
        <thead><tr><th>Poste</th><th className="num buy-col">Acheter</th><th className="num rent-col">Louer</th></tr></thead>
        <tbody>
          {tableRows.map((row, i) => (
            <tr key={i} className={(row as { total?: boolean }).total ? "total-row" : ""}>
              <td>{row.label}</td>
              <td className={`num ${row.a != null ? (row.a < 0 ? "pos" : "neg") : "dash"}`}>{row.a != null ? `${row.a < 0 ? "- " : ""}${fmtCAD(row.a)}` : "—"}</td>
              <td className={`num ${row.l != null ? (row.l < 0 ? "pos" : "neg") : "dash"}`}>{row.l != null ? `${row.l < 0 ? "- " : ""}${fmtCAD(row.l)}` : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: 16 }}>
        <div className="flex items-center gap-3 flex-wrap">
          <SaveReportButton
            type="acheter_louer"
            getDonnees={() => ({ ...vals, horizon })}
            getResultats={() => ({ netAchat: Math.round(netAchat), netLouer: Math.round(netLouer), ecart: Math.round(Math.abs(diff)), gagnant: achatGagne ? "acheter" : "louer", horizon })}
            getTitre={() => `${achatGagne ? "Acheter" : "Louer"} gagne sur ${horizon} ans — écart ${fmtCAD(Math.abs(diff))}`}
          />
          <ShareCalculation getData={() => ({ ...vals, horizon })} />
        </div>
      </div>
    </div>
  );
}
