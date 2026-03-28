"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Post } from "@/lib/types";
import { VoteButton } from "./VoteButton";
import { BookmarkButton } from "./BookmarkButton";
import { BadgeDisplay } from "./BadgeDisplay";
import type { Badge } from "@/lib/badges";

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
};

const badgeLabels: Record<string, string> = {
  question: "Question", vente: "Vente", location: "Location",
  renovation: "Conseil", voisinage: "Voisinage",
  construction: "Construction", legal: "Légal",
  financement: "Financement", copropriete: "Co-propriété",
};

const tagLabels: Record<string, string> = {
  courtier: "Courtier", notaire: "Notaire", finance: "Finance",
  entrepreneur: "Entrepreneur", electricien: "Électricien", plombier: "Plombier",
  charpentier: "Charpentier", proprietaire: "Propriétaire", locataire: "Locataire",
};

function AuthorTag({ tag }: { tag: string }) {
  return (
    <span
      className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-medium leading-none"
      style={{ background: "var(--green-light-bg)", color: "var(--green-text)", border: "0.5px solid var(--green)" }}
    >
      {tagLabels[tag] ?? tag}
    </span>
  );
}

function tempsRelatif(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}j`;
}

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function Highlighted({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;
  const parts = text.split(new RegExp(`(${escapeRegex(query)})`, "gi"));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={i} className="rounded-sm not-italic px-0.5"
            style={{ background: "var(--green-light-bg)", color: "var(--green-text)" }}>
            {part}
          </mark>
        ) : part
      )}
    </>
  );
}

function AnimatedCounter({ value, format }: { value: number; format?: (n: number) => string }) {
  const fmt = format ?? ((n: number) => String(n));
  const [displayed, setDisplayed] = useState(value);
  const [animClass, setAnimClass] = useState("");
  const prevRef = useRef(value);

  useEffect(() => {
    if (prevRef.current !== value) {
      setAnimClass("counter-roll-out");
      const t = setTimeout(() => {
        setDisplayed(value);
        setAnimClass("counter-roll-in");
      }, 250);
      prevRef.current = value;
      return () => clearTimeout(t);
    }
  }, [value]);

  return (
    <span
      className={`inline-block ${animClass}`}
      onAnimationEnd={() => setAnimClass("")}
    >
      {fmt(displayed)}
    </span>
  );
}

function PostImage({ src }: { src: string }) {
  if (src.startsWith("data:")) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img src={src} alt="" loading="lazy"
        className="w-full rounded-lg object-cover mb-3"
        style={{ maxHeight: "180px", border: "0.5px solid var(--border)" }}
      />
    );
  }
  return (
    <div className="relative w-full mb-3 rounded-lg overflow-hidden" style={{ maxHeight: "180px", border: "0.5px solid var(--border)" }}>
      <Image src={src} alt="" width={700} height={180}
        className="w-full object-cover" style={{ maxHeight: "180px" }}
        sizes="(max-width: 768px) 100vw, 700px" />
    </div>
  );
}

export function PostCard({ post, searchQuery = "", hasVoted = false, isBookmarked = false, authorBadges }: { post: Post; searchQuery?: string; hasVoted?: boolean; isBookmarked?: boolean; authorBadges?: Badge[] }) {
  return (
    <article
      className="rounded-xl transition-colors hover-bg card-hover-lift"
      style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)", cursor: "pointer" }}
      onClick={(e) => {
        // Don't navigate if clicking on interactive elements
        const target = e.target as HTMLElement;
        if (target.closest("a, button, [role=button]")) return;
        window.location.href = `/post/${post.id}`;
      }}
    >
      <div className="flex gap-0">
        {/* Colonne vote — style Reddit (desktop only) */}
        <div className="hidden md:flex">
          <div
            className="flex flex-col items-center justify-start gap-1 py-3 px-3 rounded-l-xl shrink-0"
            style={{ background: "var(--bg-secondary)", minWidth: "52px" }}
          >
            <VoteButton postId={post.id} initialVotes={post.nbVotes} initialHasVoted={hasVoted} />
          </div>
        </div>

        {/* Contenu */}
        <div className="flex-1 min-w-0 px-4 py-3">
          {/* Meta */}
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span
              className="inline-block px-2 py-0.5 rounded-md text-[11px] font-medium leading-none"
              style={{ background: badgeBg[post.categorie] ?? "var(--bg-secondary)", color: badgeFg[post.categorie] ?? "var(--text-secondary)" }}
            >
              {badgeLabels[post.categorie] ?? post.categorie}
            </span>
            {post.epingle && (
              <span className="text-[11px] font-semibold" style={{ color: "var(--green)" }}>📌 Épinglé</span>
            )}
            <Link href={`/quartier/${post.quartier.slug}`}
              className="text-[11px] font-medium transition-opacity hover:opacity-70"
              style={{ color: "var(--green)" }}>
              {post.quartier.nom}
            </Link>
            <span style={{ color: "var(--border-secondary)" }} className="text-[11px]">·</span>
            <span className="text-[12px]" style={{ color: "var(--text-secondary)" }}>{post.auteur}</span>
            {post.auteurTag && <span className="hidden md:inline"><AuthorTag tag={post.auteurTag} /></span>}
            {authorBadges && authorBadges.length > 0 && <span className="hidden md:inline"><BadgeDisplay badges={authorBadges} compact /></span>}
            <span style={{ color: "var(--border-secondary)" }} className="text-[11px]">·</span>
            <span className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>{tempsRelatif(post.creeLe)}</span>
          </div>

          {/* Titre */}
          <Link href={`/post/${post.id}`}>
            <h2 className="text-[15px] font-[600] leading-snug mb-1.5 transition-opacity hover:opacity-70"
              style={{ color: "var(--text-primary)" }}>
              <Highlighted text={post.titre} query={searchQuery} />
            </h2>
          </Link>

          {/* Extrait */}
          <p className="text-[13px] line-clamp-2 leading-relaxed mb-3" style={{ color: "var(--text-secondary)" }}>
            <Highlighted text={post.contenu} query={searchQuery} />
          </p>

          {post.imageUrl && <PostImage src={post.imageUrl} />}

          {/* Footer */}
          <div className="flex items-center gap-2 md:gap-4 flex-wrap">
            {/* Vote count — mobile only (inline in footer) */}
            <span className="flex md:hidden items-center gap-1 text-[12px] font-medium" style={{ color: "var(--text-tertiary)" }}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
              </svg>
              <AnimatedCounter value={post.nbVotes} />
            </span>
            <Link href={`/post/${post.id}`}
              className="flex items-center gap-1.5 text-[12px] transition-opacity hover:opacity-60"
              style={{ color: "var(--text-tertiary)" }}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span><AnimatedCounter value={post.nbCommentaires} /></span>
              <span className="hidden md:inline">réponses</span>
            </Link>
            <div className="hidden md:block"><BookmarkButton postId={post.id} initialBookmarked={isBookmarked} /></div>
            <div className="hidden md:flex items-center gap-1 text-[12px] ml-auto" style={{ color: "var(--text-tertiary)" }}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <AnimatedCounter value={post.nbVues} format={(n) => n.toLocaleString("fr-CA")} />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
