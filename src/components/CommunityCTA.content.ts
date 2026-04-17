import type { Locale } from "@/lib/i18n";

type ContextMsg = { titre: string; description: string };
type Stat = { label: string; icon: string };

export type CTAContent = {
  contexts: Record<string, ContextMsg>;
  stats: Stat[];
  askQuestion: string;
  createAccount: string;
  signupNote: string;
};

const fr: CTAContent = {
  contexts: {
    hypotheque: {
      titre: "Vous avez des questions sur votre hypotheque?",
      description: "Des milliers de Quebecois partagent leur experience sur nid.local. Taux negocies, choix de preteur, renouvellement. Posez votre question et obtenez des reponses de vrais proprietaires.",
    },
    plex: {
      titre: "Vous analysez un plex? Demandez l'avis de la communaute!",
      description: "Investisseurs, proprietaires de duplex et triplex echangent chaque jour sur nid.local. Partagez vos chiffres, demandez un avis sur un MRB ou trouvez des astuces pour maximiser votre rendement.",
    },
    achat: {
      titre: "Acheter ou louer? La communaute a des opinions!",
      description: "Premiers acheteurs, locataires et proprietaires partagent leur experience sur nid.local. Posez votre question et decouvrez ce que d'autres dans votre situation ont decide.",
    },
    estimation: {
      titre: "Besoin d'un deuxieme avis sur la valeur de votre propriete?",
      description: "Courtiers, evaluateurs et proprietaires experimentes sont actifs sur nid.local. Partagez votre estimation et obtenez des commentaires de gens qui connaissent votre quartier.",
    },
    donnees: {
      titre: "Vous analysez le marche? Discutez-en avec la communaute!",
      description: "Tendances, predictions, quartiers en hausse : les membres de nid.local suivent le marche de pres. Posez vos questions et echangez avec des passionnes d'immobilier quebecois.",
    },
    quartiers: {
      titre: "Vous hesitez entre des quartiers? Demandez aux residents!",
      description: "Rien ne vaut l'avis de quelqu'un qui habite le quartier. Sur nid.local, des residents partagent leur quotidien (bruit, transport, ecoles, ambiance). Posez votre question!",
    },
    taxe: {
      titre: "Des questions sur les frais d'achat? La communaute peut vous aider!",
      description: "Taxe de bienvenue, frais de notaire, inspection : les premiers acheteurs partagent leurs surprises et conseils sur nid.local. Evitez les mauvaises surprises grace a l'entraide.",
    },
    general: {
      titre: "Rejoignez la communaute immobiliere du Quebec",
      description: "Acheteurs, vendeurs, locataires et investisseurs s'entraident chaque jour sur nid.local. Posez vos questions, partagez votre experience et aidez d'autres Quebecois dans leur projet immobilier.",
    },
  },
  stats: [
    { label: "Gratuit", icon: "M5 13l4 4L19 7" },
    { label: "100% quebecois", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { label: "Entraide anonyme", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
  ],
  askQuestion: "Poser ma question",
  createAccount: "Creer mon compte gratuit",
  signupNote: "Inscription en 30 secondes, aucune carte de credit requise",
};

const en: CTAContent = {
  contexts: {
    hypotheque: {
      titre: "Have questions about your mortgage?",
      description: "Thousands of Quebecers share their experience on nid.local. Negotiated rates, lender choices, renewal. Ask your question and get answers from real homeowners.",
    },
    plex: {
      titre: "Analyzing a plex? Ask the community!",
      description: "Investors, duplex and triplex owners exchange daily on nid.local. Share your numbers, ask for a GRM opinion or find tips to maximize your returns.",
    },
    achat: {
      titre: "Buy or rent? The community has opinions!",
      description: "First-time buyers, tenants and homeowners share their experience on nid.local. Ask your question and discover what others in your situation decided.",
    },
    estimation: {
      titre: "Need a second opinion on your property value?",
      description: "Brokers, appraisers and experienced homeowners are active on nid.local. Share your estimate and get feedback from people who know your neighborhood.",
    },
    donnees: {
      titre: "Analyzing the market? Discuss it with the community!",
      description: "Trends, predictions, rising neighborhoods: nid.local members follow the market closely. Ask your questions and exchange with Quebec real estate enthusiasts.",
    },
    quartiers: {
      titre: "Torn between neighborhoods? Ask the residents!",
      description: "Nothing beats the opinion of someone who lives there. On nid.local, residents share their daily life (noise, transit, schools, vibe). Ask your question!",
    },
    taxe: {
      titre: "Questions about buying costs? The community can help!",
      description: "Welcome tax, notary fees, inspection: first-time buyers share their surprises and tips on nid.local. Avoid bad surprises through mutual help.",
    },
    general: {
      titre: "Join Quebec's real estate community",
      description: "Buyers, sellers, tenants and investors help each other daily on nid.local. Ask your questions, share your experience and help other Quebecers with their real estate projects.",
    },
  },
  stats: [
    { label: "Free", icon: "M5 13l4 4L19 7" },
    { label: "100% Quebec", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { label: "Anonymous help", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
  ],
  askQuestion: "Ask my question",
  createAccount: "Create my free account",
  signupNote: "Sign up in 30 seconds, no credit card required",
};

export const ctaContent: Record<Locale, CTAContent> = { fr, en };
