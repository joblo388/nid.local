import Link from "next/link";
import { Header } from "@/components/Header";
import { CommunityCTA } from "@/components/CommunityCTA";
import { CalculateurLoyerClient } from "./CalculateurLoyerClient";
import type { Metadata } from "next";

const BASE_URL =
  process.env.NEXTAUTH_URL?.replace(/\/$/, "") ?? "https://nid.local";
const PAGE_URL = `${BASE_URL}/calculateur-augmentation-loyer`;

export const metadata: Metadata = {
  robots: { index: false, follow: false },
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
                Calculateur d&apos;augmentation de loyer Quebec
              </h1>
              <p
                className="text-[13px] leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                Estimez l&apos;augmentation de loyer permise selon la methode
                officielle du Tribunal administratif du logement (TAL) pour
                2026. Entrez vos depenses reelles pour obtenir un calcul
                personnalise.
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
                Comment fonctionne le calcul
              </h2>

              <div className="space-y-4">
                {/* Card 1 */}
                <div
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
                      {"\u2460"}
                    </span>
                    <div className="flex-1">
                      <p
                        className="text-[13px] font-semibold mb-1"
                        style={{ color: "var(--text-primary)" }}
                      >
                        Ajustement de base (IPC)
                      </p>
                      <p
                        className="text-[12px] leading-relaxed"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        Le taux de base de 3,1% est applique directement au
                        loyer mensuel actuel. Ce taux correspond a
                        l&apos;indice des prix a la consommation (IPC) retenu
                        par le TAL pour 2026.
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
                    Exemple : pour un loyer de 1 200 $, l&apos;ajustement de
                    base est de 1 200 $ x 3,1% = 37,20 $/mois.
                  </div>
                </div>

                {/* Card 2 */}
                <div
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
                      {"\u2461"}
                    </span>
                    <div className="flex-1">
                      <p
                        className="text-[13px] font-semibold mb-1"
                        style={{ color: "var(--text-primary)" }}
                      >
                        Taxes et assurances
                      </p>
                      <p
                        className="text-[12px] leading-relaxed"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        Seule la portion de la hausse qui depasse le taux IPC
                        de 3,1% est prise en compte. La hausse retenue est
                        ensuite repartie au prorata du loyer par rapport au
                        total des loyers de l&apos;immeuble, puis divisee par
                        12 pour obtenir le montant mensuel.
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
                    Exemple : taxes passant de 4 200 $ a 4 500 $. Hausse =
                    300 $. Base exclue = 4 200 $ x 3,1% = 130,20 $. Retenu =
                    300 $ - 130,20 $ = 169,80 $.
                  </div>
                </div>

                {/* Card 3 */}
                <div
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
                      {"\u2462"}
                    </span>
                    <div className="flex-1">
                      <p
                        className="text-[13px] font-semibold mb-1"
                        style={{ color: "var(--text-primary)" }}
                      >
                        Reparations et ameliorations majeures
                      </p>
                      <p
                        className="text-[12px] leading-relaxed"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        Le cout net des travaux (montant moins les aides
                        recues) est amorti a 5% par annee, soit sur 20 ans.
                        Si plusieurs logements sont concernes, un prorata est
                        applique selon le poids du loyer dans l&apos;ensemble
                        des logements touches.
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
                    Exemple : travaux de 15 000 $ sans aide, 1 logement
                    concerne. Ajustement = 15 000 $ x 5% / 12 = 62,50 $/mois.
                  </div>
                </div>

                {/* Card 4 */}
                <div
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
                      {"\u2463"}
                    </span>
                    <div className="flex-1">
                      <p
                        className="text-[13px] font-semibold mb-1"
                        style={{ color: "var(--text-primary)" }}
                      >
                        Nouveaux services ou accessoires
                      </p>
                      <p
                        className="text-[12px] leading-relaxed"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        Contrairement aux renovations, les nouveaux services
                        ne sont pas amortis. Le cout annuel net est
                        directement reparti entre les logements concernes et
                        divise par 12 pour obtenir l&apos;ajustement mensuel.
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
                    Exemple : ajout d&apos;un stationnement a 600 $/an, 1
                    logement. Ajustement = 600 $ / 12 = 50,00 $/mois.
                  </div>
                </div>
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
                    Note pour les locataires
                  </p>
                  <p
                    className="text-[12px] leading-relaxed"
                    style={{ color: "var(--amber-text)", opacity: 0.85 }}
                  >
                    Ce calculateur reproduit la methode du TAL, mais ne
                    remplace pas une fixation officielle. Si l&apos;augmentation
                    proposee par votre proprietaire vous semble excessive, vous
                    avez le droit de la refuser par ecrit dans le delai prevu et
                    de demander au TAL de fixer le loyer.
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
                Vous voulez refuser l&apos;augmentation
              </h2>

              {/* Timeline */}
              <div className="relative pl-8 space-y-6">
                {/* Vertical line */}
                <div
                  className="absolute left-[11px] top-2 bottom-2 w-[2px]"
                  style={{ background: "var(--border)" }}
                />

                {[
                  {
                    titre: "Reception de l'avis d'augmentation",
                    desc: "Le proprietaire doit envoyer un avis ecrit au moins 3 mois avant la fin du bail (6 mois si le bail depasse 6 ans ou pour un logement dans un immeuble de 5 logements et plus). L'avis doit indiquer le nouveau loyer propose.",
                  },
                  {
                    titre: "Reponse du locataire (1 mois)",
                    desc: "Vous disposez d'un mois apres reception de l'avis pour refuser par ecrit. Envoyez votre refus par courrier recommande ou remettez-le en main propre avec accuse de reception.",
                  },
                  {
                    titre: "Demande du proprietaire au TAL (1 mois)",
                    desc: "Le proprietaire a un mois apres votre refus pour deposer une demande de fixation de loyer au TAL. S'il ne le fait pas dans ce delai, le loyer reste inchange pour la prochaine annee.",
                  },
                  {
                    titre: "Audience au TAL",
                    desc: "Le TAL convoque les deux parties a une audience. Il examine les depenses reelles du proprietaire, les revenus de l'immeuble et les indices annuels. Le tribunal rend ensuite sa decision, qui est contraignante.",
                  },
                ].map((step, i) => (
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
                  Tribunal administratif du logement
                </p>
                <p
                  className="text-[11px] leading-relaxed"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  Site officiel du TAL. Formulaires, outils de calcul et
                  informations sur vos droits.
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
                  RCLALQ
                </p>
                <p
                  className="text-[11px] leading-relaxed"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  Regroupement des comites logement et associations de
                  locataires du Quebec. Aide et accompagnement.
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
                  Forum nid.local
                </p>
                <p
                  className="text-[11px] leading-relaxed"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  Discutez avec d&apos;autres locataires et proprietaires.
                  Partagez vos experiences et posez vos questions.
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
                <span className="font-semibold">Important :</span> cet outil
                est fourni a titre informatif et ne constitue pas un avis
                juridique. Les resultats sont bases sur la methode de calcul
                du TAL, mais ne remplacent pas une fixation officielle.
                Consultez le TAL ou un conseiller juridique pour toute
                situation particuliere.
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
