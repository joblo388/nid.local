"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type SimilarPost = {
  id: string;
  titre: string;
  quartier: { nom: string };
  categorie: string;
  nbCommentaires: number;
  nbVotes: number;
  creeLe: string;
};

const badgeBg: Record<string, string> = {
  question:     "var(--blue-bg)",
  vente:        "var(--green-light-bg)",
  location:     "#EEE9FB",
  renovation:   "var(--amber-bg)",
  voisinage:    "var(--bg-secondary)",
  construction: "var(--amber-bg)",
  legal:        "var(--red-bg)",
  financement:  "var(--blue-bg)",
  copropriete:  "var(--green-light-bg)",
  ama:          "#EEE9FB",
};

const badgeFg: Record<string, string> = {
  question:     "var(--blue-text)",
  vente:        "var(--green-text)",
  location:     "#5B31B3",
  renovation:   "var(--amber-text)",
  voisinage:    "var(--text-secondary)",
  construction: "var(--amber-text)",
  legal:        "var(--red-text)",
  financement:  "var(--blue-text)",
  copropriete:  "var(--green-text)",
  ama:          "#5B31B3",
};

const badgeLabels: Record<string, string> = {
  question: "Question", vente: "Vente", location: "Location",
  renovation: "Conseil", voisinage: "Voisinage",
  construction: "Construction", legal: "Légal",
  financement: "Financement", copropriete: "Co-propriété",
  ama: "AMA",
};

export function SimilarPosts({ postId }: { postId: string }) {
  const [posts, setPosts] = useState<SimilarPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/posts/${postId}/similar`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled && Array.isArray(data)) setPosts(data);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [postId]);

  if (loading || posts.length === 0) return null;

  return (
    <section className="mt-3">
      <h3
        className="text-[11px] font-semibold uppercase tracking-wider mb-3"
        style={{ color: "var(--text-tertiary)", letterSpacing: "0.05em" }}
      >
        Discussions similaires
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {posts.map((p) => (
          <Link
            key={p.id}
            href={`/post/${p.id}`}
            className="block rounded-xl p-4 card-hover-lift transition-colors hover-bg"
            style={{
              background: "var(--bg-card)",
              border: "0.5px solid var(--border)",
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span
                className="px-1.5 py-0.5 rounded-md text-[10px] font-medium leading-none"
                style={{
                  background: badgeBg[p.categorie] ?? "var(--bg-secondary)",
                  color: badgeFg[p.categorie] ?? "var(--text-secondary)",
                }}
              >
                {badgeLabels[p.categorie] ?? p.categorie}
              </span>
              <span
                className="text-[11px] font-medium"
                style={{ color: "var(--green)" }}
              >
                {p.quartier.nom}
              </span>
            </div>
            <h4
              className="text-[13px] font-semibold leading-snug mb-2 line-clamp-2"
              style={{ color: "var(--text-primary)" }}
            >
              {p.titre}
            </h4>
            <p className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
              {p.nbVotes} vote{p.nbVotes !== 1 ? "s" : ""} · {p.nbCommentaires} commentaire{p.nbCommentaires !== 1 ? "s" : ""}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
