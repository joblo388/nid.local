"use client";

import { useToast } from "./Toast";

export function ShareCalculation({ getData, label }: { getData: () => Record<string, string | number>; label?: string }) {
  const { toast } = useToast();

  async function handleShare() {
    const data = getData();
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(data)) {
      if (v !== "" && v !== undefined && v !== null) params.set(k, String(v));
    }
    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: label ?? "Calcul | nid.local", url });
        return;
      } catch {
        // User cancelled or share failed — fall through to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      toast({ message: "Lien copié dans le presse-papier", type: "success" });
    } catch {
      toast({ message: "Impossible de copier le lien", type: "error" });
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-[13px] font-medium transition-opacity hover:opacity-80"
      style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)", border: "0.5px solid var(--border)" }}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
      </svg>
      Partager
    </button>
  );
}
