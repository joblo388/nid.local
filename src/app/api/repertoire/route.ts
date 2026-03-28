import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { villeBySlug } from "@/lib/data";
import { rateLimit, getIp } from "@/lib/rateLimit";

const SPECIALITES = [
  "courtier", "notaire", "finance", "entrepreneur", "electricien",
  "plombier", "charpentier", "inspecteur", "architecte", "designer",
  "demenagement", "nettoyage", "autre",
];

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  // Return own profile if ?own=1 (includes team profiles by domain)
  if (searchParams.get("own") === "1") {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ profile: null });
    // First check own profile
    let profile = await prisma.proProfile.findUnique({ where: { userId: session.user.id } });
    // If no own profile, check if domain matches a team profile
    if (!profile && session.user.email) {
      const PUBLIC_DOMAINS = ["gmail.com", "hotmail.com", "outlook.com", "yahoo.com", "yahoo.ca", "live.com", "icloud.com", "me.com", "protonmail.com", "mail.com", "aol.com", "nid.local"];
      const domain = session.user.email.split("@")[1]?.toLowerCase();
      if (domain && !PUBLIC_DOMAINS.includes(domain)) {
        profile = await prisma.proProfile.findFirst({ where: { domaine: domain } });
      }
    }
    return NextResponse.json({ profile, isTeam: profile ? profile.userId !== session.user.id : false });
  }

  const specialite = searchParams.get("specialite");
  const villeSlug = searchParams.get("villeSlug");
  const search = searchParams.get("search");
  const tri = searchParams.get("tri") ?? "votes"; // "votes" | "recent"

  const where: Record<string, unknown> = {};

  if (specialite && specialite !== "tous") {
    where.specialite = specialite;
  }
  if (villeSlug && villeSlug !== "tous") {
    where.villeSlug = villeSlug;
  }
  if (search?.trim()) {
    where.OR = [
      { nomEntreprise: { contains: search.trim(), mode: "insensitive" } },
      { description: { contains: search.trim(), mode: "insensitive" } },
    ];
  }

  const orderBy =
    tri === "recent"
      ? { creeLe: "desc" as const }
      : { nbVotes: "desc" as const };

  const session = await auth();
  const userId = session?.user?.id;

  const profiles = await prisma.proProfile.findMany({
    where,
    orderBy,
    include: {
      user: { select: { username: true, image: true } },
    },
  });

  // Get user's votes if logged in
  let votedIds: string[] = [];
  if (userId && profiles.length > 0) {
    const votes = await prisma.proVote.findMany({
      where: { userId, proProfileId: { in: profiles.map((p) => p.id) } },
      select: { proProfileId: true },
    });
    votedIds = votes.map((v) => v.proProfileId);
  }

  // Check if user has a profile
  let myProfile = null;
  if (userId) {
    myProfile = await prisma.proProfile.findUnique({
      where: { userId },
      select: { id: true },
    });
  }

  return NextResponse.json({
    profiles: profiles.map((p) => ({
      id: p.id,
      userId: p.userId,
      nomEntreprise: p.nomEntreprise,
      specialite: p.specialite,
      description: p.description,
      telephone: p.telephone,
      courriel: p.courriel,
      siteWeb: p.siteWeb,
      villeSlug: p.villeSlug,
      imageUrl: p.imageUrl,
      nbVotes: p.nbVotes,
      creeLe: p.creeLe.toISOString(),
      username: p.user.username,
      userImage: p.user.image,
    })),
    votedIds,
    hasProfile: !!myProfile,
  });
}

export async function POST(req: NextRequest) {
  if (!rateLimit(getIp(req), 5, 60_000)) {
    return NextResponse.json({ error: "Trop de requêtes. Réessayez dans une minute." }, { status: 429 });
  }

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const body = await req.json();
  const { nomEntreprise, specialite, description, telephone, courriel, siteWeb, villeSlug, imageUrl } = body;

  if (!nomEntreprise?.trim() || nomEntreprise.trim().length < 2) {
    return NextResponse.json({ error: "Le nom de l'entreprise doit avoir au moins 2 caractères." }, { status: 400 });
  }
  if (!SPECIALITES.includes(specialite)) {
    return NextResponse.json({ error: "Spécialité invalide." }, { status: 400 });
  }
  if (!description?.trim() || description.trim().length < 10) {
    return NextResponse.json({ error: "La description doit avoir au moins 10 caractères." }, { status: 400 });
  }
  if (!villeSlug || !villeBySlug[villeSlug]) {
    return NextResponse.json({ error: "Ville invalide." }, { status: 400 });
  }

  const userId = session.user.id;

  // Extract domain from user email (ignore public domains)
  const PUBLIC_DOMAINS = ["gmail.com", "hotmail.com", "outlook.com", "yahoo.com", "yahoo.ca", "live.com", "icloud.com", "me.com", "protonmail.com", "mail.com", "aol.com", "nid.local"];
  const userEmail = session.user.email ?? "";
  const emailDomain = userEmail.includes("@") ? userEmail.split("@")[1].toLowerCase() : null;
  const domaine = emailDomain && !PUBLIC_DOMAINS.includes(emailDomain) ? emailDomain : null;

  // Check if user's domain matches an existing team profile
  let teamProfile = null;
  if (domaine) {
    teamProfile = await prisma.proProfile.findFirst({
      where: { domaine, userId: { not: userId } },
    });
  }

  const imgVal = typeof imageUrl === "string" && (imageUrl.startsWith("data:image/") || imageUrl.startsWith("https://")) ? imageUrl : null;
  const data = {
    nomEntreprise: nomEntreprise.trim(),
    specialite,
    description: description.trim(),
    telephone: telephone?.trim() || null,
    courriel: courriel?.trim() || null,
    siteWeb: siteWeb?.trim() || null,
    villeSlug,
    imageUrl: imgVal,
    domaine,
  };

  let profile;
  if (teamProfile) {
    // Update the team's existing profile (same domain)
    profile = await prisma.proProfile.update({
      where: { id: teamProfile.id },
      data,
    });
  } else {
    // Upsert — create or update own profile
    profile = await prisma.proProfile.upsert({
      where: { userId },
      create: { userId, ...data },
      update: data,
    });
  }

  return NextResponse.json({ id: profile.id }, { status: 201 });
}
