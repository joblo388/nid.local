import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(_req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;

  await prisma.listing.update({
    where: { id },
    data: { nbClics: { increment: 1 } },
  }).catch(() => {});

  return NextResponse.json({ ok: true });
}
