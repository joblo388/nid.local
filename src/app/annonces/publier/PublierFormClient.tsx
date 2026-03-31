"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { useConfetti } from "@/components/Confetti";
import { villes, quartiersDeVille } from "@/lib/data";

/* ── Types ──────────────────────────────────────────────────────────────── */

type UploadedImage = { url: string; principale: boolean; preview: string };

type FormState = {
  /* Section 1 : Transaction */
  transaction: string;
  typePropriete: string;
  sousType: string;
  villeSlug: string;
  quartierSlug: string;
  adresse: string;
  prix: string;
  prixMode: string;

  /* Section 2 : Logement */
  chambres: string;
  sallesDeBain: string;
  sallesDEau: string;
  superficieHabitable: string;
  superficieTerrain: string;
  description: string;

  /* Section 3 : Batiment */
  anneeConstruction: string;
  chauffage: string;
  eauChaude: string;
  climatisation: string;
  sousSol: string;
  revetement: string;
  extras: string[];
  stationnementInterieur: string;
  stationnementExterieur: string;

  /* Section 4 : Plex / Revenus */
  nombreLogements: string;
  revenusBruts: string;
  depenses: string;
  logementsLibres: string;
  occupationProprietaire: string;

  /* Section 5 : Medias & Contact */
  titreAnnonce: string;
  contactPrefere: string;
  telephone: string;
  courriel: string;
  disponibilites: string;
};

const INITIAL_STATE: FormState = {
  transaction: "vendre",
  typePropriete: "unifamiliale",
  sousType: "",
  villeSlug: "montreal",
  quartierSlug: "",
  adresse: "",
  prix: "",
  prixMode: "negociable",

  chambres: "",
  sallesDeBain: "",
  sallesDEau: "0",
  superficieHabitable: "",
  superficieTerrain: "",
  description: "",

  anneeConstruction: "",
  chauffage: "",
  eauChaude: "",
  climatisation: "",
  sousSol: "",
  revetement: "",
  extras: [],
  stationnementInterieur: "0",
  stationnementExterieur: "0",

  nombreLogements: "",
  revenusBruts: "",
  depenses: "",
  logementsLibres: "",
  occupationProprietaire: "",

  titreAnnonce: "",
  contactPrefere: "message",
  telephone: "",
  courriel: "",
  disponibilites: "",
};

const STORAGE_KEY = "nidlocal-draft-annonce";

const TABS = [
  { id: 1, label: "Transaction" },
  { id: 2, label: "Logement" },
  { id: 3, label: "Batiment" },
  { id: 4, label: "Plex / Revenus" },
  { id: 5, label: "Medias & Contact" },
];

const PLEX_TYPES = ["duplex", "triplex", "quadruplex"];

/* ── Composant de pilules ───────────────────────────────────────────────── */

function ChoicePills({
  options,
  value,
  onChange,
  columns,
}: {
  options: { label: string; value: string }[];
  value: string;
  onChange: (v: string) => void;
  columns?: number;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: columns
          ? `repeat(${columns}, 1fr)`
          : `repeat(auto-fill, minmax(110px, 1fr))`,
        gap: 6,
      }}
    >
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          style={{
            padding: "8px 12px",
            borderRadius: 8,
            border:
              value === o.value
                ? "1.5px solid var(--green)"
                : "0.5px solid var(--border)",
            background:
              value === o.value ? "var(--green-light-bg)" : "var(--bg-card)",
            color:
              value === o.value
                ? "var(--green-text)"
                : "var(--text-secondary)",
            cursor: "pointer",
            fontFamily: "inherit",
            fontSize: 13,
            fontWeight: 500,
            textAlign: "center",
            transition: "all 0.15s",
          }}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function CheckboxGrid({
  options,
  values,
  onChange,
}: {
  options: { label: string; value: string }[];
  values: string[];
  onChange: (v: string[]) => void;
}) {
  const toggle = (val: string) => {
    if (values.includes(val)) {
      onChange(values.filter((v) => v !== val));
    } else {
      onChange([...values, val]);
    }
  };
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 6,
      }}
    >
      {options.map((o) => {
        const checked = values.includes(o.value);
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => toggle(o.value)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 12px",
              borderRadius: 8,
              border: checked
                ? "1.5px solid var(--green)"
                : "0.5px solid var(--border)",
              background: checked
                ? "var(--green-light-bg)"
                : "var(--bg-card)",
              color: checked
                ? "var(--green-text)"
                : "var(--text-secondary)",
              cursor: "pointer",
              fontFamily: "inherit",
              fontSize: 13,
              fontWeight: 500,
              textAlign: "left",
              transition: "all 0.15s",
            }}
          >
            <span
              style={{
                width: 16,
                height: 16,
                borderRadius: 4,
                border: checked
                  ? "1.5px solid var(--green)"
                  : "0.5px solid var(--border-secondary)",
                background: checked ? "var(--green)" : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {checked && (
                <svg
                  viewBox="0 0 12 12"
                  width="10"
                  height="10"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2"
                >
                  <polyline points="2,6 5,9 10,3" />
                </svg>
              )}
            </span>
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/* ── Label helper ───────────────────────────────────────────────────────── */

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label
      style={{
        display: "block",
        fontSize: 12,
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        color: "var(--text-tertiary)",
        marginBottom: 6,
      }}
    >
      {children}
    </label>
  );
}

/* ── Input wrapper ──────────────────────────────────────────────────────── */

function FieldInput({
  children,
  unit,
}: {
  children: React.ReactNode;
  unit?: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 0,
        borderRadius: 8,
        border: "0.5px solid var(--border)",
        background: "var(--bg-secondary)",
        overflow: "hidden",
      }}
    >
      {children}
      {unit && (
        <span
          style={{
            padding: "0 12px",
            fontSize: 12,
            color: "var(--text-tertiary)",
            whiteSpace: "nowrap",
          }}
        >
          {unit}
        </span>
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  border: "none",
  background: "transparent",
  fontFamily: "inherit",
  fontSize: 14,
  color: "var(--text-primary)",
  outline: "none",
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  appearance: "none" as const,
  cursor: "pointer",
  paddingRight: 32,
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpolyline points='2,4 6,8 10,4' fill='none' stroke='%236e6c67' stroke-width='1.5'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 10px center",
};

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  minHeight: 120,
  resize: "vertical" as const,
};

/* ══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════════════════════════ */

export default function PublierFormClient() {
  const router = useRouter();
  const { celebrate } = useConfetti();
  const [activeTab, setActiveTab] = useState(1);
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [erreur, setErreur] = useState("");
  const [published, setPublished] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(false);

  /* ── Charger le brouillon au montage ──────────────────────────────────── */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.form) setForm(parsed.form);
        if (parsed.images) setImages(parsed.images);
      }
    } catch {
      /* ignore */
    }
    mountedRef.current = true;
  }, []);

  /* ── Autosave debounce 500ms ──────────────────────────────────────────── */
  useEffect(() => {
    if (!mountedRef.current) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ form, images })
        );
        setDraftSaved(true);
        setTimeout(() => setDraftSaved(false), 2000);
      } catch {
        /* quota exceeded */
      }
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [form, images]);

  /* ── Helpers ──────────────────────────────────────────────────────────── */

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => {
      const next = { ...f, [key]: value };
      if (key === "villeSlug") next.quartierSlug = "";
      return next;
    });
  }

  function clearDraft() {
    localStorage.removeItem(STORAGE_KEY);
    setForm(INITIAL_STATE);
    setImages([]);
    setActiveTab(1);
  }

  const quartiersDispo = quartiersDeVille(form.villeSlug);
  const isPlex = PLEX_TYPES.includes(form.typePropriete);

  /* ── Upload photos ────────────────────────────────────────────────────── */

  const uploadFiles = useCallback(
    async (files: FileList | File[]) => {
      setUploading(true);
      for (const file of Array.from(files)) {
        if (images.length >= 40) break;
        if (!file.type.startsWith("image/")) continue;
        const preview = URL.createObjectURL(file);
        const fd = new FormData();
        fd.append("file", file);
        fd.append("maxBytes", "5000000");
        try {
          const res = await fetch("/api/upload", {
            method: "POST",
            body: fd,
          });
          const data = await res.json();
          if (data.url) {
            setImages((prev) => [
              ...prev,
              {
                url: data.url,
                principale: prev.length === 0,
                preview,
              },
            ]);
          }
        } catch {
          /* ignore */
        }
      }
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    },
    [images.length]
  );

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) uploadFiles(e.target.files);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files) uploadFiles(e.dataTransfer.files);
  }

  function removeImage(i: number) {
    setImages((prev) => {
      const next = prev.filter((_, idx) => idx !== i);
      if (next.length > 0 && !next.some((img) => img.principale)) {
        next[0].principale = true;
      }
      return next;
    });
  }

  /* ── parseNum ─────────────────────────────────────────────────────────── */

  function parseNum(s: string): number {
    return parseInt(s.replace(/\s/g, "")) || 0;
  }

  /* ── Publish ──────────────────────────────────────────────────────────── */

  async function handlePublish() {
    setErreur("");
    setSubmitting(true);

    const titreFinal =
      form.titreAnnonce.trim() ||
      form.adresse ||
      `${form.typePropriete} -- ${form.quartierSlug}`;

    const payload = {
      titre: titreFinal,
      description: form.description,
      prix: parseNum(form.prix),
      mode: form.transaction === "louer" ? "location" : "vente",
      type: form.typePropriete,
      quartierSlug: form.quartierSlug,
      villeSlug: form.villeSlug,
      adresse: form.adresse,
      chambres: parseNum(form.chambres),
      sallesDeBain: parseNum(form.sallesDeBain),
      superficie: parseNum(form.superficieHabitable),
      anneeConstruction: parseNum(form.anneeConstruction) || null,
      stationnement:
        form.stationnementInterieur !== "0" ||
        form.stationnementExterieur !== "0"
          ? `int:${form.stationnementInterieur},ext:${form.stationnementExterieur}`
          : null,
      style: form.sousType || null,
      superficieTerrain: parseNum(form.superficieTerrain) || null,
      chauffage: form.chauffage || null,
      eauChaude: form.eauChaude || null,
      sousSol: form.sousSol || null,
      piscine: form.extras.includes("piscine_creusee")
        ? "Creusée"
        : form.extras.includes("piscine_hors_sol")
          ? "Hors-terre"
          : null,
      anonyme: false,
      telephone: form.telephone || null,
      images: images.map((img) => ({
        url: img.url,
        principale: img.principale,
      })),
      documents: [],
    };

    try {
      const res = await fetch("/api/annonces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setErreur(data.error ?? "Une erreur est survenue.");
        setSubmitting(false);
        return;
      }
      localStorage.removeItem(STORAGE_KEY);
      celebrate();
      setPublished(true);
      setTimeout(() => {
        router.push(`/annonces/${data.id}`);
      }, 1500);
    } catch {
      setErreur("Une erreur est survenue.");
    } finally {
      setSubmitting(false);
    }
  }

  /* ── Render: success ──────────────────────────────────────────────────── */

  if (published) {
    return (
      <>
        <Header />
        <div
          className="max-w-[700px] mx-auto px-4 pb-10"
          style={{ marginTop: 24 }}
        >
          <div
            style={{
              borderRadius: 12,
              background: "var(--bg-card)",
              border: "0.5px solid var(--border)",
              textAlign: "center",
              padding: "40px 24px",
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "var(--green-light-bg)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <svg
                viewBox="0 0 24 24"
                width="28"
                height="28"
                fill="none"
                stroke="var(--green-text)"
                strokeWidth="2"
              >
                <polyline points="4,12 9,17 20,6" />
              </svg>
            </div>
            <div style={{ fontSize: 20, fontWeight: 500, marginBottom: 8 }}>
              Annonce publiee
            </div>
            <div
              style={{
                fontSize: 14,
                color: "var(--text-tertiary)",
                marginBottom: 24,
              }}
            >
              Ton annonce est maintenant visible sur nid.local. Redirection en
              cours...
            </div>
            <Link
              href="/annonces"
              style={{
                display: "inline-block",
                padding: "10px 24px",
                borderRadius: 8,
                background: "var(--green)",
                color: "#fff",
                fontSize: 14,
                fontWeight: 500,
                textDecoration: "none",
              }}
            >
              Voir les annonces
            </Link>
          </div>
        </div>
      </>
    );
  }

  /* ── Render: form ─────────────────────────────────────────────────────── */

  return (
    <>
      <Header />
      <div
        className="max-w-[700px] mx-auto px-4 pb-10"
        style={{ marginTop: 24 }}
      >
        {/* Breadcrumb */}
        <div
          style={{
            fontSize: 12,
            color: "var(--text-tertiary)",
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <Link
            href="/annonces"
            style={{ color: "var(--green)", textDecoration: "none" }}
          >
            Annonces
          </Link>
          <span>/</span>
          <span>Publier une annonce</span>
        </div>

        {/* Draft indicator + clear */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 12,
            minHeight: 24,
          }}
        >
          <div
            style={{
              fontSize: 12,
              color: "var(--green-text)",
              opacity: draftSaved ? 1 : 0,
              transition: "opacity 0.3s",
            }}
          >
            Brouillon sauvegarde
          </div>
          <button
            type="button"
            onClick={clearDraft}
            style={{
              fontSize: 12,
              color: "var(--text-tertiary)",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "inherit",
              textDecoration: "underline",
            }}
          >
            Effacer le brouillon
          </button>
        </div>

        {/* Tab bar */}
        <div
          style={{
            display: "flex",
            gap: 0,
            borderBottom: "0.5px solid var(--border)",
            marginBottom: 20,
            overflowX: "auto",
          }}
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "10px 16px",
                fontSize: 13,
                fontWeight: activeTab === tab.id ? 600 : 400,
                color:
                  activeTab === tab.id
                    ? "var(--green)"
                    : "var(--text-tertiary)",
                background: "none",
                border: "none",
                borderBottom:
                  activeTab === tab.id
                    ? "2px solid var(--green)"
                    : "2px solid transparent",
                cursor: "pointer",
                fontFamily: "inherit",
                whiteSpace: "nowrap",
                transition: "all 0.15s",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {erreur && (
          <div
            style={{
              padding: "10px 14px",
              borderRadius: 8,
              background: "var(--red-bg)",
              color: "var(--red-text)",
              fontSize: 13,
              marginBottom: 16,
            }}
          >
            {erreur}
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════
           SECTION 1 : Transaction & Type
           ════════════════════════════════════════════════════════════════ */}
        {activeTab === 1 && (
          <div
            style={{
              borderRadius: 12,
              background: "var(--bg-card)",
              border: "0.5px solid var(--border)",
              padding: 24,
            }}
          >
            {/* Transaction */}
            <div style={{ marginBottom: 20 }}>
              <FieldLabel>Type de transaction</FieldLabel>
              <ChoicePills
                options={[
                  { label: "Vendre", value: "vendre" },
                  { label: "Louer", value: "louer" },
                ]}
                value={form.transaction}
                onChange={(v) => setField("transaction", v)}
                columns={2}
              />
            </div>

            {/* Type de propriete */}
            <div style={{ marginBottom: 20 }}>
              <FieldLabel>Type de propriete</FieldLabel>
              <ChoicePills
                options={[
                  { label: "Unifamiliale", value: "unifamiliale" },
                  { label: "Condo", value: "condo" },
                  { label: "Duplex", value: "duplex" },
                  { label: "Triplex", value: "triplex" },
                  { label: "Quadruplex+", value: "quadruplex" },
                  { label: "Terrain", value: "terrain" },
                  { label: "Chalet", value: "chalet" },
                  { label: "Bi-generation", value: "bi_generation" },
                ]}
                value={form.typePropriete}
                onChange={(v) => setField("typePropriete", v)}
                columns={4}
              />
            </div>

            {/* Sous-type */}
            <div style={{ marginBottom: 20 }}>
              <FieldLabel>Sous-type</FieldLabel>
              <ChoicePills
                options={[
                  { label: "Detache", value: "detache" },
                  { label: "Jumele", value: "jumele" },
                  { label: "Maison de ville", value: "maison_de_ville" },
                  { label: "Plain-pied", value: "plain_pied" },
                  { label: "A etages", value: "a_etages" },
                ]}
                value={form.sousType}
                onChange={(v) =>
                  setField("sousType", form.sousType === v ? "" : v)
                }
              />
            </div>

            {/* Localisation */}
            <div style={{ marginBottom: 20 }}>
              <FieldLabel>Localisation</FieldLabel>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10,
                  marginBottom: 10,
                }}
              >
                <FieldInput>
                  <select
                    value={form.villeSlug}
                    onChange={(e) => setField("villeSlug", e.target.value)}
                    style={selectStyle}
                  >
                    {villes.map((v) => (
                      <option key={v.slug} value={v.slug}>
                        {v.nom}
                      </option>
                    ))}
                  </select>
                </FieldInput>
                <FieldInput>
                  <select
                    value={form.quartierSlug}
                    onChange={(e) =>
                      setField("quartierSlug", e.target.value)
                    }
                    style={selectStyle}
                  >
                    <option value="">Quartier</option>
                    {quartiersDispo.map((q) => (
                      <option key={q.slug} value={q.slug}>
                        {q.nom}
                      </option>
                    ))}
                  </select>
                </FieldInput>
              </div>
              <FieldInput>
                <input
                  type="text"
                  placeholder="Adresse complete (ex : 7103 rue St-Denis)"
                  value={form.adresse}
                  onChange={(e) => setField("adresse", e.target.value)}
                  style={inputStyle}
                />
              </FieldInput>
            </div>

            {/* Prix */}
            <div style={{ marginBottom: 0 }}>
              <FieldLabel>Prix demande</FieldLabel>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  gap: 10,
                  alignItems: "start",
                }}
              >
                <FieldInput unit="$">
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder={
                      form.transaction === "louer" ? "1 500" : "495 000"
                    }
                    value={form.prix}
                    onChange={(e) => setField("prix", e.target.value)}
                    style={inputStyle}
                  />
                </FieldInput>
                <ChoicePills
                  options={[
                    { label: "Negociable", value: "negociable" },
                    { label: "Ferme", value: "ferme" },
                  ]}
                  value={form.prixMode}
                  onChange={(v) => setField("prixMode", v)}
                  columns={2}
                />
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════
           SECTION 2 : Logement
           ════════════════════════════════════════════════════════════════ */}
        {activeTab === 2 && (
          <div
            style={{
              borderRadius: 12,
              background: "var(--bg-card)",
              border: "0.5px solid var(--border)",
              padding: 24,
            }}
          >
            {/* Chambres */}
            <div style={{ marginBottom: 20 }}>
              <FieldLabel>Chambres</FieldLabel>
              <ChoicePills
                options={[
                  { label: "1", value: "1" },
                  { label: "2", value: "2" },
                  { label: "3", value: "3" },
                  { label: "4", value: "4" },
                  { label: "5+", value: "5" },
                ]}
                value={form.chambres}
                onChange={(v) => setField("chambres", v)}
                columns={5}
              />
            </div>

            {/* Salles de bain + Salles d'eau */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
                marginBottom: 20,
              }}
            >
              <div>
                <FieldLabel>Salles de bain</FieldLabel>
                <ChoicePills
                  options={[
                    { label: "1", value: "1" },
                    { label: "2", value: "2" },
                    { label: "3+", value: "3" },
                  ]}
                  value={form.sallesDeBain}
                  onChange={(v) => setField("sallesDeBain", v)}
                  columns={3}
                />
              </div>
              <div>
                <FieldLabel>Salles d&apos;eau</FieldLabel>
                <ChoicePills
                  options={[
                    { label: "0", value: "0" },
                    { label: "1", value: "1" },
                    { label: "2+", value: "2" },
                  ]}
                  value={form.sallesDEau}
                  onChange={(v) => setField("sallesDEau", v)}
                  columns={3}
                />
              </div>
            </div>

            {/* Superficie */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
                marginBottom: 20,
              }}
            >
              <div>
                <FieldLabel>Aire habitable</FieldLabel>
                <FieldInput unit="pi²">
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="1 820"
                    value={form.superficieHabitable}
                    onChange={(e) =>
                      setField("superficieHabitable", e.target.value)
                    }
                    style={inputStyle}
                  />
                </FieldInput>
              </div>
              <div>
                <FieldLabel>Terrain</FieldLabel>
                <FieldInput unit="pi²">
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="4 200"
                    value={form.superficieTerrain}
                    onChange={(e) =>
                      setField("superficieTerrain", e.target.value)
                    }
                    style={inputStyle}
                  />
                </FieldInput>
              </div>
            </div>

            {/* Description */}
            <div>
              <FieldLabel>Description</FieldLabel>
              <FieldInput>
                <textarea
                  placeholder="Decrivez votre propriete : renovations, points forts, environnement..."
                  value={form.description}
                  onChange={(e) => setField("description", e.target.value)}
                  style={textareaStyle}
                />
              </FieldInput>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════
           SECTION 3 : Batiment
           ════════════════════════════════════════════════════════════════ */}
        {activeTab === 3 && (
          <div
            style={{
              borderRadius: 12,
              background: "var(--bg-card)",
              border: "0.5px solid var(--border)",
              padding: 24,
            }}
          >
            {/* Annee de construction */}
            <div style={{ marginBottom: 20 }}>
              <FieldLabel>Annee de construction</FieldLabel>
              <FieldInput>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="2006"
                  value={form.anneeConstruction}
                  onChange={(e) =>
                    setField("anneeConstruction", e.target.value)
                  }
                  style={inputStyle}
                />
              </FieldInput>
            </div>

            {/* Chauffage */}
            <div style={{ marginBottom: 20 }}>
              <FieldLabel>Chauffage</FieldLabel>
              <ChoicePills
                options={[
                  { label: "Electrique", value: "electrique" },
                  { label: "Gaz naturel", value: "gaz_naturel" },
                  { label: "Mazout", value: "mazout" },
                  { label: "Geothermie", value: "geothermie" },
                  { label: "Bois", value: "bois" },
                  { label: "Autre", value: "autre" },
                ]}
                value={form.chauffage}
                onChange={(v) =>
                  setField("chauffage", form.chauffage === v ? "" : v)
                }
                columns={3}
              />
            </div>

            {/* Eau chaude */}
            <div style={{ marginBottom: 20 }}>
              <FieldLabel>Eau chaude</FieldLabel>
              <ChoicePills
                options={[
                  { label: "Electrique", value: "electrique" },
                  { label: "Gaz naturel", value: "gaz_naturel" },
                  { label: "Thermopompe", value: "thermopompe" },
                ]}
                value={form.eauChaude}
                onChange={(v) =>
                  setField("eauChaude", form.eauChaude === v ? "" : v)
                }
                columns={3}
              />
            </div>

            {/* Climatisation */}
            <div style={{ marginBottom: 20 }}>
              <FieldLabel>Climatisation</FieldLabel>
              <ChoicePills
                options={[
                  { label: "Aucune", value: "aucune" },
                  { label: "Mural", value: "mural" },
                  { label: "Central", value: "central" },
                  { label: "Thermopompe", value: "thermopompe" },
                ]}
                value={form.climatisation}
                onChange={(v) =>
                  setField(
                    "climatisation",
                    form.climatisation === v ? "" : v
                  )
                }
                columns={4}
              />
            </div>

            {/* Sous-sol */}
            <div style={{ marginBottom: 20 }}>
              <FieldLabel>Sous-sol</FieldLabel>
              <ChoicePills
                options={[
                  { label: "Aucun", value: "aucun" },
                  { label: "Non-fini", value: "non_fini" },
                  { label: "Semi-fini", value: "semi_fini" },
                  { label: "Fini", value: "fini" },
                ]}
                value={form.sousSol}
                onChange={(v) =>
                  setField("sousSol", form.sousSol === v ? "" : v)
                }
                columns={4}
              />
            </div>

            {/* Revetement exterieur */}
            <div style={{ marginBottom: 20 }}>
              <FieldLabel>Revetement exterieur</FieldLabel>
              <ChoicePills
                options={[
                  { label: "Brique", value: "brique" },
                  { label: "Vinyle", value: "vinyle" },
                  { label: "Fibrociment", value: "fibrociment" },
                  { label: "Pierre", value: "pierre" },
                  { label: "Bois", value: "bois" },
                  { label: "Composite", value: "composite" },
                ]}
                value={form.revetement}
                onChange={(v) =>
                  setField("revetement", form.revetement === v ? "" : v)
                }
                columns={3}
              />
            </div>

            {/* Extras */}
            <div style={{ marginBottom: 20 }}>
              <FieldLabel>Extras</FieldLabel>
              <CheckboxGrid
                options={[
                  { label: "Garage", value: "garage" },
                  { label: "Piscine creusee", value: "piscine_creusee" },
                  { label: "Piscine hors-sol", value: "piscine_hors_sol" },
                  { label: "Spa", value: "spa" },
                  { label: "Foyer", value: "foyer" },
                  { label: "Borne VE", value: "borne_ve" },
                  { label: "Acces PMR", value: "acces_pmr" },
                  { label: "Cabanon", value: "cabanon" },
                  { label: "Serre", value: "serre" },
                  { label: "Systeme alarme", value: "systeme_alarme" },
                ]}
                values={form.extras}
                onChange={(v) => setField("extras", v)}
              />
            </div>

            {/* Stationnement */}
            <div>
              <FieldLabel>Stationnement</FieldLabel>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 16,
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--text-tertiary)",
                      marginBottom: 6,
                    }}
                  >
                    Interieur
                  </div>
                  <ChoicePills
                    options={[
                      { label: "0", value: "0" },
                      { label: "1", value: "1" },
                      { label: "2+", value: "2" },
                    ]}
                    value={form.stationnementInterieur}
                    onChange={(v) =>
                      setField("stationnementInterieur", v)
                    }
                    columns={3}
                  />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--text-tertiary)",
                      marginBottom: 6,
                    }}
                  >
                    Exterieur
                  </div>
                  <ChoicePills
                    options={[
                      { label: "0", value: "0" },
                      { label: "1", value: "1" },
                      { label: "2", value: "2" },
                      { label: "3+", value: "3" },
                    ]}
                    value={form.stationnementExterieur}
                    onChange={(v) =>
                      setField("stationnementExterieur", v)
                    }
                    columns={4}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════
           SECTION 4 : Plex / Revenus
           ════════════════════════════════════════════════════════════════ */}
        {activeTab === 4 && (
          <div
            style={{
              borderRadius: 12,
              background: "var(--bg-card)",
              border: "0.5px solid var(--border)",
              padding: 24,
            }}
          >
            {!isPlex ? (
              <div
                style={{
                  padding: "32px 16px",
                  textAlign: "center",
                  color: "var(--text-tertiary)",
                  fontSize: 14,
                }}
              >
                <div style={{ marginBottom: 8, fontSize: 16, fontWeight: 500 }}>
                  Section non applicable
                </div>
                <div>
                  Cette section s&apos;applique uniquement aux duplex, triplex et
                  quadruplex+. Changez le type de propriete dans l&apos;onglet
                  Transaction pour y acceder.
                </div>
              </div>
            ) : (
              <div
                style={{
                  borderRadius: 10,
                  background: "var(--amber-bg)",
                  border: "0.5px solid var(--amber-text)",
                  padding: 20,
                }}
              >
                <div
                  style={{
                    fontSize: 13,
                    color: "var(--amber-text)",
                    marginBottom: 16,
                    fontWeight: 500,
                  }}
                >
                  Informations sur les revenus du plex. Ces donnees aident les
                  acheteurs a evaluer la rentabilite.
                </div>

                {/* Nombre de logements */}
                <div style={{ marginBottom: 20 }}>
                  <FieldLabel>Nombre de logements</FieldLabel>
                  <ChoicePills
                    options={[
                      { label: "2 (duplex)", value: "2" },
                      { label: "3 (triplex)", value: "3" },
                      { label: "4 (quadruplex)", value: "4" },
                      { label: "5+", value: "5" },
                    ]}
                    value={form.nombreLogements}
                    onChange={(v) => setField("nombreLogements", v)}
                    columns={4}
                  />
                </div>

                {/* Grid 3 cols */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: 12,
                    marginBottom: 20,
                  }}
                >
                  <div>
                    <FieldLabel>Revenus bruts / an</FieldLabel>
                    <FieldInput unit="$">
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="48 000"
                        value={form.revenusBruts}
                        onChange={(e) =>
                          setField("revenusBruts", e.target.value)
                        }
                        style={inputStyle}
                      />
                    </FieldInput>
                  </div>
                  <div>
                    <FieldLabel>Depenses / an</FieldLabel>
                    <FieldInput unit="$">
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="12 000"
                        value={form.depenses}
                        onChange={(e) =>
                          setField("depenses", e.target.value)
                        }
                        style={inputStyle}
                      />
                    </FieldInput>
                  </div>
                  <div>
                    <FieldLabel>Logements libres</FieldLabel>
                    <FieldInput>
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="0"
                        value={form.logementsLibres}
                        onChange={(e) =>
                          setField("logementsLibres", e.target.value)
                        }
                        style={inputStyle}
                      />
                    </FieldInput>
                  </div>
                </div>

                {/* Occupation du proprietaire */}
                <div>
                  <FieldLabel>Occupation du proprietaire</FieldLabel>
                  <ChoicePills
                    options={[
                      { label: "Non occupe", value: "non_occupe" },
                      {
                        label: "Occupe 1 logement",
                        value: "occupe_1",
                      },
                    ]}
                    value={form.occupationProprietaire}
                    onChange={(v) =>
                      setField("occupationProprietaire", v)
                    }
                    columns={2}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════
           SECTION 5 : Medias & Contact
           ════════════════════════════════════════════════════════════════ */}
        {activeTab === 5 && (
          <div
            style={{
              borderRadius: 12,
              background: "var(--bg-card)",
              border: "0.5px solid var(--border)",
              padding: 24,
            }}
          >
            {/* Photos drag-and-drop */}
            <div style={{ marginBottom: 20 }}>
              <FieldLabel>Photos</FieldLabel>
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
                style={{
                  border: dragOver
                    ? "2px dashed var(--green)"
                    : "1.5px dashed var(--border-secondary)",
                  borderRadius: 10,
                  padding: "28px 20px",
                  textAlign: "center",
                  cursor: "pointer",
                  background: dragOver
                    ? "var(--green-light-bg)"
                    : "var(--bg-secondary)",
                  transition: "all 0.15s",
                }}
              >
                <svg
                  viewBox="0 0 28 28"
                  width="28"
                  height="28"
                  fill="none"
                  stroke="var(--text-tertiary)"
                  strokeWidth="1.2"
                  style={{ margin: "0 auto 8px" }}
                >
                  <rect x="2" y="4" width="24" height="18" rx="3" />
                  <circle cx="9" cy="11" r="2" />
                  <polyline points="2,20 8,14 14,18 20,12 26,18" />
                </svg>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: "var(--text-primary)",
                    marginBottom: 4,
                  }}
                >
                  {uploading
                    ? "Telechargement en cours..."
                    : "Glisse tes photos ici ou clique pour choisir"}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "var(--text-tertiary)",
                  }}
                >
                  JPG, PNG, WebP. 5 Mo max par photo. 40 photos maximum.
                </div>
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />

              {/* Image previews */}
              {images.length > 0 && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(80px, 1fr))",
                    gap: 8,
                    marginTop: 12,
                  }}
                >
                  {images.map((img, i) => (
                    <div
                      key={i}
                      style={{
                        position: "relative",
                        aspectRatio: "1",
                        borderRadius: 8,
                        overflow: "hidden",
                        border: "0.5px solid var(--border)",
                        cursor: "pointer",
                      }}
                      onClick={() => removeImage(i)}
                    >
                      <Image
                        src={img.preview || img.url}
                        alt=""
                        fill
                        sizes="80px"
                        style={{ objectFit: "cover" }}
                      />
                      {i === 0 && (
                        <span
                          style={{
                            position: "absolute",
                            bottom: 4,
                            left: 4,
                            fontSize: 9,
                            fontWeight: 600,
                            background: "var(--green)",
                            color: "#fff",
                            padding: "2px 6px",
                            borderRadius: 4,
                          }}
                        >
                          Principale
                        </span>
                      )}
                      <span
                        style={{
                          position: "absolute",
                          top: 4,
                          right: 4,
                          width: 18,
                          height: 18,
                          borderRadius: "50%",
                          background: "rgba(0,0,0,0.5)",
                          color: "#fff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 11,
                        }}
                      >
                        x
                      </span>
                    </div>
                  ))}
                </div>
              )}
              <div
                style={{
                  fontSize: 12,
                  color: "var(--text-tertiary)",
                  marginTop: 8,
                }}
              >
                {images.length} / 40 photos. Cliquer sur une photo pour la
                supprimer.
              </div>
            </div>

            {/* Separator */}
            <div
              style={{
                borderTop: "0.5px solid var(--border)",
                margin: "20px 0",
              }}
            />

            {/* Titre de l'annonce */}
            <div style={{ marginBottom: 20 }}>
              <FieldLabel>Titre de l&apos;annonce</FieldLabel>
              <FieldInput>
                <input
                  type="text"
                  placeholder="Ex : Duplex renove avec revenus, Rosemont"
                  value={form.titreAnnonce}
                  onChange={(e) =>
                    setField("titreAnnonce", e.target.value)
                  }
                  style={inputStyle}
                />
              </FieldInput>
            </div>

            {/* Contact prefere */}
            <div style={{ marginBottom: 20 }}>
              <FieldLabel>Contact prefere</FieldLabel>
              <ChoicePills
                options={[
                  { label: "Message direct", value: "message" },
                  { label: "Telephone", value: "telephone" },
                  { label: "Courriel", value: "courriel" },
                ]}
                value={form.contactPrefere}
                onChange={(v) => setField("contactPrefere", v)}
                columns={3}
              />
            </div>

            {/* Telephone + Courriel */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
                marginBottom: 20,
              }}
            >
              <div>
                <FieldLabel>Telephone</FieldLabel>
                <FieldInput>
                  <input
                    type="tel"
                    placeholder="514 555-1234"
                    value={form.telephone}
                    onChange={(e) =>
                      setField("telephone", e.target.value)
                    }
                    style={inputStyle}
                  />
                </FieldInput>
              </div>
              <div>
                <FieldLabel>Courriel</FieldLabel>
                <FieldInput>
                  <input
                    type="email"
                    placeholder="vous@exemple.com"
                    value={form.courriel}
                    onChange={(e) =>
                      setField("courriel", e.target.value)
                    }
                    style={inputStyle}
                  />
                </FieldInput>
              </div>
            </div>

            {/* Disponibilites */}
            <div style={{ marginBottom: 20 }}>
              <FieldLabel>Disponibilites</FieldLabel>
              <ChoicePills
                options={[
                  { label: "Semaine", value: "semaine" },
                  { label: "Fins de semaine", value: "fds" },
                  { label: "Sur rendez-vous", value: "rdv" },
                ]}
                value={form.disponibilites}
                onChange={(v) => setField("disponibilites", v)}
                columns={3}
              />
            </div>

            {/* Separator */}
            <div
              style={{
                borderTop: "0.5px solid var(--border)",
                margin: "20px 0",
              }}
            />

            {/* Submit */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  color: "var(--text-tertiary)",
                  maxWidth: 340,
                  lineHeight: 1.5,
                }}
              >
                Ton annonce sera visible publiquement sur nid.local. Tu peux
                la modifier ou la retirer a tout moment depuis ton profil.
              </div>
              <button
                type="button"
                disabled={submitting}
                onClick={handlePublish}
                style={{
                  padding: "12px 28px",
                  borderRadius: 8,
                  background: "var(--green)",
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 600,
                  border: "none",
                  cursor: submitting ? "not-allowed" : "pointer",
                  fontFamily: "inherit",
                  opacity: submitting ? 0.6 : 1,
                  transition: "opacity 0.15s",
                }}
              >
                {submitting ? "Publication..." : "Publier l'annonce"}
              </button>
            </div>
          </div>
        )}

        {/* Navigation between tabs */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 16,
          }}
        >
          {activeTab > 1 ? (
            <button
              type="button"
              onClick={() => {
                setActiveTab(activeTab - 1);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              style={{
                padding: "10px 20px",
                borderRadius: 8,
                border: "0.5px solid var(--border)",
                background: "var(--bg-card)",
                color: "var(--text-secondary)",
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Precedent
            </button>
          ) : (
            <div />
          )}
          {activeTab < 5 && (
            <button
              type="button"
              onClick={() => {
                setActiveTab(activeTab + 1);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              style={{
                padding: "10px 20px",
                borderRadius: 8,
                border: "none",
                background: "var(--green)",
                color: "#fff",
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Suivant
            </button>
          )}
        </div>
      </div>
    </>
  );
}
