import { prisma } from "@/lib/prisma";
import { dbPostToAppPost } from "@/lib/data";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { PostCard } from "@/components/PostCard";
import { auth } from "@/auth";
import Link from "next/link";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tendances",
  description: "Les discussions les plus actives cette semaine sur nid.local",
};

export default async function TendancesPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const oneWeekAgo = new Date(Date.now() - 7 * 86400000);

  // Most active posts this week (by votes + comments)
  const dbPosts = await prisma.post.findMany({
    where: { creeLe: { gte: oneWeekAgo } },
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

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-page)" }}>
      <Header />
      <main className="max-w-[1100px] mx-auto px-3 md:px-5 py-4 md:py-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-[22px] font-bold" style={{ color: "var(--text-primary)" }}>Tendances</h1>
            <p className="text-[13px] mt-1" style={{ color: "var(--text-tertiary)" }}>Les discussions les plus actives des 7 derniers jours</p>
          </div>
          <Link
            href="/"
            className="text-[13px] font-medium transition-opacity hover:opacity-70"
            style={{ color: "var(--green)" }}
          >
            ← Retour au fil
          </Link>
        </div>

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
                Populaires cette semaine
              </h2>
              {trendingPosts.length === 0 ? (
                <div
                  className="rounded-xl px-6 py-12 text-center"
                  style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
                >
                  <p className="text-[14px]" style={{ color: "var(--text-secondary)" }}>
                    Pas encore de tendances cette semaine.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {trendingPosts.map((post) => (
                    <PostCard key={post.id} post={post} hasVoted={votedPostIds.has(post.id)} />
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
