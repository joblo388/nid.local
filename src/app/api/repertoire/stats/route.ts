import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const profile = await prisma.proProfile.findUnique({
    where: { userId: session.user.id },
    select: {
      id: true,
      nbVotes: true,
      nbVues: true,
      creeLe: true,
      _count: { select: { comments: true } },
    },
  });

  if (!profile) {
    return NextResponse.json({ error: "Aucun profil pro" }, { status: 404 });
  }

  return NextResponse.json({
    nbVotes: profile.nbVotes,
    nbVues: profile.nbVues,
    nbCommentaires: profile._count.comments,
    creeLe: profile.creeLe.toISOString(),
  });
}
