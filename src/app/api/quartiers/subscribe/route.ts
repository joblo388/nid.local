import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET — return list of subscribed quartierSlugs for current user
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const subs = await prisma.quartierSubscription.findMany({
    where: { userId: session.user.id },
    select: { quartierSlug: true },
  });

  return NextResponse.json({
    quartierSlugs: subs.map((s) => s.quartierSlug),
  });
}

// POST { quartierSlug } — toggle subscription
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const body = await req.json();
  const { quartierSlug } = body;

  if (!quartierSlug || typeof quartierSlug !== "string") {
    return NextResponse.json({ error: "quartierSlug requis" }, { status: 400 });
  }

  const userId = session.user.id;

  // Check if already subscribed
  const existing = await prisma.quartierSubscription.findUnique({
    where: { userId_quartierSlug: { userId, quartierSlug } },
  });

  if (existing) {
    // Unsubscribe
    await prisma.quartierSubscription.delete({
      where: { id: existing.id },
    });
    return NextResponse.json({ subscribed: false, quartierSlug });
  } else {
    // Subscribe
    await prisma.quartierSubscription.create({
      data: { userId, quartierSlug },
    });
    return NextResponse.json({ subscribed: true, quartierSlug });
  }
}
