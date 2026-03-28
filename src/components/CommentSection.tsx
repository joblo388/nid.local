"use client";

import { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReportButton } from "./ReportButton";
import { MarkdownContent } from "./MarkdownContent";
import { MarkdownToolbar } from "./MarkdownToolbar";

type Comment = {
  id: string;
  contenu: string;
  imageUrl?: string | null;
  auteurNom: string;
  auteurId: string | null;
  creeLe: string;
  nbVotes: number;
  replies?: Comment[];
};

// ─── CommentVoteButton ──────────────────────────────────────────────────────

function CommentVoteButton({ commentId, initialVotes }: { commentId: string; initialVotes: number }) {
  const { data: session } = useSession();
  const [nbVotes, setNbVotes] = useState(initialVotes);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleVote(e: React.MouseEvent) {
    e.preventDefault();
    if (!session || loading) return;
    setLoading(true);
    setHasVoted(!hasVoted);
    setNbVotes((n) => n + (hasVoted ? -1 : 1));
    try {
      const res = await fetch(`/api/comments/${commentId}/vote`, { method: "POST" });
      const data = await res.json();
      if (res.ok) { setHasVoted(data.hasVoted); setNbVotes(data.nbVotes); }
      else { setHasVoted(hasVoted); setNbVotes((n) => n + (hasVoted ? 1 : -1)); }
    } catch {
      setHasVoted(hasVoted);
      setNbVotes((n) => n + (hasVoted ? 1 : -1));
    } finally { setLoading(false); }
  }

  if (!session) return null;

  return (
    <button
      onClick={handleVote}
      className="flex items-center gap-1 text-[11px] transition-opacity hover:opacity-70"
      style={{ color: hasVoted ? "var(--green)" : "var(--text-tertiary)" }}
      title={hasVoted ? "Retirer mon vote" : "Voter"}
    >
      <svg className="w-3 h-3" fill={hasVoted ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
      </svg>
      {nbVotes > 0 && <span>{nbVotes}</span>}
    </button>
  );
}

// ─── ReplyForm ────────────────────────────────────────────────────────────────

function ReplyForm({ commentId, onReply, onCancel }: {
  commentId: string;
  onReply: (reply: Comment) => void;
  onCancel: () => void;
}) {
  const [contenu, setContenu] = useState("");
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErreur("");
    setLoading(true);
    try {
      const res = await fetch(`/api/comments/${commentId}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contenu }),
      });
      const data = await res.json();
      if (!res.ok) { setErreur(data.error ?? "Erreur"); return; }
      onReply({ ...data, replies: [] });
      setContenu("");
    } catch {
      setErreur("Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-2 space-y-2">
      <textarea
        value={contenu}
        onChange={(e) => setContenu(e.target.value)}
        placeholder="Écrire une réponse…"
        required
        minLength={2}
        rows={2}
        className="w-full px-3 py-2 rounded-xl text-[12px] outline-none resize-none"
        style={{
          background: "var(--bg-secondary)",
          border: "1.5px solid var(--green)",
          color: "var(--text-primary)",
        }}
      />
      {erreur && <p className="text-[11px]" style={{ color: "var(--red-text)" }}>{erreur}</p>}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="px-3 py-1 rounded-lg text-[12px] font-semibold text-white disabled:opacity-50"
          style={{ background: "var(--green)" }}
        >
          {loading ? "…" : "Répondre"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1 rounded-lg text-[12px] transition-opacity hover:opacity-70"
          style={{ color: "var(--text-tertiary)" }}
        >
          Annuler
        </button>
      </div>
    </form>
  );
}

// ─── CommentItem ─────────────────────────────────────────────────────────────

function CommentItem({
  comment,
  currentUserId,
  isReply = false,
}: {
  comment: Comment;
  currentUserId?: string;
  isReply?: boolean;
}) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mode, setMode] = useState<"view" | "edit" | "delete">("view");
  const [contenu, setContenu] = useState(comment.contenu);
  const [displayed, setDisplayed] = useState(comment.contenu);
  const [deleted, setDeleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState("");
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replies, setReplies] = useState<Comment[]>(comment.replies ?? []);

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
    } catch { setErreur("Une erreur est survenue."); }
    finally { setLoading(false); }
  }

  async function handleDelete() {
    setLoading(true);
    try {
      const res = await fetch(`/api/comments/${comment.id}`, { method: "DELETE" });
      if (res.ok) setDeleted(true);
    } catch { setLoading(false); }
  }

  if (deleted) return null;

  return (
    <div className={`flex gap-3 ${isReply ? "ml-9 mt-2" : ""}`}>
      <div
        className="w-6 h-6 rounded-full shrink-0 mt-0.5 flex items-center justify-center text-[10px] font-bold text-white"
        style={{ background: isReply ? "var(--text-tertiary)" : "var(--green)" }}
      >
        {comment.auteurNom.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="text-[12px] font-semibold" style={{ color: "var(--text-secondary)" }}>
            {comment.auteurNom}
          </span>
          <span className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>{dateStr}</span>
          {mode === "view" && (
            <div className="flex items-center gap-2 ml-auto">
              <CommentVoteButton commentId={comment.id} initialVotes={comment.nbVotes} />
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
              <button onClick={handleSave} disabled={loading} className="px-3 py-1 rounded-lg text-[12px] font-semibold text-white disabled:opacity-50" style={{ background: "var(--green)" }}>
                {loading ? "…" : "Sauvegarder"}
              </button>
              <button onClick={() => { setMode("view"); setContenu(displayed); }} className="px-3 py-1 rounded-lg text-[12px] transition-opacity hover:opacity-70" style={{ color: "var(--text-tertiary)" }}>
                Annuler
              </button>
            </div>
          </div>
        ) : mode === "delete" ? (
          <div className="flex items-center gap-3">
            <p className="text-[12px]" style={{ color: "var(--text-secondary)" }}>Supprimer ce commentaire ?</p>
            <button onClick={handleDelete} disabled={loading} className="px-2.5 py-1 rounded-lg text-[12px] font-semibold text-white disabled:opacity-50" style={{ background: "var(--red-text)" }}>
              {loading ? "…" : "Confirmer"}
            </button>
            <button onClick={() => setMode("view")} className="text-[12px] transition-opacity hover:opacity-70" style={{ color: "var(--text-tertiary)" }}>
              Annuler
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="text-[13px]">
              <MarkdownContent content={displayed} />
            </div>
            {comment.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={comment.imageUrl}
                alt=""
                className="rounded-lg object-cover"
                style={{ maxWidth: "100%", maxHeight: "300px", border: "0.5px solid var(--border)" }}
              />
            )}
            {/* Reply button */}
            <div>
              {session ? (
                <button
                  onClick={() => setShowReplyForm(!showReplyForm)}
                  className="text-[11px] transition-opacity hover:opacity-70"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  {showReplyForm ? "Annuler" : "↩ Répondre"}
                </button>
              ) : (
                <Link
                  href={`/auth/connexion?callbackUrl=${encodeURIComponent(pathname)}`}
                  className="text-[11px] transition-opacity hover:opacity-70"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  ↩ Répondre
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Reply form */}
        {showReplyForm && (
          <ReplyForm
            commentId={comment.id}
            onReply={(reply) => {
              setReplies((prev) => [...prev, reply]);
              setShowReplyForm(false);
            }}
            onCancel={() => setShowReplyForm(false)}
          />
        )}

        {/* Nested replies */}
        {replies.length > 0 && (
          <div className="mt-3 space-y-3 pl-0" style={{ borderLeft: "2px solid var(--border)", paddingLeft: "12px" }}>
            {replies.map((r) => (
              <CommentItem key={r.id} comment={r} currentUserId={currentUserId} isReply />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── CommentSection ──────────────────────────────────────────────────────────

export function CommentSection({ postId, initial }: { postId: string; initial: Comment[] }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [comments, setComments] = useState<Comment[]>(initial);
  const [contenu, setContenu] = useState("");
  const [imageData, setImageData] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [erreur, setErreur] = useState("");
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const contenuRef = useRef<HTMLTextAreaElement>(null);

  const currentUserId = session?.user?.id;

  function handleImageFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2_000_000) { setErreur("L'image doit faire moins de 2 MB."); return; }
    setImagePreview(URL.createObjectURL(file));
    setImageData(null);
    setImageUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("maxBytes", "2000000");
    fetch("/api/upload", { method: "POST", body: fd })
      .then((r) => r.json())
      .then((d) => {
        if (d.url) setImageData(d.url);
        else { setErreur(d.error ?? "Erreur lors du téléversement."); setImagePreview(null); }
      })
      .catch(() => { setErreur("Erreur lors du téléversement."); setImagePreview(null); })
      .finally(() => setImageUploading(false));
  }

  function removeImage() {
    setImagePreview(null);
    setImageData(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErreur("");
    setLoading(true);
    // Extract @mentions from content
    const mentions = [...new Set((contenu.match(/@([a-zA-Z0-9_]+)/g) ?? []).map((m) => m.slice(1)))];
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contenu, imageUrl: imageData, mentions }),
      });
      const data = await res.json();
      if (!res.ok) { setErreur(data.error ?? "Une erreur est survenue."); return; }
      setComments((prev) => [...prev, { ...data, auteurId: data.auteurId ?? null, nbVotes: 0, replies: [] }]);
      setContenu("");
      setImageData(null);
      setImagePreview(null);
      if (fileRef.current) fileRef.current.value = "";
    } catch {
      setErreur("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  }

  const totalCount = comments.reduce((sum, c) => sum + 1 + (c.replies?.length ?? 0), 0);

  return (
    <div
      className="rounded-xl p-6"
      style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
    >
      <h2 className="text-[14px] font-bold mb-4" style={{ color: "var(--text-primary)" }}>
        {totalCount} {totalCount === 1 ? "réponse" : "réponses"}
      </h2>

      {comments.length > 0 && (
        <div className="space-y-4 mb-6">
          {comments.map((c) => (
            <CommentItem key={c.id} comment={c} currentUserId={currentUserId} />
          ))}
        </div>
      )}

      {session ? (
        <form
          onSubmit={handleSubmit}
          className="space-y-3"
          style={comments.length > 0 ? { borderTop: "0.5px solid var(--border)", paddingTop: "1.25rem" } : undefined}
        >
          <div>
            <div className="flex justify-end mb-1">
              <MarkdownToolbar textareaRef={contenuRef} onChange={setContenu} />
            </div>
            <textarea
              ref={contenuRef}
              value={contenu}
              onChange={(e) => setContenu(e.target.value)}
              placeholder="Écrivez votre réponse… (utilisez @username pour mentionner)"
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
          </div>

          {imagePreview ? (
            <div className="relative inline-block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imagePreview} alt="Aperçu" className="rounded-lg object-cover"
                style={{ maxHeight: "160px", maxWidth: "100%", border: "0.5px solid var(--border)" }} />
              <button type="button" onClick={removeImage}
                className="absolute top-1.5 right-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium"
                style={{ background: "var(--red-bg)", color: "var(--red-text)" }}>
                ✕
              </button>
            </div>
          ) : (
            <button type="button" onClick={() => fileRef.current?.click()}
              className="flex items-center gap-1.5 text-[12px] transition-opacity hover:opacity-70"
              style={{ color: "var(--text-tertiary)" }}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Ajouter une image
            </button>
          )}
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageFile} />

          {erreur && (
            <p className="text-[12px] px-3 py-2 rounded-lg" style={{ background: "var(--red-bg)", color: "var(--red-text)" }}>
              {erreur}
            </p>
          )}
          <button type="submit" disabled={loading || imageUploading}
            className="px-4 py-2 rounded-lg text-[13px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ background: "var(--green)" }}>
            {imageUploading ? "Téléversement…" : loading ? "Envoi…" : "Répondre"}
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
