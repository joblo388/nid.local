"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Categorie } from "@/lib/types";
import { ReportButton } from "./ReportButton";

const CATEGORIES: { value: Categorie; label: string }[] = [
  { value: "question", label: "Question" },
  { value: "vente", label: "Vente" },
  { value: "location", label: "Location" },
  { value: "renovation", label: "Conseil / Rénovation" },
  { value: "voisinage", label: "Voisinage" },
  { value: "construction", label: "Construction" },
  { value: "legal", label: "Légal" },
  { value: "financement", label: "Financement" },
  { value: "copropriete", label: "Co-propriété" },
  { value: "ama", label: "AMA — Posez vos questions" },
];

type Props = {
  postId: string;
  auteurId?: string | null;
  initialTitre: string;
  initialContenu: string;
  initialCategorie: Categorie;
};

export function PostActions({ postId, auteurId, initialTitre, initialContenu, initialCategorie }: Props) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mode, setMode] = useState<"view" | "edit" | "delete">("view");
  const [titre, setTitre] = useState(initialTitre);
  const [contenu, setContenu] = useState(initialContenu);
  const [categorie, setCategorie] = useState<Categorie>(initialCategorie);
  const [erreur, setErreur] = useState("");
  const [loading, setLoading] = useState(false);

  if (status === "loading") return null;

  const isAuthor = !!(session?.user?.id && session.user.id === auteurId);

  // Non-authors see the report button
  if (!isAuthor) {
    return <ReportButton type="post" targetId={postId} />;
  }

  async function handleSave() {
    setErreur("");
    setLoading(true);
    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titre, contenu, categorie }),
      });
      const data = await res.json();
      if (!res.ok) { setErreur(data.error ?? "Erreur"); return; }
      setMode("view");
      router.refresh();
    } catch {
      setErreur("Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    setLoading(true);
    try {
      const res = await fetch(`/api/posts/${postId}`, { method: "DELETE" });
      if (res.ok) router.push("/");
    } catch {
      setErreur("Une erreur est survenue.");
      setLoading(false);
    }
  }

  if (mode === "edit") {
    return (
      <div className="space-y-4 mt-4 pt-4" style={{ borderTop: "0.5px solid var(--border)" }}>
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => setCategorie(cat.value)}
              className="px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors"
              style={
                categorie === cat.value
                  ? { background: "var(--green)", color: "#fff" }
                  : { background: "var(--bg-secondary)", color: "var(--text-secondary)", border: "0.5px solid var(--border)" }
              }
            >
              {cat.label}
            </button>
          ))}
        </div>

        <input
          type="text"
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl text-[14px] outline-none"
          style={{ background: "var(--bg-secondary)", border: "1.5px solid var(--green)", color: "var(--text-primary)" }}
        />

        <textarea
          value={contenu}
          onChange={(e) => setContenu(e.target.value)}
          rows={6}
          className="w-full px-3.5 py-2.5 rounded-xl text-[13px] outline-none resize-none"
          style={{ background: "var(--bg-secondary)", border: "1.5px solid var(--border)", color: "var(--text-primary)" }}
          onFocus={(e) => (e.target.style.borderColor = "var(--green)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
        />

        {erreur && (
          <p className="text-[12px] px-3 py-2 rounded-lg" style={{ background: "var(--red-bg)", color: "var(--red-text)" }}>
            {erreur}
          </p>
        )}

        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 rounded-lg text-[13px] font-semibold text-white disabled:opacity-50"
            style={{ background: "var(--green)" }}
          >
            {loading ? "Sauvegarde…" : "Sauvegarder"}
          </button>
          <button
            onClick={() => { setMode("view"); setTitre(initialTitre); setContenu(initialContenu); setCategorie(initialCategorie); }}
            className="px-4 py-2 rounded-lg text-[13px] font-medium transition-opacity hover:opacity-70"
            style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)" }}
          >
            Annuler
          </button>
        </div>
      </div>
    );
  }

  if (mode === "delete") {
    return (
      <div className="flex items-center gap-3 mt-4 pt-4" style={{ borderTop: "0.5px solid var(--border)" }}>
        <p className="text-[13px]" style={{ color: "var(--text-secondary)" }}>
          Supprimer cette discussion ?
        </p>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="px-3 py-1.5 rounded-lg text-[12px] font-semibold text-white disabled:opacity-50"
          style={{ background: "var(--red-text)" }}
        >
          {loading ? "Suppression…" : "Confirmer"}
        </button>
        <button
          onClick={() => setMode("view")}
          className="px-3 py-1.5 rounded-lg text-[12px] font-medium transition-opacity hover:opacity-70"
          style={{ color: "var(--text-tertiary)" }}
        >
          Annuler
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-2 mt-4 pt-4" style={{ borderTop: "0.5px solid var(--border)" }}>
      <button
        onClick={() => setMode("edit")}
        className="px-3 py-1.5 rounded-lg text-[12px] font-medium transition-opacity hover:opacity-70"
        style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)", border: "0.5px solid var(--border)" }}
      >
        Modifier
      </button>
      <button
        onClick={() => setMode("delete")}
        className="px-3 py-1.5 rounded-lg text-[12px] font-medium transition-opacity hover:opacity-70"
        style={{ color: "var(--red-text)" }}
      >
        Supprimer
      </button>
    </div>
  );
}
