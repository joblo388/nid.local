import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const entries = await prisma.viewHistory.findMany({
    where: { userId: session.user.id },
    orderBy: { creeLe: "desc" },
    take: 20,
  });

  // Gather IDs by type
  const postIds = entries.filter((e) => e.targetType === "post").map((e) => e.targetId);
  const listingIds = entries.filter((e) => e.targetType === "listing").map((e) => e.targetId);

  const [posts, listings] = await Promise.all([
    postIds.length > 0
      ? prisma.post.findMany({
          where: { id: { in: postIds } },
          select: { id: true, titre: true, categorie: true, quartierSlug: true, creeLe: true },
        })
      : [],
    listingIds.length > 0
      ? prisma.listing.findMany({
          where: { id: { in: listingIds } },
          select: { id: true, titre: true, prix: true, type: true, quartierSlug: true, creeLe: true, images: { where: { principale: true }, take: 1 } },
        })
      : [],
  ]);

  const postMap = new Map(posts.map((p) => [p.id, p]));
  const listingMap = new Map(listings.map((l) => [l.id, l]));

  const items = entries
    .map((entry) => {
      if (entry.targetType === "post") {
        const post = postMap.get(entry.targetId);
        if (!post) return null;
        return {
          type: "post" as const,
          id: post.id,
          titre: post.titre,
          categorie: post.categorie,
          quartierSlug: post.quartierSlug,
          consulteLe: entry.creeLe.toISOString(),
        };
      } else {
        const listing = listingMap.get(entry.targetId);
        if (!listing) return null;
        return {
          type: "listing" as const,
          id: listing.id,
          titre: listing.titre,
          prix: listing.prix,
          typeBien: listing.type,
          quartierSlug: listing.quartierSlug,
          imageUrl: listing.images[0]?.url ?? null,
          consulteLe: entry.creeLe.toISOString(),
        };
      }
    })
    .filter(Boolean);

  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const body = await req.json();
  const { targetType, targetId } = body;

  if (!targetType || !targetId || !["post", "listing"].includes(targetType)) {
    return NextResponse.json({ error: "Paramètres invalides." }, { status: 400 });
  }

  await prisma.viewHistory.upsert({
    where: {
      userId_targetType_targetId: {
        userId: session.user.id,
        targetType,
        targetId,
      },
    },
    update: { creeLe: new Date() },
    create: {
      userId: session.user.id,
      targetType,
      targetId,
    },
  });

  return NextResponse.json({ ok: true });
}
