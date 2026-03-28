"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { villes, quartiersDeVille } from "@/lib/data";
import { MarkdownToolbar } from "@/components/MarkdownToolbar";

const DRAFT_KEY = "nid_nouveau_post_draft";

const CATEGORIES = [
  { value: "question", label: "Question" },
  { value: "vente", label: "Vente" },
  { value: "location", label: "Location" },
  { value: "renovation", label: "Conseil / Rénovation" },
  { value: "voisinage", label: "Voisinage" },
  { value: "construction", label: "Construction" },
  { value: "legal", label: "Légal" },
  { value: "financement", label: "Financement" },
  { value: "copropriete", label: "Co-propriété" },
];

export function NouveauPostForm() {
  const router = useRouter();
  const [titre, setTitre] = useState("");
  const [contenu, setContenu] = useState("");
  const [villeSlug, setVilleSlug] = useState("montreal");
  const [quartierSlug, setQuartierSlug] = useState("");
  const [categorie, setCategorie] = useState("question");
  const [hp, setHp] = useState(""); // honeypot
  const [imageData, setImageData] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [erreur, setErreur] = useState("");
  const [loading, setLoading] = useState(false);
  const [draftRestored, setDraftRestored] = useState(false);
  const [showPoll, setShowPoll] = useState(false);
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const fileRef = useRef<HTMLInputElement>(null);
  const contenuRef = useRef<HTMLTextAreaElement>(null);

  const quartiersDispo = quartiersDeVille(villeSlug);

  // Restore draft on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) {
        const draft = JSON.parse(saved);
        if (draft.titre || draft.contenu) {
          setTitre(draft.titre ?? "");
          setContenu(draft.contenu ?? "");
          if (draft.villeSlug) setVilleSlug(draft.villeSlug);
          if (draft.quartierSlug) setQuartierSlug(draft.quartierSlug);
          if (draft.categorie) setCategorie(draft.categorie);
          setDraftRestored(true);
        }
      }
    } catch { /* ignore */ }
  }, []);

  // Auto-save draft on change
  useEffect(() => {
    if (!titre && !contenu) return;
    const t = setTimeout(() => {
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify({ titre, contenu, villeSlug, quartierSlug, categorie }));
      } catch { /* ignore */ }
    }, 800);
    return () => clearTimeout(t);
  }, [titre, contenu, villeSlug, quartierSlug, categorie]);

  function clearDraft() {
    try { localStorage.removeItem(DRAFT_KEY); } catch { /* ignore */ }
  }

  function handleImageFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2_000_000) {
      setErreur("L'image doit faire moins de 2 MB.");
      return;
    }
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

  function handleVilleChange(slug: string) {
    setVilleSlug(slug);
    setQuartierSlug("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErreur("");

    if (!quartierSlug) {
      setErreur("Veuillez sélectionner un quartier.");
      return;
    }

    // Validate poll options if poll is active
    if (showPoll) {
      const filledOptions = pollOptions.filter((o) => o.trim());
      if (filledOptions.length < 2) {
        setErreur("Le sondage doit avoir au moins 2 options.");
        return;
      }
    }

    setLoading(true);
    try {
      const payload: Record<string, unknown> = { titre, contenu, villeSlug, quartierSlug, categorie, imageUrl: imageData, _hp: hp };
      if (showPoll) {
        const filledOptions = pollOptions.filter((o) => o.trim()).map((o) => o.trim());
        if (filledOptions.length >= 2) {
          payload.poll = { options: filledOptions };
        }
      }
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setErreur(data.error ?? "Une erreur est survenue.");
        return;
      }
      clearDraft();
      router.push(`/post/${data.id}`);
    } catch {
      setErreur("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Draft restored banner */}
      {draftRestored && (
        <div
          className="flex items-center justify-between px-3 py-2 rounded-lg text-[12px]"
          style={{ background: "var(--amber-bg)", color: "var(--amber-text)" }}
        >
          <span>Brouillon restauré automatiquement.</span>
          <button
            type="button"
            onClick={() => { setTitre(""); setContenu(""); clearDraft(); setDraftRestored(false); }}
            className="underline hover:no-underline"
          >
            Effacer
          </button>
        </div>
      )}

      {/* Catégorie */}
      <div>
        <label className="block text-[12px] font-semibold mb-2" style={{ color: "var(--text-secondary)" }}>
          Catégorie
        </label>
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
      </div>

      {/* Titre */}
      <div>
        <label className="block text-[12px] font-semibold mb-1.5" style={{ color: "var(--text-secondary)" }}>
          Titre
        </label>
        <input
          type="text"
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
          placeholder="Ex: Recommandations entrepreneur Rosemont?"
          required
          minLength={5}
          maxLength={200}
          className="w-full px-3.5 py-2.5 rounded-xl text-[14px] outline-none transition-all"
          style={{ background: "var(--bg-secondary)", border: "1.5px solid var(--border)", color: "var(--text-primary)" }}
          onFocus={(e) => (e.target.style.borderColor = "var(--green)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
        />
      </div>

      {/* Contenu */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-[12px] font-semibold" style={{ color: "var(--text-secondary)" }}>
            Description
          </label>
          <MarkdownToolbar textareaRef={contenuRef} onChange={setContenu} />
        </div>
        <textarea
          ref={contenuRef}
          value={contenu}
          onChange={(e) => setContenu(e.target.value)}
          placeholder="Décrivez votre question, annonce ou situation en détail…"
          required
          minLength={20}
          rows={6}
          className="w-full px-3.5 py-2.5 rounded-xl text-[14px] outline-none transition-all resize-none"
          style={{ background: "var(--bg-secondary)", border: "1.5px solid var(--border)", color: "var(--text-primary)" }}
          onFocus={(e) => (e.target.style.borderColor = "var(--green)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
        />
      </div>

      {/* Localisation */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[12px] font-semibold mb-1.5" style={{ color: "var(--text-secondary)" }}>
            Ville
          </label>
          <select
            value={villeSlug}
            onChange={(e) => handleVilleChange(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl text-[13px] outline-none"
            style={{ background: "var(--bg-secondary)", border: "1.5px solid var(--border)", color: "var(--text-primary)" }}
          >
            {villes.map((v) => (
              <option key={v.slug} value={v.slug}>{v.nom}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[12px] font-semibold mb-1.5" style={{ color: "var(--text-secondary)" }}>
            Quartier
          </label>
          <select
            value={quartierSlug}
            onChange={(e) => setQuartierSlug(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl text-[13px] outline-none"
            style={{ background: "var(--bg-secondary)", border: "1.5px solid var(--border)", color: "var(--text-primary)" }}
          >
            <option value="">— Choisir —</option>
            {quartiersDispo.map((q) => (
              <option key={q.slug} value={q.slug}>{q.nom}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Image */}
      <div>
        <label className="block text-[12px] font-semibold mb-1.5" style={{ color: "var(--text-secondary)" }}>
          Image <span className="font-normal" style={{ color: "var(--text-tertiary)" }}>(optionnel · max 2 MB)</span>
        </label>
        {imagePreview ? (
          <div className="relative rounded-xl overflow-hidden" style={{ border: "0.5px solid var(--border)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imagePreview} alt="Aperçu" className="w-full object-cover" style={{ maxHeight: "240px" }} />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 px-2.5 py-1 rounded-lg text-[12px] font-medium"
              style={{ background: "var(--red-bg)", color: "var(--red-text)" }}
            >
              Supprimer
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-[13px] transition-opacity hover:opacity-80"
            style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)", border: "0.5px solid var(--border)" }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Ajouter une photo
          </button>
        )}
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageFile} />
      </div>

      {/* Sondage */}
      <div>
        <button
          type="button"
          onClick={() => {
            setShowPoll(!showPoll);
            if (!showPoll) setPollOptions(["", ""]);
          }}
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-[13px] transition-opacity hover:opacity-80"
          style={{
            background: showPoll ? "var(--green-light-bg)" : "var(--bg-secondary)",
            color: showPoll ? "var(--green-text)" : "var(--text-secondary)",
            border: showPoll ? "1.5px solid var(--green)" : "0.5px solid var(--border)",
          }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          {showPoll ? "Retirer le sondage" : "Ajouter un sondage"}
        </button>

        {showPoll && (
          <div className="mt-3 space-y-2">
            <label className="block text-[12px] font-semibold" style={{ color: "var(--text-secondary)" }}>
              Options du sondage <span className="font-normal" style={{ color: "var(--text-tertiary)" }}>(2 à 5 options)</span>
            </label>
            {pollOptions.map((opt, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={opt}
                  onChange={(e) => {
                    const next = [...pollOptions];
                    next[idx] = e.target.value;
                    setPollOptions(next);
                  }}
                  placeholder={`Option ${idx + 1}`}
                  maxLength={100}
                  className="flex-1 px-3 py-2 rounded-lg text-[13px] outline-none transition-all"
                  style={{ background: "var(--bg-secondary)", border: "1.5px solid var(--border)", color: "var(--text-primary)" }}
                  onFocus={(e) => (e.target.style.borderColor = "var(--green)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                />
                {pollOptions.length > 2 && (
                  <button
                    type="button"
                    onClick={() => setPollOptions(pollOptions.filter((_, i) => i !== idx))}
                    className="p-1.5 rounded-lg transition-opacity hover:opacity-70"
                    style={{ color: "var(--text-tertiary)" }}
                    title="Supprimer cette option"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
            {pollOptions.length < 5 && (
              <button
                type="button"
                onClick={() => setPollOptions([...pollOptions, ""])}
                className="flex items-center gap-1.5 text-[12px] font-medium transition-opacity hover:opacity-70 mt-1"
                style={{ color: "var(--green)" }}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Ajouter une option
              </button>
            )}
          </div>
        )}
      </div>

      {/* Honeypot */}
      <div style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0, overflow: "hidden" }} aria-hidden="true" tabIndex={-1}>
        <input type="text" name="company" value={hp} onChange={(e) => setHp(e.target.value)} autoComplete="off" tabIndex={-1} />
      </div>

      {erreur && (
        <p className="text-[13px] px-3 py-2.5 rounded-lg" style={{ background: "var(--red-bg)", color: "var(--red-text)" }}>
          {erreur}
        </p>
      )}

      <button
        type="submit"
        disabled={loading || imageUploading}
        className="w-full py-3 rounded-xl text-[14px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        style={{ background: "var(--green)" }}
      >
        {imageUploading ? "Téléversement de l'image…" : loading ? "Publication en cours…" : "Publier la discussion"}
      </button>
    </form>
  );
}
