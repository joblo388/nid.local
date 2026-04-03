import { MetadataRoute } from "next";
import { villes, quartiers } from "@/lib/data";
import { CITY_SEO } from "@/lib/donneesMarche";
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

    // SEO landing pages — tool pages (priority 0.9, weekly)
    { url: `${BASE}/calculatrice-hypothecaire`, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${BASE}/calculateur-plex`, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${BASE}/acheter-ou-louer`, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${BASE}/capacite-emprunt`, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${BASE}/donnees-marche`, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${BASE}/estimation`, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${BASE}/comparer-quartiers`, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${BASE}/taxe-bienvenue`, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${BASE}/premier-acheteur`, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${BASE}/frais-achat`, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${BASE}/lexique`, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${BASE}/calculateur-augmentation-loyer`, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${BASE}/guide/droits-locataire-quebec`, changeFrequency: "monthly" as const, priority: 0.85 },

    // City-specific market data pages (priority 0.85)
    ...Object.keys(CITY_SEO).map((slug) => ({
      url: `${BASE}/donnees-marche/${slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    })),

    // Content pages (priority 0.8)
    { url: `${BASE}/ressources`, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${BASE}/guide-premier-achat`, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${BASE}/repertoire`, changeFrequency: "weekly" as const, priority: 0.8 },

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
