import type { Locale } from "@/lib/i18n";

type FraisItem = {
  lettre: string;
  titre: string;
  montant: string;
  description: string;
  lien?: { href: string; label: string };
  couleur: string;
  textColor: string;
};

type ExempleRow = { poste: string; montantBas: string; montantHaut: string };

type FAQ = { q: string; r: string };

type CalcLink = {
  titre: string;
  description: string;
  href: string;
  icon: string;
};

export type FraisContent = {
  breadcrumb: string;
  h1: string;
  intro: string;
  allFeesTitle: string;
  fraisAchat: FraisItem[];
  fraisDisclaimer: string;
  exempleTitle: string;
  exempleIntro: string;
  tableHeaderPoste: string;
  tableHeaderBas: string;
  tableHeaderHaut: string;
  exempleCalcul: ExempleRow[];
  totalLabel: string;
  totalBas: string;
  totalHaut: string;
  conseil: string;
  calcLinksTitle: string;
  calcLinks: CalcLink[];
  faqTitle: string;
  faqs: FAQ[];
  ctaTitre: string;
  seeDiscussions: string;
  popularDiscussions: string;
  allDiscussions: string;
  usefulResources: string;
  aboutPage: string;
  aboutText1: string;
  aboutText2: string;
  copyright: string;
};

const fr: FraisContent = {
  breadcrumb: "Frais d'achat",
  h1: "Frais d'achat d'une maison au Quebec -- Liste complete 2026",
  intro: "Acheter une maison, c'est plus que le prix affiche. Voici tous les frais a prevoir pour eviter les mauvaises surprises.",
  allFeesTitle: "Tous les frais a prevoir lors de l'achat",
  fraisAchat: [
    {
      lettre: "a",
      titre: "Notaire",
      montant: "1 500 $ a 2 500 $",
      description: "Examen des titres de propriete, publication de l'acte de vente au Registre foncier et radiation de l'ancienne hypotheque si applicable.",
      couleur: "var(--blue-bg)",
      textColor: "var(--blue-text)",
    },
    {
      lettre: "b",
      titre: "Inspection preachat",
      montant: "500 $ a 800 $",
      description: "Recommandee meme si non obligatoire. Couvre la structure, la toiture, la plomberie et l'electricite. Un investissement qui peut vous eviter des milliers de dollars en reparations.",
      couleur: "var(--green-light-bg)",
      textColor: "var(--green-text)",
    },
    {
      lettre: "c",
      titre: "Taxe de bienvenue (droits de mutation)",
      montant: "Variable",
      description: "Calculee par tranches progressives sur le plus eleve entre le prix d'achat et l'evaluation municipale.",
      lien: { href: "/taxe-bienvenue", label: "Calculer la taxe de bienvenue \u2192" },
      couleur: "var(--amber-bg)",
      textColor: "var(--amber-text)",
    },
    {
      lettre: "d",
      titre: "Assurance habitation",
      montant: "800 $ a 2 000 $/an",
      description: "Obligatoire si vous avez une hypotheque. Couvre les dommages a la propriete, le vol et la responsabilite civile. Magasinez plusieurs assureurs pour obtenir le meilleur taux.",
      couleur: "var(--blue-bg)",
      textColor: "var(--blue-text)",
    },
    {
      lettre: "e",
      titre: "Assurance titre",
      montant: "250 $ a 400 $ (une fois)",
      description: "Protege contre les vices de titre caches, les empietements non declares et les erreurs dans les registres fonciers. Prime unique payee a l'achat.",
      couleur: "var(--green-light-bg)",
      textColor: "var(--green-text)",
    },
    {
      lettre: "f",
      titre: "Certificat de localisation",
      montant: "1 500 $ a 2 000 $",
      description: "Souvent paye par le vendeur, mais a verifier dans la promesse d'achat. Necessaire si le certificat existant a plus de 10 ans ou si des travaux ont ete effectues.",
      couleur: "var(--amber-bg)",
      textColor: "var(--amber-text)",
    },
    {
      lettre: "g",
      titre: "Demenagement",
      montant: "500 $ a 3 000 $",
      description: "Varie selon la distance, le volume de biens et la periode de l'annee. Les demenagements en juillet coutent generalement plus cher.",
      couleur: "var(--blue-bg)",
      textColor: "var(--blue-text)",
    },
    {
      lettre: "h",
      titre: "Ajustements de taxes",
      montant: "Variable",
      description: "Taxes municipales et scolaires proratees a la date de prise de possession. Votre notaire calcule la repartition entre vendeur et acheteur.",
      couleur: "var(--green-light-bg)",
      textColor: "var(--green-text)",
    },
    {
      lettre: "i",
      titre: "Raccordements et changements d'adresse",
      montant: "100 $ a 300 $",
      description: "Transfert des services : Hydro-Quebec, internet, assurances, SAAQ, Regie de l'assurance maladie, institutions financieres.",
      couleur: "var(--amber-bg)",
      textColor: "var(--amber-text)",
    },
    {
      lettre: "j",
      titre: "Reserve pour imprevus",
      montant: "1 % a 3 % du prix d'achat",
      description: "Reparations urgentes, ajustements post-achat, achats de materiel. Un coussin financier essentiel pour les premiers mois dans votre nouvelle propriete.",
      couleur: "var(--red-bg)",
      textColor: "var(--red-text)",
    },
  ],
  fraisDisclaimer: "Les montants sont des estimations pour 2026 et peuvent varier selon la region, le type de propriete et les professionnels choisis.",
  exempleTitle: "Exemple concret -- Maison a 450 000 $",
  exempleIntro: "Voici une estimation realiste des frais pour l'achat d'une maison unifamiliale a 450 000 $ au Quebec.",
  tableHeaderPoste: "Poste de depense",
  tableHeaderBas: "Estimation basse",
  tableHeaderHaut: "Estimation haute",
  exempleCalcul: [
    { poste: "Notaire", montantBas: "1 800 $", montantHaut: "2 200 $" },
    { poste: "Inspection preachat", montantBas: "600 $", montantHaut: "750 $" },
    { poste: "Taxe de bienvenue", montantBas: "4 500 $", montantHaut: "4 500 $" },
    { poste: "Assurance habitation (1re annee)", montantBas: "1 200 $", montantHaut: "1 800 $" },
    { poste: "Assurance titre", montantBas: "300 $", montantHaut: "400 $" },
    { poste: "Certificat de localisation", montantBas: "0 $ (vendeur)", montantHaut: "1 800 $" },
    { poste: "Demenagement", montantBas: "800 $", montantHaut: "2 000 $" },
    { poste: "Ajustements de taxes", montantBas: "1 500 $", montantHaut: "3 000 $" },
    { poste: "Raccordements", montantBas: "100 $", montantHaut: "250 $" },
    { poste: "Reserve imprevus (2 %)", montantBas: "4 500 $", montantHaut: "9 000 $" },
  ],
  totalLabel: "Total estime",
  totalBas: "~15 300 $",
  totalHaut: "~25 700 $",
  conseil: "Conseil : Prevoyez au minimum 3 % a 5 % du prix d'achat en liquidites disponibles en plus de votre mise de fonds pour couvrir tous ces frais.",
  calcLinksTitle: "Liens vers nos calculatrices",
  calcLinks: [
    {
      titre: "Taxe de bienvenue",
      description: "Calculez les droits de mutation pour votre achat",
      href: "/taxe-bienvenue",
      icon: "M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z",
    },
    {
      titre: "Calculatrice hypothecaire",
      description: "Estimez vos paiements mensuels et le cout total",
      href: "/calculatrice-hypothecaire",
      icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    },
    {
      titre: "Capacite d'emprunt",
      description: "Calculez votre budget maximal d'achat",
      href: "/capacite-emprunt",
      icon: "M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3",
    },
  ],
  faqTitle: "Questions frequentes sur les frais d'achat",
  faqs: [
    {
      q: "Combien coute un notaire pour l'achat d'une maison au Quebec?",
      r: "Les frais de notaire pour un achat immobilier au Quebec varient generalement entre 1 500 $ et 2 500 $. Ce montant couvre l'examen des titres de propriete, la publication de l'acte de vente au Registre foncier et, si applicable, la radiation de l'ancienne hypotheque. Les honoraires peuvent varier selon la complexite de la transaction.",
    },
    {
      q: "L'inspection preachat est-elle obligatoire au Quebec?",
      r: "L'inspection preachat n'est pas legalement obligatoire au Quebec, mais elle est fortement recommandee. Elle coute entre 500 $ et 800 $ et permet de detecter des problemes de structure, toiture, plomberie ou electricite avant de finaliser l'achat. Sans inspection, l'acheteur assume tous les risques de vices caches.",
    },
    {
      q: "Quel pourcentage du prix d'achat prevoir en frais supplementaires?",
      r: "En regle generale, il faut prevoir entre 3 % et 5 % du prix d'achat en frais supplementaires. Pour une maison a 450 000 $, cela represente environ 17 000 $ a 25 000 $ en frais de notaire, inspection, taxe de bienvenue, assurances, demenagement et ajustements de taxes.",
    },
    {
      q: "Qui paie le certificat de localisation lors d'un achat?",
      r: "Au Quebec, c'est generalement le vendeur qui fournit le certificat de localisation a jour. Cependant, cette obligation doit etre precisee dans la promesse d'achat. Si le certificat a plus de 10 ans ou si des travaux ont ete effectues, un nouveau certificat (1 500 $ a 2 000 $) sera necessaire.",
    },
    {
      q: "Peut-on inclure les frais d'achat dans l'hypotheque?",
      r: "Non, les frais d'achat (notaire, taxe de bienvenue, inspection, etc.) ne peuvent generalement pas etre finances par l'hypotheque au Quebec. Ces montants doivent etre payes comptant au moment de la transaction ou dans les semaines suivant l'achat. Il est donc essentiel de les prevoir dans son budget.",
    },
  ],
  ctaTitre: "Des questions sur les frais d'achat? La communaute peut vous aider!",
  seeDiscussions: "Voir les discussions",
  popularDiscussions: "Discussions populaires",
  allDiscussions: "Toutes les discussions",
  usefulResources: "Ressources utiles",
  aboutPage: "A propos de cette page",
  aboutText1: "Les montants indiques sont des estimations pour le marche quebecois en 2026. Les frais reels peuvent varier selon votre region, le type de propriete et les professionnels choisis.",
  aboutText2: "Pour des montants precis, consultez votre notaire et votre courtier hypothecaire.",
  copyright: "\u00a9 2026 nid.local -- Fait au Quebec",
};

const en: FraisContent = {
  breadcrumb: "Buying costs",
  h1: "Home buying costs in Quebec -- Complete list 2026",
  intro: "Buying a home is more than the listing price. Here are all the costs to plan for to avoid unpleasant surprises.",
  allFeesTitle: "All costs to plan for when buying",
  fraisAchat: [
    {
      lettre: "a",
      titre: "Notary",
      montant: "$1,500 to $2,500",
      description: "Review of property titles, registration of the deed of sale at the Land Registry and cancellation of the previous mortgage if applicable.",
      couleur: "var(--blue-bg)",
      textColor: "var(--blue-text)",
    },
    {
      lettre: "b",
      titre: "Pre-purchase inspection",
      montant: "$500 to $800",
      description: "Recommended even if not mandatory. Covers structure, roof, plumbing and electrical. An investment that can save you thousands of dollars in repairs.",
      couleur: "var(--green-light-bg)",
      textColor: "var(--green-text)",
    },
    {
      lettre: "c",
      titre: "Welcome tax (transfer duties)",
      montant: "Variable",
      description: "Calculated in progressive brackets on the higher of the purchase price and the municipal assessment.",
      lien: { href: "/taxe-bienvenue", label: "Calculate the welcome tax \u2192" },
      couleur: "var(--amber-bg)",
      textColor: "var(--amber-text)",
    },
    {
      lettre: "d",
      titre: "Home insurance",
      montant: "$800 to $2,000/yr",
      description: "Required if you have a mortgage. Covers property damage, theft and civil liability. Shop around for the best rate.",
      couleur: "var(--blue-bg)",
      textColor: "var(--blue-text)",
    },
    {
      lettre: "e",
      titre: "Title insurance",
      montant: "$250 to $400 (one-time)",
      description: "Protects against hidden title defects, undeclared encroachments and errors in the land registry. One-time premium paid at closing.",
      couleur: "var(--green-light-bg)",
      textColor: "var(--green-text)",
    },
    {
      lettre: "f",
      titre: "Certificate of location",
      montant: "$1,500 to $2,000",
      description: "Often paid by the seller, but check the offer to purchase. Required if the existing certificate is over 10 years old or if renovations have been done.",
      couleur: "var(--amber-bg)",
      textColor: "var(--amber-text)",
    },
    {
      lettre: "g",
      titre: "Moving",
      montant: "$500 to $3,000",
      description: "Varies by distance, volume of belongings and time of year. July moves are generally more expensive.",
      couleur: "var(--blue-bg)",
      textColor: "var(--blue-text)",
    },
    {
      lettre: "h",
      titre: "Tax adjustments",
      montant: "Variable",
      description: "Municipal and school taxes prorated to the possession date. Your notary calculates the split between seller and buyer.",
      couleur: "var(--green-light-bg)",
      textColor: "var(--green-text)",
    },
    {
      lettre: "i",
      titre: "Utility connections and address changes",
      montant: "$100 to $300",
      description: "Transfer of services: Hydro-Quebec, internet, insurance, SAAQ, health insurance board, financial institutions.",
      couleur: "var(--amber-bg)",
      textColor: "var(--amber-text)",
    },
    {
      lettre: "j",
      titre: "Contingency reserve",
      montant: "1% to 3% of the purchase price",
      description: "Urgent repairs, post-purchase adjustments, equipment purchases. An essential financial cushion for the first months in your new property.",
      couleur: "var(--red-bg)",
      textColor: "var(--red-text)",
    },
  ],
  fraisDisclaimer: "Amounts are estimates for 2026 and may vary by region, property type and professionals chosen.",
  exempleTitle: "Concrete example -- Home at $450,000",
  exempleIntro: "Here is a realistic estimate of the costs for buying a single-family home at $450,000 in Quebec.",
  tableHeaderPoste: "Expense item",
  tableHeaderBas: "Low estimate",
  tableHeaderHaut: "High estimate",
  exempleCalcul: [
    { poste: "Notary", montantBas: "$1,800", montantHaut: "$2,200" },
    { poste: "Pre-purchase inspection", montantBas: "$600", montantHaut: "$750" },
    { poste: "Welcome tax", montantBas: "$4,500", montantHaut: "$4,500" },
    { poste: "Home insurance (1st year)", montantBas: "$1,200", montantHaut: "$1,800" },
    { poste: "Title insurance", montantBas: "$300", montantHaut: "$400" },
    { poste: "Certificate of location", montantBas: "$0 (seller)", montantHaut: "$1,800" },
    { poste: "Moving", montantBas: "$800", montantHaut: "$2,000" },
    { poste: "Tax adjustments", montantBas: "$1,500", montantHaut: "$3,000" },
    { poste: "Connections", montantBas: "$100", montantHaut: "$250" },
    { poste: "Contingency reserve (2%)", montantBas: "$4,500", montantHaut: "$9,000" },
  ],
  totalLabel: "Estimated total",
  totalBas: "~$15,300",
  totalHaut: "~$25,700",
  conseil: "Tip: Plan for at least 3% to 5% of the purchase price in available cash on top of your down payment to cover all these costs.",
  calcLinksTitle: "Links to our calculators",
  calcLinks: [
    {
      titre: "Welcome tax",
      description: "Calculate the transfer duties for your purchase",
      href: "/taxe-bienvenue",
      icon: "M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z",
    },
    {
      titre: "Mortgage calculator",
      description: "Estimate your monthly payments and total cost",
      href: "/calculatrice-hypothecaire",
      icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    },
    {
      titre: "Borrowing capacity",
      description: "Calculate your maximum purchase budget",
      href: "/capacite-emprunt",
      icon: "M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3",
    },
  ],
  faqTitle: "Frequently asked questions about buying costs",
  faqs: [
    {
      q: "How much does a notary cost when buying a home in Quebec?",
      r: "Notary fees for a real estate purchase in Quebec generally range from $1,500 to $2,500. This amount covers the review of property titles, registration of the deed of sale at the Land Registry and, if applicable, cancellation of the previous mortgage. Fees may vary depending on the complexity of the transaction.",
    },
    {
      q: "Is a pre-purchase inspection mandatory in Quebec?",
      r: "A pre-purchase inspection is not legally required in Quebec, but it is strongly recommended. It costs between $500 and $800 and can detect structural, roof, plumbing or electrical problems before finalizing the purchase. Without an inspection, the buyer assumes all risks of hidden defects.",
    },
    {
      q: "What percentage of the purchase price should I budget for additional costs?",
      r: "As a general rule, plan for 3% to 5% of the purchase price in additional costs. For a home at $450,000, this represents approximately $17,000 to $25,000 in notary fees, inspection, welcome tax, insurance, moving and tax adjustments.",
    },
    {
      q: "Who pays for the certificate of location when buying?",
      r: "In Quebec, it is generally the seller who provides an up-to-date certificate of location. However, this obligation must be specified in the offer to purchase. If the certificate is over 10 years old or if renovations have been done, a new certificate ($1,500 to $2,000) will be needed.",
    },
    {
      q: "Can buying costs be included in the mortgage?",
      r: "No, buying costs (notary, welcome tax, inspection, etc.) generally cannot be financed through the mortgage in Quebec. These amounts must be paid in cash at the time of the transaction or in the weeks following the purchase. It is therefore essential to budget for them.",
    },
  ],
  ctaTitre: "Questions about buying costs? The community can help!",
  seeDiscussions: "View discussions",
  popularDiscussions: "Popular discussions",
  allDiscussions: "All discussions",
  usefulResources: "Useful resources",
  aboutPage: "About this page",
  aboutText1: "The amounts shown are estimates for the Quebec market in 2026. Actual costs may vary depending on your region, property type and professionals chosen.",
  aboutText2: "For exact amounts, consult your notary and your mortgage broker.",
  copyright: "\u00a9 2026 nid.local -- Made in Quebec",
};

export const calcContent: Record<Locale, FraisContent> = { fr, en };
