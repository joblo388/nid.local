"use client";

import { useState, useEffect } from "react";
import { villes } from "@/lib/data";
import { useToast } from "./Toast";

type ProStats = {
  nbVotes: number;
  nbVues: number;
  nbCommentaires: number;
  creeLe: string;
};

function ProStatsDashboard() {
  const [stats, setStats] = useState<ProStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/repertoire/stats")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => { if (data && !data.error) setStats(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="rounded-xl p-5 mt-4" style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}>
        <p className="text-[12px] text-center" style={{ color: "var(--text-tertiary)" }}>Chargement des statistiques...</p>
      </div>
    );
  }

  if (!stats) return null;

  function formatDate(iso: string) {
    const d = new Date(iso);
    return d.toLocaleDateString("fr-CA", { year: "numeric", month: "long", day: "numeric" });
  }

  const cards = [
    { value: stats.nbVotes, label: "Votes recus" },
    { value: stats.nbVues, label: "Vues du profil" },
    { value: stats.nbCommentaires, label: "Commentaires" },
    { value: formatDate(stats.creeLe), label: "Membre depuis" },
  ];

  return (
    <div className="mt-4">
      <h4 className="text-[13px] font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
        Statistiques de mon profil
      </h4>
      <div className="grid grid-cols-2 gap-3">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-lg p-[14px]"
            style={{ background: "var(--bg-secondary)" }}
          >
            <div
              style={{
                fontSize: typeof card.value === "number" ? "22px" : "14px",
                fontWeight: 700,
                color: "var(--green)",
                lineHeight: "1.2",
              }}
            >
              {card.value}
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-tertiary)", marginTop: "4px" }}>
              {card.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const SPECIALITES = [
  { value: "courtier", label: "Courtier immobilier" },
  { value: "notaire", label: "Notaire" },
  { value: "finance", label: "Finance / Hypothèque" },
  { value: "entrepreneur", label: "Entrepreneur général" },
  { value: "electricien", label: "Électricien" },
  { value: "plombier", label: "Plombier" },
  { value: "charpentier", label: "Charpentier" },
  { value: "inspecteur", label: "Inspecteur en bâtiment" },
  { value: "architecte", label: "Architecte" },
  { value: "designer", label: "Designer d'intérieur" },
  { value: "demenagement", label: "Déménagement" },
  { value: "nettoyage", label: "Nettoyage" },
  { value: "autre", label: "Autre" },
];

type ProData = {
  nomEntreprise: string;
  specialite: string;
  description: string;
  telephone: string;
  courriel: string;
  siteWeb: string;
  villeSlug: string;
};

export function ProProfileForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [form, setForm] = useState<ProData>({
    nomEntreprise: "",
    specialite: "courtier",
    description: "",
    telephone: "",
    courriel: "",
    siteWeb: "",
    villeSlug: "montreal",
  });

  useEffect(() => {
    fetch("/api/repertoire?own=1")
      .then((r) => r.json())
      .then((data) => {
        if (data.profile) {
          setHasProfile(true);
          setForm({
            nomEntreprise: data.profile.nomEntreprise ?? "",
            specialite: data.profile.specialite ?? "courtier",
            description: data.profile.description ?? "",
            telephone: data.profile.telephone ?? "",
            courriel: data.profile.courriel ?? "",
            siteWeb: data.profile.siteWeb ?? "",
            villeSlug: data.profile.villeSlug ?? "montreal",
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function setField(key: keyof ProData, val: string) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/repertoire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setHasProfile(true);
        toast({ message: hasProfile ? "Profil pro mis à jour." : "Profil pro créé!", type: "success" });
      } else {
        const data = await res.json();
        toast({ message: data.error ?? "Erreur", type: "error" });
      }
    } catch {
      toast({ message: "Erreur réseau", type: "error" });
    }
    setSaving(false);
  }

  if (loading) {
    return <div className="rounded-xl p-8 text-center" style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}>
      <p className="text-[13px]" style={{ color: "var(--text-tertiary)" }}>Chargement...</p>
    </div>;
  }

  return (
    <div className="rounded-xl p-5" style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}>
      <h3 className="text-[14px] font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
        {hasProfile ? "Modifier mon profil professionnel" : "Créer mon profil professionnel"}
      </h3>
      <p className="text-[12px] mb-4" style={{ color: "var(--text-tertiary)" }}>
        Votre fiche sera visible dans le répertoire des professionnels.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[12px] font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Nom de l&apos;entreprise</label>
          <input
            type="text" required value={form.nomEntreprise} onChange={(e) => setField("nomEntreprise", e.target.value)}
            className="w-full px-3 py-2 text-[13px] rounded-lg"
            style={{ background: "var(--bg-secondary)", color: "var(--text-primary)", border: "0.5px solid var(--border)" }}
            placeholder="Ex: Immobilier Carrier inc."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[12px] font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Spécialité</label>
            <select
              value={form.specialite} onChange={(e) => setField("specialite", e.target.value)}
              className="w-full px-3 py-2 text-[13px] rounded-lg"
              style={{ background: "var(--bg-secondary)", color: "var(--text-primary)", border: "0.5px solid var(--border)" }}
            >
              {SPECIALITES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[12px] font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Ville</label>
            <select
              value={form.villeSlug} onChange={(e) => setField("villeSlug", e.target.value)}
              className="w-full px-3 py-2 text-[13px] rounded-lg"
              style={{ background: "var(--bg-secondary)", color: "var(--text-primary)", border: "0.5px solid var(--border)" }}
            >
              {villes.map((v) => <option key={v.slug} value={v.slug}>{v.nom}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[12px] font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Description</label>
          <textarea
            required value={form.description} onChange={(e) => setField("description", e.target.value)}
            rows={3}
            className="w-full px-3 py-2 text-[13px] rounded-lg"
            style={{ background: "var(--bg-secondary)", color: "var(--text-primary)", border: "0.5px solid var(--border)" }}
            placeholder="Décrivez vos services en quelques lignes..."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[12px] font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Téléphone</label>
            <input
              type="tel" value={form.telephone} onChange={(e) => setField("telephone", e.target.value)}
              className="w-full px-3 py-2 text-[13px] rounded-lg"
              style={{ background: "var(--bg-secondary)", color: "var(--text-primary)", border: "0.5px solid var(--border)" }}
              placeholder="514 555-1234"
            />
          </div>
          <div>
            <label className="block text-[12px] font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Courriel</label>
            <input
              type="email" value={form.courriel} onChange={(e) => setField("courriel", e.target.value)}
              className="w-full px-3 py-2 text-[13px] rounded-lg"
              style={{ background: "var(--bg-secondary)", color: "var(--text-primary)", border: "0.5px solid var(--border)" }}
              placeholder="info@entreprise.com"
            />
          </div>
          <div>
            <label className="block text-[12px] font-medium mb-1" style={{ color: "var(--text-secondary)" }}>Site web</label>
            <input
              type="url" value={form.siteWeb} onChange={(e) => setField("siteWeb", e.target.value)}
              className="w-full px-3 py-2 text-[13px] rounded-lg"
              style={{ background: "var(--bg-secondary)", color: "var(--text-primary)", border: "0.5px solid var(--border)" }}
              placeholder="https://..."
            />
          </div>
        </div>

        <button
          type="submit" disabled={saving}
          className="px-4 py-2 text-[13px] font-semibold text-white rounded-lg transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{ background: "var(--green)" }}
        >
          {saving ? "Enregistrement..." : hasProfile ? "Mettre à jour" : "Créer mon profil"}
        </button>
      </form>

      {hasProfile && <ProStatsDashboard />}
    </div>
  );
}
