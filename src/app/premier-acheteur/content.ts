import type { Locale } from "@/lib/i18n";

type InfoCard = { titre: string; texte: string; couleur: string; textColor: string };
type Step = { n: string; titre: string; texte: string };
type FAQ = { q: string; r: string };
type OutilCard = {
  href: string;
  titre: string;
  description: string;
  icon: string;
};

export type PremierAcheteurContent = {
  breadcrumb: string;
  h1: string;
  intro: string;

  celiappTitle: string;
  celiappIntro: string;
  celiappCards: InfoCard[];

  ctaCeliapp: string;
  ctaCeliappBtn: string;

  rapTitle: string;
  rapIntro: string;
  rapCards: InfoCard[];

  ctaRap: string;
  ctaRapBtn: string;

  autresProgrammesTitle: string;
  autresProgrammesCards: InfoCard[];
  autresProgrammesDisclaimer: string;

  etapesTitle: string;
  etapesIntro: string;
  etapes: Step[];

  capaciteTitle: string;
  capaciteIntro: string;
  outilsCards: OutilCard[];

  simulateurTitle: string;

  faqTitle: string;
  faqItems: FAQ[];

  forumTitle: string;
  forumVotesReplies: (votes: number, replies: number) => string;
  forumAllDiscussions: string;

  ctaCommunityTitre: string;
  ctaCommunityDescription: string;

  sidebarSeeDiscussions: string;
  sidebarPopulaires: string;
  sidebarAllDiscussions: string;
  sidebarRessources: string;
  sidebarAboutTitle: string;
  sidebarAboutText1: string;
  sidebarAboutText2Strong1: string;
  sidebarAboutText2Strong2: string;
  sidebarAboutText2Before: string;
  sidebarAboutText2Between: string;
  sidebarAboutText2After: string;
  sidebarCopyright: string;
};

const fr: PremierAcheteurContent = {
  breadcrumb: "Premier acheteur",
  h1: "Premier acheteur au Quebec | Guide complet 2026",
  intro:
    "Acheter sa premiere maison au Quebec est un projet excitant, mais aussi complexe. En 2026, le prix median d'une unifamiliale au Quebec est de 536 000 $. Entre le CELIAPP, le RAP, les credits d'impot et les programmes municipaux, il existe plusieurs leviers pour reduire le cout de votre premier achat. Voici tous les programmes et etapes pour realiser votre projet.",

  celiappTitle: "Le CELIAPP | Compte d'epargne libre d'impot pour l'achat d'une premiere propriete",
  celiappIntro:
    "Le CELIAPP est l'outil d'epargne le plus avantageux pour les premiers acheteurs au Canada. Il combine les avantages du REER (deduction a la cotisation) et du CELI (retrait non imposable), specifiquement pour l'achat d'une premiere habitation admissible.",
  celiappCards: [
    {
      titre: "Cotisation maximale",
      texte: "Jusqu'a 8 000 $ par annee, pour un maximum a vie de 40 000 $. Les droits de cotisation inutilises peuvent etre reportes a l'annee suivante (jusqu'a 8 000 $ de report).",
      couleur: "var(--blue-bg)",
      textColor: "var(--blue-text)",
    },
    {
      titre: "Avantage fiscal double",
      texte: "Les cotisations sont deductibles de votre revenu imposable (comme un REER), et les retraits pour l'achat de votre premiere propriete sont entierement non imposables (comme un CELI).",
      couleur: "var(--green-light-bg)",
      textColor: "var(--green-text)",
    },
    {
      titre: "Admissibilite",
      texte: "Vous devez etre un resident canadien d'au moins 18 ans et ne pas avoir ete proprietaire d'une habitation admissible au cours des quatre dernieres annees civiles (ni au cours de l'annee d'ouverture).",
      couleur: "var(--amber-bg)",
      textColor: "var(--amber-text)",
    },
    {
      titre: "Combinaison avec le RAP",
      texte: "Le CELIAPP peut etre utilise en meme temps que le RAP pour le meme achat. Cela permet de combiner jusqu'a 40 000 $ (CELIAPP) + 60 000 $ (RAP) = 100 000 $ par personne pour votre mise de fonds.",
      couleur: "var(--red-bg)",
      textColor: "var(--red-text)",
    },
  ],

  ctaCeliapp: "Calculez votre capacite d'emprunt avec le CELIAPP",
  ctaCeliappBtn: "Calculer ma capacite",

  rapTitle: "Le RAP | Regime d'accession a la propriete",
  rapIntro:
    "Le RAP permet de retirer des fonds de votre REER sans payer d'impot pour acheter ou construire une habitation admissible. Depuis avril 2024, le plafond de retrait a ete augmente de maniere significative.",
  rapCards: [
    {
      titre: "Plafond de retrait",
      texte: "Maximum de 60 000 $ par personne depuis avril 2024 (anciennement 35 000 $). En couple, cela represente jusqu'a 120 000 $ de retrait REER sans impot pour votre premier achat.",
      couleur: "var(--blue-bg)",
      textColor: "var(--blue-text)",
    },
    {
      titre: "Retrait sans impot",
      texte: "Les montants retires dans le cadre du RAP ne sont pas ajoutes a votre revenu imposable l'annee du retrait. Vous devez cependant rembourser le montant dans votre REER sur une periode de 15 ans.",
      couleur: "var(--green-light-bg)",
      textColor: "var(--green-text)",
    },
    {
      titre: "Remboursement",
      texte: "Le remboursement commence a la 5e annee suivant le retrait (anciennement la 2e annee). Vous devez rembourser au moins 1/15 du montant retire chaque annee, sinon cette portion est ajoutee a votre revenu imposable.",
      couleur: "var(--amber-bg)",
      textColor: "var(--amber-text)",
    },
    {
      titre: "Conditions d'admissibilite",
      texte: "Vous devez etre considere comme un acheteur d'une premiere habitation (pas proprietaire dans les 4 dernieres annees). Les fonds doivent etre dans le REER depuis au moins 90 jours avant le retrait. L'habitation doit etre votre residence principale.",
      couleur: "var(--red-bg)",
      textColor: "var(--red-text)",
    },
  ],

  ctaRap: "Combien vaut votre propriete actuelle?",
  ctaRapBtn: "Estimer la valeur",

  autresProgrammesTitle: "Autres programmes d'aide pour premiers acheteurs",
  autresProgrammesCards: [
    {
      titre: "Credit d'impot pour achat d'une habitation (federal)",
      texte: "Un credit d'impot non remboursable de 10 000 $, soit une reduction d'impot d'environ 1 500 $. Il est offert automatiquement aux acheteurs d'une premiere habitation admissible lors de la declaration de revenus federale.",
      couleur: "var(--blue-bg)",
      textColor: "var(--blue-text)",
    },
    {
      titre: "Remise TPS/TVQ sur habitations neuves",
      texte: "Si vous achetez une propriete neuve ou substantiellement renovee, vous pouvez obtenir un remboursement partiel de la TPS (jusqu'a 36 % de la TPS payee, pour les proprietes de moins de 450 000 $) et de la TVQ (remboursement similaire au Quebec).",
      couleur: "var(--green-light-bg)",
      textColor: "var(--green-text)",
    },
    {
      titre: "Programmes municipaux",
      texte: "Plusieurs municipalites offrent des incitatifs aux premiers acheteurs. Par exemple, le programme Acces Condos a Montreal offre des conditions avantageuses sur certains projets neufs. Verifiez aupres de votre ville pour connaitre les programmes disponibles.",
      couleur: "var(--amber-bg)",
      textColor: "var(--amber-text)",
    },
    {
      titre: "Remboursement de la taxe de bienvenue",
      texte: "Certaines villes du Quebec offrent un remboursement partiel ou total de la taxe de bienvenue (droits de mutation) aux premiers acheteurs. Les conditions et montants maximaux varient d'une municipalite a l'autre.",
      couleur: "var(--red-bg)",
      textColor: "var(--red-text)",
    },
  ],
  autresProgrammesDisclaimer:
    "Les programmes et montants mentionnes sont a titre informatif et peuvent changer. Verifiez les conditions d'admissibilite aupres des organismes concernes.",

  etapesTitle: "Les etapes pour acheter votre premiere maison",
  etapesIntro:
    "Le processus d'achat d'une premiere propriete au Quebec suit generalement ces six grandes etapes. Bien les comprendre vous evitera des surprises et vous permettra de negocier avec confiance.",
  etapes: [
    {
      n: "1",
      titre: "Evaluer votre budget",
      texte: "Faites le bilan de vos revenus, dettes et epargnes. Calculez votre mise de fonds disponible (CELIAPP + RAP + economies). Utilisez notre calculatrice de capacite d'emprunt pour connaitre votre budget maximal.",
    },
    {
      n: "2",
      titre: "Obtenir une pre-approbation hypothecaire",
      texte: "Consultez un courtier hypothecaire ou votre institution financiere pour obtenir une pre-approbation. Cela confirme votre budget et vous donne un avantage lors des negociations avec les vendeurs.",
    },
    {
      n: "3",
      titre: "Chercher votre propriete",
      texte: "Explorez les quartiers qui vous interessent, visitez des proprietes et comparez les prix du marche. Faites appel a un courtier immobilier pour vous accompagner dans vos recherches.",
    },
    {
      n: "4",
      titre: "Faire une offre d'achat",
      texte: "Redigez une promesse d'achat avec l'aide de votre courtier. Incluez les conditions essentielles : inspection preachat, financement et verification des titres. Negociez le prix et les delais.",
    },
    {
      n: "5",
      titre: "Faire inspecter la propriete",
      texte: "L'inspection preachat est cruciale pour un premier acheteur. Un inspecteur certifie verifiera la structure, la toiture, la plomberie, l'electricite et les fondations. Budget : 500 $ a 800 $.",
    },
    {
      n: "6",
      titre: "Passer chez le notaire",
      texte: "Le notaire finalise la transaction : examen des titres, preparation de l'acte de vente et de l'hypotheque, ajustements de taxes. Prevoyez 1 500 $ a 3 000 $ pour les frais de notaire.",
    },
  ],

  capaciteTitle: "Calculez votre capacite d'achat",
  capaciteIntro: "Utilisez nos outils gratuits pour planifier votre premier achat en toute confiance.",
  outilsCards: [
    {
      href: "/calculatrice-hypothecaire",
      titre: "Calculatrice hypothecaire",
      description: "Estimez votre paiement mensuel selon les taux du marche et calculez la prime SCHL.",
      icon: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z",
    },
    {
      href: "/capacite-emprunt",
      titre: "Capacite d'emprunt",
      description: "Decouvrez combien vous pouvez emprunter selon votre revenu et vos dettes actuelles.",
      icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    },
    {
      href: "/taxe-bienvenue",
      titre: "Taxe de bienvenue",
      description: "Calculez les droits de mutation immobiliere selon votre ville et le prix d'achat.",
      icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
    },
    {
      href: "/estimation",
      titre: "Estimation de valeur",
      description: "Obtenez une estimation de la valeur marchande d'une propriete dans votre quartier.",
      icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    },
  ],

  simulateurTitle: "Simulateur RAP + CELIAPP + epargne",

  faqTitle: "Questions frequentes | Premier achat au Quebec",
  faqItems: [
    {
      q: "Qu'est-ce que le CELIAPP et combien puis-je y mettre?",
      r: "Le CELIAPP (Compte d'epargne libre d'impot pour l'achat d'une premiere propriete) permet de cotiser jusqu'a 8 000 $ par annee, pour un maximum a vie de 40 000 $. Les cotisations sont deductibles d'impot (comme un REER) et les retraits pour l'achat d'une premiere propriete admissible sont non imposables. Il faut ne pas avoir ete proprietaire d'une habitation au cours des quatre dernieres annees civiles pour etre admissible.",
    },
    {
      q: "Puis-je utiliser le RAP et le CELIAPP en meme temps?",
      r: "Oui, il est possible de combiner le RAP et le CELIAPP pour le meme achat. Vous pouvez retirer jusqu'a 60 000 $ de votre REER via le RAP et jusqu'a 40 000 $ de votre CELIAPP, pour un total potentiel de 100 000 $ par personne. En couple, cela peut atteindre 200 000 $. C'est une strategie puissante pour maximiser votre mise de fonds.",
    },
    {
      q: "Quelle est la mise de fonds minimale pour un premier achat?",
      r: "La mise de fonds minimale est de 5 % pour les proprietes jusqu'a 500 000 $. Pour les proprietes entre 500 000 $ et 999 999 $, c'est 5 % sur les premiers 500 000 $ et 10 % sur le reste. Pour les proprietes de 1 000 000 $ et plus, la mise de fonds minimale est de 20 %. Avec moins de 20 %, l'assurance hypothecaire SCHL est obligatoire.",
    },
    {
      q: "Combien faut-il gagner pour acheter une maison a Montreal?",
      r: "En 2026, avec un prix median d'environ 575 000 $ pour une propriete a Montreal, un menage doit gagner approximativement 110 000 $ a 130 000 $ de revenu brut annuel pour se qualifier avec 5 % de mise de fonds, selon le test de resistance hypothecaire. Ce montant varie selon vos dettes existantes, le taux d'interet et la periode d'amortissement choisie.",
    },
    {
      q: "Quels sont les frais caches lors de l'achat d'une premiere maison?",
      r: "Au-dela du prix d'achat et de la mise de fonds, prevoyez : les frais de notaire (1 500 $ a 3 000 $), la taxe de bienvenue (droits de mutation, variable selon le prix), l'inspection preachat (500 $ a 800 $), l'assurance habitation, les ajustements de taxes municipales et scolaires, les frais de demenagement et les renovations immediates. Prevoyez un coussin de 3 % a 5 % du prix d'achat pour ces frais.",
    },
    {
      q: "Est-ce le bon moment pour acheter en 2026?",
      r: "La decision d'acheter depend de votre situation personnelle plus que du marche. En 2026, les taux d'interet se sont stabilises par rapport aux hausses de 2022-2023, et le marche quebecois reste resilient. Si vous avez une mise de fonds suffisante, un emploi stable et prevoyez rester au moins 5 ans, l'achat peut etre avantageux. Utilisez notre calculatrice \"Acheter ou louer\" pour comparer les scenarios.",
    },
  ],

  forumTitle: "Discussions de premiers acheteurs",
  forumVotesReplies: (votes: number, replies: number) =>
    `${votes} votes, ${replies} reponses`,
  forumAllDiscussions: "Voir toutes les discussions",

  ctaCommunityTitre: "Vous planifiez votre premier achat? La communaute peut vous aider!",
  ctaCommunityDescription:
    "Des centaines de premiers acheteurs partagent leur experience sur nid.local. Questions sur le RAP, le CELIAPP, les surprises a l'inspection? Posez votre question et profitez de l'entraide.",

  sidebarSeeDiscussions: "Voir les discussions",
  sidebarPopulaires: "Discussions populaires",
  sidebarAllDiscussions: "Toutes les discussions",
  sidebarRessources: "Ressources utiles",
  sidebarAboutTitle: "A propos de ce guide",
  sidebarAboutText1:
    "Les informations sur le CELIAPP, le RAP et les programmes d'aide sont basees sur les regles en vigueur en 2026. Les montants et conditions peuvent changer.",
  sidebarAboutText2Before: "Pour des conseils personnalises, consultez un ",
  sidebarAboutText2Strong1: "planificateur financier",
  sidebarAboutText2Between: " ou un ",
  sidebarAboutText2Strong2: "courtier hypothecaire",
  sidebarAboutText2After: ".",
  sidebarCopyright: "\u00a9 2026 nid.local | Fait au Quebec",
};

const en: PremierAcheteurContent = {
  breadcrumb: "First-time buyer",
  h1: "First-time home buyer in Quebec | Complete guide 2026",
  intro:
    "Buying your first home in Quebec is an exciting but complex project. In 2026, the median price for a single-family home in Quebec is $536,000. Between the FHSA, the HBP, tax credits and municipal programs, there are several ways to reduce the cost of your first purchase. Here are all the programs and steps to make your project a reality.",

  celiappTitle: "The FHSA | First Home Savings Account",
  celiappIntro:
    "The FHSA is the most advantageous savings tool for first-time buyers in Canada. It combines the benefits of an RRSP (deduction on contribution) and a TFSA (tax-free withdrawal), specifically for the purchase of a qualifying first home.",
  celiappCards: [
    {
      titre: "Maximum contribution",
      texte: "Up to $8,000 per year, for a lifetime maximum of $40,000. Unused contribution room can be carried forward to the following year (up to $8,000 carry-forward).",
      couleur: "var(--blue-bg)",
      textColor: "var(--blue-text)",
    },
    {
      titre: "Double tax advantage",
      texte: "Contributions are deductible from your taxable income (like an RRSP), and withdrawals for the purchase of your first property are entirely tax-free (like a TFSA).",
      couleur: "var(--green-light-bg)",
      textColor: "var(--green-text)",
    },
    {
      titre: "Eligibility",
      texte: "You must be a Canadian resident at least 18 years old and not have owned a qualifying home in the last four calendar years (or in the year the account was opened).",
      couleur: "var(--amber-bg)",
      textColor: "var(--amber-text)",
    },
    {
      titre: "Combination with the HBP",
      texte: "The FHSA can be used at the same time as the HBP for the same purchase. This allows combining up to $40,000 (FHSA) + $60,000 (HBP) = $100,000 per person for your down payment.",
      couleur: "var(--red-bg)",
      textColor: "var(--red-text)",
    },
  ],

  ctaCeliapp: "Calculate your borrowing capacity with the FHSA",
  ctaCeliappBtn: "Calculate my capacity",

  rapTitle: "The HBP | Home Buyers' Plan",
  rapIntro:
    "The HBP allows you to withdraw funds from your RRSP tax-free to buy or build a qualifying home. Since April 2024, the withdrawal limit has been significantly increased.",
  rapCards: [
    {
      titre: "Withdrawal limit",
      texte: "Maximum of $60,000 per person since April 2024 (previously $35,000). As a couple, this represents up to $120,000 in tax-free RRSP withdrawals for your first purchase.",
      couleur: "var(--blue-bg)",
      textColor: "var(--blue-text)",
    },
    {
      titre: "Tax-free withdrawal",
      texte: "Amounts withdrawn under the HBP are not added to your taxable income in the year of withdrawal. However, you must repay the amount to your RRSP over a 15-year period.",
      couleur: "var(--green-light-bg)",
      textColor: "var(--green-text)",
    },
    {
      titre: "Repayment",
      texte: "Repayment begins in the 5th year following the withdrawal (previously the 2nd year). You must repay at least 1/15 of the withdrawn amount each year, otherwise that portion is added to your taxable income.",
      couleur: "var(--amber-bg)",
      textColor: "var(--amber-text)",
    },
    {
      titre: "Eligibility conditions",
      texte: "You must be considered a first-time home buyer (not an owner in the last 4 years). Funds must have been in your RRSP for at least 90 days before withdrawal. The home must be your principal residence.",
      couleur: "var(--red-bg)",
      textColor: "var(--red-text)",
    },
  ],

  ctaRap: "How much is your current property worth?",
  ctaRapBtn: "Estimate the value",

  autresProgrammesTitle: "Other assistance programs for first-time buyers",
  autresProgrammesCards: [
    {
      titre: "Home Buyers' Tax Credit (federal)",
      texte: "A non-refundable tax credit of $10,000, representing a tax reduction of approximately $1,500. It is automatically available to buyers of a first qualifying home when filing the federal tax return.",
      couleur: "var(--blue-bg)",
      textColor: "var(--blue-text)",
    },
    {
      titre: "GST/QST rebate on new homes",
      texte: "If you buy a new or substantially renovated property, you can get a partial rebate of the GST (up to 36% of GST paid, for properties under $450,000) and the QST (similar rebate in Quebec).",
      couleur: "var(--green-light-bg)",
      textColor: "var(--green-text)",
    },
    {
      titre: "Municipal programs",
      texte: "Several municipalities offer incentives to first-time buyers. For example, the Acces Condos program in Montreal offers advantageous conditions on certain new projects. Check with your city for available programs.",
      couleur: "var(--amber-bg)",
      textColor: "var(--amber-text)",
    },
    {
      titre: "Welcome tax refund",
      texte: "Some Quebec cities offer a partial or full refund of the welcome tax (transfer duties) to first-time buyers. Conditions and maximum amounts vary from one municipality to another.",
      couleur: "var(--red-bg)",
      textColor: "var(--red-text)",
    },
  ],
  autresProgrammesDisclaimer:
    "The programs and amounts mentioned are for informational purposes only and may change. Verify eligibility conditions with the relevant organizations.",

  etapesTitle: "Steps to buying your first home",
  etapesIntro:
    "The process of buying a first property in Quebec generally follows these six main steps. Understanding them well will help you avoid surprises and negotiate with confidence.",
  etapes: [
    {
      n: "1",
      titre: "Assess your budget",
      texte: "Take stock of your income, debts and savings. Calculate your available down payment (FHSA + HBP + savings). Use our borrowing capacity calculator to determine your maximum budget.",
    },
    {
      n: "2",
      titre: "Get a mortgage pre-approval",
      texte: "Consult a mortgage broker or your financial institution to get a pre-approval. This confirms your budget and gives you an advantage when negotiating with sellers.",
    },
    {
      n: "3",
      titre: "Search for your property",
      texte: "Explore neighbourhoods that interest you, visit properties and compare market prices. Work with a real estate broker to help you in your search.",
    },
    {
      n: "4",
      titre: "Make an offer to purchase",
      texte: "Draft a purchase offer with the help of your broker. Include essential conditions: pre-purchase inspection, financing and title verification. Negotiate the price and deadlines.",
    },
    {
      n: "5",
      titre: "Have the property inspected",
      texte: "A pre-purchase inspection is crucial for a first-time buyer. A certified inspector will check the structure, roof, plumbing, electrical and foundation. Budget: $500 to $800.",
    },
    {
      n: "6",
      titre: "Visit the notary",
      texte: "The notary finalizes the transaction: title examination, preparation of the deed of sale and mortgage, tax adjustments. Budget $1,500 to $3,000 for notary fees.",
    },
  ],

  capaciteTitle: "Calculate your purchasing capacity",
  capaciteIntro: "Use our free tools to plan your first purchase with confidence.",
  outilsCards: [
    {
      href: "/calculatrice-hypothecaire",
      titre: "Mortgage calculator",
      description: "Estimate your monthly payment based on market rates and calculate the CMHC premium.",
      icon: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z",
    },
    {
      href: "/capacite-emprunt",
      titre: "Borrowing capacity",
      description: "Find out how much you can borrow based on your income and current debts.",
      icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    },
    {
      href: "/taxe-bienvenue",
      titre: "Welcome tax",
      description: "Calculate the transfer duties based on your city and purchase price.",
      icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
    },
    {
      href: "/estimation",
      titre: "Property valuation",
      description: "Get an estimate of the market value of a property in your neighbourhood.",
      icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    },
  ],

  simulateurTitle: "HBP + FHSA + savings simulator",

  faqTitle: "Frequently asked questions | First-time buying in Quebec",
  faqItems: [
    {
      q: "What is the FHSA and how much can I contribute?",
      r: "The FHSA (First Home Savings Account) allows you to contribute up to $8,000 per year, for a lifetime maximum of $40,000. Contributions are tax-deductible (like an RRSP) and withdrawals for the purchase of a qualifying first home are tax-free. You must not have owned a home in the last four calendar years to be eligible.",
    },
    {
      q: "Can I use the HBP and the FHSA at the same time?",
      r: "Yes, it is possible to combine the HBP and the FHSA for the same purchase. You can withdraw up to $60,000 from your RRSP via the HBP and up to $40,000 from your FHSA, for a potential total of $100,000 per person. As a couple, this can reach $200,000. It is a powerful strategy to maximize your down payment.",
    },
    {
      q: "What is the minimum down payment for a first purchase?",
      r: "The minimum down payment is 5% for properties up to $500,000. For properties between $500,000 and $999,999, it is 5% on the first $500,000 and 10% on the remainder. For properties of $1,000,000 and above, the minimum down payment is 20%. With less than 20%, CMHC mortgage insurance is required.",
    },
    {
      q: "How much do you need to earn to buy a house in Montreal?",
      r: "In 2026, with a median price of approximately $575,000 for a property in Montreal, a household must earn approximately $110,000 to $130,000 in gross annual income to qualify with 5% down, according to the mortgage stress test. This amount varies depending on your existing debts, interest rate and chosen amortization period.",
    },
    {
      q: "What are the hidden costs when buying a first home?",
      r: "Beyond the purchase price and down payment, plan for: notary fees ($1,500 to $3,000), the welcome tax (transfer duties, variable by price), the pre-purchase inspection ($500 to $800), home insurance, municipal and school tax adjustments, moving costs and immediate renovations. Plan a cushion of 3% to 5% of the purchase price for these costs.",
    },
    {
      q: "Is it a good time to buy in 2026?",
      r: "The decision to buy depends more on your personal situation than on the market. In 2026, interest rates have stabilized compared to the 2022-2023 increases, and the Quebec market remains resilient. If you have a sufficient down payment, stable employment and plan to stay at least 5 years, buying can be advantageous. Use our \"Buy or rent\" calculator to compare scenarios.",
    },
  ],

  forumTitle: "First-time buyer discussions",
  forumVotesReplies: (votes: number, replies: number) =>
    `${votes} votes, ${replies} replies`,
  forumAllDiscussions: "View all discussions",

  ctaCommunityTitre: "Planning your first purchase? The community can help!",
  ctaCommunityDescription:
    "Hundreds of first-time buyers share their experience on nid.local. Questions about the HBP, the FHSA, inspection surprises? Ask your question and benefit from the community.",

  sidebarSeeDiscussions: "View discussions",
  sidebarPopulaires: "Popular discussions",
  sidebarAllDiscussions: "All discussions",
  sidebarRessources: "Useful resources",
  sidebarAboutTitle: "About this guide",
  sidebarAboutText1:
    "Information about the FHSA, the HBP and assistance programs is based on the rules in effect in 2026. Amounts and conditions may change.",
  sidebarAboutText2Before: "For personalized advice, consult a ",
  sidebarAboutText2Strong1: "financial planner",
  sidebarAboutText2Between: " or a ",
  sidebarAboutText2Strong2: "mortgage broker",
  sidebarAboutText2After: ".",
  sidebarCopyright: "\u00a9 2026 nid.local | Made in Quebec",
};

export const pageContent: Record<Locale, PremierAcheteurContent> = { fr, en };
