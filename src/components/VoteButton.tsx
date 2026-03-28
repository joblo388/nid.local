"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";

export function VoteButton({
  postId,
  initialVotes,
  initialHasVoted,
  hydrateVote = false,
}: {
  postId: string;
  initialVotes: number;
  initialHasVoted: boolean;
  hydrateVote?: boolean;
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [nbVotes, setNbVotes] = useState(initialVotes);
  const [hasVoted, setHasVoted] = useState(initialHasVoted);
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState("");

  // When page is served from ISR cache, hydrate the real vote state client-side
  useEffect(() => {
    if (!hydrateVote) return;
    let cancelled = false;
    fetch(`/api/posts/${postId}/vote`)
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { if (!cancelled && d != null) setHasVoted(d.hasVoted); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [postId, hydrateVote]);

  async function handleVote(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!session) {
      router.push(`/auth/connexion?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }
    if (loading) return;
    setLoading(true);
    setErreur("");
    // Optimistic update
    setHasVoted(!hasVoted);
    setNbVotes((n) => n + (hasVoted ? -1 : 1));
    try {
      const res = await fetch(`/api/posts/${postId}/vote`, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setHasVoted(data.hasVoted);
        setNbVotes(data.nbVotes);
      } else {
        // Revert
        setHasVoted(hasVoted);
        setNbVotes((n) => n + (hasVoted ? 1 : -1));
        setErreur(data.error ?? "Erreur lors du vote.");
        setTimeout(() => setErreur(""), 3000);
      }
    } catch {
      setHasVoted(hasVoted);
      setNbVotes((n) => n + (hasVoted ? 1 : -1));
      setErreur("Une erreur est survenue.");
      setTimeout(() => setErreur(""), 3000);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <button
        onClick={handleVote}
        className="flex items-center justify-center w-8 h-8 rounded-lg transition-all"
        style={{
          background: hasVoted ? "var(--green)" : "transparent",
          color: hasVoted ? "#fff" : "var(--text-tertiary)",
        }}
        onMouseEnter={(e) => { if (!hasVoted) (e.currentTarget as HTMLElement).style.color = "var(--green)"; }}
        onMouseLeave={(e) => { if (!hasVoted) (e.currentTarget as HTMLElement).style.color = "var(--text-tertiary)"; }}
        title={hasVoted ? "Retirer mon vote" : "Voter pour ce post"}
      >
        <svg className="w-4 h-4" fill={hasVoted ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
        </svg>
      </button>
      <span
        className="text-[13px] font-bold tabular-nums"
        style={{ color: hasVoted ? "var(--green)" : "var(--text-secondary)" }}
      >
        {nbVotes}
      </span>
      {erreur && (
        <span className="text-[10px] text-center max-w-[60px]" style={{ color: "var(--red-text)" }}>
          {erreur}
        </span>
      )}
    </div>
  );
}
