import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ postId: string }> };

export async function POST(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  const { postId } = await params;
  try {
    await prisma.bookmark.create({ data: { userId: session.user.id, postId } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true }); // already bookmarked
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  const { postId } = await params;
  await prisma.bookmark.deleteMany({ where: { userId: session.user.id, postId } });
  return NextResponse.json({ ok: true });
}
