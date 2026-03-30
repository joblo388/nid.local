import { prisma } from "@/lib/prisma";

const BASE = "https://nidlocal.com";

export async function GET() {
  const posts = await prisma.post.findMany({
    orderBy: { creeLe: "desc" },
    take: 50,
    select: { id: true, titre: true, contenu: true, auteurNom: true, quartierSlug: true, creeLe: true },
  });

  const items = posts.map((p) => {
    const excerpt = p.contenu.slice(0, 300).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return `<item>
      <title><![CDATA[${p.titre}]]></title>
      <link>${BASE}/post/${p.id}</link>
      <description><![CDATA[${excerpt}]]></description>
      <pubDate>${p.creeLe.toUTCString()}</pubDate>
      <guid isPermaLink="true">${BASE}/post/${p.id}</guid>
    </item>`;
  }).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>nid.local — Forum immobilier Québec</title>
    <link>${BASE}</link>
    <description>Les dernières discussions immobilières au Québec</description>
    <language>fr-CA</language>
    <atom:link href="${BASE}/rss.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
