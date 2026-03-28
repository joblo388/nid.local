import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { rateLimit, getIp } from "@/lib/rateLimit";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ hasVoted: false });
  const { id: commentId } = await params;
  const vote = await prisma.commentVote.findUnique({
    where: { userId_commentId: { userId: session.user.id, commentId } },
  });
  return NextResponse.json({ hasVoted: !!vote });
}

export async function POST(req: NextRequest, { params }: Params) {
  if (!rateLimit(getIp(req), 30, 60_000)) {
    return NextResponse.json({ error: "Trop de requêtes." }, { status: 429 });
  }
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const { id: commentId } = await params;
  const userId = session.user.id;

  const existing = await prisma.commentVote.findUnique({
    where: { userId_commentId: { userId, commentId } },
  });

  if (existing) {
    await prisma.$transaction([
      prisma.commentVote.delete({ where: { userId_commentId: { userId, commentId } } }),
      prisma.comment.update({ where: { id: commentId }, data: { nbVotes: { decrement: 1 } } }),
    ]);
    const comment = await prisma.comment.findUnique({ where: { id: commentId }, select: { nbVotes: true } });
    return NextResponse.json({ hasVoted: false, nbVotes: comment?.nbVotes ?? 0 });
  } else {
    await prisma.$transaction([
      prisma.commentVote.create({ data: { userId, commentId } }),
      prisma.comment.update({ where: { id: commentId }, data: { nbVotes: { increment: 1 } } }),
    ]);
    const comment = await prisma.comment.findUnique({ where: { id: commentId }, select: { nbVotes: true } });
    return NextResponse.json({ hasVoted: true, nbVotes: comment?.nbVotes ?? 0 });
  }
}
