"use client";

import { useState, useMemo, useCallback } from "react";

/* ── helpers ─────────────────────────────────────────────── */

function raw(s: string): number {
  return parseFloat(s.replace(/\s/g, "").replace(",", ".")) || 0;
}

function fmtCAD(n: number): string {
  const abs = Math.abs(n);
  const formatted = abs
    .toFixed(2)
    .replace(".", ",")
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return (n < 0 ? "-" : "") + formatted + " $";
}

function fmtPct(n: number): string {
  return n.toFixed(2).replace(".", ",") + " %";
}

function fmtInput(value: string): string {
  const v = value.replace(/\D/g, "");
  return v ? parseInt(v).toLocaleString("fr-CA") : "";
}

/* ── constantes TAL 2026 ────────────────────────────────── */

const IPC = 0.031; // 3,1 %
const TAUX_AMORT_RENO = 0.05; // 5 % / an

/* ── types ───────────────────────────────────────────────── */

interface RenoRow {
  id: number;
  label: string;
  dep: string;
  aide: string;
  log: string;
}

interface ServRow {
  id: number;
  label: string;
  dep: string;
  aide: string;
  log: string;
}

/* ── component ───────────────────────────────────────────── */

export function CalculateurLoyerClient() {
  /* Step 1 */
  const [loyerActuel, setLoyerActuel] = useState("1 200");
  const [concerneReno, setConcerneReno] = useState("non");

  /* Step 2 */
  const [totalLoyersLoues, setTotalLoyersLoues] = useState("1 200");
  const [totalLoyersInoccupes, setTotalLoyersInoccupes] = useState("");
  const [totalLoyersCommerciaux, setTotalLoyersCommerciaux] = useState("");

  /* Step 3 */
  const [taxMun2026, setTaxMun2026] = useState("");
  const [taxMun2025, setTaxMun2025] = useState("");
  const [taxScol2526, setTaxScol2526] = useState("");
  const [taxScol2425, setTaxScol2425] = useState("");
  const [assur2025, setAssur2025] = useState("");
  const [assur2024, setAssur2024] = useState("");

  /* Step 4 */
  const [renoRows, setRenoRows] = useState<RenoRow[]>([
    { id: 1, label: "", dep: "", aide: "", log: "1" },
  ]);
  const [nextRenoId, setNextRenoId] = useState(2);

  /* Step 5 */
  const [servRows, setServRows] = useState<ServRow[]>([]);
  const [nextServId, setNextServId] = useState(1);

  /* ── input handler ─────────────────────────────────────── */

  const handleCurrency = useCallback(
    (setter: (v: string) => void) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setter(fmtInput(e.target.value));
      },
    [],
  );

  /* ── dynamic row helpers ───────────────────────────────── */

  function addRenoRow() {
    setRenoRows((prev) => [
      ...prev,
      { id: nextRenoId, label: "", dep: "", aide: "", log: "1" },
    ]);
    setNextRenoId((p) => p + 1);
  }

  function removeRenoRow(id: number) {
    setRenoRows((prev) => prev.filter((r) => r.id !== id));
  }

  function updateRenoRow(id: number, field: keyof RenoRow, value: string) {
    setRenoRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)),
    );
  }

  function addServRow() {
    setServRows((prev) => [
      ...prev,
      { id: nextServId, label: "", dep: "", aide: "", log: "1" },
    ]);
    setNextServId((p) => p + 1);
  }

  function removeServRow(id: number) {
    setServRows((prev) => prev.filter((r) => r.id !== id));
  }

  function updateServRow(id: number, field: keyof ServRow, value: string) {
    setServRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)),
    );
  }

  /* ── calcul ────────────────────────────────────────────── */

  const result = useMemo(() => {
    const loyer = raw(loyerActuel);
    if (loyer <= 0) return null;

    const totalLoues = raw(totalLoyersLoues);
    const totalInoccupes = raw(totalLoyersInoccupes);
    const totalCommerciaux = raw(totalLoyersCommerciaux);
    const totalLoyers = totalLoues + totalInoccupes + totalCommerciaux;

    // 1 Base IPC
    const baseIPC = loyer * IPC;

    // 2 Taxes & assurances
    const paires = [
      { nouveau: raw(taxMun2026), ancien: raw(taxMun2025) },
      { nouveau: raw(taxScol2526), ancien: raw(taxScol2425) },
      { nouveau: raw(assur2025), ancien: raw(assur2024) },
    ];

    let ajustTaxes = 0;
    for (const p of paires) {
      if (p.nouveau > 0 || p.ancien > 0) {
        const hausse = p.nouveau - p.ancien;
        const baseExclue = p.ancien * IPC;
        const retenu = Math.max(0, hausse - baseExclue);
        const prorata = totalLoyers > 0 ? loyer / totalLoyers : 1;
        ajustTaxes += (retenu * prorata) / 12;
      }
    }

    // 3 Renovations majeures
    let ajustReno = 0;
    const loyerMoyenResidentiel =
      totalLoues > 0
        ? totalLoues
        : loyer;

    for (const row of renoRows) {
      const montant = raw(row.dep);
      const aide = raw(row.aide);
      const nbLog = parseInt(row.log) || 1;
      const retenu = montant - aide;
      if (retenu <= 0) continue;

      let prorata: number;
      if (nbLog <= 1) {
        prorata = 1;
      } else {
        const denom = nbLog * (loyerMoyenResidentiel / (totalLoues > 0 ? Math.max(1, Math.round(totalLoues / loyer)) : 1));
        prorata = denom > 0 ? loyer / denom : 1;
      }

      ajustReno += (retenu * TAUX_AMORT_RENO * prorata) / 12;
    }

    // 4 Nouveaux services
    let ajustServ = 0;
    for (const row of servRows) {
      const montant = raw(row.dep);
      const aide = raw(row.aide);
      const nbLog = parseInt(row.log) || 1;
      const retenu = montant - aide;
      if (retenu <= 0) continue;

      let prorata: number;
      if (nbLog <= 1) {
        prorata = 1;
      } else {
        const denom = nbLog * (loyerMoyenResidentiel / (totalLoues > 0 ? Math.max(1, Math.round(totalLoues / loyer)) : 1));
        prorata = denom > 0 ? loyer / denom : 1;
      }

      ajustServ += (retenu * prorata) / 12;
    }

    const total = baseIPC + ajustTaxes + ajustReno + ajustServ;
    const nouveauLoyer = Math.round(loyer + total);
    const pctVariation = (total / loyer) * 100;

    return {
      loyer,
      baseIPC,
      ajustTaxes,
      ajustReno,
      ajustServ,
      total,
      nouveauLoyer,
      pctVariation,
    };
  }, [
    loyerActuel,
    totalLoyersLoues,
    totalLoyersInoccupes,
    totalLoyersCommerciaux,
    taxMun2026,
    taxMun2025,
    taxScol2526,
    taxScol2425,
    assur2025,
    assur2024,
    renoRows,
    servRows,
  ]);

  /* ── couleurs résultat ─────────────────────────────────── */

  let couleurBg = "var(--green-light-bg)";
  let couleurText = "var(--green-text)";
  if (result && result.pctVariation >= 12) {
    couleurBg = "var(--red-bg)";
    couleurText = "var(--red-text)";
  } else if (result && result.pctVariation >= 6) {
    couleurBg = "var(--amber-bg)";
    couleurText = "var(--amber-text)";
  }

  /* ── styles partagés ───────────────────────────────────── */

  const inputClass =
    "w-full px-3 py-2.5 rounded-lg text-[13px] outline-none transition-colors";
  const inputStyle = {
    background: "var(--bg-page)",
    border: "0.5px solid var(--border)",
    color: "var(--text-primary)",
  };
  const labelClass = "block text-[12px] font-medium mb-1.5";
  const labelStyle = { color: "var(--text-secondary)" };
  const hintStyle = { color: "var(--text-tertiary)" };
  const stepTitleClass = "text-[15px] font-bold mb-3";
  const stepTitleStyle = { color: "var(--text-primary)" };

  return (
    <div className="space-y-6">
      {/* ── Step 1 : Logement concerne ──────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <span
            className="w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center shrink-0 text-white"
            style={{ background: "var(--green)" }}
          >
            1
          </span>
          <h2 className={stepTitleClass} style={stepTitleStyle}>
            Logement concerne
          </h2>
        </div>

        <div>
          <label className={labelClass} style={labelStyle}>
            Loyer mensuel actuel
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
              style={hintStyle}
            >
              $/mois
            </span>
          </div>
        </div>

        <div>
          <label className={labelClass} style={labelStyle}>
            Ce logement est-il concerne par des renovations?
          </label>
          <select
            value={concerneReno}
            onChange={(e) => setConcerneReno(e.target.value)}
            className={inputClass}
            style={inputStyle}
          >
            <option value="non">Non</option>
            <option value="oui">Oui</option>
          </select>
        </div>
      </section>

      <div style={{ borderTop: "0.5px solid var(--border)" }} />

      {/* ── Step 2 : Loyers de l'immeuble ───────────────── */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <span
            className="w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center shrink-0 text-white"
            style={{ background: "var(--green)" }}
          >
            2
          </span>
          <h2 className={stepTitleClass} style={stepTitleStyle}>
            Loyers de l&apos;immeuble
          </h2>
        </div>

        <div>
          <label className={labelClass} style={labelStyle}>
            Total des loyers mensuels des logements loues
          </label>
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              value={totalLoyersLoues}
              onChange={handleCurrency(setTotalLoyersLoues)}
              className={inputClass}
              style={inputStyle}
              placeholder="1 200"
            />
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px]"
              style={hintStyle}
            >
              $/mois
            </span>
          </div>
        </div>

        <div>
          <label className={labelClass} style={labelStyle}>
            Total des loyers des logements inoccupes ou occupes par le locateur
          </label>
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              value={totalLoyersInoccupes}
              onChange={handleCurrency(setTotalLoyersInoccupes)}
              className={inputClass}
              style={inputStyle}
              placeholder="0"
            />
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px]"
              style={hintStyle}
            >
              $/mois
            </span>
          </div>
        </div>

        <div>
          <label className={labelClass} style={labelStyle}>
            Total des loyers des locaux commerciaux
          </label>
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              value={totalLoyersCommerciaux}
              onChange={handleCurrency(setTotalLoyersCommerciaux)}
              className={inputClass}
              style={inputStyle}
              placeholder="0"
            />
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px]"
              style={hintStyle}
            >
              $/mois
            </span>
          </div>
        </div>
      </section>

      <div style={{ borderTop: "0.5px solid var(--border)" }} />

      {/* ── Step 3 : Taxes et assurances ────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <span
            className="w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center shrink-0 text-white"
            style={{ background: "var(--green)" }}
          >
            3
          </span>
          <h2 className={stepTitleClass} style={stepTitleStyle}>
            Taxes et assurances
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Taxes municipales */}
          <div>
            <label className={labelClass} style={labelStyle}>
              Taxes municipales 2026
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={taxMun2026}
              onChange={handleCurrency(setTaxMun2026)}
              className={inputClass}
              style={inputStyle}
              placeholder="4 500"
            />
          </div>
          <div>
            <label className={labelClass} style={labelStyle}>
              Taxes municipales 2025
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={taxMun2025}
              onChange={handleCurrency(setTaxMun2025)}
              className={inputClass}
              style={inputStyle}
              placeholder="4 200"
            />
          </div>

          {/* Taxes scolaires */}
          <div>
            <label className={labelClass} style={labelStyle}>
              Taxes scolaires 2025-2026
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={taxScol2526}
              onChange={handleCurrency(setTaxScol2526)}
              className={inputClass}
              style={inputStyle}
              placeholder="800"
            />
          </div>
          <div>
            <label className={labelClass} style={labelStyle}>
              Taxes scolaires 2024-2025
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={taxScol2425}
              onChange={handleCurrency(setTaxScol2425)}
              className={inputClass}
              style={inputStyle}
              placeholder="750"
            />
          </div>

          {/* Assurances */}
          <div>
            <label className={labelClass} style={labelStyle}>
              Assurances au 31 dec. 2025
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={assur2025}
              onChange={handleCurrency(setAssur2025)}
              className={inputClass}
              style={inputStyle}
              placeholder="2 200"
            />
          </div>
          <div>
            <label className={labelClass} style={labelStyle}>
              Assurances au 31 dec. 2024
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={assur2024}
              onChange={handleCurrency(setAssur2024)}
              className={inputClass}
              style={inputStyle}
              placeholder="2 000"
            />
          </div>
        </div>

        <p className="text-[11px] leading-relaxed" style={hintStyle}>
          Seule la hausse qui depasse le taux de base IPC (3,1%) est retenue
          dans le calcul.
        </p>
      </section>

      <div style={{ borderTop: "0.5px solid var(--border)" }} />

      {/* ── Step 4 : Reparations ou ameliorations majeures  */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <span
            className="w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center shrink-0 text-white"
            style={{ background: "var(--green)" }}
          >
            4
          </span>
          <h2 className={stepTitleClass} style={stepTitleStyle}>
            Reparations ou ameliorations majeures
          </h2>
        </div>

        {/* Header row - hidden on mobile */}
        {renoRows.length > 0 && (
          <div
            className="hidden md:grid gap-2 text-[11px] font-medium"
            style={{
              gridTemplateColumns: "1fr 120px 120px 100px 36px",
              color: "var(--text-tertiary)",
            }}
          >
            <span>Nature des travaux</span>
            <span>Montant ($)</span>
            <span>Aide recue ($)</span>
            <span>Logements</span>
            <span />
          </div>
        )}

        {renoRows.map((row) => (
          <div
            key={row.id}
            className="grid gap-2 items-start"
            style={{
              gridTemplateColumns: "1fr",
            }}
          >
            {/* Mobile: stacked layout */}
            <div className="md:hidden space-y-2">
              <input
                type="text"
                value={row.label}
                onChange={(e) =>
                  updateRenoRow(row.id, "label", e.target.value)
                }
                className={inputClass}
                style={inputStyle}
                placeholder="Nature des travaux"
              />
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label
                    className="block text-[11px] mb-1"
                    style={hintStyle}
                  >
                    Montant
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={row.dep}
                    onChange={(e) =>
                      updateRenoRow(row.id, "dep", fmtInput(e.target.value))
                    }
                    className={inputClass}
                    style={inputStyle}
                    placeholder="15 000"
                  />
                </div>
                <div>
                  <label
                    className="block text-[11px] mb-1"
                    style={hintStyle}
                  >
                    Aide recue
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={row.aide}
                    onChange={(e) =>
                      updateRenoRow(row.id, "aide", fmtInput(e.target.value))
                    }
                    className={inputClass}
                    style={inputStyle}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label
                    className="block text-[11px] mb-1"
                    style={hintStyle}
                  >
                    Logements
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={row.log}
                    onChange={(e) =>
                      updateRenoRow(row.id, "log", e.target.value)
                    }
                    className={inputClass}
                    style={inputStyle}
                    placeholder="1"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeRenoRow(row.id)}
                className="text-[11px] px-2 py-1 rounded-lg transition-colors"
                style={{ color: "var(--red-text)" }}
              >
                Supprimer
              </button>
            </div>

            {/* Desktop: row layout */}
            <div
              className="hidden md:grid gap-2 items-center"
              style={{
                gridTemplateColumns: "1fr 120px 120px 100px 36px",
              }}
            >
              <input
                type="text"
                value={row.label}
                onChange={(e) =>
                  updateRenoRow(row.id, "label", e.target.value)
                }
                className={inputClass}
                style={inputStyle}
                placeholder="Nature des travaux"
              />
              <input
                type="text"
                inputMode="numeric"
                value={row.dep}
                onChange={(e) =>
                  updateRenoRow(row.id, "dep", fmtInput(e.target.value))
                }
                className={inputClass}
                style={inputStyle}
                placeholder="15 000"
              />
              <input
                type="text"
                inputMode="numeric"
                value={row.aide}
                onChange={(e) =>
                  updateRenoRow(row.id, "aide", fmtInput(e.target.value))
                }
                className={inputClass}
                style={inputStyle}
                placeholder="0"
              />
              <input
                type="text"
                inputMode="numeric"
                value={row.log}
                onChange={(e) =>
                  updateRenoRow(row.id, "log", e.target.value)
                }
                className={inputClass}
                style={inputStyle}
                placeholder="1"
              />
              <button
                type="button"
                onClick={() => removeRenoRow(row.id)}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                style={{
                  color: "var(--text-tertiary)",
                  border: "0.5px solid var(--border)",
                  background: "var(--bg-page)",
                }}
                aria-label="Supprimer cette ligne"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addRenoRow}
          className="text-[12px] font-medium px-3 py-2 rounded-lg transition-colors"
          style={{
            color: "var(--green)",
            border: "0.5px solid var(--border)",
            background: "var(--bg-page)",
          }}
        >
          + Ajouter un type de travaux
        </button>

        <p className="text-[11px] leading-relaxed" style={hintStyle}>
          Les reparations et ameliorations majeures sont amorties a 5% par
          annee (sur 20 ans) selon les regles du TAL.
        </p>
      </section>

      <div style={{ borderTop: "0.5px solid var(--border)" }} />

      {/* ── Step 5 : Nouveaux services (optionnel) ──────── */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <span
            className="w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center shrink-0 text-white"
            style={{ background: "var(--green)" }}
          >
            5
          </span>
          <h2 className={stepTitleClass} style={stepTitleStyle}>
            Nouveaux services ou accessoires{" "}
            <span
              className="text-[12px] font-normal"
              style={{ color: "var(--text-tertiary)" }}
            >
              (optionnel)
            </span>
          </h2>
        </div>

        {/* Header row - hidden on mobile */}
        {servRows.length > 0 && (
          <div
            className="hidden md:grid gap-2 text-[11px] font-medium"
            style={{
              gridTemplateColumns: "1fr 120px 120px 100px 36px",
              color: "var(--text-tertiary)",
            }}
          >
            <span>Description du service</span>
            <span>Montant ($)</span>
            <span>Aide recue ($)</span>
            <span>Logements</span>
            <span />
          </div>
        )}

        {servRows.map((row) => (
          <div key={row.id}>
            {/* Mobile: stacked layout */}
            <div className="md:hidden space-y-2">
              <input
                type="text"
                value={row.label}
                onChange={(e) =>
                  updateServRow(row.id, "label", e.target.value)
                }
                className={inputClass}
                style={inputStyle}
                placeholder="Description du service"
              />
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label
                    className="block text-[11px] mb-1"
                    style={hintStyle}
                  >
                    Montant
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={row.dep}
                    onChange={(e) =>
                      updateServRow(row.id, "dep", fmtInput(e.target.value))
                    }
                    className={inputClass}
                    style={inputStyle}
                    placeholder="500"
                  />
                </div>
                <div>
                  <label
                    className="block text-[11px] mb-1"
                    style={hintStyle}
                  >
                    Aide recue
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={row.aide}
                    onChange={(e) =>
                      updateServRow(row.id, "aide", fmtInput(e.target.value))
                    }
                    className={inputClass}
                    style={inputStyle}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label
                    className="block text-[11px] mb-1"
                    style={hintStyle}
                  >
                    Logements
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={row.log}
                    onChange={(e) =>
                      updateServRow(row.id, "log", e.target.value)
                    }
                    className={inputClass}
                    style={inputStyle}
                    placeholder="1"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeServRow(row.id)}
                className="text-[11px] px-2 py-1 rounded-lg transition-colors"
                style={{ color: "var(--red-text)" }}
              >
                Supprimer
              </button>
            </div>

            {/* Desktop: row layout */}
            <div
              className="hidden md:grid gap-2 items-center"
              style={{
                gridTemplateColumns: "1fr 120px 120px 100px 36px",
              }}
            >
              <input
                type="text"
                value={row.label}
                onChange={(e) =>
                  updateServRow(row.id, "label", e.target.value)
                }
                className={inputClass}
                style={inputStyle}
                placeholder="Description du service"
              />
              <input
                type="text"
                inputMode="numeric"
                value={row.dep}
                onChange={(e) =>
                  updateServRow(row.id, "dep", fmtInput(e.target.value))
                }
                className={inputClass}
                style={inputStyle}
                placeholder="500"
              />
              <input
                type="text"
                inputMode="numeric"
                value={row.aide}
                onChange={(e) =>
                  updateServRow(row.id, "aide", fmtInput(e.target.value))
                }
                className={inputClass}
                style={inputStyle}
                placeholder="0"
              />
              <input
                type="text"
                inputMode="numeric"
                value={row.log}
                onChange={(e) =>
                  updateServRow(row.id, "log", e.target.value)
                }
                className={inputClass}
                style={inputStyle}
                placeholder="1"
              />
              <button
                type="button"
                onClick={() => removeServRow(row.id)}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                style={{
                  color: "var(--text-tertiary)",
                  border: "0.5px solid var(--border)",
                  background: "var(--bg-page)",
                }}
                aria-label="Supprimer cette ligne"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addServRow}
          className="text-[12px] font-medium px-3 py-2 rounded-lg transition-colors"
          style={{
            color: "var(--green)",
            border: "0.5px solid var(--border)",
            background: "var(--bg-page)",
          }}
        >
          + Ajouter un service
        </button>
      </section>

      {/* ── Resultat ─────────────────────────────────────── */}
      {result && (
        <>
          <div style={{ borderTop: "0.5px solid var(--border)" }} />

          {/* Hero result */}
          <div
            className="rounded-xl p-6 text-center space-y-3"
            style={{ background: couleurBg }}
          >
            <p
              className="text-[32px] font-bold leading-tight"
              style={{ color: couleurText }}
            >
              +{result.total.toFixed(2).replace(".", ",")} $/mois
            </p>
            <p className="text-[13px]" style={{ color: couleurText }}>
              Loyer actuel {fmtCAD(result.loyer)} &rarr;{" "}
              {fmtCAD(result.nouveauLoyer)}/mois &middot; Variation{" "}
              {fmtPct(result.pctVariation)}
            </p>
          </div>

          {/* Summary grid */}
          <div className="grid grid-cols-3 gap-3">
            <div
              className="rounded-lg p-4 text-center"
              style={{
                background: "var(--bg-card)",
                border: "0.5px solid var(--border)",
              }}
            >
              <p
                className="text-[11px] mb-1"
                style={{ color: "var(--text-tertiary)" }}
              >
                Loyer actuel
              </p>
              <p
                className="text-[15px] font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                {fmtCAD(result.loyer)}
              </p>
            </div>
            <div
              className="rounded-lg p-4 text-center"
              style={{
                background: "var(--bg-card)",
                border: "0.5px solid var(--border)",
              }}
            >
              <p
                className="text-[11px] mb-1"
                style={{ color: "var(--text-tertiary)" }}
              >
                Nouveau loyer
              </p>
              <p
                className="text-[15px] font-bold"
                style={{ color: couleurText }}
              >
                {fmtCAD(result.nouveauLoyer)}
              </p>
            </div>
            <div
              className="rounded-lg p-4 text-center"
              style={{
                background: "var(--bg-card)",
                border: "0.5px solid var(--border)",
              }}
            >
              <p
                className="text-[11px] mb-1"
                style={{ color: "var(--text-tertiary)" }}
              >
                % de variation
              </p>
              <p
                className="text-[15px] font-bold"
                style={{ color: couleurText }}
              >
                {fmtPct(result.pctVariation)}
              </p>
            </div>
          </div>

          {/* Detail breakdown */}
          <div
            className="rounded-xl overflow-hidden"
            style={{
              background: "var(--bg-card)",
              border: "0.5px solid var(--border)",
            }}
          >
            <div
              className="px-4 py-3"
              style={{ borderBottom: "0.5px solid var(--border)" }}
            >
              <p
                className="text-[13px] font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                Detail du calcul
              </p>
            </div>

            <div className="divide-y" style={{ borderColor: "var(--border)" }}>
              {[
                {
                  num: "\u2460",
                  label: "Ajustement de base (IPC 3,1%)",
                  value: result.baseIPC,
                },
                {
                  num: "\u2461",
                  label: "Taxes et assurances",
                  value: result.ajustTaxes,
                },
                {
                  num: "\u2462",
                  label: "Reparations majeures",
                  value: result.ajustReno,
                },
                {
                  num: "\u2463",
                  label: "Nouveaux services",
                  value: result.ajustServ,
                },
              ].map((item) => (
                <div
                  key={item.num}
                  className="flex items-center justify-between px-4 py-3"
                  style={{ borderColor: "var(--border)" }}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="text-[14px]"
                      style={{ color: "var(--green)" }}
                    >
                      {item.num}
                    </span>
                    <span
                      className="text-[13px]"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {item.label}
                    </span>
                  </div>
                  <span
                    className="text-[13px] font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    +{item.value.toFixed(2).replace(".", ",")} $/mois
                  </span>
                </div>
              ))}

              {/* Total row */}
              <div
                className="flex items-center justify-between px-4 py-3"
                style={{
                  background: "var(--bg-secondary)",
                  borderTop: "0.5px solid var(--border)",
                }}
              >
                <span
                  className="text-[13px] font-bold"
                  style={{ color: "var(--text-primary)" }}
                >
                  Total
                </span>
                <span
                  className="text-[15px] font-bold"
                  style={{ color: couleurText }}
                >
                  +{result.total.toFixed(2).replace(".", ",")} $/mois
                </span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Note */}
      <p
        className="text-[11px] leading-relaxed"
        style={{ color: "var(--text-tertiary)" }}
      >
        Les taux utilises sont bases sur les indices d&apos;ajustement du TAL
        pour 2026. Ces calculs sont fournis a titre indicatif seulement. Pour
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
