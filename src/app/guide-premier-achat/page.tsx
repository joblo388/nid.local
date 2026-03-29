import Link from "next/link";
import { Header } from "@/components/Header";
import { prisma } from "@/lib/prisma";
import { dbPostToAppPost, ressourcesUtiles } from "@/lib/data";
import type { Metadata } from "next";

const BASE_URL = process.env.NEXTAUTH_URL?.replace(/\/$/, "") ?? "https://nid.local";
const PAGE_URL = `${BASE_URL}/guide-premier-achat`;

export const metadata: Metadata = {
  title: "Guide du premier achat immobilier au Québec 2026 — Étape par étape",
  description:
    "Tout ce que vous devez savoir pour acheter votre première maison au Québec. Mise de fonds, préapprobation, inspection, notaire, SCHL et plus.",
  keywords: [
    "premier achat maison Québec",
    "acheter première maison",
    "guide acheteur",
    "mise de fonds minimum",
    "premier achat immobilier",
    "acheter maison Québec 2026",
    "RAP REER premier achat",
    "CELIAPP premier achat",
    "inspection préachat",
    "taxe de bienvenue premier achat",
    "préapprobation hypothécaire",
    "frais achat maison Québec",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Guide du premier achat immobilier au Québec 2026 — Étape par étape",
    description:
      "Tout ce que vous devez savoir pour acheter votre première maison au Québec. Mise de fonds, préapprobation, inspection, notaire, SCHL et plus.",
    url: PAGE_URL,
    siteName: "nid.local",
    locale: "fr_CA",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Guide du premier achat immobilier au Québec 2026",
    description:
      "Mise de fonds, préapprobation, inspection, notaire, SCHL — tout ce qu'il faut savoir pour votre premier achat.",
  },
};

/* ── JSON-LD: BreadcrumbList + Article + FAQPage ──────────────────────────── */

const faqEntries = [
  {
    q: "Quel salaire pour acheter une maison à Montréal?",
    r: "En 2026, pour acheter une propriété moyenne à Montréal (environ 550 000 $), il faut un revenu brut d'au moins 100 000 à 120 000 $ par ménage, selon votre mise de fonds et vos dettes existantes. Le ratio d'amortissement brut de la dette (ABD) ne doit pas dépasser 39 % de votre revenu brut. Utilisez notre calculateur de capacité d'emprunt pour obtenir un chiffre personnalisé.",
  },
  {
    q: "Combien de mise de fonds pour un premier achat?",
    r: "Le minimum est de 5 % du prix d'achat pour les propriétés de moins de 500 000 $, 10 % sur la portion entre 500 000 $ et 999 999 $, et 20 % pour les propriétés de 1 million $ et plus. Avec moins de 20 % de mise de fonds, vous devrez payer une prime d'assurance SCHL (de 2,8 % à 4 % du montant du prêt). Combiné au RAP (35 000 $ par personne) et au CELIAPP, un couple peut cumuler une mise de fonds avantageuse.",
  },
  {
    q: "Est-ce que le RAP est avantageux?",
    r: "Le RAP (Régime d'accession à la propriété) permet de retirer jusqu'à 35 000 $ de vos REER sans payer d'impôt immédiat, à condition de rembourser sur 15 ans. C'est avantageux si vous avez des REER disponibles et que le retrait vous aide à atteindre le seuil de 20 % de mise de fonds pour éviter la prime SCHL. Attention : les remboursements manqués sont ajoutés à votre revenu imposable.",
  },
  {
    q: "Quels sont les frais cachés à l'achat?",
    r: "Au-delà du prix d'achat, prévoyez : la taxe de bienvenue (droits de mutation, variable selon le prix et la municipalité), les frais de notaire (1 500 à 2 500 $), l'inspection préachat (500 à 800 $), les ajustements de taxes municipales et scolaires, l'assurance habitation, les frais de déménagement (500 à 2 000 $), et un fonds d'urgence pour les réparations imprévues. Au total, comptez environ 3 à 5 % du prix d'achat en frais connexes.",
  },
  {
    q: "Peut-on acheter sans courtier?",
    r: "Oui, il est tout à fait légal d'acheter sans courtier immobilier au Québec. Cela peut vous permettre de négocier un meilleur prix si le vendeur économise aussi la commission. Cependant, un courtier apporte son expertise en négociation, sa connaissance du marché et la protection de l'OACIQ. Si vous achetez sans courtier, assurez-vous de bien comprendre le processus et faites toujours inspecter la propriété.",
  },
  {
    q: "Combien de temps prend le processus d'achat?",
    r: "Du début de la recherche à la remise des clés, comptez en moyenne 3 à 6 mois. La préapprobation hypothécaire prend 1 à 5 jours. La recherche de propriété varie (quelques semaines à plusieurs mois). Une fois l'offre acceptée, prévoyez 30 à 90 jours pour l'inspection, le financement final et le passage chez le notaire. La date de prise de possession est négociable dans la promesse d'achat.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "nid.local", item: BASE_URL },
        { "@type": "ListItem", position: 2, name: "Guide premier achat", item: PAGE_URL },
      ],
    },
    {
      "@type": "Article",
      headline: "Guide du premier achat immobilier au Québec 2026 — Étape par étape",
      description:
        "Tout ce que vous devez savoir pour acheter votre première maison au Québec. Mise de fonds, préapprobation, inspection, notaire, SCHL et plus.",
      url: PAGE_URL,
      inLanguage: "fr-CA",
      datePublished: "2026-03-28",
      dateModified: "2026-03-28",
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

/* ── Sections du guide ─────────────────────────────────────────────────────── */

const sections = [
  {
    id: "pret",
    titre: "Êtes-vous prêt?",
    contenu: (
      <>
        <p>
          Avant de tomber amoureux d&apos;une propriété, prenez le temps d&apos;évaluer honnêtement
          votre situation financière. C&apos;est la fondation de tout le processus.
        </p>

        <h3>Évaluer sa situation financière</h3>
        <p>
          Faites le portrait complet de vos finances : revenus stables, dettes existantes (auto, prêt
          étudiant, cartes de crédit), épargne disponible et dépenses mensuelles. Les prêteurs
          analyseront ces éléments pour déterminer combien ils sont prêts à vous prêter.
        </p>

        <h3>Les ratios d&apos;endettement (ABD et ATD)</h3>
        <p>
          Deux ratios déterminent votre capacité d&apos;emprunt :
        </p>
        <ul>
          <li>
            <strong>ABD (amortissement brut de la dette)</strong> : vos frais de logement
            (hypothèque + taxes + chauffage) ne doivent pas dépasser <strong>39 %</strong> de votre
            revenu brut.
          </li>
          <li>
            <strong>ATD (amortissement total de la dette)</strong> : toutes vos dettes combinées
            (logement + auto + cartes + prêts) ne doivent pas dépasser <strong>44 %</strong> de votre
            revenu brut.
          </li>
        </ul>
        <p>
          Si vos ratios sont trop élevés, concentrez-vous d&apos;abord sur le remboursement de vos
          dettes avant de vous lancer.
        </p>

        <div className="mt-3">
          <Link
            href="/capacite-emprunt"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] font-semibold transition-opacity hover:opacity-80"
            style={{ background: "var(--green-light-bg)", color: "var(--green-text)" }}
          >
            Calculer ma capacité d&apos;emprunt →
          </Link>
        </div>
      </>
    ),
  },
  {
    id: "mise-de-fonds",
    titre: "La mise de fonds",
    contenu: (
      <>
        <p>
          La mise de fonds est le montant que vous payez comptant à l&apos;achat. Plus elle est
          élevée, moins votre hypothèque sera importante — et plus vous économiserez en intérêts et
          en assurance.
        </p>

        <h3>Les minimums au Canada</h3>
        <div className="overflow-x-auto mt-2 mb-3">
          <table className="w-full text-[12px]" style={{ color: "var(--text-primary)" }}>
            <thead>
              <tr style={{ borderBottom: "0.5px solid var(--border)" }}>
                <th className="text-left py-2 pr-4 font-semibold">Prix de la propriété</th>
                <th className="text-left py-2 pr-4 font-semibold">Mise de fonds minimum</th>
                <th className="text-left py-2 font-semibold">Assurance SCHL</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: "0.5px solid var(--border)" }}>
                <td className="py-2 pr-4">Moins de 500 000 $</td>
                <td className="py-2 pr-4">5 %</td>
                <td className="py-2">Obligatoire (4,00 %)</td>
              </tr>
              <tr style={{ borderBottom: "0.5px solid var(--border)" }}>
                <td className="py-2 pr-4">500 000 $ à 999 999 $</td>
                <td className="py-2 pr-4">5 % sur les premiers 500k + 10 % sur le reste</td>
                <td className="py-2">Obligatoire (jusqu&apos;à 3,10 %)</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">1 000 000 $ et plus</td>
                <td className="py-2 pr-4">20 %</td>
                <td className="py-2">Non requise</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>Le RAP — Régime d&apos;accession à la propriété</h3>
        <p>
          Le RAP vous permet de retirer jusqu&apos;à <strong>35 000 $</strong> de vos REER par
          personne (70 000 $ en couple) sans payer d&apos;impôt, à condition de les rembourser sur
          15 ans. C&apos;est un outil puissant pour bonifier votre mise de fonds.
        </p>
        <ul>
          <li>Les fonds doivent être dans votre REER depuis au moins 90 jours.</li>
          <li>Vous devez être considéré comme un acheteur d&apos;une première habitation.</li>
          <li>Le remboursement commence la 2e année suivant le retrait (1/15 par an).</li>
        </ul>

        <h3>Le CELIAPP — Compte d&apos;épargne libre d&apos;impôt pour l&apos;achat</h3>
        <p>
          Depuis 2023, le CELIAPP permet de cotiser jusqu&apos;à <strong>8 000 $ par an</strong>{" "}
          (maximum à vie de 40 000 $). Les cotisations sont déductibles d&apos;impôt (comme un REER)
          et les retraits pour acheter une première habitation sont <strong>libres d&apos;impôt</strong>{" "}
          (comme un CELI). C&apos;est le meilleur des deux mondes.
        </p>
        <ul>
          <li>Combinable avec le RAP : un couple peut accumuler jusqu&apos;à 150 000 $ en avantages fiscaux.</li>
          <li>Les droits de cotisation inutilisés sont reportables (max 8 000 $ de report).</li>
          <li>Le compte doit être ouvert depuis au moins un an avant le retrait.</li>
        </ul>

        <div className="mt-3">
          <Link
            href="/calculatrice-hypothecaire"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] font-semibold transition-opacity hover:opacity-80"
            style={{ background: "var(--green-light-bg)", color: "var(--green-text)" }}
          >
            Simuler mes paiements hypothécaires →
          </Link>
        </div>
      </>
    ),
  },
  {
    id: "preapprobation",
    titre: "La préapprobation hypothécaire",
    contenu: (
      <>
        <p>
          La préapprobation vous donne une idée claire de votre budget et rassure les vendeurs que
          vous êtes un acheteur sérieux. C&apos;est une étape indispensable avant de commencer les
          visites.
        </p>

        <h3>Documents nécessaires</h3>
        <ul>
          <li>Preuves de revenus (talons de paie, avis de cotisation, T4/Relevé 1)</li>
          <li>Relevés bancaires des 3 derniers mois</li>
          <li>Liste des dettes (soldes et paiements mensuels)</li>
          <li>Preuve de mise de fonds (relevés REER, CELIAPP, comptes d&apos;épargne)</li>
          <li>Pièce d&apos;identité avec photo</li>
          <li>Lettre d&apos;emploi confirmant le poste et le salaire</li>
        </ul>

        <h3>Durée de validité</h3>
        <p>
          Une préapprobation est généralement valide pour <strong>90 à 120 jours</strong>. Elle
          garantit un taux d&apos;intérêt pendant cette période, ce qui vous protège contre les
          hausses de taux. Si vous n&apos;avez pas trouvé dans ce délai, vous pouvez la renouveler
          (au taux du jour).
        </p>

        <h3>Courtier hypothécaire vs banque</h3>
        <p>
          Un <strong>courtier hypothécaire</strong> magasine auprès de plusieurs prêteurs pour vous
          obtenir le meilleur taux et les meilleures conditions. Ses services sont généralement
          gratuits pour l&apos;acheteur (il est rémunéré par le prêteur). C&apos;est souvent le
          meilleur choix pour un premier achat.
        </p>
        <p>
          Votre <strong>banque</strong> peut aussi vous faire une offre compétitive, surtout si vous y
          avez déjà vos comptes. Comparez toujours au moins 2-3 offres avant de vous engager.
        </p>
      </>
    ),
  },
  {
    id: "recherche",
    titre: "La recherche de propriété",
    contenu: (
      <>
        <p>
          Avec votre préapprobation en main, la recherche commence. Définissez vos critères
          essentiels (quartier, type de propriété, nombre de chambres, budget) et restez discipliné.
        </p>

        <h3>Où chercher?</h3>
        <ul>
          <li>
            <strong>Centris.ca</strong> — Le site officiel de la Fédération des chambres immobilières
            du Québec. Toutes les propriétés listées par un courtier y apparaissent.
          </li>
          <li>
            <strong>Realtor.ca</strong> — Le portail pancanadien avec un excellent moteur de recherche
            par carte.
          </li>
          <li>
            <strong>nid.local</strong> — Notre marketplace permet aux propriétaires de publier
            directement leurs annonces sans commission. Idéal pour les ventes entre particuliers.
          </li>
        </ul>

        <h3>Lors des visites : quoi regarder</h3>
        <ul>
          <li>
            <strong>Extérieur</strong> : état de la toiture, revêtement, fondation (fissures?),
            drainage du terrain, âge des fenêtres.
          </li>
          <li>
            <strong>Intérieur</strong> : signes d&apos;humidité (taches, odeurs), état de la
            plomberie, panneau électrique (100A minimum), isolation, ventilation.
          </li>
          <li>
            <strong>Environnement</strong> : bruit, voisinage, stationnement, proximité des services
            (école, transport, épicerie).
          </li>
          <li>
            <strong>Documents</strong> : certificat de localisation (moins de 10 ans?), déclaration
            du vendeur, compte de taxes.
          </li>
        </ul>

        <div className="mt-3">
          <Link
            href="/annonces"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] font-semibold transition-opacity hover:opacity-80"
            style={{ background: "var(--green-light-bg)", color: "var(--green-text)" }}
          >
            Parcourir les annonces sur nid.local →
          </Link>
        </div>
      </>
    ),
  },
  {
    id: "offre",
    titre: "L'offre d'achat",
    contenu: (
      <>
        <p>
          Vous avez trouvé LA propriété? Il est temps de faire une offre. Au Québec, on utilise le
          formulaire de <strong>promesse d&apos;achat</strong> (obligatoire quand un courtier est
          impliqué).
        </p>

        <h3>La promesse d&apos;achat</h3>
        <p>
          C&apos;est un document juridique engageant. Elle contient le prix offert, les conditions, la
          date de prise de possession souhaitée et un délai pour la réponse du vendeur. Une fois
          acceptée par les deux parties, elle devient un contrat.
        </p>

        <h3>Les conditions essentielles</h3>
        <ul>
          <li>
            <strong>Condition d&apos;inspection</strong> : vous donne le droit de faire inspecter la
            propriété et de vous retirer si des problèmes majeurs sont découverts. Ne la retirez
            jamais sous pression.
          </li>
          <li>
            <strong>Condition de financement</strong> : vous protège si votre prêteur refuse le prêt
            après l&apos;évaluation de la propriété.
          </li>
          <li>
            <strong>Condition de vente de votre propriété</strong> : si vous devez vendre avant
            d&apos;acheter (moins courante pour un premier achat).
          </li>
        </ul>

        <h3>Négociation</h3>
        <p>
          Le prix affiché n&apos;est qu&apos;un point de départ. Analysez les comparables récents du
          quartier, le temps de mise en marché et l&apos;état de la propriété. En marché d&apos;acheteur,
          vous avez plus de marge. En marché de vendeur, une offre trop basse risque d&apos;être
          ignorée. Votre courtier (si vous en avez un) peut vous guider sur la stratégie.
        </p>
      </>
    ),
  },
  {
    id: "inspection",
    titre: "L'inspection préachat",
    contenu: (
      <>
        <p>
          L&apos;inspection préachat est votre filet de sécurité. Elle peut révéler des problèmes
          invisibles qui coûteraient des dizaines de milliers de dollars à corriger. Ne sautez
          <strong> jamais</strong> cette étape.
        </p>

        <h3>Pourquoi c&apos;est essentiel</h3>
        <p>
          Un inspecteur certifié examine la propriété de fond en comble et produit un rapport
          détaillé. Ce rapport peut vous permettre de renégocier le prix, de demander des
          réparations, ou de vous retirer de la transaction si les problèmes sont trop importants.
        </p>

        <h3>Quoi vérifier</h3>
        <ul>
          <li>
            <strong>Fondation</strong> : fissures, infiltrations d&apos;eau, signes de mouvement
            structural.
          </li>
          <li>
            <strong>Toiture</strong> : âge (durée de vie typique 20-25 ans pour le bardeau
            d&apos;asphalte), état du revêtement, soffites et fascias.
          </li>
          <li>
            <strong>Plomberie</strong> : type de tuyauterie (cuivre, PEX, galvanisé?), pression
            d&apos;eau, chauffe-eau (âge et type).
          </li>
          <li>
            <strong>Électrique</strong> : panneau 100A ou 200A, câblage (aluminium = drapeau rouge),
            prises mises à la terre.
          </li>
          <li>
            <strong>Isolation et ventilation</strong> : entretoit, murs, sous-sol, échangeur d&apos;air.
          </li>
          <li>
            <strong>Humidité</strong> : sous-sol, salle de bain, autour des fenêtres, grenier.
          </li>
        </ul>

        <h3>Coût moyen</h3>
        <p>
          Comptez entre <strong>500 $ et 800 $</strong> selon la taille et le type de propriété. Pour
          un condo, c&apos;est souvent moins cher (300 à 500 $). C&apos;est un investissement
          minime comparé aux problèmes qu&apos;une inspection peut détecter.
        </p>

        <div className="mt-3">
          <Link
            href="/repertoire"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] font-semibold transition-opacity hover:opacity-80"
            style={{ background: "var(--green-light-bg)", color: "var(--green-text)" }}
          >
            Trouver un inspecteur dans le répertoire →
          </Link>
        </div>
      </>
    ),
  },
  {
    id: "notaire",
    titre: "Le notaire",
    contenu: (
      <>
        <p>
          Au Québec, toute transaction immobilière doit être finalisée devant un notaire. C&apos;est
          lui qui officialise le transfert de propriété et s&apos;assure que tout est en règle.
        </p>

        <h3>Le rôle du notaire</h3>
        <ul>
          <li>Vérifier les titres de propriété (pas de vices cachés juridiques, servitudes, hypothèques non radiées).</li>
          <li>Préparer l&apos;acte de vente et l&apos;acte hypothécaire.</li>
          <li>Gérer les ajustements de taxes (municipales et scolaires).</li>
          <li>Recevoir et distribuer les fonds (prix de vente, remboursement d&apos;hypothèque du vendeur).</li>
          <li>Publier la transaction au Registre foncier du Québec.</li>
        </ul>

        <h3>Coût moyen</h3>
        <p>
          Les honoraires du notaire varient de <strong>1 500 $ à 2 500 $</strong> selon la complexité
          de la transaction. Ce montant inclut généralement les frais de publication au Registre
          foncier et les débours. Demandez une estimation écrite à l&apos;avance.
        </p>

        <h3>Documents à apporter chez le notaire</h3>
        <ul>
          <li>Pièces d&apos;identité (2 pièces dont une avec photo)</li>
          <li>Preuve d&apos;assurance habitation</li>
          <li>Chèque certifié ou virement pour le solde de la mise de fonds et les frais</li>
          <li>Confirmation de financement de votre prêteur</li>
        </ul>
      </>
    ),
  },
  {
    id: "frais",
    titre: "Les frais à prévoir",
    contenu: (
      <>
        <p>
          Le prix d&apos;achat n&apos;est que la pointe de l&apos;iceberg. Voici tous les frais
          connexes à budgéter pour éviter les mauvaises surprises.
        </p>

        <div className="overflow-x-auto mt-2 mb-3">
          <table className="w-full text-[12px]" style={{ color: "var(--text-primary)" }}>
            <thead>
              <tr style={{ borderBottom: "0.5px solid var(--border)" }}>
                <th className="text-left py-2 pr-4 font-semibold">Frais</th>
                <th className="text-left py-2 pr-4 font-semibold">Coût estimé</th>
                <th className="text-left py-2 font-semibold">Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: "0.5px solid var(--border)" }}>
                <td className="py-2 pr-4">Taxe de bienvenue</td>
                <td className="py-2 pr-4">Variable</td>
                <td className="py-2">
                  Droits de mutation calculés par tranches (0,5 % à 2,5 %).{" "}
                  <Link href="/taxe-bienvenue" className="underline" style={{ color: "var(--green-text)" }}>
                    Calculer →
                  </Link>
                </td>
              </tr>
              <tr style={{ borderBottom: "0.5px solid var(--border)" }}>
                <td className="py-2 pr-4">Frais de notaire</td>
                <td className="py-2 pr-4">1 500 – 2 500 $</td>
                <td className="py-2">Acte de vente + hypothèque + publication</td>
              </tr>
              <tr style={{ borderBottom: "0.5px solid var(--border)" }}>
                <td className="py-2 pr-4">Inspection préachat</td>
                <td className="py-2 pr-4">500 – 800 $</td>
                <td className="py-2">300 – 500 $ pour un condo</td>
              </tr>
              <tr style={{ borderBottom: "0.5px solid var(--border)" }}>
                <td className="py-2 pr-4">Déménagement</td>
                <td className="py-2 pr-4">500 – 2 000 $</td>
                <td className="py-2">Varie selon la distance et le volume</td>
              </tr>
              <tr style={{ borderBottom: "0.5px solid var(--border)" }}>
                <td className="py-2 pr-4">Assurance habitation</td>
                <td className="py-2 pr-4">800 – 2 000 $ / an</td>
                <td className="py-2">Obligatoire avant la signature chez le notaire</td>
              </tr>
              <tr style={{ borderBottom: "0.5px solid var(--border)" }}>
                <td className="py-2 pr-4">Ajustements de taxes</td>
                <td className="py-2 pr-4">Variable</td>
                <td className="py-2">Taxes municipales et scolaires au prorata</td>
              </tr>
              <tr style={{ borderBottom: "0.5px solid var(--border)" }}>
                <td className="py-2 pr-4">Assurance SCHL</td>
                <td className="py-2 pr-4">2,8 % – 4 % du prêt</td>
                <td className="py-2">Si mise de fonds &lt; 20 % (ajouté à l&apos;hypothèque)</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">Certificat de localisation</td>
                <td className="py-2 pr-4">1 500 – 2 000 $</td>
                <td className="py-2">Si le vendeur n&apos;en a pas de récent (&lt; 10 ans)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          <strong>Règle du pouce</strong> : prévoyez environ <strong>3 à 5 %</strong> du prix
          d&apos;achat en frais connexes, en plus de votre mise de fonds.
        </p>
      </>
    ),
  },
  {
    id: "apres-achat",
    titre: "Après l'achat",
    contenu: (
      <>
        <p>
          Félicitations, vous êtes propriétaire! Mais le travail ne s&apos;arrête pas à la remise
          des clés. Voici les étapes essentielles pour bien démarrer.
        </p>

        <h3>Changement d&apos;adresse</h3>
        <ul>
          <li>
            <strong>Service québécois de changement d&apos;adresse (SQCA)</strong> : un formulaire
            unique pour aviser 6 ministères d&apos;un coup (RAMQ, SAAQ, Revenu Québec, Élections,
            etc.).
          </li>
          <li>Postes Canada (réacheminement du courrier : environ 100 $ pour 12 mois).</li>
          <li>Banque, employeur, assurances, abonnements.</li>
        </ul>

        <h3>Assurance habitation</h3>
        <p>
          Vous devriez déjà avoir votre assurance en place (c&apos;est une condition du prêteur).
          Assurez-vous d&apos;avoir une couverture adéquate pour la valeur de reconstruction, pas
          seulement la valeur marchande. Comparez au moins 3 soumissions.
        </p>

        <h3>Budget d&apos;entretien annuel</h3>
        <p>
          La règle générale est de prévoir <strong>1 à 2 % de la valeur de la propriété</strong> par
          an pour l&apos;entretien et les réparations. Pour une maison de 450 000 $, cela représente
          4 500 $ à 9 000 $ par an, ou 375 $ à 750 $ par mois.
        </p>
        <ul>
          <li>Créez un fonds d&apos;urgence séparé pour les grosses réparations (toiture, fournaise, etc.).</li>
          <li>Faites un plan d&apos;entretien préventif (nettoyage des gouttières, calfeutrage, drain français, etc.).</li>
          <li>Gardez toutes vos factures de rénovation : elles peuvent bonifier la valeur et réduire l&apos;impôt sur le gain en capital à la revente (résidence secondaire).</li>
        </ul>
      </>
    ),
  },
];

/* ── Table des matières ──────────────────────────────────────────────────── */

const tocItems = [
  ...sections.map((s, i) => ({ id: s.id, label: `${i + 1}. ${s.titre}` })),
  { id: "faq", label: "Questions fréquentes" },
];

/* ── Ressources sidebar ──────────────────────────────────────────────────── */

const ressources = ressourcesUtiles;

/* ── Page ─────────────────────────────────────────────────────────────────── */

export default async function GuidePremierAchatPage() {
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
            <span style={{ color: "var(--text-secondary)" }}>Guide premier achat</span>
          </nav>

          <div className="flex gap-5 items-start">
            {/* Main content */}
            <div className="flex-1 min-w-0 max-w-[800px] space-y-5">
              {/* Hero */}
              <div>
                <h1
                  className="text-[22px] font-bold leading-snug mb-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  Guide du premier achat immobilier au Québec
                </h1>
                <p
                  className="text-[13px] leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Tout ce que vous devez savoir pour acheter votre première maison au Québec en 2026,
                  étape par étape. De l&apos;évaluation de votre budget à la remise des clés, ce
                  guide couvre la mise de fonds, la préapprobation, l&apos;inspection, le notaire, la
                  SCHL et tous les frais à prévoir.
                </p>
              </div>

              {/* Table of contents */}
              <div
                className="rounded-xl p-5"
                style={{
                  background: "var(--bg-card)",
                  border: "0.5px solid var(--border)",
                }}
              >
                <h2
                  className="text-[14px] font-bold mb-3"
                  style={{ color: "var(--text-primary)" }}
                >
                  Table des matières
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

              {/* Sections */}
              {sections.map((section, index) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="rounded-xl p-6 scroll-mt-4"
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
                      {index + 1}
                    </div>
                    <h2
                      className="text-[16px] font-bold leading-snug pt-0.5"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {section.titre}
                    </h2>
                  </div>
                  <div
                    className="guide-content text-[13px] leading-relaxed space-y-3"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {section.contenu}
                  </div>
                </section>
              ))}

              {/* FAQ */}
              <section
                id="faq"
                className="rounded-xl p-6 scroll-mt-4"
                style={{
                  background: "var(--bg-card)",
                  border: "0.5px solid var(--border)",
                }}
              >
                <h2
                  className="text-[16px] font-bold mb-4"
                  style={{ color: "var(--text-primary)" }}
                >
                  Questions fréquentes sur le premier achat
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

              {/* CTA */}
              <div
                className="rounded-xl p-6 text-center space-y-3"
                style={{
                  background: "var(--green-light-bg)",
                  border: "0.5px solid var(--border)",
                }}
              >
                <h2
                  className="text-[15px] font-bold"
                  style={{ color: "var(--green-text)" }}
                >
                  Prêt à commencer?
                </h2>
                <p
                  className="text-[13px] leading-relaxed"
                  style={{ color: "var(--green-text)", opacity: 0.85 }}
                >
                  Commencez par calculer votre capacité d&apos;emprunt, puis explorez les annonces
                  publiées par des propriétaires sur nid.local — sans commission.
                </p>
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  <Link
                    href="/capacite-emprunt"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
                    style={{ background: "var(--green)" }}
                  >
                    Calculer ma capacité d&apos;emprunt →
                  </Link>
                  <Link
                    href="/annonces"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-opacity hover:opacity-80"
                    style={{
                      background: "var(--bg-card)",
                      color: "var(--green-text)",
                      border: "0.5px solid var(--border)",
                    }}
                  >
                    Voir les annonces
                  </Link>
                </div>
              </div>
            </div>

            {/* Sidebar (desktop) */}
            <aside className="hidden md:flex flex-col gap-3 w-[240px] shrink-0">
              <Link
                href="/annonces"
                className="w-full py-2.5 rounded-xl text-[13px] font-semibold text-white transition-opacity hover:opacity-90 flex items-center justify-center gap-2"
                style={{ background: "var(--green)" }}
              >
                Voir les annonces
              </Link>

              {popularPosts.length > 0 && (
                <div
                  className="rounded-xl overflow-hidden"
                  style={{
                    background: "var(--bg-card)",
                    border: "0.5px solid var(--border)",
                  }}
                >
                  <div
                    className="px-4 py-3"
                    style={{ borderBottom: "0.5px solid var(--border)" }}
                  >
                    <h3
                      className="text-[11px] font-semibold uppercase tracking-wider"
                      style={{ color: "var(--text-tertiary)" }}
                    >
                      Discussions populaires
                    </h3>
                  </div>
                  <ul>
                    {popularPosts.map((post, i) => (
                      <li
                        key={post.id}
                        style={{
                          borderBottom:
                            i < popularPosts.length - 1
                              ? "0.5px solid var(--border)"
                              : "none",
                        }}
                      >
                        <Link
                          href={`/post/${post.id}`}
                          className="flex flex-col gap-1 px-4 py-3 transition-colors hover-bg"
                        >
                          <span
                            className="text-[12px] font-medium leading-snug line-clamp-2"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {post.titre}
                          </span>
                          <span
                            className="text-[11px]"
                            style={{ color: "var(--text-tertiary)" }}
                          >
                            {post.quartier.nom} · {post.nbVotes} vote
                            {post.nbVotes !== 1 ? "s" : ""}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div
                className="rounded-xl overflow-hidden"
                style={{
                  background: "var(--bg-card)",
                  border: "0.5px solid var(--border)",
                }}
              >
                <div
                  className="px-4 py-3"
                  style={{ borderBottom: "0.5px solid var(--border)" }}
                >
                  <h3
                    className="text-[11px] font-semibold uppercase tracking-wider"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    Ressources utiles
                  </h3>
                </div>
                <ul>
                  {ressources.map((r, i) => (
                    <li
                      key={r.label}
                      style={{
                        borderBottom:
                          i < ressources.length - 1
                            ? "0.5px solid var(--border)"
                            : "none",
                      }}
                    >
                      <Link
                        href={r.href}
                        className="flex items-center justify-between px-4 py-2.5 transition-colors hover-bg"
                      >
                        <span
                          className="text-[13px]"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {r.label}
                        </span>
                        <svg
                          className="w-3 h-3 shrink-0"
                          style={{ color: "var(--text-tertiary)" }}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div
                className="rounded-xl p-4 space-y-2"
                style={{
                  background: "var(--bg-card)",
                  border: "0.5px solid var(--border)",
                }}
              >
                <p
                  className="text-[11px] font-semibold uppercase tracking-wider"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  À propos de ce guide
                </p>
                <p
                  className="text-[12px] leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Ce guide est mis à jour pour refléter les règles hypothécaires, les programmes
                  gouvernementaux et les conditions de marché de 2026 au Québec.
                </p>
                <p
                  className="text-[12px] leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Pour des conseils personnalisés, consultez un{" "}
                  <strong>courtier hypothécaire</strong> ou un{" "}
                  <strong>planificateur financier</strong>.
                </p>
              </div>

              <p
                className="text-[11px] text-center px-2"
                style={{ color: "var(--text-tertiary)" }}
              >
                © 2026 nid.local — Fait au Québec
              </p>
            </aside>
          </div>
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
            .guide-content table {
              border-collapse: collapse;
            }
          `,
        }}
      />
    </>
  );
}
