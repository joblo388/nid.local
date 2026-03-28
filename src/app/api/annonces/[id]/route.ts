import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;

  const listing = await prisma.listing.findUnique({
    where: { id },
    include: {
      images: { orderBy: { position: "asc" } },
      documents: true,
      auteur: { select: { id: true, username: true, name: true, image: true, createdAt: true } },
      commentaires: {
        orderBy: { creeLe: "desc" },
        include: { auteur: { select: { id: true, username: true, name: true, image: true } } },
      },
      prixHistorique: { orderBy: { creeLe: "asc" } },
      _count: { select: { favoris: true, commentaires: true } },
    },
  });

  if (!listing) {
    return NextResponse.json({ error: "Annonce introuvable." }, { status: 404 });
  }

  // Increment views
  await prisma.listing.update({ where: { id }, data: { nbVues: { increment: 1 } } });

  const session = await auth();
  const userId = session?.user?.id;
  const isOwner = userId === listing.auteurId;

  const isFavorited = userId
    ? !!(await prisma.listingFavorite.findUnique({
        where: { userId_listingId: { userId, listingId: id } },
      }))
    : false;

  // Auteur info — respecter le mode anonyme
  const auteurInfo = listing.anonyme && !isOwner
    ? { id: listing.auteur.id, username: "Propriétaire", image: null, memberSince: listing.auteur.createdAt.toISOString(), anonyme: true }
    : { id: listing.auteur.id, username: listing.auteur.username ?? listing.auteur.name ?? "anonyme", image: listing.auteur.image, memberSince: listing.auteur.createdAt.toISOString(), anonyme: false };

  return NextResponse.json({
    id: listing.id,
    titre: listing.titre,
    description: listing.description,
    prix: listing.prix,
    type: listing.type,
    style: listing.style,
    quartierSlug: listing.quartierSlug,
    villeSlug: listing.villeSlug,
    adresse: listing.adresse,
    chambres: listing.chambres,
    sallesDeBain: listing.sallesDeBain,
    superficie: listing.superficie,
    superficieTerrain: listing.superficieTerrain,
    anneeConstruction: listing.anneeConstruction,
    stationnement: listing.stationnement,
    chauffage: listing.chauffage,
    eauChaude: listing.eauChaude,
    taxesMunicipales: listing.taxesMunicipales,
    taxesScolaires: listing.taxesScolaires,
    fraisCondo: listing.fraisCondo,
    lienVisite: listing.lienVisite,
    anonyme: listing.anonyme,
    telephone: listing.telephone,
    statut: listing.statut,
    nbVues: listing.nbVues + 1,
    nbClics: listing.nbClics,
    nbFavoris: listing._count.favoris,
    nbCommentaires: listing._count.commentaires,
    isFavorited,
    isOwner,
    creeLe: listing.creeLe.toISOString(),
    images: listing.images,
    documents: listing.documents,
    commentaires: listing.commentaires.map((c) => ({
      id: c.id,
      contenu: c.contenu,
      auteurNom: c.auteurNom,
      auteurId: c.auteurId,
      auteurImage: c.auteur?.image ?? null,
      auteurUsername: c.auteur?.username ?? c.auteur?.name ?? c.auteurNom,
      creeLe: c.creeLe.toISOString(),
    })),
    prixHistorique: listing.prixHistorique.map((ph) => ({
      id: ph.id,
      prix: ph.prix,
      evenement: ph.evenement,
      creeLe: ph.creeLe.toISOString(),
    })),
    auteur: auteurInfo,
  });
}

export async function PATCH(req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const listing = await prisma.listing.findUnique({ where: { id }, select: { auteurId: true, prix: true } });
  if (!listing) {
    return NextResponse.json({ error: "Annonce introuvable." }, { status: 404 });
  }
  if (listing.auteurId !== session.user.id) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 403 });
  }

  const body = await req.json();
  const { titre, description, prix, statut, anonyme, telephone, ...rest } = body;

  // Track price change
  if (prix !== undefined && prix !== listing.prix) {
    const evenement = prix < listing.prix ? "reduction" : "augmentation";
    await prisma.listingPriceHistory.create({
      data: { listingId: id, prix, evenement },
    });
  }

  const updated = await prisma.listing.update({
    where: { id },
    data: {
      ...(titre !== undefined && { titre }),
      ...(description !== undefined && { description }),
      ...(prix !== undefined && { prix }),
      ...(statut !== undefined && ["active", "vendu", "retire"].includes(statut) && { statut }),
      ...(anonyme !== undefined && { anonyme }),
      ...(telephone !== undefined && { telephone: telephone || null }),
      ...rest,
    },
  });

  return NextResponse.json({ id: updated.id });
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const listing = await prisma.listing.findUnique({ where: { id }, select: { auteurId: true } });
  if (!listing) {
    return NextResponse.json({ error: "Annonce introuvable." }, { status: 404 });
  }
  if (listing.auteurId !== session.user.id) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 403 });
  }

  await prisma.listing.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
