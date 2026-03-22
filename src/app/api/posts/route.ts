import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { quartierBySlug, villeBySlug } from "@/lib/data";
import { rateLimit, getIp } from "@/lib/rateLimit";

const CATEGORIES = ["vente", "location", "question", "renovation", "voisinage", "alerte"];

export async function POST(req: NextRequest) {
  if (!rateLimit(getIp(req), 5, 60_000)) {
    return NextResponse.json({ error: "Trop de requêtes. Réessayez dans une minute." }, { status: 429 });
  }
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const body = await req.json();
  const { titre, contenu, quartierSlug, villeSlug, categorie } = body;

  if (!titre?.trim() || titre.trim().length < 5) {
    return NextResponse.json({ error: "Le titre doit avoir au moins 5 caractères." }, { status: 400 });
  }
  if (!contenu?.trim() || contenu.trim().length < 20) {
    return NextResponse.json({ error: "Le contenu doit avoir au moins 20 caractères." }, { status: 400 });
  }
  if (!quartierSlug || !quartierBySlug[quartierSlug]) {
    return NextResponse.json({ error: "Quartier invalide." }, { status: 400 });
  }
  if (!villeSlug || !villeBySlug[villeSlug]) {
    return NextResponse.json({ error: "Ville invalide." }, { status: 400 });
  }
  if (!CATEGORIES.includes(categorie)) {
    return NextResponse.json({ error: "Catégorie invalide." }, { status: 400 });
  }

  const auteurNom = session.user.username ?? session.user.name ?? session.user.email ?? "anonyme";
  const auteurId = session.user.id ?? null;

  const post = await prisma.post.create({
    data: {
      titre: titre.trim(),
      contenu: contenu.trim(),
      auteurNom,
      auteurId,
      quartierSlug,
      villeSlug,
      categorie,
    },
  });

  return NextResponse.json({ id: post.id }, { status: 201 });
}
