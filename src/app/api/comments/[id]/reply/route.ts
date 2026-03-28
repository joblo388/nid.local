import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { rateLimit, getIp } from "@/lib/rateLimit";
import { sendNotifEmail } from "@/lib/email";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  if (!rateLimit(getIp(req), 10, 60_000)) {
    return NextResponse.json({ error: "Trop de requêtes." }, { status: 429 });
  }
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const { id: parentId } = await params;
  const parent = await prisma.comment.findUnique({ where: { id: parentId }, select: { postId: true, parentId: true } });
  if (!parent) return NextResponse.json({ error: "Commentaire introuvable" }, { status: 404 });

  // Always attach to the top-level comment (no nested nesting)
  const rootId = parent.parentId ?? parentId;

  const { contenu } = await req.json();
  if (!contenu?.trim() || contenu.trim().length < 2) {
    return NextResponse.json({ error: "La réponse est trop courte." }, { status: 400 });
  }

  const auteurNom = session.user.username ?? session.user.name ?? session.user.email ?? "anonyme";
  const auteurId = session.user.id ?? null;
  const dbUser = auteurId ? await prisma.user.findUnique({ where: { id: auteurId }, select: { tag: true } }) : null;
  const auteurTag = dbUser?.tag ?? null;

  const [reply] = await prisma.$transaction([
    prisma.comment.create({
      data: {
        contenu: contenu.trim(),
        auteurNom,
        auteurId,
        postId: parent.postId,
        parentId: rootId,
      },
    }),
    prisma.post.update({
      where: { id: parent.postId },
      data: { nbCommentaires: { increment: 1 } },
    }),
  ]);

  // Notify parent comment author
  const rootComment = await prisma.comment.findUnique({ where: { id: rootId }, select: { auteurId: true, auteurNom: true } });
  const post = await prisma.post.findUnique({ where: { id: parent.postId }, select: { titre: true } });
  if (rootComment?.auteurId && rootComment.auteurId !== auteurId) {
    prisma.notification.create({
      data: {
        userId: rootComment.auteurId,
        type: "reply",
        postId: parent.postId,
        postTitre: post?.titre ?? "",
        acteurNom: auteurNom,
      },
    }).catch(() => {});
    sendNotifEmail({ type: "reply", recipientUserId: rootComment.auteurId, acteurNom: auteurNom, postTitre: post?.titre ?? "", postId: parent.postId }).catch(() => {});
  }

  return NextResponse.json({ ...reply, creeLe: reply.creeLe.toISOString(), auteurId: reply.auteurId ?? null, auteurTag }, { status: 201 });
}
