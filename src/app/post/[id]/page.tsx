import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { CommentSection } from "@/components/CommentSection";
import { PostActions } from "@/components/PostActions";
import { ShareButton } from "@/components/ShareButton";
import { ReportButton } from "@/components/ReportButton";
import { VoteButton } from "@/components/VoteButton";
import { dbPostToAppPost } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { Categorie } from "@/lib/types";

export const dynamic = "force-dynamic";

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
  const session = await auth();

  const userId = session?.user?.id;
  const [dbPost, allDbPosts, dbComments, userVote] = await Promise.all([
    prisma.post.findUnique({ where: { id } }),
    prisma.post.findMany({ select: { villeSlug: true, quartierSlug: true, nbVues: true, nbCommentaires: true, id: true, titre: true, contenu: true, auteurNom: true, categorie: true, nbVotes: true, epingle: true, creeLe: true, auteurId: true } }),
    prisma.comment.findMany({ where: { postId: id }, orderBy: { creeLe: "asc" } }),
    userId ? prisma.vote.findUnique({ where: { userId_postId: { userId, postId: id } } }) : null,
  ]);

  if (!dbPost) notFound();

  // Incrémenter les vues (sans attendre)
  prisma.post.update({ where: { id }, data: { nbVues: { increment: 1 } } }).catch(() => {});

  const post = dbPostToAppPost(dbPost);
  const allPosts = allDbPosts.map(dbPostToAppPost);
  const comments = dbComments.map((c) => ({ ...c, creeLe: c.creeLe.toISOString(), auteurId: c.auteurId ?? null }));

  const isAuthor = !!(session?.user?.id && session.user.id === dbPost.auteurId);

  const dateStr = new Date(post.creeLe).toLocaleDateString("fr-CA", {
    year: "numeric", month: "long", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

  const badge = badgeStyles[post.categorie] ?? { bg: "var(--bg-secondary)", color: "var(--text-secondary)" };

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-page)" }}>
      <Header />
      <main className="max-w-[1100px] mx-auto px-5 py-5">
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

              <p className="text-[14px] leading-relaxed mb-6" style={{ color: "var(--text-secondary)" }}>
                {post.contenu}
              </p>

              <div
                className="flex items-center justify-between pt-4"
                style={{ borderTop: "0.5px solid var(--border)" }}
              >
                <div className="flex items-center gap-3 text-[12px]" style={{ color: "var(--text-tertiary)" }}>
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
                  <span>·</span>
                  <span>{dateStr}</span>
                  <span>·</span>
                  <span>{post.nbVues.toLocaleString("fr-CA")} vues</span>
                </div>
                <div className="flex items-center gap-3">
                  <ShareButton />
                  {!isAuthor && <ReportButton type="post" targetId={post.id} />}
                </div>
                <VoteButton postId={post.id} initialVotes={post.nbVotes} initialHasVoted={!!userVote} />
              </div>

              {isAuthor && (
                <PostActions
                  postId={post.id}
                  initialTitre={post.titre}
                  initialContenu={post.contenu}
                  initialCategorie={post.categorie as Categorie}
                />
              )}
            </article>

            <CommentSection postId={post.id} initial={comments} />
          </div>
          <Sidebar posts={allPosts} />
        </div>
      </main>
    </div>
  );
}
