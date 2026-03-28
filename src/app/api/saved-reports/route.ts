import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const TYPES_VALIDES = ["hypothecaire", "plex", "acheter_louer", "capacite_emprunt"];

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const reports = await prisma.savedReport.findMany({
    where: { userId: session.user.id },
    orderBy: { creeLe: "desc" },
  });

  return NextResponse.json({
    reports: reports.map((r) => ({
      id: r.id,
      type: r.type,
      titre: r.titre,
      donnees: JSON.parse(r.donnees),
      resultats: JSON.parse(r.resultats),
      creeLe: r.creeLe.toISOString(),
    })),
  });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const body = await req.json();
  const { type, titre, donnees, resultats } = body;

  if (!TYPES_VALIDES.includes(type)) {
    return NextResponse.json({ error: "Type invalide." }, { status: 400 });
  }

  const report = await prisma.savedReport.create({
    data: {
      userId: session.user.id,
      type,
      titre: (titre || "Rapport sans titre").trim(),
      donnees: JSON.stringify(donnees),
      resultats: JSON.stringify(resultats),
    },
  });

  return NextResponse.json({ id: report.id }, { status: 201 });
}
