"use client";

import { useEffect, useRef, useCallback } from "react";
import { ShareCalculation } from "@/components/ShareCalculation";

export function CalculatriceClient() {
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const syncUrlParams = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const prix = (document.getElementById("price") as HTMLInputElement)?.value ?? "";
      const mise = (document.getElementById("down") as HTMLInputElement)?.value ?? "";
      const taux = (document.getElementById("rate") as HTMLInputElement)?.value ?? "";
      const amort = (document.getElementById("amort") as HTMLInputElement)?.value ?? "";
      const typeLogement = (document.getElementById("prop-type") as HTMLSelectElement)?.value ?? "";
      const params = new URLSearchParams();
      if (prix) params.set("prix", prix);
      if (mise) params.set("mise", mise);
      if (taux) params.set("taux", taux);
      if (amort) params.set("amortissement", amort);
      if (freqKey && freqKey !== "monthly") params.set("frequence", freqKey);
      if (typeLogement && typeLogement !== "unifamilial") params.set("typeLogement", typeLogement);
      const qs = params.toString();
      const newUrl = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;
      window.history.replaceState(null, "", newUrl);
    }, 500);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.toString()) {
      const map: Record<string, string> = { prix: "price", mise: "down", taux: "rate", amortissement: "amort", typeLogement: "prop-type" };
      for (const [paramKey, elId] of Object.entries(map)) {
        const v = params.get(paramKey);
        if (v !== null) {
          const el = document.getElementById(elId) as HTMLInputElement | HTMLSelectElement | null;
          if (el) el.value = v;
        }
      }
      const freq = params.get("frequence");
      if (freq) {
        const freqMap: Record<string, number> = { weekly: 52, biweekly: 26, monthly: 12, accweekly: 52 };
        if (freqMap[freq]) {
          freqPerYear = freqMap[freq];
          freqKey = freq;
          document.querySelectorAll(".seg-opt").forEach((b) => b.classList.remove("active"));
          const labels: Record<string, string> = { weekly: "Hebdo", biweekly: "Aux 2 sem.", monthly: "Mensuel", accweekly: "Hebdo accéléré" };
          document.querySelectorAll(".seg-opt").forEach((b) => {
            if (b.textContent?.trim() === labels[freq]) b.classList.add("active");
          });
          const periodLabels: Record<string, string> = { weekly: "$ / semaine", biweekly: "$ / 2 semaines", monthly: "$ / mois", accweekly: "$ / semaine (accéléré)" };
          const periodEl = document.getElementById("period-label");
          if (periodEl) periodEl.textContent = periodLabels[freq];
        }
      }
      onTypeChange();
    }
    calc();

    // Listen for input/change/click events to sync URL params (debounced)
    const container = document.querySelector(".calc");
    if (container) {
      const handler = () => syncUrlParams();
      container.addEventListener("input", handler);
      container.addEventListener("change", handler);
      container.addEventListener("click", handler);
      return () => {
        container.removeEventListener("input", handler);
        container.removeEventListener("change", handler);
        container.removeEventListener("click", handler);
        if (debounceRef.current) clearTimeout(debounceRef.current);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [syncUrlParams]);

  return (
    <>
      <style>{css}</style>
      <div className="calc">
        <div className="calc-sub">Estimez votre paiement mensuel avec les taux du marché québécois</div>
        <div className="rates-bar">
          <span className="rates-label">Taux du jour :</span>
          <div className="rate-pill active" onClick={(e) => selectRate(e.currentTarget as HTMLElement, 4.99)}>Variable 4,99%</div>
          <div className="rate-pill" onClick={(e) => selectRate(e.currentTarget as HTMLElement, 5.24)}>1 an 5,24%</div>
          <div className="rate-pill" onClick={(e) => selectRate(e.currentTarget as HTMLElement, 4.84)}>3 ans 4,84%</div>
          <div className="rate-pill" onClick={(e) => selectRate(e.currentTarget as HTMLElement, 4.64)}>5 ans 4,64%</div>
          <div className="rate-pill" onClick={(e) => selectRate(e.currentTarget as HTMLElement, 5.09)}>10 ans 5,09%</div>
          <span className="rate-source">Taux indicatifs</span>
        </div>
        <p className="text-[11px] mt-2" style={{ color: "var(--text-tertiary)" }}>
          Taux indicatifs au {new Date("2026-03-31").toLocaleDateString("fr-CA", { day: "numeric", month: "long", year: "numeric" })}{" "}·{" "}
          <a href="https://www.banqueducanada.ca/taux/" target="_blank" rel="noopener" style={{ color: "var(--green)" }}>Banque du Canada</a>
        </p>
        <div className="calc-grid">
          <div className="field full">
            <label>Type de propriété</label>
            <div className="field-input">
              <select id="prop-type" onChange={() => onTypeChange()}>
                <optgroup label="Résidentiel">
                  <option value="unifamilial">Maison unifamiliale (1 logement)</option>
                  <option value="condo">Condo (1 logement)</option>
                  <option value="chalet">Chalet / résidence secondaire</option>
                </optgroup>
                <optgroup label="Plex">
                  <option value="duplex">Duplex (2 logements)</option>
                  <option value="triplex">Triplex (3 logements)</option>
                  <option value="quadruplex">Quadruplex (4 logements)</option>
                  <option value="cinqplex">5 logements et plus</option>
                </optgroup>
              </select>
            </div>
            <div className="occupant-row" id="occupant-row">
              <input type="checkbox" id="occupant" defaultChecked onChange={() => calc()} />
              <label htmlFor="occupant">J&apos;occupe une des unités comme résidence principale</label>
              <span className="occupant-note" id="occupant-note">5% occupant · 20% non-occupant</span>
            </div>
          </div>
          <div className="field">
            <label>Prix de la propriété</label>
            <div className="field-input">
              <input type="text" id="price" defaultValue="450 000" onInput={(e) => { fmt(e.currentTarget as HTMLInputElement); calc(); }} />
              <span className="unit">$</span>
            </div>
          </div>
          <div className="field">
            <label>Mise de fonds</label>
            <div className="field-input" id="down-wrap">
              <input type="text" id="down" defaultValue="90 000" onInput={(e) => { fmt(e.currentTarget as HTMLInputElement); calc(); }} />
              <span className="unit">$ · <span id="down-pct">20%</span></span>
            </div>
            <div className="alert" id="down-alert">
              <svg viewBox="0 0 16 16" style={{ width: 13, height: 13, flexShrink: 0, marginTop: 1, fill: "none", strokeWidth: 1.5 }}>
                <path d="M8 2L1 14h14L8 2z" /><line x1="8" y1="7" x2="8" y2="10" /><circle cx="8" cy="12.5" r="0.5" fill="currentColor" />
              </svg>
              <span id="down-alert-text"></span>
            </div>
          </div>
          <div className="field">
            <label>Taux d&apos;intérêt</label>
            <div className="field-input">
              <input type="text" id="rate" defaultValue="4.99" onInput={() => calc()} />
              <span className="unit">%</span>
            </div>
          </div>
          <div className="field">
            <label>Amortissement</label>
            <div className="field-input">
              <input type="text" id="amort" defaultValue="25" onInput={() => calc()} />
              <span className="unit">ans</span>
            </div>
          </div>
          <div className="field full">
            <label>Fréquence de paiement</label>
            <div className="seg-control">
              <button className="seg-opt" onClick={(e) => setFreq(e.currentTarget, "weekly", 52)}>Hebdo</button>
              <button className="seg-opt" onClick={(e) => setFreq(e.currentTarget, "biweekly", 26)}>Aux 2 sem.</button>
              <button className="seg-opt active" onClick={(e) => setFreq(e.currentTarget, "monthly", 12)}>Mensuel</button>
              <button className="seg-opt" onClick={(e) => setFreq(e.currentTarget, "accweekly", 52)}>Hebdo accéléré</button>
            </div>
          </div>
        </div>
        <div className="divider" />
        <div className="results">
          <div className="result-main">
            <div className="result-amount" id="payment">1 899</div>
            <div className="result-period" id="period-label">$ / mois</div>
          </div>
          <div className="result-sub" id="result-sub">Hypothèque de 360 000 $ sur 25 ans à 4,99%</div>
          <div className="result-grid">
            <div className="result-box"><div className="result-box-val" id="total-interest">—</div><div className="result-box-lbl">Intérêts totaux</div></div>
            <div className="result-box"><div className="result-box-val" id="total-paid">—</div><div className="result-box-lbl">Total déboursé</div></div>
            <div className="result-box"><div className="result-box-val" id="cmhc">0 $</div><div className="result-box-lbl">Prime SCHL</div></div>
          </div>
          <div className="breakdown-bar"><div className="breakdown-fill" id="principal-bar" style={{ width: "63%" }} /></div>
          <div className="breakdown-legend">
            <div className="legend-item"><div className="legend-dot" style={{ background: "var(--green)" }} /><span id="principal-pct">63% capital</span></div>
            <div className="legend-item"><div className="legend-dot" style={{ background: "var(--border-secondary)" }} /><span id="interest-pct">37% intérêts</span></div>
          </div>
        </div>
        {/* Comparateur scénario B */}
        <div id="compare-section" style={{ display: "none", marginTop: 16 }}>
          <div className="divider" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="results" style={{ position: "relative" }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "var(--green-text)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Scénario A (actuel)</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 4 }}>
                <span style={{ fontSize: 28, fontWeight: 500, letterSpacing: -0.5, color: "var(--text-primary)" }} id="compare-a-payment">--</span>
                <span style={{ fontSize: 12, color: "var(--text-tertiary)" }} id="compare-a-period">$ / mois</span>
              </div>
              <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginBottom: 8 }} id="compare-a-sub">--</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                <div className="result-box"><div className="result-box-val" id="compare-a-interest">--</div><div className="result-box-lbl">Intérêts</div></div>
                <div className="result-box"><div className="result-box-val" id="compare-a-total">--</div><div className="result-box-lbl">Total</div></div>
              </div>
            </div>
            <div className="results" style={{ position: "relative", borderColor: "var(--green)", borderWidth: "1px" }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "var(--green-text)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Scénario B</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
                <div>
                  <label style={{ fontSize: 11, color: "var(--text-tertiary)", display: "block", marginBottom: 3 }}>Taux (%)</label>
                  <input type="text" id="compare-b-rate" defaultValue="4.64" onInput={() => calcCompare()} style={{ width: "100%", fontSize: 13, padding: "6px 8px", borderRadius: 6, border: "0.5px solid var(--border-secondary)", background: "var(--bg-card)", color: "var(--text-primary)", outline: "none" }} />
                </div>
                <div>
                  <label style={{ fontSize: 11, color: "var(--text-tertiary)", display: "block", marginBottom: 3 }}>Amort. (ans)</label>
                  <input type="text" id="compare-b-amort" defaultValue="30" onInput={() => calcCompare()} style={{ width: "100%", fontSize: 13, padding: "6px 8px", borderRadius: 6, border: "0.5px solid var(--border-secondary)", background: "var(--bg-card)", color: "var(--text-primary)", outline: "none" }} />
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 4 }}>
                <span style={{ fontSize: 28, fontWeight: 500, letterSpacing: -0.5, color: "var(--text-primary)" }} id="compare-b-payment">--</span>
                <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>$ / mois</span>
              </div>
              <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginBottom: 8 }} id="compare-b-sub">--</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                <div className="result-box"><div className="result-box-val" id="compare-b-interest">--</div><div className="result-box-lbl">Intérêts</div></div>
                <div className="result-box"><div className="result-box-val" id="compare-b-total">--</div><div className="result-box-lbl">Total</div></div>
              </div>
            </div>
          </div>
          <div id="compare-diff" style={{ textAlign: "center", fontSize: 13, fontWeight: 500, color: "var(--green-text)", marginTop: 10, padding: "8px 12px", borderRadius: 8, background: "var(--green-light-bg)" }}>--</div>
        </div>
        <button
          id="compare-toggle"
          onClick={() => toggleCompare()}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, width: "100%", marginTop: 12, padding: "8px 0", borderRadius: 8, border: "0.5px solid var(--border-secondary)", background: "transparent", color: "var(--text-tertiary)", fontSize: 12, fontFamily: "inherit", cursor: "pointer", transition: "all 0.15s" }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth={1.5}><line x1="7" y1="1" x2="7" y2="13"/><rect x="1" y="3" width="5" height="8" rx="1"/><rect x="8" y="3" width="5" height="8" rx="1"/></svg>
          <span id="compare-toggle-label">Comparer avec un autre scénario</span>
        </button>
        <div style={{ marginTop: 16 }}>
          <ShareCalculation getData={() => ({
            prix: (document.getElementById("price") as HTMLInputElement)?.value ?? "",
            mise: (document.getElementById("down") as HTMLInputElement)?.value ?? "",
            taux: (document.getElementById("rate") as HTMLInputElement)?.value ?? "",
            amortissement: (document.getElementById("amort") as HTMLInputElement)?.value ?? "",
            frequence: freqKey,
            typeLogement: (document.getElementById("prop-type") as HTMLSelectElement)?.value ?? "",
          })} />
        </div>
        <div className="calc-footer">
          Les calculs sont à titre indicatif seulement. Consultez un courtier hypothécaire pour une estimation officielle.<br />
          Règles basées sur les directives OSFI et SCHL en vigueur au Canada.
        </div>
      </div>
    </>
  );
}

// ─── Calculator logic ──────────────────────────────────────────────────────────

let freqPerYear = 12;
let freqKey = "monthly";

const TYPES: Record<string, { minOccupant: number | null; minNonOccupant: number | null; plex: boolean; schl: boolean; progressive: boolean; note: string }> = {
  unifamilial: { minOccupant: null, minNonOccupant: null, plex: false, schl: true, progressive: true, note: "" },
  condo:       { minOccupant: null, minNonOccupant: null, plex: false, schl: true, progressive: true, note: "" },
  chalet:      { minOccupant: null, minNonOccupant: null, plex: false, schl: true, progressive: true, note: "Doit être habitable à année longue pour être éligible à la SCHL." },
  duplex:      { minOccupant: 5,    minNonOccupant: 20,   plex: true,  schl: true, progressive: true,  note: "" },
  triplex:     { minOccupant: 10,   minNonOccupant: 20,   plex: true,  schl: true, progressive: false, note: "" },
  quadruplex:  { minOccupant: 10,   minNonOccupant: 20,   plex: true,  schl: true, progressive: false, note: "" },
  cinqplex:    { minOccupant: 20,   minNonOccupant: 20,   plex: true,  schl: false, progressive: false, note: "5 logements et plus : financement commercial, SCHL non disponible." },
};

function raw(s: string): number { return parseFloat(String(s).replace(/\s/g, "").replace(",", ".")) || 0; }
function fmtCAD(n: number): string { return Math.round(n).toLocaleString("fr-CA") + " $"; }
function fmt(el: HTMLInputElement) { const v = el.value.replace(/\D/g, ""); if (v) el.value = parseInt(v).toLocaleString("fr-CA"); }
function isPlex(t: string) { return TYPES[t]?.plex ?? false; }
function isOccupant() { return (document.getElementById("occupant") as HTMLInputElement)?.checked ?? false; }

function onTypeChange() {
  const type = (document.getElementById("prop-type") as HTMLSelectElement).value;
  const row = document.getElementById("occupant-row")!;
  if (isPlex(type)) {
    row.classList.add("visible");
    const t = TYPES[type];
    document.getElementById("occupant-note")!.textContent = t.minOccupant + "% occupant · " + t.minNonOccupant + "% non-occupant";
  } else {
    row.classList.remove("visible");
  }
  calc();
}

function getMinDown(price: number, type: string, occupant: boolean): number {
  const t = TYPES[type];
  if (type === "cinqplex") return price * 0.20;
  if (t.plex && !occupant) return price * ((t.minNonOccupant ?? 20) / 100);
  if (t.plex && !t.progressive) return price * ((t.minOccupant ?? 10) / 100);
  if (price <= 500000) return price * 0.05;
  if (price < 1000000) return 25000 + (price - 500000) * 0.10;
  return price * 0.20;
}

function getSchl(type: string, occupant: boolean): boolean {
  if (type === "cinqplex") return false;
  if (TYPES[type]?.plex && !occupant) return false;
  return TYPES[type]?.schl ?? false;
}

function checkDown(price: number, down: number, type: string, occupant: boolean) {
  const min = getMinDown(price, type, occupant);
  const pct = price > 0 ? down / price * 100 : 0;
  const schl = getSchl(type, occupant);
  const t = TYPES[type];
  const wrap = document.getElementById("down-wrap")!;
  const alert = document.getElementById("down-alert")!;
  const alertText = document.getElementById("down-alert-text")!;
  alert.classList.remove("visible", "red", "amber", "green", "blue");
  wrap.classList.remove("warning", "caution");
  let msg = "", cls = "";
  if (type === "cinqplex") {
    if (down < min) { msg = "5 logements et plus : mise de fonds insuffisante. Le minimum est 20% (" + fmtCAD(min) + "). Il manque " + fmtCAD(min - down) + "."; cls = "red"; wrap.classList.add("warning"); }
    else { msg = "5 logements et plus : financement commercial uniquement. SCHL non disponible. Mise de fonds de " + Math.round(pct) + "%."; cls = "blue"; }
  } else if (t?.plex && !occupant) {
    if (down < min) { msg = "Non-occupant : 20% minimum requis (" + fmtCAD(min) + "). Il manque " + fmtCAD(min - down) + "."; cls = "red"; wrap.classList.add("warning"); }
    else { msg = "Non-occupant : mise de fonds de " + Math.round(pct) + "% — SCHL non disponible pour les immeubles non-occupants."; cls = "green"; }
  } else if (down < min) {
    const pctReq = Math.round(min / price * 100);
    msg = "Mise de fonds insuffisante. Le minimum requis est " + fmtCAD(min) + " (" + pctReq + "%). Il manque " + fmtCAD(min - down) + ".";
    if (t?.note) msg += " " + t.note;
    cls = "red"; wrap.classList.add("warning");
  } else if (pct < 20 && schl && price < 1500000) {
    msg = "Prime SCHL applicable (mise de fonds < 20%). Pour l'éviter : " + fmtCAD(price * 0.20) + ".";
    if (t?.note) msg += " " + t.note;
    cls = "amber"; wrap.classList.add("caution");
  } else {
    msg = "Mise de fonds de " + Math.round(pct) + "% — aucune prime SCHL requise.";
    if (t?.note) msg += " " + t.note;
    cls = "green";
  }
  if (msg) { alertText.textContent = msg; alert.classList.add("visible", cls); }
}

function selectRate(el: HTMLElement, rate: number) {
  document.querySelectorAll(".rate-pill").forEach((p) => p.classList.remove("active"));
  el.classList.add("active");
  (document.getElementById("rate") as HTMLInputElement).value = String(rate);
  calc();
}

function setFreq(el: HTMLElement, key: string, n: number) {
  document.querySelectorAll(".seg-opt").forEach((b) => b.classList.remove("active"));
  el.classList.add("active");
  freqPerYear = n; freqKey = key;
  const labels: Record<string, string> = { weekly: "$ / semaine", biweekly: "$ / 2 semaines", monthly: "$ / mois", accweekly: "$ / semaine (accéléré)" };
  document.getElementById("period-label")!.textContent = labels[key];
  calc();
}

function calc() {
  const price = raw((document.getElementById("price") as HTMLInputElement).value);
  const down = raw((document.getElementById("down") as HTMLInputElement).value);
  const annualRate = raw((document.getElementById("rate") as HTMLInputElement).value) / 100;
  const years = parseInt((document.getElementById("amort") as HTMLInputElement).value) || 25;
  const type = (document.getElementById("prop-type") as HTMLSelectElement).value;
  const occupant = isPlex(type) ? isOccupant() : true;
  const pct = price > 0 ? Math.round(down / price * 100) : 0;
  document.getElementById("down-pct")!.textContent = pct + "%";
  checkDown(price, down, type, occupant);
  let cmhc = 0;
  const schl = getSchl(type, occupant);
  if (schl && pct < 20 && pct >= 5 && price < 1500000) {
    const r = pct < 10 ? 0.031 : pct < 15 ? 0.028 : 0.024;
    cmhc = Math.max(0, price - down) * r;
  }
  const principal = Math.max(0, price - down) + cmhc;
  const eff = Math.pow(1 + annualRate / 2, 2) - 1;
  const r = Math.pow(1 + eff, 1 / freqPerYear) - 1;
  const n = years * freqPerYear;
  let payment = 0;
  if (r > 0 && n > 0 && principal > 0) payment = principal * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
  let display = payment;
  if (freqKey === "accweekly") {
    const mr = Math.pow(1 + eff, 1 / 12) - 1, mn = years * 12;
    display = principal * mr * Math.pow(1 + mr, mn) / (Math.pow(1 + mr, mn) - 1) / 2;
  }
  const totalPaid = freqKey === "accweekly" ? display * 52 * years : payment * n;
  const totalInterest = Math.max(0, totalPaid - principal);
  const ppct = totalPaid > 0 ? Math.round(principal / totalPaid * 100) : 0;
  document.getElementById("payment")!.textContent = Math.round(display).toLocaleString("fr-CA");
  document.getElementById("result-sub")!.textContent = "Hypothèque de " + fmtCAD(Math.max(0, price - down)) + " sur " + years + " ans à " + (document.getElementById("rate") as HTMLInputElement).value + "%";
  document.getElementById("total-interest")!.textContent = fmtCAD(totalInterest);
  document.getElementById("total-paid")!.textContent = fmtCAD(totalPaid);
  document.getElementById("cmhc")!.textContent = cmhc > 0 ? fmtCAD(cmhc) : "0 $";
  const bar = document.getElementById("principal-bar") as HTMLElement;
  if (bar) bar.style.width = ppct + "%";
  document.getElementById("principal-pct")!.textContent = ppct + "% capital";
  document.getElementById("interest-pct")!.textContent = (100 - ppct) + "% intérêts";
  if (compareOpen) calcCompare();
}

// ─── Compare scenarios ────────────────────────────────────────────────────────

let compareOpen = false;

function toggleCompare() {
  compareOpen = !compareOpen;
  const section = document.getElementById("compare-section")!;
  const label = document.getElementById("compare-toggle-label")!;
  section.style.display = compareOpen ? "block" : "none";
  label.textContent = compareOpen ? "Masquer la comparaison" : "Comparer avec un autre scénario";
  if (compareOpen) calcCompare();
}

function calcCompare() {
  const price = raw((document.getElementById("price") as HTMLInputElement).value);
  const down = raw((document.getElementById("down") as HTMLInputElement).value);
  const type = (document.getElementById("prop-type") as HTMLSelectElement).value;
  const occupant = isPlex(type) ? isOccupant() : true;
  const rateA = raw((document.getElementById("rate") as HTMLInputElement).value) / 100;
  const yearsA = parseInt((document.getElementById("amort") as HTMLInputElement).value) || 25;
  const rateB = raw((document.getElementById("compare-b-rate") as HTMLInputElement).value) / 100;
  const yearsB = parseInt((document.getElementById("compare-b-amort") as HTMLInputElement).value) || 30;

  let cmhc = 0;
  const pct = price > 0 ? down / price * 100 : 0;
  const schl = getSchl(type, occupant);
  if (schl && pct < 20 && pct >= 5 && price < 1500000) {
    const r = pct < 10 ? 0.031 : pct < 15 ? 0.028 : 0.024;
    cmhc = Math.max(0, price - down) * r;
  }
  const principal = Math.max(0, price - down) + cmhc;

  function calcScenario(annualRate: number, years: number) {
    const eff = Math.pow(1 + annualRate / 2, 2) - 1;
    const r = Math.pow(1 + eff, 1 / 12) - 1;
    const n = years * 12;
    let payment = 0;
    if (r > 0 && n > 0 && principal > 0) payment = principal * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    const totalPaid = payment * n;
    const totalInterest = Math.max(0, totalPaid - principal);
    return { payment: Math.round(payment), totalPaid, totalInterest };
  }

  const a = calcScenario(rateA, yearsA);
  const b = calcScenario(rateB, yearsB);

  document.getElementById("compare-a-payment")!.textContent = a.payment.toLocaleString("fr-CA");
  document.getElementById("compare-a-sub")!.textContent = `${(rateA * 100).toFixed(2)}% sur ${yearsA} ans`;
  document.getElementById("compare-a-interest")!.textContent = fmtCAD(a.totalInterest);
  document.getElementById("compare-a-total")!.textContent = fmtCAD(a.totalPaid);

  document.getElementById("compare-b-payment")!.textContent = b.payment.toLocaleString("fr-CA");
  document.getElementById("compare-b-sub")!.textContent = `${(rateB * 100).toFixed(2)}% sur ${yearsB} ans`;
  document.getElementById("compare-b-interest")!.textContent = fmtCAD(b.totalInterest);
  document.getElementById("compare-b-total")!.textContent = fmtCAD(b.totalPaid);

  const diff = a.payment - b.payment;
  const diffInterest = a.totalInterest - b.totalInterest;
  const diffEl = document.getElementById("compare-diff")!;
  if (diff === 0) {
    diffEl.textContent = "Les deux scénarios sont identiques";
  } else {
    const cheaper = diff > 0 ? "B" : "A";
    diffEl.textContent = `Scénario ${cheaper} : ${fmtCAD(Math.abs(diff))}/mois de moins, ${fmtCAD(Math.abs(diffInterest))} d'intérêts ${diffInterest > 0 ? "en moins" : "de plus"}`;
  }
}

// ─── CSS ───────────────────────────────────────────────────────────────────────

const css = `
.calc { max-width: 680px; }
.calc-sub { font-size: 13px; color: var(--text-tertiary); margin-bottom: 20px; }
.rates-bar { display: flex; align-items: center; gap: 8px; padding: 10px 14px; border-radius: 8px; background: var(--bg-secondary); border: 0.5px solid var(--border); margin-bottom: 20px; flex-wrap: wrap; }
.rates-label { font-size: 12px; color: var(--text-tertiary); flex-shrink: 0; }
.rate-pill { font-size: 12px; padding: 3px 10px; border-radius: 20px; border: 0.5px solid var(--border-secondary); cursor: pointer; background: transparent; color: var(--text-tertiary); transition: all 0.15s; user-select: none; }
.rate-pill:hover { background: var(--bg-card); }
.rate-pill.active { background: var(--green-light-bg); color: var(--green-text); border-color: transparent; font-weight: 500; }
.rate-source { font-size: 11px; color: var(--text-tertiary); margin-left: auto; opacity: 0.7; }
.calc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }
.field { display: flex; flex-direction: column; gap: 6px; }
.field.full { grid-column: 1 / -1; }
.field > label { font-size: 12px; font-weight: 500; color: var(--text-tertiary); }
.field-input { display: flex; align-items: center; border: 0.5px solid var(--border-secondary); border-radius: 8px; background: var(--bg-card); overflow: hidden; transition: border-color 0.15s; }
.field-input:focus-within { border-color: var(--green); }
.field-input.warning { border-color: var(--red-text); }
.field-input.caution { border-color: var(--amber-text); }
.field-input input, .field-input select { flex: 1; font-size: 14px; padding: 10px 12px; border: none; background: transparent; color: var(--text-primary); font-family: inherit; outline: none; min-width: 0; }
.field-input .unit { font-size: 12px; padding: 0 10px; color: var(--text-tertiary); border-left: 0.5px solid var(--border); height: 100%; display: flex; align-items: center; background: var(--bg-secondary); white-space: nowrap; flex-shrink: 0; }
.occupant-row { display: none; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 8px; background: var(--bg-secondary); border: 0.5px solid var(--border); margin-top: 2px; }
.occupant-row.visible { display: flex; }
.occupant-row label { font-size: 13px; color: var(--text-primary); cursor: pointer; display: flex; align-items: center; gap: 8px; margin: 0; flex: 1; }
.occupant-row input[type=checkbox] { width: 16px; height: 16px; accent-color: var(--green); cursor: pointer; flex-shrink: 0; }
.occupant-note { font-size: 11px; color: var(--text-tertiary); flex-shrink: 0; }
.alert { display: none; align-items: flex-start; gap: 8px; padding: 8px 11px; border-radius: 8px; font-size: 12px; line-height: 1.55; margin-top: 6px; }
.alert.visible { display: flex; }
.alert svg { stroke-width: 1.5; }
.alert.red { background: var(--red-bg); color: var(--red-text); }
.alert.red svg { stroke: var(--red-text); fill: none; }
.alert.amber { background: var(--amber-bg); color: var(--amber-text); }
.alert.amber svg { stroke: var(--amber-text); fill: none; }
.alert.green { background: var(--green-light-bg); color: var(--green-text); }
.alert.green svg { stroke: var(--green-text); fill: none; }
.alert.blue { background: var(--blue-bg); color: var(--blue-text); }
.alert.blue svg { stroke: var(--blue-text); fill: none; }
.seg-control { display: flex; border: 0.5px solid var(--border-secondary); border-radius: 8px; overflow: hidden; }
.seg-opt { flex: 1; padding: 9px 6px; font-size: 12px; text-align: center; cursor: pointer; border: none; background: transparent; color: var(--text-tertiary); transition: all 0.15s; font-family: inherit; }
.seg-opt.active { background: var(--green); color: #fff; font-weight: 500; }
.seg-opt:hover:not(.active) { background: var(--bg-secondary); }
.divider { height: 0.5px; background: var(--border); margin: 16px 0; }
.results { background: var(--bg-secondary); border-radius: 12px; padding: 18px 20px; margin-bottom: 16px; }
.result-main { display: flex; align-items: baseline; gap: 4px; margin-bottom: 4px; }
.result-amount { font-size: 36px; font-weight: 500; letter-spacing: -1px; color: var(--text-primary); }
.result-period { font-size: 14px; color: var(--text-tertiary); }
.result-sub { font-size: 12px; color: var(--text-tertiary); margin-bottom: 16px; }
.result-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.result-box { background: var(--bg-card); border-radius: 8px; padding: 10px 12px; border: 0.5px solid var(--border); }
.result-box-val { font-size: 15px; font-weight: 500; margin-bottom: 2px; color: var(--text-primary); }
.result-box-lbl { font-size: 11px; color: var(--text-tertiary); }
.breakdown-bar { height: 8px; border-radius: 4px; background: var(--border-secondary); overflow: hidden; margin: 12px 0 6px; }
.breakdown-fill { height: 100%; background: var(--green); border-radius: 4px; transition: width 0.4s; }
.breakdown-legend { display: flex; gap: 16px; }
.legend-item { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--text-tertiary); }
.legend-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.calc-footer { font-size: 11px; color: var(--text-tertiary); line-height: 1.6; text-align: center; margin-top: 16px; opacity: 0.8; }
@media (max-width: 640px) {
  .calc-grid { grid-template-columns: 1fr !important; }
  .result-grid { grid-template-columns: 1fr !important; }
  .field.full { grid-column: auto; }
  .rate-row { flex-wrap: wrap; gap: 6px; }
  #compare-section > div:first-child { grid-template-columns: 1fr !important; }
}
`;
