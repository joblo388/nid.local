import { prisma } from "@/lib/prisma";

// ─── Types ───────────────────────────────────────────────────────────────────

export type Level = { name: string; minPoints: number; color: string };

export const LEVELS: Level[] = [
  { name: "Bronze", minPoints: 0, color: "var(--amber-bg)" },
  { name: "Argent", minPoints: 50, color: "var(--bg-secondary)" },
  { name: "Or", minPoints: 200, color: "var(--amber-bg)" },
  { name: "Diamant", minPoints: 500, color: "var(--blue-bg)" },
  { name: "Legende", minPoints: 2000, color: "var(--green-light-bg)" },
];

export type UserPointsResult = {
  points: number;
  level: Level;
  nextLevel: Level | null;
  progress: number;
};

// ─── Calcul des points d'un utilisateur ──────────────────────────────────────

/**
 * Calculate user points:
 *  - 1 pt per vote received on posts
 *  - 2 pt per comment authored
 *  - 5 pt per post authored
 *  - 3 pt per listing authored
 */
export async function getUserPoints(userId: string): Promise<UserPointsResult> {
  const [postVotesAgg, commentsCount, postsCount, listingsCount] = await Promise.all([
    prisma.post.aggregate({ where: { auteurId: userId }, _sum: { nbVotes: true } }),
    prisma.comment.count({ where: { auteurId: userId } }),
    prisma.post.count({ where: { auteurId: userId } }),
    prisma.listing.count({ where: { auteurId: userId } }),
  ]);

  const votesReceived = postVotesAgg._sum.nbVotes ?? 0;

  const points =
    votesReceived * 1 +
    commentsCount * 2 +
    postsCount * 5 +
    listingsCount * 3;

  // Determine current level (last level whose minPoints <= points)
  let level = LEVELS[0];
  for (const l of LEVELS) {
    if (points >= l.minPoints) level = l;
  }

  // Determine next level
  const currentIndex = LEVELS.indexOf(level);
  const nextLevel = currentIndex < LEVELS.length - 1 ? LEVELS[currentIndex + 1] : null;

  // Progress percentage toward next level
  const progress = nextLevel
    ? Math.min(100, Math.round(((points - level.minPoints) / (nextLevel.minPoints - level.minPoints)) * 100))
    : 100;

  return { points, level, nextLevel, progress };
}
