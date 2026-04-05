import Link from "next/link";
import { Header } from "@/components/Header";
import { ReadingProgress } from "@/components/ReadingProgress";
import { CommunityCTA } from "@/components/CommunityCTA";
import { RapCeliappCalc } from "@/components/RapCeliappCalc";
import { SalaireRequis } from "@/components/SalaireRequis";
import { prisma } from "@/lib/prisma";
import { dbPostToAppPost, ressourcesUtiles } from "@/lib/data";
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

const faqItems = [
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
      mainEntity: faqItems.map((item) => ({
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

const outilsCards = [
  {
    href: "/calculatrice-hypothecaire",
    titre: "Calculatrice hypothécaire",
    description: "Estimez votre paiement mensuel selon les taux du marché et calculez la prime SCHL.",
    icon: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z",
  },
  {
    href: "/capacite-emprunt",
    titre: "Capacité d'emprunt",
    description: "Découvrez combien vous pouvez emprunter selon votre revenu et vos dettes actuelles.",
    icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    href: "/taxe-bienvenue",
    titre: "Taxe de bienvenue",
    description: "Calculez les droits de mutation immobilière selon votre ville et le prix d'achat.",
    icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
  },
  {
    href: "/estimation",
    titre: "Estimation de valeur",
    description: "Obtenez une estimation de la valeur marchande d'une propriété dans votre quartier.",
    icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
  },
];

export default async function PremierAcheteurPage() {
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
            <span style={{ color: "var(--text-secondary)" }}>Premier acheteur</span>
          </nav>

          <div className="flex gap-5 items-start">
            {/* Main column */}
            <div className="flex-1 min-w-0 space-y-5">
              {/* H1 + intro */}
              <div>
                <h1 className="text-[22px] font-bold leading-snug mb-2" style={{ color: "var(--text-primary)" }}>
                  Premier acheteur au Québec | Guide complet 2026
                </h1>
                <p className="text-[13px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  Acheter sa première maison au Québec est un projet excitant, mais aussi complexe. En 2026, le prix médian d&apos;une unifamiliale au Québec est de 536 000 $. Entre le CELIAPP, le RAP,
                  les crédits d&apos;impôt et les programmes municipaux, il existe plusieurs leviers pour réduire le coût de votre
                  premier achat. Voici tous les programmes et étapes pour réaliser votre projet.
                </p>
              </div>

              {/* ── CELIAPP ── */}
              <div
                className="rounded-xl p-6 space-y-4"
                style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
              >
                <h2 className="text-[15px] font-bold" style={{ color: "var(--text-primary)" }}>
                  Le CELIAPP | Compte d&apos;épargne libre d&apos;impôt pour l&apos;achat d&apos;une première propriété
                </h2>
                <p className="text-[13px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  Le CELIAPP est l&apos;outil d&apos;épargne le plus avantageux pour les premiers acheteurs au Canada. Il combine
                  les avantages du REER (déduction à la cotisation) et du CELI (retrait non imposable), spécifiquement pour
                  l&apos;achat d&apos;une première habitation admissible.
                </p>
                <div className="space-y-3">
                  {[
                    {
                      titre: "Cotisation maximale",
                      texte: "Jusqu'à 8 000 $ par année, pour un maximum à vie de 40 000 $. Les droits de cotisation inutilisés peuvent être reportés à l'année suivante (jusqu'à 8 000 $ de report).",
                      couleur: "var(--blue-bg)",
                      textColor: "var(--blue-text)",
                    },
                    {
                      titre: "Avantage fiscal double",
                      texte: "Les cotisations sont déductibles de votre revenu imposable (comme un REER), et les retraits pour l'achat de votre première propriété sont entièrement non imposables (comme un CELI).",
                      couleur: "var(--green-light-bg)",
                      textColor: "var(--green-text)",
                    },
                    {
                      titre: "Admissibilité",
                      texte: "Vous devez être un résident canadien d'au moins 18 ans et ne pas avoir été propriétaire d'une habitation admissible au cours des quatre dernières années civiles (ni au cours de l'année d'ouverture).",
                      couleur: "var(--amber-bg)",
                      textColor: "var(--amber-text)",
                    },
                    {
                      titre: "Combinaison avec le RAP",
                      texte: "Le CELIAPP peut être utilisé en même temps que le RAP pour le même achat. Cela permet de combiner jusqu'à 40 000 $ (CELIAPP) + 60 000 $ (RAP) = 100 000 $ par personne pour votre mise de fonds.",
                      couleur: "var(--red-bg)",
                      textColor: "var(--red-text)",
                    },
                  ].map((item) => (
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
                <p className="text-[13px]" style={{ color: "var(--text-secondary)" }}>Calculez votre capacité d&apos;emprunt avec le CELIAPP</p>
                <Link href="/capacite-emprunt" className="text-[12px] font-semibold px-4 py-2 rounded-lg" style={{ background: "var(--green)", color: "#fff" }}>Calculer ma capacité</Link>
              </div>

              {/* ── RAP ── */}
              <div
                className="rounded-xl p-6 space-y-4"
                style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
              >
                <h2 className="text-[15px] font-bold" style={{ color: "var(--text-primary)" }}>
                  Le RAP | Régime d&apos;accession à la propriété
                </h2>
                <p className="text-[13px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  Le RAP permet de retirer des fonds de votre REER sans payer d&apos;impôt pour acheter ou construire une
                  habitation admissible. Depuis avril 2024, le plafond de retrait a été augmenté de manière significative.
                </p>
                <div className="space-y-3">
                  {[
                    {
                      titre: "Plafond de retrait",
                      texte: "Maximum de 60 000 $ par personne depuis avril 2024 (anciennement 35 000 $). En couple, cela représente jusqu'à 120 000 $ de retrait REER sans impôt pour votre premier achat.",
                      couleur: "var(--blue-bg)",
                      textColor: "var(--blue-text)",
                    },
                    {
                      titre: "Retrait sans impôt",
                      texte: "Les montants retirés dans le cadre du RAP ne sont pas ajoutés à votre revenu imposable l'année du retrait. Vous devez cependant rembourser le montant dans votre REER sur une période de 15 ans.",
                      couleur: "var(--green-light-bg)",
                      textColor: "var(--green-text)",
                    },
                    {
                      titre: "Remboursement",
                      texte: "Le remboursement commence à la 5e année suivant le retrait (anciennement la 2e année). Vous devez rembourser au moins 1/15 du montant retiré chaque année, sinon cette portion est ajoutée à votre revenu imposable.",
                      couleur: "var(--amber-bg)",
                      textColor: "var(--amber-text)",
                    },
                    {
                      titre: "Conditions d'admissibilité",
                      texte: "Vous devez être considéré comme un acheteur d'une première habitation (pas propriétaire dans les 4 dernières années). Les fonds doivent être dans le REER depuis au moins 90 jours avant le retrait. L'habitation doit être votre résidence principale.",
                      couleur: "var(--red-bg)",
                      textColor: "var(--red-text)",
                    },
                  ].map((item) => (
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
                <p className="text-[13px]" style={{ color: "var(--text-secondary)" }}>Combien vaut votre propriété actuelle?</p>
                <Link href="/estimation" className="text-[12px] font-semibold px-4 py-2 rounded-lg" style={{ background: "var(--green)", color: "#fff" }}>Estimer la valeur</Link>
              </div>

              {/* ── Autres programmes d'aide ── */}
              <div
                className="rounded-xl p-6 space-y-4"
                style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
              >
                <h2 className="text-[15px] font-bold" style={{ color: "var(--text-primary)" }}>
                  Autres programmes d&apos;aide pour premiers acheteurs
                </h2>
                <div className="space-y-3">
                  {[
                    {
                      titre: "Crédit d'impôt pour achat d'une habitation (fédéral)",
                      texte: "Un crédit d'impôt non remboursable de 10 000 $, soit une réduction d'impôt d'environ 1 500 $. Il est offert automatiquement aux acheteurs d'une première habitation admissible lors de la déclaration de revenus fédérale.",
                      couleur: "var(--blue-bg)",
                      textColor: "var(--blue-text)",
                    },
                    {
                      titre: "Remise TPS/TVQ sur habitations neuves",
                      texte: "Si vous achetez une propriété neuve ou substantiellement rénovée, vous pouvez obtenir un remboursement partiel de la TPS (jusqu'à 36 % de la TPS payée, pour les propriétés de moins de 450 000 $) et de la TVQ (remboursement similaire au Québec).",
                      couleur: "var(--green-light-bg)",
                      textColor: "var(--green-text)",
                    },
                    {
                      titre: "Programmes municipaux",
                      texte: "Plusieurs municipalités offrent des incitatifs aux premiers acheteurs. Par exemple, le programme Accès Condos à Montréal offre des conditions avantageuses sur certains projets neufs. Vérifiez auprès de votre ville pour connaître les programmes disponibles.",
                      couleur: "var(--amber-bg)",
                      textColor: "var(--amber-text)",
                    },
                    {
                      titre: "Remboursement de la taxe de bienvenue",
                      texte: "Certaines villes du Québec offrent un remboursement partiel ou total de la taxe de bienvenue (droits de mutation) aux premiers acheteurs. Les conditions et montants maximaux varient d'une municipalité à l'autre.",
                      couleur: "var(--red-bg)",
                      textColor: "var(--red-text)",
                    },
                  ].map((item) => (
                    <div key={item.titre} className="flex gap-3 p-3 rounded-lg" style={{ background: item.couleur }}>
                      <div className="flex-1">
                        <p className="text-[12px] font-semibold mb-0.5" style={{ color: item.textColor }}>{item.titre}</p>
                        <p className="text-[12px] leading-relaxed" style={{ color: item.textColor, opacity: 0.85 }}>{item.texte}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
                  Les programmes et montants mentionnés sont à titre informatif et peuvent changer. Vérifiez les conditions d&apos;admissibilité auprès des organismes concernés.
                </p>
              </div>

              {/* ── Les étapes pour acheter ── */}
              <div
                className="rounded-xl p-6 space-y-3"
                style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
              >
                <h2 className="text-[15px] font-bold" style={{ color: "var(--text-primary)" }}>
                  Les étapes pour acheter votre première maison
                </h2>
                <p className="text-[13px] leading-relaxed mb-2" style={{ color: "var(--text-secondary)" }}>
                  Le processus d&apos;achat d&apos;une première propriété au Québec suit généralement ces six grandes étapes.
                  Bien les comprendre vous évitera des surprises et vous permettra de négocier avec confiance.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    {
                      n: "1",
                      titre: "Évaluer votre budget",
                      texte: "Faites le bilan de vos revenus, dettes et épargnes. Calculez votre mise de fonds disponible (CELIAPP + RAP + économies). Utilisez notre calculatrice de capacité d'emprunt pour connaître votre budget maximal.",
                    },
                    {
                      n: "2",
                      titre: "Obtenir une pré-approbation hypothécaire",
                      texte: "Consultez un courtier hypothécaire ou votre institution financière pour obtenir une pré-approbation. Cela confirme votre budget et vous donne un avantage lors des négociations avec les vendeurs.",
                    },
                    {
                      n: "3",
                      titre: "Chercher votre propriété",
                      texte: "Explorez les quartiers qui vous intéressent, visitez des propriétés et comparez les prix du marché. Faites appel à un courtier immobilier pour vous accompagner dans vos recherches.",
                    },
                    {
                      n: "4",
                      titre: "Faire une offre d'achat",
                      texte: "Rédigez une promesse d'achat avec l'aide de votre courtier. Incluez les conditions essentielles : inspection préachat, financement et vérification des titres. Négociez le prix et les délais.",
                    },
                    {
                      n: "5",
                      titre: "Faire inspecter la propriété",
                      texte: "L'inspection préachat est cruciale pour un premier acheteur. Un inspecteur certifié vérifiera la structure, la toiture, la plomberie, l'électricité et les fondations. Budget : 500 $ à 800 $.",
                    },
                    {
                      n: "6",
                      titre: "Passer chez le notaire",
                      texte: "Le notaire finalise la transaction : examen des titres, préparation de l'acte de vente et de l'hypothèque, ajustements de taxes. Prévoyez 1 500 $ à 3 000 $ pour les frais de notaire.",
                    },
                  ].map((step) => (
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
                  Calculez votre capacité d&apos;achat
                </h2>
                <p className="text-[13px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  Utilisez nos outils gratuits pour planifier votre premier achat en toute confiance.
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {outilsCards.map((outil) => (
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
                <h2 className="text-[15px] font-bold mb-4" style={{ color: "var(--text-primary)" }}>Simulateur RAP + CELIAPP + épargne</h2>
                <RapCeliappCalc />
              </div>

              {/* ── FAQ ── */}
              <div
                className="rounded-xl p-6 space-y-4"
                style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
              >
                <h2 className="text-[15px] font-bold" style={{ color: "var(--text-primary)" }}>
                  Questions fréquentes | Premier achat au Québec
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

              {/* ── Salaire requis ── */}
              <SalaireRequis />

              {/* ── Discussions de premiers acheteurs ── */}
              {forumPosts.length > 0 && (
                <div className="rounded-xl overflow-hidden" style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}>
                  <div className="px-4 py-3" style={{ borderBottom: "0.5px solid var(--border)" }}>
                    <h2 className="text-[15px] font-bold" style={{ color: "var(--text-primary)" }}>Discussions de premiers acheteurs</h2>
                  </div>
                  {forumPosts.map((p, i) => (
                    <Link key={p.id} href={`/post/${p.id}`} className="block px-4 py-3 transition-colors hover-bg" style={{ borderBottom: i < forumPosts.length - 1 ? "0.5px solid var(--border)" : "none" }}>
                      <p className="text-[13px] font-medium line-clamp-2" style={{ color: "var(--text-primary)" }}>{p.titre}</p>
                      <p className="text-[11px] mt-1" style={{ color: "var(--text-tertiary)" }}>{p.nbVotes} votes, {p.nbCommentaires} réponses</p>
                    </Link>
                  ))}
                  <div className="px-4 py-2.5">
                    <Link href="/?categorie=financement" className="text-[12px] font-medium" style={{ color: "var(--green)" }}>Voir toutes les discussions</Link>
                  </div>
                </div>
              )}

              {/* CTA community */}
              <CommunityCTA
                contexte="general"
                titre="Vous planifiez votre premier achat? La communauté peut vous aider!"
                description="Des centaines de premiers acheteurs partagent leur expérience sur nid.local. Questions sur le RAP, le CELIAPP, les surprises à l'inspection? Posez votre question et profitez de l'entraide."
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
                Voir les discussions
              </Link>

              {popularPosts.length > 0 && (
                <div
                  className="rounded-xl overflow-hidden"
                  style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
                >
                  <div className="px-4 py-3" style={{ borderBottom: "0.5px solid var(--border)" }}>
                    <h3 className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
                      Discussions populaires
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
                      Toutes les discussions →
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
                    Ressources utiles
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
                  À propos de ce guide
                </p>
                <p className="text-[12px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  Les informations sur le CELIAPP, le RAP et les programmes d&apos;aide sont basées sur les règles en vigueur en 2026.
                  Les montants et conditions peuvent changer.
                </p>
                <p className="text-[12px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  Pour des conseils personnalisés, consultez un <strong>planificateur financier</strong> ou un <strong>courtier hypothécaire</strong>.
                </p>
              </div>

              <p className="text-[11px] text-center px-2" style={{ color: "var(--text-tertiary)" }}>
                &copy; 2026 nid.local | Fait au Québec
              </p>
            </aside>
          </div>
        </main>
      </div>
    </>
  );
}
