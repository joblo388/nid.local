"use client";

import { useState } from "react";
import { Post, Categorie } from "@/lib/types";
import { PostCard } from "./PostCard";

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
  { value: "populaire", label: "Populaires" },
  { value: "recent", label: "Récents" },
  { value: "actif", label: "Actifs" },
] as const;

const PAGE_SIZE = 20;

export function PostsFiltres({
  posts,
  votedPostIds = new Set(),
}: {
  posts: Post[];
  votedPostIds?: Set<string>;
}) {
  const [categorie, setCategorie] = useState<string>("tous");
  const [tri, setTri] = useState<"populaire" | "recent" | "actif">("populaire");
  const [page, setPage] = useState(1);

  const filtered = posts
    .filter((p) => categorie === "tous" || p.categorie === categorie)
    .sort((a, b) => {
      if (a.epingle && !b.epingle) return -1;
      if (!a.epingle && b.epingle) return 1;
      if (tri === "recent") return new Date(b.creeLe).getTime() - new Date(a.creeLe).getTime();
      if (tri === "populaire") return b.nbVotes - a.nbVotes;
      return b.nbCommentaires - a.nbCommentaires;
    });

  const paginated = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = filtered.length > page * PAGE_SIZE;

  return (
    <div className="space-y-3">
      {/* Filtres */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap gap-1.5 flex-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => { setCategorie(cat.value); setPage(1); }}
              className="px-2.5 py-1 rounded-lg text-[12px] font-medium transition-colors"
              style={
                categorie === cat.value
                  ? { background: "var(--green)", color: "#fff" }
                  : { background: "var(--bg-secondary)", color: "var(--text-secondary)", border: "0.5px solid var(--border)" }
              }
            >
              {cat.label}
            </button>
          ))}
        </div>
        <div className="flex gap-1">
          {TRIS.map((t) => (
            <button
              key={t.value}
              onClick={() => { setTri(t.value); setPage(1); }}
              className="px-2.5 py-1 rounded-lg text-[12px] font-medium transition-colors"
              style={
                tri === t.value
                  ? { background: "var(--bg-secondary)", color: "var(--text-primary)", border: "0.5px solid var(--border-secondary)" }
                  : { color: "var(--text-tertiary)" }
              }
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Liste */}
      {paginated.length === 0 ? (
        <div
          className="rounded-xl p-8 text-center"
          style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
        >
          <p className="text-[13px]" style={{ color: "var(--text-tertiary)" }}>
            Aucune discussion dans cette catégorie.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {paginated.map((post) => (
            <PostCard key={post.id} post={post} hasVoted={votedPostIds.has(post.id)} />
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
  );
}
