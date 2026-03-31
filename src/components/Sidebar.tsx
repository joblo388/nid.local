import Link from "next/link";
import { ressourcesUtiles } from "@/lib/data";
import { prisma } from "@/lib/prisma";

export type SidebarStats = {
  countsByVille: Record<string, number>;
  countsByQuartier: Record<string, number>;
  totalPosts: number;
  totalVues: number;
  totalReponses: number;
};

type PopularPost = {
  id: string;
  titre: string;
  nbVotes: number;
  categorie: string;
  quartierSlug: string;
};

async function getSidebarData() {
  try {
    const [totaux, topPosts] = await Promise.all([
      prisma.post.aggregate({
        _sum: { nbVues: true, nbCommentaires: true },
        _count: { _all: true },
      }),
      prisma.post.findMany({
        orderBy: { nbVotes: "desc" },
        take: 3,
        select: { id: true, titre: true, nbVotes: true, categorie: true, quartierSlug: true },
      }),
    ]);

    return {
      stats: {
        totalPosts: totaux._count._all,
        totalVues: totaux._sum.nbVues ?? 0,
        totalReponses: totaux._sum.nbCommentaires ?? 0,
      },
      topPosts: topPosts as PopularPost[],
    };
  } catch {
    return {
      stats: { totalPosts: 23, totalVues: 45, totalReponses: 87 },
      topPosts: [] as PopularPost[],
    };
  }
}

const CAT_COLORS: Record<string, { bg: string; color: string }> = {
  vente: { bg: "var(--green-light-bg)", color: "var(--green-text)" },
  location: { bg: "#EEE9FB", color: "#5B31B3" },
  question: { bg: "var(--blue-bg)", color: "var(--blue-text)" },
  renovation: { bg: "var(--amber-bg)", color: "var(--amber-text)" },
  voisinage: { bg: "var(--bg-secondary)", color: "var(--text-secondary)" },
  financement: { bg: "var(--green-light-bg)", color: "var(--green-text)" },
  construction: { bg: "var(--amber-bg)", color: "var(--amber-text)" },
  legal: { bg: "var(--red-bg)", color: "var(--red-text)" },
  copropriete: { bg: "var(--blue-bg)", color: "var(--blue-text)" },
  condo: { bg: "var(--blue-bg)", color: "var(--blue-text)" },
};

export async function Sidebar() {
  const { stats, topPosts } = await getSidebarData();

  return (
    <aside className="hidden md:block space-y-3 w-[240px] shrink-0">
      {/* 1. CTA */}
      <Link
        href="/nouveau-post"
        data-tour="publier-desktop"
        className="w-full py-2.5 rounded-xl text-[13px] font-semibold text-white transition-opacity hover:opacity-90 flex items-center justify-center"
        style={{ background: "var(--green)" }}
      >
        + Nouvelle discussion
      </Link>

      {/* 2. Stats communauté */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
      >
        <div className="px-4 py-3" style={{ borderBottom: "0.5px solid var(--border)" }}>
          <h3 className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
            Communauté
          </h3>
        </div>
        <div className="grid grid-cols-2">
          {[
            { label: "Membres", valeur: "3 241" },
            { label: "Discussions", valeur: stats.totalPosts.toLocaleString("fr-CA") },
            { label: "Réponses", valeur: stats.totalReponses.toLocaleString("fr-CA") },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className="px-4 py-3"
              style={{
                borderRight: i % 2 === 0 ? "0.5px solid var(--border)" : "none",
                borderTop: i >= 2 ? "0.5px solid var(--border)" : "none",
              }}
            >
              <p className="text-[18px] font-bold leading-none" style={{ color: "var(--text-primary)" }}>
                {stat.valeur}
              </p>
              <p className="text-[11px] mt-1" style={{ color: "var(--text-tertiary)" }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Discussions populaires */}
      {topPosts.length > 0 && (
        <div
          className="rounded-xl overflow-hidden"
          style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
        >
          <div className="px-4 py-3" style={{ borderBottom: "0.5px solid var(--border)" }}>
            <h3 className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
              Discussions populaires
            </h3>
          </div>
          <ul>
            {topPosts.map((post, i) => {
              const cat = CAT_COLORS[post.categorie] ?? { bg: "var(--bg-secondary)", color: "var(--text-secondary)" };
              return (
                <li key={post.id} style={{ borderBottom: i < topPosts.length - 1 ? "0.5px solid var(--border)" : "none" }}>
                  <Link href={`/post/${post.id}`} className="block px-4 py-2.5 transition-colors hover-bg">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md"
                        style={{ background: cat.bg, color: cat.color }}
                      >
                        {post.categorie.charAt(0).toUpperCase() + post.categorie.slice(1)}
                      </span>
                      <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
                        {post.nbVotes} votes
                      </span>
                    </div>
                    <p className="text-[12px] font-medium leading-snug line-clamp-2" style={{ color: "var(--text-primary)" }}>
                      {post.titre}
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* 4. Ressources utiles */}
      <div
        data-tour="outils-desktop"
        className="rounded-xl overflow-hidden"
        style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
      >
        <div className="px-4 py-3" style={{ borderBottom: "0.5px solid var(--border)" }}>
          <h3 className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
            Ressources utiles
          </h3>
        </div>
        <ul>
          {ressourcesUtiles.map((r, i) => (
            <li key={r.label} style={{ borderBottom: i < ressourcesUtiles.length - 1 ? "0.5px solid var(--border)" : "none" }}>
              <Link href={r.href} className="flex items-center justify-between px-4 py-2.5 transition-colors hover-bg">
                <div className="min-w-0">
                  <span className="text-[13px]" style={{ color: "var(--text-primary)" }}>{r.label}</span>
                  {r.description && (
                    <p className="text-[11px] mt-0.5" style={{ color: "var(--text-tertiary)" }}>{r.description}</p>
                  )}
                </div>
                <svg className="w-3 h-3 shrink-0 ml-2" style={{ color: "var(--text-tertiary)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <p className="text-[11px] text-center px-2" style={{ color: "var(--text-tertiary)" }}>
        © 2026 nid.local | Fait au Québec
      </p>
    </aside>
  );
}
