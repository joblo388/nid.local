"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AdminActions({
  reportId,
  type,
  targetId,
}: {
  reportId: string;
  type: "post" | "comment";
  targetId: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return <span className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>Traité</span>;

  async function handleDelete() {
    setLoading(true);
    const route = type === "post" ? `/api/posts/${targetId}` : `/api/comments/${targetId}`;
    await fetch(route, { method: "DELETE" });
    await fetch(`/api/admin/reports/${reportId}`, { method: "DELETE" });
    setLoading(false);
    router.refresh();
  }

  async function handleDismiss() {
    setLoading(true);
    await fetch(`/api/admin/reports/${reportId}`, { method: "DELETE" });
    setLoading(false);
    setDismissed(true);
  }

  return (
    <div className="flex gap-2 shrink-0">
      <button
        onClick={handleDismiss}
        disabled={loading}
        className="text-[12px] px-2.5 py-1 rounded-lg transition-opacity hover:opacity-70 disabled:opacity-40"
        style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)" }}
      >
        Ignorer
      </button>
      <button
        onClick={handleDelete}
        disabled={loading}
        className="text-[12px] px-2.5 py-1 rounded-lg font-semibold text-white transition-opacity hover:opacity-80 disabled:opacity-40"
        style={{ background: "var(--red-text)" }}
      >
        Supprimer
      </button>
    </div>
  );
}
