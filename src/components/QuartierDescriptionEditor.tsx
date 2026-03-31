"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Props {
  slug: string;
  quartierNom: string;
  defaultDescription: string[];
  defaultTags: string[];
}

export function QuartierDescriptionEditor({ slug, quartierNom, defaultDescription, defaultTags }: Props) {
  const { data: session } = useSession();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [paragraphs, setParagraphs] = useState<string[]>(defaultDescription);
  const [tags, setTags] = useState<string[]>(defaultTags);
  const [newTag, setNewTag] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [lastEditor, setLastEditor] = useState<string | null>(null);
  const [lastEdit, setLastEdit] = useState<string | null>(null);

  // Load user-edited version from DB if exists
  useEffect(() => {
    fetch(`/api/quartier-description?slug=${slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data && data.contenu) {
          try {
            const parsed = JSON.parse(data.contenu);
            if (Array.isArray(parsed) && parsed.length > 0) setParagraphs(parsed);
          } catch { /* use default */ }
          if (data.tags) {
            try {
              const parsedTags = JSON.parse(data.tags);
              if (Array.isArray(parsedTags)) setTags(parsedTags);
            } catch { /* use default */ }
          }
          setLastEditor(data.editeurNom);
          setLastEdit(data.modifieLe);
        }
      })
      .catch(() => {});
  }, [slug]);

  async function handleSave() {
    if (!session) {
      router.push(`/auth/connexion?callbackUrl=/quartier/${slug}`);
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/quartier-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, contenu: paragraphs, tags }),
      });
      if (res.ok) {
        setSaved(true);
        setEditing(false);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch { /* ignore */ }
    setSaving(false);
  }

  function addTag() {
    const t = newTag.trim();
    if (t && !tags.includes(t)) {
      setTags([...tags, t]);
      setNewTag("");
    }
  }

  function removeTag(tag: string) {
    setTags(tags.filter((t) => t !== tag));
  }

  function updateParagraph(index: number, value: string) {
    const updated = [...paragraphs];
    updated[index] = value;
    setParagraphs(updated);
  }

  function addParagraph() {
    setParagraphs([...paragraphs, ""]);
  }

  function removeParagraph(index: number) {
    if (paragraphs.length <= 1) return;
    setParagraphs(paragraphs.filter((_, i) => i !== index));
  }

  // View mode
  if (!editing) {
    return (
      <div
        className="rounded-xl p-4"
        style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[14px] font-bold" style={{ color: "var(--text-primary)" }}>
            À propos de {quartierNom}
          </h2>
          {saved && (
            <span className="text-[11px] font-medium" style={{ color: "var(--green-text)" }}>
              Sauvegardé
            </span>
          )}
        </div>
        {paragraphs.length > 0 ? (
          <div className="space-y-2.5">
            {paragraphs.map((p, i) => (
              <p key={i} className="text-[13px] leading-[1.6]" style={{ color: "var(--text-secondary)" }}>
                {p}
              </p>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth={1.5} style={{ margin: "0 auto 8px" }}>
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            <p className="text-[13px] mb-1" style={{ color: "var(--text-secondary)" }}>
              Aucune description pour ce quartier
            </p>
            <p className="text-[12px]" style={{ color: "var(--text-tertiary)" }}>
              Vous connaissez {quartierNom}? Partagez vos connaissances avec la communauté!
            </p>
          </div>
        )}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] px-2 py-0.5 rounded-full"
              style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)", border: "0.5px solid var(--border)" }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Edit button + last editor info */}
        <div className="flex items-center justify-between mt-4 pt-3" style={{ borderTop: "0.5px solid var(--border)" }}>
          <div>
            {lastEditor && lastEdit && (
              <p className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
                Modifié par {lastEditor} le {new Date(lastEdit).toLocaleDateString("fr-CA", { day: "numeric", month: "short", year: "numeric" })}
              </p>
            )}
          </div>
          <button
            onClick={() => {
              if (!session) {
                router.push(`/auth/connexion?callbackUrl=/quartier/${slug}`);
                return;
              }
              setEditing(true);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors"
            style={{ background: "var(--bg-secondary)", border: "0.5px solid var(--border)", color: "var(--text-secondary)" }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path d="M8.5 1.5l2 2L4 10H2v-2L8.5 1.5z" />
            </svg>
            {paragraphs.length > 0 ? "Modifier la description" : "Ajouter une description"}
          </button>
        </div>
      </div>
    );
  }

  // Edit mode
  return (
    <div
      className="rounded-xl p-4"
      style={{ background: "var(--bg-card)", border: "0.5px solid var(--green)" }}
    >
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[14px] font-bold" style={{ color: "var(--text-primary)" }}>
          Modifier la description de {quartierNom}
        </h2>
        <button
          onClick={() => setEditing(false)}
          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-tertiary)", fontSize: 16 }}
        >
          x
        </button>
      </div>

      <p className="text-[11px] mb-3" style={{ color: "var(--text-tertiary)" }}>
        Partagez vos connaissances du quartier avec la communauté. Les modifications sont visibles par tous.
      </p>

      {/* Paragraphs */}
      <div className="space-y-2 mb-3">
        {paragraphs.map((p, i) => (
          <div key={i} className="flex gap-2">
            <textarea
              value={p}
              onChange={(e) => updateParagraph(i, e.target.value)}
              rows={3}
              className="flex-1 text-[13px] leading-[1.6] px-3 py-2 rounded-lg"
              style={{
                background: "var(--bg-secondary)",
                border: "0.5px solid var(--border)",
                color: "var(--text-primary)",
                outline: "none",
                resize: "vertical",
                fontFamily: "inherit",
              }}
            />
            {paragraphs.length > 1 && (
              <button
                onClick={() => removeParagraph(i)}
                className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "var(--red-bg)", color: "var(--red-text)", border: "none", cursor: "pointer", fontSize: 14 }}
              >
                x
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={addParagraph}
        className="text-[12px] font-medium mb-4"
        style={{ background: "none", border: "none", cursor: "pointer", color: "var(--green)", padding: 0 }}
      >
        + Ajouter un paragraphe
      </button>

      {/* Tags */}
      <div className="mb-4">
        <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-tertiary)" }}>
          Tags
        </p>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] px-2 py-0.5 rounded-full inline-flex items-center gap-1"
              style={{ background: "var(--green-light-bg)", color: "var(--green-text)", border: "0.5px solid var(--green)" }}
            >
              {tag}
              <button
                onClick={() => removeTag(tag)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--green-text)", fontSize: 12, lineHeight: 1, padding: 0 }}
              >
                x
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
            placeholder="Ajouter un tag..."
            className="flex-1 text-[12px] px-3 py-1.5 rounded-lg"
            style={{
              background: "var(--bg-secondary)",
              border: "0.5px solid var(--border)",
              color: "var(--text-primary)",
              outline: "none",
              fontFamily: "inherit",
            }}
          />
          <button
            onClick={addTag}
            className="text-[12px] px-3 py-1.5 rounded-lg"
            style={{ background: "var(--bg-secondary)", border: "0.5px solid var(--border)", color: "var(--text-secondary)", cursor: "pointer" }}
          >
            Ajouter
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2">
        <button
          onClick={() => setEditing(false)}
          className="text-[13px] px-4 py-2 rounded-lg"
          style={{ background: "var(--bg-secondary)", border: "0.5px solid var(--border)", color: "var(--text-secondary)", cursor: "pointer", fontFamily: "inherit" }}
        >
          Annuler
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="text-[13px] font-semibold px-4 py-2 rounded-lg"
          style={{ background: "var(--green)", color: "#fff", border: "none", cursor: "pointer", fontFamily: "inherit", opacity: saving ? 0.7 : 1 }}
        >
          {saving ? "Sauvegarde..." : "Publier les modifications"}
        </button>
      </div>
    </div>
  );
}
