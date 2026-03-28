"use client";

import { useState, useCallback, useEffect } from "react";
import { SaveReportButton } from "@/components/SaveReportButton";
import { ShareCalculation } from "@/components/ShareCalculation";
import "./capacite-emprunt.css";

function raw(s: string): number { return parseFloat(s.replace(/\s/g, "").replace(",", ".")) || 0; }
function fmtCAD(n: number): string { return Math.round(n).toLocaleString("fr-CA") + " $"; }
function fmtInput(v: string): string { const d = v.replace(/\D/g, ""); return d ? parseInt(d).toLocaleString("fr-CA") : ""; }

export function CapaciteEmprunt() {
  const [vals, setVals] = useState({
    rev1: "85 000", rev2: "", revLoc: "", pctLoc: "0.5",
    detteAuto: "", detteEtud: "", detteCC: "", detteAutres: "",
    mise: "60 000", tauxQual: "5.25", amort: "25", taxesEst: "4 000",
  });

  const set = useCallback((k: string, v: string, fmt = false) => {
    setVals((p) => ({ ...p, [k]: fmt ? fmtInput(v) : v }));
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rev1 = raw(vals.rev1), rev2 = raw(vals.rev2), revLoc = raw(vals.revLoc);
  const pctLoc = parseFloat(vals.pctLoc);
  const dAuto = raw(vals.detteAuto), dEtud = raw(vals.detteEtud), dCC = raw(vals.detteCC), dAutres = raw(vals.detteAutres);
  const mise = raw(vals.mise), tauxQual = raw(vals.tauxQual) / 100, amort = parseInt(vals.amort) || 25;
  const taxesAn = raw(vals.taxesEst);

  const revAnnuel = rev1 + rev2 + revLoc * pctLoc * 12;
  const revM = revAnnuel / 12;
  const taxesM = taxesAn / 12;
  const chauffage = 150;
  const dettes = dAuto + dEtud + dCC + dAutres;

  const eff = Math.pow(1 + tauxQual / 2, 2) - 1;
  const r = Math.pow(1 + eff, 1 / 12) - 1;
  const n = amort * 12;
  function pmt2hypo(pmt: number) { return r > 0 ? pmt * (Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n)) : pmt * n; }
  function hypo2pmt(h: number) { return r > 0 && n > 0 && h > 0 ? h * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1) : 0; }

  const mGDS = 0.32 * revM - taxesM - chauffage;
  const mTDS = 0.44 * revM - taxesM - chauffage - dettes;
  const hGDS = pmt2hypo(Math.max(0, mGDS));
  const hTDS = pmt2hypo(Math.max(0, mTDS));
  const maxH = Math.min(hGDS, hTDS);
  const maxPrix = maxH + mise;
  const pmtMax = hypo2pmt(maxH);
  const gds = revM > 0 ? (pmtMax + taxesM + chauffage) / revM * 100 : 0;
  const tds = revM > 0 ? (pmtMax + taxesM + chauffage + dettes) / revM * 100 : 0;
  const limiting = hGDS < hTDS ? "GDS" : "TDS";
  const hasWarning = dettes > revM * 0.15;

  const gc = gds <= 25 ? "var(--green)" : gds <= 32 ? "var(--amber-text)" : "var(--red-text)";
  const tc = tds <= 35 ? "var(--green)" : tds <= 44 ? "var(--amber-text)" : "var(--red-text)";

  function scenarioPrix(gdsR: number) {
    const pmtM2 = gdsR * revM - taxesM - chauffage;
    if (pmtM2 <= 0) return { prix: 0, pmt: 0 };
    const h = pmt2hypo(pmtM2);
    return { prix: h + mise, pmt: hypo2pmt(h) };
  }
  const scenarios = [
    { label: "Confortable — GDS 25%", ...scenarioPrix(0.25) },
    { label: "Standard — GDS 32%", ...scenarioPrix(0.32) },
    { label: "Maximum — TDS 44%", prix: hTDS + mise, pmt: hypo2pmt(hTDS) },
  ];

  function renderField(id: string, label: string, unit: string, hint?: string, isSelect?: boolean) {
    if (isSelect) return null; // handled inline
    return (
      <div className="ce-field" key={id}>
        <label>{label}</label>
        <div className="ce-field-input">
          <input type="text" value={vals[id as keyof typeof vals]} onChange={(e) => set(id, e.target.value)} onBlur={(e) => { if (!["tauxQual", "pctLoc", "amort"].includes(id)) set(id, e.target.value, true); }} placeholder="0" />
          <span className="ce-unit">{unit}</span>
        </div>
        {hint && <div className="ce-field-hint">{hint}</div>}
      </div>
    );
  }

  return (
    <div>
      <div className="ce-section-title">Vos revenus</div>
      <div className="ce-grid">
        {renderField("rev1", "Revenu annuel brut", "$ / an", "Montant brut avant impôts")}
        {renderField("rev2", "Co-emprunteur", "$ / an", "Laissez vide si vous achetez seul(e)")}
        {renderField("revLoc", "Revenu locatif", "$ / mois", "Si vous achetez un plex")}
        <div className="ce-field">
          <label>% revenus locatifs inclus</label>
          <div className="ce-field-input">
            <select value={vals.pctLoc} onChange={(e) => set("pctLoc", e.target.value)}>
              <option value="0.5">50% — standard</option>
              <option value="0.8">80% — certaines institutions</option>
              <option value="1">100% — commercial</option>
            </select>
          </div>
        </div>
      </div>

      <div className="ce-divider" />
      <div className="ce-section-title">Vos dettes mensuelles</div>
      <div className="ce-grid">
        {renderField("detteAuto", "Paiement voiture", "$ / mois")}
        {renderField("detteEtud", "Prêt étudiant", "$ / mois")}
        {renderField("detteCC", "Carte de crédit", "$ / mois", "Paiement minimum")}
        {renderField("detteAutres", "Autres dettes", "$ / mois")}
      </div>

      <div className="ce-divider" />
      <div className="ce-section-title">Paramètres hypothécaires</div>
      <div className="ce-grid">
        {renderField("mise", "Mise de fonds disponible", "$")}
        {renderField("tauxQual", "Taux de qualification", "%", "Stress test — laissez 5,25% si incertain")}
        <div className="ce-field">
          <label>Amortissement</label>
          <div className="ce-field-input">
            <select value={vals.amort} onChange={(e) => set("amort", e.target.value)}>
              <option value="25">25 ans — standard</option>
              <option value="30">30 ans — premiers acheteurs</option>
            </select>
          </div>
        </div>
        {renderField("taxesEst", "Taxes municipales estimées", "$ / an", "Environ 1% de la valeur")}
      </div>

      <div className="ce-divider" />

      {/* Result hero */}
      <div className={`ce-result-hero${hasWarning ? " warning" : ""}`}>
        <div className="ce-rh-label">Prix maximum estimé</div>
        <div className="ce-rh-amount">{maxPrix > 0 ? fmtCAD(maxPrix) : "Capacité limitée"}</div>
        <div className="ce-rh-sub">
          {maxPrix > 0
            ? `Mise de fonds ${fmtCAD(mise)} · Hypothèque ${fmtCAD(maxH)} · Limité par ${limiting}`
            : "Vos dettes limitent votre capacité"}
        </div>
      </div>

      <div className="ce-result-grid">
        <div className="ce-result-box"><div className="ce-rb-label">Hypothèque max</div><div className="ce-rb-val">{fmtCAD(maxH)}</div><div className="ce-rb-sub">{amort} ans</div></div>
        <div className="ce-result-box"><div className="ce-rb-label">Paiement mensuel</div><div className="ce-rb-val">{fmtCAD(pmtMax)}</div><div className="ce-rb-sub">Hypothèque seulement</div></div>
        <div className="ce-result-box"><div className="ce-rb-label">Revenu mensuel brut</div><div className="ce-rb-val">{fmtCAD(revM)}</div><div className="ce-rb-sub">Total combiné</div></div>
      </div>

      {/* Ratios */}
      <div className="ce-section-title">Ratios d&apos;endettement</div>
      <div style={{ marginBottom: 16 }}>
        <div className="ce-ratio-row">
          <div className="ce-ratio-header"><span className="ce-ratio-name">GDS — Charges de logement</span><span className="ce-ratio-val" style={{ color: gc }}>{gds.toFixed(1)}%</span></div>
          <div className="ce-ratio-bar"><div className="ce-ratio-fill" style={{ width: `${Math.min(100, gds / 40 * 100)}%`, background: gc }} /><div className="ce-ratio-limit" style={{ left: "80%" }} /></div>
          <div className="ce-ratio-sub">Limite : 32%</div>
        </div>
        <div className="ce-ratio-row">
          <div className="ce-ratio-header"><span className="ce-ratio-name">TDS — Endettement total</span><span className="ce-ratio-val" style={{ color: tc }}>{tds.toFixed(1)}%</span></div>
          <div className="ce-ratio-bar"><div className="ce-ratio-fill" style={{ width: `${Math.min(100, tds / 55 * 100)}%`, background: tc }} /><div className="ce-ratio-limit" style={{ left: "80%" }} /></div>
          <div className="ce-ratio-sub">Limite : 44%</div>
        </div>
      </div>

      {/* Scenarios */}
      <div className="ce-section-title">Scénarios</div>
      <div className="ce-scenarios">
        {scenarios.map((s) => (
          <div key={s.label} className="ce-scenario">
            <span className="ce-sc-label">{s.label}</span>
            <div style={{ textAlign: "right" }}>
              <div className="ce-sc-val">{s.prix > 0 ? fmtCAD(s.prix) : "Impossible"}</div>
              {s.pmt > 0 && <div style={{ fontSize: 11, color: "var(--text-tertiary)" }}>{fmtCAD(s.pmt)} / mois</div>}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 16 }}>
        <div className="flex items-center gap-3 flex-wrap">
          <SaveReportButton
            type="capacite_emprunt"
            getDonnees={() => vals}
            getResultats={() => ({ prixMax: Math.round(maxPrix), hypothequeMax: Math.round(maxH), paiementMensuel: Math.round(pmtMax), gds: +gds.toFixed(1), tds: +tds.toFixed(1) })}
            getTitre={() => `Capacité ${fmtCAD(maxPrix)} — GDS ${gds.toFixed(1)}% · TDS ${tds.toFixed(1)}%`}
          />
          <ShareCalculation getData={() => vals} />
        </div>
      </div>
    </div>
  );
}
