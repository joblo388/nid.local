"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";

// ─── Types ───────────────────────────────────────────────────────────────────

interface ResultItem {
  id: string;
  category: "page" | "action" | "post" | "annonce";
  title: string;
  subtitle: string;
  href: string;
  icon: "page" | "action" | "post" | "annonce";
}

// ─── Static data ─────────────────────────────────────────────────────────────

const PAGES: ResultItem[] = [
  { id: "p-fil", category: "page", title: "Fil", subtitle: "Page", href: "/", icon: "page" },
  { id: "p-tendances", category: "page", title: "Tendances", subtitle: "Page", href: "/tendances", icon: "page" },
  { id: "p-villes", category: "page", title: "Villes", subtitle: "Page", href: "/villes", icon: "page" },
  { id: "p-annonces", category: "page", title: "Annonces", subtitle: "Page", href: "/annonces", icon: "page" },
  { id: "p-calc", category: "page", title: "Calculatrice", subtitle: "Outils", href: "/calculatrice", icon: "page" },
  { id: "p-capacite", category: "page", title: "Capacité d\u2019emprunt", subtitle: "Outils", href: "/capacite-emprunt", icon: "page" },
  { id: "p-marche", category: "page", title: "Données de marché", subtitle: "Outils", href: "/donnees-marche", icon: "page" },
  { id: "p-estimation", category: "page", title: "Estimation", subtitle: "Outils", href: "/estimation", icon: "page" },
  { id: "p-suggestions", category: "page", title: "Suggestions", subtitle: "Page", href: "/suggestions", icon: "page" },
  { id: "p-parametres", category: "page", title: "Paramètres", subtitle: "Page", href: "/parametres", icon: "page" },
  { id: "p-favoris", category: "page", title: "Favoris", subtitle: "Page", href: "/favoris", icon: "page" },
  { id: "p-messages", category: "page", title: "Messages", subtitle: "Page", href: "/messages", icon: "page" },
  { id: "p-alertes", category: "page", title: "Alertes", subtitle: "Page", href: "/alertes", icon: "page" },
];

const ACTIONS: ResultItem[] = [
  { id: "a-discussion", category: "action", title: "Nouvelle discussion", subtitle: "Action", href: "/nouveau-post", icon: "action" },
  { id: "a-annonce", category: "action", title: "Publier une annonce", subtitle: "Action", href: "/annonces/publier", icon: "action" },
  { id: "a-alerte", category: "action", title: "Créer une alerte", subtitle: "Action", href: "/alertes", icon: "action" },
];

// ─── Icons ───────────────────────────────────────────────────────────────────

function ResultIcon({ type, selected }: { type: ResultItem["icon"]; selected: boolean }) {
  const color = selected ? "var(--green)" : "var(--text-tertiary)";

  if (type === "page") {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
    );
  }
  if (type === "action") {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    );
  }
  if (type === "annonce") {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    );
  }
  // post
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [apiResults, setApiResults] = useState<ResultItem[]>([]);
  const [apiLoading, setApiLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const router = useRouter();

  // ── Keyboard shortcut (Cmd+K / Ctrl+K) ──────────────────────────────────

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  // ── Reset on open ────────────────────────────────────────────────────────

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIndex(0);
      setApiResults([]);
      setApiLoading(false);
      // Autofocus after render
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  // ── Lock body scroll when open ───────────────────────────────────────────

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // ── API search with debounce ─────────────────────────────────────────────

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (query.trim().length < 2) {
      setApiResults([]);
      setApiLoading(false);
      return;
    }

    setApiLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const [postsRes, annoncesRes] = await Promise.allSettled([
          fetch(`/api/search?q=${encodeURIComponent(query.trim())}`),
          fetch(`/api/annonces?q=${encodeURIComponent(query.trim())}&limit=5`),
        ]);

        const results: ResultItem[] = [];

        if (postsRes.status === "fulfilled" && postsRes.value.ok) {
          const posts = await postsRes.value.json();
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          posts.slice(0, 5).forEach((p: any) => {
            results.push({
              id: `post-${p.id}`,
              category: "post",
              title: p.titre,
              subtitle: p.quartier?.nom ?? "Discussion",
              href: `/post/${p.id}`,
              icon: "post",
            });
          });
        }

        if (annoncesRes.status === "fulfilled" && annoncesRes.value.ok) {
          const data = await annoncesRes.value.json();
          const annonces = Array.isArray(data) ? data : data.annonces ?? [];
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          annonces.slice(0, 5).forEach((a: any) => {
            results.push({
              id: `annonce-${a.id}`,
              category: "annonce",
              title: a.titre,
              subtitle: a.quartierNom ?? a.villeNom ?? "Annonce",
              href: `/annonces/${a.id}`,
              icon: "annonce",
            });
          });
        }

        setApiResults(results);
      } catch {
        // Silently fail — the palette still works with static results
      } finally {
        setApiLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  // ── Filtered results ─────────────────────────────────────────────────────

  const filteredStatic = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return [...PAGES, ...ACTIONS];

    return [...PAGES, ...ACTIONS].filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q)
    );
  }, [query]);

  const allResults = useMemo(() => {
    return [...filteredStatic, ...apiResults];
  }, [filteredStatic, apiResults]);

  // ── Group results by category ────────────────────────────────────────────

  const grouped = useMemo(() => {
    const groups: { label: string; items: ResultItem[] }[] = [];
    const pages = allResults.filter((r) => r.category === "page");
    const actions = allResults.filter((r) => r.category === "action");
    const posts = allResults.filter((r) => r.category === "post");
    const annonces = allResults.filter((r) => r.category === "annonce");

    if (pages.length) groups.push({ label: "Pages", items: pages });
    if (actions.length) groups.push({ label: "Actions", items: actions });
    if (posts.length) groups.push({ label: "Discussions", items: posts });
    if (annonces.length) groups.push({ label: "Annonces", items: annonces });

    return groups;
  }, [allResults]);

  // ── Flat index for keyboard nav ──────────────────────────────────────────

  const flatItems = useMemo(() => {
    return grouped.flatMap((g) => g.items);
  }, [grouped]);

  // ── Reset selected index when results change ─────────────────────────────

  useEffect(() => {
    setSelectedIndex(0);
  }, [flatItems.length]);

  // ── Navigate to result ───────────────────────────────────────────────────

  const navigate = useCallback(
    (item: ResultItem) => {
      setOpen(false);
      router.push(item.href);
    },
    [router]
  );

  // ── Keyboard navigation ──────────────────────────────────────────────────

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(flatItems.length, 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + flatItems.length) % Math.max(flatItems.length, 1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (flatItems[selectedIndex]) navigate(flatItems[selectedIndex]);
      } else if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
      }
    },
    [flatItems, selectedIndex, navigate]
  );

  // ── Scroll selected into view ────────────────────────────────────────────

  useEffect(() => {
    if (!listRef.current) return;
    const el = listRef.current.querySelector(`[data-index="${selectedIndex}"]`);
    if (el) el.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  // ── Public open method for Header button ─────────────────────────────────

  if (!open) return null;

  // ── Flat index counter ───────────────────────────────────────────────────
  let flatIdx = 0;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[min(20vh,140px)]"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
    >
      <div
        className="w-full max-w-[560px] mx-4 rounded-xl overflow-hidden flex flex-col"
        style={{
          background: "var(--bg-card)",
          border: "0.5px solid var(--border)",
          boxShadow: "0 16px 48px rgba(0,0,0,0.2)",
          maxHeight: "min(70vh, 480px)",
        }}
        onKeyDown={onKeyDown}
      >
        {/* ── Search input ─────────────────────────────────────────────── */}
        <div className="flex items-center gap-3 px-4" style={{ borderBottom: "0.5px solid var(--border)" }}>
          <svg
            width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="var(--text-tertiary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className="shrink-0"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher une page, action ou discussion..."
            className="flex-1 py-3.5 text-[16px] font-normal outline-none"
            style={{
              background: "transparent",
              color: "var(--text-primary)",
              border: "none",
            }}
            autoComplete="off"
            spellCheck={false}
          />
          {query && (
            <button
              onClick={() => { setQuery(""); inputRef.current?.focus(); }}
              className="shrink-0 p-1 rounded transition-opacity hover:opacity-60"
              style={{ color: "var(--text-tertiary)" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>

        {/* ── Results ──────────────────────────────────────────────────── */}
        <div ref={listRef} className="overflow-y-auto flex-1 py-2" style={{ scrollbarWidth: "thin" }}>
          {grouped.length === 0 && !apiLoading && (
            <div className="px-4 py-8 text-center text-[13px]" style={{ color: "var(--text-tertiary)" }}>
              Aucun résultat pour &laquo;{query}&raquo;
            </div>
          )}

          {grouped.map((group) => (
            <div key={group.label} className="mb-1">
              <div
                className="px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider"
                style={{ color: "var(--text-tertiary)" }}
              >
                {group.label}
              </div>
              {group.items.map((item) => {
                const idx = flatIdx++;
                const isSelected = idx === selectedIndex;
                return (
                  <button
                    key={item.id}
                    data-index={idx}
                    className="w-full flex items-center gap-3 px-4 py-2 text-left transition-colors"
                    style={{
                      background: isSelected ? "var(--bg-secondary)" : "transparent",
                    }}
                    onClick={() => navigate(item)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                  >
                    <span className="shrink-0">
                      <ResultIcon type={item.icon} selected={isSelected} />
                    </span>
                    <span className="flex-1 min-w-0">
                      <span
                        className="block text-[13px] font-medium truncate"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {item.title}
                      </span>
                      <span
                        className="block text-[11px] truncate"
                        style={{ color: "var(--text-tertiary)" }}
                      >
                        {item.subtitle}
                      </span>
                    </span>
                    {isSelected && (
                      <span
                        className="shrink-0 text-[11px] font-medium px-1.5 py-0.5 rounded"
                        style={{ background: "var(--bg-secondary)", color: "var(--text-tertiary)", border: "0.5px solid var(--border)" }}
                      >
                        ↵
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}

          {apiLoading && (
            <div className="px-4 py-3 text-[12px]" style={{ color: "var(--text-tertiary)" }}>
              Recherche en cours...
            </div>
          )}
        </div>

        {/* ── Footer ───────────────────────────────────────────────────── */}
        <div
          className="px-4 py-2 flex items-center gap-4 text-[11px] shrink-0"
          style={{ color: "var(--text-tertiary)", borderTop: "0.5px solid var(--border)" }}
        >
          <span>↑↓ naviguer</span>
          <span>·</span>
          <span>↵ ouvrir</span>
          <span>·</span>
          <span>esc fermer</span>
        </div>
      </div>
    </div>
  );
}

// ─── Trigger button (for Header) ─────────────────────────────────────────────

export function CommandPaletteTrigger() {
  const handleClick = useCallback(() => {
    // Dispatch Cmd+K to open the palette
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true })
    );
  }, []);

  return (
    <button
      onClick={handleClick}
      className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded-lg transition-opacity hover:opacity-60"
      style={{
        background: "var(--bg-secondary)",
        border: "0.5px solid var(--border)",
        color: "var(--text-tertiary)",
      }}
      title="Recherche rapide (⌘K)"
    >
      <svg
        width="13" height="13" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <span className="text-[11px] font-medium">⌘K</span>
    </button>
  );
}
