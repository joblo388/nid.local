import Link from "next/link";
import { Header } from "@/components/Header";
import { ReadingProgress } from "@/components/ReadingProgress";
import { CommunityCTA } from "@/components/CommunityCTA";
import { RapCeliappCalc } from "@/components/RapCeliappCalc";
import { SalaireRequis } from "@/components/SalaireRequis";
import { prisma } from "@/lib/prisma";
import { dbPostToAppPost, ressourcesUtiles } from "@/lib/data";
import { getServerLocale } from "@/lib/serverLocale";
import { pageContent } from "./content";
import type { Metadata } from "next";

const BASE_URL = process.env.NEXTAUTH_URL?.replace(/\/$/, "") ?? "https://nid.local";
const PAGE_URL = `${BASE_URL}/premier-acheteur`;

export const metadata: Metadata = {
  title: "Premier acheteur Québec 2026 | RAP, CELIAPP et programmes d'aide",
  description:
    "Guide premier acheteur Québec 2026. CELIAPP (8 000 $/an), RAP (60 000 $), crédit d'impôt fédéral, remise TPS/TVQ et programmes municipaux détaillés.",
  keywords: [
    "premier acheteur québec",
    "RAP régime accession propriété",
    "CELIAPP",
    "aide premier achat maison",
    "mise de fonds premier achat",
    "subvention premier acheteur québec 2026",
    "acheter première maison québec",
    "combien gagner pour acheter maison",
    "calculateur RAP CELIAPP",
    "salaire requis achat maison québec",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Premier acheteur Québec 2026 | RAP, CELIAPP et programmes d'aide",
    description:
      "Tout ce qu'un premier acheteur doit savoir au Québec : CELIAPP, RAP, crédits d'impôt, programmes municipaux et les 6 étapes pour acheter votre première maison.",
    url: PAGE_URL,
    siteName: "nid.local",
    locale: "fr_CA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Premier acheteur au Québec 2026 | Guide complet",
    description:
      "CELIAPP, RAP, crédits d'impôt et programmes d'aide pour les premiers acheteurs au Québec. Guide étape par étape pour acheter votre première maison.",
  },
};

const faqItemsFr = [
  {
    q: "Qu'est-ce que le CELIAPP et combien puis-je y mettre?",
    r: "Le CELIAPP (Compte d'épargne libre d'impôt pour l'achat d'une première propriété) permet de cotiser jusqu'à 8 000 $ par année, pour un maximum à vie de 40 000 $. Les cotisations sont déductibles d'impôt (comme un REER) et les retraits pour l'achat d'une première propriété admissible sont non imposables. Il faut ne pas avoir été propriétaire d'une habitation au cours des quatre dernières années civiles pour être admissible.",
  },
  {
    q: "Puis-je utiliser le RAP et le CELIAPP en même temps?",
    r: "Oui, il est possible de combiner le RAP et le CELIAPP pour le même achat. Vous pouvez retirer jusqu'à 60 000 $ de votre REER via le RAP et jusqu'à 40 000 $ de votre CELIAPP, pour un total potentiel de 100 000 $ par personne. En couple, cela peut atteindre 200 000 $. C'est une stratégie puissante pour maximiser votre mise de fonds.",
  },
  {
    q: "Quelle est la mise de fonds minimale pour un premier achat?",
    r: "La mise de fonds minimale est de 5 % pour les propriétés jusqu'à 500 000 $. Pour les propriétés entre 500 000 $ et 999 999 $, c'est 5 % sur les premiers 500 000 $ et 10 % sur le reste. Pour les propriétés de 1 000 000 $ et plus, la mise de fonds minimale est de 20 %. Avec moins de 20 %, l'assurance hypothécaire SCHL est obligatoire.",
  },
  {
    q: "Combien faut-il gagner pour acheter une maison à Montréal?",
    r: "En 2026, avec un prix médian d'environ 575 000 $ pour une propriété à Montréal, un ménage doit gagner approximativement 110 000 $ à 130 000 $ de revenu brut annuel pour se qualifier avec 5 % de mise de fonds, selon le test de résistance hypothécaire. Ce montant varie selon vos dettes existantes, le taux d'intérêt et la période d'amortissement choisie.",
  },
  {
    q: "Quels sont les frais cachés lors de l'achat d'une première maison?",
    r: "Au-delà du prix d'achat et de la mise de fonds, prévoyez : les frais de notaire (1 500 $ à 3 000 $), la taxe de bienvenue (droits de mutation, variable selon le prix), l'inspection préachat (500 $ à 800 $), l'assurance habitation, les ajustements de taxes municipales et scolaires, les frais de déménagement et les rénovations immédiates. Prévoyez un coussin de 3 % à 5 % du prix d'achat pour ces frais.",
  },
  {
    q: "Est-ce le bon moment pour acheter en 2026?",
    r: "La décision d'acheter dépend de votre situation personnelle plus que du marché. En 2026, les taux d'intérêt se sont stabilisés par rapport aux hausses de 2022-2023, et le marché québécois reste résilient. Si vous avez une mise de fonds suffisante, un emploi stable et prévoyez rester au moins 5 ans, l'achat peut être avantageux. Utilisez notre calculatrice « Acheter ou louer » pour comparer les scénarios.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "nid.local", item: BASE_URL },
        { "@type": "ListItem", position: 2, name: "Premier acheteur", item: PAGE_URL },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: faqItemsFr.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.r,
        },
      })),
    },
  ],
};

const ressources = ressourcesUtiles;


export default async function PremierAcheteurPage() {
  const locale = await getServerLocale();
  const c = pageContent[locale];

  const dbPosts = await prisma.post.findMany({
    orderBy: [{ epingle: "desc" }, { nbVotes: "desc" }],
    take: 5,
  });
  const popularPosts = dbPosts.map(dbPostToAppPost);

  const forumPosts = await prisma.post.findMany({
    where: { categorie: { in: ["question", "financement"] } },
    orderBy: { nbVotes: "desc" },
    take: 3,
    select: { id: true, titre: true, nbVotes: true, nbCommentaires: true, categorie: true, quartierSlug: true },
  });

  return (
    <>
      <ReadingProgress />
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
              {/* H1 + intro */}
              <div>
                <h1 className="text-[22px] font-bold leading-snug mb-2" style={{ color: "var(--text-primary)" }}>
                  {c.h1}
                </h1>
                <p className="text-[13px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {c.intro}
                </p>
              </div>

              {/* ── CELIAPP ── */}
              <div
                className="rounded-xl p-6 space-y-4"
                style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
              >
                <h2 className="text-[15px] font-bold" style={{ color: "var(--text-primary)" }}>
                  {c.celiappTitle}
                </h2>
                <p className="text-[13px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {c.celiappIntro}
                </p>
                <div className="space-y-3">
                  {c.celiappCards.map((item) => (
                    <div key={item.titre} className="flex gap-3 p-3 rounded-lg" style={{ background: item.couleur }}>
                      <div className="flex-1">
                        <p className="text-[12px] font-semibold mb-0.5" style={{ color: item.textColor }}>{item.titre}</p>
                        <p className="text-[12px] leading-relaxed" style={{ color: item.textColor, opacity: 0.85 }}>{item.texte}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA: CELIAPP → capacité d'emprunt */}
              <div className="rounded-lg p-4 flex items-center justify-between flex-wrap gap-3" style={{ background: "var(--bg-secondary)", border: "0.5px solid var(--border)" }}>
                <p className="text-[13px]" style={{ color: "var(--text-secondary)" }}>{c.ctaCeliapp}</p>
                <Link href="/capacite-emprunt" className="text-[12px] font-semibold px-4 py-2 rounded-lg" style={{ background: "var(--green)", color: "#fff" }}>{c.ctaCeliappBtn}</Link>
              </div>

              {/* ── RAP ── */}
              <div
                className="rounded-xl p-6 space-y-4"
                style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
              >
                <h2 className="text-[15px] font-bold" style={{ color: "var(--text-primary)" }}>
                  {c.rapTitle}
                </h2>
                <p className="text-[13px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {c.rapIntro}
                </p>
                <div className="space-y-3">
                  {c.rapCards.map((item) => (
                    <div key={item.titre} className="flex gap-3 p-3 rounded-lg" style={{ background: item.couleur }}>
                      <div className="flex-1">
                        <p className="text-[12px] font-semibold mb-0.5" style={{ color: item.textColor }}>{item.titre}</p>
                        <p className="text-[12px] leading-relaxed" style={{ color: item.textColor, opacity: 0.85 }}>{item.texte}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA: RAP → estimation */}
              <div className="rounded-lg p-4 flex items-center justify-between flex-wrap gap-3" style={{ background: "var(--bg-secondary)", border: "0.5px solid var(--border)" }}>
                <p className="text-[13px]" style={{ color: "var(--text-secondary)" }}>{c.ctaRap}</p>
                <Link href="/estimation" className="text-[12px] font-semibold px-4 py-2 rounded-lg" style={{ background: "var(--green)", color: "#fff" }}>{c.ctaRapBtn}</Link>
              </div>

              {/* ── Autres programmes d'aide ── */}
              <div
                className="rounded-xl p-6 space-y-4"
                style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
              >
                <h2 className="text-[15px] font-bold" style={{ color: "var(--text-primary)" }}>
                  {c.autresProgrammesTitle}
                </h2>
                <div className="space-y-3">
                  {c.autresProgrammesCards.map((item) => (
                    <div key={item.titre} className="flex gap-3 p-3 rounded-lg" style={{ background: item.couleur }}>
                      <div className="flex-1">
                        <p className="text-[12px] font-semibold mb-0.5" style={{ color: item.textColor }}>{item.titre}</p>
                        <p className="text-[12px] leading-relaxed" style={{ color: item.textColor, opacity: 0.85 }}>{item.texte}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
                  {c.autresProgrammesDisclaimer}
                </p>
              </div>

              {/* ── Les étapes pour acheter ── */}
              <div
                className="rounded-xl p-6 space-y-3"
                style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
              >
                <h2 className="text-[15px] font-bold" style={{ color: "var(--text-primary)" }}>
                  {c.etapesTitle}
                </h2>
                <p className="text-[13px] leading-relaxed mb-2" style={{ color: "var(--text-secondary)" }}>
                  {c.etapesIntro}
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  {c.etapes.map((step) => (
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

              {/* ── Calculez votre capacité d'achat ── */}
              <div
                className="rounded-xl p-6 space-y-4"
                style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
              >
                <h2 className="text-[15px] font-bold" style={{ color: "var(--text-primary)" }}>
                  {c.capaciteTitle}
                </h2>
                <p className="text-[13px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {c.capaciteIntro}
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {c.outilsCards.map((outil) => (
                    <Link
                      key={outil.href}
                      href={outil.href}
                      className="flex gap-3 p-4 rounded-lg transition-colors hover-bg"
                      style={{ border: "0.5px solid var(--border)" }}
                    >
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: "var(--green-light-bg)" }}
                      >
                        <svg className="w-4.5 h-4.5" style={{ color: "var(--green)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={outil.icon} />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold mb-0.5" style={{ color: "var(--text-primary)" }}>{outil.titre}</p>
                        <p className="text-[12px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>{outil.description}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* ── Simulateur RAP + CELIAPP ── */}
              <div className="rounded-xl p-6" style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}>
                <h2 className="text-[15px] font-bold mb-4" style={{ color: "var(--text-primary)" }}>{c.simulateurTitle}</h2>
                <RapCeliappCalc />
              </div>

              {/* ── FAQ ── */}
              <div
                className="rounded-xl p-6 space-y-4"
                style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
              >
                <h2 className="text-[15px] font-bold" style={{ color: "var(--text-primary)" }}>
                  {c.faqTitle}
                </h2>
                <dl className="space-y-4">
                  {c.faqItems.map((item) => (
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

              {/* ── Salaire requis ── */}
              <SalaireRequis />

              {/* ── Discussions de premiers acheteurs ── */}
              {forumPosts.length > 0 && (
                <div className="rounded-xl overflow-hidden" style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}>
                  <div className="px-4 py-3" style={{ borderBottom: "0.5px solid var(--border)" }}>
                    <h2 className="text-[15px] font-bold" style={{ color: "var(--text-primary)" }}>{c.forumTitle}</h2>
                  </div>
                  {forumPosts.map((p, i) => (
                    <Link key={p.id} href={`/post/${p.id}`} className="block px-4 py-3 transition-colors hover-bg" style={{ borderBottom: i < forumPosts.length - 1 ? "0.5px solid var(--border)" : "none" }}>
                      <p className="text-[13px] font-medium line-clamp-2" style={{ color: "var(--text-primary)" }}>{p.titre}</p>
                      <p className="text-[11px] mt-1" style={{ color: "var(--text-tertiary)" }}>{c.forumVotesReplies(p.nbVotes, p.nbCommentaires)}</p>
                    </Link>
                  ))}
                  <div className="px-4 py-2.5">
                    <Link href="/?categorie=financement" className="text-[12px] font-medium" style={{ color: "var(--green)" }}>{c.forumAllDiscussions}</Link>
                  </div>
                </div>
              )}

              {/* CTA community */}
              <CommunityCTA
                contexte="general"
                titre={c.ctaCommunityTitre}
                description={c.ctaCommunityDescription}
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
                {c.sidebarSeeDiscussions}
              </Link>

              {popularPosts.length > 0 && (
                <div
                  className="rounded-xl overflow-hidden"
                  style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
                >
                  <div className="px-4 py-3" style={{ borderBottom: "0.5px solid var(--border)" }}>
                    <h3 className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
                      {c.sidebarPopulaires}
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
                      {c.sidebarAllDiscussions} →
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
                    {c.sidebarRessources}
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

              {/* Sticky note */}
              <div
                className="rounded-xl p-4 space-y-2"
                style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
              >
                <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
                  {c.sidebarAboutTitle}
                </p>
                <p className="text-[12px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {c.sidebarAboutText1}
                </p>
                <p className="text-[12px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {c.sidebarAboutText2Before}<strong>{c.sidebarAboutText2Strong1}</strong>{c.sidebarAboutText2Between}<strong>{c.sidebarAboutText2Strong2}</strong>{c.sidebarAboutText2After}
                </p>
              </div>

              <p className="text-[11px] text-center px-2" style={{ color: "var(--text-tertiary)" }}>
                {c.sidebarCopyright}
              </p>
            </aside>
          </div>
        </main>
      </div>
    </>
  );
}
