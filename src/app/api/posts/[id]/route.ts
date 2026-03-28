import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

const CATEGORIES = ["vente", "location", "question", "renovation", "voisinage", "construction", "legal", "financement", "copropriete"];

async function getAuthorizedPost(id: string, userId: string) {
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) return { error: "Post introuvable", status: 404, post: null };
  if (post.auteurId !== userId) return { error: "Non autorisé", status: 403, post: null };
  return { error: null, status: 200, post };
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const { id } = await params;
  const { error, status, post } = await getAuthorizedPost(id, session.user.id);
  if (error || !post) return NextResponse.json({ error }, { status });

  const body = await req.json();
  const { titre, contenu, categorie } = body;

  if (titre !== undefined && (!titre?.trim() || titre.trim().length < 5))
    return NextResponse.json({ error: "Le titre doit avoir au moins 5 caractères." }, { status: 400 });
  if (contenu !== undefined && (!contenu?.trim() || contenu.trim().length < 20))
    return NextResponse.json({ error: "Le contenu doit avoir au moins 20 caractères." }, { status: 400 });
  if (categorie !== undefined && !CATEGORIES.includes(categorie))
    return NextResponse.json({ error: "Catégorie invalide." }, { status: 400 });

  const updated = await prisma.post.update({
    where: { id },
    data: {
      ...(titre && { titre: titre.trim() }),
      ...(contenu && { contenu: contenu.trim() }),
      ...(categorie && { categorie }),
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const { id } = await params;
  const { error, status, post } = await getAuthorizedPost(id, session.user.id);
  if (error || !post) return NextResponse.json({ error }, { status });

  await prisma.post.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
