import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { id: pollId } = await params;
  const session = await auth();
  const userId = session?.user?.id ?? null;

  const poll = await prisma.poll.findUnique({
    where: { id: pollId },
    include: {
      options: {
        include: { _count: { select: { votes: true } } },
        orderBy: { id: "asc" },
      },
      _count: { select: { votes: true } },
    },
  });

  if (!poll) {
    return NextResponse.json({ error: "Sondage introuvable." }, { status: 404 });
  }

  let userVoteOptionId: string | null = null;
  if (userId) {
    const userVote = await prisma.pollVote.findUnique({
      where: { pollId_userId: { pollId, userId } },
      select: { optionId: true },
    });
    userVoteOptionId = userVote?.optionId ?? null;
  }

  return NextResponse.json({
    id: poll.id,
    postId: poll.postId,
    options: poll.options.map((o) => ({
      id: o.id,
      label: o.label,
      votes: o._count.votes,
    })),
    totalVotes: poll._count.votes,
    userVoteOptionId,
  });
}
