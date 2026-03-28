import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  const { id } = await params;

  const profile = await prisma.proProfile.findUnique({
    where: { id },
    include: {
      user: { select: { username: true, image: true } },
      comments: {
        orderBy: { creeLe: "desc" },
        include: {
          auteur: { select: { id: true, username: true, name: true, image: true } },
        },
      },
    },
  });

  if (!profile) {
    return NextResponse.json({ error: "Profil introuvable." }, { status: 404 });
  }

  // Increment views (fire-and-forget)
  prisma.proProfile.update({
    where: { id },
    data: { nbVues: { increment: 1 } },
  }).catch(() => {});

  // Check if current user has voted
  const session = await auth();
  let hasVoted = false;
  if (session?.user?.id) {
    const vote = await prisma.proVote.findUnique({
      where: { userId_proProfileId: { userId: session.user.id, proProfileId: id } },
    });
    hasVoted = !!vote;
  }

  return NextResponse.json({
    profile: {
      id: profile.id,
      userId: profile.userId,
      nomEntreprise: profile.nomEntreprise,
      specialite: profile.specialite,
      description: profile.description,
      telephone: profile.telephone,
      courriel: profile.courriel,
      siteWeb: profile.siteWeb,
      villeSlug: profile.villeSlug,
      imageUrl: profile.imageUrl,
      nbVotes: profile.nbVotes,
      nbVues: profile.nbVues,
      creeLe: profile.creeLe.toISOString(),
      username: profile.user.username,
      userImage: profile.user.image,
    },
    comments: profile.comments.map((c) => ({
      id: c.id,
      contenu: c.contenu,
      auteurNom: c.auteurNom,
      auteurId: c.auteurId,
      auteurUsername: c.auteur?.username ?? c.auteur?.name ?? c.auteurNom,
      auteurImage: c.auteur?.image ?? null,
      nbVotes: c.nbVotes,
      creeLe: c.creeLe.toISOString(),
    })),
    hasVoted,
  });
}
