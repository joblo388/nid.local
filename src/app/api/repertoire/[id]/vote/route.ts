import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { rateLimit, getIp } from "@/lib/rateLimit";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  if (!rateLimit(getIp(req), 30, 60_000)) {
    return NextResponse.json({ error: "Trop de requêtes." }, { status: 429 });
  }

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { id: proProfileId } = await params;
  const userId = session.user.id;

  // Verify profile exists
  const profile = await prisma.proProfile.findUnique({ where: { id: proProfileId } });
  if (!profile) {
    return NextResponse.json({ error: "Profil introuvable." }, { status: 404 });
  }

  const existing = await prisma.proVote.findUnique({
    where: { userId_proProfileId: { userId, proProfileId } },
  });

  if (existing) {
    await prisma.$transaction([
      prisma.proVote.delete({ where: { userId_proProfileId: { userId, proProfileId } } }),
      prisma.proProfile.update({ where: { id: proProfileId }, data: { nbVotes: { decrement: 1 } } }),
    ]);
    const updated = await prisma.proProfile.findUnique({ where: { id: proProfileId }, select: { nbVotes: true } });
    return NextResponse.json({ hasVoted: false, nbVotes: updated?.nbVotes ?? 0 });
  } else {
    await prisma.$transaction([
      prisma.proVote.create({ data: { userId, proProfileId } }),
      prisma.proProfile.update({ where: { id: proProfileId }, data: { nbVotes: { increment: 1 } } }),
    ]);
    const updated = await prisma.proProfile.findUnique({ where: { id: proProfileId }, select: { nbVotes: true } });
    return NextResponse.json({ hasVoted: true, nbVotes: updated?.nbVotes ?? 0 });
  }
}
