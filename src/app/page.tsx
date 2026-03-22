import { prisma } from "@/lib/prisma";
import { dbPostToAppPost } from "@/lib/data";
import { HomepageView } from "@/components/HomepageView";
import { Header } from "@/components/Header";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const session = await auth();
  const userId = session?.user?.id;

  const [dbPosts, userVotes] = await Promise.all([
    prisma.post.findMany({ orderBy: { nbVotes: "desc" } }),
    userId ? prisma.vote.findMany({ where: { userId }, select: { postId: true } }) : [],
  ]);

  const posts = dbPosts.map(dbPostToAppPost);
  const votedPostIds = new Set(userVotes.map((v) => v.postId));
  return (
    <div className="flex flex-col min-h-screen" style={{ background: "var(--bg-page)" }}>
      <Header />
      <HomepageView posts={posts} votedPostIds={votedPostIds} />
    </div>
  );
}
