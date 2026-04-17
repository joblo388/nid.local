import Link from "next/link";
import { Header } from "@/components/Header";
import { CommunityCTA } from "@/components/CommunityCTA";
import { ressourcesUtiles } from "@/lib/data";
import { IconHome, IconChart, IconCalculator, IconDollar, IconBuilding, IconLandmark, IconScale, IconRuler, IconLightbulb, IconUsers, IconSearch, IconBook, IconGraduation, IconReceipt, IconBookOpen } from "@/components/Icons";
import { ReactNode } from "react";
import type { Metadata } from "next";
import { getServerLocale } from "@/lib/serverLocale";
import { pageContent } from "./content";

const BASE_URL = process.env.NEXTAUTH_URL?.replace(/\/$/, "") ?? "https://nid.local";
const PAGE_URL = `${BASE_URL}/ressources`;

export const metadata: Metadata = {
  title: "Outils immobiliers gratuits Québec 2026 | Calculatrices, données et comparateurs",
  description:
    "Tous les outils gratuits pour votre projet immobilier au Québec : calculatrice hypothécaire, capacité d'emprunt, calculateur plex, taxe de bienvenue, estimation de valeur, données de marché, comparateur de quartiers et guide premier achat. Résultats instantanés, 100 % gratuit.",
  keywords: [
    "outils immobiliers gratuits",
    "calculatrice hypothécaire gratuite",
    "outils achat maison québec",
    "calculateur immobilier",
    "capacité emprunt québec",
    "calculateur plex rentabilité",
    "taxe de bienvenue calculateur",
    "estimation valeur maison québec",
    "données marché immobilier québec",
    "comparateur quartiers montréal",
    "acheter ou louer québec",
    "guide premier achat maison",
    "outils hypothécaires gratuits",
    "simulateur immobilier québec",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Outils immobiliers gratuits Québec 2026 | Calculatrices, données et comparateurs",
    description:
      "Calculatrices hypothécaires, données de marché, estimation de valeur, comparateur de quartiers et bien plus. Tous les outils gratuits pour acheter, vendre ou investir au Québec.",
    url: PAGE_URL,
    siteName: "nid.local",
    locale: "fr_CA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Outils immobiliers gratuits Québec 2026",
    description:
      "Calculatrices, données de marché, comparateurs et guides pour votre projet immobilier au Québec. 100 % gratuit, résultats instantanés.",
  },
};

/* ── FAQ data (réutilisé dans le JSON-LD et le rendu visible) ───────────── */

const faqItems = [
  {
    question: "Quels outils immobiliers gratuits sont offerts sur nid.local?",
    answer:
      "nid.local propose plus d'une dizaine d'outils entièrement gratuits : une calculatrice hypothécaire pour estimer vos paiements mensuels, un calculateur de capacité d'emprunt (ratios GDS/TDS), un calculateur plex pour analyser la rentabilité d'un immeuble à revenus, un calculateur de taxe de bienvenue, un comparateur acheter ou louer, un estimateur de valeur, des données de marché par quartier, un comparateur de quartiers côte à côte, un répertoire de professionnels et un guide complet pour le premier achat.",
  },
  {
    question: "Comment fonctionne la calculatrice hypothécaire de nid.local?",
    answer:
      "Entrez le prix d'achat, votre mise de fonds et le taux d'intérêt. La calculatrice calcule instantanément votre paiement mensuel, les intérêts totaux sur la durée de l'amortissement et la prime SCHL si votre mise de fonds est inférieure à 20 %. Elle supporte les scénarios unifamilial, condo et plex jusqu'à 5 logements.",
  },
  {
    question: "Les données de marché sont-elles à jour?",
    answer:
      "Oui. Les prix médians et les tendances couvrent plus de 80 quartiers au Québec, avec des données historiques de 2020 à 2026. Les graphiques montrent l'évolution des prix pour chaque quartier afin de vous aider à identifier les meilleures opportunités.",
  },
  {
    question: "Puis-je utiliser ces outils sur mon téléphone?",
    answer:
      "Absolument. Tous les outils sont optimisés pour mobile et fonctionnent même hors connexion grâce au service worker. Vous pouvez aussi installer nid.local comme application sur votre écran d'accueil pour un accès rapide.",
  },
];

/* ── JSON-LD structured data ────────────────────────────────────────────── */

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "nid.local", item: BASE_URL },
        { "@type": "ListItem", position: 2, name: "Outils et ressources", item: PAGE_URL },
      ],
    },
    {
      "@type": "CollectionPage",
      name: "Outils immobiliers gratuits | Québec 2026",
      url: PAGE_URL,
      description:
        "Tous les outils gratuits pour votre projet immobilier au Québec : calculatrices, données de marché, comparateurs et guides.",
      inLanguage: "fr-CA",
      isPartOf: { "@type": "WebSite", name: "nid.local", url: BASE_URL },
      mainEntity: {
        "@type": "ItemList",
        itemListOrder: "https://schema.org/ItemListUnordered",
        numberOfItems: ressourcesUtiles.length,
        itemListElement: ressourcesUtiles.map((r, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: r.label,
          url: `${BASE_URL}${r.href}`,
          ...(r.description ? { description: r.description } : {}),
        })),
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: faqItems.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: f.answer,
        },
      })),
    },
  ],
};

/* ── Icons ──────────────────────────────────────────────────────────────── */

const icons: Record<string, ReactNode> = {
  "/annonces": <IconHome size={24} />,
  "/donnees-marche": <IconChart size={24} />,
  "/calculatrice-hypothecaire": <IconCalculator size={24} />,
  "/capacite-emprunt": <IconDollar size={24} />,
  "/calculateur-plex": <IconBuilding size={24} />,
  "/taxe-bienvenue": <IconLandmark size={24} />,
  "/acheter-ou-louer": <IconScale size={24} />,
  "/estimation": <IconRuler size={24} />,
  "/suggestions": <IconLightbulb size={24} />,
  "/repertoire": <IconUsers size={24} />,
  "/comparer-quartiers": <IconSearch size={24} />,
  "/guide-premier-achat": <IconBook size={24} />,
  "/premier-acheteur": <IconGraduation size={24} />,
  "/frais-achat": <IconReceipt size={24} />,
  "/lexique": <IconBookOpen size={24} />,
};

/* ── Page component ─────────────────────────────────────────────────────── */

export default async function RessourcesPage() {
  const locale = await getServerLocale();
  const c = pageContent[locale];

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-page)" }}>
      <Header />

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="max-w-[1100px] mx-auto px-4 py-6 pb-20 md:pb-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-[12px] mb-5" style={{ color: "var(--text-tertiary)" }}>
          <Link href="/" className="transition-opacity hover:opacity-70" style={{ color: "var(--text-tertiary)" }}>{c.breadcrumbHome}</Link>
          <span>/</span>
          <span style={{ color: "var(--text-secondary)" }}>{c.breadcrumbCurrent}</span>
        </nav>

        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <h1
          className="text-[22px] font-bold mb-2"
          style={{ color: "var(--text-primary)" }}
        >
          {c.h1}
        </h1>
        <p className="text-[13px] mb-6 max-w-2xl" style={{ color: "var(--text-secondary)" }}>
          {c.intro}
        </p>

        {/* ── Tools grid ────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {ressourcesUtiles.map((r) => (
            <Link
              key={r.href}
              href={r.href}
              className="flex items-center gap-3 p-4 rounded-xl transition-colors hover-bg card-hover-lift"
              style={{
                background: "var(--bg-card)",
                border: "0.5px solid var(--border)",
              }}
            >
              <div className="w-7 h-7 shrink-0 flex items-center justify-center" style={{ color: "var(--green)" }}>
                {icons[r.href] ?? <IconHome size={24} />}
              </div>
              <div className="min-w-0">
                <p
                  className="text-[14px] font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  {r.label}
                </p>
                {"description" in r && r.description && (
                  <p
                    className="text-[12px] mt-0.5"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    {r.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* ── FAQ visible ───────────────────────────────────────────────── */}
        <section className="mt-12">
          <h2
            className="text-[17px] font-bold mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            {c.faqTitle}
          </h2>
          <dl className="space-y-4">
            {c.faqs.map((f) => (
              <div key={f.question} className="pb-4" style={{ borderBottom: "0.5px solid var(--border)" }}>
                <dt className="text-[13px] font-semibold mb-1.5" style={{ color: "var(--text-primary)" }}>
                  {f.question}
                </dt>
                <dd className="text-[13px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {f.answer}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <div className="mt-8">
          <CommunityCTA contexte="general" />
        </div>
      </main>
    </div>
  );
}
