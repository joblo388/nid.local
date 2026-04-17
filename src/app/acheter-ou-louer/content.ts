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
  factorsTitle: string;
  factors: Rule[];
  faqTitle: string;
  faqs: FAQ[];
  relatedTitle: string;
  relatedTools: Tool[];
  seeListings: string;
  popularDiscussions: string;
  usefulResources: string;
  aboutLabel: string;
  aboutText1: string;
  aboutText2: string;
  copyright: string;
};

const fr: CalcContent = {
  breadcrumb: "Acheter ou louer?",
  h1: "Acheter ou louer au Quebec?",
  intro: "Comparez le cout reel d'acheter versus louer sur votre horizon de temps. Hypotheque, taxes, appreciation, cout d'opportunite et epargne du locataire. Tous les facteurs sont pris en compte.",
  howItWorks: "Comment fonctionne le comparateur",
  steps: [
    { n: "1", titre: "Entrez vos chiffres", texte: "Prix d'achat, mise de fonds, loyer actuel et depenses. Les valeurs par defaut refletent le marche montrealais de 2026." },
    { n: "2", titre: "Ajustez l'horizon", texte: "Utilisez le curseur pour voir comment le resultat change selon la duree. Acheter est souvent plus avantageux apres 5-7 ans." },
    { n: "3", titre: "Analysez le verdict", texte: "Le comparateur tient compte de tous les couts caches : interets, taxes, cout d'opportunite, epargne du locataire et appreciation." },
  ],
  factorsTitle: "Les facteurs cles de la decision",
  factors: [
    { titre: "Appreciation immobiliere", texte: "Au Quebec, l'immobilier s'apprecie en moyenne de 3% par an. C'est le facteur qui fait pencher la balance vers l'achat a long terme. Certains quartiers de Montreal ont connu des hausses superieures a 5%.", couleur: "var(--green-light-bg)", textColor: "var(--green-text)" },
    { titre: "Cout d'opportunite", texte: "Votre mise de fonds placee en bourse ou en obligations genererait un rendement. Ce cout cache de l'achat est souvent neglige mais peut representer des milliers de dollars par an.", couleur: "var(--blue-bg)", textColor: "var(--blue-text)" },
    { titre: "Hausse des loyers", texte: "Au Quebec, les hausses sont encadrees par le TAL mais atteignent 3-5% par an en 2026. Sur 10 ans, un loyer de 2 200 $ peut devenir 2 960 $ avec 3% de hausse annuelle.", couleur: "var(--amber-bg)", textColor: "var(--amber-text)" },
    { titre: "Horizon de temps", texte: "Les frais d'achat (notaire, taxe de bienvenue, demenagement) sont absorbes sur la duree. Si vous prevoyez rester moins de 3-4 ans, louer est presque toujours plus avantageux.", couleur: "var(--bg-secondary)", textColor: "var(--text-secondary)" },
  ],
  faqTitle: "Questions frequentes",
  faqs: [
    { q: "Vaut-il mieux acheter ou louer au Quebec en 2026?", r: "Ca depend de votre horizon. Acheter devient generalement plus avantageux apres 5-7 ans grace a l'appreciation. Utilisez le curseur d'horizon pour trouver votre point d'equilibre." },
    { q: "Qu'est-ce que le cout d'opportunite de la mise de fonds?", r: "C'est le rendement que vous auriez eu en placant votre mise de fonds ailleurs. 100 000 $ a 4% = 4 000 $/an manques. Ce cout est integre dans l'analyse d'achat." },
    { q: "Comment l'epargne du locataire est-elle calculee?", r: "Si l'achat coute plus cher mensuellement, le locataire place la difference au taux de rendement indique. Cette epargne accumulee est deduite du cout de la location." },
    { q: "Pourquoi le resultat change-t-il autant selon l'horizon?", r: "A court terme, les frais fixes de l'achat (interets eleves, taxes) dominent. A long terme, l'appreciation immobiliere et le remboursement du capital font pencher la balance vers l'achat." },
    { q: "Les frais de notaire et taxe de bienvenue sont-ils inclus?", r: "Non, ces frais ponctuels ne sont pas inclus dans ce comparateur. Ajoutez environ 2-3% du prix d'achat pour avoir une vue complete (notaire ~1 500 $, taxe de bienvenue variable selon la municipalite)." },
  ],
  relatedTitle: "Outils connexes",
  relatedTools: [
    { href: "/calculatrice-hypothecaire", label: "Calculatrice hypothecaire", desc: "Estimez votre paiement mensuel selon les taux du marche." },
    { href: "/capacite-emprunt", label: "Capacite d'emprunt", desc: "Decouvrez combien vous pouvez emprunter selon vos revenus." },
    { href: "/donnees-marche", label: "Donnees de marche", desc: "Prix medians et tendances par ville et quartier au Quebec." },
  ],
  seeListings: "Voir les annonces",
  popularDiscussions: "Discussions populaires",
  usefulResources: "Ressources utiles",
  aboutLabel: "A propos",
  aboutText1: "Ce comparateur tient compte des interets (composition semestrielle canadienne), taxes, entretien, appreciation, cout d'opportunite et epargne du locataire.",
  aboutText2: "Pour une analyse personnalisee, consultez un planificateur financier.",
  copyright: "\u00A9 2026 nid.local | Fait au Quebec",
};

const en: CalcContent = {
  breadcrumb: "Buy or rent?",
  h1: "Buy or rent in Quebec?",
  intro: "Compare the real cost of buying versus renting over your time horizon. Mortgage, taxes, appreciation, opportunity cost and renter savings. All factors are taken into account.",
  howItWorks: "How the comparator works",
  steps: [
    { n: "1", titre: "Enter your numbers", texte: "Purchase price, down payment, current rent and expenses. Default values reflect the 2026 Montreal market." },
    { n: "2", titre: "Adjust the horizon", texte: "Use the slider to see how the result changes over time. Buying is often more advantageous after 5-7 years." },
    { n: "3", titre: "Analyze the verdict", texte: "The comparator accounts for all hidden costs: interest, taxes, opportunity cost, renter savings and appreciation." },
  ],
  factorsTitle: "Key factors in the decision",
  factors: [
    { titre: "Real estate appreciation", texte: "In Quebec, real estate appreciates by an average of 3% per year. This is the factor that tips the balance toward buying long term. Some Montreal neighborhoods have seen increases above 5%.", couleur: "var(--green-light-bg)", textColor: "var(--green-text)" },
    { titre: "Opportunity cost", texte: "Your down payment invested in stocks or bonds would generate a return. This hidden cost of buying is often overlooked but can represent thousands of dollars per year.", couleur: "var(--blue-bg)", textColor: "var(--blue-text)" },
    { titre: "Rent increases", texte: "In Quebec, increases are regulated by the TAL but reach 3-5% per year in 2026. Over 10 years, a rent of $2,200 can become $2,960 with 3% annual increases.", couleur: "var(--amber-bg)", textColor: "var(--amber-text)" },
    { titre: "Time horizon", texte: "Purchase costs (notary, welcome tax, moving) are absorbed over time. If you plan to stay less than 3-4 years, renting is almost always more advantageous.", couleur: "var(--bg-secondary)", textColor: "var(--text-secondary)" },
  ],
  faqTitle: "Frequently asked questions",
  faqs: [
    { q: "Is it better to buy or rent in Quebec in 2026?", r: "It depends on your time horizon. Buying generally becomes more advantageous after 5-7 years thanks to appreciation. Use the horizon slider to find your break-even point." },
    { q: "What is the opportunity cost of the down payment?", r: "It's the return you would have earned by investing your down payment elsewhere. $100,000 at 4% = $4,000/year missed. This cost is integrated into the purchase analysis." },
    { q: "How is the renter's savings calculated?", r: "If buying costs more monthly, the renter invests the difference at the indicated rate of return. This accumulated savings is deducted from the total rental cost." },
    { q: "Why does the result change so much depending on the horizon?", r: "In the short term, fixed buying costs (high interest, taxes) dominate. In the long term, real estate appreciation and principal repayment tip the balance toward buying." },
    { q: "Are notary fees and welcome tax included?", r: "No, these one-time fees are not included in this comparator. Add about 2-3% of the purchase price for a complete picture (notary ~$1,500, welcome tax varies by municipality)." },
  ],
  relatedTitle: "Related tools",
  relatedTools: [
    { href: "/calculatrice-hypothecaire", label: "Mortgage calculator", desc: "Estimate your monthly payment based on market rates." },
    { href: "/capacite-emprunt", label: "Borrowing capacity", desc: "Find out how much you can borrow based on your income." },
    { href: "/donnees-marche", label: "Market data", desc: "Median prices and trends by city and neighborhood in Quebec." },
  ],
  seeListings: "View listings",
  popularDiscussions: "Popular discussions",
  usefulResources: "Useful resources",
  aboutLabel: "About",
  aboutText1: "This comparator accounts for interest (Canadian semi-annual compounding), taxes, maintenance, appreciation, opportunity cost and renter savings.",
  aboutText2: "For a personalized analysis, consult a financial planner.",
  copyright: "\u00A9 2026 nid.local | Made in Quebec",
};

export const calcContent: Record<Locale, CalcContent> = { fr, en };
