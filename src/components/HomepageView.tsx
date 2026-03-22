"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Post, Categorie } from "@/lib/types";
import { villes, quartiers, quartiersDeVille, villeBySlug } from "@/lib/data";
import { PostCard } from "./PostCard";
import { Sidebar } from "./Sidebar";

// ─── Constantes ───────────────────────────────────────────────────────────────

const CATEGORIES: { value: Categorie | "tous"; label: string }[] = [
  { value: "tous", label: "Tout" },
  { value: "vente", label: "Vente" },
  { value: "location", label: "Location" },
  { value: "question", label: "Questions" },
  { value: "renovation", label: "Conseils" },
  { value: "voisinage", label: "Voisinage" },
  { value: "alerte", label: "Alertes" },
];

const TRIS = [
  { value: "recent", label: "Récents" },
  { value: "populaire", label: "Populaires" },
  { value: "actif", label: "Actifs" },
] as const;

const badgeLabels: Record<string, string> = {
  alerte: "Alerte", question: "Question", vente: "Vente",
  location: "Location", renovation: "Conseil", voisinage: "Voisinage",
};

// ─── VilleBar ─────────────────────────────────────────────────────────────────

function VilleBar({ selected, onSelect }: { selected: string; onSelect: (slug: string) => void }) {
  return (
    <div style={{ background: "var(--bg-card)", borderBottom: "0.5px solid var(--border)" }}>
      <div className="max-w-[1100px] mx-auto px-5">
        <div className="flex gap-0.5 overflow-x-auto py-2" style={{ scrollbarWidth: "none" }}>
          {villes.map((v) => (
            <button
              key={v.slug}
              onClick={() => onSelect(v.slug)}
              className="px-3 py-1.5 rounded-lg text-[13px] font-medium whitespace-nowrap shrink-0 transition-colors"
              style={
                selected === v.slug
                  ? { background: "var(--green-light-bg)", color: "var(--green-text)" }
                  : { color: "var(--text-secondary)" }
              }
            >
              {v.nom}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── QuartierBar ──────────────────────────────────────────────────────────────

function QuartierBar({ villeSlug, selected, onSelect }: {
  villeSlug: string; selected: string; onSelect: (slug: string) => void;
}) {
  const qDeVille = quartiersDeVille(villeSlug);
  if (qDeVille.length <= 1) return null;

  return (
    <div style={{ background: "var(--bg-secondary)", borderBottom: "0.5px solid var(--border)" }}>
      <div className="max-w-[1100px] mx-auto px-5">
        <div className="flex gap-0.5 overflow-x-auto py-1.5" style={{ scrollbarWidth: "none" }}>
          <button
            onClick={() => onSelect("tous")}
            className="px-2.5 py-1 rounded-md text-[12px] font-medium whitespace-nowrap shrink-0 transition-colors"
            style={selected === "tous" ? { background: "var(--green)", color: "#fff" } : { color: "var(--text-secondary)" }}
          >
            Tous
          </button>
          {qDeVille.map((q) => (
            <button
              key={q.slug}
              onClick={() => onSelect(q.slug)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-medium whitespace-nowrap shrink-0 transition-colors"
              style={selected === q.slug ? { background: "var(--green)", color: "#fff" } : { color: "var(--text-secondary)" }}
            >
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${q.couleur}`} />
              {q.nom}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── SearchBar ────────────────────────────────────────────────────────────────

function SearchBar({ value, onChange }: { value: string; onChange: (q: string) => void }) {
  return (
    <div
      className="flex items-center gap-2 px-3 h-[38px] rounded-xl w-full"
      style={{
        background: "var(--bg-card)",
        border: "0.5px solid var(--border)",
      }}
    >
      <svg className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--text-tertiary)" }}
        fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="text"
        placeholder="Rechercher une discussion, une ville…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-transparent text-[13px] outline-none min-w-0"
        style={{ color: "var(--text-primary)", caretColor: "var(--green)" }}
      />
      {value && (
        <button onClick={() => onChange("")} className="shrink-0" style={{ color: "var(--text-tertiary)" }}>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

// ─── SearchDropdown ────────────────────────────────────────────────────────────

function SearchDropdown({ results, onSelect }: { results: Post[]; onSelect: () => void }) {
  if (results.length === 0) return null;
  return (
    <div
      className="absolute top-full left-0 right-0 mt-1.5 rounded-xl overflow-hidden z-40"
      style={{
        background: "var(--bg-card)",
        border: "0.5px solid var(--border)",
        boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
      }}
    >
      {results.slice(0, 5).map((post) => (
        <Link
          key={post.id}
          href={`/post/${post.id}`}
          onClick={onSelect}
          className="flex items-start gap-3 px-4 py-3 transition-colors hover-bg"
          style={{ borderBottom: "0.5px solid var(--border)" }}
        >
          <span
            className="shrink-0 mt-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold leading-none"
            style={{ background: "var(--green-light-bg)", color: "var(--green-text)" }}
          >
            {badgeLabels[post.categorie] ?? post.categorie}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-medium truncate" style={{ color: "var(--text-primary)" }}>
              {post.titre}
            </p>
            <p className="text-[11px] mt-0.5" style={{ color: "var(--text-tertiary)" }}>
              {villeBySlug[post.quartier.villeSlug]?.nom} · {post.quartier.nom}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}

// ─── HomepageView ──────────────────────────────────────────────────────────────

export function HomepageView({ posts, votedPostIds = new Set() }: { posts: Post[]; votedPostIds?: Set<string> }) {
  const [villeSlug, setVilleSlug] = useState("montreal");
  const [quartierSlug, setQuartierSlug] = useState("tous");
  const [categorie, setCategorie] = useState<string>("tous");
  const [tri, setTri] = useState<"recent" | "populaire" | "actif">("populaire");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [dbResults, setDbResults] = useState<Post[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function selectVille(slug: string) {
    setVilleSlug(slug);
    setQuartierSlug("tous");
    setCategorie("tous");
    setPage(1);
  }

  function handleSearchChange(q: string) {
    setSearchQuery(q);
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    if (q.trim().length < 2) { setDbResults([]); return; }
    searchTimerRef.current = setTimeout(async () => {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      if (res.ok) setDbResults(await res.json());
    }, 300);
  }

  const filtered = posts
    .filter((p) => p.quartier.villeSlug === villeSlug)
    .filter((p) => quartierSlug === "tous" || p.quartier.slug === quartierSlug)
    .filter((p) => categorie === "tous" || p.categorie === categorie)
    .sort((a, b) => {
      if (a.epingle && !b.epingle) return -1;
      if (!a.epingle && b.epingle) return 1;
      if (tri === "recent") return new Date(b.creeLe).getTime() - new Date(a.creeLe).getTime();
      if (tri === "populaire") return b.nbVotes - a.nbVotes;
      return b.nbCommentaires - a.nbCommentaires;
    });

  const PAGE_SIZE = 20;
  const paginated = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = filtered.length > page * PAGE_SIZE;

  const searchResults = searchQuery.trim().length >= 2 ? dbResults : [];
  const villeActive = villeBySlug[villeSlug];
  const quartierActif = quartiers.find((q) => q.slug === quartierSlug);
  const qDeVille = quartiersDeVille(villeSlug);
  const hasQuartiers = qDeVille.length > 1;

  return (
    <>
      {/* Barres de navigation — sticky sous le header */}
      <div className="sticky z-40" style={{ top: "52px" }}>
        <VilleBar selected={villeSlug} onSelect={selectVille} />
        {hasQuartiers && (
          <QuartierBar villeSlug={villeSlug} selected={quartierSlug} onSelect={(s) => { setQuartierSlug(s); setPage(1); }} />
        )}
      </div>

      {/* Breadcrumb */}
      <div style={{ borderBottom: "0.5px solid var(--border)" }}>
        <div
          className="max-w-[1100px] mx-auto px-5 py-2 flex items-center gap-1.5 text-[12px]"
          style={{ color: "var(--text-tertiary)" }}
        >
          <span>Province de Québec</span>
          <span>/</span>
          <button
            onClick={() => setQuartierSlug("tous")}
            className="transition-opacity hover:opacity-70"
            style={{ color: quartierActif ? "var(--text-secondary)" : "var(--green-text)" }}
          >
            {villeActive?.nom}
          </button>
          {quartierActif && (
            <>
              <span>/</span>
              <span className="font-medium" style={{ color: "var(--green-text)" }}>{quartierActif.nom}</span>
            </>
          )}
        </div>
      </div>

      {/* Contenu principal */}
      <main className="flex-1 max-w-[1100px] mx-auto w-full px-5 py-5">
        <div className="flex gap-5 items-start">
          {/* Fil */}
          <div className="flex-1 min-w-0 space-y-3">

            {/* Recherche */}
            <div className="relative" ref={searchRef}>
              <SearchBar
                value={searchQuery}
                onChange={(q) => { handleSearchChange(q); setSearchFocused(true); }}
              />
              {searchFocused && searchResults.length > 0 && (
                <SearchDropdown
                  results={searchResults}
                  onSelect={() => { setSearchFocused(false); handleSearchChange(""); }}
                />
              )}
            </div>

            {/* Filtres catégorie + tri + CTA mobile */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-1 flex-wrap">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => { setCategorie(cat.value); setPage(1); }}
                    className="px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors"
                    style={
                      categorie === cat.value
                        ? { background: "var(--green)", color: "#fff" }
                        : { background: "var(--bg-card)", color: "var(--text-secondary)", border: "0.5px solid var(--border)" }
                    }
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-0.5">
                {TRIS.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => { setTri(t.value); setPage(1); }}
                    className="px-2.5 py-1.5 text-[12px] font-medium rounded-lg"
                    style={
                      tri === t.value
                        ? { color: "var(--text-primary)", textDecoration: "underline", textUnderlineOffset: "3px" }
                        : { color: "var(--text-tertiary)" }
                    }
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Bannière résultats de recherche */}
            {searchQuery.trim() && (
              <div
                className="flex items-center justify-between px-4 py-2.5 rounded-xl text-[13px]"
                style={{ background: "var(--green-light-bg)", border: "0.5px solid var(--green)" }}
              >
                <span style={{ color: "var(--green-text)" }}>
                  <strong>{filtered.length}</strong>{" "}
                  {filtered.length === 1 ? "résultat" : "résultats"} pour &laquo;{searchQuery}&raquo;
                </span>
                <button
                  onClick={() => handleSearchChange("")}
                  className="text-[12px] font-medium underline underline-offset-2"
                  style={{ color: "var(--green-text)" }}
                >
                  Effacer
                </button>
              </div>
            )}

            {/* En-tête + CTA */}
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
                Discussions{" "}
                <span
                  className="ml-1 px-1.5 py-0.5 rounded-md text-[11px] font-bold normal-case tracking-normal"
                  style={{ background: "var(--green-light-bg)", color: "var(--green-text)" }}
                >
                  {filtered.length}
                </span>
              </p>
              {/* CTA visible sur mobile uniquement */}
              <Link
                href="/nouveau-post"
                className="md:hidden text-[13px] font-semibold text-white px-3 py-1.5 rounded-lg transition-opacity hover:opacity-90"
                style={{ background: "var(--green)" }}
              >
                + Publier
              </Link>
              <Link
                href={`/ville/${villeSlug}`}
                className="hidden md:block text-[11px] font-medium transition-opacity hover:opacity-70"
                style={{ color: "var(--green)" }}
              >
                Voir la page de {villeActive?.nom} →
              </Link>
            </div>

            {/* Posts */}
            {filtered.length === 0 ? (
              <div
                className="rounded-xl px-6 py-12 text-center"
                style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
              >
                <p className="text-[14px]" style={{ color: "var(--text-secondary)" }}>
                  {searchQuery.trim()
                    ? "Aucun résultat — Essaie un autre mot-clé"
                    : `Aucune discussion à ${quartierActif?.nom ?? villeActive?.nom} pour l'instant.`}
                </p>
                {!searchQuery.trim() && (
                  <Link
                    href="/nouveau-post"
                    className="inline-block mt-4 text-[13px] font-semibold text-white px-4 py-2 rounded-lg"
                    style={{ background: "var(--green)" }}
                  >
                    Soyez le premier à publier
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                {paginated.map((post) => (
                  <PostCard key={post.id} post={post} searchQuery={searchQuery} hasVoted={votedPostIds.has(post.id)} />
                ))}
                {hasMore && (
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    className="w-full py-3 rounded-xl text-[13px] font-medium transition-colors hover-bg"
                    style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)", color: "var(--text-secondary)" }}
                  >
                    Charger plus ({filtered.length - page * PAGE_SIZE} restants)
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Sidebar — desktop uniquement */}
          <Sidebar villeSlug={villeSlug} posts={posts} />
        </div>
      </main>
    </>
  );
}
