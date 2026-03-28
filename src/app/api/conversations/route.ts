import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET — list conversations for current user
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const conversations = await prisma.conversation.findMany({
    where: { OR: [{ user1Id: session.user.id }, { user2Id: session.user.id }] },
    orderBy: { lastMsgAt: "desc" },
    include: {
      user1: { select: { id: true, username: true, name: true, image: true } },
      user2: { select: { id: true, username: true, name: true, image: true } },
      listing: { select: { id: true, titre: true, prix: true } },
      messages: { where: { lu: false, NOT: { auteurId: session.user.id } }, select: { id: true } },
    },
  });

  return NextResponse.json({
    conversations: conversations.map((c) => {
      const other = c.user1Id === session.user.id ? c.user2 : c.user1;
      return {
        id: c.id,
        other: { id: other.id, username: other.username ?? other.name ?? "anonyme", image: other.image },
        listing: c.listing ? { id: c.listing.id, titre: c.listing.titre, prix: c.listing.prix } : null,
        lastMsg: c.lastMsg,
        lastMsgAt: c.lastMsgAt.toISOString(),
        unread: c.messages.length,
      };
    }),
  });
}

// POST — start a new conversation (or return existing)
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const body = await req.json();
  const { recipientId, listingId, message } = body;

  if (!recipientId || !message?.trim()) {
    return NextResponse.json({ error: "Destinataire et message requis." }, { status: 400 });
  }

  if (recipientId === session.user.id) {
    return NextResponse.json({ error: "Vous ne pouvez pas vous écrire à vous-même." }, { status: 400 });
  }

  // Normalize user order for unique constraint
  const [u1, u2] = [session.user.id, recipientId].sort();

  // Find or create conversation
  let conversation = await prisma.conversation.findFirst({
    where: {
      user1Id: u1,
      user2Id: u2,
      listingId: listingId || null,
    },
  });

  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: {
        user1Id: u1,
        user2Id: u2,
        listingId: listingId || null,
        lastMsg: message.trim().slice(0, 100),
        lastMsgAt: new Date(),
      },
    });
  }

  // Create message
  await prisma.message.create({
    data: {
      conversationId: conversation.id,
      auteurId: session.user.id,
      contenu: message.trim(),
    },
  });

  // Update conversation
  await prisma.conversation.update({
    where: { id: conversation.id },
    data: { lastMsg: message.trim().slice(0, 100), lastMsgAt: new Date() },
  });

  // Notify recipient
  await prisma.notification.create({
    data: {
      userId: recipientId,
      type: "message",
      postId: conversation.id,
      postTitre: "Nouveau message privé",
      acteurNom: session.user.username ?? session.user.name ?? "quelqu'un",
    },
  }).catch(() => {});

  return NextResponse.json({ conversationId: conversation.id }, { status: 201 });
}
