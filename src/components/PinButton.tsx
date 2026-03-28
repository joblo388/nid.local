"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function PinButton({
  postId,
  initialPinned,
  isAdmin,
}: {
  postId: string;
  initialPinned: boolean;
  isAdmin: boolean;
}) {
  const router = useRouter();
  const [epingle, setEpingle] = useState(initialPinned);
  const [loading, setLoading] = useState(false);

  if (!isAdmin) return null;

  async function toggle(e: React.MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/posts/${postId}/pin`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setEpingle(data.epingle);
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      title={epingle ? "Désépingler ce post" : "Épingler ce post"}
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-medium transition-opacity hover:opacity-70 disabled:opacity-40 shrink-0"
      style={
        epingle
          ? { background: "var(--amber-bg)", color: "var(--amber-text)" }
          : { background: "var(--bg-secondary)", color: "var(--text-tertiary)", border: "0.5px solid var(--border)" }
      }
    >
      <span className="text-[12px]">{epingle ? "📌" : "📌"}</span>
      {epingle ? "Désépingler" : "Épingler"}
    </button>
  );
}
