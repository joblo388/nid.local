"use client";

import { useState, useRef } from "react";

/* ─── Types ────────────────────────────────────────────────────────── */

type Props = {
  open: boolean;
  onClose: () => void;
};

const TYPE_OPTIONS = [
  "Unifamiliale",
  "Condo",
  "Duplex",
  "Triplex",
  "Terrain",
  "Chalet",
  "Autre",
];

/* ─── Component ────────────────────────────────────────────────────── */

export function ConciergeModal({ open, onClose }: Props) {
  const [prix, setPrix] = useState("");
  const [adresse, setAdresse] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [lien, setLien] = useState("");
  const [fichiers, setFichiers] = useState<File[]>([]);
  const [nom, setNom] = useState("");
  const [contact, setContact] = useState("");
  const [consent, setConsent] = useState(false);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  if (!open) return null;

  function removeFichier(index: number) {
    setFichiers((prev) => prev.filter((_, i) => i !== index));
  }

  function handleFiles(fileList: FileList | null) {
    if (!fileList) return;
    setFichiers((prev) => [...prev, ...Array.from(fileList)]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!consent || sending) return;
    setSending(true);
    try {
      const fd = new FormData();
      fd.append("prix", prix);
      fd.append("adresse", adresse);
      fd.append("type", type);
      fd.append("description", description);
      fd.append("lien", lien);
      fd.append("nom", nom);
      fd.append("contact", contact);
      fichiers.forEach((f) => fd.append("fichiers", f));
      const res = await fetch("/api/concierge", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Erreur");
      setSuccess(true);
    } catch {
      alert("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setSending(false);
    }
  }

  /* ── Input style helper ──────────────────────────────────────────── */

  const inputStyle: React.CSSProperties = {
    width: "100%",
    fontSize: 13,
    padding: "9px 12px",
    borderRadius: 8,
    border: "0.5px solid var(--border)",
    background: "var(--bg-page)",
    color: "var(--text-primary)",
    fontFamily: "inherit",
    outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 12,
    fontWeight: 500,
    color: "var(--text-secondary)",
    marginBottom: 5,
  };

  /* ── Render ──────────────────────────────────────────────────────── */

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 560,
          maxHeight: "90vh",
          overflowY: "auto",
          background: "var(--bg-card)",
          border: "0.5px solid var(--border)",
          borderRadius: 12,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {success ? (
          /* ── Success state ──────────────────────────────────────── */
          <div style={{ padding: "48px 24px", textAlign: "center" }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "var(--green-light-bg)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--green)"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 600, margin: "0 0 8px" }}>
              Reçu! On vous contacte dans les 24h
            </h3>
            <p
              style={{
                fontSize: 13,
                color: "var(--text-tertiary)",
                margin: "0 0 20px",
              }}
            >
              Notre équipe va préparer votre annonce et vous revenir rapidement.
            </p>
            <button
              onClick={onClose}
              style={{
                fontSize: 13,
                fontWeight: 500,
                padding: "8px 20px",
                borderRadius: 9999,
                background: "var(--green)",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Fermer
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* ── Header ──────────────────────────────────────────── */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 20px",
                borderBottom: "0.5px solid var(--border)",
              }}
            >
              <h2 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>
                Soumettre ma propriété
              </h2>
              <button
                type="button"
                onClick={onClose}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 6,
                  border: "none",
                  background: "var(--bg-secondary)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                  color: "var(--text-tertiary)",
                  fontFamily: "inherit",
                }}
                aria-label="Fermer"
              >
                &times;
              </button>
            </div>

            {/* ── Body ────────────────────────────────────────────── */}
            <div
              style={{
                padding: "20px 20px 0",
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              {/* Prix demandé */}
              <div>
                <label style={labelStyle}>Prix demandé</label>
                <div style={{ position: "relative" }}>
                  <input
                    type="number"
                    min={0}
                    value={prix}
                    onChange={(e) => setPrix(e.target.value)}
                    placeholder="350 000"
                    style={{ ...inputStyle, paddingRight: 32 }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      right: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: 13,
                      color: "var(--text-tertiary)",
                      pointerEvents: "none",
                    }}
                  >
                    $
                  </span>
                </div>
              </div>

              {/* Adresse */}
              <div>
                <label style={labelStyle}>Adresse</label>
                <input
                  type="text"
                  value={adresse}
                  onChange={(e) => setAdresse(e.target.value)}
                  placeholder="123 rue des Érables, Montréal"
                  style={inputStyle}
                />
              </div>

              {/* Type */}
              <div>
                <label style={labelStyle}>Type de propriété</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {TYPE_OPTIONS.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setType(t)}
                      style={{
                        fontSize: 12,
                        padding: "5px 14px",
                        borderRadius: 9999,
                        cursor: "pointer",
                        fontFamily: "inherit",
                        fontWeight: 500,
                        transition: "all 0.15s",
                        background:
                          type === t
                            ? "var(--green-light-bg)"
                            : "transparent",
                        color:
                          type === t
                            ? "var(--green-text)"
                            : "var(--text-tertiary)",
                        border:
                          type === t
                            ? "0.5px solid var(--green)"
                            : "0.5px solid var(--border)",
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label style={labelStyle}>Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Rénovations, inclusions, particularités... Écrivez librement, on met ça en forme."
                  rows={4}
                  style={{
                    ...inputStyle,
                    resize: "vertical",
                    lineHeight: 1.5,
                  }}
                />
              </div>

              {/* Lien existant */}
              <div>
                <label style={labelStyle}>Lien existant</label>
                <input
                  type="text"
                  value={lien}
                  onChange={(e) => setLien(e.target.value)}
                  placeholder="https://..."
                  style={inputStyle}
                />
                <p
                  style={{
                    fontSize: 11,
                    color: "var(--text-tertiary)",
                    marginTop: 4,
                  }}
                >
                  Centris, DuProprio, Kijiji...
                </p>
              </div>

              {/* Drop zone fichiers */}
              <div>
                <label style={labelStyle}>Photos et documents</label>
                <div
                  onClick={() => fileRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleFiles(e.dataTransfer.files);
                  }}
                  style={{
                    border: "1.5px dashed var(--border)",
                    borderRadius: 8,
                    padding: "20px 16px",
                    textAlign: "center",
                    cursor: "pointer",
                    transition: "border-color 0.15s",
                  }}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--text-tertiary)"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ margin: "0 auto 8px" }}
                  >
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <p
                    style={{
                      fontSize: 12,
                      color: "var(--text-tertiary)",
                      margin: 0,
                    }}
                  >
                    Glissez vos fichiers ici ou cliquez pour parcourir
                  </p>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="*/*"
                    multiple
                    onChange={(e) => handleFiles(e.target.files)}
                    style={{ display: "none" }}
                  />
                </div>
                {fichiers.length > 0 && (
                  <ul
                    style={{
                      listStyle: "none",
                      margin: "8px 0 0",
                      padding: 0,
                      display: "flex",
                      flexDirection: "column",
                      gap: 4,
                    }}
                  >
                    {fichiers.map((f, i) => (
                      <li
                        key={`${f.name}-${i}`}
                        style={{
                          fontSize: 12,
                          color: "var(--text-secondary)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "4px 8px",
                          borderRadius: 6,
                          background: "var(--bg-secondary)",
                        }}
                      >
                        <span
                          style={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            maxWidth: "80%",
                          }}
                        >
                          {f.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFichier(i)}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontSize: 16,
                            color: "var(--text-tertiary)",
                            fontFamily: "inherit",
                            lineHeight: 1,
                            padding: "0 2px",
                          }}
                          aria-label="Retirer le fichier"
                        >
                          &times;
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Nom */}
              <div>
                <label style={labelStyle}>Nom</label>
                <input
                  type="text"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  placeholder="Votre nom"
                  style={inputStyle}
                />
              </div>

              {/* Contact */}
              <div>
                <label style={labelStyle}>Courriel ou téléphone</label>
                <input
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="courriel@exemple.com ou 514-555-1234"
                  style={inputStyle}
                />
              </div>

              {/* Consent */}
              <label
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 8,
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  style={{
                    marginTop: 2,
                    accentColor: "var(--green)",
                    cursor: "pointer",
                  }}
                />
                <span
                  style={{
                    fontSize: 12,
                    color: "var(--text-secondary)",
                    lineHeight: 1.5,
                  }}
                >
                  J&apos;accepte que l&apos;équipe nid.local me contacte pour
                  publier mon annonce et traite les informations soumises.
                </span>
              </label>
            </div>

            {/* ── Footer ──────────────────────────────────────────── */}
            <div
              style={{
                padding: "16px 20px",
                marginTop: 16,
                borderTop: "0.5px solid var(--border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 10,
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  color: "var(--green-text)",
                  fontWeight: 500,
                }}
              >
                Gratuit, réponse dans les 24h
              </span>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    fontSize: 13,
                    padding: "8px 16px",
                    borderRadius: 9999,
                    border: "0.5px solid var(--border)",
                    background: "transparent",
                    color: "var(--text-secondary)",
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={!consent || sending}
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    padding: "8px 20px",
                    borderRadius: 9999,
                    background:
                      consent && !sending ? "var(--green)" : "var(--bg-secondary)",
                    color:
                      consent && !sending ? "#fff" : "var(--text-tertiary)",
                    border: "none",
                    cursor:
                      consent && !sending ? "pointer" : "not-allowed",
                    fontFamily: "inherit",
                    transition: "all 0.15s",
                  }}
                >
                  {sending ? "Envoi..." : "Envoyer"}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
