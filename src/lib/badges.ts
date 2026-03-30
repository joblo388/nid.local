import { prisma } from "@/lib/prisma";

// ─── Types ───────────────────────────────────────────────────────────────────

export type Badge = {
  id: string;
  nom: string;
  description: string;
  icon: string;
  couleur: "green" | "blue" | "amber";
};

type UserStats = {
  posts: number;
  comments: number;
  votesReceived: number;
  listings: number;
  daysOld: number;
};

type BadgeDefinition = Badge & {
  threshold: (stats: UserStats) => boolean;
  /** Lower = more important (shown first in compact mode) */
  priority: number;
};

// ─── Définitions des badges ──────────────────────────────────────────────────

const badgeDefinitions: BadgeDefinition[] = [
  // Posts
  {
    id: "premier_post",
    nom: "Premier pas",
    description: "A publié son premier post",
    icon: "pen",
    couleur: "green",
    priority: 50,
    threshold: (s) => s.posts >= 1,
  },
  {
    id: "contributeur",
    nom: "Contributeur",
    description: "10 posts publiés",
    icon: "edit",
    couleur: "blue",
    priority: 30,
    threshold: (s) => s.posts >= 10,
  },
  {
    id: "prolifique",
    nom: "Prolifique",
    description: "50 posts publiés",
    icon: "trophy",
    couleur: "amber",
    priority: 10,
    threshold: (s) => s.posts >= 50,
  },
  // Votes reçus
  {
    id: "apprecie",
    nom: "Apprécié",
    description: "50 votes reçus",
    icon: "thumb-up",
    couleur: "green",
    priority: 40,
    threshold: (s) => s.votesReceived >= 50,
  },
  {
    id: "populaire",
    nom: "Populaire",
    description: "200 votes reçus",
    icon: "star",
    couleur: "amber",
    priority: 5,
    threshold: (s) => s.votesReceived >= 200,
  },
  // Commentaires
  {
    id: "bavard",
    nom: "Bavard",
    description: "20 commentaires publiés",
    icon: "chat",
    couleur: "blue",
    priority: 35,
    threshold: (s) => s.comments >= 20,
  },
  // Ancienneté
  {
    id: "veteran",
    nom: "Vétéran",
    description: "Membre depuis plus d'un an",
    icon: "medal",
    couleur: "amber",
    priority: 15,
    threshold: (s) => s.daysOld >= 365,
  },
  // Marketplace
  {
    id: "vendeur",
    nom: "Vendeur",
    description: "A publié une annonce",
    icon: "home",
    couleur: "green",
    priority: 45,
    threshold: (s) => s.listings >= 1,
  },
];

// ─── Couleurs CSS par palette ────────────────────────────────────────────────

export const badgeCouleurs: Record<Badge["couleur"], { bg: string; text: string }> = {
  green: { bg: "var(--green-light-bg)", text: "var(--green-text)" },
  blue:  { bg: "var(--blue-bg)",        text: "var(--blue-text)" },
  amber: { bg: "var(--amber-bg)",       text: "var(--amber-text)" },
};

// ─── Calcul des badges d'un utilisateur ──────────────────────────────────────

export async function getUserBadges(userId: string): Promise<Badge[]> {
  const [user, postsCount, commentsCount, postVotesAgg, listingsCount] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { createdAt: true } }),
    prisma.post.count({ where: { auteurId: userId } }),
    prisma.comment.count({ where: { auteurId: userId } }),
    prisma.post.aggregate({ where: { auteurId: userId }, _sum: { nbVotes: true } }),
    prisma.listing.count({ where: { auteurId: userId } }),
  ]);

  if (!user) return [];

  const daysOld = Math.floor((Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24));

  const stats: UserStats = {
    posts: postsCount,
    comments: commentsCount,
    votesReceived: postVotesAgg._sum.nbVotes ?? 0,
    listings: listingsCount,
    daysOld,
  };

  return badgeDefinitions
    .filter((b) => b.threshold(stats))
    .sort((a, b) => a.priority - b.priority)
    .map(({ id, nom, description, icon, couleur }) => ({ id, nom, description, icon, couleur }));
}
