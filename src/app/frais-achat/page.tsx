import Link from "next/link";
import { Header } from "@/components/Header";
import { CommunityCTA } from "@/components/CommunityCTA";
import { prisma } from "@/lib/prisma";
import { dbPostToAppPost, ressourcesUtiles } from "@/lib/data";
import type { Metadata } from "next";
import { getServerLocale } from "@/lib/serverLocale";
import { calcContent } from "./content";

const BASE_URL = process.env.NEXTAUTH_URL?.replace(/\/$/, "") ?? "https://nid.local";
const PAGE_URL = `${BASE_URL}/frais-achat`;

export const metadata: Metadata = {
  title: "Frais d'achat d'une maison au Québec 2026 | Liste complète et montants",
  description:
    "Tous les frais à prévoir lors de l'achat d'une propriété au Québec : notaire, inspection, taxe de bienvenue, assurance, déménagement. Montants estimatifs et conseils pour éviter les surprises.",
  keywords: [
    "frais achat maison québec",
    "frais de notaire achat maison québec",
    "inspection préachat prix",
    "coût achat maison",
    "frais cachés achat maison",
    "taxe de bienvenue",
    "assurance titre",
    "frais déménagement",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Frais d'achat d'une maison au Québec 2026 | Liste complète et montants",
    description:
      "Tous les frais à prévoir lors de l'achat d'une propriété au Québec : notaire, inspection, taxe de bienvenue, assurance, déménagement. Montants estimatifs et conseils.",
    url: PAGE_URL,
    siteName: "nid.local",
    locale: "fr_CA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Frais d'achat d'une maison au Québec 2026 | Liste complète",
    description:
      "Notaire, inspection, taxe de bienvenue, assurance titre, déménagement… Tous les frais à prévoir pour acheter une propriété au Québec.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "nid.local", item: BASE_URL },
        { "@type": "ListItem", position: 2, name: "Frais d'achat", item: PAGE_URL },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Combien coûte un notaire pour l'achat d'une maison au Québec?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Les frais de notaire pour un achat immobilier au Québec varient généralement entre 1 500 $ et 2 500 $. Ce montant couvre l'examen des titres de propriété, la publication de l'acte de vente au Registre foncier et, si applicable, la radiation de l'ancienne hypothèque. Les honoraires peuvent varier selon la complexité de la transaction.",
          },
        },
        {
          "@type": "Question",
          name: "L'inspection préachat est-elle obligatoire au Québec?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "L'inspection préachat n'est pas légalement obligatoire au Québec, mais elle est fortement recommandée. Elle coûte entre 500 $ et 800 $ et permet de détecter des problèmes de structure, toiture, plomberie ou électricité avant de finaliser l'achat. Sans inspection, l'acheteur assume tous les risques de vices cachés.",
          },
        },
        {
          "@type": "Question",
          name: "Quel pourcentage du prix d'achat prévoir en frais supplémentaires?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "En règle générale, il faut prévoir entre 3 % et 5 % du prix d'achat en frais supplémentaires. Pour une maison à 450 000 $, cela représente environ 17 000 $ à 25 000 $ en frais de notaire, inspection, taxe de bienvenue, assurances, déménagement et ajustements de taxes.",
          },
        },
        {
          "@type": "Question",
          name: "Qui paie le certificat de localisation lors d'un achat?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Au Québec, c'est généralement le vendeur qui fournit le certificat de localisation à jour. Cependant, cette obligation doit être précisée dans la promesse d'achat. Si le certificat a plus de 10 ans ou si des travaux ont été effectués, un nouveau certificat (1 500 $ à 2 000 $) sera nécessaire.",
          },
        },
        {
          "@type": "Question",
          name: "Peut-on inclure les frais d'achat dans l'hypothèque?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Non, les frais d'achat (notaire, taxe de bienvenue, inspection, etc.) ne peuvent généralement pas être financés par l'hypothèque au Québec. Ces montants doivent être payés comptant au moment de la transaction ou dans les semaines suivant l'achat. Il est donc essentiel de les prévoir dans son budget.",
          },
        },
      ],
    },
  ],
};

const ressources = ressourcesUtiles;

export default async function FraisAchatPage() {
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
              {/* H1 + Intro */}
              <div>
                <h1 className="text-[22px] font-bold leading-snug mb-2" style={{ color: "var(--text-primary)" }}>
                  {c.h1}
                </h1>
                <p className="text-[13px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {c.intro}
                </p>
              </div>

              {/* Purchase costs cards */}
              <div
                className="rounded-xl p-6 space-y-4"
                style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
              >
                <h2 className="text-[15px] font-bold" style={{ color: "var(--text-primary)" }}>
                  {c.allFeesTitle}
                </h2>
                <div className="space-y-3">
                  {c.fraisAchat.map((frais) => (
                    <div key={frais.lettre} className="flex gap-3 p-3 rounded-lg" style={{ background: frais.couleur }}>
                      <div
                        className="w-6 h-6 rounded-full text-[12px] font-bold flex items-center justify-center shrink-0 mt-0.5"
                        style={{ color: frais.textColor, border: `0.5px solid ${frais.textColor}` }}
                      >
                        {frais.lettre}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-0.5 flex-wrap gap-1">
                          <p className="text-[13px] font-semibold" style={{ color: frais.textColor }}>
                            {frais.titre}
                          </p>
                          <span className="text-[12px] font-bold" style={{ color: frais.textColor }}>
                            {frais.montant}
                          </span>
                        </div>
                        <p className="text-[12px] leading-relaxed" style={{ color: frais.textColor, opacity: 0.85 }}>
                          {frais.description}
                        </p>
                        {frais.lien && (
                          <Link
                            href={frais.lien.href}
                            className="inline-block mt-1 text-[12px] font-medium transition-opacity hover:opacity-70"
                            style={{ color: frais.textColor }}
                          >
                            {frais.lien.label}
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
                  {c.fraisDisclaimer}
                </p>
              </div>

              {/* Exemple concret */}
              <div
                className="rounded-xl p-6 space-y-4"
                style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
              >
                <h2 className="text-[15px] font-bold" style={{ color: "var(--text-primary)" }}>
                  {c.exempleTitle}
                </h2>
                <p className="text-[13px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {c.exempleIntro}
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-[12px]">
                    <thead>
                      <tr style={{ borderBottom: "0.5px solid var(--border)" }}>
                        <th className="text-left py-2 pr-3 font-semibold" style={{ color: "var(--text-primary)" }}>
                          {c.tableHeaderPoste}
                        </th>
                        <th className="text-right py-2 px-3 font-semibold" style={{ color: "var(--text-primary)" }}>
                          {c.tableHeaderBas}
                        </th>
                        <th className="text-right py-2 pl-3 font-semibold" style={{ color: "var(--text-primary)" }}>
                          {c.tableHeaderHaut}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {c.exempleCalcul.map((ligne) => (
                        <tr key={ligne.poste} style={{ borderBottom: "0.5px solid var(--border)" }}>
                          <td className="py-2 pr-3" style={{ color: "var(--text-secondary)" }}>
                            {ligne.poste}
                          </td>
                          <td className="text-right py-2 px-3" style={{ color: "var(--text-secondary)" }}>
                            {ligne.montantBas}
                          </td>
                          <td className="text-right py-2 pl-3" style={{ color: "var(--text-secondary)" }}>
                            {ligne.montantHaut}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td className="py-3 pr-3 font-bold text-[13px]" style={{ color: "var(--text-primary)" }}>
                          {c.totalLabel}
                        </td>
                        <td className="text-right py-3 px-3 font-bold text-[13px]" style={{ color: "var(--green)" }}>
                          {c.totalBas}
                        </td>
                        <td className="text-right py-3 pl-3 font-bold text-[13px]" style={{ color: "var(--green)" }}>
                          {c.totalHaut}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
                <div className="p-3 rounded-lg" style={{ background: "var(--amber-bg)" }}>
                  <p className="text-[12px] leading-relaxed" style={{ color: "var(--amber-text)" }}>
                    {c.conseil}
                  </p>
                </div>
              </div>

              {/* Liens vers nos calculatrices */}
              <div
                className="rounded-xl p-6 space-y-4"
                style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
              >
                <h2 className="text-[15px] font-bold" style={{ color: "var(--text-primary)" }}>
                  {c.calcLinksTitle}
                </h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {c.calcLinks.map((calc) => (
                    <Link
                      key={calc.href}
                      href={calc.href}
                      className="flex gap-3 p-3 rounded-lg transition-colors hover-bg"
                      style={{ border: "0.5px solid var(--border)" }}
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: "var(--green-light-bg)" }}
                      >
                        <svg className="w-4 h-4" style={{ color: "var(--green)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={calc.icon} />
                        </svg>
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold" style={{ color: "var(--text-primary)" }}>
                          {calc.titre}
                        </p>
                        <p className="text-[11px] leading-relaxed" style={{ color: "var(--text-tertiary)" }}>
                          {calc.description}
                        </p>
                      </div>
                    </Link>
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

              {/* CTA community */}
              <CommunityCTA
                contexte="general"
                titre={c.ctaTitre}
              />
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
                      {c.allDiscussions} &rarr;
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

              {/* Note about the page */}
              <div
                className="rounded-xl p-4 space-y-2"
                style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
              >
                <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
                  {c.aboutPage}
                </p>
                <p className="text-[12px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {c.aboutText1}
                </p>
                <p className="text-[12px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {c.aboutText2}
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
