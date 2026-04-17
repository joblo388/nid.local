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
  conceptsTitle: string;
  rules: Rule[];
  rulesDisclaimer: string;
  faqTitle: string;
  faqs: FAQ[];
  relatedTitle: string;
  relatedTools: Tool[];
  seeListings: string;
  popularDiscussions: string;
  usefulResources: string;
};

const fr: CalcContent = {
  breadcrumb: "Capacite d'emprunt",
  h1: "Capacite d'emprunt hypothecaire | Quebec 2026",
  intro: "Estimez le prix maximum que vous pouvez vous permettre selon les ratios GDS/TDS utilises par les banques canadiennes. Stress test, revenus locatifs et co-emprunteur inclus. Obtenez une estimation de pre-approbation hypothecaire instantanee.",
  howItWorks: "Comment fonctionne le calcul de capacite d'emprunt",
  steps: [
    { n: "1", titre: "Entrez vos revenus et dettes", texte: "Indiquez votre revenu brut annuel (et celui de votre co-emprunteur si applicable), ainsi que vos dettes mensuelles : pret auto, cartes de credit, prets etudiants." },
    { n: "2", titre: "Ajustez les parametres", texte: "Precisez la mise de fonds disponible, les taxes foncieres estimees, les frais de chauffage et de condo. Le stress test est applique automatiquement selon les regles canadiennes." },
    { n: "3", titre: "Obtenez votre capacite maximale", texte: "Le calculateur affiche le prix maximum que vous pouvez vous permettre selon les ratios GDS et TDS, en tenant compte du test de resistance hypothecaire obligatoire." },
  ],
  conceptsTitle: "Concepts importants pour le calcul de capacite hypothecaire",
  rules: [
    { titre: "Ratio GDS (service de la dette brute)", texte: "Le ratio GDS (ou ABD) mesure la part de votre revenu brut consacree aux frais de logement : paiement hypothecaire, taxes foncieres, chauffage et 50% des frais de condo. Le maximum autorise est generalement de 39%. C'est le premier critere verifie par les preteurs.", couleur: "var(--blue-bg)", textColor: "var(--blue-text)" },
    { titre: "Ratio TDS (service de la dette totale)", texte: "Le ratio TDS (ou ATD) ajoute au GDS toutes vos autres obligations financieres : pret auto, paiements minimums de cartes de credit, prets etudiants et marges de credit. Le maximum autorise est de 44%. Un TDS eleve peut reduire votre capacite d'emprunt meme si votre GDS est acceptable.", couleur: "var(--amber-bg)", textColor: "var(--amber-text)" },
    { titre: "Test de resistance hypothecaire (stress test)", texte: "Obligatoire depuis 2018 pour toutes les hypotheques au Canada (BSIF). Votre capacite est calculee au taux le plus eleve entre votre taux contractuel + 2% ou le taux de reference (5,25%). Ce test simule une hausse de taux pour s'assurer que vous pourrez continuer vos paiements. Il reduit le montant maximum empruntable d'environ 20%.", couleur: "var(--red-bg)", textColor: "var(--red-text)" },
  ],
  rulesDisclaimer: "Ces regles sont a titre informatif. Consultez un courtier hypothecaire agree pour une pre-approbation officielle adaptee a votre situation.",
  faqTitle: "Questions frequentes sur la capacite d'emprunt hypothecaire au Quebec",
  faqs: [
    { q: "Comment le stress test hypothecaire affecte-t-il ma capacite d'emprunt au Canada?", r: "Le test de resistance hypothecaire (stress test) est obligatoire pour toutes les hypotheques au Canada depuis 2018. Votre capacite d'emprunt est calculee au taux le plus eleve entre votre taux contractuel + 2% ou le taux de reference de la Banque du Canada (5,25%). Par exemple, si votre taux negocie est de 4,64%, vous serez qualifie a 6,64%. Ce test reduit le montant maximum que vous pouvez emprunter d'environ 20% par rapport au calcul sans stress test." },
    { q: "Quelle est la difference entre le ratio GDS (ABD) et le ratio TDS (ATD)?", r: "Le ratio GDS (service de la dette brute) mesure la proportion de votre revenu brut consacree aux frais de logement : paiement hypothecaire, taxes foncieres, chauffage et 50% des frais de condo. Il ne doit pas depasser 39%. Le ratio TDS (service de la dette totale) inclut en plus toutes vos autres dettes : pret auto, paiements minimums de cartes de credit, prets etudiants et marges de credit. Il ne doit pas depasser 44%. Les deux ratios doivent etre respectes pour obtenir une hypotheque." },
    { q: "Est-ce qu'un co-emprunteur augmente ma capacite d'emprunt hypothecaire?", r: "Oui, ajouter un co-emprunteur (conjoint, parent, etc.) augmente significativement votre capacite d'emprunt. Les revenus des deux emprunteurs sont combines pour le calcul des ratios GDS et TDS, ce qui peut permettre d'emprunter 50% a 100% de plus selon les revenus du co-emprunteur. Cependant, les dettes du co-emprunteur sont egalement prises en compte dans le calcul du ratio TDS. Les deux emprunteurs sont solidairement responsables de l'hypotheque." },
    { q: "Les revenus locatifs sont-ils pris en compte dans le calcul de la capacite d'emprunt?", r: "Oui, les revenus locatifs peuvent augmenter votre capacite d'emprunt lors de l'achat d'un plex (duplex, triplex, quadruplex). Les institutions financieres canadiennes utilisent generalement un facteur de compensation de 50% a 80% des revenus locatifs bruts prevus, ajoute a votre revenu brut pour le calcul des ratios GDS et TDS. Certains preteurs utilisent la methode du cashflow, d'autres la methode du revenu ajoute." },
    { q: "Combien puis-je emprunter pour une hypotheque au Quebec en 2026?", r: "Votre capacite d'emprunt depend de votre revenu brut, de vos dettes existantes, du taux d'interet et de la periode d'amortissement. En regle generale, avec un revenu brut de 80 000 $ et peu de dettes, vous pouvez emprunter environ 350 000 $ a 400 000 $ avec les taux de 2026. Un couple avec un revenu combine de 150 000 $ peut emprunter environ 650 000 $ a 750 000 $. Notre calculateur vous donne une estimation precise selon votre situation." },
    { q: "Quelle est la difference entre pre-qualification et pre-approbation hypothecaire?", r: "La pre-qualification est une estimation rapide de votre capacite d'emprunt basee sur les informations que vous fournissez, comme le calcul offert par notre outil. La pre-approbation hypothecaire est un engagement conditionnel du preteur apres verification de vos revenus, de votre credit et de vos actifs. La pre-approbation garantit un taux pendant 90 a 120 jours et renforce votre position lors d'une offre d'achat. Elle est gratuite et sans obligation aupres de la plupart des courtiers hypothecaires au Quebec." },
  ],
  relatedTitle: "Outils connexes",
  relatedTools: [
    { href: "/calculatrice-hypothecaire", label: "Calculatrice hypothecaire", desc: "Estimez votre paiement mensuel et la prime SCHL." },
    { href: "/premier-acheteur", label: "Guide premier acheteur", desc: "CELIAPP, RAP et programmes d'aide pour votre premier achat." },
    { href: "/frais-achat", label: "Frais d'achat", desc: "Tous les frais a prevoir : notaire, inspection, taxes et plus." },
  ],
  seeListings: "Voir les annonces",
  popularDiscussions: "Discussions populaires",
  usefulResources: "Ressources utiles",
};

const en: CalcContent = {
  breadcrumb: "Borrowing Capacity",
  h1: "Mortgage Borrowing Capacity | Quebec 2026",
  intro: "Estimate the maximum price you can afford based on the GDS/TDS ratios used by Canadian banks. Stress test, rental income and co-borrower included. Get an instant mortgage pre-approval estimate.",
  howItWorks: "How the borrowing capacity calculation works",
  steps: [
    { n: "1", titre: "Enter your income and debts", texte: "Enter your gross annual income (and your co-borrower's if applicable), as well as your monthly debts: car loan, credit cards, student loans." },
    { n: "2", titre: "Adjust the parameters", texte: "Specify the available down payment, estimated property taxes, heating and condo fees. The stress test is automatically applied according to Canadian rules." },
    { n: "3", titre: "Get your maximum capacity", texte: "The calculator displays the maximum price you can afford based on GDS and TDS ratios, taking into account the mandatory mortgage stress test." },
  ],
  conceptsTitle: "Key concepts for mortgage capacity calculation",
  rules: [
    { titre: "GDS ratio (gross debt service)", texte: "The GDS ratio measures the share of your gross income allocated to housing costs: mortgage payment, property taxes, heating and 50% of condo fees. The maximum allowed is generally 39%. This is the first criterion checked by lenders.", couleur: "var(--blue-bg)", textColor: "var(--blue-text)" },
    { titre: "TDS ratio (total debt service)", texte: "The TDS ratio adds all your other financial obligations to the GDS: car loan, minimum credit card payments, student loans and lines of credit. The maximum allowed is 44%. A high TDS can reduce your borrowing capacity even if your GDS is acceptable.", couleur: "var(--amber-bg)", textColor: "var(--amber-text)" },
    { titre: "Mortgage stress test", texte: "Mandatory since 2018 for all mortgages in Canada (OSFI). Your capacity is calculated at the higher of your contractual rate + 2% or the benchmark rate (5.25%). This test simulates a rate increase to ensure you can continue your payments. It reduces the maximum borrowable amount by approximately 20%.", couleur: "var(--red-bg)", textColor: "var(--red-text)" },
  ],
  rulesDisclaimer: "These rules are for informational purposes only. Consult a licensed mortgage broker for an official pre-approval tailored to your situation.",
  faqTitle: "Frequently asked questions about mortgage borrowing capacity in Quebec",
  faqs: [
    { q: "How does the mortgage stress test affect my borrowing capacity in Canada?", r: "The mortgage stress test has been mandatory for all mortgages in Canada since 2018. Your borrowing capacity is calculated at the higher of your contractual rate + 2% or the Bank of Canada benchmark rate (5.25%). For example, if your negotiated rate is 4.64%, you will be qualified at 6.64%. This test reduces the maximum amount you can borrow by approximately 20% compared to a calculation without the stress test." },
    { q: "What is the difference between the GDS ratio and the TDS ratio?", r: "The GDS (gross debt service) ratio measures the proportion of your gross income allocated to housing costs: mortgage payment, property taxes, heating and 50% of condo fees. It must not exceed 39%. The TDS (total debt service) ratio also includes all your other debts: car loan, minimum credit card payments, student loans and lines of credit. It must not exceed 44%. Both ratios must be met to obtain a mortgage." },
    { q: "Does a co-borrower increase my mortgage borrowing capacity?", r: "Yes, adding a co-borrower (spouse, parent, etc.) significantly increases your borrowing capacity. The incomes of both borrowers are combined for the GDS and TDS ratio calculations, which can allow you to borrow 50% to 100% more depending on the co-borrower's income. However, the co-borrower's debts are also taken into account in the TDS ratio calculation. Both borrowers are jointly liable for the mortgage." },
    { q: "Is rental income taken into account when calculating borrowing capacity?", r: "Yes, rental income can increase your borrowing capacity when purchasing a plex (duplex, triplex, quadruplex). Canadian financial institutions generally use a compensation factor of 50% to 80% of expected gross rental income, added to your gross income for GDS and TDS ratio calculations. Some lenders use the cashflow method, others the added income method." },
    { q: "How much can I borrow for a mortgage in Quebec in 2026?", r: "Your borrowing capacity depends on your gross income, existing debts, interest rate and amortization period. As a general rule, with a gross income of $80,000 and few debts, you can borrow approximately $350,000 to $400,000 with 2026 rates. A couple with a combined income of $150,000 can borrow approximately $650,000 to $750,000. Our calculator gives you a precise estimate based on your situation." },
    { q: "What is the difference between pre-qualification and mortgage pre-approval?", r: "Pre-qualification is a quick estimate of your borrowing capacity based on the information you provide, like the calculation offered by our tool. Mortgage pre-approval is a conditional commitment from the lender after verifying your income, credit and assets. Pre-approval guarantees a rate for 90 to 120 days and strengthens your position when making a purchase offer. It is free and without obligation from most mortgage brokers in Quebec." },
  ],
  relatedTitle: "Related tools",
  relatedTools: [
    { href: "/calculatrice-hypothecaire", label: "Mortgage calculator", desc: "Estimate your monthly payment and CMHC premium." },
    { href: "/premier-acheteur", label: "First-time buyer guide", desc: "FHSA, HBP and assistance programs for your first purchase." },
    { href: "/frais-achat", label: "Buying costs", desc: "All costs to plan for: notary, inspection, taxes and more." },
  ],
  seeListings: "View listings",
  popularDiscussions: "Popular discussions",
  usefulResources: "Useful resources",
};

export const calcContent: Record<Locale, CalcContent> = { fr, en };
