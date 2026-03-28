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

  const search = await prisma.savedSearch.findUnique({ where: { id } });
  if (!search) {
    return NextResponse.json({ error: "Recherche introuvable." }, { status: 404 });
  }
  if (search.userId !== session.user.id) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 403 });
  }

  await prisma.savedSearch.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
