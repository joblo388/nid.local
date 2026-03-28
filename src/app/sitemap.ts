import { MetadataRoute } from "next";
import { villes, quartiers } from "@/lib/data";
import { prisma } from "@/lib/prisma";

const BASE = process.env.NEXTAUTH_URL?.replace(/\/$/, "") ?? "https://nidlocal.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, listings] = await Promise.all([
    prisma.post.findMany({ select: { id: true, creeLe: true }, orderBy: { creeLe: "desc" }, take: 5000 }),
    prisma.listing.findMany({ where: { statut: "active" }, select: { id: true, creeLe: true }, orderBy: { creeLe: "desc" }, take: 1000 }),
  ]);

  const CATEGORIES = ["vente", "location", "question", "renovation", "voisinage", "construction", "legal", "financement", "copropriete"];

  return [
    // Core pages
    { url: BASE, lastModified: new Date(), changeFrequency: "hourly", priority: 1 },
    { url: `${BASE}/annonces`, lastModified: new Date(), changeFrequency: "hourly", priority: 0.95 },
    { url: `${BASE}/tendances`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },

    // SEO landing pages — calculatrices
    { url: `${BASE}/calculatrice-hypothecaire`, changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${BASE}/calculateur-plex`, changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${BASE}/acheter-ou-louer`, changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${BASE}/capacite-emprunt`, changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${BASE}/donnees-marche`, changeFrequency: "weekly" as const, priority: 0.9 },

    // Navigation pages
    { url: `${BASE}/villes`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/quartiers`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },

    // Categories
    ...CATEGORIES.map((slug) => ({
      url: `${BASE}/categorie/${slug}`,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),

    // Villes
    ...villes.map((v) => ({
      url: `${BASE}/ville/${v.slug}`,
      changeFrequency: "daily" as const,
      priority: 0.7,
    })),

    // Quartiers
    ...quartiers.map((q) => ({
      url: `${BASE}/quartier/${q.slug}`,
      changeFrequency: "daily" as const,
      priority: 0.6,
    })),

    // Posts
    ...posts.map((p) => ({
      url: `${BASE}/post/${p.id}`,
      lastModified: p.creeLe,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })),

    // Listings
    ...listings.map((l) => ({
      url: `${BASE}/annonces/${l.id}`,
      lastModified: l.creeLe,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
