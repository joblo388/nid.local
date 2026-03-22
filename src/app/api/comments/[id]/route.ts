import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

async function getAuthorizedComment(id: string, userId: string) {
  const comment = await prisma.comment.findUnique({ where: { id } });
  if (!comment) return { error: "Commentaire introuvable", status: 404, comment: null };
  if (comment.auteurId !== userId) return { error: "Non autorisé", status: 403, comment: null };
  return { error: null, status: 200, comment };
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const { id } = await params;
  const { error, status, comment } = await getAuthorizedComment(id, session.user.id);
  if (error || !comment) return NextResponse.json({ error }, { status });

  const { contenu } = await req.json();
  if (!contenu?.trim() || contenu.trim().length < 2)
    return NextResponse.json({ error: "Le commentaire est trop court." }, { status: 400 });

  const updated = await prisma.comment.update({
    where: { id },
    data: { contenu: contenu.trim() },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const { id } = await params;
  const { error, status, comment } = await getAuthorizedComment(id, session.user.id);
  if (error || !comment) return NextResponse.json({ error }, { status });

  await prisma.$transaction([
    prisma.comment.delete({ where: { id } }),
    prisma.post.update({
      where: { id: comment.postId },
      data: { nbCommentaires: { decrement: 1 } },
    }),
  ]);

  return NextResponse.json({ ok: true });
}
