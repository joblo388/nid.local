"use client";

import { useState, useEffect, useCallback } from "react";
import { villes, quartiersDeVille } from "@/lib/data";
import { Post } from "@/lib/types";
import { PostCard } from "@/components/PostCard";
import { SkeletonPostCard } from "@/components/Skeleton";

const PAGE_SIZE = 20;

const regions = [...new Set(villes.map((v) => v.region))];

export function VillesView({ initialPosts, initialTotal }: { initialPosts: Post[]; initialTotal: number }) {
  const [villeSlug, setVilleSlug] = useState("");
  const [quartierSlug, setQuartierSlug] = useState("");
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [total, setTotal] = useState(initialTotal);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialTotal > PAGE_SIZE);

  const quartiersDispo = villeSlug ? quartiersDeVille(villeSlug) : [];
  const villeNom = villes.find((v) => v.slug === villeSlug)?.nom;

  const fetchPosts = useCallback(async (p = 1) => {
    setLoading(true);
    const params = new URLSearchParams();
    if (villeSlug) params.set("villeSlug", villeSlug);
    if (quartierSlug && quartierSlug !== "tous") params.set("quartierSlug", quartierSlug);
    params.set("page", String(p));
    params.set("tri", "populaire");
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
  }, [villeSlug, quartierSlug]);

  useEffect(() => {
    fetchPosts(1);
  }, [fetchPosts]);

  return (
    <main className="max-w-[900px] mx-auto px-3 md:px-5 py-5 pb-24">
      <h1 className="text-[20px] font-bold mb-1" style={{ color: "var(--text-primary)" }}>
        Villes et quartiers
      </h1>
      <p className="text-[13px] mb-5" style={{ color: "var(--text-tertiary)" }}>
        Filtrez les discussions par ville et quartier.
      </p>

      {/* Filtres */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <select
          value={villeSlug}
          onChange={(e) => { setVilleSlug(e.target.value); setQuartierSlug(""); }}
          className="px-3 py-2 rounded-xl text-[13px] font-medium"
          style={{ background: "var(--bg-card)", color: "var(--text-primary)", border: "0.5px solid var(--border)", minWidth: "180px" }}
        >
          <option value="">Toutes les villes</option>
          {regions.map((region) => (
            <optgroup key={region} label={region}>
              {villes.filter((v) => v.region === region).map((v) => (
                <option key={v.slug} value={v.slug}>{v.nom}</option>
              ))}
            </optgroup>
          ))}
        </select>

        {quartiersDispo.length > 1 && (
          <select
            value={quartierSlug}
            onChange={(e) => setQuartierSlug(e.target.value)}
            className="px-3 py-2 rounded-xl text-[13px] font-medium"
            style={{ background: "var(--bg-card)", color: "var(--text-primary)", border: "0.5px solid var(--border)", minWidth: "180px" }}
          >
            <option value="">Tous les quartiers{villeNom ? ` de ${villeNom}` : ""}</option>
            {quartiersDispo.map((q) => (
              <option key={q.slug} value={q.slug}>{q.nom}</option>
            ))}
          </select>
        )}

        <span className="text-[12px] ml-auto" style={{ color: "var(--text-tertiary)" }}>
          {total} discussion{total !== 1 ? "s" : ""}
        </span>
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
              Aucune discussion{villeNom ? ` à ${villeNom}` : ""} pour l&apos;instant.
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
