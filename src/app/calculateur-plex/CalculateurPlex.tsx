"use client";

import { useState, useCallback } from "react";
import { SaveReportButton } from "@/components/SaveReportButton";
import "./calculateur-plex.css";

function raw(s: string): number {
  return parseFloat(s.replace(/\s/g, "").replace(",", ".")) || 0;
}

function fmtCAD(n: number): string {
  return Math.round(n).toLocaleString("fr-CA") + " $";
}

function fmtInput(value: string): string {
  const v = value.replace(/\D/g, "");
  return v ? parseInt(v).toLocaleString("fr-CA") : "";
}

export function CalculateurPlex() {
  const [vals, setVals] = useState({
    prix: "750 000", mise: "75 000", taux: "4.84", amort: "25",
    l1: "1 400", l2: "1 300", l3: "", l4: "",
    taxes: "6 500", assur: "2 400", entret: "3 000", autres: "",
  });

  const set = useCallback((key: string, value: string, format = false) => {
    setVals((v) => ({ ...v, [key]: format ? fmtInput(value) : value }));
  }, []);

  // Calculs
  const prix = raw(vals.prix);
  const mise = raw(vals.mise);
  const taux = raw(vals.taux) / 100;
  const amort = parseInt(vals.amort) || 25;
  const l1 = raw(vals.l1), l2 = raw(vals.l2), l3 = raw(vals.l3), l4 = raw(vals.l4);
  const taxes = raw(vals.taxes), assur = raw(vals.assur), entret = raw(vals.entret), autres = raw(vals.autres);

  const revM = l1 + l2 + l3 + l4;
  const revA = revM * 12;
  const depA = taxes + assur + entret + autres;
  const depM = depA / 12;
  const cap = prix - mise;

  // Hypothèque mensuelle (taux semi-annuel canadien)
  const eff = Math.pow(1 + taux / 2, 2) - 1;
  const r = Math.pow(1 + eff, 1 / 12) - 1;
  const n = amort * 12;
  const hypoM = r > 0 && n > 0 && cap > 0 ? cap * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1) : 0;

  const mrb = revA > 0 ? prix / revA : 0;
  const cfM = revM - hypoM - depM;
  const cfA = cfM * 12;
  const rend = mise > 0 ? (cfA / mise) * 100 : 0;
  const val5 = prix * Math.pow(1.03, 5);

  const mrbClass = mrb > 0 && mrb < 12 ? "highlight" : mrb >= 18 ? "negative" : "";
  const mrbPct = Math.min(100, (mrb / 20) * 100);
  const mrbColor = mrb < 12 ? "#D4742A" : mrb < 15 ? "#BA7517" : "#E24B4A";
  const mrbVerdict = mrb > 0 ? (mrb < 12 ? "Excellent — marché favorable" : mrb < 15 ? "Acceptable — dans la moyenne" : "Élevé — rendement limité") : "";
  const mrbVerdictColor = mrb < 12 ? "var(--green-text)" : mrb < 15 ? "var(--amber-text)" : "var(--red-text)";

  const cfClass = cfM >= 0 ? "highlight" : "negative";

  // Tableau 5 ans
  const rows: { yr: number; val: number; gain: number; cumul: number; total: number }[] = [];
  let cumul = 0;
  for (let i = 1; i <= 5; i++) {
    const val = prix * Math.pow(1.03, i);
    const gain = val - prix;
    cumul += cfA;
    rows.push({ yr: i, val, gain, cumul, total: gain + cumul });
  }

  function renderField(id: string, label: string, unit: string, hint?: string, format?: boolean) {
    return (
      <div className="calc-field" key={id}>
        <label dangerouslySetInnerHTML={{ __html: label }} />
        <div className="calc-field-input">
          <input
            type="text"
            value={vals[id as keyof typeof vals]}
            onChange={(e) => set(id, e.target.value, false)}
            onBlur={(e) => { if (format) set(id, e.target.value, true); }}
            placeholder="0"
          />
          <span className="calc-unit">{unit}</span>
        </div>
        {hint && <div className="calc-field-hint">{hint}</div>}
      </div>
    );
  }

  return (
    <div>
      <div className="calc-section-title">La propriété</div>
      <div className="calc-grid">
        {renderField("prix", "Prix d'achat", "$", undefined, true)}
        {renderField("mise", "Mise de fonds", "$", undefined, true)}
        {renderField("taux", "Taux hypothécaire", "%")}
        {renderField("amort", "Amortissement", "ans")}
      </div>

      <div className="calc-divider" />
      <div className="calc-section-title">Les revenus locatifs</div>
      <div className="calc-grid">
        {renderField("l1", "Loyer unité 1", "$ / mois", undefined, true)}
        {renderField("l2", "Loyer unité 2", "$ / mois", undefined, true)}
        {renderField("l3", "Loyer unité 3 <span style=\"font-weight:400;color:var(--text-tertiary)\">(optionnel)</span>", "$ / mois", undefined, true)}
        {renderField("l4", "Loyer unité 4 <span style=\"font-weight:400;color:var(--text-tertiary)\">(optionnel)</span>", "$ / mois", undefined, true)}
      </div>

      <div className="calc-divider" />
      <div className="calc-section-title">Les dépenses annuelles</div>
      <div className="calc-grid">
        {renderField("taxes", "Taxes municipales", "$ / an", undefined, true)}
        {renderField("assur", "Assurances", "$ / an", undefined, true)}
        {renderField("entret", "Entretien estimé", "$ / an", "Suggéré : 1% du prix d'achat / an", true)}
        {renderField("autres", "Autres dépenses", "$ / an", undefined, true)}
      </div>

      <div className="calc-divider" />
      <div className="calc-section-title">Résultats</div>

      <div className="calc-results-grid">
        {/* MRB */}
        <div className={`calc-result-card ${mrbClass}`}>
          <div className="calc-rc-label">MRB</div>
          <div className="calc-rc-value">{mrb > 0 ? mrb.toFixed(1) + "×" : "—"}</div>
          <div className="calc-rc-sub">sur {fmtCAD(revA)} / an</div>
          <div className="calc-mrb-bar"><div className="calc-mrb-fill" style={{ width: `${mrbPct}%`, background: mrbColor }} /></div>
          <div className="calc-mrb-scale"><span>Excellent &lt;12</span><span>Bon &lt;15</span><span>Élevé &gt;18</span></div>
          {mrbVerdict && <div className="calc-mrb-verdict" style={{ color: mrbVerdictColor }}>{mrbVerdict}</div>}
        </div>

        {/* Cashflow */}
        <div className={`calc-result-card ${cfClass}`}>
          <div className="calc-rc-label">Cashflow mensuel</div>
          <div className="calc-rc-value">{(cfM >= 0 ? "+" : "") + Math.round(cfM).toLocaleString("fr-CA")}</div>
          <div className="calc-rc-sub">{cfM >= 0 ? "Positif" : "Négatif — attention"}</div>
        </div>

        {/* Rendement */}
        <div className="calc-result-card info">
          <div className="calc-rc-label">Rendement sur mise de fonds</div>
          <div className="calc-rc-value">{rend.toFixed(1)}%</div>
          <div className="calc-rc-sub">Cashflow annuel / mise de fonds</div>
        </div>

        {/* Valeur an 5 */}
        <div className="calc-result-card neutral">
          <div className="calc-rc-label">Valeur estimée an 5</div>
          <div className="calc-rc-value">{fmtCAD(val5)}</div>
          <div className="calc-rc-sub">Gain : +{fmtCAD(val5 - prix)}</div>
        </div>
      </div>

      <div className="calc-section-title">Détail du cashflow mensuel</div>
      <div className="calc-cf-detail">
        <div className="calc-cf-row"><span>Revenus locatifs bruts</span><span className="calc-cf-pos">+{fmtCAD(revM)}</span></div>
        <div className="calc-cf-row"><span>Paiement hypothécaire</span><span className="calc-cf-neg">-{fmtCAD(hypoM)}</span></div>
        <div className="calc-cf-row"><span>Dépenses mensualisées</span><span className="calc-cf-neg">-{fmtCAD(depM)}</span></div>
        <div className="calc-cf-row"><span>Cashflow net</span><span className={cfM >= 0 ? "calc-cf-pos" : "calc-cf-neg"}>{(cfM >= 0 ? "+" : "")}{fmtCAD(cfM)}</span></div>
      </div>

      <div className="calc-section-title" style={{ marginTop: 16 }}>
        Projection sur 5 ans <span style={{ fontWeight: 400, fontSize: 12, color: "var(--text-tertiary)" }}>(3% appréciation · loyers stables)</span>
      </div>
      <table className="calc-table">
        <thead>
          <tr>
            <th>Année</th>
            <th className="num">Valeur</th>
            <th className="num">Gain valeur</th>
            <th className="num">Cashflow cumulé</th>
            <th className="num">Retour total</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.yr}>
              <td>An {row.yr}</td>
              <td className="num">{fmtCAD(row.val)}</td>
              <td className="num pos">+{fmtCAD(row.gain)}</td>
              <td className={`num ${row.cumul >= 0 ? "pos" : "neg"}`}>{row.cumul >= 0 ? "+" : ""}{fmtCAD(row.cumul)}</td>
              <td className={`num ${row.total >= 0 ? "pos" : "neg"}`}>{row.total >= 0 ? "+" : ""}{fmtCAD(row.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: 16 }}>
        <SaveReportButton
          type="plex"
          getDonnees={() => vals}
          getResultats={() => ({ mrb: +mrb.toFixed(1), cashflowMensuel: Math.round(cfM), rendement: +rend.toFixed(1), valeur5ans: Math.round(val5), prix, mise })}
          getTitre={() => `Plex ${fmtCAD(prix)} — MRB ${mrb.toFixed(1)}× — CF ${Math.round(cfM) >= 0 ? "+" : ""}${Math.round(cfM)} $/mois`}
        />
      </div>

    </div>
  );
}
