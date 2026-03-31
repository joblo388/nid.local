"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export function BookmarkButton({
  postId,
  initialBookmarked,
}: {
  postId: string;
  initialBookmarked: boolean;
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    if (!session) { router.push("/auth/connexion"); return; }
    if (loading) return;
    setLoading(true);
    const prev = bookmarked;
    setBookmarked(!prev);
    try {
      const res = await fetch(`/api/bookmarks/${postId}`, {
        method: prev ? "DELETE" : "POST",
      });
      if (!res.ok) setBookmarked(prev);
    } catch {
      setBookmarked(prev);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={toggle}
      title={bookmarked ? "Retirer des favoris" : "Sauvegarder"}
      aria-label={bookmarked ? "Retirer des favoris" : "Sauvegarder"}
      className="flex items-center justify-center w-9 h-9 rounded-lg transition-colors shrink-0"
      style={{
        color: bookmarked ? "var(--green)" : "var(--text-tertiary)",
        background: bookmarked ? "var(--green-light-bg)" : "transparent",
      }}
    >
      <svg className="w-4 h-4" fill={bookmarked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 16 16" strokeWidth={1.5}>
        <path d="M4 2h8a1 1 0 011 1v11l-5-3-5 3V3a1 1 0 011-1z" />
      </svg>
    </button>
  );
}
