import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { rateLimit, getIp } from "@/lib/rateLimit";
import { sendNotifEmail, sendNotifEmailBulk } from "@/lib/email";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  if (!rateLimit(getIp(req), 10, 60_000)) {
    return NextResponse.json({ error: "Trop de requêtes. Réessayez dans une minute." }, { status: 429 });
  }
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { id: postId } = await params;
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) {
    return NextResponse.json({ error: "Post introuvable" }, { status: 404 });
  }

  const body = await req.json();
  const { contenu, imageUrl, mentions } = body;
  if (!contenu?.trim() || contenu.trim().length < 2) {
    return NextResponse.json({ error: "Le commentaire est trop court." }, { status: 400 });
  }

  const auteurNom = session.user.username ?? session.user.name ?? session.user.email ?? "anonyme";
  const sessionUserId = session.user.id ?? null;
  const userExists = sessionUserId
    ? await prisma.user.findUnique({ where: { id: sessionUserId }, select: { id: true } })
    : null;
  const auteurId = userExists ? sessionUserId : null;

  const [comment] = await prisma.$transaction([
    prisma.comment.create({
      data: {
        contenu: contenu.trim(),
        auteurNom,
        auteurId,
        postId,
        imageUrl: typeof imageUrl === "string" && imageUrl.startsWith("data:image/") ? imageUrl : null,
      },
    }),
    prisma.post.update({
      where: { id: postId },
      data: { nbCommentaires: { increment: 1 } },
    }),
  ]);

  // Notify post author (if different from commenter)
  if (post.auteurId && post.auteurId !== auteurId) {
    prisma.notification.create({
      data: { userId: post.auteurId, type: "comment", postId, postTitre: post.titre, acteurNom: auteurNom },
    }).catch(() => {});
    sendNotifEmail({ type: "comment", recipientUserId: post.auteurId, acteurNom: auteurNom, postTitre: post.titre, postId }).catch(() => {});
  }

  // Notify @mentioned users
  if (Array.isArray(mentions) && mentions.length > 0) {
    const mentionedUsers = await prisma.user.findMany({
      where: { username: { in: mentions.slice(0, 5) } },
      select: { id: true },
    });
    const notifyIds = mentionedUsers
      .map((u) => u.id)
      .filter((uid) => uid !== auteurId && uid !== post.auteurId);
    if (notifyIds.length > 0) {
      prisma.notification.createMany({
        data: notifyIds.map((uid) => ({
          userId: uid,
          type: "mention",
          postId,
          postTitre: post.titre,
          acteurNom: auteurNom,
        })),
      }).catch(() => {});
      sendNotifEmailBulk(notifyIds, { type: "mention", acteurNom: auteurNom, postTitre: post.titre, postId }).catch(() => {});
    }
  }

  return NextResponse.json(comment, { status: 201 });
}
