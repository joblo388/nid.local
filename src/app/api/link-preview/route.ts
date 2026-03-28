import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getIp } from "@/lib/rateLimit";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url")?.trim();

  if (!url) {
    return NextResponse.json({ error: "URL requise" }, { status: 400 });
  }

  // Only allow http/https
  let parsed: URL;
  try {
    parsed = new URL(url);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return NextResponse.json({ error: "Protocole non supporté" }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: "URL invalide" }, { status: 400 });
  }

  // Block private/internal IPs
  const hostname = parsed.hostname;
  if (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname.startsWith("192.168.") ||
    hostname.startsWith("10.") ||
    hostname.startsWith("172.") ||
    hostname === "0.0.0.0" ||
    hostname === "[::1]"
  ) {
    return NextResponse.json({ error: "URL non autorisée" }, { status: 400 });
  }

  // Rate limit: 30 requests per minute per IP
  const ip = getIp(req);
  const allowed = rateLimit(`link-preview:${ip}`, 30, 60_000);
  if (!allowed) {
    return NextResponse.json({ error: "Trop de requêtes" }, { status: 429 });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; NidLocalBot/1.0)",
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
    });

    clearTimeout(timeout);

    if (!response.ok) {
      return NextResponse.json({ error: "Impossible de récupérer la page" }, { status: 502 });
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("text/html") && !contentType.includes("application/xhtml")) {
      return NextResponse.json({ error: "Le contenu n'est pas du HTML" }, { status: 400 });
    }

    // Read only the first 50KB to avoid large payloads
    const reader = response.body?.getReader();
    if (!reader) {
      return NextResponse.json({ error: "Pas de contenu" }, { status: 502 });
    }

    let html = "";
    const decoder = new TextDecoder();
    const maxBytes = 50_000;
    let totalBytes = 0;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      totalBytes += value.byteLength;
      html += decoder.decode(value, { stream: true });
      if (totalBytes >= maxBytes) break;
    }
    reader.cancel();

    // Parse metadata from HTML
    const meta = parseMetadata(html, parsed);

    return NextResponse.json(meta, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
      },
    });
  } catch (err: unknown) {
    if (err instanceof Error && err.name === "AbortError") {
      return NextResponse.json({ error: "Délai d'attente dépassé" }, { status: 504 });
    }
    return NextResponse.json({ error: "Erreur lors de la récupération" }, { status: 502 });
  }
}

function getMetaContent(html: string, property: string): string | null {
  // Match both property="..." and name="..." attributes
  const patterns = [
    new RegExp(`<meta[^>]+(?:property|name)=["']${escapeRegex(property)}["'][^>]+content=["']([^"']*)["']`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+(?:property|name)=["']${escapeRegex(property)}["']`, "i"),
  ];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) return decodeHtmlEntities(match[1].trim());
  }
  return null;
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, "/");
}

function parseMetadata(html: string, parsedUrl: URL) {
  const title =
    getMetaContent(html, "og:title") ??
    getMetaContent(html, "twitter:title") ??
    html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.trim() ??
    null;

  const description =
    getMetaContent(html, "og:description") ??
    getMetaContent(html, "twitter:description") ??
    getMetaContent(html, "description") ??
    null;

  let image =
    getMetaContent(html, "og:image") ??
    getMetaContent(html, "twitter:image") ??
    null;

  // Make relative image URLs absolute
  if (image && !image.startsWith("http")) {
    try {
      image = new URL(image, parsedUrl.origin).href;
    } catch {
      image = null;
    }
  }

  const siteName =
    getMetaContent(html, "og:site_name") ??
    parsedUrl.hostname.replace(/^www\./, "");

  // Extract favicon
  let favicon: string | null = null;
  const faviconMatch = html.match(
    /<link[^>]+rel=["'](?:icon|shortcut icon|apple-touch-icon)["'][^>]+href=["']([^"']*)["']/i
  ) ?? html.match(
    /<link[^>]+href=["']([^"']*)["'][^>]+rel=["'](?:icon|shortcut icon|apple-touch-icon)["']/i
  );

  if (faviconMatch?.[1]) {
    favicon = faviconMatch[1];
    if (!favicon.startsWith("http")) {
      try {
        favicon = new URL(favicon, parsedUrl.origin).href;
      } catch {
        favicon = null;
      }
    }
  }

  // Fallback to /favicon.ico
  if (!favicon) {
    favicon = `${parsedUrl.origin}/favicon.ico`;
  }

  return {
    title: title ? decodeHtmlEntities(title) : null,
    description: description ? decodeHtmlEntities(description) : null,
    image,
    siteName: siteName ? decodeHtmlEntities(siteName) : null,
    favicon,
    url: parsedUrl.href,
  };
}
