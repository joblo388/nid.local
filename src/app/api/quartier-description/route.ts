import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "slug requis" }, { status: 400 });

  const desc = await prisma.quartierDescription.findUnique({ where: { quartierSlug: slug } });
  return NextResponse.json(desc);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const body = await req.json();
  const { slug, contenu, tags } = body;

  if (!slug || !contenu) {
    return NextResponse.json({ error: "slug et contenu requis" }, { status: 400 });
  }

  const username = session.user.username ?? session.user.name ?? "Anonyme";

  const desc = await prisma.quartierDescription.upsert({
    where: { quartierSlug: slug },
    update: {
      contenu: JSON.stringify(contenu),
      tags: tags ? JSON.stringify(tags) : undefined,
      editeurId: session.user.id,
      editeurNom: username,
    },
    create: {
      quartierSlug: slug,
      contenu: JSON.stringify(contenu),
      tags: tags ? JSON.stringify(tags) : undefined,
      editeurId: session.user.id,
      editeurNom: username,
    },
  });

  return NextResponse.json(desc);
}
