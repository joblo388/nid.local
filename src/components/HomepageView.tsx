"use client";

import { useState, useRef, useEffect, useCallback, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Post, Categorie } from "@/lib/types";
import { villes, quartiers, quartiersDeVille, villeBySlug } from "@/lib/data";
import { PostCard } from "./PostCard";
import { SkeletonPostCard } from "./Skeleton";
import { PullToRefresh } from "./PullToRefresh";
import { useLocale } from "@/lib/useLocale";

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
            className="w-10 h-10 rounded-lg text-[13px] font-medium transition-colors"
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

const CATEGORY_VALUES: (Categorie | "tous")[] = [
  "tous", "vente", "location", "question", "renovation",
  "voisinage", "construction", "legal", "financement", "copropriete",
];

const CATEGORY_KEYS: Record<string, string> = {
  tous: "home.tout",
  vente: "cat.vente", location: "cat.location", question: "cat.question",
  renovation: "cat.renovation", voisinage: "cat.voisinage",
  construction: "cat.construction", legal: "cat.legal",
  financement: "cat.financement", copropriete: "cat.condo",
};

const TRI_VALUES = ["recent", "populaire", "actif"] as const;
const TRI_KEYS: Record<string, string> = {
  recent: "home.recents",
  populaire: "home.populaires",
  actif: "home.actifs",
};

const badgeLabelKeys: Record<string, string> = {
  alerte: "common.alertes", question: "cat.question", vente: "cat.vente",
  location: "cat.location", renovation: "cat.renovation", voisinage: "cat.voisinage",
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

function QuartierBar({ villeSlug, selected, onSelect, t }: {
  villeSlug: string; selected: string; onSelect: (slug: string) => void; t: (k: string) => string;
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
            {t("common.tous")}
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

function SearchBar({ value, onChange, t }: { value: string; onChange: (q: string) => void; t: (k: string) => string }) {
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
        placeholder={t("home.rechercher")}
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

function SearchDropdown({ results, query, onSelect, t }: { results: Post[]; query: string; onSelect: () => void; t: (k: string) => string }) {
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
            {badgeLabelKeys[post.categorie] ? t(badgeLabelKeys[post.categorie]) : post.categorie}
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
        <span>{t("home.voir_resultats")} &ldquo;{query}&rdquo;</span>
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
  sidebar?: ReactNode;
};

export function HomepageView({ initialPosts, initialTotal, initialVotedPostIds, initialBookmarkedPostIds, sidebar }: Props) {
  const { t } = useLocale();
  const searchParams = useSearchParams();
  const urlTri = searchParams.get("tri");
  const initialTri = (urlTri === "recent" || urlTri === "actif") ? urlTri : "populaire";

  const [villeSlug, setVilleSlug] = useState("");
  const [quartierSlug, setQuartierSlug] = useState("tous");
  const [categorie, setCategorie] = useState<string>("tous");
  const [tri, setTri] = useState<"recent" | "populaire" | "actif">(initialTri);

  const [posts, setPosts] = useState<Post[]>(initialTri === "populaire" ? (initialPosts ?? []) : []);
  const [total, setTotal] = useState(initialTotal);
  const [votedPostIds, setVotedPostIds] = useState<Set<string>>(() => new Set(initialVotedPostIds));
  const [bookmarkedPostIds, setBookmarkedPostIds] = useState<Set<string>>(() => new Set(initialBookmarkedPostIds));
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(initialTotal > PAGE_SIZE);
  const listRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Sync tri with URL query param when it changes
  useEffect(() => {
    const t = searchParams.get("tri");
    if (t === "recent" || t === "actif") setTri(t);
    else setTri("populaire");
  }, [searchParams]);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [dbResults, setDbResults] = useState<Post[]>([]);
  const [catScrolledEnd, setCatScrolledEnd] = useState(false);
  const catScrollRef = useRef<HTMLDivElement>(null);
  const handleCatScroll = useCallback(() => {
    const el = catScrollRef.current;
    if (!el) return;
    setCatScrolledEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  }, []);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRender = useRef(true);

  // New posts indicator
  const [knownTotal, setKnownTotal] = useState(initialTotal);
  const [newPostsCount, setNewPostsCount] = useState(0);
  const newPostsDismissRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Mes quartiers (subscriptions)
  const [mesQuartiersActive, setMesQuartiersActive] = useState(false);
  const [subscribedSlugs, setSubscribedSlugs] = useState<string[]>([]);
  const [subsLoaded, setSubsLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/quartiers/subscribe")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.quartierSlugs) setSubscribedSlugs(data.quartierSlugs);
        setSubsLoaded(true);
      })
      .catch(() => setSubsLoaded(true));
  }, []);

  // Poll for new posts every 30s
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const subQ = mesQuartiersActive && subscribedSlugs.length > 0
          ? subscribedSlugs.join(",")
          : undefined;
        const qsObj: Record<string, string> = {
          villeSlug,
          quartierSlug,
          categorie,
          tri,
          page: "1",
        };
        if (subQ) qsObj.subscribedQuartiers = subQ;
        const qs = new URLSearchParams(qsObj);
        const res = await fetch(`/api/posts?${qs}`);
        if (!res.ok) return;
        const data = await res.json();
        const serverTotal = data.total as number;
        if (serverTotal > knownTotal) {
          setNewPostsCount(serverTotal - knownTotal);
          // Auto-dismiss after 10 seconds
          if (newPostsDismissRef.current) clearTimeout(newPostsDismissRef.current);
          newPostsDismissRef.current = setTimeout(() => setNewPostsCount(0), 10000);
        }
      } catch {
        // ignore polling errors
      }
    }, 30000);
    return () => {
      clearInterval(interval);
      if (newPostsDismissRef.current) clearTimeout(newPostsDismissRef.current);
    };
  }, [villeSlug, quartierSlug, categorie, tri, mesQuartiersActive, subscribedSlugs, knownTotal]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const fetchPosts = useCallback(async (params: {
    villeSlug: string; quartierSlug: string; categorie: string; tri: string; page: number;
    subscribedQuartiers?: string;
    append?: boolean;
  }) => {
    if (params.append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }
    try {
      const qsObj: Record<string, string> = {
        quartierSlug: params.quartierSlug,
        categorie: params.categorie,
        tri: params.tri,
        page: String(params.page),
      };
      if (params.villeSlug) qsObj.villeSlug = params.villeSlug;
      if (params.subscribedQuartiers) {
        qsObj.subscribedQuartiers = params.subscribedQuartiers;
      }
      const qs = new URLSearchParams(qsObj);
      const res = await fetch(`/api/posts?${qs}`);
      if (!res.ok) return;
      const data = await res.json();
      if (params.append) {
        setPosts((prev) => {
          const existingIds = new Set(prev.map((p) => p.id));
          const newPosts = data.posts.filter((p: Post) => !existingIds.has(p.id));
          return [...prev, ...newPosts];
        });
      } else {
        setPosts(data.posts);
      }
      setTotal(data.total);
      setKnownTotal(data.total);
      setNewPostsCount(0);
      setHasMore(data.posts.length >= PAGE_SIZE);
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
      if (params.append) {
        setLoadingMore(false);
      } else {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    setPage(1);
    setPosts([]);
    setHasMore(true);
    const subQ = mesQuartiersActive && subscribedSlugs.length > 0
      ? subscribedSlugs.join(",")
      : undefined;
    fetchPosts({ villeSlug, quartierSlug, categorie, tri, page: 1, subscribedQuartiers: subQ });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [villeSlug, quartierSlug, categorie, tri, mesQuartiersActive]);

  function selectVille(slug: string) {
    setMesQuartiersActive(false);
    setVilleSlug(slug);
    setQuartierSlug("tous");
  }

  function toggleMesQuartiers() {
    if (!mesQuartiersActive && subscribedSlugs.length === 0) return;
    setMesQuartiersActive((prev) => !prev);
  }

  // Infinite scroll — load next page
  const loadNextPage = useCallback(() => {
    setPage((prev) => {
      const nextPage = prev + 1;
      const subQ = mesQuartiersActive && subscribedSlugs.length > 0
        ? subscribedSlugs.join(",")
        : undefined;
      fetchPosts({ villeSlug, quartierSlug, categorie, tri, page: nextPage, subscribedQuartiers: subQ, append: true });
      return nextPage;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [villeSlug, quartierSlug, categorie, tri, mesQuartiersActive, subscribedSlugs, fetchPosts]);

  // IntersectionObserver for infinite scroll sentinel
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && hasMore && !loading && !loadingMore) {
          loadNextPage();
        }
      },
      { threshold: 0.1, rootMargin: "200px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loading, loadingMore, loadNextPage]);

  function handleSearchChange(q: string) {
    setSearchQuery(q);
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    if (q.trim().length < 2) { setDbResults([]); return; }
    searchTimerRef.current = setTimeout(async () => {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      if (res.ok) setDbResults(await res.json());
    }, 300);
  }

  const handlePullToRefresh = useCallback(async () => {
    setPage(1);
    setPosts([]);
    setHasMore(true);
    const subQ = mesQuartiersActive && subscribedSlugs.length > 0
      ? subscribedSlugs.join(",")
      : undefined;
    await fetchPosts({ villeSlug, quartierSlug, categorie, tri, page: 1, subscribedQuartiers: subQ });
  }, [villeSlug, quartierSlug, categorie, tri, mesQuartiersActive, subscribedSlugs, fetchPosts]);

  const handleNewPostsClick = useCallback(() => {
    setNewPostsCount(0);
    setPage(1);
    setPosts([]);
    setHasMore(true);
    if (newPostsDismissRef.current) clearTimeout(newPostsDismissRef.current);
    const subQ = mesQuartiersActive && subscribedSlugs.length > 0
      ? subscribedSlugs.join(",")
      : undefined;
    fetchPosts({ villeSlug, quartierSlug, categorie, tri, page: 1, subscribedQuartiers: subQ });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [villeSlug, quartierSlug, categorie, tri, mesQuartiersActive, subscribedSlugs, fetchPosts]);

  const searchResults = searchQuery.trim().length >= 2 ? dbResults : [];
  const villeActive = villeBySlug[villeSlug];
  const quartierActif = quartiers.find((q) => q.slug === quartierSlug);
  const qDeVille = quartiersDeVille(villeSlug);
  const hasQuartiers = qDeVille.length > 1;

  return (
    <PullToRefresh onRefresh={handlePullToRefresh}>
      {/* Tri — sticky sous le header, visible mobile/tablette seulement */}
      <div className="sticky z-40 lg:hidden" style={{ top: "52px", background: "var(--bg-card)", borderBottom: "0.5px solid var(--border)" }}>
        <div className="max-w-[1100px] mx-auto px-3 md:px-5">
          <div className="flex gap-1 py-2 items-center">
            {([
              { value: "populaire" as const, key: "nav.fil" },
              { value: "recent" as const, key: "nav.recent" },
              { value: "actif" as const, key: "nav.populaire" },
            ]).map((item) => (
              <button
                key={item.value}
                onClick={() => setTri(item.value)}
                className="px-4 py-1.5 rounded-lg text-[13px] font-medium whitespace-nowrap shrink-0 transition-colors"
                style={
                  tri === item.value
                    ? { background: "var(--green-light-bg)", color: "var(--green-text)" }
                    : { color: "var(--text-secondary)" }
                }
              >
                {t(item.key)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <main className="flex-1 max-w-[1100px] mx-auto w-full px-3 md:px-5 py-4 md:py-5">
        <div className="flex gap-5 items-start">
          {/* Fil */}
          <div className="flex-1 min-w-0 space-y-3">

            {/* En-tête + tri (hidden on lg+ where sidebar handles navigation) */}
            <div className="flex items-center justify-between lg:hidden">
              <div className="hidden md:flex items-center gap-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
                  {t("sidebar.discussions")}{" "}
                  <span
                    className="ml-1 px-1.5 py-0.5 rounded-md text-[11px] font-bold normal-case tracking-normal"
                    style={{ background: "var(--green-light-bg)", color: "var(--green-text)" }}
                  >
                    {total}
                  </span>
                </p>
                <div className="flex items-center gap-0.5">
                  {TRI_VALUES.map((val) => (
                    <button
                      key={val}
                      onClick={() => setTri(val)}
                      className="px-2.5 py-1.5 text-[12px] font-medium rounded-lg whitespace-nowrap"
                      style={
                        tri === val
                          ? { color: "var(--text-primary)", textDecoration: "underline", textUnderlineOffset: "3px" }
                          : { color: "var(--text-tertiary)" }
                      }
                    >
                      {t(TRI_KEYS[val])}
                    </button>
                  ))}
                </div>
              </div>
              {!mesQuartiersActive && (
                <Link
                  href={`/ville/${villeSlug}`}
                  className="hidden md:block text-[11px] font-medium transition-opacity hover:opacity-70"
                  style={{ color: "var(--green)" }}
                >
                  {t("home.voir_page")} {villeActive?.nom} →
                </Link>
              )}
            </div>

            {/* New posts indicator pill */}
            {newPostsCount > 0 && (
              <div className="flex justify-center">
                <button
                  onClick={handleNewPostsClick}
                  className="px-4 py-2 rounded-full text-[13px] font-semibold text-white transition-transform hover:scale-105"
                  style={{ background: "var(--green)", boxShadow: "0 2px 8px rgba(29,158,117,0.3)" }}
                >
                  {newPostsCount} {t("home.nouvelles_discussions")}
                </button>
              </div>
            )}

            {/* Posts */}
            <div ref={listRef} data-tour="posts">
            {loading && posts.length === 0 ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <SkeletonPostCard key={i} />
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div
                className="rounded-xl px-6 py-12 text-center"
                style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
              >
                <p className="text-[14px]" style={{ color: "var(--text-secondary)" }}>
                  {t("home.aucune_discussion")}
                </p>
                <Link
                  href="/nouveau-post"
                  className="inline-block mt-4 text-[13px] font-semibold text-white px-4 py-2 rounded-lg"
                  style={{ background: "var(--green)" }}
                >
                  {t("home.premier_publier")}
                </Link>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  {posts.map((post) => (
                    <PostCard key={post.id} post={post} searchQuery={searchQuery} hasVoted={votedPostIds.has(post.id)} isBookmarked={bookmarkedPostIds.has(post.id)} />
                  ))}
                </div>
                {/* Infinite scroll sentinel */}
                <div ref={sentinelRef} className="h-1" />
                {loadingMore && (
                  <div className="space-y-2 mt-2">
                    <SkeletonPostCard />
                    <SkeletonPostCard />
                    <p className="text-center pt-1" style={{ color: "var(--text-tertiary)", fontSize: "12px" }}>
                      {t("common.chargement")}
                    </p>
                  </div>
                )}
                {!hasMore && posts.length > 0 && !loadingMore && (
                  <p className="text-center py-4" style={{ color: "var(--text-tertiary)", fontSize: "12px" }}>
                    {t("home.aucune_autre")}
                  </p>
                )}
              </>
            )}
            </div>
          </div>

          {/* Sidebar — desktop uniquement */}
          {sidebar}
        </div>

      </main>
    </PullToRefresh>
  );
}
