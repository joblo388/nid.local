import { MetadataRoute } from "next";
import { villes, quartiers } from "@/lib/data";
import { prisma } from "@/lib/prisma";

const BASE = process.env.NEXTAUTH_URL?.replace(/\/$/, "") ?? "https://nid.local";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await prisma.post.findMany({
    select: { id: true, creeLe: true },
    orderBy: { creeLe: "desc" },
    take: 5000,
  });

  const CATEGORIES = ["vente", "location", "question", "renovation", "voisinage", "construction", "legal", "financement", "copropriete"];

  return [
    { url: BASE, lastModified: new Date(), changeFrequency: "hourly", priority: 1 },
    { url: `${BASE}/villes`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/quartiers`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/calculatrice-hypothecaire`, changeFrequency: "monthly" as const, priority: 0.9 },

    ...CATEGORIES.map((slug) => ({
      url: `${BASE}/categorie/${slug}`,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),

    ...villes.map((v) => ({
      url: `${BASE}/ville/${v.slug}`,
      changeFrequency: "daily" as const,
      priority: 0.7,
    })),

    ...quartiers.map((q) => ({
      url: `${BASE}/quartier/${q.slug}`,
      changeFrequency: "daily" as const,
      priority: 0.6,
    })),

    ...posts.map((p) => ({
      url: `${BASE}/post/${p.id}`,
      lastModified: p.creeLe,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })),
  ];
}
