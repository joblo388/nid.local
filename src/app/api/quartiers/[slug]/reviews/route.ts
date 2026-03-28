import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { rateLimit, getIp } from "@/lib/rateLimit";

type Params = { params: Promise<{ slug: string }> };

const CRITERIA = ["securite", "transport", "commerces", "ecoles", "ambiance"] as const;

export async function GET(_req: NextRequest, { params }: Params) {
  const { slug } = await params;

  const reviews = await prisma.quartierReview.findMany({
    where: { quartierSlug: slug },
    orderBy: { creeLe: "desc" },
    include: {
      user: { select: { id: true, username: true, name: true, image: true } },
    },
  });

  const total = reviews.length;

  const averages: Record<string, number> = {};
  if (total > 0) {
    for (const c of CRITERIA) {
      const sum = reviews.reduce((acc, r) => acc + r[c], 0);
      averages[c] = Math.round((sum / total) * 10) / 10;
    }
  }

  // Check if the current user already has a review
  const session = await auth();
  const userReview = session?.user?.id
    ? reviews.find((r) => r.userId === session.user!.id) ?? null
    : null;

  return NextResponse.json({
    reviews: reviews.map((r) => ({
      id: r.id,
      securite: r.securite,
      transport: r.transport,
      commerces: r.commerces,
      ecoles: r.ecoles,
      ambiance: r.ambiance,
      commentaire: r.commentaire,
      creeLe: r.creeLe.toISOString(),
      user: {
        id: r.user.id,
        username: r.user.username,
        name: r.user.name,
        image: r.user.image,
      },
    })),
    averages,
    total,
    userReview: userReview
      ? {
          id: userReview.id,
          securite: userReview.securite,
          transport: userReview.transport,
          commerces: userReview.commerces,
          ecoles: userReview.ecoles,
          ambiance: userReview.ambiance,
          commentaire: userReview.commentaire,
        }
      : null,
  });
}

export async function POST(req: NextRequest, { params }: Params) {
  if (!rateLimit(getIp(req), 10, 60_000)) {
    return NextResponse.json({ error: "Trop de requêtes." }, { status: 429 });
  }

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { slug } = await params;
  const body = await req.json();

  // Validate each criterion is an integer 1-5
  for (const c of CRITERIA) {
    const val = body[c];
    if (typeof val !== "number" || !Number.isInteger(val) || val < 1 || val > 5) {
      return NextResponse.json(
        { error: `${c} doit être un entier entre 1 et 5.` },
        { status: 400 }
      );
    }
  }

  const commentaire =
    typeof body.commentaire === "string" && body.commentaire.trim().length > 0
      ? body.commentaire.trim().slice(0, 1000)
      : null;

  const userId = session.user.id;

  const review = await prisma.quartierReview.upsert({
    where: { userId_quartierSlug: { userId, quartierSlug: slug } },
    create: {
      userId,
      quartierSlug: slug,
      securite: body.securite,
      transport: body.transport,
      commerces: body.commerces,
      ecoles: body.ecoles,
      ambiance: body.ambiance,
      commentaire,
    },
    update: {
      securite: body.securite,
      transport: body.transport,
      commerces: body.commerces,
      ecoles: body.ecoles,
      ambiance: body.ambiance,
      commentaire,
    },
  });

  return NextResponse.json({ success: true, review });
}
