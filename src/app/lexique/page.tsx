import Link from "next/link";
import { Header } from "@/components/Header";
import { CommunityCTA } from "@/components/CommunityCTA";
import type { Metadata } from "next";

const BASE_URL = process.env.NEXTAUTH_URL?.replace(/\/$/, "") ?? "https://nid.local";
const PAGE_URL = `${BASE_URL}/lexique`;

export const metadata: Metadata = {
  title: "Lexique immobilier Québec 2026 | Dictionnaire des termes immobiliers",
  description:
    "Définitions claires de 50+ termes immobiliers québécois : MRB, GDS, TDS, taxe de bienvenue, acte de vente, vice caché, servitude, et plus. Le guide de référence pour comprendre l'immobilier au Québec.",
  keywords: [
    "lexique immobilier",
    "vocabulaire immobilier québec",
    "termes immobiliers",
    "définition MRB",
    "c'est quoi GDS TDS",
    "dictionnaire immobilier",
    "glossaire immobilier québec",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Lexique immobilier Québec 2026 | Dictionnaire des termes immobiliers",
    description:
      "Définitions claires de 50+ termes immobiliers québécois. MRB, GDS, TDS, taxe de bienvenue, vice caché et plus. Le guide de référence pour comprendre l'immobilier au Québec.",
    url: PAGE_URL,
    siteName: "nid.local",
    locale: "fr_CA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lexique immobilier Québec 2026 | Dictionnaire des termes immobiliers",
    description:
      "50+ définitions claires de termes immobiliers québécois. MRB, GDS, TDS, taxe de bienvenue, vice caché et plus.",
  },
};

/* ── Glossary data ─────────────────────────────────────────────────────── */

type Term = {
  term: string;
  definition: string;
  link?: { label: string; href: string };
};

type LetterGroup = {
  letter: string;
  id: string;
  terms: Term[];
};

const glossary: LetterGroup[] = [
  {
    letter: "A",
    id: "a",
    terms: [
      {
        term: "Acte de vente",
        definition:
          "Document juridique signé devant notaire qui officialise le transfert de propriété d\u2019un immeuble du vendeur à l\u2019acheteur. Il contient la description légale du bien, le prix de vente et les conditions de la transaction.",
      },
      {
        term: "Amortissement",
        definition:
          "Période totale prévue pour le remboursement complet d\u2019un prêt hypothécaire. Au Québec, l\u2019amortissement maximal est généralement de 25 ans (30 ans pour les nouvelles constructions avec mise de fonds de 20 %+). Plus l\u2019amortissement est long, plus les paiements mensuels sont bas, mais plus les intérêts totaux sont élevés.",
        link: { label: "Calculatrice hypothécaire", href: "/calculatrice-hypothecaire" },
      },
      {
        term: "Assurance hypothécaire (SCHL)",
        definition:
          "Assurance obligatoire lorsque la mise de fonds est inférieure à 20 % du prix d\u2019achat. Elle protège le prêteur (et non l\u2019acheteur) en cas de défaut de paiement. Au Canada, elle est fournie par la SCHL, Sagen ou Canada Guaranty. La prime varie de 2,8 % à 4 % du montant du prêt selon le ratio prêt-valeur.",
        link: { label: "Calculer la prime SCHL", href: "/calculatrice-hypothecaire" },
      },
      {
        term: "Assurance titre",
        definition:
          "Police d\u2019assurance qui protège l\u2019acheteur contre les défauts de titre non détectés lors de la recherche de titres, comme une fraude, une erreur au registre foncier ou un empiètement non déclaré. Elle est payée une seule fois, au moment de l\u2019achat.",
      },
      {
        term: "Avis de 60 jours",
        definition:
          "Préavis envoyé par le créancier hypothécaire lorsqu\u2019un emprunteur est en défaut de paiement. Il accorde un délai de 60 jours pour régulariser la situation avant que le prêteur puisse exercer son recours hypothécaire (saisie).",
      },
    ],
  },
  {
    letter: "B",
    id: "b",
    terms: [
      {
        term: "Bail",
        definition:
          "Contrat entre un propriétaire (locateur) et un locataire qui établit les conditions de location d\u2019un logement : durée, loyer, obligations de chaque partie. Au Québec, le bail résidentiel est encadré par le Code civil et le TAL.",
      },
      {
        term: "Bornage",
        definition:
          "Opération réalisée par un arpenteur-géomètre qui consiste à déterminer et à marquer les limites exactes d\u2019un terrain au moyen de bornes physiques. Le bornage est souvent requis lors de la vente d\u2019un terrain ou en cas de conflit de voisinage sur les limites de propriété.",
      },
    ],
  },
  {
    letter: "C",
    id: "c",
    terms: [
      {
        term: "Cadastre",
        definition:
          "Registre public qui recense tous les lots d\u2019un territoire avec leur numéro, leurs dimensions et leur emplacement géographique. Au Québec, le cadastre est géré par le ministère de l\u2019Énergie et des Ressources naturelles.",
      },
      {
        term: "Capacité d\u2019emprunt",
        definition:
          "Montant maximal qu\u2019une institution financière accepte de vous prêter, calculé à partir de vos revenus, vos dettes existantes et les ratios GDS/TDS. C\u2019est la première étape pour définir votre budget d\u2019achat.",
        link: { label: "Calculer votre capacité", href: "/capacite-emprunt" },
      },
      {
        term: "CELIAPP",
        definition:
          "Compte d\u2019épargne libre d\u2019impôt pour l\u2019achat d\u2019une première propriété. Les contributions sont déductibles d\u2019impôt (jusqu\u2019à 8 000 $/an, maximum 40 000 $ à vie) et les retraits pour un premier achat sont non imposables. Disponible depuis 2023 pour les résidents canadiens.",
      },
      {
        term: "Certificat de localisation",
        definition:
          "Document préparé par un arpenteur-géomètre qui montre les limites exactes du terrain, l\u2019emplacement des bâtiments, les servitudes et les empiètements éventuels. Il est obligatoire pour la vente d\u2019un immeuble et doit généralement avoir moins de 10 ans.",
      },
      {
        term: "Clause d\u2019ajustement",
        definition:
          "Clause de la promesse d\u2019achat qui prévoit la répartition des taxes municipales et scolaires, du mazout, des loyers encaissés et d\u2019autres charges entre le vendeur et l\u2019acheteur au prorata de la date de prise de possession.",
      },
      {
        term: "Copropriété divise / indivise",
        definition:
          "La copropriété divise (condo) donne à chaque propriétaire un lot privatif distinct avec un titre de propriété individuel. La copropriété indivise signifie que plusieurs personnes détiennent ensemble une quote-part d\u2019un même immeuble sans division physique légale. L\u2019indivise est plus difficile à financer et à assurer.",
      },
      {
        term: "Courtier immobilier",
        definition:
          "Professionnel titulaire d\u2019un permis de l\u2019OACIQ autorisé à agir comme intermédiaire dans les transactions immobilières. Il conseille, évalue et négocie au nom de ses clients. Au Québec, les courtiers doivent détenir un permis valide et respecter la Loi sur le courtage immobilier.",
        link: { label: "Répertoire de professionnels", href: "/repertoire" },
      },
    ],
  },
  {
    letter: "D",
    id: "d",
    terms: [
      {
        term: "Déclaration de copropriété",
        definition:
          "Document légal qui crée la copropriété divise et en établit les règles : description des parties privatives et communes, règlement de l\u2019immeuble, répartition des charges et composition du syndicat. Tout acheteur de condo devrait le lire attentivement avant de signer.",
      },
      {
        term: "Droits de mutation (taxe de bienvenue)",
        definition:
          "Taxe perçue par la municipalité lors du transfert de propriété d\u2019un immeuble. Au Québec, elle se calcule par tranches progressives sur le plus élevé entre le prix payé et l\u2019évaluation municipale. Elle est payable en un seul versement, généralement dans les 30 jours suivant l\u2019envoi de la facture.",
        link: { label: "Calculer la taxe de bienvenue", href: "/taxe-bienvenue" },
      },
      {
        term: "Duplex",
        definition:
          "Immeuble résidentiel comprenant deux logements superposés. Populaire au Québec comme premier investissement, le duplex permet d\u2019habiter un logement et de louer l\u2019autre pour réduire les coûts d\u2019habitation.",
        link: { label: "Analyser la rentabilité d\u2019un plex", href: "/calculateur-plex" },
      },
    ],
  },
  {
    letter: "E",
    id: "e",
    terms: [
      {
        term: "Évaluation municipale",
        definition:
          "Valeur attribuée à une propriété par la municipalité aux fins de taxation. Elle sert à calculer les taxes foncières, mais ne représente pas nécessairement la valeur marchande réelle. Le rôle d\u2019évaluation est révisé tous les trois ans au Québec.",
      },
      {
        term: "Évaluateur agréé",
        definition:
          "Professionnel membre de l\u2019Ordre des évaluateurs agréés du Québec, habilité à déterminer la valeur marchande d\u2019un immeuble. Son rapport est souvent exigé par les institutions financières pour un refinancement ou un prêt non conventionnel.",
      },
    ],
  },
  {
    letter: "F",
    id: "f",
    terms: [
      {
        term: "Facteur comparatif",
        definition:
          "Ratio entre l\u2019évaluation municipale et le prix de vente récent de propriétés similaires dans un secteur donné. Il permet d\u2019ajuster l\u2019évaluation municipale pour mieux estimer la valeur marchande réelle d\u2019un bien.",
        link: { label: "Estimation de valeur", href: "/estimation" },
      },
      {
        term: "Financement conventionnel",
        definition:
          "Prêt hypothécaire où la mise de fonds est de 20 % ou plus du prix d\u2019achat. Contrairement au prêt à ratio élevé, le financement conventionnel ne nécessite pas d\u2019assurance hypothécaire (SCHL), ce qui réduit le coût total de l\u2019emprunt.",
      },
      {
        term: "Frais de condo",
        definition:
          "Charges mensuelles payées par les copropriétaires pour couvrir l\u2019entretien des parties communes, l\u2019assurance de l\u2019immeuble, la gestion et la contribution au fonds de prévoyance. Ils varient typiquement de 150 $ à 600 $ par mois selon la taille et les services de l\u2019immeuble.",
      },
    ],
  },
  {
    letter: "G",
    id: "g",
    terms: [
      {
        term: "GDS (ratio du service de la dette brute)",
        definition:
          "Pourcentage du revenu brut consacré aux frais de logement : paiement hypothécaire, taxes foncières, chauffage et, s\u2019il y a lieu, frais de condo. Au Canada, le GDS ne doit généralement pas dépasser 39 % pour être admissible à un prêt hypothécaire.",
        link: { label: "Calculer vos ratios GDS/TDS", href: "/capacite-emprunt" },
      },
    ],
  },
  {
    letter: "H",
    id: "h",
    terms: [
      {
        term: "Hypothèque",
        definition:
          "Droit réel accordé à un prêteur sur un immeuble en garantie du remboursement d\u2019un prêt. En cas de défaut de paiement, le prêteur peut saisir et vendre la propriété pour récupérer les sommes dues.",
        link: { label: "Calculatrice hypothécaire", href: "/calculatrice-hypothecaire" },
      },
      {
        term: "Hypothèque de second rang",
        definition:
          "Prêt supplémentaire garanti par un immeuble déjà grevé d\u2019une première hypothèque. En cas de saisie, le premier créancier est remboursé en priorité. Les taux d\u2019intérêt sont généralement plus élevés pour compenser le risque accru du prêteur.",
      },
    ],
  },
  {
    letter: "I",
    id: "i",
    terms: [
      {
        term: "Inspection préachat",
        definition:
          "Examen visuel approfondi de l\u2019état d\u2019un immeuble par un inspecteur en bâtiment avant l\u2019achat. Elle couvre la structure, la toiture, la plomberie, l\u2019électricité, l\u2019isolation et d\u2019autres systèmes. Elle est facultative mais fortement recommandée pour détecter les problèmes potentiels.",
      },
      {
        term: "Intérêts composés semestriellement",
        definition:
          "Mode de calcul des intérêts standard au Canada pour les prêts hypothécaires à taux fixe. Les intérêts sont composés deux fois par an (et non mensuellement), ce qui produit un taux effectif légèrement inférieur au taux nominal affiché. Les taux variables sont composés mensuellement.",
      },
    ],
  },
  {
    letter: "L",
    id: "l",
    terms: [
      {
        term: "Logement",
        definition:
          "Unité d\u2019habitation destinée à la résidence, comportant généralement une cuisine, une salle de bain et des pièces fermées. Au Québec, la taille des logements est souvent exprimée en nombre de pièces et demie (ex. : 4\u00bd = deux chambres, salon, cuisine).",
      },
      {
        term: "Lot",
        definition:
          "Parcelle de terrain identifiée au cadastre par un numéro unique. Chaque propriété est constituée d\u2019un ou de plusieurs lots. Le numéro de lot est essentiel pour les transactions immobilières et les actes notariés.",
      },
    ],
  },
  {
    letter: "M",
    id: "m",
    terms: [
      {
        term: "Mise de fonds",
        definition:
          "Somme versée par l\u2019acheteur de ses propres fonds lors de l\u2019achat d\u2019une propriété. Au Canada, le minimum est de 5 % pour les propriétés de 500 000 $ et moins, 10 % sur la portion excédant 500 000 $, et 20 % pour les propriétés de 1 M$ et plus. Sous 20 %, l\u2019assurance SCHL est obligatoire.",
        link: { label: "Calculer votre capacité d\u2019emprunt", href: "/capacite-emprunt" },
      },
      {
        term: "MRB (multiplicateur de revenus bruts)",
        definition:
          "Ratio utilisé pour évaluer rapidement la valeur d\u2019un immeuble à revenus. Il se calcule en divisant le prix de vente par les revenus de loyers bruts annuels. Par exemple, un plex vendu 600 000 $ avec 48 000 $ de revenus annuels a un MRB de 12,5x. Plus le MRB est bas, meilleur est le rendement potentiel.",
        link: { label: "Calculateur plex avec MRB", href: "/calculateur-plex" },
      },
      {
        term: "Multiplex",
        definition:
          "Terme général désignant un immeuble résidentiel comprenant plusieurs logements (duplex, triplex, quadruplex, quintuplex ou 5-plex). Les multiplex sont des investissements populaires au Québec pour générer des revenus locatifs.",
        link: { label: "Analyser un multiplex", href: "/calculateur-plex" },
      },
    ],
  },
  {
    letter: "N",
    id: "n",
    terms: [
      {
        term: "Notaire",
        definition:
          "Juriste membre de la Chambre des notaires du Québec, officier public autorisé à recevoir les actes authentiques (dont l\u2019acte de vente et l\u2019hypothèque). En immobilier, le notaire effectue les vérifications de titres, prépare les documents de clôture et veille à ce que la transaction soit conforme à la loi.",
        link: { label: "Trouver un notaire", href: "/repertoire" },
      },
      {
        term: "Nantissement",
        definition:
          "Garantie sur un bien meuble (ex. : placement, véhicule) donnée en garantie d\u2019un prêt. En immobilier, le nantissement peut compléter l\u2019hypothèque pour offrir des sûretés supplémentaires au prêteur.",
      },
    ],
  },
  {
    letter: "O",
    id: "o",
    terms: [
      {
        term: "Offre d\u2019achat",
        definition:
          "Proposition formelle présentée par un acheteur au vendeur pour acquérir un immeuble. Au Québec, on parle souvent de « promesse d\u2019achat » (formulaire de l\u2019OACIQ). Elle contient le prix offert, les conditions (inspection, financement) et le délai d\u2019acceptation.",
      },
      {
        term: "OSFI",
        definition:
          "Bureau du surintendant des institutions financières, organisme fédéral qui réglemente les banques et les sociétés d\u2019assurance au Canada. L\u2019OSFI établit notamment les règles du stress test hypothécaire et les critères de souscription que doivent suivre les prêteurs fédéraux.",
      },
    ],
  },
  {
    letter: "P",
    id: "p",
    terms: [
      {
        term: "Plex",
        definition:
          "Terme familier québécois pour désigner un immeuble à revenus de 2 à 5 logements (duplex, triplex, quadruplex, quintuplex). L\u2019achat d\u2019un plex est une stratégie populaire pour les primo-accédants qui souhaitent habiter un logement et louer les autres.",
        link: { label: "Calculateur plex", href: "/calculateur-plex" },
      },
      {
        term: "Pré-approbation hypothécaire",
        definition:
          "Engagement conditionnel d\u2019un prêteur confirmant le montant maximal qu\u2019il est prêt à financer, basé sur une analyse préliminaire de votre situation financière. Elle permet de magasiner avec confiance et de garantir un taux d\u2019intérêt pour une période de 90 à 120 jours.",
      },
      {
        term: "Prime SCHL",
        definition:
          "Montant payé à la Société canadienne d\u2019hypothèques et de logement lorsque la mise de fonds est inférieure à 20 %. La prime varie de 2,8 % à 4 % du montant du prêt et est généralement ajoutée au solde hypothécaire. Plus la mise de fonds est élevée, plus la prime est basse.",
        link: { label: "Calculer votre prime SCHL", href: "/calculatrice-hypothecaire" },
      },
      {
        term: "Promesse d\u2019achat",
        definition:
          "Document juridique utilisé au Québec (formulaire de l\u2019OACIQ) par lequel un acheteur s\u2019engage formellement à acquérir un immeuble selon des conditions précises. Une fois acceptée par le vendeur, elle devient un contrat bilatéral liant les deux parties.",
      },
    ],
  },
  {
    letter: "Q",
    id: "q",
    terms: [
      {
        term: "Quadruplex",
        definition:
          "Immeuble résidentiel comprenant quatre logements. Il peut être financé comme une résidence principale si le propriétaire occupe l\u2019un des logements, avec une mise de fonds minimale de 5 % (sous réserve du stress test).",
        link: { label: "Analyser un quadruplex", href: "/calculateur-plex" },
      },
      {
        term: "Quintuplex",
        definition:
          "Immeuble résidentiel de cinq logements. Au Québec, un quintuplex propriétaire-occupant peut encore être financé avec les règles résidentielles (mise de fonds minimale de 5 %), tandis qu\u2019un 6-plex et plus tombe sous les règles du financement commercial.",
        link: { label: "Analyser un quintuplex", href: "/calculateur-plex" },
      },
    ],
  },
  {
    letter: "R",
    id: "r",
    terms: [
      {
        term: "RAP (régime d\u2019accession à la propriété)",
        definition:
          "Programme fédéral permettant de retirer jusqu\u2019à 60 000 $ de ses REER sans impôt pour l\u2019achat d\u2019une première propriété (ou après une période de non-propriété de 4 ans). Le montant retiré doit être remboursé dans le REER sur une période de 15 ans.",
      },
      {
        term: "Ratio prix/loyer",
        definition:
          "Indicateur qui compare le prix d\u2019achat d\u2019une propriété au coût annuel de location d\u2019un logement similaire. Un ratio élevé suggère qu\u2019il est plus avantageux de louer ; un ratio bas favorise l\u2019achat.",
        link: { label: "Acheter ou louer?", href: "/acheter-ou-louer" },
      },
      {
        term: "Registre foncier",
        definition:
          "Registre public tenu par le gouvernement du Québec où sont inscrits tous les droits réels immobiliers : propriété, hypothèques, servitudes, droits d\u2019usage, etc. Toute transaction immobilière doit y être publiée pour être opposable aux tiers.",
      },
      {
        term: "Renouvellement hypothécaire",
        definition:
          "Moment où le terme de l\u2019hypothèque arrive à échéance et où l\u2019emprunteur doit négocier de nouvelles conditions (taux, terme, type de prêt) avec son prêteur actuel ou un autre. C\u2019est l\u2019occasion de magasiner pour obtenir un meilleur taux.",
        link: { label: "Simuler vos paiements", href: "/calculatrice-hypothecaire" },
      },
      {
        term: "Rôle d\u2019évaluation",
        definition:
          "Liste officielle de toutes les propriétés d\u2019une municipalité avec leur valeur foncière inscrite, servant de base au calcul des taxes municipales. Au Québec, le rôle est mis à jour tous les trois ans par l\u2019évaluateur municipal.",
      },
    ],
  },
  {
    letter: "S",
    id: "s",
    terms: [
      {
        term: "Servitude",
        definition:
          "Charge imposée sur un immeuble (fonds servant) au profit d\u2019un autre immeuble (fonds dominant) ou d\u2019une personne. Par exemple, une servitude de passage permet au voisin de traverser votre terrain pour accéder à sa propriété. Les servitudes sont inscrites au registre foncier.",
      },
      {
        term: "Stress test (test de résistance)",
        definition:
          "Exigence réglementaire de l\u2019OSFI obligeant les emprunteurs à se qualifier au taux contractuel + 2 % ou à 5,25 %, selon le plus élevé. Il vise à s\u2019assurer que l\u2019emprunteur pourrait supporter une hausse des taux d\u2019intérêt.",
        link: { label: "Tester votre capacité", href: "/capacite-emprunt" },
      },
      {
        term: "Superficie habitable",
        definition:
          "Surface de plancher utilisable d\u2019un logement, mesurée mur intérieur à mur intérieur, excluant les murs, le garage, le sous-sol non aménagé et les espaces dont la hauteur est inférieure aux normes. C\u2019est la mesure standard pour comparer les propriétés entre elles.",
      },
    ],
  },
  {
    letter: "T",
    id: "t",
    terms: [
      {
        term: "TAL (Tribunal administratif du logement)",
        definition:
          "Organisme gouvernemental québécois (anciennement la Régie du logement) qui tranche les litiges entre locataires et propriétaires. Il fixe aussi les critères de fixation et de révision des loyers.",
      },
      {
        term: "Taux directeur",
        definition:
          "Taux d\u2019intérêt cible fixé par la Banque du Canada qui influence l\u2019ensemble des taux d\u2019intérêt au pays. Une hausse du taux directeur entraîne généralement une hausse des taux variables et, à terme, des taux fixes.",
      },
      {
        term: "Taux fixe / variable",
        definition:
          "Un taux fixe reste identique pendant toute la durée du terme hypothécaire, offrant des paiements prévisibles. Un taux variable fluctue selon le taux préférentiel de la banque, lié au taux directeur. Le taux variable offre souvent un taux de départ plus bas, mais comporte un risque de hausse.",
        link: { label: "Comparer les scénarios", href: "/calculatrice-hypothecaire" },
      },
      {
        term: "TDS (ratio du service de la dette totale)",
        definition:
          "Pourcentage du revenu brut consacré à l\u2019ensemble des obligations financières : frais de logement (GDS) plus toutes les autres dettes (auto, prêt étudiant, cartes de crédit, etc.). Le TDS ne doit généralement pas dépasser 44 % pour être admissible à un prêt hypothécaire.",
        link: { label: "Calculer vos ratios GDS/TDS", href: "/capacite-emprunt" },
      },
      {
        term: "Terme hypothécaire",
        definition:
          "Durée du contrat hypothécaire pendant laquelle les conditions (taux, type de prêt) sont fixées. Les termes les plus courants au Canada sont de 1 à 5 ans. À l\u2019expiration du terme, l\u2019hypothèque est renouvelée pour un nouveau terme jusqu\u2019au remboursement complet.",
      },
      {
        term: "Triplex",
        definition:
          "Immeuble résidentiel comprenant trois logements. Comme le duplex, il permet au propriétaire d\u2019habiter un logement et de louer les deux autres pour réduire significativement ses frais d\u2019habitation.",
        link: { label: "Analyser un triplex", href: "/calculateur-plex" },
      },
    ],
  },
  {
    letter: "U",
    id: "u",
    terms: [
      {
        term: "Unifamiliale",
        definition:
          "Propriété résidentielle conçue pour une seule famille, non attenante à d\u2019autres habitations (aussi appelée maison détachée). Elle offre un terrain privé et une indépendance complète, mais implique généralement des coûts d\u2019entretien plus élevés qu\u2019un condo.",
      },
      {
        term: "Usufruit",
        definition:
          "Droit réel qui permet à une personne (l\u2019usufruitier) d\u2019utiliser un bien et d\u2019en percevoir les revenus (loyers, fruits) sans en être propriétaire. Le nu-propriétaire conserve la propriété, mais ne peut jouir du bien tant que dure l\u2019usufruit. Souvent utilisé en planification successorale.",
      },
    ],
  },
  {
    letter: "V",
    id: "v",
    terms: [
      {
        term: "Valeur marchande",
        definition:
          "Prix le plus probable auquel une propriété se vendrait sur le marché libre entre un acheteur et un vendeur consentants et bien informés. Elle est déterminée par l\u2019analyse de ventes comparables récentes dans le secteur.",
        link: { label: "Estimer la valeur d\u2019une propriété", href: "/estimation" },
      },
      {
        term: "Vice caché",
        definition:
          "Défaut grave d\u2019un immeuble qui existait avant la vente, qui n\u2019était pas apparent lors de l\u2019inspection et que le vendeur n\u2019a pas déclaré. Le vendeur est responsable des vices cachés même s\u2019il les ignorait. L\u2019acheteur dispose de 3 ans après la découverte pour exercer un recours.",
      },
      {
        term: "Viager",
        definition:
          "Mode de vente immobilière où l\u2019acheteur verse un bouquet (montant initial) puis une rente périodique au vendeur jusqu\u2019au décès de ce dernier. Plus rare au Québec qu\u2019en France, cette formule comporte un aléa lié à la durée de vie du vendeur.",
      },
    ],
  },
];

const alphabet = glossary.map((g) => g.letter);

/* ── FAQ data for JSON-LD ──────────────────────────────────────────────── */

const faqItems = [
  {
    question: "Qu\u2019est-ce que le MRB en immobilier?",
    answer:
      "Le MRB (multiplicateur de revenus bruts) est un ratio qui permet d\u2019évaluer rapidement la valeur d\u2019un immeuble à revenus. Il se calcule en divisant le prix de vente par les revenus de loyers bruts annuels. Par exemple, un duplex vendu 500 000 $ avec 36 000 $ de loyers annuels a un MRB de 13,9x.",
  },
  {
    question: "C\u2019est quoi le GDS et le TDS?",
    answer:
      "Le GDS (ratio du service de la dette brute) est le pourcentage de votre revenu brut consacré aux frais de logement (hypothèque, taxes, chauffage, frais de condo). Le TDS (ratio du service de la dette totale) inclut toutes vos dettes en plus du logement. Pour obtenir un prêt hypothécaire au Canada, le GDS ne doit pas dépasser 39 % et le TDS ne doit pas dépasser 44 %.",
  },
  {
    question: "Combien coûte la taxe de bienvenue au Québec?",
    answer:
      "La taxe de bienvenue (droits de mutation) se calcule par tranches sur le plus élevé entre le prix payé et l\u2019évaluation municipale : 0,5 % sur les premiers 58 900 $, 1 % de 58 900 $ à 294 600 $, 1,5 % de 294 600 $ à 500 000 $, et 3 % au-delà (les seuils sont ajustés annuellement). Montréal applique un taux de 3,5 % au-delà de 1 M$ et 4 % au-delà de 2 M$.",
  },
  {
    question: "Qu\u2019est-ce qu\u2019un vice caché?",
    answer:
      "Un vice caché est un défaut grave d\u2019un immeuble qui existait avant la vente, qui n\u2019était pas apparent lors d\u2019une inspection raisonnable et que le vendeur n\u2019a pas déclaré. Le vendeur est légalement responsable des vices cachés même s\u2019il les ignorait. L\u2019acheteur dispose de 3 ans après la découverte du vice pour intenter un recours.",
  },
  {
    question: "C\u2019est quoi le CELIAPP?",
    answer:
      "Le CELIAPP (compte d\u2019épargne libre d\u2019impôt pour l\u2019achat d\u2019une première propriété) est un régime d\u2019épargne canadien. Les contributions sont déductibles d\u2019impôt (jusqu\u2019à 8 000 $ par an, maximum 40 000 $ à vie) et les retraits pour un premier achat sont non imposables. Il combine les avantages du REER et du CELI.",
  },
];

/* ── JSON-LD structured data ───────────────────────────────────────────── */

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "nid.local", item: BASE_URL },
        { "@type": "ListItem", position: 2, name: "Lexique immobilier", item: PAGE_URL },
      ],
    },
    {
      "@type": "DefinedTermSet",
      name: "Lexique immobilier | Québec 2026",
      description:
        "Dictionnaire de 50+ termes immobiliers québécois avec définitions claires et exemples pratiques.",
      url: PAGE_URL,
      inLanguage: "fr-CA",
      hasDefinedTerm: glossary.flatMap((group) =>
        group.terms.map((t) => ({
          "@type": "DefinedTerm",
          name: t.term,
          description: t.definition,
        })),
      ),
    },
    {
      "@type": "FAQPage",
      mainEntity: faqItems.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: f.answer,
        },
      })),
    },
  ],
};

/* ── Page component ────────────────────────────────────────────────────── */

export default function LexiquePage() {
  const totalTerms = glossary.reduce((sum, g) => sum + g.terms.length, 0);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-page)" }}>
      <Header />

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="max-w-[1100px] mx-auto px-3 md:px-5 py-4 md:py-6 pb-20 md:pb-6">
        {/* ── Breadcrumb ───────────────────────────────────────────────── */}
        <nav
          className="text-[12px] mb-4"
          style={{ color: "var(--text-tertiary)" }}
          aria-label="Fil d'Ariane"
        >
          <Link href="/" className="hover:underline">
            nid.local
          </Link>
          {" "}
          <span aria-hidden="true">/</span>{" "}
          <span style={{ color: "var(--text-secondary)" }}>Lexique immobilier</span>
        </nav>

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <h1
          className="text-[22px] font-bold leading-snug mb-2"
          style={{ color: "var(--text-primary)" }}
        >
          Lexique immobilier | Québec 2026
        </h1>
        <p
          className="text-[13px] mb-6 max-w-2xl leading-relaxed"
          style={{ color: "var(--text-tertiary)" }}
        >
          Comprendre le jargon immobilier est essentiel pour prendre de bonnes
          décisions. Ce dictionnaire regroupe {totalTerms} termes utilisés
          couramment dans les transactions immobilières au Québec, avec des
          définitions claires et des liens vers nos outils gratuits pour passer
          de la théorie à la pratique.
        </p>

        {/* ── Alphabet nav ─────────────────────────────────────────────── */}
        <nav
          className="flex flex-wrap gap-1.5 mb-8 rounded-xl p-3"
          style={{
            background: "var(--bg-card)",
            border: "0.5px solid var(--border)",
          }}
          aria-label="Navigation alphabétique"
        >
          {alphabet.map((letter) => (
            <a
              key={letter}
              href={`#${letter.toLowerCase()}`}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-[13px] font-semibold transition-colors hover:opacity-80"
              style={{
                background: "var(--green-light-bg)",
                color: "var(--green-text)",
              }}
            >
              {letter}
            </a>
          ))}
        </nav>

        {/* ── Glossary ─────────────────────────────────────────────────── */}
        <div className="space-y-8">
          {glossary.map((group) => (
            <section key={group.letter} id={group.id}>
              {/* Letter heading */}
              <div
                className="flex items-center gap-3 mb-4"
              >
                <span
                  className="w-10 h-10 flex items-center justify-center rounded-xl text-[18px] font-bold shrink-0"
                  style={{
                    background: "var(--green-light-bg)",
                    color: "var(--green-text)",
                  }}
                >
                  {group.letter}
                </span>
                <div
                  className="h-px flex-1"
                  style={{ background: "var(--border)" }}
                />
              </div>

              {/* Terms */}
              <dl className="space-y-3">
                {group.terms.map((t) => (
                  <div
                    key={t.term}
                    className="rounded-xl p-4"
                    style={{
                      background: "var(--bg-card)",
                      border: "0.5px solid var(--border)",
                    }}
                  >
                    <dt
                      className="text-[14px] font-bold mb-1.5"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {t.term}
                    </dt>
                    <dd
                      className="text-[13px] leading-relaxed"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {t.definition}
                    </dd>
                    {t.link && (
                      <dd className="mt-2">
                        <Link
                          href={t.link.href}
                          className="inline-flex items-center gap-1 text-[12px] font-medium transition-opacity hover:opacity-80"
                          style={{ color: "var(--green-text)" }}
                        >
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 7l5 5m0 0l-5 5m5-5H6"
                            />
                          </svg>
                          {t.link.label}
                        </Link>
                      </dd>
                    )}
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>

        {/* ── FAQ visible ──────────────────────────────────────────────── */}
        <section className="mt-12">
          <h2
            className="text-[17px] font-bold mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            Questions fréquentes
          </h2>
          <div className="space-y-4">
            {faqItems.map((f, i) => (
              <details
                key={i}
                className="rounded-xl overflow-hidden"
                style={{
                  background: "var(--bg-card)",
                  border: "0.5px solid var(--border)",
                }}
              >
                <summary
                  className="cursor-pointer select-none px-4 py-3 text-[14px] font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  {f.question}
                </summary>
                <p
                  className="px-4 pb-4 text-[13px] leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {f.answer}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────────── */}
        <div className="mt-8">
          <CommunityCTA contexte="general" />
        </div>
      </main>
    </div>
  );
}
