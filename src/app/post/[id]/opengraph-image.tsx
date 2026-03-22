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

  const titre = post.titre.length > 80 ? post.titre.slice(0, 80) + "…" : post.titre;
  const excerpt = post.contenu.length > 160 ? post.contenu.slice(0, 160) + "…" : post.contenu;

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: "#f5f4f0",
          display: "flex",
          flexDirection: "column",
          padding: "60px 72px",
          fontFamily: "system-ui, sans-serif",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={{ fontSize: 28, fontWeight: 900, color: "#1a1a18" }}>nid</span>
          <span style={{ fontSize: 28, fontWeight: 900, color: "#1D9E75" }}>.local</span>
        </div>

        {/* Content */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Badge + quartier */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span
              style={{
                background: badge.bg,
                color: badge.fg,
                fontSize: 14,
                fontWeight: 600,
                padding: "4px 12px",
                borderRadius: 8,
              }}
            >
              {label}
            </span>
            <span style={{ fontSize: 15, color: "#1D9E75", fontWeight: 500 }}>
              {post.quartier.nom}
            </span>
          </div>

          {/* Titre */}
          <div
            style={{
              fontSize: 42,
              fontWeight: 800,
              color: "#1a1a18",
              lineHeight: 1.15,
            }}
          >
            {titre}
          </div>

          {/* Excerpt */}
          <div
            style={{
              fontSize: 20,
              color: "#3d3c39",
              lineHeight: 1.5,
            }}
          >
            {excerpt}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 24,
            borderTop: "1px solid #e8e7e2",
          }}
        >
          <span style={{ fontSize: 15, color: "#6e6c67" }}>
            par {post.auteur}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <span style={{ fontSize: 15, color: "#6e6c67" }}>
              ▲ {post.nbVotes}
            </span>
            <span style={{ fontSize: 15, color: "#6e6c67" }}>
              💬 {post.nbCommentaires}
            </span>
            <span style={{ fontSize: 15, color: "#6e6c67" }}>
              👁 {post.nbVues}
            </span>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
