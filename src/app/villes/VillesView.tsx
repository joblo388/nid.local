"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { villes, quartiersDeVille, villeBySlug } from "@/lib/data";
import { Post } from "@/lib/types";
import { PostCard } from "@/components/PostCard";
import { SkeletonPostCard } from "@/components/Skeleton";

const PAGE_SIZE = 20;
const regions = [...new Set(villes.map((v) => v.region))];

const CATEGORIES = [
  { value: "tous", label: "Tout" },
  { value: "vente", label: "Vente" },
  { value: "location", label: "Location" },
  { value: "question", label: "Questions" },
  { value: "renovation", label: "Conseils" },
  { value: "voisinage", label: "Voisinage" },
  { value: "construction", label: "Construction" },
  { value: "legal", label: "Légal" },
  { value: "financement", label: "Financement" },
  { value: "copropriete", label: "Condo" },
];

const TRIS = [
  { value: "populaire", label: "Populaires" },
  { value: "recent", label: "Récents" },
  { value: "actif", label: "Actifs" },
];

export function VillesView({ initialPosts, initialTotal }: { initialPosts: Post[]; initialTotal: number }) {
  const [villeSlug, setVilleSlug] = useState("montreal");
  const [quartierSlug, setQuartierSlug] = useState("");
  const [categorie, setCategorie] = useState("tous");
  const [tri, setTri] = useState<"populaire" | "recent" | "actif">("populaire");
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [total, setTotal] = useState(initialTotal);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialTotal > PAGE_SIZE);
  const [countsByQuartier, setCountsByQuartier] = useState<Record<string, number>>({});

  const ville = villeBySlug[villeSlug];
  const quartiersDispo = quartiersDeVille(villeSlug);

  const fetchPosts = useCallback(async (p = 1) => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("villeSlug", villeSlug);
    if (quartierSlug) params.set("quartierSlug", quartierSlug);
    if (categorie !== "tous") params.set("categorie", categorie);
    params.set("tri", tri);
    params.set("page", String(p));
    try {
      const res = await fetch(`/api/posts?${params}`);
      const data = await res.json();
      if (p === 1) {
        setPosts(data.posts);
      } else {
        setPosts((prev) => {
          const ids = new Set(prev.map((pp: Post) => pp.id));
          return [...prev, ...data.posts.filter((pp: Post) => !ids.has(pp.id))];
        });
      }
      setTotal(data.total);
      setHasMore(data.posts.length >= PAGE_SIZE);
      setPage(p);
    } catch { /* ignore */ }
    setLoading(false);
  }, [villeSlug, quartierSlug, categorie, tri]);

  // Fetch quartier counts for this ville
  useEffect(() => {
    fetch(`/api/posts?villeSlug=${villeSlug}&countOnly=1`)
      .catch(() => {});
    // Simple approach: use posts data to build counts
    const counts: Record<string, number> = {};
    posts.forEach((p) => {
      counts[p.quartier.slug] = (counts[p.quartier.slug] || 0) + 1;
    });
    setCountsByQuartier(counts);
  }, [villeSlug, posts]);

  useEffect(() => {
    fetchPosts(1);
  }, [fetchPosts]);

  function changeVille(slug: string) {
    setVilleSlug(slug);
    setQuartierSlug("");
    setCategorie("tous");
  }

  return (
    <main className="max-w-[1100px] mx-auto px-3 md:px-5 py-5 pb-24">
      {/* En-tête ville avec sélecteur */}
      <div className="mb-4">
        <div className="flex items-center gap-2 text-[12px] mb-2" style={{ color: "var(--text-tertiary)" }}>
          <Link href="/" className="hover:opacity-70 transition-opacity">Province de Québec</Link>
          <span>/</span>
          <span style={{ color: "var(--text-primary)" }}>{ville?.nom ?? "Toutes"}</span>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <select
            value={villeSlug}
            onChange={(e) => changeVille(e.target.value)}
            className="text-[20px] font-bold bg-transparent border-none outline-none cursor-pointer"
            style={{ color: "var(--text-primary)", appearance: "auto" }}
          >
            {regions.map((region) => (
              <optgroup key={region} label={region}>
                {villes.filter((v) => v.region === region).map((v) => (
                  <option key={v.slug} value={v.slug}>{v.nom}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
        <p className="text-[13px] mt-0.5" style={{ color: "var(--text-tertiary)" }}>
          {ville?.region}
        </p>
      </div>

      {/* Grille quartiers */}
      {quartiersDispo.length > 1 && (
        <div
          className="rounded-xl overflow-hidden mb-5"
          style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
        >
          <div className="px-4 py-3" style={{ borderBottom: "0.5px solid var(--border)" }}>
            <h2 className="text-[12px] font-semibold uppercase tracking-wider"
              style={{ color: "var(--text-tertiary)" }}>
              Quartiers
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3">
            {quartiersDispo.map((q, i) => {
              const nb = countsByQuartier[q.slug] ?? 0;
              const isActive = quartierSlug === q.slug;
              return (
                <button
                  key={q.slug}
                  onClick={() => setQuartierSlug(isActive ? "" : q.slug)}
                  className="flex items-center gap-2 px-4 py-3 transition-colors hover-bg text-left"
                  style={{
                    borderBottom: "0.5px solid var(--border)",
                    borderRight: (i % 3 !== 2) ? "0.5px solid var(--border)" : "none",
                    background: isActive ? "var(--green-light-bg)" : "transparent",
                  }}
                >
                  <span className={`w-2 h-2 rounded-full shrink-0 ${q.couleur}`} />
                  <span className="text-[13px] flex-1" style={{ color: isActive ? "var(--green-text)" : "var(--text-primary)" }}>
                    {q.nom}
                  </span>
                  {nb > 0 && (
                    <span
                      className="text-[11px] font-bold px-1.5 py-0.5 rounded-md"
                      style={{ background: isActive ? "var(--green)" : "var(--green-light-bg)", color: isActive ? "#fff" : "var(--green-text)" }}
                    >
                      {nb}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Catégories + tri */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
            Discussions{" "}
            <span className="ml-1 px-1.5 py-0.5 rounded-md text-[11px] font-bold normal-case tracking-normal"
              style={{ background: "var(--green-light-bg)", color: "var(--green-text)" }}>
              {total}
            </span>
          </p>
          <div className="flex items-center gap-1">
            {TRIS.map((t) => (
              <button
                key={t.value}
                onClick={() => setTri(t.value as typeof tri)}
                className="px-2.5 py-1 text-[12px] font-medium rounded-lg"
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
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategorie(cat.value)}
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
      </div>

      {/* Posts */}
      <div className="space-y-2">
        {loading && posts.length === 0 ? (
          <>
            <SkeletonPostCard />
            <SkeletonPostCard />
            <SkeletonPostCard />
          </>
        ) : posts.length === 0 ? (
          <div
            className="rounded-xl px-6 py-12 text-center"
            style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
          >
            <p className="text-[14px]" style={{ color: "var(--text-secondary)" }}>
              Aucune discussion à {ville?.nom} pour l&apos;instant.
            </p>
          </div>
        ) : (
          <>
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
            {hasMore && (
              <button
                onClick={() => fetchPosts(page + 1)}
                disabled={loading}
                className="w-full py-3 rounded-xl text-[13px] font-medium transition-opacity hover:opacity-80 disabled:opacity-50"
                style={{ background: "var(--bg-card)", color: "var(--text-secondary)", border: "0.5px solid var(--border)" }}
              >
                {loading ? "Chargement..." : "Charger plus"}
              </button>
            )}
          </>
        )}
      </div>
    </main>
  );
}
