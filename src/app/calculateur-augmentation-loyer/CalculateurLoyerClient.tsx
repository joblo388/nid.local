"use client";

import { useState, useCallback } from "react";

/* ── helpers ─────────────────────────────────────────────── */

function raw(s: string): number {
  return parseFloat(s.replace(/\s/g, "").replace(",", ".")) || 0;
}

function fmtCAD(n: number): string {
  return n.toFixed(2).replace(".", ",") + " $";
}

function fmtInput(value: string): string {
  const v = value.replace(/\D/g, "");
  return v ? parseInt(v).toLocaleString("fr-CA") : "";
}

/* ── taux TAL 2026 ───────────────────────────────────────── */

const TAUX_BASE = 0.031; // 3,1 %
const TAUX_CHAUFFAGE = 0.004; // 0,4 %
const TAUX_EAU_CHAUDE = 0.002; // 0,2 %
const TAUX_IPC = 0.012; // 1,2 % IPC pour calcul personnalisé
const TAUX_AMORT_RENO = 0.05; // 5 % amortissement rénovations

/* ── component ───────────────────────────────────────────── */

export function CalculateurLoyerClient() {
  const [loyerActuel, setLoyerActuel] = useState("1 200");
  const [chauffe, setChauffe] = useState(false);
  const [eauChaude, setEauChaude] = useState(false);
  const [anneeConstruction, setAnneeConstruction] = useState("1980");
  const [modePersonnalise, setModePersonnalise] = useState(false);

  // Champs personnalisés
  const [taxes, setTaxes] = useState("");
  const [assurance, setAssurance] = useState("");
  const [coutChauffage, setCoutChauffage] = useState("");
  const [coutEauChaude, setCoutEauChaude] = useState("");
  const [renovations, setRenovations] = useState("");
  const [nbLogements, setNbLogements] = useState("1");

  const handleCurrency = useCallback(
    (setter: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(fmtInput(e.target.value));
    },
    []
  );

  /* ── calcul ─────────────────────────────────────────────── */

  const loyer = raw(loyerActuel);
  const loyerAnnuel = loyer * 12;
  const nbLog = parseInt(nbLogements) || 1;

  let pourcentage: number;

  if (!modePersonnalise) {
    // Estimation standard TAL
    pourcentage = TAUX_BASE;
    if (chauffe) pourcentage += TAUX_CHAUFFAGE;
    if (eauChaude) pourcentage += TAUX_EAU_CHAUDE;
  } else {
    // Calcul personnalisé avec dépenses réelles
    const txAnnuel = raw(taxes);
    const assAnnuel = raw(assurance);
    const chauffAnnuel = raw(coutChauffage);
    const eauAnnuel = raw(coutEauChaude);
    const renoTotal = raw(renovations);

    // Part par logement
    const depensesParLogement =
      (txAnnuel + assAnnuel + chauffAnnuel + eauAnnuel) / nbLog;

    // Rénovations amorties à 5 % par année, réparties par logement
    const renoAmorti = (renoTotal * TAUX_AMORT_RENO) / nbLog;

    const totalDepenses = depensesParLogement + renoAmorti;

    // Pourcentage = dépenses par logement / loyer annuel + IPC
    if (loyerAnnuel > 0) {
      pourcentage = totalDepenses / loyerAnnuel + TAUX_IPC;
    } else {
      pourcentage = TAUX_IPC;
    }
  }

  const augmentationMensuelle = loyer * pourcentage;
  const nouveauLoyer = loyer + augmentationMensuelle;
  const pourcentageAffiche = pourcentage * 100;

  // Couleur selon le niveau
  let couleurBg: string;
  let couleurText: string;
  let verdict: string;

  if (pourcentageAffiche < 5) {
    couleurBg = "var(--green-light-bg)";
    couleurText = "var(--green-text)";
    verdict = "Augmentation dans la norme";
  } else if (pourcentageAffiche < 8) {
    couleurBg = "var(--amber-bg)";
    couleurText = "var(--amber-text)";
    verdict = "Augmentation modérée, mais supérieure à la moyenne";
  } else {
    couleurBg = "var(--red-bg)";
    couleurText = "var(--red-text)";
    verdict = "Augmentation élevée, possiblement contestable";
  }

  const inputClass =
    "w-full px-3 py-2.5 rounded-lg text-[13px] outline-none transition-colors";
  const inputStyle = {
    background: "var(--bg-page)",
    border: "0.5px solid var(--border)",
    color: "var(--text-primary)",
  };

  return (
    <div className="space-y-5">
      <h2
        className="text-[15px] font-bold"
        style={{ color: "var(--text-primary)" }}
      >
        Estimez votre augmentation de loyer
      </h2>

      {/* Loyer actuel */}
      <div className="space-y-4">
        <div>
          <label
            className="block text-[12px] font-medium mb-1.5"
            style={{ color: "var(--text-secondary)" }}
          >
            Loyer actuel (par mois)
          </label>
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              value={loyerActuel}
              onChange={handleCurrency(setLoyerActuel)}
              className={inputClass}
              style={inputStyle}
              placeholder="1 200"
            />
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px]"
              style={{ color: "var(--text-tertiary)" }}
            >
              $/mois
            </span>
          </div>
        </div>

        {/* Chauffé */}
        <div className="flex items-center justify-between">
          <label
            className="text-[13px]"
            style={{ color: "var(--text-primary)" }}
          >
            Chauffage inclus dans le loyer
          </label>
          <button
            type="button"
            onClick={() => setChauffe(!chauffe)}
            className="relative w-10 h-6 rounded-full transition-colors shrink-0"
            style={{
              background: chauffe ? "var(--green)" : "var(--border)",
            }}
            aria-pressed={chauffe}
          >
            <span
              className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform shadow-sm"
              style={{
                transform: chauffe ? "translateX(16px)" : "translateX(0)",
              }}
            />
          </button>
        </div>

        {/* Eau chaude */}
        <div className="flex items-center justify-between">
          <label
            className="text-[13px]"
            style={{ color: "var(--text-primary)" }}
          >
            Eau chaude incluse dans le loyer
          </label>
          <button
            type="button"
            onClick={() => setEauChaude(!eauChaude)}
            className="relative w-10 h-6 rounded-full transition-colors shrink-0"
            style={{
              background: eauChaude ? "var(--green)" : "var(--border)",
            }}
            aria-pressed={eauChaude}
          >
            <span
              className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform shadow-sm"
              style={{
                transform: eauChaude ? "translateX(16px)" : "translateX(0)",
              }}
            />
          </button>
        </div>

        {/* Année de construction */}
        <div>
          <label
            className="block text-[12px] font-medium mb-1.5"
            style={{ color: "var(--text-secondary)" }}
          >
            Année de construction de l&apos;immeuble
          </label>
          <input
            type="text"
            inputMode="numeric"
            value={anneeConstruction}
            onChange={(e) => setAnneeConstruction(e.target.value)}
            className={inputClass}
            style={inputStyle}
            placeholder="1980"
          />
        </div>
      </div>

      {/* Séparateur */}
      <div style={{ borderTop: "0.5px solid var(--border)" }} />

      {/* Toggle mode personnalisé */}
      <div className="flex items-center justify-between">
        <div>
          <p
            className="text-[13px] font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            Entrer mes dépenses réelles
          </p>
          <p
            className="text-[11px] mt-0.5"
            style={{ color: "var(--text-tertiary)" }}
          >
            Calcul personnalisé basé sur les dépenses du propriétaire
          </p>
        </div>
        <button
          type="button"
          onClick={() => setModePersonnalise(!modePersonnalise)}
          className="relative w-10 h-6 rounded-full transition-colors shrink-0"
          style={{
            background: modePersonnalise ? "var(--green)" : "var(--border)",
          }}
          aria-pressed={modePersonnalise}
        >
          <span
            className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform shadow-sm"
            style={{
              transform: modePersonnalise
                ? "translateX(16px)"
                : "translateX(0)",
            }}
          />
        </button>
      </div>

      {/* Champs personnalisés */}
      {modePersonnalise && (
        <div
          className="space-y-4 p-4 rounded-lg"
          style={{
            background: "var(--bg-page)",
            border: "0.5px solid var(--border)",
          }}
        >
          <p
            className="text-[12px] font-medium"
            style={{ color: "var(--text-secondary)" }}
          >
            Dépenses annuelles de l&apos;immeuble
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                className="block text-[11px] font-medium mb-1"
                style={{ color: "var(--text-tertiary)" }}
              >
                Taxes municipales
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={taxes}
                onChange={handleCurrency(setTaxes)}
                className={inputClass}
                style={inputStyle}
                placeholder="4 500"
              />
            </div>
            <div>
              <label
                className="block text-[11px] font-medium mb-1"
                style={{ color: "var(--text-tertiary)" }}
              >
                Assurance
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={assurance}
                onChange={handleCurrency(setAssurance)}
                className={inputClass}
                style={inputStyle}
                placeholder="2 000"
              />
            </div>
            <div>
              <label
                className="block text-[11px] font-medium mb-1"
                style={{ color: "var(--text-tertiary)" }}
              >
                Chauffage (annuel)
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={coutChauffage}
                onChange={handleCurrency(setCoutChauffage)}
                className={inputClass}
                style={inputStyle}
                placeholder="1 800"
              />
            </div>
            <div>
              <label
                className="block text-[11px] font-medium mb-1"
                style={{ color: "var(--text-tertiary)" }}
              >
                Eau chaude (annuel)
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={coutEauChaude}
                onChange={handleCurrency(setCoutEauChaude)}
                className={inputClass}
                style={inputStyle}
                placeholder="600"
              />
            </div>
          </div>

          <div>
            <label
              className="block text-[11px] font-medium mb-1"
              style={{ color: "var(--text-tertiary)" }}
            >
              Rénovations (coût total)
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={renovations}
              onChange={handleCurrency(setRenovations)}
              className={inputClass}
              style={inputStyle}
              placeholder="15 000"
            />
            <p
              className="text-[11px] mt-1"
              style={{ color: "var(--text-tertiary)" }}
            >
              Amorties à 5% par année selon les règles du TAL
            </p>
          </div>

          <div>
            <label
              className="block text-[11px] font-medium mb-1"
              style={{ color: "var(--text-tertiary)" }}
            >
              Nombre de logements dans l&apos;immeuble
            </label>
            <select
              value={nbLogements}
              onChange={(e) => setNbLogements(e.target.value)}
              className={inputClass}
              style={inputStyle}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20].map((n) => (
                <option key={n} value={n}>
                  {n} logement{n > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Résultats */}
      {loyer > 0 && (
        <div
          className="rounded-lg p-5 space-y-4"
          style={{ background: couleurBg }}
        >
          <div className="flex items-center justify-between">
            <p
              className="text-[12px] font-semibold"
              style={{ color: couleurText }}
            >
              {verdict}
            </p>
            <p
              className="text-[22px] font-bold"
              style={{ color: couleurText }}
            >
              {pourcentageAffiche.toFixed(1).replace(".", ",")}%
            </p>
          </div>

          <div
            style={{ borderTop: `0.5px solid ${couleurText}`, opacity: 0.2 }}
          />

          <div className="grid grid-cols-3 gap-4">
            <div>
              <p
                className="text-[11px] mb-0.5"
                style={{ color: couleurText, opacity: 0.7 }}
              >
                Loyer actuel
              </p>
              <p
                className="text-[15px] font-bold"
                style={{ color: couleurText }}
              >
                {fmtCAD(loyer)}
              </p>
            </div>
            <div>
              <p
                className="text-[11px] mb-0.5"
                style={{ color: couleurText, opacity: 0.7 }}
              >
                Nouveau loyer
              </p>
              <p
                className="text-[15px] font-bold"
                style={{ color: couleurText }}
              >
                {fmtCAD(nouveauLoyer)}
              </p>
            </div>
            <div>
              <p
                className="text-[11px] mb-0.5"
                style={{ color: couleurText, opacity: 0.7 }}
              >
                Hausse mensuelle
              </p>
              <p
                className="text-[15px] font-bold"
                style={{ color: couleurText }}
              >
                +{fmtCAD(augmentationMensuelle)}
              </p>
            </div>
          </div>

          {modePersonnalise && (
            <>
              <div
                style={{
                  borderTop: `0.5px solid ${couleurText}`,
                  opacity: 0.2,
                }}
              />
              <p
                className="text-[11px] leading-relaxed"
                style={{ color: couleurText, opacity: 0.8 }}
              >
                Ce calcul inclut un ajustement IPC de 1,2% plus vos dépenses
                réelles réparties par logement. Les rénovations sont amorties
                sur 20 ans (5% par année).
              </p>
            </>
          )}
        </div>
      )}

      {/* Note */}
      <p
        className="text-[11px] leading-relaxed"
        style={{ color: "var(--text-tertiary)" }}
      >
        Les taux utilisés sont basés sur les indices d&apos;ajustement du TAL
        pour 2026. Ces calculs sont fournis à titre indicatif seulement. Pour
        une fixation officielle, consultez le{" "}
        <a
          href="https://www.tal.gouv.qc.ca"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
          style={{ color: "var(--green)" }}
        >
          Tribunal administratif du logement
        </a>
        .
      </p>
    </div>
  );
}
