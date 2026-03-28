import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type Ctx = { params: Promise<{ id: string }> };

// GET — messages for a conversation
export async function GET(_req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const conversation = await prisma.conversation.findUnique({
    where: { id },
    include: {
      user1: { select: { id: true, username: true, name: true, image: true } },
      user2: { select: { id: true, username: true, name: true, image: true } },
      listing: { select: { id: true, titre: true, prix: true } },
    },
  });

  if (!conversation || (conversation.user1Id !== session.user.id && conversation.user2Id !== session.user.id)) {
    return NextResponse.json({ error: "Conversation introuvable." }, { status: 404 });
  }

  // Mark unread messages as read
  await prisma.message.updateMany({
    where: { conversationId: id, NOT: { auteurId: session.user.id }, lu: false },
    data: { lu: true },
  });

  const messages = await prisma.message.findMany({
    where: { conversationId: id },
    orderBy: { creeLe: "asc" },
    include: { auteur: { select: { id: true, username: true, name: true, image: true } } },
  });

  const other = conversation.user1Id === session.user.id ? conversation.user2 : conversation.user1;

  return NextResponse.json({
    conversation: {
      id: conversation.id,
      other: { id: other.id, username: other.username ?? other.name ?? "anonyme", image: other.image },
      listing: conversation.listing,
    },
    messages: messages.map((m) => ({
      id: m.id,
      contenu: m.contenu,
      auteurId: m.auteurId,
      auteurUsername: m.auteur.username ?? m.auteur.name ?? "anonyme",
      auteurImage: m.auteur.image,
      isMine: m.auteurId === session.user.id,
      creeLe: m.creeLe.toISOString(),
    })),
  });
}

// POST — send a message
export async function POST(req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const conversation = await prisma.conversation.findUnique({ where: { id } });
  if (!conversation || (conversation.user1Id !== session.user.id && conversation.user2Id !== session.user.id)) {
    return NextResponse.json({ error: "Conversation introuvable." }, { status: 404 });
  }

  const body = await req.json();
  const { contenu } = body;
  if (!contenu?.trim()) {
    return NextResponse.json({ error: "Message vide." }, { status: 400 });
  }

  const message = await prisma.message.create({
    data: {
      conversationId: id,
      auteurId: session.user.id,
      contenu: contenu.trim(),
    },
    include: { auteur: { select: { id: true, username: true, name: true, image: true } } },
  });

  await prisma.conversation.update({
    where: { id },
    data: { lastMsg: contenu.trim().slice(0, 100), lastMsgAt: new Date() },
  });

  // Notify the other person
  const recipientId = conversation.user1Id === session.user.id ? conversation.user2Id : conversation.user1Id;
  await prisma.notification.create({
    data: {
      userId: recipientId,
      type: "message",
      postId: id,
      postTitre: "Nouveau message",
      acteurNom: session.user.username ?? session.user.name ?? "quelqu'un",
    },
  }).catch(() => {});

  return NextResponse.json({
    id: message.id,
    contenu: message.contenu,
    auteurId: message.auteurId,
    auteurUsername: message.auteur.username ?? message.auteur.name ?? "anonyme",
    auteurImage: message.auteur.image,
    isMine: true,
    creeLe: message.creeLe.toISOString(),
  }, { status: 201 });
}
