export type QuartierData = {
  nom: string;
  ville: string;
  region: string;
  uniMedian: string;
  condoMedian: string;
  plexMedian: string;
  tendanceUni: string;
  tendanceCondo: string;
  tendancePlex: string;
  delaiVente: string;
  marcheType: string;
  prixPiedCarre: string;
  croissance5ans: string;
  description: string[];
  tags: string[];
  historiquePrix: { annee: string; valeur: number }[];
};

export const quartiersData: Record<string, QuartierData> = {
  "rosemont": {
    nom: "Rosemont-La Petite-Patrie",
    ville: "Montreal",
    region: "Ile de Montreal",
    uniMedian: "825 000 $",
    condoMedian: "425 000 $",
    plexMedian: "1 185 000 $",
    tendanceUni: "+5,9%",
    tendanceCondo: "+4,8%",
    tendancePlex: "+6,2%",
    delaiVente: "52 jours",
    marcheType: "vendeur",
    prixPiedCarre: "~580 $",
    croissance5ans: "+33%",
    description: [
      "Rosemont-La Petite-Patrie est l'un des arrondissements les plus prises de Montreal, reconnu pour son ambiance de village urbain, ses rues bordees d'arbres et son marche Jean-Talon. Le secteur attire autant les jeunes familles que les professionnels qui recherchent un cadre de vie agreable a proximite du centre-ville. Les proprietes de type plex et duplex y sont tres recherchees, ce qui maintient une forte pression sur les prix.",
      "L'arrondissement est bien desservi par le metro (ligne orange : Beaubien, Rosemont, Laurier) et par un reseau cyclable parmi les meilleurs de Montreal. La vie de quartier y est dynamique avec de nombreux commerces locaux, restaurants et parcs. Le parc Maisonneuve et le Jardin botanique sont a quelques minutes.",
      "Pour les investisseurs, Rosemont offre un excellent marche locatif avec un taux d'inoccupation tres bas. Les plex et duplex restent des placements solides avec des rendements stables. La croissance des prix sur 5 ans (+33%) confirme la solidite de ce marche.",
    ],
    tags: ["Plex et duplex", "Famille", "Velo-friendly", "Marche Jean-Talon", "Metro orange", "Locatif fort"],
    historiquePrix: [
      { annee: "2021", valeur: 620000 },
      { annee: "2022", valeur: 760000 },
      { annee: "2023", valeur: 740000 },
      { annee: "2024", valeur: 780000 },
      { annee: "2025", valeur: 779000 },
      { annee: "2026", valeur: 825000 },
    ],
  },

  "plateau-mont-royal": {
    nom: "Le Plateau-Mont-Royal",
    ville: "Montreal",
    region: "Ile de Montreal",
    uniMedian: "985 000 $",
    condoMedian: "495 000 $",
    plexMedian: "1 425 000 $",
    tendanceUni: "+4,2%",
    tendanceCondo: "+3,5%",
    tendancePlex: "+4,8%",
    delaiVente: "55 jours",
    marcheType: "equilibre",
    prixPiedCarre: "~650 $",
    croissance5ans: "+28%",
    description: [
      "Le Plateau-Mont-Royal est le quartier emblematique de Montreal, celebre pour ses triplex colores, ses terrasses animees et sa vie culturelle foisonnante. L'avenue du Mont-Royal, la rue Saint-Denis et le boulevard Saint-Laurent concentrent une offre commerciale et gastronomique parmi les plus riches de la ville. C'est un secteur ou la demande reste constante malgre des prix eleves.",
      "Le marche immobilier du Plateau est domine par les plex et les condos. Les unifamiliales y sont rares et se negocient a prix fort. Le marche est equilibre : les acheteurs ont un peu plus de marge de negociation que dans les quartiers en marche vendeur, mais les biens de qualite partent rapidement.",
      "Le quartier est particulierement recherche par les jeunes professionnels, les artistes et les couples sans enfants. L'acces au parc du Mont-Royal, la proximite du centre-ville et l'ambiance unique du Plateau en font un investissement sur pour le long terme.",
    ],
    tags: ["Triplex colores", "Vie culturelle", "Terrasses", "Parc Mont-Royal", "Metro orange", "Jeunes professionnels"],
    historiquePrix: [
      { annee: "2021", valeur: 770000 },
      { annee: "2022", valeur: 920000 },
      { annee: "2023", valeur: 905000 },
      { annee: "2024", valeur: 940000 },
      { annee: "2025", valeur: 945000 },
      { annee: "2026", valeur: 985000 },
    ],
  },

  "villeray": {
    nom: "Villeray-Saint-Michel-Parc-Extension",
    ville: "Montreal",
    region: "Ile de Montreal",
    uniMedian: "645 000 $",
    condoMedian: "345 000 $",
    plexMedian: "925 000 $",
    tendanceUni: "+7,3%",
    tendanceCondo: "+6,1%",
    tendancePlex: "+7,8%",
    delaiVente: "48 jours",
    marcheType: "vendeur",
    prixPiedCarre: "~470 $",
    croissance5ans: "+42%",
    description: [
      "Villeray est un quartier en pleine transformation qui attire de plus en plus de jeunes familles et de premiers acheteurs. Ses prix, encore accessibles par rapport au Plateau ou a Rosemont, en font l'un des secteurs les plus dynamiques de Montreal. La rue Jarry et la rue Villeray offrent une belle diversite de commerces de proximite.",
      "Le quartier beneficie d'un excellent acces au transport en commun avec le metro (ligne orange : Jarry, Cremazie, Parc) et de nombreuses lignes d'autobus. Le marche des plex y est particulierement actif, avec des duplex et triplex qui representent une part importante du parc immobilier.",
      "La croissance des prix sur 5 ans (+42%) est l'une des plus fortes de Montreal, ce qui reflete l'engouement des acheteurs pour ce secteur encore abordable. Le marche est clairement vendeur, avec des delais de vente rapides (48 jours).",
    ],
    tags: ["Abordable", "Premiers acheteurs", "Plex", "Metro orange", "En transformation", "Multiculturel"],
    historiquePrix: [
      { annee: "2021", valeur: 455000 },
      { annee: "2022", valeur: 565000 },
      { annee: "2023", valeur: 560000 },
      { annee: "2024", valeur: 595000 },
      { annee: "2025", valeur: 601000 },
      { annee: "2026", valeur: 645000 },
    ],
  },

  "hochelaga": {
    nom: "Hochelaga-Maisonneuve",
    ville: "Montreal",
    region: "Ile de Montreal",
    uniMedian: "565 000 $",
    condoMedian: "325 000 $",
    plexMedian: "825 000 $",
    tendanceUni: "+9,2%",
    tendanceCondo: "+7,5%",
    tendancePlex: "+9,8%",
    delaiVente: "50 jours",
    marcheType: "vendeur",
    prixPiedCarre: "~420 $",
    croissance5ans: "+51%",
    description: [
      "Hochelaga-Maisonneuve, souvent appele HoMa, est le quartier qui connait la plus forte hausse de prix a Montreal en 2026 (+9,2%). Longtemps considere comme un secteur populaire, HoMa se transforme rapidement avec l'arrivee de nouveaux commerces, de microbrasseries et de projets immobiliers. Le marche Maisonneuve et la Promenade Ontario sont au coeur de cette revitalisation.",
      "Le secteur reste l'un des plus abordables de l'ile de Montreal, ce qui attire les premiers acheteurs et les investisseurs en quete de rendement locatif. Les plex y sont nombreux et representent une excellente occasion d'investissement avec des prix encore sous la barre du million.",
      "La proximite du Stade olympique, du Biodome et du parc Maisonneuve ajoute a l'attrait du quartier. Le metro (ligne verte : Pie-IX, Viau, l'Assomption) offre un bon acces au centre-ville. Les acheteurs doivent agir rapidement car le marche est fortement vendeur.",
    ],
    tags: ["Plus forte hausse", "Abordable", "Investissement", "Plex", "Metro verte", "En revitalisation"],
    historiquePrix: [
      { annee: "2021", valeur: 375000 },
      { annee: "2022", valeur: 470000 },
      { annee: "2023", valeur: 465000 },
      { annee: "2024", valeur: 500000 },
      { annee: "2025", valeur: 518000 },
      { annee: "2026", valeur: 565000 },
    ],
  },

  "verdun": {
    nom: "Verdun",
    ville: "Montreal",
    region: "Ile de Montreal",
    uniMedian: "625 000 $",
    condoMedian: "365 000 $",
    plexMedian: "895 000 $",
    tendanceUni: "+7,8%",
    tendanceCondo: "+6,5%",
    tendancePlex: "+8,2%",
    delaiVente: "46 jours",
    marcheType: "vendeur",
    prixPiedCarre: "~490 $",
    croissance5ans: "+45%",
    description: [
      "Verdun est devenu l'un des quartiers les plus recherches de Montreal au cours des dernieres annees. La revitalisation de la rue Wellington, l'amenagement des berges du fleuve Saint-Laurent et l'arrivee du REM (station Du Canal) ont propulse la demande. Les jeunes familles et les professionnels y apprecient le rapport qualite-prix et la proximite du centre-ville.",
      "Le marche immobilier de Verdun est fortement vendeur avec des delais de vente parmi les plus courts de Montreal (46 jours). Les plex et duplex sont tres prises, et les nouveaux projets de condos attirent une clientele variee. La promenade des berges et la plage urbaine ajoutent a l'attrait du secteur.",
      "Pour les investisseurs, Verdun offre un potentiel locatif solide grace a la demande constante. La croissance de +45% sur 5 ans temoigne de la transformation du quartier, qui n'a pas encore atteint son plein potentiel selon les analystes du marche.",
    ],
    tags: ["Berges du fleuve", "REM", "Rue Wellington", "Famille", "Plex", "Fort potentiel"],
    historiquePrix: [
      { annee: "2021", valeur: 430000 },
      { annee: "2022", valeur: 540000 },
      { annee: "2023", valeur: 530000 },
      { annee: "2024", valeur: 565000 },
      { annee: "2025", valeur: 580000 },
      { annee: "2026", valeur: 625000 },
    ],
  },

  "mile-end": {
    nom: "Mile End",
    ville: "Montreal",
    region: "Ile de Montreal",
    uniMedian: "925 000 $",
    condoMedian: "475 000 $",
    plexMedian: "1 350 000 $",
    tendanceUni: "+5,1%",
    tendanceCondo: "+4,2%",
    tendancePlex: "+5,5%",
    delaiVente: "54 jours",
    marcheType: "equilibre",
    prixPiedCarre: "~620 $",
    croissance5ans: "+30%",
    description: [
      "Le Mile End est un micro-quartier mythique de Montreal, berceau de la scene musicale independante et du milieu technologique. Situe entre le Plateau et Outremont, il est connu pour ses studios d'artistes, ses cafes branchees et ses entreprises techno (Ubisoft, studios de jeux video). Le boulevard Saint-Laurent et l'avenue du Parc en sont les arteres principales.",
      "Le marche immobilier du Mile End est equilibre mais les prix restent eleves en raison de la forte demande. Les plex et les lofts reconvertis sont les types de proprietes les plus recherches. L'inventaire est limite, ce qui soutient les prix malgre un rythme de vente modere.",
      "Le quartier est ideal pour les acheteurs qui recherchent un style de vie urbain et creatif. La proximite du parc du Mont-Royal, du marche Jean-Talon et des universites (UdeM, McGill) en fait un emplacement de choix. La croissance de +30% sur 5 ans confirme la stabilite de ce marche premium.",
    ],
    tags: ["Creatif et techno", "Lofts", "Cafes", "Parc Mont-Royal", "Metro bleue", "Vie urbaine"],
    historiquePrix: [
      { annee: "2021", valeur: 710000 },
      { annee: "2022", valeur: 855000 },
      { annee: "2023", valeur: 845000 },
      { annee: "2024", valeur: 875000 },
      { annee: "2025", valeur: 880000 },
      { annee: "2026", valeur: 925000 },
    ],
  },
};
