import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function POST(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (user?.role !== "admin")
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });

  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post)
    return NextResponse.json({ error: "Post introuvable" }, { status: 404 });

  const updated = await prisma.post.update({
    where: { id },
    data: { epingle: !post.epingle },
  });

  return NextResponse.json({ epingle: updated.epingle });
}
