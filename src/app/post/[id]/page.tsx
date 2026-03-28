import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { CommentSection } from "@/components/CommentSection";
import { PostActions } from "@/components/PostActions";
import { ShareButton } from "@/components/ShareButton";
import { VoteButton } from "@/components/VoteButton";
import { ViewTracker } from "@/components/ViewTracker";
import { ScrollProgress } from "@/components/ScrollProgress";
import { RichContent } from "@/components/RichContent";
import { PollDisplay } from "@/components/PollDisplay";
import { LightboxImage } from "@/components/LightboxImage";
import { SimilarPosts } from "@/components/SimilarPosts";
import { dbPostToAppPost } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import { Categorie } from "@/lib/types";

// Revalidate every 60 s — auth-dependent UI (vote state, edit/delete) is hydrated client-side
export const revalidate = 60;

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) return {};
  const excerpt = post.contenu.slice(0, 155).replace(/\s\S*$/, "") + "…";
  return {
    title: `${post.titre} — nid.local`,
    description: excerpt,
    openGraph: {
      title: post.titre,
      description: excerpt,
      type: "article",
      siteName: "nid.local",
    },
  };
}

const badgeStyles: Record<string, { bg: string; color: string }> = {
  alerte:    { bg: "var(--red-bg)",        color: "var(--red-text)" },
  question:  { bg: "var(--blue-bg)",       color: "var(--blue-text)" },
  vente:     { bg: "var(--green-light-bg)",color: "var(--green-text)" },
  location:  { bg: "#EEE9FB",              color: "#5B31B3" },
  renovation:{ bg: "var(--amber-bg)",      color: "var(--amber-text)" },
  voisinage: { bg: "var(--bg-secondary)",  color: "var(--text-secondary)" },
};

const badgeLabels: Record<string, string> = {
  alerte: "Alerte", question: "Question", vente: "Vente",
  location: "Location", renovation: "Conseil", voisinage: "Voisinage",
};

export default async function PostPage({ params }: Props) {
  const { id } = await params;

  const [dbPost, dbComments, byVille, byQuartier, totaux, dbPoll] = await Promise.all([
    prisma.post.findUnique({ where: { id }, include: { auteur: { select: { tag: true } } } }),
    prisma.comment.findMany({
      where: { postId: id, parentId: null },
      orderBy: { creeLe: "asc" },
      select: {
        id: true, contenu: true, imageUrl: true, auteurNom: true, auteurId: true, creeLe: true, nbVotes: true,
        auteur: { select: { tag: true } },
        replies: {
          orderBy: { creeLe: "asc" },
          select: { id: true, contenu: true, imageUrl: true, auteurNom: true, auteurId: true, creeLe: true, nbVotes: true, auteur: { select: { tag: true } } },
        },
      },
    }),
    prisma.post.groupBy({ by: ["villeSlug"], _count: { _all: true } }),
    prisma.post.groupBy({ by: ["quartierSlug"], _count: { _all: true } }),
    prisma.post.aggregate({ _sum: { nbVues: true, nbCommentaires: true }, _count: { _all: true } }),
    prisma.poll.findUnique({ where: { postId: id }, select: { id: true } }),
  ]);

  if (!dbPost) notFound();

  const post = dbPostToAppPost(dbPost);
  const comments = dbComments.map((c) => ({
    ...c,
    creeLe: c.creeLe.toISOString(),
    auteurId: c.auteurId ?? null,
    auteurTag: c.auteur?.tag ?? null,
    imageUrl: c.imageUrl ?? null,
    nbVotes: c.nbVotes,
    replies: c.replies.map((r) => ({
      ...r,
      creeLe: r.creeLe.toISOString(),
      auteurId: r.auteurId ?? null,
      auteurTag: r.auteur?.tag ?? null,
      imageUrl: r.imageUrl ?? null,
      nbVotes: r.nbVotes,
    })),
  }));

  const sidebarStats = {
    countsByVille: Object.fromEntries(byVille.map((r) => [r.villeSlug, r._count._all])),
    countsByQuartier: Object.fromEntries(byQuartier.map((r) => [r.quartierSlug, r._count._all])),
    totalPosts: totaux._count._all,
    totalVues: totaux._sum.nbVues ?? 0,
    totalReponses: totaux._sum.nbCommentaires ?? 0,
  };

  const dateStr = new Date(post.creeLe).toLocaleDateString("fr-CA", {
    year: "numeric", month: "long", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

  const badge = badgeStyles[post.categorie] ?? { bg: "var(--bg-secondary)", color: "var(--text-secondary)" };

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-page)" }}>
      {/* Track view client-side so ISR cache hits still count */}
      <ViewTracker postId={id} />
      <ScrollProgress />
      <Header />
      <main className="max-w-[1100px] mx-auto px-3 md:px-5 py-4 md:py-5">
        <div className="flex gap-5 items-start">
          <div className="flex-1 min-w-0 space-y-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-[12px] transition-opacity hover:opacity-60"
              style={{ color: "var(--text-tertiary)" }}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Retour au fil
            </Link>

            <article
              className="rounded-xl p-6"
              style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
            >
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span
                  className="px-2 py-0.5 rounded-md text-[11px] font-semibold"
                  style={{ background: badge.bg, color: badge.color }}
                >
                  {badgeLabels[post.categorie] ?? post.categorie}
                </span>
                <Link
                  href={`/quartier/${post.quartier.slug}`}
                  className="text-[12px] font-medium transition-opacity hover:opacity-70"
                  style={{ color: "var(--green)" }}
                >
                  {post.quartier.nom}
                </Link>
              </div>

              <h1 className="text-[18px] font-bold mb-4 leading-snug" style={{ color: "var(--text-primary)" }}>
                {post.titre}
              </h1>

              <div className="text-[14px] mb-6">
                <RichContent content={post.contenu} />
              </div>

              {dbPost.imageUrl && (
                <LightboxImage images={[dbPost.imageUrl]}>
                  {dbPost.imageUrl.startsWith("data:") ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={dbPost.imageUrl} alt="" className="w-full rounded-xl object-contain mb-6"
                      style={{ maxHeight: "500px", border: "0.5px solid var(--border)" }} />
                  ) : (
                    <div className="relative w-full mb-6 rounded-xl overflow-hidden" style={{ maxHeight: "500px", border: "0.5px solid var(--border)" }}>
                      <Image src={dbPost.imageUrl} alt="" width={1100} height={500}
                        className="w-full object-contain" sizes="(max-width: 1100px) 100vw, 1100px" />
                    </div>
                  )}
                </LightboxImage>
              )}

              <div
                className="pt-4 space-y-3"
                style={{ borderTop: "0.5px solid var(--border)" }}
              >
                {/* Author + date */}
                <div className="flex items-center gap-2 text-[12px] flex-wrap" style={{ color: "var(--text-tertiary)" }}>
                  <span>
                    par{" "}
                    <Link
                      href={`/u/${post.auteur}`}
                      className="font-medium transition-opacity hover:opacity-70"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {post.auteur}
                    </Link>
                  </span>
                  {post.auteurTag && (
                    <span
                      className="hidden md:inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-medium leading-none"
                      style={{ background: "var(--green-light-bg)", color: "var(--green-text)", border: "0.5px solid var(--green)" }}
                    >
                      {post.auteurTag === "courtier" ? "Courtier" : post.auteurTag === "notaire" ? "Notaire" : post.auteurTag === "finance" ? "Finance" : post.auteurTag === "entrepreneur" ? "Entrepreneur" : post.auteurTag === "electricien" ? "Électricien" : post.auteurTag === "plombier" ? "Plombier" : post.auteurTag === "charpentier" ? "Charpentier" : post.auteurTag === "proprietaire" ? "Propriétaire" : post.auteurTag === "locataire" ? "Locataire" : post.auteurTag}
                    </span>
                  )}
                  <span>·</span>
                  <span className="hidden md:inline">{dateStr}</span>
                  <span className="md:hidden">{new Date(post.creeLe).toLocaleDateString("fr-CA", { day: "numeric", month: "short" })}</span>
                  <span>·</span>
                  <span>{post.nbVues.toLocaleString("fr-CA")} vues</span>
                </div>
                {/* Actions row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ShareButton />
                    <PostActions
                      postId={post.id}
                      auteurId={dbPost.auteurId}
                      initialTitre={post.titre}
                      initialContenu={post.contenu}
                      initialCategorie={post.categorie as Categorie}
                    />
                  </div>
                  <VoteButton postId={post.id} initialVotes={post.nbVotes} initialHasVoted={false} hydrateVote />
                </div>
              </div>
            </article>

            {dbPoll && <PollDisplay pollId={dbPoll.id} />}

            <CommentSection postId={post.id} initial={comments} />

            <SimilarPosts postId={post.id} />
          </div>
          <div className="hidden md:block">
            <Sidebar stats={sidebarStats} />
          </div>
        </div>
      </main>
    </div>
  );
}
