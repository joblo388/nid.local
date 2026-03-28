"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Post, Categorie } from "@/lib/types";
import { villes, quartiers, quartiersDeVille, villeBySlug } from "@/lib/data";
import { PostCard } from "./PostCard";
import { Sidebar, SidebarStats } from "./Sidebar";

const PAGE_SIZE = 20;

function Pagination({ page, total, onPage }: { page: number; total: number; onPage: (p: number) => void }) {
  const totalPages = Math.ceil(total / PAGE_SIZE);
  if (totalPages <= 1) return null;

  const pages: (number | "…")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else if (page <= 4) {
    for (let i = 1; i <= 5; i++) pages.push(i);
    pages.push("…");
    pages.push(totalPages);
  } else if (page >= totalPages - 3) {
    pages.push(1);
    pages.push("…");
    for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    pages.push("…");
    pages.push(page - 1);
    pages.push(page);
    pages.push(page + 1);
    pages.push("…");
    pages.push(totalPages);
  }

  return (
    <div className="flex items-center justify-center gap-1 pt-2">
      <button
        onClick={() => onPage(page - 1)}
        disabled={page === 1}
        className="px-2 py-1.5 rounded-lg text-[13px] transition-opacity disabled:opacity-30 hover:opacity-70"
        style={{ color: "var(--text-secondary)" }}
      >
        «
      </button>
      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`e${i}`} className="px-1 text-[12px]" style={{ color: "var(--text-tertiary)" }}>…</span>
        ) : (
          <button
            key={p}
            onClick={() => onPage(p as number)}
            className="w-8 h-8 rounded-lg text-[12px] font-medium transition-colors"
            style={
              p === page
                ? { background: "var(--green)", color: "#fff" }
                : { color: "var(--text-secondary)" }
            }
          >
            {p}
          </button>
        )
      )}
      <button
        onClick={() => onPage(page + 1)}
        disabled={page === Math.ceil(total / PAGE_SIZE)}
        className="px-2 py-1.5 rounded-lg text-[13px] transition-opacity disabled:opacity-30 hover:opacity-70"
        style={{ color: "var(--text-secondary)" }}
      >
        »
      </button>
    </div>
  );
}

// ─── Constantes ───────────────────────────────────────────────────────────────

const CATEGORIES: { value: Categorie | "tous"; label: string }[] = [
  { value: "tous", label: "Tout" },
  { value: "vente", label: "Vente" },
  { value: "location", label: "Location" },
  { value: "question", label: "Questions" },
  { value: "renovation", label: "Conseils" },
  { value: "voisinage", label: "Voisinage" },
  { value: "construction", label: "Construction" },
  { value: "legal", label: "Légal" },
  { value: "financement", label: "Financement" },
  { value: "copropriete", label: "Co-propriété" },
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

function SearchDropdown({ results, query, onSelect }: { results: Post[]; query: string; onSelect: () => void }) {
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
      <Link
        href={`/recherche?q=${encodeURIComponent(query)}`}
        onClick={onSelect}
        className="flex items-center justify-between px-4 py-2.5 text-[12px] font-medium transition-colors hover-bg"
        style={{ color: "var(--green)" }}
      >
        <span>Voir tous les résultats pour &ldquo;{query}&rdquo;</span>
        <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  );
}

// ─── HomepageView ──────────────────────────────────────────────────────────────

type Props = {
  initialPosts: Post[];
  initialTotal: number;
  initialVotedPostIds: string[];
  initialBookmarkedPostIds: string[];
  sidebarStats: SidebarStats;
};

export function HomepageView({ initialPosts, initialTotal, initialVotedPostIds, initialBookmarkedPostIds, sidebarStats }: Props) {
  const [villeSlug, setVilleSlug] = useState("montreal");
  const [quartierSlug, setQuartierSlug] = useState("tous");
  const [categorie, setCategorie] = useState<string>("tous");
  const [tri, setTri] = useState<"recent" | "populaire" | "actif">("populaire");

  const [posts, setPosts] = useState<Post[]>(initialPosts ?? []);
  const [total, setTotal] = useState(initialTotal);
  const [votedPostIds, setVotedPostIds] = useState<Set<string>>(() => new Set(initialVotedPostIds));
  const [bookmarkedPostIds, setBookmarkedPostIds] = useState<Set<string>>(() => new Set(initialBookmarkedPostIds));
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [dbResults, setDbResults] = useState<Post[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function fetchPosts(params: {
    villeSlug: string; quartierSlug: string; categorie: string; tri: string; page: number;
  }) {
    setLoading(true);
    try {
      const qs = new URLSearchParams({
        villeSlug: params.villeSlug,
        quartierSlug: params.quartierSlug,
        categorie: params.categorie,
        tri: params.tri,
        page: String(params.page),
      });
      const res = await fetch(`/api/posts?${qs}`);
      if (!res.ok) return;
      const data = await res.json();
      setPosts(data.posts);
      setTotal(data.total);
      setVotedPostIds((prev) => {
        const next = new Set(prev);
        (data.votedPostIds as string[]).forEach((id) => next.add(id));
        return next;
      });
      setBookmarkedPostIds((prev) => {
        const next = new Set(prev);
        (data.bookmarkedPostIds as string[]).forEach((id) => next.add(id));
        return next;
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    setPage(1);
    fetchPosts({ villeSlug, quartierSlug, categorie, tri, page: 1 });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [villeSlug, quartierSlug, categorie, tri]);

  function selectVille(slug: string) {
    setVilleSlug(slug);
    setQuartierSlug("tous");
  }

  function goToPage(p: number) {
    setPage(p);
    fetchPosts({ villeSlug, quartierSlug, categorie, tri, page: p });
    listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
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
          <QuartierBar villeSlug={villeSlug} selected={quartierSlug} onSelect={(s) => setQuartierSlug(s)} />
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
                  query={searchQuery}
                  onSelect={() => { setSearchFocused(false); handleSearchChange(""); }}
                />
              )}
            </div>

            {/* Filtres catégorie */}
            <div className="flex items-center gap-1 flex-wrap">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setCategorie(cat.value)}
                  className="px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors whitespace-nowrap"
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

            {/* En-tête + tri */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
                  Discussions{" "}
                  <span
                    className="ml-1 px-1.5 py-0.5 rounded-md text-[11px] font-bold normal-case tracking-normal"
                    style={{ background: "var(--green-light-bg)", color: "var(--green-text)" }}
                  >
                    {total}
                  </span>
                </p>
                <div className="flex items-center gap-0.5">
                  {TRIS.map((t) => (
                    <button
                      key={t.value}
                      onClick={() => setTri(t.value)}
                      className="px-2.5 py-1.5 text-[12px] font-medium rounded-lg whitespace-nowrap"
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
            <div ref={listRef}>
            {loading && posts.length === 0 ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="rounded-xl h-[100px] animate-pulse"
                    style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }} />
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div
                className="rounded-xl px-6 py-12 text-center"
                style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
              >
                <p className="text-[14px]" style={{ color: "var(--text-secondary)" }}>
                  Aucune discussion à {quartierActif?.nom ?? villeActive?.nom} pour l&apos;instant.
                </p>
                <Link
                  href="/nouveau-post"
                  className="inline-block mt-4 text-[13px] font-semibold text-white px-4 py-2 rounded-lg"
                  style={{ background: "var(--green)" }}
                >
                  Soyez le premier à publier
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} searchQuery={searchQuery} hasVoted={votedPostIds.has(post.id)} isBookmarked={bookmarkedPostIds.has(post.id)} />
                ))}
                <Pagination page={page} total={total} onPage={goToPage} />
              </div>
            )}
            </div>
          </div>

          {/* Sidebar — desktop uniquement */}
          <Sidebar villeSlug={villeSlug} stats={sidebarStats} />
        </div>
      </main>
    </>
  );
}
