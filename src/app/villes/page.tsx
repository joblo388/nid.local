import { Header } from "@/components/Header";
import { prisma } from "@/lib/prisma";
import { dbPostToAppPost } from "@/lib/data";
import { VillesView } from "./VillesView";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

const BASE_URL = process.env.NEXTAUTH_URL?.replace(/\/$/, "") ?? "https://nidlocal.com";

export const metadata: Metadata = {
  title: "Villes et quartiers",
  description: "Parcourez les discussions immobilières par ville et quartier au Québec.",
  keywords: ["villes québec immobilier", "quartiers montréal", "immobilier par ville québec"],
  alternates: { canonical: `${BASE_URL}/villes` },
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
