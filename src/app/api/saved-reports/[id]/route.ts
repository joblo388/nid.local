import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const report = await prisma.savedReport.findUnique({ where: { id } });
  if (!report || report.userId !== session.user.id) {
    return NextResponse.json({ error: "Non trouvé." }, { status: 404 });
  }

  return NextResponse.json({
    id: report.id,
    type: report.type,
    titre: report.titre,
    donnees: JSON.parse(report.donnees),
    resultats: JSON.parse(report.resultats),
    creeLe: report.creeLe.toISOString(),
  });
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const report = await prisma.savedReport.findUnique({ where: { id }, select: { userId: true } });
  if (!report || report.userId !== session.user.id) {
    return NextResponse.json({ error: "Non trouvé." }, { status: 404 });
  }

  await prisma.savedReport.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
