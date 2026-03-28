import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const body = await req.json();
  const { username, name, image, currentPassword, newPassword,
    emailNotifComments, emailNotifReplies, emailNotifMentions, emailNotifMessages, emailNotifAnnonces } = body;

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });

  const updates: Record<string, string | null | boolean> = {};

  // Email notification preferences
  if (typeof emailNotifComments === "boolean") updates.emailNotifComments = emailNotifComments;
  if (typeof emailNotifReplies === "boolean") updates.emailNotifReplies = emailNotifReplies;
  if (typeof emailNotifMentions === "boolean") updates.emailNotifMentions = emailNotifMentions;
  if (typeof emailNotifMessages === "boolean") updates.emailNotifMessages = emailNotifMessages;
  if (typeof emailNotifAnnonces === "boolean") updates.emailNotifAnnonces = emailNotifAnnonces;

  // Username change
  if (username !== undefined) {
    const trimmed = (username as string).trim().toLowerCase().replace(/[^a-z0-9_-]/g, "");
    if (trimmed.length < 3) return NextResponse.json({ error: "Le nom d'utilisateur doit avoir au moins 3 caractères." }, { status: 400 });
    if (trimmed.length > 30) return NextResponse.json({ error: "Le nom d'utilisateur ne peut pas dépasser 30 caractères." }, { status: 400 });
    if (trimmed !== user.username) {
      const existing = await prisma.user.findUnique({ where: { username: trimmed } });
      if (existing) return NextResponse.json({ error: "Ce nom d'utilisateur est déjà pris." }, { status: 409 });
      updates.username = trimmed;
    }
  }

  // Display name
  if (name !== undefined) {
    const trimmed = (name as string).trim();
    if (trimmed.length > 50) return NextResponse.json({ error: "Le nom ne peut pas dépasser 50 caractères." }, { status: 400 });
    updates.name = trimmed || null;
  }

  // Avatar (base64 data URL or https:// URL)
  if (image !== undefined) {
    if (image === null || image === "") {
      updates.image = null;
    } else if (typeof image === "string") {
      const isDataUrl = image.startsWith("data:image/");
      const isHttps = image.startsWith("https://");
      if (!isDataUrl && !isHttps) {
        return NextResponse.json({ error: "Format d'image invalide." }, { status: 400 });
      }
      // Limit base64 to ~400KB
      if (isDataUrl && image.length > 550_000) {
        return NextResponse.json({ error: "L'image est trop volumineuse (max 400 KB)." }, { status: 400 });
      }
      updates.image = image;
    }
  }

  // Password change
  if (newPassword) {
    if (!currentPassword) {
      return NextResponse.json({ error: "Le mot de passe actuel est requis." }, { status: 400 });
    }
    if (!user.password) {
      return NextResponse.json({ error: "Ce compte n'a pas de mot de passe (connexion OAuth)." }, { status: 400 });
    }
    const valid = await bcrypt.compare(currentPassword as string, user.password);
    if (!valid) return NextResponse.json({ error: "Mot de passe actuel incorrect." }, { status: 400 });
    if ((newPassword as string).length < 8) {
      return NextResponse.json({ error: "Le nouveau mot de passe doit avoir au moins 8 caractères." }, { status: 400 });
    }
    updates.password = await bcrypt.hash(newPassword as string, 10);
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ ok: true });
  }

  const updated = await prisma.user.update({
    where: { id: session.user.id },
    data: updates,
    select: { id: true, username: true, name: true, email: true, image: true },
  });

  return NextResponse.json(updated);
}
