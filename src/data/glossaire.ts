export type GlossaireEntry = {
  slug: string;
  terme: string;
  lettre: string;
  definition: string;
  lienCalculateur?: string;
  termesLies?: string[];
};

export const glossaire: GlossaireEntry[] = [
  // ── A ──
  {
    slug: "acte-de-vente",
    terme: "Acte de vente",
    lettre: "A",
    definition:
      "Document juridique signé devant notaire qui officialise le transfert de propriété d\u2019un immeuble du vendeur à l\u2019acheteur. Il contient la description légale du bien, le prix de vente et les conditions de la transaction.",
    termesLies: ["notaire", "registre-foncier", "promesse-d-achat"],
  },
  {
    slug: "amortissement",
    terme: "Amortissement",
    lettre: "A",
    definition:
      "Période totale prévue pour le remboursement complet d\u2019un prêt hypothécaire. Au Québec, l\u2019amortissement maximal est généralement de 25 ans (30 ans pour les nouvelles constructions avec mise de fonds de 20 %+). Plus l\u2019amortissement est long, plus les paiements mensuels sont bas, mais plus les intérêts totaux sont élevés.",
    lienCalculateur: "/calculatrice-hypothecaire",
    termesLies: ["hypotheque", "terme-hypothecaire", "mise-de-fonds"],
  },
  {
    slug: "assurance-hypothecaire-schl",
    terme: "Assurance hypothécaire (SCHL)",
    lettre: "A",
    definition:
      "Assurance obligatoire lorsque la mise de fonds est inférieure à 20 % du prix d\u2019achat. Elle protège le prêteur (et non l\u2019acheteur) en cas de défaut de paiement. Au Canada, elle est fournie par la SCHL, Sagen ou Canada Guaranty. La prime varie de 2,8 % à 4 % du montant du prêt selon le ratio prêt-valeur.",
    lienCalculateur: "/calculatrice-hypothecaire",
    termesLies: ["prime-schl", "mise-de-fonds", "financement-conventionnel"],
  },
  {
    slug: "assurance-titre",
    terme: "Assurance titre",
    lettre: "A",
    definition:
      "Police d\u2019assurance qui protège l\u2019acheteur contre les défauts de titre non détectés lors de la recherche de titres, comme une fraude, une erreur au registre foncier ou un empiètement non déclaré. Elle est payée une seule fois, au moment de l\u2019achat.",
    termesLies: ["registre-foncier", "notaire", "acte-de-vente"],
  },
  {
    slug: "avis-de-60-jours",
    terme: "Avis de 60 jours",
    lettre: "A",
    definition:
      "Préavis envoyé par le créancier hypothécaire lorsqu\u2019un emprunteur est en défaut de paiement. Il accorde un délai de 60 jours pour régulariser la situation avant que le prêteur puisse exercer son recours hypothécaire (saisie).",
    termesLies: ["hypotheque", "hypotheque-de-second-rang"],
  },

  // ── B ──
  {
    slug: "bail",
    terme: "Bail",
    lettre: "B",
    definition:
      "Contrat entre un propriétaire (locateur) et un locataire qui établit les conditions de location d\u2019un logement : durée, loyer, obligations de chaque partie. Au Québec, le bail résidentiel est encadré par le Code civil et le TAL.",
    termesLies: ["tal", "logement", "plex"],
  },
  {
    slug: "bornage",
    terme: "Bornage",
    lettre: "B",
    definition:
      "Opération réalisée par un arpenteur-géomètre qui consiste à déterminer et à marquer les limites exactes d\u2019un terrain au moyen de bornes physiques. Le bornage est souvent requis lors de la vente d\u2019un terrain ou en cas de conflit de voisinage sur les limites de propriété.",
    termesLies: ["certificat-de-localisation", "cadastre", "lot"],
  },

  // ── C ──
  {
    slug: "cadastre",
    terme: "Cadastre",
    lettre: "C",
    definition:
      "Registre public qui recense tous les lots d\u2019un territoire avec leur numéro, leurs dimensions et leur emplacement géographique. Au Québec, le cadastre est géré par le ministère de l\u2019Énergie et des Ressources naturelles.",
    termesLies: ["lot", "bornage", "registre-foncier"],
  },
  {
    slug: "capacite-d-emprunt",
    terme: "Capacité d\u2019emprunt",
    lettre: "C",
    definition:
      "Montant maximal qu\u2019une institution financière accepte de vous prêter, calculé à partir de vos revenus, vos dettes existantes et les ratios GDS/TDS. C\u2019est la première étape pour définir votre budget d\u2019achat.",
    lienCalculateur: "/capacite-emprunt",
    termesLies: ["gds", "tds", "stress-test"],
  },
  {
    slug: "celiapp",
    terme: "CELIAPP",
    lettre: "C",
    definition:
      "Compte d\u2019épargne libre d\u2019impôt pour l\u2019achat d\u2019une première propriété. Les contributions sont déductibles d\u2019impôt (jusqu\u2019à 8 000 $/an, maximum 40 000 $ à vie) et les retraits pour un premier achat sont non imposables. Disponible depuis 2023 pour les résidents canadiens.",
    termesLies: ["rap", "mise-de-fonds", "pre-approbation-hypothecaire"],
  },
  {
    slug: "certificat-de-localisation",
    terme: "Certificat de localisation",
    lettre: "C",
    definition:
      "Document préparé par un arpenteur-géomètre qui montre les limites exactes du terrain, l\u2019emplacement des bâtiments, les servitudes et les empiètements éventuels. Il est obligatoire pour la vente d\u2019un immeuble et doit généralement avoir moins de 10 ans.",
    termesLies: ["bornage", "servitude", "acte-de-vente"],
  },
  {
    slug: "clause-d-ajustement",
    terme: "Clause d\u2019ajustement",
    lettre: "C",
    definition:
      "Clause de la promesse d\u2019achat qui prévoit la répartition des taxes municipales et scolaires, du mazout, des loyers encaissés et d\u2019autres charges entre le vendeur et l\u2019acheteur au prorata de la date de prise de possession.",
    termesLies: ["promesse-d-achat", "droits-de-mutation", "notaire"],
  },
  {
    slug: "copropriete-divise-indivise",
    terme: "Copropriété divise / indivise",
    lettre: "C",
    definition:
      "La copropriété divise (condo) donne à chaque propriétaire un lot privatif distinct avec un titre de propriété individuel. La copropriété indivise signifie que plusieurs personnes détiennent ensemble une quote-part d\u2019un même immeuble sans division physique légale. L\u2019indivise est plus difficile à financer et à assurer.",
    termesLies: ["declaration-de-copropriete", "frais-de-condo", "lot"],
  },
  {
    slug: "courtier-immobilier",
    terme: "Courtier immobilier",
    lettre: "C",
    definition:
      "Professionnel titulaire d\u2019un permis de l\u2019OACIQ autorisé à agir comme intermédiaire dans les transactions immobilières. Il conseille, évalue et négocie au nom de ses clients. Au Québec, les courtiers doivent détenir un permis valide et respecter la Loi sur le courtage immobilier.",
    termesLies: ["offre-d-achat", "promesse-d-achat", "notaire"],
  },

  // ── D ──
  {
    slug: "declaration-de-copropriete",
    terme: "Déclaration de copropriété",
    lettre: "D",
    definition:
      "Document légal qui crée la copropriété divise et en établit les règles : description des parties privatives et communes, règlement de l\u2019immeuble, répartition des charges et composition du syndicat. Tout acheteur de condo devrait le lire attentivement avant de signer.",
    termesLies: ["copropriete-divise-indivise", "frais-de-condo"],
  },
  {
    slug: "droits-de-mutation",
    terme: "Droits de mutation (taxe de bienvenue)",
    lettre: "D",
    definition:
      "Taxe perçue par la municipalité lors du transfert de propriété d\u2019un immeuble. Au Québec, elle se calcule par tranches progressives sur le plus élevé entre le prix payé et l\u2019évaluation municipale. Elle est payable en un seul versement, généralement dans les 30 jours suivant l\u2019envoi de la facture.",
    lienCalculateur: "/taxe-bienvenue",
    termesLies: ["evaluation-municipale", "acte-de-vente", "notaire"],
  },
  {
    slug: "duplex",
    terme: "Duplex",
    lettre: "D",
    definition:
      "Immeuble résidentiel comprenant deux logements superposés. Populaire au Québec comme premier investissement, le duplex permet d\u2019habiter un logement et de louer l\u2019autre pour réduire les coûts d\u2019habitation.",
    lienCalculateur: "/calculateur-plex",
    termesLies: ["plex", "multiplex", "triplex"],
  },

  // ── E ──
  {
    slug: "evaluation-municipale",
    terme: "Évaluation municipale",
    lettre: "E",
    definition:
      "Valeur attribuée à une propriété par la municipalité aux fins de taxation. Elle sert à calculer les taxes foncières, mais ne représente pas nécessairement la valeur marchande réelle. Le rôle d\u2019évaluation est révisé tous les trois ans au Québec.",
    termesLies: ["role-d-evaluation", "valeur-marchande", "facteur-comparatif"],
  },
  {
    slug: "evaluateur-agree",
    terme: "Évaluateur agréé",
    lettre: "E",
    definition:
      "Professionnel membre de l\u2019Ordre des évaluateurs agréés du Québec, habilité à déterminer la valeur marchande d\u2019un immeuble. Son rapport est souvent exigé par les institutions financières pour un refinancement ou un prêt non conventionnel.",
    termesLies: ["valeur-marchande", "evaluation-municipale", "financement-conventionnel"],
  },

  // ── F ──
  {
    slug: "facteur-comparatif",
    terme: "Facteur comparatif",
    lettre: "F",
    definition:
      "Ratio entre l\u2019évaluation municipale et le prix de vente récent de propriétés similaires dans un secteur donné. Il permet d\u2019ajuster l\u2019évaluation municipale pour mieux estimer la valeur marchande réelle d\u2019un bien.",
    lienCalculateur: "/estimation",
    termesLies: ["evaluation-municipale", "valeur-marchande"],
  },
  {
    slug: "financement-conventionnel",
    terme: "Financement conventionnel",
    lettre: "F",
    definition:
      "Prêt hypothécaire où la mise de fonds est de 20 % ou plus du prix d\u2019achat. Contrairement au prêt à ratio élevé, le financement conventionnel ne nécessite pas d\u2019assurance hypothécaire (SCHL), ce qui réduit le coût total de l\u2019emprunt.",
    termesLies: ["assurance-hypothecaire-schl", "mise-de-fonds", "hypotheque"],
  },
  {
    slug: "frais-de-condo",
    terme: "Frais de condo",
    lettre: "F",
    definition:
      "Charges mensuelles payées par les copropriétaires pour couvrir l\u2019entretien des parties communes, l\u2019assurance de l\u2019immeuble, la gestion et la contribution au fonds de prévoyance. Ils varient typiquement de 150 $ à 600 $ par mois selon la taille et les services de l\u2019immeuble.",
    termesLies: ["copropriete-divise-indivise", "declaration-de-copropriete", "gds"],
  },

  // ── G ──
  {
    slug: "gds",
    terme: "GDS (ratio du service de la dette brute)",
    lettre: "G",
    definition:
      "Pourcentage du revenu brut consacré aux frais de logement : paiement hypothécaire, taxes foncières, chauffage et, s\u2019il y a lieu, frais de condo. Au Canada, le GDS ne doit généralement pas dépasser 39 % pour être admissible à un prêt hypothécaire.",
    lienCalculateur: "/capacite-emprunt",
    termesLies: ["tds", "capacite-d-emprunt", "stress-test"],
  },

  // ── H ──
  {
    slug: "hypotheque",
    terme: "Hypothèque",
    lettre: "H",
    definition:
      "Droit réel accordé à un prêteur sur un immeuble en garantie du remboursement d\u2019un prêt. En cas de défaut de paiement, le prêteur peut saisir et vendre la propriété pour récupérer les sommes dues.",
    lienCalculateur: "/calculatrice-hypothecaire",
    termesLies: ["amortissement", "terme-hypothecaire", "taux-fixe-variable"],
  },
  {
    slug: "hypotheque-de-second-rang",
    terme: "Hypothèque de second rang",
    lettre: "H",
    definition:
      "Prêt supplémentaire garanti par un immeuble déjà grevé d\u2019une première hypothèque. En cas de saisie, le premier créancier est remboursé en priorité. Les taux d\u2019intérêt sont généralement plus élevés pour compenser le risque accru du prêteur.",
    termesLies: ["hypotheque", "avis-de-60-jours", "nantissement"],
  },

  // ── I ──
  {
    slug: "inspection-preachat",
    terme: "Inspection préachat",
    lettre: "I",
    definition:
      "Examen visuel approfondi de l\u2019état d\u2019un immeuble par un inspecteur en bâtiment avant l\u2019achat. Elle couvre la structure, la toiture, la plomberie, l\u2019électricité, l\u2019isolation et d\u2019autres systèmes. Elle est facultative mais fortement recommandée pour détecter les problèmes potentiels.",
    termesLies: ["vice-cache", "offre-d-achat", "promesse-d-achat"],
  },
  {
    slug: "interets-composes-semestriellement",
    terme: "Intérêts composés semestriellement",
    lettre: "I",
    definition:
      "Mode de calcul des intérêts standard au Canada pour les prêts hypothécaires à taux fixe. Les intérêts sont composés deux fois par an (et non mensuellement), ce qui produit un taux effectif légèrement inférieur au taux nominal affiché. Les taux variables sont composés mensuellement.",
    termesLies: ["taux-fixe-variable", "hypotheque", "amortissement"],
  },

  // ── L ──
  {
    slug: "logement",
    terme: "Logement",
    lettre: "L",
    definition:
      "Unité d\u2019habitation destinée à la résidence, comportant généralement une cuisine, une salle de bain et des pièces fermées. Au Québec, la taille des logements est souvent exprimée en nombre de pièces et demie (ex. : 4\u00bd = deux chambres, salon, cuisine).",
    termesLies: ["bail", "tal", "superficie-habitable"],
  },
  {
    slug: "lot",
    terme: "Lot",
    lettre: "L",
    definition:
      "Parcelle de terrain identifiée au cadastre par un numéro unique. Chaque propriété est constituée d\u2019un ou de plusieurs lots. Le numéro de lot est essentiel pour les transactions immobilières et les actes notariés.",
    termesLies: ["cadastre", "bornage", "registre-foncier"],
  },

  // ── M ──
  {
    slug: "mise-de-fonds",
    terme: "Mise de fonds",
    lettre: "M",
    definition:
      "Somme versée par l\u2019acheteur de ses propres fonds lors de l\u2019achat d\u2019une propriété. Au Canada, le minimum est de 5 % pour les propriétés de 500 000 $ et moins, 10 % sur la portion excédant 500 000 $, et 20 % pour les propriétés de 1 M$ et plus. Sous 20 %, l\u2019assurance SCHL est obligatoire.",
    lienCalculateur: "/capacite-emprunt",
    termesLies: ["assurance-hypothecaire-schl", "financement-conventionnel", "celiapp"],
  },
  {
    slug: "mrb",
    terme: "MRB (multiplicateur de revenus bruts)",
    lettre: "M",
    definition:
      "Ratio utilisé pour évaluer rapidement la valeur d\u2019un immeuble à revenus. Il se calcule en divisant le prix de vente par les revenus de loyers bruts annuels. Par exemple, un plex vendu 600 000 $ avec 48 000 $ de revenus annuels a un MRB de 12,5x. Plus le MRB est bas, meilleur est le rendement potentiel.",
    lienCalculateur: "/calculateur-plex",
    termesLies: ["plex", "multiplex", "ratio-prix-loyer"],
  },
  {
    slug: "multiplex",
    terme: "Multiplex",
    lettre: "M",
    definition:
      "Terme général désignant un immeuble résidentiel comprenant plusieurs logements (duplex, triplex, quadruplex, quintuplex ou 5-plex). Les multiplex sont des investissements populaires au Québec pour générer des revenus locatifs.",
    lienCalculateur: "/calculateur-plex",
    termesLies: ["duplex", "triplex", "quadruplex"],
  },

  // ── N ──
  {
    slug: "notaire",
    terme: "Notaire",
    lettre: "N",
    definition:
      "Juriste membre de la Chambre des notaires du Québec, officier public autorisé à recevoir les actes authentiques (dont l\u2019acte de vente et l\u2019hypothèque). En immobilier, le notaire effectue les vérifications de titres, prépare les documents de clôture et veille à ce que la transaction soit conforme à la loi.",
    termesLies: ["acte-de-vente", "registre-foncier", "hypotheque"],
  },
  {
    slug: "nantissement",
    terme: "Nantissement",
    lettre: "N",
    definition:
      "Garantie sur un bien meuble (ex. : placement, véhicule) donnée en garantie d\u2019un prêt. En immobilier, le nantissement peut compléter l\u2019hypothèque pour offrir des sûretés supplémentaires au prêteur.",
    termesLies: ["hypotheque", "hypotheque-de-second-rang", "financement-conventionnel"],
  },

  // ── O ──
  {
    slug: "offre-d-achat",
    terme: "Offre d\u2019achat",
    lettre: "O",
    definition:
      "Proposition formelle présentée par un acheteur au vendeur pour acquérir un immeuble. Au Québec, on parle souvent de \u00ab promesse d\u2019achat \u00bb (formulaire de l\u2019OACIQ). Elle contient le prix offert, les conditions (inspection, financement) et le délai d\u2019acceptation.",
    termesLies: ["promesse-d-achat", "courtier-immobilier", "inspection-preachat"],
  },
  {
    slug: "osfi",
    terme: "OSFI",
    lettre: "O",
    definition:
      "Bureau du surintendant des institutions financières, organisme fédéral qui réglemente les banques et les sociétés d\u2019assurance au Canada. L\u2019OSFI établit notamment les règles du stress test hypothécaire et les critères de souscription que doivent suivre les prêteurs fédéraux.",
    termesLies: ["stress-test", "taux-directeur", "hypotheque"],
  },

  // ── P ──
  {
    slug: "plex",
    terme: "Plex",
    lettre: "P",
    definition:
      "Terme familier québécois pour désigner un immeuble à revenus de 2 à 5 logements (duplex, triplex, quadruplex, quintuplex). L\u2019achat d\u2019un plex est une stratégie populaire pour les primo-accédants qui souhaitent habiter un logement et louer les autres.",
    lienCalculateur: "/calculateur-plex",
    termesLies: ["duplex", "triplex", "mrb"],
  },
  {
    slug: "pre-approbation-hypothecaire",
    terme: "Pré-approbation hypothécaire",
    lettre: "P",
    definition:
      "Engagement conditionnel d\u2019un prêteur confirmant le montant maximal qu\u2019il est prêt à financer, basé sur une analyse préliminaire de votre situation financière. Elle permet de magasiner avec confiance et de garantir un taux d\u2019intérêt pour une période de 90 à 120 jours.",
    termesLies: ["capacite-d-emprunt", "hypotheque", "stress-test"],
  },
  {
    slug: "prime-schl",
    terme: "Prime SCHL",
    lettre: "P",
    definition:
      "Montant payé à la Société canadienne d\u2019hypothèques et de logement lorsque la mise de fonds est inférieure à 20 %. La prime varie de 2,8 % à 4 % du montant du prêt et est généralement ajoutée au solde hypothécaire. Plus la mise de fonds est élevée, plus la prime est basse.",
    lienCalculateur: "/calculatrice-hypothecaire",
    termesLies: ["assurance-hypothecaire-schl", "mise-de-fonds"],
  },
  {
    slug: "promesse-d-achat",
    terme: "Promesse d\u2019achat",
    lettre: "P",
    definition:
      "Document juridique utilisé au Québec (formulaire de l\u2019OACIQ) par lequel un acheteur s\u2019engage formellement à acquérir un immeuble selon des conditions précises. Une fois acceptée par le vendeur, elle devient un contrat bilatéral liant les deux parties.",
    termesLies: ["offre-d-achat", "courtier-immobilier", "inspection-preachat"],
  },

  // ── Q ──
  {
    slug: "quadruplex",
    terme: "Quadruplex",
    lettre: "Q",
    definition:
      "Immeuble résidentiel comprenant quatre logements. Il peut être financé comme une résidence principale si le propriétaire occupe l\u2019un des logements, avec une mise de fonds minimale de 5 % (sous réserve du stress test).",
    lienCalculateur: "/calculateur-plex",
    termesLies: ["plex", "multiplex", "quintuplex"],
  },
  {
    slug: "quintuplex",
    terme: "Quintuplex",
    lettre: "Q",
    definition:
      "Immeuble résidentiel de cinq logements. Au Québec, un quintuplex propriétaire-occupant peut encore être financé avec les règles résidentielles (mise de fonds minimale de 5 %), tandis qu\u2019un 6-plex et plus tombe sous les règles du financement commercial.",
    lienCalculateur: "/calculateur-plex",
    termesLies: ["plex", "multiplex", "quadruplex"],
  },

  // ── R ──
  {
    slug: "rap",
    terme: "RAP (régime d\u2019accession à la propriété)",
    lettre: "R",
    definition:
      "Programme fédéral permettant de retirer jusqu\u2019à 60 000 $ de ses REER sans impôt pour l\u2019achat d\u2019une première propriété (ou après une période de non-propriété de 4 ans). Le montant retiré doit être remboursé dans le REER sur une période de 15 ans.",
    termesLies: ["celiapp", "mise-de-fonds", "pre-approbation-hypothecaire"],
  },
  {
    slug: "ratio-prix-loyer",
    terme: "Ratio prix/loyer",
    lettre: "R",
    definition:
      "Indicateur qui compare le prix d\u2019achat d\u2019une propriété au coût annuel de location d\u2019un logement similaire. Un ratio élevé suggère qu\u2019il est plus avantageux de louer ; un ratio bas favorise l\u2019achat.",
    lienCalculateur: "/acheter-ou-louer",
    termesLies: ["mrb", "valeur-marchande", "bail"],
  },
  {
    slug: "registre-foncier",
    terme: "Registre foncier",
    lettre: "R",
    definition:
      "Registre public tenu par le gouvernement du Québec où sont inscrits tous les droits réels immobiliers : propriété, hypothèques, servitudes, droits d\u2019usage, etc. Toute transaction immobilière doit y être publiée pour être opposable aux tiers.",
    termesLies: ["notaire", "acte-de-vente", "servitude"],
  },
  {
    slug: "renouvellement-hypothecaire",
    terme: "Renouvellement hypothécaire",
    lettre: "R",
    definition:
      "Moment où le terme de l\u2019hypothèque arrive à échéance et où l\u2019emprunteur doit négocier de nouvelles conditions (taux, terme, type de prêt) avec son prêteur actuel ou un autre. C\u2019est l\u2019occasion de magasiner pour obtenir un meilleur taux.",
    lienCalculateur: "/calculatrice-hypothecaire",
    termesLies: ["terme-hypothecaire", "taux-fixe-variable", "hypotheque"],
  },
  {
    slug: "role-d-evaluation",
    terme: "Rôle d\u2019évaluation",
    lettre: "R",
    definition:
      "Liste officielle de toutes les propriétés d\u2019une municipalité avec leur valeur foncière inscrite, servant de base au calcul des taxes municipales. Au Québec, le rôle est mis à jour tous les trois ans par l\u2019évaluateur municipal.",
    termesLies: ["evaluation-municipale", "droits-de-mutation", "facteur-comparatif"],
  },

  // ── S ──
  {
    slug: "servitude",
    terme: "Servitude",
    lettre: "S",
    definition:
      "Charge imposée sur un immeuble (fonds servant) au profit d\u2019un autre immeuble (fonds dominant) ou d\u2019une personne. Par exemple, une servitude de passage permet au voisin de traverser votre terrain pour accéder à sa propriété. Les servitudes sont inscrites au registre foncier.",
    termesLies: ["registre-foncier", "certificat-de-localisation", "bornage"],
  },
  {
    slug: "stress-test",
    terme: "Stress test (test de résistance)",
    lettre: "S",
    definition:
      "Exigence réglementaire de l\u2019OSFI obligeant les emprunteurs à se qualifier au taux contractuel + 2 % ou à 5,25 %, selon le plus élevé. Il vise à s\u2019assurer que l\u2019emprunteur pourrait supporter une hausse des taux d\u2019intérêt.",
    lienCalculateur: "/capacite-emprunt",
    termesLies: ["osfi", "gds", "tds"],
  },
  {
    slug: "superficie-habitable",
    terme: "Superficie habitable",
    lettre: "S",
    definition:
      "Surface de plancher utilisable d\u2019un logement, mesurée mur intérieur à mur intérieur, excluant les murs, le garage, le sous-sol non aménagé et les espaces dont la hauteur est inférieure aux normes. C\u2019est la mesure standard pour comparer les propriétés entre elles.",
    termesLies: ["logement", "unifamiliale", "copropriete-divise-indivise"],
  },

  // ── T ──
  {
    slug: "tal",
    terme: "TAL (Tribunal administratif du logement)",
    lettre: "T",
    definition:
      "Organisme gouvernemental québécois (anciennement la Régie du logement) qui tranche les litiges entre locataires et propriétaires. Il fixe aussi les critères de fixation et de révision des loyers.",
    termesLies: ["bail", "logement"],
  },
  {
    slug: "taux-directeur",
    terme: "Taux directeur",
    lettre: "T",
    definition:
      "Taux d\u2019intérêt cible fixé par la Banque du Canada qui influence l\u2019ensemble des taux d\u2019intérêt au pays. Une hausse du taux directeur entraîne généralement une hausse des taux variables et, à terme, des taux fixes.",
    termesLies: ["taux-fixe-variable", "hypotheque", "renouvellement-hypothecaire"],
  },
  {
    slug: "taux-fixe-variable",
    terme: "Taux fixe / variable",
    lettre: "T",
    definition:
      "Un taux fixe reste identique pendant toute la durée du terme hypothécaire, offrant des paiements prévisibles. Un taux variable fluctue selon le taux préférentiel de la banque, lié au taux directeur. Le taux variable offre souvent un taux de départ plus bas, mais comporte un risque de hausse.",
    lienCalculateur: "/calculatrice-hypothecaire",
    termesLies: ["taux-directeur", "terme-hypothecaire", "hypotheque"],
  },
  {
    slug: "tds",
    terme: "TDS (ratio du service de la dette totale)",
    lettre: "T",
    definition:
      "Pourcentage du revenu brut consacré à l\u2019ensemble des obligations financières : frais de logement (GDS) plus toutes les autres dettes (auto, prêt étudiant, cartes de crédit, etc.). Le TDS ne doit généralement pas dépasser 44 % pour être admissible à un prêt hypothécaire.",
    lienCalculateur: "/capacite-emprunt",
    termesLies: ["gds", "capacite-d-emprunt", "stress-test"],
  },
  {
    slug: "terme-hypothecaire",
    terme: "Terme hypothécaire",
    lettre: "T",
    definition:
      "Durée du contrat hypothécaire pendant laquelle les conditions (taux, type de prêt) sont fixées. Les termes les plus courants au Canada sont de 1 à 5 ans. À l\u2019expiration du terme, l\u2019hypothèque est renouvelée pour un nouveau terme jusqu\u2019au remboursement complet.",
    termesLies: ["renouvellement-hypothecaire", "amortissement", "taux-fixe-variable"],
  },
  {
    slug: "triplex",
    terme: "Triplex",
    lettre: "T",
    definition:
      "Immeuble résidentiel comprenant trois logements. Comme le duplex, il permet au propriétaire d\u2019habiter un logement et de louer les deux autres pour réduire significativement ses frais d\u2019habitation.",
    lienCalculateur: "/calculateur-plex",
    termesLies: ["plex", "duplex", "quadruplex"],
  },

  // ── U ──
  {
    slug: "unifamiliale",
    terme: "Unifamiliale",
    lettre: "U",
    definition:
      "Propriété résidentielle conçue pour une seule famille, non attenante à d\u2019autres habitations (aussi appelée maison détachée). Elle offre un terrain privé et une indépendance complète, mais implique généralement des coûts d\u2019entretien plus élevés qu\u2019un condo.",
    termesLies: ["copropriete-divise-indivise", "superficie-habitable", "evaluation-municipale"],
  },
  {
    slug: "usufruit",
    terme: "Usufruit",
    lettre: "U",
    definition:
      "Droit réel qui permet à une personne (l\u2019usufruitier) d\u2019utiliser un bien et d\u2019en percevoir les revenus (loyers, fruits) sans en être propriétaire. Le nu-propriétaire conserve la propriété, mais ne peut jouir du bien tant que dure l\u2019usufruit. Souvent utilisé en planification successorale.",
    termesLies: ["registre-foncier", "servitude"],
  },

  // ── V ──
  {
    slug: "valeur-marchande",
    terme: "Valeur marchande",
    lettre: "V",
    definition:
      "Prix le plus probable auquel une propriété se vendrait sur le marché libre entre un acheteur et un vendeur consentants et bien informés. Elle est déterminée par l\u2019analyse de ventes comparables récentes dans le secteur.",
    lienCalculateur: "/estimation",
    termesLies: ["evaluation-municipale", "evaluateur-agree", "facteur-comparatif"],
  },
  {
    slug: "vice-cache",
    terme: "Vice caché",
    lettre: "V",
    definition:
      "Défaut grave d\u2019un immeuble qui existait avant la vente, qui n\u2019était pas apparent lors de l\u2019inspection et que le vendeur n\u2019a pas déclaré. Le vendeur est responsable des vices cachés même s\u2019il les ignorait. L\u2019acheteur dispose de 3 ans après la découverte pour exercer un recours.",
    termesLies: ["inspection-preachat", "acte-de-vente", "notaire"],
  },
  {
    slug: "viager",
    terme: "Viager",
    lettre: "V",
    definition:
      "Mode de vente immobilière où l\u2019acheteur verse un bouquet (montant initial) puis une rente périodique au vendeur jusqu\u2019au décès de ce dernier. Plus rare au Québec qu\u2019en France, cette formule comporte un aléa lié à la durée de vie du vendeur.",
    termesLies: ["acte-de-vente", "valeur-marchande", "usufruit"],
  },
];

export const glossaireBySlug = Object.fromEntries(
  glossaire.map((g) => [g.slug, g])
);

export const glossaireByLettre = glossaire.reduce(
  (acc, g) => {
    (acc[g.lettre] ??= []).push(g);
    return acc;
  },
  {} as Record<string, GlossaireEntry[]>
);
