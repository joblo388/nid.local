import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) return NextResponse.redirect(new URL("/auth/connexion", req.url));

  const record = await prisma.emailVerificationToken.findUnique({ where: { token } });
  if (!record || record.expiresAt < new Date()) {
    if (record) await prisma.emailVerificationToken.delete({ where: { token } });
    return NextResponse.redirect(new URL("/auth/verifier-courriel?error=expire", req.url));
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { email: record.email },
      data: { emailVerified: new Date() },
    }),
    prisma.emailVerificationToken.delete({ where: { token } }),
  ]);

  return NextResponse.redirect(new URL("/?verified=1", req.url));
}
