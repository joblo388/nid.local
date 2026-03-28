import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { PostCard } from "@/components/PostCard";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { dbPostToAppPost, quartierBySlug, villeBySlug } from "@/lib/data";
import { getUserBadges, badgeCouleurs } from "@/lib/badges";
import { getUserPoints } from "@/lib/points";
import { UserLevel } from "@/components/UserLevel";
import { ProfileListingCard } from "@/components/ProfileListingCard";
import { ProfileTabs } from "@/components/ProfileTabs";
import { SellerRating } from "@/components/SellerRating";
import { RecentlyViewed } from "@/components/RecentlyViewed";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ username: string }> };

export async function generateMetadata({ params }: Props) {
  const { username } = await params;
  return { title: `@${username} — nid.local` };
}

export default async function ProfilPage({ params }: Props) {
  const { username } = await params;
  const session = await auth();

  const user = await prisma.user.findFirst({
    where: { OR: [{ username }, { name: username }] },
    select: { id: true, username: true, name: true, email: true, createdAt: true },
  });

  if (!user) notFound();

  const displayName = user.username ?? user.name ?? username;
  const isOwn = session?.user?.id === user.id;

  const [dbPosts, dbComments, userVotes, postVotesAgg, commentVotesAgg, dbListings, savedReports, badges, userPoints] = await Promise.all([
    prisma.post.findMany({
      where: { auteurId: user.id },
      orderBy: { creeLe: "desc" },
      include: { auteur: { select: { tag: true } } },
    }),
    prisma.comment.findMany({
      where: { auteurId: user.id },
      orderBy: { creeLe: "desc" },
      take: 10,
      include: { post: { select: { id: true, titre: true } } },
    }),
    session?.user?.id
      ? prisma.vote.findMany({ where: { userId: session.user.id }, select: { postId: true } })
      : [],
    prisma.post.aggregate({ where: { auteurId: user.id }, _sum: { nbVotes: true } }),
    prisma.comment.aggregate({ where: { auteurId: user.id }, _sum: { nbVotes: true } }),
    prisma.listing.findMany({
      where: { auteurId: user.id },
      orderBy: { creeLe: "desc" },
      include: { images: { where: { principale: true }, take: 1 } },
    }),
    isOwn
      ? prisma.savedReport.findMany({ where: { userId: user.id }, orderBy: { creeLe: "desc" } })
      : [],
    getUserBadges(user.id),
    getUserPoints(user.id),
  ]);

  const karma = (postVotesAgg._sum.nbVotes ?? 0) + (commentVotesAgg._sum.nbVotes ?? 0);

  const posts = dbPosts.map(dbPostToAppPost);
  const votedPostIds = new Set(userVotes.map((v) => v.postId));

  const memberSince = new Date(user.createdAt).toLocaleDateString("fr-CA", {
    year: "numeric", month: "long",
  });

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-page)" }}>
      <Header />
      <main className="max-w-[1100px] mx-auto px-3 md:px-5 py-4 md:py-6 space-y-5">

        {/* En-tête profil */}
        <div
          className="rounded-xl p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-4"
          style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-[22px] font-bold text-white shrink-0"
            style={{ background: "var(--green)" }}
          >
            {displayName[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-[18px] font-bold" style={{ color: "var(--text-primary)" }}>
                @{displayName}
              </h1>
              <UserLevel
                levelName={userPoints.level.name}
                levelColor={userPoints.level.color}
                compact
              />
            </div>
            <p className="text-[12px] mt-0.5" style={{ color: "var(--text-tertiary)" }}>
              Membre depuis {memberSince}
            </p>
            <div className="mt-1.5">
              <UserLevel
                levelName={userPoints.level.name}
                levelColor={userPoints.level.color}
                points={userPoints.points}
                progress={userPoints.progress}
                nextLevelName={userPoints.nextLevel?.name}
              />
            </div>
          </div>
          <div className="flex gap-3 md:gap-5 text-center flex-wrap">
            <div>
              <p className="text-[18px] font-bold" style={{ color: "var(--text-primary)" }}>{posts.length}</p>
              <p className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>discussions</p>
            </div>
            <div>
              <p className="text-[18px] font-bold" style={{ color: "var(--text-primary)" }}>{dbListings.length}</p>
              <p className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>annonces</p>
            </div>
            <div>
              <p className="text-[18px] font-bold" style={{ color: "var(--text-primary)" }}>{dbComments.length}</p>
              <p className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>réponses</p>
            </div>
            <div>
              <p className="text-[18px] font-bold" style={{ color: "var(--green)" }}>▲ {karma}</p>
              <p className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>karma</p>
            </div>
          </div>
        </div>

        {/* Badges */}
        {badges.length > 0 && (
          <div
            className="rounded-xl p-4 md:p-5"
            style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
          >
            <h2 className="text-[13px] font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
              Badges
            </h2>
            <div className="flex flex-wrap gap-2">
              {badges.map((badge) => {
                const c = badgeCouleurs[badge.couleur];
                return (
                  <div
                    key={badge.id}
                    className="flex items-center gap-1.5 px-2 py-1 rounded-lg"
                    style={{ background: c.bg, border: "0.5px solid var(--border)" }}
                  >
                    <span className="text-[13px]">{badge.icon}</span>
                    <div>
                      <p className="text-[11px] font-semibold leading-tight" style={{ color: c.text }}>{badge.nom}</p>
                      <p className="text-[10px] leading-tight" style={{ color: "var(--text-tertiary)" }}>{badge.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Reputation vendeur — visible si l'utilisateur a des annonces */}
        {dbListings.length > 0 && (
          <SellerRating sellerId={user.id} />
        )}

        {/* Consulté récemment — visible seulement par le propriétaire du profil */}
        {isOwn && <RecentlyViewed />}

        <ProfileTabs tabs={[
          { id: "discussions", label: "Discussions", count: posts.length },
          { id: "annonces", label: "Annonces", count: dbListings.length },
          ...(isOwn ? [{ id: "finance", label: "Finance", count: savedReports.length }] : []),
          { id: "reponses", label: "Réponses", count: dbComments.length },
        ]}>
          {/* Tab: Discussions */}
          <div>
            {posts.length === 0 ? (
              <div className="rounded-xl p-8 text-center" style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}>
                <p className="text-[13px]" style={{ color: "var(--text-tertiary)" }}>
                  {isOwn ? "Vous n'avez pas encore publié de discussion." : "Aucune discussion pour l'instant."}
                </p>
                {isOwn && (
                  <Link href="/nouveau-post" className="mt-3 inline-block text-[13px] font-semibold text-white px-4 py-2 rounded-lg" style={{ background: "var(--green)" }}>
                    Créer une discussion
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} hasVoted={votedPostIds.has(post.id)} authorBadges={badges} authorLevel={{ name: userPoints.level.name, color: userPoints.level.color }} />
                ))}
              </div>
            )}
          </div>

          {/* Tab: Annonces */}
          <div>
            {dbListings.length === 0 ? (
              <div className="rounded-xl p-6 text-center" style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}>
                <p className="text-[13px] mb-3" style={{ color: "var(--text-tertiary)" }}>
                  {isOwn ? "Tu n'as pas encore publié d'annonce immobilière." : "Aucune annonce pour l'instant."}
                </p>
                {isOwn && (
                  <Link href="/annonces/publier" className="inline-block text-[13px] font-semibold text-white px-4 py-2 rounded-lg" style={{ background: "var(--green)" }}>
                    Publier une annonce
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                {dbListings.map((listing) => (
                  <ProfileListingCard
                    key={listing.id}
                    listing={{
                      id: listing.id, titre: listing.titre, prix: listing.prix,
                      adresse: listing.adresse, statut: listing.statut,
                      nbVues: listing.nbVues, nbClics: listing.nbClics,
                      imageUrl: listing.images[0]?.url ?? null,
                    }}
                    isOwn={isOwn}
                  />
                ))}
                {isOwn && (
                  <Link href="/annonces/publier" className="mt-2 inline-block text-[12px] font-medium transition-opacity hover:opacity-70" style={{ color: "var(--green)" }}>
                    + Publier une nouvelle annonce
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Tab: Finance (only if isOwn) */}
          {isOwn && (
            <div>
              {savedReports.length === 0 ? (
                <div className="rounded-xl p-6 text-center" style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}>
                  <p className="text-[13px] mb-3" style={{ color: "var(--text-tertiary)" }}>Aucun rapport sauvegardé.</p>
                  <p className="text-[12px]" style={{ color: "var(--text-tertiary)" }}>
                    Utilise les calculatrices et clique &quot;Sauvegarder ce rapport&quot; pour les retrouver ici.
                  </p>
                </div>
              ) : (
                <div className="rounded-xl overflow-hidden" style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}>
                  {savedReports.map((r, i) => {
                    const typeLabels: Record<string, { label: string; color: string; bg: string }> = {
                      hypothecaire: { label: "Hypothèque", color: "var(--blue-text)", bg: "var(--blue-bg)" },
                      plex: { label: "Plex", color: "var(--green-text)", bg: "var(--green-light-bg)" },
                      acheter_louer: { label: "Acheter/Louer", color: "var(--amber-text)", bg: "var(--amber-bg)" },
                      capacite_emprunt: { label: "Capacité", color: "var(--blue-text)", bg: "var(--blue-bg)" },
                    };
                    const t = typeLabels[r.type] ?? { label: r.type, color: "var(--text-tertiary)", bg: "var(--bg-secondary)" };
                    const resultats = JSON.parse(r.resultats);
                    return (
                      <Link key={r.id} href={`/rapport/${r.id}`} className="block px-4 py-3 transition-colors hover-bg" style={{ borderBottom: i < savedReports.length - 1 ? "0.5px solid var(--border)" : "none" }}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md" style={{ background: t.bg, color: t.color }}>{t.label}</span>
                          <span className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>{new Date(r.creeLe).toLocaleDateString("fr-CA", { day: "numeric", month: "short", year: "numeric" })}</span>
                        </div>
                        <p className="text-[13px] font-medium" style={{ color: "var(--text-primary)" }}>{r.titre}</p>
                        <div className="flex items-center gap-3 mt-1 text-[11px]" style={{ color: "var(--text-tertiary)" }}>
                          {resultats.prixMax && <span>Prix max : {parseInt(resultats.prixMax).toLocaleString("fr-CA")} $</span>}
                          {resultats.cashflowMensuel !== undefined && <span>CF : {resultats.cashflowMensuel >= 0 ? "+" : ""}{resultats.cashflowMensuel} $/mois</span>}
                          {resultats.mrb && <span>MRB : {resultats.mrb}×</span>}
                          {resultats.ecart && <span>Écart : {parseInt(resultats.ecart).toLocaleString("fr-CA")} $</span>}
                          <span className="ml-auto" style={{ color: "var(--green)" }}>Voir →</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Tab: Réponses */}
          <div>
            {dbComments.length === 0 ? (
              <div className="rounded-xl p-8 text-center" style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}>
                <p className="text-[13px]" style={{ color: "var(--text-tertiary)" }}>Aucune réponse pour l&apos;instant.</p>
              </div>
            ) : (
              <div className="rounded-xl overflow-hidden" style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}>
                {dbComments.map((c, i) => (
                  <Link key={c.id} href={`/post/${c.post.id}`} className="flex gap-3 px-4 py-3 transition-colors hover-bg" style={{ borderBottom: i < dbComments.length - 1 ? "0.5px solid var(--border)" : "none" }}>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] mb-1 truncate" style={{ color: "var(--text-tertiary)" }}>sur : {c.post.titre}</p>
                      <p className="text-[13px] line-clamp-2" style={{ color: "var(--text-secondary)" }}>{c.contenu}</p>
                    </div>
                    <span className="text-[11px] shrink-0 mt-0.5" style={{ color: "var(--text-tertiary)" }}>{new Date(c.creeLe).toLocaleDateString("fr-CA", { month: "short", day: "numeric" })}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </ProfileTabs>
      </main>
    </div>
  );
}
