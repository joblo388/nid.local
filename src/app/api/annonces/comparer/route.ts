import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const idsParam = searchParams.get("ids");

  if (!idsParam) {
    return NextResponse.json({ error: "Paramètre ids requis." }, { status: 400 });
  }

  const ids = idsParam.split(",").filter(Boolean).slice(0, 3);

  if (ids.length < 2) {
    return NextResponse.json({ error: "Au moins 2 annonces requises." }, { status: 400 });
  }

  const listings = await prisma.listing.findMany({
    where: { id: { in: ids }, statut: "active" },
    include: {
      images: { orderBy: { position: "asc" }, take: 1 },
    },
  });

  return NextResponse.json({
    listings: listings.map((l) => ({
      id: l.id,
      titre: l.titre,
      prix: l.prix,
      type: l.type,
      style: l.style,
      quartierSlug: l.quartierSlug,
      villeSlug: l.villeSlug,
      adresse: l.adresse,
      chambres: l.chambres,
      sallesDeBain: l.sallesDeBain,
      superficie: l.superficie,
      superficieTerrain: l.superficieTerrain,
      anneeConstruction: l.anneeConstruction,
      stationnement: l.stationnement,
      taxesMunicipales: l.taxesMunicipales,
      taxesScolaires: l.taxesScolaires,
      fraisCondo: l.fraisCondo,
      imageUrl: l.images[0]?.url ?? null,
    })),
  });
}
