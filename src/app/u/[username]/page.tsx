import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { PostCard } from "@/components/PostCard";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { dbPostToAppPost, quartierBySlug, villeBySlug } from "@/lib/data";

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

  const [dbPosts, dbComments, userVotes] = await Promise.all([
    prisma.post.findMany({
      where: { auteurId: user.id },
      orderBy: { creeLe: "desc" },
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
  ]);

  const posts = dbPosts.map(dbPostToAppPost);
  const votedPostIds = new Set(userVotes.map((v) => v.postId));

  const memberSince = new Date(user.createdAt).toLocaleDateString("fr-CA", {
    year: "numeric", month: "long",
  });

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-page)" }}>
      <Header />
      <main className="max-w-[1100px] mx-auto px-5 py-6 space-y-5">

        {/* En-tête profil */}
        <div
          className="rounded-xl p-6 flex items-center gap-4"
          style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-[22px] font-bold text-white shrink-0"
            style={{ background: "var(--green)" }}
          >
            {displayName[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-[18px] font-bold" style={{ color: "var(--text-primary)" }}>
              @{displayName}
            </h1>
            <p className="text-[12px] mt-0.5" style={{ color: "var(--text-tertiary)" }}>
              Membre depuis {memberSince}
            </p>
          </div>
          <div className="flex gap-5 text-center">
            <div>
              <p className="text-[18px] font-bold" style={{ color: "var(--text-primary)" }}>{posts.length}</p>
              <p className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>discussions</p>
            </div>
            <div>
              <p className="text-[18px] font-bold" style={{ color: "var(--text-primary)" }}>{dbComments.length}</p>
              <p className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>réponses</p>
            </div>
          </div>
        </div>

        <div className="flex gap-5 items-start">
          <div className="flex-1 min-w-0 space-y-4">

            {/* Posts */}
            <div>
              <h2 className="text-[12px] font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-tertiary)" }}>
                Discussions
              </h2>
              {posts.length === 0 ? (
                <div
                  className="rounded-xl p-8 text-center"
                  style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
                >
                  <p className="text-[13px]" style={{ color: "var(--text-tertiary)" }}>
                    {isOwn ? "Vous n'avez pas encore publié de discussion." : "Aucune discussion pour l'instant."}
                  </p>
                  {isOwn && (
                    <Link
                      href="/nouveau-post"
                      className="mt-3 inline-block text-[13px] font-semibold text-white px-4 py-2 rounded-lg"
                      style={{ background: "var(--green)" }}
                    >
                      Créer une discussion
                    </Link>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  {posts.map((post) => (
                    <PostCard key={post.id} post={post} hasVoted={votedPostIds.has(post.id)} />
                  ))}
                </div>
              )}
            </div>

            {/* Commentaires récents */}
            {dbComments.length > 0 && (
              <div>
                <h2 className="text-[12px] font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-tertiary)" }}>
                  Réponses récentes
                </h2>
                <div
                  className="rounded-xl overflow-hidden"
                  style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
                >
                  {dbComments.map((c, i) => (
                    <Link
                      key={c.id}
                      href={`/post/${c.post.id}`}
                      className="flex gap-3 px-4 py-3 transition-colors hover-bg"
                      style={{ borderBottom: i < dbComments.length - 1 ? "0.5px solid var(--border)" : "none" }}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] mb-1 truncate" style={{ color: "var(--text-tertiary)" }}>
                          sur : {c.post.titre}
                        </p>
                        <p className="text-[13px] line-clamp-2" style={{ color: "var(--text-secondary)" }}>
                          {c.contenu}
                        </p>
                      </div>
                      <span className="text-[11px] shrink-0 mt-0.5" style={{ color: "var(--text-tertiary)" }}>
                        {new Date(c.creeLe).toLocaleDateString("fr-CA", { month: "short", day: "numeric" })}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
