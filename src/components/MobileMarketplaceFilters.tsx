"use client";

import { useState, useRef, useEffect } from "react";
import { villes } from "@/lib/data";

/* ─── Types ─────────────────────────────────────────────────────── */

type Filters = {
  mode: string;
  type: string;
  villeSlug: string;
  quartierSlug: string;
  prixMin: string;
  prixMax: string;
  chambresMin: string;
  sallesBainMin: string;
  superficieMin: string;
  anneeMin: string;
  anneeMax: string;
  chauffage: string;
  extras: string[];
  sousSol: string;
  search: string;
  tri: string;
};

type Props = {
  filters: Filters;
  setFilters: (fn: (f: Filters) => Filters) => void;
  total: number;
  activeCount: number;
};

/* ─── Constants ─────────────────────────────────────────────────── */

const VILLE_LABELS: Record<string, string> = {};
villes.forEach((v) => { VILLE_LABELS[v.slug] = v.nom; });

const ALL_TYPES = [
  { value: "unifamiliale", label: "Unifamiliale" },
  { value: "condo", label: "Condo" },
  { value: "duplex", label: "Duplex" },
  { value: "triplex", label: "Triplex" },
  { value: "quadruplex", label: "Quadruplex" },
  { value: "5plex", label: "5-plex" },
  { value: "maison_de_ville", label: "Maison de ville" },
  { value: "terrain", label: "Terrain" },
  { value: "chalet", label: "Chalet" },
  { value: "commercial", label: "Commercial" },
  { value: "autre", label: "Autre" },
];

const EXTRAS_OPTIONS = [
  { value: "garage", label: "Garage" },
  { value: "piscine", label: "Piscine" },
  { value: "sous-sol-fini", label: "Sous-sol fini" },
  { value: "foyer", label: "Foyer" },
  { value: "borne-ve", label: "Borne VE" },
];

const CHAMBRES_OPTS = ["1", "2", "3", "4", "5"];
const SDB_OPTS = ["1", "2", "3"];

/* ─── Helpers ───────────────────────────────────────────────────── */

function fmtVal(v: number): string {
  if (v >= 1_000_000) return (v / 1_000_000).toFixed(v % 1_000_000 === 0 ? 0 : 1) + " M$";
  if (v >= 1_000) return Math.round(v / 1_000) + " k$";
  return v + " $";
}

/* ─── Drawer shell ──────────────────────────────────────────────── */

function Drawer({
  open,
  onClose,
  title,
  fullHeight,
  footer,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  fullHeight?: boolean;
  footer?: React.ReactNode;
  children: React.ReactNode;
}) {
  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          onClick={onClose}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
            zIndex: 199, transition: "opacity 0.25s",
          }}
        />
      )}
      {/* Sheet */}
      <div
        style={{
          position: "fixed", bottom: 0, left: 0, right: 0,
          background: "var(--bg-card)",
          borderRadius: "20px 20px 0 0",
          borderTop: "0.5px solid var(--border)",
          zIndex: 200,
          transform: open ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.25s cubic-bezier(.4,0,.2,1)",
          maxHeight: fullHeight ? "92vh" : "85vh",
          display: "flex", flexDirection: "column",
        }}
      >
        {/* Handle */}
        <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 4px" }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: "var(--text-tertiary)", opacity: 0.3 }} />
        </div>
        {/* Header */}
        <div style={{ padding: "4px 20px 12px", fontSize: 16, fontWeight: 600 }}>
          {title}
        </div>
        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "0 20px", WebkitOverflowScrolling: "touch" }}>
          {children}
        </div>
        {/* Footer */}
        {footer && (
          <div style={{
            padding: "12px 20px", paddingBottom: "calc(12px + env(safe-area-inset-bottom, 0px))",
            borderTop: "0.5px solid var(--border)",
            display: "flex", alignItems: "center", gap: 10,
          }}>
            {footer}
          </div>
        )}
      </div>
    </>
  );
}

/* ─── Main component ────────────────────────────────────────────── */

export function MobileMarketplaceFilters({ filters, setFilters, total, activeCount }: Props) {
  const [openDrawer, setOpenDrawer] = useState<"ville" | "chambres" | "prix" | "all" | null>(null);

  // Local draft state for drawers (applied on "Appliquer")
  const [draftVille, setDraftVille] = useState(filters.villeSlug);
  const [draftChambres, setDraftChambres] = useState(filters.chambresMin);
  const [draftSdb, setDraftSdb] = useState(filters.sallesBainMin);
  const [draftPrixMin, setDraftPrixMin] = useState(filters.prixMin);
  const [draftPrixMax, setDraftPrixMax] = useState(filters.prixMax);
  const [villeSearch, setVilleSearch] = useState("");

  // All-filters drawer local drafts
  const [draftType, setDraftType] = useState(filters.type);
  const [draftAnneeMin, setDraftAnneeMin] = useState(filters.anneeMin);
  const [draftAnneeMax, setDraftAnneeMax] = useState(filters.anneeMax);
  const [draftExtras, setDraftExtras] = useState<string[]>([...filters.extras]);
  const [draftSuperficieMin, setDraftSuperficieMin] = useState(filters.superficieMin);

  const pillsRef = useRef<HTMLDivElement>(null);

  // Sync drafts when filters change externally
  useEffect(() => {
    setDraftVille(filters.villeSlug);
    setDraftChambres(filters.chambresMin);
    setDraftSdb(filters.sallesBainMin);
    setDraftPrixMin(filters.prixMin);
    setDraftPrixMax(filters.prixMax);
    setDraftType(filters.type);
    setDraftAnneeMin(filters.anneeMin);
    setDraftAnneeMax(filters.anneeMax);
    setDraftExtras([...filters.extras]);
    setDraftSuperficieMin(filters.superficieMin);
  }, [filters]);

  // Open a drawer and sync draft
  function openVille() { setDraftVille(filters.villeSlug); setVilleSearch(""); setOpenDrawer("ville"); }
  function openChambres() { setDraftChambres(filters.chambresMin); setDraftSdb(filters.sallesBainMin); setOpenDrawer("chambres"); }
  function openPrix() { setDraftPrixMin(filters.prixMin); setDraftPrixMax(filters.prixMax); setOpenDrawer("prix"); }
  function openAll() {
    setDraftType(filters.type);
    setDraftAnneeMin(filters.anneeMin);
    setDraftAnneeMax(filters.anneeMax);
    setDraftExtras([...filters.extras]);
    setDraftSuperficieMin(filters.superficieMin);
    setOpenDrawer("all");
  }

  function close() { setOpenDrawer(null); }

  // Apply handlers
  function applyVille() { setFilters((f) => ({ ...f, villeSlug: draftVille })); close(); }
  function applyChambres() { setFilters((f) => ({ ...f, chambresMin: draftChambres, sallesBainMin: draftSdb })); close(); }
  function applyPrix() { setFilters((f) => ({ ...f, prixMin: draftPrixMin, prixMax: draftPrixMax })); close(); }
  function applyAll() {
    setFilters((f) => ({
      ...f,
      type: draftType,
      anneeMin: draftAnneeMin,
      anneeMax: draftAnneeMax,
      extras: draftExtras,
      superficieMin: draftSuperficieMin,
    }));
    close();
  }

  function toggleDraftExtra(val: string) {
    setDraftExtras((prev) => prev.includes(val) ? prev.filter((x) => x !== val) : [...prev, val]);
  }

  // Pill style
  function pillStyle(isActive: boolean): React.CSSProperties {
    return {
      fontSize: 12, padding: "6px 12px", borderRadius: 9999, cursor: "pointer",
      fontFamily: "inherit", fontWeight: 500, whiteSpace: "nowrap", transition: "all 0.15s",
      background: isActive ? "var(--green-light-bg)" : "var(--bg-secondary)",
      color: isActive ? "var(--green-text)" : "var(--text-secondary)",
      border: isActive ? "0.5px solid var(--green)" : "0.5px solid transparent",
    };
  }

  // Tab style (row 1)
  function tabStyle(isActive: boolean): React.CSSProperties {
    return {
      fontSize: 12, padding: "5px 10px", borderRadius: 9999, border: "none", cursor: "pointer",
      fontFamily: "inherit", fontWeight: 500, transition: "all 0.15s",
      background: isActive ? "var(--bg-card)" : "transparent",
      color: isActive ? "var(--text-primary)" : "var(--text-tertiary)",
      boxShadow: isActive ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
    };
  }

  // Ville pill label
  const villeLabel = filters.villeSlug ? (VILLE_LABELS[filters.villeSlug] ?? filters.villeSlug) : "Ville";
  const chambresLabel = filters.chambresMin ? `${filters.chambresMin}+ ch.` : "Chambres";
  const prixLabel = (filters.prixMin || filters.prixMax)
    ? `${filters.prixMin ? fmtVal(parseInt(filters.prixMin)) : "0 $"} - ${filters.prixMax ? fmtVal(parseInt(filters.prixMax)) : "Illimite"}`
    : "Prix";

  const filteredVilles = villeSearch
    ? villes.filter((v) => v.nom.toLowerCase().includes(villeSearch.toLowerCase()))
    : villes;

  return (
    <div className="md:hidden" style={{ marginBottom: 12 }}>

      {/* ═══ Row 1: Transaction + Type tabs ═══ */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
        {/* Mode tabs */}
        <div style={{
          display: "inline-flex", borderRadius: 9999, background: "var(--bg-secondary)",
          padding: 3, gap: 2,
        }}>
          {[
            { value: "", label: "Toutes" },
            { value: "vente", label: "Acheter" },
            { value: "location", label: "Louer" },
          ].map((m) => (
            <button
              key={m.value}
              onClick={() => setFilters((f) => ({ ...f, mode: m.value }))}
              style={tabStyle(filters.mode === m.value)}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Vertical divider */}
        <div style={{ width: 1, height: 20, background: "var(--border)", flexShrink: 0 }} />

        {/* Quick type tabs */}
        <div style={{
          display: "inline-flex", borderRadius: 9999, background: "var(--bg-secondary)",
          padding: 3, gap: 2,
        }}>
          {[
            { value: "", label: "Tous types" },
            { value: "duplex", label: "Plex" },
            { value: "terrain", label: "Terrain" },
            { value: "chalet", label: "Chalet" },
          ].map((t) => (
            <button
              key={t.value}
              onClick={() => setFilters((f) => ({ ...f, type: t.value }))}
              style={tabStyle(filters.type === t.value)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ═══ Row 2: Filter pills with horizontal scroll ═══ */}
      <div style={{ position: "relative", overflow: "hidden", marginBottom: 8 }}>
        <div
          ref={pillsRef}
          style={{
            display: "flex", gap: 8, overflowX: "auto", WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none", paddingRight: 24, paddingBottom: 2,
          }}
          className="mobile-filter-pills-scroll"
        >
          <button onClick={openVille} style={pillStyle(!!filters.villeSlug)}>{villeLabel}</button>
          <button onClick={openChambres} style={pillStyle(!!filters.chambresMin || !!filters.sallesBainMin)}>{chambresLabel}</button>
          <button onClick={openPrix} style={pillStyle(!!filters.prixMin || !!filters.prixMax)}>{prixLabel}</button>
        </div>
        {/* Fade gradient on right */}
        <div style={{
          position: "absolute", right: 0, top: 0, bottom: 0, width: 40,
          background: "linear-gradient(to right, transparent, var(--bg-page))",
          pointerEvents: "none",
        }} />
      </div>

      {/* ═══ Row 3: "Tous les filtres" button + results count ═══ */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
        <button
          onClick={openAll}
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            fontSize: 12, fontWeight: 500, padding: "7px 14px", borderRadius: 9999,
            border: activeCount > 0 ? "0.5px solid var(--green)" : "0.5px solid var(--border-secondary)",
            background: activeCount > 0 ? "var(--green-light-bg)" : "var(--bg-card)",
            color: activeCount > 0 ? "var(--green-text)" : "var(--text-secondary)",
            cursor: "pointer", fontFamily: "inherit",
          }}
        >
          {/* Sliders icon */}
          <svg style={{ width: 14, height: 14, stroke: "currentColor", fill: "none", strokeWidth: 1.5 }} viewBox="0 0 24 24">
            <line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="18" x2="20" y2="18" />
            <circle cx="8" cy="6" r="2" /><circle cx="16" cy="12" r="2" /><circle cx="10" cy="18" r="2" />
          </svg>
          Tous les filtres
          {activeCount > 0 && (
            <span style={{
              fontSize: 10, fontWeight: 600, minWidth: 18, height: 18,
              borderRadius: 9999, background: "var(--green)", color: "#fff",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
            }}>
              {activeCount}
            </span>
          )}
        </button>
        <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>
          {total} annonce{total !== 1 ? "s" : ""}
        </span>
      </div>

      {/* ═══════════════════ DRAWERS ═══════════════════ */}

      {/* ── Ville drawer ── */}
      <Drawer
        open={openDrawer === "ville"}
        onClose={close}
        title="Ville"
        footer={
          <>
            <button
              onClick={() => { setDraftVille(""); }}
              style={{
                flex: 1, fontSize: 13, padding: "10px 0", borderRadius: 9999,
                border: "0.5px solid var(--border-secondary)", background: "transparent",
                color: "var(--text-tertiary)", cursor: "pointer", fontFamily: "inherit",
              }}
            >
              Reinitialiser
            </button>
            <button
              onClick={applyVille}
              style={{
                flex: 1, fontSize: 13, fontWeight: 600, padding: "10px 0", borderRadius: 9999,
                background: "var(--green)", color: "#fff", border: "none",
                cursor: "pointer", fontFamily: "inherit",
              }}
            >
              Appliquer
            </button>
          </>
        }
      >
        {/* Search input */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          borderRadius: 10, border: "0.5px solid var(--border-secondary)", background: "var(--bg-page)",
          padding: "0 12px", marginBottom: 12,
        }}>
          <svg style={{ width: 14, height: 14, stroke: "var(--text-tertiary)", fill: "none", strokeWidth: 2, flexShrink: 0 }} viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="7" /><line x1="16.5" y1="16.5" x2="21" y2="21" />
          </svg>
          <input
            type="text"
            placeholder="Rechercher une ville..."
            value={villeSearch}
            onChange={(e) => setVilleSearch(e.target.value)}
            style={{
              flex: 1, padding: "10px 0", fontSize: 13, border: "none", background: "transparent",
              color: "var(--text-primary)", fontFamily: "inherit", outline: "none",
            }}
          />
        </div>
        {/* Ville list */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {/* "Toutes les villes" option */}
          <button
            onClick={() => setDraftVille("")}
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "12px 4px", fontSize: 14, border: "none", borderBottom: "0.5px solid var(--border)",
              background: "transparent", color: draftVille === "" ? "var(--green-text)" : "var(--text-primary)",
              cursor: "pointer", fontFamily: "inherit", fontWeight: draftVille === "" ? 600 : 400,
              textAlign: "left",
            }}
          >
            Toutes les villes
            {draftVille === "" && (
              <svg style={{ width: 16, height: 16, stroke: "var(--green)", fill: "none", strokeWidth: 2 }} viewBox="0 0 24 24">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </button>
          {filteredVilles.map((v) => (
            <button
              key={v.slug}
              onClick={() => setDraftVille(v.slug)}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "12px 4px", fontSize: 14, border: "none", borderBottom: "0.5px solid var(--border)",
                background: "transparent",
                color: draftVille === v.slug ? "var(--green-text)" : "var(--text-primary)",
                cursor: "pointer", fontFamily: "inherit",
                fontWeight: draftVille === v.slug ? 600 : 400,
                textAlign: "left",
              }}
            >
              {v.nom}
              {draftVille === v.slug && (
                <svg style={{ width: 16, height: 16, stroke: "var(--green)", fill: "none", strokeWidth: 2 }} viewBox="0 0 24 24">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </Drawer>

      {/* ── Chambres drawer ── */}
      <Drawer
        open={openDrawer === "chambres"}
        onClose={close}
        title="Chambres et salles de bain"
        footer={
          <>
            <button
              onClick={() => { setDraftChambres(""); setDraftSdb(""); }}
              style={{
                flex: 1, fontSize: 13, padding: "10px 0", borderRadius: 9999,
                border: "0.5px solid var(--border-secondary)", background: "transparent",
                color: "var(--text-tertiary)", cursor: "pointer", fontFamily: "inherit",
              }}
            >
              Reinitialiser
            </button>
            <button
              onClick={applyChambres}
              style={{
                flex: 1, fontSize: 13, fontWeight: 600, padding: "10px 0", borderRadius: 9999,
                background: "var(--green)", color: "#fff", border: "none",
                cursor: "pointer", fontFamily: "inherit",
              }}
            >
              Appliquer
            </button>
          </>
        }
      >
        {/* Chambres */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 10 }}>
            Chambres
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {CHAMBRES_OPTS.map((c) => (
              <button
                key={c}
                onClick={() => setDraftChambres(draftChambres === c ? "" : c)}
                style={pillStyle(draftChambres === c)}
              >
                {c}+
              </button>
            ))}
          </div>
        </div>
        {/* Salles de bain */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 10 }}>
            Salles de bain
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {SDB_OPTS.map((s) => (
              <button
                key={s}
                onClick={() => setDraftSdb(draftSdb === s ? "" : s)}
                style={pillStyle(draftSdb === s)}
              >
                {s}+
              </button>
            ))}
          </div>
        </div>
      </Drawer>

      {/* ── Prix drawer ── */}
      <Drawer
        open={openDrawer === "prix"}
        onClose={close}
        title="Prix"
        footer={
          <>
            <button
              onClick={() => { setDraftPrixMin(""); setDraftPrixMax(""); }}
              style={{
                flex: 1, fontSize: 13, padding: "10px 0", borderRadius: 9999,
                border: "0.5px solid var(--border-secondary)", background: "transparent",
                color: "var(--text-tertiary)", cursor: "pointer", fontFamily: "inherit",
              }}
            >
              Reinitialiser
            </button>
            <button
              onClick={applyPrix}
              style={{
                flex: 1, fontSize: 13, fontWeight: 600, padding: "10px 0", borderRadius: 9999,
                background: "var(--green)", color: "#fff", border: "none",
                cursor: "pointer", fontFamily: "inherit",
              }}
            >
              Appliquer
            </button>
          </>
        }
      >
        {/* Prix minimum */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text-secondary)" }}>Prix minimum</span>
            <span style={{ fontSize: 13, color: "var(--text-tertiary)" }}>
              {draftPrixMin ? fmtVal(parseInt(draftPrixMin)) : "0 $"}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={2000000}
            step={25000}
            value={draftPrixMin || "0"}
            onChange={(e) => setDraftPrixMin(e.target.value === "0" ? "" : e.target.value)}
            style={{ width: "100%", accentColor: "var(--green)" }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text-tertiary)", marginTop: 4 }}>
            <span>0 $</span>
            <span>2 M$</span>
          </div>
        </div>

        {/* Prix maximum */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text-secondary)" }}>Prix maximum</span>
            <span style={{ fontSize: 13, color: "var(--text-tertiary)" }}>
              {draftPrixMax ? fmtVal(parseInt(draftPrixMax)) : "Illimite"}
            </span>
          </div>
          <input
            type="range"
            min={100000}
            max={20000000}
            step={50000}
            value={draftPrixMax || "20000000"}
            onChange={(e) => setDraftPrixMax(e.target.value === "20000000" ? "" : e.target.value)}
            style={{ width: "100%", accentColor: "var(--green)" }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text-tertiary)", marginTop: 4 }}>
            <span>100 k$</span>
            <span>20 M$</span>
          </div>
        </div>
      </Drawer>

      {/* ── All filters drawer ── */}
      <Drawer
        open={openDrawer === "all"}
        onClose={close}
        title="Tous les filtres"
        fullHeight
        footer={
          <>
            <button
              onClick={() => {
                setDraftType("");
                setDraftAnneeMin("");
                setDraftAnneeMax("");
                setDraftExtras([]);
                setDraftSuperficieMin("");
              }}
              style={{
                flex: 1, fontSize: 13, padding: "10px 0", borderRadius: 9999,
                border: "0.5px solid var(--border-secondary)", background: "transparent",
                color: "var(--text-tertiary)", cursor: "pointer", fontFamily: "inherit",
              }}
            >
              Tout reinitialiser
            </button>
            <button
              onClick={applyAll}
              style={{
                flex: 1, fontSize: 13, fontWeight: 600, padding: "10px 0", borderRadius: 9999,
                background: "var(--green)", color: "#fff", border: "none",
                cursor: "pointer", fontFamily: "inherit",
              }}
            >
              Voir les annonces ({total})
            </button>
          </>
        }
      >
        {/* Type de propriete */}
        <div style={{ marginBottom: 24 }}>
          <div style={{
            fontSize: 12, fontWeight: 500, color: "var(--text-tertiary)",
            marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.5,
          }}>
            Type de propriete
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {ALL_TYPES.map((t) => (
              <button
                key={t.value}
                onClick={() => setDraftType(draftType === t.value ? "" : t.value)}
                style={pillStyle(draftType === t.value)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Annee de construction */}
        <div style={{ marginBottom: 24 }}>
          <div style={{
            fontSize: 12, fontWeight: 500, color: "var(--text-tertiary)",
            marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.5,
          }}>
            Annee de construction
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="number"
              placeholder="Min"
              value={draftAnneeMin}
              onChange={(e) => setDraftAnneeMin(e.target.value)}
              min="1800"
              max="2026"
              style={{
                flex: 1, fontSize: 13, padding: "10px 12px", borderRadius: 10,
                border: "0.5px solid var(--border-secondary)", background: "var(--bg-page)",
                color: "var(--text-primary)", fontFamily: "inherit", outline: "none",
              }}
            />
            <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>a</span>
            <input
              type="number"
              placeholder="Max"
              value={draftAnneeMax}
              onChange={(e) => setDraftAnneeMax(e.target.value)}
              min="1800"
              max="2026"
              style={{
                flex: 1, fontSize: 13, padding: "10px 12px", borderRadius: 10,
                border: "0.5px solid var(--border-secondary)", background: "var(--bg-page)",
                color: "var(--text-primary)", fontFamily: "inherit", outline: "none",
              }}
            />
          </div>
        </div>

        {/* Caracteristiques */}
        <div style={{ marginBottom: 24 }}>
          <div style={{
            fontSize: 12, fontWeight: 500, color: "var(--text-tertiary)",
            marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.5,
          }}>
            Caracteristiques
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {EXTRAS_OPTIONS.map((ex) => (
              <button
                key={ex.value}
                onClick={() => toggleDraftExtra(ex.value)}
                style={pillStyle(draftExtras.includes(ex.value))}
              >
                {ex.label}
              </button>
            ))}
          </div>
        </div>

        {/* Superficie minimum */}
        <div style={{ marginBottom: 24 }}>
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8,
          }}>
            <span style={{
              fontSize: 12, fontWeight: 500, color: "var(--text-tertiary)",
              textTransform: "uppercase", letterSpacing: 0.5,
            }}>
              Superficie minimum
            </span>
            <span style={{ fontSize: 13, color: "var(--text-tertiary)" }}>
              {draftSuperficieMin ? `${parseInt(draftSuperficieMin).toLocaleString("fr-CA")} pi2` : "Aucun minimum"}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={5000}
            step={100}
            value={draftSuperficieMin || "0"}
            onChange={(e) => setDraftSuperficieMin(e.target.value === "0" ? "" : e.target.value)}
            style={{ width: "100%", accentColor: "var(--green)" }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text-tertiary)", marginTop: 4 }}>
            <span>0 pi2</span>
            <span>5 000 pi2</span>
          </div>
        </div>
      </Drawer>

      {/* Hide scrollbar for pills */}
      <style>{`
        .mobile-filter-pills-scroll::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
