"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Post, Categorie } from "@/lib/types";
import { PostCard } from "./PostCard";

const PAGE_SIZE = 20;

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
  { value: "populaire", label: "Populaires" },
  { value: "recent", label: "Récents" },
  { value: "actif", label: "Actifs" },
] as const;

const CATEGORIE_LABELS: Record<string, string> = {
  vente: "Vente", location: "Location", question: "Questions",
  renovation: "Conseils", voisinage: "Voisinage", alerte: "Alertes",
};

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

type Props = {
  initialPosts: Post[];
  initialTotal: number;
  initialVotedPostIds: string[];
  initialBookmarkedPostIds?: string[];
  villeSlug?: string;
  quartierSlug?: string;
};

export function PostsFiltres({
  initialPosts,
  initialTotal,
  initialVotedPostIds,
  initialBookmarkedPostIds = [],
  villeSlug,
  quartierSlug,
}: Props) {
  const [categorie, setCategorie] = useState<string>("tous");
  const [tri, setTri] = useState<"populaire" | "recent" | "actif">("populaire");
  const [page, setPage] = useState(1);

  const [posts, setPosts] = useState<Post[]>(initialPosts ?? []);
  const [total, setTotal] = useState(initialTotal);
  const [votedPostIds, setVotedPostIds] = useState<Set<string>>(() => new Set(initialVotedPostIds));
  const [bookmarkedPostIds, setBookmarkedPostIds] = useState<Set<string>>(() => new Set(initialBookmarkedPostIds));
  const [loading, setLoading] = useState(false);

  const isFirstRender = useRef(true);
  const listRef = useRef<HTMLDivElement>(null);

  async function fetchPosts(params: { categorie: string; tri: string; page: number }) {
    setLoading(true);
    try {
      const qs = new URLSearchParams({ tri: params.tri, page: String(params.page) });
      if (villeSlug) qs.set("villeSlug", villeSlug);
      if (quartierSlug) qs.set("quartierSlug", quartierSlug);
      if (params.categorie !== "tous") qs.set("categorie", params.categorie);

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
    fetchPosts({ categorie, tri, page: 1 });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categorie, tri]);

  function goToPage(p: number) {
    setPage(p);
    fetchPosts({ categorie, tri, page: p });
    listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="space-y-3">
      {/* Filtres */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap gap-1.5 flex-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategorie(cat.value)}
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
              onClick={() => setTri(t.value)}
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

      {/* Compteur */}
      <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
        Discussions{" "}
        <span
          className="ml-1 px-1.5 py-0.5 rounded-md text-[11px] font-bold normal-case tracking-normal"
          style={{ background: "var(--green-light-bg)", color: "var(--green-text)" }}
        >
          {total}
        </span>
      </p>

      {/* Liste */}
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
            className="rounded-xl p-8 text-center space-y-3"
            style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
          >
            {categorie !== "tous" ? (
              <>
                <p className="text-[13px]" style={{ color: "var(--text-secondary)" }}>
                  Aucune discussion dans la catégorie <span className="font-semibold">{CATEGORIE_LABELS[categorie] ?? categorie}</span> pour l&apos;instant.
                </p>
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => setCategorie("tous")}
                    className="text-[12px] font-medium transition-opacity hover:opacity-70"
                    style={{ color: "var(--green)" }}
                  >
                    Voir toutes les catégories
                  </button>
                  <span style={{ color: "var(--border-secondary)" }}>·</span>
                  <Link
                    href="/nouveau-post"
                    className="text-[12px] font-semibold text-white px-3 py-1.5 rounded-lg"
                    style={{ background: "var(--green)" }}
                  >
                    Publier dans cette catégorie
                  </Link>
                </div>
              </>
            ) : (
              <>
                <p className="text-[13px]" style={{ color: "var(--text-secondary)" }}>
                  Aucune discussion pour l&apos;instant.
                </p>
                <Link
                  href="/nouveau-post"
                  className="inline-block text-[13px] font-semibold text-white px-4 py-2 rounded-lg"
                  style={{ background: "var(--green)" }}
                >
                  Soyez le premier à publier
                </Link>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} hasVoted={votedPostIds.has(post.id)} isBookmarked={bookmarkedPostIds.has(post.id)} />
            ))}
            <Pagination page={page} total={total} onPage={goToPage} />
          </div>
        )}
      </div>
    </div>
  );
}
