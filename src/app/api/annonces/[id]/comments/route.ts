import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { rateLimit, getIp } from "@/lib/rateLimit";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;

  if (!rateLimit(getIp(req), 10, 60_000)) {
    return NextResponse.json({ error: "Trop de requêtes." }, { status: 429 });
  }

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const body = await req.json();
  const { contenu } = body;

  if (!contenu?.trim() || contenu.trim().length < 2) {
    return NextResponse.json({ error: "Le commentaire est trop court." }, { status: 400 });
  }

  const listing = await prisma.listing.findUnique({ where: { id }, select: { id: true } });
  if (!listing) {
    return NextResponse.json({ error: "Annonce introuvable." }, { status: 404 });
  }

  const auteurNom = session.user.username ?? session.user.name ?? session.user.email ?? "anonyme";

  // Notify listing owner
  const listingFull = await prisma.listing.findUnique({ where: { id }, select: { auteurId: true, titre: true } });
  if (listingFull && listingFull.auteurId !== session.user.id) {
    await prisma.notification.create({
      data: {
        userId: listingFull.auteurId,
        type: "listing_comment",
        postId: id,
        postTitre: listingFull.titre,
        acteurNom: session.user.username ?? session.user.name ?? session.user.email ?? "quelqu'un",
      },
    }).catch(() => {});
  }

  const comment = await prisma.listingComment.create({
    data: {
      contenu: contenu.trim(),
      auteurNom,
      auteurId: session.user.id,
      listingId: id,
    },
    include: {
      auteur: { select: { id: true, username: true, name: true, image: true } },
    },
  });

  return NextResponse.json({
    id: comment.id,
    contenu: comment.contenu,
    auteurNom: comment.auteurNom,
    auteurId: comment.auteurId,
    auteurImage: comment.auteur?.image ?? null,
    auteurUsername: comment.auteur?.username ?? comment.auteur?.name ?? comment.auteurNom,
    creeLe: comment.creeLe.toISOString(),
  }, { status: 201 });
}
