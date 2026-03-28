import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { quartierBySlug, villeBySlug, dbPostToAppPost } from "@/lib/data";
import { rateLimit, getIp } from "@/lib/rateLimit";
import { sendNotifEmail } from "@/lib/email";

const PAGE_SIZE = 20;

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const villeSlug = searchParams.get("villeSlug") ?? "montreal";
  const quartierSlug = searchParams.get("quartierSlug");
  const categorie = searchParams.get("categorie");
  const tri = searchParams.get("tri") ?? "populaire";
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const subscribedQuartiers = searchParams.get("subscribedQuartiers");

  // When subscribedQuartiers is provided, filter by those quartier slugs instead of villeSlug
  const where = subscribedQuartiers
    ? {
        quartierSlug: { in: subscribedQuartiers.split(",").filter(Boolean) },
        ...(categorie && categorie !== "tous" ? { categorie } : {}),
      }
    : {
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
    prisma.post.findMany({ where, orderBy, take: PAGE_SIZE, skip: (page - 1) * PAGE_SIZE, include: { auteur: { select: { tag: true } } } }),
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
  }, {
    headers: {
      "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
    },
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
  const { titre, contenu, quartierSlug, villeSlug, categorie, imageUrl, _hp, poll } = body;

  // Honeypot check
  if (_hp) {
    return NextResponse.json({ id: "fake" }, { status: 201 });
  }

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

  // Create poll if provided
  if (poll && Array.isArray(poll.options)) {
    const options = poll.options
      .filter((o: unknown) => typeof o === "string" && o.trim())
      .map((o: string) => o.trim())
      .slice(0, 5);

    if (options.length >= 2) {
      await prisma.poll.create({
        data: {
          postId: post.id,
          options: {
            create: options.map((label: string) => ({ label })),
          },
        },
      });
    }
  }

  // ─── Expert proximity notifications ──────────────────────────────────────
  // Map post categories to relevant ProProfile specialities
  const CATEGORY_TO_SPECIALITIES: Record<string, string[]> = {
    question: [], // empty = all pros
    legal: ["notaire"],
    financement: ["finance", "courtier"],
    renovation: ["entrepreneur", "electricien", "plombier", "charpentier"],
    construction: ["entrepreneur", "architecte", "charpentier"],
  };

  if (categorie in CATEGORY_TO_SPECIALITIES) {
    const specialities = CATEGORY_TO_SPECIALITIES[categorie];
    const where_pro: Record<string, unknown> = { villeSlug };
    if (specialities.length > 0) {
      where_pro.specialite = { in: specialities };
    }

    prisma.proProfile.findMany({
      where: where_pro,
      select: { userId: true, nomEntreprise: true },
    }).then((pros) => {
      // Filter out the post author
      const targets = pros.filter((p) => p.userId !== auteurId);
      if (targets.length === 0) return;

      // Create notifications in bulk
      prisma.notification.createMany({
        data: targets.map((pro) => ({
          userId: pro.userId,
          type: "expert_request",
          postId: post.id,
          postTitre: post.titre,
          acteurNom: auteurNom,
        })),
      }).catch(() => {});

      // Send notification emails (fire-and-forget)
      for (const pro of targets) {
        sendNotifEmail({
          type: "expert_request" as Parameters<typeof sendNotifEmail>[0]["type"],
          recipientUserId: pro.userId,
          acteurNom: auteurNom,
          postTitre: post.titre,
          postId: post.id,
        }).catch(() => {});
      }
    }).catch(() => {});
  }

  return NextResponse.json({ id: post.id }, { status: 201 });
}
