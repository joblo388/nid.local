import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function POST(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  prisma.post.update({ where: { id }, data: { nbVues: { increment: 1 } } }).catch(() => {});
  return NextResponse.json({ ok: true });
}
