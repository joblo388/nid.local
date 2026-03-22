import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { dbPostToAppPost } from "@/lib/data";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) return NextResponse.json([]);

  const posts = await prisma.post.findMany({
    where: {
      OR: [
        { titre: { contains: q } },
        { contenu: { contains: q } },
        { auteurNom: { contains: q } },
        { quartierSlug: { contains: q } },
        { villeSlug: { contains: q } },
      ],
    },
    orderBy: { nbVotes: "desc" },
    take: 30,
  });

  return NextResponse.json(posts.map(dbPostToAppPost));
}
