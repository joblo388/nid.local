import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit, getIp } from "@/lib/rateLimit";
import { sendEmail, verifyEmailContent } from "@/lib/email";
import crypto from "crypto";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  // Rate limit: 3 per minute per IP
  const ip = getIp(req);
  if (!rateLimit(`resend-verify:${ip}`, 3, 60_000)) {
    return NextResponse.json(
      { error: "Trop de tentatives. Réessayez dans une minute." },
      { status: 429 }
    );
  }

  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      // Always return success to avoid enumeration
      return NextResponse.json({ success: true });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { emailVerified: true },
    });

    // If user doesn't exist or is already verified, return success silently
    if (!user || user.emailVerified) {
      return NextResponse.json({ success: true });
    }

    // Delete any existing tokens for this email
    await prisma.emailVerificationToken.deleteMany({ where: { email } });

    // Create new token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    await prisma.emailVerificationToken.create({
      data: { email, token, expiresAt },
    });

    const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
    const verifyUrl = `${baseUrl}/api/auth/verify-email?token=${token}`;

    await sendEmail({
      to: email,
      subject: "Vérifiez votre courriel — nid.local",
      html: verifyEmailContent(verifyUrl),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[resend-verification]", err);
    // Still return success to avoid enumeration
    return NextResponse.json({ success: true });
  }
}
