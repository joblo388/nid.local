import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { PostsFiltres } from "@/components/PostsFiltres";
import { Sidebar } from "@/components/Sidebar";
import { villes, quartiersDeVille, villeBySlug, dbPostToAppPost } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

const BASE_URL = process.env.NEXTAUTH_URL?.replace(/\/$/, "") ?? "https://nidlocal.com";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const ville = villeBySlug[slug];
  if (!ville) return {};
  return {
    title: ville.nom,
    description: `Forum immobilier de ${ville.nom}. Questions, annonces et discussions par quartier.`,
    keywords: [`immobilier ${ville.nom.toLowerCase()}`, `acheter ${ville.nom.toLowerCase()}`, `maison ${ville.nom.toLowerCase()}`],
    alternates: { canonical: `${BASE_URL}/ville/${slug}` },
  };
}

export default async function VillePage({ params }: Props) {
  const { slug } = await params;
  const ville = villeBySlug[slug];
  if (!ville) notFound();

  const qDeVille = quartiersDeVille(slug);

  const session = await auth();
  const userId = session?.user?.id;

  const PAGE_SIZE = 20;
  const whereVille = { villeSlug: slug };
  const orderBy = [{ epingle: "desc" as const }, { nbVotes: "desc" as const }];

  const [dbPostsVille, totalVille, userVotes, userBookmarks, byQuartier] = await Promise.all([
    prisma.post.findMany({ where: whereVille, orderBy, take: PAGE_SIZE, include: { auteur: { select: { tag: true } } } }),
    prisma.post.count({ where: whereVille }),
    userId ? prisma.vote.findMany({ where: { userId }, select: { postId: true } }) : [],
    userId ? prisma.bookmark.findMany({ where: { userId }, select: { postId: true } }) : [],
    prisma.post.groupBy({ by: ["quartierSlug"], _count: { _all: true } }),
  ]);

  const postsVille = dbPostsVille.map(dbPostToAppPost);
  const initialVotedPostIds = userVotes.map((v) => v.postId);
  const initialBookmarkedPostIds = userBookmarks.map((b) => b.postId);

  const countsByQuartier = Object.fromEntries(byQuartier.map((r) => [r.quartierSlug, r._count._all]));

  const quartiersAvecNb = qDeVille
    .map((q) => ({ ...q, nb: countsByQuartier[q.slug] ?? 0 }))
    .filter((q) => q.nb > 0)
    .sort((a, b) => b.nb - a.nb);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-page)" }}>
      <Header />
      <main className="max-w-[1100px] mx-auto px-5 py-5">
        <div className="flex gap-5 items-start">
          <div className="flex-1 min-w-0 space-y-4">
            {/* En-tête ville */}
            <div>
              <div className="flex items-center gap-2 text-[12px] mb-2" style={{ color: "var(--text-tertiary)" }}>
                <Link href="/" className="hover:opacity-70 transition-opacity">Province de Québec</Link>
                <span>/</span>
                <span style={{ color: "var(--text-primary)" }}>{ville.nom}</span>
              </div>
              <h1 className="text-[22px] font-bold" style={{ color: "var(--text-primary)" }}>
                {ville.nom}
              </h1>
              <p className="text-[13px] mt-0.5" style={{ color: "var(--text-tertiary)" }}>
                {ville.region}
              </p>
            </div>

            {/* Quartiers de la ville */}
            {qDeVille.length > 1 && (
              <div
                className="rounded-xl overflow-hidden"
                style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
              >
                <div className="px-4 py-3" style={{ borderBottom: "0.5px solid var(--border)" }}>
                  <h2 className="text-[12px] font-semibold uppercase tracking-wider"
                    style={{ color: "var(--text-tertiary)" }}>
                    Quartiers
                  </h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3">
                  {qDeVille.map((q, i) => {
                    const nb = countsByQuartier[q.slug] ?? 0;
                    return (
                      <Link
                        key={q.slug}
                        href={`/quartier/${q.slug}`}
                        className="flex items-center gap-2 px-4 py-3 transition-colors hover-bg"
                        style={{
                          borderBottom: "0.5px solid var(--border)",
                          borderRight: (i + 1) % 3 !== 0 ? "0.5px solid var(--border)" : "none",
                        }}
                      >
                        <span className={`w-2 h-2 rounded-full shrink-0 ${q.couleur}`} />
                        <span className="text-[13px] flex-1 truncate" style={{ color: "var(--text-primary)" }}>
                          {q.nom}
                        </span>
                        {nb > 0 && (
                          <span className="text-[10px] font-semibold px-1 py-0.5 rounded"
                            style={{ background: "var(--green-light-bg)", color: "var(--green-text)" }}>
                            {nb}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Posts */}
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-wider"
                style={{ color: "var(--text-tertiary)" }}>
                Discussions{" "}
                <span
                  className="ml-1 px-1.5 py-0.5 rounded-md text-[11px] font-bold normal-case tracking-normal"
                  style={{ background: "var(--green-light-bg)", color: "var(--green-text)" }}
                >
                  {totalVille}
                </span>
              </p>
            </div>

            {totalVille === 0 ? (
              <div
                className="rounded-xl px-6 py-12 text-center"
                style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
              >
                <p className="text-[14px]" style={{ color: "var(--text-secondary)" }}>
                  Aucune discussion à {ville.nom} pour l&apos;instant.
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
                initialPosts={postsVille}
                initialTotal={totalVille}
                initialVotedPostIds={initialVotedPostIds}
                initialBookmarkedPostIds={initialBookmarkedPostIds}
                villeSlug={slug}
              />
            )}
          </div>

          <Sidebar />
        </div>
      </main>
    </div>
  );
}
