import { prisma } from "@/lib/prisma";
import { dbPostToAppPost, ressourcesUtiles } from "@/lib/data";
import { Header } from "@/components/Header";
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

  // Most discussed (by comment count)
  const dbMostDiscussed = await prisma.post.findMany({
    where: { creeLe: { gte: oneWeekAgo } },
    orderBy: { nbCommentaires: "desc" },
    take: 10,
    include: { auteur: { select: { tag: true } } },
  });

  // Most viewed
  const dbMostViewed = await prisma.post.findMany({
    where: { creeLe: { gte: oneWeekAgo } },
    orderBy: { nbVues: "desc" },
    take: 10,
    include: { auteur: { select: { tag: true } } },
  });

  const allIds = [...new Set([...dbPosts, ...dbMostDiscussed, ...dbMostViewed].map((p) => p.id))];
  const userVotes = userId
    ? await prisma.vote.findMany({ where: { userId, postId: { in: allIds } }, select: { postId: true } })
    : [];
  const votedPostIds = new Set(userVotes.map((v) => v.postId));

  const trendingPosts = dbPosts.map(dbPostToAppPost);
  const mostDiscussed = dbMostDiscussed.map(dbPostToAppPost);
  const mostViewed = dbMostViewed.map(dbPostToAppPost);

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
          <aside className="hidden md:block w-[260px] shrink-0 space-y-3">
            {/* Most discussed */}
            <div
              className="rounded-xl overflow-hidden"
              style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
            >
              <div className="px-4 py-3" style={{ borderBottom: "0.5px solid var(--border)" }}>
                <h3 className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
                  Plus discutées
                </h3>
              </div>
              <ul>
                {mostDiscussed.slice(0, 5).map((post, i) => (
                  <li key={post.id} style={{ borderBottom: i < 4 ? "0.5px solid var(--border)" : "none" }}>
                    <Link href={`/post/${post.id}`} className="block px-4 py-2.5 transition-colors hover-bg">
                      <p className="text-[12px] font-medium leading-snug line-clamp-2" style={{ color: "var(--text-primary)" }}>
                        {post.titre}
                      </p>
                      <p className="text-[11px] mt-1" style={{ color: "var(--text-tertiary)" }}>
                        {post.nbCommentaires} réponses · {post.nbVotes} votes
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Most viewed */}
            <div
              className="rounded-xl overflow-hidden"
              style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
            >
              <div className="px-4 py-3" style={{ borderBottom: "0.5px solid var(--border)" }}>
                <h3 className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
                  Plus vues
                </h3>
              </div>
              <ul>
                {mostViewed.slice(0, 5).map((post, i) => (
                  <li key={post.id} style={{ borderBottom: i < 4 ? "0.5px solid var(--border)" : "none" }}>
                    <Link href={`/post/${post.id}`} className="block px-4 py-2.5 transition-colors hover-bg">
                      <p className="text-[12px] font-medium leading-snug line-clamp-2" style={{ color: "var(--text-primary)" }}>
                        {post.titre}
                      </p>
                      <p className="text-[11px] mt-1" style={{ color: "var(--text-tertiary)" }}>
                        {post.nbVues} vues · {post.nbCommentaires} réponses
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href="/annonces"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-[13px] font-medium transition-colors hover-bg"
              style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)", color: "var(--text-secondary)" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              Voir les annonces
            </Link>

            <div className="rounded-xl overflow-hidden" style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}>
              <div className="px-4 py-3" style={{ borderBottom: "0.5px solid var(--border)" }}>
                <h3 className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>Ressources utiles</h3>
              </div>
              <ul>
                {ressourcesUtiles.map((r, i) => (
                  <li key={r.label} style={{ borderBottom: i < ressourcesUtiles.length - 1 ? "0.5px solid var(--border)" : "none" }}>
                    <Link href={r.href} className="flex items-center justify-between px-4 py-2.5 transition-colors hover-bg">
                      <div className="min-w-0">
                        <span className="text-[13px]" style={{ color: "var(--text-primary)" }}>{r.label}</span>
                        {"description" in r && r.description && (
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
          </aside>
        </div>
      </main>
    </div>
  );
}
