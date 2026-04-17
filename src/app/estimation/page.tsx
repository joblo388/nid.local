import Link from "next/link";
import { Header } from "@/components/Header";
import { CommunityCTA } from "@/components/CommunityCTA";
import { EstimationClient } from "./EstimationClient";
import { CalcActions } from "@/components/CalcActions";
import { prisma } from "@/lib/prisma";
import { dbPostToAppPost, ressourcesUtiles } from "@/lib/data";
import { getServerLocale } from "@/lib/serverLocale";
import { calcContent } from "./content";
import type { Metadata } from "next";

const BASE_URL = process.env.NEXTAUTH_URL?.replace(/\/$/, "") ?? "https://nid.local";
const PAGE_URL = `${BASE_URL}/estimation`;

export const metadata: Metadata = {
  title: "Combien vaut ma maison? | Estimation gratuite Québec 2026",
  description:
    "Estimez gratuitement la valeur de votre maison, condo ou plex au Québec. Comparez l'évaluation municipale vs le prix du marché et obtenez la valeur marchande réelle de votre propriété en quelques clics. Résultats instantanés basés sur les données médianes par quartier.",
  keywords: [
    "combien vaut ma maison",
    "estimation maison gratuite",
    "valeur marchande maison québec",
    "évaluation municipale vs valeur marchande",
    "estimation valeur propriété",
    "estimation immobilière québec",
    "valeur maison québec",
    "estimation prix maison",
    "évaluation immobilière",
    "prix propriété québec",
    "valeur condo québec",
    "estimation plex",
    "valeur marchande propriété",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Combien vaut ma maison? | Estimation gratuite Québec 2026",
    description:
      "Estimez gratuitement la valeur de votre maison, condo ou plex au Québec. Comparez l'évaluation municipale vs le prix du marché.",
    url: PAGE_URL,
    siteName: "nid.local",
    locale: "fr_CA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Combien vaut ma maison? | Estimation gratuite Québec 2026",
    description:
      "Estimez gratuitement la valeur de votre maison, condo ou plex au Québec. Comparez l'évaluation municipale vs le prix du marché.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "nid.local", "item": BASE_URL },
        { "@type": "ListItem", "position": 2, "name": "Estimation de valeur", "item": PAGE_URL },
      ],
    },
    {
      "@type": "WebApplication",
      "name": "Combien vaut ma maison? | Estimation gratuite Québec 2026",
      "url": PAGE_URL,
      "description":
        "Estimez la valeur de votre propriété au Québec selon les données médianes du marché par quartier, type de propriété, superficie, chambres, salles de bain, année de construction et état.",
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
          "name": "Comment est calculée l'estimation de valeur?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "L'estimation se base sur le prix médian du marché pour votre quartier et type de propriété, puis applique des ajustements pour la superficie, le nombre de chambres et salles de bain, l'année de construction et l'état général. Le résultat est une estimation indicative avec une fourchette de +/- 10%.",
          },
        },
        {
          "@type": "Question",
          "name": "Quelle est la précision de cette estimation?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Cette estimation est fournie à titre indicatif seulement. La valeur réelle peut varier en fonction de l'emplacement exact, des rénovations effectuées, du terrain, de la vue et des conditions du marché. Pour une évaluation précise, consultez un évaluateur agréé ou un courtier immobilier.",
          },
        },
        {
          "@type": "Question",
          "name": "Quels types de propriété sont supportés?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "L'outil supporte les maisons unifamiliales, les condos, les duplex, les triplex et les quadruplex. Les données de marché couvrent plus de 50 quartiers à travers le Québec, incluant Montréal, Québec, Laval, Longueuil, Sherbrooke, Gatineau et d'autres villes.",
          },
        },
      ],
    },
  ],
};

const ressources = ressourcesUtiles;

export default async function EstimationPage() {
  const locale = await getServerLocale();
  const c = calcContent[locale];

  const dbPosts = await prisma.post.findMany({
    orderBy: [{ epingle: "desc" }, { nbVotes: "desc" }],
    take: 5,
  });
  const popularPosts = dbPosts.map(dbPostToAppPost);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen" style={{ background: "var(--bg-page)" }}>
        <Header />
        <main className="max-w-[1100px] mx-auto px-3 md:px-5 py-4 md:py-6 pb-20 md:pb-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-[12px] mb-5" style={{ color: "var(--text-tertiary)" }} aria-label="Fil d'Ariane">
            <Link href="/" className="transition-opacity hover:opacity-70" style={{ color: "var(--text-tertiary)" }}>
              nid.local
            </Link>
            <span>/</span>
            <span style={{ color: "var(--text-secondary)" }}>{c.breadcrumb}</span>
          </nav>

          <div className="flex gap-5 items-start">
            {/* Main column */}
            <div className="flex-1 min-w-0 space-y-5">
              <div>
                <h1 className="text-[22px] font-bold leading-snug mb-2" style={{ color: "var(--text-primary)" }}>
                  {c.h1}
                </h1>
                <p className="text-[13px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {c.intro}
                </p>
              </div>

              {/* Estimation tool */}
              <div
                className="rounded-xl p-6"
                style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
              >
                <EstimationClient />
                <CalcActions />
              </div>

              {/* How it works */}
              <div
                className="rounded-xl p-6 space-y-3"
                style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
              >
                <h2 className="text-[15px] font-bold" style={{ color: "var(--text-primary)" }}>
                  {c.howItWorks}
                </h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {c.steps.map((step) => (
                    <div key={step.n} className="flex gap-3">
                      <div
                        className="w-6 h-6 rounded-full text-[12px] font-bold flex items-center justify-center shrink-0 mt-0.5 text-white"
                        style={{ background: "var(--green)" }}
                      >
                        {step.n}
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold mb-1" style={{ color: "var(--text-primary)" }}>{step.titre}</p>
                        <p className="text-[12px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>{step.texte}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Factors explained */}
              <div
                className="rounded-xl p-6 space-y-4"
                style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
              >
                <h2 className="text-[15px] font-bold" style={{ color: "var(--text-primary)" }}>
                  {c.factorsTitle}
                </h2>
                <div className="space-y-3">
                  {c.factors.map((rule) => (
                    <div key={rule.titre} className="flex gap-3 p-3 rounded-lg" style={{ background: rule.couleur }}>
                      <div className="flex-1">
                        <p className="text-[12px] font-semibold mb-0.5" style={{ color: rule.textColor }}>{rule.titre}</p>
                        <p className="text-[12px] leading-relaxed" style={{ color: rule.textColor, opacity: 0.85 }}>{rule.texte}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQ */}
              <div
                className="rounded-xl p-6 space-y-4"
                style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
              >
                <h2 className="text-[15px] font-bold" style={{ color: "var(--text-primary)" }}>
                  {c.faqTitle}
                </h2>
                <dl className="space-y-4">
                  {c.faqs.map((item) => (
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

              {/* Outils connexes */}
              <div className="rounded-xl p-6 space-y-3" style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}>
                <h2 className="text-[15px] font-bold" style={{ color: "var(--text-primary)" }}>{c.relatedTitle}</h2>
                <div className="grid sm:grid-cols-3 gap-3">
                  {c.relatedTools.map((tool) => (
                    <Link key={tool.href} href={tool.href} className="p-3 rounded-lg transition-colors hover-bg" style={{ background: "var(--bg-secondary)", border: "0.5px solid var(--border)" }}>
                      <p className="text-[13px] font-semibold mb-0.5" style={{ color: "var(--text-primary)" }}>{tool.label}</p>
                      <p className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>{tool.desc}</p>
                    </Link>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <CommunityCTA contexte="estimation" />
            </div>

            {/* Sidebar */}
            <aside className="hidden md:flex flex-col gap-3 w-[240px] shrink-0">
              <Link
                href="/"
                className="w-full py-2.5 rounded-xl text-[13px] font-semibold text-white transition-opacity hover:opacity-90 flex items-center justify-center gap-2"
                style={{ background: "var(--green)" }}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                {c.seeDiscussions}
              </Link>

              {popularPosts.length > 0 && (
                <div
                  className="rounded-xl overflow-hidden"
                  style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
                >
                  <div className="px-4 py-3" style={{ borderBottom: "0.5px solid var(--border)" }}>
                    <h3 className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
                      {c.popularDiscussions}
                    </h3>
                  </div>
                  <ul>
                    {popularPosts.map((post, i) => (
                      <li key={post.id} style={{ borderBottom: i < popularPosts.length - 1 ? "0.5px solid var(--border)" : "none" }}>
                        <Link href={`/post/${post.id}`} className="flex flex-col gap-1 px-4 py-3 transition-colors hover-bg">
                          <span className="text-[12px] font-medium leading-snug line-clamp-2" style={{ color: "var(--text-primary)" }}>
                            {post.titre}
                          </span>
                          <span className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
                            {post.quartier.nom} · {post.nbVotes} vote{post.nbVotes !== 1 ? "s" : ""}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <div className="px-4 py-2.5">
                    <Link href="/" className="text-[12px] font-medium transition-opacity hover:opacity-70" style={{ color: "var(--green)" }}>
                      {c.allDiscussions} →
                    </Link>
                  </div>
                </div>
              )}

              <div
                className="rounded-xl overflow-hidden"
                style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
              >
                <div className="px-4 py-3" style={{ borderBottom: "0.5px solid var(--border)" }}>
                  <h3 className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
                    {c.usefulResources}
                  </h3>
                </div>
                <ul>
                  {ressources.map((r, i) => (
                    <li key={r.label} style={{ borderBottom: i < ressources.length - 1 ? "0.5px solid var(--border)" : "none" }}>
                      <Link href={r.href} className="flex items-center justify-between px-4 py-2.5 transition-colors hover-bg">
                        <span className="text-[13px]" style={{ color: "var(--text-primary)" }}>{r.label}</span>
                        <svg className="w-3 h-3 shrink-0" style={{ color: "var(--text-tertiary)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* About the tool */}
              <div
                className="rounded-xl p-4 space-y-2"
                style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
              >
                <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
                  {c.aboutTool}
                </p>
                <p className="text-[12px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {c.aboutText1}
                </p>
                <p className="text-[12px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {c.aboutText2Pre}<strong>{c.aboutText2Evaluateur}</strong>{c.aboutText2Mid}<strong>{c.aboutText2Courtier}</strong>{c.aboutText2Post}
                </p>
              </div>

              <p className="text-[11px] text-center px-2" style={{ color: "var(--text-tertiary)" }}>
                {c.copyright}
              </p>
            </aside>
          </div>
        </main>
      </div>
    </>
  );
}
