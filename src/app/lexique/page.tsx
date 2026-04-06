import Link from "next/link";
import { Header } from "@/components/Header";
import { CommunityCTA } from "@/components/CommunityCTA";
import { LexiqueSearch } from "@/components/LexiqueSearch";
import { ReadingProgress } from "@/components/ReadingProgress";
import { BackToTop } from "@/components/BackToTop";
import { glossaire, glossaireByLettre } from "@/data/glossaire";
import type { Metadata } from "next";

const BASE_URL = process.env.NEXTAUTH_URL?.replace(/\/$/, "") ?? "https://nid.local";
const PAGE_URL = `${BASE_URL}/lexique`;

export const metadata: Metadata = {
  title: "Lexique immobilier Québec 2026 | Dictionnaire des termes immobiliers",
  description:
    "Définitions claires de 50+ termes immobiliers québécois : MRB, GDS, TDS, taxe de bienvenue, acte de vente, vice caché, servitude, et plus. Le guide de référence pour comprendre l'immobilier au Québec.",
  keywords: [
    "lexique immobilier",
    "vocabulaire immobilier québec",
    "termes immobiliers",
    "définition MRB",
    "c'est quoi GDS TDS",
    "dictionnaire immobilier",
    "glossaire immobilier québec",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Lexique immobilier Québec 2026 | Dictionnaire des termes immobiliers",
    description:
      "Définitions claires de 50+ termes immobiliers québécois. MRB, GDS, TDS, taxe de bienvenue, vice caché et plus. Le guide de référence pour comprendre l'immobilier au Québec.",
    url: PAGE_URL,
    siteName: "nid.local",
    locale: "fr_CA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lexique immobilier Québec 2026 | Dictionnaire des termes immobiliers",
    description:
      "50+ définitions claires de termes immobiliers québécois. MRB, GDS, TDS, taxe de bienvenue, vice caché et plus.",
  },
};

/* ── FAQ data for JSON-LD ──────────────────────────────────────────────── */

const faqItems = [
  {
    question: "Qu’est-ce que le MRB en immobilier?",
    answer:
      "Le MRB (multiplicateur de revenus bruts) est un ratio qui permet d’évaluer rapidement la valeur d’un immeuble à revenus. Il se calcule en divisant le prix de vente par les revenus de loyers bruts annuels. Par exemple, un duplex vendu 500 000 $ avec 36 000 $ de loyers annuels a un MRB de 13,9x.",
  },
  {
    question: "C’est quoi le GDS et le TDS?",
    answer:
      "Le GDS (ratio du service de la dette brute) est le pourcentage de votre revenu brut consacré aux frais de logement (hypothèque, taxes, chauffage, frais de condo). Le TDS (ratio du service de la dette totale) inclut toutes vos dettes en plus du logement. Pour obtenir un prêt hypothécaire au Canada, le GDS ne doit pas dépasser 39 % et le TDS ne doit pas dépasser 44 %.",
  },
  {
    question: "Combien coûte la taxe de bienvenue au Québec?",
    answer:
      "La taxe de bienvenue (droits de mutation) se calcule par tranches sur le plus élevé entre le prix payé et l’évaluation municipale : 0,5 % sur les premiers 58 900 $, 1 % de 58 900 $ à 294 600 $, 1,5 % de 294 600 $ à 500 000 $, et 3 % au-delà (les seuils sont ajustés annuellement). Montréal applique un taux de 3,5 % au-delà de 1 M$ et 4 % au-delà de 2 M$.",
  },
  {
    question: "Qu’est-ce qu’un vice caché?",
    answer:
      "Un vice caché est un défaut grave d’un immeuble qui existait avant la vente, qui n’était pas apparent lors d’une inspection raisonnable et que le vendeur n’a pas déclaré. Le vendeur est légalement responsable des vices cachés même s’il les ignorait. L’acheteur dispose de 3 ans après la découverte du vice pour intenter un recours.",
  },
  {
    question: "C’est quoi le CELIAPP?",
    answer:
      "Le CELIAPP (compte d’épargne libre d’impôt pour l’achat d’une première propriété) est un régime d’épargne canadien. Les contributions sont déductibles d’impôt (jusqu’à 8 000 $ par an, maximum 40 000 $ à vie) et les retraits pour un premier achat sont non imposables. Il combine les avantages du REER et du CELI.",
  },
];

/* ── Derived data ──────────────────────────────────────────────────────── */

const letters = Object.keys(glossaireByLettre).sort();

/* ── JSON-LD structured data ───────────────────────────────────────────── */

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "nid.local", item: BASE_URL },
        { "@type": "ListItem", position: 2, name: "Lexique immobilier", item: PAGE_URL },
      ],
    },
    {
      "@type": "DefinedTermSet",
      name: "Lexique immobilier | Québec 2026",
      description:
        "Dictionnaire de 50+ termes immobiliers québécois avec définitions claires et exemples pratiques.",
      url: PAGE_URL,
      inLanguage: "fr-CA",
      hasDefinedTerm: glossaire.map((t) => ({
        "@type": "DefinedTerm",
        name: t.terme,
        description: t.definition,
        url: `${BASE_URL}/glossaire/${t.slug}`,
      })),
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

/* ── Page component ────────────────────────────────────────────────────── */

export default function LexiquePage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg-page)" }}>
      <ReadingProgress />
      <Header />

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="max-w-[1100px] mx-auto px-3 md:px-5 py-4 md:py-6 pb-20 md:pb-6">
        {/* ── Breadcrumb ───────────────────────────────────────────────── */}
        <nav
          className="text-[12px] mb-4"
          style={{ color: "var(--text-tertiary)" }}
          aria-label="Fil d'Ariane"
        >
          <Link href="/" className="hover:underline">
            nid.local
          </Link>
          {" "}
          <span aria-hidden="true">/</span>{" "}
          <span style={{ color: "var(--text-secondary)" }}>Lexique immobilier</span>
        </nav>

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <h1
          className="text-[22px] font-bold leading-snug mb-2"
          style={{ color: "var(--text-primary)" }}
        >
          Lexique immobilier | Québec 2026
        </h1>
        <p
          className="text-[13px] mb-6 max-w-2xl leading-relaxed"
          style={{ color: "var(--text-tertiary)" }}
        >
          Comprendre le jargon immobilier est essentiel pour prendre de bonnes
          décisions. Ce dictionnaire regroupe {glossaire.length} termes utilisés
          couramment dans les transactions immobilières au Québec, avec des
          définitions claires et des liens vers nos outils gratuits pour passer
          de la théorie à la pratique.
        </p>

        <LexiqueSearch terms={glossaire.map(g => ({ slug: g.slug, terme: g.terme, lettre: g.lettre, definition: g.definition, lienCalculateur: g.lienCalculateur }))} />

        {/* ── Alphabet nav ─────────────────────────────────────────────── */}
        <nav
          className="flex flex-wrap gap-1.5 mb-8 rounded-xl p-3"
          style={{
            background: "var(--bg-card)",
            border: "0.5px solid var(--border)",
          }}
          aria-label="Navigation alphabétique"
        >
          {letters.map((letter) => (
            <a
              key={letter}
              href={`#${letter.toLowerCase()}`}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-[13px] font-semibold transition-colors hover:opacity-80"
              style={{
                background: "var(--green-light-bg)",
                color: "var(--green-text)",
              }}
            >
              {letter}
            </a>
          ))}
        </nav>

        {/* ── Glossary ─────────────────────────────────────────────────── */}
        <div className="space-y-8">
          {letters.map((letter) => (
            <section key={letter} id={letter.toLowerCase()}>
              {/* Letter heading */}
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="w-10 h-10 flex items-center justify-center rounded-xl text-[18px] font-bold shrink-0"
                  style={{
                    background: "var(--green-light-bg)",
                    color: "var(--green-text)",
                  }}
                >
                  {letter}
                </span>
                <div
                  className="h-px flex-1"
                  style={{ background: "var(--border)" }}
                />
              </div>

              {/* Terms */}
              <dl className="space-y-3">
                {glossaireByLettre[letter].map((t) => (
                  <div
                    key={t.slug}
                    className="rounded-xl p-4"
                    style={{
                      background: "var(--bg-card)",
                      border: "0.5px solid var(--border)",
                    }}
                  >
                    <dt
                      className="text-[14px] font-bold mb-1.5"
                      style={{ color: "var(--text-primary)" }}
                    >
                      <Link
                        href={`/glossaire/${t.slug}`}
                        className="hover:underline"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {t.terme}
                      </Link>
                    </dt>
                    <dd
                      className="text-[13px] leading-relaxed"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {t.definition}
                    </dd>
                    {t.lienCalculateur && (
                      <dd className="mt-2">
                        <Link
                          href={t.lienCalculateur}
                          className="inline-flex items-center gap-1 text-[12px] font-medium transition-opacity hover:opacity-80"
                          style={{ color: "var(--green-text)" }}
                        >
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 7l5 5m0 0l-5 5m5-5H6"
                            />
                          </svg>
                          Utiliser la calculatrice
                        </Link>
                      </dd>
                    )}
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>

        {/* ── FAQ visible ──────────────────────────────────────────────── */}
        <section className="mt-12">
          <h2
            className="text-[17px] font-bold mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            Questions fréquentes
          </h2>
          <div className="space-y-4">
            {faqItems.map((f, i) => (
              <details
                key={i}
                className="rounded-xl overflow-hidden"
                style={{
                  background: "var(--bg-card)",
                  border: "0.5px solid var(--border)",
                }}
              >
                <summary
                  className="cursor-pointer select-none px-4 py-3 text-[14px] font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  {f.question}
                </summary>
                <p
                  className="px-4 pb-4 text-[13px] leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {f.answer}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────────── */}
        <div className="mt-8">
          <CommunityCTA contexte="general" />
        </div>
      </main>
      <BackToTop />
    </div>
  );
}
