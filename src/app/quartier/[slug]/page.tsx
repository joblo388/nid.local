import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { PostsFiltres } from "@/components/PostsFiltres";
import { Sidebar } from "@/components/Sidebar";
import { SubscribeButton } from "@/components/SubscribeButton";
import { QuartierReviews } from "@/components/QuartierReviews";
import { quartiers, villeBySlug, dbPostToAppPost } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return quartiers.map((q) => ({ slug: q.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const quartier = quartiers.find((q) => q.slug === slug);
  if (!quartier) return {};
  const ville = villeBySlug[quartier.villeSlug];
  return {
    title: quartier.nom,
    description: `Discussions immobilières dans le quartier ${quartier.nom}${ville ? ` à ${ville.nom}` : ""}. Ventes, locations, questions et alertes de voisinage.`,
  };
}

export default async function QuartierPage({ params }: Props) {
  const { slug } = await params;
  const quartier = quartiers.find((q) => q.slug === slug);
  if (!quartier) notFound();

  const ville = villeBySlug[quartier.villeSlug];

  const session = await auth();
  const userId = session?.user?.id;

  const userRecord = userId
    ? await prisma.user.findUnique({ where: { id: userId }, select: { role: true } })
    : null;
  const isAdmin = userRecord?.role === "admin";

  const PAGE_SIZE = 20;
  const whereQuartier = { quartierSlug: slug };
  const orderBy = [{ epingle: "desc" as const }, { nbVotes: "desc" as const }];

  const [dbPostsQuartier, totalQuartier, userVotes, userBookmarks, byVille, byQuartier, totaux, quartierSub] = await Promise.all([
    prisma.post.findMany({ where: whereQuartier, orderBy, take: PAGE_SIZE, include: { auteur: { select: { tag: true } } } }),
    prisma.post.count({ where: whereQuartier }),
    userId ? prisma.vote.findMany({ where: { userId }, select: { postId: true } }) : [],
    userId ? prisma.bookmark.findMany({ where: { userId }, select: { postId: true } }) : [],
    prisma.post.groupBy({ by: ["villeSlug"], _count: { _all: true } }),
    prisma.post.groupBy({ by: ["quartierSlug"], _count: { _all: true } }),
    prisma.post.aggregate({ _sum: { nbVues: true, nbCommentaires: true }, _count: { _all: true } }),
    userId ? prisma.quartierSubscription.findUnique({ where: { userId_quartierSlug: { userId, quartierSlug: slug } } }) : null,
  ]);

  const postsQuartier = dbPostsQuartier.map(dbPostToAppPost);
  const initialVotedPostIds = userVotes.map((v) => v.postId);
  const initialBookmarkedPostIds = userBookmarks.map((b) => b.postId);

  const sidebarStats = {
    countsByVille: Object.fromEntries(byVille.map((r) => [r.villeSlug, r._count._all])),
    countsByQuartier: Object.fromEntries(byQuartier.map((r) => [r.quartierSlug, r._count._all])),
    totalPosts: totaux._count._all,
    totalVues: totaux._sum.nbVues ?? 0,
    totalReponses: totaux._sum.nbCommentaires ?? 0,
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-page)" }}>
      <Header />
      <main className="max-w-[1100px] mx-auto px-5 py-5">
        <div className="flex gap-5 items-start">
          <div className="flex-1 min-w-0 space-y-3">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-[12px]" style={{ color: "var(--text-tertiary)" }}>
              <Link href="/" className="hover:opacity-70 transition-opacity">Province de Québec</Link>
              <span>/</span>
              {ville && (
                <>
                  <Link href={`/ville/${ville.slug}`} className="hover:opacity-70 transition-opacity">
                    {ville.nom}
                  </Link>
                  <span>/</span>
                </>
              )}
              <span style={{ color: "var(--text-primary)" }}>{quartier.nom}</span>
            </div>

            {/* En-tête */}
            <div className="flex items-center gap-2.5">
              <span className={`w-3 h-3 rounded-full ${quartier.couleur}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5">
                  <h1 className="text-[22px] font-bold" style={{ color: "var(--text-primary)" }}>
                    {quartier.nom}
                  </h1>
                  {userId && (
                    <SubscribeButton quartierSlug={slug} initialSubscribed={!!quartierSub} />
                  )}
                </div>
                {ville && (
                  <p className="text-[12px]" style={{ color: "var(--text-tertiary)" }}>{ville.nom}</p>
                )}
              </div>
            </div>

            <QuartierReviews quartierSlug={slug} />

            {postsQuartier.length === 0 ? (
              <div
                className="rounded-xl p-10 text-center"
                style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
              >
                <p className="text-[13px]" style={{ color: "var(--text-secondary)" }}>
                  Aucune publication dans ce quartier pour l&apos;instant.
                </p>
                <Link
                  href="/nouveau-post"
                  className="mt-4 inline-block text-[13px] font-semibold text-white px-4 py-2 rounded-lg"
                  style={{ background: "var(--green)" }}
                >
                  Soyez le premier à publier
                </Link>
              </div>
            ) : (
              <PostsFiltres
                initialPosts={postsQuartier}
                initialTotal={totalQuartier}
                initialVotedPostIds={initialVotedPostIds}
                initialBookmarkedPostIds={initialBookmarkedPostIds}
                quartierSlug={slug}
                isAdmin={isAdmin}
              />
            )}
          </div>
          <Sidebar villeSlug={quartier.villeSlug} stats={sidebarStats} />
        </div>
      </main>
    </div>
  );
}
