import Link from "next/link";
import { MARKET, CITY_SEO } from "@/lib/donneesMarche";
import { villes, quartiers } from "@/lib/data";

/* ── Helpers ─────────────────────────────────────────────────────────── */

function parsePrice(s: string): number | null {
  if (!s || s === "\u2014") return null;
  return parseInt(s.replace(/\s/g, "").replace("$", ""), 10);
}

function formatMiseDeFonds5(price: number): string {
  // SCHL rules: 5% on first 500k, 10% on remainder up to 1M
  let mise: number;
  if (price <= 500_000) {
    mise = price * 0.05;
  } else if (price <= 1_000_000) {
    mise = 500_000 * 0.05 + (price - 500_000) * 0.1;
  } else {
    // Over 1M: 20% minimum
    mise = price * 0.2;
  }
  return Math.round(mise).toLocaleString("fr-CA") + " $";
}

function slugToName(slug: string): string {
  // Check CITY_SEO first (proper display names with accents)
  const city = CITY_SEO[slug];
  if (city) return city.nom;
  // Check villes array
  const ville = villes.find((v) => v.slug === slug);
  if (ville) return ville.nom;
  // Check quartiers array
  const quartier = quartiers.find((q) => q.slug === slug);
  if (quartier) return quartier.nom;
  // Fallback: capitalize slug
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("-");
}

function slugToLink(slug: string): string {
  // If it's a city with a CITY_SEO entry, link directly
  if (CITY_SEO[slug]) return `/donnees-marche/${slug}`;
  // If it's a quartier, find its parent city
  const quartier = quartiers.find((q) => q.slug === slug);
  if (quartier) return `/donnees-marche/${quartier.villeSlug}`;
  // Fallback
  return `/donnees-marche/${slug}`;
}

/* ── Static data: Section 1 ──────────────────────────────────────────── */

const salaryRows = [
  { prix: "300 000 $", mise5: "15 000 $", mise20: "60 000 $", salaire: "~55 000 $" },
  { prix: "400 000 $", mise5: "20 000 $", mise20: "80 000 $", salaire: "~72 000 $" },
  { prix: "500 000 $", mise5: "25 000 $", mise20: "100 000 $", salaire: "~90 000 $" },
  { prix: "600 000 $", mise5: "35 000 $", mise20: "120 000 $", salaire: "~108 000 $" },
  { prix: "700 000 $", mise5: "45 000 $", mise20: "140 000 $", salaire: "~126 000 $" },
  { prix: "800 000 $", mise5: "55 000 $", mise20: "160 000 $", salaire: "~144 000 $" },
  { prix: "1 000 000 $", mise5: "200 000 $", mise20: "200 000 $", salaire: "~175 000 $" },
];

/* ── Component ───────────────────────────────────────────────────────── */

export function SalaireRequis() {
  // Section 2: find the 8 most affordable cities by uni price
  const entries = Object.entries(MARKET)
    .map(([slug, data]) => {
      const uniPrice = parsePrice(data.uni);
      if (uniPrice === null) return null;
      return {
        slug,
        nom: slugToName(slug),
        link: slugToLink(slug),
        uniPrice,
        uniLabel: data.uni,
        mise5: formatMiseDeFonds5(uniPrice),
        tendance: data.tendance,
      };
    })
    .filter((e): e is NonNullable<typeof e> => e !== null)
    .sort((a, b) => a.uniPrice - b.uniPrice)
    .slice(0, 8);

  const thStyle: React.CSSProperties = {
    background: "var(--bg-secondary)",
    padding: "8px 10px",
    textAlign: "left",
    fontWeight: 600,
    whiteSpace: "nowrap",
  };

  const tdStyle: React.CSSProperties = {
    padding: "7px 10px",
    borderBottom: "0.5px solid var(--border)",
    whiteSpace: "nowrap",
  };

  return (
    <div className="flex flex-col gap-6">
      {/* ── Section 1: Salaire requis ────────────────────────────────── */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
      >
        <div className="px-4 pt-4 pb-2">
          <h3 className="text-[15px] font-bold" style={{ color: "var(--text-primary)" }}>
            Combien faut-il gagner pour acheter?
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]" style={{ color: "var(--text-primary)", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={thStyle}>Prix de la propriété</th>
                <th style={thStyle}>Mise de fonds 5%</th>
                <th style={thStyle}>Mise de fonds 20%</th>
                <th style={thStyle}>Salaire requis (approx)</th>
              </tr>
            </thead>
            <tbody>
              {salaryRows.map((row) => (
                <tr key={row.prix}>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>{row.prix}</td>
                  <td style={tdStyle}>{row.mise5}</td>
                  <td style={tdStyle}>{row.mise20}</td>
                  <td style={{ ...tdStyle, fontWeight: 600, color: "var(--green)" }}>{row.salaire}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3">
          <p className="text-[11px]" style={{ color: "var(--text-tertiary)", lineHeight: 1.5 }}>
            Estimations basées sur un taux de 4,64%, amortissement 25 ans, ratio GDS de 32%. Exclut les autres dettes.
          </p>
        </div>
      </div>

      {/* ── Section 2: Villes les plus abordables ────────────────────── */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
      >
        <div className="px-4 pt-4 pb-2">
          <h3 className="text-[15px] font-bold" style={{ color: "var(--text-primary)" }}>
            Villes les plus abordables pour un premier achat
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]" style={{ color: "var(--text-primary)", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={thStyle}>Ville</th>
                <th style={thStyle}>Prix médian unifamiliale</th>
                <th style={thStyle}>Mise de fonds 5%</th>
                <th style={thStyle}>Tendance</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.slug}>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>
                    <Link
                      href={entry.link}
                      className="hover:underline"
                      style={{ color: "var(--green)" }}
                    >
                      {entry.nom}
                    </Link>
                  </td>
                  <td style={tdStyle}>{entry.uniLabel}</td>
                  <td style={tdStyle}>{entry.mise5}</td>
                  <td style={{ ...tdStyle, fontWeight: 600, color: "var(--green)" }}>{entry.tendance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
