import type { Locale } from "@/lib/i18n";

type Step = { n: string; titre: string; texte: string };
type Indicator = { titre: string; texte: string; couleur: string; textColor: string };
type FAQ = { q: string; r: string };
type Tool = { href: string; label: string; desc: string };

export type PlexCalcContent = {
  breadcrumb: string;
  h1: string;
  intro: string;
  howToUse: string;
  steps: Step[];
  indicatorsTitle: string;
  indicators: Indicator[];
  faqTitle: string;
  faqs: FAQ[];
  relatedTitle: string;
  relatedTools: Tool[];
  seeListings: string;
  popularDiscussions: string;
  usefulResources: string;
  aboutTool: string;
  aboutText1: string;
  aboutText2Plain: string;
  aboutText2Bold: string;
  footer: string;
};

const fr: PlexCalcContent = {
  breadcrumb: "Calculateur plex",
  h1: "Calculateur de rendement plex",
  intro: "Estimez le MRB, cashflow mensuel, rendement sur mise de fonds et prise de valeur sur 5 ans pour un duplex, triplex ou quadruplex au Quebec.",
  howToUse: "Comment utiliser ce calculateur",
  steps: [
    { n: "1", titre: "Entrez le prix et la mise de fonds", texte: "Le taux hypothecaire et l'amortissement determinent votre paiement mensuel selon les regles canadiennes (composition semestrielle)." },
    { n: "2", titre: "Ajoutez les revenus locatifs", texte: "Entrez le loyer de chaque unite. Les unites 3 et 4 sont optionnelles pour les duplex." },
    { n: "3", titre: "Analysez le rendement", texte: "Le MRB, le cashflow mensuel, le rendement sur mise de fonds et la projection sur 5 ans sont calcules instantanement." },
  ],
  indicatorsTitle: "Comprendre les indicateurs",
  indicators: [
    { titre: "MRB (Multiplicateur de Revenus Bruts)", texte: "Le MRB = Prix / Revenus annuels bruts. Un MRB sous 12x est excellent, entre 12-15x acceptable, au-dessus de 18x le rendement est limite. C'est le premier indicateur regarde par les investisseurs.", couleur: "var(--green-light-bg)", textColor: "var(--green-text)" },
    { titre: "Cashflow", texte: "Le cashflow = Revenus locatifs - Hypotheque - Depenses. Un cashflow positif signifie que la propriete s'autofinance. Un cashflow negatif veut dire que vous devrez injecter de l'argent chaque mois.", couleur: "var(--blue-bg)", textColor: "var(--blue-text)" },
    { titre: "Rendement sur mise de fonds", texte: "Le cashflow annuel divise par la mise de fonds initiale. Permet de comparer le rendement avec d'autres investissements. Un rendement de 8-12% est considere bon pour l'immobilier.", couleur: "var(--amber-bg)", textColor: "var(--amber-text)" },
    { titre: "Projection sur 5 ans", texte: "Basee sur une appreciation annuelle de 3% (moyenne historique au Quebec) et des loyers stables. Le retour total combine le gain en valeur et le cashflow cumule.", couleur: "var(--bg-secondary)", textColor: "var(--text-secondary)" },
  ],
  faqTitle: "Questions frequentes sur l'investissement plex",
  faqs: [
    { q: "Qu'est-ce que le MRB en immobilier?", r: "Le MRB (Multiplicateur de Revenus Bruts) est le ratio entre le prix d'achat et les revenus locatifs annuels bruts. Un MRB sous 12x est excellent au Quebec, entre 12-15x acceptable, au-dessus de 18x le rendement est limite." },
    { q: "Comment calculer le cashflow d'un plex?", r: "Cashflow = Revenus locatifs - Hypotheque - Depenses (taxes, assurances, entretien). Un cashflow positif signifie que la propriete s'autofinance." },
    { q: "Quel rendement viser pour un plex au Quebec?", r: "Un rendement sur mise de fonds de 8-12% est considere bon. Ce rendement ne tient pas compte de la prise de valeur, qui ajoute historiquement environ 3% par an au Quebec." },
    { q: "Quelle mise de fonds pour un plex?", r: "Duplex occupant : 5% minimum. Triplex/quadruplex occupant : 10%. Non-occupant : 20%. 5+ logements : financement commercial, generalement 25%." },
    { q: "L'appreciation de 3% est-elle realiste?", r: "3% correspond a la moyenne historique au Quebec sur 20 ans. Certains quartiers de Montreal (Rosemont, Villeray) ont connu des appreciations superieures a 5% par an recemment." },
  ],
  relatedTitle: "Outils connexes",
  relatedTools: [
    { href: "/calculatrice-hypothecaire", label: "Calculatrice hypothecaire", desc: "Calculez votre paiement mensuel et la prime SCHL." },
    { href: "/donnees-marche", label: "Donnees de marche", desc: "Prix medians et tendances par ville et quartier au Quebec." },
    { href: "/estimation", label: "Estimation de valeur", desc: "Estimez la valeur marchande d'une propriete dans votre quartier." },
  ],
  seeListings: "Voir les annonces",
  popularDiscussions: "Discussions populaires",
  usefulResources: "Ressources utiles",
  aboutTool: "A propos de l'outil",
  aboutText1: "Les calculs utilisent la composition semestrielle canadienne. L'appreciation est estimee a 3% par an (moyenne historique quebecoise).",
  aboutText2Plain: "Pour une analyse personnalisee, consultez un ",
  aboutText2Bold: "courtier immobilier",
  footer: "\u00A9 2026 nid.local | Fait au Quebec",
};

const en: PlexCalcContent = {
  breadcrumb: "Plex Calculator",
  h1: "Plex Return Calculator",
  intro: "Estimate the GRM, monthly cash flow, return on down payment, and 5-year appreciation for a duplex, triplex, or quadruplex in Quebec.",
  howToUse: "How to use this calculator",
  steps: [
    { n: "1", titre: "Enter the price and down payment", texte: "The mortgage rate and amortization determine your monthly payment according to Canadian rules (semi-annual compounding)." },
    { n: "2", titre: "Add the rental income", texte: "Enter the rent for each unit. Units 3 and 4 are optional for duplexes." },
    { n: "3", titre: "Analyze the return", texte: "The GRM, monthly cash flow, return on down payment, and 5-year projection are calculated instantly." },
  ],
  indicatorsTitle: "Understanding the indicators",
  indicators: [
    { titre: "GRM (Gross Rent Multiplier)", texte: "GRM = Price / Gross annual income. A GRM under 12x is excellent, 12-15x is acceptable, above 18x the return is limited. It is the first indicator investors look at.", couleur: "var(--green-light-bg)", textColor: "var(--green-text)" },
    { titre: "Cash flow", texte: "Cash flow = Rental income - Mortgage - Expenses. Positive cash flow means the property pays for itself. Negative cash flow means you will need to inject money every month.", couleur: "var(--blue-bg)", textColor: "var(--blue-text)" },
    { titre: "Return on down payment", texte: "Annual cash flow divided by the initial down payment. Allows comparison with other investments. A return of 8-12% is considered good for real estate.", couleur: "var(--amber-bg)", textColor: "var(--amber-text)" },
    { titre: "5-year projection", texte: "Based on 3% annual appreciation (Quebec historical average) and stable rents. Total return combines the value gain and cumulative cash flow.", couleur: "var(--bg-secondary)", textColor: "var(--text-secondary)" },
  ],
  faqTitle: "Frequently asked questions about plex investing",
  faqs: [
    { q: "What is the GRM in real estate?", r: "The GRM (Gross Rent Multiplier) is the ratio between the purchase price and gross annual rental income. A GRM under 12x is excellent in Quebec, 12-15x is acceptable, above 18x the return is limited." },
    { q: "How do you calculate cash flow for a plex?", r: "Cash flow = Rental income - Mortgage - Expenses (taxes, insurance, maintenance). Positive cash flow means the property pays for itself." },
    { q: "What return should you target for a plex in Quebec?", r: "A return on down payment of 8-12% is considered good. This does not include appreciation, which historically adds about 3% per year in Quebec." },
    { q: "What is the down payment for a plex?", r: "Owner-occupied duplex: 5% minimum. Owner-occupied triplex/quadruplex: 10%. Non-owner: 20%. 5+ units: commercial financing, generally 25%." },
    { q: "Is 3% appreciation realistic?", r: "3% matches the historical average in Quebec over 20 years. Some Montreal neighbourhoods (Rosemont, Villeray) have seen appreciation above 5% per year recently." },
  ],
  relatedTitle: "Related tools",
  relatedTools: [
    { href: "/calculatrice-hypothecaire", label: "Mortgage calculator", desc: "Calculate your monthly payment and CMHC premium." },
    { href: "/donnees-marche", label: "Market data", desc: "Median prices and trends by city and neighbourhood in Quebec." },
    { href: "/estimation", label: "Value estimate", desc: "Estimate the market value of a property in your neighbourhood." },
  ],
  seeListings: "View listings",
  popularDiscussions: "Popular discussions",
  usefulResources: "Useful resources",
  aboutTool: "About this tool",
  aboutText1: "Calculations use Canadian semi-annual compounding. Appreciation is estimated at 3% per year (Quebec historical average).",
  aboutText2Plain: "For a personalized analysis, consult a ",
  aboutText2Bold: "real estate broker",
  footer: "\u00A9 2026 nid.local | Made in Quebec",
};

export const calcContent: Record<Locale, PlexCalcContent> = { fr, en };
