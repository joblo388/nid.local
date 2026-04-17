import type { Locale } from "@/lib/i18n";

type TimelineStep = { titre: string; desc: string };
type ResourceLink = { title: string; desc: string };
type CalcStep = { title: string; text: string; example: string };

export type RentCalcContent = {
  breadcrumbLabel: string;
  h1: string;
  intro: string;
  howTitle: string;
  calcSteps: CalcStep[];
  tenantNoteTitle: string;
  tenantNoteText: string;
  refusalTitle: string;
  refusalSteps: TimelineStep[];
  resourceTAL: ResourceLink;
  resourceRCLALQ: ResourceLink;
  resourceForum: ResourceLink;
  disclaimerImportant: string;
  disclaimerText: string;
  ariaLabel: string;
};

const fr: RentCalcContent = {
  breadcrumbLabel: "Augmentation de loyer",
  h1: "Calculateur d'augmentation de loyer Quebec",
  intro: "Estimez l'augmentation de loyer permise selon la methode officielle du Tribunal administratif du logement (TAL) pour 2026. Entrez vos depenses reelles pour obtenir un calcul personnalise.",
  howTitle: "Comment fonctionne le calcul",
  calcSteps: [
    {
      title: "Ajustement de base (IPC)",
      text: "Le taux de base de 3,1% est applique directement au loyer mensuel actuel. Ce taux correspond a l'indice des prix a la consommation (IPC) retenu par le TAL pour 2026.",
      example: "Exemple : pour un loyer de 1 200 $, l'ajustement de base est de 1 200 $ x 3,1% = 37,20 $/mois.",
    },
    {
      title: "Taxes et assurances",
      text: "Seule la portion de la hausse qui depasse le taux IPC de 3,1% est prise en compte. La hausse retenue est ensuite repartie au prorata du loyer par rapport au total des loyers de l'immeuble, puis divisee par 12 pour obtenir le montant mensuel.",
      example: "Exemple : taxes passant de 4 200 $ a 4 500 $. Hausse = 300 $. Base exclue = 4 200 $ x 3,1% = 130,20 $. Retenu = 300 $ - 130,20 $ = 169,80 $.",
    },
    {
      title: "Reparations et ameliorations majeures",
      text: "Le cout net des travaux (montant moins les aides recues) est amorti a 5% par annee, soit sur 20 ans. Si plusieurs logements sont concernes, un prorata est applique selon le poids du loyer dans l'ensemble des logements touches.",
      example: "Exemple : travaux de 15 000 $ sans aide, 1 logement concerne. Ajustement = 15 000 $ x 5% / 12 = 62,50 $/mois.",
    },
    {
      title: "Nouveaux services ou accessoires",
      text: "Contrairement aux renovations, les nouveaux services ne sont pas amortis. Le cout annuel net est directement reparti entre les logements concernes et divise par 12 pour obtenir l'ajustement mensuel.",
      example: "Exemple : ajout d'un stationnement a 600 $/an, 1 logement. Ajustement = 600 $ / 12 = 50,00 $/mois.",
    },
  ],
  tenantNoteTitle: "Note pour les locataires",
  tenantNoteText: "Ce calculateur reproduit la methode du TAL, mais ne remplace pas une fixation officielle. Si l'augmentation proposee par votre proprietaire vous semble excessive, vous avez le droit de la refuser par ecrit dans le delai prevu et de demander au TAL de fixer le loyer.",
  refusalTitle: "Vous voulez refuser l'augmentation",
  refusalSteps: [
    {
      titre: "Reception de l'avis d'augmentation",
      desc: "Le proprietaire doit envoyer un avis ecrit au moins 3 mois avant la fin du bail (6 mois si le bail depasse 6 ans ou pour un logement dans un immeuble de 5 logements et plus). L'avis doit indiquer le nouveau loyer propose.",
    },
    {
      titre: "Reponse du locataire (1 mois)",
      desc: "Vous disposez d'un mois apres reception de l'avis pour refuser par ecrit. Envoyez votre refus par courrier recommande ou remettez-le en main propre avec accuse de reception.",
    },
    {
      titre: "Demande du proprietaire au TAL (1 mois)",
      desc: "Le proprietaire a un mois apres votre refus pour deposer une demande de fixation de loyer au TAL. S'il ne le fait pas dans ce delai, le loyer reste inchange pour la prochaine annee.",
    },
    {
      titre: "Audience au TAL",
      desc: "Le TAL convoque les deux parties a une audience. Il examine les depenses reelles du proprietaire, les revenus de l'immeuble et les indices annuels. Le tribunal rend ensuite sa decision, qui est contraignante.",
    },
  ],
  resourceTAL: {
    title: "Tribunal administratif du logement",
    desc: "Site officiel du TAL. Formulaires, outils de calcul et informations sur vos droits.",
  },
  resourceRCLALQ: {
    title: "RCLALQ",
    desc: "Regroupement des comites logement et associations de locataires du Quebec. Aide et accompagnement.",
  },
  resourceForum: {
    title: "Forum nid.local",
    desc: "Discutez avec d'autres locataires et proprietaires. Partagez vos experiences et posez vos questions.",
  },
  disclaimerImportant: "Important :",
  disclaimerText: "cet outil est fourni a titre informatif et ne constitue pas un avis juridique. Les resultats sont bases sur la methode de calcul du TAL, mais ne remplacent pas une fixation officielle. Consultez le TAL ou un conseiller juridique pour toute situation particuliere.",
  ariaLabel: "Fil d'Ariane",
};

const en: RentCalcContent = {
  breadcrumbLabel: "Rent increase",
  h1: "Quebec Rent Increase Calculator",
  intro: "Estimate the allowable rent increase according to the official method of the Tribunal administratif du logement (TAL) for 2026. Enter your actual expenses to get a personalized calculation.",
  howTitle: "How the calculation works",
  calcSteps: [
    {
      title: "Base adjustment (CPI)",
      text: "The base rate of 3.1% is applied directly to the current monthly rent. This rate corresponds to the Consumer Price Index (CPI) used by the TAL for 2026.",
      example: "Example: for a rent of $1,200, the base adjustment is $1,200 x 3.1% = $37.20/month.",
    },
    {
      title: "Taxes and insurance",
      text: "Only the portion of the increase that exceeds the 3.1% CPI rate is taken into account. The retained increase is then prorated based on the rent relative to the total rents of the building, then divided by 12 to get the monthly amount.",
      example: "Example: taxes going from $4,200 to $4,500. Increase = $300. Base excluded = $4,200 x 3.1% = $130.20. Retained = $300 - $130.20 = $169.80.",
    },
    {
      title: "Major repairs and improvements",
      text: "The net cost of the work (amount minus subsidies received) is amortized at 5% per year, i.e. over 20 years. If multiple units are affected, a proration is applied based on the weight of the rent relative to all affected units.",
      example: "Example: $15,000 in work with no subsidy, 1 unit affected. Adjustment = $15,000 x 5% / 12 = $62.50/month.",
    },
    {
      title: "New services or accessories",
      text: "Unlike renovations, new services are not amortized. The net annual cost is directly split among the affected units and divided by 12 to get the monthly adjustment.",
      example: "Example: adding a parking spot at $600/year, 1 unit. Adjustment = $600 / 12 = $50.00/month.",
    },
  ],
  tenantNoteTitle: "Note for tenants",
  tenantNoteText: "This calculator reproduces the TAL method but does not replace an official rent fixing. If the increase proposed by your landlord seems excessive, you have the right to refuse it in writing within the required period and to ask the TAL to fix the rent.",
  refusalTitle: "You want to refuse the increase",
  refusalSteps: [
    {
      titre: "Receiving the increase notice",
      desc: "The landlord must send a written notice at least 3 months before the end of the lease (6 months if the lease exceeds 6 years or for a unit in a building with 5 or more units). The notice must indicate the proposed new rent.",
    },
    {
      titre: "Tenant's response (1 month)",
      desc: "You have one month after receiving the notice to refuse in writing. Send your refusal by registered mail or hand-deliver it with an acknowledgment of receipt.",
    },
    {
      titre: "Landlord's application to the TAL (1 month)",
      desc: "The landlord has one month after your refusal to file a rent-fixing application with the TAL. If they do not do so within this period, the rent remains unchanged for the next year.",
    },
    {
      titre: "Hearing at the TAL",
      desc: "The TAL summons both parties to a hearing. It examines the landlord's actual expenses, the building's revenues, and the annual indices. The tribunal then renders its decision, which is binding.",
    },
  ],
  resourceTAL: {
    title: "Tribunal administratif du logement",
    desc: "Official TAL website. Forms, calculation tools, and information on your rights.",
  },
  resourceRCLALQ: {
    title: "RCLALQ",
    desc: "Coalition of housing committees and tenant associations of Quebec. Help and support.",
  },
  resourceForum: {
    title: "nid.local Forum",
    desc: "Discuss with other tenants and landlords. Share your experiences and ask your questions.",
  },
  disclaimerImportant: "Important:",
  disclaimerText: "this tool is provided for informational purposes only and does not constitute legal advice. Results are based on the TAL calculation method but do not replace an official rent fixing. Consult the TAL or a legal advisor for any specific situation.",
  ariaLabel: "Breadcrumb",
};

export const calcContent: Record<Locale, RentCalcContent> = { fr, en };
