import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const revalidate = 300; // 5 min

const BASE_URL = process.env.NEXTAUTH_URL?.replace(/\/$/, "") ?? "https://nid.local";

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const posts = await prisma.post.findMany({
    orderBy: { creeLe: "desc" },
    take: 50,
    select: { id: true, titre: true, contenu: true, auteurNom: true, categorie: true, creeLe: true, villeSlug: true, quartierSlug: true },
  });

  const items = posts
    .map((p) => {
      const url = `${BASE_URL}/post/${p.id}`;
      const excerpt = p.contenu.slice(0, 300).replace(/\s\S*$/, "") + (p.contenu.length > 300 ? "…" : "");
      return `
    <item>
      <title>${escapeXml(p.titre)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(excerpt)}</description>
      <author>${escapeXml(p.auteurNom)}</author>
      <category>${escapeXml(p.categorie)}</category>
      <pubDate>${new Date(p.creeLe).toUTCString()}</pubDate>
    </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>nid.local — Forum immobilier québécois</title>
    <link>${BASE_URL}</link>
    <description>Discussions immobilières, ventes, locations, rénovations et alertes de voisinage au Québec.</description>
    <language>fr-CA</language>
    <atom:link href="${BASE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=300",
    },
  });
}
