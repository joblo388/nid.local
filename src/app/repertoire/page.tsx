"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { villes } from "@/lib/data";
import { useToast } from "@/components/Toast";
import { Header } from "@/components/Header";
import Link from "next/link";
import Image from "next/image";

// ─── Speciality config ───────────────────────────────────────────────────────

const SPECIALITES = [
  { value: "courtier",      label: "Courtier immobilier" },
  { value: "notaire",       label: "Notaire" },
  { value: "finance",       label: "Finance / Hypothèque" },
  { value: "entrepreneur",  label: "Entrepreneur général" },
  { value: "electricien",   label: "Électricien" },
  { value: "plombier",      label: "Plombier" },
  { value: "charpentier",   label: "Charpentier" },
  { value: "inspecteur",    label: "Inspecteur en bâtiment" },
  { value: "architecte",    label: "Architecte" },
  { value: "designer",      label: "Designer d'intérieur" },
  { value: "demenagement",  label: "Déménagement" },
  { value: "nettoyage",     label: "Nettoyage" },
  { value: "autre",         label: "Autre" },
];

const specLabelMap: Record<string, string> = Object.fromEntries(SPECIALITES.map((s) => [s.value, s.label]));

const specBadgeBg: Record<string, string> = {
  courtier:     "var(--green-light-bg)",
  notaire:      "var(--blue-bg)",
  finance:      "var(--amber-bg)",
  entrepreneur: "var(--green-light-bg)",
  electricien:  "var(--amber-bg)",
  plombier:     "var(--blue-bg)",
  charpentier:  "var(--amber-bg)",
  inspecteur:   "var(--red-bg)",
  architecte:   "var(--blue-bg)",
  designer:     "#EEE9FB",
  demenagement: "var(--green-light-bg)",
  nettoyage:    "var(--bg-secondary)",
  autre:        "var(--bg-secondary)",
};

const specBadgeFg: Record<string, string> = {
  courtier:     "var(--green-text)",
  notaire:      "var(--blue-text)",
  finance:      "var(--amber-text)",
  entrepreneur: "var(--green-text)",
  electricien:  "var(--amber-text)",
  plombier:     "var(--blue-text)",
  charpentier:  "var(--amber-text)",
  inspecteur:   "var(--red-text)",
  architecte:   "var(--blue-text)",
  designer:     "#5B31B3",
  demenagement: "var(--green-text)",
  nettoyage:    "var(--text-secondary)",
  autre:        "var(--text-secondary)",
};

// Color palette for initials avatar
const AVATAR_COLORS = [
  "#D4742A", "#185FA5", "#854F0B", "#A32D2D", "#5B31B3",
  "#0F6E56", "#9333EA", "#0369A1", "#B45309", "#DC2626",
];

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function getInitials(name: string): string {
  return name
    .split(/[\s-]+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const villeNomMap: Record<string, string> = Object.fromEntries(villes.map((v) => [v.slug, v.nom]));

// ─── Types ──────────────────────────────────────────────────────────────────

type ProProfile = {
  id: string;
  userId: string;
  nomEntreprise: string;
  specialite: string;
  description: string;
  telephone: string | null;
  courriel: string | null;
  siteWeb: string | null;
  villeSlug: string;
  imageUrl: string | null;
  nbVotes: number;
  creeLe: string;
  username: string | null;
  userImage: string | null;
};

// ─── ProVoteButton ──────────────────────────────────────────────────────────

function ProVoteButton({
  profileId,
  initialVotes,
  initialHasVoted,
}: {
  profileId: string;
  initialVotes: number;
  initialHasVoted: boolean;
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const [nbVotes, setNbVotes] = useState(initialVotes);
  const [hasVoted, setHasVoted] = useState(initialHasVoted);
  const [loading, setLoading] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  async function handleVote(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!session) {
      router.push(`/auth/connexion?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }
    if (loading) return;
    setLoading(true);
    setHasVoted(!hasVoted);
    setNbVotes((n) => n + (hasVoted ? -1 : 1));
    try {
      const res = await fetch(`/api/repertoire/${profileId}/vote`, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setHasVoted(data.hasVoted);
        setNbVotes(data.nbVotes);
        const el = btnRef.current;
        if (el) {
          el.classList.remove("vote-pop");
          void el.offsetWidth;
          el.classList.add("vote-pop");
          el.addEventListener("animationend", () => el.classList.remove("vote-pop"), { once: true });
        }
      } else {
        setHasVoted(hasVoted);
        setNbVotes((n) => n + (hasVoted ? 1 : -1));
        toast({ message: data.error ?? "Erreur lors du vote.", type: "error" });
      }
    } catch {
      setHasVoted(hasVoted);
      setNbVotes((n) => n + (hasVoted ? 1 : -1));
      toast({ message: "Une erreur est survenue.", type: "error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      ref={btnRef}
      onClick={handleVote}
      className="flex items-center gap-1 rounded-lg px-2 py-1 transition-all text-[12px] font-semibold"
      style={{
        background: hasVoted ? "var(--green)" : "var(--bg-secondary)",
        color: hasVoted ? "#fff" : "var(--text-tertiary)",
        border: hasVoted ? "0.5px solid var(--green)" : "0.5px solid var(--border)",
      }}
      title={hasVoted ? "Retirer mon vote" : "Recommander ce professionnel"}
    >
      <svg className="w-3.5 h-3.5" fill={hasVoted ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
      </svg>
      <span className="tabular-nums">{nbVotes}</span>
    </button>
  );
}

// ─── ProCard ─────────────────────────────────────────────────────────────────

function ProCard({
  profile,
  hasVoted,
}: {
  profile: ProProfile;
  hasVoted: boolean;
}) {
  const hasImage = !!profile.imageUrl;
  const initials = getInitials(profile.nomEntreprise);
  const color = getAvatarColor(profile.nomEntreprise);

  return (
    <Link
      href={`/repertoire/${profile.id}`}
      className="rounded-xl overflow-hidden flex flex-col transition-shadow hover:shadow-md"
      style={{
        background: "var(--bg-card)",
        border: "0.5px solid var(--border)",
        textDecoration: "none",
        color: "inherit",
      }}
    >
      {/* Image / Avatar placeholder */}
      <div
        style={{
          width: "100%",
          aspectRatio: "1 / 1",
          position: "relative",
          overflow: "hidden",
          background: hasImage ? "var(--bg-secondary)" : color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {hasImage ? (
          <Image
            src={profile.imageUrl!}
            alt={profile.nomEntreprise}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
            style={{ objectFit: "cover" }}
          />
        ) : (
          <span
            style={{
              fontSize: "32px",
              fontWeight: 800,
              color: "#fff",
              opacity: 0.9,
              letterSpacing: "1px",
            }}
          >
            {initials}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1.5 p-3 flex-1">
        {/* Name */}
        <h3
          className="font-bold leading-tight"
          style={{ fontSize: "14px", color: "var(--text-primary)" }}
        >
          {profile.nomEntreprise}
        </h3>

        {/* Speciality badge + Ville */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span
            className="inline-flex items-center px-1.5 py-0.5 rounded-md font-medium leading-none"
            style={{
              fontSize: "10px",
              background: specBadgeBg[profile.specialite] ?? "var(--bg-secondary)",
              color: specBadgeFg[profile.specialite] ?? "var(--text-secondary)",
            }}
          >
            {specLabelMap[profile.specialite] ?? profile.specialite}
          </span>
          <span style={{ fontSize: "11px", color: "var(--text-tertiary)" }}>
            {villeNomMap[profile.villeSlug] ?? profile.villeSlug}
          </span>
        </div>

        {/* Description */}
        <p
          style={{
            fontSize: "12px",
            color: "var(--text-secondary)",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            lineHeight: "1.4",
          }}
        >
          {profile.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-2" style={{ borderTop: "0.5px solid var(--border)" }}>
          <ProVoteButton
            profileId={profile.id}
            initialVotes={profile.nbVotes}
            initialHasVoted={hasVoted}
          />
          <div className="flex items-center gap-2">
            {profile.telephone && (
              <a
                href={`tel:${profile.telephone}`}
                title={profile.telephone}
                style={{ color: "var(--text-tertiary)" }}
                className="hover:opacity-70 transition-opacity"
                onClick={(e) => e.stopPropagation()}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </a>
            )}
            {profile.courriel && (
              <a
                href={`mailto:${profile.courriel}`}
                title={profile.courriel}
                style={{ color: "var(--text-tertiary)" }}
                className="hover:opacity-70 transition-opacity"
                onClick={(e) => e.stopPropagation()}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
            )}
            {profile.siteWeb && (
              <a
                href={profile.siteWeb.startsWith("http") ? profile.siteWeb : `https://${profile.siteWeb}`}
                target="_blank"
                rel="noopener noreferrer"
                title={profile.siteWeb}
                style={{ color: "var(--text-tertiary)" }}
                className="hover:opacity-70 transition-opacity"
                onClick={(e) => e.stopPropagation()}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── Create Profile Form ─────────────────────────────────────────────────────

function CreateProfileForm({
  onCreated,
  onCancel,
}: {
  onCreated: () => void;
  onCancel: () => void;
}) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nomEntreprise: "",
    specialite: "",
    description: "",
    telephone: "",
    courriel: "",
    siteWeb: "",
    villeSlug: "montreal",
    imageUrl: "",
  });

  const fileRef = useRef<HTMLInputElement>(null);

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast({ message: "L'image ne doit pas dépasser 2 Mo.", type: "error" });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setForm((f) => ({ ...f, imageUrl: reader.result as string }));
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/repertoire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        toast({ message: "Profil professionnel créé avec succès!", type: "success" });
        onCreated();
      } else {
        toast({ message: data.error ?? "Erreur lors de la création.", type: "error" });
      }
    } catch {
      toast({ message: "Une erreur est survenue.", type: "error" });
    } finally {
      setLoading(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "8px 12px",
    fontSize: "13px",
    borderRadius: "8px",
    border: "0.5px solid var(--border)",
    background: "var(--bg-secondary)",
    color: "var(--text-primary)",
    outline: "none",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "12px",
    fontWeight: 600,
    color: "var(--text-secondary)",
    marginBottom: "4px",
    display: "block",
  };

  return (
    <div
      className="rounded-xl p-5"
      style={{
        background: "var(--bg-card)",
        border: "0.5px solid var(--border)",
        maxWidth: "600px",
        margin: "0 auto",
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>
          Créer mon profil professionnel
        </h2>
        <button
          onClick={onCancel}
          style={{ color: "var(--text-tertiary)", fontSize: "13px" }}
          className="hover:opacity-70"
        >
          Annuler
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <label style={labelStyle}>Nom de l&apos;entreprise *</label>
          <input
            style={inputStyle}
            value={form.nomEntreprise}
            onChange={(e) => setForm((f) => ({ ...f, nomEntreprise: e.target.value }))}
            placeholder="Ex: Plomberie Laval inc."
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label style={labelStyle}>Spécialité *</label>
            <select
              style={inputStyle}
              value={form.specialite}
              onChange={(e) => setForm((f) => ({ ...f, specialite: e.target.value }))}
              required
            >
              <option value="">Choisir...</option>
              {SPECIALITES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Ville *</label>
            <select
              style={inputStyle}
              value={form.villeSlug}
              onChange={(e) => setForm((f) => ({ ...f, villeSlug: e.target.value }))}
              required
            >
              {villes.map((v) => (
                <option key={v.slug} value={v.slug}>{v.nom}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label style={labelStyle}>Description *</label>
          <textarea
            style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }}
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="Décrivez vos services en quelques lignes..."
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label style={labelStyle}>Téléphone</label>
            <input
              style={inputStyle}
              value={form.telephone}
              onChange={(e) => setForm((f) => ({ ...f, telephone: e.target.value }))}
              placeholder="514-555-1234"
            />
          </div>
          <div>
            <label style={labelStyle}>Courriel</label>
            <input
              style={inputStyle}
              type="email"
              value={form.courriel}
              onChange={(e) => setForm((f) => ({ ...f, courriel: e.target.value }))}
              placeholder="info@exemple.com"
            />
          </div>
          <div>
            <label style={labelStyle}>Site web</label>
            <input
              style={inputStyle}
              value={form.siteWeb}
              onChange={(e) => setForm((f) => ({ ...f, siteWeb: e.target.value }))}
              placeholder="https://..."
            />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Photo / logo</label>
          <div className="flex items-center gap-3">
            {form.imageUrl && (
              <div className="w-12 h-12 rounded-lg overflow-hidden relative flex-shrink-0">
                <Image src={form.imageUrl} alt="Aperçu" fill style={{ objectFit: "cover" }} />
              </div>
            )}
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="rounded-lg px-3 py-1.5 text-[12px] font-medium"
              style={{
                background: "var(--bg-secondary)",
                color: "var(--text-secondary)",
                border: "0.5px solid var(--border)",
              }}
            >
              {form.imageUrl ? "Changer" : "Ajouter une image"}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg px-4 py-2.5 text-[13px] font-semibold mt-2"
          style={{
            background: "var(--green)",
            color: "#fff",
            opacity: loading ? 0.6 : 1,
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Création..." : "Créer mon profil"}
        </button>
      </form>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function RepertoirePage() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [profiles, setProfiles] = useState<ProProfile[]>([]);
  const [votedIds, setVotedIds] = useState<string[]>([]);
  const [hasProfile, setHasProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Filters
  const [specialite, setSpecialite] = useState("tous");
  const [villeSlug, setVilleSlug] = useState("tous");
  const [search, setSearch] = useState("");
  const [tri, setTri] = useState("votes");
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  const fetchProfiles = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (specialite !== "tous") params.set("specialite", specialite);
      if (villeSlug !== "tous") params.set("villeSlug", villeSlug);
      if (search.trim()) params.set("search", search.trim());
      params.set("tri", tri);

      const res = await fetch(`/api/repertoire?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setProfiles(data.profiles);
        setVotedIds(data.votedIds);
        setHasProfile(data.hasProfile);
      }
    } catch {
      toast({ message: "Erreur de chargement.", type: "error" });
    } finally {
      setLoading(false);
    }
  }, [specialite, villeSlug, search, tri, toast]);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  function handleSearchChange(value: string) {
    setSearch(value);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      // fetchProfiles will be triggered by the search state change via useEffect
    }, 300);
  }

  return (
    <>
    <Header />
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "20px 20px 100px" }}>
      <div className="mb-5">
        <h1
          style={{
            fontSize: "20px",
            fontWeight: 800,
            color: "var(--text-primary)",
            marginBottom: "4px",
          }}
        >
          Répertoire des professionnels
        </h1>
        <p style={{ fontSize: "13px", color: "var(--text-tertiary)", lineHeight: "1.5" }}>
          Trouvez un professionnel de confiance recommandé par la communauté. Courtiers, notaires, entrepreneurs, et plus encore.
        </p>
      </div>

      {/* CTA — Create profile */}
      {session && !hasProfile && !showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="rounded-xl px-4 py-2.5 text-[13px] font-semibold mb-5 flex items-center gap-2"
          style={{
            background: "var(--green)",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" strokeWidth={2} />
            <line x1="12" y1="8" x2="12" y2="16" strokeWidth={2} />
            <line x1="8" y1="12" x2="16" y2="12" strokeWidth={2} />
          </svg>
          Créer mon profil pro
        </button>
      )}

      {/* Inline form */}
      {showForm && (
        <div className="mb-5">
          <CreateProfileForm
            onCreated={() => {
              setShowForm(false);
              fetchProfiles();
            }}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {/* Filter bar */}
      <div
        className="rounded-xl p-3 mb-5 flex flex-wrap items-center gap-2"
        style={{
          background: "var(--bg-card)",
          border: "0.5px solid var(--border)",
        }}
      >
        <select
          value={specialite}
          onChange={(e) => setSpecialite(e.target.value)}
          className="rounded-lg px-2.5 py-1.5 text-[12px]"
          style={{
            background: "var(--bg-secondary)",
            color: "var(--text-secondary)",
            border: "0.5px solid var(--border)",
            outline: "none",
          }}
        >
          <option value="tous">Toutes les spécialités</option>
          {SPECIALITES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>

        <select
          value={villeSlug}
          onChange={(e) => setVilleSlug(e.target.value)}
          className="rounded-lg px-2.5 py-1.5 text-[12px]"
          style={{
            background: "var(--bg-secondary)",
            color: "var(--text-secondary)",
            border: "0.5px solid var(--border)",
            outline: "none",
          }}
        >
          <option value="tous">Toutes les villes</option>
          {villes.map((v) => (
            <option key={v.slug} value={v.slug}>{v.nom}</option>
          ))}
        </select>

        <input
          type="text"
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Rechercher..."
          className="rounded-lg px-2.5 py-1.5 text-[12px] flex-1 min-w-[140px]"
          style={{
            background: "var(--bg-secondary)",
            color: "var(--text-primary)",
            border: "0.5px solid var(--border)",
            outline: "none",
          }}
        />

        <div className="flex items-center gap-1 ml-auto">
          <button
            onClick={() => setTri("votes")}
            className="rounded-lg px-2.5 py-1.5 text-[11px] font-medium"
            style={{
              background: tri === "votes" ? "var(--green)" : "var(--bg-secondary)",
              color: tri === "votes" ? "#fff" : "var(--text-tertiary)",
              border: tri === "votes" ? "0.5px solid var(--green)" : "0.5px solid var(--border)",
            }}
          >
            Populaires
          </button>
          <button
            onClick={() => setTri("recent")}
            className="rounded-lg px-2.5 py-1.5 text-[11px] font-medium"
            style={{
              background: tri === "recent" ? "var(--green)" : "var(--bg-secondary)",
              color: tri === "recent" ? "#fff" : "var(--text-tertiary)",
              border: tri === "recent" ? "0.5px solid var(--green)" : "0.5px solid var(--border)",
            }}
          >
            Récents
          </button>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div
            className="w-6 h-6 rounded-full border-2 animate-spin"
            style={{ borderColor: "var(--border)", borderTopColor: "var(--green)" }}
          />
        </div>
      ) : profiles.length === 0 ? (
        <div
          className="rounded-xl p-8 text-center"
          style={{
            background: "var(--bg-card)",
            border: "0.5px solid var(--border)",
          }}
        >
          <p style={{ fontSize: "14px", color: "var(--text-tertiary)", marginBottom: "8px" }}>
            Aucun professionnel trouvé.
          </p>
          <p style={{ fontSize: "12px", color: "var(--text-tertiary)" }}>
            {session
              ? "Soyez le premier à créer votre profil professionnel!"
              : "Connectez-vous pour créer votre profil professionnel."}
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(1, 1fr)",
            gap: "12px",
          }}
          className="repertoire-grid"
        >
          {profiles.map((profile) => (
            <ProCard
              key={profile.id}
              profile={profile}
              hasVoted={votedIds.includes(profile.id)}
            />
          ))}
        </div>
      )}

      {/* Responsive grid CSS */}
      <style>{`
        @media (min-width: 480px) {
          .repertoire-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (min-width: 768px) {
          .repertoire-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (min-width: 1024px) {
          .repertoire-grid {
            grid-template-columns: repeat(5, 1fr) !important;
          }
        }
      `}</style>
    </div>
    </>
  );
}
