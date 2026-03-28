"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/Header";
import { ListingActions } from "@/components/ListingActions";
import { quartierBySlug } from "@/lib/data";
import "../marketplace.css";

type CommentItem = {
  id: string;
  contenu: string;
  auteurNom: string;
  auteurId: string | null;
  auteurImage: string | null;
  auteurUsername: string;
  creeLe: string;
};

type ListingDetail = {
  id: string;
  titre: string;
  description: string;
  prix: number;
  type: string;
  style: string | null;
  quartierSlug: string;
  villeSlug: string;
  adresse: string;
  chambres: number;
  sallesDeBain: number;
  superficie: number;
  superficieTerrain: number | null;
  anneeConstruction: number | null;
  stationnement: string | null;
  chauffage: string | null;
  eauChaude: string | null;
  taxesMunicipales: number | null;
  taxesScolaires: number | null;
  fraisCondo: number | null;
  lienVisite: string | null;
  anonyme: boolean;
  telephone: string | null;
  statut: string;
  nbVues: number;
  nbClics: number;
  nbFavoris: number;
  nbCommentaires: number;
  isFavorited: boolean;
  isOwner: boolean;
  creeLe: string;
  images: { id: string; url: string; principale: boolean }[];
  documents: { id: string; nom: string; url: string; taille: string | null }[];
  commentaires: CommentItem[];
  prixHistorique: { id: string; prix: number; evenement: string; creeLe: string }[];
  auteur: { id: string; username: string; image: string | null; memberSince: string; anonyme: boolean };
};

const TYPE_LABELS: Record<string, string> = {
  unifamiliale: "Unifamiliale", condo: "Condo", duplex: "Duplex", triplex: "Triplex", quadruplex: "Quadruplex",
};
const STATIONNEMENT_LABELS: Record<string, string> = {
  aucun: "Aucun", entree: "Entrée privée", garage_simple: "Garage simple", garage_double: "Garage double", interieur: "Stationnement intérieur",
};

function fmtPrice(p: number) { return p.toLocaleString("fr-CA") + " $"; }
function daysSince(d: string) { return Math.floor((Date.now() - new Date(d).getTime()) / 86400000); }
function timeAgo(d: string) {
  const days = daysSince(d);
  if (days === 0) return "aujourd'hui";
  if (days === 1) return "hier";
  if (days < 7) return `il y a ${days}j`;
  return new Date(d).toLocaleDateString("fr-CA", { day: "numeric", month: "short" });
}

export function AnnonceDetailView() {
  const params = useParams();
  const id = params.id as string;

  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFav, setIsFav] = useState(false);
  const [sent, setSent] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [newComment, setNewComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [similar, setSimilar] = useState<{ id: string; titre: string; prix: number; type: string; quartierSlug: string; imageUrl: string | null; chambres: number; sallesDeBain: number; superficie: number }[]>([]);
  const touchStart = useRef<number | null>(null);

  const goPrev = useCallback(() => {
    if (!listing) return;
    setGalleryIndex((i) => (i - 1 + listing.images.length) % listing.images.length);
  }, [listing]);

  const goNext = useCallback(() => {
    if (!listing) return;
    setGalleryIndex((i) => (i + 1) % listing.images.length);
  }, [listing]);

  useEffect(() => {
    fetch(`/api/annonces/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) return;
        setListing(data);
        setIsFav(data.isFavorited);
        setComments(data.commentaires ?? []);
        // Fetch similar
        const sp = new URLSearchParams({ quartierSlug: data.quartierSlug, excludeId: id, limit: "3" });
        fetch(`/api/annonces?${sp}`).then((r) => r.json()).then((s) => setSimilar(s.listings ?? [])).catch(() => {});
      })
      .finally(() => setLoading(false));
  }, [id]);

  async function toggleFav() {
    setIsFav(!isFav);
    await fetch(`/api/annonces/${id}/favorite`, { method: "POST" });
  }

  async function submitComment() {
    if (!newComment.trim()) return;
    setCommentLoading(true);
    try {
      const res = await fetch(`/api/annonces/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contenu: newComment }),
      });
      const data = await res.json();
      if (res.ok) {
        setComments((prev) => [data, ...prev]);
        setNewComment("");
      }
    } catch { /* ignore */ }
    setCommentLoading(false);
  }

  if (loading) {
    return (
      <><Header /><div className="max-w-[900px] mx-auto px-4 py-20 text-center" style={{ color: "var(--text-tertiary)", fontSize: 13 }}>Chargement…</div></>
    );
  }

  if (!listing) {
    return (
      <><Header /><div className="max-w-[900px] mx-auto px-4 py-20 text-center"><div style={{ fontSize: 18, fontWeight: 500, marginBottom: 8 }}>Annonce introuvable</div><Link href="/annonces" className="mp-btn-primary">Voir les annonces</Link></div></>
    );
  }

  const q = quartierBySlug[listing.quartierSlug];
  const quartierNom = q?.nom ?? listing.quartierSlug;
  const initials = listing.auteur.anonyme ? "?" : listing.auteur.username.slice(0, 2).toUpperCase();
  const daysOnline = daysSince(listing.creeLe);

  const details: [string, string][] = [
    ["Type", TYPE_LABELS[listing.type] ?? listing.type],
    ...(listing.style ? [["Style", listing.style] as [string, string]] : []),
    ...(listing.superficieTerrain ? [["Superficie terrain", `${listing.superficieTerrain.toLocaleString("fr-CA")} pi²`] as [string, string]] : []),
    ...(listing.stationnement ? [["Stationnement", STATIONNEMENT_LABELS[listing.stationnement] ?? listing.stationnement] as [string, string]] : []),
    ...(listing.chauffage ? [["Chauffage", listing.chauffage] as [string, string]] : []),
    ...(listing.eauChaude ? [["Eau chaude", listing.eauChaude] as [string, string]] : []),
    ...(listing.taxesMunicipales ? [["Taxes municipales", `${listing.taxesMunicipales.toLocaleString("fr-CA")} $ / an`] as [string, string]] : []),
    ...(listing.taxesScolaires ? [["Taxes scolaires", `${listing.taxesScolaires.toLocaleString("fr-CA")} $ / an`] as [string, string]] : []),
    ...(listing.fraisCondo ? [["Frais de condo", `${listing.fraisCondo.toLocaleString("fr-CA")} $ / mois`] as [string, string]] : []),
  ];

  const mapQuery = encodeURIComponent(listing.adresse + ", Québec, Canada");

  return (
    <>
      <Header />
      <div className="max-w-[900px] mx-auto px-4 pb-10">
        <div className="mp-breadcrumb" style={{ marginTop: 20 }}>
          <Link href="/annonces">Annonces</Link><span>/</span>
          <span>{quartierNom}</span><span>/</span>
          <span>{TYPE_LABELS[listing.type] ?? listing.type}</span>
        </div>

        {/* Owner stats banner */}
        {listing.isOwner && (
          <div
            style={{ display: "flex", alignItems: "center", gap: 20, padding: "12px 16px", borderRadius: 12, marginBottom: 16, background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
          >
            <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: 0.5 }}>
              Tableau de bord
            </div>
            <div style={{ display: "flex", gap: 16, flex: 1 }}>
              {[
                { label: "Vues", value: listing.nbVues, icon: "👁" },
                { label: "Clics", value: listing.nbClics, icon: "🖱" },
                { label: "Favoris", value: listing.nbFavoris, icon: "♥" },
                { label: "Commentaires", value: listing.nbCommentaires, icon: "💬" },
              ].map((s) => (
                <div key={s.label} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 18, fontWeight: 600, color: "var(--text-primary)" }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: "var(--text-tertiary)" }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <span
                className="text-[10px] font-medium px-2 py-0.5 rounded-md"
                style={{
                  background: listing.statut === "active" ? "var(--green-light-bg)" : listing.statut === "vendu" ? "var(--red-bg)" : "var(--bg-secondary)",
                  color: listing.statut === "active" ? "var(--green-text)" : listing.statut === "vendu" ? "var(--red-text)" : "var(--text-tertiary)",
                }}
              >
                {listing.statut === "active" ? "Active" : listing.statut === "vendu" ? "Vendu" : "Retiré"}
              </span>
            </div>
          </div>
        )}

        <div className="mp-detail-layout">
          <div>
            {/* Gallery */}
            {listing.images.length > 0 ? (
              <div className="mp-gallery">
                <div className="mp-gallery-main" style={{ position: "relative", cursor: "pointer" }} onClick={() => setLightbox(true)}>
                  <Image src={listing.images[galleryIndex]?.url ?? listing.images[0].url} alt={listing.titre} fill sizes="450px" style={{ objectFit: "cover" }} />
                  {listing.lienVisite && <div className="mp-gallery-badge">Visite 360°</div>}
                  <div className="mp-gallery-count">{galleryIndex + 1} / {listing.images.length}</div>
                </div>
                {listing.images.slice(1, 3).map((img, i) => (
                  <div key={img.id} className="mp-gallery-thumb" style={{ position: "relative" }} onClick={() => setGalleryIndex(i + 1)}>
                    <Image src={img.url} alt="" fill sizes="225px" style={{ objectFit: "cover" }} />
                    {i === 1 && listing.images.length > 3 && (
                      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ color: "white", fontSize: 13, fontWeight: 500 }}>+{listing.images.length - 3} photos</span>
                      </div>
                    )}
                  </div>
                ))}
                {[...Array(Math.max(0, 2 - (listing.images.length - 1)))].map((_, i) => (
                  <div key={`ph-${i}`} className="mp-gallery-thumb"><div className="mp-gallery-placeholder"><svg viewBox="0 0 36 36"><rect x="2" y="8" width="32" height="22" rx="3" /><circle cx="11" cy="16" r="3" /><path d="M2 24l8-7 7 6 5-4 12 9" /></svg></div></div>
                ))}
              </div>
            ) : (
              <div className="mp-gallery">
                <div className="mp-gallery-main"><div className="mp-gallery-placeholder"><svg viewBox="0 0 36 36"><rect x="2" y="8" width="32" height="22" rx="3" /><circle cx="11" cy="16" r="3" /><path d="M2 24l8-7 7 6 5-4 12 9" /></svg></div></div>
                <div className="mp-gallery-thumb"><div className="mp-gallery-placeholder"><svg viewBox="0 0 36 36"><rect x="2" y="8" width="32" height="22" rx="3" /><circle cx="11" cy="16" r="3" /><path d="M2 24l8-7 7 6 5-4 12 9" /></svg></div></div>
                <div className="mp-gallery-thumb"><div className="mp-gallery-placeholder"><svg viewBox="0 0 36 36"><rect x="2" y="8" width="32" height="22" rx="3" /><circle cx="11" cy="16" r="3" /><path d="M2 24l8-7 7 6 5-4 12 9" /></svg></div></div>
              </div>
            )}

            {/* Price + type */}
            <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 6 }}>
              <div className="mp-detail-price">{fmtPrice(listing.prix)}</div>
              <div className="mp-detail-type">{TYPE_LABELS[listing.type] ?? listing.type} · {quartierNom}</div>
            </div>
            <div className="mp-detail-title">{listing.titre}</div>
            <div className="mp-detail-address">{listing.adresse}</div>

            {/* Specs */}
            <div className="mp-specs-row">
              <div className="mp-spec-item"><div className="mp-spec-val">{listing.chambres}</div><div className="mp-spec-lbl">Chambres</div></div>
              <div className="mp-spec-divider" />
              <div className="mp-spec-item"><div className="mp-spec-val">{listing.sallesDeBain}</div><div className="mp-spec-lbl">Salles de bain</div></div>
              <div className="mp-spec-divider" />
              <div className="mp-spec-item"><div className="mp-spec-val">{listing.superficie.toLocaleString("fr-CA")}</div><div className="mp-spec-lbl">pi²</div></div>
              {listing.anneeConstruction && (<><div className="mp-spec-divider" /><div className="mp-spec-item"><div className="mp-spec-val">{listing.anneeConstruction}</div><div className="mp-spec-lbl">Année</div></div></>)}
              <div className="mp-spec-divider" />
              <div className="mp-spec-item"><div className="mp-spec-val">{daysOnline} j</div><div className="mp-spec-lbl">En ligne</div></div>
            </div>

            {/* Description */}
            <div className="mp-section">
              <div className="mp-section-title">Description</div>
              <div className="mp-desc" style={{ whiteSpace: "pre-wrap" }}>{listing.description}</div>
            </div>

            {/* Details */}
            {details.length > 0 && (
              <div className="mp-section">
                <div className="mp-section-title">Détails de la propriété</div>
                <div className="mp-detail-grid">
                  {details.map(([label, value]) => (
                    <div key={label} className="mp-detail-row"><span>{label}</span><span>{value}</span></div>
                  ))}
                </div>
              </div>
            )}

            {/* Map */}
            <div className="mp-section">
              <div className="mp-section-title">Localisation</div>
              <div style={{ borderRadius: 12, overflow: "hidden", border: "0.5px solid var(--border)", height: 220 }}>
                <iframe
                  title="Localisation"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                />
              </div>
            </div>

            {/* Documents */}
            {listing.documents.length > 0 && (
              <div className="mp-section">
                <div className="mp-section-title">Documents disponibles</div>
                <div className="mp-doc-list">
                  {listing.documents.map((doc) => (
                    <a key={doc.id} href={doc.url} target="_blank" rel="noopener noreferrer" className="mp-doc-item">
                      <div className="mp-doc-icon"><svg viewBox="0 0 16 16"><rect x="2" y="1" width="12" height="14" rx="2" /><line x1="5" y1="5" x2="11" y2="5" /><line x1="5" y1="8" x2="11" y2="8" /><line x1="5" y1="11" x2="8" y2="11" /></svg></div>
                      <div><div className="mp-doc-name">{doc.nom}</div>{doc.taille && <div className="mp-doc-meta">{doc.taille}</div>}</div>
                      <span className="mp-doc-dl">Télécharger</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Price history */}
            {listing.prixHistorique && listing.prixHistorique.length > 0 && (
              <div className="mp-section">
                <div className="mp-section-title">Historique des prix</div>
                <div className="mp-price-history">
                  {listing.prixHistorique.map((ph, i) => {
                    const prevPrix = i > 0 ? listing.prixHistorique[i - 1].prix : null;
                    const delta = prevPrix ? ph.prix - prevPrix : null;
                    const eventLabel = ph.evenement === "mise_en_vente" ? "Mise en vente" : ph.evenement === "reduction" ? "Réduction de prix" : "Augmentation de prix";
                    return (
                      <div key={ph.id} className="mp-ph-item">
                        <span className="mp-ph-date">{new Date(ph.creeLe).toLocaleDateString("fr-CA", { month: "short", year: "numeric" })}</span>
                        <span className="mp-ph-event">{eventLabel}</span>
                        <span className="mp-ph-price">
                          {ph.prix.toLocaleString("fr-CA")} $
                          {delta !== null && delta !== 0 && (
                            <span className={`mp-ph-delta ${delta < 0 ? "down" : "up"}`}>
                              {delta > 0 ? "+" : ""}{delta.toLocaleString("fr-CA")} $
                            </span>
                          )}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Comments */}
            <div className="mp-section">
              <div className="mp-section-title">Commentaires ({comments.length})</div>
              {/* New comment form */}
              <div style={{ marginBottom: 16 }}>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Poser une question ou laisser un commentaire…"
                  style={{ width: "100%", fontSize: 13, padding: "10px 12px", borderRadius: 8, border: "0.5px solid var(--border-secondary)", background: "var(--bg-card)", color: "var(--text-primary)", fontFamily: "inherit", outline: "none", resize: "none", height: 70, lineHeight: 1.6 }}
                  onFocus={(e) => (e.target.style.borderColor = "var(--green)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--border-secondary)")}
                />
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 6 }}>
                  <button
                    className="mp-btn-primary"
                    style={{ borderRadius: 8, fontSize: 12 }}
                    disabled={commentLoading || !newComment.trim()}
                    onClick={submitComment}
                  >
                    {commentLoading ? "Envoi…" : "Commenter"}
                  </button>
                </div>
              </div>

              {comments.length === 0 ? (
                <div style={{ fontSize: 13, color: "var(--text-tertiary)", textAlign: "center", padding: 20 }}>
                  Aucun commentaire pour l&apos;instant. Sois le premier à poser une question.
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {comments.map((c) => (
                    <div key={c.id} style={{ display: "flex", gap: 10, padding: "10px 12px", borderRadius: 8, background: "var(--bg-secondary)" }}>
                      <div
                        style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--green-light-bg)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, color: "var(--green-text)", flexShrink: 0 }}
                      >
                        {c.auteurImage ? (
                          <Image src={c.auteurImage} alt="" width={32} height={32} className="rounded-full object-cover" />
                        ) : (
                          c.auteurUsername[0]?.toUpperCase() ?? "?"
                        )}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                          <span style={{ fontSize: 12, fontWeight: 500, color: "var(--text-primary)" }}>{c.auteurUsername}</span>
                          <span style={{ fontSize: 11, color: "var(--text-tertiary)" }}>{timeAgo(c.creeLe)}</span>
                        </div>
                        <div style={{ fontSize: 13, lineHeight: 1.55, color: "var(--text-secondary)", whiteSpace: "pre-wrap" }}>{c.contenu}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Contact card */}
          <div>
            <div className="mp-contact-card">
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, paddingBottom: 14, borderBottom: "0.5px solid var(--border)" }}>
                {listing.auteur.image && !listing.auteur.anonyme ? (
                  <Image src={listing.auteur.image} alt="" width={40} height={40} className="rounded-full object-cover" />
                ) : (
                  <div className="mp-seller-av">{initials}</div>
                )}
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{listing.auteur.username}</div>
                  <span className="mp-seller-badge">{listing.auteur.anonyme ? "Propriétaire anonyme" : "Propriétaire"}</span>
                </div>
              </div>

              {listing.telephone && (
                <a
                  href={`tel:${listing.telephone}`}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, width: "100%", padding: 10, borderRadius: 8, border: "0.5px solid var(--border-secondary)", background: "transparent", fontSize: 13, color: "var(--text-primary)", textDecoration: "none", marginBottom: 10, fontFamily: "inherit" }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" /></svg>
                  {listing.telephone}
                </a>
              )}

              {listing.lienVisite && (
                <a href={listing.lienVisite} target="_blank" rel="noopener noreferrer" className="mp-virtual-btn">
                  <svg viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" /><path d="M8 2a8 8 0 010 12M8 2a8 8 0 000 12" /><line x1="2" y1="8" x2="14" y2="8" /></svg>
                  Voir la visite virtuelle
                </a>
              )}

              {!sent ? (
                <div className="mp-contact-form">
                  <textarea placeholder="Bonjour, je suis intéressé par votre propriété. Serait-il possible de planifier une visite?" />
                  <input type="text" placeholder="Votre nom" />
                  <input type="email" placeholder="Votre courriel" />
                  <button className="mp-send-btn" onClick={() => setSent(true)}>Envoyer le message</button>
                </div>
              ) : (
                <div className="mp-sent-msg">Message envoyé. Le propriétaire vous répondra par courriel sous 24–48h.</div>
              )}

              <div className="mp-action-row">
                <button className={`mp-action-btn fav${isFav ? " active" : ""}`} onClick={toggleFav}>
                  <svg viewBox="0 0 14 14" style={{ fill: isFav ? "#E24B4A" : "none" }}><path d="M7 12S1 8 1 4.5A3.5 3.5 0 017 2.6 3.5 3.5 0 0113 4.5C13 8 7 12 7 12z" /></svg>
                  Sauvegarder
                </button>
                <button className="mp-action-btn">
                  <svg viewBox="0 0 14 14"><path d="M10 1l3 3-3 3M1 9v-1a4 4 0 014-4h8" /></svg>
                  Partager
                </button>
              </div>

              {/* Stats publiques */}
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: "0.5px solid var(--border)", display: "flex", justifyContent: "space-around", fontSize: 12, color: "var(--text-tertiary)" }}>
                <span>{listing.nbVues} vues</span>
                <span>{listing.nbFavoris} favoris</span>
                <span>{listing.nbCommentaires} commentaires</span>
              </div>

              {/* Owner actions */}
              {listing.isOwner && (
                <ListingActions
                  listingId={listing.id}
                  statut={listing.statut}
                />
              )}
            </div>
          </div>
        </div>

        {/* Similar listings */}
        {similar.length > 0 && (
          <div style={{ marginTop: 28 }}>
            <div className="mp-section-title">Annonces similaires</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
              {similar.map((s) => {
                const sq = quartierBySlug[s.quartierSlug];
                return (
                  <Link
                    key={s.id}
                    href={`/annonces/${s.id}`}
                    style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)", borderRadius: 12, overflow: "hidden", textDecoration: "none", color: "inherit" }}
                  >
                    <div style={{ height: 120, background: "var(--bg-secondary)", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {s.imageUrl ? (
                        <Image src={s.imageUrl} alt={s.titre} fill sizes="280px" style={{ objectFit: "cover" }} />
                      ) : (
                        <svg viewBox="0 0 32 32" width="28" height="28" fill="none" stroke="var(--text-tertiary)" strokeWidth="1"><rect x="2" y="10" width="28" height="20" rx="2" /><path d="M2 14l14-10 14 10" /></svg>
                      )}
                    </div>
                    <div style={{ padding: "10px 12px" }}>
                      <div style={{ fontSize: 16, fontWeight: 500 }}>{fmtPrice(s.prix)}</div>
                      <div style={{ fontSize: 12, color: "var(--text-tertiary)", marginTop: 2 }}>{TYPE_LABELS[s.type] ?? s.type} · {sq?.nom ?? s.quartierSlug}</div>
                      <div style={{ fontSize: 12, color: "var(--text-tertiary)", marginTop: 4, display: "flex", gap: 8 }}>
                        <span>{s.chambres} ch.</span>
                        <span>{s.sallesDeBain} sdb</span>
                        <span>{s.superficie.toLocaleString("fr-CA")} pi²</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && listing && listing.images.length > 0 && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.9)", display: "flex", alignItems: "center", justifyContent: "center", touchAction: "none" }}
          onClick={() => setLightbox(false)}
          onTouchStart={(e) => { touchStart.current = e.touches[0].clientX; }}
          onTouchEnd={(e) => {
            if (touchStart.current === null) return;
            const diff = e.changedTouches[0].clientX - touchStart.current;
            if (Math.abs(diff) > 50) { diff > 0 ? goPrev() : goNext(); }
            touchStart.current = null;
          }}
        >
          <button
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
            style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.15)", border: "none", cursor: "pointer", color: "white", fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            ‹
          </button>
          <div style={{ position: "relative", maxWidth: "90vw", maxHeight: "85vh", width: 900, aspectRatio: "4/3" }} onClick={(e) => e.stopPropagation()}>
            <Image
              src={listing.images[galleryIndex].url}
              alt={listing.titre}
              fill
              sizes="90vw"
              style={{ objectFit: "contain" }}
            />
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.15)", border: "none", cursor: "pointer", color: "white", fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            ›
          </button>
          <div style={{ position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)", color: "white", fontSize: 13 }}>
            {galleryIndex + 1} / {listing.images.length} — Glisser pour naviguer
          </div>
          <button
            onClick={() => setLightbox(false)}
            style={{ position: "absolute", top: 16, right: 16, width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.15)", border: "none", cursor: "pointer", color: "white", fontSize: 18 }}
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
}
