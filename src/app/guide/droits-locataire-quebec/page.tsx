import Link from "next/link";
import { Header } from "@/components/Header";
import { CommunityCTA } from "@/components/CommunityCTA";
import type { Metadata } from "next";

const BASE_URL =
  process.env.NEXTAUTH_URL?.replace(/\/$/, "") ?? "https://nid.local";
const PAGE_URL = `${BASE_URL}/guide/droits-locataire-quebec`;

export const metadata: Metadata = {
  title: "Droits du locataire Québec 2026 | Guide complet",
  description:
    "Guide complet des droits des locataires au Québec : augmentation de loyer, résiliation de bail, reprise de logement, éviction, TAL. Tout ce que vous devez savoir en 2026.",
  keywords: [
    "droits locataire québec",
    "augmentation loyer québec",
    "TAL tribunal logement",
    "bail québec",
    "éviction locataire",
    "reprise logement",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Droits du locataire Québec 2026 | Guide complet",
    description:
      "Guide complet des droits des locataires au Québec : augmentation de loyer, résiliation de bail, reprise de logement, éviction, TAL. Tout ce que vous devez savoir en 2026.",
    url: PAGE_URL,
    siteName: "nid.local",
    locale: "fr_CA",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Droits du locataire Québec 2026 | Guide complet",
    description:
      "Augmentation de loyer, résiliation de bail, reprise de logement, éviction, TAL : tout ce que les locataires doivent savoir au Québec en 2026.",
  },
};

/* -- JSON-LD : BreadcrumbList + Article + FAQPage ----------------------- */

const faqEntries = [
  {
    q: "Mon propriétaire peut-il augmenter mon loyer sans limite?",
    r: "Non. Au Québec, le locataire a le droit de refuser toute augmentation de loyer qu'il juge excessive. Le propriétaire doit envoyer un avis écrit dans les délais prescrits. Si le locataire refuse, c'est au propriétaire de saisir le TAL dans le mois suivant le refus pour faire fixer le loyer. Les indices de calcul du TAL servent de référence pour les augmentations raisonnables.",
  },
  {
    q: "Peut-on me mettre dehors pour rénover le logement?",
    r: "Le propriétaire peut procéder à une éviction pour subdivision, agrandissement ou changement d'affectation, mais il doit envoyer un avis écrit au moins 6 mois avant la fin du bail. Le locataire a un mois pour accepter ou refuser. En cas de refus, le propriétaire doit saisir le TAL et prouver que le projet est réel. Si l'éviction est accordée, le propriétaire doit verser une indemnité équivalente aux frais de déménagement raisonnables et, dans certains cas, à la différence de loyer pour 12 mois.",
  },
  {
    q: "Mon propriétaire refuse de faire des réparations. Que faire?",
    r: "Le propriétaire est tenu de maintenir le logement en bon état d'habitabilité. Si des réparations nécessaires ne sont pas effectuées malgré une mise en demeure écrite, le locataire peut saisir le TAL pour demander une ordonnance de réparation, une diminution de loyer, ou la résiliation du bail si le logement est devenu impropre à l'habitation.",
  },
  {
    q: "Mon bail interdit les animaux. Est-ce légal?",
    r: "Non. Depuis 2024, une clause interdisant les animaux de compagnie dans un bail résidentiel est réputée non écrite au Québec (projet de loi 31). Le propriétaire ne peut pas refuser un animal de compagnie sauf s'il peut démontrer que l'animal cause un préjudice réel aux autres locataires ou à l'immeuble (bruit excessif, dommages, allergies sévères d'un autre locataire).",
  },
  {
    q: "Mon propriétaire exige un dépôt de sécurité. Est-ce légal?",
    r: "Non. Au Québec, il est interdit d'exiger un dépôt de sécurité ou un dernier mois de loyer à l'avance. Le seul montant pouvant être exigé à la signature est le premier mois de loyer. Si un propriétaire a perçu un dépôt illégalement, le locataire peut en demander le remboursement avec intérêts devant le TAL.",
  },
  {
    q: "Combien de temps ai-je pour contester une augmentation de loyer?",
    r: "Le locataire dispose d'un mois après la réception de l'avis de modification du bail pour répondre par écrit. S'il refuse l'augmentation ou ne répond pas (ce qui équivaut à un refus si le bail est de 12 mois ou plus), le propriétaire a ensuite un mois pour saisir le TAL. S'il ne le fait pas dans ce délai, le bail est reconduit aux conditions existantes.",
  },
];

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
          name: "Droits du locataire Québec",
          item: PAGE_URL,
        },
      ],
    },
    {
      "@type": "Article",
      headline: "Droits du locataire Québec 2026 | Guide complet",
      description:
        "Guide complet des droits des locataires au Québec : augmentation de loyer, résiliation de bail, reprise de logement, éviction, TAL. Tout ce que vous devez savoir en 2026.",
      url: PAGE_URL,
      inLanguage: "fr-CA",
      datePublished: "2026-03-30",
      dateModified: "2026-03-30",
      publisher: {
        "@type": "Organization",
        name: "nid.local",
        url: BASE_URL,
      },
      mainEntityOfPage: PAGE_URL,
    },
    {
      "@type": "FAQPage",
      mainEntity: faqEntries.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.r },
      })),
    },
  ],
};

/* -- Sommaire ----------------------------------------------------------- */

const tocItems = [
  { id: "augmentation", label: "1. Augmentation de loyer" },
  { id: "resiliation", label: "2. Résiliation et quitter le logement" },
  { id: "reprise", label: "3. Reprise de logement et éviction" },
  { id: "reparations", label: "4. Réparations et insalubrité" },
  { id: "animaux", label: "5. Animaux de compagnie" },
  { id: "depot", label: "6. Dépôt de garantie" },
  { id: "tal", label: "7. Saisir le TAL" },
  { id: "faq", label: "Questions fréquentes" },
];

/* -- Page --------------------------------------------------------------- */

export default function DroitsLocatairePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen" style={{ background: "var(--bg-page)" }}>
        <Header />
        <main className="max-w-[720px] mx-auto px-3 md:px-5 py-4 md:py-6 pb-20 md:pb-6">
          {/* Breadcrumb */}
          <nav
            className="flex items-center gap-1.5 text-[12px] mb-5"
            style={{ color: "var(--text-tertiary)" }}
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
              Droits du locataire Québec
            </span>
          </nav>

          {/* Hero */}
          <div className="mb-5">
            <h1
              className="text-[22px] font-bold leading-snug mb-2"
              style={{ color: "var(--text-primary)" }}
            >
              Droits du locataire au Québec en 2026
            </h1>
            <p
              className="text-[13px] leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              Ce guide couvre l&apos;essentiel de vos droits en tant que
              locataire au Québec. Augmentation de loyer, résiliation de bail,
              reprise de logement, réparations, animaux, dépôt de garantie et
              recours au Tribunal administratif du logement (TAL).
            </p>
          </div>

          {/* Table des matières */}
          <div
            className="rounded-xl p-5 mb-5"
            style={{
              background: "var(--bg-card)",
              border: "0.5px solid var(--border)",
            }}
          >
            <h2
              className="text-[14px] font-bold mb-3"
              style={{ color: "var(--text-primary)" }}
            >
              Sommaire
            </h2>
            <ol className="space-y-1.5">
              {tocItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="text-[13px] transition-opacity hover:opacity-70"
                    style={{ color: "var(--green-text)" }}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ol>
          </div>

          {/* ── Section 1 : Augmentation de loyer ─────────────────────── */}
          <section
            id="augmentation"
            className="rounded-xl p-6 mb-5 scroll-mt-4"
            style={{
              background: "var(--bg-card)",
              border: "0.5px solid var(--border)",
            }}
          >
            <div className="flex items-start gap-3 mb-4">
              <div
                className="w-7 h-7 rounded-full text-[13px] font-bold flex items-center justify-center shrink-0 text-white"
                style={{ background: "var(--green)" }}
              >
                1
              </div>
              <h2
                className="text-[16px] font-bold leading-snug pt-0.5"
                style={{ color: "var(--text-primary)" }}
              >
                Augmentation de loyer
              </h2>
            </div>
            <div
              className="guide-content text-[13px] leading-relaxed space-y-3"
              style={{ color: "var(--text-secondary)" }}
            >
              <p>
                Au Québec, il n&apos;y a pas de contrôle strict des loyers,
                mais le locataire a le droit de <strong>refuser</strong> toute
                augmentation qu&apos;il juge déraisonnable. Le propriétaire ne
                peut pas imposer une hausse unilatéralement.
              </p>

              <h2
                className="text-[15px] font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                Comment ça fonctionne
              </h2>
              <p>
                Le propriétaire doit envoyer un <strong>avis de modification du bail</strong> dans
                les délais prescrits avant la fin du bail. Cet avis doit indiquer
                le nouveau loyer proposé et toute autre modification. Le locataire
                a ensuite un mois pour répondre par écrit.
              </p>

              {/* Info alert */}
              <div
                className="rounded-lg p-4 text-[13px] leading-relaxed"
                style={{
                  background: "var(--blue-bg)",
                  color: "var(--blue-text)",
                  borderLeft: "4px solid var(--blue-text)",
                }}
              >
                <strong>Bon à savoir.</strong> Si le locataire ne répond pas à
                l&apos;avis dans le délai d&apos;un mois, le silence est
                considéré comme un <strong>refus</strong> pour les baux de 12
                mois ou plus. Pour les baux de moins de 12 mois, le silence
                vaut acceptation.
              </div>

              <h2
                className="text-[15px] font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                Délais pour l&apos;avis de modification
              </h2>
              <div className="overflow-x-auto mt-2 mb-3">
                <table
                  className="w-full text-[12px]"
                  style={{ color: "var(--text-primary)" }}
                >
                  <thead>
                    <tr
                      style={{
                        background: "var(--bg-secondary)",
                        borderBottom: "0.5px solid var(--border)",
                      }}
                    >
                      <th className="text-left py-2 px-3 font-semibold">
                        Durée du bail
                      </th>
                      <th className="text-left py-2 px-3 font-semibold">
                        Délai minimum de l&apos;avis
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      style={{ borderBottom: "0.5px solid var(--border)" }}
                    >
                      <td className="py-2 px-3">12 mois ou plus</td>
                      <td className="py-2 px-3">
                        3 à 6 mois avant la fin du bail
                      </td>
                    </tr>
                    <tr
                      style={{ borderBottom: "0.5px solid var(--border)" }}
                    >
                      <td className="py-2 px-3">Moins de 12 mois</td>
                      <td className="py-2 px-3">
                        1 à 2 mois avant la fin du bail
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3">
                        Durée indéterminée
                      </td>
                      <td className="py-2 px-3">
                        1 à 2 mois avant la modification
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h2
                className="text-[15px] font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                Si le locataire refuse
              </h2>
              <p>
                Lorsque le locataire refuse l&apos;augmentation, le
                propriétaire dispose d&apos;un mois après le refus pour
                saisir le TAL afin de faire fixer le loyer. S&apos;il ne le
                fait pas, le bail est reconduit aux conditions existantes, sans
                augmentation.
              </p>

              {/* Warning alert */}
              <div
                className="rounded-lg p-4 text-[13px] leading-relaxed"
                style={{
                  background: "var(--amber-bg)",
                  color: "var(--amber-text)",
                  borderLeft: "4px solid var(--amber-text)",
                }}
              >
                <strong>Attention.</strong> Le TAL utilise ses propres indices
                pour calculer les augmentations raisonnables (taxes
                municipales, assurances, travaux majeurs, variation des
                charges d&apos;exploitation). Une augmentation supérieure
                à ces indices peut être refusée par le tribunal.
              </div>

              <h2
                className="text-[15px] font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                Section F du bail et nouveaux locataires
              </h2>
              <p>
                Depuis 2023, le propriétaire est tenu d&apos;indiquer le
                loyer le plus bas payé au cours des 12 derniers mois dans la{" "}
                <strong>section F</strong> du bail. Le nouveau locataire peut
                demander au TAL de fixer le loyer s&apos;il estime que le
                montant est excessif, et ce, dans les 2 mois suivant le
                début du bail. Ce droit est valide même pour les logements
                construits depuis moins de 5 ans.
              </p>
            </div>
          </section>

          {/* ── Section 2 : Résiliation et quitter le logement ──────── */}
          <section
            id="resiliation"
            className="rounded-xl p-6 mb-5 scroll-mt-4"
            style={{
              background: "var(--bg-card)",
              border: "0.5px solid var(--border)",
            }}
          >
            <div className="flex items-start gap-3 mb-4">
              <div
                className="w-7 h-7 rounded-full text-[13px] font-bold flex items-center justify-center shrink-0 text-white"
                style={{ background: "var(--green)" }}
              >
                2
              </div>
              <h2
                className="text-[16px] font-bold leading-snug pt-0.5"
                style={{ color: "var(--text-primary)" }}
              >
                Résiliation et quitter le logement
              </h2>
            </div>
            <div
              className="guide-content text-[13px] leading-relaxed space-y-3"
              style={{ color: "var(--text-secondary)" }}
            >
              <p>
                Un bail résidentiel au Québec se renouvelle automatiquement
                aux mêmes conditions si aucune des parties n&apos;envoie
                d&apos;avis de non-renouvellement dans les délais requis.
                Voici vos droits et obligations pour quitter un logement.
              </p>

              <h2
                className="text-[15px] font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                Avis de non-renouvellement
              </h2>
              <p>
                Le locataire qui souhaite quitter doit envoyer un avis écrit
                au propriétaire dans les délais suivants :
              </p>

              <div className="overflow-x-auto mt-2 mb-3">
                <table
                  className="w-full text-[12px]"
                  style={{ color: "var(--text-primary)" }}
                >
                  <thead>
                    <tr
                      style={{
                        background: "var(--bg-secondary)",
                        borderBottom: "0.5px solid var(--border)",
                      }}
                    >
                      <th className="text-left py-2 px-3 font-semibold">
                        Durée du bail
                      </th>
                      <th className="text-left py-2 px-3 font-semibold">
                        Délai de l&apos;avis
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      style={{ borderBottom: "0.5px solid var(--border)" }}
                    >
                      <td className="py-2 px-3">12 mois ou plus</td>
                      <td className="py-2 px-3">
                        3 à 6 mois avant la fin du bail
                      </td>
                    </tr>
                    <tr
                      style={{ borderBottom: "0.5px solid var(--border)" }}
                    >
                      <td className="py-2 px-3">Moins de 12 mois</td>
                      <td className="py-2 px-3">
                        1 à 2 mois avant la fin du bail
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3">
                        Durée indéterminée
                      </td>
                      <td className="py-2 px-3">
                        1 à 2 mois avant le départ
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h2
                className="text-[15px] font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                Résiliation anticipée
              </h2>
              <p>
                En principe, un locataire ne peut pas rompre un bail avant
                son terme. Cependant, certaines situations permettent une
                résiliation anticipée :
              </p>

              <div className="overflow-x-auto mt-2 mb-3">
                <table
                  className="w-full text-[12px]"
                  style={{ color: "var(--text-primary)" }}
                >
                  <thead>
                    <tr
                      style={{
                        background: "var(--bg-secondary)",
                        borderBottom: "0.5px solid var(--border)",
                      }}
                    >
                      <th className="text-left py-2 px-3 font-semibold">
                        Situation
                      </th>
                      <th className="text-left py-2 px-3 font-semibold">
                        Droit du locataire
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      style={{ borderBottom: "0.5px solid var(--border)" }}
                    >
                      <td className="py-2 px-3">
                        Attribution d&apos;un HLM
                      </td>
                      <td className="py-2 px-3">
                        Résiliation avec avis de 3 mois (ou 2 mois si bail
                        de moins de 12 mois)
                      </td>
                    </tr>
                    <tr
                      style={{ borderBottom: "0.5px solid var(--border)" }}
                    >
                      <td className="py-2 px-3">
                        Personne âgée admise en CHSLD
                      </td>
                      <td className="py-2 px-3">
                        Résiliation avec avis de 2 mois
                      </td>
                    </tr>
                    <tr
                      style={{ borderBottom: "0.5px solid var(--border)" }}
                    >
                      <td className="py-2 px-3">
                        Violence conjugale ou agression sexuelle
                      </td>
                      <td className="py-2 px-3">
                        Résiliation immédiate ou avec préavis réduit
                      </td>
                    </tr>
                    <tr
                      style={{ borderBottom: "0.5px solid var(--border)" }}
                    >
                      <td className="py-2 px-3">
                        Logement impropre à l&apos;habitation
                      </td>
                      <td className="py-2 px-3">
                        Résiliation par le TAL
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3">Cession de bail</td>
                      <td className="py-2 px-3">
                        Le locataire peut céder son bail à une autre
                        personne. Le propriétaire ne peut refuser sans motif
                        sérieux.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h2
                className="text-[15px] font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                Sous-location
              </h2>
              <p>
                Le locataire peut sous-louer son logement avec l&apos;accord
                du propriétaire. Le propriétaire ne peut refuser sans motif
                sérieux. Le locataire demeure responsable du bail envers le
                propriétaire et doit transmettre au sous-locataire une copie
                du bail.
              </p>

              {/* Info alert */}
              <div
                className="rounded-lg p-4 text-[13px] leading-relaxed"
                style={{
                  background: "var(--blue-bg)",
                  color: "var(--blue-text)",
                  borderLeft: "4px solid var(--blue-text)",
                }}
              >
                <strong>Bon à savoir.</strong> Si vous quittez sans envoyer
                l&apos;avis dans les délais, votre bail sera automatiquement
                reconduit pour la même durée. Vous pourriez devoir payer le
                loyer même si vous n&apos;habitez plus le logement.
              </div>
            </div>
          </section>

          {/* ── Section 3 : Reprise de logement et éviction ─────────── */}
          <section
            id="reprise"
            className="rounded-xl p-6 mb-5 scroll-mt-4"
            style={{
              background: "var(--bg-card)",
              border: "0.5px solid var(--border)",
            }}
          >
            <div className="flex items-start gap-3 mb-4">
              <div
                className="w-7 h-7 rounded-full text-[13px] font-bold flex items-center justify-center shrink-0 text-white"
                style={{ background: "var(--green)" }}
              >
                3
              </div>
              <h2
                className="text-[16px] font-bold leading-snug pt-0.5"
                style={{ color: "var(--text-primary)" }}
              >
                Reprise de logement et éviction
              </h2>
            </div>
            <div
              className="guide-content text-[13px] leading-relaxed space-y-3"
              style={{ color: "var(--text-secondary)" }}
            >
              <h2
                className="text-[15px] font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                Reprise de logement
              </h2>
              <p>
                Le propriétaire peut reprendre un logement pour y habiter
                lui-même ou pour y loger un membre de sa famille immédiate
                (conjoint, père, mère, enfant). Il doit envoyer un avis au
                locataire au moins <strong>6 mois</strong> avant la fin du bail.
              </p>
              <ul>
                <li>
                  L&apos;avis doit indiquer la date de reprise, le nom du
                  bénéficiaire et le lien de parenté.
                </li>
                <li>
                  Le locataire a <strong>1 mois</strong> pour accepter ou
                  refuser.
                </li>
                <li>
                  En cas de refus, le propriétaire doit saisir le TAL, qui
                  évaluera la bonne foi de la demande.
                </li>
              </ul>

              {/* Danger alert */}
              <div
                className="rounded-lg p-4 text-[13px] leading-relaxed"
                style={{
                  background: "var(--red-bg)",
                  color: "var(--red-text)",
                  borderLeft: "4px solid var(--red-text)",
                }}
              >
                <strong>Important.</strong> Si le propriétaire ne reprend pas
                le logement dans un délai raisonnable après l&apos;éviction
                du locataire, ce dernier peut réclamer des dommages et
                intérêts devant le TAL. La mauvaise foi est sanctionnée.
              </div>

              <h2
                className="text-[15px] font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                Éviction (subdivision, agrandissement, changement d&apos;affectation)
              </h2>
              <p>
                Le propriétaire peut évincer un locataire pour subdiviser le
                logement, l&apos;agrandir substantiellement ou en changer
                l&apos;affectation (par exemple, le convertir en local
                commercial). Les règles sont strictes :
              </p>
              <ul>
                <li>
                  Avis écrit au moins <strong>6 mois</strong> avant la fin du
                  bail.
                </li>
                <li>
                  L&apos;avis doit préciser le motif, la date prévue et le
                  droit du locataire à une indemnité.
                </li>
                <li>
                  Le locataire a <strong>1 mois</strong> pour accepter ou
                  refuser.
                </li>
                <li>
                  En cas de refus, le propriétaire doit saisir le TAL et
                  démontrer que le projet est sérieux et de bonne foi.
                </li>
              </ul>

              <h2
                className="text-[15px] font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                Indemnités en cas d&apos;éviction
              </h2>
              <p>
                Si l&apos;éviction est accordée, le propriétaire doit verser
                au locataire :
              </p>
              <ul>
                <li>
                  Les frais de déménagement raisonnables.
                </li>
                <li>
                  La différence de loyer pour les 12 mois suivant le
                  déménagement, si le nouveau loyer est plus élevé.
                </li>
                <li>
                  Tout autre dommage démontré par le locataire.
                </li>
              </ul>

              {/* OK alert */}
              <div
                className="rounded-lg p-4 text-[13px] leading-relaxed"
                style={{
                  background: "var(--green-light-bg)",
                  color: "var(--green-text)",
                  borderLeft: "4px solid var(--green)",
                }}
              >
                <strong>Protection renforcée.</strong> Les locataires de 65
                ans et plus, ou ceux qui habitent le logement depuis 10 ans
                ou plus, bénéficient d&apos;une protection accrue. Le
                propriétaire ne peut exercer la reprise que dans des cas
                exceptionnels approuvés par le TAL.
              </div>
            </div>
          </section>

          {/* ── Section 4 : Réparations et insalubrité ──────────────── */}
          <section
            id="reparations"
            className="rounded-xl p-6 mb-5 scroll-mt-4"
            style={{
              background: "var(--bg-card)",
              border: "0.5px solid var(--border)",
            }}
          >
            <div className="flex items-start gap-3 mb-4">
              <div
                className="w-7 h-7 rounded-full text-[13px] font-bold flex items-center justify-center shrink-0 text-white"
                style={{ background: "var(--green)" }}
              >
                4
              </div>
              <h2
                className="text-[16px] font-bold leading-snug pt-0.5"
                style={{ color: "var(--text-primary)" }}
              >
                Réparations et insalubrité
              </h2>
            </div>
            <div
              className="guide-content text-[13px] leading-relaxed space-y-3"
              style={{ color: "var(--text-secondary)" }}
            >
              <p>
                Le propriétaire est tenu de maintenir le logement en bon état
                d&apos;habitabilité pendant toute la durée du bail. Le
                locataire a droit à un logement décent, sécuritaire et
                conforme aux normes de salubrité.
              </p>

              <h2
                className="text-[15px] font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                Obligations du propriétaire
              </h2>
              <ul>
                <li>Effectuer les réparations nécessaires (plomberie, chauffage, électricité, structure).</li>
                <li>Assurer la salubrité du logement (absence de moisissures, de vermines, d&apos;infiltrations d&apos;eau).</li>
                <li>Respecter les normes du Code du bâtiment et les règlements municipaux.</li>
                <li>Garantir la jouissance paisible du logement.</li>
              </ul>

              <h2
                className="text-[15px] font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                Étapes à suivre si des réparations sont nécessaires
              </h2>
              <ol className="list-decimal pl-5 space-y-2">
                <li>
                  <strong>Aviser le propriétaire par écrit.</strong> Décrivez
                  le problème en détail et demandez la réparation dans un
                  délai raisonnable. Gardez une copie de la communication.
                </li>
                <li>
                  <strong>Envoyer une mise en demeure.</strong> Si le
                  propriétaire ne réagit pas, envoyez une mise en demeure par
                  courrier recommandé en lui accordant un délai de 10 à 15
                  jours pour agir.
                </li>
                <li>
                  <strong>Saisir le TAL.</strong> Si la mise en demeure reste
                  sans effet, déposez une demande au Tribunal administratif
                  du logement. Vous pouvez demander une ordonnance de
                  réparation, une diminution de loyer rétroactive, ou la
                  résiliation du bail.
                </li>
                <li>
                  <strong>Contacter la municipalité.</strong> En cas
                  d&apos;insalubrité grave (moisissures, absence de
                  chauffage en hiver, infestation), contactez le service
                  d&apos;inspection de votre municipalité. Un inspecteur peut
                  émettre un avis de non-conformité au propriétaire.
                </li>
              </ol>

              {/* Danger alert */}
              <div
                className="rounded-lg p-4 text-[13px] leading-relaxed"
                style={{
                  background: "var(--red-bg)",
                  color: "var(--red-text)",
                  borderLeft: "4px solid var(--red-text)",
                }}
              >
                <strong>Ne retenez jamais votre loyer.</strong> Même si le
                propriétaire refuse de faire des réparations, le locataire
                doit continuer de payer son loyer. Retenir le loyer peut
                mener à une demande d&apos;expulsion par le propriétaire. La
                bonne démarche est de saisir le TAL pour demander une
                diminution de loyer.
              </div>

              <h2
                className="text-[15px] font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                Logement impropre à l&apos;habitation
              </h2>
              <p>
                Si le logement présente un danger pour la santé ou la
                sécurité des occupants, il peut être déclaré impropre à
                l&apos;habitation. Dans ce cas, le locataire peut demander au
                TAL la résiliation du bail, une réduction de loyer, ou des
                dommages et intérêts. Le propriétaire peut aussi être tenu
                de reloger le locataire à ses frais.
              </p>
            </div>
          </section>

          {/* ── Section 5 : Animaux de compagnie ────────────────────── */}
          <section
            id="animaux"
            className="rounded-xl p-6 mb-5 scroll-mt-4"
            style={{
              background: "var(--bg-card)",
              border: "0.5px solid var(--border)",
            }}
          >
            <div className="flex items-start gap-3 mb-4">
              <div
                className="w-7 h-7 rounded-full text-[13px] font-bold flex items-center justify-center shrink-0 text-white"
                style={{ background: "var(--green)" }}
              >
                5
              </div>
              <h2
                className="text-[16px] font-bold leading-snug pt-0.5"
                style={{ color: "var(--text-primary)" }}
              >
                Animaux de compagnie
              </h2>
            </div>
            <div
              className="guide-content text-[13px] leading-relaxed space-y-3"
              style={{ color: "var(--text-secondary)" }}
            >
              <p>
                Le droit de posséder un animal de compagnie dans un logement
                locatif a été clarifié par la loi 31 adoptée en 2024.
              </p>

              {/* OK alert */}
              <div
                className="rounded-lg p-4 text-[13px] leading-relaxed"
                style={{
                  background: "var(--green-light-bg)",
                  color: "var(--green-text)",
                  borderLeft: "4px solid var(--green)",
                }}
              >
                <strong>Règle principale.</strong> Toute clause du bail
                interdisant la possession d&apos;un animal de compagnie est
                réputée <strong>non écrite</strong>. Le locataire peut avoir
                un animal sans l&apos;autorisation du propriétaire.
              </div>

              <h2
                className="text-[15px] font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                Exceptions
              </h2>
              <p>
                Le propriétaire peut demander au TAL d&apos;interdire un
                animal si celui-ci cause un <strong>préjudice réel</strong> :
              </p>
              <ul>
                <li>Bruit excessif et répété qui nuit aux autres locataires.</li>
                <li>Dommages matériels au logement ou aux espaces communs.</li>
                <li>Allergies sévères documentées d&apos;un autre locataire de l&apos;immeuble.</li>
                <li>Danger pour la sécurité des occupants.</li>
              </ul>

              <h2
                className="text-[15px] font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                Responsabilité du locataire
              </h2>
              <p>
                Le locataire demeure responsable des dommages causés par son
                animal. Il doit respecter les règlements municipaux
                (enregistrement, laisse, races interdites selon la ville) et
                les règles de bon voisinage. En cas de nuisance prouvée, le
                TAL peut ordonner le retrait de l&apos;animal.
              </p>
            </div>
          </section>

          {/* ── Section 6 : Dépôt de garantie ───────────────────────── */}
          <section
            id="depot"
            className="rounded-xl p-6 mb-5 scroll-mt-4"
            style={{
              background: "var(--bg-card)",
              border: "0.5px solid var(--border)",
            }}
          >
            <div className="flex items-start gap-3 mb-4">
              <div
                className="w-7 h-7 rounded-full text-[13px] font-bold flex items-center justify-center shrink-0 text-white"
                style={{ background: "var(--green)" }}
              >
                6
              </div>
              <h2
                className="text-[16px] font-bold leading-snug pt-0.5"
                style={{ color: "var(--text-primary)" }}
              >
                Dépôt de garantie
              </h2>
            </div>
            <div
              className="guide-content text-[13px] leading-relaxed space-y-3"
              style={{ color: "var(--text-secondary)" }}
            >
              {/* Danger alert */}
              <div
                className="rounded-lg p-4 text-[13px] leading-relaxed"
                style={{
                  background: "var(--red-bg)",
                  color: "var(--red-text)",
                  borderLeft: "4px solid var(--red-text)",
                }}
              >
                <strong>Interdit au Québec.</strong> Contrairement à
                l&apos;Ontario et à la plupart des provinces canadiennes,
                il est <strong>illégal</strong> au Québec d&apos;exiger un
                dépôt de garantie, un « dépôt de sécurité » ou un dernier
                mois de loyer à l&apos;avance.
              </div>

              <h2
                className="text-[15px] font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                Ce que le propriétaire peut exiger
              </h2>
              <p>
                Le seul montant que le propriétaire peut légalement
                demander à la signature du bail est le
                <strong> premier mois de loyer</strong>. Aucun autre
                paiement anticipé ne peut être exigé.
              </p>

              <h2
                className="text-[15px] font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                Vous avez versé un dépôt illégal?
              </h2>
              <p>
                Si un propriétaire a perçu un dépôt de garantie, vous
                pouvez en demander le remboursement avec intérêts au taux
                légal. Vous pouvez également déposer une demande au TAL pour
                obtenir ce remboursement et, dans certains cas, des dommages
                punitifs.
              </p>

              {/* Info alert */}
              <div
                className="rounded-lg p-4 text-[13px] leading-relaxed"
                style={{
                  background: "var(--blue-bg)",
                  color: "var(--blue-text)",
                  borderLeft: "4px solid var(--blue-text)",
                }}
              >
                <strong>Bon à savoir.</strong> La clé de stationnement, la
                télécommande de garage ou les clés supplémentaires ne
                peuvent pas non plus faire l&apos;objet d&apos;un dépôt. Le
                propriétaire peut toutefois facturer le coût réel de
                remplacement en cas de perte.
              </div>
            </div>
          </section>

          {/* ── Section 7 : Saisir le TAL ───────────────────────────── */}
          <section
            id="tal"
            className="rounded-xl p-6 mb-5 scroll-mt-4"
            style={{
              background: "var(--bg-card)",
              border: "0.5px solid var(--border)",
            }}
          >
            <div className="flex items-start gap-3 mb-4">
              <div
                className="w-7 h-7 rounded-full text-[13px] font-bold flex items-center justify-center shrink-0 text-white"
                style={{ background: "var(--green)" }}
              >
                7
              </div>
              <h2
                className="text-[16px] font-bold leading-snug pt-0.5"
                style={{ color: "var(--text-primary)" }}
              >
                Saisir le TAL (Tribunal administratif du logement)
              </h2>
            </div>
            <div
              className="guide-content text-[13px] leading-relaxed space-y-3"
              style={{ color: "var(--text-secondary)" }}
            >
              <p>
                Le Tribunal administratif du logement (TAL, anciennement la
                Régie du logement) est l&apos;organisme chargé de régler les
                litiges entre locataires et propriétaires au Québec. Les
                procédures sont accessibles, peu coûteuses et ne nécessitent
                pas d&apos;avocat.
              </p>

              <h2
                className="text-[15px] font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                Comment déposer une demande
              </h2>
              <ol className="list-decimal pl-5 space-y-2">
                <li>
                  Remplir le formulaire de demande en ligne sur le site du
                  TAL ou en personne dans un bureau régional.
                </li>
                <li>
                  Joindre les pièces justificatives (bail, correspondance,
                  photos, mise en demeure, etc.).
                </li>
                <li>
                  Payer les frais de dépôt (environ 82 $ pour une demande
                  civile en 2026).
                </li>
                <li>
                  Le TAL fixe une date d&apos;audience. Les deux parties
                  sont convoquées.
                </li>
                <li>
                  La décision du TAL est exécutoire. Elle peut être portée
                  en appel dans certains cas.
                </li>
              </ol>

              <h2
                className="text-[15px] font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                Délais de traitement au TAL
              </h2>
              <div className="overflow-x-auto mt-2 mb-3">
                <table
                  className="w-full text-[12px]"
                  style={{ color: "var(--text-primary)" }}
                >
                  <thead>
                    <tr
                      style={{
                        background: "var(--bg-secondary)",
                        borderBottom: "0.5px solid var(--border)",
                      }}
                    >
                      <th className="text-left py-2 px-3 font-semibold">
                        Type de demande
                      </th>
                      <th className="text-left py-2 px-3 font-semibold">
                        Délai moyen
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      style={{ borderBottom: "0.5px solid var(--border)" }}
                    >
                      <td className="py-2 px-3">Fixation de loyer</td>
                      <td className="py-2 px-3">6 à 12 mois</td>
                    </tr>
                    <tr
                      style={{ borderBottom: "0.5px solid var(--border)" }}
                    >
                      <td className="py-2 px-3">Non-paiement de loyer</td>
                      <td className="py-2 px-3">1 à 3 mois</td>
                    </tr>
                    <tr
                      style={{ borderBottom: "0.5px solid var(--border)" }}
                    >
                      <td className="py-2 px-3">
                        Réparations et salubrité
                      </td>
                      <td className="py-2 px-3">6 à 18 mois</td>
                    </tr>
                    <tr
                      style={{ borderBottom: "0.5px solid var(--border)" }}
                    >
                      <td className="py-2 px-3">
                        Reprise de logement
                      </td>
                      <td className="py-2 px-3">3 à 9 mois</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3">Éviction</td>
                      <td className="py-2 px-3">6 à 12 mois</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Warning alert */}
              <div
                className="rounded-lg p-4 text-[13px] leading-relaxed"
                style={{
                  background: "var(--amber-bg)",
                  color: "var(--amber-text)",
                  borderLeft: "4px solid var(--amber-text)",
                }}
              >
                <strong>Attention aux délais.</strong> Certaines demandes
                doivent être déposées dans des délais stricts. Par exemple,
                un locataire qui veut contester la fixation du loyer doit
                agir dans les 2 mois suivant le début du bail. Consultez le
                site du TAL ou un organisme d&apos;aide aux locataires pour
                vérifier les délais applicables à votre situation.
              </div>

              <h2
                className="text-[15px] font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                Ressources utiles
              </h2>
              <ul>
                <li>
                  <strong>TAL (Tribunal administratif du logement)</strong> :{" "}
                  <a
                    href="https://www.tal.gouv.qc.ca"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                    style={{ color: "var(--green-text)" }}
                  >
                    tal.gouv.qc.ca
                  </a>
                </li>
                <li>
                  <strong>CORPIQ</strong> (Corporation des propriétaires
                  immobiliers du Québec) :{" "}
                  <a
                    href="https://www.corpiq.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                    style={{ color: "var(--green-text)" }}
                  >
                    corpiq.com
                  </a>
                </li>
                <li>
                  <strong>RCLALQ</strong> (Regroupement des comités logement
                  et associations de locataires du Québec) :{" "}
                  <a
                    href="https://rclalq.qc.ca"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                    style={{ color: "var(--green-text)" }}
                  >
                    rclalq.qc.ca
                  </a>
                </li>
                <li>
                  <strong>Éducaloi</strong> (information juridique
                  vulgarisée) :{" "}
                  <a
                    href="https://educaloi.qc.ca"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                    style={{ color: "var(--green-text)" }}
                  >
                    educaloi.qc.ca
                  </a>
                </li>
              </ul>
            </div>
          </section>

          {/* ── FAQ ─────────────────────────────────────────────────── */}
          <section
            id="faq"
            className="rounded-xl p-6 mb-5 scroll-mt-4"
            style={{
              background: "var(--bg-card)",
              border: "0.5px solid var(--border)",
            }}
          >
            <h2
              className="text-[16px] font-bold mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              Questions fréquentes
            </h2>
            <dl className="space-y-4">
              {faqEntries.map((item) => (
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
          </section>

          {/* ── CommunityCTA ────────────────────────────────────────── */}
          <CommunityCTA contexte="general" />
        </main>
      </div>

      {/* Styles for guide content */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .guide-content h3 {
              font-size: 13px;
              font-weight: 700;
              color: var(--text-primary);
              margin-top: 16px;
              margin-bottom: 4px;
            }
            .guide-content p {
              margin-bottom: 8px;
            }
            .guide-content ul {
              list-style: disc;
              padding-left: 20px;
              margin-bottom: 8px;
            }
            .guide-content ul li {
              margin-bottom: 4px;
            }
            .guide-content ol li {
              margin-bottom: 4px;
            }
            .guide-content table {
              border-collapse: collapse;
            }
          `,
        }}
      />
    </>
  );
}
