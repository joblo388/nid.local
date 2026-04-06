import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { getIp } from "@/lib/rateLimit";

const EXCLUDED_IPS = ["67.218.223.166", "184.163.100.115"];

export async function POST(req: Request) {
  try {
    const ip = getIp(req);

    if (EXCLUDED_IPS.includes(ip)) {
      return NextResponse.json({ ok: true });
    }

    const { page, referrer } = await req.json();
    if (!page || typeof page !== "string") {
      return NextResponse.json({ error: "page required" }, { status: 400 });
    }

    const session = await auth();
    const userAgent = req.headers.get("user-agent") || undefined;

    await prisma.pageView.create({
      data: {
        page,
        ip,
        userAgent,
        referrer: referrer || undefined,
        userId: session?.user?.id || undefined,
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "error" }, { status: 500 });
  }
}
