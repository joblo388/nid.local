"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { villes, quartiersDeVille } from "@/lib/data";

const CATEGORIES = [
  { value: "question", label: "Question" },
  { value: "vente", label: "Vente" },
  { value: "location", label: "Location" },
  { value: "renovation", label: "Conseil / Rénovation" },
  { value: "voisinage", label: "Voisinage" },
  { value: "alerte", label: "Alerte" },
];

export function NouveauPostForm() {
  const router = useRouter();
  const [titre, setTitre] = useState("");
  const [contenu, setContenu] = useState("");
  const [villeSlug, setVilleSlug] = useState("montreal");
  const [quartierSlug, setQuartierSlug] = useState("");
  const [categorie, setCategorie] = useState("question");
  const [erreur, setErreur] = useState("");
  const [loading, setLoading] = useState(false);

  const quartiersDispo = quartiersDeVille(villeSlug);

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

    setLoading(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titre, contenu, villeSlug, quartierSlug, categorie }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErreur(data.error ?? "Une erreur est survenue.");
        return;
      }
      router.push(`/post/${data.id}`);
    } catch {
      setErreur("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
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
          style={{
            background: "var(--bg-secondary)",
            border: "1.5px solid var(--border)",
            color: "var(--text-primary)",
          }}
          onFocus={(e) => (e.target.style.borderColor = "var(--green)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
        />
      </div>

      {/* Contenu */}
      <div>
        <label className="block text-[12px] font-semibold mb-1.5" style={{ color: "var(--text-secondary)" }}>
          Description
        </label>
        <textarea
          value={contenu}
          onChange={(e) => setContenu(e.target.value)}
          placeholder="Décrivez votre question, annonce ou situation en détail…"
          required
          minLength={20}
          rows={6}
          className="w-full px-3.5 py-2.5 rounded-xl text-[14px] outline-none transition-all resize-none"
          style={{
            background: "var(--bg-secondary)",
            border: "1.5px solid var(--border)",
            color: "var(--text-primary)",
          }}
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
            style={{
              background: "var(--bg-secondary)",
              border: "1.5px solid var(--border)",
              color: "var(--text-primary)",
            }}
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
            style={{
              background: "var(--bg-secondary)",
              border: "1.5px solid var(--border)",
              color: "var(--text-primary)",
            }}
          >
            <option value="">— Choisir —</option>
            {quartiersDispo.map((q) => (
              <option key={q.slug} value={q.slug}>{q.nom}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Erreur */}
      {erreur && (
        <p className="text-[13px] px-3 py-2.5 rounded-lg" style={{ background: "var(--red-bg)", color: "var(--red-text)" }}>
          {erreur}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-xl text-[14px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        style={{ background: "var(--green)" }}
      >
        {loading ? "Publication en cours…" : "Publier la discussion"}
      </button>
    </form>
  );
}
