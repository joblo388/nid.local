import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const { id } = await params;

  const alerte = await prisma.alerteMarketplace.findUnique({ where: { id } });
  if (!alerte) {
    return NextResponse.json({ error: "Alerte introuvable." }, { status: 404 });
  }
  if (alerte.userId !== session.user.id) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 403 });
  }

  await prisma.alerteMarketplace.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}

export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const { id } = await params;

  const alerte = await prisma.alerteMarketplace.findUnique({ where: { id } });
  if (!alerte) {
    return NextResponse.json({ error: "Alerte introuvable." }, { status: 404 });
  }
  if (alerte.userId !== session.user.id) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 403 });
  }

  const updated = await prisma.alerteMarketplace.update({
    where: { id },
    data: { active: !alerte.active },
  });

  return NextResponse.json({ alerte: updated });
}
