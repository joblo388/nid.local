import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { getIp } from "@/lib/rateLimit";

const EXCLUDED_IPS = ["67.218.223.166", "184.163.100.115", "::1", "127.0.0.1"];

const BOT_PATTERNS = [
  "HeadlessChrome",
  "vercel-screenshot",
  "bot",
  "crawler",
  "spider",
  "slurp",
  "facebookexternalhit",
  "Googlebot",
  "Bingbot",
  "Bytespider",
  "GPTBot",
  "ChatGPT",
  "CCBot",
  "Applebot",
  "YandexBot",
  "Baiduspider",
  "DuckDuckBot",
  "Semrush",
  "AhrefsBot",
  "MJ12bot",
  "PetalBot",
  "DataForSeoBot",
];

function isBot(userAgent: string | null): boolean {
  if (!userAgent) return true;
  const ua = userAgent.toLowerCase();
  return BOT_PATTERNS.some((p) => ua.includes(p.toLowerCase()));
}

export async function POST(req: Request) {
  try {
    const ip = getIp(req);
    const userAgent = req.headers.get("user-agent");

    if (EXCLUDED_IPS.includes(ip) || isBot(userAgent)) {
      return NextResponse.json({ ok: true });
    }

    const { page, referrer } = await req.json();
    if (!page || typeof page !== "string") {
      return NextResponse.json({ error: "page required" }, { status: 400 });
    }

    const session = await auth();

    await prisma.pageView.create({
      data: {
        page,
        ip,
        userAgent: userAgent || undefined,
        referrer: referrer || undefined,
        userId: session?.user?.id || undefined,
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "error" }, { status: 500 });
  }
}
