"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/Header";
import { ListingActions } from "@/components/ListingActions";
import { ReportButton } from "@/components/ReportButton";
import { useLightbox } from "@/components/LightboxProvider";
import { SellerRating } from "@/components/SellerRating";
import { SellerDashboard } from "@/components/SellerDashboard";
import { ImageCarousel } from "@/components/ImageCarousel";
import { PriceBadge } from "@/components/PriceBadge";
import { quartierBySlug } from "@/lib/data";
import { getMarketEstimate } from "@/lib/marketEstimate";
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
  mode: string;
  type: string;
  style: string | null;
  sousType: string | null;
  quartierSlug: string;
  villeSlug: string;
  adresse: string;
  chambres: number;
  sallesDeBain: number;
  sallesEau: number;
  superficie: number;
  superficieTerrain: number | null;
  anneeConstruction: number | null;
  stationnement: string | null;
  chauffage: string | null;
  eauChaude: string | null;
  climatisation: string | null;
  sousSol: string | null;
  revetement: string | null;
  extras: string | null;
  stInterieur: number | null;
  stExterieur: number | null;
  prixNegociable: boolean;
  nbLogements: number | null;
  revenusBruts: number | null;
  depensesAnnuelles: number | null;
  logementsLibres: number | null;
  occupationProprio: boolean;
  contactPrefere: string | null;
  courriel: string | null;
  disponibilites: string | null;
  taxesMunicipales: number | null;
  taxesScolaires: number | null;
  fraisCondo: number | null;
  lienVisite: string | null;
  mls: string | null;
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
  const { openLightbox } = useLightbox();
  const { data: session } = useSession();

  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFav, setIsFav] = useState(false);
  const [sent, setSent] = useState(false);
  const [contactMsg, setContactMsg] = useState("Bonjour, je suis intéressé par votre propriété. Serait-il possible de planifier une visite?");
  const [sending, setSending] = useState(false);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [newComment, setNewComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [similar, setSimilar] = useState<{ id: string; titre: string; prix: number; type: string; quartierSlug: string; imageUrl: string | null; chambres: number; sallesDeBain: number; superficie: number }[]>([]);

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

  // Record in browsing history for logged-in users
  useEffect(() => {
    if (session?.user) {
      fetch("/api/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetType: "listing", targetId: id }),
      }).catch(() => {});
    }
  }, [id, session?.user]);

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

  const STYLE_LABELS: Record<string, string> = {
    "detache": "Détaché", "jumele": "Jumelé", "maison-de-ville": "Maison de ville",
    "plain-pied": "Plain-pied", "a-etages": "À étages", "bi_generation": "Bi-génération",
  };
  const CLIMAT_LABELS: Record<string, string> = {
    "aucune": "Aucune", "mural": "Mural", "central": "Central", "thermopompe": "Thermopompe",
  };
  const SOUSSOL_LABELS: Record<string, string> = {
    "aucun": "Aucun", "non-fini": "Non fini", "semi-fini": "Semi-fini", "fini": "Fini",
  };

  const details: [string, string][] = [
    ["Type", TYPE_LABELS[listing.type] ?? listing.type],
    ...(listing.sousType ? [["Sous-type", STYLE_LABELS[listing.sousType] ?? listing.sousType] as [string, string]] : []),
    ...(listing.style ? [["Style", STYLE_LABELS[listing.style] ?? listing.style] as [string, string]] : []),
    ...(listing.superficieTerrain ? [["Superficie terrain", `${listing.superficieTerrain.toLocaleString("fr-CA")} pi²`] as [string, string]] : []),
    ...(listing.anneeConstruction ? [["Année de construction", String(listing.anneeConstruction)] as [string, string]] : []),
    ...(listing.chauffage ? [["Chauffage", listing.chauffage.charAt(0).toUpperCase() + listing.chauffage.slice(1)] as [string, string]] : []),
    ...(listing.eauChaude ? [["Eau chaude", listing.eauChaude.charAt(0).toUpperCase() + listing.eauChaude.slice(1)] as [string, string]] : []),
    ...(listing.climatisation && listing.climatisation !== "aucune" ? [["Climatisation", CLIMAT_LABELS[listing.climatisation] ?? listing.climatisation] as [string, string]] : []),
    ...(listing.sousSol ? [["Sous-sol", SOUSSOL_LABELS[listing.sousSol] ?? listing.sousSol] as [string, string]] : []),
    ...(listing.revetement ? [["Revêtement", listing.revetement.charAt(0).toUpperCase() + listing.revetement.slice(1)] as [string, string]] : []),
    ...(listing.stInterieur ? [["Stationnement intérieur", `${listing.stInterieur} place${listing.stInterieur > 1 ? "s" : ""}`] as [string, string]] : []),
    ...(listing.stExterieur ? [["Stationnement extérieur", `${listing.stExterieur} place${listing.stExterieur > 1 ? "s" : ""}`] as [string, string]] : []),
    ...(listing.stationnement && !listing.stInterieur && !listing.stExterieur ? [["Stationnement", STATIONNEMENT_LABELS[listing.stationnement] ?? listing.stationnement] as [string, string]] : []),
    ...(listing.prixNegociable === false ? [["Prix", "Ferme (non négociable)"] as [string, string]] : []),
    ...(listing.taxesMunicipales ? [["Taxes municipales", `${listing.taxesMunicipales.toLocaleString("fr-CA")} $ / an`] as [string, string]] : []),
    ...(listing.taxesScolaires ? [["Taxes scolaires", `${listing.taxesScolaires.toLocaleString("fr-CA")} $ / an`] as [string, string]] : []),
    ...(listing.fraisCondo ? [["Frais de condo", `${listing.fraisCondo.toLocaleString("fr-CA")} $ / mois`] as [string, string]] : []),
    ...(listing.nbLogements ? [["Nombre de logements", String(listing.nbLogements)] as [string, string]] : []),
    ...(listing.revenusBruts ? [["Revenus bruts", `${listing.revenusBruts.toLocaleString("fr-CA")} $ / an`] as [string, string]] : []),
    ...(listing.depensesAnnuelles ? [["Dépenses annuelles", `${listing.depensesAnnuelles.toLocaleString("fr-CA")} $ / an`] as [string, string]] : []),
    ...(listing.disponibilites ? [["Disponibilités visites", listing.disponibilites.charAt(0).toUpperCase() + listing.disponibilites.slice(1)] as [string, string]] : []),
  ];

  // Parse extras JSON
  let extrasLabels: string[] = [];
  if (listing.extras) {
    try {
      const parsed = JSON.parse(listing.extras);
      const EXTRA_LABELS: Record<string, string> = {
        garage: "Garage", "piscine-creusee": "Piscine creusée", "piscine-hors-sol": "Piscine hors-sol",
        spa: "Spa", foyer: "Foyer", "borne-ve": "Borne VÉ", "acces-pmr": "Accès PMR",
        cabanon: "Cabanon", serre: "Serre", alarme: "Système d'alarme",
      };
      extrasLabels = (parsed as string[]).map((e: string) => EXTRA_LABELS[e] ?? e);
    } catch { /* ignore */ }
  }

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

        {/* Seller dashboard */}
        {listing.isOwner && (
          <SellerDashboard listingId={listing.id} />
        )}

        <div className="mp-detail-layout">
          <div>
            {/* Gallery Carousel */}
            <div style={{ position: "relative" }}>
              <ImageCarousel
                images={listing.images}
                onImageClick={(index) => openLightbox(listing.images.map((img) => img.url), index)}
              />
              {listing.lienVisite && listing.images.length > 0 && (
                <div style={{ position: "absolute", top: 12, left: 12, fontSize: 11, padding: "3px 9px", borderRadius: 20, background: "var(--blue-bg)", color: "var(--blue-text)", fontWeight: 500, zIndex: 2 }}>
                  Visite 360°
                </div>
              )}
            </div>

            {/* Price + type */}
            <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 6, flexWrap: "wrap" }}>
              <div className="mp-detail-price">{fmtPrice(listing.prix)}</div>
              <div className="mp-detail-type">{TYPE_LABELS[listing.type] ?? listing.type} · {quartierNom}</div>
              <PriceBadge prix={listing.prix} estimatedValue={getMarketEstimate(listing.quartierSlug, listing.type)} quartierNom={quartierNom} type={listing.type} />
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

            {/* Extras */}
            {extrasLabels.length > 0 && (
              <div className="mp-section">
                <div className="mp-section-title">Caractéristiques</div>
                <div className="flex flex-wrap gap-2">
                  {extrasLabels.map((label) => (
                    <span key={label} className="text-[12px] px-3 py-1.5 rounded-full" style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)", border: "0.5px solid var(--border)" }}>
                      {label}
                    </span>
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
                          <Image src={c.auteurImage} alt="" width={32} height={32} className="rounded-full object-cover" loading="lazy" />
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
                  <Image src={listing.auteur.image} alt="" width={40} height={40} className="rounded-full object-cover" loading="lazy" />
                ) : (
                  <div className="mp-seller-av">{initials}</div>
                )}
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{listing.auteur.username}</div>
                  <span className="mp-seller-badge">{listing.auteur.anonyme ? "Propriétaire anonyme" : "Propriétaire"}</span>
                  <div style={{ marginTop: 4 }}>
                    <SellerRating sellerId={listing.auteur.id} compact />
                  </div>
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

              {listing.mls && (
                <div style={{ padding: "12px 14px", borderRadius: 8, background: "var(--bg-secondary)", fontSize: 13, marginBottom: 12 }}>
                  <span style={{ color: "var(--text-tertiary)", fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.5px" }}>MLS</span>
                  <span style={{ fontWeight: 600, marginLeft: 8, color: "var(--text-primary)" }}>{listing.mls}</span>
                  <div style={{ display: "flex", gap: 12, marginTop: 6, fontSize: 12 }}>
                    <a href={`https://www.centris.ca/fr/propriete~a-vendre?uc=0&view=Summary&search=mls%3D${listing.mls}`} target="_blank" rel="noopener noreferrer" style={{ color: "var(--green)" }}>Centris →</a>
                    <a href={`https://www.realtor.ca/map#view=list&Sort=6-D&GeoIds=g30_dpz89rm7&GeoName=Qu%C3%A9bec&PropertyTypeGroupID=1&PropertySearchTypeId=1&TransactionTypeId=2&MlsNumber=${listing.mls}`} target="_blank" rel="noopener noreferrer" style={{ color: "var(--green)" }}>Realtor.ca →</a>
                  </div>
                </div>
              )}

              {!sent ? (
                <div className="mp-contact-form">
                  <textarea
                    value={contactMsg}
                    onChange={(e) => setContactMsg(e.target.value)}
                    placeholder="Bonjour, je suis intéressé par votre propriété. Serait-il possible de planifier une visite?"
                  />
                  <button className="mp-send-btn" onClick={async () => {
                    if (!contactMsg.trim()) return;
                    setSending(true);
                    try {
                      const res = await fetch("/api/conversations", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ recipientId: listing.auteur.id, listingId: listing.id, message: contactMsg }),
                      });
                      if (res.ok) setSent(true);
                    } catch { /* ignore */ }
                    setSending(false);
                  }} disabled={sending}>
                    {sending ? "Envoi..." : "Envoyer le message"}
                  </button>
                </div>
              ) : (
                <div className="mp-sent-msg">
                  Message envoyé. <Link href="/messages" style={{ color: "var(--green-text)", textDecoration: "underline" }}>Voir mes messages</Link>
                </div>
              )}

              <div className="mp-action-row">
                <button className={`mp-action-btn fav${isFav ? " active" : ""}`} onClick={toggleFav}>
                  <svg viewBox="0 0 14 14" style={{ fill: isFav ? "#E24B4A" : "none" }}><path d="M7 12S1 8 1 4.5A3.5 3.5 0 017 2.6 3.5 3.5 0 0113 4.5C13 8 7 12 7 12z" /></svg>
                  Sauvegarder
                </button>
                <button className="mp-action-btn" onClick={() => {
                  if (navigator.share) { navigator.share({ title: listing.titre, url: window.location.href }).catch(() => {}); }
                  else { navigator.clipboard.writeText(window.location.href); }
                }}>
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

              {/* Owner actions or Report */}
              {listing.isOwner ? (
                <ListingActions
                  listingId={listing.id}
                  statut={listing.statut}
                />
              ) : (
                <div style={{ marginTop: 14, paddingTop: 14, borderTop: "0.5px solid var(--border)", display: "flex", justifyContent: "flex-end" }}>
                  <ReportButton type="listing" targetId={listing.id} />
                </div>
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
                        <Image src={s.imageUrl} alt={s.titre} fill sizes="280px" style={{ objectFit: "cover" }} loading="lazy" />
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

    </>
  );
}
