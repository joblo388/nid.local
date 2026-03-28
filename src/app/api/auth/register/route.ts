import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
  console.log("[register] DATABASE_URL:", process.env.DATABASE_URL);
  const body = await req.text();
  console.log("[register] body:", body);
  const { username, email, password } = JSON.parse(body);

  if (!username || !email || !password) {
    return NextResponse.json({ error: "Champs manquants." }, { status: 400 });
  }

  if (username.length < 3 || username.length > 20) {
    return NextResponse.json(
      { error: "Le nom d'utilisateur doit faire entre 3 et 20 caractères." },
      { status: 400 }
    );
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return NextResponse.json(
      { error: "Nom d'utilisateur invalide (lettres, chiffres, _ seulement)." },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: "Le mot de passe doit faire au moins 8 caractères." },
      { status: 400 }
    );
  }

  console.log("[register] checking email...");
  const existingEmail = await prisma.user.findUnique({ where: { email } });
  if (existingEmail) {
    return NextResponse.json(
      { error: "Ce courriel est déjà utilisé." },
      { status: 400 }
    );
  }

  const existingUsername = await prisma.user.findUnique({ where: { username } });
  if (existingUsername) {
    return NextResponse.json(
      { error: "Ce nom d'utilisateur est déjà pris." },
      { status: 400 }
    );
  }

  const hashed = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      username,
      email,
      password: hashed,
      name: username,
    },
  });

  // Send email verification
  try {
    const crypto = await import("crypto");
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await prisma.emailVerificationToken.create({ data: { email, token, expiresAt } });
    const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
    const verifyUrl = `${baseUrl}/api/auth/verify-email?token=${token}`;
    const { sendEmail, verifyEmailContent } = await import("@/lib/email");
    await sendEmail({ to: email, subject: "Vérifiez votre courriel — nid.local", html: verifyEmailContent(verifyUrl) });
  } catch (e) {
    console.error("[register] verify email error:", e);
  }

  return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[register]", err);
    return NextResponse.json({ error: "Erreur serveur, réessaie." }, { status: 500 });
  }
}
