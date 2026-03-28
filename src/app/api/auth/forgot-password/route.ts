import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit, getIp } from "@/lib/rateLimit";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  if (!rateLimit(getIp(req), 3, 60_000)) {
    return NextResponse.json({ error: "Trop de requêtes. Réessayez dans une minute." }, { status: 429 });
  }

  const { email } = await req.json();
  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "Courriel invalide." }, { status: 400 });
  }

  // Always return success to avoid user enumeration
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
  if (!user || !user.password) {
    // User doesn't exist or uses OAuth — return success anyway
    return NextResponse.json({ message: "ok" });
  }

  // Delete any existing token for this email
  await prisma.passwordResetToken.deleteMany({ where: { email: user.email! } });

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await prisma.passwordResetToken.create({
    data: { email: user.email!, token, expiresAt },
  });

  const resetUrl = `${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/auth/reinitialiser-mot-de-passe?token=${token}`;

  const { sendEmail, resetPasswordEmail } = await import("@/lib/email");
  await sendEmail({
    to: user.email!,
    subject: "Réinitialisation de mot de passe — nid.local",
    html: resetPasswordEmail(resetUrl),
  });

  return NextResponse.json({ message: "ok" });
}
