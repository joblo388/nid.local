import type { Locale } from "@/lib/i18n";

type FAQ = { q: string; r: string };
type Tool = { href: string; label: string; desc: string };

export type DonneesContent = {
  breadcrumb: string;
  h1: string;
  intro: string;
  disclaimer: string;
  byCity: string;
  byCityDesc: string;
  faqTitle: string;
  faqs: FAQ[];
  relatedTitle: string;
  relatedTools: Tool[];
  seeListings: string;
  popularDiscussions: string;
  usefulResources: string;
};

const fr: DonneesContent = {
  breadcrumb: "Donnees de marche",
  h1: "Donnees de marche | Quebec 2026",
  intro: "Prix medians, delais de vente et tendances par ville et arrondissement. Sources : APCIQ, Centris, Royal LePage.",
  disclaimer: "Ces donnees sont issues de sources publiques pour 2025-2026 et sont presentees a titre indicatif. Les prix varient selon le secteur precis, l'etat de la propriete et les conditions du marche. Mise a jour : mars 2026.",
  byCity: "Donnees de marche par ville",
  byCityDesc: "Consultez les donnees detaillees pour chaque ville du Quebec.",
  faqTitle: "Questions frequentes",
  faqs: [
    { q: "Quel est le prix median d'une maison au Quebec en 2026?", r: "Le prix median provincial est de 485 000 $, en hausse de 7% par rapport a 2025. Une unifamiliale mediane coute 536 000 $ et un condo 404 000 $." },
    { q: "Quels quartiers de Montreal augmentent le plus?", r: "Hochelaga-Maisonneuve (+9,2%), Montreal-Nord (+8,9%), Griffintown/St-Henri (+8,5%) et Verdun (+7,8%) connaissent les plus fortes hausses." },
    { q: "Est-ce un marche acheteur ou vendeur?", r: "Le ratio ventes/inscriptions de 42% indique un marche equilibre dans l'ensemble. Les banlieues sont en marche vendeur, le centre-ville en marche acheteur." },
    { q: "Combien de temps faut-il pour vendre une maison?", r: "Le delai moyen varie de 30 jours (Limoilou, Quebec) a 85 jours (Iles-de-la-Madeleine). A Montreal, la moyenne est de 50-55 jours." },
  ],
  relatedTitle: "Outils connexes",
  relatedTools: [
    { href: "/estimation", label: "Estimation de valeur", desc: "Estimez la valeur marchande d'une propriete dans votre quartier." },
    { href: "/comparer-quartiers", label: "Comparer les quartiers", desc: "Comparez les prix, tendances et profil de deux quartiers." },
    { href: "/calculateur-plex", label: "Calculateur plex", desc: "MRB, cashflow et rendement pour un duplex, triplex ou quadruplex." },
  ],
  seeListings: "Voir les annonces",
  popularDiscussions: "Discussions populaires",
  usefulResources: "Ressources utiles",
};

const en: DonneesContent = {
  breadcrumb: "Market Data",
  h1: "Market Data | Quebec 2026",
  intro: "Median prices, selling times and trends by city and borough. Sources: APCIQ, Centris, Royal LePage.",
  disclaimer: "This data comes from public sources for 2025-2026 and is provided for informational purposes. Prices vary by area, property condition and market conditions. Last update: March 2026.",
  byCity: "Market data by city",
  byCityDesc: "View detailed data for each city in Quebec.",
  faqTitle: "Frequently asked questions",
  faqs: [
    { q: "What is the median home price in Quebec in 2026?", r: "The provincial median is $485,000, up 7% from 2025. A median single-family home costs $536,000 and a condo $404,000." },
    { q: "Which Montreal neighborhoods are rising the most?", r: "Hochelaga-Maisonneuve (+9.2%), Montreal-Nord (+8.9%), Griffintown/St-Henri (+8.5%) and Verdun (+7.8%) are seeing the largest increases." },
    { q: "Is it a buyer's or seller's market?", r: "The 42% sales-to-listings ratio indicates a balanced market overall. Suburbs are in a seller's market, downtown in a buyer's market." },
    { q: "How long does it take to sell a home?", r: "Average time varies from 30 days (Limoilou, Quebec City) to 85 days (Iles-de-la-Madeleine). In Montreal, the average is 50-55 days." },
  ],
  relatedTitle: "Related tools",
  relatedTools: [
    { href: "/estimation", label: "Property estimate", desc: "Estimate the market value of a property in your neighborhood." },
    { href: "/comparer-quartiers", label: "Compare neighborhoods", desc: "Compare prices, trends and profiles of two neighborhoods." },
    { href: "/calculateur-plex", label: "Plex calculator", desc: "GRM, cashflow and returns for a duplex, triplex or quadruplex." },
  ],
  seeListings: "View listings",
  popularDiscussions: "Popular discussions",
  usefulResources: "Useful resources",
};

export const donneesContent: Record<Locale, DonneesContent> = { fr, en };
