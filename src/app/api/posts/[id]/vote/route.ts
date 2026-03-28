import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { rateLimit, getIp } from "@/lib/rateLimit";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ hasVoted: false });
  const { id: postId } = await params;
  const vote = await prisma.vote.findUnique({
    where: { userId_postId: { userId: session.user.id, postId } },
  });
  return NextResponse.json({ hasVoted: !!vote });
}

export async function POST(req: NextRequest, { params }: Params) {
  if (!rateLimit(getIp(req), 30, 60_000)) {
    return NextResponse.json({ error: "Trop de requêtes." }, { status: 429 });
  }
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { id: postId } = await params;
  const userId = session.user.id;

  const existing = await prisma.vote.findUnique({
    where: { userId_postId: { userId, postId } },
  });

  if (existing) {
    await prisma.$transaction([
      prisma.vote.delete({ where: { userId_postId: { userId, postId } } }),
      prisma.post.update({ where: { id: postId }, data: { nbVotes: { decrement: 1 } } }),
    ]);
    const post = await prisma.post.findUnique({ where: { id: postId }, select: { nbVotes: true } });
    return NextResponse.json({ hasVoted: false, nbVotes: post?.nbVotes ?? 0 });
  } else {
    await prisma.$transaction([
      prisma.vote.create({ data: { userId, postId } }),
      prisma.post.update({ where: { id: postId }, data: { nbVotes: { increment: 1 } } }),
    ]);
    const post = await prisma.post.findUnique({ where: { id: postId }, select: { nbVotes: true } });
    return NextResponse.json({ hasVoted: true, nbVotes: post?.nbVotes ?? 0 });
  }
}
