"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { quartierBySlug, villeBySlug } from "@/lib/data";

type ListingItem = {
  id: string;
  titre: string;
  prix: number;
  type: string;
  quartierSlug: string;
  villeSlug: string;
  adresse: string;
  chambres: number;
  sallesDeBain: number;
  superficie: number;
  lienVisite: string | null;
  imageUrl: string | null;
  statut: string;
  nbFavoris: number;
  creeLe: string;
};

const TYPE_LABELS: Record<string, string> = {
  unifamiliale: "Unifamiliale", condo: "Condo", duplex: "Duplex", triplex: "Triplex", quadruplex: "Quadruplex",
  maison_de_ville: "Maison de ville", terrain: "Terrain", commercial: "Commercial",
};

function fmtPrice(p: number) { return p.toLocaleString("fr-CA") + " $"; }

type Props = {
  listings: ListingItem[];
  favs: Set<string>;
  onToggleFav: (id: string, e: React.MouseEvent) => void;
  onTrackClick: (id: string) => void;
  quartierFilter: string;
  villeFilter?: string;
};

export function AnnonceMapView({ listings, favs, onToggleFav, onTrackClick, quartierFilter, villeFilter }: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedListing, setSelectedListing] = useState<string | null>(null);

  // Build map query: center on selected listing address, then quartier, then ville filter, then first listing's ville
  const mapCenter = (() => {
    if (quartierFilter) {
      const q = quartierBySlug[quartierFilter];
      return q ? `${q.nom}, Québec, Canada` : "Montréal, Québec, Canada";
    }
    if (villeFilter) {
      const v = villeBySlug[villeFilter];
      return v ? `${v.nom}, Québec, Canada` : "Montréal, Québec, Canada";
    }
    if (listings.length > 0) {
      const ville = villeBySlug[listings[0].villeSlug];
      return ville ? `${ville.nom}, Québec, Canada` : "Montréal, Québec, Canada";
    }
    return "Montréal, Québec, Canada";
  })();

  // When a listing is selected, center the map on its full address
  const selectedAddr = selectedListing
    ? listings.find((l) => l.id === selectedListing)?.adresse
    : null;
  const activeMapQuery = selectedAddr
    ? encodeURIComponent(selectedAddr + ", Québec, Canada")
    : encodeURIComponent(mapCenter);

  // Group listings by quartier for the sidebar
  const grouped: Record<string, ListingItem[]> = {};
  listings.forEach((l) => {
    const q = quartierBySlug[l.quartierSlug];
    const key = q?.nom ?? l.quartierSlug;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(l);
  });

  return (
    <div className="mp-map-layout">
      {/* Map panel */}
      <div className="mp-map-panel">
        <iframe
          title="Carte des annonces"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://www.google.com/maps?q=${activeMapQuery}&output=embed&z=13`}
        />
        {selectedListing && (
          <button
            className="mp-map-reset-btn"
            onClick={() => setSelectedListing(null)}
          >
            Vue d&apos;ensemble
          </button>
        )}
      </div>

      {/* Listings sidebar */}
      <div className="mp-map-sidebar">
        <div className="mp-map-sidebar-header">
          <span>{listings.length} annonce{listings.length !== 1 ? "s" : ""}</span>
          {selectedListing && (
            <button
              className="mp-map-clear-btn"
              onClick={() => setSelectedListing(null)}
            >
              Tout afficher
            </button>
          )}
        </div>

        <div className="mp-map-listings-scroll">
          {listings.length === 0 ? (
            <div className="mp-map-empty">
              <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 6 }}>Aucune annonce</div>
              <div style={{ fontSize: 12, color: "var(--text-tertiary)" }}>Aucun résultat pour ces filtres.</div>
            </div>
          ) : (
            Object.entries(grouped).map(([quartierNom, items]) => (
              <div key={quartierNom} className="mp-map-group">
                <div className="mp-map-group-header">
                  <span className="mp-map-group-dot" />
                  {quartierNom}
                  <span className="mp-map-group-count">{items.length}</span>
                </div>
                {items.map((l) => (
                  <div
                    key={l.id}
                    className={`mp-map-card${hoveredId === l.id ? " hovered" : ""}${selectedListing === l.id ? " selected" : ""}`}
                    onMouseEnter={() => setHoveredId(l.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onClick={() => setSelectedListing(selectedListing === l.id ? null : l.id)}
                  >
                    <div className="mp-map-card-img">
                      {l.imageUrl ? (
                        <Image src={l.imageUrl} alt={l.titre} fill sizes="80px" style={{ objectFit: "cover" }} />
                      ) : (
                        <svg viewBox="0 0 32 32"><rect x="2" y="10" width="28" height="20" rx="2" /><path d="M2 14l14-10 14 10" /><rect x="12" y="20" width="8" height="10" /></svg>
                      )}
                    </div>
                    <div className="mp-map-card-body">
                      <div className="mp-map-card-price">{fmtPrice(l.prix)}</div>
                      <div className="mp-map-card-type">{TYPE_LABELS[l.type] ?? l.type}</div>
                      <div className="mp-map-card-address">{l.adresse}</div>
                      <div className="mp-map-card-specs">
                        {l.chambres} ch. · {l.sallesDeBain} sdb · {l.superficie.toLocaleString("fr-CA")} pi²
                      </div>
                    </div>
                    <div className="mp-map-card-actions">
                      <Link
                        href={`/annonces/${l.id}`}
                        onClick={(e) => { e.stopPropagation(); onTrackClick(l.id); }}
                        className="mp-map-card-link"
                      >
                        Voir
                      </Link>
                      <button
                        className={`mp-fav-btn mp-map-fav${favs.has(l.id) ? " active" : ""}`}
                        onClick={(e) => { e.stopPropagation(); onToggleFav(l.id, e); }}
                      >
                        <svg viewBox="0 0 14 14"><path d="M7 12S1 8 1 4.5A3.5 3.5 0 017 2.6 3.5 3.5 0 0113 4.5C13 8 7 12 7 12z" /></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
