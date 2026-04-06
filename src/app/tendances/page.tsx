import { prisma } from "@/lib/prisma";
import { dbPostToAppPost } from "@/lib/data";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { PostCard } from "@/components/PostCard";
import { auth } from "@/auth";
import Link from "next/link";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

const BASE_URL = process.env.NEXTAUTH_URL?.replace(/\/$/, "") ?? "https://nidlocal.com";

export const metadata: Metadata = {
  title: "Tendances",
  description: "Les discussions les plus actives cette semaine sur nid.local",
  keywords: ["tendances immobilier québec", "discussions populaires immobilier", "marché immobilier 2026", "forum immobilier populaire"],
  alternates: { canonical: `${BASE_URL}/tendances` },
  openGraph: { title: "Tendances", description: "Les discussions les plus actives cette semaine sur nid.local", url: `${BASE_URL}/tendances`, siteName: "nid.local", locale: "fr_CA", type: "website" },
  twitter: { card: "summary_large_image", title: "Tendances", description: "Les discussions les plus actives cette semaine sur nid.local" },
};

const PERIODES = [
  { value: 7, label: "Cette semaine" },
  { value: 30, label: "Ce mois" },
  { value: 90, label: "Ce trimestre" },
] as const;

const CATEGORIE_LABELS: Record<string, string> = {
  vente: "Vente",
  location: "Location",
  question: "Questions",
  renovation: "Rénovation",
  voisinage: "Voisinage",
  alerte: "Alertes",
  construction: "Construction",
  legal: "Légal",
  financement: "Financement",
  copropriete: "Copropriété",
};

type Props = { searchParams: Promise<{ periode?: string }> };

export default async function TendancesPage({ searchParams }: Props) {
  const { periode: periodeParam } = await searchParams;
  const period = [7, 30, 90].includes(Number(periodeParam)) ? Number(periodeParam) : 7;

  const session = await auth();
  const userId = session?.user?.id;

  const cutoff = new Date(Date.now() - period * 86400000);

  // Most active posts for the selected period (by votes + comments)
  const dbPosts = await prisma.post.findMany({
    where: { creeLe: { gte: cutoff } },
    orderBy: [{ nbVotes: "desc" }, { nbCommentaires: "desc" }],
    take: 30,
    include: { auteur: { select: { tag: true } } },
  });

  const postIds = dbPosts.map((p) => p.id);
  const userVotes = userId
    ? await prisma.vote.findMany({ where: { userId, postId: { in: postIds } }, select: { postId: true } })
    : [];
  const votedPostIds = new Set(userVotes.map((v) => v.postId));

  const trendingPosts = dbPosts.map(dbPostToAppPost);

  // Summary stats
  const totalVotes = trendingPosts.reduce((sum, p) => sum + p.nbVotes, 0);

  const categorieCounts: Record<string, number> = {};
  for (const p of trendingPosts) {
    categorieCounts[p.categorie] = (categorieCounts[p.categorie] ?? 0) + 1;
  }
  const topCategorie = Object.entries(categorieCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
  const topCategorieLabel = topCategorie ? (CATEGORIE_LABELS[topCategorie] ?? topCategorie) : null;

  const periodeLabel = PERIODES.find((p) => p.value === period)?.label.toLowerCase() ?? "cette semaine";

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-page)" }}>
      <Header />
      <main className="max-w-[1100px] mx-auto px-3 md:px-5 py-4 md:py-6">
        <div className="mb-5">
          <h1 className="text-[22px] font-bold" style={{ color: "var(--text-primary)" }}>Tendances</h1>
          <p className="text-[13px] mt-1" style={{ color: "var(--text-tertiary)" }}>Les discussions les plus actives</p>
        </div>

        {/* Period filter tabs */}
        <div className="flex gap-2 mb-3">
          {PERIODES.map((p) => {
            const isActive = p.value === period;
            return (
              <Link
                key={p.value}
                href={`/tendances?periode=${p.value}`}
                className="text-[13px] font-medium px-3 py-1.5 rounded-lg transition-colors"
                style={{
                  background: isActive ? "var(--green-light-bg)" : "transparent",
                  color: isActive ? "var(--green-text)" : "var(--text-secondary)",
                }}
              >
                {p.label}
              </Link>
            );
          })}
        </div>

        {/* Summary stats */}
        {trendingPosts.length > 0 && (
          <p className="text-[13px] mb-4" style={{ color: "var(--text-secondary)" }}>
            {totalVotes} vote{totalVotes !== 1 ? "s" : ""} {periodeLabel}
            {topCategorieLabel && <>{" "}· {"Catégorie la plus active : "}{topCategorieLabel}</>}
          </p>
        )}

        <div className="flex gap-5 items-start">
          {/* Main content */}
          <div className="flex-1 min-w-0 space-y-6">
            {/* Trending */}
            <div>
              <h2
                className="text-[11px] font-semibold uppercase tracking-wider mb-3 flex items-center gap-2"
                style={{ color: "var(--text-tertiary)" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
                </svg>
                Populaires {periodeLabel}
              </h2>
              {trendingPosts.length === 0 ? (
                <div
                  className="rounded-xl px-6 py-12 text-center"
                  style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
                >
                  <p className="text-[14px]" style={{ color: "var(--text-secondary)" }}>
                    Pas encore de tendances {periodeLabel}.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {trendingPosts.map((post, index) => (
                    <div key={post.id} className="flex items-start gap-2">
                      <span
                        className="text-[13px] font-bold shrink-0 text-center pt-3"
                        style={{
                          width: 28,
                          color: index < 3 ? "var(--green)" : "var(--text-tertiary)",
                        }}
                      >
                        #{index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <PostCard post={post} hasVoted={votedPostIds.has(post.id)} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <Sidebar />
        </div>
      </main>
    </div>
  );
}
