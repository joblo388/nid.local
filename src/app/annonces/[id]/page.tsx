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
    return { title: "Annonce introuvable — nid.local" };
  }

  const q = quartierBySlug[listing.quartierSlug];
  const quartierNom = q?.nom ?? listing.quartierSlug;
  const prix = listing.prix.toLocaleString("fr-CA") + " $";
  const title = `${prix} — ${listing.type} à ${quartierNom} | nid.local`;
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

export default function AnnonceDetailPage() {
  return <AnnonceDetailView />;
}
