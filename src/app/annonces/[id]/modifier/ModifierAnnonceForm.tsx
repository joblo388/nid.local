"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { villes, quartiersDeVille } from "@/lib/data";
import "../../marketplace.css";

const stepLabels = ["Propriété", "Photos & docs", "Prix & détails", "Enregistrer"];

type UploadedImage = { url: string; principale: boolean; preview: string };
type UploadedDoc = { nom: string; url: string; taille: string };

type FormData = {
  type: string;
  villeSlug: string;
  quartierSlug: string;
  adresse: string;
  chambres: string;
  sallesDeBain: string;
  superficie: string;
  anneeConstruction: string;
  stationnement: string;
  description: string;
  style: string;
  superficieTerrain: string;
  chauffage: string;
  eauChaude: string;
  sousSol: string;
  piscine: string;
  prix: string;
  taxesMunicipales: string;
  taxesScolaires: string;
  fraisCondo: string;
  lienVisite: string;
  anonyme: boolean;
  telephone: string;
};

function parseNum(s: string): number {
  return parseInt(s.replace(/\s/g, "")) || 0;
}

export function ModifierAnnonceForm() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(1);
  const [accOpen, setAccOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [erreur, setErreur] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [docs, setDocs] = useState<UploadedDoc[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const docRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormData>({
    type: "unifamiliale", villeSlug: "montreal", quartierSlug: "", adresse: "",
    chambres: "", sallesDeBain: "", superficie: "", anneeConstruction: "",
    stationnement: "", description: "", style: "", superficieTerrain: "",
    chauffage: "", eauChaude: "", sousSol: "", piscine: "",
    prix: "", taxesMunicipales: "", taxesScolaires: "", fraisCondo: "",
    lienVisite: "", anonyme: false, telephone: "",
  });

  const quartiersDispo = quartiersDeVille(form.villeSlug);

  // Load existing listing
  useEffect(() => {
    fetch(`/api/annonces/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error || !data.isOwner) {
          router.push(`/annonces/${id}`);
          return;
        }
        setForm({
          type: data.type ?? "unifamiliale",
          villeSlug: data.villeSlug ?? "montreal",
          quartierSlug: data.quartierSlug ?? "",
          adresse: data.adresse ?? "",
          chambres: data.chambres ? String(data.chambres) : "",
          sallesDeBain: data.sallesDeBain ? String(data.sallesDeBain) : "",
          superficie: data.superficie ? String(data.superficie) : "",
          anneeConstruction: data.anneeConstruction ? String(data.anneeConstruction) : "",
          stationnement: data.stationnement ?? "",
          description: data.description ?? "",
          style: data.style ?? "",
          superficieTerrain: data.superficieTerrain ? String(data.superficieTerrain) : "",
          chauffage: data.chauffage ?? "",
          eauChaude: data.eauChaude ?? "",
          sousSol: data.sousSol ?? "",
          piscine: data.piscine ?? "",
          prix: data.prix ? String(data.prix) : "",
          taxesMunicipales: data.taxesMunicipales ? String(data.taxesMunicipales) : "",
          taxesScolaires: data.taxesScolaires ? String(data.taxesScolaires) : "",
          fraisCondo: data.fraisCondo ? String(data.fraisCondo) : "",
          lienVisite: data.lienVisite ?? "",
          anonyme: data.anonyme ?? false,
          telephone: data.telephone ?? "",
        });
        setImages((data.images ?? []).map((img: { url: string; principale: boolean }) => ({
          url: img.url, principale: img.principale, preview: img.url,
        })));
        setDocs((data.documents ?? []).map((d: { nom: string; url: string; taille?: string }) => ({
          nom: d.nom, url: d.url, taille: d.taille ?? "",
        })));
      })
      .finally(() => setLoading(false));
  }, [id, router]);

  function setField(key: keyof FormData, value: string | boolean) {
    setForm((f) => ({ ...f, [key]: value }));
    if (key === "villeSlug") setForm((f) => ({ ...f, villeSlug: value as string, quartierSlug: "" }));
  }

  const goStep = useCallback((n: number) => {
    setCurrent(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      if (images.length >= 14) break;
      const preview = URL.createObjectURL(file);
      const fd = new FormData();
      fd.append("file", file);
      fd.append("maxBytes", "5000000");
      try {
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (data.url) {
          setImages((prev) => [...prev, { url: data.url, principale: prev.length === 0, preview }]);
        }
      } catch { /* ignore */ }
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleDocUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("maxBytes", "10000000");
      try {
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (data.url) {
          const taille = file.size > 1_000_000
            ? `${(file.size / 1_000_000).toFixed(1)} Mo`
            : `${Math.round(file.size / 1000)} Ko`;
          setDocs((prev) => [...prev, { nom: file.name, url: data.url, taille }]);
        }
      } catch { /* ignore */ }
    }
    setUploading(false);
    if (docRef.current) docRef.current.value = "";
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

  function removeDoc(i: number) {
    setDocs((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function handleSave() {
    setErreur("");
    setSubmitting(true);

    try {
      const res = await fetch(`/api/annonces/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titre: form.adresse || `${form.type} — ${form.quartierSlug}`,
          description: form.description,
          prix: parseNum(form.prix),
          type: form.type,
          quartierSlug: form.quartierSlug,
          villeSlug: form.villeSlug,
          adresse: form.adresse,
          chambres: parseNum(form.chambres),
          sallesDeBain: parseNum(form.sallesDeBain),
          superficie: parseNum(form.superficie),
          anneeConstruction: parseNum(form.anneeConstruction) || null,
          stationnement: form.stationnement || null,
          style: form.style || null,
          superficieTerrain: parseNum(form.superficieTerrain) || null,
          chauffage: form.chauffage || null,
          eauChaude: form.eauChaude || null,
          sousSol: form.sousSol || null,
          piscine: form.piscine || null,
          taxesMunicipales: parseNum(form.taxesMunicipales) || null,
          taxesScolaires: parseNum(form.taxesScolaires) || null,
          fraisCondo: parseNum(form.fraisCondo) || null,
          lienVisite: form.lienVisite || null,
          anonyme: form.anonyme,
          telephone: form.telephone || null,
          images: images.map((img, i) => ({ url: img.url, principale: i === 0 })),
          documents: docs.map((d) => ({ nom: d.nom, url: d.url, taille: d.taille })),
        }),
      });
      const data = await res.json();
      if (!res.ok) { setErreur(data.error ?? "Erreur"); return; }
      setSaved(true);
    } catch {
      setErreur("Une erreur est survenue.");
    } finally {
      setSubmitting(false);
    }
  }

  const accFields = [form.style, form.superficieTerrain, form.chauffage, form.eauChaude, form.sousSol, form.piscine];
  const accFilled = accFields.filter(Boolean).length;

  if (loading) {
    return (
      <><Header /><div className="max-w-[700px] mx-auto px-4 py-20 text-center" style={{ color: "var(--text-tertiary)", fontSize: 13 }}>Chargement…</div></>
    );
  }

  if (saved) {
    return (
      <>
        <Header />
        <div className="max-w-[700px] mx-auto px-4 pb-10" style={{ marginTop: 24 }}>
          <div className="mp-form-card" style={{ textAlign: "center", padding: "40px 24px" }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--green-light-bg)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="var(--green-text)" strokeWidth="2"><polyline points="4,12 9,17 20,6" /></svg>
            </div>
            <div style={{ fontSize: 20, fontWeight: 500, marginBottom: 8 }}>Annonce modifiée</div>
            <div style={{ fontSize: 14, color: "var(--text-tertiary)", marginBottom: 24 }}>
              Tes modifications ont été enregistrées.
            </div>
            <Link className="mp-btn-primary" href={`/annonces/${id}`}>Voir l&apos;annonce</Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="max-w-[700px] mx-auto px-4 pb-10" style={{ marginTop: 24 }}>
        <div className="mp-breadcrumb">
          <Link href="/annonces">Annonces</Link><span>/</span>
          <Link href={`/annonces/${id}`}>Annonce</Link><span>/</span>
          <span>Modifier</span>
        </div>

        {/* Stepper */}
        <div className="mp-stepper">
          {stepLabels.map((label, i) => {
            const n = i + 1;
            return (
              <div key={n} className={`mp-step${n < current ? " done" : ""}${n === current ? " active" : ""}`} onClick={() => goStep(n)} style={{ cursor: "pointer" }}>
                <div className="mp-step-circle">{n < current ? "✓" : n}</div>
                <div className="mp-step-label">{label}</div>
              </div>
            );
          })}
        </div>

        {erreur && (
          <div style={{ padding: "10px 14px", borderRadius: 8, background: "var(--red-bg)", color: "var(--red-text)", fontSize: 13, marginBottom: 16 }}>
            {erreur}
          </div>
        )}

        {/* Step 1 — Propriété */}
        {current === 1 && (
          <div className="mp-form-card">
            <div className="mp-form-section-title">Informations sur la propriété</div>
            <div className="mp-grid">
              <div className="mp-field">
                <label>Type de propriété</label>
                <div className="mp-field-input">
                  <select value={form.type} onChange={(e) => setField("type", e.target.value)}>
                    <option value="unifamiliale">Maison unifamiliale</option>
                    <option value="condo">Condo</option>
                    <option value="duplex">Duplex</option>
                    <option value="triplex">Triplex</option>
                    <option value="quadruplex">Quadruplex</option>
                  </select>
                </div>
              </div>
              <div className="mp-field">
                <label>Ville</label>
                <div className="mp-field-input">
                  <select value={form.villeSlug} onChange={(e) => setField("villeSlug", e.target.value)}>
                    {villes.map((v) => (<option key={v.slug} value={v.slug}>{v.nom}</option>))}
                  </select>
                </div>
              </div>
              <div className="mp-field">
                <label>Quartier</label>
                <div className="mp-field-input">
                  <select value={form.quartierSlug} onChange={(e) => setField("quartierSlug", e.target.value)}>
                    <option value="">— Choisir —</option>
                    {quartiersDispo.map((q) => (<option key={q.slug} value={q.slug}>{q.nom}</option>))}
                  </select>
                </div>
              </div>
              <div className="mp-field full">
                <label>Adresse complète</label>
                <div className="mp-field-input"><input type="text" placeholder="Ex : 7103 rue St-Denis, Villeray" value={form.adresse} onChange={(e) => setField("adresse", e.target.value)} /></div>
                {form.adresse.length > 5 && (
                  <div style={{ marginTop: 8, borderRadius: 10, overflow: "hidden", border: "0.5px solid var(--border)", height: 160 }}>
                    <iframe title="Carte" width="100%" height="100%" style={{ border: 0 }} loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={`https://www.google.com/maps?q=${encodeURIComponent(form.adresse + ", Québec, Canada")}&output=embed`} />
                  </div>
                )}
              </div>
              <div className="mp-field"><label>Chambres</label><div className="mp-field-input"><input type="number" min="0" placeholder="3" value={form.chambres} onChange={(e) => setField("chambres", e.target.value)} /></div></div>
              <div className="mp-field"><label>Salles de bain</label><div className="mp-field-input"><input type="number" min="0" placeholder="2" value={form.sallesDeBain} onChange={(e) => setField("sallesDeBain", e.target.value)} /></div></div>
              <div className="mp-field"><label>Superficie habitable</label><div className="mp-field-input"><input type="text" placeholder="1 820" value={form.superficie} onChange={(e) => setField("superficie", e.target.value)} /><span className="mp-unit">pi²</span></div></div>
              <div className="mp-field"><label>Année de construction</label><div className="mp-field-input"><input type="text" placeholder="2006" value={form.anneeConstruction} onChange={(e) => setField("anneeConstruction", e.target.value)} /></div></div>
              <div className="mp-field">
                <label>Stationnement</label>
                <div className="mp-field-input">
                  <select value={form.stationnement} onChange={(e) => setField("stationnement", e.target.value)}>
                    <option value="">Aucun</option>
                    <option value="entree">Entrée privée</option>
                    <option value="garage_simple">Garage simple</option>
                    <option value="garage_double">Garage double</option>
                    <option value="interieur">Stationnement intérieur</option>
                  </select>
                </div>
              </div>
              <div className="mp-field full"><label>Description</label><div className="mp-field-input"><textarea placeholder="Décrivez votre propriété…" value={form.description} onChange={(e) => setField("description", e.target.value)} /></div></div>
            </div>

            {/* Accordion */}
            <div className="mp-accordion">
              <div className="mp-accordion-header" onClick={() => setAccOpen(!accOpen)}>
                <div><div className="mp-accordion-title">Détails supplémentaires</div><div className="mp-accordion-sub">Style, terrain, chauffage — optionnel</div></div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span className={`mp-accordion-badge${accFilled > 0 ? " filled" : ""}`}>{accFilled > 0 ? `${accFilled} champ${accFilled > 1 ? "s" : ""} rempli${accFilled > 1 ? "s" : ""}` : "Optionnel"}</span>
                  <svg className={`mp-accordion-chevron${accOpen ? " open" : ""}`} viewBox="0 0 16 16"><polyline points="3,6 8,11 13,6" /></svg>
                </div>
              </div>
              <div className={`mp-accordion-body${accOpen ? " open" : ""}`}>
                <div className="mp-grid" style={{ marginTop: 14 }}>
                  <div className="mp-field"><label>Style architectural</label><div className="mp-field-input"><select value={form.style} onChange={(e) => setField("style", e.target.value)}><option value="">— Sélectionner —</option><option value="maison_de_ville">Maison de ville</option><option value="cottage">Cottage</option><option value="bungalow">Bungalow</option><option value="bi_generation">Bi-génération</option><option value="loft">Loft</option><option value="penthouse">Penthouse</option></select></div></div>
                  <div className="mp-field"><label>Superficie du terrain</label><div className="mp-field-input"><input type="text" placeholder="2 400" value={form.superficieTerrain} onChange={(e) => setField("superficieTerrain", e.target.value)} /><span className="mp-unit">pi²</span></div></div>
                  <div className="mp-field"><label>Type de chauffage</label><div className="mp-field-input"><select value={form.chauffage} onChange={(e) => setField("chauffage", e.target.value)}><option value="">— Sélectionner —</option><option>Thermopompe</option><option>Électrique (plinthes)</option><option>Gaz naturel</option><option>Mazout</option><option>Géothermie</option></select></div></div>
                  <div className="mp-field"><label>Eau chaude</label><div className="mp-field-input"><select value={form.eauChaude} onChange={(e) => setField("eauChaude", e.target.value)}><option value="">— Sélectionner —</option><option>Électrique</option><option>Gaz naturel</option><option>Thermopompe</option><option>Solaire</option></select></div></div>
                  <div className="mp-field"><label>Sous-sol</label><div className="mp-field-input"><select value={form.sousSol} onChange={(e) => setField("sousSol", e.target.value)}><option value="">— Sélectionner —</option><option>Aménagé</option><option>Partiellement aménagé</option><option>Non aménagé</option><option>Aucun</option></select></div></div>
                  <div className="mp-field"><label>Piscine</label><div className="mp-field-input"><select value={form.piscine} onChange={(e) => setField("piscine", e.target.value)}><option value="">— Sélectionner —</option><option>Aucune</option><option>Creusée</option><option>Hors-terre</option></select></div></div>
                </div>
              </div>
            </div>
            <div className="mp-form-footer"><span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>Étape 1 sur 4</span><button className="mp-btn-primary-lg" onClick={() => goStep(2)}>Continuer →</button></div>
          </div>
        )}

        {/* Step 2 — Photos & docs */}
        {current === 2 && (
          <div className="mp-form-card">
            <div className="mp-form-section-title">Photos de la propriété</div>
            <div className="mp-photo-grid">
              {images.map((img, i) => (
                <div key={i} className="mp-photo-slot filled" style={{ position: "relative" }} onClick={() => removeImage(i)}>
                  <Image src={img.preview || img.url} alt="" fill sizes="100px" style={{ objectFit: "cover", borderRadius: 8 }} />
                  {i === 0 && <span className="mp-photo-main-tag">Principale</span>}
                </div>
              ))}
              {images.length < 14 && (
                <div className="mp-photo-slot" onClick={() => fileRef.current?.click()}>
                  {uploading ? <span style={{ fontSize: 11, color: "var(--text-tertiary)" }}>…</span> : <svg viewBox="0 0 20 20"><line x1="10" y1="4" x2="10" y2="16" /><line x1="4" y1="10" x2="16" y2="10" /></svg>}
                </div>
              )}
              {Array.from({ length: Math.max(0, 4 - images.length - 1) }, (_, i) => (
                <div key={`e-${i}`} className="mp-photo-slot"><svg viewBox="0 0 20 20"><rect x="1" y="4" width="18" height="13" rx="2" strokeDasharray="2 1" /></svg></div>
              ))}
            </div>
            <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
            <div style={{ fontSize: 12, color: "var(--text-tertiary)", marginBottom: 16 }}>{images.length} / 14 photos · Cliquer pour supprimer</div>

            <div className="mp-divider" />
            <div className="mp-form-section-title">Documents</div>
            {docs.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 12 }}>
                {docs.map((d, i) => (
                  <div key={i} style={{ fontSize: 12, color: "var(--text-tertiary)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>{d.nom} {d.taille && `· ${d.taille}`}</span>
                    <button onClick={() => removeDoc(i)} style={{ fontSize: 11, color: "var(--red-text)", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>Retirer</button>
                  </div>
                ))}
              </div>
            )}
            <div className="mp-upload-zone" onClick={() => docRef.current?.click()}>
              <svg viewBox="0 0 28 28"><rect x="2" y="4" width="24" height="20" rx="3" /><line x1="8" y1="10" x2="20" y2="10" /><line x1="8" y1="14" x2="20" y2="14" /><line x1="8" y1="18" x2="14" y2="18" /></svg>
              <div className="mp-upload-zone-title">Ajouter des documents</div>
              <div className="mp-upload-zone-sub">PDF, images · 10 Mo max par fichier</div>
            </div>
            <input ref={docRef} type="file" multiple className="hidden" onChange={handleDocUpload} />

            <div className="mp-divider" />
            <div className="mp-form-section-title">Visite virtuelle</div>
            <div className="mp-field">
              <label>Lien externe <span style={{ fontWeight: 400, color: "var(--text-tertiary)" }}>(optionnel)</span></label>
              <div className="mp-field-input"><input type="url" placeholder="https://my.matterport.com/..." value={form.lienVisite} onChange={(e) => setField("lienVisite", e.target.value)} /></div>
            </div>
            <div className="mp-form-footer"><button className="mp-btn-secondary" onClick={() => goStep(1)}>← Retour</button><button className="mp-btn-primary-lg" onClick={() => goStep(3)}>Continuer →</button></div>
          </div>
        )}

        {/* Step 3 — Prix & confidentialité */}
        {current === 3 && (
          <div className="mp-form-card">
            <div className="mp-form-section-title">Prix et informations financières</div>
            <div className="mp-grid">
              <div className="mp-field"><label>Prix demandé</label><div className="mp-field-input"><input type="text" placeholder="895 000" value={form.prix} onChange={(e) => setField("prix", e.target.value)} /><span className="mp-unit">$</span></div></div>
              <div className="mp-field"><label>Taxes municipales</label><div className="mp-field-input"><input type="text" placeholder="4 820" value={form.taxesMunicipales} onChange={(e) => setField("taxesMunicipales", e.target.value)} /><span className="mp-unit">$ / an</span></div></div>
              <div className="mp-field"><label>Taxes scolaires</label><div className="mp-field-input"><input type="text" placeholder="680" value={form.taxesScolaires} onChange={(e) => setField("taxesScolaires", e.target.value)} /><span className="mp-unit">$ / an</span></div></div>
              <div className="mp-field"><label>Frais de condo</label><div className="mp-field-input"><input type="text" placeholder="0 si non applicable" value={form.fraisCondo} onChange={(e) => setField("fraisCondo", e.target.value)} /><span className="mp-unit">$ / mois</span></div></div>
            </div>
            <div className="mp-divider" />
            <div className="mp-form-section-title">Confidentialité et contact</div>
            <div className={`mp-check-item${form.anonyme ? " checked" : ""}`} style={{ marginBottom: 12 }} onClick={() => setField("anonyme", !form.anonyme)}>
              <input type="checkbox" checked={form.anonyme} readOnly />
              Publier de façon anonyme
            </div>
            <div className="mp-field">
              <label>Numéro de téléphone <span style={{ fontWeight: 400, color: "var(--text-tertiary)" }}>(optionnel)</span></label>
              <div className="mp-field-input"><input type="tel" placeholder="514 555-1234" value={form.telephone} onChange={(e) => setField("telephone", e.target.value)} /></div>
            </div>
            <div className="mp-form-footer"><button className="mp-btn-secondary" onClick={() => goStep(2)}>← Retour</button><button className="mp-btn-primary-lg" onClick={() => goStep(4)}>Continuer →</button></div>
          </div>
        )}

        {/* Step 4 — Révision */}
        {current === 4 && (
          <div className="mp-form-card">
            <div className="mp-form-section-title">Révision des modifications</div>
            <div className="mp-summary-grid">
              <div className="mp-summary-row"><span>Type</span><span>{form.type || "—"}</span></div>
              <div className="mp-summary-row"><span>Prix</span><span>{form.prix ? parseNum(form.prix).toLocaleString("fr-CA") + " $" : "—"}</span></div>
              <div className="mp-summary-row"><span>Ville</span><span>{villes.find((v) => v.slug === form.villeSlug)?.nom ?? "—"}</span></div>
              <div className="mp-summary-row"><span>Quartier</span><span>{quartiersDispo.find((q) => q.slug === form.quartierSlug)?.nom ?? "—"}</span></div>
              <div className="mp-summary-row"><span>Adresse</span><span>{form.adresse || "—"}</span></div>
              <div className="mp-summary-row"><span>Photos</span><span>{images.length}</span></div>
              <div className="mp-summary-row"><span>Anonyme</span><span>{form.anonyme ? "Oui" : "Non"}</span></div>
              <div className="mp-summary-row"><span>Téléphone</span><span>{form.telephone || "Non affiché"}</span></div>
            </div>

            {form.adresse && (
              <div style={{ borderRadius: 12, overflow: "hidden", border: "0.5px solid var(--border)", height: 160, marginBottom: 16 }}>
                <iframe title="Localisation" width="100%" height="100%" style={{ border: 0 }} loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={`https://www.google.com/maps?q=${encodeURIComponent(form.adresse + ", Québec, Canada")}&output=embed`} />
              </div>
            )}

            <div className="mp-form-footer">
              <button className="mp-btn-secondary" onClick={() => goStep(3)}>← Retour</button>
              <button className="mp-btn-primary-lg" disabled={submitting} onClick={handleSave}>
                {submitting ? "Enregistrement…" : "Enregistrer les modifications"}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
