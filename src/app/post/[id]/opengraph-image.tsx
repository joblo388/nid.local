import { ImageResponse } from "next/og";
import { prisma } from "@/lib/prisma";
import { dbPostToAppPost } from "@/lib/data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const badgeColors: Record<string, { bg: string; fg: string }> = {
  alerte:    { bg: "#FCEBEB", fg: "#A32D2D" },
  question:  { bg: "#E6F1FB", fg: "#185FA5" },
  vente:     { bg: "#E1F5EE", fg: "#0F6E56" },
  location:  { bg: "#EEE9FB", fg: "#5B31B3" },
  renovation:{ bg: "#FAEEDA", fg: "#854F0B" },
  voisinage: { bg: "#f1efe8", fg: "#3d3c39" },
};

const badgeLabels: Record<string, string> = {
  alerte: "Alerte", question: "Question", vente: "Vente",
  location: "Location", renovation: "Conseil", voisinage: "Voisinage",
};

export default async function OgImage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const dbPost = await prisma.post.findUnique({ where: { id } });
  if (!dbPost) return new Response("Not found", { status: 404 });

  const post = dbPostToAppPost(dbPost);
  const badge = badgeColors[post.categorie] ?? badgeColors.voisinage;
  const label = badgeLabels[post.categorie] ?? post.categorie;
  const titre = post.titre.length > 72 ? post.titre.slice(0, 72) + "…" : post.titre;
  const excerpt = post.contenu.replace(/[#*`_~>[\]]/g, "").slice(0, 140);
  const hasImage = dbPost.imageUrl && !dbPost.imageUrl.startsWith("data:");

  return new ImageResponse(
    (
      <div style={{ width: "1200px", height: "630px", background: "#f5f4f0", display: "flex", fontFamily: "system-ui, sans-serif" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "52px 56px", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ fontSize: 26, fontWeight: 900, color: "#1a1a18" }}>nid</span>
            <span style={{ fontSize: 26, fontWeight: 900, color: "#D4742A" }}>.local</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ background: badge.bg, color: badge.fg, fontSize: 13, fontWeight: 700, padding: "4px 12px", borderRadius: 6 }}>
                {label.toUpperCase()}
              </span>
              <span style={{ fontSize: 14, color: "#D4742A", fontWeight: 600 }}>{post.quartier.nom}</span>
            </div>
            <div style={{ fontSize: hasImage ? 36 : 44, fontWeight: 800, color: "#1a1a18", lineHeight: 1.15, letterSpacing: "-0.5px" }}>
              {titre}
            </div>
            {!hasImage && (
              <div style={{ fontSize: 19, color: "#3d3c39", lineHeight: 1.55, opacity: 0.85 }}>{excerpt}</div>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 20, borderTop: "1px solid #e8e7e2" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: 14, background: "#D4742A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff" }}>
                {(post.auteur?.[0] ?? "?").toUpperCase()}
              </div>
              <span style={{ fontSize: 14, color: "#6e6c67", fontWeight: 500 }}>@{post.auteur}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <span style={{ fontSize: 14, color: "#6e6c67" }}>▲ {post.nbVotes}</span>
              <span style={{ fontSize: 14, color: "#6e6c67" }}>💬 {post.nbCommentaires}</span>
              <span style={{ fontSize: 14, color: "#6e6c67" }}>👁 {post.nbVues}</span>
            </div>
          </div>
        </div>
        {hasImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={dbPost.imageUrl!} style={{ width: "420px", height: "630px", objectFit: "cover" }} alt="" />
        )}
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
