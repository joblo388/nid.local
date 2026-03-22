import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { PostsFiltres } from "@/components/PostsFiltres";
import { Sidebar } from "@/components/Sidebar";
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
    title: `${quartier.nom} — nid.local`,
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

  const [dbPostsQuartier, allDbPosts, userVotes] = await Promise.all([
    prisma.post.findMany({ where: { quartierSlug: slug }, orderBy: { nbVotes: "desc" } }),
    prisma.post.findMany({ select: { villeSlug: true, quartierSlug: true, nbVues: true, nbCommentaires: true, id: true, titre: true, contenu: true, auteurNom: true, categorie: true, nbVotes: true, epingle: true, creeLe: true, auteurId: true } }),
    userId ? prisma.vote.findMany({ where: { userId }, select: { postId: true } }) : [],
  ]);

  const postsQuartier = dbPostsQuartier.map(dbPostToAppPost);
  const allPosts = allDbPosts.map(dbPostToAppPost);
  const votedPostIds = new Set(userVotes.map((v) => v.postId));

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
              <div>
                <h1 className="text-[18px] font-bold" style={{ color: "var(--text-primary)" }}>
                  {quartier.nom}
                </h1>
                {ville && (
                  <p className="text-[12px]" style={{ color: "var(--text-tertiary)" }}>{ville.nom}</p>
                )}
              </div>
            </div>

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
              <PostsFiltres posts={postsQuartier} votedPostIds={votedPostIds} />
            )}
          </div>
          <Sidebar villeSlug={quartier.villeSlug} posts={allPosts} />
        </div>
      </main>
    </div>
  );
}
