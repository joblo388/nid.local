import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const searches = await prisma.savedSearch.findMany({
    where: { userId: session.user.id },
    orderBy: { creeLe: "desc" },
  });

  return NextResponse.json({ searches });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const body = await req.json();
  const { nom, mode, villeSlug, type, prixMax } = body;

  if (!nom || typeof nom !== "string" || nom.trim().length === 0) {
    return NextResponse.json({ error: "Le nom est requis." }, { status: 400 });
  }

  if (nom.trim().length > 60) {
    return NextResponse.json({ error: "Le nom ne peut pas dépasser 60 caractères." }, { status: 400 });
  }

  // Limit to 20 saved searches per user
  const count = await prisma.savedSearch.count({
    where: { userId: session.user.id },
  });
  if (count >= 20) {
    return NextResponse.json({ error: "Maximum 20 recherches sauvegardées." }, { status: 400 });
  }

  const search = await prisma.savedSearch.create({
    data: {
      userId: session.user.id,
      nom: nom.trim(),
      mode: mode || null,
      villeSlug: villeSlug || null,
      type: type || null,
      prixMax: prixMax ? parseInt(prixMax) : null,
    },
  });

  return NextResponse.json({ search }, { status: 201 });
}
