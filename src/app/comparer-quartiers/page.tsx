import Link from "next/link";
import { Header } from "@/components/Header";
import { CommunityCTA } from "@/components/CommunityCTA";
import { ComparerQuartiers } from "./ComparerQuartiers";
import type { Metadata } from "next";

const BASE_URL = process.env.NEXTAUTH_URL?.replace(/\/$/, "") ?? "https://nid.local";
const PAGE_URL = `${BASE_URL}/comparer-quartiers`;

export const metadata: Metadata = {
  title: "Comparer les quartiers du Québec 2026 | Prix, avis et tendances",
  description:
    "Comparez les quartiers de Montréal et du Québec côte à côte : prix médians, avis de résidents, tendances du marché, annonces actives et potentiel d\u2019investissement. Outil gratuit pour choisir le meilleur quartier.",
  keywords: [
    "comparer quartiers montréal",
    "meilleur quartier montréal",
    "quartier immobilier québec",
    "comparaison quartiers montréal",
    "où acheter montréal",
    "quartier familial montréal",
    "quartier investissement montréal",
    "prix immobilier quartier montréal",
    "avis quartier montréal",
    "quartier abordable montréal",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Comparer les quartiers du Québec 2026 | Prix, avis et tendances",
    description:
      "Comparez jusqu\u2019à 3 quartiers côte à côte : prix médians, avis de résidents, discussions et annonces actives. Trouvez le meilleur quartier pour votre projet immobilier.",
    url: PAGE_URL,
    siteName: "nid.local",
    locale: "fr_CA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Comparer les quartiers du Québec 2026 | Prix, avis et tendances",
    description:
      "Comparez les quartiers de Montréal et du Québec côte à côte. Prix, avis, tendances et annonces pour faire le meilleur choix immobilier.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "nid.local", "item": BASE_URL },
        { "@type": "ListItem", "position": 2, "name": "Comparer des quartiers", "item": PAGE_URL },
      ],
    },
    {
      "@type": "WebApplication",
      "name": "Comparateur de quartiers du Québec | nid.local",
      "url": PAGE_URL,
      "description":
        "Comparez les quartiers de Montréal et du Québec côte à côte : prix médians, avis de résidents, tendances du marché immobilier et annonces actives.",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "All",
      "inLanguage": "fr-CA",
      "isAccessibleForFree": true,
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "CAD" },
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Quel est le meilleur quartier pour acheter à Montréal en 2026?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Le meilleur quartier dépend de vos priorités : budget, style de vie et objectifs d\u2019investissement. Rosemont\u2013La Petite-Patrie et Villeray\u2013Saint-Michel offrent un bon équilibre entre prix et qualité de vie. Le Plateau-Mont-Royal reste prisé pour son ambiance, tandis que Verdun et Pointe-Saint-Charles attirent les acheteurs en quête de quartiers en pleine transformation avec un potentiel d\u2019appréciation. Utilisez notre comparateur pour évaluer les prix, les avis et les tendances de chaque quartier.",
          },
        },
        {
          "@type": "Question",
          "name": "Quels critères considérer pour choisir un quartier?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Les critères essentiels incluent le prix médian des propriétés, la proximité des transports en commun et des services, la qualité des écoles pour les familles, le taux de criminalité, l\u2019accès aux parcs et espaces verts, la vie commerciale et culturelle, ainsi que le potentiel d\u2019appréciation à moyen terme. Notre outil vous permet de comparer ces facteurs côte à côte grâce aux avis de résidents et aux données du marché.",
          },
        },
        {
          "@type": "Question",
          "name": "Quels quartiers de Montréal sont les plus abordables?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "En 2026, les quartiers les plus abordables de Montréal incluent Montréal-Nord, Saint-Léonard, Rivière-des-Prairies et certains secteurs de LaSalle. Les prix médians y sont significativement plus bas que dans les quartiers centraux comme le Plateau ou Outremont. Ces secteurs offrent souvent de bonnes opportunités pour les premiers acheteurs et les investisseurs en plex. Comparez les prix médians directement dans notre outil pour trouver le quartier qui correspond à votre budget.",
          },
        },
        {
          "@type": "Question",
          "name": "Comment les avis des résidents aident-ils dans le choix d\u2019un quartier?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Les avis des résidents offrent une perspective authentique que les statistiques seules ne peuvent fournir. Sur nid.local, chaque quartier est évalué par ses habitants sur cinq critères : sécurité, transports, commerces, ambiance et rapport qualité-prix. Ces témoignages révèlent les réalités du quotidien (bruit, stationnement, vie de quartier) et vous aident à identifier les quartiers qui correspondent réellement à votre mode de vie.",
          },
        },
        {
          "@type": "Question",
          "name": "Quels quartiers de Montréal ont le meilleur potentiel d\u2019appréciation?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Les quartiers avec le meilleur potentiel d\u2019appréciation en 2026 sont ceux qui bénéficient de projets d\u2019infrastructure ou de renouvellement urbain. Pointe-Saint-Charles, Saint-Henri et Verdun continuent leur transformation avec l\u2019arrivée de nouveaux commerces et résidents. Hochelaga-Maisonneuve et le Sud-Ouest profitent de projets de transport et de développements résidentiels. Comparez l\u2019évolution des prix et les tendances du marché avec notre outil pour repérer les opportunités.",
          },
        },
      ],
    },
  ],
};

const faqItems = [
  {
    q: "Quel est le meilleur quartier pour acheter à Montréal en 2026?",
    r: "Le meilleur quartier dépend de vos priorités : budget, style de vie et objectifs d\u2019investissement. Rosemont\u2013La Petite-Patrie et Villeray\u2013Saint-Michel offrent un bon équilibre entre prix et qualité de vie. Le Plateau-Mont-Royal reste prisé pour son ambiance, tandis que Verdun et Pointe-Saint-Charles attirent les acheteurs en quête de quartiers en pleine transformation avec un potentiel d\u2019appréciation. Utilisez notre comparateur pour évaluer les prix, les avis et les tendances de chaque quartier.",
  },
  {
    q: "Quels critères considérer pour choisir un quartier?",
    r: "Les critères essentiels incluent le prix médian des propriétés, la proximité des transports en commun et des services, la qualité des écoles pour les familles, le taux de criminalité, l\u2019accès aux parcs et espaces verts, la vie commerciale et culturelle, ainsi que le potentiel d\u2019appréciation à moyen terme. Notre outil vous permet de comparer ces facteurs côte à côte grâce aux avis de résidents et aux données du marché.",
  },
  {
    q: "Quels quartiers de Montréal sont les plus abordables?",
    r: "En 2026, les quartiers les plus abordables de Montréal incluent Montréal-Nord, Saint-Léonard, Rivière-des-Prairies et certains secteurs de LaSalle. Les prix médians y sont significativement plus bas que dans les quartiers centraux comme le Plateau ou Outremont. Ces secteurs offrent souvent de bonnes opportunités pour les premiers acheteurs et les investisseurs en plex. Comparez les prix médians directement dans notre outil pour trouver le quartier qui correspond à votre budget.",
  },
  {
    q: "Comment les avis des résidents aident-ils dans le choix d\u2019un quartier?",
    r: "Les avis des résidents offrent une perspective authentique que les statistiques seules ne peuvent fournir. Sur nid.local, chaque quartier est évalué par ses habitants sur cinq critères : sécurité, transports, commerces, ambiance et rapport qualité-prix. Ces témoignages révèlent les réalités du quotidien (bruit, stationnement, vie de quartier) et vous aident à identifier les quartiers qui correspondent réellement à votre mode de vie.",
  },
  {
    q: "Quels quartiers de Montréal ont le meilleur potentiel d\u2019appréciation?",
    r: "Les quartiers avec le meilleur potentiel d\u2019appréciation en 2026 sont ceux qui bénéficient de projets d\u2019infrastructure ou de renouvellement urbain. Pointe-Saint-Charles, Saint-Henri et Verdun continuent leur transformation avec l\u2019arrivée de nouveaux commerces et résidents. Hochelaga-Maisonneuve et le Sud-Ouest profitent de projets de transport et de développements résidentiels. Comparez l\u2019évolution des prix et les tendances du marché avec notre outil pour repérer les opportunités.",
  },
];

export default function ComparerPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen" style={{ background: "var(--bg-page)" }}>
        <Header />
        <main className="max-w-[1100px] mx-auto px-3 md:px-5 py-4 md:py-6 pb-20 md:pb-6">
          <nav className="flex items-center gap-1.5 text-[12px] mb-5" style={{ color: "var(--text-tertiary)" }} aria-label="Fil d'Ariane">
            <Link href="/" className="transition-opacity hover:opacity-70" style={{ color: "var(--text-tertiary)" }}>nid.local</Link>
            <span>/</span>
            <span style={{ color: "var(--text-secondary)" }}>Comparer des quartiers</span>
          </nav>

          <div className="mb-6">
            <h1 className="text-[22px] font-bold leading-snug mb-2" style={{ color: "var(--text-primary)" }}>
              Comparer les quartiers du Québec
            </h1>
            <p className="text-[13px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Sélectionnez 2 ou 3 quartiers pour les comparer côte à côte : prix médians, avis de résidents, nombre de discussions et
              annonces actives. Que vous cherchiez le meilleur quartier familial à Montréal, un secteur abordable pour un premier achat
              ou un quartier avec un fort potentiel d&apos;investissement, notre comparateur vous aide à prendre une décision éclairée
              grâce aux données du marché et aux témoignages de la communauté.
            </p>
          </div>

          <ComparerQuartiers />

          {/* FAQ */}
          <div
            className="rounded-xl p-6 space-y-4 mt-8"
            style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
          >
            <h2 className="text-[15px] font-bold" style={{ color: "var(--text-primary)" }}>
              Questions fréquentes sur les quartiers du Québec
            </h2>
            <dl className="space-y-4">
              {faqItems.map((item) => (
                <div key={item.q} className="pb-4" style={{ borderBottom: "0.5px solid var(--border)" }}>
                  <dt className="text-[13px] font-semibold mb-1.5" style={{ color: "var(--text-primary)" }}>
                    {item.q}
                  </dt>
                  <dd className="text-[13px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    {item.r}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* CTA community */}
          <div className="mt-5">
            <CommunityCTA contexte="quartiers" />
          </div>
        </main>
      </div>
    </>
  );
}
