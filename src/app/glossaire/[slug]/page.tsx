import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { CommunityCTA } from "@/components/CommunityCTA";
import {
  glossaire,
  glossaireBySlug,
  glossaireByLettre,
} from "@/data/glossaire";
import type { Metadata } from "next";

const BASE_URL =
  process.env.NEXTAUTH_URL?.replace(/\/$/, "") ?? "https://nid.local";

/* ── Static params ────────────────────────────────────────────────────── */

export function generateStaticParams() {
  return glossaire.map((g) => ({ slug: g.slug }));
}

/* ── Metadata ─────────────────────────────────────────────────────────── */

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = glossaireBySlug[slug];
  if (!entry) return {};

  const title = `${entry.terme} | Glossaire immobilier Québec`;
  const description = entry.definition.slice(0, 155).replace(/\s+\S*$/, "...");
  const url = `${BASE_URL}/glossaire/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "nid.local",
      locale: "fr_CA",
      type: "article",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

/* ── Helpers ──────────────────────────────────────────────────────────── */

function getAutresTermes(currentSlug: string, count: number) {
  const autres = glossaire.filter((g) => g.slug !== currentSlug);
  const shuffled = [...autres].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/* ── Page ─────────────────────────────────────────────────────────────── */

export default async function GlossairePage({ params }: Props) {
  const { slug } = await params;
  const entry = glossaireBySlug[slug];
  if (!entry) notFound();

  const termesLies = (entry.termesLies ?? [])
    .map((s) => glossaireBySlug[s])
    .filter(Boolean);

  const autresTermes = getAutresTermes(slug, 6);

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
            name: "Lexique immobilier",
            item: `${BASE_URL}/lexique`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: entry.terme,
            item: `${BASE_URL}/glossaire/${slug}`,
          },
        ],
      },
      {
        "@type": "DefinedTerm",
        name: entry.terme,
        description: entry.definition,
        inDefinedTermSet: {
          "@type": "DefinedTermSet",
          name: "Lexique immobilier | Québec 2026",
          url: `${BASE_URL}/lexique`,
        },
        url: `${BASE_URL}/glossaire/${slug}`,
        inLanguage: "fr-CA",
      },
    ],
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-page)" }}>
      <Header />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="max-w-[700px] mx-auto px-3 md:px-5 py-4 md:py-6 pb-20 md:pb-6">
        {/* ── Breadcrumb ───────────────────────────────────────────── */}
        <nav
          className="text-[12px] mb-4"
          style={{ color: "var(--text-tertiary)" }}
          aria-label="Fil d'Ariane"
        >
          <Link href="/" className="hover:underline">
            nid.local
          </Link>{" "}
          <span aria-hidden="true">/</span>{" "}
          <Link href="/lexique" className="hover:underline">
            Lexique
          </Link>{" "}
          <span aria-hidden="true">/</span>{" "}
          <span style={{ color: "var(--text-secondary)" }}>
            {entry.terme}
          </span>
        </nav>

        {/* ── Lettre badge ─────────────────────────────────────────── */}
        <div className="flex items-center gap-3 mb-3">
          <span
            className="w-9 h-9 flex items-center justify-center rounded-xl text-[16px] font-bold shrink-0"
            style={{
              background: "var(--green-light-bg)",
              color: "var(--green-text)",
            }}
          >
            {entry.lettre}
          </span>
          <h1
            className="text-[22px] font-bold leading-snug"
            style={{ color: "var(--text-primary)" }}
          >
            {entry.terme}
          </h1>
        </div>

        {/* ── Definition ───────────────────────────────────────────── */}
        <div
          className="rounded-xl p-5 mb-6"
          style={{
            background: "var(--bg-card)",
            border: "0.5px solid var(--border)",
          }}
        >
          <p
            className="text-[14px] leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            {entry.definition}
          </p>

          {entry.lienCalculateur && (
            <div className="mt-4 pt-3" style={{ borderTop: "0.5px solid var(--border)" }}>
              <Link
                href={entry.lienCalculateur}
                className="inline-flex items-center gap-1.5 text-[13px] font-medium transition-opacity hover:opacity-80"
                style={{ color: "var(--green-text)" }}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                Utiliser la calculatrice
              </Link>
            </div>
          )}
        </div>

        {/* ── Termes liés ──────────────────────────────────────────── */}
        {termesLies.length > 0 && (
          <section className="mb-8">
            <h2
              className="text-[15px] font-bold mb-3"
              style={{ color: "var(--text-primary)" }}
            >
              Termes liés
            </h2>
            <div className="flex flex-wrap gap-2">
              {termesLies.map((t) => (
                <Link
                  key={t.slug}
                  href={`/glossaire/${t.slug}`}
                  className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-[12px] font-medium transition-opacity hover:opacity-80"
                  style={{
                    background: "var(--green-light-bg)",
                    color: "var(--green-text)",
                  }}
                >
                  {t.terme}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── Autres termes ────────────────────────────────────────── */}
        <section className="mb-8">
          <h2
            className="text-[15px] font-bold mb-3"
            style={{ color: "var(--text-primary)" }}
          >
            Autres termes du lexique
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {autresTermes.map((t) => (
              <Link
                key={t.slug}
                href={`/glossaire/${t.slug}`}
                className="rounded-xl p-3 transition-opacity hover:opacity-80"
                style={{
                  background: "var(--bg-card)",
                  border: "0.5px solid var(--border)",
                }}
              >
                <span
                  className="text-[13px] font-semibold block"
                  style={{ color: "var(--text-primary)" }}
                >
                  {t.terme}
                </span>
                <span
                  className="text-[11px] line-clamp-2 mt-0.5"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  {t.definition.slice(0, 80)}...
                </span>
              </Link>
            ))}
          </div>
          <div className="mt-3 text-center">
            <Link
              href="/lexique"
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
                  d="M11 17l-5-5m0 0l5-5m-5 5h12"
                />
              </svg>
              Voir tous les termes
            </Link>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────── */}
        <CommunityCTA contexte="general" />
      </main>
    </div>
  );
}
