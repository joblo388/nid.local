import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

// In-memory store: conversationId -> { userId, timestamp }
const typingMap = new Map<string, { userId: string; username: string; timestamp: number }>();

// TTL: a user is considered "typing" if timestamp < 3s ago
const TYPING_TTL = 3000;

type Ctx = { params: Promise<{ id: string }> };

// POST — mark current user as typing
export async function POST(req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifie." }, { status: 401 });
  }

  const key = `${id}:${session.user.id}`;
  typingMap.set(key, {
    userId: session.user.id,
    username: session.user.username ?? session.user.name ?? "anonyme",
    timestamp: Date.now(),
  });

  return NextResponse.json({ ok: true });
}

// GET — check if the other person is typing
export async function GET(_req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifie." }, { status: 401 });
  }

  const now = Date.now();
  let typing: { userId: string; username: string } | null = null;

  // Look for any entry in this conversation that is NOT the current user
  // and was updated within the TTL window
  for (const [key, value] of typingMap.entries()) {
    if (!key.startsWith(`${id}:`)) continue;
    if (value.userId === session.user.id) continue;

    if (now - value.timestamp < TYPING_TTL) {
      typing = { userId: value.userId, username: value.username };
    } else {
      // Clean up expired entry
      typingMap.delete(key);
    }
  }

  return NextResponse.json({ typing });
}
