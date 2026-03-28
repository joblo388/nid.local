import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { rateLimit, getIp } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  if (!rateLimit(getIp(req), 5, 60_000)) {
    return NextResponse.json({ error: "Trop de requêtes." }, { status: 429 });
  }
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { type, targetId, reason } = await req.json();
  if (!["post", "comment", "listing"].includes(type) || !targetId || !reason?.trim()) {
    return NextResponse.json({ error: "Données invalides." }, { status: 400 });
  }

  await prisma.report.create({
    data: { type, targetId, reason: reason.trim(), auteurId: session.user.id },
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
