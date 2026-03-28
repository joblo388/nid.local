import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(_req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const existing = await prisma.listingFavorite.findUnique({
    where: { userId_listingId: { userId: session.user.id, listingId: id } },
  });

  if (existing) {
    await prisma.listingFavorite.delete({ where: { id: existing.id } });
    return NextResponse.json({ favorited: false });
  }

  await prisma.listingFavorite.create({
    data: { userId: session.user.id, listingId: id },
  });

  return NextResponse.json({ favorited: true });
}
