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

  const { id: pollId } = await params;
  const userId = session.user.id;
  const body = await req.json();
  const { optionId } = body;

  if (!optionId || typeof optionId !== "string") {
    return NextResponse.json({ error: "Option invalide." }, { status: 400 });
  }

  // Verify poll exists
  const poll = await prisma.poll.findUnique({
    where: { id: pollId },
    include: { options: { select: { id: true } } },
  });

  if (!poll) {
    return NextResponse.json({ error: "Sondage introuvable." }, { status: 404 });
  }

  // Verify option belongs to this poll
  if (!poll.options.some((o) => o.id === optionId)) {
    return NextResponse.json({ error: "Cette option n'appartient pas à ce sondage." }, { status: 400 });
  }

  // Check if user already voted
  const existing = await prisma.pollVote.findUnique({
    where: { pollId_userId: { pollId, userId } },
  });

  if (existing) {
    return NextResponse.json({ error: "Vous avez déjà voté." }, { status: 409 });
  }

  await prisma.pollVote.create({
    data: { pollId, optionId, userId },
  });

  // Return updated results
  const updatedPoll = await prisma.poll.findUnique({
    where: { id: pollId },
    include: {
      options: {
        include: { _count: { select: { votes: true } } },
        orderBy: { id: "asc" },
      },
      _count: { select: { votes: true } },
    },
  });

  return NextResponse.json({
    id: updatedPoll!.id,
    postId: updatedPoll!.postId,
    options: updatedPoll!.options.map((o) => ({
      id: o.id,
      label: o.label,
      votes: o._count.votes,
    })),
    totalVotes: updatedPoll!._count.votes,
    userVoteOptionId: optionId,
  });
}
