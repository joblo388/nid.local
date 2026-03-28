import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { rateLimit, getIp } from "@/lib/rateLimit";
import { Prisma } from "@prisma/client";
import { sendAlertEmail } from "@/lib/email";
import { quartierBySlug } from "@/lib/data";

const PAGE_SIZE = 20;
const TYPES_VALIDES = ["unifamiliale", "condo", "duplex", "triplex", "quadruplex"];
const TRIS_VALIDES = ["recent", "prix_asc", "prix_desc", "populaire"];

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const quartierSlug = searchParams.get("quartierSlug");
  const type = searchParams.get("type");
  const prixMax = searchParams.get("prixMax");
  const search = searchParams.get("q")?.trim();
  const tri = searchParams.get("tri") ?? "recent";
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  // For "similar" listings
  const excludeId = searchParams.get("excludeId");
  const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : PAGE_SIZE;

  const where: Prisma.ListingWhereInput = { statut: "active" };
  if (quartierSlug) where.quartierSlug = quartierSlug;
  if (type && TYPES_VALIDES.includes(type)) where.type = type;
  if (prixMax) where.prix = { lte: parseInt(prixMax) };
  if (excludeId) where.id = { not: excludeId };
  if (search) {
    where.OR = [
      { titre: { contains: search, mode: "insensitive" } },
      { adresse: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  const orderBy: Prisma.ListingOrderByWithRelationInput =
    tri === "prix_asc" ? { prix: "asc" } :
    tri === "prix_desc" ? { prix: "desc" } :
    tri === "populaire" ? { nbVues: "desc" } :
    { creeLe: "desc" };

  const session = await auth();
  const userId = session?.user?.id;

  const [listings, total] = await Promise.all([
    prisma.listing.findMany({
      where,
      orderBy,
      take: limit,
      skip: (page - 1) * limit,
      include: {
        images: { where: { principale: true }, take: 1 },
        _count: { select: { favoris: true } },
      },
    }),
    prisma.listing.count({ where }),
  ]);

  const listingIds = listings.map((l) => l.id);
  const userFavorites = userId
    ? await prisma.listingFavorite.findMany({
        where: { userId, listingId: { in: listingIds } },
        select: { listingId: true },
      })
    : [];

  return NextResponse.json({
    listings: listings.map((l) => ({
      id: l.id,
      titre: l.titre,
      prix: l.prix,
      type: l.type,
      quartierSlug: l.quartierSlug,
      villeSlug: l.villeSlug,
      adresse: l.adresse,
      chambres: l.chambres,
      sallesDeBain: l.sallesDeBain,
      superficie: l.superficie,
      lienVisite: l.lienVisite,
      statut: l.statut,
      imageUrl: l.images[0]?.url ?? null,
      nbFavoris: l._count.favoris,
      creeLe: l.creeLe.toISOString(),
    })),
    total,
    page,
    hasMore: total > page * limit,
    favoritedIds: userFavorites.map((f) => f.listingId),
  });
}

export async function POST(req: NextRequest) {
  if (!rateLimit(getIp(req), 3, 60_000)) {
    return NextResponse.json({ error: "Trop de requêtes." }, { status: 429 });
  }

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const body = await req.json();
  const {
    titre, description, prix, type, quartierSlug, villeSlug,
    adresse, chambres, sallesDeBain, superficie, anneeConstruction,
    stationnement, style, superficieTerrain, chauffage, eauChaude,
    sousSol, piscine, taxesMunicipales, taxesScolaires, fraisCondo,
    lienVisite, anonyme, telephone, images, documents,
  } = body;

  // Honeypot
  if (body._hp) {
    return NextResponse.json({ id: "fake" }, { status: 201 });
  }

  if (!titre?.trim() || titre.trim().length < 5) {
    return NextResponse.json({ error: "Le titre doit avoir au moins 5 caractères." }, { status: 400 });
  }
  if (!description?.trim() || description.trim().length < 20) {
    return NextResponse.json({ error: "La description doit avoir au moins 20 caractères." }, { status: 400 });
  }
  if (!prix || prix < 1000) {
    return NextResponse.json({ error: "Prix invalide." }, { status: 400 });
  }
  if (!TYPES_VALIDES.includes(type)) {
    return NextResponse.json({ error: "Type de propriété invalide." }, { status: 400 });
  }
  if (!quartierSlug || !adresse?.trim()) {
    return NextResponse.json({ error: "Quartier et adresse requis." }, { status: 400 });
  }

  // Create notification-ready listing
  const listing = await prisma.listing.create({
    data: {
      titre: titre.trim(),
      description: description.trim(),
      prix, type,
      style: style || null,
      quartierSlug,
      villeSlug: villeSlug || "montreal",
      adresse: adresse.trim(),
      chambres: chambres || 0,
      sallesDeBain: sallesDeBain || 0,
      superficie: superficie || 0,
      superficieTerrain: superficieTerrain || null,
      anneeConstruction: anneeConstruction || null,
      stationnement: stationnement || null,
      chauffage: chauffage || null,
      eauChaude: eauChaude || null,
      sousSol: sousSol || null,
      piscine: piscine || null,
      taxesMunicipales: taxesMunicipales || null,
      taxesScolaires: taxesScolaires || null,
      fraisCondo: fraisCondo || null,
      lienVisite: lienVisite || null,
      anonyme: anonyme ?? false,
      telephone: telephone || null,
      auteurId: session.user.id,
      images: images?.length
        ? { create: images.map((img: { url: string; principale?: boolean }, i: number) => ({ url: img.url, position: i, principale: img.principale ?? i === 0 })) }
        : undefined,
      documents: documents?.length
        ? { create: documents.map((doc: { nom: string; url: string; taille?: string }) => ({ nom: doc.nom, url: doc.url, taille: doc.taille || null })) }
        : undefined,
    },
  });

  // Initial price history
  await prisma.listingPriceHistory.create({
    data: { listingId: listing.id, prix, evenement: "mise_en_vente" },
  });

  // ─── Send marketplace alert emails (fire-and-forget) ───────────────────────
  (async () => {
    try {
      const where: Prisma.AlerteMarketplaceWhereInput = {
        active: true,
        userId: { not: session.user!.id }, // Don't alert the listing author
      };

      const matchingAlertes = await prisma.alerteMarketplace.findMany({
        where,
        include: { user: { select: { email: true } } },
      });

      for (const alerte of matchingAlertes) {
        // Check each criterion — alert matches if ALL its non-null criteria match the listing
        if (alerte.villeSlug && alerte.villeSlug !== (villeSlug || "montreal")) continue;
        if (alerte.quartierSlug && alerte.quartierSlug !== quartierSlug) continue;
        if (alerte.type && alerte.type !== type) continue;
        if (alerte.prixMax != null && prix > alerte.prixMax) continue;
        if (alerte.prixMin != null && prix < alerte.prixMin) continue;
        if (alerte.chambresMin != null && (chambres || 0) < alerte.chambresMin) continue;

        if (!alerte.user.email) continue;

        const qNom = quartierBySlug[quartierSlug]?.nom ?? quartierSlug;

        sendAlertEmail({
          recipientEmail: alerte.user.email,
          listingTitre: titre.trim(),
          listingId: listing.id,
          listingPrix: prix,
          listingType: type,
          listingQuartier: qNom,
        }).catch((err) => console.error("[alert-email]", err));
      }
    } catch (err) {
      console.error("[alert-email] Error matching alerts:", err);
    }
  })();

  return NextResponse.json({ id: listing.id }, { status: 201 });
}
