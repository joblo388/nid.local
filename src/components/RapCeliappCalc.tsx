"use client";

import { useState } from "react";

function fmtCAD(n: number): string {
  return Math.round(n).toLocaleString("fr-CA") + " $";
}

function fmtInput(v: string): string {
  const d = v.replace(/\D/g, "");
  return d ? parseInt(d).toLocaleString("fr-CA") : "";
}

function raw(s: string): number {
  return parseFloat(s.replace(/\s/g, "").replace(",", ".")) || 0;
}

export function RapCeliappCalc() {
  const [annees, setAnnees] = useState(3);
  const [contribution, setContribution] = useState("8 000");
  const [rap, setRap] = useState("35 000");
  const [epargne, setEpargne] = useState("20 000");

  const contributionNum = raw(contribution);
  const rapNum = raw(rap);
  const epargneNum = raw(epargne);

  // Calculations
  const celiappTotal = Math.min(annees * Math.min(contributionNum, 8000), 40000);
  const rapTotal = Math.min(rapNum, 60000);
  const totalMise = celiappTotal + rapTotal + epargneNum;

  const prop5 = totalMise * 20;
  const prop10 = totalMise * 10;
  const prop20 = totalMise * 5;

  // Progress bar proportions
  const pctCeliapp = totalMise > 0 ? (celiappTotal / totalMise) * 100 : 0;
  const pctRap = totalMise > 0 ? (rapTotal / totalMise) * 100 : 0;
  const pctEpargne = totalMise > 0 ? (epargneNum / totalMise) * 100 : 0;

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: "var(--bg-card)",
        border: "0.5px solid var(--border)",
      }}
    >
      {/* Header */}
      <div
        className="px-5 py-4"
        style={{ borderBottom: "0.5px solid var(--border)" }}
      >
        <h3
          className="text-[13px] font-semibold"
          style={{ color: "var(--text-primary)" }}
        >
          Calculateur RAP + CELIAPP
        </h3>
        <p
          className="text-[11px] mt-0.5"
          style={{ color: "var(--text-tertiary)" }}
        >
          Estimez votre mise de fonds en combinant vos outils d&apos;accession &agrave; la propri&eacute;t&eacute;
        </p>
      </div>

      {/* Inputs */}
      <div className="p-5 space-y-4">
        {/* Slider: Annees CELIAPP */}
        <div>
          <label
            className="text-[12px] font-medium flex justify-between mb-2"
            style={{ color: "var(--text-secondary)" }}
          >
            <span>Ann&eacute;es d&apos;&eacute;pargne CELIAPP</span>
            <span
              className="font-semibold"
              style={{ color: "var(--green-text)" }}
            >
              {annees} an{annees > 1 ? "s" : ""}
            </span>
          </label>
          <input
            type="range"
            min={1}
            max={5}
            step={1}
            value={annees}
            onChange={(e) => setAnnees(parseInt(e.target.value))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer"
            style={{
              accentColor: "var(--green)",
              background: "var(--bg-secondary)",
            }}
          />
          <div
            className="flex justify-between text-[10px] mt-1"
            style={{ color: "var(--text-tertiary)" }}
          >
            <span>1 an</span>
            <span>5 ans</span>
          </div>
        </div>

        {/* Contribution CELIAPP */}
        <div>
          <label
            className="text-[12px] font-medium block mb-1.5"
            style={{ color: "var(--text-secondary)" }}
          >
            Contribution CELIAPP annuelle
          </label>
          <div
            className="flex items-center rounded-lg overflow-hidden"
            style={{
              border: "0.5px solid var(--border-secondary)",
              background: "var(--bg-card)",
            }}
          >
            <input
              type="text"
              inputMode="numeric"
              value={contribution}
              onChange={(e) => setContribution(e.target.value.replace(/[^0-9\s]/g, ""))}
              onBlur={(e) => {
                const v = raw(e.target.value);
                setContribution(fmtInput(String(Math.min(v, 8000))));
              }}
              placeholder="8 000"
              className="flex-1 px-3 py-2.5 text-[14px] outline-none bg-transparent"
              style={{ color: "var(--text-primary)", border: "none" }}
            />
            <span
              className="px-3 text-[12px] self-stretch flex items-center"
              style={{
                color: "var(--text-tertiary)",
                borderLeft: "0.5px solid var(--border)",
                background: "var(--bg-secondary)",
              }}
            >
              $
            </span>
          </div>
          <p
            className="text-[11px] mt-1"
            style={{ color: "var(--text-tertiary)" }}
          >
            Maximum 8 000 $ par ann&eacute;e
          </p>
        </div>

        {/* Montant RAP */}
        <div>
          <label
            className="text-[12px] font-medium block mb-1.5"
            style={{ color: "var(--text-secondary)" }}
          >
            Montant RAP (REER disponible)
          </label>
          <div
            className="flex items-center rounded-lg overflow-hidden"
            style={{
              border: "0.5px solid var(--border-secondary)",
              background: "var(--bg-card)",
            }}
          >
            <input
              type="text"
              inputMode="numeric"
              value={rap}
              onChange={(e) => setRap(e.target.value.replace(/[^0-9\s]/g, ""))}
              onBlur={(e) => {
                const v = raw(e.target.value);
                setRap(fmtInput(String(Math.min(v, 60000))));
              }}
              placeholder="35 000"
              className="flex-1 px-3 py-2.5 text-[14px] outline-none bg-transparent"
              style={{ color: "var(--text-primary)", border: "none" }}
            />
            <span
              className="px-3 text-[12px] self-stretch flex items-center"
              style={{
                color: "var(--text-tertiary)",
                borderLeft: "0.5px solid var(--border)",
                background: "var(--bg-secondary)",
              }}
            >
              $
            </span>
          </div>
          <p
            className="text-[11px] mt-1"
            style={{ color: "var(--text-tertiary)" }}
          >
            Maximum 60 000 $ par personne
          </p>
        </div>

        {/* &Eacute;pargne personnelle */}
        <div>
          <label
            className="text-[12px] font-medium block mb-1.5"
            style={{ color: "var(--text-secondary)" }}
          >
            &Eacute;pargne personnelle
          </label>
          <div
            className="flex items-center rounded-lg overflow-hidden"
            style={{
              border: "0.5px solid var(--border-secondary)",
              background: "var(--bg-card)",
            }}
          >
            <input
              type="text"
              inputMode="numeric"
              value={epargne}
              onChange={(e) => setEpargne(e.target.value.replace(/[^0-9\s]/g, ""))}
              onBlur={(e) => setEpargne(fmtInput(e.target.value))}
              placeholder="20 000"
              className="flex-1 px-3 py-2.5 text-[14px] outline-none bg-transparent"
              style={{ color: "var(--text-primary)", border: "none" }}
            />
            <span
              className="px-3 text-[12px] self-stretch flex items-center"
              style={{
                color: "var(--text-tertiary)",
                borderLeft: "0.5px solid var(--border)",
                background: "var(--bg-secondary)",
              }}
            >
              $
            </span>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: "0.5px", background: "var(--border)", margin: "16px 0" }} />

        {/* Result hero */}
        <div
          className="rounded-xl px-5 py-5 text-center"
          style={{
            background: "var(--green-light-bg)",
            border: "0.5px solid var(--green)",
          }}
        >
          <p
            className="text-[12px] font-semibold uppercase tracking-wider mb-1"
            style={{ color: "var(--green-text)" }}
          >
            Mise de fonds totale :
          </p>
          <p
            className="text-[36px] font-medium tracking-tight leading-none"
            style={{ color: "var(--green-text)", letterSpacing: "-1px" }}
          >
            {fmtCAD(totalMise)}
          </p>
        </div>

        {/* 3 boxes: property accessible */}
        <div className="rap-celiapp-boxes">
          {[
            { label: "Propri\u00e9t\u00e9 accessible (5 %)", value: prop5, note: "SCHL requise" },
            { label: "Propri\u00e9t\u00e9 accessible (10 %)", value: prop10, note: null },
            { label: "Propri\u00e9t\u00e9 accessible (20 %)", value: prop20, note: "Sans SCHL" },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-lg px-3 py-3 text-center"
              style={{
                border: "0.5px solid var(--border)",
                background: "var(--bg-card)",
              }}
            >
              <p
                className="text-[10px] font-medium uppercase tracking-wide mb-1.5"
                style={{ color: "var(--text-tertiary)" }}
              >
                {item.label}
              </p>
              <p
                className="text-[16px] font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                {fmtCAD(item.value)}
              </p>
              {item.note && (
                <p
                  className="text-[10px] mt-1"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  {item.note}
                </p>
              )}
            </div>
          ))}
        </div>

        <style>{`
          .rap-celiapp-boxes {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 10px;
          }
          @media (max-width: 640px) {
            .rap-celiapp-boxes { grid-template-columns: 1fr; }
          }
        `}</style>

        {/* Breakdown */}
        <div
          className="rounded-lg px-4 py-3"
          style={{
            background: "var(--bg-secondary)",
            border: "0.5px solid var(--border)",
          }}
        >
          <p
            className="text-[11px] font-semibold uppercase tracking-wider mb-3"
            style={{ color: "var(--text-tertiary)" }}
          >
            Ventilation
          </p>
          <div className="space-y-2">
            {[
              { label: "CELIAPP", value: celiappTotal, color: "var(--green)" },
              { label: "RAP (REER)", value: rapTotal, color: "var(--blue-text)" },
              { label: "\u00C9pargne", value: epargneNum, color: "var(--amber-text)" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between text-[13px]"
              >
                <span className="flex items-center gap-2">
                  <span
                    className="inline-block w-2.5 h-2.5 rounded-sm"
                    style={{ background: item.color }}
                  />
                  <span style={{ color: "var(--text-secondary)" }}>
                    {item.label}
                  </span>
                </span>
                <span
                  className="font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  {fmtCAD(item.value)}
                </span>
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div
            className="flex rounded-full overflow-hidden mt-3"
            style={{ height: "10px", background: "var(--bg-page)" }}
          >
            {pctCeliapp > 0 && (
              <div
                style={{
                  width: `${pctCeliapp}%`,
                  background: "var(--green)",
                  transition: "width 0.4s ease",
                }}
              />
            )}
            {pctRap > 0 && (
              <div
                style={{
                  width: `${pctRap}%`,
                  background: "var(--blue-text)",
                  transition: "width 0.4s ease",
                }}
              />
            )}
            {pctEpargne > 0 && (
              <div
                style={{
                  width: `${pctEpargne}%`,
                  background: "var(--amber-text)",
                  transition: "width 0.4s ease",
                }}
              />
            )}
          </div>
        </div>

        {/* Note SCHL */}
        <p
          className="text-[11px] leading-relaxed"
          style={{ color: "var(--text-tertiary)" }}
        >
          Avec une mise de fonds de 5 %, la prime SCHL s&apos;applique.
          Le CELIAPP permet un maximum &agrave; vie de 40 000 $. Le RAP est
          limit&eacute; &agrave; 60 000 $ par personne et doit &ecirc;tre rembours&eacute; sur 15 ans.
        </p>
      </div>
    </div>
  );
}
