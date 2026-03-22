"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReportButton } from "./ReportButton";

type Comment = {
  id: string;
  contenu: string;
  auteurNom: string;
  auteurId: string | null;
  creeLe: string;
};

function CommentItem({
  comment,
  currentUserId,
}: {
  comment: Comment;
  currentUserId?: string;
}) {
  const [mode, setMode] = useState<"view" | "edit" | "delete">("view");
  const [contenu, setContenu] = useState(comment.contenu);
  const [displayed, setDisplayed] = useState(comment.contenu);
  const [deleted, setDeleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState("");

  const isOwn = !!(currentUserId && comment.auteurId === currentUserId);
  const dateStr = new Date(comment.creeLe).toLocaleDateString("fr-CA", {
    year: "numeric", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

  async function handleSave() {
    setErreur("");
    setLoading(true);
    try {
      const res = await fetch(`/api/comments/${comment.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contenu }),
      });
      const data = await res.json();
      if (!res.ok) { setErreur(data.error ?? "Erreur"); return; }
      setDisplayed(contenu);
      setMode("view");
    } catch {
      setErreur("Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    setLoading(true);
    try {
      const res = await fetch(`/api/comments/${comment.id}`, { method: "DELETE" });
      if (res.ok) setDeleted(true);
    } catch {
      setLoading(false);
    }
  }

  if (deleted) return null;

  return (
    <div className="flex gap-3">
      <div
        className="w-7 h-7 rounded-full shrink-0 mt-0.5 flex items-center justify-center text-[11px] font-bold text-white"
        style={{ background: "var(--green)" }}
      >
        {comment.auteurNom.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[12px] font-semibold" style={{ color: "var(--text-secondary)" }}>
            {comment.auteurNom}
          </span>
          <span className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>{dateStr}</span>
          {mode === "view" && (
            <div className="flex items-center gap-2 ml-auto">
              {isOwn ? (
                <>
                  <button onClick={() => setMode("edit")} className="text-[11px] transition-opacity hover:opacity-70" style={{ color: "var(--text-tertiary)" }}>Modifier</button>
                  <button onClick={() => setMode("delete")} className="text-[11px] transition-opacity hover:opacity-70" style={{ color: "var(--red-text)" }}>Supprimer</button>
                </>
              ) : (
                <ReportButton type="comment" targetId={comment.id} />
              )}
            </div>
          )}
        </div>

        {mode === "edit" ? (
          <div className="space-y-2">
            <textarea
              value={contenu}
              onChange={(e) => setContenu(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 rounded-xl text-[13px] outline-none resize-none"
              style={{ background: "var(--bg-secondary)", border: "1.5px solid var(--green)", color: "var(--text-primary)" }}
            />
            {erreur && <p className="text-[11px]" style={{ color: "var(--red-text)" }}>{erreur}</p>}
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-3 py-1 rounded-lg text-[12px] font-semibold text-white disabled:opacity-50"
                style={{ background: "var(--green)" }}
              >
                {loading ? "…" : "Sauvegarder"}
              </button>
              <button
                onClick={() => { setMode("view"); setContenu(displayed); }}
                className="px-3 py-1 rounded-lg text-[12px] transition-opacity hover:opacity-70"
                style={{ color: "var(--text-tertiary)" }}
              >
                Annuler
              </button>
            </div>
          </div>
        ) : mode === "delete" ? (
          <div className="flex items-center gap-3">
            <p className="text-[12px]" style={{ color: "var(--text-secondary)" }}>Supprimer ce commentaire ?</p>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="px-2.5 py-1 rounded-lg text-[12px] font-semibold text-white disabled:opacity-50"
              style={{ background: "var(--red-text)" }}
            >
              {loading ? "…" : "Confirmer"}
            </button>
            <button
              onClick={() => setMode("view")}
              className="text-[12px] transition-opacity hover:opacity-70"
              style={{ color: "var(--text-tertiary)" }}
            >
              Annuler
            </button>
          </div>
        ) : (
          <p className="text-[13px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            {displayed}
          </p>
        )}
      </div>
    </div>
  );
}

export function CommentSection({ postId, initial }: { postId: string; initial: Comment[] }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [comments, setComments] = useState<Comment[]>(initial);
  const [contenu, setContenu] = useState("");
  const [erreur, setErreur] = useState("");
  const [loading, setLoading] = useState(false);

  const currentUserId = session?.user?.id;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErreur("");
    setLoading(true);
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contenu }),
      });
      const data = await res.json();
      if (!res.ok) { setErreur(data.error ?? "Une erreur est survenue."); return; }
      setComments((prev) => [...prev, { ...data, auteurId: data.auteurId ?? null }]);
      setContenu("");
    } catch {
      setErreur("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  }

  const visibleComments = comments;

  return (
    <div
      className="rounded-xl p-6"
      style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
    >
      <h2 className="text-[14px] font-bold mb-4" style={{ color: "var(--text-primary)" }}>
        {visibleComments.length} {visibleComments.length === 1 ? "réponse" : "réponses"}
      </h2>

      {visibleComments.length > 0 && (
        <div className="space-y-4 mb-6">
          {visibleComments.map((c) => (
            <CommentItem key={c.id} comment={c} currentUserId={currentUserId} />
          ))}
        </div>
      )}

      {session ? (
        <form
          onSubmit={handleSubmit}
          className="space-y-3"
          style={visibleComments.length > 0 ? { borderTop: "0.5px solid var(--border)", paddingTop: "1.25rem" } : undefined}
        >
          <textarea
            value={contenu}
            onChange={(e) => setContenu(e.target.value)}
            placeholder="Écrivez votre réponse…"
            required
            minLength={2}
            rows={3}
            className="w-full px-3.5 py-2.5 rounded-xl text-[13px] outline-none transition-all resize-none"
            style={{
              background: "var(--bg-secondary)",
              border: "1.5px solid var(--border)",
              color: "var(--text-primary)",
            }}
            onFocus={(e) => (e.target.style.borderColor = "var(--green)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
          />
          {erreur && (
            <p className="text-[12px] px-3 py-2 rounded-lg" style={{ background: "var(--red-bg)", color: "var(--red-text)" }}>
              {erreur}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded-lg text-[13px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ background: "var(--green)" }}
          >
            {loading ? "Envoi…" : "Répondre"}
          </button>
        </form>
      ) : (
        <p className="text-[12px]" style={{ color: "var(--text-tertiary)" }}>
          <Link href={`/auth/connexion?callbackUrl=${encodeURIComponent(pathname)}`} className="font-medium underline" style={{ color: "var(--green)" }}>
            Connectez-vous
          </Link>{" "}
          pour participer à la discussion.
        </p>
      )}
    </div>
  );
}
