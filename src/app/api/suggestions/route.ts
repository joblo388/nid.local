import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { rateLimit, getIp } from "@/lib/rateLimit";
import { sendNotifEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  if (!rateLimit(getIp(req), 3, 60_000)) {
    return NextResponse.json({ error: "Trop de requêtes." }, { status: 429 });
  }

  const session = await auth();
  const body = await req.json();
  const { sujet, message, email } = body;

  if (!sujet?.trim() || !message?.trim()) {
    return NextResponse.json({ error: "Sujet et message requis." }, { status: 400 });
  }

  // Find admin user(s)
  const admins = await prisma.user.findMany({
    where: { role: "admin" },
    select: { id: true },
  });

  const auteurNom = session?.user?.username ?? session?.user?.name ?? email ?? "Visiteur anonyme";

  // Create a notification for each admin
  for (const admin of admins) {
    await prisma.notification.create({
      data: {
        userId: admin.id,
        type: "suggestion",
        postId: "suggestion",
        postTitre: `[Suggestion] ${sujet.trim()}`,
        acteurNom: auteurNom,
      },
    });
    sendNotifEmail({ type: "suggestion", recipientUserId: admin.id, acteurNom: auteurNom, postTitre: `[Suggestion] ${sujet.trim()}`, postId: "suggestion" }).catch(() => {});
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
