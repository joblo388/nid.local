import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { sendAlertEmail } from "@/lib/email";
import { rateLimit, getIp } from "@/lib/rateLimit";
import { quartierBySlug } from "@/lib/data";

const PAGE_SIZE = 20;
const TYPES_VALIDES = [
  "unifamiliale", "condo", "duplex", "triplex", "quadruplex", "5plex",
  "maison_de_ville", "terrain", "commercial", "chalet",
  "1_et_demi", "2_et_demi", "3_et_demi", "4_et_demi", "5_et_demi", "6_et_demi",
  "studio", "loft", "autre", "autre_location",
];
const TRIS_VALIDES = ["recent", "prix_asc", "prix_desc", "populaire"];
const CHAUFFAGE_VALIDES = ["electrique", "gaz", "mazout", "geothermie", "bois", "autre"];

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  /* ── Basic filters ── */
  const mode = searchParams.get("mode");
  const villeSlug = searchParams.get("villeSlug");
  const quartierSlug = searchParams.get("quartierSlug");
  const type = searchParams.get("type");
  const prixMin = searchParams.get("prixMin");
  const prixMax = searchParams.get("prixMax");

  /* ── New advanced filters ── */
  const chambresMin = searchParams.get("chambresMin");
  const sallesBainMin = searchParams.get("sallesBainMin");
  const superficieMin = searchParams.get("superficieMin");
  const anneeMin = searchParams.get("anneeMin");
  const anneeMax = searchParams.get("anneeMax");
  const chauffage = searchParams.get("chauffage");
  const extrasRaw = searchParams.get("extras"); // comma-separated
  const sousSol = searchParams.get("sousSol");

  /* ── Text search (new param name "search", keep legacy "q" too) ── */
  const search = (searchParams.get("search") ?? searchParams.get("q"))?.trim();

  /* ── Sort & pagination ── */
  const tri = searchParams.get("tri") ?? "recent";
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const excludeId = searchParams.get("excludeId");
  const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : PAGE_SIZE;

  /* ── Build WHERE ── */
  const where: Prisma.ListingWhereInput = { statut: "active" };

  if (mode) where.mode = mode;
  if (villeSlug) where.villeSlug = villeSlug;
  if (quartierSlug) where.quartierSlug = quartierSlug;
  if (type && TYPES_VALIDES.includes(type)) where.type = type;
  if (excludeId) where.id = { not: excludeId };

  // Prix range
  if (prixMax || prixMin) {
    where.prix = {};
    if (prixMax) (where.prix as Record<string, number>).lte = parseInt(prixMax);
    if (prixMin) (where.prix as Record<string, number>).gte = parseInt(prixMin);
  }

  // Chambres minimum
  if (chambresMin) {
    const val = parseInt(chambresMin);
    if (!isNaN(val) && val > 0) where.chambres = { gte: val };
  }

  // Salles de bain minimum
  if (sallesBainMin) {
    const val = parseInt(sallesBainMin);
    if (!isNaN(val) && val > 0) where.sallesDeBain = { gte: val };
  }

  // Superficie minimum
  if (superficieMin) {
    const val = parseInt(superficieMin);
    if (!isNaN(val) && val > 0) where.superficie = { gte: val };
  }

  // Annee de construction range
  if (anneeMin || anneeMax) {
    where.anneeConstruction = {};
    if (anneeMin) {
      const val = parseInt(anneeMin);
      if (!isNaN(val)) (where.anneeConstruction as Record<string, number>).gte = val;
    }
    if (anneeMax) {
      const val = parseInt(anneeMax);
      if (!isNaN(val)) (where.anneeConstruction as Record<string, number>).lte = val;
    }
  }

  // Chauffage
  if (chauffage && CHAUFFAGE_VALIDES.includes(chauffage)) {
    where.chauffage = chauffage;
  }

  // Sous-sol
  if (sousSol) {
    where.sousSol = sousSol;
  }

  // Extras (comma-separated, stored as JSON string in extras field)
  // Match listings whose extras JSON array contains ALL requested extras
  if (extrasRaw) {
    const extrasArr = extrasRaw.split(",").map((e) => e.trim()).filter(Boolean);
    if (extrasArr.length > 0) {
      // Handle special "sous-sol-fini" as a sousSol filter instead
      const realExtras: string[] = [];
      for (const ex of extrasArr) {
        if (ex === "sous-sol-fini") {
          where.sousSol = "fini";
        } else if (ex === "piscine") {
          // piscine is a dedicated field, not in extras
          where.piscine = { not: "aucune" };
        } else {
          realExtras.push(ex);
        }
      }
      // For remaining extras, search in the JSON string field
      if (realExtras.length > 0) {
        const extrasConditions: Prisma.ListingWhereInput[] = realExtras.map((ex) => ({
          extras: { contains: ex, mode: "insensitive" as const },
        }));
        where.AND = [...(Array.isArray(where.AND) ? where.AND : where.AND ? [where.AND] : []), ...extrasConditions];
      }
    }
  }

  // Text search
  if (search) {
    const searchSlug = search.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-");
    where.OR = [
      { titre: { contains: search, mode: "insensitive" } },
      { adresse: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { quartierSlug: { contains: searchSlug, mode: "insensitive" } },
      { villeSlug: { contains: searchSlug, mode: "insensitive" } },
    ];
  }

  /* ── ORDER BY ── */
  const orderBy: Prisma.ListingOrderByWithRelationInput =
    tri === "prix_asc" ? { prix: "asc" } :
    tri === "prix_desc" ? { prix: "desc" } :
    tri === "populaire" ? { nbVues: "desc" } :
    { creeLe: "desc" };

  /* ── Auth (for favorites) ── */
  const session = await auth();
  const userId = session?.user?.id;

  /* ── Query ── */
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
      mode: l.mode,
      type: l.type,
      quartierSlug: l.quartierSlug,
      villeSlug: l.villeSlug,
      adresse: l.adresse,
      chambres: l.chambres,
      sallesDeBain: l.sallesDeBain,
      superficie: l.superficie,
      lienVisite: l.lienVisite,
      mls: l.mls,
      statut: l.statut,
      imageUrl: l.images[0]?.url ?? null,
      nbFavoris: l._count.favoris,
      creeLe: l.creeLe.toISOString(),
    })),
    total,
    page,
    hasMore: total > page * limit,
    favoritedIds: userFavorites.map((f) => f.listingId),
  }, {
    headers: {
      "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
    },
  });
}

export async function POST(req: NextRequest) {
  if (!rateLimit(getIp(req), 3, 60_000)) {
    return NextResponse.json({ error: "Trop de requ\u00eates." }, { status: 429 });
  }

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifi\u00e9." }, { status: 401 });
  }

  const body = await req.json();
  const {
    titre, description, prix, type, quartierSlug, villeSlug,
    adresse, chambres, sallesDeBain, superficie, anneeConstruction,
    stationnement, style, superficieTerrain, chauffage, eauChaude,
    sousSol, piscine, taxesMunicipales, taxesScolaires, fraisCondo,
    lienVisite, mls, anonyme, telephone, images, documents,
    mode: bodyMode, disponibleLe, meuble, inclusions,
  } = body;
  const mode = bodyMode === "location" ? "location" : "vente";

  // Honeypot
  if (body._hp) {
    return NextResponse.json({ id: "fake" }, { status: 201 });
  }

  if (!titre?.trim() || titre.trim().length < 5) {
    return NextResponse.json({ error: "Le titre doit avoir au moins 5 caract\u00e8res." }, { status: 400 });
  }
  if (!description?.trim() || description.trim().length < 20) {
    return NextResponse.json({ error: "La description doit avoir au moins 20 caract\u00e8res." }, { status: 400 });
  }
  const minPrix = mode === "location" ? 100 : 1000;
  if (!prix || prix < minPrix) {
    return NextResponse.json({ error: "Prix invalide." }, { status: 400 });
  }
  if (!TYPES_VALIDES.includes(type)) {
    return NextResponse.json({ error: "Type de propri\u00e9t\u00e9 invalide." }, { status: 400 });
  }
  if (!quartierSlug || !adresse?.trim()) {
    return NextResponse.json({ error: "Quartier et adresse requis." }, { status: 400 });
  }

  // Create notification-ready listing
  const listing = await prisma.listing.create({
    data: {
      titre: titre.trim(),
      description: description.trim(),
      prix, type, mode,
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
      mls: typeof mls === "string" && mls.trim() ? mls.trim() : null,
      disponibleLe: disponibleLe ? new Date(disponibleLe) : null,
      meuble: meuble ?? false,
      inclusions: inclusions || null,
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
    data: { listingId: listing.id, prix, evenement: mode === "location" ? "mise_en_location" : "mise_en_vente" },
  });

  // ── Send marketplace alert emails (fire-and-forget) ──
  (async () => {
    try {
      const alerteWhere: Prisma.AlerteMarketplaceWhereInput = {
        active: true,
        userId: { not: session.user!.id },
      };

      const matchingAlertes = await prisma.alerteMarketplace.findMany({
        where: alerteWhere,
        include: { user: { select: { email: true } } },
      });

      for (const alerte of matchingAlertes) {
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
