import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { quartierBySlug, villeBySlug, dbPostToAppPost } from "@/lib/data";
import { rateLimit, getIp } from "@/lib/rateLimit";

const PAGE_SIZE = 20;

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const villeSlug = searchParams.get("villeSlug") ?? "montreal";
  const quartierSlug = searchParams.get("quartierSlug");
  const categorie = searchParams.get("categorie");
  const tri = searchParams.get("tri") ?? "populaire";
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));

  const where = {
    villeSlug,
    ...(quartierSlug && quartierSlug !== "tous" ? { quartierSlug } : {}),
    ...(categorie && categorie !== "tous" ? { categorie } : {}),
  };

  const orderBy =
    tri === "recent" ? [{ epingle: "desc" as const }, { creeLe: "desc" as const }] :
    tri === "actif"  ? [{ epingle: "desc" as const }, { nbCommentaires: "desc" as const }] :
                       [{ epingle: "desc" as const }, { nbVotes: "desc" as const }];

  const session = await auth();
  const userId = session?.user?.id;

  const [dbPosts, total] = await Promise.all([
    prisma.post.findMany({ where, orderBy, take: PAGE_SIZE, skip: (page - 1) * PAGE_SIZE }),
    prisma.post.count({ where }),
  ]);

  const postIds = dbPosts.map((p) => p.id);
  const [userVotes, userBookmarks] = userId
    ? await Promise.all([
        prisma.vote.findMany({ where: { userId, postId: { in: postIds } }, select: { postId: true } }),
        prisma.bookmark.findMany({ where: { userId, postId: { in: postIds } }, select: { postId: true } }),
      ])
    : [[], []];

  return NextResponse.json({
    posts: dbPosts.map(dbPostToAppPost),
    total,
    hasMore: total > page * PAGE_SIZE,
    votedPostIds: userVotes.map((v) => v.postId),
    bookmarkedPostIds: userBookmarks.map((b) => b.postId),
  });
}

const CATEGORIES = ["vente", "location", "question", "renovation", "voisinage", "construction", "legal", "financement", "copropriete"];

export async function POST(req: NextRequest) {
  if (!rateLimit(getIp(req), 5, 60_000)) {
    return NextResponse.json({ error: "Trop de requêtes. Réessayez dans une minute." }, { status: 429 });
  }
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const body = await req.json();
  const { titre, contenu, quartierSlug, villeSlug, categorie, imageUrl } = body;

  if (!titre?.trim() || titre.trim().length < 5) {
    return NextResponse.json({ error: "Le titre doit avoir au moins 5 caractères." }, { status: 400 });
  }
  if (!contenu?.trim() || contenu.trim().length < 20) {
    return NextResponse.json({ error: "Le contenu doit avoir au moins 20 caractères." }, { status: 400 });
  }
  if (!quartierSlug || !quartierBySlug[quartierSlug]) {
    return NextResponse.json({ error: "Quartier invalide." }, { status: 400 });
  }
  if (!villeSlug || !villeBySlug[villeSlug]) {
    return NextResponse.json({ error: "Ville invalide." }, { status: 400 });
  }
  if (!CATEGORIES.includes(categorie)) {
    return NextResponse.json({ error: "Catégorie invalide." }, { status: 400 });
  }

  const auteurNom = session.user.username ?? session.user.name ?? session.user.email ?? "anonyme";
  const auteurId = session.user.id ?? null;

  const post = await prisma.post.create({
    data: {
      titre: titre.trim(),
      contenu: contenu.trim(),
      auteurNom,
      auteurId,
      quartierSlug,
      villeSlug,
      categorie,
      imageUrl: typeof imageUrl === "string" && (imageUrl.startsWith("data:image/") || imageUrl.startsWith("https://")) ? imageUrl : null,
    },
  });

  return NextResponse.json({ id: post.id }, { status: 201 });
}
