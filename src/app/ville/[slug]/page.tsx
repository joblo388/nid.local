import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { PostsFiltres } from "@/components/PostsFiltres";
import { Sidebar } from "@/components/Sidebar";
import { villes, quartiersDeVille, villeBySlug, dbPostToAppPost } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const ville = villeBySlug[slug];
  if (!ville) return {};
  return {
    title: `${ville.nom} — nid.local`,
    description: `Forum immobilier de ${ville.nom}. Questions, annonces et discussions par quartier.`,
  };
}

export default async function VillePage({ params }: Props) {
  const { slug } = await params;
  const ville = villeBySlug[slug];
  if (!ville) notFound();

  const qDeVille = quartiersDeVille(slug);

  const session = await auth();
  const userId = session?.user?.id;

  const [dbPostsVille, allDbPosts, userVotes] = await Promise.all([
    prisma.post.findMany({ where: { villeSlug: slug }, orderBy: { nbVotes: "desc" } }),
    prisma.post.findMany({ select: { villeSlug: true, quartierSlug: true, nbVues: true, nbCommentaires: true, id: true, titre: true, contenu: true, auteurNom: true, categorie: true, nbVotes: true, epingle: true, creeLe: true, auteurId: true } }),
    userId ? prisma.vote.findMany({ where: { userId }, select: { postId: true } }) : [],
  ]);

  const postsVille = dbPostsVille.map(dbPostToAppPost);
  const allPosts = allDbPosts.map(dbPostToAppPost);
  const votedPostIds = new Set(userVotes.map((v) => v.postId));

  const quartiersAvecNb = qDeVille
    .map((q) => ({ ...q, nb: postsVille.filter((p) => p.quartier.slug === q.slug).length }))
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
                    const nb = postsVille.filter((p) => p.quartier.slug === q.slug).length;
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
                  {postsVille.length}
                </span>
              </p>
            </div>

            {postsVille.length === 0 ? (
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
              <PostsFiltres posts={postsVille} votedPostIds={votedPostIds} />
            )}
          </div>

          <Sidebar villeSlug={slug} posts={allPosts} />
        </div>
      </main>
    </div>
  );
}
