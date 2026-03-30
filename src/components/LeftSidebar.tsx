"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { villes, quartiers } from "@/lib/data";

// ─── Constants ──────────────────────────────────────────────────────────────────

const FAVS_KEY = "nl-favs";
const RECENTS_KEY = "nl-recents";
const MAX_RECENTS = 5;

const CATEGORIES = [
  { slug: "vente", label: "Vente" },
  { slug: "location", label: "Location" },
  { slug: "question", label: "Questions" },
  { slug: "renovation", label: "Conseils" },
  { slug: "voisinage", label: "Voisinage" },
  { slug: "construction", label: "Construction" },
  { slug: "legal", label: "Legal" },
  { slug: "financement", label: "Financement" },
  { slug: "copropriete", label: "Copropriete" },
];

// ─── Helpers ────────────────────────────────────────────────────────────────────

function readLS(key: string): string[] {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : [];
  } catch {
    return [];
  }
}

function writeLS(key: string, val: string[]) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {
    /* noop */
  }
}

// ─── Inline SVG Icons ───────────────────────────────────────────────────────────

function FeedIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12L5 10M5 10L12 3L19 10M5 10V20C5 20.5523 5.44772 21 6 21H9M19 10L21 12M19 10V20C19 20.5523 18.5523 21 18 21H15M9 21C9.55228 21 10 20.5523 10 20V16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V20C14 20.5523 14.4477 21 15 21M9 21H15" />
    </svg>
  );
}

function TrendingIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function SmallClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function StarIcon({ filled, size = 14 }: { filled: boolean; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function ChevronIcon({ collapsed }: { collapsed: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0 transition-transform duration-200"
      style={{ transform: collapsed ? "rotate(-90deg)" : "rotate(0deg)" }}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function DownChevronSmall() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

// ── Category icons (16x16, stroke-based) ─────────────────────────────────────

function CatVenteIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5A3.5 3.5 0 006 8.5 3.5 3.5 0 009.5 12H14.5A3.5 3.5 0 0118 15.5 3.5 3.5 0 0114.5 19H6" />
    </svg>
  );
}

function CatLocationIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 3h6v6" />
      <path d="M10 14L21 3" />
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
    </svg>
  );
}

function CatQuestionsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function CatConseilsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94L6.73 20.17a2.12 2.12 0 01-3-3l6.8-6.8a6 6 0 017.94-7.94L14.7 6.3z" />
    </svg>
  );
}

function CatVoisinageIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87" />
      <path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  );
}

function CatConstructionIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <path d="M12 12h.01" />
      <path d="M17 12h.01" />
      <path d="M7 12h.01" />
    </svg>
  );
}

function CatLegalIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="3" x2="12" y2="21" />
      <polyline points="1 14 5 10 9 14" />
      <polyline points="15 14 19 10 23 14" />
      <line x1="5" y1="10" x2="12" y2="3" />
      <line x1="19" y1="10" x2="12" y2="3" />
    </svg>
  );
}

function CatFinancementIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  );
}

function CatCoproIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <path d="M9 22V18H15V22" />
      <path d="M8 6H10" />
      <path d="M14 6H16" />
      <path d="M8 10H10" />
      <path d="M14 10H16" />
      <path d="M8 14H10" />
      <path d="M14 14H16" />
    </svg>
  );
}

const CAT_ICONS: Record<string, () => React.JSX.Element> = {
  vente: CatVenteIcon,
  location: CatLocationIcon,
  question: CatQuestionsIcon,
  renovation: CatConseilsIcon,
  voisinage: CatVoisinageIcon,
  construction: CatConstructionIcon,
  legal: CatLegalIcon,
  financement: CatFinancementIcon,
  copropriete: CatCoproIcon,
};

// ─── Section wrapper (collapsible) ──────────────────────────────────────────────

function CollapsibleSection({
  label,
  expanded,
  onToggle,
  children,
}: {
  label: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-[18px] pt-[14px] pb-[6px] cursor-pointer select-none"
      >
        <span
          className="text-[10px] font-semibold uppercase tracking-wider"
          style={{ color: "var(--text-tertiary)" }}
        >
          {label}
        </span>
        <span style={{ color: "var(--text-tertiary)" }}>
          <ChevronIcon collapsed={!expanded} />
        </span>
      </button>
      <div
        className="overflow-hidden transition-all duration-200"
        style={{
          maxHeight: expanded ? "2000px" : "0px",
          opacity: expanded ? 1 : 0,
        }}
      >
        {children}
      </div>
    </div>
  );
}

// ─── Divider ────────────────────────────────────────────────────────────────────

function Divider() {
  return (
    <div
      className="mx-[14px] my-[6px]"
      style={{ height: "0.5px", background: "var(--border)" }}
    />
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────────

export function LeftSidebar() {
  const pathname = usePathname();

  // ── State ──────────────────────────────────────────────────────────────────
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    favoris: true,
    recents: true,
    categories: true,
    villes: true,
    quartiers: true,
  });
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recents, setRecents] = useState<string[]>([]);
  const [villeSearch, setVilleSearch] = useState("");
  const [quartierSearch, setQuartierSearch] = useState("");
  const [showAllVilles, setShowAllVilles] = useState(false);
  const [showAllQuartiers, setShowAllQuartiers] = useState(false);

  // ── Load from localStorage ─────────────────────────────────────────────────
  useEffect(() => {
    setFavorites(readLS(FAVS_KEY));
    setRecents(readLS(RECENTS_KEY));
  }, []);

  // ── Toggle section ─────────────────────────────────────────────────────────
  const toggleSection = useCallback((key: string) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  // ── Favorite toggle ────────────────────────────────────────────────────────
  const toggleFav = useCallback(
    (id: string, e?: React.MouseEvent) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      setFavorites((prev) => {
        const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
        writeLS(FAVS_KEY, next);
        return next;
      });
    },
    []
  );

  // ── Add to recents ─────────────────────────────────────────────────────────
  const addRecent = useCallback((label: string) => {
    setRecents((prev) => {
      const filtered = prev.filter((x) => x !== label);
      const next = [label, ...filtered].slice(0, MAX_RECENTS);
      writeLS(RECENTS_KEY, next);
      return next;
    });
  }, []);

  // ── Build a key for a fav/recent entry ─────────────────────────────────────
  // Format: "type:slug:label" e.g. "ville:montreal:Montreal"
  const favKey = (type: string, slug: string) => `${type}:${slug}`;
  const parseFavKey = (key: string) => {
    const parts = key.split(":");
    return { type: parts[0], slug: parts[1] };
  };

  // ── Get href from a fav key ────────────────────────────────────────────────
  const favHref = (key: string) => {
    const { type, slug } = parseFavKey(key);
    if (type === "cat") return `/categorie/${slug}`;
    if (type === "ville") return `/ville/${slug}`;
    if (type === "quartier") return `/quartier/${slug}`;
    if (type === "nav") {
      if (slug === "fil") return "/";
      if (slug === "populaire") return "/tendances";
      if (slug === "recent") return "/?tri=recent";
    }
    return "/";
  };

  // ── Get label from a fav key ───────────────────────────────────────────────
  const favLabel = (key: string) => {
    const { type, slug } = parseFavKey(key);
    if (type === "cat") {
      const c = CATEGORIES.find((x) => x.slug === slug);
      return c ? c.label : slug;
    }
    if (type === "ville") {
      const v = villes.find((x) => x.slug === slug);
      return v ? v.nom : slug;
    }
    if (type === "quartier") {
      const q = quartiers.find((x) => x.slug === slug);
      return q ? q.nom : slug;
    }
    if (type === "nav") {
      if (slug === "fil") return "Fil d'actualite";
      if (slug === "populaire") return "Populaire";
      if (slug === "recent") return "Recent";
    }
    return slug;
  };

  // ── Filtered lists ─────────────────────────────────────────────────────────
  const filteredVilles = villeSearch
    ? villes.filter((v) => v.nom.toLowerCase().includes(villeSearch.toLowerCase()))
    : villes;
  const displayedVilles = showAllVilles ? filteredVilles : filteredVilles.slice(0, 7);

  const filteredQuartiers = quartierSearch
    ? quartiers.filter((q) => q.nom.toLowerCase().includes(quartierSearch.toLowerCase()))
    : quartiers;
  const displayedQuartiers = showAllQuartiers ? filteredQuartiers : filteredQuartiers.slice(0, 7);

  // ── Active check helpers ───────────────────────────────────────────────────
  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href;
  };
  const isActiveWithQuery = (href: string) => {
    if (href === "/?tri=recent") return pathname === "/" && typeof window !== "undefined" && window.location.search.includes("tri=recent");
    return pathname === href;
  };

  // ── Nav item style ─────────────────────────────────────────────────────────
  const navItemClass = (active: boolean) =>
    `flex items-center gap-[9px] text-[13px] px-2.5 py-[7px] mx-[10px] rounded-lg transition-colors cursor-pointer ${active ? "font-medium" : ""}`;

  const navItemStyle = (active: boolean): React.CSSProperties => ({
    color: active ? "var(--green-text)" : "var(--text-secondary)",
    background: active ? "var(--green-light-bg)" : undefined,
  });

  return (
    <aside
      className="w-[248px] shrink-0 fixed left-0 top-0 h-screen overflow-y-auto hidden lg:flex flex-col z-40"
      style={{
        background: "var(--bg-page)",
        borderRight: "0.5px solid var(--border)",
        scrollbarWidth: "thin",
        scrollbarColor: "var(--border) transparent",
      }}
    >
      {/* ═══════════════════════════════════════════════════════════════════════
          1. Logo bar
      ═══════════════════════════════════════════════════════════════════════ */}
      <div
        className="sticky top-0 z-10 flex items-center gap-2 px-[18px] h-[52px] shrink-0"
        style={{
          background: "var(--bg-page)",
          borderBottom: "0.5px solid var(--border)",
        }}
      >
        <Link href="/" className="flex items-center gap-2">
          <span className="text-[17px] font-bold tracking-tight leading-none">
            <span style={{ color: "var(--text-primary)" }}>nid</span>
            <span style={{ color: "var(--green)" }}>.local</span>
          </span>
        </Link>
        <span
          className="text-[10px] font-semibold px-2 py-0.5 rounded-full select-none"
          style={{
            background: "var(--amber-bg)",
            color: "var(--amber-text)",
          }}
        >
          COMMUNAUTE
        </span>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          2. New discussion button
      ═══════════════════════════════════════════════════════════════════════ */}
      <div className="px-3 pt-3 pb-1">
        <Link
          href="/nouveau-post"
          className="flex items-center justify-center gap-2 w-full text-[13px] font-semibold py-[9px] rounded-lg transition-opacity hover:opacity-90"
          style={{
            background: "var(--green)",
            color: "#ffffff",
          }}
        >
          <PlusIcon />
          Nouvelle discussion
        </Link>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          3. Feed navigation
      ═══════════════════════════════════════════════════════════════════════ */}
      <div className="pt-1 pb-0.5">
        <Link
          href="/"
          className={navItemClass(isActive("/") && !isActiveWithQuery("/?tri=recent"))}
          style={navItemStyle(isActive("/") && !isActiveWithQuery("/?tri=recent"))}
          onClick={() => addRecent("nav:fil:Fil d'actualite")}
        >
          <span className="shrink-0" style={{ color: isActive("/") && !isActiveWithQuery("/?tri=recent") ? "var(--green-text)" : "var(--text-tertiary)" }}>
            <FeedIcon />
          </span>
          <span className="truncate">Fil d&apos;actualite</span>
        </Link>

        <Link
          href="/tendances"
          className={navItemClass(isActive("/tendances"))}
          style={navItemStyle(isActive("/tendances"))}
          onClick={() => addRecent("nav:populaire:Populaire")}
        >
          <span className="shrink-0" style={{ color: isActive("/tendances") ? "var(--green-text)" : "var(--text-tertiary)" }}>
            <TrendingIcon />
          </span>
          <span className="truncate">Populaire</span>
          <span
            className="text-[10px] px-1.5 py-[1px] rounded-full font-semibold ml-auto"
            style={{ background: "var(--red-bg)", color: "var(--red-text)" }}
          >
            chaud
          </span>
        </Link>

        <Link
          href="/?tri=recent"
          className={navItemClass(isActiveWithQuery("/?tri=recent"))}
          style={navItemStyle(isActiveWithQuery("/?tri=recent"))}
          onClick={() => addRecent("nav:recent:Recent")}
        >
          <span className="shrink-0" style={{ color: isActiveWithQuery("/?tri=recent") ? "var(--green-text)" : "var(--text-tertiary)" }}>
            <ClockIcon />
          </span>
          <span className="truncate">Recent</span>
        </Link>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          4. Divider
      ═══════════════════════════════════════════════════════════════════════ */}
      <Divider />

      {/* ═══════════════════════════════════════════════════════════════════════
          5. Favoris section
      ═══════════════════════════════════════════════════════════════════════ */}
      <CollapsibleSection
        label="Favoris"
        expanded={expandedSections.favoris}
        onToggle={() => toggleSection("favoris")}
      >
        {favorites.length === 0 ? (
          <p
            className="text-[11px] italic px-[18px] py-2"
            style={{ color: "var(--text-tertiary)" }}
          >
            Etoile un feed pour l&apos;epingler ici
          </p>
        ) : (
          <div className="pb-1">
            {favorites.map((fk) => (
              <Link
                key={fk}
                href={favHref(fk)}
                className="flex items-center gap-[9px] text-[13px] px-2.5 py-[7px] mx-[10px] rounded-lg transition-colors group"
                style={{ color: "var(--text-secondary)" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "var(--bg-secondary)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "";
                }}
              >
                <span className="shrink-0" style={{ color: "var(--green)" }}>
                  <StarIcon filled size={14} />
                </span>
                <span className="truncate">{favLabel(fk)}</span>
              </Link>
            ))}
          </div>
        )}
      </CollapsibleSection>

      {/* ═══════════════════════════════════════════════════════════════════════
          6. Visites recentes section
      ═══════════════════════════════════════════════════════════════════════ */}
      <CollapsibleSection
        label="Visites recemment"
        expanded={expandedSections.recents}
        onToggle={() => toggleSection("recents")}
      >
        {recents.length === 0 ? (
          <p
            className="text-[11px] italic px-[18px] py-2"
            style={{ color: "var(--text-tertiary)" }}
          >
            Tes visites recentes apparaitront ici
          </p>
        ) : (
          <div className="pb-1">
            {recents.map((rk) => {
              const label = rk.includes(":") ? favLabel(rk) : rk;
              const href = rk.includes(":") ? favHref(rk) : "/";
              return (
                <Link
                  key={rk}
                  href={href}
                  className="flex items-center gap-[9px] text-[13px] px-2.5 py-[7px] mx-[10px] rounded-lg transition-colors"
                  style={{ color: "var(--text-secondary)" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "var(--bg-secondary)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "";
                  }}
                >
                  <span className="shrink-0" style={{ color: "var(--text-tertiary)" }}>
                    <SmallClockIcon />
                  </span>
                  <span className="truncate">{label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </CollapsibleSection>

      {/* ═══════════════════════════════════════════════════════════════════════
          7. Divider
      ═══════════════════════════════════════════════════════════════════════ */}
      <Divider />

      {/* ═══════════════════════════════════════════════════════════════════════
          8. Categories section
      ═══════════════════════════════════════════════════════════════════════ */}
      <CollapsibleSection
        label="Categories"
        expanded={expandedSections.categories}
        onToggle={() => toggleSection("categories")}
      >
        <div className="pb-1">
          {CATEGORIES.map((cat) => {
            const CatIcon = CAT_ICONS[cat.slug] || CatVenteIcon;
            const href = `/categorie/${cat.slug}`;
            const active = isActive(href);
            const fk = favKey("cat", cat.slug);
            const isFav = favorites.includes(fk);

            return (
              <div
                key={cat.slug}
                className="group relative"
              >
                <Link
                  href={href}
                  className={navItemClass(active)}
                  style={navItemStyle(active)}
                  onClick={() => addRecent(favKey("cat", cat.slug))}
                >
                  <span className="shrink-0" style={{ color: active ? "var(--green-text)" : "var(--text-tertiary)" }}>
                    <CatIcon />
                  </span>
                  <span className="truncate">{cat.label}</span>
                  <span
                    className="text-[10px] px-1.5 py-[1px] rounded-full font-semibold ml-auto"
                    style={{
                      background: "var(--bg-secondary)",
                      color: "var(--text-tertiary)",
                    }}
                  >
                    --
                  </span>
                  <button
                    onClick={(e) => toggleFav(fk, e)}
                    className="shrink-0 transition-opacity"
                    style={{
                      opacity: isFav ? 1 : undefined,
                      color: isFav ? "var(--green)" : "var(--text-tertiary)",
                    }}
                    aria-label={isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
                  >
                    <span className={isFav ? "" : "opacity-0 group-hover:opacity-100 transition-opacity"}>
                      <StarIcon filled={isFav} size={14} />
                    </span>
                  </button>
                </Link>
              </div>
            );
          })}
        </div>
      </CollapsibleSection>

      {/* ═══════════════════════════════════════════════════════════════════════
          9. Divider
      ═══════════════════════════════════════════════════════════════════════ */}
      <Divider />

      {/* ═══════════════════════════════════════════════════════════════════════
          10. Villes section
      ═══════════════════════════════════════════════════════════════════════ */}
      <CollapsibleSection
        label="Villes"
        expanded={expandedSections.villes}
        onToggle={() => toggleSection("villes")}
      >
        {/* Search */}
        <div className="px-[14px] pb-1 pt-0.5">
          <div
            className="flex items-center gap-1.5 px-2.5 py-[5px] rounded-full"
            style={{
              background: "var(--bg-secondary)",
              border: "0.5px solid var(--border)",
            }}
          >
            <span style={{ color: "var(--text-tertiary)" }}>
              <SearchIcon />
            </span>
            <input
              type="text"
              placeholder="Chercher une ville..."
              value={villeSearch}
              onChange={(e) => {
                setVilleSearch(e.target.value);
                if (!showAllVilles && e.target.value) setShowAllVilles(true);
              }}
              className="bg-transparent outline-none text-[12px] w-full placeholder:text-[var(--text-tertiary)]"
              style={{ color: "var(--text-primary)" }}
            />
          </div>
        </div>

        {/* Ville list */}
        <div className="pb-1">
          {displayedVilles.map((v) => {
            const href = `/ville/${v.slug}`;
            const active = isActive(href);
            const fk = favKey("ville", v.slug);
            const isFav = favorites.includes(fk);

            return (
              <div key={v.slug} className="group">
                <Link
                  href={href}
                  className="flex items-center text-[12px] pl-[26px] pr-2.5 py-[5px] mx-[10px] rounded-lg transition-colors"
                  style={{
                    color: active ? "var(--green-text)" : "var(--text-secondary)",
                    background: active ? "var(--green-light-bg)" : undefined,
                  }}
                  onClick={() => addRecent(favKey("ville", v.slug))}
                  onMouseEnter={(e) => {
                    if (!active) (e.currentTarget as HTMLElement).style.background = "var(--bg-secondary)";
                  }}
                  onMouseLeave={(e) => {
                    if (!active) (e.currentTarget as HTMLElement).style.background = "";
                  }}
                >
                  <span className="truncate flex-1">{v.nom}</span>
                  <button
                    onClick={(e) => toggleFav(fk, e)}
                    className="shrink-0 ml-1 transition-opacity"
                    style={{
                      opacity: isFav ? 1 : undefined,
                      color: isFav ? "var(--green)" : "var(--text-tertiary)",
                    }}
                    aria-label={isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
                  >
                    <span className={isFav ? "" : "opacity-0 group-hover:opacity-100 transition-opacity"}>
                      <StarIcon filled={isFav} size={14} />
                    </span>
                  </button>
                </Link>
              </div>
            );
          })}

          {/* Voir toutes les villes */}
          {!showAllVilles && filteredVilles.length > 7 && (
            <button
              onClick={() => setShowAllVilles(true)}
              className="flex items-center gap-1 text-[11px] font-medium pl-[26px] mx-[10px] pt-1 pb-0.5 cursor-pointer"
              style={{ color: "var(--green)" }}
            >
              Voir toutes les villes
              <DownChevronSmall />
            </button>
          )}
          {showAllVilles && !villeSearch && (
            <button
              onClick={() => setShowAllVilles(false)}
              className="flex items-center gap-1 text-[11px] font-medium pl-[26px] mx-[10px] pt-1 pb-0.5 cursor-pointer"
              style={{ color: "var(--green)" }}
            >
              Voir moins
            </button>
          )}
        </div>
      </CollapsibleSection>

      {/* ═══════════════════════════════════════════════════════════════════════
          11. Divider
      ═══════════════════════════════════════════════════════════════════════ */}
      <Divider />

      {/* ═══════════════════════════════════════════════════════════════════════
          12. Quartiers section
      ═══════════════════════════════════════════════════════════════════════ */}
      <CollapsibleSection
        label="Quartiers"
        expanded={expandedSections.quartiers}
        onToggle={() => toggleSection("quartiers")}
      >
        {/* Search */}
        <div className="px-[14px] pb-1 pt-0.5">
          <div
            className="flex items-center gap-1.5 px-2.5 py-[5px] rounded-full"
            style={{
              background: "var(--bg-secondary)",
              border: "0.5px solid var(--border)",
            }}
          >
            <span style={{ color: "var(--text-tertiary)" }}>
              <SearchIcon />
            </span>
            <input
              type="text"
              placeholder="Chercher un quartier..."
              value={quartierSearch}
              onChange={(e) => {
                setQuartierSearch(e.target.value);
                if (!showAllQuartiers && e.target.value) setShowAllQuartiers(true);
              }}
              className="bg-transparent outline-none text-[12px] w-full placeholder:text-[var(--text-tertiary)]"
              style={{ color: "var(--text-primary)" }}
            />
          </div>
        </div>

        {/* Quartier list */}
        <div className="pb-1">
          {displayedQuartiers.map((q) => {
            const href = `/quartier/${q.slug}`;
            const active = isActive(href);
            const fk = favKey("quartier", q.slug);
            const isFav = favorites.includes(fk);

            return (
              <div key={q.slug} className="group">
                <Link
                  href={href}
                  className="flex items-center text-[12px] pl-[26px] pr-2.5 py-[5px] mx-[10px] rounded-lg transition-colors"
                  style={{
                    color: active ? "var(--green-text)" : "var(--text-secondary)",
                    background: active ? "var(--green-light-bg)" : undefined,
                  }}
                  onClick={() => addRecent(favKey("quartier", q.slug))}
                  onMouseEnter={(e) => {
                    if (!active) (e.currentTarget as HTMLElement).style.background = "var(--bg-secondary)";
                  }}
                  onMouseLeave={(e) => {
                    if (!active) (e.currentTarget as HTMLElement).style.background = "";
                  }}
                >
                  <span className="truncate flex-1">{q.nom}</span>
                  <button
                    onClick={(e) => toggleFav(fk, e)}
                    className="shrink-0 ml-1 transition-opacity"
                    style={{
                      opacity: isFav ? 1 : undefined,
                      color: isFav ? "var(--green)" : "var(--text-tertiary)",
                    }}
                    aria-label={isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
                  >
                    <span className={isFav ? "" : "opacity-0 group-hover:opacity-100 transition-opacity"}>
                      <StarIcon filled={isFav} size={14} />
                    </span>
                  </button>
                </Link>
              </div>
            );
          })}

          {/* Voir tous les quartiers */}
          {!showAllQuartiers && filteredQuartiers.length > 7 && (
            <button
              onClick={() => setShowAllQuartiers(true)}
              className="flex items-center gap-1 text-[11px] font-medium pl-[26px] mx-[10px] pt-1 pb-0.5 cursor-pointer"
              style={{ color: "var(--green)" }}
            >
              Voir tous les quartiers
              <DownChevronSmall />
            </button>
          )}
          {showAllQuartiers && !quartierSearch && (
            <button
              onClick={() => setShowAllQuartiers(false)}
              className="flex items-center gap-1 text-[11px] font-medium pl-[26px] mx-[10px] pt-1 pb-0.5 cursor-pointer"
              style={{ color: "var(--green)" }}
            >
              Voir moins
            </button>
          )}
        </div>
      </CollapsibleSection>

      {/* Bottom padding */}
      <div className="pb-10" />
    </aside>
  );
}
