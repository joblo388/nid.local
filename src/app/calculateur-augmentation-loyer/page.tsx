import Link from "next/link";
import { Header } from "@/components/Header";
import { CommunityCTA } from "@/components/CommunityCTA";
import { CalculateurLoyerClient } from "./CalculateurLoyerClient";
import { CalcActions } from "@/components/CalcActions";
import { getServerLocale } from "@/lib/serverLocale";
import { calcContent } from "./content";
import type { Metadata } from "next";

const BASE_URL =
  process.env.NEXTAUTH_URL?.replace(/\/$/, "") ?? "https://nid.local";
const PAGE_URL = `${BASE_URL}/calculateur-augmentation-loyer`;

export const metadata: Metadata = {
  robots: { index: true, follow: true },
  title: "Calculateur augmentation de loyer Quebec 2026 | TAL",
  description:
    "Calculez l'augmentation de loyer permise selon les criteres du TAL 2026. Outil gratuit base sur les regles officielles du Tribunal administratif du logement du Quebec.",
  keywords: [
    "augmentation loyer quebec",
    "calculateur TAL",
    "hausse loyer 2026",
    "tribunal administratif logement",
    "augmentation loyer permise",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Calculateur augmentation de loyer Quebec 2026 | TAL",
    description:
      "Calculez l'augmentation de loyer permise selon les criteres du TAL 2026. Outil gratuit base sur les regles officielles du Tribunal administratif du logement du Quebec.",
    url: PAGE_URL,
    siteName: "nid.local",
    locale: "fr_CA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Calculateur augmentation de loyer Quebec 2026 | TAL",
    description:
      "Calculez l'augmentation de loyer permise selon les criteres du TAL 2026. Outil gratuit base sur les regles officielles du Tribunal administratif du logement.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "nid.local",
          item: BASE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Calculateur augmentation de loyer",
          item: PAGE_URL,
        },
      ],
    },
    {
      "@type": "WebApplication",
      name: "Calculateur augmentation de loyer Quebec | nid.local",
      url: PAGE_URL,
      description:
        "Calculez l'augmentation de loyer permise selon les criteres du TAL 2026. Estimation basee sur la methode officielle du Tribunal administratif du logement.",
      applicationCategory: "FinanceApplication",
      operatingSystem: "All",
      inLanguage: "fr-CA",
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "CAD" },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Quelle est l'augmentation de loyer permise au Quebec en 2026?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Le Tribunal administratif du logement (TAL) publie chaque annee des indices d'ajustement de loyer. Pour 2026, le taux de base est de 3,1%, auquel s'ajoutent les hausses reelles de taxes, assurances et travaux majeurs. Ces taux sont des estimations applicables lorsque le proprietaire ne fournit pas le detail de ses depenses reelles.",
          },
        },
        {
          "@type": "Question",
          name: "Un proprietaire peut-il augmenter le loyer au-dela des taux du TAL?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Le proprietaire peut proposer une augmentation superieure aux taux suggeres par le TAL s'il peut justifier des depenses reelles plus elevees, par exemple des travaux de renovation majeurs, une hausse importante des taxes municipales ou de l'assurance. Le locataire a le droit de refuser et de demander une fixation de loyer au TAL.",
          },
        },
        {
          "@type": "Question",
          name: "Que faire si je refuse l'augmentation de loyer proposee?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Le locataire dispose d'un mois apres la reception de l'avis d'augmentation pour refuser par ecrit. Le proprietaire a ensuite un mois pour demander au TAL de fixer le loyer. Si le proprietaire ne fait pas la demande, le loyer reste inchange. Le locataire peut aussi contester directement au TAL s'il juge l'augmentation abusive.",
          },
        },
      ],
    },
  ],
};

export default async function CalculateurAugmentationLoyerPage() {
  const locale = await getServerLocale();
  const c = calcContent[locale];

  const stepIcons = ["\u2460", "\u2461", "\u2462", "\u2463"];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen" style={{ background: "var(--bg-page)" }}>
        <Header />
        <main className="max-w-[700px] mx-auto px-3 md:px-5 py-4 md:py-6 pb-20 md:pb-6">
          {/* Breadcrumb */}
          <nav
            className="flex items-center gap-1.5 text-[12px] mb-5"
            style={{ color: "var(--text-tertiary)" }}
            aria-label={c.ariaLabel}
          >
            <Link
              href="/"
              className="transition-opacity hover:opacity-70"
              style={{ color: "var(--text-tertiary)" }}
            >
              nid.local
            </Link>
            <span>/</span>
            <span style={{ color: "var(--text-secondary)" }}>
              {c.breadcrumbLabel}
            </span>
          </nav>

          <div className="space-y-5">
            <div>
              <h1
                className="text-[22px] font-bold leading-snug mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                {c.h1}
              </h1>
              <p
                className="text-[13px] leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                {c.intro}
              </p>
            </div>

            {/* Calculator */}
            <div
              className="rounded-xl p-6"
              style={{
                background: "var(--bg-card)",
                border: "0.5px solid var(--border)",
              }}
            >
              <CalculateurLoyerClient />
              <CalcActions />
            </div>

            {/* ── EXPLANATION SECTION ───────────────────── */}

            {/* Comment fonctionne le calcul */}
            <div
              className="rounded-xl p-6 space-y-5"
              style={{
                background: "var(--bg-card)",
                border: "0.5px solid var(--border)",
              }}
            >
              <h2
                className="text-[20px] font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                {c.howTitle}
              </h2>

              <div className="space-y-4">
                {c.calcSteps.map((step, i) => (
                  <div
                    key={i}
                    className="rounded-lg p-4 space-y-2"
                    style={{
                      background: "var(--bg-secondary)",
                      border: "0.5px solid var(--border)",
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className="w-7 h-7 rounded-full text-[13px] font-bold flex items-center justify-center shrink-0 text-white"
                        style={{ background: "var(--green)" }}
                      >
                        {stepIcons[i]}
                      </span>
                      <div className="flex-1">
                        <p
                          className="text-[13px] font-semibold mb-1"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {step.title}
                        </p>
                        <p
                          className="text-[12px] leading-relaxed"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {step.text}
                        </p>
                      </div>
                    </div>
                    <div
                      className="ml-10 p-3 rounded-lg text-[12px] leading-relaxed"
                      style={{
                        borderLeft: "3px solid var(--green)",
                        background: "var(--bg-page)",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {step.example}
                    </div>
                  </div>
                ))}
              </div>

              {/* Alert box for tenants */}
              <div
                className="rounded-lg p-4 flex gap-3"
                style={{
                  background: "var(--amber-bg)",
                }}
              >
                <svg
                  className="w-5 h-5 shrink-0 mt-0.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ color: "var(--amber-text)" }}
                >
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <div>
                  <p
                    className="text-[13px] font-semibold mb-1"
                    style={{ color: "var(--amber-text)" }}
                  >
                    {c.tenantNoteTitle}
                  </p>
                  <p
                    className="text-[12px] leading-relaxed"
                    style={{ color: "var(--amber-text)", opacity: 0.85 }}
                  >
                    {c.tenantNoteText}
                  </p>
                </div>
              </div>
            </div>

            {/* Vous voulez refuser l'augmentation */}
            <div
              className="rounded-xl p-6 space-y-5"
              style={{
                background: "var(--bg-card)",
                border: "0.5px solid var(--border)",
              }}
            >
              <h2
                className="text-[20px] font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                {c.refusalTitle}
              </h2>

              {/* Timeline */}
              <div className="relative pl-8 space-y-6">
                {/* Vertical line */}
                <div
                  className="absolute left-[11px] top-2 bottom-2 w-[2px]"
                  style={{ background: "var(--border)" }}
                />

                {c.refusalSteps.map((step, i) => (
                  <div key={i} className="relative">
                    <div
                      className="absolute -left-8 top-1 w-[10px] h-[10px] rounded-full border-2"
                      style={{
                        borderColor: "var(--green)",
                        background: "var(--bg-card)",
                      }}
                    />
                    <p
                      className="text-[13px] font-semibold mb-1"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {step.titre}
                    </p>
                    <p
                      className="text-[12px] leading-relaxed"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {step.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Resources grid */}
            <div className="grid sm:grid-cols-3 gap-3">
              <a
                href="https://www.tal.gouv.qc.ca"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl p-4 transition-colors hover-bg block"
                style={{
                  background: "var(--bg-card)",
                  border: "0.5px solid var(--border)",
                }}
              >
                <p
                  className="text-[13px] font-semibold mb-1"
                  style={{ color: "var(--text-primary)" }}
                >
                  {c.resourceTAL.title}
                </p>
                <p
                  className="text-[11px] leading-relaxed"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  {c.resourceTAL.desc}
                </p>
              </a>
              <a
                href="https://rclalq.qc.ca"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl p-4 transition-colors hover-bg block"
                style={{
                  background: "var(--bg-card)",
                  border: "0.5px solid var(--border)",
                }}
              >
                <p
                  className="text-[13px] font-semibold mb-1"
                  style={{ color: "var(--text-primary)" }}
                >
                  {c.resourceRCLALQ.title}
                </p>
                <p
                  className="text-[11px] leading-relaxed"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  {c.resourceRCLALQ.desc}
                </p>
              </a>
              <Link
                href="/"
                className="rounded-xl p-4 transition-colors hover-bg block"
                style={{
                  background: "var(--bg-card)",
                  border: "0.5px solid var(--border)",
                }}
              >
                <p
                  className="text-[13px] font-semibold mb-1"
                  style={{ color: "var(--text-primary)" }}
                >
                  {c.resourceForum.title}
                </p>
                <p
                  className="text-[11px] leading-relaxed"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  {c.resourceForum.desc}
                </p>
              </Link>
            </div>

            {/* Important note */}
            <div
              className="rounded-xl p-4"
              style={{
                background: "var(--blue-bg)",
              }}
            >
              <p
                className="text-[12px] leading-relaxed"
                style={{ color: "var(--blue-text)" }}
              >
                <span className="font-semibold">{c.disclaimerImportant}</span>{" "}
                {c.disclaimerText}
              </p>
            </div>

            {/* CTA community */}
            <CommunityCTA contexte="general" />
          </div>
        </main>
      </div>
    </>
  );
}
