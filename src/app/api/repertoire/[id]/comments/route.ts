import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { rateLimit, getIp } from "@/lib/rateLimit";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;

  const comments = await prisma.proComment.findMany({
    where: { proProfileId: id },
    orderBy: { creeLe: "desc" },
    include: {
      auteur: { select: { id: true, username: true, name: true, image: true } },
    },
  });

  return NextResponse.json({
    comments: comments.map((c) => ({
      id: c.id,
      contenu: c.contenu,
      auteurNom: c.auteurNom,
      auteurId: c.auteurId,
      auteurUsername: c.auteur?.username ?? c.auteur?.name ?? c.auteurNom,
      auteurImage: c.auteur?.image ?? null,
      nbVotes: c.nbVotes,
      creeLe: c.creeLe.toISOString(),
    })),
  });
}

export async function POST(req: NextRequest, { params }: Params) {
  const { id } = await params;

  if (!rateLimit(getIp(req), 10, 60_000)) {
    return NextResponse.json({ error: "Trop de requêtes." }, { status: 429 });
  }

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const body = await req.json();
  const { contenu } = body;

  if (!contenu?.trim() || contenu.trim().length < 2) {
    return NextResponse.json({ error: "Le commentaire est trop court." }, { status: 400 });
  }

  // Verify profile exists
  const profile = await prisma.proProfile.findUnique({ where: { id }, select: { id: true, userId: true, nomEntreprise: true } });
  if (!profile) {
    return NextResponse.json({ error: "Profil introuvable." }, { status: 404 });
  }

  const auteurNom = session.user.username ?? session.user.name ?? session.user.email ?? "anonyme";

  // Notify profile owner
  if (profile.userId !== session.user.id) {
    const acteur = session.user.username ?? session.user.name ?? session.user.email ?? "quelqu'un";
    await prisma.notification.create({
      data: {
        userId: profile.userId,
        type: "pro_comment",
        postId: profile.id,
        postTitre: profile.nomEntreprise,
        acteurNom: acteur,
      },
    }).catch(() => {});
  }

  const comment = await prisma.proComment.create({
    data: {
      contenu: contenu.trim(),
      auteurNom,
      auteurId: session.user.id,
      proProfileId: id,
    },
    include: {
      auteur: { select: { id: true, username: true, name: true, image: true } },
    },
  });

  return NextResponse.json({
    id: comment.id,
    contenu: comment.contenu,
    auteurNom: comment.auteurNom,
    auteurId: comment.auteurId,
    auteurUsername: comment.auteur?.username ?? comment.auteur?.name ?? comment.auteurNom,
    auteurImage: comment.auteur?.image ?? null,
    nbVotes: comment.nbVotes,
    creeLe: comment.creeLe.toISOString(),
  }, { status: 201 });
}
