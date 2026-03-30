import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { quartierBySlug } from "@/lib/data";
import { AnnonceDetailView } from "./AnnonceDetailView";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const listing = await prisma.listing.findUnique({
    where: { id },
    select: { titre: true, prix: true, adresse: true, quartierSlug: true, type: true, images: { where: { principale: true }, take: 1 } },
  });

  if (!listing) {
    return { title: "Annonce introuvable" };
  }

  const q = quartierBySlug[listing.quartierSlug];
  const quartierNom = q?.nom ?? listing.quartierSlug;
  const prix = listing.prix.toLocaleString("fr-CA") + " $";
  const title = `${prix} | ${listing.type} à ${quartierNom}`;
  const description = `${listing.titre}. ${listing.adresse}. ${prix}.`;
  const imageUrl = listing.images[0]?.url;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      ...(imageUrl && { images: [{ url: imageUrl, width: 1200, height: 630 }] }),
    },
    twitter: {
      card: imageUrl ? "summary_large_image" : "summary",
      title,
      description,
    },
  };
}

export default async function AnnonceDetailPage({ params }: Props) {
  const { id } = await params;
  const listing = await prisma.listing.findUnique({
    where: { id },
    select: {
      id: true,
      titre: true,
      description: true,
      prix: true,
      adresse: true,
      quartierSlug: true,
      villeSlug: true,
      type: true,
      mode: true,
      creeLe: true,
      images: { where: { principale: true }, take: 1 },
    },
  });

  const jsonLd = listing
    ? {
        "@context": "https://schema.org",
        "@type": "RealEstateListing",
        name: listing.titre,
        description: listing.description?.slice(0, 500) || listing.titre,
        url: `https://nidlocal.com/annonces/${id}`,
        datePosted: listing.creeLe.toISOString(),
        ...(listing.images[0]?.url && { image: listing.images[0].url }),
        offers: {
          "@type": "Offer",
          price: listing.prix,
          priceCurrency: "CAD",
          availability: "https://schema.org/InStock",
        },
        address: {
          "@type": "PostalAddress",
          streetAddress: listing.adresse,
          addressRegion: "QC",
          addressCountry: "CA",
        },
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <AnnonceDetailView />
    </>
  );
}
