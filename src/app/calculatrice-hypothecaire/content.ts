import type { Locale } from "@/lib/i18n";

type Step = { n: string; titre: string; texte: string };
type Rule = { titre: string; texte: string; couleur: string; textColor: string };
type FAQ = { q: string; r: string };
type Tool = { href: string; label: string; desc: string };

export type CalcContent = {
  breadcrumb: string;
  h1: string;
  intro: string;
  howToUse: string;
  steps: Step[];
  rulesTitle: string;
  rules: Rule[];
  rulesDisclaimer: string;
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
};

const fr: CalcContent = {
  breadcrumb: "Calculatrice hypothecaire",
  h1: "Calculatrice hypothecaire Quebec",
  intro: "Estimez votre paiement mensuel selon les taux du marche quebecois. Calculs conformes aux regles canadiennes : composition semestrielle, prime SCHL, mise de fonds minimale et regles plex incluses.",
  howToUse: "Comment utiliser cette calculatrice",
  steps: [
    { n: "1", titre: "Entrez le prix et la mise de fonds", texte: "La calculatrice verifie automatiquement si votre mise de fonds respecte le minimum requis et calcule la prime SCHL si applicable." },
    { n: "2", titre: "Choisissez votre taux", texte: "Utilisez les taux indicatifs du jour ou entrez votre propre taux. Les taux fixes et variable sont affiches pour faciliter la comparaison." },
    { n: "3", titre: "Analysez les resultats", texte: "Le paiement, les interets totaux, le total debourse et la prime SCHL sont calcules en temps reel selon les regles hypothecaires canadiennes." },
  ],
  rulesTitle: "Regles hypothecaires au Canada en 2026",
  rules: [
    { titre: "Mise de fonds minimale", texte: "5% jusqu'a 500 000 $, puis 10% sur la tranche entre 500 000 $ et 999 999 $. 20% minimum pour les proprietes a 1 M$ et plus.", couleur: "var(--blue-bg)", textColor: "var(--blue-text)" },
    { titre: "Prime SCHL", texte: "Obligatoire si la mise de fonds est inferieure a 20% sur les proprietes sous 1,5 M$. Taux de 2,8% a 4% selon le niveau de la mise de fonds.", couleur: "var(--amber-bg)", textColor: "var(--amber-text)" },
    { titre: "Test de resistance (stress test)", texte: "Toutes les hypotheques sont qualifiees au taux le plus eleve entre votre taux + 2% ou 5,25%. Votre paiement ne peut depasser 39% de votre revenu brut.", couleur: "var(--red-bg)", textColor: "var(--red-text)" },
    { titre: "Plex | regles speciales", texte: "Duplex occupant : 5% minimum. Triplex/quadruplex occupant : 10% minimum. Non-occupant : 20% minimum. 5 logements et plus : financement commercial uniquement.", couleur: "var(--green-light-bg)", textColor: "var(--green-text)" },
  ],
  rulesDisclaimer: "Ces regles sont a titre informatif. Consultez un courtier hypothecaire agree pour une analyse personnalisee.",
  faqTitle: "Questions frequentes sur l'hypotheque au Quebec",
  faqs: [
    { q: "Quelle est la mise de fonds minimale au Quebec en 2026?", r: "La mise de fonds minimale est de 5% pour les proprietes jusqu'a 500 000 $. Pour les proprietes entre 500 000 $ et 999 999 $, c'est 5% sur les premiers 500 000 $ et 10% sur le reste. Au-dela de 1 000 000 $, la mise de fonds minimale est de 20%." },
    { q: "Qu'est-ce que la prime SCHL et combien coute-t-elle?", r: "La prime SCHL est une assurance hypothecaire obligatoire si votre mise de fonds est inferieure a 20%. Elle est calculee sur le montant emprunte : 4% pour moins de 10% de mise de fonds, 3,1% pour 10-14,99%, et 2,8% pour 15-19,99%. Elle est ajoutee a votre hypotheque et amortie sur toute la duree." },
    { q: "Quelle difference entre amortissement et terme hypothecaire?", r: "L'amortissement est la duree totale pour rembourser votre hypotheque (generalement 25 ou 30 ans). Le terme est la duree de votre contrat avec le preteur (1, 3, 5 ou 10 ans), apres lequel vous renegociez votre taux. La calculatrice utilise l'amortissement pour calculer vos paiements." },
    { q: "Comment les interets sont-ils calcules au Canada?", r: "Au Canada, contrairement aux Etats-Unis, les interets hypothecaires a taux fixe sont composes semestriellement (deux fois par an). Notre calculatrice applique automatiquement cette regle canadienne, ce qui donne un resultat legerement different d'une composition mensuelle." },
    { q: "Est-ce que je peux acheter un plex avec 5% de mise de fonds?", r: "Oui, pour un duplex que vous occuperez comme residence principale, la mise de fonds minimale est de 5%. Pour un triplex ou quadruplex occupant, c'est 10%. Pour un immeuble non-occupant, la mise de fonds minimum est de 20%. Pour 5 logements et plus, le financement est commercial." },
    { q: "Combien puis-je emprunter pour une hypotheque?", r: "Votre capacite d'emprunt depend de votre revenu brut, de vos dettes existantes et du test de resistance. En regle generale, votre paiement hypothecaire ne doit pas depasser 32-39% de votre revenu brut mensuel. Un courtier hypothecaire peut vous fournir une pre-approbation officielle gratuite." },
  ],
  relatedTitle: "Outils connexes",
  relatedTools: [
    { href: "/capacite-emprunt", label: "Capacite d'emprunt", desc: "Calculez combien vous pouvez emprunter selon vos revenus et dettes." },
    { href: "/taxe-bienvenue", label: "Taxe de bienvenue", desc: "Estimez les droits de mutation pour votre achat au Quebec." },
    { href: "/acheter-ou-louer", label: "Acheter ou louer?", desc: "Comparez le cout reel d'acheter vs louer sur votre horizon." },
  ],
  seeDiscussions: "Voir les discussions",
  popularDiscussions: "Discussions populaires",
  allDiscussions: "Toutes les discussions",
  usefulResources: "Ressources utiles",
  aboutTool: "A propos de l'outil",
  aboutText1: "Les calculs respectent les regles canadiennes : composition semestrielle, regles SCHL et OSFI. Les taux affiches sont indicatifs.",
  aboutText2: "Pour une analyse officielle, consultez un courtier hypothecaire agree.",
};

const en: CalcContent = {
  breadcrumb: "Mortgage Calculator",
  h1: "Quebec Mortgage Calculator",
  intro: "Estimate your monthly payment based on Quebec market rates. Calculations follow Canadian rules: semi-annual compounding, CMHC insurance, minimum down payment, and plex rules included.",
  howToUse: "How to use this calculator",
  steps: [
    { n: "1", titre: "Enter the price and down payment", texte: "The calculator automatically checks if your down payment meets the minimum requirement and calculates the CMHC premium if applicable." },
    { n: "2", titre: "Choose your rate", texte: "Use the indicative rates of the day or enter your own rate. Both fixed and variable rates are displayed for easy comparison." },
    { n: "3", titre: "Analyze the results", texte: "The payment, total interest, total cost and CMHC premium are calculated in real time according to Canadian mortgage rules." },
  ],
  rulesTitle: "Canadian mortgage rules in 2026",
  rules: [
    { titre: "Minimum down payment", texte: "5% up to $500,000, then 10% on the portion between $500,000 and $999,999. 20% minimum for properties at $1M and above.", couleur: "var(--blue-bg)", textColor: "var(--blue-text)" },
    { titre: "CMHC insurance", texte: "Required if down payment is less than 20% on properties under $1.5M. Rate from 2.8% to 4% depending on down payment level.", couleur: "var(--amber-bg)", textColor: "var(--amber-text)" },
    { titre: "Stress test", texte: "All mortgages are qualified at the higher of your rate + 2% or 5.25%. Your payment cannot exceed 39% of your gross income.", couleur: "var(--red-bg)", textColor: "var(--red-text)" },
    { titre: "Plex | special rules", texte: "Owner-occupied duplex: 5% minimum. Owner-occupied triplex/quadruplex: 10% minimum. Non-owner: 20% minimum. 5+ units: commercial financing only.", couleur: "var(--green-light-bg)", textColor: "var(--green-text)" },
  ],
  rulesDisclaimer: "These rules are for informational purposes only. Consult a licensed mortgage broker for a personalized analysis.",
  faqTitle: "Frequently asked questions about mortgages in Quebec",
  faqs: [
    { q: "What is the minimum down payment in Quebec in 2026?", r: "The minimum down payment is 5% for properties up to $500,000. For properties between $500,000 and $999,999, it's 5% on the first $500,000 and 10% on the remainder. Above $1,000,000, the minimum down payment is 20%." },
    { q: "What is CMHC insurance and how much does it cost?", r: "CMHC insurance is mandatory mortgage insurance when your down payment is less than 20%. It is calculated on the borrowed amount: 4% for less than 10% down, 3.1% for 10-14.99%, and 2.8% for 15-19.99%. It is added to your mortgage and amortized over the full term." },
    { q: "What's the difference between amortization and mortgage term?", r: "Amortization is the total time to repay your mortgage (usually 25 or 30 years). The term is the length of your contract with the lender (1, 3, 5, or 10 years), after which you renegotiate your rate. The calculator uses amortization to compute your payments." },
    { q: "How are mortgage interest rates calculated in Canada?", r: "In Canada, unlike the US, fixed-rate mortgage interest is compounded semi-annually (twice a year). Our calculator automatically applies this Canadian rule, which gives a slightly different result than monthly compounding." },
    { q: "Can I buy a plex with 5% down payment?", r: "Yes, for a duplex you will occupy as your primary residence, the minimum down payment is 5%. For an owner-occupied triplex or quadruplex, it's 10%. For a non-owner-occupied building, the minimum is 20%. For 5+ units, commercial financing is required." },
    { q: "How much can I borrow for a mortgage?", r: "Your borrowing capacity depends on your gross income, existing debts, and the stress test. As a rule, your mortgage payment should not exceed 32-39% of your gross monthly income. A mortgage broker can provide a free official pre-approval." },
  ],
  relatedTitle: "Related tools",
  relatedTools: [
    { href: "/capacite-emprunt", label: "Borrowing capacity", desc: "Calculate how much you can borrow based on your income and debts." },
    { href: "/taxe-bienvenue", label: "Welcome tax", desc: "Estimate the transfer duties for your purchase in Quebec." },
    { href: "/acheter-ou-louer", label: "Buy or rent?", desc: "Compare the real cost of buying vs renting over your time horizon." },
  ],
  seeDiscussions: "View discussions",
  popularDiscussions: "Popular discussions",
  allDiscussions: "All discussions",
  usefulResources: "Useful resources",
  aboutTool: "About this tool",
  aboutText1: "Calculations follow Canadian rules: semi-annual compounding, CMHC and OSFI rules. Displayed rates are indicative.",
  aboutText2: "For an official analysis, consult a licensed mortgage broker.",
};

export const calcContent: Record<Locale, CalcContent> = { fr, en };
