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
      className="flex items-center gap-1 text-[12px] transition-opacity hover:opacity-70"
      style={{ color: bookmarked ? "var(--green)" : "var(--text-tertiary)" }}
    >
      <svg className="w-3.5 h-3.5" fill={bookmarked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
      </svg>
      {bookmarked ? "Sauvegardé" : "Sauvegarder"}
    </button>
  );
}
