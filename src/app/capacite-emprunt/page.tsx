import Link from "next/link";
import { Header } from "@/components/Header";
import { CommunityCTA } from "@/components/CommunityCTA";
import { CapaciteEmprunt } from "./CapaciteEmprunt";
import { prisma } from "@/lib/prisma";
import { dbPostToAppPost, ressourcesUtiles } from "@/lib/data";
import type { Metadata } from "next";

const BASE_URL = process.env.NEXTAUTH_URL?.replace(/\/$/, "") ?? "https://nid.local";
const PAGE_URL = `${BASE_URL}/capacite-emprunt`;

export const metadata: Metadata = {
  title: "Calculateur capacité d'emprunt Québec 2026 | Ratios GDS/TDS",
  description:
    "Calculez votre capacité d'emprunt hypothécaire selon les ratios GDS/TDS des banques canadiennes. Stress test, revenus locatifs et pré-approbation inclus.",
  keywords: [
    "capacité emprunt québec",
    "combien emprunter hypothèque",
    "calcul capacité hypothécaire",
    "stress test hypothèque canada",
    "ratio GDS TDS",
    "pré-approbation hypothécaire",
    "test résistance hypothécaire",
    "calculateur emprunt immobilier",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Calculateur capacité d'emprunt Québec 2026 | Ratios GDS/TDS",
    description:
      "Estimez le prix maximum que vous pouvez vous permettre selon les ratios GDS/TDS, le stress test canadien et vos revenus. Co-emprunteur et revenus locatifs inclus.",
    url: PAGE_URL,
    siteName: "nid.local",
    locale: "fr_CA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Capacité d'emprunt hypothécaire Québec 2026",
    description:
      "Calculez combien vous pouvez emprunter pour une hypothèque au Québec. Ratios GDS/TDS, stress test et pré-approbation hypothécaire inclus.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "nid.local", "item": BASE_URL },
        { "@type": "ListItem", "position": 2, "name": "Capacité d'emprunt", "item": PAGE_URL },
      ],
    },
    {
      "@type": "WebApplication",
      "name": "Calculateur de capacité d'emprunt hypothécaire | nid.local",
      "url": PAGE_URL,
      "description":
        "Calculez votre capacité d'emprunt hypothécaire selon les ratios GDS/TDS des institutions financières canadiennes. Inclut le test de résistance (stress test), les revenus locatifs et le co-emprunteur.",
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
          "name": "Comment le stress test hypothécaire affecte-t-il ma capacité d'emprunt au Canada?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Le test de résistance hypothécaire (stress test) est obligatoire pour toutes les hypothèques au Canada depuis 2018. Votre capacité d'emprunt est calculée au taux le plus élevé entre votre taux contractuel + 2% ou le taux de référence de la Banque du Canada (5,25%). Par exemple, si votre taux négocié est de 4,64%, vous serez qualifié à 6,64%. Ce test réduit le montant maximum que vous pouvez emprunter d'environ 20% par rapport au calcul sans stress test.",
          },
        },
        {
          "@type": "Question",
          "name": "Quelle est la différence entre le ratio GDS (ABD) et le ratio TDS (ATD)?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Le ratio GDS (service de la dette brute, ou ABD en français) mesure la proportion de votre revenu brut consacrée aux frais de logement : paiement hypothécaire, taxes foncières, chauffage et 50% des frais de condo. Il ne doit pas dépasser 39%. Le ratio TDS (service de la dette totale, ou ATD) inclut en plus toutes vos autres dettes : prêt auto, paiements minimums de cartes de crédit, prêts étudiants et marges de crédit. Il ne doit pas dépasser 44%. Les deux ratios doivent être respectés pour obtenir une hypothèque.",
          },
        },
        {
          "@type": "Question",
          "name": "Est-ce qu'un co-emprunteur augmente ma capacité d'emprunt hypothécaire?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Oui, ajouter un co-emprunteur (conjoint, parent, etc.) augmente significativement votre capacité d'emprunt. Les revenus des deux emprunteurs sont combinés pour le calcul des ratios GDS et TDS, ce qui peut permettre d'emprunter 50% à 100% de plus selon les revenus du co-emprunteur. Cependant, les dettes du co-emprunteur sont également prises en compte dans le calcul du ratio TDS. Les deux emprunteurs sont solidairement responsables de l'hypothèque.",
          },
        },
        {
          "@type": "Question",
          "name": "Les revenus locatifs sont-ils pris en compte dans le calcul de la capacité d'emprunt?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Oui, les revenus locatifs peuvent augmenter votre capacité d'emprunt lors de l'achat d'un plex (duplex, triplex, quadruplex). Les institutions financières canadiennes utilisent généralement un facteur de compensation de 50% à 80% des revenus locatifs bruts prévus, ajouté à votre revenu brut pour le calcul des ratios GDS et TDS. Certains prêteurs utilisent la méthode du cashflow, d'autres la méthode du revenu ajouté. Un courtier hypothécaire peut vous orienter vers le prêteur le plus avantageux.",
          },
        },
        {
          "@type": "Question",
          "name": "Combien puis-je emprunter pour une hypothèque au Québec en 2026?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Votre capacité d'emprunt dépend de votre revenu brut, de vos dettes existantes, du taux d'intérêt et de la période d'amortissement. En règle générale, avec un revenu brut de 80 000 $ et peu de dettes, vous pouvez emprunter environ 350 000 $ à 400 000 $ avec les taux de 2026. Un couple avec un revenu combiné de 150 000 $ peut emprunter environ 650 000 $ à 750 000 $. Notre calculateur vous donne une estimation précise selon votre situation. Pour une pré-approbation officielle, consultez un courtier hypothécaire agréé.",
          },
        },
        {
          "@type": "Question",
          "name": "Quelle est la différence entre pré-qualification et pré-approbation hypothécaire?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "La pré-qualification est une estimation rapide de votre capacité d'emprunt basée sur les informations que vous fournissez, comme le calcul offert par notre outil. La pré-approbation hypothécaire est un engagement conditionnel du prêteur après vérification de vos revenus, de votre crédit et de vos actifs. La pré-approbation garantit un taux pendant 90 à 120 jours et renforce votre position lors d'une offre d'achat. Elle est gratuite et sans obligation auprès de la plupart des courtiers hypothécaires au Québec.",
          },
        },
      ],
    },
  ],
};

const ressources = ressourcesUtiles;

export default async function CapaciteEmpruntPage() {
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
          <nav className="flex items-center gap-1.5 text-[12px] mb-5" style={{ color: "var(--text-tertiary)" }} aria-label="Fil d'Ariane">
            <Link href="/" className="transition-opacity hover:opacity-70" style={{ color: "var(--text-tertiary)" }}>
              nid.local
            </Link>
            <span>/</span>
            <span style={{ color: "var(--text-secondary)" }}>Capacité d&apos;emprunt</span>
          </nav>

          <div className="flex gap-5 items-start">
            {/* Main column */}
            <div className="flex-1 min-w-0 space-y-5">
              <div>
                <h1 className="text-[22px] font-bold leading-snug mb-2" style={{ color: "var(--text-primary)" }}>
                  Capacité d&apos;emprunt hypothécaire | Québec 2026
                </h1>
                <p className="text-[13px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  Estimez le prix maximum que vous pouvez vous permettre selon les ratios GDS/TDS utilisés par les banques canadiennes.
                  Stress test, revenus locatifs et co-emprunteur inclus. Obtenez une estimation de pré-approbation hypothécaire instantanée.
                </p>
              </div>

              {/* Calculator */}
              <div
                className="rounded-xl p-6"
                style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
              >
                <CapaciteEmprunt />
              </div>

              {/* How it works */}
              <div
                className="rounded-xl p-6 space-y-3"
                style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
              >
                <h2 className="text-[15px] font-bold" style={{ color: "var(--text-primary)" }}>
                  Comment fonctionne le calcul de capacité d&apos;emprunt
                </h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    {
                      n: "1",
                      titre: "Entrez vos revenus et dettes",
                      texte: "Indiquez votre revenu brut annuel (et celui de votre co-emprunteur si applicable), ainsi que vos dettes mensuelles : prêt auto, cartes de crédit, prêts étudiants.",
                    },
                    {
                      n: "2",
                      titre: "Ajustez les paramètres",
                      texte: "Précisez la mise de fonds disponible, les taxes foncières estimées, les frais de chauffage et de condo. Le stress test est appliqué automatiquement selon les règles canadiennes.",
                    },
                    {
                      n: "3",
                      titre: "Obtenez votre capacité maximale",
                      texte: "Le calculateur affiche le prix maximum que vous pouvez vous permettre selon les ratios GDS et TDS, en tenant compte du test de résistance hypothécaire obligatoire.",
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

              {/* Important concepts */}
              <div
                className="rounded-xl p-6 space-y-4"
                style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
              >
                <h2 className="text-[15px] font-bold" style={{ color: "var(--text-primary)" }}>
                  Concepts importants pour le calcul de capacité hypothécaire
                </h2>
                <div className="space-y-3">
                  {[
                    {
                      titre: "Ratio GDS (service de la dette brute)",
                      texte: "Le ratio GDS (ou ABD) mesure la part de votre revenu brut consacrée aux frais de logement : paiement hypothécaire, taxes foncières, chauffage et 50% des frais de condo. Le maximum autorisé est généralement de 39%. C'est le premier critère vérifié par les prêteurs.",
                      couleur: "var(--blue-bg)",
                      textColor: "var(--blue-text)",
                    },
                    {
                      titre: "Ratio TDS (service de la dette totale)",
                      texte: "Le ratio TDS (ou ATD) ajoute au GDS toutes vos autres obligations financières : prêt auto, paiements minimums de cartes de crédit, prêts étudiants et marges de crédit. Le maximum autorisé est de 44%. Un TDS élevé peut réduire votre capacité d'emprunt même si votre GDS est acceptable.",
                      couleur: "var(--amber-bg)",
                      textColor: "var(--amber-text)",
                    },
                    {
                      titre: "Test de résistance hypothécaire (stress test)",
                      texte: "Obligatoire depuis 2018 pour toutes les hypothèques au Canada (BSIF). Votre capacité est calculée au taux le plus élevé entre votre taux contractuel + 2% ou le taux de référence (5,25%). Ce test simule une hausse de taux pour s'assurer que vous pourrez continuer vos paiements. Il réduit le montant maximum empruntable d'environ 20%.",
                      couleur: "var(--red-bg)",
                      textColor: "var(--red-text)",
                    },
                  ].map((rule) => (
                    <div key={rule.titre} className="flex gap-3 p-3 rounded-lg" style={{ background: rule.couleur }}>
                      <div className="flex-1">
                        <p className="text-[12px] font-semibold mb-0.5" style={{ color: rule.textColor }}>{rule.titre}</p>
                        <p className="text-[12px] leading-relaxed" style={{ color: rule.textColor, opacity: 0.85 }}>{rule.texte}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
                  Ces règles sont à titre informatif. Consultez un courtier hypothécaire agréé pour une pré-approbation officielle adaptée à votre situation.
                </p>
              </div>

              {/* Outils connexes */}
              <div className="rounded-xl p-6 space-y-3" style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}>
                <h2 className="text-[15px] font-bold" style={{ color: "var(--text-primary)" }}>Outils connexes</h2>
                <div className="grid sm:grid-cols-3 gap-3">
                  {[
                    { href: "/calculatrice-hypothecaire", label: "Calculatrice hypoth\u00e9caire", desc: "Estimez votre paiement mensuel et la prime SCHL." },
                    { href: "/premier-acheteur", label: "Guide premier acheteur", desc: "CELIAPP, RAP et programmes d\u2019aide pour votre premier achat." },
                    { href: "/frais-achat", label: "Frais d\u2019achat", desc: "Tous les frais \u00e0 pr\u00e9voir : notaire, inspection, taxes et plus." },
                  ].map((tool) => (
                    <Link key={tool.href} href={tool.href} className="p-3 rounded-lg transition-colors hover-bg" style={{ background: "var(--bg-secondary)", border: "0.5px solid var(--border)" }}>
                      <p className="text-[13px] font-semibold mb-0.5" style={{ color: "var(--text-primary)" }}>{tool.label}</p>
                      <p className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>{tool.desc}</p>
                    </Link>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <CommunityCTA contexte="hypotheque" />

              {/* FAQ */}
              <div
                className="rounded-xl p-6 space-y-4"
                style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
              >
                <h2 className="text-[15px] font-bold" style={{ color: "var(--text-primary)" }}>
                  Questions fréquentes sur la capacité d&apos;emprunt hypothécaire au Québec
                </h2>
                <dl className="space-y-4">
                  {[
                    {
                      q: "Comment le stress test hypothécaire affecte-t-il ma capacité d'emprunt au Canada?",
                      r: "Le test de résistance hypothécaire (stress test) est obligatoire pour toutes les hypothèques au Canada depuis 2018. Votre capacité d'emprunt est calculée au taux le plus élevé entre votre taux contractuel + 2% ou le taux de référence de la Banque du Canada (5,25%). Par exemple, si votre taux négocié est de 4,64%, vous serez qualifié à 6,64%. Ce test réduit le montant maximum que vous pouvez emprunter d'environ 20% par rapport au calcul sans stress test.",
                    },
                    {
                      q: "Quelle est la différence entre le ratio GDS (ABD) et le ratio TDS (ATD)?",
                      r: "Le ratio GDS (service de la dette brute) mesure la proportion de votre revenu brut consacrée aux frais de logement : paiement hypothécaire, taxes foncières, chauffage et 50% des frais de condo. Il ne doit pas dépasser 39%. Le ratio TDS (service de la dette totale) inclut en plus toutes vos autres dettes : prêt auto, paiements minimums de cartes de crédit, prêts étudiants et marges de crédit. Il ne doit pas dépasser 44%. Les deux ratios doivent être respectés pour obtenir une hypothèque.",
                    },
                    {
                      q: "Est-ce qu'un co-emprunteur augmente ma capacité d'emprunt hypothécaire?",
                      r: "Oui, ajouter un co-emprunteur (conjoint, parent, etc.) augmente significativement votre capacité d'emprunt. Les revenus des deux emprunteurs sont combinés pour le calcul des ratios GDS et TDS, ce qui peut permettre d'emprunter 50% à 100% de plus selon les revenus du co-emprunteur. Cependant, les dettes du co-emprunteur sont également prises en compte dans le calcul du ratio TDS. Les deux emprunteurs sont solidairement responsables de l'hypothèque.",
                    },
                    {
                      q: "Les revenus locatifs sont-ils pris en compte dans le calcul de la capacité d'emprunt?",
                      r: "Oui, les revenus locatifs peuvent augmenter votre capacité d'emprunt lors de l'achat d'un plex (duplex, triplex, quadruplex). Les institutions financières canadiennes utilisent généralement un facteur de compensation de 50% à 80% des revenus locatifs bruts prévus, ajouté à votre revenu brut pour le calcul des ratios GDS et TDS. Certains prêteurs utilisent la méthode du cashflow, d'autres la méthode du revenu ajouté.",
                    },
                    {
                      q: "Combien puis-je emprunter pour une hypothèque au Québec en 2026?",
                      r: "Votre capacité d'emprunt dépend de votre revenu brut, de vos dettes existantes, du taux d'intérêt et de la période d'amortissement. En règle générale, avec un revenu brut de 80 000 $ et peu de dettes, vous pouvez emprunter environ 350 000 $ à 400 000 $ avec les taux de 2026. Un couple avec un revenu combiné de 150 000 $ peut emprunter environ 650 000 $ à 750 000 $. Notre calculateur vous donne une estimation précise selon votre situation.",
                    },
                    {
                      q: "Quelle est la différence entre pré-qualification et pré-approbation hypothécaire?",
                      r: "La pré-qualification est une estimation rapide de votre capacité d'emprunt basée sur les informations que vous fournissez, comme le calcul offert par notre outil. La pré-approbation hypothécaire est un engagement conditionnel du prêteur après vérification de vos revenus, de votre crédit et de vos actifs. La pré-approbation garantit un taux pendant 90 à 120 jours et renforce votre position lors d'une offre d'achat. Elle est gratuite et sans obligation auprès de la plupart des courtiers hypothécaires au Québec.",
                    },
                  ].map((item) => (
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
            </div>

            {/* Sidebar */}
            <aside className="hidden md:flex flex-col gap-3 w-[240px] shrink-0">
              <Link href="/annonces" className="w-full py-2.5 rounded-xl text-[13px] font-semibold text-white transition-opacity hover:opacity-90 flex items-center justify-center" style={{ background: "var(--green)" }}>Voir les annonces</Link>
              {popularPosts.length > 0 && (
                <div className="rounded-xl overflow-hidden" style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}>
                  <div className="px-4 py-3" style={{ borderBottom: "0.5px solid var(--border)" }}><h3 className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>Discussions populaires</h3></div>
                  <ul>{popularPosts.map((post, i) => (<li key={post.id} style={{ borderBottom: i < popularPosts.length - 1 ? "0.5px solid var(--border)" : "none" }}><Link href={`/post/${post.id}`} className="flex flex-col gap-1 px-4 py-3 transition-colors hover-bg"><span className="text-[12px] font-medium leading-snug line-clamp-2" style={{ color: "var(--text-primary)" }}>{post.titre}</span><span className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>{post.quartier.nom} · {post.nbVotes} votes</span></Link></li>))}</ul>
                </div>
              )}
              <div className="rounded-xl overflow-hidden" style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}>
                <div className="px-4 py-3" style={{ borderBottom: "0.5px solid var(--border)" }}><h3 className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>Ressources utiles</h3></div>
                <ul>{ressources.map((r, i) => (<li key={r.label} style={{ borderBottom: i < ressources.length - 1 ? "0.5px solid var(--border)" : "none" }}><Link href={r.href} className="flex items-center justify-between px-4 py-2.5 transition-colors hover-bg"><span className="text-[13px]" style={{ color: "var(--text-primary)" }}>{r.label}</span><svg className="w-3 h-3 shrink-0" style={{ color: "var(--text-tertiary)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></Link></li>))}</ul>
              </div>
              <p className="text-[11px] text-center px-2" style={{ color: "var(--text-tertiary)" }}>© 2026 nid.local | Fait au Québec</p>
            </aside>
          </div>
        </main>
      </div>
    </>
  );
}
