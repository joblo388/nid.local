import type { Locale } from "@/lib/i18n";

type Step = { n: string; titre: string; texte: string };
type Rule = { titre: string; texte: string; couleur: string; textColor: string };
type FAQ = { q: string; r: string };
type Tool = { href: string; label: string; desc: string };

export type CalcContent = {
  breadcrumb: string;
  h1: string;
  intro: string;
  howItWorks: string;
  steps: Step[];
  ratesTitle: string;
  rules: Rule[];
  ratesDisclaimer: string;
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
  aboutText2: string;
  copyright: string;
  voteSingular: string;
  votePlural: string;
};

const fr: CalcContent = {
  breadcrumb: "Taxe de bienvenue",
  h1: "Calculateur de taxe de bienvenue Quebec",
  intro: "Calculez les droits de mutation immobiliere pour votre achat au Quebec. Taux par tranche, surcharge Montreal et exemptions pour premiers acheteurs inclus.",
  howItWorks: "Comment fonctionne la taxe de bienvenue?",
  steps: [
    { n: "1", titre: "Base de calcul", texte: "La taxe est calculee sur le montant le plus eleve entre le prix d'achat et la valeur au role d'evaluation municipale multipliee par le facteur comparatif." },
    { n: "2", titre: "Taux par tranche", texte: "Les taux sont progressifs : 0,5% sur les premiers 58 900 $, puis 1,0% et 1,5% sur les tranches suivantes. Montreal applique des taux plus eleves au-dela de 500 000 $." },
    { n: "3", titre: "Paiement unique", texte: "La taxe est payable une seule fois dans les 90 jours suivant la reception du compte. Elle ne peut pas etre ajoutee a votre hypotheque." },
  ],
  ratesTitle: "Baremes des droits de mutation au Quebec 2026",
  rules: [
    { titre: "Taux de base (toutes les villes)", texte: "0,5% sur les premiers 58 900 $, 1,0% de 58 900 $ a 294 600 $, 1,5% au-dela de 294 600 $.", couleur: "var(--blue-bg)", textColor: "var(--blue-text)" },
    { titre: "Taux Montreal (au-dela de 500 000 $)", texte: "2,0% de 500 000 $ a 1 000 000 $, 2,5% au-dela de 1 000 000 $. Ces taux remplacent le 1,5% de base.", couleur: "var(--amber-bg)", textColor: "var(--amber-text)" },
    { titre: "Taxe supplementaire de Montreal", texte: "En plus des droits de base, Montreal preleve une surtaxe : 0,5% de 500 000 $ a 1 000 000 $, 1,0% de 1 M$ a 2 M$, 1,5% au-dela de 2 M$.", couleur: "var(--red-bg)", textColor: "var(--red-text)" },
    { titre: "Exemptions possibles", texte: "Certaines municipalites offrent un remboursement de la taxe pour les premiers acheteurs. Le transfert entre conjoints et certains liens de parente directs peuvent aussi etre exemptes.", couleur: "var(--green-light-bg)", textColor: "var(--green-text)" },
  ],
  ratesDisclaimer: "Ces baremes sont a titre informatif. Consultez votre notaire pour les montants exacts applicables a votre transaction.",
  faqTitle: "Questions frequentes sur la taxe de bienvenue",
  faqs: [
    { q: "Qu'est-ce que la taxe de bienvenue au Quebec?", r: "La taxe de bienvenue, officiellement appelee droits de mutation immobiliere, est un impot preleve par les municipalites lors du transfert de propriete d'un immeuble. Elle est calculee sur la base de la plus elevee entre le prix d'achat et la valeur inscrite au role d'evaluation municipale. Cette taxe est payable une seule fois, lors de l'achat." },
    { q: "Comment est calculee la taxe de bienvenue?", r: "La taxe est calculee par tranches progressives : 0,5% sur les premiers 58 900 $, 1,0% de 58 900 $ a 294 600 $, et 1,5% sur le montant excedant 294 600 $. A Montreal, des taux plus eleves s'appliquent au-dela de 500 000 $, avec une taxe supplementaire de 0,5% a 1,5% selon le prix." },
    { q: "Y a-t-il des exemptions pour les premiers acheteurs?", r: "Certaines municipalites offrent un remboursement partiel ou total de la taxe de bienvenue pour les premiers acheteurs. Ces programmes varient d'une ville a l'autre. De plus, les transferts entre conjoints et certains liens de parente directs peuvent etre exemptes de la taxe." },
    { q: "Quand doit-on payer la taxe de bienvenue?", r: "La taxe doit etre payee dans les 90 jours suivant la reception du compte envoye par la municipalite, apres l'enregistrement de l'acte de vente. Le montant ne peut pas etre finance dans l'hypotheque, il doit etre paye separement. En cas de retard, des interets de penalite s'appliquent." },
  ],
  relatedTitle: "Outils connexes",
  relatedTools: [
    { href: "/frais-achat", label: "Frais d'achat", desc: "Liste complete des frais a prevoir lors de l'achat d'une propriete." },
    { href: "/calculatrice-hypothecaire", label: "Calculatrice hypothecaire", desc: "Estimez votre paiement mensuel et la prime SCHL." },
    { href: "/premier-acheteur", label: "Guide premier acheteur", desc: "CELIAPP, RAP et aide financiere pour votre premier achat." },
  ],
  seeDiscussions: "Voir les discussions",
  popularDiscussions: "Discussions populaires",
  allDiscussions: "Toutes les discussions",
  usefulResources: "Ressources utiles",
  aboutTool: "A propos de l'outil",
  aboutText1: "Les calculs sont bases sur les baremes de droits de mutation immobiliere du Quebec en vigueur en 2026. La taxe supplementaire de Montreal est incluse automatiquement.",
  aboutText2: "Pour le montant exact, consultez votre notaire.",
  copyright: "\u00a9 2026 nid.local | Fait au Quebec",
  voteSingular: "vote",
  votePlural: "votes",
};

const en: CalcContent = {
  breadcrumb: "Welcome tax",
  h1: "Quebec Welcome Tax Calculator",
  intro: "Calculate the real estate transfer duties for your purchase in Quebec. Bracket rates, Montreal surcharge, and first-time buyer exemptions included.",
  howItWorks: "How does the welcome tax work?",
  steps: [
    { n: "1", titre: "Calculation basis", texte: "The tax is calculated on the higher of the purchase price and the municipal assessment roll value multiplied by the comparative factor." },
    { n: "2", titre: "Bracket rates", texte: "Rates are progressive: 0.5% on the first $58,900, then 1.0% and 1.5% on the following brackets. Montreal applies higher rates above $500,000." },
    { n: "3", titre: "One-time payment", texte: "The tax is payable once within 90 days of receiving the bill. It cannot be added to your mortgage." },
  ],
  ratesTitle: "Quebec transfer duty rates 2026",
  rules: [
    { titre: "Base rates (all municipalities)", texte: "0.5% on the first $58,900, 1.0% from $58,900 to $294,600, 1.5% above $294,600.", couleur: "var(--blue-bg)", textColor: "var(--blue-text)" },
    { titre: "Montreal rates (above $500,000)", texte: "2.0% from $500,000 to $1,000,000, 2.5% above $1,000,000. These rates replace the 1.5% base rate.", couleur: "var(--amber-bg)", textColor: "var(--amber-text)" },
    { titre: "Montreal supplementary tax", texte: "In addition to the base duties, Montreal levies a surtax: 0.5% from $500,000 to $1,000,000, 1.0% from $1M to $2M, 1.5% above $2M.", couleur: "var(--red-bg)", textColor: "var(--red-text)" },
    { titre: "Possible exemptions", texte: "Some municipalities offer a tax refund for first-time buyers. Transfers between spouses and certain direct family members may also be exempt.", couleur: "var(--green-light-bg)", textColor: "var(--green-text)" },
  ],
  ratesDisclaimer: "These rates are for informational purposes only. Consult your notary for the exact amounts applicable to your transaction.",
  faqTitle: "Frequently asked questions about the welcome tax",
  faqs: [
    { q: "What is the welcome tax in Quebec?", r: "The welcome tax, officially called real estate transfer duties, is a tax levied by municipalities upon the transfer of property ownership. It is calculated on the higher of the purchase price and the value on the municipal assessment roll. This tax is payable once, at the time of purchase." },
    { q: "How is the welcome tax calculated?", r: "The tax is calculated in progressive brackets: 0.5% on the first $58,900, 1.0% from $58,900 to $294,600, and 1.5% on the amount exceeding $294,600. In Montreal, higher rates apply above $500,000, with an additional tax of 0.5% to 1.5% depending on the price." },
    { q: "Are there exemptions for first-time buyers?", r: "Some municipalities offer a partial or full refund of the welcome tax for first-time buyers. These programs vary from city to city. Additionally, transfers between spouses and certain direct family members may be exempt from the tax." },
    { q: "When must the welcome tax be paid?", r: "The tax must be paid within 90 days of receiving the bill sent by the municipality, after the deed of sale is registered. The amount cannot be financed through your mortgage and must be paid separately. Late payments incur penalty interest." },
  ],
  relatedTitle: "Related tools",
  relatedTools: [
    { href: "/frais-achat", label: "Purchase costs", desc: "Complete list of costs to expect when buying a property." },
    { href: "/calculatrice-hypothecaire", label: "Mortgage calculator", desc: "Estimate your monthly payment and CMHC premium." },
    { href: "/premier-acheteur", label: "First-time buyer guide", desc: "FHSA, HBP and financial assistance for your first purchase." },
  ],
  seeDiscussions: "View discussions",
  popularDiscussions: "Popular discussions",
  allDiscussions: "All discussions",
  usefulResources: "Useful resources",
  aboutTool: "About this tool",
  aboutText1: "Calculations are based on Quebec real estate transfer duty rates in effect in 2026. The Montreal supplementary tax is included automatically.",
  aboutText2: "For the exact amount, consult your notary.",
  copyright: "\u00a9 2026 nid.local | Made in Quebec",
  voteSingular: "vote",
  votePlural: "votes",
};

export const calcContent: Record<Locale, CalcContent> = { fr, en };
