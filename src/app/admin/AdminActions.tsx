"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function PinButton({ postId, initialEpingle }: { postId: string; initialEpingle: boolean }) {
  const router = useRouter();
  const [epingle, setEpingle] = useState(initialEpingle);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    const res = await fetch(`/api/admin/posts/${postId}/pin`, { method: "POST" });
    if (res.ok) {
      const data = await res.json();
      setEpingle(data.epingle);
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className="text-[12px] px-2.5 py-1 rounded-lg transition-opacity hover:opacity-70 disabled:opacity-40 shrink-0"
      style={
        epingle
          ? { background: "var(--amber-bg)", color: "var(--amber-text)" }
          : { background: "var(--bg-secondary)", color: "var(--text-secondary)" }
      }
    >
      {epingle ? "Désépingler" : "Épingler"}
    </button>
  );
}

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
