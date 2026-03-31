import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { quartierBySlug } from "@/lib/data";
import { MARKET } from "@/lib/donneesMarche";
import { QuickCalcClient } from "@/components/QuickCalcClient";
import { ConciergeCard } from "@/components/ConciergeCard";

/* ─── Types ────────────────────────────────────────────────────────── */

type SavedSearchItem = {
  id: string;
  nom: string;
  alerteActive: boolean;
  nbNouveaux: number;
  mode: string | null;
  prixMax: number | null;
  chambresMin: number | null;
};

type ForumPost = {
  id: string;
  titre: string;
  categorie: string;
  nbVotes: number;
  creeLe: Date;
};

/* ─── Helpers ──────────────────────────────────────────────────────── */

function timeAgo(d: Date): string {
  const days = Math.floor((Date.now() - d.getTime()) / 86400000);
  if (days === 0) return "aujourd'hui";
  if (days === 1) return "hier";
  if (days < 7) return `il y a ${days} j`;
  if (days < 30) return `il y a ${Math.floor(days / 7)} sem.`;
  if (days < 365) return `il y a ${Math.floor(days / 30)} mois`;
  return `il y a ${Math.floor(days / 365)} an${Math.floor(days / 365) > 1 ? "s" : ""}`;
}

function buildFilterSummary(s: SavedSearchItem): string {
  const parts: string[] = [];
  if (s.mode) parts.push(s.mode === "vente" ? "Achat" : "Location");
  if (s.prixMax) parts.push(`max ${(s.prixMax / 1000).toFixed(0)}k $`);
  if (s.chambresMin) parts.push(`${s.chambresMin}+ ch.`);
  return parts.length > 0 ? parts.join(", ") : "Tous les filtres";
}

const CAT_DOT_COLORS: Record<string, string> = {
  vente: "var(--green)",
  location: "#5B31B3",
  question: "var(--blue-text)",
  renovation: "var(--amber-text)",
  voisinage: "var(--text-tertiary)",
  financement: "var(--green)",
  construction: "var(--amber-text)",
  legal: "var(--red-text)",
  copropriete: "var(--blue-text)",
  condo: "var(--blue-text)",
};

const MARCHE_LABELS: Record<string, string> = {
  vendeur: "Vendeur",
  acheteur: "Acheteur",
  equilibre: "Équilibré",
};

/* ─── Data fetching ────────────────────────────────────────────────── */

async function getSavedSearches(userId: string): Promise<SavedSearchItem[]> {
  try {
    return await prisma.savedSearch.findMany({
      where: { userId },
      orderBy: { creeLe: "desc" },
      select: {
        id: true,
        nom: true,
        alerteActive: true,
        nbNouveaux: true,
        mode: true,
        prixMax: true,
        chambresMin: true,
      },
    });
  } catch {
    return [];
  }
}

async function getForumPosts(quartierSlug: string): Promise<ForumPost[]> {
  try {
    return await prisma.post.findMany({
      where: quartierSlug ? { quartierSlug } : {},
      orderBy: { nbVotes: "desc" },
      take: 3,
      select: {
        id: true,
        titre: true,
        categorie: true,
        nbVotes: true,
        creeLe: true,
      },
    });
  } catch {
    return [];
  }
}

/* ─── Component ────────────────────────────────────────────────────── */

type Props = {
  quartierSlug?: string;
};

export async function MarketplaceSidebar({ quartierSlug }: Props) {
  const session = await auth();
  const userId = session?.user?.id;

  const slug = quartierSlug || "";
  const quartierInfo = slug ? quartierBySlug[slug] : null;
  const quartierNom = quartierInfo?.nom ?? null;
  const marketSlug = slug || "rosemont";
  const marketData = MARKET[marketSlug] ?? MARKET["rosemont"];

  const [savedSearches, forumPosts] = await Promise.all([
    userId ? getSavedSearches(userId) : Promise.resolve([] as SavedSearchItem[]),
    getForumPosts(slug),
  ]);

  return (
    <aside className="hidden md:block space-y-3 w-[240px] shrink-0">

      {/* ── 1. Mes recherches ──────────────────────────────────────── */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
      >
        <div
          className="px-4 py-3 flex items-center justify-between"
          style={{ borderBottom: "0.5px solid var(--border)" }}
        >
          <h3
            className="text-[10px] font-semibold uppercase tracking-wider"
            style={{ color: "var(--text-tertiary)" }}
          >
            Mes recherches
          </h3>
          {userId && (
            <Link
              href="/annonces?save=1"
              className="text-[11px] font-semibold transition-opacity hover:opacity-80"
              style={{ color: "var(--green)" }}
            >
              + Nouvelle
            </Link>
          )}
        </div>

        {savedSearches.length > 0 ? (
          <ul>
            {savedSearches.map((s, i) => {
              const isActive = s.alerteActive;
              const hasNew = s.nbNouveaux > 0;
              const iconBg = isActive
                ? hasNew
                  ? "var(--amber-bg)"
                  : "var(--green-light-bg)"
                : "var(--bg-secondary)";
              const iconColor = isActive
                ? hasNew
                  ? "var(--amber-text)"
                  : "var(--green-text)"
                : "var(--text-tertiary)";

              return (
                <li
                  key={s.id}
                  style={{
                    borderBottom:
                      i < savedSearches.length - 1
                        ? "0.5px solid var(--border)"
                        : "none",
                  }}
                >
                  <div className="px-4 py-2.5 flex items-start gap-2.5">
                    {/* Icon */}
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: iconBg }}
                    >
                      {isActive ? (
                        hasNew ? (
                          /* Bell icon (amber) */
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ color: iconColor }}>
                            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                            <path d="M13.73 21a2 2 0 01-3.46 0" />
                          </svg>
                        ) : (
                          /* Check icon (green) */
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" style={{ color: iconColor }}>
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                        )
                      ) : (
                        /* Bell off icon (gray) */
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ color: iconColor }}>
                          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                          <path d="M13.73 21a2 2 0 01-3.46 0" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      )}
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="text-[12px] font-medium truncate"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {s.nom}
                        </span>
                        {hasNew && (
                          <span
                            className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md shrink-0"
                            style={{ background: "var(--amber-bg)", color: "var(--amber-text)" }}
                          >
                            {s.nbNouveaux} nouv.
                          </span>
                        )}
                      </div>
                      <p
                        className="text-[11px] mt-0.5"
                        style={{ color: "var(--text-tertiary)" }}
                      >
                        {buildFilterSummary(s)}
                      </p>
                      <span
                        className="inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded-md mt-1"
                        style={{
                          background: isActive ? "var(--green-light-bg)" : "var(--bg-secondary)",
                          color: isActive ? "var(--green-text)" : "var(--text-tertiary)",
                        }}
                      >
                        {isActive ? "Active" : "Off"}
                      </span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="px-4 py-4">
            <p className="text-[11px] leading-relaxed" style={{ color: "var(--text-tertiary)" }}>
              Sauvegardez une recherche pour recevoir des alertes lorsque de nouvelles annonces correspondent à vos critères.
            </p>
          </div>
        )}
      </div>

      {/* ── 2. Calculateur rapide (client component) ───────────────── */}
      <QuickCalcClient />

      {/* ── 2b. Concierge promo ────────────────────────────────────── */}
      <ConciergeCard />

      {/* ── 3. Forum du quartier ───────────────────────────────────── */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
      >
        <div className="px-4 py-3" style={{ borderBottom: "0.5px solid var(--border)" }}>
          <h3
            className="text-[10px] font-semibold uppercase tracking-wider"
            style={{ color: "var(--text-tertiary)" }}
          >
            Forum {quartierNom ?? "Général"}
          </h3>
        </div>

        {forumPosts.length > 0 ? (
          <ul>
            {forumPosts.map((post, i) => {
              const dotColor =
                CAT_DOT_COLORS[post.categorie] ?? "var(--text-tertiary)";
              return (
                <li
                  key={post.id}
                  style={{
                    borderBottom:
                      i < forumPosts.length - 1
                        ? "0.5px solid var(--border)"
                        : "none",
                  }}
                >
                  <Link
                    href={`/post/${post.id}`}
                    className="block px-4 py-2.5 transition-colors hover-bg"
                  >
                    <div className="flex items-start gap-2">
                      <span
                        className="w-2 h-2 rounded-full shrink-0 mt-1.5"
                        style={{ background: dotColor }}
                      />
                      <div className="min-w-0 flex-1">
                        <p
                          className="text-[12px] font-medium leading-snug line-clamp-2"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {post.titre}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className="text-[11px]"
                            style={{ color: "var(--text-tertiary)" }}
                          >
                            {post.nbVotes} votes
                          </span>
                          <span
                            className="text-[11px]"
                            style={{ color: "var(--text-tertiary)" }}
                          >
                            {timeAgo(post.creeLe)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="px-4 py-4">
            <p className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
              Aucune discussion pour le moment.
            </p>
          </div>
        )}

        <div style={{ borderTop: "0.5px solid var(--border)" }}>
          <Link
            href={slug ? `/quartier/${slug}` : "/"}
            className="block px-4 py-2.5 text-[11px] font-medium text-center transition-opacity hover:opacity-80"
            style={{ color: "var(--green)" }}
          >
            Toutes les discussions {quartierNom ?? ""}
          </Link>
        </div>
      </div>

      {/* ── 4. Données de marché ─────────────────────────────────── */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
      >
        <div className="px-4 py-3" style={{ borderBottom: "0.5px solid var(--border)" }}>
          <h3
            className="text-[10px] font-semibold uppercase tracking-wider"
            style={{ color: "var(--text-tertiary)" }}
          >
            Données de marché {quartierNom ? `- ${quartierNom}` : ""}
          </h3>
        </div>

        <div className="grid grid-cols-2">
          {[
            { label: "Médiane unifamiliale", valeur: marketData.uni },
            { label: "Médiane condo", valeur: marketData.condo },
            { label: "Délai moyen vente", valeur: marketData.delai },
            { label: "Type de marché", valeur: MARCHE_LABELS[marketData.marche] ?? marketData.marche },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className="px-4 py-3"
              style={{
                borderRight: i % 2 === 0 ? "0.5px solid var(--border)" : "none",
                borderTop: i >= 2 ? "0.5px solid var(--border)" : "none",
              }}
            >
              <p
                className="text-[14px] font-bold leading-none"
                style={{ color: "var(--text-primary)" }}
              >
                {stat.valeur}
              </p>
              <p
                className="text-[10px] mt-1 leading-snug"
                style={{ color: "var(--text-tertiary)" }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <div style={{ borderTop: "0.5px solid var(--border)" }}>
          <Link
            href={`/donnees-marche${slug ? `?quartier=${slug}` : ""}`}
            className="block px-4 py-2.5 text-[11px] font-medium text-center transition-opacity hover:opacity-80"
            style={{ color: "var(--green)" }}
          >
            Données complètes {quartierNom ?? ""}
          </Link>
        </div>
      </div>
    </aside>
  );
}
