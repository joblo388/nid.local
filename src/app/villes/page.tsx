import { Header } from "@/components/Header";
import { prisma } from "@/lib/prisma";
import { dbPostToAppPost } from "@/lib/data";
import { VillesView } from "./VillesView";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Villes et quartiers — nid.local",
  description: "Parcourez les discussions immobilières par ville et quartier au Québec.",
};

const PAGE_SIZE = 20;

export default async function VillesPage() {
  const dbPosts = await prisma.post.findMany({
    orderBy: [{ epingle: "desc" }, { nbVotes: "desc" }],
    take: PAGE_SIZE,
    include: { auteur: { select: { tag: true } } },
  });
  const total = await prisma.post.count();
  const initialPosts = dbPosts.map(dbPostToAppPost);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-page)" }}>
      <Header />
      <VillesView initialPosts={initialPosts} initialTotal={total} />
    </div>
  );
}
