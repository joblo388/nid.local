"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  type: "hypothecaire" | "plex" | "acheter_louer" | "capacite_emprunt";
  getDonnees: () => Record<string, unknown>;
  getResultats: () => Record<string, unknown>;
  getTitre: () => string;
};

export function SaveReportButton({ type, getDonnees, getResultats, getTitre }: Props) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Keep latest function references in refs to avoid stale closures
  const donneesRef = useRef(getDonnees);
  const resultatsRef = useRef(getResultats);
  const titreRef = useRef(getTitre);
  useEffect(() => { donneesRef.current = getDonnees; }, [getDonnees]);
  useEffect(() => { resultatsRef.current = getResultats; }, [getResultats]);
  useEffect(() => { titreRef.current = getTitre; }, [getTitre]);

  if (!session) {
    return (
      <Link
        href={`/auth/connexion?callbackUrl=${encodeURIComponent(pathname)}`}
        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-[13px] font-medium transition-opacity hover:opacity-80"
        style={{ background: "var(--bg-secondary)", border: "0.5px solid var(--border)", color: "var(--text-secondary)" }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>
        Connectez-vous pour sauvegarder
      </Link>
    );
  }

  async function handleSave() {
    setSaving(true);
    try {
      const donnees = donneesRef.current();
      const resultats = resultatsRef.current();
      const titre = titreRef.current();
      const res = await fetch("/api/saved-reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, titre, donnees, resultats }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch { /* ignore */ }
    setSaving(false);
  }

  return (
    <button
      onClick={handleSave}
      disabled={saving || saved}
      className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-[13px] font-medium transition-all"
      style={
        saved
          ? { background: "var(--green-light-bg)", border: "0.5px solid var(--green)", color: "var(--green-text)" }
          : { background: "var(--bg-secondary)", border: "0.5px solid var(--border)", color: "var(--text-secondary)" }
      }
    >
      {saved ? (
        <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
          Sauvegardé! Voir dans mon profil
        </>
      ) : (
        <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>
          {saving ? "Sauvegarde…" : "Sauvegarder ce rapport"}
        </>
      )}
    </button>
  );
}
