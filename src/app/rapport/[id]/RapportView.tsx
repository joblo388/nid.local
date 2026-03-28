"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";

type Report = {
  id: string;
  type: string;
  titre: string;
  donnees: Record<string, unknown>;
  resultats: Record<string, unknown>;
  creeLe: string;
};

const TYPE_INFO: Record<string, { label: string; href: string; color: string; bg: string }> = {
  hypothecaire: { label: "Calculatrice hypothécaire", href: "/calculatrice-hypothecaire", color: "var(--blue-text)", bg: "var(--blue-bg)" },
  plex: { label: "Calculateur plex", href: "/calculateur-plex", color: "var(--green-text)", bg: "var(--green-light-bg)" },
  acheter_louer: { label: "Acheter ou louer", href: "/acheter-ou-louer", color: "var(--amber-text)", bg: "var(--amber-bg)" },
  capacite_emprunt: { label: "Capacité d'emprunt", href: "/capacite-emprunt", color: "var(--blue-text)", bg: "var(--blue-bg)" },
};

const LABELS: Record<string, string> = {
  prix: "Prix", mise: "Mise de fonds", taux: "Taux", amort: "Amortissement",
  l1: "Loyer unité 1", l2: "Loyer unité 2", l3: "Loyer unité 3", l4: "Loyer unité 4",
  taxes: "Taxes", assur: "Assurances", entret: "Entretien", autres: "Autres",
  loyer: "Loyer mensuel", hausse: "Hausse annuelle", assurLoc: "Assurances locataire",
  rendEp: "Rendement épargne", appre: "Appréciation", horizon: "Horizon",
  rev1: "Revenu brut", rev2: "Co-emprunteur", revLoc: "Revenu locatif",
  pctLoc: "% locatif inclus", detteAuto: "Voiture", detteEtud: "Prêt étudiant",
  detteCC: "Carte crédit", detteAutres: "Autres dettes", tauxQual: "Taux qualification",
  taxesEst: "Taxes estimées",
  mrb: "MRB", cashflowMensuel: "Cashflow mensuel", rendement: "Rendement mise de fonds",
  valeur5ans: "Valeur an 5", netAchat: "Coût net achat", netLouer: "Coût net location",
  ecart: "Écart", gagnant: "Gagnant", prixMax: "Prix maximum",
  hypothequeMax: "Hypothèque max", paiementMensuel: "Paiement mensuel",
  gds: "Ratio GDS", tds: "Ratio TDS", paiement: "Paiement", totalPaye: "Total payé",
  mise_de_fonds: "Mise de fonds", type_propriete: "Type de propriété",
  amortissement: "Amortissement", interetsTotaux: "Intérêts totaux",
  totalDebourse: "Total déboursé", primeSCHL: "Prime SCHL",
};

const PCT_KEYS = new Set(["taux", "tauxQual", "rendEp", "rendement", "hausse", "appre", "gds", "tds", "pctLoc"]);
const DOLLAR_KEYS = new Set(["cashflowMensuel", "paiementMensuel", "paiement"]);

function formatValue(key: string, val: unknown): string {
  if (val === null || val === undefined || val === "") return "—";
  // If the value already contains $ or %, return as-is
  const s = String(val);
  if (s.includes("$") || s.includes("/ mois")) return s;
  const n = typeof val === "number" ? val : parseFloat(s.replace(/\s/g, ""));
  if (PCT_KEYS.has(key)) return isNaN(n) ? s : `${n}%`;
  if (key === "amort" || key === "amortissement" || key === "horizon") return `${val} ans`;
  if (key === "mrb") return `${val}×`;
  if (key === "gagnant") return val === "acheter" ? "Acheter" : "Louer";
  if (DOLLAR_KEYS.has(key)) return `${Math.round(n).toLocaleString("fr-CA")} $`;
  if (!isNaN(n) && n > 100) return `${Math.round(n).toLocaleString("fr-CA")} $`;
  return s;
}

export function RapportView() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const printRef = useRef<HTMLDivElement>(null);

  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetch(`/api/saved-reports/${id}`)
      .then((r) => r.json())
      .then((data) => { if (!data.error) setReport(data); })
      .finally(() => setLoading(false));
  }, [id]);

  function handlePrint() {
    window.print();
  }

  function handleCSV() {
    if (!report) return;
    const rows: string[][] = [["Rapport nid.local", report.titre], ["Type", TYPE_INFO[report.type]?.label ?? report.type], ["Date", new Date(report.creeLe).toLocaleDateString("fr-CA")], [""], ["DONNÉES", ""], ];
    for (const [k, v] of Object.entries(report.donnees)) {
      rows.push([LABELS[k] ?? k, formatValue(k, v)]);
    }
    rows.push([""], ["RÉSULTATS", ""]);
    for (const [k, v] of Object.entries(report.resultats)) {
      rows.push([LABELS[k] ?? k, formatValue(k, v)]);
    }
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rapport-nidlocal-${report.type}-${id.slice(0, 8)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleDelete() {
    setDeleting(true);
    await fetch(`/api/saved-reports/${id}`, { method: "DELETE" });
    router.push(`/u/${encodeURIComponent("me")}`);
    router.refresh();
  }

  if (loading) {
    return <><Header /><div className="max-w-[700px] mx-auto px-4 py-20 text-center" style={{ color: "var(--text-tertiary)", fontSize: 13 }}>Chargement…</div></>;
  }

  if (!report) {
    return <><Header /><div className="max-w-[700px] mx-auto px-4 py-20 text-center"><div style={{ fontSize: 18, fontWeight: 500, marginBottom: 8 }}>Rapport introuvable</div><Link href="/" style={{ color: "var(--green)", fontSize: 13 }}>Retour au forum</Link></div></>;
  }

  const info = TYPE_INFO[report.type] ?? { label: report.type, href: "#", color: "var(--text-tertiary)", bg: "var(--bg-secondary)" };
  const donneesEntries = Object.entries(report.donnees).filter(([, v]) => v !== "" && v !== null && v !== undefined);
  const resultatsEntries = Object.entries(report.resultats);

  return (
    <>
      <style>{`@media print { .no-print { display: none !important; } body { background: white !important; color: black !important; } }`}</style>
      <div className="no-print"><Header /></div>
      <div className="max-w-[700px] mx-auto px-4 pb-10" style={{ paddingTop: 24 }}>
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-[12px] mb-5 no-print" style={{ color: "var(--text-tertiary)" }}>
          <Link href="/" className="transition-opacity hover:opacity-70" style={{ color: "var(--text-tertiary)" }}>nid.local</Link>
          <span>/</span>
          <span style={{ color: "var(--text-secondary)" }}>Rapport</span>
        </nav>

        <div ref={printRef}>
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-md" style={{ background: info.bg, color: info.color }}>{info.label}</span>
                <span className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
                  {new Date(report.creeLe).toLocaleDateString("fr-CA", { day: "numeric", month: "long", year: "numeric" })}
                </span>
              </div>
              <h1 className="text-[20px] font-bold" style={{ color: "var(--text-primary)" }}>{report.titre}</h1>
            </div>
          </div>

          {/* Résultats — en évidence */}
          <div className="rounded-xl p-5 mb-5" style={{ background: info.bg, border: `0.5px solid var(--border)` }}>
            <h2 className="text-[11px] font-semibold uppercase tracking-wider mb-3" style={{ color: info.color }}>Résultats</h2>
            <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))" }}>
              {resultatsEntries.map(([k, v]) => (
                <div key={k}>
                  <div className="text-[11px] mb-0.5" style={{ color: info.color, opacity: 0.7 }}>{LABELS[k] ?? k}</div>
                  <div className="text-[16px] font-medium" style={{ color: info.color }}>{formatValue(k, v)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Données d'entrée */}
          <div className="rounded-xl p-5 mb-5" style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}>
            <h2 className="text-[11px] font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-tertiary)" }}>Données d&apos;entrée</h2>
            <div className="grid gap-x-8 gap-y-2 grid-cols-1 md:grid-cols-2">
              {donneesEntries.map(([k, v]) => (
                <div key={k} className="flex justify-between py-1.5" style={{ borderBottom: "0.5px solid var(--border)" }}>
                  <span className="text-[13px]" style={{ color: "var(--text-tertiary)" }}>{LABELS[k] ?? k}</span>
                  <span className="text-[13px] font-medium" style={{ color: "var(--text-primary)" }}>{formatValue(k, v)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="text-[11px] text-center mb-5" style={{ color: "var(--text-tertiary)", lineHeight: 1.6 }}>
            Rapport généré par nid.local — À titre indicatif seulement. Consultez un professionnel avant toute décision.
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 flex-wrap no-print">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-[13px] font-medium transition-opacity hover:opacity-80"
            style={{ background: "var(--green)", color: "white", border: "none", cursor: "pointer", fontFamily: "inherit" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" /><rect x="6" y="14" width="12" height="8" /></svg>
            Imprimer / PDF
          </button>
          <button
            onClick={handleCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-[13px] font-medium transition-opacity hover:opacity-80"
            style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)", border: "0.5px solid var(--border)", cursor: "pointer", fontFamily: "inherit" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
            Télécharger CSV
          </button>
          <Link
            href={info.href}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-[13px] font-medium transition-opacity hover:opacity-80"
            style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)", border: "0.5px solid var(--border)" }}
          >
            Recalculer →
          </Link>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-[13px] font-medium transition-opacity hover:opacity-80 ml-auto"
            style={{ background: "transparent", color: "var(--red-text)", border: "none", cursor: "pointer", fontFamily: "inherit" }}
          >
            {deleting ? "Suppression…" : "Supprimer"}
          </button>
        </div>
      </div>
    </>
  );
}
