import Link from "next/link";
import { Header } from "@/components/Header";
import { CommunityCTA } from "@/components/CommunityCTA";
import { CalculateurLoyerClient } from "./CalculateurLoyerClient";
import type { Metadata } from "next";

const BASE_URL = process.env.NEXTAUTH_URL?.replace(/\/$/, "") ?? "https://nid.local";
const PAGE_URL = `${BASE_URL}/calculateur-augmentation-loyer`;

export const metadata: Metadata = {
  title: "Calculateur augmentation de loyer Québec 2026 | TAL",
  description:
    "Calculez l'augmentation de loyer permise selon les critères du TAL 2026. Outil gratuit basé sur les règles officielles du Tribunal administratif du logement du Québec.",
  keywords: [
    "augmentation loyer québec",
    "calculateur TAL",
    "hausse loyer 2026",
    "tribunal administratif logement",
    "augmentation loyer permise",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Calculateur augmentation de loyer Québec 2026 | TAL",
    description:
      "Calculez l'augmentation de loyer permise selon les critères du TAL 2026. Outil gratuit basé sur les règles officielles du Tribunal administratif du logement du Québec.",
    url: PAGE_URL,
    siteName: "nid.local",
    locale: "fr_CA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Calculateur augmentation de loyer Québec 2026 | TAL",
    description:
      "Calculez l'augmentation de loyer permise selon les critères du TAL 2026. Outil gratuit basé sur les règles officielles du Tribunal administratif du logement.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "nid.local", item: BASE_URL },
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
      name: "Calculateur augmentation de loyer Québec | nid.local",
      url: PAGE_URL,
      description:
        "Calculez l'augmentation de loyer permise selon les critères du TAL 2026. Estimation standard ou calcul personnalisé avec vos dépenses réelles.",
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
          name: "Quelle est l'augmentation de loyer permise au Québec en 2026?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Le Tribunal administratif du logement (TAL) publie chaque année des indices d'ajustement de loyer. Pour 2026, le taux de base est de 3,1%, auquel s'ajoutent 0,4% si le logement est chauffé par le propriétaire et 0,2% pour l'eau chaude fournie. Ces taux sont des estimations applicables lorsque le propriétaire ne fournit pas le détail de ses dépenses réelles.",
          },
        },
        {
          "@type": "Question",
          name: "Un propriétaire peut-il augmenter le loyer au-delà des taux du TAL?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Le propriétaire peut proposer une augmentation supérieure aux taux suggérés par le TAL s'il peut justifier des dépenses réelles plus élevées, par exemple des travaux de rénovation majeurs, une hausse importante des taxes municipales ou de l'assurance. Le locataire a le droit de refuser et de demander une fixation de loyer au TAL.",
          },
        },
        {
          "@type": "Question",
          name: "Que faire si je refuse l'augmentation de loyer proposée?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Le locataire dispose d'un mois après la réception de l'avis d'augmentation pour refuser par écrit. Le propriétaire a ensuite un mois pour demander au TAL de fixer le loyer. Si le propriétaire ne fait pas la demande, le loyer reste inchangé. Le locataire peut aussi contester directement au TAL s'il juge l'augmentation abusive.",
          },
        },
      ],
    },
  ],
};

export default function CalculateurAugmentationLoyerPage() {
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
            aria-label="Fil d'Ariane"
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
              Augmentation de loyer
            </span>
          </nav>

          <div className="space-y-5">
            <div>
              <h1
                className="text-[22px] font-bold leading-snug mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                Calculateur d&apos;augmentation de loyer Québec
              </h1>
              <p
                className="text-[13px] leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                Estimez l&apos;augmentation de loyer permise selon les
                critères du Tribunal administratif du logement (TAL) pour
                2026. Calcul standard ou personnalisé avec vos dépenses
                réelles.
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
            </div>

            {/* Droits et procédure */}
            <div
              className="rounded-xl p-6 space-y-3"
              style={{
                background: "var(--bg-card)",
                border: "0.5px solid var(--border)",
              }}
            >
              <h2
                className="text-[15px] font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                Droits et procédure
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  {
                    n: "1",
                    titre: "Avis écrit obligatoire",
                    texte:
                      "Le propriétaire doit envoyer un avis écrit au locataire au moins 3 mois avant la fin du bail (6 mois pour un bail de plus de 6 mois dans certains cas). L'avis doit mentionner le nouveau loyer proposé ou les modifications au bail.",
                  },
                  {
                    n: "2",
                    titre: "Droit de refus",
                    texte:
                      "Le locataire dispose d'un mois après réception de l'avis pour refuser par écrit l'augmentation proposée. Le propriétaire a ensuite un mois pour demander la fixation du loyer au TAL.",
                  },
                  {
                    n: "3",
                    titre: "Fixation par le TAL",
                    texte:
                      "Si les parties ne s'entendent pas, le TAL fixe le loyer en tenant compte des dépenses réelles du propriétaire, des revenus de l'immeuble et des indices annuels d'ajustement.",
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
                        {step.texte}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Indices TAL */}
            <div
              className="rounded-xl p-6 space-y-4"
              style={{
                background: "var(--bg-card)",
                border: "0.5px solid var(--border)",
              }}
            >
              <h2
                className="text-[15px] font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                Indices d&apos;ajustement du TAL 2026
              </h2>
              <div className="space-y-3">
                {[
                  {
                    titre: "Taux de base (IPC)",
                    texte:
                      "3,1% couvre l'ajustement général lié à l'inflation (indice des prix à la consommation). Ce taux s'applique à tous les logements locatifs au Québec.",
                    couleur: "var(--blue-bg)",
                    textColor: "var(--blue-text)",
                  },
                  {
                    titre: "Chauffage inclus",
                    texte:
                      "Un supplément de 0,4% est ajouté lorsque le propriétaire assume les coûts de chauffage du logement, reflétant la hausse des coûts énergétiques.",
                    couleur: "var(--amber-bg)",
                    textColor: "var(--amber-text)",
                  },
                  {
                    titre: "Eau chaude incluse",
                    texte:
                      "Un supplément de 0,2% est ajouté lorsque le propriétaire fournit l'eau chaude, pour couvrir les coûts supplémentaires d'énergie.",
                    couleur: "var(--green-light-bg)",
                    textColor: "var(--green-text)",
                  },
                  {
                    titre: "Dépenses réelles",
                    texte:
                      "Le propriétaire peut justifier une augmentation différente en présentant ses dépenses réelles (taxes, assurance, chauffage, rénovations). Le calcul personnalisé utilise ces montants.",
                    couleur: "var(--red-bg)",
                    textColor: "var(--red-text)",
                  },
                ].map((rule) => (
                  <div
                    key={rule.titre}
                    className="flex gap-3 p-3 rounded-lg"
                    style={{ background: rule.couleur }}
                  >
                    <div className="flex-1">
                      <p
                        className="text-[12px] font-semibold mb-0.5"
                        style={{ color: rule.textColor }}
                      >
                        {rule.titre}
                      </p>
                      <p
                        className="text-[12px] leading-relaxed"
                        style={{ color: rule.textColor, opacity: 0.85 }}
                      >
                        {rule.texte}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <p
                className="text-[11px]"
                style={{ color: "var(--text-tertiary)" }}
              >
                Ces indices sont publiés annuellement par le Tribunal
                administratif du logement. Consultez le site du TAL pour les
                valeurs officielles.
              </p>
            </div>

            {/* FAQ */}
            <div
              className="rounded-xl p-6 space-y-4"
              style={{
                background: "var(--bg-card)",
                border: "0.5px solid var(--border)",
              }}
            >
              <h2
                className="text-[15px] font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                Questions fréquentes sur l&apos;augmentation de loyer
              </h2>
              <dl className="space-y-4">
                {[
                  {
                    q: "Quelle est l'augmentation de loyer permise au Québec en 2026?",
                    r: "Le TAL publie chaque année des indices d'ajustement. Pour 2026, le taux de base est de 3,1%, auquel s'ajoutent 0,4% si le logement est chauffé par le propriétaire et 0,2% pour l'eau chaude fournie. Ces taux sont des estimations applicables lorsque le propriétaire ne fournit pas le détail de ses dépenses réelles.",
                  },
                  {
                    q: "Un propriétaire peut-il augmenter le loyer au-delà des taux du TAL?",
                    r: "Le propriétaire peut proposer une augmentation supérieure aux taux suggérés par le TAL s'il peut justifier des dépenses réelles plus élevées, par exemple des travaux de rénovation majeurs, une hausse importante des taxes municipales ou de l'assurance. Le locataire a le droit de refuser et de demander une fixation de loyer au TAL.",
                  },
                  {
                    q: "Que faire si je refuse l'augmentation de loyer proposée?",
                    r: "Le locataire dispose d'un mois après la réception de l'avis d'augmentation pour refuser par écrit. Le propriétaire a ensuite un mois pour demander au TAL de fixer le loyer. Si le propriétaire ne fait pas la demande, le loyer reste inchangé. Le locataire peut aussi contester directement au TAL s'il juge l'augmentation abusive.",
                  },
                ].map((item) => (
                  <div
                    key={item.q}
                    className="pb-4"
                    style={{ borderBottom: "0.5px solid var(--border)" }}
                  >
                    <dt
                      className="text-[13px] font-semibold mb-1.5"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {item.q}
                    </dt>
                    <dd
                      className="text-[13px] leading-relaxed"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {item.r}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Outils connexes */}
            <div
              className="rounded-xl p-6 space-y-3"
              style={{
                background: "var(--bg-card)",
                border: "0.5px solid var(--border)",
              }}
            >
              <h2
                className="text-[15px] font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                Outils connexes
              </h2>
              <div className="grid sm:grid-cols-3 gap-3">
                {[
                  {
                    href: "/acheter-ou-louer",
                    label: "Acheter ou louer",
                    desc: "Comparez les coûts d'achat et de location pour votre situation.",
                  },
                  {
                    href: "/calculatrice-hypothecaire",
                    label: "Calculatrice hypothécaire",
                    desc: "Estimez votre paiement mensuel et la prime SCHL.",
                  },
                  {
                    href: "/donnees-marche",
                    label: "Données de marché",
                    desc: "Prix médians et tendances dans 80+ quartiers du Québec.",
                  },
                ].map((tool) => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className="p-3 rounded-lg transition-colors hover-bg"
                    style={{
                      background: "var(--bg-secondary)",
                      border: "0.5px solid var(--border)",
                    }}
                  >
                    <p
                      className="text-[13px] font-semibold mb-0.5"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {tool.label}
                    </p>
                    <p
                      className="text-[11px]"
                      style={{ color: "var(--text-tertiary)" }}
                    >
                      {tool.desc}
                    </p>
                  </Link>
                ))}
              </div>
            </div>

            {/* CTA community */}
            <CommunityCTA contexte="general" />
          </div>
        </main>
      </div>
    </>
  );
}
