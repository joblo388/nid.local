"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { villes, quartierBySlug } from "@/lib/data";
import { SkeletonListingCard } from "@/components/Skeleton";
import "./marketplace.css";

/* ─── Types ─────────────────────────────────────────────────────── */

type ListingItem = {
  id: string;
  titre: string;
  prix: number;
  mode?: string;
  type: string;
  quartierSlug: string;
  villeSlug: string;
  adresse: string;
  chambres: number;
  sallesDeBain: number;
  superficie: number;
  lienVisite: string | null;
  imageUrl: string | null;
  statut: string;
  nbFavoris: number;
  creeLe: string;
};

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

const EMPTY_FILTERS: Filters = {
  mode: "",
  type: "",
  villeSlug: "",
  quartierSlug: "",
  prixMin: "",
  prixMax: "",
  chambresMin: "",
  sallesBainMin: "",
  superficieMin: "",
  anneeMin: "",
  anneeMax: "",
  chauffage: "",
  extras: [],
  sousSol: "",
  search: "",
  tri: "recent",
};

/* ─── Constants ─────────────────────────────────────────────────── */

const TYPE_LABELS: Record<string, string> = {
  unifamiliale: "Unifamiliale",
  condo: "Condo",
  duplex: "Duplex",
  triplex: "Triplex",
  quadruplex: "Quadruplex",
  "5plex": "5-plex",
  maison_de_ville: "Maison de ville",
  terrain: "Terrain",
  commercial: "Commercial",
  chalet: "Chalet",
  "1_et_demi": "1½",
  "2_et_demi": "2½",
  "3_et_demi": "3½",
  "4_et_demi": "4½",
  "5_et_demi": "5½",
  "6_et_demi": "6½",
  studio: "Studio",
  loft: "Loft",
  autre: "Autre",
  autre_location: "Autre",
};

const QUICK_TYPES = [
  { value: "", label: "Tous types" },
  { value: "duplex", label: "Plex" },
  { value: "terrain", label: "Terrain" },
  { value: "chalet", label: "Chalet" },
];

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

const CHAMBRES_OPTIONS = ["1+", "2+", "3+", "4+", "5+"];
const SDB_OPTIONS = ["1+", "2+", "3+", "4+"];
const CHAUFFAGE_OPTIONS = [
  { value: "electrique", label: "Électrique" },
  { value: "gaz", label: "Gaz" },
  { value: "mazout", label: "Mazout" },
  { value: "geothermie", label: "Géothermie" },
  { value: "bois", label: "Bois" },
];

const EXTRAS_OPTIONS = [
  { value: "sous-sol-fini", label: "Sous-sol fini" },
  { value: "garage", label: "Garage" },
  { value: "piscine", label: "Piscine" },
  { value: "foyer", label: "Foyer" },
  { value: "borne-ve", label: "Borne VÉ" },
  { value: "acces-pmr", label: "Accès PMR" },
];

const VILLE_LABELS: Record<string, string> = {};
villes.forEach((v) => { VILLE_LABELS[v.slug] = v.nom; });

/* ─── Helpers ───────────────────────────────────────────────────── */

function fmtPrice(p: number, mode?: string) {
  return p.toLocaleString("fr-CA") + (mode === "location" ? " $/mois" : " $");
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return "il y a moins d’1h";
  if (h < 24) return `il y a ${h}h`;
  const days = Math.floor(diff / 86400000);
  if (days === 1) return "il y a 1j";
  if (days < 7) return `il y a ${days}j`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `il y a ${weeks} sem.`;
  return `il y a ${Math.floor(days / 30)} mois`;
}

function hasActiveFilters(f: Filters): boolean {
  return !!(
    f.mode || f.type || f.villeSlug || f.quartierSlug ||
    f.prixMin || f.prixMax || f.chambresMin || f.sallesBainMin ||
    f.superficieMin || f.anneeMin || f.anneeMax || f.chauffage ||
    f.extras.length > 0 || f.sousSol || f.search
  );
}

function getActiveChips(f: Filters): { key: string; label: string }[] {
  const chips: { key: string; label: string }[] = [];
  if (f.mode === "vente") chips.push({ key: "mode", label: "Acheter" });
  if (f.mode === "location") chips.push({ key: "mode", label: "Louer" });
  if (f.type) chips.push({ key: "type", label: TYPE_LABELS[f.type] ?? f.type });
  if (f.villeSlug) chips.push({ key: "villeSlug", label: VILLE_LABELS[f.villeSlug] ?? f.villeSlug });
  if (f.prixMin) chips.push({ key: "prixMin", label: `Min ${parseInt(f.prixMin).toLocaleString("fr-CA")} $` });
  if (f.prixMax) chips.push({ key: "prixMax", label: `Max ${parseInt(f.prixMax).toLocaleString("fr-CA")} $` });
  if (f.chambresMin) chips.push({ key: "chambresMin", label: `${f.chambresMin}+ chambres` });
  if (f.sallesBainMin) chips.push({ key: "sallesBainMin", label: `${f.sallesBainMin}+ sdb` });
  if (f.superficieMin) chips.push({ key: "superficieMin", label: `${parseInt(f.superficieMin).toLocaleString("fr-CA")}+ pi²` });
  if (f.anneeMin) chips.push({ key: "anneeMin", label: `Après ${f.anneeMin}` });
  if (f.anneeMax) chips.push({ key: "anneeMax", label: `Avant ${f.anneeMax}` });
  if (f.chauffage) {
    const cl = CHAUFFAGE_OPTIONS.find((c) => c.value === f.chauffage);
    chips.push({ key: "chauffage", label: cl?.label ?? f.chauffage });
  }
  f.extras.forEach((ex) => {
    const el = EXTRAS_OPTIONS.find((e) => e.value === ex);
    chips.push({ key: `extra:${ex}`, label: el?.label ?? ex });
  });
  if (f.sousSol) chips.push({ key: "sousSol", label: `Sous-sol: ${f.sousSol}` });
  if (f.search) chips.push({ key: "search", label: `"${f.search}"` });
  return chips;
}

/* ─── Component ─────────────────────────────────────────────────── */

export function AnnoncesListeView() {
  const { data: session } = useSession();
  const [listings, setListings] = useState<ListingItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [favs, setFavs] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<Filters>({ ...EMPTY_FILTERS });
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  /* ── Fetch ──────────────────────────────────────────────── */

  const fetchListings = useCallback(async (p = 1, append = false) => {
    if (!append) setLoading(true);
    const params = new URLSearchParams();
    if (filters.mode) params.set("mode", filters.mode);
    if (filters.type) params.set("type", filters.type);
    if (filters.villeSlug) params.set("villeSlug", filters.villeSlug);
    if (filters.quartierSlug) params.set("quartierSlug", filters.quartierSlug);
    if (filters.prixMin) params.set("prixMin", filters.prixMin);
    if (filters.prixMax) params.set("prixMax", filters.prixMax);
    if (filters.chambresMin) params.set("chambresMin", filters.chambresMin);
    if (filters.sallesBainMin) params.set("sallesBainMin", filters.sallesBainMin);
    if (filters.superficieMin) params.set("superficieMin", filters.superficieMin);
    if (filters.anneeMin) params.set("anneeMin", filters.anneeMin);
    if (filters.anneeMax) params.set("anneeMax", filters.anneeMax);
    if (filters.chauffage) params.set("chauffage", filters.chauffage);
    if (filters.extras.length > 0) params.set("extras", filters.extras.join(","));
    if (filters.sousSol) params.set("sousSol", filters.sousSol);
    if (filters.search) params.set("search", filters.search);
    if (filters.tri) params.set("tri", filters.tri);
    params.set("page", String(p));
    try {
      const res = await fetch(`/api/annonces?${params}`);
      const data = await res.json();
      setListings((prev) => append ? [...prev, ...data.listings] : data.listings);
      setTotal(data.total);
      setHasMore(data.hasMore);
      setPage(data.page);
      if (!append) setFavs(new Set(data.favoritedIds));
      setLastUpdate(new Date());
    } catch { /* ignore */ }
    setLoading(false);
  }, [filters]);

  useEffect(() => { fetchListings(1); }, [fetchListings]);

  /* ── Search ─────────────────────────────────────────────── */

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setFilters((f) => ({ ...f, search: searchInput }));
  }

  /* ── Favorites ──────────────────────────────────────────── */

  async function toggleFav(id: string, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const btn = e.currentTarget as HTMLElement;
    btn.classList.remove("heart-pop");
    void btn.offsetWidth;
    btn.classList.add("heart-pop");
    btn.addEventListener("animationend", () => btn.classList.remove("heart-pop"), { once: true });
    setFavs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
    await fetch(`/api/annonces/${id}/favorite`, { method: "POST" });
  }

  /* ── Filter helpers ─────────────────────────────────────── */

  function removeChip(key: string) {
    if (key.startsWith("extra:")) {
      const val = key.replace("extra:", "");
      setFilters((f) => ({ ...f, extras: f.extras.filter((x) => x !== val) }));
    } else {
      setFilters((f) => ({ ...f, [key]: key === "extras" ? [] : "" }));
    }
  }

  function clearAll() {
    setFilters({ ...EMPTY_FILTERS });
    setSearchInput("");
  }

  function toggleExtra(val: string) {
    setFilters((f) => ({
      ...f,
      extras: f.extras.includes(val) ? f.extras.filter((x) => x !== val) : [...f.extras, val],
    }));
  }

  function trackClick(id: string) {
    fetch(`/api/annonces/${id}/click`, { method: "POST" });
  }

  /* ── Time since last update ─────────────────────────────── */

  function updateAgoLabel(): string {
    const diff = Date.now() - lastUpdate.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Mise à jour à l’instant";
    if (mins < 60) return `Mise à jour il y a ${mins} min`;
    return `Mise à jour il y a ${Math.floor(mins / 60)}h`;
  }

  const chips = getActiveChips(filters);

  /* ── Render ─────────────────────────────────────────────── */

  return (
    <div>

        {/* ═══ A. Page header ═══ */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", margin: "24px 0 20px", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 600, margin: 0 }}>Annonces immobilières</h1>
            <p style={{ fontSize: 13, color: "var(--text-tertiary)", margin: "4px 0 0" }}>
              Propriétés vendues directement par les propriétaires, sans commission.
            </p>
          </div>
          <Link
            href="/annonces/publier"
            className="btn-press"
            style={{
              fontSize: 13, fontWeight: 500, padding: "8px 18px", borderRadius: 9999,
              background: "var(--green)", color: "#fff", textDecoration: "none", border: "none", cursor: "pointer",
            }}
          >
            + Publier une annonce
          </Link>
        </div>

        {/* ═══ B. Search bar ═══ */}
        <form onSubmit={handleSearch} style={{ marginBottom: 16 }}>
          <div style={{
            display: "flex", alignItems: "center", borderRadius: 9999,
            border: "0.5px solid var(--border-secondary)", background: "var(--bg-card)", overflow: "hidden",
          }}>
            <svg style={{ width: 16, height: 16, marginLeft: 14, flexShrink: 0, stroke: "var(--text-tertiary)", fill: "none", strokeWidth: 2 }} viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="7" /><line x1="16.5" y1="16.5" x2="21" y2="21" />
            </svg>
            <input
              type="text"
              placeholder="Rechercher par adresse, quartier ou type..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              style={{
                flex: 1, padding: "10px 12px", fontSize: 13, border: "none", background: "transparent",
                color: "var(--text-primary)", fontFamily: "inherit", outline: "none",
              }}
            />
            <button
              type="submit"
              style={{
                padding: "8px 18px", fontSize: 13, fontWeight: 500, border: "none",
                background: "var(--green)", color: "#fff", cursor: "pointer", fontFamily: "inherit",
                borderRadius: "0 9999px 9999px 0",
              }}
            >
              Rechercher
            </button>
          </div>
        </form>

        {/* ═══ C. Filter bar ═══ */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>

          {/* Tab group 1: Mode */}
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
                style={{
                  fontSize: 12, padding: "5px 14px", borderRadius: 9999, border: "none", cursor: "pointer",
                  fontFamily: "inherit", fontWeight: 500, transition: "all 0.15s",
                  background: filters.mode === m.value ? "var(--bg-card)" : "transparent",
                  color: filters.mode === m.value ? "var(--text-primary)" : "var(--text-tertiary)",
                  boxShadow: filters.mode === m.value ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                }}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Tab group 2: Quick types */}
          <div style={{
            display: "inline-flex", borderRadius: 9999, background: "var(--bg-secondary)",
            padding: 3, gap: 2,
          }}>
            {QUICK_TYPES.map((t) => (
              <button
                key={t.value}
                onClick={() => setFilters((f) => ({ ...f, type: t.value }))}
                style={{
                  fontSize: 12, padding: "5px 14px", borderRadius: 9999, border: "none", cursor: "pointer",
                  fontFamily: "inherit", fontWeight: 500, transition: "all 0.15s",
                  background: filters.type === t.value ? "var(--bg-card)" : "transparent",
                  color: filters.type === t.value ? "var(--text-primary)" : "var(--text-tertiary)",
                  boxShadow: filters.type === t.value ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Pill filters */}
          <select
            value={filters.villeSlug}
            onChange={(e) => setFilters((f) => ({ ...f, villeSlug: e.target.value }))}
            style={{
              fontSize: 12, padding: "6px 12px", borderRadius: 9999,
              border: filters.villeSlug ? "0.5px solid var(--green)" : "0.5px solid var(--border-secondary)",
              background: filters.villeSlug ? "var(--green-light-bg)" : "var(--bg-card)",
              color: filters.villeSlug ? "var(--green-text)" : "var(--text-primary)",
              fontFamily: "inherit", cursor: "pointer", outline: "none",
            }}
          >
            <option value="">Ville</option>
            {villes.map((v) => <option key={v.slug} value={v.slug}>{v.nom}</option>)}
          </select>

          <input
            type="number"
            placeholder="Prix max $"
            value={filters.prixMax}
            onChange={(e) => setFilters((f) => ({ ...f, prixMax: e.target.value }))}
            min={0}
            step={10000}
            style={{
              fontSize: 12, padding: "6px 12px", borderRadius: 9999, width: 110,
              border: filters.prixMax ? "0.5px solid var(--green)" : "0.5px solid var(--border-secondary)",
              background: filters.prixMax ? "var(--green-light-bg)" : "var(--bg-card)",
              color: filters.prixMax ? "var(--green-text)" : "var(--text-primary)",
              fontFamily: "inherit", outline: "none",
            }}
          />

          <select
            value={filters.chambresMin}
            onChange={(e) => setFilters((f) => ({ ...f, chambresMin: e.target.value }))}
            style={{
              fontSize: 12, padding: "6px 12px", borderRadius: 9999,
              border: filters.chambresMin ? "0.5px solid var(--green)" : "0.5px solid var(--border-secondary)",
              background: filters.chambresMin ? "var(--green-light-bg)" : "var(--bg-card)",
              color: filters.chambresMin ? "var(--green-text)" : "var(--text-primary)",
              fontFamily: "inherit", cursor: "pointer", outline: "none",
            }}
          >
            <option value="">Chambres</option>
            {CHAMBRES_OPTIONS.map((c) => <option key={c} value={c.replace("+", "")}>{c}</option>)}
          </select>

          <select
            value={filters.sallesBainMin}
            onChange={(e) => setFilters((f) => ({ ...f, sallesBainMin: e.target.value }))}
            style={{
              fontSize: 12, padding: "6px 12px", borderRadius: 9999,
              border: filters.sallesBainMin ? "0.5px solid var(--green)" : "0.5px solid var(--border-secondary)",
              background: filters.sallesBainMin ? "var(--green-light-bg)" : "var(--bg-card)",
              color: filters.sallesBainMin ? "var(--green-text)" : "var(--text-primary)",
              fontFamily: "inherit", cursor: "pointer", outline: "none",
            }}
          >
            <option value="">Salles de bain</option>
            {SDB_OPTIONS.map((s) => <option key={s} value={s.replace("+", "")}>{s}</option>)}
          </select>

          {/* Filtres avances toggle */}
          <button
            onClick={() => setAdvancedOpen(!advancedOpen)}
            style={{
              fontSize: 12, padding: "6px 14px", borderRadius: 9999, cursor: "pointer",
              fontFamily: "inherit", fontWeight: 500, transition: "all 0.15s",
              border: advancedOpen ? "0.5px solid var(--green)" : "0.5px solid var(--border-secondary)",
              background: advancedOpen ? "var(--green-light-bg)" : "var(--bg-card)",
              color: advancedOpen ? "var(--green-text)" : "var(--text-tertiary)",
              display: "inline-flex", alignItems: "center", gap: 5,
            }}
          >
            <svg style={{ width: 13, height: 13, stroke: "currentColor", fill: "none", strokeWidth: 1.5 }} viewBox="0 0 24 24">
              <line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="18" x2="20" y2="18" />
              <circle cx="8" cy="6" r="2" /><circle cx="16" cy="12" r="2" /><circle cx="10" cy="18" r="2" />
            </svg>
            Filtres avancés
          </button>
        </div>

        {/* ═══ D. Active filter chips ═══ */}
        {chips.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
            {chips.map((chip) => (
              <button
                key={chip.key}
                onClick={() => removeChip(chip.key)}
                style={{
                  fontSize: 11, padding: "4px 10px", borderRadius: 9999,
                  background: "var(--green-light-bg)", color: "var(--green-text)",
                  border: "0.5px solid var(--green)", cursor: "pointer", fontFamily: "inherit",
                  display: "inline-flex", alignItems: "center", gap: 4, fontWeight: 500,
                }}
              >
                {chip.label}
                <span style={{ fontSize: 14, lineHeight: 1 }}>&times;</span>
              </button>
            ))}
            <button
              onClick={clearAll}
              style={{
                fontSize: 11, padding: "4px 10px", borderRadius: 9999,
                background: "transparent", color: "var(--text-tertiary)",
                border: "0.5px solid var(--border-secondary)", cursor: "pointer", fontFamily: "inherit",
              }}
            >
              Tout effacer
            </button>
          </div>
        )}

        {/* ═══ E. Advanced filter panel ═══ */}
        {advancedOpen && (
          <div style={{
            background: "var(--bg-card)", borderRadius: 12, border: "0.5px solid var(--border)",
            padding: 20, marginBottom: 16,
          }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24 }}>

              {/* Col 1 */}
              <div>
                <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text-tertiary)", marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.5 }}>
                  Type de propriété
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 18 }}>
                  {ALL_TYPES.map((t) => (
                    <button
                      key={t.value}
                      onClick={() => setFilters((f) => ({ ...f, type: f.type === t.value ? "" : t.value }))}
                      style={{
                        fontSize: 12, padding: "5px 12px", borderRadius: 9999, cursor: "pointer",
                        fontFamily: "inherit", transition: "all 0.15s",
                        background: filters.type === t.value ? "var(--green-light-bg)" : "transparent",
                        color: filters.type === t.value ? "var(--green-text)" : "var(--text-tertiary)",
                        border: filters.type === t.value ? "0.5px solid var(--green)" : "0.5px solid var(--border-secondary)",
                      }}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text-tertiary)", marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.5 }}>
                  Chambres
                </div>
                <div style={{ display: "flex", gap: 6, marginBottom: 18 }}>
                  {CHAMBRES_OPTIONS.map((c) => {
                    const val = c.replace("+", "");
                    return (
                      <button
                        key={c}
                        onClick={() => setFilters((f) => ({ ...f, chambresMin: f.chambresMin === val ? "" : val }))}
                        style={{
                          fontSize: 12, padding: "5px 12px", borderRadius: 9999, cursor: "pointer",
                          fontFamily: "inherit", transition: "all 0.15s",
                          background: filters.chambresMin === val ? "var(--green-light-bg)" : "transparent",
                          color: filters.chambresMin === val ? "var(--green-text)" : "var(--text-tertiary)",
                          border: filters.chambresMin === val ? "0.5px solid var(--green)" : "0.5px solid var(--border-secondary)",
                        }}
                      >
                        {c}
                      </button>
                    );
                  })}
                </div>

                <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text-tertiary)", marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.5 }}>
                  Salles de bain
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  {SDB_OPTIONS.map((s) => {
                    const val = s.replace("+", "");
                    return (
                      <button
                        key={s}
                        onClick={() => setFilters((f) => ({ ...f, sallesBainMin: f.sallesBainMin === val ? "" : val }))}
                        style={{
                          fontSize: 12, padding: "5px 12px", borderRadius: 9999, cursor: "pointer",
                          fontFamily: "inherit", transition: "all 0.15s",
                          background: filters.sallesBainMin === val ? "var(--green-light-bg)" : "transparent",
                          color: filters.sallesBainMin === val ? "var(--green-text)" : "var(--text-tertiary)",
                          border: filters.sallesBainMin === val ? "0.5px solid var(--green)" : "0.5px solid var(--border-secondary)",
                        }}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Col 2 */}
              <div>
                <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text-tertiary)", marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.5 }}>
                  Prix maximum
                </div>
                <div style={{ marginBottom: 6 }}>
                  <input
                    type="range"
                    min={0}
                    max={20000000}
                    step={25000}
                    value={filters.prixMax || 0}
                    onChange={(e) => setFilters((f) => ({ ...f, prixMax: e.target.value === "0" ? "" : e.target.value }))}
                    style={{ width: "100%", accentColor: "var(--green)" }}
                  />
                  <div style={{ fontSize: 12, color: "var(--text-tertiary)", textAlign: "right" }}>
                    {filters.prixMax ? `${parseInt(filters.prixMax).toLocaleString("fr-CA")} $` : "Illimité"}
                  </div>
                </div>

                <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text-tertiary)", marginBottom: 10, marginTop: 14, textTransform: "uppercase", letterSpacing: 0.5 }}>
                  Superficie minimum
                </div>
                <div style={{ marginBottom: 6 }}>
                  <input
                    type="range"
                    min={0}
                    max={5000}
                    step={100}
                    value={filters.superficieMin || 0}
                    onChange={(e) => setFilters((f) => ({ ...f, superficieMin: e.target.value === "0" ? "" : e.target.value }))}
                    style={{ width: "100%", accentColor: "var(--green)" }}
                  />
                  <div style={{ fontSize: 12, color: "var(--text-tertiary)", textAlign: "right" }}>
                    {filters.superficieMin ? `${parseInt(filters.superficieMin).toLocaleString("fr-CA")} pi²` : "Aucun minimum"}
                  </div>
                </div>

                <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text-tertiary)", marginBottom: 10, marginTop: 14, textTransform: "uppercase", letterSpacing: 0.5 }}>
                  Année de construction
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.anneeMin}
                    onChange={(e) => setFilters((f) => ({ ...f, anneeMin: e.target.value }))}
                    min="1800"
                    max="2026"
                    style={{
                      flex: 1, fontSize: 13, padding: "8px 10px", borderRadius: 8,
                      border: "0.5px solid var(--border-secondary)", background: "var(--bg-page)",
                      color: "var(--text-primary)", fontFamily: "inherit", outline: "none",
                    }}
                  />
                  <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>à</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.anneeMax}
                    onChange={(e) => setFilters((f) => ({ ...f, anneeMax: e.target.value }))}
                    min="1800"
                    max="2026"
                    style={{
                      flex: 1, fontSize: 13, padding: "8px 10px", borderRadius: 8,
                      border: "0.5px solid var(--border-secondary)", background: "var(--bg-page)",
                      color: "var(--text-primary)", fontFamily: "inherit", outline: "none",
                    }}
                  />
                </div>
              </div>

              {/* Col 3 */}
              <div>
                <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text-tertiary)", marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.5 }}>
                  Bâtiment et systèmes
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 18 }}>
                  {EXTRAS_OPTIONS.map((ex) => (
                    <button
                      key={ex.value}
                      onClick={() => toggleExtra(ex.value)}
                      style={{
                        fontSize: 12, padding: "5px 12px", borderRadius: 9999, cursor: "pointer",
                        fontFamily: "inherit", transition: "all 0.15s",
                        background: filters.extras.includes(ex.value) ? "var(--green-light-bg)" : "transparent",
                        color: filters.extras.includes(ex.value) ? "var(--green-text)" : "var(--text-tertiary)",
                        border: filters.extras.includes(ex.value) ? "0.5px solid var(--green)" : "0.5px solid var(--border-secondary)",
                      }}
                    >
                      {ex.label}
                    </button>
                  ))}
                </div>

                <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text-tertiary)", marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.5 }}>
                  Chauffage
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {CHAUFFAGE_OPTIONS.map((ch) => (
                    <button
                      key={ch.value}
                      onClick={() => setFilters((f) => ({ ...f, chauffage: f.chauffage === ch.value ? "" : ch.value }))}
                      style={{
                        fontSize: 12, padding: "5px 12px", borderRadius: 9999, cursor: "pointer",
                        fontFamily: "inherit", transition: "all 0.15s",
                        background: filters.chauffage === ch.value ? "var(--green-light-bg)" : "transparent",
                        color: filters.chauffage === ch.value ? "var(--green-text)" : "var(--text-tertiary)",
                        border: filters.chauffage === ch.value ? "0.5px solid var(--green)" : "0.5px solid var(--border-secondary)",
                      }}
                    >
                      {ch.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Advanced panel footer */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              borderTop: "0.5px solid var(--border)", marginTop: 20, paddingTop: 16,
            }}>
              <button
                onClick={clearAll}
                style={{
                  fontSize: 13, padding: "8px 16px", borderRadius: 9999,
                  border: "0.5px solid var(--border-secondary)", background: "transparent",
                  color: "var(--text-tertiary)", cursor: "pointer", fontFamily: "inherit",
                }}
              >
                Réinitialiser
              </button>
              <button
                onClick={() => setAdvancedOpen(false)}
                style={{
                  fontSize: 13, fontWeight: 500, padding: "8px 20px", borderRadius: 9999,
                  background: "var(--green)", color: "#fff", border: "none", cursor: "pointer", fontFamily: "inherit",
                }}
              >
                Voir les annonces ({total})
              </button>
            </div>
          </div>
        )}

        {/* ═══ F. Results bar ═══ */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: 16, flexWrap: "wrap", gap: 8,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 14, fontWeight: 500 }}>
              {total} annonce{total !== 1 ? "s" : ""}
            </span>
            <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>
              {updateAgoLabel()}
            </span>
          </div>
          <select
            value={filters.tri}
            onChange={(e) => setFilters((f) => ({ ...f, tri: e.target.value }))}
            style={{
              fontSize: 12, padding: "6px 12px", borderRadius: 9999,
              border: "0.5px solid var(--border-secondary)", background: "var(--bg-card)",
              color: "var(--text-primary)", fontFamily: "inherit", cursor: "pointer", outline: "none",
            }}
          >
            <option value="recent">Plus récent</option>
            <option value="prix_asc">Prix croissant</option>
            <option value="prix_desc">Prix décroissant</option>
            <option value="populaire">Plus populaire</option>
          </select>
        </div>

        {/* ═══ G. Listing cards grid ═══ */}
        {loading && listings.length === 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
            {[...Array(6)].map((_, i) => <SkeletonListingCard key={i} />)}
          </div>
        ) : listings.length === 0 ? (
          <div style={{
            background: "var(--bg-card)", borderRadius: 12, border: "0.5px solid var(--border)",
            textAlign: "center", padding: 48,
          }}>
            <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 6 }}>Aucune annonce trouvée</div>
            <div style={{ fontSize: 13, color: "var(--text-tertiary)", marginBottom: 16 }}>
              {hasActiveFilters(filters) ? "Aucun résultat ne correspond à vos critères." : "Soyez le premier à publier une propriété."}
            </div>
            {hasActiveFilters(filters) ? (
              <button
                onClick={clearAll}
                style={{
                  fontSize: 13, fontWeight: 500, padding: "8px 18px", borderRadius: 9999,
                  background: "var(--green)", color: "#fff", border: "none", cursor: "pointer", fontFamily: "inherit",
                }}
              >
                Effacer les filtres
              </button>
            ) : (
              <Link
                href="/annonces/publier"
                className="btn-press"
                style={{
                  fontSize: 13, fontWeight: 500, padding: "8px 18px", borderRadius: 9999,
                  background: "var(--green)", color: "#fff", textDecoration: "none", border: "none",
                }}
              >
                + Publier une annonce
              </Link>
            )}
          </div>
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
              {listings.map((l) => {
                const q = quartierBySlug[l.quartierSlug];
                const quartierNom = q?.nom ?? l.quartierSlug;
                return (
                  <Link
                    key={l.id}
                    href={`/annonces/${l.id}`}
                    onClick={() => trackClick(l.id)}
                    style={{
                      background: "var(--bg-card)", border: "0.5px solid var(--border)", borderRadius: 12,
                      overflow: "hidden", cursor: "pointer", textDecoration: "none", color: "inherit",
                      display: "flex", flexDirection: "column", transition: "border-color 0.15s",
                    }}
                    className="mp-card-hover"
                  >
                    {/* Image area */}
                    <div style={{
                      height: 170, background: "var(--bg-secondary)", position: "relative",
                      overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {l.imageUrl ? (
                        <Image src={l.imageUrl} alt={l.titre} fill sizes="(max-width:640px) 100vw, 300px" style={{ objectFit: "cover" }} loading="lazy" />
                      ) : (
                        <svg viewBox="0 0 32 32" style={{ width: 32, height: 32, stroke: "var(--text-tertiary)", fill: "none", strokeWidth: 1 }}>
                          <rect x="2" y="10" width="28" height="20" rx="2" /><path d="M2 14l14-10 14 10" /><rect x="12" y="20" width="8" height="10" />
                        </svg>
                      )}
                      {/* Badge */}
                      <div style={{
                        position: "absolute", top: 8, left: 8, fontSize: 10, padding: "2px 8px",
                        borderRadius: 9999, fontWeight: 500,
                        background: l.mode === "location" ? "var(--blue-bg)" : "var(--green-light-bg)",
                        color: l.mode === "location" ? "var(--blue-text)" : "var(--green-text)",
                      }}>
                        {l.mode === "location" ? "À louer" : "À vendre"}
                      </div>
                      {/* Favorite button */}
                      <button
                        onClick={(e) => toggleFav(l.id, e)}
                        className={`mp-fav-btn${favs.has(l.id) ? " active" : ""}`}
                        style={{
                          position: "absolute", top: 8, right: 8,
                          width: 32, height: 32, borderRadius: "50%",
                          background: favs.has(l.id) ? "var(--red-bg)" : "rgba(255,255,255,0.85)",
                          border: favs.has(l.id) ? "none" : "0.5px solid var(--border-secondary)",
                          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                          backdropFilter: "blur(4px)",
                        }}
                      >
                        <svg viewBox="0 0 14 14" style={{ width: 14, height: 14, stroke: "#E24B4A", fill: favs.has(l.id) ? "#E24B4A" : "none", strokeWidth: 1.5 }}>
                          <path d="M7 12S1 8 1 4.5A3.5 3.5 0 017 2.6 3.5 3.5 0 0113 4.5C13 8 7 12 7 12z" />
                        </svg>
                      </button>
                    </div>

                    {/* Card body */}
                    <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
                      <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: -0.5 }}>
                        {fmtPrice(l.prix, l.mode)}
                      </div>
                      <div style={{ fontSize: 12, color: "var(--text-tertiary)" }}>
                        {TYPE_LABELS[l.type] ?? l.type} · {quartierNom}
                      </div>
                      <div style={{ fontSize: 12, color: "var(--text-tertiary)", display: "flex", alignItems: "center", gap: 4 }}>
                        <svg viewBox="0 0 14 14" style={{ width: 12, height: 12, stroke: "var(--text-tertiary)", fill: "none", strokeWidth: 1.5, flexShrink: 0 }}>
                          <path d="M7 1C4.8 1 3 2.8 3 5c0 3 4 7 4 7s4-4 4-7c0-2.2-1.8-4-4-4z" /><circle cx="7" cy="5" r="1.5" />
                        </svg>
                        {l.adresse}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 6, fontSize: 12, color: "var(--text-tertiary)" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                          <svg viewBox="0 0 14 14" style={{ width: 13, height: 13, stroke: "var(--text-tertiary)", fill: "none", strokeWidth: 1.5 }}>
                            <path d="M1 11V5l6-4 6 4v6" /><rect x="4" y="7" width="6" height="4" />
                          </svg>
                          {l.chambres} ch.
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                          <svg viewBox="0 0 14 14" style={{ width: 13, height: 13, stroke: "var(--text-tertiary)", fill: "none", strokeWidth: 1.5 }}>
                            <rect x="2" y="4" width="8" height="6" rx="1" /><path d="M10 7h2v3H2" />
                          </svg>
                          {l.sallesDeBain} sdb
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                          <svg viewBox="0 0 14 14" style={{ width: 13, height: 13, stroke: "var(--text-tertiary)", fill: "none", strokeWidth: 1.5 }}>
                            <rect x="1" y="1" width="12" height="12" rx="1" /><path d="M1 5h12M5 1v12" />
                          </svg>
                          {l.superficie.toLocaleString("fr-CA")} pi²
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Pagination */}
            {hasMore && (
              <button
                onClick={() => fetchListings(page + 1, true)}
                style={{
                  width: "100%", padding: 12, marginTop: 16, borderRadius: 12,
                  fontSize: 13, fontWeight: 500, background: "var(--bg-card)",
                  border: "0.5px solid var(--border)", color: "var(--text-secondary)",
                  cursor: "pointer", fontFamily: "inherit", transition: "background 0.15s",
                }}
              >
                Charger plus d&apos;annonces
              </button>
            )}
          </>
        )}
      </div>
  );
}
