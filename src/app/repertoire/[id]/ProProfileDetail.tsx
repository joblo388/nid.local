"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { villes } from "@/lib/data";
import { useToast } from "@/components/Toast";
import Link from "next/link";
import Image from "next/image";

// ─── Config ────────────────────────────────────────────────────────────────

const SPECIALITES: Record<string, string> = {
  courtier: "Courtier immobilier",
  notaire: "Notaire",
  finance: "Finance / Hypotheque",
  entrepreneur: "Entrepreneur general",
  electricien: "Electricien",
  plombier: "Plombier",
  charpentier: "Charpentier",
  inspecteur: "Inspecteur en batiment",
  architecte: "Architecte",
  designer: "Designer d'interieur",
  demenagement: "Demenagement",
  nettoyage: "Nettoyage",
  autre: "Autre",
};

const specBadgeBg: Record<string, string> = {
  courtier: "var(--green-light-bg)",
  notaire: "var(--blue-bg)",
  finance: "var(--amber-bg)",
  entrepreneur: "var(--green-light-bg)",
  electricien: "var(--amber-bg)",
  plombier: "var(--blue-bg)",
  charpentier: "var(--amber-bg)",
  inspecteur: "var(--red-bg)",
  architecte: "var(--blue-bg)",
  designer: "#EEE9FB",
  demenagement: "var(--green-light-bg)",
  nettoyage: "var(--bg-secondary)",
  autre: "var(--bg-secondary)",
};

const specBadgeFg: Record<string, string> = {
  courtier: "var(--green-text)",
  notaire: "var(--blue-text)",
  finance: "var(--amber-text)",
  entrepreneur: "var(--green-text)",
  electricien: "var(--amber-text)",
  plombier: "var(--blue-text)",
  charpentier: "var(--amber-text)",
  inspecteur: "var(--red-text)",
  architecte: "var(--blue-text)",
  designer: "#5B31B3",
  demenagement: "var(--green-text)",
  nettoyage: "var(--text-secondary)",
  autre: "var(--text-secondary)",
};

const AVATAR_COLORS = [
  "#D4742A", "#185FA5", "#854F0B", "#A32D2D", "#5B31B3",
  "#0F6E56", "#9333EA", "#0369A1", "#B45309", "#DC2626",
];

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function getInitials(name: string): string {
  return name.split(/[\s-]+/).map((w) => w[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();
}

const villeNomMap: Record<string, string> = Object.fromEntries(villes.map((v) => [v.slug, v.nom]));

// ─── Types ─────────────────────────────────────────────────────────────────

type ProProfile = {
  id: string;
  userId: string;
  nomEntreprise: string;
  specialite: string;
  description: string;
  telephone: string | null;
  courriel: string | null;
  siteWeb: string | null;
  villeSlug: string;
  imageUrl: string | null;
  nbVotes: number;
  nbVues: number;
  creeLe: string;
  username: string | null;
  userImage: string | null;
};

type ProCommentType = {
  id: string;
  contenu: string;
  auteurNom: string;
  auteurId: string | null;
  auteurUsername: string;
  auteurImage: string | null;
  nbVotes: number;
  creeLe: string;
};

// ─── Helpers ───────────────────────────────────────────────────────────────

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const d = new Date(dateStr).getTime();
  const diff = now - d;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "a l'instant";
  if (minutes < 60) return `il y a ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `il y a ${hours} h`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `il y a ${days} j`;
  const months = Math.floor(days / 30);
  if (months < 12) return `il y a ${months} mois`;
  return `il y a ${Math.floor(months / 12)} an${Math.floor(months / 12) > 1 ? "s" : ""}`;
}

// ─── VoteButton ────────────────────────────────────────────────────────────

function ProVoteButton({
  profileId,
  initialVotes,
  initialHasVoted,
}: {
  profileId: string;
  initialVotes: number;
  initialHasVoted: boolean;
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const [nbVotes, setNbVotes] = useState(initialVotes);
  const [hasVoted, setHasVoted] = useState(initialHasVoted);
  const [loading, setLoading] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  async function handleVote() {
    if (!session) {
      router.push(`/auth/connexion?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }
    if (loading) return;
    setLoading(true);
    const prevVoted = hasVoted;
    setHasVoted(!hasVoted);
    setNbVotes((n) => n + (hasVoted ? -1 : 1));
    try {
      const res = await fetch(`/api/repertoire/${profileId}/vote`, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setHasVoted(data.hasVoted);
        setNbVotes(data.nbVotes);
      } else {
        setHasVoted(prevVoted);
        setNbVotes((n) => n + (prevVoted ? 1 : -1));
        toast({ message: data.error ?? "Erreur lors du vote.", type: "error" });
      }
    } catch {
      setHasVoted(prevVoted);
      setNbVotes((n) => n + (prevVoted ? 1 : -1));
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      ref={btnRef}
      onClick={handleVote}
      className="flex items-center gap-1.5 rounded-lg px-3 py-2 transition-all text-[13px] font-semibold"
      style={{
        background: hasVoted ? "var(--green)" : "var(--bg-secondary)",
        color: hasVoted ? "#fff" : "var(--text-tertiary)",
        border: hasVoted ? "0.5px solid var(--green)" : "0.5px solid var(--border)",
      }}
      title={hasVoted ? "Retirer mon vote" : "Recommander ce professionnel"}
    >
      <svg className="w-4 h-4" fill={hasVoted ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
      </svg>
      <span className="tabular-nums">{nbVotes}</span>
      <span>{hasVoted ? "Vote" : "Recommander"}</span>
    </button>
  );
}

// ─── Comment ───────────────────────────────────────────────────────────────

function ProCommentItem({ comment }: { comment: ProCommentType }) {
  const initials = getInitials(comment.auteurUsername || comment.auteurNom);
  const color = getAvatarColor(comment.auteurUsername || comment.auteurNom);

  return (
    <div
      className="flex gap-3 py-3"
      style={{ borderBottom: "0.5px solid var(--border)" }}
    >
      {/* Avatar */}
      <div
        className="flex-shrink-0 rounded-full flex items-center justify-center"
        style={{
          width: "32px",
          height: "32px",
          overflow: "hidden",
          background: comment.auteurImage ? "var(--bg-secondary)" : color,
        }}
      >
        {comment.auteurImage ? (
          <Image src={comment.auteurImage} alt="" width={32} height={32} className="rounded-full" style={{ objectFit: "cover" }} />
        ) : (
          <span style={{ fontSize: "12px", fontWeight: 700, color: "#fff" }}>{initials}</span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          {comment.auteurId ? (
            <Link
              href={`/u/${comment.auteurUsername}`}
              className="text-[12px] font-semibold hover:opacity-70 transition-opacity"
              style={{ color: "var(--text-primary)" }}
            >
              {comment.auteurUsername}
            </Link>
          ) : (
            <span className="text-[12px] font-semibold" style={{ color: "var(--text-primary)" }}>
              {comment.auteurNom}
            </span>
          )}
          <span className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
            {timeAgo(comment.creeLe)}
          </span>
        </div>
        <p className="text-[13px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          {comment.contenu}
        </p>
      </div>
    </div>
  );
}

// ─── Comment Form ──────────────────────────────────────────────────────────

function ProCommentForm({
  profileId,
  onCommentAdded,
}: {
  profileId: string;
  onCommentAdded: (comment: ProCommentType) => void;
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const [contenu, setContenu] = useState("");
  const [loading, setLoading] = useState(false);

  if (!session) {
    return (
      <div
        className="rounded-lg p-4 text-center"
        style={{ background: "var(--bg-secondary)", border: "0.5px solid var(--border)" }}
      >
        <p className="text-[12px] mb-2" style={{ color: "var(--text-tertiary)" }}>
          Connectez-vous pour laisser un commentaire.
        </p>
        <button
          onClick={() => router.push(`/auth/connexion?callbackUrl=${encodeURIComponent(pathname)}`)}
          className="rounded-lg px-3 py-1.5 text-[12px] font-semibold"
          style={{ background: "var(--green)", color: "#fff" }}
        >
          Se connecter
        </button>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!contenu.trim() || loading) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/repertoire/${profileId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contenu: contenu.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        onCommentAdded(data);
        setContenu("");
        toast({ message: "Commentaire publie!", type: "success" });
      } else {
        toast({ message: data.error ?? "Erreur.", type: "error" });
      }
    } catch {
      toast({ message: "Erreur reseau.", type: "error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <textarea
        value={contenu}
        onChange={(e) => setContenu(e.target.value)}
        placeholder="Partagez votre experience avec ce professionnel..."
        rows={3}
        className="w-full px-3 py-2 text-[13px] rounded-lg"
        style={{
          background: "var(--bg-secondary)",
          color: "var(--text-primary)",
          border: "0.5px solid var(--border)",
          resize: "vertical",
          outline: "none",
        }}
      />
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!contenu.trim() || loading}
          className="rounded-lg px-4 py-2 text-[12px] font-semibold transition-opacity disabled:opacity-50"
          style={{ background: "var(--green)", color: "#fff" }}
        >
          {loading ? "Envoi..." : "Publier"}
        </button>
      </div>
    </form>
  );
}

// ─── Main component ────────────────────────────────────────────────────────

export function ProProfileDetail({ profileId }: { profileId: string }) {
  const [profile, setProfile] = useState<ProProfile | null>(null);
  const [comments, setComments] = useState<ProCommentType[]>([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`/api/repertoire/${profileId}`)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data) => {
        setProfile(data.profile);
        setComments(data.comments);
        setHasVoted(data.hasVoted);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [profileId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div
          className="w-6 h-6 rounded-full border-2 animate-spin"
          style={{ borderColor: "var(--border)", borderTopColor: "var(--green)" }}
        />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="rounded-xl p-8 text-center" style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}>
        <p className="text-[14px]" style={{ color: "var(--text-tertiary)" }}>Profil introuvable.</p>
        <Link href="/repertoire" className="text-[12px] mt-2 inline-block" style={{ color: "var(--green)" }}>
          Retour au repertoire
        </Link>
      </div>
    );
  }

  const hasImage = !!profile.imageUrl;
  const initials = getInitials(profile.nomEntreprise);
  const avatarColor = getAvatarColor(profile.nomEntreprise);
  const villeName = villeNomMap[profile.villeSlug] ?? profile.villeSlug;
  const specLabel = SPECIALITES[profile.specialite] ?? profile.specialite;
  const memberSince = new Date(profile.creeLe).toLocaleDateString("fr-CA", { year: "numeric", month: "long" });

  function handleCommentAdded(comment: ProCommentType) {
    setComments((prev) => [comment, ...prev]);
  }

  return (
    <div>
      {/* Back link */}
      <Link
        href="/repertoire"
        className="inline-flex items-center gap-1 text-[12px] mb-4 hover:opacity-70 transition-opacity"
        style={{ color: "var(--text-tertiary)" }}
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Retour au repertoire
      </Link>

      {/* Profile card */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
      >
        {/* Header with image/avatar */}
        <div className="flex flex-col sm:flex-row">
          {/* Avatar/Image */}
          <div
            className="flex-shrink-0 flex items-center justify-center"
            style={{
              width: "100%",
              maxWidth: "200px",
              aspectRatio: "1 / 1",
              background: hasImage ? "var(--bg-secondary)" : avatarColor,
              position: "relative",
              overflow: "hidden",
              margin: "16px 0 0 16px",
              borderRadius: "12px",
            }}
          >
            {hasImage ? (
              <Image
                src={profile.imageUrl!}
                alt={profile.nomEntreprise}
                fill
                sizes="200px"
                style={{ objectFit: "cover" }}
              />
            ) : (
              <span style={{ fontSize: "48px", fontWeight: 800, color: "#fff", opacity: 0.9 }}>
                {initials}
              </span>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 p-4 sm:p-5 flex flex-col justify-center">
            <h1
              className="font-bold leading-tight mb-2"
              style={{ fontSize: "20px", color: "var(--text-primary)" }}
            >
              {profile.nomEntreprise}
            </h1>

            <div className="flex items-center gap-2 flex-wrap mb-3">
              {/* Speciality badge */}
              <span
                className="inline-flex items-center px-2 py-0.5 rounded-md font-medium leading-none"
                style={{
                  fontSize: "11px",
                  background: specBadgeBg[profile.specialite] ?? "var(--bg-secondary)",
                  color: specBadgeFg[profile.specialite] ?? "var(--text-secondary)",
                }}
              >
                {specLabel}
              </span>
              {/* Ville */}
              <span className="text-[12px]" style={{ color: "var(--text-tertiary)" }}>
                {villeName}
              </span>
              {/* Member since */}
              <span className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
                Membre depuis {memberSince}
              </span>
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-4 mb-3">
              <div className="flex items-center gap-1 text-[12px]" style={{ color: "var(--text-tertiary)" }}>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
                <span className="font-semibold" style={{ color: "var(--text-primary)" }}>{profile.nbVotes}</span> votes
              </div>
              <div className="flex items-center gap-1 text-[12px]" style={{ color: "var(--text-tertiary)" }}>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span className="font-semibold" style={{ color: "var(--text-primary)" }}>{profile.nbVues}</span> vues
              </div>
              <div className="flex items-center gap-1 text-[12px]" style={{ color: "var(--text-tertiary)" }}>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className="font-semibold" style={{ color: "var(--text-primary)" }}>{comments.length}</span> commentaires
              </div>
            </div>

            {/* Vote button */}
            <ProVoteButton
              profileId={profile.id}
              initialVotes={profile.nbVotes}
              initialHasVoted={hasVoted}
            />
          </div>
        </div>

        {/* Description */}
        <div className="px-5 pb-4 pt-2">
          <h2 className="text-[13px] font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
            Description
          </h2>
          <p
            className="text-[13px] leading-relaxed whitespace-pre-wrap"
            style={{ color: "var(--text-secondary)" }}
          >
            {profile.description}
          </p>
        </div>

        {/* Contact info */}
        {(profile.telephone || profile.courriel || profile.siteWeb) && (
          <div
            className="px-5 pb-5 pt-3 mx-5 mb-5 rounded-lg"
            style={{ background: "var(--bg-secondary)" }}
          >
            <h2 className="text-[12px] font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
              Coordonnees
            </h2>
            <div className="flex flex-col gap-2">
              {profile.telephone && (
                <a
                  href={`tel:${profile.telephone}`}
                  className="flex items-center gap-2 text-[13px] hover:opacity-70 transition-opacity"
                  style={{ color: "var(--green)" }}
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {profile.telephone}
                </a>
              )}
              {profile.courriel && (
                <a
                  href={`mailto:${profile.courriel}`}
                  className="flex items-center gap-2 text-[13px] hover:opacity-70 transition-opacity"
                  style={{ color: "var(--green)" }}
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {profile.courriel}
                </a>
              )}
              {profile.siteWeb && (
                <a
                  href={profile.siteWeb.startsWith("http") ? profile.siteWeb : `https://${profile.siteWeb}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[13px] hover:opacity-70 transition-opacity"
                  style={{ color: "var(--green)" }}
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  {profile.siteWeb}
                </a>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Comments section */}
      <div
        className="rounded-xl mt-4 p-5"
        style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
      >
        <h2 className="text-[14px] font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
          Commentaires ({comments.length})
        </h2>

        {/* Comment form */}
        <div className="mb-4">
          <ProCommentForm profileId={profileId} onCommentAdded={handleCommentAdded} />
        </div>

        {/* Comments list */}
        {comments.length === 0 ? (
          <p className="text-[12px] text-center py-4" style={{ color: "var(--text-tertiary)" }}>
            Aucun commentaire pour le moment. Soyez le premier!
          </p>
        ) : (
          <div>
            {comments.map((comment) => (
              <ProCommentItem key={comment.id} comment={comment} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
