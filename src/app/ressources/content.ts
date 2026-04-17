import type { Locale } from "@/lib/i18n";

type FAQ = { question: string; answer: string };

export type RessourcesContent = {
  breadcrumbHome: string;
  breadcrumbCurrent: string;
  h1: string;
  intro: string;
  faqTitle: string;
  faqs: FAQ[];
};

const fr: RessourcesContent = {
  breadcrumbHome: "nid.local",
  breadcrumbCurrent: "Outils et ressources",
  h1: "Outils immobiliers gratuits | Quebec 2026",
  intro:
    "Calculatrices hypothecaires, capacite d'emprunt, rentabilite plex, taxe de bienvenue, estimation de valeur, donnees de marche par quartier, comparateur de quartiers et guide premier achat. Tous les outils sont gratuits, instantanes et fonctionnent sur mobile comme sur ordinateur.",
  faqTitle: "Questions frequentes",
  faqs: [
    {
      question: "Quels outils immobiliers gratuits sont offerts sur nid.local?",
      answer:
        "nid.local propose plus d'une dizaine d'outils entierement gratuits : une calculatrice hypothecaire pour estimer vos paiements mensuels, un calculateur de capacite d'emprunt (ratios GDS/TDS), un calculateur plex pour analyser la rentabilite d'un immeuble a revenus, un calculateur de taxe de bienvenue, un comparateur acheter ou louer, un estimateur de valeur, des donnees de marche par quartier, un comparateur de quartiers cote a cote, un repertoire de professionnels et un guide complet pour le premier achat.",
    },
    {
      question: "Comment fonctionne la calculatrice hypothecaire de nid.local?",
      answer:
        "Entrez le prix d'achat, votre mise de fonds et le taux d'interet. La calculatrice calcule instantanement votre paiement mensuel, les interets totaux sur la duree de l'amortissement et la prime SCHL si votre mise de fonds est inferieure a 20 %. Elle supporte les scenarios unifamilial, condo et plex jusqu'a 5 logements.",
    },
    {
      question: "Les donnees de marche sont-elles a jour?",
      answer:
        "Oui. Les prix medians et les tendances couvrent plus de 80 quartiers au Quebec, avec des donnees historiques de 2020 a 2026. Les graphiques montrent l'evolution des prix pour chaque quartier afin de vous aider a identifier les meilleures opportunites.",
    },
    {
      question: "Puis-je utiliser ces outils sur mon telephone?",
      answer:
        "Absolument. Tous les outils sont optimises pour mobile et fonctionnent meme hors connexion grace au service worker. Vous pouvez aussi installer nid.local comme application sur votre ecran d'accueil pour un acces rapide.",
    },
  ],
};

const en: RessourcesContent = {
  breadcrumbHome: "nid.local",
  breadcrumbCurrent: "Tools and resources",
  h1: "Free real estate tools | Quebec 2026",
  intro:
    "Mortgage calculators, borrowing capacity, plex profitability, welcome tax, property value estimation, neighbourhood market data, neighbourhood comparison and first-time buyer guide. All tools are free, instant and work on both mobile and desktop.",
  faqTitle: "Frequently asked questions",
  faqs: [
    {
      question: "What free real estate tools are available on nid.local?",
      answer:
        "nid.local offers over a dozen completely free tools: a mortgage calculator to estimate your monthly payments, a borrowing capacity calculator (GDS/TDS ratios), a plex calculator to analyze income property profitability, a welcome tax calculator, a buy-or-rent comparator, a property value estimator, neighbourhood market data, a side-by-side neighbourhood comparator, a professional directory, and a comprehensive first-time buyer guide.",
    },
    {
      question: "How does the nid.local mortgage calculator work?",
      answer:
        "Enter the purchase price, your down payment and the interest rate. The calculator instantly computes your monthly payment, total interest over the amortization period and the CMHC premium if your down payment is less than 20%. It supports single-family, condo and plex scenarios up to 5 units.",
    },
    {
      question: "Is the market data up to date?",
      answer:
        "Yes. Median prices and trends cover more than 80 neighbourhoods in Quebec, with historical data from 2020 to 2026. Charts show price trends for each neighbourhood to help you identify the best opportunities.",
    },
    {
      question: "Can I use these tools on my phone?",
      answer:
        "Absolutely. All tools are optimized for mobile and work even offline thanks to the service worker. You can also install nid.local as an app on your home screen for quick access.",
    },
  ],
};

export const pageContent: Record<Locale, RessourcesContent> = { fr, en };
