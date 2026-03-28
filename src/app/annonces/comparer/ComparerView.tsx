"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/Header";
import { quartierBySlug } from "@/lib/data";
import "../marketplace.css";

type CompareListing = {
  id: string;
  titre: string;
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
  taxesMunicipales: number | null;
  taxesScolaires: number | null;
  fraisCondo: number | null;
  imageUrl: string | null;
};

const TYPE_LABELS: Record<string, string> = {
  unifamiliale: "Unifamiliale",
  condo: "Condo",
  duplex: "Duplex",
  triplex: "Triplex",
  quadruplex: "Quadruplex",
};

const STYLE_LABELS: Record<string, string> = {
  maison_de_ville: "Maison de ville",
  cottage: "Cottage",
  bungalow: "Bungalow",
  loft: "Loft",
  split_level: "Split-level",
  contemporain: "Contemporain",
};

const STATIONNEMENT_LABELS: Record<string, string> = {
  aucun: "Aucun",
  entree: "Entrée privée",
  garage_simple: "Garage simple",
  garage_double: "Garage double",
  interieur: "Intérieur",
};

function fmtPrice(p: number) {
  return p.toLocaleString("fr-CA") + " $";
}

type HighlightMode = "lowest" | "highest" | "newest" | "none";

function getBestIndex(
  listings: CompareListing[],
  getValue: (l: CompareListing) => number | null,
  mode: HighlightMode
): number | null {
  if (mode === "none") return null;
  const values = listings.map(getValue);
  const validValues = values.filter((v): v is number => v !== null && v !== undefined);
  if (validValues.length < 2) return null;

  // If all values are the same, no highlight
  if (new Set(validValues).size === 1) return null;

  let bestVal: number;
  if (mode === "lowest") {
    bestVal = Math.min(...validValues);
  } else {
    bestVal = Math.max(...validValues);
  }

  const idx = values.indexOf(bestVal);
  return idx >= 0 ? idx : null;
}

type RowDef = {
  label: string;
  getValue: (l: CompareListing) => string;
  getRawValue?: (l: CompareListing) => number | null;
  highlight: HighlightMode;
};

const COMPARISON_ROWS: RowDef[] = [
  {
    label: "Type",
    getValue: (l) => TYPE_LABELS[l.type] ?? l.type,
    highlight: "none",
  },
  {
    label: "Style",
    getValue: (l) => (l.style ? STYLE_LABELS[l.style] ?? l.style : "—"),
    highlight: "none",
  },
  {
    label: "Quartier",
    getValue: (l) => quartierBySlug[l.quartierSlug]?.nom ?? l.quartierSlug,
    highlight: "none",
  },
  {
    label: "Superficie",
    getValue: (l) =>
      l.superficie ? l.superficie.toLocaleString("fr-CA") + " pi²" : "—",
    getRawValue: (l) => l.superficie || null,
    highlight: "highest",
  },
  {
    label: "Terrain",
    getValue: (l) =>
      l.superficieTerrain
        ? l.superficieTerrain.toLocaleString("fr-CA") + " pi²"
        : "—",
    getRawValue: (l) => l.superficieTerrain,
    highlight: "highest",
  },
  {
    label: "Chambres",
    getValue: (l) => String(l.chambres),
    getRawValue: (l) => l.chambres,
    highlight: "highest",
  },
  {
    label: "Salles de bain",
    getValue: (l) => String(l.sallesDeBain),
    getRawValue: (l) => l.sallesDeBain,
    highlight: "highest",
  },
  {
    label: "Stationnement",
    getValue: (l) =>
      l.stationnement
        ? STATIONNEMENT_LABELS[l.stationnement] ?? l.stationnement
        : "—",
    highlight: "none",
  },
  {
    label: "Année construction",
    getValue: (l) => (l.anneeConstruction ? String(l.anneeConstruction) : "—"),
    getRawValue: (l) => l.anneeConstruction,
    highlight: "newest",
  },
  {
    label: "Taxes municipales",
    getValue: (l) =>
      l.taxesMunicipales
        ? l.taxesMunicipales.toLocaleString("fr-CA") + " $ / an"
        : "—",
    getRawValue: (l) => l.taxesMunicipales,
    highlight: "lowest",
  },
  {
    label: "Taxes scolaires",
    getValue: (l) =>
      l.taxesScolaires
        ? l.taxesScolaires.toLocaleString("fr-CA") + " $ / an"
        : "—",
    getRawValue: (l) => l.taxesScolaires,
    highlight: "lowest",
  },
  {
    label: "Frais condo",
    getValue: (l) =>
      l.fraisCondo
        ? l.fraisCondo.toLocaleString("fr-CA") + " $ / mois"
        : "—",
    getRawValue: (l) => l.fraisCondo,
    highlight: "lowest",
  },
];

export function ComparerView() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [listings, setListings] = useState<CompareListing[]>([]);
  const [loading, setLoading] = useState(true);

  const idsParam = searchParams.get("ids") ?? "";

  useEffect(() => {
    const ids = idsParam.split(",").filter(Boolean);
    if (ids.length < 2) {
      setLoading(false);
      return;
    }
    fetch(`/api/annonces/comparer?ids=${ids.join(",")}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.listings) {
          // Preserve the order from the URL
          const ordered = ids
            .map((id) => data.listings.find((l: CompareListing) => l.id === id))
            .filter(Boolean) as CompareListing[];
          setListings(ordered);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [idsParam]);

  function removeListing(id: string) {
    const remaining = listings.filter((l) => l.id !== id);
    if (remaining.length < 2) {
      router.push("/annonces");
      return;
    }
    const newIds = remaining.map((l) => l.id).join(",");
    router.push(`/annonces/comparer?ids=${newIds}`);
  }

  const priceHighlight = getBestIndex(listings, (l) => l.prix, "lowest");

  if (loading) {
    return (
      <>
        <Header />
        <div
          className="max-w-[1100px] mx-auto px-5 py-20 text-center"
          style={{ color: "var(--text-tertiary)", fontSize: 13 }}
        >
          Chargement de la comparaison...
        </div>
      </>
    );
  }

  if (listings.length < 2) {
    return (
      <>
        <Header />
        <div className="max-w-[1100px] mx-auto px-5 py-20 text-center">
          <div style={{ fontSize: 18, fontWeight: 500, marginBottom: 8 }}>
            Sélectionne au moins 2 annonces
          </div>
          <div
            style={{
              fontSize: 13,
              color: "var(--text-tertiary)",
              marginBottom: 16,
            }}
          >
            Retourne aux annonces et coche celles que tu veux comparer.
          </div>
          <Link href="/annonces" className="mp-btn-primary">
            Voir les annonces
          </Link>
        </div>
      </>
    );
  }

  const canAdd = listings.length < 3;

  return (
    <>
      <Header />
      <div className="max-w-[1100px] mx-auto px-5 pb-20 md:pb-10">
        {/* Breadcrumb */}
        <div className="mp-breadcrumb" style={{ marginTop: 20 }}>
          <Link href="/annonces">Annonces</Link>
          <span>/</span>
          <span>Comparer ({listings.length})</span>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 22, fontWeight: 500 }}>
            Comparaison d&apos;annonces
          </div>
          <div
            style={{
              fontSize: 13,
              color: "var(--text-tertiary)",
              marginTop: 3,
            }}
          >
            {listings.length} propriétés comparées côte à côte
          </div>
        </div>

        {/* Comparison grid — scrollable on mobile */}
        <div className="cmp-scroll-wrapper">
          <div
            className="cmp-grid"
            style={{
              gridTemplateColumns: `140px repeat(${listings.length + (canAdd ? 1 : 0)}, minmax(250px, 1fr))`,
            }}
          >
            {/* Header row: empty label + listing cards */}
            <div className="cmp-label-cell" />
            {listings.map((l, i) => {
              const q = quartierBySlug[l.quartierSlug];
              const quartierNom = q?.nom ?? l.quartierSlug;
              return (
                <div key={l.id} className="cmp-header-card">
                  <Link
                    href={`/annonces/${l.id}`}
                    className="cmp-img-wrapper"
                  >
                    {l.imageUrl ? (
                      <Image
                        src={l.imageUrl}
                        alt={l.titre}
                        fill
                        sizes="280px"
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      <div className="cmp-img-placeholder">
                        <svg viewBox="0 0 32 32">
                          <rect x="2" y="10" width="28" height="20" rx="2" />
                          <path d="M2 14l14-10 14 10" />
                          <rect x="12" y="20" width="8" height="10" />
                        </svg>
                      </div>
                    )}
                  </Link>
                  <Link
                    href={`/annonces/${l.id}`}
                    className="cmp-title-link"
                  >
                    {l.titre}
                  </Link>
                  <div
                    className="cmp-price"
                    style={
                      priceHighlight === i
                        ? {
                            color: "var(--green-text)",
                            background: "var(--green-light-bg)",
                            borderRadius: 6,
                            padding: "2px 8px",
                            display: "inline-block",
                          }
                        : undefined
                    }
                  >
                    {fmtPrice(l.prix)}
                  </div>
                  <div className="cmp-meta">
                    {TYPE_LABELS[l.type] ?? l.type} · {quartierNom}
                  </div>
                  <div className="cmp-address">{l.adresse}</div>
                  <button
                    className="cmp-remove-btn"
                    onClick={() => removeListing(l.id)}
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <line x1="2" y1="2" x2="10" y2="10" />
                      <line x1="10" y1="2" x2="2" y2="10" />
                    </svg>
                    Retirer
                  </button>
                </div>
              );
            })}
            {canAdd && (
              <div className="cmp-header-card cmp-add-slot">
                <Link href="/annonces" className="cmp-add-link">
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 28 28"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <circle cx="14" cy="14" r="12" />
                    <line x1="14" y1="8" x2="14" y2="20" />
                    <line x1="8" y1="14" x2="20" y2="14" />
                  </svg>
                  <span>Ajouter une annonce</span>
                </Link>
              </div>
            )}

            {/* Comparison rows */}
            {COMPARISON_ROWS.map((row) => {
              const bestIdx = row.getRawValue
                ? getBestIndex(listings, row.getRawValue, row.highlight)
                : null;
              return [
                <div key={`label-${row.label}`} className="cmp-label-cell">
                  {row.label}
                </div>,
                ...listings.map((l, i) => {
                  const val = row.getValue(l);
                  const isBest = bestIdx === i && val !== "—";
                  return (
                    <div
                      key={`${row.label}-${l.id}`}
                      className={`cmp-value-cell${isBest ? " cmp-best" : ""}`}
                    >
                      {val}
                    </div>
                  );
                }),
                ...(canAdd
                  ? [
                      <div
                        key={`add-${row.label}`}
                        className="cmp-value-cell cmp-empty-cell"
                      >
                        —
                      </div>,
                    ]
                  : []),
              ];
            })}
          </div>
        </div>

        {/* Back link */}
        <div style={{ marginTop: 24, textAlign: "center" }}>
          <Link
            href="/annonces"
            style={{
              fontSize: 13,
              color: "var(--text-tertiary)",
              textDecoration: "underline",
            }}
          >
            Retour aux annonces
          </Link>
        </div>
      </div>
    </>
  );
}
