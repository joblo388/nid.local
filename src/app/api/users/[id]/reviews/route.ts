import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { rateLimit, getIp } from "@/lib/rateLimit";

type Ctx = { params: Promise<{ id: string }> };

// GET — all reviews for a seller + average + count
export async function GET(_req: NextRequest, ctx: Ctx) {
  const { id: sellerId } = await ctx.params;

  const reviews = await prisma.sellerReview.findMany({
    where: { sellerId },
    orderBy: { creeLe: "desc" },
    include: {
      reviewer: { select: { id: true, username: true, name: true, image: true } },
    },
  });

  const count = reviews.length;
  const moyenne = count > 0
    ? Math.round((reviews.reduce((s, r) => s + r.note, 0) / count) * 10) / 10
    : 0;

  // Breakdown per star
  const repartition: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (const r of reviews) {
    repartition[r.note] = (repartition[r.note] ?? 0) + 1;
  }

  return NextResponse.json({
    moyenne,
    count,
    repartition,
    reviews: reviews.map((r) => ({
      id: r.id,
      note: r.note,
      commentaire: r.commentaire,
      listingId: r.listingId,
      creeLe: r.creeLe.toISOString(),
      reviewer: {
        id: r.reviewer.id,
        username: r.reviewer.username ?? r.reviewer.name ?? "anonyme",
        image: r.reviewer.image,
      },
    })),
  });
}

// POST — create or update a review
export async function POST(req: NextRequest, ctx: Ctx) {
  const { id: sellerId } = await ctx.params;

  if (!rateLimit(getIp(req), 10, 60_000)) {
    return NextResponse.json({ error: "Trop de requetes." }, { status: 429 });
  }

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifie." }, { status: 401 });
  }

  const reviewerId = session.user.id;

  if (reviewerId === sellerId) {
    return NextResponse.json({ error: "Vous ne pouvez pas vous evaluer vous-meme." }, { status: 400 });
  }

  // Verify seller exists
  const seller = await prisma.user.findUnique({ where: { id: sellerId }, select: { id: true } });
  if (!seller) {
    return NextResponse.json({ error: "Utilisateur introuvable." }, { status: 404 });
  }

  const body = await req.json();
  const { note, commentaire, listingId } = body;

  if (!note || typeof note !== "number" || note < 1 || note > 5 || !Number.isInteger(note)) {
    return NextResponse.json({ error: "La note doit etre un entier entre 1 et 5." }, { status: 400 });
  }

  const trimmedComment = commentaire?.trim() || null;

  // Upsert: one review per seller+reviewer+listing combo
  const review = await prisma.sellerReview.upsert({
    where: {
      sellerId_reviewerId_listingId: {
        sellerId,
        reviewerId,
        listingId: listingId ?? null,
      },
    },
    update: {
      note,
      commentaire: trimmedComment,
    },
    create: {
      sellerId,
      reviewerId,
      listingId: listingId ?? null,
      note,
      commentaire: trimmedComment,
    },
    include: {
      reviewer: { select: { id: true, username: true, name: true, image: true } },
    },
  });

  return NextResponse.json({
    id: review.id,
    note: review.note,
    commentaire: review.commentaire,
    listingId: review.listingId,
    creeLe: review.creeLe.toISOString(),
    reviewer: {
      id: review.reviewer.id,
      username: review.reviewer.username ?? review.reviewer.name ?? "anonyme",
      image: review.reviewer.image,
    },
  }, { status: 201 });
}
