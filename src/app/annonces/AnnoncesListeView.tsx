"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Header } from "@/components/Header";
import { villes, quartierBySlug, ressourcesUtiles } from "@/lib/data";
import { SkeletonListingCard } from "@/components/Skeleton";
import { AnnonceMapView } from "./AnnonceMapView";
import "./marketplace.css";

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

function fmtPrice(p: number, mode?: string) {
  return p.toLocaleString("fr-CA") + (mode === "location" ? " $/mois" : " $");
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "aujourd'hui";
  if (days === 1) return "il y a 1j";
  if (days < 7) return `il y a ${days}j`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `il y a ${weeks}sem`;
  return `il y a ${Math.floor(days / 30)}mois`;
}

const TYPE_LABELS: Record<string, string> = {
  unifamiliale: "Unifamiliale", condo: "Condo", duplex: "Duplex", triplex: "Triplex", quadruplex: "Quadruplex",
  "5plex": "5-plex", maison_de_ville: "Maison de ville", terrain: "Terrain", commercial: "Commercial",
  "1_et_demi": "1\u00BD", "2_et_demi": "2\u00BD", "3_et_demi": "3\u00BD", "4_et_demi": "4\u00BD",
  "5_et_demi": "5\u00BD", "6_et_demi": "6\u00BD", studio: "Studio", loft: "Loft", autre: "Autre", autre_location: "Autre",
};

const TYPES_VENTE = [
  { value: "unifamiliale", label: "Unifamiliale" },
  { value: "condo", label: "Condo" },
  { value: "duplex", label: "Duplex" },
  { value: "triplex", label: "Triplex" },
  { value: "quadruplex", label: "Quadruplex" },
  { value: "5plex", label: "5-plex" },
  { value: "maison_de_ville", label: "Maison de ville" },
  { value: "terrain", label: "Terrain" },
  { value: "commercial", label: "Commercial" },
  { value: "autre", label: "Autre" },
];

const TYPES_LOCATION = [
  { value: "studio", label: "Studio" },
  { value: "1_et_demi", label: "1\u00BD" },
  { value: "2_et_demi", label: "2\u00BD" },
  { value: "3_et_demi", label: "3\u00BD" },
  { value: "4_et_demi", label: "4\u00BD" },
  { value: "5_et_demi", label: "5\u00BD" },
  { value: "6_et_demi", label: "6\u00BD" },
  { value: "loft", label: "Loft" },
  { value: "autre_location", label: "Autre" },
];

type SavedSearchItem = {
  id: string;
  nom: string;
  mode: string | null;
  villeSlug: string | null;
  type: string | null;
  prixMax: number | null;
};

const VILLE_LABELS: Record<string, string> = {};
villes.forEach((v) => { VILLE_LABELS[v.slug] = v.nom; });

export function AnnoncesListeView() {
  const { data: session } = useSession();
  const [listings, setListings] = useState<ListingItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [favs, setFavs] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState({ villeSlug: "", quartierSlug: "", type: "", prixMax: "", tri: "recent", q: "", mode: "" });
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"liste" | "carte">("liste");
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [savedSearches, setSavedSearches] = useState<SavedSearchItem[]>([]);
  const [savingSearch, setSavingSearch] = useState(false);

  // Fetch saved searches when logged in
  useEffect(() => {
    if (!session?.user) return;
    fetch("/api/saved-searches")
      .then((r) => r.json())
      .then((data) => { if (data.searches) setSavedSearches(data.searches); })
      .catch(() => {});
  }, [session?.user]);

  async function handleSaveSearch() {
    const nom = prompt("Nom de la recherche :");
    if (!nom || nom.trim().length === 0) return;
    setSavingSearch(true);
    try {
      const res = await fetch("/api/saved-searches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom: nom.trim(),
          mode: filters.mode || undefined,
          villeSlug: filters.villeSlug || undefined,
          type: filters.type || undefined,
          prixMax: filters.prixMax || undefined,
        }),
      });
      const data = await res.json();
      if (data.search) setSavedSearches((prev) => [data.search, ...prev]);
    } catch { /* ignore */ }
    setSavingSearch(false);
  }

  async function handleDeleteSearch(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    setSavedSearches((prev) => prev.filter((s) => s.id !== id));
    await fetch(`/api/saved-searches/${id}`, { method: "DELETE" });
  }

  function applySearch(s: SavedSearchItem) {
    setFilters((f) => ({
      ...f,
      mode: s.mode ?? "",
      villeSlug: s.villeSlug ?? "",
      type: s.type ?? "",
      prixMax: s.prixMax != null ? String(s.prixMax) : "",
    }));
  }

  const fetchListings = useCallback(async (p = 1, append = false) => {
    if (!append) setLoading(true);
    const params = new URLSearchParams();
    if (filters.mode) params.set("mode", filters.mode);
    if (filters.villeSlug) params.set("villeSlug", filters.villeSlug);
    if (filters.quartierSlug) params.set("quartierSlug", filters.quartierSlug);
    if (filters.type) params.set("type", filters.type);
    if (filters.prixMax) params.set("prixMax", filters.prixMax);
    if (filters.tri) params.set("tri", filters.tri);
    if (filters.q) params.set("q", filters.q);
    params.set("page", String(p));
    try {
      const res = await fetch(`/api/annonces?${params}`);
      const data = await res.json();
      setListings((prev) => append ? [...prev, ...data.listings] : data.listings);
      setTotal(data.total);
      setHasMore(data.hasMore);
      setPage(data.page);
      if (!append) setFavs(new Set(data.favoritedIds));
    } catch { /* ignore */ }
    setLoading(false);
  }, [filters]);

  useEffect(() => { fetchListings(1); }, [fetchListings]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setFilters((f) => ({ ...f, q: searchInput }));
  }

  function trackClick(id: string) {
    fetch(`/api/annonces/${id}/click`, { method: "POST" });
  }

  async function toggleFav(id: string, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    // Trigger heart pop animation
    const btn = (e.currentTarget as HTMLElement);
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

  function toggleCompare(id: string, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  }

  const quartierCounts: Record<string, number> = {};
  listings.forEach((l) => {
    const q = quartierBySlug[l.quartierSlug];
    quartierCounts[q?.nom ?? l.quartierSlug] = (quartierCounts[q?.nom ?? l.quartierSlug] || 0) + 1;
  });

  return (
    <>
      <Header />
      <div className="max-w-[900px] mx-auto px-4 pb-10">
        <div className="mp-page-header" style={{ marginTop: 20 }}>
          <div>
            <div className="mp-page-title">Annonces immobilières</div>
            <div className="mp-page-sub">Propriétés vendues directement par les propriétaires — sans commission</div>
          </div>
          <Link className="mp-btn-primary btn-press" href="/annonces/publier">+ Publier une annonce</Link>
        </div>

        {/* Search bar */}
        <form onSubmit={handleSearch} style={{ marginBottom: 12 }}>
          <div className="mp-field-input" style={{ borderRadius: 20 }}>
            <input
              type="text"
              placeholder="Rechercher une adresse, quartier, type…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              style={{ padding: "8px 14px", fontSize: 13 }}
            />
            <button
              type="submit"
              style={{ padding: "0 14px", background: "transparent", border: "none", cursor: "pointer", color: "var(--text-tertiary)", fontFamily: "inherit", fontSize: 13 }}
            >
              Rechercher
            </button>
          </div>
        </form>

        {/* Filters + sort */}
        <div className="mp-filters">
          <button
            className={`mp-filter-pill${filters.mode === "" ? " on" : ""}`}
            onClick={() => setFilters((f) => ({ ...f, mode: "", type: "", prixMax: "" }))}
          >
            Toutes
          </button>
          <button
            className={`mp-filter-pill${filters.mode === "vente" ? " on" : ""}`}
            onClick={() => setFilters((f) => ({ ...f, mode: f.mode === "vente" ? "" : "vente", type: "", prixMax: "" }))}
          >
            Acheter
          </button>
          <button
            className={`mp-filter-pill${filters.mode === "location" ? " on" : ""}`}
            onClick={() => setFilters((f) => ({ ...f, mode: f.mode === "location" ? "" : "location", type: "", prixMax: "" }))}
          >
            Louer
          </button>
          <select className="mp-filter-select" value={filters.villeSlug} onChange={(e) => setFilters((f) => ({ ...f, villeSlug: e.target.value }))}>
            <option value="">Toutes les villes</option>
            {villes.map((v) => <option key={v.slug} value={v.slug}>{v.nom}</option>)}
          </select>
          <select className="mp-filter-select" value={filters.type} onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))}>
            <option value="">Tous les types</option>
            {(filters.mode === "location" ? TYPES_LOCATION : filters.mode === "vente" ? TYPES_VENTE : [...TYPES_VENTE, ...TYPES_LOCATION]).map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
          {filters.mode === "location" ? (
            <input
              type="number"
              className="mp-filter-select"
              placeholder="Loyer max $/mois"
              value={filters.prixMax}
              onChange={(e) => setFilters((f) => ({ ...f, prixMax: e.target.value }))}
              min={0}
              step={50}
              style={{ minWidth: 130 }}
            />
          ) : (
            <input
              type="number"
              className="mp-filter-select"
              placeholder="Prix max $"
              value={filters.prixMax}
              onChange={(e) => setFilters((f) => ({ ...f, prixMax: e.target.value }))}
              min={0}
              step={10000}
              style={{ minWidth: 130 }}
            />
          )}
          <select className="mp-filter-select mp-filter-sort" value={filters.tri} onChange={(e) => setFilters((f) => ({ ...f, tri: e.target.value }))}>
            <option value="recent">Plus récent</option>
            <option value="prix_asc">Prix ↑</option>
            <option value="prix_desc">Prix ↓</option>
            <option value="populaire">Plus vu</option>
          </select>
          <span className="mp-results-count">
            {total} annonce{total !== 1 ? "s" : ""}
            {session?.user && (
              <button
                className="mp-save-search-btn"
                onClick={handleSaveSearch}
                disabled={savingSearch}
                title="Sauvegarder cette recherche"
              >
                <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M7 1v12M1 7h12" /></svg>
                {savingSearch ? "..." : "Sauvegarder"}
              </button>
            )}
          </span>
          <div className="mp-view-toggle">
            <button className={`mp-view-toggle-btn${viewMode === "liste" ? " active" : ""}`} onClick={() => setViewMode("liste")}>
              <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="1" y1="3" x2="15" y2="3" /><line x1="1" y1="8" x2="15" y2="8" /><line x1="1" y1="13" x2="15" y2="13" /></svg>
              Liste
            </button>
            <button className={`mp-view-toggle-btn${viewMode === "carte" ? " active" : ""}`} onClick={() => setViewMode("carte")}>
              <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 3l5-2 4 2 5-2v12l-5 2-4-2-5 2V3z" /><line x1="6" y1="1" x2="6" y2="13" /><line x1="10" y1="3" x2="10" y2="15" /></svg>
              Carte
            </button>
          </div>
        </div>

        {/* Saved searches */}
        {session?.user && savedSearches.length > 0 && (
          <div className="mp-saved-searches">
            <span className="mp-saved-label">Mes recherches</span>
            {savedSearches.map((s) => (
              <button
                key={s.id}
                className="mp-saved-pill"
                onClick={() => applySearch(s)}
                title={[
                  s.mode === "vente" ? "Acheter" : s.mode === "location" ? "Louer" : null,
                  s.villeSlug ? VILLE_LABELS[s.villeSlug] ?? s.villeSlug : null,
                  s.type ? TYPE_LABELS[s.type] ?? s.type : null,
                  s.prixMax != null ? `max ${s.prixMax.toLocaleString("fr-CA")} $` : null,
                ].filter(Boolean).join(" · ") || "Tous les filtres"}
              >
                {s.nom}
                <span
                  className="mp-saved-pill-x"
                  onClick={(e) => handleDeleteSearch(s.id, e)}
                  title="Supprimer"
                >
                  &times;
                </span>
              </button>
            ))}
          </div>
        )}

        {viewMode === "carte" ? (
          <AnnonceMapView
            listings={listings}
            favs={favs}
            onToggleFav={toggleFav}
            onTrackClick={trackClick}
            quartierFilter={filters.quartierSlug}
            villeFilter={filters.villeSlug}
          />
        ) : (
        <div className="mp-layout">
          <div className="mp-listings">
            {loading && listings.length === 0 ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <SkeletonListingCard key={i} />
                ))}
              </div>
            ) : listings.length === 0 ? (
              <div className="mp-sidebar-card" style={{ textAlign: "center", padding: 40 }}>
                <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 6 }}>Aucune annonce</div>
                <div style={{ fontSize: 13, color: "var(--text-tertiary)", marginBottom: 16 }}>
                  {filters.q ? "Aucun résultat pour cette recherche." : "Sois le premier à publier une propriété."}
                </div>
                {filters.q ? (
                  <button className="mp-btn-primary" onClick={() => { setSearchInput(""); setFilters((f) => ({ ...f, q: "" })); }}>Effacer la recherche</button>
                ) : (
                  <Link className="mp-btn-primary btn-press" href="/annonces/publier">+ Publier une annonce</Link>
                )}
              </div>
            ) : (
              <>
                {listings.map((l) => {
                  const q = quartierBySlug[l.quartierSlug];
                  const quartierNom = q?.nom ?? l.quartierSlug;
                  return (
                    <Link key={l.id} className="mp-listing-card" href={`/annonces/${l.id}`} onClick={() => trackClick(l.id)}>
                      <div className="mp-listing-img">
                        {l.imageUrl ? (
                          <Image src={l.imageUrl} alt={l.titre} fill sizes="200px" style={{ objectFit: "cover" }} loading="lazy" />
                        ) : (
                          <svg viewBox="0 0 32 32"><rect x="2" y="10" width="28" height="20" rx="2" /><path d="M2 14l14-10 14 10" /><rect x="12" y="20" width="8" height="10" /></svg>
                        )}
                        {l.mode === "location" ? (
                          <div className="mp-listing-badge" style={{ background: "var(--blue-bg)", color: "var(--blue-text)" }}>À louer</div>
                        ) : (
                          <div className="mp-listing-badge" style={{ background: "var(--green-light-bg)", color: "var(--green-text)" }}>À vendre</div>
                        )}
                        {l.lienVisite && <div className="mp-listing-badge mp-badge-virtual" style={{ top: "auto", bottom: 8 }}>Visite virtuelle</div>}
                        <div className="cmp-checkbox-wrapper">
                          <label
                            className={`cmp-checkbox-label${compareIds.includes(l.id) ? " checked" : ""}`}
                            title={compareIds.includes(l.id) ? "Retirer de la comparaison" : compareIds.length >= 3 ? "Maximum 3 annonces" : "Ajouter à la comparaison"}
                            onClick={(e) => toggleCompare(l.id, e)}
                          >
                            <input type="checkbox" checked={compareIds.includes(l.id)} readOnly />
                            {compareIds.includes(l.id) ? (
                              <svg viewBox="0 0 14 14"><polyline points="3 7 6 10 11 4" /></svg>
                            ) : (
                              <svg viewBox="0 0 14 14"><line x1="4" y1="4" x2="10" y2="4" /><line x1="4" y1="7" x2="10" y2="7" /><line x1="4" y1="10" x2="8" y2="10" /></svg>
                            )}
                          </label>
                        </div>
                      </div>
                      <div className="mp-listing-body">
                        <div>
                          <div className="mp-listing-price">{fmtPrice(l.prix, l.mode)}</div>
                          <div className="mp-listing-price-sub">{TYPE_LABELS[l.type] ?? l.type} · {quartierNom}</div>
                        </div>
                        <div className="mp-listing-title">{l.titre}</div>
                        <div className="mp-listing-address">{l.adresse}</div>
                        <div className="mp-listing-specs">
                          <div className="mp-spec"><svg viewBox="0 0 14 14"><path d="M1 11V5l6-4 6 4v6" /><rect x="4" y="7" width="6" height="4" /></svg>{l.chambres} ch.</div>
                          <div className="mp-spec"><svg viewBox="0 0 14 14"><rect x="2" y="4" width="8" height="6" rx="1" /><path d="M10 7h2v3H2" /></svg>{l.sallesDeBain} sdb</div>
                          <div className="mp-spec"><svg viewBox="0 0 14 14"><rect x="1" y="1" width="12" height="12" rx="1" /><path d="M1 5h12M5 1v12" /></svg>{l.superficie.toLocaleString("fr-CA")} pi²</div>
                          {l.lienVisite && (
                            <div className="mp-spec" style={{ color: "var(--blue-text)" }}>
                              <svg viewBox="0 0 14 14" stroke="var(--blue-text)"><circle cx="7" cy="7" r="5" /><path d="M7 2a8 8 0 010 10M7 2a8 8 0 000 10" /><line x1="2" y1="7" x2="12" y2="7" /></svg>
                              Visite 360°
                            </div>
                          )}
                        </div>
                        <div className="mp-listing-footer">
                          <span className="mp-listing-date">{timeAgo(l.creeLe)}</span>
                          <button className={`mp-fav-btn${favs.has(l.id) ? " active" : ""}`} onClick={(e) => toggleFav(l.id, e)}>
                            <svg viewBox="0 0 14 14"><path d="M7 12S1 8 1 4.5A3.5 3.5 0 017 2.6 3.5 3.5 0 0113 4.5C13 8 7 12 7 12z" /></svg>
                          </button>
                        </div>
                      </div>
                    </Link>
                  );
                })}
                {/* Pagination */}
                {hasMore && (
                  <button
                    onClick={() => fetchListings(page + 1, true)}
                    className="w-full py-3 rounded-xl text-[13px] font-medium transition-colors hover-bg"
                    style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)", color: "var(--text-secondary)" }}
                  >
                    Charger plus d&apos;annonces
                  </button>
                )}
              </>
            )}
          </div>

          <div className="mp-sidebar hidden md:block">
            <button className="mp-sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? "Masquer le menu ▲" : "Marché, quartiers, ressources ▼"}
            </button>
            <div className="hidden md:block" style={sidebarOpen ? { display: "block" } : undefined}>
            <Link href="/" className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-[13px] font-medium transition-colors hover-bg mb-3.5" style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)", color: "var(--text-secondary)" }}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
              Retour au forum nid.local
            </Link>

            <div className="mp-sidebar-card">
              <h3>Marché en ce moment</h3>
              <div className="mp-stat-row"><span>Annonces actives</span><span>{total}</span></div>
            </div>

            {Object.keys(quartierCounts).length > 0 && (
              <div className="mp-sidebar-card">
                <h3>Par quartier</h3>
                {Object.entries(quartierCounts).sort(([, a], [, b]) => b - a).map(([name, count]) => (
                  <div key={name} className="mp-quartier-stat"><span>{name}</span><span className="mp-qs-count">{count}</span></div>
                ))}
              </div>
            )}

            <div className="mp-sidebar-card">
              <h3>Alerte courriel</h3>
              <div style={{ fontSize: 13, color: "var(--text-tertiary)", marginBottom: 10, lineHeight: 1.55 }}>Reçois un courriel dès qu&apos;une nouvelle annonce correspond à tes critères.</div>
              <button className="mp-btn-primary btn-press" style={{ width: "100%", borderRadius: 8 }}>Créer une alerte</button>
            </div>

            <div className="mp-sidebar-card" style={{ padding: 0 }}>
              <h3 style={{ padding: "14px 16px 0" }}>Posts populaires</h3>
              <ul>
                {[
                  { title: "Acheter sans courtier : mon expérience", quartier: "Rosemont", comments: 34 },
                  { title: "Prix des condos à Villeray — ça monte encore?", quartier: "Villeray", comments: 28 },
                  { title: "Inspection pré-achat : vaut la peine ou pas?", quartier: "Plateau", comments: 19 },
                  { title: "Duplex occupant — les pièges à éviter", quartier: "Hochelaga", comments: 15 },
                ].map((post, i) => (
                  <li key={i} style={{ borderBottom: i < 3 ? "0.5px solid var(--border)" : "none" }}>
                    <Link href="/" className="block px-4 py-2.5 transition-colors hover-bg">
                      <div className="text-[12px] font-medium leading-snug" style={{ color: "var(--text-primary)" }}>{post.title}</div>
                      <div className="text-[11px] mt-1" style={{ color: "var(--text-tertiary)" }}>{post.quartier} · {post.comments} réponses</div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mp-sidebar-card" style={{ padding: 0 }}>
              <h3 style={{ padding: "14px 16px 0" }}>Ressources utiles</h3>
              <ul>
                {ressourcesUtiles.map((r, i, arr) => (
                  <li key={r.label} style={{ borderBottom: i < arr.length - 1 ? "0.5px solid var(--border)" : "none" }}>
                    <Link href={r.href} className="flex items-center justify-between px-4 py-2.5 transition-colors hover-bg">
                      <span className="text-[13px]" style={{ color: "var(--text-primary)" }}>{r.label}</span>
                      <svg className="w-3 h-3 shrink-0" style={{ color: "var(--text-tertiary)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-[11px] text-center px-2" style={{ color: "var(--text-tertiary)" }}>© 2026 nid.local — Fait au Québec</p>
            </div>
          </div>
        </div>
        )}
      </div>

      {/* Floating compare bar */}
      {compareIds.length >= 2 && (
        <Link
          href={`/annonces/comparer?ids=${compareIds.join(",")}`}
          className="cmp-floating-bar"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="1" y="1" width="5" height="14" rx="1" />
            <rect x="10" y="1" width="5" height="14" rx="1" />
          </svg>
          Comparer ({compareIds.length})
          <button
            className="cmp-floating-clear"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCompareIds([]); }}
          >
            Effacer
          </button>
        </Link>
      )}
    </>
  );
}
