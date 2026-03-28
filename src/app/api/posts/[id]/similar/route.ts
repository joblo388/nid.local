import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { quartierBySlug } from "@/lib/data";

type Params = { params: Promise<{ id: string }> };

const TARGET = 4;

const select = {
  id: true,
  titre: true,
  quartierSlug: true,
  categorie: true,
  nbCommentaires: true,
  nbVotes: true,
  creeLe: true,
} as const;

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;

  const post = await prisma.post.findUnique({
    where: { id },
    select: { quartierSlug: true, villeSlug: true, categorie: true },
  });

  if (!post) {
    return NextResponse.json({ error: "Post introuvable" }, { status: 404 });
  }

  const seenIds = new Set<string>([id]);
  const results: Array<{
    id: string;
    titre: string;
    quartierSlug: string;
    categorie: string;
    nbCommentaires: number;
    nbVotes: number;
    creeLe: Date;
  }> = [];

  // 1. Same quartier + same categorie
  if (results.length < TARGET) {
    const rows = await prisma.post.findMany({
      where: {
        quartierSlug: post.quartierSlug,
        categorie: post.categorie,
        id: { notIn: [...seenIds] },
      },
      orderBy: { nbVotes: "desc" },
      take: TARGET - results.length,
      select,
    });
    for (const r of rows) {
      seenIds.add(r.id);
      results.push(r);
    }
  }

  // 2. Same ville + same categorie
  if (results.length < TARGET) {
    const rows = await prisma.post.findMany({
      where: {
        villeSlug: post.villeSlug,
        categorie: post.categorie,
        id: { notIn: [...seenIds] },
      },
      orderBy: { nbVotes: "desc" },
      take: TARGET - results.length,
      select,
    });
    for (const r of rows) {
      seenIds.add(r.id);
      results.push(r);
    }
  }

  // 3. Same categorie across all villes
  if (results.length < TARGET) {
    const rows = await prisma.post.findMany({
      where: {
        categorie: post.categorie,
        id: { notIn: [...seenIds] },
      },
      orderBy: { nbVotes: "desc" },
      take: TARGET - results.length,
      select,
    });
    for (const r of rows) {
      seenIds.add(r.id);
      results.push(r);
    }
  }

  const payload = results.map((r) => {
    const q = quartierBySlug[r.quartierSlug];
    return {
      id: r.id,
      titre: r.titre,
      quartier: { nom: q?.nom ?? r.quartierSlug },
      categorie: r.categorie,
      nbCommentaires: r.nbCommentaires,
      nbVotes: r.nbVotes,
      creeLe: r.creeLe.toISOString(),
    };
  });

  return NextResponse.json(payload, {
    headers: {
      "Cache-Control": "public, s-maxage=300",
    },
  });
}
