"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useToast } from "./Toast";
import { useConfetti } from "./Confetti";

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
  const { toast } = useToast();
  const { celebrate } = useConfetti();
  const [nbVotes, setNbVotes] = useState(initialVotes);
  const [hasVoted, setHasVoted] = useState(initialHasVoted);
  const [loading, setLoading] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

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
    // Optimistic update
    setHasVoted(!hasVoted);
    setNbVotes((n) => n + (hasVoted ? -1 : 1));
    try {
      const res = await fetch(`/api/posts/${postId}/vote`, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        // Celebrate first vote on a post (0 -> 1)
        if (data.hasVoted && data.nbVotes === 1) {
          celebrate();
        }
        setHasVoted(data.hasVoted);
        setNbVotes(data.nbVotes);
        // Trigger vote-pop animation
        const el = btnRef.current;
        if (el) {
          el.classList.remove("vote-pop");
          void el.offsetWidth; // force reflow
          el.classList.add("vote-pop");
          el.addEventListener("animationend", () => el.classList.remove("vote-pop"), { once: true });
        }
      } else {
        // Revert
        setHasVoted(hasVoted);
        setNbVotes((n) => n + (hasVoted ? 1 : -1));
        toast({ message: data.error ?? "Erreur lors du vote.", type: "error" });
      }
    } catch {
      setHasVoted(hasVoted);
      setNbVotes((n) => n + (hasVoted ? 1 : -1));
      toast({ message: "Une erreur est survenue.", type: "error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <button
        ref={btnRef}
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
    </div>
  );
}
