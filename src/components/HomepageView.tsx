"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Post, Categorie } from "@/lib/types";
import { quartiers as allQuartiers } from "@/lib/data";
import { PostCard } from "./PostCard";
import { Sidebar } from "./Sidebar";

type Ville = "Montréal" | "Québec";
type Tri = "recent" | "populaire" | "actif";

const VILLES: Ville[] = ["Montréal", "Québec"];

const CATEGORIES: { value: Categorie | "tous"; label: string }[] = [
  { value: "tous", label: "Tout" },
  { value: "vente", label: "Vente" },
  { value: "location", label: "Location" },
  { value: "question", label: "Questions" },
  { value: "renovation", label: "Conseils" },
  { value: "voisinage", label: "Voisinage" },
  { value: "alerte", label: "Alertes" },
];

const TRIS: { value: Tri; label: string }[] = [
  { value: "recent", label: "Récents" },
  { value: "populaire", label: "Populaires" },
  { value: "actif", label: "Actifs" },
];

const badgeLabels: Record<string, string> = {
  alerte: "Alerte", question: "Question", vente: "Vente",
  location: "Location", renovation: "Conseil", voisinage: "Voisinage",
};

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function matchesSearch(post: Post, q: string): boolean {
  if (!q.trim()) return true;
  const lq = q.toLowerCase();
  return (
    post.titre.toLowerCase().includes(lq) ||
    post.contenu.toLowerCase().includes(lq) ||
    post.auteur.toLowerCase().includes(lq) ||
    post.quartier.nom.toLowerCase().includes(lq) ||
    post.categorie.toLowerCase().includes(lq) ||
    (badgeLabels[post.categorie] ?? "").toLowerCase().includes(lq)
  );
}

// ─── SearchDropdown ────────────────────────────────────────────────────────────

function SearchDropdown({ results, query, onSelect }: {
  results: Post[];
  query: string;
  onSelect: () => void;
}) {
  if (!query.trim() || results.length === 0) return null;
  return (
    <div
      className="absolute top-full left-0 right-0 mt-1.5 rounded-xl overflow-hidden z-50"
      style={{
        background: "var(--bg-card)",
        border: "0.5px solid var(--border)",
        boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
      }}
    >
      {results.slice(0, 4).map((post) => (
        <Link
          key={post.id}
          href={`/post/${post.id}`}
          onClick={onSelect}
          className="flex items-start gap-3 px-4 py-3 transition-colors"
          style={{ borderBottom: "0.5px solid var(--border)" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-secondary)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          <span
            className="shrink-0 mt-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold leading-none"
            style={{
              background: "var(--green-light-bg)",
              color: "var(--green-text)",
            }}
          >
            {badgeLabels[post.categorie] ?? post.categorie}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-medium truncate" style={{ color: "var(--text-primary)" }}>
              {post.titre}
            </p>
            <p className="text-[11px] mt-0.5" style={{ color: "var(--text-tertiary)" }}>
              {post.quartier.nom} · {post.auteur}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}

// ─── HomepageView ──────────────────────────────────────────────────────────────

export function HomepageView({ posts }: { posts: Post[] }) {
  const [ville, setVille] = useState<Ville>("Montréal");
  const [categorie, setCategorie] = useState<string>("tous");
  const [tri, setTri] = useState<Tri>("recent");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filtered = posts
    .filter((p) => p.quartier.ville === ville)
    .filter((p) => categorie === "tous" || p.categorie === categorie)
    .filter((p) => matchesSearch(p, searchQuery))
    .sort((a, b) => {
      if (tri === "recent") return new Date(b.creeLe).getTime() - new Date(a.creeLe).getTime();
      if (tri === "populaire") return b.nbVotes - a.nbVotes;
      return b.nbCommentaires - a.nbCommentaires;
    });

  const searchResults = searchQuery.trim()
    ? posts.filter((p) => matchesSearch(p, searchQuery))
    : [];

  const quartiersVille = allQuartiers.filter((q) => q.ville === ville);
  const quartierActif = quartiersVille[0];

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "var(--bg-page)" }}>
      {/* ── Topbar ── */}
      <header
        className="sticky top-0 z-50"
        style={{ background: "var(--bg-card)", borderBottom: "0.5px solid var(--border)" }}
      >
        <div className="max-w-[1100px] mx-auto px-5 h-[52px] flex items-center gap-4">
          {/* Logo */}
          <Link href="/" className="shrink-0 text-[18px] font-black tracking-tight leading-none">
            <span style={{ color: "var(--text-primary)" }}>nid</span>
            <span style={{ color: "var(--green)" }}>.local</span>
          </Link>

          {/* Search bar */}
          <div className="flex-1 relative" ref={searchRef}>
            <div
              className="flex items-center gap-2 px-3 h-[34px] rounded-[20px] transition-all"
              style={{
                background: searchFocused ? "var(--bg-card)" : "var(--bg-secondary)",
                border: searchFocused
                  ? "1.5px solid var(--green)"
                  : "1.5px solid transparent",
              }}
            >
              <svg className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--text-tertiary)" }}
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Rechercher une discussion, un quartier…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                className="flex-1 bg-transparent text-[13px] outline-none min-w-0"
                style={{
                  color: "var(--text-primary)",
                  caretColor: "var(--green)",
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="shrink-0 transition-colors"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            {searchFocused && searchResults.length > 0 && (
              <SearchDropdown
                results={searchResults}
                query={searchQuery}
                onSelect={() => { setSearchFocused(false); setSearchQuery(""); }}
              />
            )}
          </div>

          {/* City pills */}
          <nav className="hidden md:flex items-center gap-1 shrink-0">
            {VILLES.map((v) => (
              <button
                key={v}
                onClick={() => setVille(v)}
                className="px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors"
                style={
                  ville === v
                    ? { background: "var(--green-light-bg)", color: "var(--green-text)" }
                    : { color: "var(--text-secondary)" }
                }
              >
                {v}
              </button>
            ))}
          </nav>

          {/* Auth */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              className="text-[13px] font-medium transition-colors hidden md:block"
              style={{ color: "var(--text-secondary)" }}
            >
              Se connecter
            </button>
            <button
              className="text-[13px] font-semibold text-white px-3.5 py-1.5 rounded-lg"
              style={{ background: "var(--green)" }}
            >
              S&apos;inscrire
            </button>
          </div>
        </div>
      </header>

      {/* ── Breadcrumb ── */}
      <div style={{ background: "var(--bg-card)", borderBottom: "0.5px solid var(--border)" }}>
        <div
          className="max-w-[1100px] mx-auto px-5 py-2 flex items-center gap-1.5 text-[12px]"
          style={{ color: "var(--text-tertiary)" }}
        >
          <span>Québec</span>
          <span>/</span>
          <button onClick={() => {}} className="transition-colors hover:opacity-70">{ville}</button>
          <span>/</span>
          <span className="font-medium" style={{ color: "var(--text-secondary)" }}>
            {quartierActif?.nom ?? "Tous les quartiers"}
          </span>
        </div>
      </div>

      {/* ── Contenu ── */}
      <main className="flex-1 max-w-[1100px] mx-auto w-full px-5 py-5">
        <div className="flex gap-5 items-start">
          {/* Fil */}
          <div className="flex-1 min-w-0 space-y-3">
            {/* Filtres */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-1 flex-wrap">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setCategorie(cat.value)}
                    className="px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors"
                    style={
                      categorie === cat.value
                        ? { background: "var(--green)", color: "#fff" }
                        : {
                            background: "var(--bg-card)",
                            color: "var(--text-secondary)",
                            border: "0.5px solid var(--border)",
                          }
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
                    onClick={() => setTri(t.value)}
                    className="px-2.5 py-1.5 text-[12px] font-medium transition-colors rounded-lg"
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

            {/* Bannière résultats */}
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
                  onClick={() => setSearchQuery("")}
                  className="text-[12px] font-medium underline underline-offset-2"
                  style={{ color: "var(--green-text)" }}
                >
                  Effacer la recherche
                </button>
              </div>
            )}

            {/* En-tête fil */}
            <div className="flex items-center justify-between">
              <p
                className="text-[11px] font-semibold uppercase tracking-wider"
                style={{ color: "var(--text-tertiary)" }}
              >
                Discussions du quartier{" "}
                <span
                  className="ml-1 px-1.5 py-0.5 rounded-md text-[11px] font-bold normal-case tracking-normal"
                  style={{ background: "var(--green-light-bg)", color: "var(--green-text)" }}
                >
                  {filtered.length}
                </span>
              </p>
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
                    : "Aucune discussion dans ce quartier pour l'instant."}
                </p>
                {!searchQuery.trim() && (
                  <button
                    className="mt-4 text-[13px] font-semibold text-white px-4 py-2 rounded-lg"
                    style={{ background: "var(--green)" }}
                  >
                    Soyez le premier à publier
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                {filtered.map((post) => (
                  <PostCard key={post.id} post={post} searchQuery={searchQuery} />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <Sidebar />
        </div>
      </main>
    </div>
  );
}
