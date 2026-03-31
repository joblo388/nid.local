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
import { quartiersData } from "@/data/quartiers";
import { generateDatasetSchema } from "@/lib/schema";
import { QuartierDescriptionEditor } from "@/components/QuartierDescriptionEditor";

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
  const marketData = quartiersData[slug];

  const session = await auth();
  const userId = session?.user?.id;

  const userRecord = userId
    ? await prisma.user.findUnique({ where: { id: userId }, select: { role: true } })
    : null;
  const isAdmin = userRecord?.role === "admin";

  const PAGE_SIZE = 20;
  const whereQuartier = { quartierSlug: slug };
  const orderBy = [{ epingle: "desc" as const }, { nbVotes: "desc" as const }];

  const [dbPostsQuartier, totalQuartier, userVotes, userBookmarks, quartierSub] = await Promise.all([
    prisma.post.findMany({ where: whereQuartier, orderBy, take: PAGE_SIZE, include: { auteur: { select: { tag: true } } } }),
    prisma.post.count({ where: whereQuartier }),
    userId ? prisma.vote.findMany({ where: { userId }, select: { postId: true } }) : [],
    userId ? prisma.bookmark.findMany({ where: { userId }, select: { postId: true } }) : [],
    userId ? prisma.quartierSubscription.findUnique({ where: { userId_quartierSlug: { userId, quartierSlug: slug } } }) : null,
  ]);

  const postsQuartier = dbPostsQuartier.map(dbPostToAppPost);
  const topCategories = [...new Set(postsQuartier.map(p => p.categorie))].slice(0, 3);
  const initialVotedPostIds = userVotes.map((v) => v.postId);
  const initialBookmarkedPostIds = userBookmarks.map((b) => b.postId);

  const datasetSchema = marketData ? generateDatasetSchema(
    `Données marché immobilier ${quartier.nom} 2026`,
    `Prix médians unifamiliale, condo et plex pour ${quartier.nom}`,
    `/quartier/${slug}`
  ) : null;

  return (
    <>
      {datasetSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema) }}
        />
      )}
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

            {/* Données de marché du quartier */}
            {marketData && (() => {
              const maxVal = Math.max(...marketData.historiquePrix.map((h) => h.valeur));
              return (
                <div className="space-y-3">
                  {/* Prix grid - 3 colonnes */}
                  <div
                    className="rounded-xl p-4"
                    style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
                  >
                    <h2
                      className="text-[14px] font-bold mb-3"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Prix médians - {marketData.nom}
                    </h2>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: "Unifamiliale", prix: marketData.uniMedian, tendance: marketData.tendanceUni },
                        { label: "Condo", prix: marketData.condoMedian, tendance: marketData.tendanceCondo },
                        { label: "Plex", prix: marketData.plexMedian, tendance: marketData.tendancePlex },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className="rounded-lg p-3 text-center"
                          style={{ background: "var(--bg-secondary)", border: "0.5px solid var(--border)" }}
                        >
                          <p className="text-[11px] mb-1" style={{ color: "var(--text-tertiary)" }}>
                            {item.label}
                          </p>
                          <p className="text-[16px] font-bold" style={{ color: "var(--text-primary)" }}>
                            {item.prix}
                          </p>
                          <p
                            className="text-[12px] font-semibold mt-1"
                            style={{
                              color: parseFloat(item.tendance) > 8
                                ? "var(--red-text)"
                                : "var(--green-text)",
                            }}
                          >
                            {item.tendance}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Historique des prix - graphique a barres */}
                  <div
                    className="rounded-xl p-4"
                    style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
                  >
                    <h2
                      className="text-[14px] font-bold mb-3"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Historique des prix (unifamiliale)
                    </h2>
                    {(() => {
                      const minVal = Math.min(...marketData.historiquePrix.map((x) => x.valeur));
                      const range = maxVal - minVal || 1;
                      return (
                        <div className="flex gap-2" style={{ height: "140px" }}>
                          {marketData.historiquePrix.map((h, i) => {
                            const barPct = 25 + ((h.valeur - minVal) / range) * 75;
                            const isRecent = i >= marketData.historiquePrix.length - 2;
                            return (
                              <div key={h.annee} className="flex-1 relative">
                                <span
                                  className="absolute left-0 right-0 text-center text-[10px] font-semibold"
                                  style={{ color: "var(--text-tertiary)", bottom: `calc(${barPct}% + 16px)` }}
                                >
                                  {(h.valeur / 1000).toFixed(0)}k
                                </span>
                                <div
                                  className="absolute left-0 right-0 bottom-[14px] rounded-t-sm"
                                  style={{
                                    height: `${barPct}%`,
                                    background: isRecent ? "var(--green)" : "var(--amber-bg)",
                                  }}
                                />
                                <span
                                  className="absolute left-0 right-0 bottom-0 text-center text-[10px]"
                                  style={{ color: "var(--text-tertiary)" }}
                                >
                                  {h.annee}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </div>

                  {/* Indicateurs - grille 2x2 */}
                  <div
                    className="rounded-xl p-4"
                    style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
                  >
                    <h2
                      className="text-[14px] font-bold mb-3"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Indicateurs du marché
                    </h2>
                    <div className="grid grid-cols-2 gap-3">
                      <div
                        className="rounded-lg p-3"
                        style={{ background: "var(--bg-secondary)", border: "0.5px solid var(--border)" }}
                      >
                        <p className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
                          Délai de vente
                        </p>
                        <p className="text-[15px] font-bold" style={{ color: "var(--text-primary)" }}>
                          {marketData.delaiVente}
                        </p>
                      </div>
                      <div
                        className="rounded-lg p-3"
                        style={{ background: "var(--bg-secondary)", border: "0.5px solid var(--border)" }}
                      >
                        <p className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
                          Conditions du marché
                        </p>
                        <p className="text-[15px] font-bold flex items-center gap-1.5">
                          {marketData.marcheType === "vendeur" ? (
                            <span
                              className="inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full"
                              style={{
                                background: "var(--green-light-bg)",
                                color: "var(--green-text)",
                              }}
                            >
                              Marché vendeur
                            </span>
                          ) : marketData.marcheType === "acheteur" ? (
                            <span
                              className="inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full"
                              style={{
                                background: "var(--amber-bg)",
                                color: "var(--amber-text)",
                              }}
                            >
                              Marché acheteur
                            </span>
                          ) : (
                            <span
                              className="inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full"
                              style={{
                                background: "var(--bg-secondary)",
                                color: "var(--text-secondary)",
                                border: "0.5px solid var(--border)",
                              }}
                            >
                              Marché équilibré
                            </span>
                          )}
                        </p>
                      </div>
                      <div
                        className="rounded-lg p-3"
                        style={{ background: "var(--bg-secondary)", border: "0.5px solid var(--border)" }}
                      >
                        <p className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
                          Prix au pi2
                        </p>
                        <p className="text-[15px] font-bold" style={{ color: "var(--text-primary)" }}>
                          {marketData.prixPiedCarre}
                        </p>
                      </div>
                      <div
                        className="rounded-lg p-3"
                        style={{ background: "var(--bg-secondary)", border: "0.5px solid var(--border)" }}
                      >
                        <p className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
                          Croissance 5 ans
                        </p>
                        <p
                          className="text-[15px] font-bold"
                          style={{ color: "var(--green-text)" }}
                        >
                          {marketData.croissance5ans}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3">
                    <Link
                      href={`/annonces?quartier=${slug}`}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-[13px] font-medium transition-colors"
                      style={{ background: "var(--green-light-bg)", border: "0.5px solid var(--green)", color: "var(--green-text)" }}
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M1 6l6-4 6 4v7a1 1 0 01-1 1H2a1 1 0 01-1-1V6z"/><path d="M5 13V8h4v5"/></svg>
                      Voir les annonces à {quartier.nom}
                      <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth={2}><path d="M2 5.5h7M5.5 2l3.5 3.5-3.5 3.5"/></svg>
                    </Link>
                  </div>

                  {/* Description et tags (éditable par la communauté) */}
                  <QuartierDescriptionEditor
                    slug={slug}
                    quartierNom={marketData.nom}
                    defaultDescription={marketData.description}
                    defaultTags={marketData.tags}
                  />
                </div>
              );
            })()}

            {/* Description éditable quand pas de données de marché */}
            {!marketData && (
              <QuartierDescriptionEditor
                slug={slug}
                quartierNom={quartier.nom}
                defaultDescription={[]}
                defaultTags={[]}
              />
            )}

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

            {totalQuartier < 5 && (
              <div className="rounded-xl p-4 mt-4" style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}>
                <p className="text-[12px] font-semibold mb-3" style={{ color: "var(--text-tertiary)" }}>
                  Voir plus de discussions sur ces sujets
                </p>
                <div className="flex flex-wrap gap-2">
                  {topCategories.map((cat) => (
                    <Link
                      key={cat}
                      href={`/?categorie=${cat}`}
                      className="text-[12px] px-3 py-1.5 rounded-full transition-colors"
                      style={{ border: "0.5px solid var(--border)", color: "var(--text-secondary)" }}
                    >
                      {cat.charAt(0).toUpperCase() + cat.slice(1)} →
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          <Sidebar />
        </div>
      </main>
    </div>
    </>
  );
}
