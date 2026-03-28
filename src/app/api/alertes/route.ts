import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const TYPES_VALIDES = ["unifamiliale", "condo", "duplex", "triplex", "quadruplex"];

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const alertes = await prisma.alerteMarketplace.findMany({
    where: { userId: session.user.id },
    orderBy: { creeLe: "desc" },
  });

  return NextResponse.json({ alertes });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const body = await req.json();
  const { villeSlug, quartierSlug, type, prixMax, prixMin, chambresMin } = body;

  // Validate type if provided
  if (type && !TYPES_VALIDES.includes(type)) {
    return NextResponse.json({ error: "Type de propriété invalide." }, { status: 400 });
  }

  // Validate price range
  if (prixMin != null && prixMax != null && prixMin > prixMax) {
    return NextResponse.json({ error: "Le prix minimum ne peut pas dépasser le prix maximum." }, { status: 400 });
  }

  const alerte = await prisma.alerteMarketplace.create({
    data: {
      userId: session.user.id,
      villeSlug: villeSlug || null,
      quartierSlug: quartierSlug || null,
      type: type || null,
      prixMax: prixMax ? parseInt(prixMax) : null,
      prixMin: prixMin ? parseInt(prixMin) : null,
      chambresMin: chambresMin ? parseInt(chambresMin) : null,
    },
  });

  return NextResponse.json({ alerte }, { status: 201 });
}
