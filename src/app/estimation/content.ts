import type { Locale } from "@/lib/i18n";

type Step = { n: string; titre: string; texte: string };
type Factor = { titre: string; texte: string; couleur: string; textColor: string };
type FAQ = { q: string; r: string };
type Tool = { href: string; label: string; desc: string };

export type CalcContent = {
  breadcrumb: string;
  h1: string;
  intro: string;
  howItWorks: string;
  steps: Step[];
  factorsTitle: string;
  factors: Factor[];
  faqTitle: string;
  faqs: FAQ[];
  relatedTitle: string;
  relatedTools: Tool[];
  seeDiscussions: string;
  popularDiscussions: string;
  allDiscussions: string;
  usefulResources: string;
  aboutTool: string;
  aboutText1: string;
  aboutText2Pre: string;
  aboutText2Evaluateur: string;
  aboutText2Mid: string;
  aboutText2Courtier: string;
  aboutText2Post: string;
  copyright: string;
};

const fr: CalcContent = {
  breadcrumb: "Estimation de valeur",
  h1: "Combien vaut ma maison? | Estimation gratuite",
  intro: "Obtenez une estimation gratuite de la valeur marchande de votre maison, condo ou plex au Quebec. Notre outil compare l'evaluation municipale vs le prix du marche reel pour vous donner un portrait juste. Selectionnez votre quartier, le type de propriete et ses caracteristiques pour une estimation personnalisee.",
  howItWorks: "Comment fonctionne l'estimation",
  steps: [
    { n: "1", titre: "Selectionnez votre quartier", texte: "Choisissez la ville et le quartier de votre propriete. Les donnees de marche specifiques a votre secteur sont utilisees comme base." },
    { n: "2", titre: "Decrivez votre propriete", texte: "Entrez le type, la superficie, le nombre de chambres et de salles de bain, l'annee de construction et l'etat general." },
    { n: "3", titre: "Obtenez votre estimation", texte: "L'outil calcule la valeur estimee avec une ventilation des ajustements appliques et une fourchette de prix." },
  ],
  factorsTitle: "Facteurs d'ajustement",
  factors: [
    { titre: "Superficie", texte: "La superficie est comparee a la moyenne pour le type de propriete (unifamiliale ~1 200 pi\u00B2, condo ~800 pi\u00B2, plex ~2 400 pi\u00B2). L'ajustement est proportionnel a l'ecart.", couleur: "var(--blue-bg)", textColor: "var(--blue-text)" },
    { titre: "Chambres et salles de bain", texte: "Chaque chambre supplementaire au-dela de 2 ajoute 3% a la valeur de base. Chaque salle de bain supplementaire au-dela de 1 ajoute 2%.", couleur: "var(--green-light-bg)", textColor: "var(--green-text)" },
    { titre: "Annee de construction", texte: "Les constructions recentes (moins de 5 ans) beneficient d'une prime de 5%. Les proprietes de plus de 60 ans subissent un rabais de 6%.", couleur: "var(--amber-bg)", textColor: "var(--amber-text)" },
    { titre: "Etat general", texte: "Excellent : +5%, Bon : aucun ajustement, Moyen : -5%, A renover : -15%. L'etat reflete la condition generale de la propriete.", couleur: "var(--red-bg)", textColor: "var(--red-text)" },
  ],
  faqTitle: "Questions frequentes",
  faqs: [
    { q: "Comment est calculee la valeur estimee?", r: "L'estimation part du prix median du marche pour votre quartier et type de propriete, puis applique des ajustements bases sur la superficie, le nombre de chambres et de salles de bain, l'annee de construction et l'etat general. La fourchette affichee represente +/- 10% de la valeur estimee." },
    { q: "Est-ce que cette estimation remplace une evaluation professionnelle?", r: "Non. Cette estimation est fournie a titre indicatif seulement. Pour une transaction immobiliere, une evaluation par un evaluateur agree ou une analyse comparative de marche par un courtier immobilier est fortement recommandee." },
    { q: "D'ou proviennent les donnees de marche?", r: "Les prix medians utilises sont bases sur les donnees du marche immobilier quebecois disponibles dans notre section Donnees de marche. Ils couvrent plus de 50 quartiers a travers les principales villes du Quebec." },
    { q: "Mon quartier n'apparait pas dans la liste. Que faire?", r: "Si votre quartier n'est pas disponible, selectionnez la ville la plus proche. L'outil utilisera les donnees moyennes disponibles pour cette ville. Pour une estimation plus precise, consultez un courtier immobilier local." },
  ],
  relatedTitle: "Outils connexes",
  relatedTools: [
    { href: "/donnees-marche", label: "Donnees de marche", desc: "Prix medians et tendances par ville et quartier au Quebec." },
    { href: "/comparer-quartiers", label: "Comparer les quartiers", desc: "Comparez les prix, tendances et profil de deux quartiers." },
    { href: "/calculatrice-hypothecaire", label: "Calculatrice hypothecaire", desc: "Estimez votre paiement mensuel selon les taux du marche." },
  ],
  seeDiscussions: "Voir les discussions",
  popularDiscussions: "Discussions populaires",
  allDiscussions: "Toutes les discussions",
  usefulResources: "Ressources utiles",
  aboutTool: "A propos de l'outil",
  aboutText1: "L'estimation utilise les prix medians du marche par quartier et applique des ajustements bases sur les caracteristiques de votre propriete.",
  aboutText2Pre: "Pour une evaluation officielle, consultez un ",
  aboutText2Evaluateur: "evaluateur agree",
  aboutText2Mid: " ou un ",
  aboutText2Courtier: "courtier immobilier",
  aboutText2Post: ".",
  copyright: "\u00A9 2026 nid.local | Fait au Quebec",
};

const en: CalcContent = {
  breadcrumb: "Property Valuation",
  h1: "How much is my home worth? | Free estimate",
  intro: "Get a free estimate of the market value of your house, condo, or plex in Quebec. Our tool compares the municipal assessment vs the actual market price to give you an accurate picture. Select your neighbourhood, the property type, and its features for a personalized estimate.",
  howItWorks: "How the estimate works",
  steps: [
    { n: "1", titre: "Select your neighbourhood", texte: "Choose the city and neighbourhood of your property. Market data specific to your area is used as the baseline." },
    { n: "2", titre: "Describe your property", texte: "Enter the type, square footage, number of bedrooms and bathrooms, year of construction, and overall condition." },
    { n: "3", titre: "Get your estimate", texte: "The tool calculates the estimated value with a breakdown of applied adjustments and a price range." },
  ],
  factorsTitle: "Adjustment factors",
  factors: [
    { titre: "Square footage", texte: "Square footage is compared to the average for the property type (single-family ~1,200 sq ft, condo ~800 sq ft, plex ~2,400 sq ft). The adjustment is proportional to the difference.", couleur: "var(--blue-bg)", textColor: "var(--blue-text)" },
    { titre: "Bedrooms and bathrooms", texte: "Each additional bedroom beyond 2 adds 3% to the base value. Each additional bathroom beyond 1 adds 2%.", couleur: "var(--green-light-bg)", textColor: "var(--green-text)" },
    { titre: "Year of construction", texte: "Recent builds (less than 5 years) receive a 5% premium. Properties over 60 years old receive a 6% discount.", couleur: "var(--amber-bg)", textColor: "var(--amber-text)" },
    { titre: "Overall condition", texte: "Excellent: +5%, Good: no adjustment, Average: -5%, Needs renovation: -15%. The condition reflects the overall state of the property.", couleur: "var(--red-bg)", textColor: "var(--red-text)" },
  ],
  faqTitle: "Frequently asked questions",
  faqs: [
    { q: "How is the estimated value calculated?", r: "The estimate starts from the median market price for your neighbourhood and property type, then applies adjustments based on square footage, number of bedrooms and bathrooms, year of construction, and overall condition. The displayed range represents +/- 10% of the estimated value." },
    { q: "Does this estimate replace a professional appraisal?", r: "No. This estimate is provided for informational purposes only. For a real estate transaction, an appraisal by a certified appraiser or a comparative market analysis by a real estate broker is strongly recommended." },
    { q: "Where does the market data come from?", r: "The median prices used are based on Quebec real estate market data available in our Market Data section. They cover over 50 neighbourhoods across major Quebec cities." },
    { q: "My neighbourhood doesn't appear in the list. What should I do?", r: "If your neighbourhood is not available, select the nearest city. The tool will use the average data available for that city. For a more accurate estimate, consult a local real estate broker." },
  ],
  relatedTitle: "Related tools",
  relatedTools: [
    { href: "/donnees-marche", label: "Market data", desc: "Median prices and trends by city and neighbourhood in Quebec." },
    { href: "/comparer-quartiers", label: "Compare neighbourhoods", desc: "Compare prices, trends, and profiles of two neighbourhoods." },
    { href: "/calculatrice-hypothecaire", label: "Mortgage calculator", desc: "Estimate your monthly payment based on market rates." },
  ],
  seeDiscussions: "View discussions",
  popularDiscussions: "Popular discussions",
  allDiscussions: "All discussions",
  usefulResources: "Useful resources",
  aboutTool: "About this tool",
  aboutText1: "The estimate uses median market prices by neighbourhood and applies adjustments based on the characteristics of your property.",
  aboutText2Pre: "For an official appraisal, consult a ",
  aboutText2Evaluateur: "certified appraiser",
  aboutText2Mid: " or a ",
  aboutText2Courtier: "real estate broker",
  aboutText2Post: ".",
  copyright: "\u00A9 2026 nid.local | Made in Quebec",
};

export const calcContent: Record<Locale, CalcContent> = { fr, en };
