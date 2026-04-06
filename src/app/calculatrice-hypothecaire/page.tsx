import Link from "next/link";
import { Header } from "@/components/Header";
import { CommunityCTA } from "@/components/CommunityCTA";
import { CalculatriceClient } from "./CalculatriceClient";
import { SaveHypoButton } from "@/components/SaveHypoButton";
import { CalcActions } from "@/components/CalcActions";
import { prisma } from "@/lib/prisma";
import { dbPostToAppPost, ressourcesUtiles } from "@/lib/data";
import type { Metadata } from "next";

const BASE_URL = process.env.NEXTAUTH_URL?.replace(/\/$/, "") ?? "https://nid.local";
const PAGE_URL = `${BASE_URL}/calculatrice-hypothecaire`;

export const metadata: Metadata = {
  title: "Calculatrice hypothécaire Québec 2026 | Paiements mensuels",
  description:
    "Calculez gratuitement votre paiement hypothécaire mensuel selon les taux du marché québécois. Mise de fonds, prime SCHL, plex et amortissement inclus. Résultats instantanés.",
  keywords: [
    "calculatrice hypothécaire",
    "calculatrice hypothécaire québec",
    "calcul hypothèque québec",
    "paiement mensuel hypothèque",
    "simulateur hypothécaire",
    "prime SCHL",
    "mise de fonds minimale",
    "calculateur prêt hypothécaire",
    "hypothèque plex duplex",
    "calcul amortissement hypothèque",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Calculatrice hypothécaire Québec 2026 | Paiements mensuels",
    description:
      "Calculez votre paiement mensuel, les intérêts totaux et la prime SCHL selon votre mise de fonds et les taux du jour.",
    url: PAGE_URL,
    siteName: "nid.local",
    locale: "fr_CA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Calculatrice hypothécaire Québec 2026",
    description:
      "Estimez votre paiement mensuel hypothécaire avec les taux du marché québécois. Prime SCHL, plex et mise de fonds inclus.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "nid.local", "item": BASE_URL },
        { "@type": "ListItem", "position": 2, "name": "Calculatrice hypothécaire", "item": PAGE_URL },
      ],
    },
    {
      "@type": "WebApplication",
      "name": "Calculatrice hypothécaire Québec | nid.local",
      "url": PAGE_URL,
      "description":
        "Calculez votre paiement hypothécaire mensuel avec les taux du marché québécois. Inclut la prime SCHL, les règles de mise de fonds pour unifamilial, condo et plex.",
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
          "name": "Quelle est la mise de fonds minimale pour acheter une propriété au Québec?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "La mise de fonds minimale dépend du prix d'achat : 5% pour les propriétés jusqu'à 500 000 $, 5% sur les premiers 500 000 $ puis 10% sur la tranche entre 500 000 $ et 999 999 $. Pour les propriétés à 1 000 000 $ et plus, la mise de fonds minimale est de 20%. Pour les plex de 2 à 4 logements occupés par le propriétaire, le minimum est de 5% (duplex) ou 10% (triplex, quadruplex). Pour les non-occupants, le minimum est de 20%.",
          },
        },
        {
          "@type": "Question",
          "name": "Qu'est-ce que la prime SCHL et quand s'applique-t-elle?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "La prime SCHL (Société canadienne d'hypothèques et de logement) est une assurance hypothécaire obligatoire lorsque votre mise de fonds est inférieure à 20% du prix d'achat. Elle s'applique aux propriétés de moins de 1 500 000 $. Le taux varie selon votre mise de fonds : 4% si elle est entre 5% et 9,99%, 3,1% entre 10% et 14,99%, et 2,8% entre 15% et 19,99%. Cette prime est ajoutée au montant de l'hypothèque.",
          },
        },
        {
          "@type": "Question",
          "name": "Quelle différence entre taux variable et taux fixe?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Le taux variable fluctue selon le taux directeur de la Banque du Canada, ce qui peut faire varier votre paiement à la hausse ou à la baisse. Il offre généralement un taux de départ plus bas. Le taux fixe est garanti pour toute la durée du terme choisi (1, 3, 5 ou 10 ans), ce qui assure des paiements stables. En 2026, les taux fixes 5 ans se situent autour de 4,64%, tandis que le taux variable avoisine 4,99%.",
          },
        },
        {
          "@type": "Question",
          "name": "Comment fonctionne le calcul des intérêts hypothécaires au Canada?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Au Canada, les hypothèques à taux fixe sont composées semestriellement (deux fois par an), ce qui est différent des États-Unis. Notre calculatrice applique cette règle canadienne automatiquement. Le taux effectif est calculé ainsi : (1 + taux annuel/2)² - 1. Ce calcul est important car il affecte légèrement le montant du paiement comparé à une composition mensuelle.",
          },
        },
        {
          "@type": "Question",
          "name": "Quelle est la période d'amortissement maximale au Canada?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Pour les propriétés achetées avec une mise de fonds inférieure à 20% (avec assurance SCHL), la période d'amortissement maximale est de 30 ans depuis août 2024 (elle était de 25 ans avant). Pour les acheteurs d'une première propriété neuve, cette limite est portée à 30 ans. Si votre mise de fonds est de 20% ou plus (sans assurance), certains prêteurs permettent jusqu'à 30 ans.",
          },
        },
        {
          "@type": "Question",
          "name": "Comment calculer ma capacité d'emprunt hypothécaire?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Les institutions financières canadiennes utilisent le test de résistance hypothécaire (stress test). Votre paiement hypothécaire ne doit pas dépasser 39% de votre revenu brut mensuel (ratio ABD), et l'ensemble de vos dettes ne doit pas excéder 44% (ratio ATD). Le taux utilisé pour le test est le plus élevé entre le taux contractuel + 2% ou le taux de référence de la Banque du Canada (5,25%). Consultez un courtier hypothécaire pour une pré-approbation officielle.",
          },
        },
        {
          "@type": "Question",
          "name": "Est-ce que la calculatrice s'applique aux plex au Québec?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Oui, notre calculatrice inclut les règles spécifiques aux immeubles à revenus (plex) au Québec. Pour un duplex, triplex ou quadruplex occupé par le propriétaire, la mise de fonds minimale est de 5% (duplex) ou 10% (triplex, quadruplex) et l'assurance SCHL est disponible. Pour les 5 logements et plus, la mise de fonds minimale est de 20% et le financement est de type commercial.",
          },
        },
      ],
    },
  ],
};

const ressources = ressourcesUtiles;

export default async function CalculatriceHypothecairePage() {
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
          {/* Breadcrumb + back */}
          <nav className="flex items-center gap-1.5 text-[12px] mb-5" style={{ color: "var(--text-tertiary)" }} aria-label="Fil d'Ariane">
            <Link href="/" className="transition-opacity hover:opacity-70" style={{ color: "var(--text-tertiary)" }}>
              nid.local
            </Link>
            <span>/</span>
            <span style={{ color: "var(--text-secondary)" }}>Calculatrice hypothécaire</span>
          </nav>

          <div className="flex gap-5 items-start">
            {/* Main column */}
            <div className="flex-1 min-w-0 space-y-5">
              <div>
                <h1 className="text-[22px] font-bold leading-snug mb-2" style={{ color: "var(--text-primary)" }}>
                  Calculatrice hypothécaire Québec
                </h1>
                <p className="text-[13px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  Estimez votre paiement mensuel selon les taux du marché québécois. Calculs conformes aux règles canadiennes :
                  composition semestrielle, prime SCHL, mise de fonds minimale et règles plex incluses.
                </p>
              </div>

              {/* Calculator */}
              <div
                className="rounded-xl p-6"
                style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
              >
                <CalculatriceClient />
                <SaveHypoButton />
                <CalcActions />
              </div>

              {/* How to use */}
              <div
                className="rounded-xl p-6 space-y-3"
                style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
              >
                <h2 className="text-[15px] font-bold" style={{ color: "var(--text-primary)" }}>
                  Comment utiliser cette calculatrice
                </h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    {
                      n: "1",
                      titre: "Entrez le prix et la mise de fonds",
                      texte: "La calculatrice vérifie automatiquement si votre mise de fonds respecte le minimum requis et calcule la prime SCHL si applicable.",
                    },
                    {
                      n: "2",
                      titre: "Choisissez votre taux",
                      texte: "Utilisez les taux indicatifs du jour ou entrez votre propre taux. Les taux fixes et variable sont affichés pour faciliter la comparaison.",
                    },
                    {
                      n: "3",
                      titre: "Analysez les résultats",
                      texte: "Le paiement, les intérêts totaux, le total déboursé et la prime SCHL sont calculés en temps réel selon les règles hypothécaires canadiennes.",
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

              {/* Rules */}
              <div
                className="rounded-xl p-6 space-y-4"
                style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
              >
                <h2 className="text-[15px] font-bold" style={{ color: "var(--text-primary)" }}>
                  Règles hypothécaires au Canada en 2026
                </h2>
                <div className="space-y-3">
                  {[
                    {
                      titre: "Mise de fonds minimale",
                      texte: "5% jusqu'à 500 000 $, puis 10% sur la tranche entre 500 000 $ et 999 999 $. 20% minimum pour les propriétés à 1 M$ et plus.",
                      couleur: "var(--blue-bg)",
                      textColor: "var(--blue-text)",
                    },
                    {
                      titre: "Prime SCHL",
                      texte: "Obligatoire si la mise de fonds est inférieure à 20% sur les propriétés sous 1,5 M$. Taux de 2,8% à 4% selon le niveau de la mise de fonds.",
                      couleur: "var(--amber-bg)",
                      textColor: "var(--amber-text)",
                    },
                    {
                      titre: "Test de résistance (stress test)",
                      texte: "Toutes les hypothèques sont qualifiées au taux le plus élevé entre votre taux + 2% ou 5,25%. Votre paiement ne peut dépasser 39% de votre revenu brut.",
                      couleur: "var(--red-bg)",
                      textColor: "var(--red-text)",
                    },
                    {
                      titre: "Plex | règles spéciales",
                      texte: "Duplex occupant : 5% minimum. Triplex/quadruplex occupant : 10% minimum. Non-occupant : 20% minimum. 5 logements et plus : financement commercial uniquement.",
                      couleur: "var(--green-light-bg)",
                      textColor: "var(--green-text)",
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
                  ⚠ Ces règles sont à titre informatif. Consultez un courtier hypothécaire agréé pour une analyse personnalisée.
                </p>
              </div>

              {/* FAQ */}
              <div
                className="rounded-xl p-6 space-y-4"
                style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
              >
                <h2 className="text-[15px] font-bold" style={{ color: "var(--text-primary)" }}>
                  Questions fréquentes sur l&apos;hypothèque au Québec
                </h2>
                <dl className="space-y-4">
                  {[
                    {
                      q: "Quelle est la mise de fonds minimale au Québec en 2026?",
                      r: "La mise de fonds minimale est de 5% pour les propriétés jusqu'à 500 000 $. Pour les propriétés entre 500 000 $ et 999 999 $, c'est 5% sur les premiers 500 000 $ et 10% sur le reste. Au-delà de 1 000 000 $, la mise de fonds minimale est de 20%.",
                    },
                    {
                      q: "Qu'est-ce que la prime SCHL et combien coûte-t-elle?",
                      r: "La prime SCHL est une assurance hypothécaire obligatoire si votre mise de fonds est inférieure à 20%. Elle est calculée sur le montant emprunté : 4% pour moins de 10% de mise de fonds, 3,1% pour 10-14,99%, et 2,8% pour 15-19,99%. Elle est ajoutée à votre hypothèque et amortie sur toute la durée.",
                    },
                    {
                      q: "Quelle différence entre amortissement et terme hypothécaire?",
                      r: "L'amortissement est la durée totale pour rembourser votre hypothèque (généralement 25 ou 30 ans). Le terme est la durée de votre contrat avec le prêteur (1, 3, 5 ou 10 ans), après lequel vous renégociez votre taux. La calculatrice utilise l'amortissement pour calculer vos paiements.",
                    },
                    {
                      q: "Comment les intérêts sont-ils calculés au Canada?",
                      r: "Au Canada, contrairement aux États-Unis, les intérêts hypothécaires à taux fixe sont composés semestriellement (deux fois par an). Notre calculatrice applique automatiquement cette règle canadienne, ce qui donne un résultat légèrement différent d'une composition mensuelle.",
                    },
                    {
                      q: "Est-ce que je peux acheter un plex avec 5% de mise de fonds?",
                      r: "Oui, pour un duplex que vous occuperez comme résidence principale, la mise de fonds minimale est de 5%. Pour un triplex ou quadruplex occupant, c'est 10%. Pour un immeuble non-occupant, la mise de fonds minimum est de 20%. Pour 5 logements et plus, le financement est commercial.",
                    },
                    {
                      q: "Combien puis-je emprunter pour une hypothèque?",
                      r: "Votre capacité d'emprunt dépend de votre revenu brut, de vos dettes existantes et du test de résistance. En règle générale, votre paiement hypothécaire ne doit pas dépasser 32-39% de votre revenu brut mensuel. Un courtier hypothécaire peut vous fournir une pré-approbation officielle gratuite.",
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

              {/* Outils connexes */}
              <div className="rounded-xl p-6 space-y-3" style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}>
                <h2 className="text-[15px] font-bold" style={{ color: "var(--text-primary)" }}>Outils connexes</h2>
                <div className="grid sm:grid-cols-3 gap-3">
                  {[
                    { href: "/capacite-emprunt", label: "Capacité d’emprunt", desc: "Calculez combien vous pouvez emprunter selon vos revenus et dettes." },
                    { href: "/taxe-bienvenue", label: "Taxe de bienvenue", desc: "Estimez les droits de mutation pour votre achat au Québec." },
                    { href: "/acheter-ou-louer", label: "Acheter ou louer?", desc: "Comparez le coût réel d’acheter vs louer sur votre horizon." },
                  ].map((tool) => (
                    <Link key={tool.href} href={tool.href} className="p-3 rounded-lg transition-colors hover-bg" style={{ background: "var(--bg-secondary)", border: "0.5px solid var(--border)" }}>
                      <p className="text-[13px] font-semibold mb-0.5" style={{ color: "var(--text-primary)" }}>{tool.label}</p>
                      <p className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>{tool.desc}</p>
                    </Link>
                  ))}
                </div>
              </div>

              {/* CTA community */}
              <CommunityCTA contexte="hypotheque" />
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

              {/* Sticky note about the tool */}
              <div
                className="rounded-xl p-4 space-y-2"
                style={{ background: "var(--bg-card)", border: "0.5px solid var(--border)" }}
              >
                <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
                  À propos de l&apos;outil
                </p>
                <p className="text-[12px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  Les calculs respectent les règles canadiennes : composition semestrielle, règles SCHL et OSFI.
                  Les taux affichés sont indicatifs.
                </p>
                <p className="text-[12px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  Pour une analyse officielle, consultez un <strong>courtier hypothécaire agréé</strong>.
                </p>
              </div>

              <p className="text-[11px] text-center px-2" style={{ color: "var(--text-tertiary)" }}>
                © 2026 nid.local | Fait au Québec
              </p>
            </aside>
          </div>
        </main>
      </div>
    </>
  );
}
