import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function POST(_req: NextRequest, { params }: Params) {
  const session = await auth();
  const user = session?.user?.id
    ? await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } })
    : null;
  if (user?.role !== "admin") return NextResponse.json({ error: "Non autorisé" }, { status: 403 });

  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id }, select: { epingle: true } });
  if (!post) return NextResponse.json({ error: "Post introuvable" }, { status: 404 });

  const updated = await prisma.post.update({
    where: { id },
    data: { epingle: !post.epingle },
    select: { id: true, epingle: true },
  });

  return NextResponse.json(updated);
}
