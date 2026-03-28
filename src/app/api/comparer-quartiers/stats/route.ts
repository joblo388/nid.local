import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const quartierSlug = req.nextUrl.searchParams.get("quartierSlug");
  const type = req.nextUrl.searchParams.get("type");

  if (!quartierSlug || !type) {
    return NextResponse.json({ error: "Missing quartierSlug or type" }, { status: 400 });
  }

  if (type === "posts") {
    const count = await prisma.post.count({ where: { quartierSlug } });
    return NextResponse.json({ count });
  }

  if (type === "listings") {
    const count = await prisma.listing.count({ where: { quartierSlug, statut: "active" } });
    return NextResponse.json({ count });
  }

  return NextResponse.json({ error: "Invalid type" }, { status: 400 });
}
